var moving_node = false;
var moving_class;
var s_prev_nodes = [0, 0];
var e_prev_nodes = [0, 0];
var disable_btns = false;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const setGrid = () => {
    // Initialise the grid
    const TABLE = document.getElementById('table');
    const TABLE_BODY = document.createElement('TBODY');
    TABLE.innerHTML = '';
    TABLE.appendChild(TABLE_BODY);
    for (let i = 0; i < SIZE_Y; i ++) {
        const table_row_element = document.createElement('TR');
        TABLE_BODY.appendChild(table_row_element);
        for (let j = 0; j < SIZE_X; j ++) {
            const table_cell_ID = i + ',' + j;
            const table_cell = document.createElement('TD');
            table_cell.id = table_cell_ID;

            table_cell.className = CELL;

            if (i == START_AND_FINISH_NODE_ROW && j == START_COL) {
                table_cell.className = S_NODE;
            } else if (i == START_AND_FINISH_NODE_ROW && j == END_COL ) {
                table_cell.className = E_NODE;
            }
            table_row_element.appendChild(table_cell);
        }
    }
}

const setMouseListeners = () => {
    // Apply all of the mouse listeners for the grid
    const TABLE_GRID = document.getElementById('table');
    for (let row = 0; row < TABLE_GRID.rows.length; row++) {
        for (let col = 0; col < TABLE_GRID.rows[row].cells.length; col++) {
            const TABLE_CELL = TABLE_GRID.rows[row].cells[col];
            

            TABLE_CELL.onmousemove = function (event) {
                const MOUSE_BTN = event.which;
                
                if (MOUSE_BTN == MOUSE_LEFT_CLICK && moving_node) {
                    if (!moving_class) {
                        moving_class = TABLE_CELL.className;
                    }
                    onNodeMove(this)
                } else if (MOUSE_BTN == MOUSE_LEFT_CLICK) {
                    onLeftClick(this);
                }
                else if (MOUSE_BTN == MOUSE_RIGHT_CLICK) {
                    onRightClick(this);
                }
            }
 
            TABLE_CELL.onmousedown = function (event) {
                const MOUSE_BTN = event.which;
                const is_node = (TABLE_CELL.className == S_NODE) || (TABLE_CELL.className == E_NODE);
                if (MOUSE_BTN == MOUSE_LEFT_CLICK && is_node) {
                    moving_node = true;
                } else if (MOUSE_BTN == MOUSE_LEFT_CLICK) {
                    onLeftClick(this);
                } else if (MOUSE_BTN == MOUSE_RIGHT_CLICK) {
                    onRightClick(this);
                }
            };

            TABLE_CELL.onmouseup = function () {
                moving_node = false;
                moving_class = undefined;
                s_prev_nodes = [0, 0];
                e_prev_nodes = [0, 0];
            }
        }
    }
}

const onLeftClick = (table_cell) => {

    if (table_cell.className == CELL && !disable_btns) {
        table_cell.className = WALL;
    }
}

const onRightClick = (table_cell) => {

    if (table_cell.className == WALL && !disable_btns) {
        table_cell.className = CELL;
    }
}

const onNodeMove = (table_cell) => {
    
    
    var other_node;
    if (moving_class == S_NODE) {
        other_node = E_NODE;
    } else if (moving_class == E_NODE) {
        other_node = S_NODE;
    }
    const is_moveable = table_cell.className != WALL && table_cell.className != other_node;

    if (is_moveable && !disable_btns) {
        
        table_cell.className = moving_class;
        if (moving_class == S_NODE) {

            if (s_prev_nodes[0] != table_cell) {
                s_prev_nodes.unshift(table_cell);
            }
            if (s_prev_nodes[1] != 0) {
                s_prev_nodes[1].className = CELL;
            }
        } else if (moving_class == E_NODE) {
    
            if (e_prev_nodes[0] != table_cell) {
                e_prev_nodes.unshift(table_cell);
            }
            if (e_prev_nodes[1] != 0) {
                e_prev_nodes[1].className = CELL;
            }
        }
    }
}

const gridToArray = () => {
    if (disable_btns) return;
    let table_grid_array = [];
    const TABLE_GRID = document.getElementById('table');
    for (let row = 0; row < TABLE_GRID.rows.length; row++) {
        for (let col = 0; col < TABLE_GRID.rows[row].cells.length; col++) {
            const TABLE_CELL = TABLE_GRID.rows[row].cells[col].className;
            let encoded_item;
            switch (TABLE_CELL) {
                case CELL:
                    encoded_item = CELL_ENCODING;
                    break;
                case WALL:
                    encoded_item = BLOCK_ENCODING;
                    break;
                case S_NODE:
                    encoded_item = S_NODE_ENCODING;
                    break;
                case E_NODE:
                    encoded_item = E_NODE_ENCODING;
            }
            table_grid_array.push(encoded_item);
        }
    }
    return table_grid_array;
}

async function startPathfinding() {
    if (disable_btns) return;
    var a = document.getElementsByTagName('a');
    for (var i = 0; i < a.length; i++) {
        a[i].className = 'disabled';
    }
    const board = gridToArray();
    const blocked = getBlockedCells(board);
    const nodes = getNodeCells(board);
    const empty_board = setEmptryGrid();
    const graph = setGraph(blocked, empty_board);
    const result = dijstras(graph, nodes, blocked);
    const visualisation = result['visual'];
    const path = result['path'];

    const visual = visualisation.slice(1, visualisation.length - 1);

    const path_true = path.slice(1, path.length - 1);

    const v = [];
    var i,j,temparray,chunk = path_true.length;
    for (i=0,j=visual.length; i<j; i+=chunk) {
        temparray = visual.slice(i,i+chunk);
        v.push(temparray);
    }
    disable_btns = true;
    await plotVisualisation(v, false);

    await plotVisualisation([path_true], true);
    disable_btns = false;
    for (var i = 0; i < a.length; i++) {
        a[i].className = '';
    }
}

async function plotVisualisation(visual, is_path) {
    const table = document.getElementById('table');
    for (var i = 0; i < visual.length; i ++) {
        for (var j = 0; j < visual[i].length; j ++) {
            const cell_index = parseInt(visual[i][j]);
            const row = Math.floor(cell_index / SIZE_X);
            const column = cell_index - (SIZE_X * row);
            const cell = table.rows[row].cells[column];
            
            if (is_path) {
                cell.className = PATH;
                await sleep(PATH_DELAY);
            } else {
                cell.className = VISITED;
            }
            
        }
        await sleep(VISUALISATION_DELAY);
    }
}

const clearBoard = () => {
    if (disable_btns) return;
    disable_btns = false;
    var a = document.getElementsByTagName('a');
    for (var i = 0; i < a.length; i++) {
        a[i].className = '';
    }
    setGrid();
    setMouseListeners();
}

const restartBoard = () => {
    if (disable_btns) return;
    const table_grid = document.getElementById('table');
    for (let row = 0; row < table_grid.rows.length; row++) {
        for (let col = 0; col < table_grid.rows[row].cells.length; col++) {
            const table_cell = table_grid.rows[row].cells[col];
            if (table_cell.className == VISITED || table_cell.className == PATH) {
                table_cell.className = CELL;
            }
        }
    }
}

const saveBoard = () => {
    if (disable_btns) return;
    const file_name = prompt('Please enter a file name', 'File Name');
    if (file_name != null) {
        const board_contents = gridToArray().toString();
        const link = document.createElement('a');
        const file = new Blob([board_contents]);
        link.href = URL.createObjectURL(file);
        link.download = file_name;
        link.click();
    }
}

const importToBoard = () => {
    if (disable_btns) return;
    //start pathfinding SIZEX SIZEY save_file
}

setGrid();
setMouseListeners();