/** Main class for the WebGL 3D engine.
 * @param $canvas The HTML canvas object to embed WebGL in.
 * @param $camera Camera reference for view perspective updates.
 * @param is3D Boolean flag, if 3D shall be used. */
function WebGLEngine($canvas, $camera, $is3D) {

  var gl;                       // OpenGL context handle.
  var shaders2D;                // 2D Shader reference.
  var shaders3D;                // 3D Shader reference.
  var pMatrix = mat4.create();  // Projection matrix.
  var mvMatrix = mat4.create(); // Model view matrix.
  var mvMatrixStack = [];       // Matrix stack (for push and pop operations).
  var camera = $camera;         // Camera reference.
  var deg2Rad = 0.01745329;     // Degree-to-radians conversion constant.
  this.is3D = $is3D;            // 3D rendering flag.


  /** Main WebGL initialization function. Calls several subroutines. */
  function constr() {
    gl = $canvas.getContext("experimental-webgl");  // Try to init GL context.
    if (!gl) alert("[ERROR] Could not initialize WebGL!\nProbably your browser is out of date or it just sucks ...");
    gl.viewportWidth = $canvas.width;
    gl.viewportHeight = $canvas.height;

    // Initialize vertex and fragment shaders.
    shaders3D = initShaders(VertexShader3D, FragmentShader3D);            
    shaders2D = initShaders(VertexShader2D, FragmentShader2D);

    gl.clearColor(1.0, 1.0, 1.0, 1.0);  // Background white.
    gl.enable(gl.DEPTH_TEST);           // Depth-testing enabled.

    // Viewport and perspective settings.
    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    mat4.perspective(45, gl.viewportWidth / gl.viewportHeight, 0.1, 2500.0, pMatrix);
  }; constr();



  /** Returns a shader.
   * @param shaderType The type of shader to compile (GL constant). 
   * @param shaderVar Variable with shader code as string.
   * @return The shader reference. */
  function createShader(shaderType, shaderVar) {
    var shader = gl.createShader(shaderType);
    gl.shaderSource(shader, shaderVar);
    gl.compileShader(shader);

    // If shader compilation failed, abort with error message!
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      alert("[ERROR] Shader compilation failed: "+gl.getShaderInfoLog(shader));
      return null;
    }
    return shader;
  }



  /** Initialize the shaders.
   * @param vertexShader The vertex shader to use.
   * @param fragmentShader The fragment shader variable.
   * @return The shader program, containing vertex and fragment shader. */
  function initShaders(vertexShader, fragmentShader) {
    var shaderProgram = gl.createProgram();

    // We've got two types of shaders:
    // 1) The vertex shader is responsible to map our vertices into screen space.
    // 2) The fragment shader colors the rasterized fragments of the resulting triangles.  
    gl.attachShader(shaderProgram, createShader(gl.VERTEX_SHADER, vertexShader));
    gl.attachShader(shaderProgram, createShader(gl.FRAGMENT_SHADER, fragmentShader));
    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
      alert("[ERROR] Could not initialize shaders");
    }

    gl.useProgram(shaderProgram);

    // Add vertex position and color attribute locations to the shader.
    shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
    shaderProgram.textureCoordAttribute = gl.getAttribLocation(shaderProgram, "aTextureCoord");
    gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);
    gl.enableVertexAttribArray(shaderProgram.textureCoordAttribute);

    shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
    shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
    shaderProgram.samplerUniform = gl.getUniformLocation(shaderProgram, "uSampler");
    return shaderProgram;
  }



  /** Push the current modelview matrix onto the stack. */
  var mvPushMatrix = function() {
    var copy = mat4.create();
    mat4.set(mvMatrix, copy);
    mvMatrixStack.push(copy);
  }



  /** Pop modelview matrix from the stack. */
  var mvPopMatrix = function() {
    if (mvMatrixStack.length == 0) throw "Invalid popMatrix!";
    mvMatrix = mvMatrixStack.pop();
  }


  var draw2D = function() {
    gl.useProgram(shaders2D);

    // look up where the vertex data needs to go.
    var positionLocation = gl.getAttribLocation(shaders2D, "a_position");

    // set the resolution
    var resolutionLocation = gl.getUniformLocation(shaders2D, "u_resolution");
    gl.uniform2f(resolutionLocation, $canvas.width, $canvas.height);

    // Create a buffer and put a single clipspace rectangle in it (2 triangles)
    var vertices = [
      10, 20,
      80, 20,
      10, 30,
      10, 30,
      80, 20,
      80, 30
    ];
    var buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    // draw
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }



  var draw3D = function() {
    gl.useProgram(shaders3D);    
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    mat4.identity(mvMatrix);
    camera.Update(mvMatrix);

    var fkt = function(obj){
      mvPushMatrix();

      // Set position and translation
      mat4.translate(mvMatrix, [obj.x, obj.y, obj.z]);
      mat4.rotate(mvMatrix, obj.pitch * deg2Rad, [-1, 0, 0]);
      mat4.rotate(mvMatrix, obj.yaw * deg2Rad, [0, 0, 1]);

      // Load vertex buffer.
      gl.bindBuffer(gl.ARRAY_BUFFER, obj.vBuffer);
      gl.vertexAttribPointer(shaders3D.vertexPositionAttribute, obj.vBuffer.itemSize, gl.FLOAT, false, 0, 0);

      // Load texture coordinate buffer.
      gl.bindBuffer(gl.ARRAY_BUFFER, obj.tBuffer);
      gl.vertexAttribPointer(shaders3D.textureCoordAttribute, obj.tBuffer.itemSize, gl.FLOAT, false, 0, 0);

      // Load texture object.
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, crateTextures[2]);
      gl.uniform1i(shaders3D.samplerUniform, 0);

      // Load vertex index buffer, align the matrices and draw the object!
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, obj.viBuffer);
      gl.uniformMatrix4fv(shaders3D.pMatrixUniform, false, pMatrix);
      gl.uniformMatrix4fv(shaders3D.mvMatrixUniform, false, mvMatrix);
      gl.drawElements(gl.TRIANGLES, obj.viBuffer.numItems, gl.UNSIGNED_SHORT, 0);

      mvPopMatrix();
    }

    world.DrawObjects(fkt);   // Draw loop over all objects.
  }

  /** Render the world.  */
  this.Render = function () {
    if (this.is3D) draw3D();
    else draw2D();
  }


  /* GET methods for external access to GL context. */
  this.GetContext = function() { return gl; }
}