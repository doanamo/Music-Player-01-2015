module.exports = new function()
{
    var self = this;
    
    this.initialize = function()
    {
        for(var i = 0; i < 4; ++i)
        {
            self.createList("Playlist " + i);
        }
    };
    
    this.createList = function(name)
    {
        // Create list element.
        var element = $('<li>');
        element.addClass('list-group-item');
        element.append($('<div>').text(name));
        
        element.click(function(event)
        {
            self.setCurrentList(this);
        });
        
        // Add element to the list.
        $('#playlist-panel .list-group').append(element);
        
        // Prevent cyclic reference.
        element = null;
    };
    
    this.setCurrentList = function(element)
    {
        $(element).siblings().removeClass('active');
        $(element).addClass('active');
    };
};
