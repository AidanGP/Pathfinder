let is_disabled = false; // Should the buttons be disabled

// HELPER FUNCTIONS

/* 
  Sleep for a number of milliseconds
*/
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const disable_bts = (disable) => {
  /* 
    Used to disable / enable buttons during animations
  */

  // Get all buttons and drop down elements
  const nav_items = document.getElementsByClassName("nav-item");
  const dropdown_items = document.getElementsByClassName("dropdown-item");

  if (disable) {
    // Iteratively disable the buttons and the dropdown items
    for (const nav_item of nav_items) {
      nav_item.classList.add("disabled");
    }
    for (const dropdown_item of dropdown_items) {
      dropdown_item.classList.add("disabled");
    }
  } else {
    // Iteratively enable the buttons and the dropdown items
    is_disabled = false;
    for (const nav_item of nav_items) {
      nav_item.classList.remove("disabled");
    }
    for (const dropdown_item of dropdown_items) {
      dropdown_item.classList.remove("disabled");
    }
  }
};

const change_table_dims = () => {
  /*
    if there is information on the _grid i cant resize it without losing said information
    So if the _grid is empty i can automatically resize it
  */

  // Get the number of walls in the current _grid
  const current__grid = grid_to_array();
  const n_walls = get_blocked_cells(current__grid).length;

  // If nothing has been placed on the _grid, then reset it
  if (n_walls === 0) {
    clear_grid();
  }
};

// Information overlay convert the name of an algorithm to its respective description
const algorithm_descriptions = {
  Dijstras: DIJSTRAS_DESCRIPTION,
  "A*": A_STAR_DESCRIPTION,
  "Breadth First Search": BREADTH_FIRST_SEARCH_DESCRIPTION,
  "Best First Search": BEST_FIRST_SEARCH_DESCRIPTION,
};

const overlay_on = (algorithm) => {
  /*
  Toggle the overlay on, writing the appropriate headings and descriptions
  to the overlay
  */

  // Get the heading and description elements
  const description_heading = document.getElementById("algorithm_name");
  const description_body = document.getElementById("algorithm_description");

  // Translate the name of the algorithm to its respective description
  const algorithm_description = algorithm_descriptions[algorithm];

  // Write the description and heading to the overlay
  description_heading.innerHTML = algorithm;
  description_body.innerHTML = algorithm_description;

  // Display the overlay
  document.getElementById("overlay").style.display = "block";
};

const overlay_off = () => {
  /*
  Toggle the overlay off
  */
  document.getElementById("overlay").style.display = "none";
};

const coords_of = (cell) => {
  /*
  Given the 'id' of a cell in the grid, return the x and y coordinates of it
  */
  // Some maths to get the row and col values
  const row = Math.floor(cell / SIZE_X);
  const col = cell - SIZE_X * row;
  return [col, row];
};

const get_default_grid = () => {
  /* 
    get a 2d array that is empty aside from the start and end nodes
  */
  // The number of cells in the grid
  SIZE_X = Math.floor(window.innerWidth / 35);
  SIZE_Y = Math.floor(window.innerHeight / 35);
  const grid = [];
  // Iteratively create the grid, inserting the start and end nodes where needed
  for (let i = 0; i < SIZE_Y; i++) {
    grid.push([]);
    for (let j = 0; j < SIZE_X; j++) {
      if (i == START_ROW(SIZE_Y) && j == START_COL(SIZE_X)) {
        grid[i].push(S_NODE_ENCODING);
      } else if (i == END_ROW(SIZE_Y) && j == END_COL(SIZE_X)) {
        grid[i].push(E_NODE_ENCODING);
      } else {
        grid[i].push(CELL_ENCODING);
      }
    }
  }
  return grid;
};

const clear_grid = () => {
  /* 
    Erase the _grid back to the default grid (empty aside from 2 nodes)
  */
  if (is_disabled) return;
  path_found = false; // Disable the live pathfinding
  disable_bts(false); // Re-enable the buttons
  // Reset the grid
  const default_grid = get_default_grid();
  set_grid(default_grid);
  remove_mouse_listeners(); // Remove the old mouse listeners
  set_mouse_listeners(); // Initialise the grid mouse listeners
};

const restart_grid = () => {
  /* 
    Clear all visualisations from the _grid
  */
  if (is_disabled) return;
  path_found = false; // Disable live pathfinding
  const table = document.getElementById("table");
  // Iterativeley clear the grid of any visited cells or shortest path cells
  for (let i = 0; i < SIZE_Y; i++) {
    for (let j = 0; j < SIZE_X; j++) {
      const cell = table.rows[i].cells[j];
      if ([VISITED, PATH].includes(cell.className)) {
        cell.className = CELL;
      }
    }
  }
};

// MAINLINE -------------------------

// Initialise the grid
clear_grid();
// Start checking if they resize the window
window.addEventListener("resize", change_table_dims);

// ----------------------------------
