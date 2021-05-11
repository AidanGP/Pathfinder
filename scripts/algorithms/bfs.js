const breadth_first_search = (neighbors, node_cells) => {
  /*
    Breadth first search is an uninformed pathfinding algorithm that will
    always find the shortest path.
  */
  const [start, goal] = node_cells;
  const open_set = [start]; // Set of nodes we are working with
  const visited = [start]; // Nodes that have already been visited
  const predecessor = {};
  while (open_set.length > 0) {
    // Get the first item from the open set and remove it
    const current_node = open_set.shift();

    // We think we found a valid path
    if (current_node === goal) {
      const path = get_shortest_path(predecessor, start, goal);
      if (path !== -1) {
        return [visited, path];
      } else {
        return -1;
      }
    }

    // Iterate through the neighbors of the current node
    for (const neighbor of neighbors[current_node]) {
      // If the neighbor hasnt already been visited
      if (!visited.includes(neighbor)) {
        predecessor[neighbor] = current_node;
        visited.push(neighbor);
        open_set.push(neighbor);
      }
    }
  }
  return -1;
};
