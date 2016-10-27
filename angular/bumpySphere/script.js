// require('../../common/keyinput.js');
// require('../../common/initializeWebGL.js');

function webGLStart() {
    init();
    var c = new Sphere();
    c.texture = textures.moon;
    c.buildObject();
    objects.push(c);

    initGL();  // initialize the WebGL graphics context

    rotator = new TrackballRotator(canvas, draw, 5, [2,2,3]);
    rotator.setView(5,[2,2,3]);
    draw();
    loadBumpmap();
};
var gl;
var textureLoading = false;
var bumpmapLoading = false;
var projection = mat4.create();
var normalMatrix = mat3.create();
var rotator;
var draws = false;
var objects = [];
var textures = {
    moon: null
};
function tick() {
    requestAnimFrame(tick);
    handleKeys();
    drawScene();
    animate();
}
function draw() {

    gl.clearColor(0,0,0,1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    if (textureLoading || bumpmapLoading) {
        return;
    }

    var strength = 5;
    gl.uniform1f(u_bumpmapStrength, strength);

    modelview = rotator.getViewMatrix();
    var objectNum = 0;
    objects[objectNum].render();
}
/* Initialize the WebGL context.  Called from init() */
function initGL() {
    var prog = createProgram(gl,"shader-vs","shader-fs");
    gl.useProgram(prog);
    gl.enable(gl.DEPTH_TEST);

    /* Get attribute and uniform locations and create the buffers */

    a_coords_loc =  gl.getAttribLocation(prog, "a_coords");
    a_normal_loc =  gl.getAttribLocation(prog, "a_normal");
    a_tangent_loc =  gl.getAttribLocation(prog, "a_tangent");
    a_texCoords_loc =  gl.getAttribLocation(prog, "a_texCoords");
    gl.enableVertexAttribArray(a_normal_loc);
    gl.enableVertexAttribArray(a_tangent_loc);
    gl.enableVertexAttribArray(a_coords_loc);
    gl.enableVertexAttribArray(a_texCoords_loc);
    u_modelview = gl.getUniformLocation(prog, "modelview");
    u_projection = gl.getUniformLocation(prog, "projection");
    u_normalMatrix =  gl.getUniformLocation(prog, "normalMatrix");

    u_texture = gl.getUniformLocation(prog, "texture");
    u_useTexture = gl.getUniformLocation(prog, "useTexture");
    u_bumpmap = gl.getUniformLocation(prog, "bumpmap");
    u_bumpmapSize = gl.getUniformLocation(prog, "bumpmapSize");
    u_bumpmapStrength = gl.getUniformLocation(prog, "bumpmapStrength");

    gl.uniform1i( u_useTexture, 0 );
    gl.uniform1i( u_texture, 0 );
    gl.uniform1i( u_bumpmap, 1 );
    texture = gl.createTexture();
    bumpmap = gl.createTexture();

    u_material = {
        diffuseColor: gl.getUniformLocation(prog, "material.diffuseColor"),
        specularColor: gl.getUniformLocation(prog, "material.specularColor"),
        specularExponent: gl.getUniformLocation(prog, "material.specularExponent")
    };
    u_lights = new Array(3);
    for (var i = 0; i < 3; i++) {
        u_lights[i] = {
            enabled: gl.getUniformLocation(prog, "lights[" + i + "].enabled"),
            position: gl.getUniformLocation(prog, "lights[" + i + "].position"),
            color: gl.getUniformLocation(prog, "lights[" + i + "].color"),
        };
    }

    /* Set up values for material and light uniforms; these values don't change in this program. */

    gl.uniform3f( u_material.diffuseColor, 1, 1, 1 );
    gl.uniform3f( u_material.specularColor, 0.2, 0.2, 0.2 );
    gl.uniform1f( u_material.specularExponent, 32 );
    for (var i = 0; i < 3; i++) {
        gl.uniform1i( u_lights[i].enabled, 0 );
    }
    gl.uniform1i( u_lights[0].enabled, 1 );           // in the end, I decided to use only the viewpoint light
    gl.uniform4f( u_lights[0].position, 0, 0, 1, 0 );
    gl.uniform3f( u_lights[0].color, 0.6,0.6,0.6);
    gl.uniform4f( u_lights[1].position, -1, -1, 1, 0 );
    gl.uniform3f( u_lights[1].color, 0.3,0.3,0.3 );
    gl.uniform4f( u_lights[2].position, 0, 3, -1, 0 );
    gl.uniform3f( u_lights[2].color, 0.3,0.3,0.3 );

    mat4.perspective(projection, Math.PI/10, 1, 1, 10);
    gl.uniformMatrix4fv(u_projection, false, projection);

    objects = new Array(6);
    objects[0] = createModel(sphere());

    mat4.perspective(projection, Math.PI/10, 1, 1, 10);
    gl.uniformMatrix4fv(u_projection, false, projection);

} // end initGL()
function createProgram(gl, vertexShaderID, fragmentShaderID) {
    function getTextContent( elementID ) {
        // This nested function retrieves the text content of an
        // element on the web page.  It is used here to get the shader
        // source code from the script elements that contain it.
        var element = document.getElementById(elementID);
        var node = element.firstChild;
        var str = "";
        while (node) {
            if (node.nodeType == 3) // this is a text node
                str += node.textContent;
            node = node.nextSibling;
        }
        return str;
    }
    var vertexShaderSource = getTextContent( vertexShaderID );
    var fragmentShaderSource = getTextContent( fragmentShaderID );
    var vsh = gl.createShader( gl.VERTEX_SHADER );
    gl.shaderSource(vsh,vertexShaderSource);
    gl.compileShader(vsh);
    if ( ! gl.getShaderParameter(vsh, gl.COMPILE_STATUS) ) {
        throw "Error in vertex shader:  " + gl.getShaderInfoLog(vsh);
    }
    var fsh = gl.createShader( gl.FRAGMENT_SHADER );
    gl.shaderSource(fsh, fragmentShaderSource);
    gl.compileShader(fsh);
    if ( ! gl.getShaderParameter(fsh, gl.COMPILE_STATUS) ) {
        throw "Error in fragment shader:  " + gl.getShaderInfoLog(fsh);
    }
    var prog = gl.createProgram();
    gl.attachShader(prog,vsh);
    gl.attachShader(prog, fsh);
    gl.linkProgram(prog);
    if ( ! gl.getProgramParameter( prog, gl.LINK_STATUS) ) {
        throw "Link error in program:  " + gl.getProgramInfoLog(prog);
    }
    return prog;
}function init() {
    canvas = document.getElementById("gl-canvas");
    gl = canvas.getContext("webgl") ||
    canvas.getContext("experimental-webgl");
    if ( ! gl ) {
        throw "Browser does not support WebGL";
    }

}function loadBumpmap() {
    bumpmapLoading = true;
    draw();
    var img = new Image();
    img.onload = function() {
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D,bumpmap);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.LUMINANCE, gl.LUMINANCE, gl.UNSIGNED_BYTE, img);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        bumpmapLoading = false;
        gl.uniform2f(u_bumpmapSize, img.width, img.height);
        draw();
    };
    img.src = "resources/moon_lro_bumpmap.jpg";
}
function cube(side) {
    var s = (side || 1)/2;
    var coords = [];
    var normals = [];
    var tangents = []
    var texCoords = [];
    var indices = [];
    function face(xyz, nrm, tang) {
        var start = coords.length/3;
        var i;
        for (i = 0; i < 12; i++) {
            coords.push(xyz[i]);
        }
        for (i = 0; i < 4; i++) {
            normals.push(nrm[0],nrm[1],nrm[2]);
        }
        for (i = 0; i < 4; i++) {
            tangents.push(tang[0],tang[1],tang[2]);
        }
        texCoords.push(0,0,1,0,1,1,0,1);
        indices.push(start,start+1,start+2,start,start+2,start+3);
    }
    face( [-s,-s,s, s,-s,s, s,s,s, -s,s,s], [0,0,1], [1,0,0] );
    face( [-s,-s,-s, -s,s,-s, s,s,-s, s,-s,-s], [0,0,-1], [0,1,0] );
    face( [-s,s,-s, -s,s,s, s,s,s, s,s,-s], [0,1,0], [0,0,1] );
    face( [-s,-s,-s, s,-s,-s, s,-s,s, -s,-s,s], [0,-1,0], [1,0,0] );
    face( [s,-s,-s, s,s,-s, s,s,s, s,-s,s], [1,0,0], [0,1,0] );
    face( [-s,-s,-s, -s,-s,s, -s,s,s, -s,s,-s], [-1,0,0], [0,0,1] );
    return {
        vertexPositions: new Float32Array(coords),
        vertexNormals: new Float32Array(normals),
        vertexTextureCoords: new Float32Array(texCoords),
        vertexTangents: new Float32Array(tangents),
        indices: new Uint16Array(indices)
    }
}
function sphere() {
    var normalData = [];
    var textureCoordData = [];
    var cubeVertexPositionData = [];
    var tangents = [];
    var latitudeBands = 100;
    var longitudeBands = 100;
    var radius = .5;

    for (var latNumber=0; latNumber <= latitudeBands; latNumber++) {
        var theta = latNumber * Math.PI / latitudeBands;
        var sinTheta = Math.sin(theta);
        var cosTheta = Math.cos(theta);

        for (var longNumber=0; longNumber <= longitudeBands; longNumber++) {
            var phi = longNumber * 2 * Math.PI / longitudeBands;
            var sinPhi = Math.sin(phi);
            var cosPhi = Math.cos(phi);

            var x = cosPhi * sinTheta;
            var y = cosTheta;
            var z = sinPhi * sinTheta;
            var u = 1 - (longNumber / longitudeBands);
            var v = 1 - (latNumber / latitudeBands);

            normalData.push(x);
            normalData.push(y);
            normalData.push(z);

            textureCoordData.push(u);
            textureCoordData.push(v);

            cubeVertexPositionData.push(radius * x);
            cubeVertexPositionData.push(radius * y);
            cubeVertexPositionData.push(radius * z);

            // tangents.push(radius * x - );
            // tangents.push(radius * y);
            tangents.push(radius * Math.sqrt(x*x+y*y+z*z));
            tangents.push(radius * Math.sqrt(x*x+y*y+z*z));
            tangents.push(radius * Math.sqrt(x*x+y*y+z*z));
        }
    }

    var indexData = [];
    for (var latNumber=0; latNumber < latitudeBands; latNumber++) {
        for (var longNumber=0; longNumber < longitudeBands; longNumber++) {
            var first = (latNumber * (longitudeBands + 1)) + longNumber;
            var second = first + longitudeBands + 1;
            indexData.push(first);
            indexData.push(second);
            indexData.push(first + 1);

            indexData.push(second);
            indexData.push(second + 1);
            indexData.push(first + 1);
        }
    }
    return {
        vertexPositions: new Float32Array(cubeVertexPositionData),
        vertexNormals: new Float32Array(normalData),
        vertexTextureCoords: new Float32Array(textureCoordData),
        vertexTangents: new Float32Array(tangents),
        indices: new Uint16Array(indexData)
    }
}


function createModel(modelData) {
    var model = {};
    model.coordsBuffer = gl.createBuffer();
    model.normalBuffer = gl.createBuffer();
    model.tangentBuffer = gl.createBuffer();
    model.texCoordsBuffer = gl.createBuffer();
    model.indexBuffer = gl.createBuffer();
    model.count = modelData.indices.length;
    gl.bindBuffer(gl.ARRAY_BUFFER, model.coordsBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, modelData.vertexPositions, gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, model.normalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, modelData.vertexNormals, gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, model.tangentBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, modelData.vertexTangents, gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, model.texCoordsBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, modelData.vertexTextureCoords, gl.STATIC_DRAW);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, model.indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, modelData.indices, gl.STATIC_DRAW);
    model.render = function() {  // This function will render the object.
        // Since the buffer from which we are taking the coordinates and normals
        // change each time an object is drawn, we have to use gl.vertexAttribPointer
        // to specify the location of the data. And to do that, we must first
        // bind the buffer that contains the data.  Similarly, we have to
        // bind this object's index buffer before calling gl.drawElements.
        gl.bindBuffer(gl.ARRAY_BUFFER, this.coordsBuffer);
        gl.vertexAttribPointer(a_coords_loc, 3, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
        gl.vertexAttribPointer(a_normal_loc, 3, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.tangentBuffer);
        gl.vertexAttribPointer(a_tangent_loc, 3, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.texCoordsBuffer);
        gl.vertexAttribPointer(a_texCoords_loc, 2, gl.FLOAT, false, 0, 0);
        gl.uniformMatrix4fv(u_modelview, false, modelview );
        mat3.normalFromMat4(normalMatrix, modelview);
        gl.uniformMatrix3fv(u_normalMatrix, false, normalMatrix);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        gl.drawElements(gl.TRIANGLES, this.count, gl.UNSIGNED_SHORT, 0);
    }
    return model;
}


function render() {  // This function will render the object.
    // Since the buffer from which we are taking the coordinates and normals
    // change each time an object is drawn, we have to use gl.vertexAttribPointer
    // to specify the location of the data. And to do that, we must first
    // bind the buffer that contains the data.  Similarly, we have to
    // bind this object's index buffer before calling gl.drawElements.
    gl.bindBuffer(gl.ARRAY_BUFFER, this.coordsBuffer);
    gl.vertexAttribPointer(a_coords_loc, 3, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
    gl.vertexAttribPointer(a_normal_loc, 3, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.tangentBuffer);
    gl.vertexAttribPointer(a_tangent_loc, 3, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.texCoordsBuffer);
    gl.vertexAttribPointer(a_texCoords_loc, 2, gl.FLOAT, false, 0, 0);
    gl.uniformMatrix4fv(u_modelview, false, modelview );
    mat3.normalFromMat4(normalMatrix, modelview);
    gl.uniformMatrix3fv(u_normalMatrix, false, normalMatrix);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
    gl.drawElements(gl.TRIANGLES, this.count, gl.UNSIGNED_SHORT, 0);
}
