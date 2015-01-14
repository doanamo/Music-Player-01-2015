module.exports = new function()
{
    var self = this;
    
    var playlistFile = "playlists.json";
    
    this.initialize = function()
    {
        self.load();
    };
    
    this.save = function()
    {
        self.savePlaylist();
    };
    
    this.load = function()
    {
        self.loadPlaylist();
    };
    
    this.savePlaylist = function()
    {
        // Create table for playlist to be stored.
        var table = [];
        
        $('#playlist-panel .list-group').children().each(function(i)
        {
            var playlist = {};
            
            // Write playlist name,
            playlist.name = $(this).children().text();
            
            // Write playlist tracks.
            playlist.tracks = [];
            
            var tracklist = $(this).data('tracklist').element;
            
            $(tracklist).children().each(function(i)
            {
                playlist.tracks[i] = $(this).data('filepath');
            });
            
            // Add playlist to table.
            table[i] = playlist;
        });
        
        // Create user directory.
        fs.mkdir(getUserDir(), function(error)
        {
            // Ignore if directory already exists.
            if(error && error.code !== 'EEXIST')
                throw error;
        });
        
        // Write to file.
        fs.writeFileSync(getUserDir() + playlistFile, JSON.stringify(table, undefined, 4));
    };
    
    this.loadPlaylist = function()
    {
        // Load the file.
        var data = null;
        
        try
        {
            data = fs.readFileSync(getUserDir() + playlistFile, 'utf8');
        }
        catch(error)
        {
            if(error.code !== 'ENOENT')
                throw error;
                
            return;
        }
        
        // Parse file.
        var table = null;
        
        try
        {
            table = JSON.parse(data);
        }
        catch(error)
        {
            throw error;
            return;
        }
        
        // Deserialize data.
        for(var p = 0; p < table.length; ++p)
        {
            // Create playlist.
            var playlist = ui.playlistPanel.createPlaylist(table[p].name);
            
            // Add tracks to the playlist.
            var tracklist = playlist.data('tracklist');
            
            for(var t = 0; t < table[p].tracks.length; ++t)
            {
                tracklist.addTrack(table[p].tracks[t]);
            }
        }
    };
};
