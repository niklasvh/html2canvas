html2canvas.prototype.newElement = function(el,parentStack){
		
    var bounds = this.getBounds(el);    
            
    var x = bounds.left;
    var y = bounds.top;
    var w = bounds.width;
    var h = bounds.height;   
    var _ = this,
    image;       
    var bgcolor = this.getCSS(el,"backgroundColor");

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
        stack.clip = {};
        for (var key in parentStack.clip) {
            stack.clip[key] = parentStack.clip[key];
        }
        stack.clip.height = stack.clip.height - parentStack.borders[2].width;
    } 
 
 
    if (this.opts.useOverflow && (/(hidden|scroll|auto)/).test(this.getCSS(el,"overflow")) && !(/(BODY)/i).test(el.nodeName)){
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
    var borders = this.drawBorders(el, ctx, bounds, false/*clip*/);
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
                    x+_.getCSS(el,'paddingLeft', true) + borders[3].width, //dx
                    y+_.getCSS(el,'paddingTop', true) + borders[0].width, // dy
                    bounds.width - (borders[1].width + borders[3].width + _.getCSS(el,'paddingLeft', true) + _.getCSS(el,'paddingRight', true)), //dw
                    bounds.height - (borders[0].width + borders[2].width + _.getCSS(el,'paddingTop', true) + _.getCSS(el,'paddingBottom', true)) //dh       
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
        case "LI":
            this.drawListItem(el,stack,bgbounds);
            break;
    }
    
         

   // return this.contextStacks[stackLength-1];
   return zindex.children[stackLength-1];
			
				
};






/*
* Function to draw the text on the canvas
*/ 
               
html2canvas.prototype.printText = function(currentText,x,y,ctx){
    if (this.trim(currentText).length>0){	
        
        ctx.fillText(currentText,x,y);
        this.numDraws++;
    }           
};


// Drawing a rectangle 								
html2canvas.prototype.newRect = function(ctx,x,y,w,h,bgcolor){
    
    if (bgcolor!="transparent"){
        this.setContextVariable(ctx,"fillStyle",bgcolor);
        ctx.fillRect (x, y, w, h);
        this.numDraws++;
    }
};

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
    
};
