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
            player.playTrack();
        });
        
        $('#playback-previous').click(function()
        {
            player.playPreviousTrack();
        });
        
        $('#playback-next').click(function()
        {
            player.playNextTrack();
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
