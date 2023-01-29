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

// Calculate the Euclidian distance.
function euclidianDistance(point1, point2) {
  return Math.sqrt(
    Math.pow(point1.x - point2.x, 2) + Math.pow(point1.y - point2.y, 2)
  );
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
