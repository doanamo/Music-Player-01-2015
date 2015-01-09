module.exports = new function()
{
    var self = this;
    
    this.initialize = function()
    {
        $('#tracklist-panel').on('drop', function(event)
        {
            var files = event.originalEvent.dataTransfer.files;
        
            // Add dropped track files.
            for(var i = 0; i < files.length; ++i)
            {
                self.addTrack(files[i].path);
            }
        });
    };
    
    this.playTrack = function(element)
    {
        if(!element)
            return;
            
        // Load track list element.
        audio.load($(element).data('filepath'));
        
        // Set track style as currently playing.
        $(element).siblings().removeClass('active');
        $(element).addClass('active');
    };
    
    this.addTrack = function(filepath)
    {
        // Get file name without extension from full path.
        var name = filepath.replace(/^.*[\\\/]/, "").replace(/\.[^/.]+$/, "");
        
        // Create list element.
        var element = $('<li>');
        element.addClass('list-group-item');
        element.addClass('tracklist-entry');
        element.data('filepath', filepath);
        element.append($('<div>').text(name));
        
        element.dblclick(function(event)
        {
            // Play this track.
            self.playTrack(this);
            
            // Remove selection.
            window.getSelection().removeAllRanges();
        });
        
        // Add element to the list.
        $('#tracklist-panel ul').append(element);
        
        // Prevent cyclic reference.
        element = null;
    };
    
    this.onEnded = function()
    {
        // Get the track that just finished playing.
        var current = $('#tracklist-panel .tracklist-entry.active');
        
        if(!current)
            return;
        
        // Get the next track on the list.
        var next = current.next();
    
        if(next.length === 0)
        {
            var list = $('#tracklist-panel ul');
            next = list.children(":first");
        }
        
        // Play next track.
        self.playTrack(next);
    };
};
