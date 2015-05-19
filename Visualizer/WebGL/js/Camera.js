/** The camera represents and adjusts a viewing area in the 3D environment. */
function Camera() {
  
  var x, y, z;              // Coordinates of the camera position.
  var pitch, yaw;           // Pitch (up/down) and yaw (turn around).
  var deg2Rad = 0.01745329; // Degree-to-radians conversion constant.


  /** Restrict pitch value to interval (-90° -> 90°). 
   * @param newPitch New pitch value. */
  this.SetPitch = function(newPitch) {
    if (newPitch > 90.0) pitch = 90.0;
    else if (newPitch < -90.0) pitch = -90.0;
    else pitch = newPitch;
  }


  /** Limit yaw value to compass heading (0° -> <360°).
   * @param newYaw New yaw value. */
  this.SetYaw = function(newYaw) {   
    yaw = newYaw;
    if (yaw < 0.0)    yaw += 360.0;
    if (yaw >= 360.0) yaw -= 360.0;
  }


  /** Moves the camera around. Calculates the new position based on the
   *  current heading and the supplied mouse/keyboard offset input.
   * @param xIn X delta input (mouse/kbd. x-axis, -: left, +: right).
   * @param yIn Y delta input (mouse/kbd, y-axis, -: down, +: up).
   * @param zIn Z delta input (zoom level,        -: out,  +: in). */
  this.MoveCamera = function(xIn, yIn, zIn) {
    // Horizontal displacement.
    if (xIn != 0 || yIn != 0) {
        
      /* Calculation of position with orientation (yaw) taken into account:
       * 
       *       0°  90° 180° 270°                     ATT!                           0    90   180   270 
       * xPos  x    y   -x   -y   : cos(x) + sin(y)      x*cos(yaw) + y*sin(yaw)   1,0  0,1  -1,0  0,-1
       * yPos  y   -x   -y    x   : sin(x) + cos(y)  (-) x*sin(yaw) + y*cos(yaw)   0,1  1,0  0,-1  -1,0      
       *
       * Attention: yDelta of event is inverse (up=negative values)!        
       */

      var yawRad = yaw * deg2Rad;  // Degree to radians.
      setPosition(x +  (xIn * Math.cos(yawRad) + yIn * Math.sin(yawRad)), 
                  y + (-xIn * Math.sin(yawRad) + yIn * Math.cos(yawRad)), z); 
    }

    // Zooming mode.
    if (zIn != 0) setPosition(x, y, z + zIn);
  }


  /** Rotates the camera around lateral and vertical axes.
   * @param xIn X delta input (yaw axis).
   * @param yIn Y delta input (pitch axis). */
  this.RotateCamera = function(xIn, yIn) {
    this.SetYaw(yaw + xIn);
    this.SetPitch(pitch + yIn);
  }


  /** Sets the camera to a position (x,y,z) with optional pitch and yaw values. */
  this.SetPosition = function(pX, pY, pZ, pYaw, pPitch) {
    setPosition(pX, pY, pZ);

    if (pYaw !== undefined) this.SetYaw(pYaw);
    if (pPitch !== undefined) this.SetPitch(pPitch);
  }


  function setPosition(newX, newY, newZ) {
    x = newX;
    y = newY;
    z = newZ;
    var evt = document.createEvent("CustomEvent");
    evt.initEvent("Camera_PositionChanged", true, true);
    evt.posX = x;
    evt.posY = y;
    evt.posZ = z;
    document.dispatchEvent(evt);
  }


  /** Update the camera values. */
  this.Update = function($mvMatrix) {

    mat4.rotate($mvMatrix, (pitch+90)*deg2Rad, [-1, 0, 0]); // Rotate on x-Axis (set height).
    mat4.rotate($mvMatrix, (yaw)*deg2Rad,      [ 0, 0, 1]); // Rotate on z-Axis (set spin).
    mat4.translate($mvMatrix, [-x, -y, -z]);                // Set the camera position.

    // Set values to data table (probably only for debug purpose).
    //TODO Eventhandling für den Rest!
    //document.getElementById("position").innerHTML = "("+x.toFixed(1)+", "+y.toFixed(1)+", "+z.toFixed(1)+")";
    document.getElementById("yaw").innerHTML = Math.round(yaw) + "°";
    document.getElementById("pitch").innerHTML = Math.round(pitch) + "°";
  }
}