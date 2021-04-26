const get_dist = (a, b) => {
  return Math.abs(a[0] - b[0]) + Math.abs(a[0] - b[0]);
}

const a_star = (graph, node_cells, blocked_cells) => {


  const preds = {};
  const visited = [];
  const path = [];
  const start = node_cells[0].toString();
  const s_coords = getCoords(start);

  const goal = node_cells[1].toString();
  const g_coords = getCoords(goal);

  // G-cost : distance from starting node
  // H-cost : distance from end node
  // F-cost : G-cost + H-cost

  const cost = [];
  for (let i = 0; i < SIZE_X * SIZE_Y; i++) {

    const coords = getCoords(i);

    const g_cost = get_dist(coords, s_coords);
    const h_cost = get_dist(coords, g_coords);
    const f_cost = g_cost + h_cost;

    const cell_costs = { g: g_cost, h: h_cost, f: f_cost };
    cost.push(cell_costs);
  }

  let open_set = [];
  open_set.push(start);
  const closed = [];

  while (Object.keys(open_set).length !== 0) {

    let current = open_set[0];
    let current_cost = cost[current];

    for (let i = 1; i < open_set.length; i ++) {
      if (cost[open_set[i]].f < current_cost.f) {
        current = open_set[i];
        current_cost = cost[current];
      }
      if (cost[open_set[i]].f === current_cost.f && cost[open_set[i]].h < current_cost.h) {
        current = open_set[i];
        current_cost = cost[current];
      }
    }

    // remove the current cell from the open list
    const ind = open_set.indexOf(current);
    open_set.splice(ind, 1);
    closed.push(current);
    
    if (current_cost.h === 0) {
      let currentNode = goal;
      while (currentNode !== start) {
        path.unshift(currentNode);
        currentNode = preds[currentNode];
      }
    }

    //console.log(current);
    for (let i = 1; i < Object.keys(graph[current]).length; i++ ) {
      const neighbour = Object.keys(graph[current])[i];
      const neighbour_cost = cost[neighbour];
      if (blocked_cells.includes(neighbour) || closed.includes(neighbour)) {
        continue;
      }
      
      const neighbour_coords = getCoords(neighbour);
      const current_coords = getCoords(current);
      const move_cost = current.g + get_dist(current_coords, neighbour_coords);

      if (move_cost < neighbour_cost.g || !open_set.includes(neighbour_cost)) {
        neighbour_cost.g = move_cost;
        neighbour_cost.h = get_dist(neighbour_coords, g_coords);

        preds[neighbour] = current;

        if (!open_set.includes(neighbour)) {
          open_set.push(neighbour);
        }
      }
    }
  }
  path.unshift(start);
  return [visited, path];
};
