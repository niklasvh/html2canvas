/*
  html2canvas @VERSION@ <http://html2canvas.hertzen.com>
  Copyright (c) 2011 Niklas von Hertzen. All rights reserved.
  http://www.twitter.com/niklasvh

  Released under MIT License
 */

(function(){
    
_html2canvas.Generate = {};

var reGradients = [
    /^(-webkit-linear-gradient)\(([a-z\s]+)([\w\d\.\s,%\(\)]+)\)$/,
    /^(-o-linear-gradient)\(([a-z\s]+)([\w\d\.\s,%\(\)]+)\)$/,
    /^(-webkit-gradient)\((linear|radial),\s((?:\d{1,3}%?)\s(?:\d{1,3}%?),\s(?:\d{1,3}%?)\s(?:\d{1,3}%?))([\w\d\.\s,%\(\)-]+)\)$/,
    /^(-moz-linear-gradient)\(((?:\d{1,3}%?)\s(?:\d{1,3}%?))([\w\d\.\s,%\(\)]+)\)$/
];

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
                    x0: 0,
                    y0: 0,
                    x1: 0,
                    y1: 0,
                    colorStops: []
                };
                
                // get coordinates
                m2 = m1[2].match(/\w+/g);
                if(m2){
                    m2Len = m2.length;
                    for(i = 0; i < m2Len; i+=1){
                        switch(m2[i]) {
                            case 'top':
                                gradient.y1 = bounds.height;
                                break;
                                
                            case 'right':
                                gradient.x0 = bounds.width;
                                break;
                                
                            case 'bottom':
                                gradient.y0 = bounds.height;
                                break;
                                
                            case 'left':
                                gradient.x1 = bounds.width;
                                break;
                        }
                    }
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
                    type: m1[2],
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
                
                if(gradient.x0 === gradient.x1) // center
                    gradient.x0 = gradient.x1 = 0;
                
                if(gradient.y0 === gradient.y1) // center
                    gradient.y0 = gradient.y1 = 0;
                
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
        }
    }
    
    return gradient;
};

_html2canvas.Generate.Gradient = function(src, bounds) {
    var canvas = document.createElement('canvas'),
    ctx = canvas.getContext('2d'),
    gradient, lingrad, i, len, img;
    
    canvas.width = bounds.width;
    canvas.height = bounds.height;
    
    gradient = _html2canvas.Generate.parseGradient(src, bounds);
    
    img = new Image();
    
    if(gradient && gradient.type === 'linear'){
        lingrad = ctx.createLinearGradient(gradient.x0, gradient.y0, gradient.x1, gradient.y1);
        
        for (i = 0, len = gradient.colorStops.length; i < len; i+=1) {
            try {
                lingrad.addColorStop(gradient.colorStops[i].stop, gradient.colorStops[i].color);
            }
            catch(e) {
                h2clog(['failed to add color stop: ', e, '; tried to add: ', gradient.colorStops[i], '; stop: ', i, '; in: ', src]);
            }
        }
        
        ctx.fillStyle = lingrad;
        ctx.fillRect(0, 0, bounds.width, bounds.height);
    
        img.src = canvas.toDataURL();
    } else if(gradient && gradient.type === 'radial'){
        // TODO: implement radial gradient generation
        h2clog('No radial gradient support implemented');
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