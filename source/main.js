var gui = require('nw.gui');
var window = gui.Window.get();

var main = function()
{
    $('#window-close').click(function()
    {
        window.close();
    });
};

$(document).ready(main);
