require("./utility.js");

audio = require("./audio.js");
player = require("./player.js");
ui = require("./user-interface.js");
state = require("./state.js");

module.exports = function()
{
    // Initialize audio playback.
    audio.initialize();
    
    // Initialize player system.
    player.initialize();

    // Initialize user interface.
    ui.initialize();
    
    // Initialize state system.
    state.initialize();
    
    // Show the window.
    nw.app.show();
};
