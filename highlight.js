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
