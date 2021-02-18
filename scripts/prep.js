const getBlockedCells = (grid_board) => {
    let blocked_cells = [];
    for (let index = 0; index < grid_board.length; index++) {
        if (grid_board[index] == BLOCK_ENCODING) {
            blocked_cells.push(index);
        }
    }
    return blocked_cells;
}
const getNodeCells = (grid_board) => {
    var start_node;
    var end_node;
    for (let index = 0; index < grid_board.length; index++) {
        if (grid_board[index] == S_NODE_ENCODING) {
            start_node = index;
        }
        else if (grid_board[index] == E_NODE_ENCODING) {
            end_node = index;
        }
    }
    return [start_node, end_node];
}
const setEmptryGrid = () => {
    let grid = [];
    let counter = 0;
    for (let row = 0; row < SIZE_Y; row++) {
        grid.push([]);
        for (let col = 0; col < SIZE_X; col++) {
            grid[row].push(counter);
            counter++;
        }
    }
    return grid;
}
const setWeights = (index, is_blocked, grid) => {
    const row = Math.floor(index / SIZE_X);
    const column = index - (SIZE_X * row);
    let affected = [];
    var weight = 1;
    if (is_blocked) {
        weight = Infinity;
    }
    if (row != (SIZE_Y - 1)) {
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
    if (column != (SIZE_X - 1)) {
        affected.push(grid[row][column + 1]);
        affected.push(weight);
    }
    return affected;
}
const setGraph = (blocked, grid) => {
    let new_board = [];
    const blocked_cells = blocked;
    for (let index = 0; index < (SIZE_X * SIZE_Y); index++) {
        const isBlocked = blocked_cells.includes(index);
        const affected = setWeights(index, isBlocked, grid);
        let posMass = {};
        for (let counter = 0; counter < affected.length; counter += 2) {
            posMass[affected[counter].toString()] = affected[counter + 1];
        }
        new_board.push(index.toString());
        new_board.push(posMass);
    }
    let bDict = {};
    for (let counter = 0; counter < new_board.length; counter += 2) {
        bDict[new_board[counter]] = new_board[counter + 1];
    }
    return bDict;
}