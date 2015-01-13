module.exports = new function()
{
    var self = this;
    
    this.initialize = function()
    {
    };
    
    this.playTrack = function()
    {
        var playlist = ui.playlistPanel.getActivePlaylist();
        var tracklist = $(playlist).data('tracklist');
        
        if(tracklist.getActiveTrack().length === 0)
        {
            tracklist.playNextTrack();
        }
        else
        {
            audio.play();
        }
    };
    
    this.playPreviousTrack = function()
    {
        var playlist = ui.playlistPanel.getActivePlaylist();
        var tracklist = $(playlist).data('tracklist');
        
        tracklist.playPreviousTrack();
    };
    
    this.playNextTrack = function()
    {
        var playlist = ui.playlistPanel.getActivePlaylist();
        var tracklist = $(playlist).data('tracklist');
        
        tracklist.playNextTrack();
    };
    
    this.clearActiveTrack = function()
    {
        $('#playlist-panel li').each(function()
        {
            var tracklist = $(this).data('tracklist');
            tracklist.clearActiveTrack();
        });
    };
    
    this.onTrackDiscard = function()
    {
        self.clearActiveTrack();
    };
    
    this.onTrackEnded = function()
    {
        self.playNextTrack();
    };
};
