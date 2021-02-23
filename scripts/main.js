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

// Initialise the grid with empty cells and the starting spots for nodes
const setGrid = (arr) => {
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

// Start mouse listeners in the grid
const setMouseListeners = () => {
  const table = document.getElementById("table");
  for (let i = 0; i < SIZE_Y; i++) {
    for (let j = 0; j < SIZE_X; j++) {
      const cell = table.rows[i].cells[j];

      cell.onmousemove = function (e) {
        const MOUSE_BTN = e.which;

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

      cell.onmousedown = function (e) {
        const MOUSE_BTN = e.which;
        const is_node = cell.className == S_NODE || cell.className == E_NODE;

        if (MOUSE_BTN == MOUSE_LEFT_CLICK && is_node) moving_node = true;

        switch (MOUSE_BTN) {
          case MOUSE_LEFT_CLICK:
            onLeftClick(this);
            break;
          case MOUSE_RIGHT_CLICK:
            onRightClick(this);
        }
      };

      cell.onmouseup = function () {
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
  if (table_cell.className == CELL && !disable_btns) table_cell.className = WALL;
};

// Changes a wall to an empty cell
const onRightClick = (table_cell) => {
  if (table_cell.className == WALL && !disable_btns) table_cell.className = CELL;
};

// Support for dragging and dropping the start / end nodes
const onNodeMove = (table_cell) => {
  let other_node;
  if (moving_class == S_NODE) {
    other_node = E_NODE;
  } else if (moving_class == E_NODE) {
    other_node = S_NODE;
  }
  const is_moveable = table_cell.className != WALL && table_cell.className != other_node;

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

const saveBoard = () => {
  if (disable_btns) return;
  const file_name = prompt("Please enter a file name", "File Name");
  if (file_name != null) {
    const grid = gridToArray();
    var csvRows = [];
    for (var i = 0; i < grid.length; ++i) {
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

const csvToArr = (csv) => {
  const rows = csv.split('\n');
  let arr = [];
  for (let i = 0; i < rows.length; i++) {
    arr.push([]);
    const row = rows[i].split(',');
    for (let j = 0; j < row.length; j++) {
      arr[i].push(parseInt(row[j]));
    }
  }
  return arr;
};

const importToBoard = () => {
  if (disable_btns) return;
  var file_in = document.getElementById('file-input');

  file_in.onchange = e => {
    const file = e.target.files[0];
    var reader = new FileReader();
    reader.readAsText(file,'UTF-8');

    // Check that the file is a csv
    if (!file.name.includes('.csv')) {
      alert('Sorry, that doesn\'t look like a csv file.');
      return;
    }
    
    reader.onload = readerEvent => {
        const content = readerEvent.target.result;
        const arr = csvToArr(content);

        setGrid(arr);
        setMouseListeners();
    }
  }
  file_in.click();
};

setGrid(getDefaultGrid());
setMouseListeners();
