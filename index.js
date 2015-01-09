// Export page modules.
global.$ = $;
global.buzz = buzz;
global.nw = {};
global.nw.gui = require('nw.gui');

// Run the main entry after page loads.
var main = require("./source/main.js");
$(document).ready(main);
