function Sphere(latitudeBands,longitudeBands,radius) {
    var self = this;

    if(!self.latitudeBands || !self.longitudeBands || !self.radius){
        self.latitudeBands = 30;
        self.longitudeBands = 30;
        self.radius = 2;
    }else{
        self.latitudeBands = latitudeBands;
        self.longitudeBands = longitudeBands;
        self.radius = radius;
    }

    self.cubeVertexPositionData = [];
    var normalData = [];
    var textureCoordData = [];
    for (var latNumber=0; latNumber <= self.latitudeBands; latNumber++) {
        var theta = latNumber * Math.PI / self.latitudeBands;
        var sinTheta = Math.sin(theta);
        var cosTheta = Math.cos(theta);

        for (var longNumber=0; longNumber <= self.longitudeBands; longNumber++) {
            var phi = longNumber * 2 * Math.PI / self.longitudeBands;
            var sinPhi = Math.sin(phi);
            var cosPhi = Math.cos(phi);

            var x = cosPhi * sinTheta;
            var y = cosTheta;
            var z = sinPhi * sinTheta;
            var u = 1 - (longNumber / self.longitudeBands);
            var v = 1 - (latNumber / self.latitudeBands);

            normalData.push(x);
            normalData.push(y);
            normalData.push(z);
            textureCoordData.push(u);
            textureCoordData.push(v);
            self.cubeVertexPositionData.push(self.radius * x);
            self.cubeVertexPositionData.push(self.radius * y);
            self.cubeVertexPositionData.push(self.radius * z);
        }
    }

    var indexData = [];
    for (var latNumber=0; latNumber < self.latitudeBands; latNumber++) {
        for (var longNumber=0; longNumber < self.longitudeBands; longNumber++) {
            var first = (latNumber * (self.longitudeBands + 1)) + longNumber;
            var second = first + self.longitudeBands + 1;
            indexData.push(first);
            indexData.push(second);
            indexData.push(first + 1);

            indexData.push(second);
            indexData.push(second + 1);
            indexData.push(first + 1);
        }
    }



    function buildObject() {

        self.cubeVertexNormalBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, self.cubeVertexNormalBuffer);

        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normalData), gl.STATIC_DRAW);
        self.cubeVertexNormalBuffer.itemSize = 3;
        self.cubeVertexNormalBuffer.numItems = normalData.length / 3;

        self.cubeVertexTextureCoordBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, self.cubeVertexTextureCoordBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoordData), gl.STATIC_DRAW);

        self.cubeVertexTextureCoordBuffer.itemSize = 2;
        self.cubeVertexTextureCoordBuffer.numItems = textureCoordData.length / 2;

        self.cubeVertexPositionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, self.cubeVertexPositionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(self.cubeVertexPositionData), gl.STATIC_DRAW);

        self.cubeVertexPositionBuffer.itemSize = 3;
        self.cubeVertexPositionBuffer.numItems = self.cubeVertexPositionData.length / 3;

        self.cubeVertexIndexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, self.cubeVertexIndexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indexData), gl.STATIC_DRAW);

        self.cubeVertexIndexBuffer.itemSize = 1;
        self.cubeVertexIndexBuffer.numItems = indexData.length;
    }

    self.buildObject = function () {
        // for(var i = 0; i<self.verts.length; i++) {
        //     var vals = multiply(self.verts[i], self.mult);
        //     vals = translate(vals,self.translateValue);
        //     vals = rotate(vals,degToRad(self.rotateValue.degree), self.rotateValue);
        //
        //     vals = flatten(vals);
        //     for(var j = 0; j<vals.length; j++)
        //         self.vertices.push(vals[j]);
        // }

        buildObject();
    };
    self.push = function (vertexPositionBuffer,vertexTextureCoordBuffer,vertexIndexBuffer) {
        vertexIndexBuffer.push(self.cubeVertexIndexBuffer);
        vertexPositionBuffer.push(self.cubeVertexPositionBuffer);
        vertexTextureCoordBuffer.push(self.cubeVertexTextureCoordBuffer);
    }
}
