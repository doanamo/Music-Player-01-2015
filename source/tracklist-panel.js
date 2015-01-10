module.exports = new function()
{
    var self = this;
    this.menu = null;
    this.userFile = "tracklist.json";
    
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
        
        // Load track list state.
        self.load();
    };
    
    this.save = function()
    {
        // Create table of track list elements.
        var table = [];
        
        $('#tracklist-panel .list-group').children().each(function(i)
        {
            var filepath = $(this).data('filepath');
            filepath = filepath.replace(/\\/g, "/");
            
            table[i] = filepath;
        });
        
        // Create user directory.
        fs.mkdir(getUserDir(), function(error)
        {
            // Ignore if directory already exists.
            if(error && error.code !== 'EEXIST')
                throw error;
        });
        
        // Write to file.
        fs.writeFileSync(getUserDir() + self.userFile, JSON.stringify(table, undefined, 2));
    };
    
    this.load = function()
    {
        // Load the file.
        var data = null;
        
        try
        {
            data = fs.readFileSync(getUserDir() + self.userFile, 'utf8');
        }
        catch(error)
        {
            if(error.code !== 'ENOENT')
                throw error;
                
            return;
        }
        
        // Parse file data.
        var table = null;
        
        try
        {
            table = JSON.parse(data);
        }
        catch(error)
        {
            // Delete corrupted file.
            fs.unlinkSync(getUserDir() + self.userFile);
            
            return;
        }
        
        // Add elements back to track list.
        for(var i = 0; i < table.length; ++i)
        {
            self.addTrack(table[i]);
        }
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
            // Select track element.
            self.selectTrack(this, event.ctrlKey, event.shiftKey);
            
            // Remove text selection if using multiple/range selection.
            if(event.ctrlKey || event.shiftKey)
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
    
    this.selectAllTracks = function()
    {
        $('#tracklist-panel li').addClass('selected');
    };
    
    this.selectTrack = function(track, add, range)
    {
        if(!track)
            return;
            
        add = defaultArgument(add, false);
        range = defaultArgument(range, false);
    
        // Perform selection.
        if(range)
        {
            // Clear selection.
            $(track).siblings().removeClass('selected');
        
            // Create a range between cursor and this.
            var cursor = $('#tracklist-panel li.cursor');
            
            if(cursor)
            {
                var selected = null;
            
                if($(cursor).index() < $(track).index())
                {
                    selected = $(cursor).nextUntil(track).andSelf().add(track);
                }
                else
                {
                    selected = $(cursor).prevUntil(track).andSelf().add(track);
                }
                
                $(selected).addClass('selected');
            }
            else
            {
                // No cursor, select track.
                $(track).toggleClass('selected');
            }
        }
        else if(add)
        {
            // Add to selection.
            $(track).toggleClass('selected');
        }
        else
        {
            // If there are multiple selections, 
            // clear itself along with siblings.
            if($('#tracklist-panel li.selected').length > 1)
            {
                $(track).removeClass('selected');
            }
            
            // Clear other selections.
            $(track).siblings().removeClass('selected');
            
            // Toggle track selection.
            $(track).toggleClass('selected');
        }
        
        // Set cursor position.
        $(track).siblings().removeClass('cursor');
        $(track).toggleClass('cursor');
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
        return $('#tracklist-panel li.active');
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
