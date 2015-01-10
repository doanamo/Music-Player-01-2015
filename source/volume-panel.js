module.exports = new function()
{
    var self = this;
    this.draggingSlider = false;
    
    this.initialize = function()
    {
        $('#volume-slider').mousedown(function(event)
        {
            // Set slider state.
            self.draggingSlider = true;
            
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
    
    this.onVolumeChange = function(percentage)
    {
        // Update volume slider.
        $('#volume-slider .progress-bar').css('width', percentage + '%');
        $('#volume-percentage').text(audio.volume + '%');
        
        // Change icon depending on volume.
        $('#volume-icon').removeClass();
        
        if(percentage == 0)
        {
            $('#volume-icon').addClass('glyphicon glyphicon-volume-off');
        }
        else
        if(percentage < 50)
        {
            $('#volume-icon').addClass('glyphicon glyphicon-volume-down');
        }
        else
        if(percentage >= 50)
        {
            $('#volume-icon').addClass('glyphicon glyphicon-volume-up');
        }
    };
    
    this.show = function()
    {
        debugger;
        $('#volume-panel').show();
    };
    
    this.hide = function()
    {
        $('#volume-panel').hide();
    };
    
    this.onMouseMove = function(event)
    {
        if(self.draggingSlider)
        {
            // Calculate mouse position on the slider.
            var x = event.pageX - $('#volume-slider').offset().left;
            var alpha = x / $('#volume-slider').width();
            alpha = Math.clamp(alpha, 0.0, 1.0);
            
            // Set audio volume.
            audio.setVolume(alpha * 100);
        }
    };
    
    this.onMouseDown = function(event)
    {
        // Hide volume panel if clicked outside of it.
        if($('#volume-panel').is(':visible'))
        {
            var onButton = $(event.target).closest('#application-volume').length;
            var onPanel = $(event.target).closest('#volume-panel').length;
        
            if(!onButton && !onPanel)
            {
                $('#application-volume').removeClass('active');
                $('#volume-panel').hide();
            }
        }
    };
    
    this.onMouseUp = function(event)
    {
        if(self.draggingSlider)
        {
            // Set slider state.
            self.draggingSlider = false;
            
            // Restore transition effect.
            $('#volume-slider .progress-bar').removeClass('no-transition');
        }
    };
};
