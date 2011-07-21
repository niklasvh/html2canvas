
    
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