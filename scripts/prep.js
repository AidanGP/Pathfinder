// Helper functions for the pathing algorithms
// -------------------------------------------

// get a list of the location of all blocked cells
const getBlockedCells = (grid_board) => {
  /* 
  
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

// Get a list of the location of both nodes: [start_node, end_node]
const getNodeCells = (grid_board) => {
  /* 
  
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
const setWeights = (index, is_blocked) => {
  /* 
  
  */
  // This is an example of when I decode the index
  // back into a row and a column
  const row = Math.floor(index / SIZE_X);
  const column = index - SIZE_X * row;

  const weights = {};

  // Account for when the cell is a wall
  let weight = 1;
  if (is_blocked) {
    weight = Infinity;
  }

  // Account for when the cell is
  // on the border of the grid
  if (row != SIZE_Y - 1) {
    weights[index + SIZE_X] = weight;
  }
  if (row != 0) {
    weights[index - SIZE_X] = weight;
  }
  if (column != SIZE_X - 1) {
    weights[index + 1] = weight;
  }
  if (column != 0) {
    weights[index - 1] = weight;
  }

  return weights;
};

// function for generating the graph (graphs explained in greater detail at function call)
const setGraph = (blocked_cells) => {
  /* 
  
  */
  const graph = [];
  // Iterate through all the cells in the grid
  for (let cell = 0; cell < SIZE_X * SIZE_Y; cell++) {
    // is the cell a wall or not
    const isBlocked = blocked_cells.includes(cell);
    // generate where you can move to from the current cell as well as
    // each of the moves respective weights ie. {move1: weight1, move2: weight2}
    const affected = setWeights(cell, isBlocked);

    graph.push(affected);
  }
  return graph;
};
