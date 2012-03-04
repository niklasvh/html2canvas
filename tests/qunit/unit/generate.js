// declare vars (preventing JSHint messages)
/* this breaks the testing for IE<9
var test = test || function(){},
    QUnit = QUnit || {},
    _html2canvas = _html2canvas || {};
*/


//module("Generate"); // <- overwrites predefined CSS-module ?
$(function() {
    
    var propsToTest = {},
        numDivs = {};
    

    propsToTest['Generate.Gradient'] = ["backgroundImage"];
    numDivs['Generate.Gradient'] = $('#backgroundGradients div').length;
    
    test('Generate.Gradient', propsToTest['Generate.Gradient'].length * numDivs['Generate.Gradient'], function() {  
            
        $('#backgroundGradients div').each(function(i, el) {
            $.each(propsToTest['Generate.Gradient'], function(s, prop) {
                var src, img, canvas, ctx, id, data, len, red, green, blue, overallColor = 0;
                
                src = _html2canvas.Util.getCSS(el, prop);
                
                if (/^(-webkit|-o|-moz|-ms|linear)-/.test(src)) {
                    
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
                    overallColor /= (len / 4);
                    
                    QUnit.notEqual(overallColor, 255, 'Background Gradient drawn with CSS: ' + src);
                } else {
                    QUnit.ok(true, 'No CSS Background Gradient support');
                }
            });
        });
    }); 
});