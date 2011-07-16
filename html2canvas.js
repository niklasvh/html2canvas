/* 
 * html2canvas v0.11 <http://html2canvas.hertzen.com>
 * 
 * Copyright 2011, Niklas von Hertzen <http://hertzen.com>
 * http://www.twitter.com/niklasvh 
 * 
 * Released under the MIT License <http://www.opensource.org/licenses/mit-license.php>
 */


function html2canvas(el,userOptions) {

    var options = userOptions || {};
  
    var opts = {          
        logging:false,
        ready: function(canvas){
            document.body.appendChild(canvas);
        },
        renderViewport: true		
    };
    opts = extendObj(options,opts);

    var imageLoaded,
    imagesLoaded = 0,
    images = [],
    canvas,
    ctx,
    bgx,
    bgy,
    image,
    ignoreElements = "IFRAME|OBJECT|PARAM";
    
  
    
    // test how to measure text bounding boxes
    var useRangeBounds = false;
    if (document.createRange){
        var r = document.createRange();
        useRangeBounds = new Boolean(r.getBoundingClientRect);
    }


    function init(){
       
       
        canvas = document.createElement('canvas');
        
        // TODO remove jQuery dependency
        canvas.width = $(document).width();
        canvas.height = $(document).height()+10;
        
        

        if (!canvas.getContext){
            
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
            ctx = canvas.getContext('2d');
        }
        
        if (!ctx){
            // canvas not initialized, let's kill it here
            log('Canvas not available');
            return;
        }
       
        // set common settings for canvas
        ctx.textBaseline = "bottom";
        
        log('Finding background images');
        
        getImages(el);
            
        log('Finding images');
        each(document.images,function(i,e){
            preloadImage(getAttr(e,'src'));
        });
      
        
        if (images.length == 0){
            start();
        }  
        
        
    }

    function start(){
          
        if (images.length == 0 || imagesLoaded==images.length/2){    
            log('Started parsing');
            newElement2(el);		
          
            parseElement(el);                         
        }            
    }
    
    function log(a){
        if (opts.logging){
            if (typeof console != "undefined" && console.log){
                console.log(a);
            }else{
                alert(a);
            }
        }
    }    
        
    function preloadImage(src){
            
        if (images.indexOf(src)==-1){
            images.push(src);
                   
            var img = new Image();   
            // TODO remove jQuery dependancy
            $(img).load(function(){
                imagesLoaded++;               
                start();        
                
            });	
            img.onerror = function(){
                images.splice(images.indexOf(img.src),2);
                imagesLoaded++;
                start();                           
            }
            img.src = src; 
            images.push(img);
                  
        }     
          
    }
        
    /*
     * Function to find all images from <img> and background-image   
     */            
        
    function getImages(el){
        
        // TODO remove jQuery dependancy
        each($(el).contents(),function(i,element){    
            var ignRe = new RegExp("("+ignoreElements+")");
            if (!ignRe.test(element.nodeName)){
                getImages(element);
            }
        })
          
        if (el.nodeType==1 || typeof el.nodeType == "undefined"){
            var background_image = getCSS(el,'background-image');
           
            if (background_image && background_image != "1" && background_image != "none" && background_image.substring(0,7)!="-webkit" && background_image.substring(0,4)!="-moz"){
                var src = backgroundImageUrl(background_image);                    
                preloadImage(src);                    
            }
        }
    }            
        
    function parsing(el){
        
        var ignRe = new RegExp("("+ignoreElements+")");
        if (!ignRe.test(el.nodeName)){
            
         		
            newElement2(el);
            // TODO remove jQuery dependancy

            var contents = $(el).contents();
            
        
            if (contents.length == 1){
	
                // check nodeType
                if (contents[0].nodeType==1){
                    // it's an element, so let's look inside it
                    parsing(contents[0]);
                }else if (contents[0].nodeType==3){   
                    // it's a text node, so lets print the text
                    newText2(el,contents[0]);
                }
            }else{
		
                each(contents,function(cid,cel){
					
                    if (cel.nodeType==1){
                        // element
                        parsing(cel);								
                    }else if (cel.nodeType==3){                   
                        newText2(el,cel);								
                    }              
						
                });
                
            }
        }	
    }
			
			
    function parseElement(element){
     
        each(element.children,function(index,el){		
            parsing(el);	
        });
        

        finish();
    }
	
    /*
     * Function to retrieve the actual src of a background-image
     */
    function backgroundImageUrl(src){
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
     * Load image from storage
     */
    
    function loadImage(src){	
        
        var imgIndex = images.indexOf(src);
        if (imgIndex!=-1){
            return images[imgIndex+1];
        }else{
            return false;
        }
				
    }

    
    /*
     * Function to provide bounds for element
     */
    function getBounds(el){
        
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
                left: p.left + parseInt(getCSS(el,"border-left-width"),10),
                top: p.top + parseInt(getCSS(el,"border-top-width"),10),
                width:$(el).innerWidth(),
                height:$(el).innerHeight()                
            }

        }           
    }


    function newElement2(el){
					
        var bounds = getBounds(el);    
            
        var x = bounds.left;
        var y = bounds.top;
        var w = bounds.width;
        var h = bounds.height;   
            
        var bgcolor = getCSS(el,"background-color");

       
			

        /*
         *  TODO add support for different border-style's than solid   
         */            
        var borders = getBorderData(el);    
            
        each(borders,function(borderSide,borderData){
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
                   
                newRect(bx,by,bw,bh,borderData.color);	
                
                    
          
            }
                
        });

     
               
        // draw base element bgcolor       
        newRect(
            x+borders[3].width,
            y+borders[0].width,
            w-(borders[1].width+borders[3].width),
            h-(borders[0].width+borders[2].width),
            bgcolor
            );
           
        drawBackground(el,{
            left: x+borders[3].width,
            top: y+borders[0].width,
            width: w-(borders[1].width+borders[3].width),
            height: h-(borders[0].width+borders[2].width)
        });
        
        if (el.nodeName=="IMG"){
            image = loadImage(getAttr(el,'src'));
            if (image){
                ctx.drawImage(image,x+parseInt(getCSS(el,'padding-left'),10),y+parseInt(getCSS(el,'padding-top'),10));
            }else{
                log("Error loading <img>:" + getAttr(el,'src'));
            }
        }
            
			
				
    }
    
    
    
    function drawBackground(el,bounds){
               
     
        var background_image = getCSS(el,"background-image");
        var background_repeat = getCSS(el,"background-repeat");
        
        if (typeof background_image != "undefined" && /^(1|none)$/.test(background_image)==false){
            
            background_image = backgroundImageUrl(background_image);
            var image = loadImage(background_image);
					

            var bgp = getBackgroundPosition(el,bounds,image);


            if (image){
                switch(background_repeat){
					
                    case "repeat-x":
                        drawbackgroundRepeatX(image,bgp,bounds.left,bounds.top,bounds.width,bounds.height);                     
                        break;
                            
                    case "repeat-y":
                        drawbackgroundRepeatY(image,bgp,bounds.left,bounds.top,bounds.width,bounds.height);                                             
                        break;
                            
                    case "no-repeat":
                        
                        drawBackgroundRepeat(image,bgp.left+bounds.left,bgp.top+bounds.top,Math.min(bounds.width,image.width),Math.min(bounds.height,image.height),bounds.left,bounds.top);
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
                                              
                            drawbackgroundRepeatX(image,bgp,bounds.left,bgy,bounds.width,height);  
                            if (add>0){
                                bgp.top += add;
                            }
                            bgy = Math.floor(bgy+image.height)-add; 
                        }
                        break;
                        
					
                }	
            }else{
                    
                log("Error loading background:" + background_image);
            //console.log(images);
            }
					
        }
    }
    
    function drawbackgroundRepeatY(image,bgp,x,y,w,h){
        
        var height,
        width = Math.min(image.width,w);   
            
        bgp.top = bgp.top-Math.ceil(bgp.top/image.height)*image.height;                
        
        
        for(bgy=(y+bgp.top);bgy<=h+y;){   
            
         
            if ( Math.floor(bgy+image.height)>h+y){
                height = (h+y)-bgy;
            }else{
                height = image.height;
            }
            drawBackgroundRepeat(image,x+bgp.left,bgy,width,height,x,y);   
      
            bgy = Math.floor(bgy+image.height); 
                              
        } 
    }
    
    function drawbackgroundRepeatX(image,bgp,x,y,w,h){
                           
        var height = Math.min(image.height,h),
        width;             
        
            
        bgp.left = bgp.left-Math.ceil(bgp.left/image.width)*image.width;                
        
        
        for(bgx=(x+bgp.left);bgx<=w+x;){   

            if (Math.floor(bgx+image.width)>w+x){
                width = (w+x)-bgx;
            }else{
                width = image.width;
            }
                
            drawBackgroundRepeat(image,bgx,(y+bgp.top),width,height,x,y);       
             
            bgx = Math.floor(bgx+image.width); 

                                
        } 
    }
    
    function drawBackgroundRepeat(image,x,y,width,height,elx,ely){
        var sourceX = 0,
        sourceY=0;
        if (elx-x>0){
            sourceX = elx-x;
        }
        
        if (ely-y>0){
            sourceY = ely-y;
        }
        
        ctx.drawImage(
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
     * Function to retrieve background-position, both in pixels and %
     */
    
    function getBackgroundPosition(el,bounds,image){

        var bgposition = getCSS(el,"background-position").split(" "),
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



    /*
     * Function to provide border details for an element
     */

    function getBorderData(el){
     
        var borders = [];
        each(["top","right","bottom","left"],function(i,borderSide){
            borders.push({
                width: parseInt(getCSS(el,'border-'+borderSide+'-width'),10),
                color: getCSS(el,'border-'+borderSide+'-color')
            });
        });
            
        return borders;
            
    }
        
    // Drawing a rectangle 								
    function newRect(x,y,w,h,bgcolor){
        if (bgcolor!="transparent"){
            ctx.fillStyle = bgcolor;
            ctx.fillRect (x, y, w, h);
        }
    }
			
 		
    /*
     * Function to draw the text on the canvas
     */ 
               
    function printText(currentText,x,y){
        if (trim(currentText).length>0){					
            ctx.fillText(currentText,x,y);
        }           
    }
    /*
     * Function for fetching the css attribute
     * TODO remove jQuery dependancy
     */
    function getCSS(el,attribute){
        return $(el).css(attribute);
    }
    
    /*
     * Function for fetching the element attribute
     */  
    function getAttr(el,attribute){
        return el.getAttribute(attribute);
    //return $(el).attr(attribute);
    }
        
    function newText2(el,textNode){
				
                               

        
        var family = getCSS(el,"font-family");
        var size = getCSS(el,"font-size");
        var color = getCSS(el,"color");
  
        var bold = getCSS(el,"font-weight");
        var font_style = getCSS(el,"font-style");

     
        var text_decoration = getCSS(el,"text-decoration");
               
             
        // apply text-transform:ation to the text
        textNode.nodeValue = textTransform(textNode.nodeValue,getCSS(el,"text-transform"));
        var text = textNode.nodeValue;		
			
        //text = $.trim(text);
        if (text.length>0){
            switch(bold){
                case "401":
                    bold = "bold";
                    break;
            }
            
          
          
            ctx.font = bold+" "+font_style+" "+size+" "+family;
            ctx.fillStyle = color;
          
       
		 			
               		
                
            var oldTextNode = textNode;
            for(var c=0;c<text.length;c++){
                var newTextNode = oldTextNode.splitText(1);

                if (useRangeBounds){
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
                    
                    var bounds = getBounds(wrapElement);
    
                    
                    parent.replaceChild(backupText,wrapElement);      
                }
               
      
           
                                 
                printText(oldTextNode.nodeValue,bounds.left,bounds.bottom);
                    
                switch(text_decoration) {
                    case "underline":	
                        // guesstimate the y-position of the line
                        // TODO try and find a more accurate way to find the baseline of the text
                        newRect(bounds.left,Math.round(bounds.bottom-(bounds.height/7)),bounds.width,1,color);
                        break;
                    case "overline":
                        newRect(bounds.left,bounds.top,bounds.width,1,color);
                        break;
                    case "line-through":
                        // TODO try and find exact position for line-through
                        newRect(bounds.left,Math.round(bounds.top+(bounds.height/2)),bounds.width,1,color);
                        break;
                    
                }	
                
                oldTextNode = newTextNode;
                  
                  
                  
            }
         
					
        }
			
    }


  

    /*
     * Function to apply text-transform attribute to text
     */    
    function textTransform(text,transform){
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
     * Finished rendering, send callback
     */ 
    function finish(){
        log("Finished rendering");
       
        if (opts.renderViewport){
            // let's crop it to viewport only then
            var newCanvas = document.createElement('canvas');
            var newctx = newCanvas.getContext('2d');
            newCanvas.width = window.innerWidth;
            newCanvas.height = window.innerHeight;
            
        }
        opts.ready(canvas);          
    }
        
    /*
     * Function for looping through array
     */
    function each(arrayLoop,callbackFunc){
        callbackFunc = callbackFunc || function(){};
        for (var i=0;i<arrayLoop.length;i++){       
            callbackFunc(i,arrayLoop[i]);
        }
    }
    
    /*
     * Function to extend object
     */
    function extendObj(options,defaults){
        for (var key in options){              
            defaults[key] = options[key];
        }
        return defaults;           
    }
    
    /*
     *Function to trim whitespace from text
     */
    function trim(text) {
        return text.replace(/^\s*/, "").replace(/\s*$/, "");
    }
    
    /*
     * Get element childNodes
     */
    
    function getContents(el){
        return (el.nodeName ==  "iframe" ) ?
        el.contentDocument || el.contentWindow.document :
        el.childNodes;
    }
        
    // Start script
    init();	
			
}
		
			
