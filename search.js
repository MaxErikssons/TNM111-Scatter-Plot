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
