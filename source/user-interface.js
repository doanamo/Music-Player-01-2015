module.exports = new function()
{
    var self = this;
    
    this.initialize = function()
    {
        // Get interface element instances.
        self.volumePanel = require("./volume-panel.js");
        self.tracklistPanel = require("./tracklist-panel.js");
        self.playbackPanel = require("./playback-panel.js");
        
        // Initialize interface elements.
        self.volumePanel.initialize();
        self.tracklistPanel.initialize();
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
            self.tracklistPanel.save();
        
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
            self.tracklistPanel.onKeyDown(event);
        });
        
        // Playback control.
        $('#playback-stop').click(function()
        {
            audio.stop();
        });
        
        $('#playback-pause').click(function()
        {
            audio.pause();
        });
        
        $('#playback-play').click(function()
        {
            audio.play();
        });
        
        $('#playback-previous').click(function()
        {
            ui.tracklistPanel.playPrevious();
        });
        
        $('#playback-next').click(function()
        {
            ui.tracklistPanel.playNext();
        });

        // Application control.
        $('#application-volume').click(function()
        {
            if(!$(this).hasClass('active'))
            {
                $(this).addClass('active');
                self.volumePanel.show();
            }
            else
            {
                $(this).removeClass('active');
                self.volumePanel.hide();
            }
        });
    };
};
