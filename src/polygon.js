"use strict";
import Polygon from "./poly.js";

var listPolygon = [];
listPolygon.push(new Polygon())
var count = 18

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

  var color = listPolygon[listPolygon.length-1].color;

  // Setup a ui.
  webglLessonsUI.setupSlider("#Red", {value: color[0], slide: updateColor(0), min: 0, max: 1, step: 0.01, precision: 2});
  webglLessonsUI.setupSlider("#Green", {value: color[1], slide: updateColor(1), min: 0, max: 1, step: 0.01, precision: 2});
  webglLessonsUI.setupSlider("#Blue", {value: color[2], slide: updateColor(2), min: 0, max: 1, step: 0.01, precision: 2});

  function updateColor(index) {
    return function(event, ui) {
      color[index] = ui.value;
      drawScene(count);
    };
  }

  console.log(listPolygon)
  var coordinates = [];
  listPolygon.forEach(polygon => {
    polygon.coordinate.forEach(num => {
      coordinates.push(num)
    });
  });

  
  var listCoordinate = new Float32Array(coordinates);
    
  setGeometry(gl, listCoordinate);
  drawScene(count)

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

    // Draw the geometry.
    var primitiveType = gl.TRIANGLES;
    var offset = 0;
    gl.drawArrays(primitiveType, offset, count);
  }

}

function setGeometry(gl, coordinate) {
  gl.bufferData(
      gl.ARRAY_BUFFER,
      coordinate,
      gl.STATIC_DRAW);
}

function addPolygon() {
  listPolygon.push(new Polygon());
  count += 18;

  var listCoordinate = new Array();
  listPolygon.forEach(polygon => {
    listCoordinate.concat(polygon.coordinate);
  });

  main();
}

document.getElementById("addPolygon").addEventListener("click", addPolygon)

function help() {
  alert(
    "Tekan tombol Add Polygon untuk menambah polygon\n" +
    "Gunakan slider untuk mengatur kontras warna merah, hijau, dan biru\n" +
    "Tekat tombol Save Polygon untuk melakukan download dari polygon yang telah digambar\n" +
    "Untuk load polygon, lakukan input file dan pilih file dalam bentuk .txt\n" +
    "Kemudian tekan tombol Load Polygon"
  )
}

document.getElementById("help").addEventListener("click", help)

function download(file, text) {
              
  //creating an invisible element
  var element = document.createElement('a');
  element.setAttribute('href', 
  'data:text/plain;charset=utf-8, '
  + encodeURIComponent(text));
  element.setAttribute('download', file);

  document.body.appendChild(element);

  //onClick property
  element.click();

  document.body.removeChild(element);
}


document.getElementById("savePolygon").addEventListener("click", function () {
  var  filename = "filePolygon";
  var text = JSON.stringify(listPolygon);
  download(filename, text);
});

document.getElementById("readPolygon").addEventListener("click", function() {
  var fileElement = document.getElementById("inputfile");
  var fr=new FileReader(); 
  fr.onload = function(evt) {
    console.log(evt.target.result);
    var content = evt.target.result;
    var obj = JSON.parse(content.substring(1, content.length));
    listPolygon = []
    obj.forEach(item => {
      console.log(item.id)
      listPolygon.push(new Polygon(
        item.id,
        item.x,
        item.y,
        item.r,
        item.coordinate,
        item.color
        ))
      count += 18;

      var listCoordinate = new Array();
      listPolygon.forEach(polygon => {
        listCoordinate.concat(polygon.coordinate);
      });

      main();
    });

    

  };
  var file = fileElement.files[0];
  fr.readAsText(file);
});

main();