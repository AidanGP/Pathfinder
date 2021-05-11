// Classes
const CELL = "cell";
const WALL = "wall";
const S_NODE = "node-start";
const E_NODE = "node-end";
const PATH = "node-shortest-path";
const VISITED = "node-visited";

// Encodings
const CELL_ENCODING = 0;
const BLOCK_ENCODING = 1;
const S_NODE_ENCODING = 2;
const E_NODE_ENCODING = 3;

// Mouse Values
const MOUSE_LEFT_CLICK = 1;
const MOUSE_RIGHT_CLICK = 2;

// Default Start and End Positions
const START_ROW = (height) => Math.floor((1 / 2) * height);
const START_COL = (width) => Math.floor((1 / 5) * width);
const END_ROW = (height) => Math.floor((1 / 2) * height);
const END_COL = (width) => Math.floor((4 / 5) * width);

// Delays
const PATH_DELAY = 40;
const VISUALISATION_DELAY = 15;

// Algorithm Description
const DIJSTRAS_DESCRIPTION = `
Dijstras algorithm, designed in 1956 is the father of pathfinding algorithms. The algorithm is quite slow but will always find the shortest path.
Dijstras doesnt use any distance heuristics and is generally considered to be worse than A*. Dijstras algorithm uses a distance metric based
on how many iterations the current node is away from the starting node as well as a weighting between each node.
`;
const A_STAR_DESCRIPTION = `
The A* algorithm is commonly implemented in video games, it uses distance heuristics to imrpove its efficiency, this is
known as an informed search. The algorithm is faster than Dijstras algorithm and will always find the shortest path.
A* features a heavy use of distance heuristics such as the g-cost which measures the distance from the current node to the start,
h-cost which measures the distance from the current node to the end node and f-cost which is the sum of g-cost and h-cost.`;
const BREADTH_FIRST_SEARCH_DESCRIPTION = `
Breath first search was initially designed for searching binary trees. As the name suggests, the algorithm priorities searching
horizontally across the grid over vertically. The algorithm will always find the shortest path and is visually similar to Dijstras
algorithm in the way it searches. The algorithm does not use any distance heuristics.
`;
const BEST_FIRST_SEARCH_DESCRIPTION = `
Best first seach, similarly to breath first search was conceptualised for use in searching binary trees. Best first search uses
a distance heuristic so that it can predict the immediately best move. Best first search is a 'greedy' algorithm and as such it
will make the best short term decision as opposed to a better long term decision. The algorithm would rather get $1000 today than
$2000 tomorrow. As a result of it being greedy, the best first search algorithm will not choose the shortest path in some specific
cases.
`;
