// Translates the name of an algorithm to its respective function
// string -> function
// This would be in the constants file but due to the order
// that files are loaded in, its gotta be here
const algorithm_name_to_function = {
  Dijstras: dijstras,
  "A*": a_star,
  "Breadth First Search": breadth_first_search,
  "Depth First Search": depth_first_search,
  "Best First Search": best_first_search,
};

async function startPathfinding() {
  /* 
  Called when the user presses the 'pathfind' button
  Finishes when all of the visualisations are drawn
  */

  // Return if the buttons are disabled
  if (is_disabled) return;

  // Remove any visualisations that are already on the board
  restartBoard();
  // Disable the buttons
  setButtonClass("disabled");

  // Get the current state of the board as a 2d array
  const current_board = gridToArray();

  // Get the location of all blocked cells (walls)
  const blocked = getBlockedCells(current_board);
  // Get the location of all node cells (start and end)
  const nodes = getNodeCells(current_board);

  const neighbors = get_neighbors(blocked);

  // Get the function that corresponds to the users choice of algorithm
  const selector = document.getElementById("algorithms");
  const algorithm_name = selector.options[selector.selectedIndex].innerHTML;
  const algorithm = algorithm_name_to_function[algorithm_name];

  // Get the result of the pathfinding algorithm
  // Returs a 2d list: [visited_cells, shortest_path]
  const result = algorithm(neighbors, nodes);

  // -1 is returned if there is no path
  if (result === -1) {
    alert("sorry bruh there is no path");
    setButtonClass("");
    return;
  }

  const [visited_cells, shortest_path] = result;

  // Trim the first and last element out of the visited cells and paths lists.
  const visited_cells_trim = visited_cells.slice(1, visited_cells.length - 1);
  shortest_path.pop();

  // Break the visited cells list into chunks for visualisation
  const visited_cells_to_chunks = [];
  const chunk_size = 10;
  for (let i = 0; i < visited_cells_trim.length; i += chunk_size) {
    const visualisation_chunk = visited_cells_trim.slice(i, i + chunk_size);
    visited_cells_to_chunks.push(visualisation_chunk);
  }

  is_disabled = true;

  // Grey the buttons and draw both visualisations
  await visualise(visited_cells_to_chunks, (is_path = false));
  await visualise([shortest_path], (is_path = true));

  is_disabled = false;
  path_found = true;
  setButtonClass("");
}
async function visualise(cells, is_path) {
  /* 
  Draw a series of cells onto the grid as either path or visited cells
  */
  // Iterate through the cells that we want to be drawn
  const table = document.getElementById("table");
  for (let i = 0; i < cells.length; i++) {
    for (let j = 0; j < cells[i].length; j++) {
      const cell_index = cells[i][j];

      // Determine the row and colum of the given cell
      const row = Math.floor(cell_index / SIZE_X);
      const column = cell_index - SIZE_X * row;

      // Get the cell itself
      const cell = table.rows[row].cells[column];

      // Change the cell to either path or a visited cell
      if (is_path) {
        cell.className = PATH;
        await sleep(PATH_DELAY);
      } else {
        cell.className = VISITED;
      }
    }
    // Sleep to allow for the animation to actually show
    await sleep(VISUALISATION_DELAY);
  }
}

const update_path = () => {
  /*
  Called when a path is found and then the user moves a node or places/removes a wall
  Basically provides a live updating path
  */
  restartBoard();

  const current_board = gridToArray();

  const blocked = getBlockedCells(current_board);
  const nodes = getNodeCells(current_board);

  const neighbors = get_neighbors(blocked);

  const result = a_star(neighbors, nodes);

  if (result === -1) {
    path_found = true;
    return;
  }

  // we ignore the visited cells now because dijstras is laggy
  const [_, shortest_path] = result;

  shortest_path.pop();

  const table = document.getElementById("table");
  for (let i = 0; i < shortest_path.length; i++) {
    const cell_index = shortest_path[i];

    // Determine the row and colum of the given cell
    const [col, row] = coords_of(cell_index);

    // Get the cell itself
    const cell = table.rows[row].cells[col];

    // Change the cell to either path or a visited cell
    cell.className = PATH_UPDATE;
  }
  path_found = true;
};
