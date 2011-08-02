/* 
 * html2canvas v0.27 <http://html2canvas.hertzen.com>
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
        ready: function (stack) {
            document.body.appendChild(stack.canvas);
        },
        storageReady: function(obj){
            obj.Renderer(obj.contextStacks);
        },
        iframeDefault: "default",
        flashCanvasPath: "http://html2canvas.hertzen.com/external/flashcanvas/flashcanvas.js",
        renderViewport: false,
        reorderZ: true,
        throttle:true,
        letterRendering:false,
        proxyUrl: null,
        logger: function(a){
            if (window.console && window.console.log){
                window.console.log(a);     
            }else{
                alert(a);
            }
        },
        canvasWidth:0,
        canvasHeight:0,
        useOverflow: true,
        renderOrder: "canvas flash html"
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
    this.numDraws = 0;
    this.contextStacks = [];
    this.ignoreElements = "IFRAME|OBJECT|PARAM";
    this.needReorder = false;
    this.blockElements = new RegExp("(BR|PARAM)");
    this.pageOrigin = window.location.protocol + window.location.host;
    this.queue = [];

    this.ignoreRe = new RegExp("("+this.ignoreElements+")");
    
    
    this.support = {
        rangeBounds: false
        
    };
    
    // Test whether we can use ranges to measure bounding boxes
    // Opera doesn't provide valid bounds.height/bottom even though it supports the method.

    
    if (document.createRange){
        var r = document.createRange();
        //this.support.rangeBounds = new Boolean(r.getBoundingClientRect);
        if (r.getBoundingClientRect){
            var testElement = document.createElement('boundtest');
            testElement.style.height = "123px";
            testElement.style.display = "block";
            document.getElementsByTagName('body')[0].appendChild(testElement);
            
            r.selectNode(testElement);
            var rangeBounds = r.getBoundingClientRect();
            var rangeHeight = rangeBounds.height;

            if (rangeHeight==123){
                this.support.rangeBounds = true;
            }
            document.getElementsByTagName('body')[0].removeChild(testElement);

            
        }
        
    }
  
   
    
    // Start script
    this.init();
    
    return this;
}
	
        
        
                                
html2canvas.prototype.init = function(){
     
    var _ = this;
    /*
    this.ctx = new this.stackingContext($(document).width(),$(document).height());    
              
    if (!this.ctx){
        // canvas not initialized, let's kill it here
        this.log('Canvas not available');
        return;
    }
       
    this.canvas = this.ctx.canvas;
        */
    this.log('Finding background-images');
        
    this.images.push('start');
    
    this.getImages(this.element);
            
    this.log('Finding images');
    // console.log(this.element.ownerDocument);
   
    
   
    this.each(this.element.ownerDocument.images,function(i,e){
        _.preloadImage(_.getAttr(e,'src'));
    });
    this.images.splice(0,1);  
    //  console.log(this.images);   
    if (this.images.length == 0){
        this.start();
    }  
        
        
}

/*
 * Check whether all assets have been loaded and start traversing the DOM
 */
 
html2canvas.prototype.start = function(){
    //     console.log(this.images);
    if (this.images.length == 0 || this.imagesLoaded==this.images.length/2){    
        
        this.log('Finished loading '+this.imagesLoaded+' images, Started parsing');
          this.bodyOverflow = document.getElementsByTagName('body')[0].style.overflow;
           document.getElementsByTagName('body')[0].style.overflow = "hidden";
        var rootStack = new this.storageContext($(document).width(),$(document).height());  
        rootStack.opacity = this.getCSS(this.element,"opacity");
        var stack = this.newElement(this.element,rootStack);
        
        
        this.parseElement(this.element,stack);  
    }
        
}


html2canvas.prototype.stackingContext = function(width,height){
    this.canvas = document.createElement('canvas');
        

    this.canvas.width = width;
    this.canvas.height = width;
    
    if (!this.canvas.getContext){
           
    // TODO include Flashcanvas
    /*
        var script = document.createElement('script');
        script.type = "text/javascript";
        script.src = this.opts.flashCanvasPath;
        var s = document.getElementsByTagName('script')[0]; 
        s.parentNode.insertBefore(script, s);

        if (typeof FlashCanvas != "undefined") {
                
            FlashCanvas.initElement(this.canvas);
            this.ctx = this.canvas.getContext('2d');
        }	*/
            
    }else{
        this.ctx = this.canvas.getContext('2d');
    }    
    
    // set common settings for canvas
    this.ctx.textBaseline = "bottom";
    
    return this.ctx;
          
}

html2canvas.prototype.storageContext = function(width,height){
    this.storage = [];
    this.width = width;
    this.height = height;
    //this.zIndex;
    
    // todo simplify this whole section
    this.fillRect = function(x, y, w, h){
        this.storage.push(
        {
            type: "function",
            name:"fillRect",
            arguments:[x,y,w,h]            
        });
        
    };
    

        
    this.drawImage = function(image,sx,sy,sw,sh,dx,dy,dw,dh){     
        this.storage.push(
        {
            type: "function",
            name:"drawImage",
            arguments:[image,sx,sy,sw,sh,dx,dy,dw,dh]            
        });
    };
    
    this.fillText = function(currentText,x,y){
        
        this.storage.push(
        {
            type: "function",
            name:"fillText",
            arguments:[currentText,x,y]            
        });      
    }  
    
    return this;
    
}


/*
* Finished rendering, send callback
*/ 

html2canvas.prototype.finish = function(){
    
    this.log("Finished rendering");
    
    document.getElementsByTagName('body')[0].style.overflow = this.bodyOverflow;
    /*
    if (this.opts.renderViewport){
        // let's crop it to viewport only then
        var newCanvas = document.createElement('canvas');
        var newctx = newCanvas.getContext('2d');
        newCanvas.width = window.innerWidth;
        newCanvas.height = window.innerHeight;
            
    }*/
    this.opts.ready(this);          
}



    
html2canvas.prototype.drawBackground = function(el,bounds,ctx){
               
     
    var background_image = this.getCSS(el,"background-image");
    var background_repeat = this.getCSS(el,"background-repeat");
        
    if (typeof background_image != "undefined" && /^(1|none)$/.test(background_image)==false && /^(-webkit|-moz|linear-gradient|-o-)/.test(background_image)==false){
         
        background_image = this.backgroundImageUrl(background_image);
        var image = this.loadImage(background_image);
					

        var bgp = this.getBackgroundPosition(el,bounds,image),
        bgy;

        if (image){
            switch(background_repeat){
					
                case "repeat-x":
                    this.drawbackgroundRepeatX(ctx,image,bgp,bounds.left,bounds.top,bounds.width,bounds.height);                     
                    break;
                         
                case "repeat-y":
                    this.drawbackgroundRepeatY(ctx,image,bgp,bounds.left,bounds.top,bounds.width,bounds.height);                                             
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
                    var bgw = bounds.width-bgp.left,
                    bgh = bounds.height-bgp.top,
                    bgsx = bgp.left,
                    bgsy = bgp.top,
                    bgdx = bgp.left+bounds.left,
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
                        this.drawImage(
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
                        break;
                    }
                        
                default:
                    var height,
                    add;
                        
                              
                    bgp.top = bgp.top-Math.ceil(bgp.top/image.height)*image.height;                
                        
                        
                    for(bgy=(bounds.top+bgp.top);bgy<bounds.height+bounds.top;){  
           
                        
           
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
                                              
                        this.drawbackgroundRepeatX(ctx,image,bgp,bounds.left,bgy,bounds.width,height);  
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
    var bgpos = this.getCSS(el,"backgroundPosition") || "0 0";
   // var bgpos = $(el).css("backgroundPosition") || "0 0";
    var bgposition = bgpos.split(" "),
    topPos,
    left,
    percentage;

    if (bgposition.length==1){
        var val = bgposition,
        bgposition = [];
        
        bgposition[0] = val,
        bgposition[1] = val;
    }  

    

    if (bgposition[0].toString().indexOf("%")!=-1){   
   
        percentage = (parseFloat(bgposition[0])/100);        
        left =  ((bounds.width * percentage)-(image.width*percentage));
      
    }else{
        left = parseInt(bgposition[0],10);
    }

    if (bgposition[1].toString().indexOf("%")!=-1){  

        percentage = (parseFloat(bgposition[1])/100);     
        topPos =  ((bounds.height * percentage)-(image.height*percentage));
    }else{
        
        topPos = parseInt(bgposition[1],10);
        
    }
    

    
    
    var returnObj = {}
    /*
        "top": topPos,
        "left": left
    };*/
    

    returnObj.top = topPos;
    returnObj.left = left;
    

          
    return returnObj;
         
}



    
html2canvas.prototype.drawbackgroundRepeatY = function(ctx,image,bgp,x,y,w,h){
        
    var height,
    width = Math.min(image.width,w),bgy;   
            
    bgp.top = bgp.top-Math.ceil(bgp.top/image.height)*image.height;                
        
        
    for(bgy=(y+bgp.top);bgy<h+y;){   
            
         
        if ( Math.floor(bgy+image.height)>h+y){
            height = (h+y)-bgy;
        }else{
            height = image.height;
        }
        this.drawBackgroundRepeat(ctx,image,x+bgp.left,bgy,width,height,x,y);   
      
        bgy = Math.floor(bgy+image.height); 
                              
    } 
}
    
html2canvas.prototype.drawbackgroundRepeatX = function(ctx,image,bgp,x,y,w,h){
                           
    var height = Math.min(image.height,h),
    width,bgx;             
        
            
    bgp.left = bgp.left-Math.ceil(bgp.left/image.width)*image.width;                
        
        
    for(bgx=(x+bgp.left);bgx<w+x;){   

        if (Math.floor(bgx+image.width)>w+x){
            width = (w+x)-bgx;
        }else{
            width = image.width;
        }
                
        this.drawBackgroundRepeat(ctx,image,bgx,(y+bgp.top),width,height,x,y);       
             
        bgx = Math.floor(bgx+image.width); 

                                
    } 
}
    
html2canvas.prototype.drawBackgroundRepeat = function(ctx,image,x,y,width,height,elx,ely){
    var sourceX = 0,
    sourceY=0;
    if (elx-x>0){
        sourceX = elx-x;
    }
        
    if (ely-y>0){
        sourceY = ely-y;
    }

    this.drawImage(
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

html2canvas.prototype.drawBorders = function(el,ctx, bounds,clip){
    
    
    var x = bounds.left;
    var y = bounds.top;
    var w = bounds.width;
    var h = bounds.height;
    
    /*
     *  TODO add support for different border-style's than solid   
     */            
    var borders = this.getBorderData(el);    
    var _ = this;
    
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
                   
            var borderBounds = {
                left:bx,
                top:by,
                width: bw,
                height:bh
            };
                   
            if (clip){
               borderBounds = _.clipBounds(borderBounds,clip);
            }
                   
                   
            if (borderBounds.width>0 && borderBounds.height>0){       
            _.newRect(ctx,bx,by,borderBounds.width,borderBounds.height,borderData.color);
            }
                
                    
          
        }
                
    });
    
    return borders;
    
};

html2canvas.prototype.newElement = function(el,parentStack){
		
    var bounds = this.getBounds(el);    
            
    var x = bounds.left;
    var y = bounds.top;
    var w = bounds.width;
    var h = bounds.height;   
    var _ = this,
    image;       
    var bgcolor = this.getCSS(el,"background-color");

    var cssPosition = this.getCSS(el,"position");
    parentStack = parentStack || {};

    //var zindex = this.formatZ(this.getCSS(el,"zIndex"),cssPosition,parentStack.zIndex,el.parentNode);
    
    var zindex = this.setZ(this.getCSS(el,"zIndex"),cssPosition,parentStack.zIndex,el.parentNode);
    
    //console.log(el.nodeName+":"+zindex+":"+this.getCSS(el,"position")+":"+this.numDraws+":"+this.getCSS(el,"z-index"))
    
    var opacity = this.getCSS(el,"opacity");   


    var stack = {
        ctx: new this.storageContext(),
        zIndex: zindex,
        opacity: opacity*parentStack.opacity,
        cssPosition: cssPosition
    };
    
    
 
    // TODO correct overflow for absolute content residing under a static position
    if (parentStack.clip){
        stack.clip = $.extend({}, parentStack.clip);
        //stack.clip = parentStack.clip;
        stack.clip.height = stack.clip.height - parentStack.borders[2].width;
    } 
 
 
    if (this.opts.useOverflow && /(hidden|scroll|auto)/.test(this.getCSS(el,"overflow")) && !/(BODY)/i.test(el.nodeName)){
        if (stack.clip){
            stack.clip = this.clipBounds(stack.clip,bounds);
        }else{
            stack.clip = bounds;
        }
        


    }   
     /*  
    var stackLength =  this.contextStacks.push(stack);
        
    var ctx = this.contextStacks[stackLength-1].ctx; 
*/

    var stackLength =  zindex.children.push(stack);
        
    var ctx = zindex.children[stackLength-1].ctx; 
    
    this.setContextVariable(ctx,"globalAlpha",stack.opacity);  

    // draw element borders
    var borders = this.drawBorders(el, ctx, bounds);
    stack.borders = borders;
    
    // let's modify clip area for child elements, so borders dont get overwritten
    
    /*
    if (stack.clip){
        stack.clip.width = stack.clip.width-(borders[1].width); 
        stack.clip.height = stack.clip.height-(borders[2].width); 
    }
     */
    if (this.ignoreRe.test(el.nodeName) && this.opts.iframeDefault != "transparent"){ 
        if (this.opts.iframeDefault=="default"){
            bgcolor = "#efefef";
        /*
             * TODO write X over frame
             */
        }else{
            bgcolor = this.opts.iframeDefault;           
        }
    }
               
    // draw base element bgcolor   

    var bgbounds = {
        left: x+borders[3].width,
        top: y+borders[0].width,
        width: w-(borders[1].width+borders[3].width),
        height: h-(borders[0].width+borders[2].width)
    };

    //if (this.withinBounds(stack.clip,bgbounds)){  
        
    if (stack.clip){
        bgbounds = this.clipBounds(bgbounds,stack.clip);
        
    //}    
    
    }
    
    if (bgbounds.height>0 && bgbounds.width>0){
        this.newRect(
            ctx,
            bgbounds.left,
            bgbounds.top,
            bgbounds.width,
            bgbounds.height,
            bgcolor
            );
           
        this.drawBackground(el,bgbounds,ctx);     
    }
        
    switch(el.nodeName){
        case "IMG":
            image = _.loadImage(_.getAttr(el,'src'));
            if (image){
                //   console.log(image.width);
                this.drawImage(
                    ctx,
                    image,
                    0, //sx
                    0, //sy
                    image.width, //sw
                    image.height, //sh
                    x+parseInt(_.getCSS(el,'padding-left'),10) + borders[3].width, //dx
                    y+parseInt(_.getCSS(el,'padding-top'),10) + borders[0].width, // dy
                    bounds.width - (borders[1].width + borders[3].width + parseInt(_.getCSS(el,'padding-left'),10) + parseInt(_.getCSS(el,'padding-right'),10)), //dw
                    bounds.height - (borders[0].width + borders[2].width + parseInt(_.getCSS(el,'padding-top'),10) + parseInt(_.getCSS(el,'padding-bottom'),10)) //dh       
                    );
           
            }else {
                this.log("Error loading <img>:" + _.getAttr(el,'src'));
            }
            break;
        case "INPUT":
            // TODO add all relevant type's, i.e. HTML5 new stuff
            // todo add support for placeholder attribute for browsers which support it
            if (/^(text|url|email|submit|button|reset)$/.test(el.type) && el.value.length > 0){
                
                this.renderFormValue(el,bounds,stack);
                

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
            this.renderFormValue(el,bounds,stack);
            }
            break;
                    case "SELECT":
                         if (el.options.length > 0){
            this.renderFormValue(el,bounds,stack);
            }
            break;
    }
    
         

   // return this.contextStacks[stackLength-1];
   return zindex.children[stackLength-1];
			
				
}






/*
* Function to draw the text on the canvas
*/ 
               
html2canvas.prototype.printText = function(currentText,x,y,ctx){
    if (this.trim(currentText).length>0){	
        
        ctx.fillText(currentText,x,y);
        this.numDraws++;
    }           
}


// Drawing a rectangle 								
html2canvas.prototype.newRect = function(ctx,x,y,w,h,bgcolor){
    
    if (bgcolor!="transparent"){
        this.setContextVariable(ctx,"fillStyle",bgcolor);
        ctx.fillRect (x, y, w, h);
        this.numDraws++;
    }
}

html2canvas.prototype.drawImage = function(ctx,image,sx,sy,sw,sh,dx,dy,dw,dh){
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
    this.numDraws++; 
    
}
html2canvas.prototype.renderFormValue = function(el,bounds,stack){
    
    var valueWrap = document.createElement('valuewrap'),
    _ = this;
                
    this.each(['lineHeight','textAlign','fontFamily','color','fontSize','paddingLeft','paddingTop','width','height','border','borderLeftWidth','borderTopWidth'],function(i,style){                 
        valueWrap.style[style] = _.getCSS(el,style);
    });
                
    valueWrap.style.borderColor = "black";            
    valueWrap.style.borderStyle = "solid";  
    valueWrap.style.display = "block";
    valueWrap.style.position = "absolute";
    if (/^(submit|reset|button|text|password)$/.test(el.type) || el.nodeName == "SELECT"){
        valueWrap.style.lineHeight = _.getCSS(el,"height");
    }
  
                
    valueWrap.style.top = bounds.top+"px";
    valueWrap.style.left = bounds.left+"px";
    if (el.nodeName == "SELECT"){
        // TODO increase accuracy of text position
        var textValue = el.options[el.selectedIndex].text;
    } else{   
        var textValue = el.value;
        
    }
    var textNode = document.createTextNode(textValue);
    
    valueWrap.appendChild(textNode);
    $('body').append(valueWrap);
                
    this.newText(el,textNode,stack);
                
    $(valueWrap).remove();
   
    
}
/*
 * Function to find all images from <img> and background-image   
 */            
html2canvas.prototype.getImages = function(el) {
        
    var self = this;
    
    if (!this.ignoreRe.test(el.nodeName)){
        // TODO remove jQuery dependancy
        this.each($(el).contents(),function(i,element){    
            var ignRe = new RegExp("("+this.ignoreElements+")");
            if (!ignRe.test(element.nodeName)){
                self.getImages(element);
            }
        })
    }
          
    if (el.nodeType==1 || typeof el.nodeType == "undefined"){
        var background_image = this.getCSS(el,'background-image');
           
        if (background_image && background_image != "1" && background_image != "none" && background_image.substring(0,7)!="-webkit" && background_image.substring(0,3)!="-o-" && background_image.substring(0,4)!="-moz"){
            
            var src = this.backgroundImageUrl(background_image);                    
            this.preloadImage(src);                    
        }
    }
}  


/*
 * Load image from storage
 */
    
html2canvas.prototype.loadImage = function(src){	
        
    var imgIndex = this.getIndex(this.images,src);
    if (imgIndex!=-1){
        return this.images[imgIndex+1];
    }else{
        return false;
    }
				
}




        
html2canvas.prototype.preloadImage = function(src){


    if (this.getIndex(this.images,src)==-1){
        if (this.isSameOrigin(src)){
            this.images.push(src);
            //     console.log('a'+src);
            var img = new Image();   
            // TODO remove jQuery dependancy
            var _ = this;
            $(img).load(function(){
                _.imagesLoaded++;               
                _.start();        
                
            });	
            img.onerror = function(){
                _.images.splice(_.images.indexOf(img.src),2);
                //  _.imagesLoaded++;
                _.start();                           
            }
            img.src = src; 
            this.images.push(img);
        }else if (this.opts.proxyUrl){
            //    console.log('b'+src);
            this.images.push(src);
            var img = new Image();   
            this.proxyGetImage(src,img);
            this.images.push(img);
        }
    }     
          
}

html2canvas.prototype.proxyGetImage = function(url,img){
    var _ = this;
    
    var link = document.createElement("a");
    link.href = url;
    url = link.href; // work around for pages with base href="" set

    
    // todo remove jQuery dependency and enable xhr2 requests where available (no need for base64 / json)
    $.ajax({
        data:{
            xhr2:false,
            url:url
        },
        url: this.opts.proxyUrl,
        dataType: "jsonp",
        success: function(a){
            
            if (a.substring(0,6)=="error:"){
                _.images.splice(_.images.indexOf(url),2);
                _.start();  
                _.log('Proxy was unable to load '+url+' '+a);
            }else{
                // document.createElement(a);
                // console.log(img);
                img.onload = function(){
                    //   console.log('w'+img.width);
                    _.imagesLoaded++;               
                    _.start();   
               
                }
            
                img.src = a; 
            }


        },
        error: function(){
           
            _.images.splice(_.images.indexOf(url),2);
            //  _.imagesLoaded++;
            _.start();          
        }
        
        
    });
    
}
html2canvas.prototype.Renderer = function(queue){
     
    var _ = this;
    
    this.log('Renderer initiated');
    
    this.each(this.opts.renderOrder.split(" "),function(i,renderer){
        
        switch(renderer){
            case "canvas":
                _.canvas = document.createElement('canvas');
                if (_.canvas.getContext){
                    _.canvasRenderer(queue);
                    _.log('Using canvas renderer');
                    return false;
                }               
                break;
            case "flash":
                /*
                var script = document.createElement('script');
                script.type = "text/javascript";
                script.src = _.opts.flashCanvasPath;
                var s = document.getElementsByTagName('script')[0]; 
                s.parentNode.insertBefore(script, s);
                        
                    
                if (typeof FlashCanvas != "undefined") {  
                    _.canvas = initCanvas(document.getElementById("testflash"));
                    FlashCanvas.initElement(_.canvas);
                    _.ctx = _.canvas.getContext("2d");
                    // _.canvas = document.createElement('canvas');
                    //
                    _.log('Using Flashcanvas renderer');
                    _.canvasRenderer(queue);
                    
                    return false;
                }  
                     */    
                
                break;
            case "html":
                // TODO add renderer
                _.log("Using HTML renderer");
                return false;
                break;
             
             
        }
         
         
         
    });
    
    //    this.log('No renderer chosen, rendering quit');
    return this;
     
// this.canvasRenderer(queue);
     
/*
     if (!this.canvas.getContext){
           
           
     }*/
// TODO include Flashcanvas
/*
        var script = document.createElement('script');
        script.type = "text/javascript";
        script.src = this.opts.flashCanvasPath;
        var s = document.getElementsByTagName('script')[0]; 
        s.parentNode.insertBefore(script, s);

        if (typeof FlashCanvas != "undefined") {
                
            FlashCanvas.initElement(this.canvas);
            this.ctx = this.canvas.getContext('2d');
        }	*/ 
    
}


html2canvas.prototype.throttler = function(queue){
    
    
    };


html2canvas.prototype.canvasRenderContext = function(storageContext,ctx){
    
    // set common settings for canvas
    ctx.textBaseline = "bottom";
    var _ = this;
     
     
    if (storageContext.clip){
        ctx.save();
        ctx.beginPath();
        // console.log(storageContext);
        ctx.rect(storageContext.clip.left,storageContext.clip.top,storageContext.clip.width,storageContext.clip.height);
        ctx.clip();
        
    }
        
    if (storageContext.ctx.storage){
        _.each(storageContext.ctx.storage,function(a,renderItem){

          
            switch(renderItem.type){
                case "variable":
                    ctx[renderItem.name] = renderItem.arguments;              
                    break;
                case "function":
                    if (renderItem.name=="fillRect"){
                        
                        ctx.fillRect(
                            renderItem.arguments[0],
                            renderItem.arguments[1],
                            renderItem.arguments[2],
                            renderItem.arguments[3]
                            );
                    }else if(renderItem.name=="fillText"){
                        // console.log(renderItem.arguments[0]);
                        ctx.fillText(renderItem.arguments[0],renderItem.arguments[1],renderItem.arguments[2]);
                    
                    }else if(renderItem.name=="drawImage"){
                        //  console.log(renderItem);
                        // console.log(renderItem.arguments[0].width);    
                        if (renderItem.arguments[8] > 0 && renderItem.arguments[7]){
                            ctx.drawImage(
                                renderItem.arguments[0],
                                renderItem.arguments[1],
                                renderItem.arguments[2],
                                renderItem.arguments[3],
                                renderItem.arguments[4],
                                renderItem.arguments[5],
                                renderItem.arguments[6],
                                renderItem.arguments[7],
                                renderItem.arguments[8]
                                );
                        }      
                    }else{
                        _.log(renderItem);
                    }
                       
  
                    break;
                default:
                               
            }
                
                
        });

    }  
    if (storageContext.clip){
        ctx.restore();
    }
    
}

/*
html2canvas.prototype.canvasRenderContextChildren = function(storageContext,parentctx){
    var ctx = storageContext.canvas.getContext('2d');         

    storageContext.canvasPosition = storageContext.canvasPosition || {};             
    this.canvasRenderContext(storageContext,ctx);
    
    
    for (var s = 0; s<this.queue.length;){
        if (storageContext.parentStack && this.queue[s].canvas === storageContext.parentStack.canvas){
            var substorageContext = this.queue.splice(s,1)[0]; 
            
            if (substorageContext.ctx.storage[5] && substorageContext.ctx.storage[5].arguments[0]=="Highlights"){    
               console.log('ssssssadasda');
            }    
            
            this.canvasRenderContextChildren(substorageContext,ctx);
        //   this.canvasRenderContext(substorageContext,ctx);
        //    this.canvasRenderStorage(this.queue,ctx);
            
                    
        }else{
            s++;
        }
                  
    }
    
    
    
            
    if (storageContext.ctx.storage[5] && storageContext.ctx.storage[5].arguments[0]=="Highlights"){    
        $('body').append(parentctx.canvas);
    }    
    //var parentctx = this.canvas.getContext("2d");
            
    if (storageContext.canvas.width>0 && storageContext.canvas.height > 0){
        parentctx.drawImage(storageContext.canvas,(storageContext.canvasPosition.x || 0),(storageContext.canvasPosition.y || 0));
    }
    
    
}
*/
html2canvas.prototype.canvasRenderStorage = function(queue,parentctx){
    

    
  
    for (var i = 0; i<queue.length;){
        var storageContext = queue.splice(0,1)[0];
        
       
       
        // storageContext.removeOverflow = storageContext.removeOverflow || {};
        /*
        if (storageContext.canvas){
            this.canvasRenderContextChildren(storageContext,parentctx);
        
            var ctx = storageContext.canvas.getContext('2d');         

            storageContext.canvasPosition = storageContext.canvasPosition || {};             
            this.canvasRenderContext(storageContext,ctx);
            
            for (var s = 0; s<this.queue.length;){
                if (this.queue[s].canvas === storageContext.canvas){
                    var substorageContext = this.queue.splice(s,1)[0];
                    substorageContext.canvasPosition = storageContext.canvasPosition || {};     
                    
                    this.canvasRenderContext(substorageContext,ctx);
                // this.canvasRenderStorage(this.queue,ctx);
                    
                }else{
                    s++;
                }
                  
            }
            
            
            //var parentctx = this.canvas.getContext("2d");
            
            if (storageContext.canvas.width>0 && storageContext.canvas.height > 0){
                parentctx.drawImage(storageContext.canvas,(storageContext.canvasPosition.x || 0),(storageContext.canvasPosition.y || 0));
            }
            ctx = parentctx;
            
        }else{
        */
        storageContext.canvasPosition = storageContext.canvasPosition || {};             
        this.canvasRenderContext(storageContext,parentctx);           
    //  }
        
        
    /*
        if (storageContext.newCanvas){
            var ctx = _.canvas.getContext("2d");
            ctx.drawImage(canvas,(storageContext.removeOverflow.left || 0),(storageContext.removeOverflow.top || 0));
            _.ctx = ctx;
        }*/
       
       
   
    }
}



html2canvas.prototype.canvasRenderer = function(queue){
    var _ = this;
    this.sortZ(this.zStack);
    queue = this.queue;
    //console.log(queue);

    //queue = this.sortQueue(queue);
    
    
    
        
  
    this.canvas.width = Math.max($(document).width(),this.opts.canvasWidth);   
    this.canvas.height = Math.max($(document).height(),this.opts.canvasHeight);
    
    this.ctx = this.canvas.getContext("2d");
    
    this.canvasRenderStorage(queue,this.ctx);
    

    
};     

/*
 * Sort elements based on z-index and position attributes
 */


html2canvas.prototype.sortQueue = function(queue){
    if (!this.opts.reorderZ || !this.needReorder) return queue;
    
    var longest = 0;
    this.each(queue,function(i,e){
        if (longest<e.zIndex.length){
            longest = e.zIndex.length;
        }
    });
    
    var counter = 0;
    //console.log(((queue.length).toString().length)-(count.length).toString().length);
    this.each(queue,function(i,e){
        
        var more = ((queue.length).toString().length)-((counter).toString().length);
        while(longest>e.zIndex.length){
            e.zIndex += "0";
        }
        e.zIndex = e.zIndex+counter;
        
        while((longest+more+(counter).toString().length)>e.zIndex.length){
            e.zIndex += "0";
        }
        counter++;
    //     console.log(e.zIndex);
    });
    
   
    
    queue = queue.sort(function(a,b){
        
        if (a.zIndex < b.zIndex) return -1; 
        if (a.zIndex > b.zIndex) return 1;
        return 0; 
    });
    
    
    /*

    console.log('after');
    this.each(queue,function(i,e){
        console.log(i+":"+e.zIndex); 
       // console.log(e.ctx.storage); 
    });    */
    
    return queue;
}

html2canvas.prototype.setContextVariable = function(ctx,variable,value){
    if (!ctx.storage){
        ctx[variable] = value;
    }else{
        ctx.storage.push(
        {
            type: "variable",
            name:variable,
            arguments:value            
        });
    }
  
}
            
html2canvas.prototype.newText = function(el,textNode,stack,form){
    var ctx = stack.ctx;
    var family = this.getCSS(el,"font-family");
    var size = this.getCSS(el,"font-size");
    var color = this.getCSS(el,"color");
  
    var bold = this.getCSS(el,"font-weight");
    var font_style = this.getCSS(el,"font-style");
    var font_variant = this.getCSS(el,"font-variant");
     
    var text_decoration = this.getCSS(el,"text-decoration");
    var text_align = this.getCSS(el,"text-align");  
    
    
    var letter_spacing = this.getCSS(el,"letter-spacing");

    // apply text-transform:ation to the text
    textNode.nodeValue = this.textTransform(textNode.nodeValue,this.getCSS(el,"text-transform"));
    var text = this.trim(textNode.nodeValue);		
	
    //text = $.trim(text);
    if (text.length>0){
        switch(bold){
            case 401:
                bold = "bold";
                break;
            case 400:
                bold = "normal";
                break;
        }
            
            
        if (text_decoration!="none"){
            var metrics = this.fontMetrics(family,size);
            
        }    
        
        var font = font_variant+" "+bold+" "+font_style+" "+size+" "+family,
        renderList,
        renderWords = false;
        
        	
        text_align = text_align.replace(["-webkit-auto"],["auto"])
        
        
        if (this.opts.letterRendering == false && /^(left|right|justify|auto)$/.test(text_align) && /^(normal|none)$/.test(letter_spacing)){
            // this.setContextVariable(ctx,"textAlign",text_align);  
            renderWords = true;
            renderList = textNode.nodeValue.split(/(\b| )/);
            
        }else{
            //  this.setContextVariable(ctx,"textAlign","left");
            renderList = textNode.nodeValue.split("");
        }
       
       
       
       
        
        this.setContextVariable(ctx,"fillStyle",color);  
        this.setContextVariable(ctx,"font",font);
        
        /*
        if (stack.clip){
        ctx.rect (stack.clip.left, stack.clip.top, stack.clip.width, stack.clip.height);
        ctx.clip();
        }
*/
        

            
         
            var oldTextNode = textNode;
            for(var c=0;c<renderList.length;c++){
            
                // TODO only do the splitting for non-range prints
            
                var newTextNode = oldTextNode.splitText(renderList[c].length);
           
                if (text_decoration!="none" || this.trim(oldTextNode.nodeValue).length != 0){
                
               
           

                    if (this.support.rangeBounds){
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
               
               
       

                    //   console.log(range);
                    //      console.log("'"+oldTextNode.nodeValue+"'"+bounds.left)
                    this.printText(oldTextNode.nodeValue,bounds.left,bounds.bottom,ctx);
                    
                    switch(text_decoration) {
                        case "underline":	
                            // Draws a line at the baseline of the font
                            // TODO As some browsers display the line as more than 1px if the font-size is big, need to take that into account both in position and size         
                            this.newRect(ctx,bounds.left,Math.round(bounds.top+metrics.baseline+metrics.lineWidth),bounds.width,1,color);
                            break;
                        case "overline":
                            this.newRect(ctx,bounds.left,bounds.top,bounds.width,1,color);
                            break;
                        case "line-through":
                            // TODO try and find exact position for line-through
                            this.newRect(ctx,bounds.left,Math.ceil(bounds.top+metrics.middle+metrics.lineWidth),bounds.width,1,color);
                            break;
                    
                    }	
                
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
    
    // TODO add another image
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
 
    
html2canvas.prototype.parseElement = function(element,stack){
    var _ = this;    
    this.each(element.children,function(index,el){	      
        _.parsing(el,stack);	     
    });
    
    this.log('Render queue stored');
    this.opts.storageReady(this);
    this.finish();
}


        
html2canvas.prototype.parsing = function(el,stack){
   
    if (this.getCSS(el,'display') != "none" && this.getCSS(el,'visibility')!="hidden"){ 

        var _ = this;
      
        stack = this.newElement(el,stack) || stack;
        
        var ctx = stack.ctx;
      
        if (!this.ignoreRe.test(el.nodeName)){
            // TODO remove jQuery dependancy	
            this.each(this.contentsInZ(el),function(cid,node){
					
                if (node.nodeType==1){
                    // element
                    _.parsing(node,stack);								
                }else if (node.nodeType==3){   
                    _.newText(el,node,stack);
                }              
						
            });
                
        }	
        

        
    }
// }
}
    

// Simple logger
html2canvas.prototype.log = function(a){    
    if (this.opts.logging){
        
        this.opts.logger(a);

    }
}                    

html2canvas.prototype.withinBounds = function(src,dst){
    if (!src) return true;
    // return true; 
    return (
        (src.left <= dst.left || dst.left+dst.width < src.left) &&
        (src.top <= dst.top || dst.top+dst.height < src.top)
        );
 
    
}


html2canvas.prototype.clipBounds = function(src,dst){
 
    var x = Math.max(src.left,dst.left);
    var y = Math.max(src.top,dst.top);
 
    var x2 = Math.min((src.left+src.width),(dst.left+dst.width));
    var y2 = Math.min((src.top+src.height),(dst.top+dst.height));
 
    return {
        left:x,
        top:y,
        width:x2-x,
        height:y2-y
    };
 
}


/**
 * Function to provide bounds for element
 * @return {Bounds} object with position and dimension information
 */
html2canvas.prototype.getBounds = function(el){
        
    window.scroll(0,0);
        
    if (el.getBoundingClientRect){	
        var clientRect = el.getBoundingClientRect();	
        var bounds = {};
        // need to create new object, as clientrect bounds can't be modified, thanks pufuwozu
        // TODO add scroll position to bounds, so no scrolling of window necessary
        bounds.top = clientRect.top;
        bounds.left = clientRect.left;
        bounds.width = clientRect.width;
        bounds.height = clientRect.height;
        
        
        
        return bounds;
    }else{
            
        // TODO remove jQuery dependancy
        var p = $(el).offset();       
          
        return {               
            left: p.left + this.getCSS(el,"border-left-width",true),
            top: p.top + this.getCSS(el,"border-top-width",true),
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
        if (callbackFunc(i,arrayLoop[i]) === false) return;
    }
}


/*
 * Function to get childNodes of an element in the order they should be rendered (based on z-index)
 * reference http://www.w3.org/TR/CSS21/zindex.html
 */

html2canvas.prototype.contentsInZ = function(el){
    
    // TODO remove jQuery dependency
    
    var contents = $(el).contents();
    
    return contents;
 
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
 *todo remove this function
html2canvas.prototype.leadingZero = function(num,size){
    
    var s = "000000000" + num;
    return s.substr(s.length-size);    
}    
*/

html2canvas.prototype.zContext = function(zindex){
    return {
        zindex: zindex,
        children: []
    }
    
}

html2canvas.prototype.setZ = function(zindex,position,parentZ,parentNode){
    // TODO fix static elements overlapping relative/absolute elements under same stack, if they are defined after them
    if (!parentZ){
        this.zStack = new this.zContext(0);
        return this.zStack;
    }
    
    if (zindex!="auto"){
        this.needReorder = true;
        var newContext = new this.zContext(zindex);
        parentZ.children.push(newContext);
        
        return newContext;
        
    }else {
        return parentZ;
    }
    
}

html2canvas.prototype.sortZ = function(zStack){
    var subStacks = [];
    var stackValues = [];
    var _ = this;

    this.each(zStack.children, function(i,stackChild){
        if (stackChild.children && stackChild.children.length > 0){
            subStacks.push(stackChild);
            stackValues.push(stackChild.zindex);
        }else{         
            _.queue.push(stackChild);
        }
        
    });
    
   
    
    stackValues.sort(function(a,b){return a - b});
    
    this.each(stackValues, function(i,zValue){
          for (var s = 0;s<=subStacks.length;s++){
              if (subStacks[s].zindex == zValue){
                  var stackChild = subStacks.splice(s,1);
                  _.sortZ(stackChild[0]);
                  break;
                  
              }
          }

    });
 
    
}

/*
 *todo remove this function

html2canvas.prototype.formatZ = function(zindex,position,parentZ,parentNode){
    
    if (!parentZ){
        parentZ = "0";
    }


    if (position!="static" && parentZ.charAt(0)=="0"){
        this.needReorder = true;
        parentZ = "1"+parentZ.slice(1);        
    }

    if (zindex=="auto"){
        var parentPosition = this.getCSS(parentNode,"position");
        if (parentPosition!="static" && typeof parentPosition != "undefined"){
            zindex = 0;
        }
    else{
            return parentZ;
        }
    }
    
    var b = this.leadingZero(this.numDraws,9);  
    
    
    var s = this.leadingZero(zindex+1,9);

    // var s = "000000000" + num;
    return parentZ+""+""+s+""+b;
    
    
    
}
    */
    
    
    
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
html2canvas.prototype.getCSS = function(el,attribute,intOnly){
    if (intOnly){
        return parseInt($(el).css(attribute),10); 
    }else{
        return $(el).css(attribute);
    }
}


html2canvas.prototype.getIndex = function(array,src){
    
    if (array.indexOf){
        return array.indexOf(src);
    }else{
        for(var i = 0; i < array.length; i++){
            if(this[i] == src) return i;
        }
        return -1;
    }
    
}


html2canvas.prototype.isSameOrigin = function(url){
    var link = document.createElement("a");
    link.href = url;

    return ((link.protocol + link.host) == this.pageOrigin);
}

