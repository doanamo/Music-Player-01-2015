var Tracklist = require('./tracklist.js');

module.exports = new function()
{
    var self = this;
    
    this.panelMenu = null;
    this.listMenu = null;
    
    this.initialize = function()
    {
        for(var i = 0; i < 4; ++i)
        {
            self.createPlaylist("Playlist " + i);
        }
        
        // Open context menu on right click.
        $('#playlist-panel').on('contextmenu', function(event)
        {
            self.panelMenu.popup(event.pageX, event.pageY);
        });
        
        // Create panel context menu.
        self.panelMenu = new nw.gui.Menu();
        
        self.panelMenu.append(new nw.gui.MenuItem(
        {
            label: 'Create',
            click: function()
            {
                self.createPlaylist("New Playlist");
            }
        }));
        
        self.panelMenu.append(new nw.gui.MenuItem(
        {
            label: 'Delete',
            enabled: false
        }));
        
        // Create list context menu.
        self.listMenu = new nw.gui.Menu();

        self.listMenu.append(new nw.gui.MenuItem(
        {
            label: 'Create',
            click: function()
            {
                var selected = $('#playlist-panel .selected');
                self.createPlaylist("New Playlist", selected);
            }
        }));
        
        self.listMenu.append(new nw.gui.MenuItem(
        {
            label: 'Delete',
            click: function()
            {
                var selected = $('#playlist-panel .selected');
                self.deletePlaylist(selected);
            },
        }));
    };
    
    this.onKeyDown = function(event)
    {
        // Select all tracks on playlist.
        if(event.ctrlKey && event.which === 'A'.charCodeAt(0))
        {
            // Stop from selecting all text on the page.
            event.preventDefault();
            
            // Select all tracks on the current playlist.
            var playlist = self.getCurrentPlaylist();
            
            if(playlist.length !== 0)
            {
                playlist.data('tracklist').selectAllTracks();
            }
        }
    };
    
    this.createPlaylist = function(name, after)
    {
        // Create list element.
        var element = $('<li>');
        element.addClass('list-group-item');
        element.append($('<div>').text(name));
        
        // Create a tracklist object.
        var tracklist = new Tracklist();
        tracklist.initialize();
        
        for(var i = 1; i <= Math.random() * 20 + 1; ++i)
        {
            tracklist.addTrack("Test " + i);
        }
        
        element.data('tracklist', tracklist);
        
        // Set element handlers.
        element.click(function(event)
        {
            self.switchPlaylist(this);
        });
        
        element.on('contextmenu', function(event)
        {
            // Select track if not selected.
            if(!$(this).hasClass('selected'))
            {
                self.selectPlaylist(this);
            }
        
            // Open context menu.
            self.listMenu.popup(event.pageX, event.pageY);
            
            // Prevent parent context menu from firing.
            return false;
        });
        
        // Add element to the list.
        if(after)
        {
            // Place after specified element.
            $(element).insertAfter(after);
        }
        else
        {
            // Place at the end.
            $('#playlist-panel .list-group').append(element);
        }
        
        // Prevent cyclic reference.
        element = null;
        tracklist = null;
    };
    
    this.deletePlaylist = function(element)
    {
        // Call tracklist cleanup method.
        $(element).data('tracklist').cleanup();
    
        // Remove element.
        $(element).remove();
    };
    
    this.switchPlaylist = function(element)
    {
        // Show the playlist we want.
        var tracklist = $(element).data('tracklist');
        $(tracklist.element).siblings().addClass('hidden');
        $(tracklist.element).removeClass('hidden');
    
        // Change playlist element style.
        $(element).siblings().removeClass('active');
        $(element).addClass('active');
    };
    
    this.selectPlaylist = function(element)
    {
        $(element).siblings().removeClass('selected');
        $(element).addClass('selected');
    };
    
    this.getCurrentPlaylist = function()
    {
        return $('#playlist-panel li.active');
    };
};
