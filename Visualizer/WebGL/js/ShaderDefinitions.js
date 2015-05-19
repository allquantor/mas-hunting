/** This file holds the GLSL definitions for WebGL use. */


// 2D vertex shader definition.
var VertexShader2D =
  "attribute vec2 a_position;" +
  "uniform vec2 u_resolution;" +
  "void main(void) {  " +
  "  vec2 zeroToOne = a_position / u_resolution;" +
  "  vec2 zeroToTwo = zeroToOne * 2.0;" +
  "  vec2 clipSpace = zeroToTwo - 1.0;" +
  "  gl_Position = vec4(clipSpace, 0, 1);" +
  "}";

// The vertex shader for 3D use.
var VertexShader3D = 
  "attribute vec3 aVertexPosition;"+
  "attribute vec2 aTextureCoord;"+
  "uniform mat4 uMVMatrix;"+
  "uniform mat4 uPMatrix;"+
  "varying vec2 vTextureCoord;"+
  "void main(void) {"+
  "  gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);"+
  "  vTextureCoord = aTextureCoord;"+
  "}";



// 2D fragment shader definition.
var FragmentShader2D =
  "void main(void) {"+
  "  gl_FragColor = vec4(0,0,0,1);"+
  "}";

// The fragment shader to use with 3D.
var FragmentShader3D = 
  "precision mediump float;"+
  "varying vec2 vTextureCoord;"+
  "uniform sampler2D uSampler;"+
  "void main(void) {"+
  "  gl_FragColor = texture2D(uSampler, vec2(vTextureCoord.s, vTextureCoord.t));"+
  "}";