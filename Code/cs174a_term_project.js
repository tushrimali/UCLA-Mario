// cs174a_term_project.js

var fov = 0.0;
var z_zoom = -0.5;


// lighting
var lightPosition = vec3(0.0, 0.0, 0.0);
var UNIFORM_lightPosition;
var UNIFORM_shininess;


// physics
var jump = false;
var falling = false,
    flow_left = false,
    flow_right = false;
var keysPressed = [];


// player initial position
var player_x = -3.5,
    player_y = -1.625,
    player_z = -3.85;
var bearWidth = 0.75,
    bearHeight = 0.75;
var bearOnTop = false;
var bearOnTopAltitude = 0.0;

var steppedOn = -1,
    objectNum = 0;

var blockedRight = false,
    blockedLeft = false,
    inAir = false;
var blockedRightBy = -1,
    blockedLeftBy = -1;


var canvas;
var gl;
var length = 0.5;
var time = 0.0;
var timer = new Timer();
var timer_disp = new Timer();
var time_displaced = 0.0;
var omega = 100;
var pauseRotation = false;

// matrix for shaders
var UNIFORM_mvMatrix;
var ATTRIBUTE_position;
var ATTRIBUTE_normal;
var projectionMatrix;
var UNIFORM_pMatrix;

var positionBuffer;
var normalBuffer;

// textures
var myTextureBear;
var myTextureBearDead;
var myTextureBackground;
var myTextureFloor;
var myTextureWalkway;
var myTextureBricks;
var myTextureSwipe;
var myTextureEnemy;
var myTextureEnemy2;
var myTextureBackground_1;
var myTextureBackground_2;
var myTextureBackground_3;
var myTextureBackground_4;
var myTextureBackground_5;
var myTextureBackground_6;
var UNIFORM_sampler;
var gameover = "";
var youwin = "";


// SOUND
var BGMplaying = false;
var LbumpSFXPlayed = false; 
var RbumpSFXPlayed = false;
var victoryPlayed = false;

// ENEMY
var enemyDied = false,
    playerDied = false;
var playerDiedAnimation = false;
var playerDiedCountdown = 0.0;
var score = 0;
var numLives = 3;

// cube translation
var horiz = 0.0,
    altitude = 0.0;
var centerOfScreen = vec2(0.0, 0.0);
var current_x = 0.0;
var character_flip = 0.0;

// texture scrolling variables
var enableScrolling = true;

var scrollSpeed = 0.0;
var UNIFORM_scrollSpeed;
var scrollTexture = false;
var UNIFORM_scrollTexture;

// texture zoom effect variables
//var enableZoom = true;
var currentZoom = 1;
var zoomFactor = 1;
var UNIFORM_zoomFactor;
var zoomTexture = false;
var UNIFORM_zoomTexture;

// array for instancing objects
var objectArr = [];
var visibleObjectFound = false;
var collectibleArr = [];
var enemyArr = []; // ENEMY
var respawnArr = [];
var respawnPoint = 0.0;
var bearArr = []; // testing
var UNIFORM_fColor;
var UNIFORM_isTwoD;

// for vertex shader
var points = [];
var normals = [];
var uv = [];



//    6-----4
//   /|    /|
//  2-----0 |
//  | 7---|-5
//  |/    |/
//  3-----1

// standard 1x1x1 cube
var vertices = [
    vec3(length, length, length), //vertex 0
    vec3(length, -length, length), //vertex 1
    vec3(-length, length, length), //vertex 2
    vec3(-length, -length, length), //vertex 3 
    vec3(length, length, -length), //vertex 4
    vec3(length, -length, -length), //vertex 5
    vec3(-length, length, -length), //vertex 6
    vec3(-length, -length, -length)  //vertex 7   
];

// grass/floor  (edge lengths: x = 10, y = 2, z = 4)
var vertices_grass_cube = [
    vec3(5, 1.5, 2), // 0
    vec3(5, -0.5, 2), // 1
    vec3(-5, 1.5, 2), //2
    vec3(-5, -0.5, 2), //3              
    vec3(5, 1.5, -1), // 4
    vec3(5, -0.5, -1), // 5    
    vec3(-5, 1.5, -1), // 6
    vec3(-5, -0.5, -1) // 7        
];

// background (edge lengths: x = 15, y = 4, z = 1.5)
var vertices_royce_cube = [
    vec3(10, 2, 0.5), // 0
    vec3(10, -2, 0.5), // 1
    vec3(-5, 2, 0.5), //2
    vec3(-5, -2, 0.5), //3
    vec3(10, 2, -1), // 4
    vec3(10, -2, -1), // 5
    vec3(-5, 2, -1), // 6
    vec3(-5, -2, -1) // 7
];

///////////////////////////////////////////////
// INITIALIZE CANVAS/WEBGL/VERTICES/TEXTURES
///////////////////////////////////////////////

window.onload = function init() {
    canvas = document.getElementById("gl-canvas");
    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) { alert("WebGL isn't available"); }

    gl.viewport(0, 0, canvas.clientWidth, canvas.clientHeight);
    gl.clearColor(0.05, 0.05, 0.0, 1.0);

    gl.enable(gl.DEPTH_TEST);
    

    Cube("bricks", points, normals, uv); // starting index 0
    Cube("grass", points, normals, uv);  // starting index 36
    Cube("background", points, normals, uv);  // starting index 72


    // set-up object array
    objectArr = setUpObjectArray();
    collectibleArr = setUpCollectibleArray();
    enemyArr = setUpEnemyArray();
    respawnArr = setUpRespawnArray();
    //bearArr = setUpBearArr();


    // TEXTURE 0
    myTextureBear = gl.createTexture();
    myTextureBear.image = new Image();
    myTextureBear.image.onload = function () {

        gl.bindTexture(gl.TEXTURE_2D, myTextureBear);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, myTextureBear.image);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
        //gl.bindTexture(gl.TEXTURE_2D, null);
    }

    myTextureBear.image.src = "../Images/running_bear1.gif";

    // TEXTURE 1
    myTextureBackground = gl.createTexture();
    myTextureBackground.image = new Image();
    myTextureBackground.image.onload = function () {
        
        gl.bindTexture(gl.TEXTURE_2D, myTextureBackground);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, myTextureBackground.image);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);        
        //gl.bindTexture(gl.TEXTURE_2D, null);
    }
    myTextureBackground.image.src = "../Images/bluesky.png";
    
    // TEXTURE 2
    myTextureBricks = gl.createTexture();
    myTextureBricks.image = new Image();
    myTextureBricks.image.onload = function () {
        gl.bindTexture(gl.TEXTURE_2D, myTextureBricks);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, myTextureBricks.image);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
        //gl.bindTexture(gl.TEXTURE_2D, null);
    }
    myTextureBricks.image.src = "../Images/brick-cartoon.jpg";

    // TEXTURE 3
    myTextureFloor = gl.createTexture();
    myTextureFloor.image = new Image();
    myTextureFloor.image.onload = function () {
        gl.bindTexture(gl.TEXTURE_2D, myTextureFloor);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, myTextureFloor.image);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
    }
    myTextureFloor.image.src = "../Images/grass.png";

    // TEXTURE 4
    myTextureWalkway = gl.createTexture();
    myTextureWalkway.image = new Image();
    myTextureWalkway.image.onload = function () {
        gl.bindTexture(gl.TEXTURE_2D, myTextureWalkway);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, myTextureWalkway.image);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
    }
    myTextureWalkway.image.src = "../Images/grassTop.png";

    // TEXTURE 5
    myTextureSwipe = gl.createTexture();
    myTextureSwipe.image = new Image();
    myTextureSwipe.image.onload = function () {
        gl.bindTexture(gl.TEXTURE_2D, myTextureSwipe);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, myTextureSwipe.image);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
    }
    myTextureSwipe.image.src = "../Images/8bitbear1-1.png";

    // TEXTURE 6
    myTextureBackground_1 = gl.createTexture();
    myTextureBackground_1.image = new Image();
    myTextureBackground_1.image.onload = function () {
        
        gl.bindTexture(gl.TEXTURE_2D, myTextureBackground_1);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, myTextureBackground_1.image);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);        
    }
    myTextureBackground_1.image.src = "../Images/royce.jpg";

    // TEXTURE 7
    myTextureBackground_2 = gl.createTexture();
    myTextureBackground_2.image = new Image();
    myTextureBackground_2.image.onload = function () {
        
        gl.bindTexture(gl.TEXTURE_2D, myTextureBackground_2);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, myTextureBackground_2.image);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);        
    }
    myTextureBackground_2.image.src = "../Images/north.jpg";

    // TEXTURE 8
    myTextureBackground_3 = gl.createTexture();
    myTextureBackground_3.image = new Image();
    myTextureBackground_3.image.onload = function () {
        
        gl.bindTexture(gl.TEXTURE_2D, myTextureBackground_3);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, myTextureBackground_3.image);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);        
    }
    myTextureBackground_3.image.src = "../Images/janss.jpg";

    // TEXTURE 9
    myTextureBackground_4 = gl.createTexture();
    myTextureBackground_4.image = new Image();
    myTextureBackground_4.image.onload = function () {
        
        gl.bindTexture(gl.TEXTURE_2D, myTextureBackground_4);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, myTextureBackground_4.image);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);        
    }
    myTextureBackground_4.image.src = "../Images/bwalk2.jpg";

    // TEXTURE 10
    myTextureBackground_5 = gl.createTexture();
    myTextureBackground_5.image = new Image();
    myTextureBackground_5.image.onload = function () {
        
        gl.bindTexture(gl.TEXTURE_2D, myTextureBackground_5);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, myTextureBackground_5.image);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);        
    }
    myTextureBackground_5.image.src = "../Images/cos.jpg";

    // TEXTURE 11
    myTextureBackground_6 = gl.createTexture();
    myTextureBackground_6.image = new Image();
    myTextureBackground_6.image.onload = function () {
        
        gl.bindTexture(gl.TEXTURE_2D, myTextureBackground_6);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, myTextureBackground_6.image);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);        
    }
    myTextureBackground_6.image.src = "../Images/boelter.jpg";

    // TEXTURE 12
    myTextureEnemy = gl.createTexture();
    myTextureEnemy.image = new Image();
    myTextureEnemy.image.onload = function () {
        gl.bindTexture(gl.TEXTURE_2D, myTextureEnemy);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, myTextureEnemy.image);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
    }
    myTextureEnemy.image.src = "../Images/plant.png";

    // TEXTURE 13
    myTextureEnemy2 = gl.createTexture();
    myTextureEnemy2.image = new Image();
    myTextureEnemy2.image.onload = function () {
        gl.bindTexture(gl.TEXTURE_2D, myTextureEnemy2);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, myTextureEnemy2.image);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
    }
    myTextureEnemy2.image.src = "../Images/trojan.png";

    // TEXTURE 14
    myTextureBearDead = gl.createTexture();
    myTextureBearDead.image = new Image();
    myTextureBearDead.image.onload = function () {

        gl.bindTexture(gl.TEXTURE_2D, myTextureBearDead);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, myTextureBearDead.image);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
        //gl.bindTexture(gl.TEXTURE_2D, null);
    }    
    myTextureBearDead.image.src = "../Images/running_bear_dead.gif";

    // setup shaders
    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    //////////////////
    // create buffers
    //////////////////

    positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW);

    ATTRIBUTE_position = gl.getAttribLocation(program, "vPosition");
    gl.enableVertexAttribArray(ATTRIBUTE_position);
    gl.vertexAttribPointer(ATTRIBUTE_position, 3, gl.FLOAT, false, 0, 0);

    normalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(normals), gl.STATIC_DRAW);

    ATTRIBUTE_normal = gl.getAttribLocation(program, "vNormal");
    gl.enableVertexAttribArray(ATTRIBUTE_normal);
    gl.vertexAttribPointer(ATTRIBUTE_normal, 3, gl.FLOAT, false, 0, 0);

    uvBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(uv), gl.STATIC_DRAW);
    
    ATTRIBUTE_uv = gl.getAttribLocation(program, "vUV");
    gl.enableVertexAttribArray(ATTRIBUTE_uv);
    gl.vertexAttribPointer(ATTRIBUTE_uv, 2, gl.FLOAT, false, 0, 0);




    // Get uniform locations (to be used in render()

    UNIFORM_mvMatrix = gl.getUniformLocation(program, "mvMatrix");
    UNIFORM_pMatrix = gl.getUniformLocation(program, "pMatrix");
    UNIFORM_sampler = gl.getUniformLocation(program, "uSampler");


    UNIFORM_scrollSpeed = gl.getUniformLocation(program, "scrollSpeed");
    UNIFORM_scrollTexture = gl.getUniformLocation(program, "scrollTexture");

    UNIFORM_zoomFactor = gl.getUniformLocation(program, "zoomFactor");
    UNIFORM_zoomTexture = gl.getUniformLocation(program, "zoomTexture");

    // setup fragment color
    UNIFORM_fColor = gl.getUniformLocation(program, "color");
    UNIFORM_isTwoD = gl.getUniformLocation(program, "isTwoD");

    // setup lighting
    UNIFORM_lightPosition = gl.getUniformLocation(program, "lightPosition");
    UNIFORM_shininess = gl.getUniformLocation(program, "shininess");

    projectionMatrix = perspective(75, canvas.clientWidth / canvas.clientHeight, 0.001, 1000);

    timer.reset();
    gl.enable(gl.DEPTH_TEST);


    render();
}

function Cube(object, points, normals, uv) {
    Quad(object, points, normals, uv, 0, 1, 2, 3, vec3(0, 0, 1)); // front    
    Quad(object, points, normals, uv, 4, 5, 0, 1, vec3(1, 0, 0)); // right
    Quad(object, points, normals, uv, 2, 3, 6, 7, vec3(-1, 0, 0)); // left
    Quad(object, points, normals, uv, 6, 7, 4, 5, vec3(0, 0, -1)); // back
    Quad(object, points, normals, uv, 1, 5, 3, 7, vec3(0, -1, 0)); // bottom
    Quad(object, points, normals, uv, 4, 0, 6, 2, vec3(0, 1, 0)); // top
}

function Quad(object, points, normals, uv, v1, v2, v3, v4, normal) {

    normals.push(normal);
    normals.push(normal);
    normals.push(normal);
    normals.push(normal);
    normals.push(normal);
    normals.push(normal);


    uv.push(vec2(0, 0));
    uv.push(vec2(1, 0));
    uv.push(vec2(1, 1));
    uv.push(vec2(0, 0));
    uv.push(vec2(1, 1));
    uv.push(vec2(0, 1));

    if (object == "bricks") {
        points.push(vertices[v1]);
        points.push(vertices[v3]);
        points.push(vertices[v4]);
        points.push(vertices[v1]);
        points.push(vertices[v4]);
        points.push(vertices[v2]);
    }
    else if (object == "grass") {
        points.push(vertices_grass_cube[v1]);
        points.push(vertices_grass_cube[v3]);
        points.push(vertices_grass_cube[v4]);
        points.push(vertices_grass_cube[v1]);
        points.push(vertices_grass_cube[v4]);
        points.push(vertices_grass_cube[v2]);
    }
    else if (object == "background") {
        points.push(vertices_royce_cube[v1]);
        points.push(vertices_royce_cube[v3]);
        points.push(vertices_royce_cube[v4]);
        points.push(vertices_royce_cube[v1]);
        points.push(vertices_royce_cube[v4]);
        points.push(vertices_royce_cube[v2])
    }
}




// Collision Detection
function collisionDetection(object_pos, width, height, objectNum, isCollectible, isEnemy) {
    var bearPos = vec3(player_x + horiz, player_y + altitude, player_z);
    var halfWidth = bearWidth / 2;
    var halfHeight = bearHeight / 2;


    // check position within tolerance    
    var xInBounds = ((bearPos[0] + halfWidth / 2) > (object_pos[0] - width / 2) && (bearPos[0] + halfWidth) <= (object_pos[0] + width/2)) 
        || ((bearPos[0] - halfWidth / 2) < (object_pos[0] + width / 2) && (bearPos[0] - halfWidth) >= (object_pos[0] - width/2));    
    var bottomContact = ((bearPos[1] - halfHeight) >= (object_pos[1] + (height / 2)) && (bearPos[1] - halfHeight) <= (object_pos[1] + (height / 2) + halfHeight/2));
    var topContact = ((bearPos[1] + halfHeight) >= (object_pos[1] - height / 2) && (bearPos[1] + halfHeight) <= (object_pos[1]));
    var rightContact = ((bearPos[0] + halfWidth) <= (object_pos[0] - (width / 2) + (bearWidth / 2)) && (bearPos[0] + halfWidth) >= (object_pos[0] - width / 2));
    var leftContact = ((bearPos[0] - halfWidth) >= (object_pos[0] + (width / 2) - (bearWidth / 2)) && (bearPos[0] - halfWidth) <= (object_pos[0] + width / 2));
    var objectInYBounds = ((object_pos[1] - height / 2) < (bearPos[1] + halfHeight) && (object_pos[1] + height / 2) > (bearPos[1] - halfHeight));    
    var objectInXBounds = ((object_pos[0] - width / 2) > (bearPos[0] - halfWidth) && (object_pos[0] + width / 2) < (bearPos[0] + halfWidth));
    var leftHangingOff = ((bearPos[0] - halfWidth) < (object_pos[0] - width / 2));
    var rightHangingOff = ((bearPos[0] + halfWidth) > (object_pos[0] + width / 2));


    // SOUND
    // Reset jump & bump SFX values 
    if (altitude == 0.0) 
        inAir = false; 
    if (falling) 
        inAir = true; 
    if (LbumpSFXPlayed && !blockedLeft) 
        LbumpSFXPlayed = false; 
    if (RbumpSFXPlayed && !blockedRight) 
        RbumpSFXPlayed = false; 


    // check side contact
    if (objectInYBounds && rightContact) {   
        if (isCollectible) // COLLECTIBLE
        {
            score += 100;
            return true;
        }
        blockedRight = true;
        blockedRightBy = objectNum;
        // shove player off left side of object so player doesn't fall into object
        horiz = object_pos[0] - (width / 2) - player_x - halfWidth;
        if(steppedOn == objectNum)
            altitude = object_pos[1] + (height / 2) - player_y + halfHeight + .05;
    }
    else if (blockedRightBy == objectNum)
        blockedRight = false;

    if (objectInYBounds && leftContact) {
        if (isCollectible)
        {
            score += 100;
            return true;
        }
        blockedLeft = true;
        blockedLeftBy = objectNum;
        // shove player off right side of object so player doesn't fall into object
        horiz = object_pos[0] + (width / 2) - player_x + halfWidth;
        if (steppedOn == objectNum)
            altitude = object_pos[1] + (height / 2) - player_y + halfHeight + .05;
    }
    else if (blockedLeftBy == objectNum)
        blockedLeft = false;


    // check top/bottom contact
    if (isCollectible) {
        xInBounds = ((bearPos[0] + halfWidth) >= (object_pos[0] - width / 2) && (bearPos[0] - halfWidth) <= (object_pos[0] + width / 2));
        bottomContact = ((bearPos[1] - halfHeight) >= (object_pos[1]) && (bearPos[1] - halfHeight) <= (object_pos[1] + (height / 1.5)));
    }


    // if bear is in object bounds & bear is landing from above
    if ((xInBounds || objectInXBounds) && bottomContact && falling) {
        if (isCollectible)
        {
            score += 100;
            return true;
        }
        if (isEnemy) { // ENEMY (enemy will kill player when player jumps on it)
            playerDied = true;
            return true;
        }
        altitude = object_pos[1] + (height / 2) - player_y + halfHeight;
        bearOnTop = true;
        bearOnTopAltitude = altitude;
        inAir = false; // SOUND
        steppedOn = objectNum;
        
        if (jump) {
            jump = false;
            falling = false;
            flow_left = false;
            flow_right = false;
        }

    }
        // if the bear was previously on top of THIS object, but now isn't
    else if (!xInBounds && bottomContact && (steppedOn == objectNum)) {        
            bearOnTop = false;
            bearOnTopAltitude = 0.0;
            steppedOn = -1;        
    }
        // if top of bear hits bottom of object
    else if (xInBounds && topContact) {
        if (isCollectible)
        {
            score += 100;
            return true;
        }        
        if (jump)
            falling = true;
        altitude = object_pos[1] - (height / 2) - player_y - halfHeight;
    }
        // if bear free-falling
    else if (!bearOnTop && !jump && altitude > 0 && !playerDiedAnimation) {
        jump = true;
        falling = true;
    }
    
    return false; 
}

// SOUND
// Implement sound effects 
function playAudio(path) { 
    (new Audio(path)).play(); 
} 

// implement "jump" feature
function do_jump() {    

    if (!falling) {
        
        if ((altitude - bearOnTopAltitude) < 1.75)
            altitude += 0.05;
        else {
            falling = true;
        }
        
    }

    if (falling) {
        altitude -= 0.05
        
        if ((altitude - bearOnTopAltitude) <= 0) {
            //altitude = 0;
            altitude = bearOnTopAltitude;
            falling = false;
            jump = false;
            flow_left = false; flow_right = false;
            return;
        }
    }
    
    if (flow_left && !blockedLeft) {
        if (horiz > -0.5 || current_x == 0.)
            horiz -= 0.025;
        else if (current_x > 0.0) {
            current_x -= 0.025;
            scrollSpeed -= 0.002;
        }
    }
    else if (flow_right && !blockedRight) {
        if (horiz < 3.5)
            horiz += 0.025;
        else {
            current_x += 0.025;
            scrollSpeed += 0.002;
        }
    }
    
}

function render()
{    
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Play backgroung music
    if (!BGMplaying)
    {
        playAudio("../Audio/UCLA.mp3")
        BGMplaying = true;
    }

    // Update footer display
    $('#score').html(score);
    $('#numLives').html(numLives);
    $('#gameover').html(gameover);
    $('#youwin').html(youwin);
    
    // BLENDING
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    // setup timer for consistent rotation
    var temp = timer.getElapsedTime();
    if (!pauseRotation) {
         time += (temp - time_displaced) / 1000;
    time += (temp) / 1000;

        if (time > 1000)
            time = 0.0;
    }

    else
        time_displaced = timer_disp.getElapsedTime();

    gl.uniform1i(UNIFORM_isTwoD, false);

    lightPosition = vec3(0.0, 0.0, 0.0);
    gl.uniform3fv(UNIFORM_lightPosition, lightPosition);
    gl.uniform1f(UNIFORM_shininess, 20);

    // Check victory condition
    if (current_x > 70.0)
    {
        youwin = "YOU WIN!";
        if (!victoryPlayed)
        {
            playAudio("../Audio/victory.wav");
            victoryPlayed = true;
        }
    }

    if (current_x > 73.0)
        blockedRight = true;

    ////////////////////////
    // XY-PLANE (background)
    ////////////////////////

    for (var i = 0; i < 6; i++)
    {
        mvMatrix = mat4();    
        mvMatrix = mult(mvMatrix, rotate(20, 1, 0, 0)); // angle camera
        mvMatrix = mult(mvMatrix, translate(-4.5 + 15.0*i - current_x, -0.225, -5.5 + z_zoom));
        gl.uniformMatrix4fv(UNIFORM_mvMatrix, false, flatten(mvMatrix));
        gl.uniformMatrix4fv(UNIFORM_pMatrix, false, flatten(projectionMatrix));
    
        // use texture 1 (royce)
        if (i ==0) 
        {
            gl.activeTexture(gl.TEXTURE6);
            gl.bindTexture(gl.TEXTURE_2D, myTextureBackground_1);
            gl.uniform1i(UNIFORM_sampler, 6);
            gl.drawArrays(gl.TRIANGLES, 72, 36);
        }

        if (i ==1) 
        {
            gl.activeTexture(gl.TEXTURE7);
            gl.bindTexture(gl.TEXTURE_2D, myTextureBackground_2);
            gl.uniform1i(UNIFORM_sampler, 7);
            gl.drawArrays(gl.TRIANGLES, 72, 36);
        }

        // use texture 1 (royce)
        if (i ==2) 
        {
            gl.activeTexture(gl.TEXTURE8);
            gl.bindTexture(gl.TEXTURE_2D, myTextureBackground_3);
            gl.uniform1i(UNIFORM_sampler, 8);
            gl.drawArrays(gl.TRIANGLES, 72, 36);
        }

        // use texture 1 (royce)
        if (i ==3) 
        {
            gl.activeTexture(gl.TEXTURE9);
            gl.bindTexture(gl.TEXTURE_2D, myTextureBackground_4);
            gl.uniform1i(UNIFORM_sampler, 9);
            gl.drawArrays(gl.TRIANGLES, 72, 36);
        }

        // use texture 1 (royce)
        if (i ==4) 
        {
            gl.activeTexture(gl.TEXTURE10);
            gl.bindTexture(gl.TEXTURE_2D, myTextureBackground_5);
            gl.uniform1i(UNIFORM_sampler, 10);
            gl.drawArrays(gl.TRIANGLES, 72, 36);
        }

        // use texture 1 (royce)
        if (i ==5) 
        {
            gl.activeTexture(gl.TEXTURE11);
            gl.bindTexture(gl.TEXTURE_2D, myTextureBackground_6);
            gl.uniform1i(UNIFORM_sampler, 11);
            gl.drawArrays(gl.TRIANGLES, 72, 36);
        }
    }

   /////////////////////
    // XZ-PLANE (floor)
    /////////////////////

    // enable scrolling of texture (increase displacement)
    if (enableScrolling) {        
        if (scrollSpeed > 10.0)
            scrollSpeed = 0.0;
    }
    gl.uniform1f(UNIFORM_scrollSpeed, scrollSpeed);
    scrollTexture = true;
    gl.uniform1f(UNIFORM_scrollTexture, scrollTexture);

    for (var i=0; i < 2; i++ )
    {
        mvMatrix = mat4();
        mvMatrix = mult(mvMatrix, rotate(20, 1, 0, 0)); // angle camera
        mvMatrix = mult(mvMatrix, translate(-4.5 + 10.0*i, -3.625, -4.0 + z_zoom)); // placed right below player

        gl.uniformMatrix4fv(UNIFORM_mvMatrix, false, flatten(mvMatrix));
        gl.uniformMatrix4fv(UNIFORM_pMatrix, false, flatten(projectionMatrix));


        // use texture 3 (grass)
        gl.activeTexture(gl.TEXTURE3);
        gl.bindTexture(gl.TEXTURE_2D, myTextureFloor);
        gl.uniform1i(UNIFORM_sampler, 3);
        gl.drawArrays(gl.TRIANGLES, 36, 30);

        // FOR TOP OF FLOOR: use texture 4 (walkway)
        gl.activeTexture(gl.TEXTURE4);
        gl.bindTexture(gl.TEXTURE_2D, myTextureWalkway);
        gl.uniform1i(UNIFORM_sampler, 4);
        gl.drawArrays(gl.TRIANGLES, 66, 6);
    }

    // turn off scrolling
    scrollTexture = false;
    gl.uniform1f(UNIFORM_scrollTexture, scrollTexture);

    //////////////////////////////////
    // BRICKS (drawn using objectArr)
    //////////////////////////////////
    zoomTexture = true;
    gl.uniform1f(UNIFORM_zoomTexture, zoomTexture);

    // use texture 2 (BRICKS)
    gl.activeTexture(gl.TEXTURE2);
    gl.bindTexture(gl.TEXTURE_2D, myTextureBricks);
    gl.uniform1i(UNIFORM_sampler, 2);
    
    // draw/translate visible objects
    for (var i = 0; i < objectArr.length; ++i)
    {
        mvMatrix = mat4();
        mvMatrix = mult(mvMatrix, rotate(20, 1, 0, 0)); // angle camera
        mvMatrix = mult(mvMatrix, translate(objectArr[i][1] - current_x, objectArr[i][2], objectArr[i][3] + z_zoom));
        mvMatrix = mult(mvMatrix, scale(objectArr[i][4], objectArr[i][5], objectArr[i][6]));

        gl.uniformMatrix4fv(UNIFORM_mvMatrix, false, flatten(mvMatrix));
        gl.uniformMatrix4fv(UNIFORM_pMatrix, false, flatten(projectionMatrix));

        zoomFactor = objectArr[i][7] / 100;
        gl.uniform1f(UNIFORM_zoomFactor, zoomFactor);

        gl.drawArrays(gl.TRIANGLES, 0, 36);

        collisionDetection(vec3(objectArr[i][1] - current_x, objectArr[i][2], objectArr[i][3]), objectArr[i][4], objectArr[i][5], i, false, false); // OBJECT i
    }

    zoomTexture = false;
    gl.uniform1f(UNIFORM_zoomTexture, zoomTexture);
    gl.uniform1i(UNIFORM_isTwoD, true);

    //////////////////
    // COLLECTIBLES
    //////////////////
    gl.enable(gl.BLEND);

    // use texture 5 (SWIPE)
    gl.activeTexture(gl.TEXTURE5);
    gl.bindTexture(gl.TEXTURE_2D, myTextureSwipe);
    gl.uniform1i(UNIFORM_sampler, 5);

    // draw/translate visible objects
    for (var i = 0; i < collectibleArr.length; ++i) {

        // if invisible, do not draw
        if (collectibleArr[i][0] == 0.0)            
                continue;        
        
        mvMatrix = mat4();
        mvMatrix = mult(mvMatrix, rotate(20, 1, 0, 0)); // angle camera
        mvMatrix = mult(mvMatrix, translate(collectibleArr[i][1] - current_x, collectibleArr[i][2], collectibleArr[i][3] + z_zoom));
        mvMatrix = mult(mvMatrix, rotate(time * omega, 0, 1, 0));
        mvMatrix = mult(mvMatrix, scale(collectibleArr[i][4], collectibleArr[i][5], 0));

        gl.uniformMatrix4fv(UNIFORM_mvMatrix, false, flatten(mvMatrix));
        gl.uniformMatrix4fv(UNIFORM_pMatrix, false, flatten(projectionMatrix));

        zoomFactor = collectibleArr[i][7] / 100;
        gl.uniform1f(UNIFORM_zoomFactor, zoomFactor);

        gl.drawArrays(gl.TRIANGLES, 0, 36);

        // if player collided with collectible
        if (collisionDetection(vec3(collectibleArr[i][1] - current_x, collectibleArr[i][2], collectibleArr[i][3]),
                                    collectibleArr[i][4], collectibleArr[i][5], i + objectArr.length, true, false)) {
            collectibleArr[i][0] = 0;
            playAudio("../Audio/swipe.wav"); // SOUND
        }
    }

    ////////////////////////////
    // ENEMY
    ////////////////////////////
    
    // draw/translate visible objects
    for (var i = 0; i < enemyArr.length; ++i)
    {
        // if invisible, do not draw
        if (enemyArr[i][0] == 0.0)
            continue;

        mvMatrix = mat4();
        mvMatrix = mult(mvMatrix, rotate(20, 1, 0, 0)); // angle camera
        mvMatrix = mult(mvMatrix, translate(enemyArr[i][1] - current_x, enemyArr[i][2], enemyArr[i][3] + z_zoom));
        mvMatrix = mult(mvMatrix, scale(enemyArr[i][4], enemyArr[i][5], 0));

        gl.uniformMatrix4fv(UNIFORM_mvMatrix, false, flatten(mvMatrix));
        gl.uniformMatrix4fv(UNIFORM_pMatrix, false, flatten(projectionMatrix));

        zoomFactor = enemyArr[i][7] / 100;
        gl.uniform1f(UNIFORM_zoomFactor, zoomFactor);

        if (enemyArr[i][8] == 0)
        {
            gl.activeTexture(gl.TEXTURE12); // plant enemy
            gl.bindTexture(gl.TEXTURE_2D, myTextureEnemy);
            gl.uniform1i(UNIFORM_sampler, 12);
        }

        else
        {
            gl.activeTexture(gl.TEXTURE13); // trojan enemy
            gl.bindTexture(gl.TEXTURE_2D, myTextureEnemy2);
            gl.uniform1i(UNIFORM_sampler, 13);
        }

        gl.drawArrays(gl.TRIANGLES, 0, 36);

        // if player collided with collectible
        if (collisionDetection(vec3(enemyArr[i][1] - current_x, enemyArr[i][2], enemyArr[i][3]),
                                    enemyArr[i][4], enemyArr[i][5], i + objectArr.length + collectibleArr.length, false, true))
        {                        
            if (playerDied)
            {
                if (!playerDiedAnimation)
                {
                    numLives--;
                    respawnPoint = i;
                    playerDiedCountdown = 100;
                    playerDiedAnimation = true;
                    altitude += 0.2;
                    if (numLives == 0)
                    {
                        score = 0;
                        numLives = 3;
                        respawnPoint = 0;
                        gameover = "GAME OVER!";
                        blockedRight = true;
                    }
                }
            }

            else if (enemyDied)
                enemyArr[i][0] = 0;
                playAudio("../Audio/die.wav"); // SOUND
        }

    }

    ////////////////////////////
    // DRAW BEAR WITH BLENDING
    ////////////////////////////
    if (jump)
        do_jump();
    if (playerDied)
    {    
        if (playerDiedAnimation)
        {
            jump = false; falling = false; flow_left = false; flow_right = false;
            if (playerDiedCountdown > 80 || (playerDiedCountdown < 60 && playerDiedCountdown > 40) || playerDiedCountdown < 20)
            {
                // use texture 0
                gl.activeTexture(gl.TEXTURE0);
                gl.bindTexture(gl.TEXTURE_2D, myTextureBear);
                gl.uniform1i(UNIFORM_sampler, 0);
            }

            else
            {
                // use texture 14
                gl.activeTexture(gl.TEXTURE14);
                gl.bindTexture(gl.TEXTURE_2D, myTextureBearDead);
                gl.uniform1i(UNIFORM_sampler, 14);
            }

            playerDiedCountdown--;
            if (playerDiedCountdown < 0)
                playerDiedAnimation = false;
        }

        else
        {
            horiz = -player_x - 0.05;
            altitude = respawnArr[respawnPoint][0] - player_y;
            current_x = respawnArr[respawnPoint][1];
            jump = true;
            falling = true;
            flow_left = false; flow_right = false;
            playerDied = false;
        }
    }

    mvMatrix = mat4();
    mvMatrix = mult(mvMatrix, rotate(20, 1, 0, 0));
    mvMatrix = mult(mvMatrix, translate(player_x + horiz, player_y + altitude, player_z + z_zoom));
    mvMatrix = mult(mvMatrix, rotate(character_flip, 0, 1, 0)); // flip character when moving left
    mvMatrix = mult(mvMatrix, scale(bearWidth, bearHeight, 0.0));

    gl.uniformMatrix4fv(UNIFORM_mvMatrix, false, flatten(mvMatrix));
    gl.uniformMatrix4fv(UNIFORM_pMatrix, false, flatten(projectionMatrix));

    if (!playerDiedAnimation)
    {
        // use texture 0
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, myTextureBear);
        gl.uniform1i(UNIFORM_sampler, 0)
    }

    gl.drawArrays(gl.TRIANGLES, 0, 36);

    gl.disable(gl.BLEND);
    
    gl.uniform1i(UNIFORM_isTwoD, false);

    // COLLISION DETECTION FOR LEFT MOST INITIAL SCREEN
    collisionDetection(vec3(player_x - 4.3, 0.0, player_z), 1.0, 10.0, -10, false, false);

    /////////////////////
    // Keyboard Input
    /////////////////////
    window.onkeypress = function ()
    {
        var key = String.fromCharCode(event.keyCode);
        switch (key)
        {
            case 'm':
                z_zoom += 1;
                break;
            case 'n':
                z_zoom -= 1;
                break;
            case 's': // enable/disable texture scrolling
                enableScrolling = !enableScrolling;
                break;
            case 'q':
                fov += .01;
                break;
            case 'w':
                fov -= .01;
                break;
            case 'r': // pause/unpause rotation
                if (pauseRotation)
                    pauseRotation = false;
                else
                {
                    pauseRotation = true;
                    timer_disp = timer;
                }
                break;
        }
    }

    window.onkeydown = function (e) {
        keysPressed[e.keyCode] = true;
    }
    window.onkeyup = function (e) {
        keysPressed[e.keyCode] = false;
    }

    // allow for multikey press
    if (!playerDiedAnimation)
    {
        if (keysPressed[38])
        { // UP
            jump = true;
            if (!inAir)  // SOUND
            {
                playAudio("../Audio/jump.wav");
                inAir = true;
            }
            if (keysPressed[39] && !blockedRight) // UP + RIGHT
            {
                flow_right = true;
                character_flip = 0.0;
            }
            else if (keysPressed[37] && !blockedLeft) // UP + LEFT
            {
                flow_left = true;
                character_flip = 180;
            }
        }

        else if (keysPressed[39]) // RIGHT
        {
            if (!blockedRight)
            {
                if (horiz < 3.5)
                    horiz += 0.025;
                else
                {
                    current_x += 0.025;
                    scrollSpeed += 0.002;
                }
                character_flip = 0.0;
            }

            else
            {
                if (!RbumpSFXPlayed) // SOUND
                {
                    playAudio("../Audio/bump.wav");
                    RbumpSFXPlayed = true;
                }
            }
        }

        else if (keysPressed[37]) // LEFT
        {
            if (!blockedLeft)
            {
                if (horiz > -0.5 || current_x <= 0.0)
                    horiz -= 0.025;
                else if (current_x > 0.0)
                {
                    current_x -= 0.025;
                    scrollSpeed -= 0.002;
                }
                character_flip = 180;
            }

            else if (!LbumpSFXPlayed) // SOUND
            {
                    playAudio("../Audio/bump.wav");
                    LbumpSFXPlayed = true;
            }
        }
    }

    requestAnimFrame(render);
}