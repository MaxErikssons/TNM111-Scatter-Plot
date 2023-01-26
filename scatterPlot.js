function createPlot(data) {
  // Get canvas element from HTML
  var canvas = document.getElementById('scatterCanvas');
  var ctx = canvas.getContext('2d');

  //Clear canvas
  clearCanvas(ctx, canvas);

  console.log(data);

  //display error message
  if (data.length == 0) {
    displayErrorMessage(ctx, canvas);
  } else {
    var minMaxValues = calculateMinMaxValues(data);
    drawGrid(ctx, canvas, minMaxValues);
    drawAxis(ctx, canvas, minMaxValues);
    addTicks(ctx, canvas, minMaxValues);
    plotData(ctx, canvas, data, minMaxValues);
  }
}

//Clear the canvas.
function clearCanvas(ctx, canvas) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

//Display an error message when data is empty.
function displayErrorMessage(ctx, canvas) {
  ctx.textAlign = 'center';
  ctx.font = '48px serif';
  ctx.fillText('Data was empty', canvas.width / 2, canvas.height / 2);
}

//Calculate max and min values of x and y for given data.
function calculateMinMaxValues(data) {
  var xMin = Math.min.apply(
    Math,
    data.map(function (item) {
      return item.x;
    })
  );
  var xMax = Math.max.apply(
    Math,
    data.map(function (item) {
      return item.x;
    })
  );
  var yMin = Math.min.apply(
    Math,
    data.map(function (item) {
      return item.y;
    })
  );
  var yMax = Math.max.apply(
    Math,
    data.map(function (item) {
      return item.y;
    })
  );
  return { xMin, xMax, yMin, yMax };
}

//Draw the x- and y-axis.
function drawAxis(ctx, canvas, minMaxValues) {
  var xyScale = scale(canvas, minMaxValues);
  var xyRange = calculateRange(minMaxValues);

  // Draw the x-axis
  ctx.beginPath();

  ctx.moveTo(0, xyScale.y * minMaxValues.yMax);
  ctx.lineTo(xyScale.x * xyRange.x, xyScale.y * minMaxValues.yMax);

  // Draw the y-axis
  ctx.moveTo(xyScale.x * Math.abs(minMaxValues.xMin), 0);
  ctx.lineTo(xyScale.x * Math.abs(minMaxValues.xMin), xyScale.y * xyRange.y);
  console.log(xyScale.y * xyRange.y);
  ctx.strokeStyle = 'black';
  ctx.stroke();
}

//Draw the grid.
function drawGrid(ctx, canvas, minMaxValues) {
  var xyScale = scale(canvas, minMaxValues);
  var xyRange = calculateRange(minMaxValues);

  //determine the number of grid lines and the spacing
  var xLines = Math.round(xyRange.x / 10);
  var yLines = Math.round(xyRange.y / 10);
  var xSpace = (xyScale.x * minMaxValues.xMax) / xLines;
  var ySpace = (xyScale.y * Math.abs(minMaxValues.yMin)) / yLines;

  ctx.beginPath();
  //draw the vertical grid lines
  for (
    var x = xyScale.x * Math.abs(minMaxValues.xMin) + xSpace;
    x <= xyScale.x * xyRange.x;
    x += xSpace
  ) {
    ctx.moveTo(x, 0);
    ctx.lineTo(x, xyScale.y * xyRange.y);
  }

  for (
    var x = xyScale.x * Math.abs(minMaxValues.xMin) - xSpace;
    x >= 0;
    x -= xSpace
  ) {
    ctx.moveTo(x, 0);
    ctx.lineTo(x, xyScale.y * xyRange.y);
  }

  //draw the horizontal grid lines
  for (
    var y = xyScale.y * minMaxValues.yMax + ySpace;
    y < xyScale.y * xyRange.y;
    y += ySpace
  ) {
    ctx.moveTo(0, y);
    ctx.lineTo(xyScale.x * xyRange.x, y);
  }

  for (var y = xyScale.y * minMaxValues.yMax - ySpace; y > 0; y -= ySpace) {
    ctx.moveTo(0, y);
    ctx.lineTo(xyScale.x * xyRange.x, y);
  }

  //set the grid style and draw the lines
  ctx.strokeStyle = 'whitesmoke';
  ctx.stroke();
}

//Draw ticks
function addTicks(ctx, canvas, minMaxValues) {
  //Calculate the number of tick marks and the spacing for the x- and y-axis
  var xyScale = scale(canvas, minMaxValues);
  var xyRange = calculateRange(minMaxValues);

  var xTickMarks = Math.round(xyRange.x / 10);
  var yTickMarks = Math.round(xyRange.y / 10);

  var xTickSpace = (xyScale.x * minMaxValues.xMax) / xTickMarks;
  var yTickSpace = (xyScale.y * Math.abs(minMaxValues.yMin)) / yTickMarks;

  var xTickValue = Math.round(minMaxValues.xMax / xTickMarks);
  var yTickValue = Math.round(minMaxValues.yMax / yTickMarks);
  var counter = 1;

  ctx.beginPath();
  //Draw the tick marks on the x-axis
  for (
    var x = xyScale.x * Math.abs(minMaxValues.xMin) + xTickSpace;
    x <= xyScale.x * xyRange.x;
    x += xTickSpace
  ) {
    ctx.moveTo(x, canvas.height / 2 - 5);
    ctx.lineTo(x, canvas.height / 2 + 5);
    ctx.fillText(xTickValue * counter, x, canvas.height / 2 + 15);
    counter++;
  }

  counter = -1;
  //Draw the tick marks on the x-axis
  for (
    var x = xyScale.x * Math.abs(minMaxValues.xMin) - xTickSpace;
    x >= 0;
    x -= xTickSpace
  ) {
    ctx.moveTo(x, xyScale.y * minMaxValues.yMax - 5);
    ctx.lineTo(x, xyScale.y * minMaxValues.yMax + 5);
    ctx.fillText(xTickValue * counter, x, xyScale.y * minMaxValues.yMax + 15);
    counter--;
  }

  counter = -1;
  //Draw the tick marks on the y-axis
  for (
    var y = xyScale.y * minMaxValues.yMax + yTickSpace;
    y < xyScale.y * xyRange.y;
    y += yTickSpace
  ) {
    ctx.moveTo(xyScale.x * Math.abs(minMaxValues.xMin) - 5, y);
    ctx.lineTo(xyScale.x * Math.abs(minMaxValues.xMin) + 5, y);
    ctx.fillText(
      yTickValue * counter,
      xyScale.x * Math.abs(minMaxValues.xMin) - 20,
      y
    );
    counter--;
  }

  counter = 1;
  //Draw the tick marks on the y-axis
  for (
    var y = xyScale.y * minMaxValues.yMax - yTickSpace;
    y >= 0;
    y -= yTickSpace
  ) {
    ctx.moveTo(xyScale.x * Math.abs(minMaxValues.xMin) - 5, y);
    ctx.lineTo(xyScale.x * Math.abs(minMaxValues.xMin) + 5, y);
    ctx.fillText(
      yTickValue * counter,
      xyScale.x * Math.abs(minMaxValues.xMin) - 20,
      y
    );
    counter++;
  }

  ctx.strokeStyle = 'gray';
  ctx.stroke();
}

//Plot the data on the grid.
function plotData(ctx, canvas, data, minMaxValues) {
  var xyScale = scale(canvas, minMaxValues);

  // Plot the data
  for (var i = 0; i < data.length; i++) {
    // Get the x and y values.
    //DETTA ÄR HÅRDKODAT OCH ÄR INTE ALLTID SKALENLIGT! Vet inte hur det ska lösas.
    console.log(canvas.height - (data[i].y - minMaxValues.yMin) * xyScale.y);
    var x = (data[i].x - minMaxValues.xMin) * xyScale.x;
    var y = canvas.height - (data[i].y - minMaxValues.yMin) * xyScale.y;
    var color = data[i].color;

    // Draw a circle at the x and y position
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, 2 * Math.PI);
    ctx.fillStyle = color === 'a' ? 'blue' : color === 'b' ? 'red' : 'green';
    ctx.fill();
    ctx.fillText('(' + data[i].x + ',' + data[i].y + ')', x + 8, y + 8);
  }
}

function scale(canvas, minMaxValues) {
  //calculate the range of x and y
  var xyRange = calculateRange(minMaxValues);

  //calculate the scale of x and y
  var x = canvas.width / xyRange.x;
  var y = canvas.height / xyRange.y;

  return { x, y };
}

function calculateRange(minMaxValues) {
  var xMin = minMaxValues.xMin;
  var yMin = minMaxValues.yMin;
  var xMax = minMaxValues.xMax;
  var yMax = minMaxValues.yMax;

  //calculate the range of x and y
  var x = xMax - xMin;
  var y = yMax - yMin;

  return { x, y };
}
