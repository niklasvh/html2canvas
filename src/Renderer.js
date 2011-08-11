html2canvas.prototype.Renderer = function(queue){
     
    var _ = this;
    
    this.log('Renderer initiated');
    
    this.each(this.opts.renderOrder.split(" "),function(i,renderer){
        
        switch(renderer){
            case "canvas":
                _.canvas = document.createElement('canvas');
                if (_.canvas.getContext){
                    _.canvasRenderer(queue);
                    _.log('Using canvas renderer');
                    return false;
                }               
                break;
            case "flash":
                /*
                var script = document.createElement('script');
                script.type = "text/javascript";
                script.src = _.opts.flashCanvasPath;
                var s = document.getElementsByTagName('script')[0]; 
                s.parentNode.insertBefore(script, s);
                        
                    
                if (typeof FlashCanvas != "undefined") {  
                    _.canvas = initCanvas(document.getElementById("testflash"));
                    FlashCanvas.initElement(_.canvas);
                    _.ctx = _.canvas.getContext("2d");
                    // _.canvas = document.createElement('canvas');
                    //
                    _.log('Using Flashcanvas renderer');
                    _.canvasRenderer(queue);
                    
                    return false;
                }  
                     */    
                
                break;
            case "html":
                // TODO add renderer
                _.log("Using HTML renderer");
                return false;
                break;
             
             
        }
         
         
         
    });
    
    //    this.log('No renderer chosen, rendering quit');
    return this;
     
// this.canvasRenderer(queue);
     
/*
     if (!this.canvas.getContext){
           
           
     }*/
// TODO include Flashcanvas
/*
        var script = document.createElement('script');
        script.type = "text/javascript";
        script.src = this.opts.flashCanvasPath;
        var s = document.getElementsByTagName('script')[0]; 
        s.parentNode.insertBefore(script, s);

        if (typeof FlashCanvas != "undefined") {
                
            FlashCanvas.initElement(this.canvas);
            this.ctx = this.canvas.getContext('2d');
        }	*/ 
    
}


html2canvas.prototype.throttler = function(queue){
    
    
    };


html2canvas.prototype.canvasRenderContext = function(storageContext,ctx){
    
    // set common settings for canvas
    ctx.textBaseline = "bottom";
    var _ = this;
     
     
    if (storageContext.clip){
        ctx.save();
        ctx.beginPath();
        // console.log(storageContext);
        ctx.rect(storageContext.clip.left,storageContext.clip.top,storageContext.clip.width,storageContext.clip.height);
        ctx.clip();
        
    }
        
    if (storageContext.ctx.storage){
        _.each(storageContext.ctx.storage,function(a,renderItem){

          
            switch(renderItem.type){
                case "variable":
                    ctx[renderItem.name] = renderItem.arguments;              
                    break;
                case "function":
                    if (renderItem.name=="fillRect"){
                        
                        ctx.fillRect(
                            renderItem.arguments[0],
                            renderItem.arguments[1],
                            renderItem.arguments[2],
                            renderItem.arguments[3]
                            );
                    }else if(renderItem.name=="fillText"){
                        // console.log(renderItem.arguments[0]);
                        ctx.fillText(renderItem.arguments[0],renderItem.arguments[1],renderItem.arguments[2]);
                    
                    }else if(renderItem.name=="drawImage"){
                        //  console.log(renderItem);
                        // console.log(renderItem.arguments[0].width);    
                        if (renderItem.arguments[8] > 0 && renderItem.arguments[7]){
                            ctx.drawImage(
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
                        }      
                    }else{
                        _.log(renderItem);
                    }
                       
  
                    break;
                default:
                               
            }
                
                
        });

    }  
    if (storageContext.clip){
        ctx.restore();
    }
    
}

/*
html2canvas.prototype.canvasRenderContextChildren = function(storageContext,parentctx){
    var ctx = storageContext.canvas.getContext('2d');         

    storageContext.canvasPosition = storageContext.canvasPosition || {};             
    this.canvasRenderContext(storageContext,ctx);
    
    
    for (var s = 0; s<this.queue.length;){
        if (storageContext.parentStack && this.queue[s].canvas === storageContext.parentStack.canvas){
            var substorageContext = this.queue.splice(s,1)[0]; 
            
            if (substorageContext.ctx.storage[5] && substorageContext.ctx.storage[5].arguments[0]=="Highlights"){    
               console.log('ssssssadasda');
            }    
            
            this.canvasRenderContextChildren(substorageContext,ctx);
        //   this.canvasRenderContext(substorageContext,ctx);
        //    this.canvasRenderStorage(this.queue,ctx);
            
                    
        }else{
            s++;
        }
                  
    }
    
    
    
            
    if (storageContext.ctx.storage[5] && storageContext.ctx.storage[5].arguments[0]=="Highlights"){    
        $('body').append(parentctx.canvas);
    }    
    //var parentctx = this.canvas.getContext("2d");
            
    if (storageContext.canvas.width>0 && storageContext.canvas.height > 0){
        parentctx.drawImage(storageContext.canvas,(storageContext.canvasPosition.x || 0),(storageContext.canvasPosition.y || 0));
    }
    
    
}
*/
html2canvas.prototype.canvasRenderStorage = function(queue,parentctx){
    

    
  
    for (var i = 0; i<queue.length;){
        var storageContext = queue.splice(0,1)[0];
        
       
       
        // storageContext.removeOverflow = storageContext.removeOverflow || {};
        /*
        if (storageContext.canvas){
            this.canvasRenderContextChildren(storageContext,parentctx);
        
            var ctx = storageContext.canvas.getContext('2d');         

            storageContext.canvasPosition = storageContext.canvasPosition || {};             
            this.canvasRenderContext(storageContext,ctx);
            
            for (var s = 0; s<this.queue.length;){
                if (this.queue[s].canvas === storageContext.canvas){
                    var substorageContext = this.queue.splice(s,1)[0];
                    substorageContext.canvasPosition = storageContext.canvasPosition || {};     
                    
                    this.canvasRenderContext(substorageContext,ctx);
                // this.canvasRenderStorage(this.queue,ctx);
                    
                }else{
                    s++;
                }
                  
            }
            
            
            //var parentctx = this.canvas.getContext("2d");
            
            if (storageContext.canvas.width>0 && storageContext.canvas.height > 0){
                parentctx.drawImage(storageContext.canvas,(storageContext.canvasPosition.x || 0),(storageContext.canvasPosition.y || 0));
            }
            ctx = parentctx;
            
        }else{
        */
        storageContext.canvasPosition = storageContext.canvasPosition || {};             
        this.canvasRenderContext(storageContext,parentctx);           
    //  }
        
        
    /*
        if (storageContext.newCanvas){
            var ctx = _.canvas.getContext("2d");
            ctx.drawImage(canvas,(storageContext.removeOverflow.left || 0),(storageContext.removeOverflow.top || 0));
            _.ctx = ctx;
        }*/
       
       
   
    }
}



html2canvas.prototype.canvasRenderer = function(queue){
    var _ = this;
    this.sortZ(this.zStack);
    queue = this.queue;
    //console.log(queue);

    //queue = this.sortQueue(queue);
    
    
    
        
  
    this.canvas.width = Math.max($(document).width(),this.opts.canvasWidth);   
    this.canvas.height = Math.max($(document).height(),this.opts.canvasHeight);
    
    this.ctx = this.canvas.getContext("2d");
    
    this.canvasRenderStorage(queue,this.ctx);
    

    
};     

/*
 * Sort elements based on z-index and position attributes
 */

/*
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
    
    

    
    return queue;
}
*/

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