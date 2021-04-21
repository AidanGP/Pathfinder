let is_disabled = false; // Should the buttons be disabled


// Choose a random theme (5 colors) for the visited nodes
const rand_int = Math.floor(Math.random() * THEMES.length);
const rand_theme = THEMES[rand_int];

const root = document.documentElement;
// Assign the 5 colors to their css elements
for (let i = 0; i < 4; i++) {
  root.style.setProperty("--visited-" + i, rand_theme[i]);
}

const reportWindowSize = () => {

  const current_board = gridToArray();
  const n_walls = getBlockedCells(current_board).length;

  if (n_walls === 0) {
    clearBoard();
  }
}

window.addEventListener('resize', reportWindowSize);


// HELPER FUNCTIONS

//
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

const defaultGrid = () => {
  /* 
    get a 2d array that is empty aside from the start and end nodes
  */
  SIZE_X = Math.floor(window.innerWidth / 50);
  SIZE_Y = Math.floor(window.innerHeight / 50);
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

clearBoard();
