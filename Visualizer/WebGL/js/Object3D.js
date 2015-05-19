/** 3D object data container for the WebGL engine. */
function Object3D($x, $y, $z, $yaw, $pitch) {

  this.x = $x;         // Position coordinates (x-axis).
  this.y = $y;         // Position coordinates (y-axis).
  this.z = $z;         // Position coordinates (z-axis).
  this.yaw = $yaw;     // Yaw value.
  this.pitch = $pitch; // Pitch value.

  this.vBuffer  = gl.createBuffer();  // Vertex buffer.
  this.viBuffer = gl.createBuffer();  // Vertex index (association) buffer.
  this.tBuffer  = gl.createBuffer();  // Texture coordinate buffer.


  /** Set this object's buffers.
   * @param $v Vertex position array. 
   * @param $vi Vertex index array. 
   * @param $t Texture vector array. */
  this.SetBuffers = function ($v, $vi, $t) {
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array($v), gl.STATIC_DRAW);
    this.vBuffer.itemSize = 3;             // A vertex consists of three coordinates.
    this.vBuffer.numItems = $v.length / 3; // For this reason, we divide array length / 3.

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.viBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array($vi), gl.STATIC_DRAW);
    this.viBuffer.itemSize = 1;           // Index is just one number.
    this.viBuffer.numItems = $vi.length;  // So the item count equals array length.

    gl.bindBuffer(gl.ARRAY_BUFFER, this.tBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array($t), gl.STATIC_DRAW);
    this.tBuffer.itemSize = 2;              // Texture vector is two-dimensional.
    this.tBuffer.numItems = $t.length / 2;  // Item count is half array size.
  }
}