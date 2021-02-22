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
const MOUSE_RIGHT_CLICK = 3;

// Window Sizes
const SIZE_X = Math.floor($(window).width() / 50);
const SIZE_Y = Math.floor($(window).height() / 50);

// Default Start and End Positions
const START_ROW = Math.floor((1 / 2) * SIZE_Y);
const END_ROW = Math.floor((1 / 2) * SIZE_Y);
const START_COL = Math.floor((1 / 5) * SIZE_X);
const END_COL = Math.floor((4 / 5) * SIZE_X);

// Delays
const PATH_DELAY = 50;
const VISUALISATION_DELAY = 10;

// Algorithms
const ALGORITHMS = ["dijstras", "a_star"];

// Themes
const THEMES = [
    ['#9046cf','#cc59d2','#f487b6','#fff3f0','#fde12d'],
    ['#002626','#0e4749','#95c623','#e55812','#efe7da'],
    ['#ffc15e','#f7b05b','#f7934c','#cc5803','#cc5803']
]