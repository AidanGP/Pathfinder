const gridToArray = () => {
  /* 
    Convert the current grid to a 2D array
    Grid -> Array
  */
  const table = document.getElementById("table");
  const grid = [];
  // Iterate through the grid and encode the current cell as a digit from 0-3
  for (let i = 0; i < table.rows.length; i++) {
    grid.push([]);
    for (let j = 0; j < table.rows[i].cells.length; j++) {
      
      // The class of a cell in the grid
      const cell = table.rows[i].cells[j].className;

      // Switch statement: cell classname -> encoded value from 0-3
      let encoded_item;
      switch (cell) {
        case WALL:
          encoded_item = BLOCK_ENCODING;
          break;
        case S_NODE:
          encoded_item = S_NODE_ENCODING;
          break;
        case E_NODE:
          encoded_item = E_NODE_ENCODING;
          break;
        case CELL:
          encoded_item = CELL_ENCODING;
          break;
        default:
          encoded_item = CELL_ENCODING;
      }
      grid[i].push(encoded_item);
    }
  }
  // Return the encoded table
  return grid;
};

const saveBoard = () => {
  /* 
    Save a copy of the current grid as a .csv file
    Grid -> .CSV
  */

  // Return if the buttons are disabled
  if (is_disabled) return;
  // Prompt for a file name
  const file_name = prompt("Please enter a file name", "File Name");
  if (file_name != null) {
    // Get the current grid (encoded)
    const grid = gridToArray();

    // Format the grid array into a list of rows (like a csv file)
    const csvRows = [];
    for (var i = 0; i < grid.length; ++i) {
      csvRows.push(grid[i].join(","));
    }
    const csvString = csvRows.join("\r\n");

    // Download the csv file
    const a = document.createElement("a");
    a.href = "data:attachment/csv," + csvString;
    a.target = "_blank";
    a.download = file_name + ".csv";
    document.body.appendChild(a);
    a.click();
  }
};
