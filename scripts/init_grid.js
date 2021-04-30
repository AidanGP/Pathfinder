const setGrid = (arr) => {
  /* 
    Initialise the grid with empty cells and the starting spots for nodes
    based on a given array.
  */

  // Get the dimensions of the given array
  SIZE_X = arr[0].length;
  SIZE_Y = arr.length;

  // Get the table element
  const table = document.getElementById("table");

  // Reset the table just in case
  table.innerHTML = "";

  // Here we iterate through and create the table
  for (let i = 0; i < SIZE_Y; i++) {
    // Making row elements
    const row = document.createElement("TR");
    table.appendChild(row);

    for (let j = 0; j < SIZE_X; j++) {
      // Making cell elements and giving them the desired properties
      const cell = document.createElement("TD");
      // Get the corresponding value in the given array
      // This is encoded from about 0-3 not really sure at this point
      const encoding = arr[i][j];

      // Decode the encoded integer back into its css/html class
      let cell_class;
      switch (encoding) {
        case CELL_ENCODING:
          cell_class = CELL;
          break;
        case BLOCK_ENCODING:
          cell_class = WALL;
          break;
        case S_NODE_ENCODING:
          cell_class = S_NODE;
          break;
        case E_NODE_ENCODING:
          cell_class = E_NODE;
      }
      cell.className = cell_class;
      row.appendChild(cell);
    }
  }
};
