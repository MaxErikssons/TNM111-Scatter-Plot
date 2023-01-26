function createPlot(data) {
  // Get canvas element from HTML
  var canvas = document.getElementById('scatterCanvas');
  var ctx = canvas.getContext('2d');

  //Clear canvas
  clearCanvas(ctx, canvas);
  console.log(data);
  // set the value range
  const valueRange = setValueRange(data);

  // draw the x- and y-axis
  drawAxis(ctx, valueRange);
  // display the data points
  displayDataPoints(ctx, data, valueRange);

  // Variable to keep track of the selected point
  var selectedPoint = null;

  // Add right-click event listener to the canvas
  canvas.addEventListener('contextmenu', function (event) {
    event.preventDefault();

    // Get the mouse click coordinates
    var clickedPoint = {
      x: event.pageX - canvas.offsetLeft,
      y: event.pageY - canvas.offsetTop,
    };

    // Check if the mouse clicked on a point, if so - update selected point.
    selectedPoint = searchPoints(ctx, data, valueRange, clickedPoint);
    if (selectedPoint) {
      // Use the selected points along with the data to find nearest neighbors.
      const closest = findNearestNeigbor(data, selectedPoint);

      // Highlight the nearest neighbors along with the selected point (in a different color).
      highlightClosest(ctx, closest, valueRange);
      hightLightSelected(ctx, selectedPoint, valueRange);
    }
  });
}

//Clear the canvas.
function clearCanvas(ctx, canvas) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// Set value range
function setValueRange(data) {
  let minX = Infinity,
    maxX = -Infinity,
    minY = Infinity,
    maxY = -Infinity;
  for (let point of data) {
    minX = Math.min(minX, point.x);
    maxX = Math.max(maxX, point.x);
    minY = Math.min(minY, point.y);
    maxY = Math.max(maxY, point.y);
  }
  return { minX, maxX, minY, maxY };
}

// Draw x- and y-axis
function drawAxis(ctx, valueRange, margin = 30) {
  const { minX, maxX, minY, maxY } = valueRange;
  const width = ctx.canvas.width;
  const height = ctx.canvas.height;

  let originX, originY;
  if (minX < 0 && minY < 0) {
    // Offset the origin based on the data range and the margin
    originX = ((0 - minX) / (maxX - minX)) * (width - 2 * margin) + margin;
    originY = ((0 - minY) / (maxY - minY)) * (height - 2 * margin) + margin;
  } else {
    originX = margin;
    originY = height - margin;
  }

  // Draw x-axis
  ctx.beginPath();
  ctx.moveTo(margin, originY);
  ctx.lineTo(width - margin, originY);
  ctx.stroke();

  // Draw y-axis
  ctx.beginPath();
  ctx.moveTo(originX, margin);
  ctx.lineTo(originX, height - margin);
  ctx.stroke();

  // Draw ticks and tick values
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // Draw x-axis ticks and values
  for (let i = 0; i <= maxX; i += 10) {
    const x = ((i - minX) / (maxX - minX)) * (width - 2 * margin) + margin;
    if (i !== 0 && x > originX && x <= width - margin) {
      ctx.beginPath();
      ctx.moveTo(x, originY - 5);
      ctx.lineTo(x, originY + 5);
      ctx.stroke();
      ctx.fillText(i, x, originY + 20);
    }
  }

  for (let i = 0; i >= minX; i -= 10) {
    const x = ((i - minX) / (maxX - minX)) * (width - 2 * margin) + margin;
    if (i !== 0 && x < originX && x >= margin) {
      ctx.beginPath();
      ctx.moveTo(x, originY - 5);
      ctx.lineTo(x, originY + 5);
      ctx.stroke();
      ctx.fillText(i, x, originY + 20);
    }
  }

  // Draw y-axis ticks and values
  for (let i = 0; i >= minY; i -= 10) {
    const y = ((i - minY) / (maxY - minY)) * (height - 2 * margin) + margin;
    if (i !== 0 && y <= originY && y >= margin) {
      ctx.beginPath();
      ctx.moveTo(originX - 5, y);
      ctx.lineTo(originX + 5, y);
      ctx.stroke();
      ctx.fillText(-i, originX - 20, y);
    }
  }

  for (let i = 0; i <= maxY; i += 10) {
    const y = ((i - minY) / (maxY - minY)) * (height - 2 * margin) + margin;
    if (i !== 0 && y >= originY && y <= height - margin) {
      ctx.beginPath();
      ctx.moveTo(originX - 5, y);
      ctx.lineTo(originX + 5, y);
      ctx.stroke();
      ctx.fillText(-i, originX - 20, y);
    }
  }
}

// Display data points
function displayDataPoints(ctx, data, valueRange) {
  for (let point of data) {
    // calculate the position of the point on the canvas
    const pos = cartesianToCanvas(ctx, point, valueRange);
    const color = point.color;
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, 5, 0, 2 * Math.PI);
    ctx.fillStyle = color === 'a' ? 'blue' : color === 'b' ? 'red' : 'green';
    ctx.fillText('(' + point.x + ',' + point.y + ')', pos.x + 10, pos.y + 10);
    ctx.fill();
  }
}

// Get canvas position of a point.
function cartesianToCanvas(ctx, point, valueRange, margin = 30) {
  const { minX, maxX, minY, maxY } = valueRange;
  const width = ctx.canvas.width;
  const height = ctx.canvas.height;
  const x = ((point.x - minX) / (maxX - minX)) * (width - 2 * margin) + margin;
  const y = ((maxY - point.y) / (maxY - minY)) * (height - 2 * margin) + margin;

  return { x: x, y: y };
}

// Get cartesian coordinate from current canvas position.
function canvasToCartesian(ctx, point, valueRange, margin = 30) {
  const { minX, maxX, minY, maxY } = valueRange;
  const width = ctx.canvas.width;
  const height = ctx.canvas.height;
  const pos = {
    x:
      Math.round(
        (((point.x - margin) / (width - 2 * margin)) * (maxX - minX) + minX) *
          100
      ) / 100,
    y: Math.round(
      (-(((point.y - margin) / (height - 2 * margin)) * (maxY - minY) - maxY) *
        100) /
        100
    ),
  };

  return { pos };
}

// Check if user clicked on a point on the grid. If not, return null.
function searchPoints(ctx, data, valueRange, clickedPoint) {
  // Compare clicked position with the location of each point.
  for (let point of data) {
    const pos = cartesianToCanvas(ctx, point, valueRange);
    if (
      Math.abs(pos.x - clickedPoint.x) < 5 &&
      Math.abs(pos.y - clickedPoint.y) < 5
    ) {
      //Convert to cartesian coordinates.
      return canvasToCartesian(ctx, pos, valueRange);
    }
  }
  return null;
}

// Find the five nearest neighbors to the selected point.
function findNearestNeigbor(data, selectedPoint) {
  var pointDistance = [];
  for (let point of data) {
    // Don't compare with same point.
    if (point.x != selectedPoint.pos.x && point.y != selectedPoint.pos.y) {
      pointDistance.push({
        x: point.x,
        y: point.y,
        distance: euclidianDistance(point, selectedPoint.pos),
      });
    }
  }

  // Sort the list
  pointDistance.sort(function (a, b) {
    return a.distance - b.distance;
  });

  // We are only interested of the five nearest.
  return pointDistance.slice(0, 5);
}

// Calculate the Euclidian distance.
function euclidianDistance(point1, point2) {
  return Math.sqrt(
    Math.pow(point1.x - point2.x, 2) + Math.pow(point1.y - point2.y, 2)
  );
}

// Highlight the closest points with red circles.
function highlightClosest(ctx, closest, valueRange) {
  for (var i = 0; i < closest.length; i++) {
    // Convert to canvas coordinates.
    var point = cartesianToCanvas(ctx, closest[i], valueRange);
    // Draw a red circle around the closest points.
    ctx.beginPath();
    ctx.arc(point.x, point.y, 7, 0, 2 * Math.PI);
    ctx.strokeStyle = 'red';
    ctx.stroke();
  }
}

// Highlight the selected point with an orange circle.
function hightLightSelected(ctx, selectedPoint, valueRange) {
  // Convert to canvas coordinates.
  var point = cartesianToCanvas(ctx, selectedPoint.pos, valueRange);
  // Draw an orange circle around the selected point.
  ctx.beginPath();
  ctx.arc(point.x, point.y, 7, 0, 2 * Math.PI);
  ctx.strokeStyle = 'orange';
  ctx.stroke();
}
