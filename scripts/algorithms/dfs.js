const depth_first_search = (neighbors, node_cells) => {
  /*
    There was a recursive solution to this but
    that would only be a clean soln for traversing a tree
    So im just using the standard soln
    */
  const [start, goal] = node_cells;
  console.log(start, goal);
  const predecessor = {};
  const open_set = [start];
  const visited = [];
  const path = [];
  while (open_set.length > 0) {
    const current_node = open_set.pop();
    //console.log(current_node);
    if (current_node === goal) {
        console.log("Found");
        console.log(predecessor);
        return -1;
    //   let backtracking_node = goal;
    //   while (backtracking_node != start) {
    //     path.unshift(backtracking_node);
    //     backtracking_node = predecessor[backtracking_node];
    //   }
    //   return [visited, path];
    }
    if (!visited.includes(current_node)) {
      visited.push(current_node);
      for (const neighbor of neighbors[current_node]) {
        open_set.unshift(neighbor);
        predecessor[current_node] = neighbor;
      }
    }

  }
  return -1;
};
