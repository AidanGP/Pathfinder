const get_dist = (a, b) => {
  return Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]);
  //return Math.sqrt(Math.pow((a[0]-b[0]), 2) + Math.pow((a[1]-b[1]), 2));
};

const deep_index = (arr, item) => {
  for (let i in arr) {
    if ((arr[i] = item)) {
      return i;
    }
  }
};

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

    const cell_costs = { g: g_cost, h: h_cost, f: f_cost, id: i };
    cost.push(cell_costs);
  }
  //

  var open_set = [cost[start]];
  var closed_set = [];
  
  var currentNode;
  var prevNode;

  while (open_set.length > 0) {
    var lowInd = 0;
    for (var i = 0; i < open_set.length; i++) {
      if (open_set[i].f < open_set[lowInd].f || open_set[i].f === open_set[lowInd].f && open_set[i].h < open_set[lowInd].h) {
        lowInd = i;
      }
    }

    currentNode = open_set[lowInd];
    preds[currentNode.id] = prevNode;
    

    if (currentNode.id.toString() === goal) {
      // console.log(start, goal);
      // console.table(preds);
      // let current_node = goal;
      // //console.log(preds[goal]);
      // while (current_node.toString() !== start) {
      //   // Account for there being no valid path
      //   path.unshift(current_node);
      //   // Get the predecessor of the current node
      //   current_node = preds[current_node];
      // }
      // console.log(path);
      return [visited, path];
    }

    open_set.splice(lowInd, 1);
    closed_set.push(currentNode);
    var neighbours = graph[currentNode.id];

    for (var i = 0; i < neighbours.length; i++) {
      var neighbour = neighbours[i];

      if (
        closed_set.includes(neighbour) ||
        blocked_cells.includes(neighbour)
      ) {
        continue;
      }

      var gScore = currentNode.g + 1;
      var gScoreIsBest = false;

      if (!open_set.includes(cost[neighbour])) {
        gScoreIsBest = true;
        cost[neighbour].h = get_dist(getCoords(neighbour), g_coords);
        open_set.push(cost[neighbour]);
        visited.push(neighbour);

        
      } else if (gScore < cost[neighbour].g) {
        gScoreIsBest = true;
      }

      if (gScoreIsBest) {
        cost[neighbour].g = gScore;
        cost[neighbour].f = cost[neighbour].g + cost[neighbour].h;
        
      }
    }
    prevNode = currentNode.id;
  }
  return -1;
};
