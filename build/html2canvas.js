/**
  @license html2canvas v0.33 <http://html2canvas.hertzen.com>
  Copyright (c) 2011 Niklas von Hertzen. All rights reserved.
  http://www.twitter.com/niklasvh

  Released under MIT License
 */
(function(window, document, undefined){
/*
  html2canvas v0.33 <http://html2canvas.hertzen.com>
  Copyright (c) 2011 Niklas von Hertzen. All rights reserved.
  http://www.twitter.com/niklasvh

  Released under MIT License
 */
"use strict";

var _html2canvas = {},
html2canvas;


function h2clog(a) {
    if (_html2canvas.logging && window.console && window.console.log) {
        window.console.log(a);
    }
}

_html2canvas.Util = {};

_html2canvas.Util.backgroundImage = function (src) {
  
    if (/data:image\/.*;base64,/i.test( src ) || /^(-webkit|-moz|linear-gradient|-o-)/.test( src )) {
        return src;
    }
    
    if (src.toLowerCase().substr( 0, 5 ) === 'url("') {
        src = src.substr( 5 );
        src = src.substr( 0, src.length - 2 );                 
    } else {
        src = src.substr( 4 );
        src = src.substr( 0, src.length - 1 );  
    }

    return src;  
};

_html2canvas.Util.Bounds = function getBounds (el) {
    var clientRect,
    bounds = {};
        
    if (el.getBoundingClientRect){	
        clientRect = el.getBoundingClientRect();

            
        // TODO add scroll position to bounds, so no scrolling of window necessary
        bounds.top = clientRect.top;
        bounds.bottom = clientRect.bottom || (clientRect.top + clientRect.height);
        bounds.left = clientRect.left;
        
        // older IE doesn't have width/height, but top/bottom instead
        bounds.width = clientRect.width || (clientRect.right - clientRect.left);
        bounds.height = clientRect.height || (clientRect.bottom - clientRect.top);
    
        return bounds;
            
    }       
};

_html2canvas.Util.getCSS = function (el, attribute) {
    // return $(el).css(attribute);
    
    var val;
    
    function toPX( attribute, val ) {
        var rsLeft = el.runtimeStyle && el.runtimeStyle[ attribute ],
        left,
        style = el.style;
                
        // Check if we are not dealing with pixels, (Opera has issues with this)
        // Ported from jQuery css.js
        // From the awesome hack by Dean Edwards
        // http://erik.eae.net/archives/2007/07/27/18.54.15/#comment-102291

        // If we're not dealing with a regular pixel number
        // but a number that has a weird ending, we need to convert it to pixels   
        
        if ( !/^-?[0-9]+\.?[0-9]*(?:px)?$/i.test( val ) && /^-?\d/.test( val ) ) {

            // Remember the original values
            left = style.left;

            // Put in the new values to get a computed value out
            if ( rsLeft ) {
                el.runtimeStyle.left = el.currentStyle.left;
            }
            style.left = attribute === "fontSize" ? "1em" : (val || 0);
            val = style.pixelLeft + "px";

            // Revert the changed values
            style.left = left;
            if ( rsLeft ) {
                el.runtimeStyle.left = rsLeft;
            }

        }
        
        if (!/^(thin|medium|thick)$/i.test( val )) {
            return Math.round(parseFloat( val )) + "px";
        } 
        
        return val;
     
    }
    
    
    if ( window.getComputedStyle ) {
        val = document.defaultView.getComputedStyle(el, null)[ attribute ];
        
        if ( attribute === "backgroundPosition" ) {
            
            val = (val.split(",")[0] || "0 0").split(" ");
          
            val[ 0 ] = ( val[0].indexOf( "%" ) === -1 ) ? toPX(  attribute + "X", val[ 0 ] ) : val[ 0 ];
            val[ 1 ] = ( val[1] === undefined ) ? val[0] : val[1]; // IE 9 doesn't return double digit always
            val[ 1 ] = ( val[1].indexOf( "%" ) === -1 ) ? toPX(  attribute + "Y", val[ 1 ] ) : val[ 1 ];
        } 
        
    } else if ( el.currentStyle ) {
        // IE 9>       
        if (attribute === "backgroundPosition") {
            // Older IE uses -x and -y 
            val = [ toPX(  attribute + "X", el.currentStyle[ attribute + "X" ]  ), toPX(  attribute + "Y", el.currentStyle[ attribute + "Y" ]  ) ];  
        } else {

            val = toPX(  attribute, el.currentStyle[ attribute ]  );
            
            if (/^(border)/i.test( attribute ) && /^(medium|thin|thick)$/i.test( val )) {
                switch (val) {
                    case "thin":
                        val = "1px";
                        break;
                    case "medium":
                        val = "0px"; // this is wrong, it should be 3px but IE uses medium for no border as well.. TODO find a work around
                        break;
                    case "thick":
                        val = "5px";
                        break;
                }
            }    
        }



    }



    
    return val;
    

    
//return $(el).css(attribute);
    
  
};


_html2canvas.Util.BackgroundPosition = function ( el, bounds, image ) {
    // TODO add support for multi image backgrounds
    
    var bgposition =  _html2canvas.Util.getCSS( el, "backgroundPosition" ) ,
    topPos,
    left,
    percentage,
    val;
    
    if (bgposition.length === 1){
        val = bgposition;
            
        bgposition = [];
        
        bgposition[0] = val;
        bgposition[1] = val;
    }  

    

    if (bgposition[0].toString().indexOf("%") !== -1){    
        percentage = (parseFloat(bgposition[0])/100);        
        left =  ((bounds.width * percentage)-(image.width*percentage));
      
    }else{
        left = parseInt(bgposition[0],10);
    }

    if (bgposition[1].toString().indexOf("%") !== -1){  

        percentage = (parseFloat(bgposition[1])/100);     
        topPos =  ((bounds.height * percentage)-(image.height*percentage));
    }else{      
        topPos = parseInt(bgposition[1],10);      
    }

    

           
    return {
        top: topPos,
        left: left
    };
         
};

_html2canvas.Util.Extend = function (options, defaults) {
    for (var key in options) {
        if (options.hasOwnProperty(key)) {
            defaults[key] = options[key];
        }
    }
    return defaults;
};

_html2canvas.Util.Children = function(el) {
    // $(el).contents() !== el.childNodes, Opera / IE have issues with that
    var children;
    try {
        children = $(el).contents();
    //children = (el.nodeName && el.nodeName.toUpperCase() === "IFRAME") ? el.contentDocument || el.contentWindow.document :  el.childNodes ;
       
    } catch (ex) {
        h2clog("html2canvas.Util.Children failed with exception: " + ex.message);
        children = [];
    }
    return children;
};
/*
  html2canvas v0.33 <http://html2canvas.hertzen.com>
  Copyright (c) 2011 Niklas von Hertzen. All rights reserved.
  http://www.twitter.com/niklasvh
  
  Contributor(s):
      Niklas von Hertzen <http://www.twitter.com/niklasvh>
      André Fiedler      <http://www.twitter.com/sonnenkiste>

  Released under MIT License
 */

(function(){
    
_html2canvas.Generate = {};

var reGradients = [
    /^(-webkit-linear-gradient)\(([a-z\s]+)([\w\d\.\s,%\(\)]+)\)$/,
    /^(-o-linear-gradient)\(([a-z\s]+)([\w\d\.\s,%\(\)]+)\)$/,
    /^(-webkit-gradient)\((linear|radial),\s((?:\d{1,3}%?)\s(?:\d{1,3}%?),\s(?:\d{1,3}%?)\s(?:\d{1,3}%?))([\w\d\.\s,%\(\)-]+)\)$/,
    /^(-moz-linear-gradient)\(((?:\d{1,3}%?)\s(?:\d{1,3}%?))([\w\d\.\s,%\(\)]+)\)$/,
    /^(-webkit-radial-gradient)\(((?:\d{1,3}%?)\s(?:\d{1,3}%?)),\s(\w+)\s([a-z-]+)([\w\d\.\s,%\(\)]+)\)$/,
    /^(-moz-radial-gradient)\(((?:\d{1,3}%?)\s(?:\d{1,3}%?)),\s(\w+)\s?([a-z-]*)([\w\d\.\s,%\(\)]+)\)$/,
    /^(-o-radial-gradient)\(((?:\d{1,3}%?)\s(?:\d{1,3}%?)),\s(\w+)\s([a-z-]+)([\w\d\.\s,%\(\)]+)\)$/
];

/*
 * TODO: Add IE10 vendor prefix (-ms) support
 * TODO: Add W3C gradient (linear-gradient) support
 * TODO: Add old Webkit -webkit-gradient(radial, ...) support
 * TODO: Maybe some RegExp optimizations are possible ;o)
 */
_html2canvas.Generate.parseGradient = function(css, bounds) {  
    var gradient, i, len = reGradients.length, m1, stop, m2, m2Len, step, m3;
    
    for(i = 0; i < len; i+=1){
        m1 = css.match(reGradients[i]);
        if(m1) break;
    }
    
    if(m1) {
        switch(m1[1]) {
            case '-webkit-linear-gradient':
            case '-o-linear-gradient':
                
                gradient = {
                    type: 'linear',
                    x0: null,
                    y0: null,
                    x1: null,
                    y1: null,
                    colorStops: []
                };
                
                // get coordinates
                m2 = m1[2].match(/\w+/g);
                if(m2){
                    m2Len = m2.length;
                    for(i = 0; i < m2Len; i+=1){
                        switch(m2[i]) {
                            case 'top':
                                gradient.y0 = 0;
                                gradient.y1 = bounds.height;
                                break;
                                
                            case 'right':
                                gradient.x0 = bounds.width;
                                gradient.x1 = 0;
                                break;
                                
                            case 'bottom':
                                gradient.y0 = bounds.height;
                                gradient.y1 = 0;
                                break;
                                
                            case 'left':
                                gradient.x0 = 0;
                                gradient.x1 = bounds.width;
                                break;
                        }
                    }
                }
                if(gradient.x0 === null && gradient.x1 === null){ // center
                    gradient.x0 = gradient.x1 = bounds.width / 2;
                }
                if(gradient.y0 === null && gradient.y1 === null){ // center
                    gradient.y0 = gradient.y1 = bounds.height / 2;
                }
                
                // get colors and stops
                m2 = m1[3].match(/((?:rgb|rgba)\(\d{1,3},\s\d{1,3},\s\d{1,3}(?:,\s[0-9\.]+)?\)(?:\s\d{1,3}(?:%|px))?)+/g);
                if(m2){
                    m2Len = m2.length;
                    step = 1 / Math.max(m2Len - 1, 1);
                    for(i = 0; i < m2Len; i+=1){
                        m3 = m2[i].match(/((?:rgb|rgba)\(\d{1,3},\s\d{1,3},\s\d{1,3}(?:,\s[0-9\.]+)?\))\s*(\d{1,3})?(%|px)?/);
                        if(m3[2]){
                            stop = parseFloat(m3[2]);
                            if(m3[3] === '%'){
                                stop /= 100;
                            } else { // px - stupid opera
                                stop /= bounds.width;
                            }
                        } else {
                            stop = i * step;
                        }
                        gradient.colorStops.push({
                            color: m3[1],
                            stop: stop
                        });
                    }
                }
                break;
                
            case '-webkit-gradient':
                
                gradient = {
                    type: m1[2] === 'radial' ? 'circle' : m1[2], // TODO: Add radial gradient support for older mozilla definitions
                    x0: 0,
                    y0: 0,
                    x1: 0,
                    y1: 0,
                    colorStops: []
                };
                
                // get coordinates
                m2 = m1[3].match(/(\d{1,3})%?\s(\d{1,3})%?,\s(\d{1,3})%?\s(\d{1,3})%?/);
                if(m2){
                    gradient.x0 = (m2[1] * bounds.width) / 100;
                    gradient.y0 = (m2[2] * bounds.height) / 100;
                    gradient.x1 = (m2[3] * bounds.width) / 100;
                    gradient.y1 = (m2[4] * bounds.height) / 100;
                }
                
                // get colors and stops
                m2 = m1[4].match(/((?:from|to|color-stop)\((?:[0-9\.]+,\s)?(?:rgb|rgba)\(\d{1,3},\s\d{1,3},\s\d{1,3}(?:,\s[0-9\.]+)?\)\))+/g);
                if(m2){
                    m2Len = m2.length;
                    for(i = 0; i < m2Len; i+=1){
                        m3 = m2[i].match(/(from|to|color-stop)\(([0-9\.]+)?(?:,\s)?((?:rgb|rgba)\(\d{1,3},\s\d{1,3},\s\d{1,3}(?:,\s[0-9\.]+)?\))\)/);
                        stop = parseFloat(m3[2]);
                        if(m3[1] === 'from') stop = 0.0;
                        if(m3[1] === 'to') stop = 1.0;
                        gradient.colorStops.push({
                            color: m3[3],
                            stop: stop
                        });
                    }
                }
                break;
                
            case '-moz-linear-gradient':
                
                gradient = {
                    type: 'linear',
                    x0: 0,
                    y0: 0,
                    x1: 0,
                    y1: 0,
                    colorStops: []
                };
                
                // get coordinates
                m2 = m1[2].match(/(\d{1,3})%?\s(\d{1,3})%?/);
                
                // m2[1] == 0%   -> left
                // m2[1] == 50%  -> center
                // m2[1] == 100% -> right
                
                // m2[2] == 0%   -> top
                // m2[2] == 50%  -> center
                // m2[2] == 100% -> bottom
                
                if(m2){
                    gradient.x0 = (m2[1] * bounds.width) / 100;
                    gradient.y0 = (m2[2] * bounds.height) / 100;
                    gradient.x1 = bounds.width - gradient.x0;
                    gradient.y1 = bounds.height - gradient.y0;
                }
                
                // get colors and stops
                m2 = m1[3].match(/((?:rgb|rgba)\(\d{1,3},\s\d{1,3},\s\d{1,3}(?:,\s[0-9\.]+)?\)(?:\s\d{1,3}%)?)+/g);
                if(m2){
                    m2Len = m2.length;
                    step = 1 / Math.max(m2Len - 1, 1);
                    for(i = 0; i < m2Len; i+=1){
                        m3 = m2[i].match(/((?:rgb|rgba)\(\d{1,3},\s\d{1,3},\s\d{1,3}(?:,\s[0-9\.]+)?\))\s*(\d{1,3})?(%)?/);
                        if(m3[2]){
                            stop = parseFloat(m3[2]);
                            if(m3[3]){ // percentage
                                stop /= 100;
                            }
                        } else {
                            stop = i * step;
                        }
                        gradient.colorStops.push({
                            color: m3[1],
                            stop: stop
                        });
                    }
                }
                break;
                
            case '-webkit-radial-gradient':
            case '-moz-radial-gradient':
            case '-o-radial-gradient':
                
                gradient = {
                    type: 'circle',
                    x0: 0,
                    y0: 0,
                    x1: bounds.width,
                    y1: bounds.height,
                    cx: 0,
                    cy: 0,
                    rx: 0,
                    ry: 0,
                    colorStops: []
                };
                
                // center
                m2 = m1[2].match(/(\d{1,3})%?\s(\d{1,3})%?/);
                if(m2){
                    gradient.cx = (m2[1] * bounds.width) / 100;
                    gradient.cy = (m2[2] * bounds.height) / 100;
                }
                
                // size
                m2 = m1[3].match(/\w+/);
                m3 = m1[4].match(/[a-z-]*/);
                if(m2 && m3){
                    switch(m3[0]){
                        case 'farthest-corner':
                        case 'cover': // is equivalent to farthest-corner
                        case '': // mozilla removes "cover" from definition :(
                            var tl = Math.sqrt(Math.pow(gradient.cx, 2) + Math.pow(gradient.cy, 2));
                            var tr = Math.sqrt(Math.pow(gradient.cx, 2) + Math.pow(gradient.y1 - gradient.cy, 2));
                            var br = Math.sqrt(Math.pow(gradient.x1 - gradient.cx, 2) + Math.pow(gradient.y1 - gradient.cy, 2));
                            var bl = Math.sqrt(Math.pow(gradient.x1 - gradient.cx, 2) + Math.pow(gradient.cy, 2));
                            gradient.rx = gradient.ry = Math.max(tl, tr, br, bl);
                            break;
                        case 'closest-corner':
                            var tl = Math.sqrt(Math.pow(gradient.cx, 2) + Math.pow(gradient.cy, 2));
                            var tr = Math.sqrt(Math.pow(gradient.cx, 2) + Math.pow(gradient.y1 - gradient.cy, 2));
                            var br = Math.sqrt(Math.pow(gradient.x1 - gradient.cx, 2) + Math.pow(gradient.y1 - gradient.cy, 2));
                            var bl = Math.sqrt(Math.pow(gradient.x1 - gradient.cx, 2) + Math.pow(gradient.cy, 2));
                            gradient.rx = gradient.ry = Math.min(tl, tr, br, bl);
                            break;
                        case 'farthest-side':
                            if(m2[0] === 'circle'){
                                gradient.rx = gradient.ry = Math.max(
                                    gradient.cx,
                                    gradient.cy,
                                    gradient.x1 - gradient.cx,
                                    gradient.y1 - gradient.cy
                                );
                            } else { // ellipse
                            
                                gradient.type = m2[0];
                                
                                gradient.rx = Math.max(
                                    gradient.cx,
                                    gradient.x1 - gradient.cx
                                );
                                gradient.ry = Math.max(
                                    gradient.cy,
                                    gradient.y1 - gradient.cy
                                );
                            }
                            break;
                        case 'closest-side':
                        case 'contain': // is equivalent to closest-side
                            if(m2[0] === 'circle'){
                                gradient.rx = gradient.ry = Math.min(
                                    gradient.cx,
                                    gradient.cy,
                                    gradient.x1 - gradient.cx,
                                    gradient.y1 - gradient.cy
                                );
                            } else { // ellipse
                            
                                gradient.type = m2[0];
                            
                                gradient.rx = Math.min(
                                    gradient.cx,
                                    gradient.x1 - gradient.cx
                                );
                                gradient.ry = Math.min(
                                    gradient.cy,
                                    gradient.y1 - gradient.cy
                                );
                            }
                            break;
                        
                        // TODO: add support for "30px 40px" sizes (webkit only)
                    }
                }
                
                // color stops
                m2 = m1[5].match(/((?:rgb|rgba)\(\d{1,3},\s\d{1,3},\s\d{1,3}(?:,\s[0-9\.]+)?\)(?:\s\d{1,3}(?:%|px))?)+/g);
                if(m2){
                    m2Len = m2.length;
                    step = 1 / Math.max(m2Len - 1, 1);
                    for(i = 0; i < m2Len; i+=1){
                        m3 = m2[i].match(/((?:rgb|rgba)\(\d{1,3},\s\d{1,3},\s\d{1,3}(?:,\s[0-9\.]+)?\))\s*(\d{1,3})?(%|px)?/);
                        if(m3[2]){
                            stop = parseFloat(m3[2]);
                            if(m3[3] === '%'){
                                stop /= 100;
                            } else { // px - stupid opera
                                stop /= bounds.width;
                            }
                        } else {
                            stop = i * step;
                        }
                        gradient.colorStops.push({
                            color: m3[1],
                            stop: stop
                        });
                    }
                }
                break;
        }
    }
    
    return gradient;
};

_html2canvas.Generate.Gradient = function(src, bounds) {
    var canvas = document.createElement('canvas'),
    ctx = canvas.getContext('2d'),
    gradient, grad, i, len, img;
    
    canvas.width = bounds.width;
    canvas.height = bounds.height;
    
    // TODO: add support for multi defined background gradients (like radial gradient example in background.html)
    gradient = _html2canvas.Generate.parseGradient(src, bounds);
    
    img = new Image();
    
    if(gradient){
        if(gradient.type === 'linear'){
            grad = ctx.createLinearGradient(gradient.x0, gradient.y0, gradient.x1, gradient.y1);
            
            for (i = 0, len = gradient.colorStops.length; i < len; i+=1) {
                try {
                    grad.addColorStop(gradient.colorStops[i].stop, gradient.colorStops[i].color);
                }
                catch(e) {
                    h2clog(['failed to add color stop: ', e, '; tried to add: ', gradient.colorStops[i], '; stop: ', i, '; in: ', src]);
                }
            }
            
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, bounds.width, bounds.height);
        
            img.src = canvas.toDataURL();
        } else if(gradient.type === 'circle'){
            
            grad = ctx.createRadialGradient(gradient.cx, gradient.cy, 0, gradient.cx, gradient.cy, gradient.rx);
            
            for (i = 0, len = gradient.colorStops.length; i < len; i+=1) {
                try {
                    grad.addColorStop(gradient.colorStops[i].stop, gradient.colorStops[i].color);
                }
                catch(e) {
                    h2clog(['failed to add color stop: ', e, '; tried to add: ', gradient.colorStops[i], '; stop: ', i, '; in: ', src]);
                }
            }
            
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, bounds.width, bounds.height);
        
            img.src = canvas.toDataURL();
        } else if(gradient.type === 'ellipse'){
            
            // draw circle
            var canvasRadial = document.createElement('canvas'),
                ctxRadial = canvasRadial.getContext('2d'),
                ri = Math.max(gradient.rx, gradient.ry),
                di = ri * 2, imgRadial;
                
            canvasRadial.width = canvasRadial.height = di;
            
            grad = ctxRadial.createRadialGradient(gradient.rx, gradient.ry, 0, gradient.rx, gradient.ry, ri);
            
            for (i = 0, len = gradient.colorStops.length; i < len; i+=1) {
                try {
                    grad.addColorStop(gradient.colorStops[i].stop, gradient.colorStops[i].color);
                }
                catch(e) {
                    h2clog(['failed to add color stop: ', e, '; tried to add: ', gradient.colorStops[i], '; stop: ', i, '; in: ', src]);
                }
            }
            
            ctxRadial.fillStyle = grad;
            ctxRadial.fillRect(0, 0, di, di);
            
            ctx.fillStyle = gradient.colorStops[i - 1].color;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            imgRadial = new Image();
            imgRadial.onload = function() { // wait until the image is filled
                
                // transform circle to ellipse
                ctx.drawImage(imgRadial, gradient.cx - gradient.rx, gradient.cy - gradient.ry, 2 * gradient.rx, 2 * gradient.ry);
                
                img.src = canvas.toDataURL();
                
            }
            imgRadial.src = canvasRadial.toDataURL();
        }
    }
    
    return img;
};

_html2canvas.Generate.ListAlpha = function(number) {
    var tmp = "",
    modulus;
    
    do {
        modulus = number % 26; 
        tmp = String.fromCharCode((modulus) + 64) + tmp;
        number = number / 26;
    }while((number*26) > 26);
   
    return tmp;  
};

_html2canvas.Generate.ListRoman = function(number) {
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
   
};

})();
/*
  html2canvas v0.33 <http://html2canvas.hertzen.com>
  Copyright (c) 2011 Niklas von Hertzen. All rights reserved.
  http://www.twitter.com/niklasvh

  Released under MIT License
*/

/*
 *  New function for traversing elements
 */

_html2canvas.Parse = function ( images, options ) {
    window.scroll(0,0);
  
    var support = {
        rangeBounds: false,
        svgRendering: options.svgRendering && (function( ){
            var img = new Image(),
            canvas = document.createElement("canvas"),
            ctx = (canvas.getContext === undefined) ? false : canvas.getContext("2d");
            if (ctx === false) {
                // browser doesn't support canvas, good luck supporting SVG on canvas
                return false;
            }
            canvas.width = canvas.height = 10; 
            img.src = [
            "data:image/svg+xml,",
            "<svg xmlns='http://www.w3.org/2000/svg' width='10' height='10'>",
            "<foreignObject width='10' height='10'>",
            "<div xmlns='http://www.w3.org/1999/xhtml' style='width:10;height:10;'>",
            "sup",
            "</div>",
            "</foreignObject>",
            "</svg>"
            ].join("");
            try {
                ctx.drawImage(img, 0, 0);
                canvas.toDataURL();
            } catch(e) {
                return false;
            }
            h2clog('html2canvas: Parse: SVG powered rendering available');
            return true; 
            
        })()
    },
    element = (( options.elements === undefined ) ? document.body : options.elements[0]), // select body by default
    needReorder = false,
    numDraws = 0,
    fontData = {},
    doc = element.ownerDocument,
    ignoreElementsRegExp = new RegExp("(" + options.ignoreElements + ")"),
    body = doc.body,
    r,
    testElement,
    rangeBounds,
    rangeHeight,
    stack, 
    ctx,
    docDim,
    i,
    children,
    childrenLen;
    
    
    function docSize(){

        return {
            width: Math.max(
                Math.max(doc.body.scrollWidth, doc.documentElement.scrollWidth),
                Math.max(doc.body.offsetWidth, doc.documentElement.offsetWidth),
                Math.max(doc.body.clientWidth, doc.documentElement.clientWidth)
                ),
            height: Math.max(
                Math.max(doc.body.scrollHeight, doc.documentElement.scrollHeight),
                Math.max(doc.body.offsetHeight, doc.documentElement.offsetHeight),
                Math.max(doc.body.clientHeight, doc.documentElement.clientHeight)
                )
        };  
        
    }

    images = images || {};
    
    // Test whether we can use ranges to measure bounding boxes
    // Opera doesn't provide valid bounds.height/bottom even though it supports the method.

    
    if (doc.createRange) {
        r = doc.createRange();
        //this.support.rangeBounds = new Boolean(r.getBoundingClientRect);
        if (r.getBoundingClientRect){
            testElement = doc.createElement('boundtest');
            testElement.style.height = "123px";
            testElement.style.display = "block";
            body.appendChild(testElement);
            
            r.selectNode(testElement);
            rangeBounds = r.getBoundingClientRect();
            rangeHeight = rangeBounds.height;

            if (rangeHeight === 123) {
                support.rangeBounds = true;
            }
            body.removeChild(testElement);

            
        }
        
    }
    
    
    /*
    var rootStack = new this.storageContext($(document).width(),$(document).height());  
    rootStack.opacity = this.getCSS(this.element,"opacity");
    var stack = this.newElement(this.element,rootStack);
        
        
    this.parseElement(this.element,stack);  
     */




    var getCSS = _html2canvas.Util.getCSS;
    function getCSSInt(element, attribute) {
        var val = parseInt(getCSS(element, attribute), 10);
        return (isNaN(val)) ? 0 : val; // borders in old IE are throwing 'medium' for demo.html 
    }

    // Drawing a rectangle
    function renderRect (ctx, x, y, w, h, bgcolor) {
        if (bgcolor !=="transparent"){
            ctx.setVariable("fillStyle", bgcolor);
            ctx.fillRect (x, y, w, h);
            numDraws+=1;
        }
    }
    
    
    function textTransform (text, transform) {
        switch(transform){
            case "lowercase":
                return text.toLowerCase();     
					
            case "capitalize":
                return text.replace( /(^|\s|:|-|\(|\))([a-z])/g , function (m, p1, p2) {
                    if (m.length > 0) {
                        return p1 + p2.toUpperCase();
                    }
                } );            
					
            case "uppercase":
                return text.toUpperCase();
                
            default:
                return text;
				
        }
        
    }
    
    function trimText (text) {
        return text.replace(/^\s*/g, "").replace(/\s*$/g, "");
    }
    
    function fontMetrics (font, fontSize) {
    
        if (fontData[font + "-" + fontSize] !== undefined) {
            return fontData[font + "-" + fontSize];
        }

    
        var container = doc.createElement('div'),
        img = doc.createElement('img'),
        span = doc.createElement('span'),
        baseline,
        middle,
        metricsObj;
        
        
        container.style.visibility = "hidden";
        container.style.fontFamily = font;
        container.style.fontSize = fontSize;
        container.style.margin = 0;
        container.style.padding = 0;

        body.appendChild(container);
        


        // http://probablyprogramming.com/2009/03/15/the-tiniest-gif-ever (handtinywhite.gif)
        img.src = "data:image/gif;base64,R0lGODlhAQABAIABAP///wAAACwAAAAAAQABAAACAkQBADs=";
        img.width = 1;
        img.height = 1;
    
        img.style.margin = 0;
        img.style.padding = 0;
        img.style.verticalAlign = "baseline";

        span.style.fontFamily = font;
        span.style.fontSize = fontSize;
        span.style.margin = 0;
        span.style.padding = 0;
        
 
    
    
        span.appendChild(doc.createTextNode('Hidden Text'));
        container.appendChild(span);
        container.appendChild(img);
        baseline = (img.offsetTop - span.offsetTop) + 1;
    
        container.removeChild(span);
        container.appendChild(doc.createTextNode('Hidden Text'));
    
        container.style.lineHeight = "normal";
        img.style.verticalAlign = "super";
        
        middle = (img.offsetTop-container.offsetTop) + 1;
        metricsObj = {
            baseline: baseline,
            lineWidth: 1,
            middle: middle
        };
    
    
        fontData[font + "-" + fontSize] = metricsObj;
        
        body.removeChild(container);

        return metricsObj;
    
    }
    
        
    function drawText(currentText, x, y, ctx){       
        if (trimText(currentText).length>0) {	
            ctx.fillText(currentText,x,y);
            numDraws+=1;
        }           
    }
    
    
    function renderText(el, textNode, stack) {
        var ctx = stack.ctx,
        family = getCSS(el, "fontFamily"),
        size = getCSS(el, "fontSize"),
        color = getCSS(el, "color"),
        text_decoration = getCSS(el, "textDecoration"),
        text_align = getCSS(el, "textAlign"),
        letter_spacing = getCSS(el, "letterSpacing"),
        bounds,
        text,
        metrics,
        renderList,
        listLen,
        bold = getCSS(el, "fontWeight"),
        font_style = getCSS(el, "fontStyle"),
        font_variant = getCSS(el, "fontVariant"),
        align = false,
        newTextNode,
        textValue,
        textOffset = 0,
        oldTextNode,
        c,
        range,
        parent,
        wrapElement,
        backupText;

        // apply text-transform:ation to the text
        
        
        
        textNode.nodeValue = textTransform(textNode.nodeValue, getCSS(el, "textTransform"));
        text = trimText(textNode.nodeValue);
	
        if (text.length>0){
         
            if (text_decoration !== "none"){
                metrics = fontMetrics(family, size);         
            }    
                
            text_align = text_align.replace(["-webkit-auto"],["auto"]);

            if (options.letterRendering === false && /^(left|right|justify|auto)$/.test(text_align) && /^(normal|none)$/.test(letter_spacing)){
                // this.setContextVariable(ctx,"textAlign",text_align);  
                renderList = textNode.nodeValue.split(/(\b| )/);
           
            }else{
                //  this.setContextVariable(ctx,"textAlign","left");
                renderList = textNode.nodeValue.split("");
            }
                     
            switch(parseInt(bold, 10)){
                case 401:
                    bold = "bold";
                    break;
                case 400:
                    bold = "normal";
                    break;
            }

            ctx.setVariable("fillStyle", color);  
            
            /*
              need to be defined in the order as defined in http://www.w3.org/TR/CSS21/fonts.html#font-shorthand
              to properly work in Firefox
            */     
            ctx.setVariable("font", font_style+ " " + font_variant  + " " + bold + " " + size + " " + family);
                              
            if (align){
                ctx.setVariable("textAlign", "right");
            }else{
                ctx.setVariable("textAlign", "left");
            }

        
            /*
        if (stack.clip){
        ctx.rect (stack.clip.left, stack.clip.top, stack.clip.width, stack.clip.height);
        ctx.clip();
        }
             */
       
      
            oldTextNode = textNode;
           
            
            for ( c=0, listLen = renderList.length; c < listLen; c+=1 ) {
                textValue = null;
    
     
                    
                if (support.rangeBounds){
                    // getBoundingClientRect is supported for ranges
                    if (text_decoration !== "none" || trimText(renderList[c]).length !== 0) {
                        textValue = renderList[c];
                        if (doc.createRange){
                            range = doc.createRange();

                            range.setStart(textNode, textOffset);
                            range.setEnd(textNode, textOffset + textValue.length);
                        }else{
                            // TODO add IE support
                            range = body.createTextRange();
                        }
                        
                        if (range.getBoundingClientRect()) {
                            bounds = range.getBoundingClientRect();
                        }else{
                            bounds = {};
                        }
                        
                    }
                }else{
                    // it isn't supported, so let's wrap it inside an element instead and get the bounds there
               
                    // IE 9 bug
                    if (typeof oldTextNode.nodeValue !== "string" ){
                        continue;
                    }
               
                    newTextNode = oldTextNode.splitText(renderList[c].length);
               
                    parent = oldTextNode.parentNode;
                    wrapElement = doc.createElement('wrapper');
                    backupText = oldTextNode.cloneNode(true);

                    wrapElement.appendChild(oldTextNode.cloneNode(true));
                    parent.replaceChild(wrapElement, oldTextNode);
                                    
                    bounds = _html2canvas.Util.Bounds(wrapElement);
                        
                    textValue = oldTextNode.nodeValue;
                        
                    oldTextNode = newTextNode;
                    parent.replaceChild(backupText, wrapElement);    
                   
                        
                }
            
                if (textValue !== null){
                    drawText(textValue, bounds.left, bounds.bottom, ctx);
                }

                switch(text_decoration) {
                    case "underline":	
                        // Draws a line at the baseline of the font
                        // TODO As some browsers display the line as more than 1px if the font-size is big, need to take that into account both in position and size         
                        renderRect(ctx, bounds.left, Math.round(bounds.top + metrics.baseline + metrics.lineWidth), bounds.width, 1, color);
                        break;
                    case "overline":
                        renderRect(ctx, bounds.left, bounds.top, bounds.width, 1, color);
                        break;
                    case "line-through":
                        // TODO try and find exact position for line-through
                        renderRect(ctx, bounds.left, Math.ceil(bounds.top + metrics.middle + metrics.lineWidth), bounds.width, 1, color);
                        break;
                    
                }	
                
                
            
              
                  
                textOffset += renderList[c].length;
                  
            }
        
         
					
        }
			
    }
    
    function listPosition (element, val) {
        var boundElement = doc.createElement( "boundelement" ),
        type,
        bounds;
        
        boundElement.style.display = "inline";
        //boundElement.style.width = "1px";
        //boundElement.style.height = "1px";
    
        type = element.style.listStyleType;
        element.style.listStyleType = "none";
    
        boundElement.appendChild( doc.createTextNode( val ) );
    

        element.insertBefore(boundElement, element.firstChild);

    
        bounds = _html2canvas.Util.Bounds( boundElement );
        element.removeChild( boundElement );
        element.style.listStyleType = type;
        return bounds;

    }
    
   
    function renderListItem(element, stack, elBounds) {
    
  
        var position = getCSS(element, "listStylePosition"),
        x,
        y,
        type = getCSS(element, "listStyleType"),
        currentIndex,
        text,
        listBounds,
        bold = getCSS(element, "fontWeight");
    
        if (/^(decimal|decimal-leading-zero|upper-alpha|upper-latin|upper-roman|lower-alpha|lower-greek|lower-latin|lower-roman)$/i.test(type)) {
            
            // TODO remove jQuery dependency
            currentIndex = $(element).index()+1;
            
            switch(type){
                case "decimal":
                    text = currentIndex;
                    break;
                case "decimal-leading-zero":
                    if (currentIndex.toString().length === 1){
                        text = currentIndex = "0" + currentIndex.toString();
                    }else{
                        text = currentIndex.toString();   
                    }     
                    break;
                case "upper-roman":
                    text = _html2canvas.Generate.ListRoman( currentIndex );
                    break;
                case "lower-roman":
                    text = _html2canvas.Generate.ListRoman( currentIndex ).toLowerCase();
                    break;
                case "lower-alpha":
                    text = _html2canvas.Generate.ListAlpha( currentIndex ).toLowerCase();  
                    break;
                case "upper-alpha":
                    text = _html2canvas.Generate.ListAlpha( currentIndex );  
                    break;
            }

           
            text += ". ";
            listBounds = listPosition(element, text);
        
      
    
            switch(bold){
                case 401:
                    bold = "bold";
                    break;
                case 400:
                    bold = "normal";
                    break;
            }
    
 
       
        
            ctx.setVariable( "fillStyle", getCSS(element, "color") );
            ctx.setVariable( "font", getCSS(element, "fontVariant") + " " + bold + " " + getCSS(element, "fontStyle") + " " + getCSS(element, "fontSize") + " " + getCSS(element, "fontFamily") );

        
            if ( position === "inside" ) {
                ctx.setVariable("textAlign", "left");
                //   this.setFont(stack.ctx, element, false);     
                x = elBounds.left;
                
            }else{
                return; 
            /* 
                 TODO really need to figure out some more accurate way to try and find the position. 
                 as defined in http://www.w3.org/TR/CSS21/generate.html#propdef-list-style-position, it does not even have a specified "correct" position, so each browser 
                 may display it whatever way it feels like. 
                 "The position of the list-item marker adjacent to floats is undefined in CSS 2.1. CSS 2.1 does not specify the precise location of the marker box or its position in the painting order"
                
                ctx.setVariable("textAlign", "right");
                //  this.setFont(stack.ctx, element, true);
                x = elBounds.left - 10;
                 */
            }
        
            y = listBounds.bottom;
    
            drawText(text, x, y, ctx);
 
        
        }
 
    
    }
    
    function loadImage (src){
        var img = images[src];
        if (img && img.succeeded === true) {
            return img.img;
        } else {
            return false;
        }
    }
    
    


 
    
    function clipBounds(src, dst){
 
        var x = Math.max(src.left, dst.left),
        y = Math.max(src.top, dst.top),
        x2 = Math.min((src.left + src.width), (dst.left + dst.width)),
        y2 = Math.min((src.top + src.height), (dst.top + dst.height));
 
        return {
            left:x,
            top:y,
            width:x2-x,
            height:y2-y
        };
 
    }
    
    function setZ(zIndex, parentZ){
        // TODO fix static elements overlapping relative/absolute elements under same stack, if they are defined after them
        var newContext;
        if (!parentZ){
            newContext = h2czContext(0);
            return newContext;
        }
    
        if (zIndex !== "auto"){
            needReorder = true;
            newContext = h2czContext(zIndex);
            parentZ.children.push(newContext);     
            return newContext;
        
        }
        
        return parentZ;
        
    }
    
    function renderBorders(el, ctx, bounds, clip){
     
        /*
         *  TODO add support for different border-style's than solid   
         */     
    
        var x = bounds.left,
        y = bounds.top,
        w = bounds.width,
        h = bounds.height,
        borderSide,
        borderData,
        bx,
        by,
        bw,
        bh,
        borderBounds,
        borders = (function(el){
            var borders = [],
            sides = ["Top","Right","Bottom","Left"],
            s;
        
            for (s = 0; s < 4; s+=1){
                borders.push({
                    width: getCSSInt(el, 'border' + sides[s] + 'Width'),
                    color: getCSS(el, 'border' + sides[s] + 'Color')
                });                      
            }
          
            return borders; 
            
        }(el));    
        

        for (borderSide = 0; borderSide < 4; borderSide+=1){
            borderData = borders[borderSide];
                
            if (borderData.width>0){
                bx = x;
                by = y;
                bw = w;
                bh = h - (borders[2].width);
                
                switch(borderSide){
                    case 0:
                        // top border
                        bh = borders[0].width;
                        break;
                    case 1:
                        // right border
                        bx = x + w - (borders[1].width);
                        bw = borders[1].width;                              
                        break;
                    case 2:
                        // bottom border
                        by = (by + h) - (borders[2].width);
                        bh = borders[2].width;
                        break;
                    case 3:
                        // left border
                        bw = borders[3].width;  
                        break;
                }		
                   
                borderBounds = {
                    left:bx,
                    top:by,
                    width: bw,
                    height:bh
                };
                   
                if (clip){
                    borderBounds = clipBounds(borderBounds, clip);
                }
                   
                   
                if (borderBounds.width>0 && borderBounds.height>0){                           
                    renderRect(ctx, bx, by, borderBounds.width, borderBounds.height, borderData.color);
                }
                
          
            }
        }

        return borders;
    
    }
    
    
    function renderFormValue (el, bounds, stack){
    
        var valueWrap = doc.createElement('valuewrap'),
        cssArr = ['lineHeight','textAlign','fontFamily','color','fontSize','paddingLeft','paddingTop','width','height','border','borderLeftWidth','borderTopWidth'],
        i,
        textValue,
        textNode,
        arrLen,
        style;
        
        for (i = 0, arrLen = cssArr.length; i < arrLen; i+=1){
            style = cssArr[i];

            try {
                valueWrap.style[style] = getCSS(el, style);
            } catch( e ) {
                // Older IE has issues with "border"
                h2clog("html2canvas: Parse: Exception caught in renderFormValue: " + e.message);
            }
        }
        
                
        valueWrap.style.borderColor = "black";            
        valueWrap.style.borderStyle = "solid";  
        valueWrap.style.display = "block";
        valueWrap.style.position = "absolute";
        if (/^(submit|reset|button|text|password)$/.test(el.type) || el.nodeName === "SELECT"){
            valueWrap.style.lineHeight = getCSS(el, "height");
        }
  
                
        valueWrap.style.top = bounds.top + "px";
        valueWrap.style.left = bounds.left + "px";
        
        if (el.nodeName === "SELECT"){
            // TODO increase accuracy of text position
            textValue = el.options[el.selectedIndex].text;
        } else{   
            textValue = el.value;   
        }
        textNode = doc.createTextNode(textValue);
    
        valueWrap.appendChild(textNode);
        body.appendChild(valueWrap);
        
                
        renderText(el, textNode, stack);
        body.removeChild(valueWrap);        
  
   
    
    }
    

    
   
    
    function renderImage (ctx, image, sx, sy, sw, sh, dx, dy, dw, dh) {
        ctx.drawImage(
            image,
            sx, //sx
            sy, //sy
            sw, //sw
            sh, //sh
            dx, //dx
            dy, // dy
            dw, //dw
            dh //dh      
            );
        numDraws+=1; 
    
    }

            
    function renderBackgroundRepeat (ctx, image, x, y, width, height, elx, ely){
        var sourceX = 0,
        sourceY=0;
        if (elx-x>0){
            sourceX = elx-x;
        }
        
        if (ely-y>0){
            sourceY = ely-y;
        }

        renderImage(
            ctx,
            image,
            sourceX, // source X
            sourceY, // source Y 
            width-sourceX, // source Width
            height-sourceY, // source Height
            x+sourceX, // destination X
            y+sourceY, // destination Y
            width-sourceX, // destination width
            height-sourceY // destination height
            );
    }
    
    
    function renderBackgroundRepeatY (ctx, image, bgp, x, y, w, h){
        
        var height,
        width = Math.min(image.width,w),bgy;   
            
        bgp.top = bgp.top-Math.ceil(bgp.top/image.height)*image.height;                
        
        
        for(bgy=(y+bgp.top);bgy<h+y;){   
            
         
            if ( Math.floor(bgy+image.height)>h+y){
                height = (h+y)-bgy;
            }else{
                height = image.height;
            }
            renderBackgroundRepeat(ctx,image,x+bgp.left,bgy,width,height,x,y);   
      
            bgy = Math.floor(bgy+image.height); 
                              
        } 
    }
    
    function renderBackgroundRepeatX(ctx, image, bgp, x, y, w, h){
                           
        var height = Math.min(image.height,h),
        width,bgx;             
        
            
        bgp.left = bgp.left-Math.ceil(bgp.left/image.width)*image.width;                
        
        
        for (bgx=(x+bgp.left);bgx<w+x;) {   

            if (Math.floor(bgx+image.width)>w+x){
                width = (w+x)-bgx;
            }else{
                width = image.width;
            }
                
            renderBackgroundRepeat(ctx,image,bgx,(y+bgp.top),width,height,x,y);       
             
            bgx = Math.floor(bgx+image.width); 

                                
        } 
    }
    
    function renderBackground(el,bounds,ctx){
               
        // TODO add support for multi background-images
        var background_image = getCSS(el, "backgroundImage"),
        background_repeat = getCSS(el, "backgroundRepeat").split(",")[0],
        image,
        bgp,
        bgy,
        bgw,
        bgsx,
        bgsy,
        bgdx,
        bgdy,
        bgh,
        h,
        height,
        add;
        
        //   if (typeof background_image !== "undefined" && /^(1|none)$/.test(background_image) === false && /^(-webkit|-moz|linear-gradient|-o-)/.test(background_image)===false){
      
        if ( !/data:image\/.*;base64,/i.test(background_image) && !/^(-webkit|-moz|linear-gradient|-o-)/.test(background_image) ) {   
            background_image = background_image.split(",")[0];
        }
        
        if ( typeof background_image !== "undefined" && /^(1|none)$/.test( background_image ) === false ) {
            background_image = _html2canvas.Util.backgroundImage( background_image );
            image = loadImage( background_image );
					

            bgp = _html2canvas.Util.BackgroundPosition(el, bounds, image);
            
            // TODO add support for background-origin
            if ( image ){
                switch ( background_repeat ) {
					
                    case "repeat-x":
                        renderBackgroundRepeatX( ctx, image, bgp, bounds.left, bounds.top, bounds.width, bounds.height );                     
                        break;
                         
                    case "repeat-y":
                        renderBackgroundRepeatY( ctx, image, bgp, bounds.left, bounds.top, bounds.width, bounds.height );                                             
                        break;
                          
                    case "no-repeat":
                        /*
                    this.drawBackgroundRepeat(
                        ctx,
                        image,
                        bgp.left+bounds.left, // sx
                        bgp.top+bounds.top, // sy
                        Math.min(bounds.width,image.width),
                        Math.min(bounds.height,image.height),
                        bounds.left,
                        bounds.top
                        );*/
                            
      
                        // console.log($(el).css('background-image'));
                        bgw = bounds.width - bgp.left;
                        bgh = bounds.height - bgp.top;
                        bgsx = bgp.left;
                        bgsy = bgp.top;
                        bgdx = bgp.left+bounds.left;
                        bgdy = bgp.top+bounds.top;

                        //
                        //     bgw = Math.min(bgw,image.width);
                        //  bgh = Math.min(bgh,image.height);     
                    
                        if (bgsx<0){
                            bgsx = Math.abs(bgsx);
                            bgdx += bgsx; 
                            bgw = Math.min(bounds.width,image.width-bgsx);
                        }else{
                            bgw = Math.min(bgw,image.width);
                            bgsx = 0;
                        }
                           
                        if (bgsy<0){
                            bgsy = Math.abs(bgsy);
                            bgdy += bgsy; 
                            // bgh = bgh-bgsy;
                            bgh = Math.min(bounds.height,image.height-bgsy);
                        }else{
                            bgh = Math.min(bgh,image.height); 
                            bgsy = 0;
                        }    
    

                        if (bgh>0 && bgw > 0){        
                            renderImage(
                                ctx,
                                image,
                                bgsx, // source X : 0 
                                bgsy, // source Y : 1695
                                bgw, // source Width : 18
                                bgh, // source Height : 1677
                                bgdx, // destination X :906
                                bgdy, // destination Y : 1020
                                bgw, // destination width : 18
                                bgh // destination height : 1677
                                );
                                                                       
                        }
                        break;
                    default:
                        
                        
                              
                        bgp.top = bgp.top-Math.ceil(bgp.top/image.height)*image.height;                
                        
                        
                        for(bgy=(bounds.top+bgp.top);bgy<bounds.height+bounds.top;){  
           
                        
           
                            h = Math.min(image.height,(bounds.height+bounds.top)-bgy);
                           
                            
                            if ( Math.floor(bgy+image.height)>h+bgy){
                                height = (h+bgy)-bgy;
                            }else{
                                height = image.height;
                            }
                            // console.log(height);
                            
                            if (bgy<bounds.top){
                                add = bounds.top-bgy;
                                bgy = bounds.top;
                                
                            }else{
                                add = 0;
                            }
                                              
                            renderBackgroundRepeatX(ctx,image,bgp,bounds.left,bgy,bounds.width,height);  
                            if (add>0){
                                bgp.top += add;
                            }
                            bgy = Math.floor(bgy+image.height)-add; 
                        }
                        break;
                        
					
                }	
            }else{
                h2clog("html2canvas: Error loading background:" + background_image);
            //console.log(images);
            }
					
        }
    }


 
    function renderElement(el, parentStack){
		
        var bounds = _html2canvas.Util.Bounds(el), 
        x = bounds.left, 
        y = bounds.top, 
        w = bounds.width, 
        h = bounds.height, 
        image,
        bgcolor = getCSS(el, "backgroundColor"),
        cssPosition = getCSS(el, "position"),
        zindex,
        opacity = getCSS(el, "opacity"),
        stack,
        stackLength,
        borders,
        ctx,
        bgbounds,
        imgSrc,
        paddingLeft,
        paddingTop,
        paddingRight,
        paddingBottom;
        
        if (!parentStack){
            docDim = docSize();
            parentStack = {
                opacity: 1
            };
        }else{
            docDim = {};
        }
        

        //var zindex = this.formatZ(this.getCSS(el,"zIndex"),cssPosition,parentStack.zIndex,el.parentNode);
   
        zindex = setZ( getCSS( el, "zIndex"), parentStack.zIndex );
          


        stack = {
            ctx: h2cRenderContext( docDim.width || w , docDim.height || h ),
            zIndex: zindex,
            opacity: opacity * parentStack.opacity,
            cssPosition: cssPosition
        };
    
    
 
        // TODO correct overflow for absolute content residing under a static position
        
        if (parentStack.clip){
            stack.clip = _html2canvas.Util.Extend( {}, parentStack.clip );
        //stack.clip = parentStack.clip;
        //   stack.clip.height = stack.clip.height - parentStack.borders[2].width;
        } 
 
 
        if ( options.useOverflow === true && /(hidden|scroll|auto)/.test(getCSS(el, "overflow")) === true && /(BODY)/i.test(el.nodeName) === false ){
            if (stack.clip){
                stack.clip = clipBounds(stack.clip, bounds);
            }else{
                stack.clip = bounds;
            }
        }   


        stackLength =  zindex.children.push(stack);
        
        ctx = zindex.children[stackLength-1].ctx; 
    
        ctx.setVariable("globalAlpha", stack.opacity);  

        // draw element borders
        borders = renderBorders(el, ctx, bounds, false);
        stack.borders = borders;

    
        // let's modify clip area for child elements, so borders dont get overwritten
    
        /*
    if (stack.clip){
        stack.clip.width = stack.clip.width-(borders[1].width); 
        stack.clip.height = stack.clip.height-(borders[2].width); 
    }
     */
        if (ignoreElementsRegExp.test(el.nodeName) && options.iframeDefault !== "transparent"){ 
            if (options.iframeDefault === "default"){
                bgcolor = "#efefef";
            }else{
                bgcolor = options.iframeDefault;           
            }
        }
               
        // draw base element bgcolor   

        bgbounds = {
            left: x + borders[3].width,
            top: y + borders[0].width,
            width: w - (borders[1].width + borders[3].width),
            height: h - (borders[0].width + borders[2].width)
        };
        
        //if (this.withinBounds(stack.clip,bgbounds)){  
        
        if (stack.clip){
            bgbounds = clipBounds(bgbounds, stack.clip);
        
        //}    
    
        }
    

        if (bgbounds.height > 0 && bgbounds.width > 0){
            renderRect(
                ctx,
                bgbounds.left,
                bgbounds.top,
                bgbounds.width,
                bgbounds.height,
                bgcolor
                );
           
            renderBackground(el, bgbounds, ctx);     
        }
        
        switch(el.nodeName){
            case "IMG":
                imgSrc = el.getAttribute('src');
                image = loadImage(imgSrc);
                if (image){

                    paddingLeft = getCSSInt(el, 'paddingLeft');
                    paddingTop = getCSSInt(el, 'paddingTop');
                    paddingRight = getCSSInt(el, 'paddingRight');
                    paddingBottom = getCSSInt(el, 'paddingBottom');
                    
                    
                    renderImage(
                        ctx,
                        image,
                        0, //sx
                        0, //sy
                        image.width, //sw
                        image.height, //sh
                        x + paddingLeft + borders[3].width, //dx
                        y + paddingTop + borders[0].width, // dy
                        bounds.width - (borders[1].width + borders[3].width + paddingLeft + paddingRight), //dw
                        bounds.height - (borders[0].width + borders[2].width + paddingTop + paddingBottom) //dh       
                        );
           
                }else{
                    h2clog("html2canvas: Error loading <img>:" + imgSrc);
                }
                break;
            case "INPUT":
                // TODO add all relevant type's, i.e. HTML5 new stuff
                // todo add support for placeholder attribute for browsers which support it
                if (/^(text|url|email|submit|button|reset)$/.test(el.type) && el.value.length > 0){
                
                    renderFormValue(el, bounds, stack);
                

                /*
                 this just doesn't work well enough
                
                this.newText(el,{
                    nodeValue:el.value,
                    splitText: function(){
                        return this;
                    },
                    formValue:true
                },stack);
                 */
                }
                break;
            case "TEXTAREA":
                if (el.value.length > 0){
                    renderFormValue(el, bounds, stack);
                }
                break;
            case "SELECT":
                if (el.options.length > 0){
                    renderFormValue(el, bounds, stack);
                }
                break;
            case "LI":
                renderListItem(el, stack, bgbounds);
                break;
            case "CANVAS":
                paddingLeft = getCSSInt(el, 'paddingLeft');
                paddingTop = getCSSInt(el, 'paddingTop');
                paddingRight = getCSSInt(el, 'paddingRight');
                paddingBottom = getCSSInt(el, 'paddingBottom');
                renderImage(
                    ctx,
                    el,
                    0, //sx
                    0, //sy
                    el.width, //sw
                    el.height, //sh
                    x + paddingLeft + borders[3].width, //dx
                    y + paddingTop + borders[0].width, // dy
                    bounds.width - (borders[1].width + borders[3].width + paddingLeft + paddingRight), //dw
                    bounds.height - (borders[0].width + borders[2].width + paddingTop + paddingBottom) //dh
                    );
                break;
        }

        return zindex.children[stackLength - 1];
    }
    
   
    
    function parseElement (el, stack) {
      
        // skip hidden elements and their children
        if (getCSS(el, 'display') !== "none" && getCSS(el, 'visibility') !== "hidden") { 
     
            stack = renderElement(el, stack) || stack;
          
            ctx = stack.ctx;
    
            if ( !ignoreElementsRegExp.test( el.nodeName ) ) {
                var elementChildren = _html2canvas.Util.Children( el ),
                i,
                node,
                childrenLen;
                for (i = 0, childrenLen = elementChildren.length; i < childrenLen; i+=1) {
                    node = elementChildren[i];
                    
                    if ( node.nodeType === 1 ) {
                        parseElement(node, stack);								
                    }else if ( node.nodeType === 3 ) {   
                        renderText(el, node, stack);
                    }      
                    
                }
               
            } 
        }
    }

    stack = renderElement(element, null);
    
    /*
    SVG powered HTML rendering, non-tainted canvas available from FF 11+ onwards
    */
    
    if ( support.svgRendering ) {
        (function( body ){
            var img = new Image(),
            size =  docSize(),
            html = "";
           
            function parseDOM( el ) {
                var children = _html2canvas.Util.Children( el ),
                len = children.length,
                attr,
                a,
                alen,
                elm,
                i;
                for ( i = 0; i < len; i+=1 ) {
                    elm = children[ i ];
                    if ( elm.nodeType === 3 ) {
                        // Text node
                        
                        html += elm.nodeValue.replace(/\</g,"&lt;").replace(/\>/g,"&gt;");
                    } else if ( elm.nodeType === 1 ) {
                        // Element
                        if ( !/^(script|meta|title)$/.test(elm.nodeName.toLowerCase()) ) {                
                            
                            html += "<" + elm.nodeName.toLowerCase();
                        
                            // add attributes
                            if ( elm.hasAttributes() ) {
                                attr = elm.attributes;
                                alen = attr.length;
                                for ( a = 0; a < alen; a+=1 ) {
                                    html += " " + attr[ a ].name + '="' + attr[ a ].value + '"';
                                }
                            }
                        
                           
                            html += '>';
                           
                            parseDOM( elm );
                            
                            
                            html += "</" + elm.nodeName.toLowerCase() + ">";
                        }
                    }
                    
                }
                
            }
           
            parseDOM( body );
            img.src = [
            "data:image/svg+xml,",
            "<svg xmlns='http://www.w3.org/2000/svg' version='1.1' width='" + size.width + "' height='" + size.height + "'>",
            "<foreignObject width='" + size.width + "' height='" + size.height + "'>",
            "<html xmlns='http://www.w3.org/1999/xhtml' style='margin:0;'>",
            html.replace(/\#/g,"%23"),
            "</html>",
            "</foreignObject>",
            "</svg>"
            ].join("");
            
           

           
            img.onload = function() {
                stack.svgRender = img;
            };
            
        })( document.documentElement );
        
    }
    
    
    // parse every child element
    for (i = 0, children = element.children, childrenLen = children.length; i < childrenLen; i+=1){      
        parseElement(children[i], stack);  
    }
    
    
    stack.backgroundColor = getCSS( document.documentElement, "backgroundColor" );
    
    return stack;

};

function h2czContext(zindex) {
    return {
        zindex: zindex,
        children: []
    };  
}
/*
  html2canvas v0.33 <http://html2canvas.hertzen.com>
  Copyright (c) 2011 Niklas von Hertzen. All rights reserved.
  http://www.twitter.com/niklasvh

  Released under MIT License
*/

_html2canvas.Preload = function( options ) {

    var images = {
        numLoaded: 0,   // also failed are counted here
        numFailed: 0,
        numTotal: 0,
        cleanupDone: false
    },
    pageOrigin,
    methods,
    i,
    count = 0,
    element = options.elements[0] || document.body,
    doc = element.ownerDocument,
    domImages = doc.images, // TODO probably should limit it to images present in the element only
    imgLen = domImages.length,
    link = doc.createElement("a"),
    supportCORS = (function( img ){
        return (img.crossOrigin !== undefined);
    })(new Image()),
    timeoutTimer;

    link.href = window.location.href;
    pageOrigin  = link.protocol + link.host;






    function isSameOrigin(url){
        link.href = url;
        link.href = link.href; // YES, BELIEVE IT OR NOT, that is required for IE9 - http://jsfiddle.net/niklasvh/2e48b/
        var origin = link.protocol + link.host;
        return (origin === pageOrigin);
    }

    function start(){
        h2clog("html2canvas: start: images: " + images.numLoaded + " / " + images.numTotal + " (failed: " + images.numFailed + ")");
        if (!images.firstRun && images.numLoaded >= images.numTotal){
            h2clog("Finished loading images: # " + images.numTotal + " (failed: " + images.numFailed + ")");

            if (typeof options.complete === "function"){
                options.complete(images);
            }

        }
    }

    // TODO modify proxy to serve images with CORS enabled, where available
    function proxyGetImage(url, img, imageObj){
        var callback_name,
        scriptUrl = options.proxy,
        script;

        link.href = url;
        url = link.href; // work around for pages with base href="" set - WARNING: this may change the url

        callback_name = 'html2canvas_' + (count++);
        imageObj.callbackname = callback_name;

        if (scriptUrl.indexOf("?") > -1) {
            scriptUrl += "&";
        } else {
            scriptUrl += "?";
        }
        scriptUrl += 'url=' + encodeURIComponent(url) + '&callback=' + callback_name;
        script = doc.createElement("script");

        window[callback_name] = function(a){
            if (a.substring(0,6) === "error:"){
                imageObj.succeeded = false;
                images.numLoaded++;
                images.numFailed++;
                start();
            } else {
                setImageLoadHandlers(img, imageObj);
                img.src = a;
            }
            window[callback_name] = undefined; // to work with IE<9  // NOTE: that the undefined callback property-name still exists on the window object (for IE<9)
            try {
                delete window[callback_name];  // for all browser that support this
            } catch(ex) {}
            script.parentNode.removeChild(script);
            script = null;
            delete imageObj.script;
            delete imageObj.callbackname;
        };

        script.setAttribute("type", "text/javascript");
        script.setAttribute("src", scriptUrl);
        imageObj.script = script;
        window.document.body.appendChild(script);

    }

    function getImages (el) {



        // if (!this.ignoreRe.test(el.nodeName)){
        //

        var contents = _html2canvas.Util.Children(el),
        i,
        contentsLen = contents.length,
        background_image,
        src,
        img,
        elNodeType = false;

        for (i = 0;  i < contentsLen; i+=1 ){
            // var ignRe = new RegExp("("+this.ignoreElements+")");
            // if (!ignRe.test(element.nodeName)){
            getImages(contents[i]);
        // }
        }

        // }
        try {
            elNodeType = el.nodeType;
        } catch (ex) {
            elNodeType = false;
            h2clog("html2canvas: failed to access some element's nodeType - Exception: " + ex.message);
        }

        if (elNodeType === 1 || elNodeType === undefined){

            // opera throws exception on external-content.html
            try {
                background_image = _html2canvas.Util.getCSS(el, 'backgroundImage');
            }catch(e) {
                h2clog("html2canvas: failed to get background-image - Exception: " + e.message);
            }
            if ( background_image && background_image !== "1" && background_image !== "none" ) {

                // TODO add multi image background support

                if (/^(-webkit|-o|-moz|-ms|linear)-/.test( background_image )) {
                    //       if (background_image.substring(0,7) === "-webkit" || background_image.substring(0,3) === "-o-" || background_image.substring(0,4) === "-moz") {

                    img = _html2canvas.Generate.Gradient( background_image, _html2canvas.Util.Bounds( el ) );

                    if ( img !== undefined ){
                        images[background_image] = {
                            img: img,
                            succeeded: true
                        };
                        images.numTotal++;
                        images.numLoaded++;
                        start();

                    }

                } else {
                    src = _html2canvas.Util.backgroundImage(background_image.match(/data:image\/.*;base64,/i) ? background_image : background_image.split(",")[0]);
                    methods.loadImage(src);
                }

            /*
            if (background_image && background_image !== "1" && background_image !== "none" && background_image.substring(0,7) !== "-webkit" && background_image.substring(0,3)!== "-o-" && background_image.substring(0,4) !== "-moz"){
                // TODO add multi image background support
                src = _html2canvas.Util.backgroundImage(background_image.split(",")[0]);
                methods.loadImage(src);            */
            }
        }
    }

    function setImageLoadHandlers(img, imageObj) {
        img.onload = function() {
            if ( imageObj.timer !== undefined ) {
                // CORS succeeded
                window.clearTimeout( imageObj.timer );
            }

            images.numLoaded++;
            imageObj.succeeded = true;
            img.onerror = img.onload = null;
            start();
        };
        img.onerror = function() {

            if (img.crossOrigin === "anonymous") {
                // CORS failed
                window.clearTimeout( imageObj.timer );

                // let's try with proxy instead
                if ( options.proxy ) {
                    var src = img.src;
                    img = new Image();
                    imageObj.img = img;
                    img.src = src;

                    proxyGetImage( img.src, img, imageObj );
                    return;
                }
            }


            images.numLoaded++;
            images.numFailed++;
            imageObj.succeeded = false;
            img.onerror = img.onload = null;
            start();

        };

    // TODO Opera has no load/error event for SVG images

    // Opera ninja onload's cached images
    /*
        window.setTimeout(function(){
            if ( img.width !== 0 && imageObj.succeeded === undefined ) {
                img.onload();
            }
        }, 100); // needs a reflow for base64 encoded images? interestingly timeout of 0 doesn't work but 1 does.
        */
    }


    methods = {
        loadImage: function( src ) {
            var img, imageObj;
            if ( src && images[src] === undefined ) {
                img = new Image();
                if ( src.match(/data:image\/.*;base64,/i) ) {
                    img.src = src.replace(/url\(['"]{0,}|['"]{0,}\)$/ig, '');
                    imageObj = images[src] = {
                        img: img
                    };
                    images.numTotal++;
                    setImageLoadHandlers(img, imageObj);
                } else if ( isSameOrigin( src ) || options.allowTaint ===  true ) {
                    imageObj = images[src] = {
                        img: img
                    };
                    images.numTotal++;
                    setImageLoadHandlers(img, imageObj);
                    img.src = src;
                } else if ( supportCORS && !options.allowTaint && options.useCORS ) {
                    // attempt to load with CORS

                    img.crossOrigin = "anonymous";
                    imageObj = images[src] = {
                        img: img
                    };
                    images.numTotal++;
                    setImageLoadHandlers(img, imageObj);
                    img.src = src;

                    // work around for https://bugs.webkit.org/show_bug.cgi?id=80028
                    img.customComplete = function () {
                        if (!this.img.complete) {
                            this.timer = window.setTimeout(this.img.customComplete, 100);
                        } else {
                            this.img.onerror();
                        }
                    }.bind(imageObj);
                    img.customComplete();

                } else if ( options.proxy ) {
                    imageObj = images[src] = {
                        img: img
                    };
                    images.numTotal++;
                    proxyGetImage( src, img, imageObj );
                }
            }

        },
        cleanupDOM: function(cause) {
            var img, src;
            if (!images.cleanupDone) {
                if (cause && typeof cause === "string") {
                    h2clog("html2canvas: Cleanup because: " + cause);
                } else {
                    h2clog("html2canvas: Cleanup after timeout: " + options.timeout + " ms.");
                }

                for (src in images) {
                    if (images.hasOwnProperty(src)) {
                        img = images[src];
                        if (typeof img === "object" && img.callbackname && img.succeeded === undefined) {
                            // cancel proxy image request
                            window[img.callbackname] = undefined; // to work with IE<9  // NOTE: that the undefined callback property-name still exists on the window object (for IE<9)
                            try {
                                delete window[img.callbackname];  // for all browser that support this
                            } catch(ex) {}
                            if (img.script && img.script.parentNode) {
                                img.script.setAttribute("src", "about:blank");  // try to cancel running request
                                img.script.parentNode.removeChild(img.script);
                            }
                            images.numLoaded++;
                            images.numFailed++;
                            h2clog("html2canvas: Cleaned up failed img: '" + src + "' Steps: " + images.numLoaded + " / " + images.numTotal);
                        }
                    }
                }

                // cancel any pending requests
                if(window.stop !== undefined) {
                    window.stop();
                } else if(document.execCommand !== undefined) {
                    document.execCommand("Stop", false);
                }
                if (document.close !== undefined) {
                    document.close();
                }
                images.cleanupDone = true;
                if (!(cause && typeof cause === "string")) {
                    start();
                }
            }
        },
        renderingDone: function() {
            if (timeoutTimer) {
                window.clearTimeout(timeoutTimer);
            }
        }

    };

    if (options.timeout > 0) {
        timeoutTimer = window.setTimeout(methods.cleanupDOM, options.timeout);
    }
    h2clog('html2canvas: Preload starts: finding background-images');
    images.firstRun = true;

    getImages( element );

    h2clog('html2canvas: Preload: Finding images');
    // load <img> images
    for (i = 0; i < imgLen; i+=1){
        methods.loadImage( domImages[i].getAttribute( "src" ) );
    }

    images.firstRun = false;
    h2clog('html2canvas: Preload: Done.');
    if ( images.numTotal === images.numLoaded ) {
        start();
    }

    return methods;

};



/*
  html2canvas v0.33 <http://html2canvas.hertzen.com>
  Copyright (c) 2011 Niklas von Hertzen. All rights reserved.
  http://www.twitter.com/niklasvh

  Released under MIT License
*/
function h2cRenderContext(width, height) {
    var storage = [];
    return {
        storage: storage,
        width: width,
        height: height,
        fillRect: function () {
            storage.push({
                type: "function",
                name: "fillRect",
                'arguments': arguments
            });
        },
        drawImage: function () {
            storage.push({
                type: "function",
                name: "drawImage",
                'arguments': arguments
            });
        },
        fillText: function () {
            storage.push({
                type: "function",
                name: "fillText",
                'arguments': arguments
            });
        },
        setVariable: function (variable, value) {
            storage.push({
                type: "variable",
                name: variable,
                'arguments': value
            });
        }
    };
}
/*
  html2canvas v0.33 <http://html2canvas.hertzen.com>
  Copyright (c) 2011 Niklas von Hertzen. All rights reserved.
  http://www.twitter.com/niklasvh

  Released under MIT License
*/
_html2canvas.Renderer = function(parseQueue, options){


    var queue = [];
   
    function sortZ(zStack){
        var subStacks = [],
        stackValues = [],
        zStackChildren = zStack.children,
        s,
        i,
        stackLen,
        zValue,
        zLen,
        stackChild,
        b, 
        subStackLen;
        

        for (s = 0, zLen = zStackChildren.length; s < zLen; s+=1){
            
            stackChild = zStackChildren[s];
            
            if (stackChild.children && stackChild.children.length > 0){
                subStacks.push(stackChild);
                stackValues.push(stackChild.zindex);
            }else{         
                queue.push(stackChild);
            }  
           
        }
      
        stackValues.sort(function(a, b) {
            return a - b;
        });
    
        for (i = 0, stackLen = stackValues.length; i < stackLen; i+=1){
            zValue = stackValues[i];
            for (b = 0, subStackLen = subStacks.length; b <= subStackLen; b+=1){
                
                if (subStacks[b].zindex === zValue){
                    stackChild = subStacks.splice(b, 1);
                    sortZ(stackChild[0]);
                    break;
                  
                }
            }        
        }
  
    }


    sortZ(parseQueue.zIndex);
    if ( typeof options._renderer._create !== "function" ) {
        throw new Error("Invalid renderer defined");
    }
    return options._renderer._create( parseQueue, options, document, queue, _html2canvas );

};
/*
  html2canvas v0.33 <http://html2canvas.hertzen.com>
  Copyright (c) 2011 Niklas von Hertzen. All rights reserved.
  http://www.twitter.com/niklasvh

  Released under MIT License
*/


html2canvas = function( elements, opts ) {
    
    var queue,
    canvas,
    options = {
        // general
        logging: false,
        elements: elements,
        
        // preload options
        proxy: "http://html2canvas.appspot.com/",
        timeout: 0,    // no timeout
        useCORS: false, // try to load images as CORS (where available), before falling back to proxy
        allowTaint: false, // whether to allow images to taint the canvas, won't need proxy if set to true
        
        // parse options
        svgRendering: false, // use svg powered rendering where available (FF11+)
        iframeDefault: "default",
        ignoreElements: "IFRAME|OBJECT|PARAM",
        useOverflow: true,
        letterRendering: false,

        // render options

        flashcanvas: undefined, // path to flashcanvas
        width: null,
        height: null,
        taintTest: true, // do a taint test with all images before applying to canvas
		renderer: "Canvas"	
    }, renderer;
    
    options = _html2canvas.Util.Extend(opts, options);
   
	if (typeof options.renderer === "string" && _html2canvas.Renderer[options.renderer] !== undefined) {
		options._renderer = _html2canvas.Renderer[options.renderer]( options );
	} else if (typeof options.renderer === "function") {
		options._renderer = options.renderer( options );
	} else {
		throw("Unknown renderer");
	}

    _html2canvas.logging = options.logging;
    options.complete = function( images ) {
        
        if (typeof options.onpreloaded === "function") {
            if ( options.onpreloaded( images ) === false ) {
                return;
            }
        }
        queue = _html2canvas.Parse( images, options );
            
        if (typeof options.onparsed === "function") {
            if ( options.onparsed( queue ) === false ) {
                return;
            }
        }
          
        canvas = _html2canvas.Renderer( queue, options );
        
        if (typeof options.onrendered === "function") {
            options.onrendered( canvas );
        }
        
        
    };
    
    // for pages without images, we still want this to be async, i.e. return methods before executing
    window.setTimeout( function(){
        _html2canvas.Preload( options );
    }, 0 ); 
        
    return {
        render: function( queue, opts ) {
            return _html2canvas.Renderer( queue, _html2canvas.Util.Extend(opts, options) );
        },
        parse: function( images, opts ) {
            return _html2canvas.Parse( images, _html2canvas.Util.Extend(opts, options) );
        },
        preload: function( opts ) {
            return _html2canvas.Preload( _html2canvas.Util.Extend(opts, options) );
        },
        log: h2clog
    };
};

html2canvas.log = h2clog; // for renderers
html2canvas.Renderer = {
    Canvas: undefined // We are assuming this will be used
};
/*
  html2canvas v0.33 <http://html2canvas.hertzen.com>
  Copyright (c) 2011 Niklas von Hertzen. All rights reserved.
  http://www.twitter.com/niklasvh

  Released under MIT License
*/


_html2canvas.Renderer.Canvas = function( options ) {

    options = options || {};
    
    var doc = document,
    canvas = options.canvas || doc.createElement('canvas'),
    usingFlashcanvas = false,
    _createCalled = false,
    canvasReadyToDraw = false,
    methods,
    flashMaxSize = 2880; // flash bitmap limited to 2880x2880px // http://stackoverflow.com/questions/2033792/argumenterror-error-2015-invalid-bitmapdata

    
    if (canvas.getContext){
        h2clog("html2canvas: Renderer: using canvas renderer");
        canvasReadyToDraw = true;
    } else if ( options.flashcanvas !== undefined ){
        usingFlashcanvas = true;
        h2clog("html2canvas: Renderer: canvas not available, using flashcanvas");
        var script = doc.createElement("script");
        script.src = options.flashcanvas;
                
        script.onload = (function(script, func){
            var intervalFunc; 
    
            if (script.onload === undefined) {
                // IE lack of support for script onload
                                
                if( script.onreadystatechange !== undefined ) {
                                    
                    intervalFunc = function() {
                        if (script.readyState !== "loaded" && script.readyState !== "complete") {
                            window.setTimeout( intervalFunc, 250 );
                                    
                        } else {
                            // it is loaded
                            func();
                                    
                        }
              
                    };
                                    
                    window.setTimeout( intervalFunc, 250 );

                } else {
                    h2clog("html2canvas: Renderer: Can't track when flashcanvas is loaded");
                }
                                
            } else {
                return func;
            }
                            
        })(script, function(){
                    
            if (typeof window.FlashCanvas !== "undefined") {
                h2clog("html2canvas: Renderer: Flashcanvas initialized");
                window.FlashCanvas.initElement( canvas );
                
                canvasReadyToDraw = true;
                if ( _createCalled !== false ) {
                    methods._create.apply( null, _createCalled );
                }
            }
        });
                
        doc.body.appendChild( script );

    }       

    methods = {
        _create: function( zStack, options, doc, queue, _html2canvas ) {
            
            if ( !canvasReadyToDraw ) {
                _createCalled = arguments;
                return canvas;
            }
            
            var ctx = canvas.getContext("2d"),
            storageContext,
            i,
            queueLen,
            a,
            newCanvas,
            bounds,
            testCanvas = document.createElement("canvas"),
            hasCTX = ( testCanvas.getContext !== undefined ),
            storageLen,
            renderItem,
            testctx = ( hasCTX ) ? testCanvas.getContext("2d") : {},
            safeImages = [],
            fstyle;
            
            canvas.width = canvas.style.width = (!usingFlashcanvas) ? options.width || zStack.ctx.width : Math.min(flashMaxSize, (options.width || zStack.ctx.width) );
            canvas.height = canvas.style.height = (!usingFlashcanvas) ? options.height || zStack.ctx.height : Math.min(flashMaxSize, (options.height || zStack.ctx.height) );
   
            fstyle = ctx.fillStyle;
            ctx.fillStyle = zStack.backgroundColor;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = fstyle;

            if ( options.svgRendering && zStack.svgRender !== undefined ) {
                // TODO: enable async rendering to support this 
                ctx.drawImage( zStack.svgRender, 0, 0 );
            } else {
                for ( i = 0, queueLen = queue.length; i < queueLen; i+=1 ) {
            
                    storageContext = queue.splice(0, 1)[0];
                    storageContext.canvasPosition = storageContext.canvasPosition || {};   
           
                    //this.canvasRenderContext(storageContext,parentctx);           

                    // set common settings for canvas
                    ctx.textBaseline = "bottom";
   
                    if (storageContext.clip){
                        ctx.save();
                        ctx.beginPath();
                        // console.log(storageContext);
                        ctx.rect(storageContext.clip.left, storageContext.clip.top, storageContext.clip.width, storageContext.clip.height);
                        ctx.clip();
        
                    }
        
                    if (storageContext.ctx.storage){
               
                        for (a = 0, storageLen = storageContext.ctx.storage.length; a < storageLen; a+=1){
                    
                            renderItem = storageContext.ctx.storage[a];
                    
                    
                            switch(renderItem.type){
                                case "variable":
                                    ctx[renderItem.name] = renderItem['arguments'];              
                                    break;
                                case "function":
                                    if (renderItem.name === "fillRect") {
                                
                                        if (!usingFlashcanvas || renderItem['arguments'][0] + renderItem['arguments'][2] < flashMaxSize  && renderItem['arguments'][1] + renderItem['arguments'][3] < flashMaxSize) {
                                            ctx.fillRect.apply( ctx, renderItem['arguments'] );
                                        }
                                    }else if(renderItem.name === "fillText") {
                                        if (!usingFlashcanvas || renderItem['arguments'][1] < flashMaxSize  && renderItem['arguments'][2] < flashMaxSize) {
                                            ctx.fillText.apply( ctx, renderItem['arguments'] );
                                        }
                                    }else if(renderItem.name === "drawImage") {
 
                                        if (renderItem['arguments'][8] > 0 && renderItem['arguments'][7]){    
                                            if ( hasCTX && options.taintTest ) {
                                                if ( safeImages.indexOf( renderItem['arguments'][ 0 ].src ) === -1 ) {
                                                    testctx.drawImage( renderItem['arguments'][ 0 ], 0, 0 );
                                                    try {
                                                        testctx.getImageData( 0, 0, 1, 1 );
                                                    } catch(e) {      
                                                        testCanvas = doc.createElement("canvas");
                                                        testctx = testCanvas.getContext("2d");
                                                        continue;
                                                    }
                                          
                                                    safeImages.push( renderItem['arguments'][ 0 ].src );
                                        
                                                }
                                            }
                                            ctx.drawImage.apply( ctx, renderItem['arguments'] );                                   
                                        }      
                                    }
                       
  
                                    break;
                                default:
                               
                            }
            
                        }

                    }  
                    if (storageContext.clip){
                        ctx.restore();
                    }
    
                }  
            }
            
            h2clog("html2canvas: Renderer: Canvas renderer done - returning canvas obj");
        
            queueLen = options.elements.length;

            if (queueLen === 1) {
                if (typeof options.elements[ 0 ] === "object" && options.elements[ 0 ].nodeName !== "BODY" && usingFlashcanvas === false) {
                    // crop image to the bounds of selected (single) element
                    bounds = _html2canvas.Util.Bounds( options.elements[ 0 ] );
                    newCanvas = doc.createElement('canvas');
                    newCanvas.width = bounds.width;
                    newCanvas.height = bounds.height;
                    ctx = newCanvas.getContext("2d");
                
                    ctx.drawImage( canvas, bounds.left, bounds.top, bounds.width, bounds.height, 0, 0, bounds.width, bounds.height );
                    canvas = null;
                    return newCanvas;
                }
            } /*else {
        // TODO clip and resize multiple elements
        
            for ( i = 0; i < queueLen; i+=1 ) {
                if (options.elements[ i ] instanceof Element) {
                
                }
              
            }
        }
        */
       
       
        
            return canvas;
        }
    };
    
    return methods;

};
/*
  html2canvas v0.33 <http://html2canvas.hertzen.com>
  Copyright (c) 2011 Niklas von Hertzen. All rights reserved.
  http://www.twitter.com/niklasvh

  Released under MIT License
*/


// WARNING THIS file is outdated, and hasn't been tested in quite a while

_html2canvas.Renderer.SVG = function( options ) {

    options = options || {};
    
    var doc = document,
    svgNS = "http://www.w3.org/2000/svg",
    svg = doc.createElementNS(svgNS, "svg"),
    xlinkNS = "http://www.w3.org/1999/xlink",
    defs = doc.createElementNS(svgNS, "defs"),
    i,
    a,
    queueLen,
    storageLen,
    storageContext,
    renderItem,
    el,
    settings = {},
    text,
    fontStyle,
    clipId = 0,
    methods;
    
    
    methods = {
        _create: function( zStack, options, doc, queue, _html2canvas ) {
            svg.setAttribute("version", "1.1");
            svg.setAttribute("baseProfile", "full");

            svg.setAttribute("viewBox", "0 0 " + Math.max(zStack.ctx.width, options.width) + " " + Math.max(zStack.ctx.height, options.height));
            svg.setAttribute("width", Math.max(zStack.ctx.width, options.width) + "px");
            svg.setAttribute("height", Math.max(zStack.ctx.height, options.height) + "px");
            svg.setAttribute("preserveAspectRatio", "none");
            svg.appendChild(defs);
        
        
        
            for (i = 0, queueLen = queue.length; i < queueLen; i+=1){
            
                storageContext = queue.splice(0, 1)[0];
                storageContext.canvasPosition = storageContext.canvasPosition || {};   
           
                //this.canvasRenderContext(storageContext,parentctx);           

   
                /*
            if (storageContext.clip){
                ctx.save();
                ctx.beginPath();
                // console.log(storageContext);
                ctx.rect(storageContext.clip.left, storageContext.clip.top, storageContext.clip.width, storageContext.clip.height);
                ctx.clip();
        
            }*/
        
                if (storageContext.ctx.storage){
               
                    for (a = 0, storageLen = storageContext.ctx.storage.length; a < storageLen; a+=1){
                    
                        renderItem = storageContext.ctx.storage[a];
                    
                   
                    
                        switch(renderItem.type){
                            case "variable":
                                settings[renderItem.name] = renderItem['arguments'];              
                                break;
                            case "function":
                                if (renderItem.name === "fillRect") {
                                
                                    el = doc.createElementNS(svgNS, "rect");
                                    el.setAttribute("x", renderItem['arguments'][0]);
                                    el.setAttribute("y", renderItem['arguments'][1]);
                                    el.setAttribute("width", renderItem['arguments'][2]);
                                    el.setAttribute("height", renderItem['arguments'][3]);
                                    el.setAttribute("fill",  settings.fillStyle);
                                    svg.appendChild(el);

                                } else if(renderItem.name === "fillText") {
                                    el = doc.createElementNS(svgNS, "text");
                                
                                    fontStyle = settings.font.split(" ");
                                
                                    el.style.fontVariant = fontStyle.splice(0, 1)[0];
                                    el.style.fontWeight = fontStyle.splice(0, 1)[0];
                                    el.style.fontStyle = fontStyle.splice(0, 1)[0];
                                    el.style.fontSize = fontStyle.splice(0, 1)[0];
                                
                                    el.setAttribute("x", renderItem['arguments'][1]);                 
                                    el.setAttribute("y", renderItem['arguments'][2] - (parseInt(el.style.fontSize, 10) + 3));
                                
                                    el.setAttribute("fill", settings.fillStyle);
                                
                               
                             
                                
                                    // TODO get proper baseline
                                    el.style.dominantBaseline = "text-before-edge";
                                    el.style.fontFamily = fontStyle.join(" ");

                                    text = doc.createTextNode(renderItem['arguments'][0]);
                                    el.appendChild(text);
                               
                                
                                    svg.appendChild(el);
                                
              
                    
                                } else if(renderItem.name === "drawImage") {

                                    if (renderItem['arguments'][8] > 0 && renderItem['arguments'][7]){
                                    
                                        // TODO check whether even any clipping is necessary for this particular image
                                        el = doc.createElementNS(svgNS, "clipPath");
                                        el.setAttribute("id", "clipId" + clipId); 
                                    
                                        text = doc.createElementNS(svgNS, "rect");
                                        text.setAttribute("x",  renderItem['arguments'][5] );                 
                                        text.setAttribute("y", renderItem['arguments'][6]);
                                    
                                        text.setAttribute("width", renderItem['arguments'][3]);                 
                                        text.setAttribute("height", renderItem['arguments'][4]);
                                        el.appendChild(text);
                                        defs.appendChild(el);
                                    
                                        el = doc.createElementNS(svgNS, "image");
                                        el.setAttributeNS(xlinkNS, "xlink:href", renderItem['arguments'][0].src);
                                        el.setAttribute("width", renderItem['arguments'][7]);                 
                                        el.setAttribute("height", renderItem['arguments'][8]);           
                                        el.setAttribute("x", renderItem['arguments'][5]);                 
                                        el.setAttribute("y", renderItem['arguments'][6]);
                                        el.setAttribute("clip-path", "url(#clipId" + clipId + ")");
                                        // el.setAttribute("xlink:href", );
                                    

                                        el.setAttribute("preserveAspectRatio", "none");
                                    
                                        svg.appendChild(el);
                                    
                                    
                                        clipId += 1; 
                                    /*
                                    ctx.drawImage(
                                        renderItem['arguments'][0],
                                        renderItem['arguments'][1],
                                        renderItem['arguments'][2],
                                        renderItem['arguments'][3],
                                        renderItem['arguments'][4],
                                        renderItem['arguments'][5],
                                        renderItem['arguments'][6],
                                        renderItem['arguments'][7],
                                        renderItem['arguments'][8]
                                        );
                                        */
                                    }      
                                }
                               
                       
  
                                break;
                            default:
                               
                        }
            
                    }

                }  
            /*
            if (storageContext.clip){
                ctx.restore();
            }
    */

       
   
            }
        
        
        
        
        
        
        
        
        
        
            h2clog("html2canvas: Renderer: SVG Renderer done - returning SVG DOM obj");
        
            return svg;
        }
    };    
    
    return methods;
    
    
};
window.html2canvas = html2canvas;
}(window, document));
