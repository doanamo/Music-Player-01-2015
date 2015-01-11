module.exports = new function()
{
    var self = this;
    
    this.initialize = function()
    {
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
                ui.volumePanel.show();
            }
            else
            {
                $(this).removeClass('active');
                ui.volumePanel.hide();
            }
        });
    };
};
