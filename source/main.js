require("./utility.js");

ui = require("./user-interface.js");

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
            ui.playbackPanel.onDurationChange(this);
        });
        
        this.sound.bind("playing", function()
        {
            ui.playbackPanel.onPlay();
        });
        
        this.sound.bind("pause", function()
        {
            ui.playbackPanel.onPause();
        });
        
        this.sound.bind("timeupdate", function()
        {
            ui.playbackPanel.onTimeUpdate(this);
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
        
        ui.volumePanel.onVolumeChange(percentage);
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
    // Initialize user interface.
    ui.initialize();
};
