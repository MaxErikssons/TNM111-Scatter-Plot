function createScatterPlot(
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
