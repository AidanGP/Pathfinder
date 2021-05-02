const get_dist = (a, b) => {
  a = coords_of(a);
  b = coords_of(b);
  //return Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]);
  return Math.pow(a[0] - b[0], 2) + Math.pow(a[1] - b[1], 2);
};

const deep_index = (arr, item) => {
  for (let i in arr) {
    if (arr[i] === item) {
      return i;
    }
  }
};

const a_star = (neighbors, node_cells) => {
  const [start, goal] = node_cells;

  const path = [];
  const visited = [];
  const open_set = [start];
  const predecessor = {};
  const g_score = {};
  const f_score = {};
  g_score[start] = 0;
  f_score[start] = get_dist(start, goal);

  while (open_set.length > 0) {

    // Find the node in the open set with the lowest f-score
    let current_node;
    for (const node of open_set) {
      if (current_node === undefined || f_score[node] < f_score[current_node]) {
        current_node = node;
      }
    }

    // We think we found a valid path
    if (current_node === goal) {
      const path = get_shortest_path(predecessor, start, goal);
      if (path !== -1) {
        return [visited, path];
      } else {
        return -1;
      }
    }

    const index_to_remove = deep_index(open_set, current_node);
    open_set.splice(index_to_remove, 1);

    for (const neighbor of neighbors[current_node]) {
      visited.push(neighbor);
      const tentative_g_score = g_score[current_node] + 1;
      if (!(neighbor in g_score) || tentative_g_score < g_score[neighbor]) {
        predecessor[neighbor] = current_node;
        g_score[neighbor] = tentative_g_score;
        f_score[neighbor] = g_score[neighbor] + get_dist(neighbor, goal);
        if (!(neighbor in open_set)) {
          open_set.push(neighbor);
        }
      }
    }
  }
  // No path found
  return -1;
};
