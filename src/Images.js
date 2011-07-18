/*
 * Function to find all images from <img> and background-image   
 */            
html2canvas.prototype.getImages = function(el) {
        
    var self = this;
    
    if (!this.ignoreRe.test(el.nodeName)){
        // TODO remove jQuery dependancy
        this.each($(el).contents(),function(i,element){    
            var ignRe = new RegExp("("+this.ignoreElements+")");
            if (!ignRe.test(element.nodeName)){
                self.getImages(element);
            }
        })
    }
          
    if (el.nodeType==1 || typeof el.nodeType == "undefined"){
        var background_image = this.getCSS(el,'background-image');
           
        if (background_image && background_image != "1" && background_image != "none" && background_image.substring(0,7)!="-webkit" && background_image.substring(0,4)!="-moz"){
            var src = this.backgroundImageUrl(background_image);                    
            this.preloadImage(src);                    
        }
    }
}  


/*
 * Load image from storage
 */
    
html2canvas.prototype.loadImage = function(src){	
        
    var imgIndex = this.getIndex(this.images,src);
    if (imgIndex!=-1){
        return this.images[imgIndex+1];
    }else{
        return false;
    }
				
}




        
html2canvas.prototype.preloadImage = function(src){


    if (this.getIndex(this.images,src)==-1){
        this.images.push(src);
                   
        var img = new Image();   
        // TODO remove jQuery dependancy
        var _ = this;
        $(img).load(function(){
            _.imagesLoaded++;               
            _.start();        
                
        });	
        img.onerror = function(){
            _.images.splice(_.images.indexOf(img.src),2);
            _.imagesLoaded++;
            _.start();                           
        }
        img.src = src; 
        this.images.push(img);
                  
    }     
          
}
    