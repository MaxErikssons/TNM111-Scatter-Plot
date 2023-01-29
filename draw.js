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
  drawDataPoints(ctx, data, valueRange);

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
  ctx.fillStyle = 'black';
  ctx.strokeStyle = 'black';
  ctx.beginPath();
  ctx.moveTo(margin, originY);
  ctx.lineTo(width - margin, originY);
  ctx.stroke();

  // Draw y-axis
  ctx.fillStyle = 'black';
  ctx.strokeStyle = 'black';
  ctx.beginPath();
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

// Draw data points
function drawDataPoints(ctx, data, valueRange) {
  let types = [];
  for (let point of data) {
    // calculate the position of the point on the canvas
    const pos = cartesianToCanvas(ctx, point, valueRange);
    ctx.beginPath();
    switch (point.type) {
      case 'a':
      case 'foo':
        ctx.rect(pos.x - 5, pos.y - 5, 10, 10);
        if (!types.includes(point.type)) types.push(point.type);
        break;
      case 'b':
      case 'bar':
        ctx.moveTo(pos.x, pos.y - 5);
        ctx.lineTo(pos.x + 5, pos.y + 5);
        ctx.lineTo(pos.x - 5, pos.y + 5);
        ctx.closePath();
        if (!types.includes(point.type)) types.push(point.type);
        break;
      case 'c':
      case 'baz':
        ctx.arc(pos.x, pos.y, 5, 0, 2 * Math.PI);
        if (!types.includes(point.type)) types.push(point.type);
        break;
    }
    ctx.fillStyle = getQuadrantColor(point);

    ctx.fillText('(' + point.x + ',' + point.y + ')', pos.x + 10, pos.y + 10);
    ctx.fill();
  }

  //Add legend
  addLegend(ctx, types);
}

// Function to add a legend at the top right corner.
function addLegend(ctx, types) {
  ctx.fillStyle = 'black';
  ctx.fillRect(ctx.canvas.width - 45, 10, 10, 10);
  ctx.fillText(types.includes('a') ? 'a' : 'foo', ctx.canvas.width - 10, 15);

  ctx.beginPath();
  ctx.moveTo(ctx.canvas.width - 40, 27);
  ctx.lineTo(ctx.canvas.width - 35, 37);
  ctx.lineTo(ctx.canvas.width - 45, 37);
  ctx.closePath();
  ctx.fill();
  ctx.fillText(types.includes('b') ? 'b' : 'bar', ctx.canvas.width - 10, 35);

  ctx.fillStyle = 'black';
  ctx.arc(ctx.canvas.width - 40, 50, 5, 0, 2 * Math.PI);
  ctx.fill();
  ctx.fillText(types.includes('c') ? 'c' : 'baz', ctx.canvas.width - 10, 50);
}
