"use strict";
let _id = 1;

class Rectangle {
    constructor() {
        this.id = _id++;
        this.x = Math.random() * 600;
        this.y = Math.random() * 600;
        this.coordinate = [
            this.x,this.x,
            this.x,this.y,

            this.x,this.x,
            this.y,this.x,

            this.x,this.y,
            this.y,this.y,

            this.y,this.y,
            this.y,this.x
        ];
    this.color = [Math.random(), Math.random(), Math.random(), 1];
    }
}

var listRectangle = [];
listRectangle.push(new Rectangle())
var count = 8

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
  var translationLocation = gl.getUniformLocation(program, "u_translation");
  var rotationLocation = gl.getUniformLocation(program, "u_rotation");
  var scaleLocation = gl.getUniformLocation(program, "u_scale");

  // Create a buffer to put positions in
  var positionBuffer = gl.createBuffer();
  // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  // Put geometry data into buffer

  var translation = [100, 150];
  var rotation = [0, 1];
  var scale = [1, 1];
  var color = [Math.random(), Math.random(), Math.random(), 1];


  
  var coordinates = [];
  listRectangle.forEach(rectangle => {
    rectangle.coordinate.forEach(num => {
      coordinates.push(num)
    });
  });
  
  var listCoordinate = new Float32Array(coordinates);
    
  setGeometry(gl, listCoordinate);
  drawScene(count);

  // Setup a ui.
  webglLessonsUI.setupSlider("#x", {value: translation[0], slide: updatePosition(0), max: gl.canvas.width });
  webglLessonsUI.setupSlider("#y", {value: translation[1], slide: updatePosition(1), max: gl.canvas.height});
  webglLessonsUI.setupSlider("#angle", {slide: updateAngle, max: 360});
  webglLessonsUI.setupSlider("#scaleX", {value: scale[0], slide: updateScale(0), min: -5, max: 5, step: 0.01, precision: 2});
  webglLessonsUI.setupSlider("#scaleY", {value: scale[1], slide: updateScale(1), min: -5, max: 5, step: 0.01, precision: 2});

  function updatePosition(index) {
    return function(event, ui) {
      translation[index] = ui.value;
      drawScene(count);
    };
  }

  function updateAngle(event, ui) {
    var angleInDegrees = 360 - ui.value;
    var angleInRadians = angleInDegrees * Math.PI / 180;
    rotation[0] = Math.sin(angleInRadians);
    rotation[1] = Math.cos(angleInRadians);
    drawScene(count);
  }

  function updateScale(index) {
    return function(event, ui) {
      scale[index] = ui.value;
      drawScene(count);
    };
  }

  // Draw the scene.
  function drawScene(count) {
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

    // Set the translation.
    gl.uniform2fv(translationLocation, translation);

    // Set the rotation.
    gl.uniform2fv(rotationLocation, rotation);

    // Set the scale.
    gl.uniform2fv(scaleLocation, scale);

    // Draw the geometry.
    var primitiveType = gl.LINES;
    var offset = 0;
    gl.drawArrays(primitiveType, offset, count);
  }
}

// Fill the buffer with the values that define a letter 'F'.
function setGeometry(gl, coordinate) {
  gl.bufferData(
      gl.ARRAY_BUFFER,
      coordinate,
      gl.STATIC_DRAW);
}

function addRectangle() {
  listRectangle.push(new Rectangle());
  count += 8;

  var listCoordinate = new Array();
  listRectangle.forEach(Rectangle => {
    listCoordinate.concat(Rectangle.coordinate);
  });

  main();
}

document.getElementById("addRectangle").addEventListener("click", addRectangle)

main();