require("./utility.js");

gui = new function()
{
    var self = this;
    
    this.initialize = function()
    {
        self.volumePanel = require("./volume-panel.js");
        self.playbackPanel = require("./playback-panel.js");
        
        self.volumePanel.initialize();
        self.playbackPanel.initialize();
    };
};

audio = new function()
{
    this.sound = null;
    this.volume = 100;

    this.load = function(file)
    {
        // Validate arguments.
        if(file == null)
            return;
            
        // Release the current sound track.
        this.stop();
        this.sound = null;
        
        // Load the sound file.
        this.sound = new buzz.sound(file.path);
        
        if(this.sound == null)
            return;
            
        // Set the volume.
        this.sound.setVolume(this.volume);

        // Play the sound track.
        this.play();
        
        // Set sound track name.
        var name = file.name.replace(/\.[^/.]+$/, "");
        $('#playback-name').text(name);
        
        // Set playback event handlers.
        this.sound.bind("durationchange", function()
        {
            gui.playbackPanel.onDurationChange(this);
        });
        
        this.sound.bind("playing", function()
        {
            gui.playbackPanel.onPlay();
        });
        
        this.sound.bind("pause", function()
        {
            gui.playbackPanel.onPause();
        });
        
        this.sound.bind("timeupdate", function()
        {
            gui.playbackPanel.onTimeUpdate(this);
        });
    };
    
    this.stop = function()
    {
        if(this.sound)
        {
            this.sound.stop();
        }
    };
    
    this.pause = function()
    {
        if(this.sound)
        {
            this.sound.pause();
        }
    };
    
    this.play = function()
    {
        if(this.sound)
        {
            this.sound.play();
        }
    };
    
    this.setVolume = function(percentage)
    {
        this.volume = Math.ceil(percentage);
    
        if(this.sound)
        {
            this.sound.setVolume(percentage);
        }
        
        gui.volumePanel.refresh();
    };
    
    this.setTime = function(seconds)
    {
        if(this.sound)
        {
            this.sound.setTime(seconds);
        }
    };
    
    this.setPercent = function(percent)
    {
        if(this.sound)
        {
            this.sound.setPercent(percent);
        }
    };
    
    this.getDuration = function()
    {
        if(this.sound)
        {
            return this.sound.getDuration();
        }
        else
        {
            return 0;
        }
    }
};

module.exports = function()
{
    // Initialize interface.
    gui.initialize();

    // Window events.
    window.ondragover = function(event)
    {
        event.preventDefault();
        return false;
    };
    
    window.ondrop = function(event)
    {
        event.preventDefault();

        audio.load(event.dataTransfer.files[0]);
        
        return false;
    };
    
    window.onresize = function()
    {
        // Resize middle panel to fill the remaining space.
        var headerHeight = $('#window .panel-heading:first-child').outerHeight();
        var playbackHeight = $('#playback-panel').outerHeight();
    
        $('#tracklist-panel').css('height', window.innerHeight - headerHeight - playbackHeight);
    };
    
    // Call resize handler once.
    window.onresize();
    
    // Page events.
    $(window.document).mousemove(function(event)
    {
        gui.volumePanel.onMouseMove(event);
        gui.playbackPanel.onMouseMove(event);
    });
    
    $(window.document).mousedown(function(event)
    {
        gui.volumePanel.onMouseDown(event);
    });
    
    $(window.document).mouseup(function(event)
    {
        gui.volumePanel.onMouseUp(event);
        gui.playbackPanel.onMouseUp(event);
    });

    // Application control.
    $('#application-volume').click(function()
    {
        if(!$(this).hasClass('active'))
        {
            $(this).addClass('active');
            gui.volumePanel.show();
        }
        else
        {
            $(this).removeClass('active');
            gui.volumePanel.hide();
        }
    });
    
    $('#application-close').click(function()
    {
        window.close();
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
};
