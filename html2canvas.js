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

var html2canvas = {};

html2canvas.logging = false;

function h2clog(a) {
    if (html2canvas.logging && window.console && window.console.log) {
        window.console.log(a);
    }
}

html2canvas.log = h2clog; // for compatibility with the jquery plugin

html2canvas.Util = {};

html2canvas.Util.backgroundImage = function (src) {
  
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

html2canvas.Util.Bounds = function getBounds (el) {
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
            
    }  /*else{
           
           
            p = $(el).offset();       
          
            return {               
                left: p.left + getCSS(el,"borderLeftWidth", true),
                top: p.top + getCSS(el,"borderTopWidth", true),
                width:$(el).innerWidth(),
                height:$(el).innerHeight()                
            };
            

        }     */      
}

html2canvas.Util.getCSS = function (el, attribute) {
    // return jQuery(el).css(attribute);
    /*
    var val,
    left,
    rsLeft = el.runtimeStyle && el.runtimeStyle[ attribute ],
    style = el.style;
    
    if ( el.currentStyle ) {
        val = el.currentStyle[ attribute ];
    } else if (window.getComputedStyle) {
        val = document.defaultView.getComputedStyle(el, null)[ attribute ];
    }
    */
    // Check if we are not dealing with pixels, (Opera has issues with this)
    // Ported from jQuery css.js
    // From the awesome hack by Dean Edwards
    // http://erik.eae.net/archives/2007/07/27/18.54.15/#comment-102291

    // If we're not dealing with a regular pixel number
    // but a number that has a weird ending, we need to convert it to pixels
    
    // if ( !/^-?\d+(?:px)?$/i.test( val ) && /^-?\d/.test( val ) ) {
    /*
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
        }*/
    // val = $(el).css(attribute);
    // }
    
    /*
    var val = $(el).css(attribute);
    
    if (val === "medium") {
        val = 3;
    }*/
    
    return $(el).css(attribute);
    
  
};

html2canvas.Util.Extend = function (options, defaults) {
    var key;
    for (key in options) {              
        if (options.hasOwnProperty(key)) {
            defaults[key] = options[key];
        }
    }
    return defaults;           
};

html2canvas.Util.Children = function(el) {
    // $(el).contents() !== el.childNodes, Opera / IE have issues with that
    var children;
    try {
      children = $(el).contents();
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

  Released under MIT License
*/

html2canvas.Generate = {};



html2canvas.Generate.Gradient = function(src, bounds,background_image) {
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
                while (j++ < input.length && input.charAt( j ) !== ',') {
                }
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
        try {
            lingrad.addColorStop(increment * i, steps[i]);
        }
        catch(e) {
            h2clog(['failed to add color stop: ', e, '; tried to add: ', steps[i], '; stop: ', i, '; in: ', src]);
        }
    }
    
    ctx.fillStyle = lingrad;
    
    //draw shapes
    ctx.fillRect(0, 0, bounds.width,bounds.height);
	
	if ( background_image && background_image !== "1" && background_image !== "none" )
	{
		var image = new Image();
		image.src = background_image.match(/(data:image\/.*;base64,.+)\)/i)[1];
		ctx.globalCompositeOperation = "destination-atop";
		ctx.drawImage(image,0,0, bounds.width,bounds.height);
	}
	
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

/*
  html2canvas v0.33 <http://html2canvas.hertzen.com>
  Copyright (c) 2011 Niklas von Hertzen. All rights reserved.
  http://www.twitter.com/niklasvh

  Released under MIT License
*/

/*
 *  New function for traversing elements
 */

html2canvas.Parse = function (element, images, opts) {
    window.scroll(0,0);
    opts = opts || {};
  
    // select body by default
    if (element === undefined) {
        element = document.body;
    }
    
    
    var support = {
        rangeBounds: false
        
    },
    options = {
        iframeDefault: "default",
        ignoreElements: "IFRAME|OBJECT|PARAM",
        useOverflow: true,
        letterRendering: false
    },
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
    
    options = html2canvas.Util.Extend(opts, options);

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

    var getCSS = html2canvas.Util.getCSS;
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
           
            
            for (c=0; c < renderList.length; c+=1) {
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
                                    
                    bounds = html2canvas.Util.Bounds(wrapElement);
                        
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

    
        bounds = html2canvas.Util.Bounds( boundElement );
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
                    text = html2canvas.Generate.ListRoman( currentIndex );
                    break;
                case "lower-roman":
                    text = html2canvas.Generate.ListRoman( currentIndex ).toLowerCase();
                    break;
                case "lower-alpha":
                    text = html2canvas.Generate.ListAlpha( currentIndex ).toLowerCase();  
                    break;
                case "upper-alpha":
                    text = html2canvas.Generate.ListAlpha( currentIndex );  
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
                */
                ctx.setVariable("textAlign", "right");
                //  this.setFont(stack.ctx, element, true);
                x = elBounds.left - 10;
            }
        
            y = listBounds.bottom;
    
            drawText(text, x, y, ctx)
 
        
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
        
        if (!parentZ){
            this.zStack = h2czContext(0);
            return this.zStack;
        }
    
        if (zIndex !== "auto"){
            needReorder = true;
            var newContext = h2czContext(zIndex);
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
    

    
    function getBackgroundPosition(el, bounds, image){
        // TODO add support for multi image backgrounds
    
        var bgposition = (function( bgp ){   
            
            if (bgp !== undefined) {
                return (bgp.split(",")[0] || "0 0").split(" ");
            } else {
               // Older IE uses -x and -y 
               return [ getCSS(el, "backgroundPositionX"), getCSS(el, "backgroundPositionY") ];
            }
            
            
        })( getCSS(el, "backgroundPosition") ),
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
            background_image = html2canvas.Util.backgroundImage( background_image );
            image = loadImage( background_image );
					

            bgp = getBackgroundPosition(el, bounds, image);
            

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
    
                  
                        //   bgh = Math.abs(bgh);
                        //   bgw = Math.abs(bgw);
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
                            
                        // ctx.drawImage(image,(bounds.left+bgp.left),(bounds.top+bgp.top));	                      
                            
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
		
        var bounds = html2canvas.Util.Bounds(el), 
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
            stack.clip = html2canvas.Util.Extend( {}, parentStack.clip );
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
		
			var backGroundImage = html2canvas.Util.getCSS(el, '-webkit-mask-image');
			if(backGroundImage == "none")
			{
				renderRect(
					ctx,
					bgbounds.left,
					bgbounds.top,
					bgbounds.width,
					bgbounds.height,
					bgcolor
                );
			}
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
                var elementChildren = html2canvas.Util.Children( el ),
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
    
    // parse every child element
    for (i = 0, children = element.children, childrenLen = children.length; i < childrenLen; i+=1){      
        parseElement(children[i], stack);  
    }
    
    
    stack.backgroundColor = getCSS( body, "backgroundColor" );
    
    return stack;

};

function h2czContext(zindex) {
    return {
        zindex: zindex,
        children: []
    };  
};

/*
  html2canvas v0.33 <http://html2canvas.hertzen.com>
  Copyright (c) 2011 Niklas von Hertzen. All rights reserved.
  http://www.twitter.com/niklasvh

  Released under MIT License
*/

html2canvas.Preload = function(element, opts){
    
    var options = {
        proxy: "http://html2canvas.appspot.com/",
        timeout: 0,    // no timeout
        useCORS: false, // try to load images as CORS (where available), before falling back to proxy
        allowTaint: false // whether to allow images to taint the canvas, won't need proxy if set to true
    },
    images = {
        numLoaded: 0,   // also failed are counted here
        numFailed: 0,
        numTotal: 0,
        cleanupDone: false
    },
    pageOrigin,
    methods,
    i,
    count = 0,
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
    opts = opts || {};
    
    options = html2canvas.Util.Extend(opts, options);
    
   
    
    element = element || doc.body;
    
    function isSameOrigin(url){
        link.href = url;  
        link.href = link.href; // YES, BELIEVE IT OR NOT, that is required for IE9 - http://jsfiddle.net/niklasvh/2e48b/
        var origin = link.protocol + link.host;              
        return (origin === pageOrigin);
    }
    
    function start(){
        h2clog("html2canvas: start: images: " + images.numLoaded + " / " + images.numTotal + " (failed: " + images.numFailed + ")");
        if (!images.firstRun && images.numLoaded >= images.numTotal){
        
            /*
            this.log('Finished loading '+this.imagesLoaded+' images, Started parsing');
            this.bodyOverflow = document.getElementsByTagName('body')[0].style.overflow;
            document.getElementsByTagName('body')[0].style.overflow = "hidden";
            */
            if (typeof options.complete === "function"){
                options.complete(images);
            }

            h2clog("Finished loading images: # " + images.numTotal + " (failed: " + images.numFailed + ")");
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

        var contents = html2canvas.Util.Children(el),
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
                background_image = html2canvas.Util.getCSS(el, 'backgroundImage');
				
            }catch(e) {
                h2clog("html2canvas: failed to get background-image - Exception: " + e.message);
            }
            if ( background_image && background_image !== "1" && background_image !== "none" ) {	
                
                // TODO add multi image background support
                
                if (background_image.substring(0,7) === "-webkit" || background_image.substring(0,3) === "-o-" || background_image.substring(0,4) === "-moz") {
                  
					img = html2canvas.Generate.Gradient( background_image, html2canvas.Util.Bounds( el ),html2canvas.Util.getCSS(el, '-webkit-mask-image'));

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
                    src = html2canvas.Util.backgroundImage(background_image.match(/data:image\/.*;base64,/i) ? background_image : background_image.split(",")[0]);		
                    methods.loadImage(src); 		
                }
           
            /*
            if (background_image && background_image !== "1" && background_image !== "none" && background_image.substring(0,7) !== "-webkit" && background_image.substring(0,3)!== "-o-" && background_image.substring(0,4) !== "-moz"){
                // TODO add multi image background support
                src = html2canvas.Util.backgroundImage(background_image.split(",")[0]);                    
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
            start();
            
        };
    }
    
    // work around for https://bugs.webkit.org/show_bug.cgi?id=80028
    function isComplete() {
       if (!this.img.complete) { 
           this.timer = window.setTimeout(this.img.customComplete, 100) 
       } else { 
           this.img.onerror();         
       }
    }

    methods = {
        loadImage: function( src ) {
            var img, imageObj;      
            if ( src && images[src] === undefined ) {
                img = new Image();                
                if ( src.match(/data:image\/.*;base64,/i) ) {
                    img.src = src.replace(/url\(['"]{0,}|['"]{0,}\)$/ig, '');
                    imageObj = images[src] = { img: img };
                    images.numTotal++;
                    setImageLoadHandlers(img, imageObj);
                } else if ( isSameOrigin( src ) || options.allowTaint ===  true ) {                    
                    imageObj = images[src] = { img: img };
                    images.numTotal++;
                    setImageLoadHandlers(img, imageObj);
                    img.src = src;
                } else if ( supportCORS && !options.allowTaint && options.useCORS ) {
                    // attempt to load with CORS
                    
                    img.crossOrigin = "anonymous";    
                    imageObj = images[src] = { img: img };
                    images.numTotal++;
                    setImageLoadHandlers(img, imageObj);
                    img.src = src;             
                    
                    img.customComplete = isComplete.bind(imageObj);  
                    img.customComplete();
                    
                } else if ( options.proxy ) {
                    imageObj = images[src] = { img: img };
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
html2canvas.Renderer = function(parseQueue, opts){


    var options = {
        "width": null,
        "height": null,
        "renderer": "canvas",
        "taintTest": true // do a taint test with all images before applying to canvas
    },
    queue = [],
    canvas,
    usingFlashcanvas = false,
    flashMaxSize = 2880, // flash bitmap limited to 2880x2880px // http://stackoverflow.com/questions/2033792/argumenterror-error-2015-invalid-bitmapdata
    doc = document;
    
    options = html2canvas.Util.Extend(opts, options);


    
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

    function canvasRenderer(zStack){
 
        sortZ(zStack.zIndex);
        

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

        for (i = 0, queueLen = queue.length; i < queueLen; i+=1){
            
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
                                                testCanvas = document.createElement("canvas");
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
        h2clog("html2canvas: Renderer: Canvas renderer done - returning canvas obj");
        
        // this.canvasRenderStorage(queue,this.ctx);
        queueLen = options.elements.length;
        
        if (queueLen === 1) {
            if (typeof options.elements[ 0 ] === "object" && options.elements[ 0 ].nodeName !== "BODY" && usingFlashcanvas === false) {
                // crop image to the bounds of selected (single) element
                bounds = html2canvas.Util.Bounds( options.elements[ 0 ] );
                newCanvas = doc.createElement('canvas');
                newCanvas.width = bounds.width;
                newCanvas.height = bounds.height;
                ctx = newCanvas.getContext("2d");
                
                ctx.drawImage( canvas, bounds.left, bounds.top, bounds.width, bounds.height, 0, 0, bounds.width, bounds.height );
                delete canvas;
                return newCanvas;
            }
        } else {
        // TODO clip and resize multiple elements
        /*
            for ( i = 0; i < queueLen; i+=1 ) {
                if (options.elements[ i ] instanceof Element) {
                
                }
              
            }*/
        }
        
       
       
        
        return canvas;
    }

    function svgRenderer(zStack){
        sortZ(zStack.zIndex);
        
        var svgNS = "http://www.w3.org/2000/svg",
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
        clipId = 0;
        
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
                                    el.setAttribute("width", renderItem['arguments'][0].width);                 
                                    el.setAttribute("height", renderItem['arguments'][0].height);           
                                    el.setAttribute("x", renderItem['arguments'][5] - renderItem['arguments'][1]);                 
                                    el.setAttribute("y", renderItem['arguments'][6] - renderItem['arguments'][2]);
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

    
    //this.each(this.opts.renderOrder.split(" "),function(i,renderer){
        
    //options.renderer = "svg";
    
    switch(options.renderer.toLowerCase()){
        case "canvas":
            canvas = doc.createElement('canvas');
            if (canvas.getContext){
                h2clog("html2canvas: Renderer: using canvas renderer");
                return canvasRenderer(parseQueue);
            } else {
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
                        canvasRenderer(parseQueue);
                    }
                });
                
                doc.body.appendChild( script );
                
                return canvas;
            }               
            break;
        case "svg":
            if (doc.createElementNS){
                h2clog("html2canvas: Renderer: using SVG renderer");
                return svgRenderer(parseQueue);             
            }
            break;
            
    }
         
         
         
    //});
    

    return this;
     

    
};

/*
  html2canvas v0.33 <http://html2canvas.hertzen.com>
  Copyright (c) 2011 Niklas von Hertzen. All rights reserved.
  http://www.twitter.com/niklasvh

  Released under MIT License
*/
window.html2canvas = html2canvas;
}(window, document));

