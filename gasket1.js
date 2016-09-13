/**
 * Created by jarndt on 9/11/16.
 */

var gl;
var points = [];

var NumPoints = 5000;

window.onload = function init() {
    var canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }


    var u = [-.1,0.2];
    drawDragon(u,.01,Math.PI/2,13);


    //each line needs 2 points
    //will draw whatever points are in the points array
    configure(canvas);

    render(gl.LINES);
};

function drawDragon(start, increment, angle, size) {
    /* Draws a Dragon Curve of length 'size'. */
    var turtle_string = buildDragon('fx', size);//should be fx
    points.push(start);
    var p = start;
    var pp = [0,increment];
    for(var i = 0; i<turtle_string.length; i++) {
        if(turtle_string[i] == 'f') {
            p = plus(p, pp);
            points.push(p,p);
        }else if(turtle_string[i] == '+')
            pp = rotateA(pp, angle);
        else if(turtle_string[i] == '-')
            pp = rotateA(pp, -angle);
    }
}

function buildDragon(turtle_string,n) {
    /* Recursively builds a draw string. */
    /* defining f, +, -, as additional rules that don't do anything */
    var rules = {'x':'x+yf', 'y':'fx-y','f':'f', '-':'-', '+':'+'};
    var tString = "";
    for(var i = 0; i<turtle_string.length; i++){
        tString+=rules[turtle_string[i]];
    }
    if(n>1)
        return buildDragon(tString,n-1);
    else
        return tString
}

function drawGasket(){
    //
    //  Initialize our data for the Sierpinski Gasket
    //

    // First, initialize the corners of our gasket with three points.

    var vertices = [
        vec2( -1, -1 ),
        vec2(  0,  1 ),
        vec2(  1, -1 )
    ];

    // Specify a starting point p for our iterations
    // p must lie inside any set of three vertices

    var u = add( vertices[0], vertices[1] );
    var v = add( vertices[0], vertices[2] );
    var p = scale( 0.25, add( u, v ) );

    // And, add our initial point into our array of points

    points = [ p ];

    // Compute new points
    // Each new point is located midway between
    // last point and a randomly chosen vertex

    for ( var i = 0; points.length < NumPoints; ++i ) {
        var j = Math.floor(Math.random() * 3);
        p = add( points[i], vertices[j] );
        p = scale( 0.5, p );
        points.push( p );
    }
}

