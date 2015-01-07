require("./utility.js");

ui = require("./user-interface.js");
audio = require("./audio.js");

module.exports = function()
{
    // Initialize user interface.
    ui.initialize();
    
    // Initialize audio playback.
    audio.initialize();
    
    //
    for(var i = 0; i < 5; ++i)
    {
        $('#tracklist-elements').append('<li class="list-group-item">Track</li>');
    }
};
