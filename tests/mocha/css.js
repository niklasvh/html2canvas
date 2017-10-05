var NodeContainer = html2canvas.NodeContainer;

describe('Borders', function() {
    $('#borders div').each(function(i, node) {
        it($(this).attr('style'), function() {
            ["borderTopWidth", "borderRightWidth", "borderBottomWidth", "borderLeftWidth"].forEach(function(prop) {
                var result = $(node).css(prop);
                // older IE's don't necessarily return px even with jQuery
                if (result === "thin") {
                    result = "1px";
                } else if (result === "medium") {
                    result = "3px";
                } else if (result === "thick") {
                    result = "5px";
                }
                var container = new NodeContainer(node, null);
                expect(container.css(prop)).to.be(result);
            });
        });
    });
});

describe('Padding', function() {
    $('#padding div').each(function(i, node) {
        it($(this).attr('style'), function() {
            ["paddingTop", "paddingRight", "paddingBottom", "paddingLeft"].forEach(function(prop) {
                var container = new NodeContainer(node, null);
                var result = container.css(prop);
                expect(result).to.contain("px");
                expect(result, $(node).css(prop));
            });
        });
    });
});

describe('Background-position', function() {
    $('#backgroundPosition div').each(function(i, node) {
        it($(this).attr('style'), function() {
            var prop = "backgroundPosition";
            var img =  new Image();
            img.width = 50;
            img.height = 50;

            var container = new NodeContainer(node, null);
            var item = container.css(prop),
                backgroundPosition = container.parseBackgroundPosition(html2canvas.utils.getBounds(node), img),
                split = (window.getComputedStyle) ? $(node).css(prop).split(" ") : [$(node).css(prop+"X"), $(node).css(prop+"Y")];

            var testEl = $('<div />').css({
                'position': 'absolute',
                'left': split[0],
                'top': split[1]
            });

            testEl.appendTo(node);

            expect(backgroundPosition.left).to.equal(Math.floor(parseFloat(testEl.css('left'))));
            expect(backgroundPosition.top).to.equal(Math.floor(parseFloat(testEl.css('top'))));

            testEl.remove();
        });
    });
});

describe('Text-shadow', function() {
    $('#textShadows div').each(function(i, node) {
        var index = i + 1;
        var container = new NodeContainer(node, null);
        var shadows = container.parseTextShadows();
        it(node.style.textShadow, function() {
            if (i === 0) {
                expect(shadows.length).to.equal(0);
            } else {
                expect(shadows.length).to.equal(i >= 6 ? 2 : 1);
                expect(shadows[0].offsetX).to.equal(i);
                expect(shadows[0].offsetY).to.equal(i);
                if (i < 2) {
                    expect(shadows[0].color.toString()).to.equal('rgba(0,0,0,0)');
                } else if (i % 2 === 0) {
                    expect(shadows[0].color.toString()).to.equal('rgb(2,2,2)');
                } else {
                    var opacity = '0.2';
                    expect(shadows[0].color.toString()).to.match(/rgba\(2,2,2,(0.2|0\.199219)\)/);
                }

                // only testing blur once
                if (i === 1) {
                    expect(shadows[0].blur).to.equal('1');
                }
            }
        });
    });
});

describe('Background-image', function() {
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


    function test_parse_background_image(value, expected, name) {
        it(name, function() {
            expect(html2canvas.utils.parseBackgrounds(value)).to.eql(Array.isArray(expected) ? expected : [expected]);
        });
    }
});
