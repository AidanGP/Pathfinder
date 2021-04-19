const dijstras = (graph, node_cells, blocked_cells) => {
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
      !(visited.includes(goal) || blocked_cells.includes(parseInt(minNode)))
    ) {
      visited.push(minNode);
    }
    //

    delete graph[minNode];
  }
  let currentNode = goal;
  while (currentNode !== start) {
    path.unshift(currentNode);
    currentNode = predecessor[currentNode];
  }
  path.unshift(start);
  return [visited, path];
};
