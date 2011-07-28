 
    
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
    