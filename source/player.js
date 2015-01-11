module.exports = new function()
{
    var self = this;
    
    this.initialize = function()
    {
    };
    
    this.onTrackEnded = function()
    {
        // Play next track from current playlist.
        ui.tracklistPanel.playNextTrack();
    };
};
