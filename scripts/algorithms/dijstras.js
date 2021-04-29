const dijstras = (graph, node_cells, blocked_cells) => {
  /* 
  Dijstras is an algorithm for getting from one point to another
  It will always find the shortest path and a fun fact is that
  the guy who made it wrote the psuedocode on a napkin at a cafe in 20 mins
  because he wanted to get home fast
  */

  // I have no idea why but these need to be strings
  // I figured it out
  // its because of how javascript understands the for...in part later on
  const start = node_cells[0].toString();
  const goal = node_cells[1].toString();
  const predecessor = {};
  const shortest_distance = [];
  const visited = [];
  const path = [];

  // Initialise all of the distances as infinite
  for (const _ in graph) {
    shortest_distance.push(Infinity);
  }
  shortest_distance[start] = 0;

  while (Object.keys(graph).length != 0) {
    let current_node;

    for (const node in graph) {
      if (
        current_node === undefined ||
        shortest_distance[node] < shortest_distance[current_node]
      ) {
        current_node = node;
      }
    }

    for (const neighbour of graph[current_node]) {
      let weight = 1;
      if (blocked_cells.includes(neighbour)) {
        weight = Infinity;
      }
      if (
        weight + shortest_distance[current_node] <
        shortest_distance[neighbour]
      ) {
        shortest_distance[neighbour] = weight + shortest_distance[current_node];
        predecessor[neighbour] = current_node;
      }
    }

    // Append to the list of visited cells (this is for visualisation)
    // Visited wont include the end node or any of the blocked cells because
    // that would look bad
    if (
      !(
        visited.includes(goal) || blocked_cells.includes(parseInt(current_node))
      )
    ) {
      visited.push(current_node);
    }

    delete graph[current_node];
  }

  // longest possible path
  // We dont want the current path to excede or reach the longest possible path
  let current_path_size = 0;
  const max_path_size = SIZE_X * SIZE_Y;

  // Backtrack through the nodes and their predecessors
  let current_node = goal;
  while (current_node !== start) {
    // Account for there being no valid path
    if (current_path_size === max_path_size) {
      return -1;
    }

    path.unshift(current_node);
    // Get the predecessor of the current node
    current_node = predecessor[current_node];
    current_path_size += 1;
  }
  path.unshift(start);
  return [visited, path];
};
