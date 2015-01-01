var gui = require('nw.gui');
var window = gui.Window.get();

var audio = null;

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
        
        // Load the dropped audio file.
        var file = event.dataTransfer.files[0];
        
        if(file)
        {
            var newAudio = new buzz.sound(file.path);
            
            if(newAudio)
            {
                if(audio)
                {
                    audio.stop();
                }
                
                audio = newAudio;
                audio.play();
                
                // Update playback name.
                var name = file.name.replace(/\.[^/.]+$/, "");
                $('#playback-name').text(name);
                
                // Handle playback time change.
                audio.bind("timeupdate", function(event)
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
        
        return false;
    };

    // Window control.
    $('#window-close').click(function()
    {
        window.close();
    });
    
    // Playback control.
    $('#playback-stop').click(function()
    {
        if(audio)
        {
            audio.stop();
        }
    });
    
    $('#playback-pause').click(function()
    {
        if(audio)
        {
            audio.pause();
        }
    });
    
    $('#playback-play').click(function()
    {
        if(audio)
        {
            audio.play();
        }
    });
};

$(document).ready(main);
