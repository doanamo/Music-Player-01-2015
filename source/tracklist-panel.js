module.exports = new function()
{
    var self = this;
    
    this.initialize = function()
    {
        $('#tracklist-panel').on('drop', function(event)
        {
            var file = event.originalEvent.dataTransfer.files[0];
        
            // Add dropped track file.
            self.addTrack(file);
        });
    };
    
    this.addTrack = function(file)
    {
        // Get file name without extension.
        var name = file.name.replace(/\.[^/.]+$/, "");
        
        // Add track to the list.
        $('#tracklist-elements').append('<li class="list-group-item">' + name + '</li>');
    };
};
