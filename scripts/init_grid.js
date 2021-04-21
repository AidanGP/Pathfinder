// Initialise the grid with empty cells and the starting spots for nodes
const setGrid = (arr) => {
  /* 
  
  */
  SIZE_X = arr[0].length;
  SIZE_Y = arr.length;
  const table = document.getElementById("table");
  table.innerHTML = "";
  for (let i = 0; i < SIZE_Y; i++) {
    const row = document.createElement("TR");
    table.appendChild(row);

    for (let j = 0; j < SIZE_X; j++) {
      const cell = document.createElement("TD");
      const ID = i + "," + j;
      cell.id = ID;

      const encoding = arr[i][j];

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
