const dijstras = (graph, node_cells, blocked_cells) => {
    let nodes = node_cells;
    const start = nodes[0].toString();
    const goal = nodes[1].toString();
    let shortest_distance = {};
    let predecessor = {};
    let unseenNodes = graph;
    let bDict = graph;
    let path = [];
    for (var node in unseenNodes) {
        shortest_distance[node] = Infinity;
    }
    shortest_distance[start] = 0;
    var visualisation = [];
    while (Object.keys(unseenNodes).length !== 0) {
        var minNode = undefined;
        for (var node in unseenNodes) {
            if (minNode === undefined) {
                minNode = node;
                if (!(minNode === start || visualisation.includes(goal) || blocked_cells.includes(parseInt(minNode)))) {
                    visualisation.push(minNode);
                }
            }
            else if (shortest_distance[node] < shortest_distance[minNode]) {
                minNode = node;
                if (!(minNode === start || visualisation.includes(goal) || blocked_cells.includes(parseInt(minNode)))) {
                    visualisation.push(minNode);
                }
            }
        }
        Object.entries(bDict[minNode]).forEach(function (v) {
            let weight = v[1];
            let childNode = v[0];
            if (weight + shortest_distance[minNode] < shortest_distance[childNode]) {
                shortest_distance[childNode] = weight + shortest_distance[minNode];
                predecessor[childNode] = minNode;
            }
        });
        delete unseenNodes[minNode];
    }
    let currentNode = goal;
    while (currentNode !== start) {
        path.unshift(currentNode);
        currentNode = predecessor[currentNode];
    }
    path.unshift(start);
    return { 'visual': visualisation, 'path': path };
}
