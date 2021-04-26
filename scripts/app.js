let is_disabled = false; // Should the buttons be disabled

// HELPER FUNCTIONS

/* 
  Sleep for a number of milliseconds
*/
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const setButtonClass = (class_name) => {
  /* 
    Used to disable / enable buttons during animations
  */
  const a = document.getElementsByTagName("a");
  for (let i = 0; i < a.length; i++) {
    a[i].className = class_name;
  }
};

const changeTableDims = () => {
  /*
    ok so basically
    if there is information on the board i cant resize it without losing said information
    So if the board is empty i can automatically resize it
  */

  const current_board = gridToArray();
  const n_walls = getBlockedCells(current_board).length;

  if (n_walls === 0) {
    clearBoard();
  }
}

const getCoords = (cell) => {
  const row = Math.floor(cell / SIZE_X);
  const col = cell - SIZE_X * row;
  return [col, row];
}

const defaultGrid = () => {
  /* 
    get a 2d array that is empty aside from the start and end nodes
  */
  SIZE_X = Math.floor(window.innerWidth / 35);
  SIZE_Y = Math.floor(window.innerHeight / 35);
  let arr = [];
  for (let i = 0; i < SIZE_Y; i++) {
    arr.push([]);
    for (let j = 0; j < SIZE_X; j++) {
      if (i == START_ROW(SIZE_Y) && j == START_COL(SIZE_X)) {
        arr[i].push(S_NODE_ENCODING);
      } else if (i == END_ROW(SIZE_Y) && j == END_COL(SIZE_X)) {
        arr[i].push(E_NODE_ENCODING);
      } else {
        arr[i].push(CELL_ENCODING);
      }
    }
  }
  return arr;
};

const clearBoard = () => {
  /* 
    Erase the board back to the default grid (empty aside from 2 nodes)
  */
  if (is_disabled) return;
  is_disabled = false;
  setButtonClass("");
  const default_grid = defaultGrid();
  setGrid(default_grid);
  // Remove the old mouse listeners
  removeMouseListeners();
  setMouseListeners();
};

const restartBoard = () => {
  /* 
    Clear all visualisations from the board
  */
  if (is_disabled) return;
  const table = document.getElementById("table");
  for (let i = 0; i < SIZE_Y; i++) {
    for (let j = 0; j < SIZE_X; j++) {
      const cell = table.rows[i].cells[j];
      if (cell.className == VISITED || cell.className == PATH) {
        cell.className = CELL;
      }
    }
  }
};

// MAINLINE

// Initialise the board and all that
clearBoard();
// Start checking if they resize the window
window.addEventListener('resize', changeTableDims);