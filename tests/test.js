var h2cSelector, h2cOptions;
var CI = window.location.search.indexOf('selenium') !== -1;
var AUTORUN = window.location.search.indexOf('run=false') === -1;
var REFTEST = window.location.search.indexOf('reftest') !== -1;

(function(document, window) {
    function appendScript(src) {
        document.write(
            '<script type="text/javascript" src="' +
                window.location.protocol +
                '//' +
                window.location.host +
                src +
                '.js?' +
                Math.random() +
                '"></script>'
        );
    }

    (typeof Promise === 'undefined' ? ['/node_modules/promise-polyfill/promise.min'] : [])
        .concat([
            '/node_modules/jquery/dist/jquery.min',
            '/dist/html2canvas',
            '/dist/RefTestRenderer'
        ])
        .forEach(appendScript);

    window.onload = function() {
        var targets = REFTEST
            ? [new html2canvas.CanvasRenderer(), new RefTestRenderer()]
            : new html2canvas.CanvasRenderer();
        (function($) {
            $.fn.html2canvas = function(options) {
                var date = new Date(),
                    $message = null,
                    timeoutTimer = false,
                    timer = date.getTime();
                options = options || {};
                var promise = html2canvas(this[0], options);
                promise['catch'](function(err) {
                    console.log('html2canvas threw an error', err);
                });

                promise.then(function(output) {
                    var canvas = Array.isArray(targets) ? output[0] : output;
                    if (Array.isArray(targets)) {
                        console.log(
                            output[1]
                                .split('\n')
                                .map(function(line, i) {
                                    return i + 1 + ':' + line;
                                })
                                .join('\n')
                        );
                    }
                    var $canvas = $(canvas),
                        finishTime = new Date();

                    $canvas
                        .addClass('html2canvas')
                        .css({
                            position: 'absolute',
                            left: 0,
                            top: 0
                        })
                        .appendTo(document.body);
                    if (!CI) {
                        $canvas.siblings().toggle();
                        $(window).click(function(event) {
                            if (event.button === 0) {
                                var scrollTop = $(window).scrollTop();
                                $canvas.toggle().siblings().toggle();
                                $(document.documentElement).css(
                                    'background',
                                    $canvas.is(':visible') ? 'none' : ''
                                );
                                $(document.body).css(
                                    'background',
                                    $canvas.is(':visible') ? 'none' : ''
                                );
                                throwMessage(
                                    'Canvas Render ' +
                                        ($canvas.is(':visible') ? 'visible' : 'hidden')
                                );
                                $(window).scrollTop(scrollTop);
                            }
                        });
                        $(document.documentElement).css(
                            'background',
                            $canvas.is(':visible') ? 'none' : ''
                        );
                        $(document.body).css('background', $canvas.is(':visible') ? 'none' : '');
                        throwMessage(
                            'Screenshot created in ' + (finishTime.getTime() - timer) + ' ms<br />',
                            4000
                        );
                    } else {
                        $canvas.css('display', 'none');
                    }
                    // test if canvas is read-able
                    try {
                        $canvas[0].toDataURL();
                    } catch (e) {
                        if ($canvas[0].nodeName.toLowerCase() === 'canvas') {
                            // TODO, maybe add a bit less offensive way to present this, but still something that can easily be noticed
                            window.alert('Canvas is tainted, unable to read data');
                        }
                    }
                });

                function throwMessage(msg, duration) {
                    window.clearTimeout(timeoutTimer);
                    timeoutTimer = window.setTimeout(function() {
                        $message.fadeOut(function() {
                            $message.remove();
                            $message = null;
                        });
                    }, duration || 2000);
                    if ($message) $message.remove();
                    $message = $('<div />')
                        .html(msg)
                        .css({
                            margin: 0,
                            padding: 10,
                            background: '#000',
                            opacity: 0.7,
                            position: 'fixed',
                            top: 10,
                            right: 10,
                            fontFamily: 'Tahoma',
                            color: '#fff',
                            fontSize: 12,
                            borderRadius: 12,
                            width: 'auto',
                            height: 'auto',
                            textAlign: 'center',
                            textDecoration: 'none',
                            display: 'none'
                        })
                        .appendTo(document.body)
                        .fadeIn();
                }
            };
        })(jQuery);

        h2cSelector = typeof h2cSelector === 'undefined' ? [document.documentElement] : h2cSelector;

        if (window.setUp) {
            window.setUp();
        }

        window.run = function() {
            $(h2cSelector).html2canvas(
                $.extend(
                    {
                        logging: true,
                        proxy: 'http://localhost:8081/proxy',
                        useCORS: false,
                        removeContainer: false,
                        target: targets
                    },
                    h2cOptions,
                    REFTEST ? {windowWidth: 800, windowHeight: 600} : {}
                )
            );
        };

        if (typeof dontRun === 'undefined' && AUTORUN) {
            setTimeout(window.run, 100);
        }
    };
})(document, window);
