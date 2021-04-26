const dijstras = (graph, node_cells, blocked_cells) => {
  /* 
  
  */

  const start = node_cells[0].toString();
  const goal = node_cells[1].toString();
  const shortest_distance = [];
  const predecessor = {};
  const visited = [];
  const path = [];
  for (const _ in graph) {
    shortest_distance.push(Infinity);
  }
  shortest_distance[start] = 0;
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

    for (let neighbour in graph[minNode]) {
      neighbour = graph[minNode][neighbour];

      let weight = 1;
      if (blocked_cells.includes(neighbour)) {
        weight = Infinity;
      }
      if (weight + shortest_distance[minNode] < shortest_distance[neighbour]) {
        shortest_distance[neighbour] = weight + shortest_distance[minNode];
        predecessor[neighbour] = minNode;
      }
    }

    // Append to the list of visited cells (this is for visualisation)
    if (
      // Visited wont include the end node or any of the blocked cells because
      // that would look bad
      !(visited.includes(goal) || blocked_cells.includes(parseInt(minNode)))
    ) {
      visited.push(minNode);
    }

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
