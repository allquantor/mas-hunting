/** Controller for the camera module.
 * @param camera Camera reference. */
function CameraController(camera) {

  var speed = 1;                  // Camera movement speed.
  var lock2D = false;             // 2D axis lock.
  var currentlyPressedKeys = {};  // Mapping of currently pressed keys.


  /** Visualization constructor. */
  function constr() {
    document.onkeydown = keyDown;
    document.onkeyup = keyUp;
  }; constr();


  /** Set a new camera movement speed.
   * @param newSpeed The new camera speed. */
  this.SetCameraSpeed = function(newSpeed) {
    speed = newSpeed;
  }


  /** Lock pitch and yaw axes for a 2D view.
   * @param bool Enable / disable flag. */
  this.LockAxesFor2D = function(bool) {
    if (bool) {
      camera.SetYaw(0);
      camera.SetPitch(-90);
      lock2D = true;
    } else lock2D = false;
  }


  /** Set a new camera position.
   * @param posX X coordinate.
   * @param posY Y coordinate.
   * @param posZ Z coordinate. */
  this.SetPosition = function (posX, posY, posZ) {
    camera.SetPosition(posX, posY, posZ);
  }


  function keyDown(event) {
    currentlyPressedKeys[event.keyCode] = true;
  }


  function keyUp(event) {
    currentlyPressedKeys[event.keyCode] = false;
  }

  this.EvaluateEvents = function () {
    /*
    if (currentlyPressedKeys[33]) camera.RotateCamera(0, 0.7);   // Page Up
    if (currentlyPressedKeys[34]) camera.RotateCamera(0, -0.7);  // Page Down
    if (currentlyPressedKeys[37] || currentlyPressedKeys[65]) camera.RotateCamera(-2, 0);    // Left cursor key or A.
    if (currentlyPressedKeys[39] || currentlyPressedKeys[68]) camera.RotateCamera(2, 0);     // Right cursor key or D.
    if (currentlyPressedKeys[38] || currentlyPressedKeys[87]) camera.MoveCamera(0, 0.15, 0); // Up cursor key or W.
    if (currentlyPressedKeys[40] || currentlyPressedKeys[83]) camera.MoveCamera(0,-0.15, 0); // Down cursor key or S.   
    if (currentlyPressedKeys[81]) camera.MoveCamera(-0.1, 0.1, 0); // Strafe left (Q).   
    if (currentlyPressedKeys[69]) camera.MoveCamera( 0.1, 0.1, 0); // Strafe right (E).   
    if (currentlyPressedKeys[109] || currentlyPressedKeys[173]) camera.MoveCamera(0, 0, -0.1);  // Move down (-).   
    if (currentlyPressedKeys[107] || currentlyPressedKeys[171]) camera.MoveCamera(0, 0, 0.1);   // Move up (+).   
    */

    if (currentlyPressedKeys[33]) camera.RotateCamera(0, 0.8);   // Page Up
    if (currentlyPressedKeys[34]) camera.RotateCamera(0, -0.8);  // Page Down
    if (currentlyPressedKeys[37] || currentlyPressedKeys[65]) camera.RotateCamera(-2, 0);    // Left cursor key or A.
    if (currentlyPressedKeys[39] || currentlyPressedKeys[68]) camera.RotateCamera(2, 0);     // Right cursor key or D.
    if (currentlyPressedKeys[38] || currentlyPressedKeys[87]) camera.MoveCamera(0, 8, 0); // Up cursor key or W.
    if (currentlyPressedKeys[40] || currentlyPressedKeys[83]) camera.MoveCamera(0, -8, 0); // Down cursor key or S.   
    if (currentlyPressedKeys[81]) camera.MoveCamera(-2, 2, 0); // Strafe left (Q).   
    if (currentlyPressedKeys[69]) camera.MoveCamera(2, 2, 0); // Strafe right (E).   
    if (currentlyPressedKeys[109] || currentlyPressedKeys[173]) camera.MoveCamera(0, 0, -8);  // Move down (-).   
    if (currentlyPressedKeys[107] || currentlyPressedKeys[171]) camera.MoveCamera(0, 0, 8);   // Move up (+). 
  }
}



function MouseController() {

  var canvas = "webgl-canvas";
  var turn = false;

  function constr() {
    document.getElementById(canvas).onmousemove = function(event) {
      var mouseX = event.pageX;
      var mouseY = event.pageY;

      if (event.offsetX) {
        mouseX = event.offsetX;
        mouseY = event.offsetY;
      }
      else if (event.layerX) {
        mouseX = event.layerX;
        mouseY = event.layerY;
      }
      document.getElementById("mouse").innerHTML = "(" + mouseX + "|" + mouseY + ")";
    };

    document.getElementById(canvas).onmousedown = mousePressed;
    document.getElementById(canvas).onmouseup = mouseReleased;
    document.getElementById(canvas).oncontextmenu = function() { return false; }

  }; constr();

 
  function mousePressed(event) {
    if (event.button == 2) {
      turn = true;
      document.getElementById(canvas).style.cursor = "none";
    }
  }


  function mouseReleased(event) {
    turn = false;
    document.getElementById(canvas).style.cursor = "default";
  }
}