const get_dist = (a, b) => {
  /*
  Distance heuristic used by A* and Best first search
  */
  a = coords_of(a);
  b = coords_of(b);
  // Known as manhattan distance
  return Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]);
  //return Math.pow(a[0] - b[0], 2) + Math.pow(a[1] - b[1], 2);
};

const deep_index = (arr, item) => {
  /*
  JS wont index nested lists so I do it myself very lazily
  */
  for (let i in arr) {
    if (arr[i] === item) {
      return i;
    }
  }
};

const a_star = (neighbors, node_cells) => {
  /*
  A star is an informed pathfinding algorithm. It happens to be the most commonly implemented
  one in video games. It always finds the shortest path and is pretty fast.
  */
  const [start, goal] = node_cells;

  const visited = [];
  const open_set = [start];
  const predecessor = {};
  const g_score = {}; // G score is the manhattan distance between the start and a given node
  const f_score = {}; // F score is the g-score plus the manhatten distance from the node to the goal

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

    // Remove the current node from the open set, it is now closed
    const index_to_remove = deep_index(open_set, current_node);
    open_set.splice(index_to_remove, 1);

    // Iterate through the neighbors of the current node
    for (const neighbor of neighbors[current_node]) {
      const tentative_g_score = g_score[current_node] + 0.9; // With the way that I am visualising, this has to be less than 1
      // If the neighbor looks like it will be better than the current node based on its g score
      if (!(neighbor in g_score) || tentative_g_score < g_score[neighbor]) {
        predecessor[neighbor] = current_node;
        g_score[neighbor] = tentative_g_score;
        f_score[neighbor] = g_score[neighbor] + get_dist(neighbor, goal);
        if (!open_set.includes(neighbor)) {
          visited.push(neighbor);
          open_set.push(neighbor);
        }
      }
    }
  }
  // No path found
  return -1;
};
