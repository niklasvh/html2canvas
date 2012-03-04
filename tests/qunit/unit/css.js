// declare vars (preventing JSHint messages)
var test = test || function(){},
    QUnit = QUnit || {},
    _html2canvas = _html2canvas || {};


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
    
// TODO add backgroundPosition % tests

    propsToTest['background-gradient'] = ["backgroundImage"];
    numDivs['background-gradient'] = $('#backgroundGradients div').length;
    
    test('background-gradient', propsToTest['background-gradient'].length * numDivs['background-gradient'], function() {  
            
        $('#backgroundGradients div').each(function(i, el) {
            $.each(propsToTest['background-gradient'], function(s, prop) {
                var src, img, canvas, ctx, id, data, len, red, green, blue, overallColor = 0;
                
                src = _html2canvas.Util.getCSS(el, prop),
                img = _html2canvas.Generate.Gradient(src, {
                    width: 50,
                    height: 50
                });
                
                canvas = document.createElement('canvas');
                canvas.width = 50;
                canvas.height = 50;
                ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0);
                id = ctx.getImageData(0, 0, 50, 50);
                data = id.data;
                len = data.length;
                
                //console.log(img);
                
                for (var i = 0; i < len; i += 4) {
                    red = data[i]; // red
                    green = data[i + 1]; // green
                    blue = data[i + 2]; // blue
                    // i+3 is alpha (the fourth element)
                    
                    overallColor += (red + green + blue) / 3;
                }
                overallColor /= len;
                
                QUnit.notEqual(overallColor, 255, 'No Background Gradient - CSS was ' + src);
            });
        });
    }); 
});