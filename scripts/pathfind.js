// Translates the name of an algorithm to its respective function
// string -> function
// This would be in the constants file but due to the order
// that files are loaded in, its gotta be here
const algorithm_name_to_function = {
  Dijstras: dijstras,
  "A*": a_star,
  "Breadth First Search": breadth_first_search,
  "Best First Search": best_first_search,
};

async function start_pathfinding(algorithm) {
  /* 
  Called when the user presses the 'pathfind' button
  Finishes when all of the visualisations are drawn
  */

  // Return if the buttons are disabled
  if (is_disabled) return;

  // Remove any visualisations that are already on the _grid
  restart_grid();
  // Disable the buttons
  disable_bts(true);

  // Get the current state of the _grid as a 2d array
  const current__grid = grid_to_array();

  // Get the location of all blocked cells (walls)
  const blocked = get_blocked_cells(current__grid);
  // Get the location of all node cells (start and end)
  const nodes = get_node_cells(current__grid);

  const neighbors = get_neighbors(blocked);

  // Get the result of the pathfinding algorithm
  // Returs a list: [visited_cells, shortest_path]
  const result = algorithm(neighbors, nodes);

  // -1 is returned if there is no path
  if (result === -1) {
    // Display the alert for if a pathfind fails
    $('#path_failed').modal('show');
    disable_bts(false);
    return;
  }

  const [visited_cells, shortest_path] = result;

  // Trim the start and end node out of the visited cells.
  const visited_cells_trim = visited_cells.filter((item) => ! (nodes.includes(item)));
  // Remove the goal from the shortest path list
  shortest_path.pop();

  // Break the visited cells list into chunks for visualisation
  const visited_cells_to_chunks = [];
  const chunk_size = 4;
  for (let i = 0; i < visited_cells_trim.length; i += chunk_size) {
    const visualisation_chunk = visited_cells_trim.slice(i, i + chunk_size);
    visited_cells_to_chunks.push(visualisation_chunk);
  }

  is_disabled = true;

  // Grey the buttons and draw both visualisations
  await visualise(visited_cells_to_chunks, (is_path = false));
  await visualise([shortest_path], (is_path = true));

  path_found = true;
  disable_bts(false);
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
  restart_grid();

  const current__grid = grid_to_array();

  const blocked = get_blocked_cells(current__grid);
  const nodes = get_node_cells(current__grid);

  const neighbors = get_neighbors(blocked);

  // Using a* for live pathfinding because it is likley to be the fastest and always the shortest path
  const result = best_first_search(neighbors, nodes);

  if (result === -1) {
    path_found = true;
    return;
  }

  // we ignore the visited cells now because we just want the shortest path
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
    cell.className = PATH;
  }
  path_found = true;
};
