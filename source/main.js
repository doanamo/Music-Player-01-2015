Math.clamp = function(value, min, max)
{
    return Math.min(Math.max(value, min), max);
};

var window = require('nw.gui').Window.get();

var gui = new function()
{
    this.draggingPlaybackBar = false;
    this.draggingVolumeSlider = false;
};

var audio = new function()
{
    this.sound = null;
    this.volume = 100;

    this.load = function(file)
    {
        // Validate arguments.
        if(file == null)
            return;
            
        // Release the current sound track.
        this.sound = null;
        
        // Load the sound file.
        this.sound = new buzz.sound(file.path);
        
        if(this.sound == null)
            return;
            
        // Set the volume.
        this.sound.setVolume(this.volume);

        // Play the sound track.
        this.sound.play();
        
        // Set sound track name.
        var name = file.name.replace(/\.[^/.]+$/, "");
        $('#playback-name').text(name);
        
        // Set sound track duration when it becomes available.
        this.sound.bind("durationchange", function()
        {
            var duration = this.getDuration();
            $('#playback-time .duration').text(buzz.toTimer(duration));
        });
        
        // Set playback event handlers.
        this.sound.bind("playing", function()
        {
            // Change progress bar style.
            var bar = $('#playback-progress .progress-bar');
            bar.addClass('progress-bar-striped active');
            bar.removeClass('progress-bar-default');
        });
        
        this.sound.bind("pause", function()
        {
            // Change progress bar style.
            var bar = $('#playback-progress .progress-bar');
            bar.removeClass('progress-bar-striped active');
            bar.addClass('progress-bar-default');
        });
        
        this.sound.bind("timeupdate", function()
        {
            // Don't update if dragging the playback bar.
            if(gui.draggingPlaybackBar)
                return;
            
            // Get sound track time and duration.
            var time = this.getTime();
            var duration = this.getDuration();
            
            // Update time text.
            $('#playback-time .current').text(buzz.toTimer(time));
            
            // Update progress bar.
            $('#playback-progress .progress-bar').css('width', time / duration * 100 + '%');
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
        
        // Update volume slider.
        $('#volume-slider .progress-bar').css('width', this.volume + '%');
        $('#volume-percentage').text(this.volume + '%');
        
        // Change icon depending on volume.
        $('#volume-icon').removeClass();
        
        if(this.volume == 0)
        {
            $('#volume-icon').addClass('glyphicon glyphicon-volume-off');
        }
        else
        if(this.volume < 50)
        {
            $('#volume-icon').addClass('glyphicon glyphicon-volume-down');
        }
        else
        if(this.volume >= 50)
        {
            $('#volume-icon').addClass('glyphicon glyphicon-volume-up');
        }
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

var main = function()
{
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
    
    // Page events.
    $(document).mouseup(function(event)
    {
        if(gui.draggingPlaybackBar)
        {
            // Set interface state.
            gui.draggingPlaybackBar = false;
            
            // Restore transition effect.
            $('#playback-progress .progress-bar').removeClass('no-transition');
            
            // Reset if there's no sound track.
            if(!audio.sound)
            {
                $('#playback-progress .progress-bar').css('width', '0%');
            }
        }
        
        if(gui.draggingVolumeSlider)
        {
            // Set interface state.
            gui.draggingVolumeSlider = false;
            
            // Restore transition effect.
            $('#volume-slider .progress-bar').removeClass('no-transition');
        }
    });
    
    $(document).mousemove(function(event)
    {
        if(gui.draggingPlaybackBar)
        {
            // Calculate mouse position on the progress bar.
            var x = event.pageX - $('#playback-progress').offset().left;
            var alpha = x / $('#playback-progress').width();
            alpha = Math.clamp(alpha, 0.0, 1.0);
            
            // Reflect time of dragged progress bar.
            var duration = audio.getDuration();
            $('#playback-time .current').text(buzz.toTimer(duration * alpha));
            
            // Update progress bar.
            $('#playback-progress .progress-bar').css('width', alpha * 100 + '%');
        }
        
        if(gui.draggingVolumeSlider)
        {
            // Calculate mouse position on the slider.
            var x = event.pageX - $('#volume-slider').offset().left;
            var alpha = x / $('#volume-slider').width();
            alpha = Math.clamp(alpha, 0.0, 1.0);
            
            // Set audio volume.
            audio.setVolume(alpha * 100);
        }
    });

    // Application control.
    $('#application-volume').click(function()
    {
        if(!$(this).hasClass('active'))
        {
            $(this).addClass('active');
            $('#volume-panel').show();
        }
        else
        {
            $(this).removeClass('active');
            $('#volume-panel').hide();
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
    
    // Progress bar.
    $('#playback-progress').mousedown(function(event)
    {
        // Set interface state.
        gui.draggingPlaybackBar = true;
        
        // Disable transition effect.
        $('#playback-progress .progress-bar').addClass('no-transition');

        // Prevent selection.
        return false;
    });
    
    $('#playback-progress').click(function(event)
    {
        // Calculate mouse position on the progress bar.
        var x = event.pageX - $(this).offset().left;
        var alpha = x / $(this).width();
        alpha = Math.clamp(alpha, 0.0, 1.0);

        // Change playback position.
        audio.setPercent(alpha * 100);
        audio.play();
    });
    
    // Volume slider.
    $('#volume-slider').mousedown(function(event)
    {
        // Set interface state.
        gui.draggingVolumeSlider = true;
        
        // Disable transition effect.
        $('#volume-slider .progress-bar').addClass('no-transition');
    
        // Prevent selection.
        return false;
    });
    
    $('#volume-slider').click(function(event)
    {
        // Calculate mouse position on the slider.
        var x = event.pageX - $(this).offset().left;
        var alpha = x / $(this).width();
        alpha = Math.clamp(alpha, 0.0, 1.0);
        
        // Set audio volume.
        audio.setVolume(alpha * 100);
    });
};

$(document).ready(main);
