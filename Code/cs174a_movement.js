
/*  Array 
    
    i |  property
    -------------
    0 | visibility (1/0)
    1 | x-coord
    2 | y-coord
    3 | z-coord
    4 | x-scale
    5 | y-scale
    6 | z-scale
    7 | texture zoom factor
    8 |
*/


////////////////////////
// set up object array
////////////////////////
function setUpObjectArray() {
    var arr = [];

    arr.push([1., -1.5, -1.2, -4.0, 1.5, 0.5, 1., 30.]);
    arr.push([1., 1.5, -1.2, -4.0, 1.5, 0.5, 1., 25]);
    arr.push([1., 2.4, 0.0, -4.0, 1.0, 0.5, 1., 25]);
    arr.push([1., 8.0, -1.2, -4.0, 4.5, 0.5, 1., 25.]);//20
    arr.push([1., 7.5, 0.2, -4.0, 1.0, 0.5, 1., 25.]);
    arr.push([1., 13.0, -1.2, -4.0, 2.0, 0.5, 1., 25.]);//20
    arr.push([1., 16.5, -0.3, -4.0, 1.0, 0.5, 1., 25.]);
    arr.push([1., 20.0, 0.5, -4.0, 2.5, 0.5, 1., 25.]);//22
    arr.push([1., 28.0, -1.0, -4.0, 1.5, 0.5, 1., 25.]);    
    arr.push([1., 31.75, -0.2, -4.0, 3.0, 0.5, 1., 25.]);
    arr.push([1., 38, -1.3, -4.0, 3.0, 0.5, 1., 25.]);
    arr.push([1., 42, -0.2, -4.0, 3.0, 0.5, 1., 25.]);
    arr.push([1., 46, -1.6, -4.0, 1.0, 0.5, 1., 25.]);
    arr.push([1., 50, -0.2, -4.0, 4.0, 0.5, 1., 25.]);
    arr.push([1., 55, -1.6, -4.0, 2.5, 0.5, 1., 25.]);
    arr.push([1., 61, 0.2, -4.0, 4.0, 0.5, 1., 25.]);
    arr.push([1., 66.0, -1.2, -4.0, 2.5, 0.5, 1., 25.]);


    return arr;
}


//////////////////////////////
// set up collectibles array
//////////////////////////////
function setUpCollectibleArray() {
    var arr = [];

    var xscale = 0.35, yscale = 0.35, zscale = 0.0; 

    arr.push([1., -3.5, 0.3, -4.0, xscale, yscale, zscale, 0]);
    arr.push([1., -1.5, -0.5, -4.0, xscale, yscale, zscale, 0]);
    arr.push([1., 1.5, -0.5, -4.0, xscale, yscale, zscale, 0]);
    arr.push([1., 2.4, 0.7, -4.0, xscale, yscale, zscale, 0]);
    arr.push([1., 6.4, -0.5, -4.0, xscale, yscale, zscale, 0]);
    arr.push([1., 7.4, -0.5, -4.0, xscale, yscale, zscale, 0]);
    arr.push([1., 8.4, -0.5, -4.0, xscale, yscale, zscale, 0]);
    arr.push([1., 9.4, -0.5, -4.0, xscale, yscale, zscale, 0]);
    arr.push([1., 7.5, 0.8, -4.0, xscale, yscale, zscale, 0]);
    arr.push([1., 12.5, -0.5, -4.0, xscale, yscale, zscale, 0]);
    arr.push([1., 13.5, -0.5, -4.0, xscale, yscale, zscale, 0]);
    arr.push([1., 15.0, 0.2, -4.0, xscale, yscale, zscale, 0]);
    arr.push([1., 16.5, -1.5, -4.0, xscale, yscale, zscale, 0]);
    arr.push([1., 16.5, 0.6, -4.0, xscale, yscale, zscale, 0]);
    arr.push([1., 18.0, -1.5, -4.0, xscale, yscale, zscale, 0]);
    arr.push([1., 19.0, 1.2, -4.0, xscale, yscale, zscale, 0]);
    arr.push([1., 19.5, -1.5, -4.0, xscale, yscale, zscale, 0]);
    arr.push([1., 21.0, 1.2, -4.0, xscale, yscale, zscale, 0]);
    arr.push([1., 23.0, 0.2, -4.0, xscale, yscale, zscale, 0]);
    arr.push([1., 28.0, -0.3, -4.0, xscale, yscale, zscale, 0]);
    arr.push([1., 29.5, 0.6, -4.0, xscale, yscale, zscale, 0]);
    arr.push([1., 31.0, 0.5, -4.0, xscale, yscale, zscale, 0]);
    arr.push([1., 31.75, 0.5, -4.0, xscale, yscale, zscale, 0]);
    arr.push([1., 32.5, 0.5, -4.0, xscale, yscale, zscale, 0]);
    arr.push([1., 35.0, 1.2, -4.0, xscale, yscale, zscale, 0]);
    arr.push([1., 37.0, -0.6, -4.0, xscale, yscale, zscale, 0]);
    arr.push([1., 38.5, -0.6, -4.0, xscale, yscale, zscale, 0]);
    arr.push([1., 41.25, 0.5, -4.0, xscale, yscale, zscale, 0]);
    arr.push([1., 42.75, 0.5, -4.0, xscale, yscale, zscale, 0]);
    arr.push([1., 46.0, 1.2, -4.0, xscale, yscale, zscale, 0]); // stack
    arr.push([1., 46.0, 0.8, -4.0, xscale, yscale, zscale, 0]);
    arr.push([1., 46.0, 0.4, -4.0, xscale, yscale, zscale, 0]);
    arr.push([1., 46.0, 0.0, -4.0, xscale, yscale, zscale, 0]);
    arr.push([1., 46.0, -0.4, -4.0, xscale, yscale, zscale, 0]); // end stack
    arr.push([1., 50.0, 0.5, -4.0, xscale, yscale, zscale, 0]);
    arr.push([1., 55, -0.1, -4.0, xscale, yscale, zscale, 0]);
    arr.push([1., 59.75, 0.8, -4.0, xscale, yscale, zscale, 0]);
    arr.push([1., 60.5, 0.8, -4.0, xscale, yscale, zscale, 0]);
    arr.push([1., 61.25, 0.8, -4.0, xscale, yscale, zscale, 0]);
    arr.push([1., 62.0, 0.8, -4.0, xscale, yscale, zscale, 0]);
    arr.push([1., 66.0, -0.5, -4.0, xscale, yscale, zscale, 0]);

    return arr;
}

///////////////
// ENEMY ARRAY
///////////////
function setUpEnemyArray() {
    var arr = [];

    // index 8 => 0 = plant, 1 = trojan
    arr.push([1., 4.0, -1.33, -4.0, 0.8, 1.6, 0, 0, 0]); // 0
    arr.push([1., 11.0, -1.6, -4.0, 1.0, 1.0, 0, 0, 1]); // 1
    arr.push([1., 23.0, -1.6, -4.0, 0.8, 0.8, 0, 0, 1]); // 2
    arr.push([1., 34.0, -1.6, -4.0, 1.0, 1.0, 0, 0, 1]); // 3
    arr.push([1., 35.0, -1.6, -4.0, 1.0, 1.0, 0, 0, 1]); // 4
    arr.push([1., 44.8, -1.6, -4.0, 0.7, 0.7, 0, 0, 1]); // 5
    arr.push([1., 47.2, -1.6, -4.0, 0.7, 0.7, 0, 0, 1]); // 6
    arr.push([1., 64.0, -1.6, -4.0, 0.8, 0.8, 0, 0, 1]); // 7

    return arr;
}

// RESPAWN POINTS
function setUpRespawnArray() {
    var arr = [];

    // y, current_x
    arr.push([1.2, 2.5]); // 0
    arr.push([1.4, 7.2]); // 1
    arr.push([2.0, 19.5]); // 2
    arr.push([2.0, 31.2]); // 3
    arr.push([2.0, 31.2]); // 4
    arr.push([2.0, 42.2]); // 5
    arr.push([2.0, 42.2]); // 6
    arr.push([2.0, 62.0]); // 7


    return arr;
}