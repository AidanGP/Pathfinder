const CELL_COLOR = "rgb(229, 229, 229)";
const BLOCK_COLOR = "rgb(0, 0, 0)";
const NODE_COLOR = "rgb(252, 163, 17)";
const PATH_COLOR = "rgb(255, 255, 255)";
const VISUAL_COLORS = [
    "rgb(116, 0, 184)  ",
    "rgb(105, 48, 195) ",
    "rgb(94, 96, 206)  ",
    "rgb(83, 144, 217) ",
    "rgb(78, 168, 222) ",
    "rgb(72, 191, 227) ",
    "rgb(86, 207, 225) ",
    "rgb(100, 223, 223)",
    "rgb(114, 239, 221)",
    "rgb(128, 255, 219)",
];
let cycle = 0;
const SIZE_X = Math.floor($(window).width() / 50);
const SIZE_Y = Math.floor($(window).height() / 50);
function element(elementID) {
    return document.getElementById(elementID);
}
function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
function setGrid() {
    let tableDiv = element('dynamic_table');
    let table_grid = document.createElement('TABLE');
    let tableBody = document.createElement('TBODY');
    tableDiv.innerHTML = '';
    table_grid.style.tableLayout = 'fixed';
    table_grid.style.fontSize = '10px';
    table_grid.appendChild(tableBody);
    for (let table_row = 0; table_row < SIZE_Y; table_row++) {
        let table_row_element = document.createElement('TR');
        tableBody.appendChild(table_row_element);
        for (let table_column = 0; table_column < SIZE_X; table_column++) {
            const table_cell_ID = table_row + ',' + table_column;
            let table_cell = document.createElement('TD');
            let table_cell_label = document.createTextNode(table_cell_ID);
            table_cell.appendChild(table_cell_label);
            table_cell.setAttribute('id', table_cell_ID);
            table_row_element.appendChild(table_cell);
        }
    }
    table_grid.setAttribute('id', 'cell_grid');
    tableDiv.appendChild(table_grid);
}
function setGridCells() {
    let table_grid = element('cell_grid');
    for (let row = 0; row < table_grid.rows.length; row++) {
        for (let col = 0; col < table_grid.rows[row].cells.length; col++) {
            const table_cell = table_grid.rows[row].cells[col];
            const mouse_left_click = 1;
            const mouse_middle_click = 2;
            const mouse_right_click = 3;
            table_cell.onmousemove = function (event) {
                const mouse_btn = event.which;
                if (mouse_btn == mouse_left_click) {
                    onLeftClick(this);
                }
                else if (mouse_btn == mouse_right_click) {
                    onRightClick(this);
                }
            };
            table_cell.onmousedown = function (event) {
                const mouse_btn = event.which;
                if (mouse_btn == mouse_left_click) {
                    onLeftClick(this);
                }
                else if (mouse_btn == mouse_middle_click) {
                    onMiddleClick(this);
                }
                else if (mouse_btn == mouse_right_click) {
                    onRightClick(this);
                }
            };
        }
    }
}
function onLeftClick(table_cell) {
    let table_cell_style = element(table_cell.innerHTML).style;
    const current_cell_color = $(table_cell).css('backgroundColor');
    if (current_cell_color == CELL_COLOR) {
        table_cell_style.backgroundColor = BLOCK_COLOR;
        table_cell_style.color = 'transparent';
    }
}
function onRightClick(table_cell) {
    let table_cell_style = element(table_cell.innerHTML).style;
    const current_cell_color = $(table_cell).css('backgroundColor');
    if (current_cell_color != CELL_COLOR) {
        table_cell_style.backgroundColor = CELL_COLOR;
        table_cell_style.color = 'transparent';
    }
}
function onMiddleClick(table_cell) {
    let table_cell_style = element(table_cell.innerHTML).style;
    const current_cell_color = $(table_cell).css('backgroundColor');
    if (current_cell_color == CELL_COLOR) {
        const node_counter = 1;
        //add a node counting function
        if (node_counter < 2) {
            table_cell_style.backgroundColor = NODE_COLOR;
            table_cell_style.color = 'transparent';
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
    //console.log(x);
    var visualisation = x['visual'];
    var visual = visualisation.slice(1, visualisation.length - 1);
    await plot_visualisation(visual);
    var path = x['path'];
    var path_true = path.slice(1, path.length - 1);
    await plot_path(path_true, PATH_COLOR);
}
async function plot_path(path, color) {
    let table = element('cell_grid');
    for (var index = 0; index < path.length; index++) {
        var cell_index = parseInt(path[index]);
        const row = Math.floor(cell_index / SIZE_X);
        const column = cell_index - (SIZE_X * row);
        var cell = element(table.rows[row].cells[column].innerHTML);
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
}
function restart_board() {
    let table_grid = element('cell_grid');
    for (let row = 0; row < table_grid.rows.length; row++) {
        for (let col = 0; col < table_grid.rows[row].cells.length; col++) {
            const table_cell = table_grid.rows[row].cells[col];
            const cell_bg = table_cell.style.backgroundColor;
            if ((cell_bg != BLOCK_COLOR) && (cell_bg != NODE_COLOR) && (cell_bg != CELL_COLOR)) {
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
//# sourceMappingURL=main.js.map