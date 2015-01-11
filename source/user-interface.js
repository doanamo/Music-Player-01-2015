module.exports = new function()
{
    var self = this;
    
    this.initialize = function()
    {
        // Get interface element instances.
        self.controlPanel = require("./control-panel.js");
        self.volumePanel = require("./volume-panel.js");
        self.playlistPanel = require("./playlist-panel.js");
        self.playbackPanel = require("./playback-panel.js");
        
        // Initialize interface elements.
        self.controlPanel.initialize();
        self.volumePanel.initialize();
        self.playlistPanel.initialize();
        self.playbackPanel.initialize();
        
        // Set minimum application size.
        var controlHeight = $('#control-panel').outerHeight();
        var playbackHeight = $('#playback-panel').outerHeight();
        
        nw.app.setMinimumSize(500, controlHeight + playbackHeight - 1);
        
        // Application events.
        nw.app.on('close', function(event)
        {
            // Hide the window.
            this.hide();
        
            // Save user data.
            // TODO!
        
            // Close the window.
            this.close(true);
        });
        
        // Window events.
        window.ondragover = function(event)
        {
            event.preventDefault();
        };
        
        window.ondrop = function(event)
        {
            event.preventDefault();
        };
        
        window.onresize = function()
        {
            // Resize view panel to fill the remaining space.
            var mainHeight = $('#main-panel').outerHeight();
            var controlHeight = $('#control-panel').outerHeight();
            var playbackHeight = $('#playback-panel').outerHeight();
            
            var viewHeight = mainHeight - controlHeight - playbackHeight;
            $('#view-panel').css('height', viewHeight);
        };
        
        // Call resize handler once.
        window.onresize();
        
        // Page events.
        $(window.document).mousemove(function(event)
        {
            self.volumePanel.onMouseMove(event);
            self.playbackPanel.onMouseMove(event);
        });
        
        $(window.document).mousedown(function(event)
        {
            self.volumePanel.onMouseDown(event);
        });
        
        $(window.document).mouseup(function(event)
        {
            self.volumePanel.onMouseUp(event);
            self.playbackPanel.onMouseUp(event);
        });
        
        $(window.document).keydown(function(event)
        {
            self.playlistPanel.onKeyDown(event);
        });
    };
};
