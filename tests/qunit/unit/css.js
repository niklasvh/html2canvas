// declare vars (preventing JSHint messages)
var test = test || function(){},
    QUnit = QUnit || {},
    _html2canvas = _html2canvas || {};


module("CSS");
$(function() {  
   
  
    var propsToTest = ["borderTopWidth", "borderRightWidth", "borderBottomWidth", "borderLeftWidth"],
    numDivs = $('#borders div').length;
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
       
    test('border-width', propsToTest.length * numDivs, function() {  
            
        $('#borders div').each(function(i, el) {
            $.each(propsToTest, function(s, prop) {
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
    
    var propsToTest2 = ["paddingTop", "paddingRight", "paddingBottom", "paddingLeft"],
    numDivs2 = $('#padding div').length;
    
    test('padding width', propsToTest2.length * numDivs2 * 2, function() {  
            
        $('#padding div').each(function(i, el) {
            $.each(propsToTest2, function(s, prop) {
                var isPx = _html2canvas.Util.getCSS(el, prop).indexOf("px");
                QUnit.notEqual( isPx, -1, "div #" + (i + 1) + " property " + prop + " is in pixels" );
                QUnit.equal( _html2canvas.Util.getCSS(el, prop), $(el).css(prop), "div #" + (i + 1) + " property " + prop + " equals " + $(el).css(prop) ); 
            });
            
        });
    }); 
    
        

    
        
    var propsToTest3 = ["backgroundPosition"],
    numDivs3 = $('#backgroundPosition div').length;
    
    test('background-position', propsToTest3.length * numDivs3 * 2, function() {  
            
        $('#backgroundPosition div').each(function(i, el) {
            $.each(propsToTest3, function(s, prop) {
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
});