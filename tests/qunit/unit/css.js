module("CSS");
$(function() {
    var propsToTest = {},
        numDivs = {};

    propsToTest['border-width'] = ["borderTopWidth", "borderRightWidth", "borderBottomWidth", "borderLeftWidth"],
        numDivs['border-width'] = $('#borders div').length;
    test('border-width', propsToTest['border-width'].length * numDivs['border-width'], function() {
        $('#borders div').each(function(i, node) {
            $.each(propsToTest['border-width'], function(s, prop) {
                var expect = $(node).css(prop);
                // older IE's don't necessarily return px even with jQuery
                if (expect === "thin") {
                    expect = "1px";
                } else if (expect === "medium") {
                    expect = "3px";
                } else if (expect === "thick") {
                    expect = "5px";
                }
                var container = new NodeContainer(node, null);
                QUnit.equal(container.css(prop), expect, "div #" + (i + 1) + " property " + prop + " equals " + expect );
            });
        });
    });

    propsToTest['padding width'] = ["paddingTop", "paddingRight", "paddingBottom", "paddingLeft"];
    numDivs['padding width'] = $('#padding div').length;

    test('padding width', propsToTest['padding width'].length * numDivs['padding width'] * 2, function() {
        $('#padding div').each(function(i, node) {
            $.each(propsToTest['padding width'], function(s, prop) {
                var container = new NodeContainer(node, null);
                var isPx = container.css(prop).indexOf("px");
                QUnit.notEqual(isPx, -1, "div #" + (i + 1) + " property " + prop + " is in pixels");
                QUnit.equal(container.css(prop), $(node).css(prop), "div #" + (i + 1) + " property " + prop + " equals " + $(node).css(prop));
            });
        });
    });

    propsToTest['background-position'] = ["backgroundPosition"];
    numDivs['background-position'] = $('#backgroundPosition div').length;

    test('background-position', propsToTest['background-position'].length * numDivs['background-position'] * 2, function() {
        $('#backgroundPosition div').each(function(i, node) {
            $.each(propsToTest['background-position'], function(s, prop) {
                var img =  new Image();
                img.width = 50;
                img.height = 50;

                var container = new NodeContainer(node, null);
                var item = container.css(prop),
                    backgroundPosition = container.parseBackgroundPosition(getBounds(node), img),
                    split = (window.getComputedStyle) ? $(node).css(prop).split(" ") : [$(node).css(prop+"X"), $(node).css(prop+"Y")];

                var testEl = $('<div />').css({
                    'position': 'absolute',
                    'left': split[0],
                    'top': split[1]
                });

                testEl.appendTo(node);

                QUnit.equal(backgroundPosition.left, Math.round(parseFloat(testEl.css('left'))), "div #" + (i + 1) + " background-position-x equals " + backgroundPosition.left + " from " + item);
                QUnit.equal(backgroundPosition.top, Math.round(parseFloat(testEl.css('top'))), "div #" + (i + 1) + " background-position-y equals " + backgroundPosition.top);
                testEl.remove();
            });
        });
    });

    test('text-shadow', function() {
        $('#textShadows div').each(function(i, node) {
            var index = i + 1;
            var container = new NodeContainer(node, null);
            var shadows = container.parseTextShadows();
            if (i === 0) {
                QUnit.equal(shadows.length, 0, 'div #' + index);
            } else {
                QUnit.equal(shadows.length, (i >= 6 ? 2 : 1), 'div #' + index);
                QUnit.equal(shadows[0].offsetX, i, 'div #' + index + ' offsetX');
                QUnit.equal(shadows[0].offsetY, i, 'div #' + index + ' offsetY');
                if (i < 2) {
                    QUnit.equal(shadows[0].color, 'rgba(0, 0, 0, 0)', 'div #' + index + ' color');
                } else if (i % 2 === 0) {
                    QUnit.equal(shadows[0].color, 'rgb(2, 2, 2)', 'div #' + index + ' color');
                } else {
                    var opacity = '0.199219';
                    QUnit.equal(shadows[0].color, 'rgba(2, 2, 2, '+opacity+')', 'div #' + index + ' color');
                }

                // only testing blur once
                if (i === 1) {
                    QUnit.equal(shadows[0].blur, '1', 'div #' + index + ' blur');
                }
            }
        });
    });

    test('background-image', function () {
        test_parse_background_image(
            'url("te)st")',
            {
                prefix: '',
                method: 'url',
                value: 'url("te)st")',
                args: ['te)st'],
                image: null
            },
            'test quoted'
        );

        test_parse_background_image(
            'url("te,st")',
            {
                prefix: '',
                method: 'url',
                value: 'url("te,st")',
                args: ['te,st'],
                image: null
            },
            'test quoted'
        );

        test_parse_background_image(
            'url(te,st)',
            {
                prefix: '',
                method: 'url',
                value: 'url(te,st)',
                args: ['te,st'],
                image: null
            },
            'test quoted'
        );

        test_parse_background_image(
            'url(test)',
            {
                prefix: '',
                method: 'url',
                value: 'url(test)',
                args: ['test'],
                image: null
            },
            'basic url'
        );

        test_parse_background_image(
            'url("test")',
            {
                prefix: '',
                method: 'url',
                value: 'url("test")',
                args: ['test'],
                image: null
            },
            'quoted url'
        );

        test_parse_background_image(
            'url(data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7)',
            {
                prefix: '',
                method: 'url',
                value: 'url(data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7)',
                args: ['data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'],
                image: null
            },
            'data url'
        );

        test_parse_background_image(
            'linear-gradient(red,black)',
            {
                prefix: '',
                method: 'linear-gradient',
                value: 'linear-gradient(red,black)',
                args: ['red','black'],
                image: null
            },
            'linear-gradient'
        );

        test_parse_background_image(
            'linear-gradient(top,rgb(255,0,0),rgb(0,0,0))',
            {
                prefix: '',
                method: 'linear-gradient',
                value: 'linear-gradient(top,rgb(255,0,0),rgb(0,0,0))',
                args: ['top', 'rgb(255,0,0)', 'rgb(0,0,0)'],
                image: null
            },
            'linear-gradient w/ rgb()'
        );

        test_parse_background_image(
            '-webkit-linear-gradient(red,black)',
            {
                prefix: '-webkit-',
                method: 'linear-gradient',
                value: '-webkit-linear-gradient(red,black)',
                args: ['red','black'],
                image: null
            },
            'prefixed linear-gradient'
        );

        test_parse_background_image(
            'linear-gradient(red,black), url(test), url("test"),\n none, ', [
                { prefix: '', method: 'linear-gradient', value: 'linear-gradient(red,black)', args: ['red','black'], image: null },
                { prefix: '', method: 'url', value: 'url(test)', args: ['test'], image: null  },
                { prefix: '', method: 'url', value: 'url("test")', args: ['test'], image: null  },
                { prefix: '', method: 'none', value: 'none', args: [], image: null }
            ],
            'multiple backgrounds'
        );
    });

    function test_parse_background_image(value, expected, name) {
        deepEqual(
            parseBackgrounds(value),
            Array.isArray(expected) ? expected : [expected],
            name
        );
    }

    // TODO add backgroundPosition % tests
});
