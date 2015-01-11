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
            self.createList("Playlist " + i);
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
                self.createList("New Playlist");
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
                self.createList("New Playlist");
            }
        }));
        
        self.listMenu.append(new nw.gui.MenuItem(
        {
            label: 'Delete',
            click: function()
            {
                var selected = $('#playlist-panel .selected');
                self.deleteList(selected);
            },
        }));
    };
    
    this.createList = function(name)
    {
        // Create list element.
        var element = $('<li>');
        element.addClass('list-group-item');
        element.append($('<div>').text(name));
        
        // Create a tracklist object.
        var tracklist = new Tracklist();
        tracklist.initialize();
        
        for(var i = 1; i <= 20; ++i)
        {
            tracklist.addTrack("Test " + i);
        }
        
        element.data('tracklist', tracklist);
        
        // Set element handlers.
        element.click(function(event)
        {
            self.switchList(this);
        });
        
        element.on('contextmenu', function(event)
        {
            // Select list if not selected.
            if(!$(this).hasClass('selected'))
            {
                self.selectList(this);
            }
            
            // Open context menu.
            self.listMenu.popup(event.pageX, event.pageY);
            
            // Prevent parent context menu from firing.
            return false;
        });
        
        // Add element to the list.
        $('#playlist-panel .list-group').append(element);
        
        // Prevent cyclic reference.
        element = null;
        tracklist = null;
    };
    
    this.onKeyDown = function(event)
    {
        // Select all tracks on playlist.
        if(event.ctrlKey && event.which === 'A'.charCodeAt(0))
        {
            // Stop from selecting all text on the page.
            event.preventDefault();
            
            // Select all tracks on the current playlist.
            // TODO!
        }
    };
    
    this.deleteList = function(element)
    {
        // Call tracklist cleanup method.
        $(element).data('tracklist').cleanup();
    
        // Remove element.
        $(element).remove();
    };
    
    this.selectList = function(element)
    {
        if(!element)
            return;
            
        // Clear other selections.
        $(element).siblings().removeClass('selected');
        
        // Toggle element selection.
        $(element).toggleClass('selected');
    };
    
    this.switchList = function(element)
    {
        $(element).siblings().removeClass('active');
        $(element).addClass('active');
    };
};
