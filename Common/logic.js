/**
 * Created by jarndt on 9/12/16.
 */
function midPoint(u, v) {
    return [(u[0]+v[0])/2, (u[1]+v[1])/2];
}

function rotateA(p,ang) {
    return [p[0]*Math.cos(ang)-p[1]*Math.sin(ang),p[0]*Math.sin(ang)+p[1]*Math.cos(ang)];
}
function rotate(p,p0,ang) {
    return plus(p0,rotateA(minus(p,p0),ang));
}
function minus(p,p0) {
    return [p[0]-p0[0],p[1]-p0[1]];
}
function plus(p,p0) {
    return [p[0]+p0[0],p[1]+p0[1]];
}