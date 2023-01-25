const fileInput = document.getElementById('csv');
const readFile = () => {
  const reader = new FileReader();
  reader.onload = (event) => {
    // Read file data
    var csvdata = event.target.result;

    // Map the data to JSON-format
    var data = csvdata.split('\n');
    var jsonData = data.map(function (item) {
      var values = item.split(',');
      return {
        x: parseInt(values[0]),
        y: parseInt(values[1]),
        color: values[2],
      };
    });

    // Create a plot with the data
    createPlot(jsonData);
  };
  // start reading the file. When it is done, call the onload event defined above.
  reader.readAsText(fileInput.files[0]);
};

fileInput.addEventListener('change', readFile);
