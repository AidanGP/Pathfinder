// Variables used in the dragging and dropping modules
let current_cell; // Stores the current cell being dragged over
let prev_cell; // Stores the previous cell that was dragged over
let moving_class; // Set to either S_NODE or E_NODE

let moving_node = false; // Is a node being moved

// Start mouse listeners in the grid
const setMouseListeners = () => {
  // Iterate through the grid
  const table = document.getElementById("table");
  for (let i = 0; i < SIZE_Y; i++) {
    for (let j = 0; j < SIZE_X; j++) {
      // Assign the variable 'cell' to each cell iteratively
      const cell = table.rows[i].cells[j];

      // When the mouse is moved
      cell.onmousemove = function (e) {
        // Determine which mouse button is being pressed (if any)
        const MOUSE_BTN = e.which;

        // If the LMB is being pressed and moving_node is true
        // then the node will be dragged around
        if (MOUSE_BTN == MOUSE_LEFT_CLICK && moving_node) {
          if (!moving_class) moving_class = this.className;
          onNodeMove(this);
        }

        // Switch statement to assign the LMB and RMB to their
        // respective functions
        switch (MOUSE_BTN) {
          case MOUSE_LEFT_CLICK:
            onLeftClick(this);
            break;
          case MOUSE_RIGHT_CLICK:
            onRightClick(this);
        }
      };

      // When a mouse button is pressed
      cell.onmousedown = function (e) {
        // Determine which mouse button is being pressed
        const MOUSE_BTN = e.which;

        // Determine if the mouse is pressed on a start or end node
        const is_node = cell.className == S_NODE || cell.className == E_NODE;

        // Set moving_node to true if the LMB is pressed and is_node is true
        if (MOUSE_BTN == MOUSE_LEFT_CLICK && is_node) moving_node = true;

        // Switch statement to assign the LMB and RMB to their
        // respective functions
        switch (MOUSE_BTN) {
          case MOUSE_LEFT_CLICK:
            onLeftClick(this);
            break;
          case MOUSE_RIGHT_CLICK:
            onRightClick(this);
        }
      };

      // When the mouse is released
      cell.onmouseup = function () {
        // Reset these variables to their default values
        moving_node = false;
        moving_class = undefined;
        current_cell = undefined;
        prev_cell = undefined;
      };
    }
  }
};

// Changes an empty cell to a wall
const onLeftClick = (table_cell) => {
  if (table_cell.className == CELL && !is_disabled)
    table_cell.className = WALL;
};

// Changes a wall to an empty cell
const onRightClick = (table_cell) => {
  if (table_cell.className == WALL && !is_disabled)
    table_cell.className = CELL;
};

// Support for dragging and dropping the start / end nodes
const onNodeMove = (table_cell) => {
  // Assign other_node to the 'other' type of node
  let other_node;
  if (moving_class == S_NODE) {
    other_node = E_NODE;
  } else if (moving_class == E_NODE) {
    other_node = S_NODE;
  }

  // The node is moveable if it is not being moved into a wall or another node
  const is_moveable =
    table_cell.className != WALL && table_cell.className != other_node;

  // If the node is moveable and the buttons are enabled
  if (is_moveable && !is_disabled) {
    // Set the class of the current cell to the
    // class of the node that was originally dragged over
    table_cell.className = moving_class;

    if (current_cell != table_cell) {
      // Perform a swap:
      prev_cell = current_cell;
      current_cell = table_cell;
    }

    // Set the class of the previous cell to an empty cell
    if (prev_cell) {
      prev_cell.className = CELL;
    }
  }
};
