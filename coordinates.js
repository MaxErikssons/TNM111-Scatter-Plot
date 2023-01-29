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
