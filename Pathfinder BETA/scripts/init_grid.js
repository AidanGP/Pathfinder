// Initialise the grid with empty cells and the starting spots for nodes
const setGrid = (arr) => {
    SIZE_X = arr[0].length;
    SIZE_Y = arr.length;
    const table = document.getElementById("table");
    table.innerHTML = "";
    for (let i = 0; i < SIZE_Y; i++) {
  
      const row = document.createElement("TR");
      table.appendChild(row);
  
      for (let j = 0; j < SIZE_X; j++) {
      
        const cell = document.createElement("TD");
        const ID = i + "," + j;
        cell.id = ID;
  
        const encoding = arr[i][j];
  
        let cell_class;
        switch (encoding) {
          case CELL_ENCODING:
            cell_class = CELL;
            break;
          case BLOCK_ENCODING:
            cell_class = WALL;
            break;
          case S_NODE_ENCODING:
            cell_class = S_NODE;
            break;
          case E_NODE_ENCODING:
            cell_class = E_NODE;
        }
        cell.className = cell_class;
        row.appendChild(cell);
      }
    }
  };

  
// Start mouse listeners in the grid
const setMouseListeners = () => {
    const table = document.getElementById("table");
    for (let i = 0; i < SIZE_Y; i++) {
      for (let j = 0; j < SIZE_X; j++) {
        const cell = table.rows[i].cells[j];
  
        cell.onmousemove = function (e) {
          const MOUSE_BTN = e.which;
  
          if (MOUSE_BTN == MOUSE_LEFT_CLICK && moving_node) {
            if (!moving_class) moving_class = this.className;
            onNodeMove(this);
          }
  
          switch (MOUSE_BTN) {
            case MOUSE_LEFT_CLICK:
              onLeftClick(this);
              break;
            case MOUSE_RIGHT_CLICK:
              onRightClick(this);
          }
        };
  
        cell.onmousedown = function (e) {
          const MOUSE_BTN = e.which;
          const is_node = cell.className == S_NODE || cell.className == E_NODE;
  
          if (MOUSE_BTN == MOUSE_LEFT_CLICK && is_node) moving_node = true;
  
          switch (MOUSE_BTN) {
            case MOUSE_LEFT_CLICK:
              onLeftClick(this);
              break;
            case MOUSE_RIGHT_CLICK:
              onRightClick(this);
          }
        };
  
        cell.onmouseup = function () {
          moving_node = false;
          moving_class = undefined;
          current_node = undefined;
          prev_node = undefined;
        };
      }
    }
  };