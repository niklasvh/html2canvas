/*
  html2canvas @VERSION@ <http://html2canvas.hertzen.com>
  Copyright (c) 2011 Niklas von Hertzen. All rights reserved.
  http://www.twitter.com/niklasvh

  Released under MIT License
*/
var h2cSelector, h2cOptions;
(function(document, window) {
    function appendScript(src) {
        document.write('<script type="text/javascript" src="' + src + '.js?' + Math.random() + '"></script>');
    }

    var sources = ['log', 'punycode/punycode', 'core', 'nodecontainer', 'pseudoelementcontainer', 'stackingcontext', 'textcontainer', 'support', 'imagecontainer', 'dummyimagecontainer', 'proxyimagecontainer', 'gradientcontainer',
        'lineargradientcontainer', 'webkitgradientcontainer', 'svgcontainer', 'svgnodecontainer', 'imageloader', 'nodeparser', 'font', 'fontmetrics', 'renderer', 'promise', 'xhr', 'framecontainer', 'proxy', 'color', 'renderers/canvas'];

    ['/tests/assets/jquery-1.6.2'].concat(window.location.search === "?selenium" ? ['/dist/html2canvas'] : sources.map(function(src) { return '/src/' + src; })).forEach(appendScript);

    if (typeof(noFabric) === "undefined") {
        appendScript('/dist/html2canvas.svg');
    }

    window.onload = function() {
        (function( $ ){
            $.fn.html2canvas = function(options) {
                if (options && options.profile && window.console && window.console.profile && window.location.search !== "?selenium2") {
                    window.console.profile();
                }
                var date = new Date(),
                    $message = null,
                    timeoutTimer = false,
                    timer = date.getTime();
                options = options || {};

                var promise = html2canvas(this, options);
                promise['catch'](function(err) {
                    console.log("html2canvas threw an error", err);
                });

                promise.then(function(canvas) {
                    var $canvas = $(canvas),
                        finishTime = new Date();

                    if (options && options.profile && window.console && window.console.profileEnd) {
                        window.console.profileEnd();
                    }
                    $canvas.addClass("html2canvas")
                        .css({
                            position: 'absolute',
                            left: 0,
                            top: 0
                        }).appendTo(document.body);

                    if (window.location.search !== "?selenium") {
                        $canvas.siblings().toggle();
                        $(window).click(function(){
                            $canvas.toggle().siblings().toggle();
                            $(document.documentElement).css('background', $canvas.is(':visible') ? "none" : "");
                            $(document.body).css('background', $canvas.is(':visible') ? "none" : "");
                            throwMessage("Canvas Render " + ($canvas.is(':visible') ? "visible" : "hidden"));
                        });
                        $(document.documentElement).css('background', $canvas.is(':visible') ? "none" : "");
                        $(document.body).css('background', $canvas.is(':visible') ? "none" : "");
                        throwMessage('Screenshot created in '+ ((finishTime.getTime()-timer)) + " ms<br />",4000);
                    } else {
                        $canvas.css('display', 'none');
                    }
                    // test if canvas is read-able
                    try {
                        $canvas[0].toDataURL();
                    } catch(e) {
                        if ($canvas[0].nodeName.toLowerCase() === "canvas") {
                            // TODO, maybe add a bit less offensive way to present this, but still something that can easily be noticed
                            window.alert("Canvas is tainted, unable to read data");
                        }
                    }
                });

                function throwMessage(msg,duration){
                    window.clearTimeout(timeoutTimer);
                    timeoutTimer = window.setTimeout(function(){
                        $message.fadeOut(function(){
                            $message.remove();
                            $message = null;
                        });
                    },duration || 2000);
                    if ($message)
                        $message.remove();
                    $message = $('<div />').html(msg).css({
                        margin:0,
                        padding:10,
                        background: "#000",
                        opacity:0.7,
                        position:"fixed",
                        top:10,
                        right:10,
                        fontFamily: 'Tahoma',
                        color:'#fff',
                        fontSize:12,
                        borderRadius:12,
                        width:'auto',
                        height:'auto',
                        textAlign:'center',
                        textDecoration:'none',
                        display:'none'
                    }).appendTo(document.body).fadeIn();
                    log(msg);
                }
            };
        })(jQuery);

        h2cSelector = [document.documentElement];

        if (window.setUp) {
            window.setUp();
        }

        window.run = function() {
            $(h2cSelector).html2canvas($.extend({
                logging: true,
                profile: true,
                proxy: "http://localhost:8082",
                useCORS: false,
                removeContainer: false
            }, h2cOptions));
        };

        if (typeof(dontRun) === "undefined") {
            setTimeout(window.run, 100);
        }
    };
}(document, window));
