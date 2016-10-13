function Cube(x,y,z) {
    var self = this;

    if(!x || !y || !z){
        self.x = 1;
        self.y = 1;
        self.z = 1;
    }else{
        self.x = x;
        self.y = y;
        self.z = z;
    }

    self.mult = [
        [self.x, 0,  0,],
        [0, self.y,  0,],
        [0,  0, self.z,],
    ];

    self.verts = [
        // Front face
        [[
        -1.0, -1.0,  1.0,],[
        1.0, -1.0,  1.0,],[
        1.0,  1.0,  1.0,]],[[
        -1.0,  1.0,  1.0,],[
        // Back face
        -1.0, -1.0, -1.0,],[
        -1.0,  1.0, -1.0,]],[[
        1.0,  1.0, -1.0,],[
        1.0, -1.0, -1.0,],[
        // Top face
        -1.0,  1.0, -1.0,]],[[
        -1.0,  1.0,  1.0,],[
        1.0,  1.0,  1.0,],[
        1.0,  1.0, -1.0,]],[[
        // Bottom face
        -1.0, -1.0, -1.0,],[
        1.0, -1.0, -1.0,],[
        1.0, -1.0,  1.0,]],[[
        -1.0, -1.0,  1.0,],[
        // Right face
        1.0, -1.0, -1.0,],[
        1.0,  1.0, -1.0,]],[[
        1.0,  1.0,  1.0,],[
        1.0, -1.0,  1.0,],[
        // Left face
        -1.0, -1.0, -1.0,]],[[
        -1.0, -1.0,  1.0,],[
        -1.0,  1.0,  1.0,],[
        -1.0,  1.0, -1.0,]]
    ];

    function multiply(a, b) {
        var aNumRows = a.length, aNumCols = a[0].length,
            bNumRows = b.length, bNumCols = b[0].length,
            m = new Array(aNumRows);  // initialize array of rows
        for (var r = 0; r < aNumRows; ++r) {
            m[r] = new Array(bNumCols); // initialize the current row
            for (var c = 0; c < bNumCols; ++c) {
                m[r][c] = 0;             // initialize the current cell
                for (var i = 0; i < aNumCols; ++i) {
                    m[r][c] += a[r][i] * b[i][c];
                }
            }
        }
        return m;
    }



    self.textureCoords = [
        // Front face
        0.0, 0.0,
        1.0, 0.0,
        1.0, 1.0,
        0.0, 1.0,
        // Back face
        1.0, 0.0,
        1.0, 1.0,
        0.0, 1.0,
        0.0, 0.0,
        // Top face
        0.0, 1.0,
        0.0, 0.0,
        1.0, 0.0,
        1.0, 1.0,
        // Bottom face
        1.0, 1.0,
        0.0, 1.0,
        0.0, 0.0,
        1.0, 0.0,
        // Right face
        1.0, 0.0,
        1.0, 1.0,
        0.0, 1.0,
        0.0, 0.0,
        // Left face
        0.0, 0.0,
        1.0, 0.0,
        1.0, 1.0,
        0.0, 1.0,
    ];
    self.lookUpArray = [
        0.0, 0.0, 0.0, 0.0,      //Front face
        1.0, 1.0, 1.0, 1.0,      //Back face
        2.0, 2.0, 2.0, 2.0,      //Top face
        3.0, 3.0, 3.0, 3.0,      //Bottom face
        4.0, 4.0, 4.0, 4.0,      //Right face
        5.0, 5.0, 5.0, 5.0,      //Left face
    ];

    // This array defines each face as two triangles, using the
    // indices into the vertex array to specify each triangle's
    // position.
    self.cubeVertexIndices = [
        0, 1, 2,      0, 2, 3,    // Front face
        4, 5, 6,      4, 6, 7,    // Back face
        8, 9, 10,     8, 10, 11,  // Top face
        12, 13, 14,   12, 14, 15, // Bottom face
        16, 17, 18,   16, 18, 19, // Right face
        20, 21, 22,   20, 22, 23  // Left face
    ];

    self.translateValue = [0,0,0];

    self.translate = function (x,y,z) {
        // mat4.translate(self.vertices,[x,y,z]);
        self.translateValue = [x,y,z];
    }

    self.rotateValue = [0,0,0];
    self.rotateValue.degree = 0;

    self.rotate = function (degree, x,y,z) {
        // mat4.rotate(self.vertices,degToRad(degree),[x,y,z]);
        self.rotateValue = [x,y,z];
        self.rotateValue.degree = degree;
    }

    self.vertices = [];

    function buildObject() {

        self.cubeVertexPositionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, self.cubeVertexPositionBuffer);

        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(self.vertices), gl.STATIC_DRAW);
        self.cubeVertexPositionBuffer.itemSize = 3;
        self.cubeVertexPositionBuffer.numItems = 24;

        self.cubeVertexTextureCoordBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, self.cubeVertexTextureCoordBuffer);

        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(self.textureCoords), gl.STATIC_DRAW);
        self.cubeVertexTextureCoordBuffer.itemSize = 2;
        self.cubeVertexTextureCoordBuffer.numItems = 24;

        self.cubeVertexIndexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, self.cubeVertexIndexBuffer);

        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(self.cubeVertexIndices), gl.STATIC_DRAW);
        self.cubeVertexIndexBuffer.itemSize = 1;
        self.cubeVertexIndexBuffer.numItems = 36;
    }



    function rotate(matrix,theta,rotation) {
        var c = Math.cos(theta);
        var s = Math.sin(theta);
        var x = rotation[0], y = rotation[1], z = rotation[2];
        var rotationMatrix = [
            [c+x*x*(1-c),x*y*(1-c)-z*s, x*z*(1-c)+y*s],
            [y*x*(1-c)+z*s, c+y*y*(1-c), y*z*(1-c)-x*s],
            [z*x*(1-c)-y*s, z*y*(1-c)+x*s, c+z*z*(1-c)]
        ];

        return multiply(matrix,rotationMatrix);
    }

    function translate(matrix,tranlateMatrix) {
        for(var j = 0; j<matrix.length; j++)
            for(var k = 0; k<matrix[j].length; k++)
                matrix[j][k]+=tranlateMatrix[k];
        return matrix;
    }

    self.buildObject = function () {
        for(var i = 0; i<self.verts.length; i++) {
            var vals = multiply(self.verts[i], self.mult);
            vals = translate(vals,self.translateValue);
            vals = rotate(vals,degToRad(self.rotateValue.degree), self.rotateValue);

            vals = flatten(vals);
            for(var j = 0; j<vals.length; j++)
                self.vertices.push(vals[j]);
        }

        buildObject();
    };

    self.push = function (vertexPositionBuffer,vertexTextureCoordBuffer,vertexIndexBuffer) {
        vertexIndexBuffer.push(self.cubeVertexIndexBuffer);
        vertexPositionBuffer.push(self.cubeVertexPositionBuffer);
        vertexTextureCoordBuffer.push(self.cubeVertexTextureCoordBuffer);
    }
}

