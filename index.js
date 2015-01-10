// Export page modules.
global.$ = $;
global.fs = require('fs');
global.nw = {};
global.nw.gui = require('nw.gui');
global.nw.app = global.nw.gui.Window.get();
global.buzz = buzz;

// Run the main entry after page loads.
var main = require("./source/main.js");
$(document).ready(main);
