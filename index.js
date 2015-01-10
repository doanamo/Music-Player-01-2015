// Export page modules.
global.$ = $;
global.fs = require('fs');
global.nw = {};
global.nw.gui = require('nw.gui');
global.nw.app = global.nw.gui.Window.get();
global.buzz = buzz;

// Run the main entry after page loads.
try
{
    var main = require("./source/main.js");
    $(document).ready(main);
}
catch(error)
{
    // Remove on close event handler that gets fired 
    // even after page crashes and throws an exception.
    global.nw.app.on('close', null);
    
    // Throw error normally.
    throw error;
}
finally
{
    // Show application window.
    global.nw.app.show();
}
