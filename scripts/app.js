let is_disabled = false; // Should the buttons be disabled

// HELPER FUNCTIONS

/* 
  Sleep for a number of milliseconds
*/
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const disable_bts = (disable) => {
  /* 
    Used to disable / enable buttons during animations
  */
  const nav_items = document.getElementsByClassName("nav-item");
  const dropdown_items = document.getElementsByClassName("dropdown-item");
  if (disable) {
    for (const nav_item of nav_items) {
      nav_item.classList.add("disabled");
    }
    for (const dropdown_item of dropdown_items) {
      dropdown_item.classList.add("disabled");
    }
  } else {
    is_disabled = false;
    for (const nav_item of nav_items) {
      nav_item.classList.remove("disabled");
    }
    for (const dropdown_item of dropdown_items) {
      dropdown_item.classList.remove("disabled");
    }
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
};

// Information overlay
const algorithm_descriptions = {
  Dijstras: DIJSTRAS_DESCRIPTION,
  "A*": A_STAR_DESCRIPTION,
  "Breadth First Search": BREADTH_FIRST_SEARCH_DESCRIPTION,
  "Best First Search": BEST_FIRST_SEARCH_DESCRIPTION,
};

const overlay_on = (algorithm) => {
  const description_heading = document.getElementById("algorithm_name");
  const description_body = document.getElementById("algorithm_description");

  const algorithm_description = algorithm_descriptions[algorithm];

  description_heading.innerHTML = algorithm;
  description_body.innerHTML = algorithm_description;

  document.getElementById("overlay").style.display = "block";
};

const overlay_off = () => {
  document.getElementById("overlay").style.display = "none";
};

const coords_of = (cell) => {
  const row = Math.floor(cell / SIZE_X);
  const col = cell - SIZE_X * row;
  return [col, row];
};

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
  path_found = false;
  disable_bts(false);
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
  path_found = false;
  const table = document.getElementById("table");
  for (let i = 0; i < SIZE_Y; i++) {
    for (let j = 0; j < SIZE_X; j++) {
      const cell = table.rows[i].cells[j];
      if (
        [VISITED, PATH].includes(cell.className)
      ) {
        cell.className = CELL;
      }
    }
  }
};

// MAINLINE

// Initialise the board and all that
clearBoard();
// Start checking if they resize the window
window.addEventListener("resize", changeTableDims);
