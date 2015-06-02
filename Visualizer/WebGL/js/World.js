/** Holds all objects to display and some additional metadata. */
function World() {

  var objects = {}; // Mapping of objects to their ID's.


  /** Adds a new [cube] object on the given position. */
  this.AddObject = function(id, posX, posY, posZ, yaw, pitch) {
    var obj = new Object3D(posX, posY, posZ, yaw, pitch);
    createCube(obj);
    objects[id] = obj;
  }


  /** Update an object with new position data. */
  this.UpdateObject = function(id, posX, posY, posZ, yaw, pitch) {
    objects[id].x = posX;
    objects[id].y = posY;
    objects[id].z = posZ;
    objects[id].yaw = yaw;
    objects[id].pitch = pitch;
  }


  /** Deletes an object from the listing.
   * @param id The ID of the object to delete. */
  this.DeleteObject = function(id) {
    delete objects[id];
  }


  /** Checks if this world contains an object with the given ID.
   * @param id The ID to check for. */
  this.ContainsObject = function(id) {
    return (id in objects);
  }


  /** Loops over all objects and draws them.
   * @param drawFunction Delegate to drawing function. */
  this.DrawObjects = function(drawFunction) {
    for (var id in objects) {
      drawFunction(objects[id]);    
    }
  }


  /** This function creates a 1x1 cube and sets it as the model for an object.
   * @param obj The object that should gain this cube. */
  var createCube = function(obj) {
    var vertices = [
        -1, -1,  1,    1, -1,  1,    1,  1,  1,   -1,  1,  1,  // Front face.
        -1, -1, -1,   -1,  1, -1,    1,  1, -1,    1, -1, -1,  // Back face.
        -1,  1, -1,   -1,  1,  1,    1,  1,  1,    1,  1, -1,  // Top face.
        -1, -1, -1,    1, -1, -1,    1, -1,  1,   -1, -1,  1,  // Bottom face.
         1, -1, -1,    1,  1, -1,    1,  1,  1,    1, -1,  1,  // Right face.
        -1, -1, -1,   -1, -1,  1,   -1,  1,  1,   -1,  1, -1   // Left face.
        /*
        -0.04, -0.04,  0.04,    0.04, -0.04,  0.04,    0.04,  0.04,  0.04,   -0.04,  0.04,  0.04,  // Front face.
        -0.04, -0.04, -0.04,   -0.04,  0.04, -0.04,    0.04,  0.04, -0.04,    0.04, -0.04, -0.04,  // Back face.
        -0.04,  0.04, -0.04,   -0.04,  0.04,  0.04,    0.04,  0.04,  0.04,    0.04,  0.04, -0.04,  // Top face.
        -0.04, -0.04, -0.04,    0.04, -0.04, -0.04,    0.04, -0.04,  0.04,   -0.04, -0.04,  0.04,  // Bottom face.
         0.04, -0.04, -0.04,    0.04,  0.04, -0.04,    0.04,  0.04,  0.04,    0.04, -0.04,  0.04,  // Right face.
        -0.04, -0.04, -0.04,   -0.04, -0.04,  0.04,   -0.04,  0.04,  0.04,   -0.04,  0.04, -0.04   // Left face.
        */
    ];
    var textureCoords = [
      0.0, 0.0,   1.0, 0.0,   1.0, 1.0,   0.0, 1.0,    // Front face.
      1.0, 0.0,   1.0, 1.0,   0.0, 1.0,   0.0, 0.0,    // Back face.
      0.0, 1.0,   0.0, 0.0,   1.0, 0.0,   1.0, 1.0,    // Top face.
      1.0, 1.0,   0.0, 1.0,   0.0, 0.0,   1.0, 0.0,    // Bottom face.
      1.0, 0.0,   1.0, 1.0,   0.0, 1.0,   0.0, 0.0,    // Right face.
      0.0, 0.0,   1.0, 0.0,   1.0, 1.0,   0.0, 1.0     // Left face.
    ];
    var vertexIndices = [
        0,  1,  2,  0,  2,  3,   // Front face.
        4,  5,  6,  4,  6,  7,   // Back face.
        8,  9,  10, 8,  10, 11,  // Top face.
        12, 13, 14, 12, 14, 15,  // Bottom face.
        16, 17, 18, 16, 18, 19,  // Right face.
        20, 21, 22, 20, 22, 23   // Left face.
    ];
    obj.SetBuffers(vertices, vertexIndices, textureCoords);  // Add arrays to buffer initializer.
  }
}