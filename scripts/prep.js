// Helper functions for the pathing algorithms
// -------------------------------------------

// get a list of the location of all blocked cells
const getBlockedCells = (grid_board) => {
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
        blocked_cells.push(i * SIZE_X + j);
      }
    }
  }
  return blocked_cells;
};

// Get a list of the location of both nodes: [start_node, end_node]
const getNodeCells = (grid_board) => {
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

const getEmptyGrid = () => {
  let grid = [];
  for (let i = 0; i < SIZE_Y; i++) {
    grid.push([]);
    for (let j = 0; j < SIZE_X; j++) {
      grid[i].push(i * SIZE_X + j);
    }
  }
  return grid;
};
const setWeights = (index, is_blocked) => {
  const row = Math.floor(index / SIZE_X);
  const column = index - SIZE_X * row;
  const empty_grid = getEmptyGrid();
  const affected = [];
  let weight = 1;
  if (is_blocked) {
    weight = Infinity;
  }
  if (row != SIZE_Y - 1) {
    affected.push(empty_grid[row + 1][column]);
    affected.push(weight);
  }
  if (row != 0) {
    affected.push(empty_grid[row - 1][column]);
    affected.push(weight);
  }
  if (column != 0) {
    affected.push(empty_grid[row][column - 1]);
    affected.push(weight);
  }
  if (column != SIZE_X - 1) {
    affected.push(empty_grid[row][column + 1]);
    affected.push(weight);
  }
  return affected;
};

// function for generating the graph (graphs explained in greater detail at function call)
const setGraph = (blocked_cells) => {
  const new_board = [];
  // Iterate through all the cells in the grid
  for (let i = 0; i < SIZE_X * SIZE_Y; i++) {
    // is the cell a wall or not
    const isBlocked = blocked_cells.includes(i);
    const affected = setWeights(i, isBlocked);
    const posMass = {};
    for (let counter = 0; counter < affected.length; counter += 2) {
      posMass[affected[counter].toString()] = affected[counter + 1];
    }
    new_board.push(i.toString());
    new_board.push(posMass);
  }
  const bDict = {};
  for (let counter = 0; counter < new_board.length; counter += 2) {
    bDict[new_board[counter]] = new_board[counter + 1];
  }
  return bDict;
};
