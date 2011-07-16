/* 
 * html2canvas v0.12 <http://html2canvas.hertzen.com>
 * Copyright (c) 2011 Niklas von Hertzen. All rights reserved.
 * http://www.twitter.com/niklasvh 
 * 
 * Released under MIT License
 */

/*
 * The MIT License

 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:

 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.

 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

/**
 * Creates a render of the element el
 * @constructor
 */

function html2canvas(el, userOptions) {

    var options = userOptions || {};
  
    
    this.opts = this.extendObj(options, {          
        logging: false,
        ready: function (canvas) {
            document.body.appendChild(canvas);
        },
        renderViewport: true		
    });
    
    this.element = el;
    
    var imageLoaded,
    canvas,
    ctx,
    bgx,
    bgy,
    image;
    this.imagesLoaded = 0;
    this.images = [];
    this.fontData = [];
    this.ignoreElements = "IFRAME|OBJECT|PARAM";
    
  
    
    // test how to measure text bounding boxes
    this.useRangeBounds = false;
    if (document.createRange){
        var r = document.createRange();
        this.useRangeBounds = new Boolean(r.getBoundingClientRect);
    }
     
    // Start script
    this.init();	
}
	
        
        
                                
html2canvas.prototype.init = function(){
     
    var _ = this;
       
    this.canvas = document.createElement('canvas');
        
    // TODO remove jQuery dependency
    this.canvas.width = $(document).width();
    this.canvas.height = $(document).height()+10;
        
        

    if (!this.canvas.getContext){
            
    // TODO include Flashcanvas
    /*
          
            var script = document.createElement('script');
            script.type = "text/javascript";
            script.src = "flashcanvas.js";
            var s = document.getElementsByTagName('script')[0]; 
            s.parentNode.insertBefore(script, s);
         
         
            if (typeof FlashCanvas != "undefined") {
               
                FlashCanvas.initElement(canvas);
                ctx = canvas.getContext('2d');
            }	
            */
    }else{
        this.ctx = this.canvas.getContext('2d');
    }
        
    if (!this.ctx){
        // canvas not initialized, let's kill it here
        this.log('Canvas not available');
        return;
    }
       
    // set common settings for canvas
    this.ctx.textBaseline = "bottom";
        
    this.log('Finding background images');
        
    this.getImages(this.element);
            
    this.log('Finding images');
    this.each(document.images,function(i,e){
        _.preloadImage(_.getAttr(e,'src'));
    });
      
        
    if (this.images.length == 0){
        this.start();
    }  
        
        
}

/*
 * Check whether all assets have been loaded and start traversing the DOM
 */
 
html2canvas.prototype.start = function(){
          
    if (this.images.length == 0 || this.imagesLoaded==this.images.length/2){    
        this.log('Started parsing');
        this.newElement(this.element);		
          
        this.parseElement(this.element);                         
    }            
}



/*
 * Finished rendering, send callback
 */ 

html2canvas.prototype.finish = function(){
    this.log("Finished rendering");
       
    if (this.opts.renderViewport){
        // let's crop it to viewport only then
        var newCanvas = document.createElement('canvas');
        var newctx = newCanvas.getContext('2d');
        newCanvas.width = window.innerWidth;
        newCanvas.height = window.innerHeight;
            
    }
    this.opts.ready(this.canvas);          
}



    
html2canvas.prototype.drawBackground = function(el,bounds){
               
     
    var background_image = this.getCSS(el,"background-image");
    var background_repeat = this.getCSS(el,"background-repeat");
        
    if (typeof background_image != "undefined" && /^(1|none)$/.test(background_image)==false){
            
        background_image = this.backgroundImageUrl(background_image);
        var image = this.loadImage(background_image);
					

        var bgp = this.getBackgroundPosition(el,bounds,image),
        bgy;


        if (image){
            switch(background_repeat){
					
                case "repeat-x":
                    this.drawbackgroundRepeatX(image,bgp,bounds.left,bounds.top,bounds.width,bounds.height);                     
                    break;
                            
                case "repeat-y":
                    this.drawbackgroundRepeatY(image,bgp,bounds.left,bounds.top,bounds.width,bounds.height);                                             
                    break;
                            
                case "no-repeat":
                        
                    this.drawBackgroundRepeat(image,bgp.left+bounds.left,bgp.top+bounds.top,Math.min(bounds.width,image.width),Math.min(bounds.height,image.height),bounds.left,bounds.top);
                    // ctx.drawImage(image,(bounds.left+bgp.left),(bounds.top+bgp.top));	                      
                    break;
                        
                default:
                    var height,
                    add;
                        
                              
                    bgp.top = bgp.top-Math.ceil(bgp.top/image.height)*image.height;                
                        
                        
                    for(bgy=(bounds.top+bgp.top);bgy<=bounds.height+bounds.top;){  
           
                        
           
                        var h = Math.min(image.height,(bounds.height+bounds.top)-bgy);
                           
                            
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
                                              
                        this.drawbackgroundRepeatX(image,bgp,bounds.left,bgy,bounds.width,height);  
                        if (add>0){
                            bgp.top += add;
                        }
                        bgy = Math.floor(bgy+image.height)-add; 
                    }
                    break;
                        
					
            }	
        }else{
                    
            this.log("Error loading background:" + background_image);
        //console.log(images);
        }
					
    }
}
   


/*
 * Function to retrieve the actual src of a background-image
 */

html2canvas.prototype.backgroundImageUrl = function(src){
    if (src.substr(0,5)=='url("'){
        src = src.substr(5);
        src = src.substr(0,src.length-2);                 
    }else{
        src = src.substr(4);
        src = src.substr(0,src.length-1);  
    }
    return src;            
}
    
    
/*
 * Function to retrieve background-position, both in pixels and %
 */
    
html2canvas.prototype.getBackgroundPosition = function(el,bounds,image){

    var bgposition = this.getCSS(el,"background-position").split(" "),
    top,
    left,
    percentage;
           

    if (bgposition[0].indexOf("%")!=-1){   

        percentage = (parseFloat(bgposition[0])/100);        
        left =  ((bounds.width * percentage)-(image.width*percentage));
    }else{
        left = parseInt(bgposition[0],10);
    }
        
    if (bgposition[1].indexOf("%")!=-1){  

        percentage = (parseFloat(bgposition[1])/100);     
        top =  ((bounds.height * percentage)-(image.height*percentage));
    }else{
        top = parseInt(bgposition[1],10);
    }
          
    return {
        top: top,
        left: left
    };
         
}



    
html2canvas.prototype.drawbackgroundRepeatY = function(image,bgp,x,y,w,h){
        
    var height,
    width = Math.min(image.width,w),bgy;   
            
    bgp.top = bgp.top-Math.ceil(bgp.top/image.height)*image.height;                
        
        
    for(bgy=(y+bgp.top);bgy<=h+y;){   
            
         
        if ( Math.floor(bgy+image.height)>h+y){
            height = (h+y)-bgy;
        }else{
            height = image.height;
        }
        this.drawBackgroundRepeat(image,x+bgp.left,bgy,width,height,x,y);   
      
        bgy = Math.floor(bgy+image.height); 
                              
    } 
}
    
html2canvas.prototype.drawbackgroundRepeatX = function(image,bgp,x,y,w,h){
                           
    var height = Math.min(image.height,h),
    width,bgx;             
        
            
    bgp.left = bgp.left-Math.ceil(bgp.left/image.width)*image.width;                
        
        
    for(bgx=(x+bgp.left);bgx<=w+x;){   

        if (Math.floor(bgx+image.width)>w+x){
            width = (w+x)-bgx;
        }else{
            width = image.width;
        }
                
        this.drawBackgroundRepeat(image,bgx,(y+bgp.top),width,height,x,y);       
             
        bgx = Math.floor(bgx+image.width); 

                                
    } 
}
    
html2canvas.prototype.drawBackgroundRepeat = function(image,x,y,width,height,elx,ely){
    var sourceX = 0,
    sourceY=0;
    if (elx-x>0){
        sourceX = elx-x;
    }
        
    if (ely-y>0){
        sourceY = ely-y;
    }
        
    this.ctx.drawImage(
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
/*
 * Function to provide border details for an element
 */

html2canvas.prototype.getBorderData = function(el){
     
    var borders = [];
    var _ = this;
    this.each(["top","right","bottom","left"],function(i,borderSide){
        borders.push({
            width: parseInt(_.getCSS(el,'border-'+borderSide+'-width'),10),
            color: _.getCSS(el,'border-'+borderSide+'-color')
        });
    });
            
    return borders;
            
}




html2canvas.prototype.newElement = function(el){
					
    var bounds = this.getBounds(el);    
            
    var x = bounds.left;
    var y = bounds.top;
    var w = bounds.width;
    var h = bounds.height;   
    var _ = this,
    image;       
    var bgcolor = this.getCSS(el,"background-color");

       
			

    /*
         *  TODO add support for different border-style's than solid   
         */            
    var borders = this.getBorderData(el);    
            
    this.each(borders,function(borderSide,borderData){
        if (borderData.width>0){
            var bx = x,
            by = y,
            bw = w,
            bh = h-(borders[2].width);
            switch(borderSide){
                case 0:
                    // top border
                    bh = borders[0].width;
                    break;
                case 1:
                    // right border
                    bx = x+w-(borders[1].width);
                    bw = borders[1].width;                              
                    break;
                case 2:
                    // bottom border
                    by = (by+h)-(borders[2].width);
                    bh = borders[2].width;
                    break;
                case 3:
                    // left border
                    bw = borders[3].width;  
                    break;
            }		
                   
            _.newRect(bx,by,bw,bh,borderData.color);	
                
                    
          
        }
                
    });

     
               
    // draw base element bgcolor       
    this.newRect(
        x+borders[3].width,
        y+borders[0].width,
        w-(borders[1].width+borders[3].width),
        h-(borders[0].width+borders[2].width),
        bgcolor
        );
           
    this.drawBackground(el,{
        left: x+borders[3].width,
        top: y+borders[0].width,
        width: w-(borders[1].width+borders[3].width),
        height: h-(borders[0].width+borders[2].width)
    });
        
    if (el.nodeName=="IMG"){
        image = _.loadImage(_.getAttr(el,'src'));
        if (image){
            this.ctx.drawImage(image,x+parseInt(_.getCSS(el,'padding-left'),10),y+parseInt(_.getCSS(el,'padding-top'),10));
        }else{
            this.log("Error loading <img>:" + _.getAttr(el,'src'));
        }
    }
            
			
				
}






/*
 * Function to draw the text on the canvas
 */ 
               
html2canvas.prototype.printText = function(currentText,x,y){
    if (this.trim(currentText).length>0){					
        this.ctx.fillText(currentText,x,y);
    }           
}


// Drawing a rectangle 								
html2canvas.prototype.newRect = function(x,y,w,h,bgcolor){
    if (bgcolor!="transparent"){
        this.ctx.fillStyle = bgcolor;
        this.ctx.fillRect (x, y, w, h);
    }
}
/*
 * Function to find all images from <img> and background-image   
 */            
html2canvas.prototype.getImages = function(el) {
        
    var self = this;
    
    // TODO remove jQuery dependancy
    this.each($(el).contents(),function(i,element){    
        var ignRe = new RegExp("("+this.ignoreElements+")");
        if (!ignRe.test(element.nodeName)){
            self.getImages(element);
        }
    })
          
    if (el.nodeType==1 || typeof el.nodeType == "undefined"){
        var background_image = this.getCSS(el,'background-image');
           
        if (background_image && background_image != "1" && background_image != "none" && background_image.substring(0,7)!="-webkit" && background_image.substring(0,4)!="-moz"){
            var src = this.backgroundImageUrl(background_image);                    
            this.preloadImage(src);                    
        }
    }
}  


/*
 * Load image from storage
 */
    
html2canvas.prototype.loadImage = function(src){	
        
    var imgIndex = this.images.indexOf(src);
    if (imgIndex!=-1){
        return this.images[imgIndex+1];
    }else{
        return false;
    }
				
}


        
html2canvas.prototype.preloadImage = function(src){
        
    if (this.images.indexOf(src)==-1){
        this.images.push(src);
                   
        var img = new Image();   
        // TODO remove jQuery dependancy
        var _ = this;
        $(img).load(function(){
            _.imagesLoaded++;               
            _.start();        
                
        });	
        img.onerror = function(){
            _.images.splice(_.images.indexOf(img.src),2);
            _.imagesLoaded++;
            _.start();                           
        }
        img.src = src; 
        this.images.push(img);
                  
    }     
          
}
    
            
html2canvas.prototype.newText = function(el,textNode){
       
    var family = this.getCSS(el,"font-family");
    var size = this.getCSS(el,"font-size");
    var color = this.getCSS(el,"color");
  
    var bold = this.getCSS(el,"font-weight");
    var font_style = this.getCSS(el,"font-style");

     
    var text_decoration = this.getCSS(el,"text-decoration");
               
             
    // apply text-transform:ation to the text
    textNode.nodeValue = this.textTransform(textNode.nodeValue,this.getCSS(el,"text-transform"));
    var text = textNode.nodeValue;		
			
    //text = $.trim(text);
    if (text.length>0){
        switch(bold){
            case "401":
                bold = "bold";
                break;
        }
            
            
        if (text_decoration!="none"){
            var metrics = this.fontMetrics(family,size);
            
        }    
        
          
          
        this.ctx.font = bold+" "+font_style+" "+size+" "+family;
        this.ctx.fillStyle = color;
              
        var oldTextNode = textNode;
        for(var c=0;c<text.length;c++){
            var newTextNode = oldTextNode.splitText(1);

            if (this.useRangeBounds){
                // getBoundingClientRect is supported for ranges
                if (document.createRange){
                    var range = document.createRange();
                    range.selectNode(oldTextNode);
                }else{
                    // TODO add IE support
                    var range = document.body.createTextRange();
                }
                if (range.getBoundingClientRect()){
                    var bounds = range.getBoundingClientRect();
                }else{
                    var bounds = {};
                }
            }else{
                // it isn't supported, so let's wrap it inside an element instead and the bounds there
                var parent = oldTextNode.parentNode;
                var wrapElement = document.createElement('wrapper');
                var backupText = oldTextNode.cloneNode(true);
                wrapElement.appendChild(oldTextNode.cloneNode(true));
                parent.replaceChild(wrapElement,oldTextNode);
                    
                var bounds = this.getBounds(wrapElement);
    
                    
                parent.replaceChild(backupText,wrapElement);      
            }
               
      
           
                                 
            this.printText(oldTextNode.nodeValue,bounds.left,bounds.bottom);
                    
            switch(text_decoration) {
                case "underline":	
                    // Draws a line at the baseline of the font
                    // TODO As some browsers display the line as more than 1px if the font-size is big, need to take that into account both in position and size         
                    this.newRect(bounds.left,Math.round(bounds.top+metrics.baseline+metrics.lineWidth),bounds.width,1,color);
                    break;
                case "overline":
                    this.newRect(bounds.left,bounds.top,bounds.width,1,color);
                    break;
                case "line-through":
                    // TODO try and find exact position for line-through
                    this.newRect(bounds.left,Math.ceil(bounds.top+metrics.middle+metrics.lineWidth),bounds.width,1,color);
                    break;
                    
            }	
                
            oldTextNode = newTextNode;
                  
                  
                  
        }
         
					
    }
			
}

/*
 * Function to find baseline for font with a specicic size
 */
html2canvas.prototype.fontMetrics = function(font,fontSize){
    
    
    var findMetrics = this.fontData.indexOf(font+"-"+fontSize);
    
    if (findMetrics>-1){
        return this.fontData[findMetrics+1];
    }
    
    var container = document.createElement('div');
    document.getElementsByTagName('body')[0].appendChild(container);
    
    // jquery to speed this up, TODO remove jquery dependancy
    $(container).css({
        visibility:'hidden',
        fontFamily:font,
        fontSize:fontSize,
        margin:0,
        padding:0
    });
    

    
    var img = document.createElement('img');
    img.src = "http://html2canvas.hertzen.com/images/8.jpg";
    img.width = 1;
    img.height = 1;
    
    $(img).css({
        margin:0,
        padding:0
    });
    var span = document.createElement('span');
    
    $(span).css({
        fontFamily:font,
        fontSize:fontSize,
        margin:0,
        padding:0
    });
    
    
    span.appendChild(document.createTextNode('Hidden Text'));
    container.appendChild(span);
    container.appendChild(img);
    var baseline = (img.offsetTop-span.offsetTop)+1;
    
    container.removeChild(span);
    container.appendChild(document.createTextNode('Hidden Text'));
    
    $(container).css('line-height','normal');
    $(img).css("vertical-align","super");
    var middle = (img.offsetTop-container.offsetTop)+1;  
    
    var metricsObj = {
        baseline: baseline,
        lineWidth: 1,
        middle: middle
    };
    
    
    this.fontData.push(font+"-"+fontSize);
    this.fontData.push(metricsObj);
    
    $(container).remove();
    
    
    
    return metricsObj;
    
}


/*
 * Function to apply text-transform attribute to text
 */    
html2canvas.prototype.textTransform = function(text,transform){
    switch(transform){
        case "lowercase":
            return text.toLowerCase();
            break;
					
        case "capitalize":
            return text.replace( /(^|\s|:|-|\(|\))([a-z])/g , function(m,p1,p2){
                return p1+p2.toUpperCase();
            } );
            break;
					
        case "uppercase":
            return text.toUpperCase();
            break;
        default:
            return text;
				
    }
        
}
     
     
     
/*
 *Function to trim whitespace from text
 */
html2canvas.prototype.trim = function(text) {
    return text.replace(/^\s*/, "").replace(/\s*$/, "");
}
 
    
html2canvas.prototype.parseElement = function(element){
    var _ = this;
    this.each(element.children,function(index,el){		
        _.parsing(el);	
    });
        

    this.finish();
}


        
html2canvas.prototype.parsing = function(el){
        
    var ignRe = new RegExp("("+this.ignoreElements+")");
    var _ = this;
    if (!ignRe.test(el.nodeName)){
            
         		
        this.newElement(el);
        // TODO remove jQuery dependancy

        var contents = $(el).contents();
            
        
        if (contents.length == 1){
	
            // check nodeType
            if (contents[0].nodeType==1){
                // it's an element, so let's look inside it
                this.parsing(contents[0]);
            }else if (contents[0].nodeType==3){   
                // it's a text node, so lets print the text
                this.newText(el,contents[0]);
            }
        }else{
		
            this.each(contents,function(cid,cel){
					
                if (cel.nodeType==1){
                    // element
                    _.parsing(cel);								
                }else if (cel.nodeType==3){                   
                    _.newText(el,cel);								
                }              
						
            });
                
        }
    }	
}
    

// Simple logger
html2canvas.prototype.log = function(a){
    
    if (this.opts.logging){
        
        var logger = window.console.log || function(log){
            alert(log);
        };
        /*
        if (typeof(window.console) != "undefined" && console.log){
            console.log(a);
        }else{
            alert(a);
        }*/
    }
}                    


/**
 * Function to provide bounds for element
 * @return {Bounds} object with position and dimension information
 */
html2canvas.prototype.getBounds = function(el){
        
    window.scroll(0,0);
        
    if (el.getBoundingClientRect){	
        var bounds = el.getBoundingClientRect();	
        bounds.top = bounds.top;
        bounds.left = bounds.left;
        return bounds;
    }else{
            
        // TODO remove jQuery dependancy
        var p = $(el).offset();       
          
        return {               
            left: p.left + parseInt(this.getCSS(el,"border-left-width"),10),
            top: p.top + parseInt(this.getCSS(el,"border-top-width"),10),
            width:$(el).innerWidth(),
            height:$(el).innerHeight()                
        }

    }           
}
    
     
     
/*
 * Function for looping through array
 */
html2canvas.prototype.each = function(arrayLoop,callbackFunc){
    callbackFunc = callbackFunc || function(){};
    for (var i=0;i<arrayLoop.length;i++){       
        callbackFunc(i,arrayLoop[i]);
    }
}


    
/*
 * Function for fetching the element attribute
 */  
html2canvas.prototype.getAttr = function(el,attribute){
    return el.getAttribute(attribute);
//return $(el).attr(attribute);
}

/*
 * Function to extend object
 */
html2canvas.prototype.extendObj = function(options,defaults){
    for (var key in options){              
        defaults[key] = options[key];
    }
    return defaults;           
}
    

    
/*
 * Get element childNodes
 */
    
html2canvas.prototype.getContents = function(el){
    return (el.nodeName ==  "iframe" ) ?
    el.contentDocument || el.contentWindow.document :
    el.childNodes;
}

    
/*
 * Function for fetching the css attribute
 * TODO remove jQuery dependancy
 */
html2canvas.prototype.getCSS = function(el,attribute){
    return $(el).css(attribute);
}
