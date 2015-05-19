var crateTextures = Array();
var engine;
var gl;
var ctrl;
var world;
var mousectrl;


/** Initialize a WebGL texture.
 * @param gl GL context object.
 * @param path Image file path.
 * @return Texture reference. */
function InitTexture(gl, path) {
  var texture = gl.createTexture();
  texture.image = new Image();
  texture.image.onload = function () {
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);  // unflip gif image (do we really need this later?)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.bindTexture(gl.TEXTURE_2D, null);
  }
  texture.image.src = path;
  return texture;
}


function handleLoadedTexture(textures) {
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

  gl.bindTexture(gl.TEXTURE_2D, textures[0]);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, textures[0].image);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);

  gl.bindTexture(gl.TEXTURE_2D, textures[1]);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, textures[1].image);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

  gl.bindTexture(gl.TEXTURE_2D, textures[2]);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, textures[2].image);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
  gl.generateMipmap(gl.TEXTURE_2D);

  gl.bindTexture(gl.TEXTURE_2D, null);
}


function initTexture() {
  var crateImage = new Image();

  for (var i = 0; i < 3; i++) {
    var texture = gl.createTexture();
    texture.image = crateImage;
    crateTextures.push(texture);
  }

  crateImage.onload = function () {
    handleLoadedTexture(crateTextures);
  }
  crateImage.src = "../res/crate.gif";
}



/** Main WebGL initialization function. Calls several subroutines. */
function WebGLStart() {

  var camera = new Camera();
  //camera.SetPosition(0, 0, 0, 32, 0);
  //camera.SetPosition(100, 100, 300, 0, -90);

  var controller = new CameraController(camera);
  mousectrl = new MouseController();
  engine = new WebGLEngine(document.getElementById("webgl-canvas"), camera, true);
  gl = engine.GetContext();
  ctrl = new Controller(engine);


  var gc = new GuiController(controller, ctrl);
  controller.SetPosition(-14950, -19950, 2000);
  controller.LockAxesFor2D(true);


  world = new World();
  //world.AddObject("001", 2,  2, 0,  0, 0);
  //world.AddObject("002", 2, 10, 0, 45, 0);

  initTexture();



  setInterval(function() {
    controller.EvaluateEvents();       // Input processing.
    //ctrl.QueryData(url, params, proc); // Query server data.
    //Animate();                         // Animation progress.
    engine.Render();                   // Rendering function.
  }, 20);                              // Execution all 40ms (25 FPS).
}



/** Animation advance. */
function Animate() {
  world.DrawObjects(function(obj) {
    obj.yaw += 0.3;
    obj.pitch += 0.3;
  });
}