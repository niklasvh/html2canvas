// declare vars (preventing JSHint messages)
/* this breaks the testing for IE<9, haven't really looked into why
var test = test || function(){},
    QUnit = QUnit || {},
    _html2canvas = _html2canvas || {};
*/

module("CSS");
$(function() {
    
    var propsToTest = {},
        numDivs = {};
    
   
  
    propsToTest['border-width'] = ["borderTopWidth", "borderRightWidth", "borderBottomWidth", "borderLeftWidth"],
    numDivs['border-width'] = $('#borders div').length;
    /*
    expecting = [
    // #1
    "1px",
    "0px",
    "1px",
    "0px",
            
    // #2
    "16px",
    "0px",
    "16px",
    "0px",
            
    // #3
    "1px",
    "3px",
    "5px",
    "3px",
            
    // #4
    "3px",
    "3px",
    "3px",
    "3px",
            
    // #5
    "80px",
    "35px",
    "480px",
    "188px",
            
    // #6
    "3904px",
    "3500px",
    "2944px",
    "2513px",
    
    // #7
    "18px",
    "6px",
    "80px",
    "5px",
    
    // #8
    "1889px",
    "666px",
    "3904px",
    "500px"
    ];
       */
       
    test('border-width', propsToTest['border-width'].length * numDivs['border-width'], function() {  
            
        $('#borders div').each(function(i, el) {
            $.each(propsToTest['border-width'], function(s, prop) {
                var expect = $(el).css(prop);
                
                // older IE's don't necessarily return px even with jQuery
                if (expect === "thin") {
                    expect = "1px";
                } else if (expect === "medium") {
                    expect = "3px";
                } else if (expect === "thick") {
                    expect = "5px";
                }
                QUnit.equal( _html2canvas.Util.getCSS(el, prop), expect, "div #" + (i + 1) + " property " + prop + " equals " + expect ); 
            });
            
        });
    });  
    
    propsToTest['padding width'] = ["paddingTop", "paddingRight", "paddingBottom", "paddingLeft"];
    numDivs['padding width'] = $('#padding div').length;
    
    test('padding width', propsToTest['padding width'].length * numDivs['padding width'] * 2, function() {  
            
        $('#padding div').each(function(i, el) {
            $.each(propsToTest['padding width'], function(s, prop) {
                var isPx = _html2canvas.Util.getCSS(el, prop).indexOf("px");
                QUnit.notEqual( isPx, -1, "div #" + (i + 1) + " property " + prop + " is in pixels" );
                QUnit.equal( _html2canvas.Util.getCSS(el, prop), $(el).css(prop), "div #" + (i + 1) + " property " + prop + " equals " + $(el).css(prop) ); 
            });
            
        });
    });
        
    propsToTest['background-position'] = ["backgroundPosition"];
    numDivs['background-position'] = $('#backgroundPosition div').length;
    
    test('background-position', propsToTest['background-position'].length * numDivs['background-position'] * 2, function() {  
            
        $('#backgroundPosition div').each(function(i, el) {
            $.each(propsToTest['background-position'], function(s, prop) {
                var img =  new Image();
                img.width = 50;
                img.height = 50;
                
                var item = _html2canvas.Util.getCSS(el, prop),
                pos = _html2canvas.Util.BackgroundPosition(el, _html2canvas.Util.Bounds(el), img),
                split;
                
                if ( window.getComputedStyle ) {
                    split = $(el).css(prop).split(" ");
                } else {
                    split = [$(el).css(prop+"X"),$(el).css(prop+"Y")];
                }
                
                var testEl = $('<div />').css({
                    'position': 'absolute',
                    'left': split[0],
                    'top': split[1]
                });
                
                testEl.appendTo(el);
                
                
                
                
                QUnit.equal( pos.left, Math.round(parseFloat(testEl.css('left'), 10)), "div #" + (i + 1) + " background-position-x equals " + pos.left + " from " + item ); 
                QUnit.equal( pos.top, Math.round(parseFloat(testEl.css('top'), 10)), "div #" + (i + 1) + " background-position-y equals " + pos.top ); 
                
                testEl.remove();
                
                
            });
            
        });
    });

    test('text-shadow', function() {

      $('#textShadows div').each(function(i, el) {
        var index = i+1;
        var value = _html2canvas.Util.getCSS(el, 'textShadow'),
          shadows = _html2canvas.Util.parseTextShadows(value);
        if (i == 0) {
          QUnit.equal(shadows.length, 0, 'div #' + index);
        } else {
          QUnit.equal(shadows.length, (i >= 6 ? 2 : 1), 'div #' + index);
          QUnit.equal(shadows[0].offsetX, i, 'div #' + index + ' offsetX');
          QUnit.equal(shadows[0].offsetY, i, 'div #' + index + ' offsetY');
          if (i < 2) {
            QUnit.equal(shadows[0].color, 'rgba(0, 0, 0, 0)', 'div #' + index + ' color');
          } else if (i % 2 == 0) {
            QUnit.equal(shadows[0].color, 'rgb(2, 2, 2)', 'div #' + index + ' color');
          } else {
            var opacity = '0.199219';
            QUnit.equal(shadows[0].color, 'rgba(2, 2, 2, '+opacity+')', 'div #' + index + ' color');
          }

          // only testing blur once
          if (i == 1) {
            QUnit.equal(shadows[0].blur, '1', 'div #' + index + ' blur');
          }
        }
      });
    });
    
    test('background-image', function () {
        
        test_parse_background_image(
            'url("te)st")', 
            { prefix: '', method: 'url', value: 'url("te)st")', args: ['te)st'] }, 
            'test quoted'
        );
        
        test_parse_background_image(
            'url("te,st")', 
            { prefix: '', method: 'url', value: 'url("te,st")', args: ['te,st'] }, 
            'test quoted'
        );
        
        test_parse_background_image(
            'url(te,st)', 
            { prefix: '', method: 'url', value: 'url(te,st)', args: ['te,st'] }, 
            'test quoted'
        );

        test_parse_background_image(
            'url(test)', 
            { prefix: '', method: 'url', value: 'url(test)', args: ['test'] }, 
            'basic url'
        );

        test_parse_background_image(
            'url("test")', 
            { prefix: '', method: 'url', value: 'url("test")', args: ['test'] }, 
            'quoted url'
        );

        test_parse_background_image(
            'url(data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7)', 
            { 
                prefix: '', method: 'url', 
                value: 'url(data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7)',
                args: ['data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7']
            }, 
            'data url'
        );

        test_parse_background_image(
            'linear-gradient(red,black)', 
            { prefix: '', method: 'linear-gradient', value: 'linear-gradient(red,black)', args: ['red','black'] }, 
            'linear-gradient'
        );

        test_parse_background_image(
            'linear-gradient(top,rgb(255,0,0),rgb(0,0,0))', 
            { 
                prefix: '', method: 'linear-gradient', 
                value: 'linear-gradient(top,rgb(255,0,0),rgb(0,0,0))',
                args: ['top', 'rgb(255,0,0)', 'rgb(0,0,0)']
            }, 
            'linear-gradient w/ rgb()'
        );

        test_parse_background_image(
            '-webkit-linear-gradient(red,black)', 
            { 
                prefix: '-webkit-', method: 'linear-gradient', 
                value: '-webkit-linear-gradient(red,black)',
                args: ['red','black']
            }, 
            'prefixed linear-gradient'
        );

        test_parse_background_image(
            'linear-gradient(red,black), url(test), url("test"),\n none, ', [
            { prefix: '', method: 'linear-gradient', value: 'linear-gradient(red,black)', args: ['red','black'] },
            { prefix: '', method: 'url', value: 'url(test)', args: ['test']  },
            { prefix: '', method: 'url', value: 'url("test")', args: ['test']  },
            { prefix: '', method: 'none', value: 'none', args: [] }
            ],
            'multiple backgrounds'
        );

    });

    function test_parse_background_image(value, expected, name) {
        deepEqual(
            _html2canvas.Util.parseBackgroundImage(value), 
            Array.isArray(expected) ? expected : [expected], 
            name
        );
    }

    // TODO add backgroundPosition % tests
    
});