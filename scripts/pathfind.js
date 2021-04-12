async function startPathfinding() {
  if (disable_btns) return;
  restartBoard();

  setButtonClass("disabled");
  const board = gridToArray();
  const blocked = getBlockedCells(board);
  const nodes = getNodeCells(board);
  const empty_board = getEmptyGrid();
  const graph = setGraph(blocked, empty_board);
  const result = dijstras(graph, nodes, blocked);
  const visualisation = result["visual"];
  const path = result["path"];

  const visual = visualisation.slice(1, visualisation.length - 1);

  const path_true = path.slice(1, path.length - 1);

  const v = [];
  let temparray;
  let chunk = path_true.length + 1;
  for (let i = 0; i < visual.length; i += chunk) {
    temparray = visual.slice(i, i + chunk);
    v.push(temparray);
  }
  disable_btns = true;
  await plotVisualisation(v, false);

  await plotVisualisation([path_true], true);
  disable_btns = false;
  setButtonClass("");
}

async function plotVisualisation(visual, is_path) {
  const table = document.getElementById("table");
  for (let i = 0; i < visual.length; i++) {
    for (let j = 0; j < visual[i].length; j++) {
      const cell_index = parseInt(visual[i][j]);
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
