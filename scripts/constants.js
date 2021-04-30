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
const VISUALISATION_DELAY = 0;

