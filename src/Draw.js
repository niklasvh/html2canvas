



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
            this.ctx.drawImage(
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