// Convers the grid to a two dimensional array
const gridToArray = () => {
  // Check if the buttons are enabled
  if (is_disabled) return;
  const table_arr = [];
  const table = document.getElementById("table");
  // Iterate through the grid
  for (let i = 0; i < SIZE_Y; i++) {
    table_arr.push([]);
    for (let j = 0; j < SIZE_X; j++) {
      let encoded_item;
      const cell = table.rows[i].cells[j].className;
      // Switch statement: cell classname -> encoded value from 0-3
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
      table_arr[i].push(encoded_item);
    }
  }
  // Return the encoded table
  return table_arr;
};

// Save a 2d array as a csv file
const saveBoard = () => {
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
