            
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
                    // guesstimate the y-position of the line
                    // TODO try and find a more accurate way to find the baseline of the text
                    this.newRect(bounds.left,Math.round(bounds.bottom-(bounds.height/7)),bounds.width,1,color);
                    break;
                case "overline":
                    this.newRect(bounds.left,bounds.top,bounds.width,1,color);
                    break;
                case "line-through":
                    // TODO try and find exact position for line-through
                    this.newRect(bounds.left,Math.round(bounds.top+(bounds.height/2)),bounds.width,1,color);
                    break;
                    
            }	
                
            oldTextNode = newTextNode;
                  
                  
                  
        }
         
					
    }
			
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