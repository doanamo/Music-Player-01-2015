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
    
    this.addTrack = function(filepath)
    {
        // Get file name without extension from full path.
        var name = filepath.replace(/^.*[\\\/]/, "").replace(/\.[^/.]+$/, "");
        
        // Create list element.
        var element = $('<li>');
        element.addClass('list-group-item');
        element.data('filepath', filepath);
        element.append($('<div>').text(name));
        
        element.dblclick(function(event)
        {
            // Play this track.
            self.playTrack(this);
            
            // Remove selection.
            window.getSelection().removeAllRanges();
        });
        
        element.click(function(event)
        {
            // Set selected state.
            $(this).siblings().removeClass('selected');
            $(this).toggleClass('selected');
            
            // Set cursor position.
            $(this).siblings().removeClass('cursor');
            $(this).addClass('cursor');
        });
        
        // Add element to the list.
        $('#tracklist-panel ul').append(element);
        
        // Prevent cyclic reference.
        element = null;
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
    
    this.playNext = function()
    {
        self.playTrack(self.getNext());
    };
    
    this.playPrevious = function()
    {
        self.playTrack(self.getPrevious());
    };
    
    this.getCurrent = function()
    {
        var current = $('#tracklist-panel li.active');
        return current;
    };
    
    this.getNext = function()
    {
        // Get current track.
        var current = self.getCurrent();
        
        if(!current)
            return null;
            
        // Get the next track on the list.
        var next = current.next();
    
        if(next.length === 0)
        {
            var list = $('#tracklist-panel .list-group');
            next = list.children(":first");
        }
        
        return next;
    };
    
    this.getPrevious = function()
    {
        // Get current track.
        var current = self.getCurrent();
        
        if(!current)
            return null;
            
        // Get the previous track on the list.
        var previous = current.prev();
    
        if(previous.length === 0)
        {
            var list = $('#tracklist-panel .list-group');
            previous = list.children(":last");
        }
        
        return previous;
    };
    
    this.onEnded = function()
    {
        // Play next track.
        self.playTrack(self.getNext());
    };
};
