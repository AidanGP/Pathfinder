// Helper functions for the pathing algorithms
// -------------------------------------------

const getBlockedCells = (grid_board) => {
  /* 
    Get a list of the location of all blocked cells
  */
  const blocked_cells = [];
  for (let i = 0; i < SIZE_Y; i++) {
    for (let j = 0; j < SIZE_X; j++) {
      if (grid_board[i][j] == BLOCK_ENCODING) {
        // HERE: the i * SIZE_X + j
        // Instead of storing the coordinates of each cell like this: [i, j]
        // I multiply the row number by the number of rows and add the column number
        // This produces a singular integer that represents a cell in the grid
        // This number can be decoded back into coordinates later on
        // This method is used for ease of storage, the arrays stay as 2 dimensional
        // and arent 3 dimensional since a 3d array is just a pain.
        // Also the integer can be used as a key in a dictionary or an index in a list
        // tldr: makes it easier to do things
        blocked_cells.push(i * SIZE_X + j);
      }
    }
  }
  return blocked_cells;
};

const getNodeCells = (grid_board) => {
  /* 
    Get a list of the location of both nodes: [start_node, end_node]
  */
  let start_node, end_node;
  for (let i = 0; i < SIZE_Y; i++) {
    for (let j = 0; j < SIZE_X; j++) {
      if (grid_board[i][j] == S_NODE_ENCODING) {
        // Get the start nodes location
        start_node = i * SIZE_X + j;
      } else if (grid_board[i][j] == E_NODE_ENCODING) {
        // Get the end nodes location
        end_node = i * SIZE_X + j;
      }
    }
  }
  return [start_node, end_node];
};
const getNeighbors = (index, blocked_cells) => {
  /* 
  Returns a list of neighbouring cells
  */

  const [column, row] = coords_of(index);
  const neighbors = [];

  const pending_neighbors = [];
  // Account for when the cell is
  // on the border of the grid with these checks
  if (row != SIZE_Y - 1) {
    pending_neighbors.push(index + SIZE_X);
  }
  if (row != 0) {
    pending_neighbors.push(index - SIZE_X);
  }
  if (column != SIZE_X - 1) {
    pending_neighbors.push(index + 1);
  }
  if (column != 0) {
    pending_neighbors.push(index - 1);
  }

  // Remove any walls from the list of neighbors
  for (const pending_neighbor of pending_neighbors) {
    if (!blocked_cells.includes(pending_neighbor)) {
      neighbors.push(pending_neighbor)
    }
  }
  return neighbors;
};

const get_neighbors = (blocked_cells) => {
  /* 
    function for generating the neighbors of all cells in the grid
  */
  const neighbors = [];
  // Iterate through all the cells in the grid
  for (let cell = 0; cell < SIZE_X * SIZE_Y; cell++) {
    // generate where you can move to from the current cell
    const neighbors_of_cell = getNeighbors(cell, blocked_cells);

    neighbors.push(neighbors_of_cell);
  }
  return neighbors;
};

const get_shortest_path = (predecessor_dict, start, goal) => {
  /*
  Backtrack through the predecessor_dict to generate the shortest path.
  */
  const path = [];
  let backtracking_node = goal;
  while (backtracking_node != start) {
    path.unshift(backtracking_node);
    backtracking_node = predecessor_dict[backtracking_node];
    // If there is no node to backtrack to then there is no valid path
    if (!backtracking_node) return -1;
  }
  return path;
}
