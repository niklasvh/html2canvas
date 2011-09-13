html2canvas.Generate = {};



html2canvas.Generate.Gradient = function(src, bounds) {
    var canvas = document.createElement('canvas'),
    ctx = canvas.getContext('2d'),
    tmp, 
    p0 = 0,
    p1 = 0,
    p2 = 0,
    p3 = 0,
    steps = [],
    position,
    i,
    len,
    lingrad,
    increment,
    p,
    img;
    
    canvas.width = bounds.width;
    canvas.height = bounds.height;
    

    function getColors(input) {
        var j = -1, 
        color = '', 
        chr;
        
        while( j++ < input.length ) {
            chr = input.charAt( j );
            if (chr === ')') {
                color += chr;
                steps.push( color );
                color = '';
                j+=2;
            } else {
                color += chr;
            }
        }
    }
    
    if ( tmp = src.match(/-webkit-linear-gradient\((.*)\)/) ) {
        
        position = tmp[1].split( ",", 1 )[0];
        getColors( tmp[1].substr( position.length + 2 ) );
        position = position.split(' ');
        
        for (p = 0; p < position.length; p+=1) {
            
            switch(position[p]) {
                case 'top':
                    p3 = bounds.height;
                    break;
                    
                case 'right':
                    p0 = bounds.width;
                    break;
                    
                case 'bottom':
                    p1 = bounds.height;
                    break;
                    
                case 'left':
                    p2 = bounds.width;
                    break;
            }
            
        }

    } else if (tmp = src.match(/-webkit-gradient\(linear, (\d+)[%]{0,1} (\d+)[%]{0,1}, (\d+)[%]{0,1} (\d+)[%]{0,1}, from\((.*)\), to\((.*)\)\)/)) {
        
        p0 = (tmp[1] * bounds.width) / 100;
        p1 = (tmp[2] * bounds.height) / 100;
        p2 = (tmp[3] * bounds.width) / 100;
        p3 = (tmp[4] * bounds.height) / 100;
        
        steps.push(tmp[5]);
        steps.push(tmp[6]);
        
    } else if (tmp = src.match(/-moz-linear-gradient\((\d+)[%]{0,1} (\d+)[%]{0,1}, (.*)\)/)) {
        
        p0 = (tmp[1] * bounds.width) / 100;
        p1 = (tmp[2] * bounds.width) / 100;
        p2 = bounds.width - p0;
        p3 = bounds.height - p1;
        getColors( tmp[3] );
        
    } else {
        return;
    }

    lingrad = ctx.createLinearGradient( p0, p1, p2, p3 );
    increment = 1 / (steps.length - 1);
    
    for (i = 0, len = steps.length; i < len; i+=1) {
        lingrad.addColorStop(increment * i, steps[i]);
    }
    
    ctx.fillStyle = lingrad;
    
    // draw shapes
    ctx.fillRect(0, 0, bounds.width,bounds.height);

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
