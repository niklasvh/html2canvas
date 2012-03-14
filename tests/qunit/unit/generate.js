// declare vars (preventing JSHint messages)
/* this breaks the testing for IE<9
var test = test || function(){},
    QUnit = QUnit || {},
    _html2canvas = _html2canvas || {};
*/


//module("Generate"); // <- overwrites predefined CSS-module ?
$(function() {
    
    var propsToTest = {},
        numDivs = {},
        expected = {};
        
    propsToTest['Generate.parseGradient'] = ["backgroundImage"];
    numDivs['Generate.parseGradient'] = $('#backgroundGradients div').length;
    expected['Generate.parseGradient'] = [
        {
            type: 'linear',
            x0: 0,
            y0: 35,
            x1: 50,
            y1: 35,
            colorStops: [
                {
                    color: "rgb(255, 0, 0)",
                    stop: 0
                },
                {
                    color: "rgb(255, 255, 0)",
                    stop: 0.5
                },
                {
                    color: "rgb(0, 255, 0)",
                    stop: 1
                }
            ]
        },
        {
            type: 'linear',
            x0: 0,
            y0: 35,
            x1: 50,
            y1: 35,
            colorStops: [
                {
                    color: "rgb(206, 219, 233)",
                    stop: 0
                },
                {
                    color: "rgb(170, 197, 222)",
                    stop: 0.17
                },
                {
                    color: "rgb(97, 153, 199)",
                    stop: 0.5
                },
                {
                    color: "rgb(58, 132, 195)",
                    stop: 0.51
                },
                {
                    color: "rgb(65, 154, 214)",
                    stop: 0.59
                },
                {
                    color: "rgb(75, 184, 240)",
                    stop: 0.71
                },
                {
                    color: "rgb(58, 139, 194)",
                    stop: 0.84
                },
                {
                    color: "rgb(38, 85, 139)",
                    stop: 1
                }
            ]
        },
        {
            type: "linear",
            x0: 25,
            y0: 0,
            x1: 25,
            y1: 70,
            colorStops: [
                {
                    color: "rgb(240, 183, 161)",
                    stop: 0
                },
                {
                    color: "rgb(140, 51, 16)",
                    stop: 0.5
                },
                {
                    color: "rgb(117, 34, 1)",
                    stop: 0.51
                },
                {
                    color: "rgb(191, 110, 78)",
                    stop: 1
                }
            ]
        },
        {
            type: "ellipse",
            x0: 0,
            y0: 0,
            x1: 50,
            y1: 70,
            cx: 37.5,
            cy: 13.3,
            rx: 12.5,
            ry: 13.3,
            colorStops: [
                {
                    color: "rgb(171, 171, 171)",
                    stop: 0
                },
                {
                    color: "rgb(0, 0, 255)",
                    stop: 0.33
                },
                {
                    color: "rgb(153, 31, 31)",
                    stop: 1
                }
            ]
        },
        {
            type: "circle",
            x0: 0,
            y0: 0,
            x1: 50,
            y1: 70,
            cx: 37.5,
            cy: 13.3,
            rx: 18.25212316416915,
            ry: 18.25212316416915,
            colorStops: [
                {
                    color: "rgb(171, 171, 171)",
                    stop: 0
                },
                {
                    color: "rgb(0, 0, 255)",
                    stop: 0.33
                },
                {
                    color: "rgb(153, 31, 31)",
                    stop: 1
                }
            ]
        },
        {
            type: "ellipse",
            x0: 0,
            y0: 0,
            x1: 50,
            y1: 70,
            cx: 37.5,
            cy: 13.3,
            rx: 37.5,
            ry: 56.7,
            colorStops: [
                {
                    color: "rgb(171, 171, 171)",
                    stop: 0
                },
                {
                    color: "rgb(0, 0, 255)",
                    stop: 0.33
                },
                {
                    color: "rgb(153, 31, 31)",
                    stop: 1
                }
            ]
        },
        {
            type: "circle",
            x0: 0,
            y0: 0,
            x1: 50,
            y1: 70,
            cx: 37.5,
            cy: 13.3,
            rx: 67.97896733549283,
            ry: 67.97896733549283,
            colorStops: [
                {
                    color: "rgb(171, 171, 171)",
                    stop: 0
                },
                {
                    color: "rgb(0, 0, 255)",
                    stop: 0.33
                },
                {
                    color: "rgb(153, 31, 31)",
                    stop: 1
                }
            ]
        },
        {
            type: "ellipse",
            x0: 0,
            y0: 0,
            x1: 50,
            y1: 70,
            cx: 37.5,
            cy: 13.3,
            rx: 12.5,
            ry: 13.3,
            colorStops: [
                {
                    color: "rgb(171, 171, 171)",
                    stop: 0
                },
                {
                    color: "rgb(0, 0, 255)",
                    stop: 0.33
                },
                {
                    color: "rgb(153, 31, 31)",
                    stop: 1
                }
            ]
        },
        {
            type: "circle",
            x0: 0,
            y0: 0,
            x1: 50,
            y1: 70,
            cx: 37.5,
            cy: 13.3,
            rx: 67.97896733549283,
            ry: 67.97896733549283,
            colorStops: [
                {
                    color: "rgb(171, 171, 171)",
                    stop: 0
                },
                {
                    color: "rgb(0, 0, 255)",
                    stop: 0.33
                },
                {
                    color: "rgb(153, 31, 31)",
                    stop: 1
                }
            ]
        }
    ];
    
    test('Generate.parseGradient', propsToTest['Generate.parseGradient'].length * numDivs['Generate.parseGradient'], function() {  
            
        $('#backgroundGradients div').each(function(i, el) {
            $.each(propsToTest['Generate.parseGradient'], function(s, prop) {
                var src, gradient;
                
                src = _html2canvas.Util.getCSS(el, prop);
                
                if (/^(-webkit|-o|-moz|-ms|linear)-/.test(src)) {
                    
                    gradient = _html2canvas.Generate.parseGradient(src, {
                        width: 50,
                        height: 70
                    });
                    
                    //QUnit.deepEqual(gradient, expected['Generate.parseGradient'][i], 'Parsed gradient; got: ' + JSON.stringify(gradient));
                    QUnit.deepEqual(gradient, expected['Generate.parseGradient'][i], 'Parsed gradient with CSS: ' + src);
                } else {
                    QUnit.ok(true, 'No CSS Background Gradient support');
                }
            });
        });
    });
    

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