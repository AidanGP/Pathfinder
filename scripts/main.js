var moving_node = false;
var moving_color;
var s_prev_nodes = [0, 0];
var e_prev_nodes = [0, 0];

function sleep(ms) {
    // Sleep for a number of milliseconds
    return new Promise((resolve) => setTimeout(resolve, ms));
}

function setGrid() {
    // Initialise the grid
    const TABLE_DIV = document.getElementById('dynamic_table');
    const TABLE_GRID = document.createElement('TABLE');
    const TABLE_BODY = document.createElement('TBODY');
    TABLE_DIV.innerHTML = '';
    TABLE_GRID.style.tableLayout = 'fixed';
    TABLE_GRID.style.fontSize = '10px';
    TABLE_GRID.appendChild(TABLE_BODY);
    for (let table_row = 0; table_row < SIZE_Y; table_row ++) {
        let table_row_element = document.createElement('TR');
        TABLE_BODY.appendChild(table_row_element);
        for (let table_column = 0; table_column < SIZE_X; table_column++) {
            const table_cell_ID = table_row + ',' + table_column;
            let table_cell = document.createElement('TD');
            let table_cell_label = document.createTextNode(table_cell_ID);
            table_cell.appendChild(table_cell_label);
            table_cell.setAttribute('id', table_cell_ID);
            table_cell.style.color = 'transparent';
            if (table_row == START_AND_FINISH_NODE_ROW && table_column == START_COL) {
                table_cell.style.backgroundColor = S_NODE_COLOR;
            } else if (table_row == START_AND_FINISH_NODE_ROW && table_column == END_COL ) {
                table_cell.style.backgroundColor = E_NODE_COLOR;
            }
            table_row_element.appendChild(table_cell);
        }
    }
    TABLE_GRID.setAttribute('id', 'cell_grid');
    TABLE_DIV.appendChild(TABLE_GRID);
}

function setGridCells() {
    // Apply all of the mouse listeners for the grid
    const TABLE_GRID = document.getElementById('cell_grid');
    for (let row = 0; row < TABLE_GRID.rows.length; row++) {
        for (let col = 0; col < TABLE_GRID.rows[row].cells.length; col++) {
            const TABLE_CELL = TABLE_GRID.rows[row].cells[col];
            

            TABLE_CELL.onmousemove = function (event) {
                const MOUSE_BTN = event.which;
                
                if (MOUSE_BTN == MOUSE_LEFT_CLICK && moving_node) {
                    if (moving_color == undefined) {
                        moving_color = TABLE_CELL.style.backgroundColor;
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
                const is_node = (TABLE_CELL.style.backgroundColor == S_NODE_COLOR) || (TABLE_CELL.style.backgroundColor == E_NODE_COLOR);
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
                moving_color = undefined;
                s_prev_nodes = [0, 0];
                e_prev_nodes = [0, 0];
            }
        }
    }
}

function onLeftClick(table_cell) {
    const table_cell_style = document.getElementById(table_cell.innerHTML).style;
    const current_cell_color = $(table_cell).css('backgroundColor');

    
    if (current_cell_color == CELL_COLOR) {
        table_cell_style.backgroundColor = BLOCK_COLOR;
        table_cell_style.color = 'transparent';
    }
}

function onRightClick(table_cell) {
    const table_cell_style = document.getElementById(table_cell.innerHTML).style;
    if (table_cell_style.backgroundColor != CELL_COLOR) {
        table_cell_style.backgroundColor = CELL_COLOR;
        table_cell_style.color = 'transparent';
    }
}

function onNodeMove(table_cell) {
    const table_cell_style = document.getElementById(table_cell.innerHTML).style;
    const current_cell_color = $(table_cell).css('backgroundColor');
    if (current_cell_color != BLOCK_COLOR) {
        
        table_cell_style.backgroundColor = moving_color;
        table_cell_style.color = 'transparent';
    }
    if (moving_color == S_NODE_COLOR) {

        if (s_prev_nodes[0] != table_cell) {
            s_prev_nodes.unshift(table_cell);
        }
        if (s_prev_nodes[1] != 0) {
            s_prev_nodes[1].style.backgroundColor = CELL_COLOR;
            s_prev_nodes[1].style.color = 'transparent';
        }
    } else if (moving_color == E_NODE_COLOR) {

        if (e_prev_nodes[0] != table_cell) {
            e_prev_nodes.unshift(table_cell);
        }
        if (e_prev_nodes[1] != 0) {
            e_prev_nodes[1].style.backgroundColor = CELL_COLOR;
            e_prev_nodes[1].style.color = 'transparent';
        }
    }

}

function nodeCheck() {
    let table_grid_array = [];
    $('table#cell_grid tr').each(function () {
        const table_cell = $(this).find('td');
        table_cell.each(function () {
            var encoded_item;
            switch ($(this).css('backgroundColor')) {
                case CELL_COLOR:
                    encoded_item = CELL_ENCODING;
                    break;
                case BLOCK_COLOR:
                    encoded_item = BLOCK_ENCODING;
                    break;
                case S_NODE_COLOR:
                    encoded_item = S_NODE_ENCODING;
                    break;
                case E_NODE_COLOR:
                    encoded_item = E_NODE_ENCODING;
            }
            table_grid_array.push(encoded_item);
        });
    });
    return table_grid_array;
}

async function startPathfinding() {
    const x = main(SIZE_X, SIZE_Y, nodeCheck());
    const visualisation = x['visual'];
    const visual = visualisation.slice(1, visualisation.length - 1);
    await plotVisualisation(visual, false);
    const path = x['path'];
    const path_true = path.slice(1, path.length - 1);
    await plotVisualisation(path_true, true);
}

async function plotVisualisation(visual, is_path) {
    let table = document.getElementById('cell_grid');
    for (var i = 0; i < visual.length; i ++) {
        const cell_index = parseInt(visual[i]);
        const row = Math.floor(cell_index / SIZE_X);
        const column = cell_index - (SIZE_X * row);
        const cell = document.getElementById(table.rows[row].cells[column].innerHTML);
        
        if (is_path) {
            cell.className = 'node-shortest-path';
            await sleep(50);
        } else {
            cell.className = 'node-visited';
        }
        await sleep(3);
    }
}

function resetBoard() {
    setGrid();
    setGridCells();

}

function restartBoard() {
    let table_grid = document.getElementById('cell_grid');
    for (let row = 0; row < table_grid.rows.length; row++) {
        for (let col = 0; col < table_grid.rows[row].cells.length; col++) {
            const table_cell = table_grid.rows[row].cells[col];
            if (table_cell.className == 'node-visited' || table_cell.className == 'node-shortest-path') {
                table_cell.style.color = 'transparent';
                table_cell.style.backgroundColor = CELL_COLOR;
                table_cell.className = '';
            }
        }
    }
}

function saveBoard() {
    var file_name = prompt('Please enter a file name', 'File Name');
    if (file_name != null) {
        const board_contents = nodeCheck().toString();
        console.log(board_contents);
        const a = document.createElement('a');
        const file = new Blob([board_contents]);
        a.href = URL.createObjectURL(file);
        a.download = file_name;
        a.click();
        URL.revokeObjectURL(a.href);
    }
}

function importToBoard() {
    //start pathfinding SIZEX SIZEY save_file
}

setGrid();
setGridCells();