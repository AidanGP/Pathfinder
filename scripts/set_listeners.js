// Variables used in the dragging and dropping modules
let current_node; // Stores the current node being dragged over
let prev_node; // Stores the previous node that was dragged over
let moving_class; // Set to either S_NODE or E_NODE

let moving_node = false; // Is a node being moved

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
