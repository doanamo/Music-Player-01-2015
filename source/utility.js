Math.clamp = function(value, min, max)
{
    return Math.min(Math.max(value, min), max);
};

global.defaultArgument = function(argument, value)
{
    return typeof argument !== 'undefined' ? argument : value;
}

global.getWorkingDir = function()
{
    var path = null;
    
    if(path === null)
    {
        path = __dirname.replace(/\\/g, "/").replace(/(\/source)/, "") + "/";
    }

    return path;
}

global.getUserDir = function()
{
    var path = null;
    
    if(path === null)
    {
        path = getWorkingDir() + "user/";
    }
    
    return path;
}
