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
      return createScatterPlot(
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
      return createScatterPlot(
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
      return createScatterPlot(
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
      return createScatterPlot(
        initialData,
        null,
        selectedPoint,
        previouslySelectedPoint
      );
    }
  });
}
