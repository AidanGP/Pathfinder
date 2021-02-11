const cell_color = "rgb(229, 229, 229)";
const block_color = "rgb(0, 0, 0)";
const node_color = "rgb(252, 163, 17)";
const path_color = "rgb(255, 255, 255)";
function getBlockedCells(grid_board) {
    let blocked_cells = [];
    for (let index = 0; index < grid_board.length; index++) {
        if (grid_board[index] == block_color) {
            blocked_cells.push(index);
        }
    }
    return blocked_cells;
}
function getNodeCells(grid_board) {
    let node_cells = [];
    for (let index = 0; index < grid_board.length; index++) {
        if (grid_board[index] == node_color) {
            node_cells.push(index);
        }
    }
    return node_cells;
}
function setEmptryGrid(x_dimension, y_dimension) {
    let grid = [];
    let counter = 0;
    for (let row = 0; row < y_dimension; row++) {
        grid.push([]);
        for (let col = 0; col < x_dimension; col++) {
            grid[row].push(counter);
            counter++;
        }
    }
    return grid;
}
function setWeights(x_dimension, y_dimension, index, is_blocked, grid) {
    const row = Math.floor(index / x_dimension);
    const column = index - (x_dimension * row);
    let affected = [];
    var weight = 1;
    if (is_blocked) {
        weight = Infinity;
    }
    if (row != (y_dimension - 1)) {
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
    if (column != (x_dimension - 1)) {
        affected.push(grid[row][column + 1]);
        affected.push(weight);
    }
    return affected;
}
function setGraph(x_dimension, y_dimension, blocked, grid) {
    let new_board = [];
    const blocked_cells = blocked;
    for (let index = 0; index < (x_dimension * y_dimension); index++) {
        const isBlocked = blocked_cells.includes(index);
        const affected = setWeights(x_dimension, y_dimension, index, isBlocked, grid);
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
function dijstras(graph, node_cells, blocked_cells) {
    let nodes = node_cells;
    console.log(graph);
    const start = nodes[0].toString();
    const goal = nodes[1].toString();
    let shortest_distance = {};
    let predecessor = {};
    let unseenNodes = graph;
    let bDict = graph;
    let path = [];
    for (var node in unseenNodes) {
        shortest_distance[node] = Infinity;
    }
    shortest_distance[start] = 0;
    var visualisation = [];
    while (Object.keys(unseenNodes).length !== 0) {
        var minNode = undefined;
        for (var node in unseenNodes) {
            if (minNode === undefined) {
                minNode = node;
                if (!(minNode === start || visualisation.includes(goal) || blocked_cells.includes(parseInt(minNode)))) {
                    visualisation.push(minNode);
                }
            }
            else if (shortest_distance[node] < shortest_distance[minNode]) {
                minNode = node;
                if (!(minNode === start || visualisation.includes(goal) || blocked_cells.includes(parseInt(minNode)))) {
                    visualisation.push(minNode);
                }
            }
        }
        Object.entries(bDict[minNode]).forEach(function (v) {
            let weight = v[1];
            let childNode = v[0];
            if (weight + shortest_distance[minNode] < shortest_distance[childNode]) {
                shortest_distance[childNode] = weight + shortest_distance[minNode];
                predecessor[childNode] = minNode;
            }
        });
        delete unseenNodes[minNode];
    }
    let currentNode = goal;
    while (currentNode !== start) {
        path.unshift(currentNode);
        currentNode = predecessor[currentNode];
    }
    path.unshift(start);
    return { 'visual': visualisation, 'path': path };
}
function main(x_dimension, y_dimension, board) {
    console.log("X DIM ~", x_dimension, "Y DIM ~", y_dimension);
    const blocked = getBlockedCells(board);
    const nodes = getNodeCells(board);
    const empty_board = setEmptryGrid(x_dimension, y_dimension);
    const graph = setGraph(x_dimension, y_dimension, blocked, empty_board);
    const result = dijstras(graph, nodes, blocked);
    return result;
}