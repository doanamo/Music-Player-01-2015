require("./utility.js");

ui = require("./user-interface.js");
audio = require("./audio.js");

module.exports = function()
{
    // Initialize user interface.
    ui.initialize();
    
    // Initialize audio playback.
    audio.initialize();
};
