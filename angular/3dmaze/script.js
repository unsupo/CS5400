/**
 * Created by jarndt on 10/6/16.
 */

function webGLStart() {
    fullInitialize();

    var images = [
        "resources/cubetexture.png", //wall
        "resources/tile.jpg", //ceiling
        "resources/ceiling.png", //floor
    ];
    for(var i = 0; i<images.length; i++)
        switch (i) {
            case 0:
                textures.wall = initTexture(images[i]);
                break;
            case 1:
                textures.ceiling = initTexture(images[i]);
                break;
            case 2:
                textures.floor = initTexture(images[i]);
                break;
        }

    if(!mazeDraw) {
        var m = new Maze(10, 10);
        var v = m.drawMaze();
        for(var i = 0; i<v.length; i++)
            objects.push(v[i]);
    }
    KeyInput.setUpKeys();

    tick();
}

var objects = [];
var textures = {
    wall: null,
    floor: null,
    ceiling: null,
};

var mazeDraw = false;

function tick() {
    requestAnimFrame(tick);
    handleKeys();
    drawScene();
    animate();
}


var height = 2;
var timeOfJump = 2;//in seconds
var yOfGround = 0.4;

var pitch = 0;
var pitchRate = 0;
var yaw = 0;
var yawRate = 0;
var xPos = 0;
var yPos = yOfGround;
var zPos = 0;
var xSpeed = 0;
var ySpeed = 0;
var jump = false;
var fly = false;
var spaceKeyPressTime = -1;
var spaceBarPressCount = 0;

function handleKeys() {
    pitchRate = 0;
    xSpeed = 0;
    ySpeed = 0;
    yawRate = 0;
    flyHeight = 0;
    // pitchRate for looking up and down //want to change these to mouse
    if(KeyInput.isPressed(KeyInput.KEY_NAMES.PAGE_UP) ||
        KeyInput.isPressed(KeyInput.KEY_NAMES.UP_ARROW))  //separate for simultaneous key press
        pitchRate = 0.1;
    else if(KeyInput.isPressed(KeyInput.KEY_NAMES.PAGE_DOWN) ||
        KeyInput.isPressed(KeyInput.KEY_NAMES.DOWN_ARROW))
        pitchRate = -0.1;
    // yawRate for looking left and right //want to change these to mouse
    if(KeyInput.isPressed(KeyInput.KEY_NAMES.RIGHT_ARROW)) //separate for simultaneous key press
        yawRate = -0.1;
    else if(KeyInput.isPressed(KeyInput.KEY_NAMES.LEFT_ARROW))
        yawRate = 0.1;
    // speed for moving forward or back
    if(KeyInput.isPressed(KeyInput.KEY_NAMES.LOWER_W)) //separate for simultaneous key press
        xSpeed = 0.003;
    else if(KeyInput.isPressed(KeyInput.KEY_NAMES.LOWER_S))
        xSpeed = -0.003;
    // speed for moving right and left
    if(KeyInput.isPressed(KeyInput.KEY_NAMES.LOWER_A)) //separate for simultaneous key press
        ySpeed = 0.003;
    else if(KeyInput.isPressed(KeyInput.KEY_NAMES.LOWER_D))
        ySpeed = -0.003;

    if(KeyInput.isPressed(KeyInput.KEY_NAMES.SPACE)) {
        // var now = new Date().getTime();
        jump = true;
        // if(++spaceBarPressCount > 8)
        //     spaceBarPressCount=0;
        // if(spaceKeyPressTime<0)
        //     spaceKeyPressTime = now;
        // else if(now - spaceKeyPressTime <= 500 && spaceBarPressCount == 8){
        //     spaceKeyPressTime = -1;
        //     jump = false;
        //     if(fly)
        //         fly = false;
        //     else
        //         fly = true;
        // }
        // if(fly) {
        //     jump = false;
        //     flyHeight = 0.00003;
        // }
        // console.log("Space Bar Pressed");
    }else if(KeyInput.isPressed(KeyInput.KEY_NAMES.SHIFT) && fly)
        flyHeight = -0.00003;

}

var flyHeight;
var lastTime = 0;
// Used to make us "jog" up and down as we move forward.
var joggingAngle = 0;
var jumpStartTime = -1;

function animate() {
    var timeNow = new Date().getTime();
    if (lastTime != 0) {
        var elapsed = timeNow - lastTime;
        if (xSpeed != 0 || ySpeed != 0) {
            xPos -= xSpeed * elapsed*Math.sin(degToRad(yaw));
            zPos -= xSpeed * elapsed*Math.cos(degToRad(yaw));
            joggingAngle += elapsed * 0.4; // 0.6 "fiddle factor" - makes it feel more realistic :-)
            // if(!fly)
                yPos =0.4 +  Math.sin(degToRad(joggingAngle)) / 20; //y moves up and down in a sin wave
        }
        if(jump){
            if(jumpStartTime < 0)
                jumpStartTime = timeNow - 10;

            var t = timeNow - jumpStartTime;
            t/=1000;
            //y(t) = Height - (t - T/2)² + y_of_the_ground
            yPos += height - Math.pow(t - timeOfJump/2,2);

            if(yPos <= yOfGround){
                yPos = yOfGround;
                jumpStartTime = -1;
                jump = false;
            }
        }
            // else if(fly)
        //     yPos += flyHeight * elapsed;

        yaw += yawRate * elapsed;
        pitch += pitchRate * elapsed;
    }
    lastTime = timeNow;
}

function drawScene() {
    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    mat4.perspective(45, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0, pMatrix);

    mat4.identity(mvMatrix);
    mat4.rotate(mvMatrix, degToRad(-pitch), [1, 0, 0]);
    mat4.rotate(mvMatrix, degToRad(-yaw), [0, 1, 0]);
    mat4.translate(mvMatrix, [-xPos, -yPos, -zPos]);

    for(var i = 0; i<objects.length; i++) {
        gl.bindBuffer(gl.ARRAY_BUFFER, objects[i].cubeVertexPositionBuffer);
        gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute,
            objects[i].cubeVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER,objects[i].cubeVertexTextureCoordBuffer);
        gl.vertexAttribPointer(shaderProgram.textureCoordAttribute,objects[i].cubeVertexTextureCoordBuffer.itemSize
            , gl.FLOAT, false, 0, 0);

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, objects[i].texture);
        gl.uniform1i(shaderProgram.samplerUniform, 0);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,objects[i].cubeVertexIndexBuffer);
        setMatrixUniforms();
        gl.drawElements(gl.TRIANGLES,objects[i].cubeVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
    }
}

