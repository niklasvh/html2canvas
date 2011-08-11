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
           
        if (background_image && background_image != "1" && background_image != "none" && background_image.substring(0,7)!="-webkit" && background_image.substring(0,3)!="-o-" && background_image.substring(0,4)!="-moz"){
            // TODO add multi image background support
            var src = this.backgroundImageUrl(background_image.split(",")[0]);                    
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
        if (this.isSameOrigin(src)){
            this.images.push(src);
            //     console.log('a'+src);
            var img = new Image();   
            // TODO remove jQuery dependancy
            var _ = this;
            $(img).load(function(){
                _.imagesLoaded++;               
                _.start();        
                
            });	
            img.onerror = function(){
                _.images.splice(_.images.indexOf(img.src),2);
                //  _.imagesLoaded++;
                _.start();                           
            }
            img.src = src; 
            this.images.push(img);
        }else if (this.opts.proxyUrl){
            //    console.log('b'+src);
            this.images.push(src);
            var img = new Image();   
            this.proxyGetImage(src,img);
            this.images.push(img);
        }
    }     
          
}

html2canvas.prototype.proxyGetImage = function(url,img){
    var _ = this;
    
    var link = document.createElement("a");
    link.href = url;
    url = link.href; // work around for pages with base href="" set

    
    // todo remove jQuery dependency and enable xhr2 requests where available (no need for base64 / json)
    $.ajax({
        data:{
            xhr2:false,
            url:url
        },
        url: this.opts.proxyUrl,
        dataType: "jsonp",
        success: function(a){
            
            if (a.substring(0,6)=="error:"){
                _.images.splice(_.images.indexOf(url),2);
                _.start();  
                _.log('Proxy was unable to load '+url+' '+a);
            }else{
                // document.createElement(a);
                // console.log(img);
                img.onload = function(){
                    //   console.log('w'+img.width);
                    _.imagesLoaded++;               
                    _.start();   
               
                }
            
                img.src = a; 
            }


        },
        error: function(){
           
            _.images.splice(_.images.indexOf(url),2);
            //  _.imagesLoaded++;
            _.start();          
        }
        
        
    });
    
}