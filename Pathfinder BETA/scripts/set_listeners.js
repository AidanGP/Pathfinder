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