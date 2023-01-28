function createPlot(
  initialData,
  newOriginData,
  selectedPoint,
  previouslySelectedPoint,
  leftClick
) {
  // Get canvas element from HTML
  var canvas = document.getElementById('scatterCanvas');
  var ctx = canvas.getContext('2d');

  //Clear canvas
  clearCanvas(ctx, canvas);

  //Draw plot.
  drawPlot(
    ctx,
    initialData,
    newOriginData,
    selectedPoint,
    previouslySelectedPoint,
    canvas,
    leftClick
  );
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
function drawAxis(ctx, valueRange, leftClick, selectedPoint, margin = 30) {
  const { minX, maxX, minY, maxY } = valueRange;
  const width = ctx.canvas.width;
  const height = ctx.canvas.height;

  let originX, originY;
  if (leftClick) {
    originX = cartesianToCanvas(ctx, selectedPoint.pos, valueRange).x;
    originY = cartesianToCanvas(ctx, selectedPoint.pos, valueRange).y;
  } else {
    originX =
      minX < 0
        ? (originX =
            ((0 - minX) / (maxX - minX)) * (width - 2 * margin) + margin)
        : margin;
    originY =
      minY < 0
        ? (originY =
            ((0 - minY) / (maxY - minY)) * (height - 2 * margin) + margin)
        : height - margin;
  }
  // Draw x-axis
  ctx.beginPath();
  ctx.fillStyle = 'black';
  ctx.moveTo(margin, originY);
  ctx.lineTo(width - margin, originY);
  ctx.stroke();

  // Draw y-axis
  ctx.beginPath();
  ctx.fillStyle = 'black';

  ctx.moveTo(originX, margin);
  ctx.lineTo(originX, height - margin);
  ctx.stroke();

  // Draw ticks and tick values
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // Draw x-tick values
  for (let i = 0; i <= maxX; i += 10) {
    const x = ((i - minX) / (maxX - minX)) * (width - 2 * margin) + margin;
    if (i !== 0 && x > originX && x <= width - margin) {
      ctx.beginPath();
      ctx.fillStyle = 'black';
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
      ctx.fillStyle = 'black';
      ctx.moveTo(x, originY - 5);
      ctx.lineTo(x, originY + 5);
      ctx.stroke();
      ctx.fillText(i, x, originY + 20);
    }
  }

  // Draw y-tick values
  for (let i = 0; i <= maxY; i += 10) {
    const y = ((maxY - i) / (maxY - minY)) * (height - 2 * margin) + margin;
    if (i !== 0 && y < originY && y >= margin) {
      ctx.beginPath();
      ctx.moveTo(originX - 5, y);
      ctx.lineTo(originX + 5, y);
      ctx.stroke();
      ctx.fillText(i, originX - 20, y);
    }
  }

  for (let i = 0; i >= minY; i -= 10) {
    const y = ((maxY - i) / (maxY - minY)) * (height - 2 * margin) + margin;
    if (i !== 0 && y > originY && y <= height - margin) {
      ctx.beginPath();
      ctx.moveTo(originX - 5, y);
      ctx.lineTo(originX + 5, y);
      ctx.stroke();
      ctx.fillText(i, originX - 20, y);
    }
  }
}

// Display data points
function displayDataPoints(ctx, data, valueRange) {
  for (let point of data) {
    // calculate the position of the point on the canvas
    const pos = cartesianToCanvas(ctx, point, valueRange);
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, 5, 0, 2 * Math.PI);
    ctx.fillStyle = getQuadrantColor(point);

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
    if (point.x != selectedPoint.pos.x || point.y != selectedPoint.pos.y) {
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

// Get coordinates of mouseclick
function getClickCoordinates(event, canvas) {
  return {
    x: event.pageX - canvas.offsetLeft,
    y: event.pageY - canvas.offsetTop,
  };
}

// Function to determine color based on quadrant
function getQuadrantColor(point) {
  if (point.x >= 0 && point.y >= 0) return 'red';
  if (point.x < 0 && point.y >= 0) return 'green';
  if (point.x < 0 && point.y < 0) return 'blue';
  if (point.x >= 0 && point.y < 0) return 'black';
}

//Draw the plot
function drawPlot(
  ctx,
  initialData,
  newOriginData,
  selectedPoint,
  previouslySelectedPoint,
  canvas,
  leftClick
) {
  let data =
    newOriginData === null
      ? structuredClone(initialData)
      : structuredClone(newOriginData);
  // set the value range
  const valueRange = setValueRange(data);

  // draw the x- and y-axis
  drawAxis(ctx, valueRange, leftClick, selectedPoint);

  // display the data points
  displayDataPoints(ctx, data, valueRange);

  if (previouslySelectedPoint) {
    // Use the selected points along with the data to find nearest neighbors.
    const closest = findNearestNeigbor(data, previouslySelectedPoint);

    // Highlight the nearest neighbors along with the selected point (in a different color).
    highlightClosest(ctx, closest, valueRange);
    hightLightSelected(ctx, previouslySelectedPoint, valueRange);
  }

  // Add left-click ecent listener to the canvas.
  leftClickEvent(
    ctx,
    initialData,
    newOriginData,
    valueRange,
    selectedPoint,
    previouslySelectedPoint,
    canvas,
    leftClick
  );

  // Add right-click event listener to the canvas
  rightClickEvent(
    ctx,
    initialData,
    newOriginData,
    valueRange,
    selectedPoint,
    previouslySelectedPoint,
    canvas
  );
}

// Event for left click
function leftClickEvent(
  ctx,
  initialData,
  newOriginData,
  valueRange,
  selectedPoint,
  previouslySelectedPoint,
  canvas,
  leftClick
) {
  canvas.addEventListener('click', function (event) {
    event.preventDefault();
    let data =
      newOriginData === null
        ? structuredClone(initialData)
        : structuredClone(newOriginData);

    var clickedPoint = getClickCoordinates(event, canvas);
    // Check if the mouse clicked on a point, if so - update selected point.
    selectedPoint = searchPoints(ctx, data, valueRange, clickedPoint);

    // If user selected a point - Set selected point as origin.
    if (
      selectedPoint &&
      newOriginData == null &&
      JSON.stringify(selectedPoint) !== JSON.stringify(previouslySelectedPoint)
    ) {
      // Adjust the data so that the selectedPoint becomes the origin.
      data.forEach((point) => {
        point.x -= selectedPoint.pos.x;
        point.y -= selectedPoint.pos.y;
      });

      selectedPoint.pos.x = 0;
      selectedPoint.pos.y = 0;
      previouslySelectedPoint = selectedPoint;
      leftClick = true;
      return createPlot(
        initialData,
        data,
        selectedPoint,
        previouslySelectedPoint,
        leftClick
      );
    }

    // If user selected same point twice.
    else if (
      selectedPoint &&
      JSON.stringify(selectedPoint) === JSON.stringify(previouslySelectedPoint)
    ) {
      //Reset plot.
      selectedPoint = null;
      previouslySelectedPoint = null;
      leftClick = false;
      return createPlot(
        initialData,
        null,
        selectedPoint,
        previouslySelectedPoint,
        leftClick
      );
    }
  });
}

// Event for right click
function rightClickEvent(
  ctx,
  initialData,
  newOriginData,
  valueRange,
  selectedPoint,
  previouslySelectedPoint,
  canvas
) {
  canvas.addEventListener('contextmenu', function (event) {
    event.preventDefault();

    let data =
      newOriginData === null
        ? structuredClone(initialData)
        : structuredClone(newOriginData);

    // Get the mouse click coordinates
    var clickedPoint = getClickCoordinates(event, canvas);

    // Check if the mouse clicked on a point, if so - update selected point.
    selectedPoint = searchPoints(ctx, data, valueRange, clickedPoint);

    // If user selected a point.
    if (
      selectedPoint &&
      JSON.stringify(selectedPoint) !== JSON.stringify(previouslySelectedPoint)
    ) {
      // Use the selected points along with the data to find nearest neighbors.
      const closest = findNearestNeigbor(data, selectedPoint);

      // Highlight the nearest neighbors along with the selected point (in a different color).
      highlightClosest(ctx, closest, valueRange);
      hightLightSelected(ctx, selectedPoint, valueRange);
      previouslySelectedPoint = selectedPoint;
    }
    // If user selected same point twice.
    else if (
      selectedPoint != null &&
      JSON.stringify(selectedPoint) === JSON.stringify(previouslySelectedPoint)
    ) {
      selectedPoint = null;
      previouslySelectedPoint = null;
      return createPlot(
        initialData,
        null,
        selectedPoint,
        previouslySelectedPoint
      );
    }

    // If user selected a different point.
    else if (
      selectedPoint != null &&
      JSON.stringify(selectedPoint) !== JSON.stringify(previouslySelectedPoint)
    ) {
      previouslySelectedPoint = selectedPoint;
      selectedPoint = null;
      return createPlot(
        initialData,
        null,
        selectedPoint,
        previouslySelectedPoint
      );
    }
  });
}
