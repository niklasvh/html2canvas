/*
 *  New function for traversing elements
 */

html2canvas.Parse = function (element, images, opts) {
 
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
    

    images = images || [];
    
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

    function getCSS (element, attribute, intOnly) {
        
        if (intOnly !== undefined && intOnly === true) {
            return parseInt(html2canvas.Util.getCSS(element, attribute), 10); 
        }else{
            return html2canvas.Util.getCSS(element, attribute);
        }
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
        


    
        // TODO add another image
        img.src = "http://html2canvas.hertzen.com/images/8.jpg";
        img.width = 1;
        img.height = 1;
    
        img.style.margin = 0;
        img.style.padding = 0;

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
        family = getCSS(el, "fontFamily", false),
        size = getCSS(el, "fontSize", false),
        color = getCSS(el, "color", false),
        text_decoration = getCSS(el, "textDecoration", false),
        text_align = getCSS(el, "textAlign", false),
        letter_spacing = getCSS(el, "letterSpacing", false),
        bounds,
        text,
        metrics,
        renderList,
        bold = getCSS(el, "fontWeight", false),
        font_style = getCSS(el, "fontStyle", false),
        font_variant = getCSS(el, "fontVariant", false),
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
        
        
        
        textNode.nodeValue = textTransform(textNode.nodeValue, getCSS(el, "textTransform", false));	
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
            ctx.setVariable("font", font_variant + " " + bold + " " + font_style + " " + size + " " + family);
                
                
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
    
  
        var position = getCSS(element, "listStylePosition", false),
        x,
        y,
        type = getCSS(element, "listStyleType", false),
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
    
 
       
        
            ctx.setVariable( "fillStyle", getCSS(element, "color", false) );  
            ctx.setVariable( "font", getCSS(element, "fontVariant", false) + " " + bold + " " + getCSS(element, "fontStyle", false) + " " + getCSS(element, "fontFize", false) + " " + getCSS(element, "fontFamily", false) );

        
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
        
        var imgIndex = -1, 
        i,
        imgLen;
        if (images.indexOf){
            imgIndex = images.indexOf(src);
        }else{
            for(i = 0, imgLen = images.length; i < imgLen.length; i+=1){
                if(images[i] === src) {
                    imgIndex = i;
                    break;
                } 
            }
        }

        if (imgIndex > -1){
            return images[imgIndex+1];
        }else{
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
            this.zStack = new html2canvas.zContext(0);
            return this.zStack;
        }
    
        if (zIndex !== "auto"){
            needReorder = true;
            var newContext = new html2canvas.zContext(zIndex);
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
                    width: getCSS(el, 'border' + sides[s] + 'Width', true),
                    color: getCSS(el, 'border' + sides[s] + 'Color', false)
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
            valueWrap.style[style] = getCSS(el, style, false);
        }
        
                
        valueWrap.style.borderColor = "black";            
        valueWrap.style.borderStyle = "solid";  
        valueWrap.style.display = "block";
        valueWrap.style.position = "absolute";
        if (/^(submit|reset|button|text|password)$/.test(el.type) || el.nodeName === "SELECT"){
            valueWrap.style.lineHeight = getCSS(el, "height", false);
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
    
        var bgpos = getCSS(el, "backgroundPosition").split(",")[0] || "0 0",
        bgposition = bgpos.split(" "),
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
        var background_image = getCSS(el, "backgroundImage", false),
        background_repeat = getCSS(el, "backgroundRepeat", false).split(",")[0],
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
                    
                html2canvas.log("Error loading background:" + background_image);
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
        bgcolor = getCSS(el, "backgroundColor", false),
        cssPosition = getCSS(el, "position", false),
        zindex,
        opacity = getCSS(el, "opacity", false),
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
        
        if (parentStack === undefined){
            docDim = docSize();
            parentStack = {
                opacity: 1
            };
        }else{
            docDim = {};
        }
        

        //var zindex = this.formatZ(this.getCSS(el,"zIndex"),cssPosition,parentStack.zIndex,el.parentNode);
   
        zindex = setZ( getCSS( el, "zIndex", false ), parentStack.zIndex );
          


        stack = {
            ctx: new html2canvas.canvasContext( docDim.width || w , docDim.height || h ),
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
        borders = renderBorders(el, ctx, bounds);
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

                    paddingLeft = getCSS(el, 'paddingLeft', true);
                    paddingTop = getCSS(el, 'paddingTop', true);
                    paddingRight = getCSS(el, 'paddingRight', true);
                    paddingBottom = getCSS(el, 'paddingBottom', true);
                    
                    
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
           
                }else {
                    html2canvas.log("Error loading <img>:" + imgSrc);
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

    stack = renderElement(element);
    
    // parse every child element
    for (i = 0, children = element.children, childrenLen = children.length; i < childrenLen; i+=1){      
        parseElement(children[i], stack);  
    }
    
    return stack;

};

html2canvas.zContext = function(zindex) {
    return {
        zindex: zindex,
        children: []
    };  
};