
// Colors
const CELL_COLOR = "rgb(229, 229, 229)";
const BLOCK_COLOR = "rgb(0, 0, 0)";
const S_NODE_COLOR = "rgb(252, 163, 17)";
const E_NODE_COLOR = "rgb(0, 163, 17)";
const PATH_COLOR = "rgb(255, 255, 255)";

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
const START_AND_FINISH_NODE_ROW = Math.floor(1/2 * SIZE_Y);
const START_COL = Math.floor(1/5 * SIZE_X);
const END_COL = Math.floor(4/5 * SIZE_X);

// Delays
const PATH_DELAY = 50;
const VISUALISATION_DELAY = 1;

