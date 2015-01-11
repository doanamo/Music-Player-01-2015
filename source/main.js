require("./utility.js");

audio = require("./audio.js");
player = require("./player.js");
ui = require("./user-interface.js");

module.exports = function()
{
    // Initialize audio playback.
    audio.initialize();
    
    // Initialize player system.
    player.initialize();

    // Initialize user interface.
    ui.initialize();
    
    // Show the window.
    nw.app.show();
};
