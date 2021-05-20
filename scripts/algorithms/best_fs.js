const best_first_search = (neighbors, node_cells) => {
  /*
  Best first search is an informed pathfinding algorithm (it uses distance heuristics) 
  that will greedily find a path from the start node to the end node, the algorithm will
  not always find the best path
  */
  const [start, goal] = node_cells;
  const open_set = [start]; // Nodes we are working with
  let visited = [start]; // Visited cells
  const predecessor = {}; // Predecessor object allows us to backtrack to find the shortest path

  // Initialise a cost dictionary where the cost of moving to the start is the
  // distance from start to end
  const cost = {};
  cost[start] = get_dist(start, goal);


  while (open_set.length > 0) {
    // Get element from the open set that has the lowest cost
    let current_node;
    for (const node of open_set) {
      if (current_node === undefined || cost[node] < cost[current_node]) {
        current_node = node;
      }
    }

    // Remove the element that had the lowest cost from the open set
    const index_to_remove = deep_index(open_set, current_node);
    open_set.splice(index_to_remove, 1);

    // If the path has been found
    if (current_node === goal) {
      const path = get_shortest_path(predecessor, start, goal);
      if (path !== -1) {
        visited = visited.filter((item) => item !== goal);
        return [visited, path];
      } else {
        return -1;
      }
    }

    // Iterate through the neighbors of the current node
    for (const neighbor of neighbors[current_node]) {
      // If the node hasn't already been visited
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
