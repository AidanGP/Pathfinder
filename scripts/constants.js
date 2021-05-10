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
Dijstras algorithm is the father of pathfinding algorithms. The algorithm is quite slow but will always find the shortest path.
`;
const A_STAR_DESCRIPTION = `
The A* algorithm is commonly implemented in video games and used distance heuristics to imrpove its efficiency. The algorithm
is faster than Dijstras algorithm and will always find the shortest path`;
const BREADTH_FIRST_SEARCH_DESCRIPTION = `
Breath first search was initially designed for searching binary trees. As the name suggests, the algorithm priorities searching
horizontally across the grid over vertically. The algorithm will always find the shortest path and is visually similar to Dijstras
algorithm in the way it searches.
`;
const BEST_FIRST_SEARCH_DESCRIPTION = `
`;
