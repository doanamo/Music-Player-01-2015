module.exports = new function()
{
    var self = this;
    
    this.initialize = function()
    {
        for(var i = 0; i < 4; ++i)
        {
            var element = $('<li>');
            element.addClass('list-group-item');
            element.append($('<div>').text("Playlist " + i));
            
            $('#playlist-panel .list-group').append(element);
        }
    };
};
