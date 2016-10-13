/**
 * Created by jarndt on 9/27/16.
 */

function White(numItems) {
    return dupeArray(numItems,[1,1,1,1]);
};function Black(numItems) {
    return dupeArray(numItems,[0,0,0,1]);
};function Red(numItems) {
    return dupeArray(numItems,[1,0,0,1]);
};function Green(numItems) {
    return dupeArray(numItems,[0,1,0,1]);
};function Blue(numItems) {
    return dupeArray(numItems,[0,0,1,1]);
};function Color(colorArray) {
    colorArray.itemSize = 4;
    colorArray.numItems = colorArray.length/4;
    return colorArray;
};function Color(colorArrays, neededSize) {
    var tempArray = [];
    for(var i = 0; i<neededSize; i++)
        tempArray = tempArray.concat(colorArrays[i%colorArrays.length]);
    tempArray.itemSize = 4;
    tempArray.numItems = neededSize;
    return tempArray;
}
function ColorLightToDark(colorArrays, neededSize) {
    var tempArray = [];
    var k = 0;
    for(var i = 0; i<neededSize; i++) {
        if(i > neededSize/colorArrays.length*(k+1))
            k++;
        tempArray = tempArray.concat(colorArrays[k]);
    }
    tempArray.itemSize = 4;
    tempArray.numItems = neededSize;
    return tempArray;
}

function dupeArray(dupeCount, array){
    var tempArray = array;
    for(var i = 0; i<dupeCount; i++)
        array = array.concat(tempArray);
    array.itemSize = tempArray.length;
    array.numItems = dupeCount;
    return array;
};

function drawScene() {
    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    mat4.perspective(45, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0, pMatrix);

    mat4.identity(mvMatrix);
}

function drawSquare(translationMatrix,colors,rotation) { //[3.0, 0.0, 0.0]
    if(colors == undefined)
        colors = White(4);
    var squareVertexPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexPositionBuffer);
    vertices = [
        1.0,  1.0,  0.0,
        -1.0,  1.0,  0.0,
        1.0, -1.0,  0.0,
        -1.0, -1.0,  0.0
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    squareVertexPositionBuffer.itemSize = 3;
    squareVertexPositionBuffer.numItems = 4;


    var triangleVertexColorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexColorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
    triangleVertexColorBuffer.itemSize = colors.itemSize; //4
    triangleVertexColorBuffer.numItems = colors.numItems; //4


    if(translationMatrix == undefined)
        translationMatrix = [0.0, 0.0, -7.0];
    mat4.translate(mvMatrix, translationMatrix);

    mvPushMatrix();
    if(rotation != undefined)
        mat4.rotate(mvMatrix, degToRad(rotation.degrees), rotation.rotateMatrix);

    gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexPositionBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, squareVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexColorBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, triangleVertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);
    setMatrixUniforms();
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, squareVertexPositionBuffer.numItems);
    mvPopMatrix();
}

/**
 *
 * Needs a vertices object like this
 * vertices = [
 *      1,1,1
 *      0,0,0 //ect ect
 * ];
 * vertices.itemSize = 3;
 * vertices.numItems = 2;
 *
 * @param vertices
 * @param translationMatrix
 * @param colors
 * @param rotation
 */
function drawArrayOfVertices(vertices, translationMatrix,colors,rotation) { //[3.0, 0.0, 0.0]
    if(colors == undefined)
        colors = White(vertices.numItems);
    var squareVertexPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexPositionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    squareVertexPositionBuffer.itemSize = vertices.itemSize;
    squareVertexPositionBuffer.numItems = vertices.numItems;


    var triangleVertexColorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexColorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
    triangleVertexColorBuffer.itemSize = colors.itemSize; //4
    triangleVertexColorBuffer.numItems = colors.numItems; //4

    if(translationMatrix == undefined)
        translationMatrix = [0.0, 0.0, -7.0];

    mat4.translate(mvMatrix, translationMatrix);

    mvPushMatrix();
    if(rotation != undefined)
        mat4.rotate(mvMatrix, degToRad(rotation.degrees), rotation.rotateMatrix);

    gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexPositionBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, squareVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexColorBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, triangleVertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);
    setMatrixUniforms();
    if(vertices.drawType == undefined)
        vertices.drawType = gl.TRIANGLE_STRIP;
    gl.drawArrays(vertices.drawType, 0, squareVertexPositionBuffer.numItems);
    mvPopMatrix();
}


/**
 * translationMatrix is [MoveX, MoveY, MoveZ] from current position
 * colors is a matrix of doubles, specify the itemSize and numItems too
 *      itemSize is x length, numItems is y length
 *
 *    example:
 *      var colors = [
 *            1.0, 0.0, 0.0, 1.0, // red, green, blue and alpha
 *            0.0, 1.0, 0.0, 1.0,
 *            0.0, 0.0, 1.0, 1.0
 *      ];
 *      colors.itemSize = 4;
 *      colors.numItems = 3;
 *
 *  rotation
 *  must have degress object
 *  must have rotateMatrix object
 *  must have amount object
 * @param translationMatrix
 */
function drawTriange(translationMatrix,colors, rotation) { // [-1.5, 0.0, -7.0]
    if(colors == undefined)
        colors = White(3);
    var triangleVertexPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexPositionBuffer);
    var vertices = [
        0.0,  1.0,  0.0,
        -1.0, -1.0,  0.0,
        1.0, -1.0,  0.0
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    triangleVertexPositionBuffer.itemSize = 3;
    triangleVertexPositionBuffer.numItems = 3;


    var triangleVertexColorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexColorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
    triangleVertexColorBuffer.itemSize = colors.itemSize; //4
    triangleVertexColorBuffer.numItems = colors.numItems; //3

    if(translationMatrix == undefined)
        translationMatrix = [0.0, 0.0, -7.0];
    mat4.translate(mvMatrix, translationMatrix);

    if(rotation != undefined) {
        mvPushMatrix();
        mat4.rotate(mvMatrix, degToRad(rotation.degrees), rotation.rotateMatrix);
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexPositionBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, triangleVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexColorBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, triangleVertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);
    setMatrixUniforms();
    gl.drawArrays(gl.TRIANGLES, 0, triangleVertexPositionBuffer.numItems);
    if(rotation != undefined)
        mvPopMatrix();
}

var lastTime = 0;

function animate(tickArray) {
    var timeNow = new Date().getTime();
    if (lastTime != 0) {
        var elapsed = timeNow - lastTime;

        for(var i = 0; i<tickArray.length; i++)
            tickArray[i].degrees += (tickArray[i].amount * elapsed)/1000.0;
    }
    lastTime = timeNow;
}
function vertices(vertexes, itemSize,drawType) {
    vertexes.itemSize = itemSize;
    vertexes.numItems = vertexes.length / itemSize;
    vertexes.drawType = drawType;
    return vertexes;
}

function tick() {
    drawLocalScene();
    if(tickArray.length != 0) {
        requestAnimFrame(tick);
        drawLocalScene();
        animate(tickArray);
    }
}
var tickArray = [];
var values = [];
var color;
function drawLocalScene() {
    drawScene();

    var vertice = [
        vec3(0, 1, 0),
        vec3(Math.sqrt(3)/2, 0, -0.5),
        vec3(-Math.sqrt(3)/2, 0, -0.5),
        vec3(0, 0, 1)
        // vec3(  0,  1 , 0), // top middle
        // vec3( -1, 0, -1), // bottom left back
        // vec3(  -1, 0, 1), //bottom left front
        // vec3(  1, 0, -1), // bottom right front
        // vec3(  1, 0, 1) // bottom right front
    ];

    if (values.length == 0) {
        divideTriangle3dMemoize(vertice[0], vertice[1], vertice[2],vertice[3],//vertice[4],
            NumTimesToSubdivide);
        randomizeArray(pointsArray);
        // for (var i = 0; i < pointsArray.length; i++)
        //     values = values.concat(pointsArray[i]);
        for (var i = 0; i < triangleArray.length; i++)
            values = values.concat(pointsArray[triangleArray[i]]);

        // color = ColorLightToDark([[1,1,1,1],[.63,.23,.01,1],[0,0,0,1]],values.length);
        color = Color([[.23,.19,.89,1],[.63,.23,.01,1],[.91,.3,.3,1]],values.length);
    }
    var rotation = [0,1,0];
    rotation.degrees = 0;
    rotation.rotateMatrix = [0,1,0];
    rotation.amount = 30;
    if(tickArray.length == 0)
        tickArray.push(rotation);

    drawArrayOfVertices(vertices(values,3,gl.TRIANGLES),
        [0.0, -0.4, -3.0],
        color,
        tickArray[0]);

}

function triangle2d( a, b, c ){
    points.push( a, b, c );
}function triangle3d( a, b, c, d, e ){
    points.push(
        a, b, c, a,
        b, c, a, b,
        c, e, a, c,
        d, b, a, d,
        e, d, a, e
        // b, c, d, b
        // e,d,c,e
    );
}function triangle(pointsArray) { //does not fill in the bottom of a 3d object
    if(pointsArray.length === 3)
        for(var i = 0; i < pointsArray.length;  i++)
            points.push(pointsArray[i]);
    else
        for(var i=0; i<pointsArray.length; i++)
            points.push(pointsArray[i],pointsArray[i+1],pointsArray[i===0?i+2:0],pointsArray[i]);
}
function randomNumber(min,max) {
    var temp;
    if(min > max){
        temp = min;
        min = max;
        max = temp;
    }
    return Math.random() * (max - min) + min;
}
var NumTimesToSubdivide = 4; //5 for 2d
var randomize = [0.1,0.1,0.1];//[.01,.1,.1]; //.04 for 2d
var shrinkPercent = 200;//%
var points = [];
function sierpinski(a,b,c,count){
    if(count === 0)
        return triangle(a,b,c);

}
function randomizeArray(combo) {
    var count = 1;
    for(var i = 0; i<randomize.length; i++)
        randomize[i]/=1+1/(count*shrinkPercent/100);
    for(var i = 0; i<combo.length; i++)
        for(var j = 0; j<combo[i].length; j++)
            combo[i][j] = randomNumber(combo[i][j]-randomize[j], combo[i][j]+randomize[j]);
    return combo;
}

var pointsArray = [];
var triangleArray = [];
function divideTriangle3dMemoize( a, b, c, d, count ){
    // check for end of recursion
    if ( count === 0 )
        return triangleArray.push(
            arrayIndexOf(pointsArray,a),arrayIndexOf(pointsArray,b),arrayIndexOf(pointsArray,c),
            arrayIndexOf(pointsArray,a),arrayIndexOf(pointsArray,c),arrayIndexOf(pointsArray,d),
            arrayIndexOf(pointsArray,a),arrayIndexOf(pointsArray,d),arrayIndexOf(pointsArray,b));

    //bisect the sides
    var ab = mix( a, b, 0.5 );
    var ac = mix( a, c, 0.5 );
    var ad = mix( a, d, 0.5 );

    var bc = mix( b, c, 0.5 );
    var bd = mix( b, d, 0.5 );

    var cd = mix( c, d, 0.5 );

    var p = [a,b,c,d,ab,ac,ad,bc,bd,cd];
    for(var i = 0; i<p.length; i++) {
        for(var j = 0; j<p[i].length; j++)
            p[i][j] = parseFloat(p[i][j].toFixed(4));
        if (arrayIndexOf(pointsArray,p[i]) < 0)
            pointsArray.push(p[i]);
    }
    --count;

    a = p[0]; b = p[1]; c = p[2]; d = p[3];
    ab = p[4]; ac = p[5]; ad = p[6]; bc = p[7]; bd = p[8]; cd = p[9];

    // three new triangles
    divideTriangle3dMemoize( a, ad, ab, ac, count );
    divideTriangle3dMemoize( b, ab, bd, bc, count );
    divideTriangle3dMemoize( c, bc, ac, cd, count );
    divideTriangle3dMemoize( d, bd, cd, ad, count );

    //fill in inside with gaskets
    divideTriangle2dMemoize( ab, bd, ad, count );
    divideTriangle2dMemoize( bc, ab, ac, count );
    divideTriangle2dMemoize( cd, ad, ac, count );
}
function arrayIndexOf(array, item) {
    for (var i = 0; i < array.length; i++){
        var v = true;
        for(var j = 0; j<array[i].length; j++)
            v&=array[i][j] === item[j];
        if(v)
            return i;
    }
    return -1;   // Not found
}
function divideTriangle2dMemoize( a, b, c, count ){
    // check for end of recursion
    if ( count === 0 )
        return triangleArray.push(arrayIndexOf(pointsArray,a),arrayIndexOf(pointsArray,b),arrayIndexOf(pointsArray,c));

    //bisect the sides
    var ab = mix( a, b, 0.5 );
    var ac = mix( a, c, 0.5 );
    var bc = mix( b, c, 0.5 );

    var p = [a,b,c,ab,ac,bc];
    for(var i = 0; i<p.length; i++) {
        for(var j = 0; j<p[i].length; j++)
            p[i][j] = parseFloat(p[i][j].toFixed(4));
        if (arrayIndexOf(pointsArray,p[i]) < 0)
            pointsArray.push(p[i]);
    }

    --count;

    // three new triangles
    divideTriangle2dMemoize( p[0], p[0+3], p[1+3], count );
    divideTriangle2dMemoize( p[2], p[1+3], p[2+3], count );
    divideTriangle2dMemoize( p[1], p[2+3], p[0+3], count );

    //fill in the triangle
    divideTriangle2dMemoize( p[1+3], p[2+3], p[0+3], count );
}
function divideTriangle2d( a, b, c, count ){
    // check for end of recursion

    if ( count === 0 )
        return triangle2d( a, b, c );

    //bisect the sides
    var ab = mix( a, b, 0.5 );
    var ac = mix( a, c, 0.5 );
    var bc = mix( b, c, 0.5 );

    for(var i = 0; i<randomize.length; i++)
        randomize[i]/=1+1/(count*shrinkPercent/100);
    var combo = [ab,ac,bc];
    for(var i = 0; i<combo.length; i++)
        for(var j = 0; j<combo[i].length; j++)
            combo[i][j] = randomNumber(combo[i][j]-randomize[j], combo[i][j]+randomize[j]);

    --count;
    // three new triangles
    divideTriangle2d( a, combo[0], combo[1], count );
    divideTriangle2d( c, combo[1], combo[2], count );
    divideTriangle2d( b, combo[2], combo[0], count );

    //fill in the triangle
    // triangle(combo.reverse());
}
function divideTriange(pointArray, divisionCount) {
    if(divisionCount === 0)
        return triangle(pointArray);
    var points = [];
    var options = [];
    for(var i = 0; i<pointArray.length; i++)
        for(var j = i; j<pointArray.length; j++){
            if(options.contains([i,j]))
                continue;
            options.push([i,j]);
            points.push(mix(pointArray[i],pointArray[j],0.5));
        }

    for(var i = 0; i<points.length; i++)
        for(var j = 0; j<points[i].length; j++)
            points[i][j] = randomNumber(points[i][j]-randomize, points[i][j]+randomize);

    divisionCount--;
    for(var i = 0; i<pointArray.length; i++) {
        var divideArray = [pointArray[i]];
        for (var j = 0; j < pointArray.length; j++)
            divideArray.push();
        divideTriange(divideArray, divisionCount);
    }

}

function divideTriangle3d( a, b, c, d, e, count ){
    // check for end of recursion

    if ( count === 0 ) {
        triangle3d( a, b, c, d, e );
    }
    else {
        //bisect the sides
        var ab = mix( a, b, 0.5 );
        var ac = mix( a, c, 0.5 );
        var ad = mix( a, d, 0.5 );
        var ae = mix( a, e, 0.5 );

        var bc = mix( b, c, 0.5 );
        var bd = mix( b, d, 0.5 );

        var ed = mix( e, d, 0.5 );
        var ec = mix( e, c, 0.5 );

        var mid = mix(b,e,0.5)

        var combo = [ab,ac,ad,ae,bc,bd,ec,ed,mid];
        for(var i = 0; i<combo.length; i++)
            for(var j = 0; j<combo[i].length; j++)
                combo[i][j] = randomNumber(combo[i][j]-randomize, combo[i][j]+randomize);

        --count;

        // three new triangles
        // too slow
        divideTriangle3d( a, combo[0], combo[1], combo[2], combo[3], count );
        divideTriangle3d( b, combo[0], combo[4], combo[5], combo[8], count );
        divideTriangle3d( c, combo[1], combo[4], combo[6], combo[8], count );
        divideTriangle3d( d, combo[2], combo[5], combo[7], combo[8], count );
        divideTriangle3d( e, combo[3], combo[6], combo[7], combo[8], count );
        // divideTriangle3d( a, combo[0], combo[1], combo[2], combo[3], count );
        // divideTriangle2d( b, combo[0], combo[4], count );
        // divideTriangle2d( c, combo[1], combo[4], count );
        // divideTriangle2d( d, combo[2], combo[5], count );
        // divideTriangle2d( e, combo[3], combo[6], count );
    }
}

/* Examples draws 2 triangles and 2 squares different colors then rotates one square
    var colors = [
        1.0, 0.0, 0.0, 1.0,
        0.0, 1.0, 0.0, 1.0,
        0.0, 0.0, 1.0, 1.0
    ];
    colors.itemSize = 4;
    colors.numItems = 3;

    drawTriange([-1.5, 1.0, -7.0],colors);
    drawSquare([3.0, 0.0, 0.0],dupeArray(4,[0.5, 0.5, 1.0, 1.0]));

    var rotation = [0,1,0];
    rotation.degrees = 0;
    rotation.rotateMatrix = [0,1,0];
    rotation.amount = 40;
    if(tickArray.length == 0)
        tickArray.push(rotation);
    drawSquare([0.0, -3.0, 0.0],new Red(4),tickArray[0]);

    drawTriange([-3,0,0]);
*/


function webGLStart() {
    fullInitialize();

    tick();
}