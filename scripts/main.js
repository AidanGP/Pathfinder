let moving_node = false; // Is a node being moved
let disable_btns = false; // Should the buttons be disabled

// Variables used in the dragging and dropping modules
let current_node; // Stores the current node being dragged over
let prev_node; // Stores the previous node that was dragged over
let moving_class; // Set to either S_NODE or E_NODE


// Choose a random theme (5 colors) for the visited nodes
const rand_int = Math.floor(Math.random() * THEMES.length);
const rand_theme = THEMES[rand_int];

let root = document.documentElement;
// Assign the 5 colors to their css elements
for (let i = 0; i < 5; i ++) {
    root.style.setProperty('--visited-' + i, rand_theme[i]);
}

// Waits for a number of milliseconds
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Initialise the grid with empty cells and the starting spots for nodes
const setGrid = () => {
  const table = document.getElementById("table");
  table.innerHTML = "";
  for (let i = 0; i < SIZE_Y; i++) {

    const row = document.createElement("TR");
    table.appendChild(row);

    for (let j = 0; j < SIZE_X; j++) {
    
      const cell = document.createElement("TD");

      const ID = i + "," + j;
      cell.id = ID;
      cell.className = CELL;

      // Pre-place the start and end node at default location
      if (i == START_AND_FINISH_NODE_ROW && j == START_COL) {
        cell.className = S_NODE;
      } else if (i == START_AND_FINISH_NODE_ROW && j == END_COL) {
        cell.className = E_NODE;
      }
      row.appendChild(cell);
    }
  }
};

// Start mouse listeners in the grid
const setMouseListeners = () => {
  const TABLE = document.getElementById("table");
  for (let row = 0; row < TABLE.rows.length; row++) {
    for (let col = 0; col < TABLE.rows[row].cells.length; col++) {
      const TABLE_CELL = TABLE.rows[row].cells[col];

      TABLE_CELL.onmousemove = function (event) {
        const MOUSE_BTN = event.which;

        if (MOUSE_BTN == MOUSE_LEFT_CLICK && moving_node) {
          if (!moving_class) moving_class = this.className;
          onNodeMove(this);
        }

        switch (MOUSE_BTN) {
          case MOUSE_LEFT_CLICK:
            onLeftClick(this);
            break;
          case MOUSE_RIGHT_CLICK:
            onRightClick(this);
        }
      };

      TABLE_CELL.onmousedown = function (event) {
        const MOUSE_BTN = event.which;
        const is_node = TABLE_CELL.className == S_NODE || TABLE_CELL.className == E_NODE;

        if (MOUSE_BTN == MOUSE_LEFT_CLICK && is_node) moving_node = true;

        switch (MOUSE_BTN) {
          case MOUSE_LEFT_CLICK:
            onLeftClick(this);
            break;
          case MOUSE_RIGHT_CLICK:
            onRightClick(this);
        }
      };

      TABLE_CELL.onmouseup = function () {
        moving_node = false;
        moving_class = undefined;
        current_node = undefined;
        prev_node = undefined;
      };
    }
  }
};

// Changes an empty cell to a wall
const onLeftClick = (table_cell) => {
  if (table_cell.className == CELL && !disable_btns)
    table_cell.className = WALL;
};

// Changes a wall to an empty cell
const onRightClick = (table_cell) => {
  if (table_cell.className == WALL && !disable_btns)
    table_cell.className = CELL;
};

// Support for dragging and dropping the start / end nodes
const onNodeMove = (table_cell) => {
  let other_node;
  if (moving_class == S_NODE) {
    other_node = E_NODE;
  } else if (moving_class == E_NODE) {
    other_node = S_NODE;
  }
  const is_moveable =
    table_cell.className != WALL && table_cell.className != other_node;

  if (is_moveable && !disable_btns) {
    table_cell.className = moving_class;

    if (current_node != table_cell) {
        prev_node = current_node;
        current_node = table_cell;
    }
    if (prev_node) {
        prev_node.className = CELL;
    }
  }
};

// Convers the grid to a two dimensional array
const gridToArray = () => {
  if (disable_btns) return;
  let table_arr = [];
  const TABLE = document.getElementById("table");
  for (let i = 0; i < TABLE.rows.length; i++) {
    table_arr.push([]);
    for (let j = 0; j < TABLE.rows[i].cells.length; j++) {
      const TABLE_CELL = TABLE.rows[i].cells[j].className;
      let encoded_item;
      switch (TABLE_CELL) {
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

const clearBoard = () => {
  if (disable_btns) return;
  disable_btns = false;
  setButtonClass("");
  setGrid();
  setMouseListeners();
};

const restartBoard = () => {
  if (disable_btns) return;
  const table_grid = document.getElementById("table");
  for (let row = 0; row < table_grid.rows.length; row++) {
    for (let col = 0; col < table_grid.rows[row].cells.length; col++) {
      const table_cell = table_grid.rows[row].cells[col];
      if (table_cell.className == VISITED || table_cell.className == PATH) {
        table_cell.className = CELL;
      }
    }
  }
};

const saveBoard = () => {
  if (disable_btns) return;
  const file_name = prompt("Please enter a file name", "File Name");
  if (file_name != null) {
    const grid = gridToArray();
    var csvRows = [];
    for (var i = 0; i < grid.length; ++i) {
      for (var j = 0; j < grid[i].length; ++j) {
        grid[i][j] = '"' + grid[i][j] + '"';
      }
      csvRows.push(grid[i].join(","));
    }

    var csvString = csvRows.join("\r\n");
    var a = document.createElement("a");
    a.href = "data:attachment/csv," + csvString;
    a.target = "_blank";
    a.download = file_name + ".csv";

    document.body.appendChild(a);
    a.click();
  }
};

const importToBoard = () => {
  if (disable_btns) return;
  //start pathfinding SIZEX SIZEY save_file
};

setGrid();
setMouseListeners();
