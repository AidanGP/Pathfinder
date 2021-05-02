const breadth_first_search = (neighbors, node_cells) => {
  /*
    Thanks to wikipedia psuedocode department again 
    */
  const [start, goal] = node_cells;
  const open_set = [start]; // queue
  const visited = [start];
  const path = [];
  const predecessor = {};
  while (open_set.length > 0) {
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
    for (const neighbor of neighbors[current_node]) {
      if (!visited.includes(neighbor)) {
        predecessor[neighbor] = current_node;
        if (neighbor !== goal) visited.push(neighbor);
        open_set.push(neighbor);
      }
    }
  }
  return -1;
};
