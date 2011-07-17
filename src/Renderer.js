

html2canvas.prototype.canvasRenderer = function(queue){
    var _ = this;

    queue = this.sortQueue(queue);

    this.each(queue,function(i,storageContext){
       
        if (storageContext.ctx.storage){
            _.each(storageContext.ctx.storage,function(a,renderItem){
                
                switch(renderItem.type){
                    case "variable":
                        _.ctx[renderItem.name] = renderItem.arguments;              
                        break;
                    case "function":
                        if (renderItem.name=="fillRect"){
                            _.ctx.fillRect(renderItem.arguments[0],renderItem.arguments[1],renderItem.arguments[2],renderItem.arguments[3]);
                        }else if(renderItem.name=="fillText"){
                            _.ctx.fillText(renderItem.arguments[0],renderItem.arguments[1],renderItem.arguments[2]);
                        }else if(renderItem.name=="drawImage"){
                            _.ctx.drawImage(
                                renderItem.arguments[0],
                                renderItem.arguments[1],
                                renderItem.arguments[2],
                                renderItem.arguments[3],
                                renderItem.arguments[4],
                                renderItem.arguments[5],
                                renderItem.arguments[6],
                                renderItem.arguments[7],
                                renderItem.arguments[8]
                                );
                        }else{
                            this.log(renderItem);
                        }
                       
  
                        break;
                    default:
                               
                }
                
                  
            });

        }
       
    });
    
    
};     

/*
 * Sort elements based on z-index and position attributes
 */


html2canvas.prototype.sortQueue = function(queue){
    if (!this.opts.reorderZ || !this.needReorder) return queue;
    
    var longest = 0;
    this.each(queue,function(i,e){
        if (longest<e.zIndex.length){
            longest = e.zIndex.length;
        }
    });
    
    var counter = 0;
    //console.log(((queue.length).toString().length)-(count.length).toString().length);
    this.each(queue,function(i,e){
        
        var more = ((queue.length).toString().length)-((counter).toString().length);
        while(longest>e.zIndex.length){
            e.zIndex += "0";
        }
        e.zIndex = e.zIndex+counter;
        
        while((longest+more+(counter).toString().length)>e.zIndex.length){
            e.zIndex += "0";
        }
        counter++;
    //     console.log(e.zIndex);
    });
    
   
    
    queue = queue.sort(function(a,b){
        
        if (a.zIndex < b.zIndex) return -1; 
        if (a.zIndex > b.zIndex) return 1;
        return 0; 
    });
    
    
    /*

    console.log('after');
    this.each(queue,function(i,e){
        console.log(i+":"+e.zIndex); 
       // console.log(e.ctx.storage); 
    });    */
    
    return queue;
}

html2canvas.prototype.setContextVariable = function(ctx,variable,value){
    if (!ctx.storage){
        ctx[variable] = value;
    }else{
        ctx.storage.push(
        {
            type: "variable",
            name:variable,
            arguments:value            
        });
    }
  
}