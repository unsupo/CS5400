/**
 * Created by jarndt on 10/10/16.
 */

function loadImage(url, callback) {
    var image = new Image();
    image.src = url;
    image.onload = callback;
    return image;
}

function loadImages(urls, callback) {
    var images = [];
    var imagesToLoad = urls.length;

    //called each time an image is finished loading
    var onImageLoad = function () {
        --imagesToLoad;
        //if all the images are loaded call the callback
        if(imagesToLoad == 0){
            callback(images);
        }
    };
    for(var i = 0; i<imagesToLoad; i++){
        var image = loadImage(urls[i], onImageLoad);
        images.push(image);
    }
}
function loadIdentity() {
    mvMatrix = Matrix.I(4);
}
function mvTranslate(v) {
    multMatrix(Matrix.Translation($V([v[0], v[1], v[2]])).ensure4x4());
}

function multMatrix(m) {
    mvMatrix = mvMatrix.x(m);
}
function mvRotate(angle, v) {
    var inRadians = angle * Math.PI / 180.0;
    var m = Matrix.Rotation(inRadians, $V([v[0], v[1], v[2]])).ensure4x4();
    multMatrix(m);
}
function initTextures(textureImages) {
    // var textureImages = [
    //     {
    //         src : "III_HTML5.png",
    //         loc : "front"
    //     },
    //     {
    //         src : "III_ico.png",
    //         loc : "back"
    //     },
    //     {
    //         src : "ebooks.jpg",
    //         loc : "top"
    //     },
    //     {
    //         src : "bowling.jpg",
    //         loc : "bottom"
    //     },
    //     {
    //         src : "iii_b.png",
    //         loc : "left"
    //     },
    //     {
    //         src : "html5-logo.png",
    //         loc : "right"
    //     }
    // ];
    var i, image;
    var texturesToLoad = 6;
    for ( i in textureImages) {
        var image = new Image();
        image.cubeFace = textureImages[i].loc;
        image.onload = function () {
            eval(this.cubeFace+"Texture = createTextureFromImage(this, shaderProgram."+this.cubeFace+");");
            texturesToLoad--;
            if (texturesToLoad == 0) {
                tick();
            }
        }
        image.src = textureImages[i].src;
    }
}


function createTextureFromImage(image, uniform) {
    var texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    if (isPowerOfTwo(image.width) && isPowerOfTwo(image.height)){
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    }else{
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    }
    gl.bindTexture(gl.TEXTURE_2D, null);
    return texture;
}


function isPowerOfTwo(x) {
    return (x & (x - 1)) == 0;
}