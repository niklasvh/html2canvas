 
    
html2canvas.prototype.parseElement = function(element,stack){
    var _ = this;    
    this.each(element.children,function(index,el){	      
        _.parsing(el,stack);	     
    });
        
    this.canvasRenderer(this.contextStacks);
    this.finish();
}


        
html2canvas.prototype.parsing = function(el,stack){
   
    if (this.getCSS(el,'display') != "none" && this.getCSS(el,'visibility')!="hidden"){ 

        var _ = this;
    
        //if (!this.blockElements.test(el.nodeName)){
        
        stack = this.newElement(el,stack) || stack;
    
    
        var ctx = stack.ctx;
    
   
        if (!this.ignoreRe.test(el.nodeName)){
            
         		
        
            // TODO remove jQuery dependancy

            var contents = this.contentsInZ(el);
            
        
            if (contents.length == 1){
	
                // check nodeType
                if (contents[0].nodeType==1){
                    // it's an element, so let's look inside it
                    this.parsing(contents[0],stack);
                }else if (contents[0].nodeType==3){   
                    // it's a text node, so lets print the text
                
                    this.newText(el,contents[0],stack.ctx);
                }
            }else{
		
                this.each(contents,function(cid,cel){
					
                    if (cel.nodeType==1){
                        // element
                        _.parsing(cel,stack);								
                    }else if (cel.nodeType==3){   
                        _.newText(el,cel,ctx);
                    }              
						
                });
                
            }
        }	
    }
// }
}
    