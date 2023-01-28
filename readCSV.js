const fileInput = document.getElementById('csv');
const readFile = () => {
  const reader = new FileReader();
  reader.onload = (event) => {
    // Read file data
    var csvdata = event.target.result;
    var data = csvdata.split('\r');

    // Filter out empty line and map data to JSON-format.
    var jsonData = data
      .filter((item) => item !== '\n')
      .map(function (item) {
        var values = item.split(',');
        return {
          x: parseInt(values[0]),
          y: parseInt(values[1]),
          type: values[2],
        };
      });

    // Create a plot with the data
    createPlot(jsonData, null, null, null, false);
  };
  // start reading the file. When it is done, call the onload event defined above.
  reader.readAsText(fileInput.files[0]);
};

fileInput.addEventListener('change', readFile);
