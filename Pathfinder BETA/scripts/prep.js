const getBlockedCells = (grid_board) => {
  let blocked_cells = [];
  for (let i = 0; i < SIZE_Y; i++) {
    for (let j = 0; j < SIZE_X; j++) {
      if (grid_board[i][j] == BLOCK_ENCODING) {
        blocked_cells.push(i * SIZE_X + j);
      }
    }
  }
  return blocked_cells;
};
const getNodeCells = (grid_board) => {
  let start_node, end_node;
  for (let i = 0; i < SIZE_Y; i++) {
    for (let j = 0; j < SIZE_X; j++) {
      if (grid_board[i][j] == S_NODE_ENCODING) {
        start_node = i * SIZE_X + j;
      } else if (grid_board[i][j] == E_NODE_ENCODING) {
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
const setWeights = (index, is_blocked, grid) => {
  const row = Math.floor(index / SIZE_X);
  const column = index - SIZE_X * row;
  let affected = [];
  let weight = 1;
  if (is_blocked) {
    weight = Infinity;
  }
  if (row != SIZE_Y - 1) {
    affected.push(grid[row + 1][column]);
    affected.push(weight);
  }
  if (row != 0) {
    affected.push(grid[row - 1][column]);
    affected.push(weight);
  }
  if (column != 0) {
    affected.push(grid[row][column - 1]);
    affected.push(weight);
  }
  if (column != SIZE_X - 1) {
    affected.push(grid[row][column + 1]);
    affected.push(weight);
  }
  return affected;
};
const setGraph = (blocked, grid) => {
  let new_board = [];
  const blocked_cells = blocked;
  for (let i = 0; i < SIZE_X * SIZE_Y; i++) {
    const isBlocked = blocked_cells.includes(i);
    const affected = setWeights(i, isBlocked, grid);
    let posMass = {};
    for (let counter = 0; counter < affected.length; counter += 2) {
      posMass[affected[counter].toString()] = affected[counter + 1];
    }
    new_board.push(i.toString());
    new_board.push(posMass);
  }
  let bDict = {};
  for (let counter = 0; counter < new_board.length; counter += 2) {
    bDict[new_board[counter]] = new_board[counter + 1];
  }
  return bDict;
};
