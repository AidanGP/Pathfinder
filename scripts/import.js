const csv_to_arr = (csv) => {
  /* 
    Converts a given csv file to a 2D array
    .CSV -> Array
  */
  const rows = csv.split("\n");
  let arr = [];
  for (let i = 0; i < rows.length; i++) {
    arr.push([]);
    const row = rows[i].split(",");
    for (let j = 0; j < row.length; j++) {
      arr[i].push(parseInt(row[j]));
    }
  }
  return arr;
};

const import_grid = () => {
  /* 
    Get a .csv file and display it on the _grid
  */
  if (is_disabled) return; // Check if the buttons are disabled
  var file_in = document.getElementById("file-input");

  // Check when the contents of the file input is changed
  file_in.onchange = (e) => {
    // Get the file
    const file = e.target.files[0];
    var reader = new FileReader();
    // Read the file
    reader.readAsText(file, "UTF-8");

    // Check that the file is a csv
    if (!file.name.includes(".csv")) {
      alert("Sorry, that doesn't look like a csv file.");
      return;
    }

    // When the file is loaded
    reader.onload = (readerEvent) => {
      // Get content of file
      const content = readerEvent.target.result;
      // convert the csv to a 2d array
      const arr = csv_to_arr(content);
      // A valid grid has a start node and end node...
      if (arr.some(row => row.includes(S_NODE_ENCODING)) && arr.some(row => row.includes(E_NODE_ENCODING))) {
        // Set the grid to said array
        set_grid(arr);

        // Reset the listeners
        remove_mouse_listeners();
        set_mouse_listeners();
      } else {
        alert('Sorry, that doesnt look like a valid grid.');
      }
    };
  };
  file_in.click();
};
