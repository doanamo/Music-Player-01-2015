module.exports = new function()
{
    var self = this;
    
    this.initialize = function()
    {
    };
    
    this.playPreviousTrack = function()
    {
    };
    
    this.playNextTrack = function()
    {
    };
    
    this.clearActiveTrack = function()
    {
    };
    
    this.onTrackEnded = function()
    {
        // Play next track.
       self.playNextTrack();
    };
};
