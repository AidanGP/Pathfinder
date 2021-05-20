let moving_node = false; // Is a node being moved
let disable_btns = false; // Should the buttons be disabled

// Variables used in the dragging and dropping modules
let current_node; // Stores the current node being dragged over
let prev_node; // Stores the previous node that was dragged over
let moving_class; // Set to either S_NODE or E_NODE

// Choose a random theme (5 colors) for the visited nodes
const rand_int = Math.floor(Math.random() * THEMES.length);
const rand_theme = THEMES[rand_int];

const root = document.documentElement;
// Assign the 5 colors to their css elements
for (let i = 0; i < 5; i ++) {
    root.style.setProperty('--visited-' + i, rand_theme[i]);
}

// Waits for a number of milliseconds
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Convers the grid to a two dimensional array
const gridToArray = () => {
  if (disable_btns) return;
  let table_arr = [];
  const table = document.getElementById("table");
  for (let i = 0; i < SIZE_Y; i++) {
    table_arr.push([]);
    for (let j = 0; j < SIZE_X; j++) {
      let encoded_item;
      const cell = table.rows[i].cells[j].className;
      switch (cell) {
        case CELL:
          encoded_item = CELL_ENCODING;
          break;
        case WALL:
          encoded_item = BLOCK_ENCODING;
          break;
        case S_NODE:
          encoded_item = S_NODE_ENCODING;
          break;
        case E_NODE:
          encoded_item = E_NODE_ENCODING;
      }
      table_arr[i].push(encoded_item);
    }
  }
  return table_arr;
};

// setButtonClass used to disable / enable buttons during animation
const setButtonClass = (class_name) => {
  let a = document.getElementsByTagName("a");
  for (let i = 0; i < a.length; i++) {
    a[i].className = class_name;
  }
};

async function startPathfinding() {
  if (disable_btns) return;

  setButtonClass("disabled");
  const board = gridToArray();
  const blocked = getBlockedCells(board);
  const nodes = getNodeCells(board);
  const empty_board = getEmptyGrid();
  const graph = setGraph(blocked, empty_board);
  const result = dijstras(graph, nodes, blocked);
  const visualisation = result["visual"];
  const path = result["path"];

  const visual = visualisation.slice(1, visualisation.length - 1);

  const path_true = path.slice(1, path.length - 1);

  const v = [];
  let temparray, chunk = path_true.length + 1;
  for (let i = 0; i < visual.length; i += chunk) {
    temparray = visual.slice(i, i + chunk);
    v.push(temparray);
  }
  disable_btns = true;
  await plotVisualisation(v, false);

  await plotVisualisation([path_true], true);
  disable_btns = false;
  setButtonClass("");
}

async function plotVisualisation(visual, is_path) {
  const table = document.getElementById("table");
  for (let i = 0; i < visual.length; i++) {
    for (let j = 0; j < visual[i].length; j++) {
      const cell_index = parseInt(visual[i][j]);
      const row = Math.floor(cell_index / SIZE_X);
      const column = cell_index - SIZE_X * row;
      const cell = table.rows[row].cells[column];

      if (is_path) {
        cell.className = PATH;
        await sleep(PATH_DELAY);
      } else {
        cell.className = VISITED;
      }
    }
    await sleep(VISUALISATION_DELAY);
  }
}

const getDefaultGrid = () => {
  let arr = [];
  for (let i = 0; i < SIZE_Y; i ++) {
    arr.push([]);
    for (let j = 0; j < SIZE_X; j ++) {
      if (i == START_ROW && j == START_COL) {
        arr[i].push(2);
      } else if (i == END_ROW && j == END_COL) {
        arr[i].push(3);
      } else {
        arr[i].push(0);
      }
    }
  }
  return arr;
}

const clearBoard = () => {
  if (disable_btns) return;
  disable_btns = false;
  SIZE_X = Math.floor($(window).width() / 50);
  SIZE_Y = Math.floor($(window).height() / 50);
  setButtonClass("");
  setGrid(getDefaultGrid());
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







setGrid(getDefaultGrid());
setMouseListeners();
