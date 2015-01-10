module.exports = new function()
{
    var self = this;
    this.draggingProgressBar = false;
    
    this.initialize = function()
    {
        $('#playback-panel').on('drop', function(event)
        {
            var file = event.originalEvent.dataTransfer.files[0];
            
            // Clear active track.
            ui.tracklistPanel.clearActiveTrack();
        
            // Load dropped sound file.
            audio.load(file.path);
        });
    
        $('#playback-progress').mousedown(function(event)
        {
            // Set progress bar state.
            self.draggingProgressBar = true;
            
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
    };
    
    this.setTrackName = function(filepath)
    {
        // Get file name without extension from full path.
        var name = filepath.replace(/^.*[\\\/]/, "").replace(/\.[^/.]+$/, "");
        
        // Set the element text.
        $('#playback-name').text(name);
    };
    
    this.onDurationChange = function(sound)
    {
        // Some metadata might not be available immediately after opening a sound track.
        // Thats why this event callback is needed to handle this info later on.
        var duration = sound.getDuration();
        $('#playback-time .duration').text(buzz.toTimer(duration));
    };
    
    this.onPlay = function()
    {
        // Change progress bar style.
        var bar = $('#playback-progress .progress-bar');
        bar.addClass('progress-bar-striped active');
        bar.removeClass('progress-bar-default');
    };
    
    this.onPause = function()
    {
        // Change progress bar style.
        var bar = $('#playback-progress .progress-bar');
        bar.removeClass('progress-bar-striped active');
        bar.addClass('progress-bar-default');
    };
    
    this.onTimeUpdate = function(sound)
    {
        // Don't update if dragging the progress bar.
        if(self.draggingProgressBar)
            return;
        
        // Get sound track time and duration.
        var time = sound.getTime();
        var duration = sound.getDuration();
        
        // Update time text.
        $('#playback-time .current').text(buzz.toTimer(time));
        
        // Update progress bar.
        $('#playback-progress .progress-bar').css('width', time / duration * 100 + '%');
    };
    
    this.onMouseMove = function(event)
    {
        if(self.draggingProgressBar)
        {
            // Calculate mouse position on the progress bar.
            var x = event.pageX - $('#playback-progress').offset().left;
            var alpha = x / $('#playback-progress').width();
            alpha = Math.clamp(alpha, 0.0, 1.0);
            
            // Reflect time of progress bar position.
            var duration = audio.getDuration();
            $('#playback-time .current').text(buzz.toTimer(duration * alpha));
            
            // Update progress bar.
            $('#playback-progress .progress-bar').css('width', alpha * 100 + '%');
        }
    };
    
    this.onMouseUp = function(event)
    {
        if(self.draggingProgressBar)
        {
            // Set progress bar state.
            self.draggingProgressBar = false;
            
            // Restore transition effect.
            $('#playback-progress .progress-bar').removeClass('no-transition');
            
            // Reset if there's no sound track.
            if(!audio.sound)
            {
                $('#playback-progress .progress-bar').css('width', '0%');
            }
        }
    };
};
