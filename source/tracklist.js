var Tracklist = function ()
{
    this.element = null;
    this.trackMenu = null;
};

Tracklist.prototype.initialize = function()
{
    var self = this;

    // Create track list element.
    this.element = $('<ul>');
    this.element.addClass('list-group');
    
    // Handle dropped files on track list.
    this.element.on('drop', function(event)
    {
        var files = event.originalEvent.dataTransfer.files;
    
        // Add dropped track files.
        for(var i = 0; i < files.length; ++i)
        {
            self.addTrack(files[i].path);
        }
    });
    
    // Make sure cursor is set when focused.
    $('#tracklist-panel').focus(function()
    {
        var cursor = $(this.element).find('li.cursor');
        
        if(cursor.length === 0)
        {
            $(self.element).find('li:first-child').addClass('cursor');
        }
    });
    
    // Append element to the tracklist panel.
    $('#tracklist-panel').append(this.element);
   
    // Create track context menu.
    this.trackMenu = new nw.gui.Menu();
    
    this.trackMenu.append(new nw.gui.MenuItem(
    {
        label: 'Play',
        click: function()
        {
            var selected = $(self.element).find('li.selected');
            self.playTrack(selected.first());
        }
    }));
    
    this.trackMenu.append(new nw.gui.MenuItem(
    {
        label: 'Queue',
        enabled: false,
        click: function()
        {
        },
    }));
    
    this.trackMenu.append(new nw.gui.MenuItem(
    {
        type: 'separator'
    }));
    
    this.trackMenu.append(new nw.gui.MenuItem(
    {
        label: 'Delete',
        click: function()
        {
            var selected = $(self.element).find('li.selected');
            self.removeTrack(selected);
        },
    }));
};

Tracklist.prototype.cleanup = function()
{
    // Remove track list.
    this.element.remove();
};

Tracklist.prototype.addTrack = function(filepath)
{
    var self = this;

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
        self.trackMenu.popup(event.pageX, event.pageY);
    });
    
    // Add element to the list.
    $(this.element).append(element);
    
    // Prevent cyclic reference.
    element = null;
};

Tracklist.prototype.removeTrack = function(element)
{
    if(!element)
        return;
    
    // Remove track from the list.
    $(element).remove();
};

Tracklist.prototype.selectAllTracks = function()
{
    $(this.element).find('li').addClass('selected');
};

Tracklist.prototype.selectTrack = function(element, add, range)
{
    if(!element)
        return;
        
    add = defaultArgument(add, false);
    range = defaultArgument(range, false);
    
    if(add && range)
    {
        add = false;
        range = false;
    }

    // Perform selection.
    if(range)
    {
        // Clear selection.
        $(element).siblings().removeClass('selected');
    
        // Create a range between cursor and this.
        var cursor = $(this.element).find('li.cursor');
        
        if(cursor)
        {
            var selected = null;
        
            if($(cursor).index() < $(element).index())
            {
                selected = $(cursor).nextUntil(element).andSelf().add(element);
            }
            else
            {
                selected = $(cursor).prevUntil(element).andSelf().add(element);
            }
            
            $(selected).addClass('selected');
        }
        else
        {
            // No cursor, select track.
            $(element).toggleClass('selected');
        }
    }
    else if(add)
    {
        // Add to selection.
        $(element).toggleClass('selected');
    }
    else
    {
        // If there are multiple selections clear itself along with siblings.
        if($(this.element).find('li.selected').length > 1)
        {
            $(element).removeClass('selected');
        }
        
        // Clear other selections.
        $(element).siblings().removeClass('selected');
        
        // Toggle track selection.
        $(element).toggleClass('selected');
    }
    
    // Set cursor position.
    if(!range)
    {
        $(element).siblings().removeClass('cursor');
        $(element).addClass('cursor');
    }
};

Tracklist.prototype.clearActiveTrack = function()
{
    $(this.element).find('li').removeClass('active');
};

Tracklist.prototype.playTrack = function(element)
{
    if(!element)
    {
        this.clearActiveTrack();
        audio.stop();
        return;
    }
        
    // Load track list element.
    audio.load($(element).data('filepath'));
    
    // Set track style as currently playing.
    $(element).siblings().removeClass('active');
    $(element).addClass('active');
};

Tracklist.prototype.playNextTrack = function()
{
    this.playTrack(this.getNextTrack());
};

Tracklist.prototype.playPreviousTrack = function()
{
    this.playTrack(this.getPreviousTrack());
};

Tracklist.prototype.getCurrentTrack = function()
{
    return $(this.element).find('li.active');
};

Tracklist.prototype.getNextTrack = function()
{
    // Get current track.
    var current = self.getCurrentTrack();
    
    if(!current)
        return null;
        
    // Get the next track on the list.
    var next = current.next();

    if(next.length === 0)
    {
        next = $(this.element).children(":first");
    }
    
    return next;
};

Tracklist.prototype.getPreviousTrack = function()
{
    // Get current track.
    var current = self.getCurrentTrack();
    
    if(!current)
        return null;
        
    // Get the previous track on the list.
    var previous = current.prev();

    if(previous.length === 0)
    {
        previous = $(this.element).children(":last");
    }
    
    return previous;
};

module.exports = Tracklist;
