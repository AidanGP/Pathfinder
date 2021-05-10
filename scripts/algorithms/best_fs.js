const best_first_search = (neighbors, node_cells) => {
  const [start, goal] = node_cells;
  const open_set = [start]; // queue
  let visited = [start];
  const predecessor = {};

  const cost = {};
  cost[start] = get_dist(start, goal);
  while (open_set.length > 0) {
    // get min cost from the open set.
    let current_node;
    for (const node of open_set) {
      if (current_node === undefined || cost[node] < cost[current_node]) {
        current_node = node;
      }
    }
    const index_to_remove = deep_index(open_set, current_node);
    open_set.splice(index_to_remove, 1);

    if (current_node === goal) {
      const path = get_shortest_path(predecessor, start, goal);
      if (path !== -1) {
        visited = visited.filter((item) => item !== goal);
        return [visited, path];
      } else {
        return -1;
      }
    }

    for (const neighbor of neighbors[current_node]) {
      if (!visited.includes(neighbor)) {
        visited.push(neighbor);
        open_set.push(neighbor);
        cost[neighbor] = get_dist(neighbor, goal);
        predecessor[neighbor] = current_node;
      }
    }
  }
  return -1;
};
