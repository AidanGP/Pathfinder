// Variables used in the dragging and dropping modules
let current_cell; // Stores the current cell being dragged over
let prev_cell; // Stores the previous cell that was dragged over
let moving_class; // Set to either S_NODE or E_NODE

let moving_node = false; // Is a node being moved


const setMouseListeners = () => {
  /* 
  
  */
  const table = document.getElementById("table");
  table.addEventListener("mousedown", onMouseDown);
  table.addEventListener("mousemove", onMouseMove);
  table.addEventListener("mouseup", onMouseUp);

};

const removeMouseListeners = () => {
  /* 
  
  */
  const table = document.querySelector("table");
  table.removeEventListener("mousedown", onMouseDown);
  table.removeEventListener("mousemove", onMouseMove);
  table.removeEventListener("mouseup", onMouseUp);
};

const onMouseDown = (e) => {
  /* 
  
  */
  const MOUSE_BTN = e.buttons;

  // Determine if the mouse is pressed on a start or end node
  const is_node = e.target.className == S_NODE || e.target.className == E_NODE;

  // Set moving_node to true if the LMB is pressed and is_node is true
  if (is_node) moving_node = true;

  switch (MOUSE_BTN) {
    case MOUSE_LEFT_CLICK:
      onLeftClick(e.target);
      break;
    case MOUSE_RIGHT_CLICK:
      onRightClick(e.target);
  }
};

const onMouseMove = (e) => {
  /* 
  
  */
  const MOUSE_BTN = e.buttons;
  if (moving_node) {
    // Determine the class of the node we are moving
    if (!moving_class) moving_class = e.target.className;
    onNodeMove(e.target);
  }

  switch (MOUSE_BTN) {
    case MOUSE_LEFT_CLICK:
      onLeftClick(e.target);
      break;
    case MOUSE_RIGHT_CLICK:
      onRightClick(e.target);
  }
};

const onMouseUp = (e) => {
  // Reset some variables back to default values
  /* 
  
  */
  moving_node = false;
  moving_class = undefined;
  current_cell = undefined;
  prev_cell = undefined;
};

// Changes an empty cell to a wall
const onLeftClick = (table_cell) => {
  /* 
  
  */
  if (table_cell.className == CELL && !is_disabled) table_cell.className = WALL;
};

// Changes a wall to an empty cell
const onRightClick = (table_cell) => {
  /* 
  
  */
  if (table_cell.className == WALL && !is_disabled) table_cell.className = CELL;
};

// Support for dragging and dropping the start / end nodes
const onNodeMove = (table_cell) => {
  /* 
  
  */
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
