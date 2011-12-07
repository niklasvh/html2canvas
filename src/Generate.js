/*
  html2canvas @VERSION@ <http://html2canvas.hertzen.com>
  Copyright (c) 2011 Niklas von Hertzen. All rights reserved.
  http://www.twitter.com/niklasvh

  Released under MIT License
*/

html2canvas.Generate = {};


/**
 * mostly borrowed from https://github.com/westonruter/css-gradients-via-canvas/ ;o)
 */
html2canvas.Generate.Gradient = function(cssPropertyValue, bounds) {
    var canvas = document.createElement('canvas'),
    ctx = canvas.getContext('2d');
    
    canvas.width = bounds.width;
    canvas.height = bounds.height;
    
    var forEach = Array.forEach || function(object, block, context) {
        for (var i = 0; i < object.length; i++) {
        	block.call(context, object[i], i, object);
    	}
    };
    
    //"A point is a pair of space-separated values. The syntax supports numbers,
    //percentages or the keywords top, bottom, left and right for point values."
    //This keywords and percentages into pixel equivalents
    function parseCoordinate(value, max){
        //Convert keywords
    	switch(value){
    		case 'top':
    		case 'left':
    			return 0;
    		case 'bottom':
    		case 'right':
    			return max;
    		case 'center':
    			return max/2;
    	}
    
    	//Convert percentage
    	if(value.indexOf('%') != -1)
    		value = parseFloat(value.substr(0, value.length-1))/100*max;
    	//Convert bare number (a pixel value)
    	else 
    		value = parseFloat(value);
    	if(isNaN(value))
    		throw Error("Unable to parse coordinate: " + value);
    	return value;
    }

    //Remove all comments and whitespace from a string
    function normalizeWhitespace(str){
		str = str.replace(/\/\*(.|\s)*?\*\//g, ''); //Remove comments
		str = str.replace(/^\s*\*\//, ''); //Remove trailing comment after closing curly brace
		str = str.replace(/\s+/g, ' ').replace(/^ | $/g, ''); //Trim whitespace
		return str;
	}

	//Parse the stylesheets for CSS Gradients
	var reGradient = /gradient\((radial|linear),(\S+) ([^,]+)(?:,(\d+\.?\d*))?,(\S+) ([^,]+)(?:,(\d+\.?\d*))?,(.+?)\)(?=\s*(?:!important\s*)?$|\s*,\s*(?:-\w+-)?gradient)/g; //don't look at this regular expression :-)
	var reColorStop = /(?:(from|to)\((\w+\(.+?\)|.+?)\)|color-stop\((\d*\.?\d*)(%)?,(\w+\(.+?\)|.+?)\))(?=,|$)/g;

	var cache = [];

	var ruleMatch, propertyMatch, colorStopMatch;

    cssPropertyValue = normalizeWhitespace(cssPropertyValue).toLowerCase().replace(/\s*(,|:|\(|\))\s*/g, '$1');

	//Parse all of the gradients out of the property
	var gradients = [];

	while(propertyMatch = reGradient.exec(cssPropertyValue)){
		//gradient(linear, <point>, <point> [, <stop>]*)
		//gradient(radial, <point> , <radius>, <point>, <radius> [, <stop>]*)

		var gradient = {
			type: propertyMatch[1],
			x0: propertyMatch[2],
			y0: propertyMatch[3],
			r0: parseFloat(propertyMatch[4]),
			x1: propertyMatch[5],
			y1: propertyMatch[6],
			r1: parseFloat(propertyMatch[7]),
			colorStops: []
        }

		//If x0 = x1 and y0 = y1, then the linear gradient must paint nothing.
		if(gradient.type == 'linear' && gradient.x0 == gradient.x2 && gradient.y0 == gradient.y1)
			continue;

		// A stop is a function, color-stop, that takes two arguments,
		// the stop value (either a percentage or a number between 0 and
		// 1.0), and a color (any valid CSS color). In addition the
		// shorthand functions from and to are supported. These
		// functions only require a color argument and are equivalent to
		// color-stop(0, ...) and color-stop(1.0, ...) respectively.
        while(colorStopMatch = reColorStop.exec(propertyMatch[8])){
			var stop;
			var color;
			if(colorStopMatch[1]){
				stop = colorStopMatch[1] == 'from' ? 0.0 : 1.0;
				color = colorStopMatch[2];
			}
			else {
				stop = parseFloat(colorStopMatch[3]);
				if(colorStopMatch[4]) //percentage
					stop /= 100;
				color = colorStopMatch[5];
			}
			gradient.colorStops.push({stop:stop, color:color});
		}
		gradients.unshift(gradient);

	} //end while(propertyMatch = reGradient.exec(propertyValue))
    
    //Iterate over the gradients and build them up
	forEach(gradients, function(gradient){
		var canvasGradient;

		// Linear gradient
		if(gradient.type == 'linear'){
			canvasGradient = ctx.createLinearGradient(
				parseCoordinate(gradient.x0, canvas.width),
				parseCoordinate(gradient.y0, canvas.height),
				parseCoordinate(gradient.x1, canvas.width),
				parseCoordinate(gradient.y1, canvas.height)
			);
		}
		// Radial gradient
		else /*if(gradient.type == 'radial')*/ {
			canvasGradient = ctx.createRadialGradient(
				parseCoordinate(gradient.x0, canvas.width),
				parseCoordinate(gradient.y0, canvas.height),
				gradient.r0,
				parseCoordinate(gradient.x1, canvas.width),
				parseCoordinate(gradient.y1, canvas.height),
				gradient.r1
			);
		}

		//Add each of the color stops to the gradient
		forEach(gradient.colorStops, function(cs){
			canvasGradient.addColorStop(cs.stop, cs.color);
		});

		//Paint the gradient
		ctx.fillStyle = canvasGradient;
		ctx.fillRect(0,0,canvas.width,canvas.height);

	}); //end forEach(gradients

    img = new Image();
    img.src = canvas.toDataURL();
    
    return img;
}

html2canvas.Generate.ListAlpha = function(number) {
    var tmp = "",
    modulus;
    
    do {
        modulus = number % 26; 
        tmp = String.fromCharCode((modulus) + 64) + tmp;
        number = number / 26;
    }while((number*26) > 26);
   
    return tmp;  
}

html2canvas.Generate.ListRoman = function(number) {
    var romanArray = ["M", "CM", "D", "CD", "C", "XC", "L", "XL", "X", "IX", "V", "IV", "I"],
    decimal = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1],
    roman = "",
    v,
    len = romanArray.length;

    if (number <= 0 || number >= 4000) { 
        return number;
    }
    
    for (v=0; v < len; v+=1) {
        while (number >= decimal[v]) { 
            number -= decimal[v];
            roman += romanArray[v];
        }
    }
        
    return roman;
   
}
