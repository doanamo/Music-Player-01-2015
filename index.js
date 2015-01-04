// Export page modules.
global.$ = $;
global.buzz = buzz;

// Run the main entry after page loads.
var main = require("./source/main.js");
$(document).ready(main);
