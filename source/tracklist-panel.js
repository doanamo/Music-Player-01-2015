module.exports = new function()
{
    var self = this;
    
    this.initialize = function()
    {
        $('#tracklist-panel').on('drop', function(event)
        {
            var file = event.originalEvent.dataTransfer.files[0];
        
            // Add dropped track file.
            self.addTrack(file.path);
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
