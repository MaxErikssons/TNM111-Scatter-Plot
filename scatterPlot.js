function createPlot(data) {
  // Get canvas element from HTML
  var canvas = document.getElementById('scatterCanvas');
  var ctx = canvas.getContext('2d');

  //Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  console.log(data);

  //display error message
  if (data.length == 0) {
    ctx.textAlign = 'center';
    ctx.font = '48px serif';
    ctx.fillText('Data was empty', canvas.width / 2, canvas.height / 2);
  } else {
    // Draw the x-axis
    ctx.beginPath();
    ctx.moveTo(0, canvas.height / 2);
    ctx.lineTo(canvas.width, canvas.height / 2);
    ctx.strokeStyle = 'black';
    ctx.stroke();

    // Draw the y-axis
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();

    // Add a label for the x-axis
    ctx.textAlign = 'center';
    ctx.font = '20px serif';
    ctx.fillText('X-axis', canvas.width / 2, canvas.height - 10);

    // Add a label for the y-axis
    ctx.save();
    ctx.translate(20, canvas.height / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.font = '20px serif';
    ctx.textAlign = 'center';
    ctx.fillText('Y-axis', 0, 0);
    ctx.restore();

    ctx.strokeStyle = 'black';
    ctx.stroke(); //Add stroke to actually draw the line on the canvas.

    // Draw the grid
    for (var x = 0; x <= canvas.width; x += 50) {
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
    }

    for (var y = 0; y <= canvas.height; y += 40) {
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
    }

    ctx.strokeStyle = '#eee';
    ctx.stroke();
    ctx.save();

    //Calculate min/max-value of x and y.
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

    // Plot the data
    for (var i = 0; i < data.length; i++) {
      // Get the x and y values
      var x = data[i].x + canvas.width / 2;
      var y = canvas.height / 2 - data[i].y;
      var color = data[i].color;

      // Draw a circle at the x and y position
      ctx.beginPath();
      ctx.arc(x, y, 5, 0, 2 * Math.PI);
      ctx.fillStyle =
        color === 'a'
          ? 'blue'
          : color === 'foo'
          ? 'blue'
          : color === 'b'
          ? 'red'
          : color === 'baz'
          ? 'red'
          : 'green';
      ctx.fill();
    }
    ctx.restore();
  }
}
