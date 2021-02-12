var node_mode = false;
var start_nodes = 0;
var end_nodes = 0;

let cycle = 0;


function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

function setGrid() {
    const TABLE_DIV = document.getElementById('dynamic_table');
    const TABLE_GRID = document.createElement('TABLE');
    const TABLE_BODY = document.createElement('TBODY');
    TABLE_DIV.innerHTML = '';
    TABLE_GRID.style.tableLayout = 'fixed';
    TABLE_GRID.style.fontSize = '10px';
    TABLE_GRID.appendChild(TABLE_BODY);
    for (let table_row = 0; table_row < SIZE_Y; table_row++) {
        let table_row_element = document.createElement('TR');
        TABLE_BODY.appendChild(table_row_element);
        for (let table_column = 0; table_column < SIZE_X; table_column++) {
            const table_cell_ID = table_row + ',' + table_column;
            let table_cell = document.createElement('TD');
            let table_cell_label = document.createTextNode(table_cell_ID);
            table_cell.appendChild(table_cell_label);
            table_cell.setAttribute('id', table_cell_ID);
            table_row_element.appendChild(table_cell);
        }
    }
    TABLE_GRID.setAttribute('id', 'cell_grid');
    TABLE_DIV.appendChild(TABLE_GRID);
}

function setGridCells() {
    const TABLE_GRID = document.getElementById('cell_grid');
    for (let row = 0; row < TABLE_GRID.rows.length; row++) {
        for (let col = 0; col < TABLE_GRID.rows[row].cells.length; col++) {
            const TABLE_CELL = TABLE_GRID.rows[row].cells[col];

            TABLE_CELL.onmousemove = function (event) {
                const MOUSE_BTN = event.which;
                
                if (MOUSE_BTN == MOUSE_LEFT_CLICK) {
                    onLeftClick(this, node_mode);
                }
                else if (MOUSE_BTN == MOUSE_RIGHT_CLICK) {
                    onRightClick(this, node_mode);
                }
            }
 
            TABLE_CELL.onmousedown = function (event) {
                const MOUSE_BTN = event.which;
                
                if (MOUSE_BTN == MOUSE_LEFT_CLICK) {
                    onLeftClick(this, node_mode);
                } else if (MOUSE_BTN == MOUSE_RIGHT_CLICK) {
                    onRightClick(this, node_mode);
                }
            };
        }
    }
}

function swap_node_mode() {
    const SWAP_BTN = document.getElementById("swapper");
    if (node_mode) {
        node_mode = false;
        SWAP_BTN.innerHTML = "place nodes";

    } else {
        node_mode = true;
        SWAP_BTN.innerHTML = "place blocks";
    }
}

function onLeftClick(table_cell, place_nodes) {
    let table_cell_style = document.getElementById(table_cell.innerHTML).style;
    const current_cell_color = $(table_cell).css('backgroundColor');
    if (!place_nodes && current_cell_color == CELL_COLOR) {
        table_cell_style.backgroundColor = BLOCK_COLOR;
        table_cell_style.color = 'transparent';
    } else if (current_cell_color == CELL_COLOR && start_nodes == 0) {
            table_cell_style.backgroundColor = S_NODE_COLOR;
            table_cell_style.color = 'transparent';
            start_nodes ++;
    }
}

function onRightClick(table_cell, place_nodes) {
    let table_cell_style = document.getElementById(table_cell.innerHTML).style;
    const current_cell_color = $(table_cell).css('backgroundColor');
    if (!place_nodes) {
        if (current_cell_color != CELL_COLOR) {
            table_cell_style.backgroundColor = CELL_COLOR;
            table_cell_style.color = 'transparent';
        }
        if (current_cell_color == S_NODE_COLOR) {
            start_nodes --;
        } else if (current_cell_color == E_NODE_COLOR) {
            end_nodes --;
        }
    } else {
        if (current_cell_color == CELL_COLOR && end_nodes == 0) {
            table_cell_style.backgroundColor = E_NODE_COLOR;
            table_cell_style.color = 'transparent';
            end_nodes ++;
        }
    }
}

function node_check() {
    let table_grid_array = [];
    $('table#cell_grid tr').each(function () {
        const table_cell = $(this).find('td');
        table_cell.each(function () {
            table_grid_array.push($(this).css('backgroundColor'));
        });
    });
    return table_grid_array;
}

async function start_pathfinding() {
    let x = main(SIZE_X, SIZE_Y, node_check());
    var visualisation = x['visual'];
    var visual = visualisation.slice(1, visualisation.length - 1);
    await plot_visualisation(visual);
    var path = x['path'];
    var path_true = path.slice(1, path.length - 1);
    await plot_path(path_true, PATH_COLOR);
}

async function plot_path(path, color) {
    let table = document.getElementById('cell_grid');
    for (var index = 0; index < path.length; index++) {
        var cell_index = parseInt(path[index]);
        const row = Math.floor(cell_index / SIZE_X);
        const column = cell_index - (SIZE_X * row);
        var cell = document.getElementById(table.rows[row].cells[column].innerHTML);
        cell.style.color = color;
        cell.style.backgroundColor = color;
        if (color == PATH_COLOR) {
            await sleep(50);
        }
    }
    await sleep(50);
}

async function plot_visualisation(visual) {
    var increment = 1;
    var i, j, temparray, chunk = Math.ceil(visual.length / 10);
    for (i = 0, j = visual.length; i < j; i += chunk) {
        temparray = visual.slice(i, i + chunk);
        await plot_path(temparray, VISUAL_COLORS[cycle]);
        cycle += increment;
        if (cycle >= 8) {
            increment = -1;
        }
    }
    cycle = 0;
}

function reset_board() {
    setGrid();
    setGridCells();
    end_nodes = 0;
    start_nodes = 0;
}

function restart_board() {
    let table_grid = document.getElementById('cell_grid');
    for (let row = 0; row < table_grid.rows.length; row++) {
        for (let col = 0; col < table_grid.rows[row].cells.length; col++) {
            const table_cell = table_grid.rows[row].cells[col];
            const cell_bg = table_cell.style.backgroundColor;
            if ((cell_bg != BLOCK_COLOR) && (cell_bg != S_NODE_COLOR) && (cell_bg != CELL_COLOR) && (cell_bg != E_NODE_COLOR)) {
                table_cell.style.color = CELL_COLOR;
                table_cell.style.backgroundColor = CELL_COLOR;
            }
        }
    }
}

function save_board() {
    var file_name = prompt("Please enter a file name", "File Name");
    if (file_name != null) {
        const board_contents = node_check().toString();
        console.log(board_contents);
        const a = document.createElement('a');
        const file = new Blob([board_contents]);
        a.href = URL.createObjectURL(file);
        a.download = file_name;
        a.click();
        URL.revokeObjectURL(a.href);
    }
}

function import_to_board() {
    //start pathfinding SIZEX SIZEY save_file
}
// const downloadToFile = (content, filename, contentType) => {
//   const a = document.createElement('a');
//   const file = new Blob([content], {type: contentType});
//   a.href= URL.createObjectURL(file);
//   a.download = filename;
//   a.click();
// 	URL.revokeObjectURL(a.href);
// };
// document.querySelector('#btnSave').addEventListener('click', () => {
//   const textArea = document.querySelector('textarea');
//   downloadToFile(textArea.value, 'my-new-file.txt', 'text/plain');
// });
setGrid();
setGridCells();