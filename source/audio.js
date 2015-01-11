module.exports = new function()
{
    var self = this;
    this.sound = null;
    this.volume = 100;
    
    this.initialize = function()
    {
    };

    this.load = function(filepath)
    {
        // Validate arguments.
        if(!filepath)
            return;
            
        // Release the current sound track.
        self.stop();
        self.sound = null;
        
        player.onTrackDiscard();
        
        // Load the sound file.
        self.sound = new buzz.sound(filepath);
        
        if(!self.sound)
            return;
            
        // Set the volume.
        self.sound.setVolume(self.volume);

        // Play the sound track.
        self.play();
        
        // Set sound track name.
        ui.playbackPanel.setTrackName(filepath);
        
        // Set playback event handlers.
        self.sound.bind("durationchange", function()
        {
            ui.playbackPanel.onDurationChange(this);
        });
        
        self.sound.bind("playing", function()
        {
            ui.playbackPanel.onPlay();
        });
        
        self.sound.bind("pause", function()
        {
            ui.playbackPanel.onPause();
        });
        
        self.sound.bind("timeupdate", function()
        {
            ui.playbackPanel.onTimeUpdate(this);
        });
        
        self.sound.bind("ended", function()
        {
            player.onTrackEnded();
        });
    };
    
    this.stop = function()
    {
        if(self.sound)
        {
            self.sound.stop();
        }
    };
    
    this.pause = function()
    {
        if(self.sound)
        {
            self.sound.pause();
        }
    };
    
    this.play = function()
    {
        if(self.sound)
        {
            self.sound.play();
        }
    };
    
    this.setVolume = function(percentage)
    {
        self.volume = Math.ceil(percentage);
    
        if(self.sound)
        {
            self.sound.setVolume(percentage);
        }
        
        ui.volumePanel.onVolumeChange(percentage);
    };
    
    this.setTime = function(seconds)
    {
        if(self.sound)
        {
            self.sound.setTime(seconds);
        }
    };
    
    this.setPercent = function(percent)
    {
        if(self.sound)
        {
            self.sound.setPercent(percent);
        }
    };
    
    this.getDuration = function()
    {
        if(self.sound)
        {
            return self.sound.getDuration();
        }
        else
        {
            return 0;
        }
    }
};
