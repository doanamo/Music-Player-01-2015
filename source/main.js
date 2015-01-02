var gui = require('nw.gui');
var window = gui.Window.get();

var audio = new function()
{
    this.sound = null;

    this.load = function(file)
    {
        if(file)
        {
            var sound = new buzz.sound(file.path);
            
            if(sound)
            {
                this.stop();
                this.sound = sound;
                this.play();
                
                // Set playback name.
                var name = file.name.replace(/\.[^/.]+$/, "");
                $('#playback-name').text(name);
                
                // Set playback state handlers.
                this.sound.bind("playing", function(event)
                {
                    // Change progress bar style.
                    var bar = $('#playback-progress').find('.progress-bar');
                    bar.addClass('progress-bar-striped active');
                    bar.removeClass('progress-bar-default');
                });
                
                this.sound.bind("pause", function(event)
                {
                    // Change progress bar style.
                    var bar = $('#playback-progress').find('.progress-bar');
                    bar.removeClass('progress-bar-striped active');
                    bar.addClass('progress-bar-default');
                });
                
                this.sound.bind("timeupdate", function(event)
                {
                    var time = this.getTime();
                    var duration = this.getDuration();
                    
                    // Update time text.
                    $('#playback-time').text(buzz.toTimer(time) + " / " + buzz.toTimer(duration));
                    
                    // Update progress bar.
                    $('#playback-progress').find('.progress-bar').css('width', time / duration * 100 + '%');
                });
            }
        }
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
};

var main = function()
{
    // Window behavior.
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

    // Application control.
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

$(document).ready(main);
