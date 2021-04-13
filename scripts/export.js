// Convers the grid to a two dimensional array
const gridToArray = () => {
  if (disable_btns) return;
  let table_arr = [];
  const table = document.getElementById("table");
  for (let i = 0; i < SIZE_Y; i++) {
    table_arr.push([]);
    for (let j = 0; j < SIZE_X; j++) {
      let encoded_item;
      const cell = table.rows[i].cells[j].className;
      switch (cell) {
        case WALL:
          encoded_item = BLOCK_ENCODING;
          break;
        case S_NODE:
          encoded_item = S_NODE_ENCODING;
          break;
        case E_NODE:
          encoded_item = E_NODE_ENCODING;
          break;
        case CELL:
          encoded_item = CELL_ENCODING;
          break;
        default:
          encoded_item = CELL_ENCODING;

      }
      table_arr[i].push(encoded_item);
    }
  }
  return table_arr;
};

const saveBoard = () => {
  if (disable_btns) return;
  const file_name = prompt("Please enter a file name", "File Name");
  if (file_name != null) {
    const grid = gridToArray();
    var csvRows = [];
    for (var i = 0; i < grid.length; ++i) {
      csvRows.push(grid[i].join(","));
    }

    var csvString = csvRows.join("\r\n");
    var a = document.createElement("a");
    a.href = "data:attachment/csv," + csvString;
    a.target = "_blank";
    a.download = file_name + ".csv";

    document.body.appendChild(a);
    a.click();
  }
};
