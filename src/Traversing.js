 
    
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
    