let disable_btns = false; // Should the buttons be disabled

// Choose a random theme (5 colors) for the visited nodes
const rand_int = Math.floor(Math.random() * THEMES.length);
const rand_theme = THEMES[rand_int];

const root = document.documentElement;
// Assign the 5 colors to their css elements
for (let i = 0; i < 5; i++) {
  root.style.setProperty("--visited-" + i, rand_theme[i]);
}

// HELPER FUNCTIONS

// Waits for a number of milliseconds
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// setButtonClass used to disable / enable buttons during animations
const setButtonClass = (class_name) => {
  const a = document.getElementsByTagName("a");
  for (let i = 0; i < a.length; i++) {
    a[i].className = class_name;
  }
};

const defaultGrid = (x, y) => {
  let arr = [];
  for (let i = 0; i < y; i++) {
    arr.push([]);
    for (let j = 0; j < x; j++) {
      if (i == START_ROW(y) && j == START_COL(x)) {
        arr[i].push(S_NODE_ENCODING);
      } else if (i == END_ROW(y) && j == END_COL(x)) {
        arr[i].push(E_NODE_ENCODING);
      } else {
        arr[i].push(CELL_ENCODING);
      }
    }
  }
  return arr;
};

const clearBoard = () => {
  if (disable_btns) return;
  disable_btns = false;
  SIZE_X = Math.floor(window.innerWidth / 50);
  SIZE_Y = Math.floor(window.innerHeight / 50);
  setButtonClass("");
  const default_grid = defaultGrid(SIZE_X, SIZE_Y);
  setGrid(default_grid);
  setMouseListeners();
};

const restartBoard = () => {
  if (disable_btns) return;
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
