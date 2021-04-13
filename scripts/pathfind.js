// Translates the name of an algorithm to its respective function
const algorithm_name_to_function = {
  Dijstras: dijstras,
  "A*": a_star,
};

async function startPathfinding() {
  if (disable_btns) return;
  restartBoard();
  setButtonClass("disabled");

  const current_board = gridToArray();

  const blocked = getBlockedCells(current_board);
  const nodes = getNodeCells(current_board);

  const graph = setGraph(blocked);

  //

  const selector = document.getElementById("algorithms");
  const algorithm_name = selector.options[selector.selectedIndex].innerHTML;
  const algorithm = algorithm_name_to_function[algorithm_name];

  //

  const result = algorithm(graph, nodes, blocked);

  const visited_cells = result["visited"];
  const shortest_path = result["path"];

  // Trim the first and last element out of the visited cells and paths lists.
  const visited_cells_trim = visited_cells.slice(1, visited_cells.length - 1);
  const shortest_path_trim = shortest_path.slice(1, shortest_path.length - 1);

  // Break the visited cells list into chunks for visualisation
  const visited_cells_to_chunks = [];
  const chunk_size = shortest_path_trim.length + 1;
  for (let i = 0; i < visited_cells_trim.length; i += chunk_size) {
    const visualisation_chunk = visited_cells_trim.slice(i, i + chunk_size);
    visited_cells_to_chunks.push(visualisation_chunk);
  }

  disable_btns = true;

  // Grey the buttons and draw all visualisations
  await visualise(visited_cells_to_chunks, is_path=false);
  await visualise([shortest_path_trim], is_path=true);

  disable_btns = false;
  setButtonClass("");
}

async function visualise(cells, is_path) {
  const table = document.getElementById("table");
  for (let i = 0; i < cells.length; i++) {
    for (let j = 0; j < cells[i].length; j++) {
      
      const cell_index = parseInt(cells[i][j]);

      const row = Math.floor(cell_index / SIZE_X);
      const column = cell_index - SIZE_X * row;

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
