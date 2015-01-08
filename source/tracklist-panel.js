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
        element.addClass('tracklist-entry');
        element.data('filepath', filepath);
        element.append($('<div>').text(name));
        
        element.dblclick(function(event)
        {
            // Load track list element.
            audio.load($(this).data('filepath'));
            
            // Set track style as currently playing.
            $(this).siblings().removeClass('active');
            $(this).addClass('active');
            
            // Remove selection.
            window.getSelection().removeAllRanges();
        });
        
        // Add element to the list.
        $('#tracklist-panel ul').append(element);
        
        // Prevent cyclic reference.
        element = null;
    };
};
