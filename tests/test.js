/*
  html2canvas @VERSION@ <http://html2canvas.hertzen.com>
  Copyright (c) 2011 Niklas von Hertzen. All rights reserved.
  http://www.twitter.com/niklasvh

  Released under MIT License
*/
var h2cSelector, h2cOptions;
(function(document, window) {
    var srcStart = '<script type="text/javascript" src="', scrEnd = '"></script>';

    document.write(srcStart + '/tests/assets/jquery-1.6.2.js' + scrEnd);
    document.write(srcStart + '/tests/assets/jquery.plugin.html2canvas.js' + scrEnd);
    var html2canvas = ['log', 'nodecontainer', 'stackingcontext', 'textcontainer', 'support', 'imagecontainer', 'dummyimagecontainer', 'proxyimagecontainer', 'gradientcontainer', 'lineargradientcontainer', 'webkitgradientcontainer',
        'imageloader', 'nodeparser', 'font', 'fontmetrics', 'core', 'renderer', 'promise', 'renderers/canvas'], i;
    if (window.location.search === "?selenium") {
        document.write(srcStart + '/build/html2canvas.js' + scrEnd);
    } else {
        for (i = 0; i < html2canvas.length; ++i) {
            document.write(srcStart + '/src/' + html2canvas[i] + '.js?' + Math.random() + scrEnd);
        }
    }

    window.onload = function() {
        h2cSelector = [document.documentElement];

        if (window.setUp) {
            window.setUp();
        }

        setTimeout(function() {

            $(h2cSelector).html2canvas($.extend({
                flashcanvas: "../external/flashcanvas.min.js",
                logging: true,
                profile: true,
                proxy: "http://html2canvas.appspot.com/query",
                useCORS: false
            }, h2cOptions));
        }, 100);
    };
}(document, window));
