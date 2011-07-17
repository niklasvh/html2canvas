



html2canvas.prototype.newElement = function(el,parentStack){
					
    var bounds = this.getBounds(el);    
            
    var x = bounds.left;
    var y = bounds.top;
    var w = bounds.width;
    var h = bounds.height;   
    var _ = this,
    image;       
    var bgcolor = this.getCSS(el,"background-color");

    var zindex = this.formatZ(this.getCSS(el,"z-index"),this.getCSS(el,"position"),parentStack.zIndex,el.parentNode);
    
    //console.log(el.nodeName+":"+zindex+":"+this.getCSS(el,"position")+":"+this.numDraws+":"+this.getCSS(el,"z-index"))
    
    var opacity = this.getCSS(el,"opacity");   
    
    //if (this.getCSS(el,"position")!="static"){
          
          /*
        this.contextStacks.push(ctx);
        
        ctx = new this.storageContext(); 
        */
       
       
    
       
       var stack = {
           ctx: new this.storageContext(),
           zIndex: zindex,
           opacity: opacity
       };
       
        var stackLength =  this.contextStacks.push(stack);
        
        var ctx = this.contextStacks[stackLength-1].ctx; 
    //}
			

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
                   
            _.newRect(ctx,bx,by,bw,bh,borderData.color);	
                
                    
          
        }
                
    });



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
    this.newRect(
        ctx,
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
    }
    ,ctx);
        
    if (el.nodeName=="IMG"){
        image = _.loadImage(_.getAttr(el,'src'));
        if (image){
            
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
           
        }else{
            this.log("Error loading <img>:" + _.getAttr(el,'src'));
        }
    }
    
         

        return this.contextStacks[stackLength-1];

			
				
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