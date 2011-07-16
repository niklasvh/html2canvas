            
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