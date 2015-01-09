module.exports = new function()
{
    var self = this;
    var menu = null;
    
    this.initialize = function()
    {
        // Handle dropped files on track list.
        $('#tracklist-panel').on('drop', function(event)
        {
            var files = event.originalEvent.dataTransfer.files;
        
            // Add dropped track files.
            for(var i = 0; i < files.length; ++i)
            {
                self.addTrack(files[i].path);
            }
        });
        
        // Create track context menu.
        self.menu = new nw.gui.Menu();
        
        self.menu.append(new nw.gui.MenuItem(
        {
            label: 'Play',
            click: function()
            {
                var selected = $('#tracklist-panel .selected');
                self.playTrack(selected.first());
            }
        }));
        
        self.menu.append(new nw.gui.MenuItem(
        {
            label: 'Queue',
            enabled: false,
            click: function()
            {
            },
        }));
        
        self.menu.append(new nw.gui.MenuItem(
        {
            type: 'separator'
        }));
        
        self.menu.append(new nw.gui.MenuItem(
        {
            label: 'Delete',
            click: function()
            {
                var selected = $('#tracklist-panel .selected');
                self.removeTrack(selected);
            },
        }));
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
            
            // Remove text selection.
            window.getSelection().removeAllRanges();
        });
        
        element.click(function(event)
        {
            // Select element.
            self.selectTrack(this, event.ctrlKey);
            
            // Remove text selection if using multipl/range selection.
            if(event.ctrlKey)
            {
                window.getSelection().removeAllRanges();
            }
        });
        
        element.on('contextmenu', function(event)
        {
            // Select track if not selected.
            if(!$(this).hasClass('selected'))
            {
                self.selectTrack(this);
            }
        
            // Open context menu.
            self.menu.popup(event.pageX, event.pageY);
        });
        
        // Add element to the list.
        $('#tracklist-panel ul').append(element);
        
        // Prevent cyclic reference.
        element = null;
    };
    
    this.removeTrack = function(element)
    {
        if(!element)
            return;
        
        // Remove track from the list.
        $(element).remove();
    };
    
    this.selectTrack = function(track, add)
    {
        if(!track)
            return;
            
        add = defaultArgument(add, false);
    
        // Set selected state.
        if(!add)
        {
            // Remove all selection if we don't want to add.
            $(track).siblings().removeClass('selected');
        }
        
        $(track).toggleClass('selected');
        
        // Set cursor position.
        $(track).siblings().removeClass('cursor');
        $(track).addClass('cursor');
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
