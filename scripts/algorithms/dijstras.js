const dijstras = (neighbors, node_cells) => {
  /* 
  Dijstras is an algorithm for getting from one point to another
  It will always find the shortest path and a fun fact is that
  the guy who made it wrote the psuedocode on a napkin at a cafe in 20 mins
  because he wanted to get home fast
  or maybe that was a* no idea
  */

  const start = node_cells[0].toString();
  const goal = node_cells[1].toString();
  const predecessor = {};
  const shortest_distance = [];
  const visited = [];


  // Initialise all of the distances as infinite
  for (const _ in neighbors) {
    shortest_distance.push(Infinity);
  }
  shortest_distance[start] = 0;

  while (Object.keys(neighbors).length != 0) {
    let current_node;
    for (const node in neighbors) {
      if (
        current_node === undefined ||
        shortest_distance[node] < shortest_distance[current_node]
      ) {
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

    for (const neighbor of neighbors[current_node]) {
      const estimated_distance = shortest_distance[current_node] + 1;
      if (estimated_distance < shortest_distance[neighbor]) {
        shortest_distance[neighbor] = estimated_distance;
        predecessor[neighbor] = current_node;
      }
    }

    visited.push(current_node);
    
    delete neighbors[current_node];
  }
};