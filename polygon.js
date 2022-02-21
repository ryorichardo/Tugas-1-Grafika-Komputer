"use strict";

function main() {
  // Get A WebGL context
  /** @type {HTMLCanvasElement} */
  var canvas = document.querySelector("#canvas");
  var gl = canvas.getContext("webgl");
  if (!gl) {
    return;
  }

  // setup GLSL program
  var program = webglUtils.createProgramFromScripts(gl, ["vertex-shader-2d", "fragment-shader-2d"]);

  // look up where the vertex data needs to go.
  var positionLocation = gl.getAttribLocation(program, "a_position");

  // lookup uniforms
  var resolutionLocation = gl.getUniformLocation(program, "u_resolution");
  var colorLocation = gl.getUniformLocation(program, "u_color");

  // Create a buffer to put positions in
  var positionBuffer = gl.createBuffer();
  // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  setGeometry(gl);

  var color = [Math.random(), Math.random(), Math.random(), 1];

  drawScene();

  // Setup a ui.
  webglLessonsUI.setupSlider("#Red", {value: color[0], slide: updateColor(0), min: 0, max: 1, step: 0.01, precision: 2});
  webglLessonsUI.setupSlider("#Green", {value: color[1], slide: updateColor(1), min: 0, max: 1, step: 0.01, precision: 2});
  webglLessonsUI.setupSlider("#Blue", {value: color[2], slide: updateColor(2), min: 0, max: 1, step: 0.01, precision: 2});

  function updateColor(index) {
    return function(event, ui) {
      color[index] = ui.value;
      drawScene();
    };
  }

  // Draw the scene.
  function drawScene() {
    webglUtils.resizeCanvasToDisplaySize(gl.canvas);

    // Tell WebGL how to convert from clip space to pixels
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    // Clear the canvas.
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Tell it to use our program (pair of shaders)
    gl.useProgram(program);

    // Turn on the attribute
    gl.enableVertexAttribArray(positionLocation);

    // Bind the position buffer.
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
    var size = 2;          // 2 components per iteration
    var type = gl.FLOAT;   // the data is 32bit floats
    var normalize = false; // don't normalize the data
    var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
    var offset = 0;        // start at the beginning of the buffer
    gl.vertexAttribPointer(
        positionLocation, size, type, normalize, stride, offset);

    // set the resolution
    gl.uniform2f(resolutionLocation, gl.canvas.width, gl.canvas.height);

    // set the color
    gl.uniform4fv(colorLocation, color);

    // Draw the geometry.
    var primitiveType = gl.TRIANGLES;
    var offset = 0;
    var count = 18;  // 6 triangles in the 'F', 3 points per triangle
    gl.drawArrays(primitiveType, offset, count);
  }
}

// Fill the buffer with the values that define a letter 'F'.
function setGeometry(gl) {
  gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([
          100 + 60, 100 + 30*Math.sqrt(3),
          100 + 90, 100,
          100 + 30, 100,

          100 + 60, 100 + 30*Math.sqrt(3),
          100 + 90, 100,
          100 + 120, 100 + 30*Math.sqrt(3),

          100 + 60, 100 + 30*Math.sqrt(3),
          100 + 120, 100 + 30*Math.sqrt(3),
          100 + 90, 100 + 2*30*Math.sqrt(3), 

          100 + 60, 100 + 30*Math.sqrt(3),
          100 + 90, 100 + 2*30*Math.sqrt(3), 
          100 + 30, 100 + 2*30*Math.sqrt(3),

          100 + 60, 100 + 30*Math.sqrt(3),
          100 + 30, 100 + 2*30*Math.sqrt(3),
          100, 100 + 30*Math.sqrt(3),

          100 + 60, 100 + 30*Math.sqrt(3),
          100, 100 + 30*Math.sqrt(3),
          100 + 30, 100,
      ]),
      gl.STATIC_DRAW);
}

main();