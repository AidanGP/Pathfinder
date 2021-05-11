// Variables used in the dragging and dropping modules
let current_cell; // Stores the current cell being dragged over
let prev_cell; // Stores the previous cell that was dragged over
let moving_class; // Set to either S_NODE or E_NODE

let path_found = false;
let moving_node = false; // Is a node being moved

const setMouseListeners = () => {
  /* 
    Initialise the mouse listeners - this is for 
    dragging the nodes and adding/removing walls
  */
  const table = document.getElementById("table");
  table.addEventListener("mousedown", onMouseDown);
  table.addEventListener("mousemove", onMouseMove);
  table.addEventListener("mouseup", onMouseUp);
};

const removeMouseListeners = () => {
  /* 
    We remove the event listeners on occaision so
    memory consumption doesnt keep going to the moon
    ie. when you import a grid you remove the old
    listeners and make new ones because its a new grid
    with a different size and layout etc.
  */
  const table = document.querySelector("table");
  table.removeEventListener("mousedown", onMouseDown);
  table.removeEventListener("mousemove", onMouseMove);
  table.removeEventListener("mouseup", onMouseUp);
};

const onMouseDown = (e) => {
  /* 
    Self explanatory, this is called 
    when you click any of the mouse buttons
  */

  // Figure out which mouse button was pressed
  const MOUSE_BTN = e.buttons;

  // Determine if the mouse is pressed on a start or end node
  const is_node = e.target.className == S_NODE || e.target.className == E_NODE;

  // Set moving_node to true if the mouse is pressed on a node
  if (is_node) moving_node = true;

  // Perform the action corresponding to the mouse button that was pressed
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
    This is called when the user moves the mouse over the table
  */

  // Which mouse button was it
  const MOUSE_BTN = e.buttons;
  // If the user has previously 'mouse downed' on a node
  if (moving_node) {// && MOUSE_BTN === MOUSE_LEFT_CLICK) {
    // Determine the class of the node we are moving
    if (!moving_class) moving_class = e.target.className;
    // Now move the node
    onNodeMove(e.target);
  }

  // Perform the action corresponding to the mouse button that was pressed
  // This part registers clicking and dragging
  switch (MOUSE_BTN) {
    case MOUSE_LEFT_CLICK:
      onLeftClick(e.target);
      break;
    case MOUSE_RIGHT_CLICK:
      onRightClick(e.target);
  }
};

const onMouseUp = (e) => {
  /* 
    Reset some variables back to default values
    This is necessary for the dragging and dropping etc
  */
  moving_node = false;
  moving_class = undefined;
  current_cell = undefined;
  prev_cell = undefined;
};

const onLeftClick = (table_cell) => {
  /* 
    Changes an empty cell to a wall
  */
  if (
    (table_cell.className == CELL || table_cell.className == PATH) &&
    !is_disabled
  )
    table_cell.className = WALL;
  if (path_found) update_path();
};

const onRightClick = (table_cell) => {
  /* 
    Changes a wall to an empty cell
  */
  if (table_cell.className == WALL && !is_disabled) table_cell.className = CELL;
  if (path_found) update_path();
};

const onNodeMove = (table_cell) => {
  /* 
    Support for dragging and dropping the start / end nodes
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
  if (path_found) update_path();
};
