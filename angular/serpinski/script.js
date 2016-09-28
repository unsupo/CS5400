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
    for(var i = 0; i<neededSize*4; i++)
        tempArray = tempArray.concat(colorArrays[i%colorArrays.length]);
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
function drawLocalScene() {
    drawScene();

    var vertice = [
        vec2( -1, -1 ),
        vec2(  0,  1 ),
        vec2(  1, -1 )
    ];

    if(points.length == 0)
        divideTriangle( vertice[0], vertice[1], vertice[2],
                    NumTimesToSubdivide);

    var values = [];
    for(var i = 0; i<points.length; i++)
        values = values.concat(points[i]);

    var rotation = [0,1,0];
    rotation.degrees = 0;
    rotation.rotateMatrix = [0,1,0];
    rotation.amount = 40;
    if(tickArray.length == 0)
        tickArray.push(rotation);

    drawArrayOfVertices(vertices(values,2,gl.TRIANGLES),
        [0.0, 0.0, -4.0],
        Color([[.23,.19,.89,1],[.63,.23,.01,1],[.91,.3,.3,1]],points.length),
        tickArray[0]);

}

function triangle( a, b, c )
{
    points.push( a, b, c );
}
var NumTimesToSubdivide = 5;
var points = [];
function divideTriangle( a, b, c, count )
{

    // check for end of recursion

    if ( count === 0 ) {
        triangle( a, b, c );
    }
    else {

        //bisect the sides

        var ab = mix( a, b, 0.5 );
        var ac = mix( a, c, 0.5 );
        var bc = mix( b, c, 0.5 );

        --count;

        // three new triangles

        divideTriangle( a, ab, ac, count );
        divideTriangle( c, ac, bc, count );
        divideTriangle( b, bc, ab, count );
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