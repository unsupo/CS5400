/**
 * Created by jarndt on 9/12/16.
 */
//
//  Configure WebGL
//
function configure(canvas) {
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    // enable hidden-surface removal

    gl.enable(gl.DEPTH_TEST);

//  Load shaders and initialize attribute buffers

    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

// Load the data into the GPU

    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );

// Associate out shader variables with our data buffer

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );
}

function render(ptype) {
    ptype = ptype || gl.POINTS;
    gl.clear(  gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );
    gl.drawArrays( ptype, 0, points.length );

    // gl.drawArrays( gl.TRIANGLES, 0, points.length );
}

/*

 // Create a buffer object, initialize it, and associate it with the
 //  associated attribute variable in our vertex shader

 var cBuffer = gl.createBuffer();
 gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
 gl.bufferData( gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW );

 var vColor = gl.getAttribLocation( program, "vColor" );
 gl.vertexAttribPointer( vColor, 3, gl.FLOAT, false, 0, 0 );
 gl.enableVertexAttribArray( vColor );

 var vBuffer = gl.createBuffer();
 gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
 gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );

 var vPosition = gl.getAttribLocation( program, "vPosition" );
 gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );
 gl.enableVertexAttribArray( vPosition );
 */