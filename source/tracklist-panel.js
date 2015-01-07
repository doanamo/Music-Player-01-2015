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
        element.text(name);
        
        element.click(function(event)
        {
            audio.load($(this).data('filepath'));
        });
        
        // Add element to the list.
        $('#tracklist-elements').append(element);
    };
};
