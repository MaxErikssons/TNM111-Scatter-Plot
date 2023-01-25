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
    drawAxis(ctx, canvas);
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
function drawAxis(ctx, canvas) {
  // Draw the x-axis
  ctx.beginPath();

  ctx.moveTo(0, canvas.height / 2);
  ctx.lineTo(canvas.width, canvas.height / 2);

  // Draw the y-axis
  ctx.moveTo(canvas.width / 2, 0);
  ctx.lineTo(canvas.width / 2, canvas.height);

  ctx.strokeStyle = 'black';
  ctx.stroke();
}

//Draw the grid.
function drawGrid(ctx, canvas, minMaxValues) {
  //calculate the range of x and y
  var xRange = minMaxValues.xMax - minMaxValues.xMin;
  var yRange = minMaxValues.yMax - minMaxValues.yMin;

  //determine the number of grid lines and the spacing
  var xLines = Math.round(xRange / 10);
  var yLines = Math.round(yRange / 10);
  var xSpace = Math.round(canvas.width / xLines);
  var ySpace = Math.round(canvas.height / yLines);

  ctx.beginPath();
  //draw the vertical grid lines
  for (var x = canvas.width / 2; x <= canvas.width; x += xSpace) {
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
  }

  for (var x = canvas.width / 2; x >= 0; x -= xSpace) {
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
  }

  //draw the horizontal grid lines
  for (var y = canvas.height / 2; y <= canvas.height; y += ySpace) {
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
  }

  //draw the horizontal grid lines
  for (var y = canvas.height / 2; y >= 0; y -= ySpace) {
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
  }

  //set the grid style and draw the lines
  ctx.strokeStyle = 'whitesmoke';
  ctx.stroke();
}

//Draw ticks
function addTicks(ctx, canvas, minMaxValues) {
  //Calculate the number of tick marks and the spacing for the x- and y-axis
  var xRange = minMaxValues.xMax - minMaxValues.xMin;
  var xTickMarks = Math.round(xRange / 10);
  var xTickSpace = Math.round(canvas.width / xTickMarks);

  var yRange = minMaxValues.yMax - minMaxValues.yMin;
  var yTickMarks = Math.round(yRange / 10);
  var yTickSpace = Math.round(canvas.height / yTickMarks);

  var counter = 1;

  ctx.beginPath();
  //Draw the tick marks on the x-axis
  for (
    var x = canvas.width / 2 + xTickSpace;
    x <= canvas.width;
    x += xTickSpace
  ) {
    ctx.moveTo(x, canvas.height / 2 - 5);
    ctx.lineTo(x, canvas.height / 2 + 5);
    ctx.fillText(xTickMarks * counter, x, canvas.height / 2 + 15);
    counter++;
  }

  counter = -1;
  //Draw the tick marks on the x-axis
  for (var x = canvas.width / 2 - xTickSpace; x >= 0; x -= xTickSpace) {
    ctx.moveTo(x, canvas.height / 2 - 5);
    ctx.lineTo(x, canvas.height / 2 + 5);
    ctx.fillText(xTickMarks * counter, x, canvas.height / 2 + 15);
    counter--;
  }

  counter = -1;
  //Draw the tick marks on the y-axis
  for (
    var y = canvas.height / 2 + yTickSpace;
    y <= canvas.height;
    y += yTickSpace
  ) {
    ctx.moveTo(canvas.width / 2 - 5, y);
    ctx.lineTo(canvas.width / 2 + 5, y);
    ctx.fillText(yTickMarks * counter, canvas.width / 2 - 20, y);
    counter--;
  }

  counter = 1;
  //Draw the tick marks on the y-axis
  for (var y = canvas.height / 2 - yTickSpace; y >= 0; y -= yTickSpace) {
    ctx.moveTo(canvas.width / 2 - 5, y);
    ctx.lineTo(canvas.width / 2 + 5, y);
    ctx.fillText(yTickMarks * counter, canvas.width / 2 - 20, y);
    counter++;
  }

  ctx.strokeStyle = 'gray';
  ctx.stroke();
}

//Plot the data on the grid.
function plotData(ctx, canvas, data, minMaxValues) {
  var xMin = minMaxValues.xMin;
  var yMin = minMaxValues.yMin;
  var xMax = minMaxValues.xMax;
  var yMax = minMaxValues.yMax;

  //calculate the range of x and y
  var xRange = xMax - xMin;
  var yRange = yMax - yMin;

  // Plot the data
  for (var i = 0; i < data.length; i++) {
    // Get the x and y values.
    //DETTA ÄR HÅRDKODAT OCH ÄR INTE ALLTID SKALENLIGT! Vet inte hur det ska lösas.
    var x = ((data[i].x + 60) / 120) * canvas.width;
    var y = canvas.height - ((data[i].y + 60) / 120) * canvas.height;
    var color = data[i].color;

    // Draw a circle at the x and y position
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, 2 * Math.PI);
    ctx.fillStyle = color === 'a' ? 'blue' : color === 'b' ? 'red' : 'green';
    ctx.fill();
    ctx.fillText('(' + data[i].x + ',' + data[i].y + ')', x + 8, y + 8);
  }
}
