const dijstras = (graph, node_cells, blocked_cells) => {
  /* 
  
  */
  const start = node_cells[0].toString();
  const goal = node_cells[1].toString();
  const shortest_distance = {};
  const predecessor = {};
  const path = [];
  for (let node in graph) {
    shortest_distance[node] = Infinity;
  }
  shortest_distance[start] = 0;
  const visited = [];

  while (Object.keys(graph).length != 0) {
    let minNode;

    for (const node in graph) {
      if (
        minNode == undefined ||
        shortest_distance[node] < shortest_distance[minNode]
      ) {
        minNode = node;
      }
    }
    Object.entries(graph[minNode]).forEach(function (v) {
      const weight = v[1];
      const childNode = v[0];
      if (weight + shortest_distance[minNode] < shortest_distance[childNode]) {
        shortest_distance[childNode] = weight + shortest_distance[minNode];
        predecessor[childNode] = minNode;
      }
    });

    // Append to the list of visited cells (this is for visualisation)
    if (
      // Visited wont include the end node or any of the blocked cells because
      // that would look bad
      !(visited.includes(goal) || blocked_cells.includes(parseInt(minNode)))
    ) {
      visited.push(minNode);
    }
    //

    delete graph[minNode];
  }

  // longest possible path
  // We dont want the current path to excede or reach the longest possible path
  
  let current_path_size = 0;
  const max_path_size = SIZE_X * SIZE_Y;
  let currentNode = goal;
  while (currentNode !== start) {
    // Account for there being no valid path
    if (current_path_size === max_path_size) {
      return -1;
    }

    path.unshift(currentNode);
    currentNode = predecessor[currentNode];
    current_path_size += 1;
  }
  path.unshift(start);
  return [visited, path];
};
