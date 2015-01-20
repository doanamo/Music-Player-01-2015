module.exports = new function()
{
    var self = this;
    
    var configFile = "config.json";
    var playlistFile = "playlists.json";
    
    this.initialize = function()
    {
        // Create user directory.
        fs.mkdir(getUserDir(), function(error)
        {
            // Ignore if directory already exists.
            if(error && error.code !== 'EEXIST')
                throw error;
        });
    
        // Load state.
        self.load();
    };
    
    this.save = function()
    {
        self.saveConfig();
        self.savePlaylist();
    };
    
    this.load = function()
    {
        self.loadConfig();
        self.loadPlaylist();
    };
    
    this.saveConfig = function()
    {
        // Create table.
        var table = {};
        table.volume = audio.getVolume();
        
        // Write to file.
        fs.writeFileSync(getUserDir() + configFile, JSON.stringify(table, undefined, 4));
    };
    
    this.loadConfig = function()
    {
        // Load the file.
        var data = null;
        
        try
        {
            data = fs.readFileSync(getUserDir() + configFile, 'utf8');
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
        audio.setVolume(table.volume);
    };
    
    this.savePlaylist = function()
    {
        // Create table for playlist to be stored.
        var table = [];
        
        $('#playlist-panel ul').children().each(function(i)
        {
            var playlist = {};
            
            // Get tracklist object.
            var tracklist = $(this).data('tracklist');
            
            // Write playlist info.
            playlist.name = $(this).children().text();
            playlist.scroll = $(tracklist.element).scrollTop();
            
            // Write playlist tracks.
            playlist.tracks = [];

            $(tracklist.element).children().each(function(i)
            {
                playlist.tracks[i] = $(this).data('filepath');
            });
            
            // Add playlist to table.
            table[i] = playlist;
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
            
            // Set tracklist scroll.
            $(tracklist.element).scrollTop(table[p].scroll);
        }
    };
};
