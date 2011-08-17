/*
 * Function to find all images from <img> and background-image   
 */            
html2canvas.prototype.getImages = function(el) {
        
    var _ = this;
    
    if (!_.ignoreRe.test(el.nodeName)){
        _.each(el.childNodes,function(i,element){    
            if (!_.ignoreRe.test(element.nodeName)){
                _.getImages(element);
            }
        });
    }
          
    if (el.nodeType==1 || typeof el.nodeType == "undefined"){
        var background_image = this.getCSS(el,'backgroundImage');
           
        if (background_image && background_image != "1" && background_image != "none" && background_image.substring(0,7)!="-webkit" && background_image.substring(0,3)!="-o-" && background_image.substring(0,4)!="-moz"){
            // TODO add multi image background support
            var src = this.backgroundImageUrl(background_image.split(",")[0]);                    
            this.preloadImage(src);                    
        }
    }
};


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
				
};




        
html2canvas.prototype.preloadImage = function(src){
    var _ = this, img;

    if (_.getIndex(this.images,src)==-1){
        if (_.isSameOrigin(src)){
            _.images.push(src);
            //     console.log('a'+src);
            img = new Image();
            img.onload = function(){
                _.imagesLoaded++;
                _.start();
            };
            img.onerror = function(){
                _.images.splice(_.images.indexOf(img.src),2);
                _.start();                           
            };
            img.src = src; 
            _.images.push(img);
        }else if (this.opts.proxyUrl){
            //    console.log('b'+src);
            _.images.push(src);
            img = new Image();   
            _.proxyGetImage(src,img);
            _.images.push(img);
        }
    }

};

html2canvas.jsonp_counter = 0;

html2canvas.prototype.proxyGetImage = function(url,img){
    var _ = this, callback_name, script_url = _.opts.proxyUrl;

    url = _.getLinkElement(url).href; // work around for pages with base href="" set

    html2canvas.jsonp_counter += 1;
    callback_name = 'html2canvas_' + html2canvas.jsonp_counter;
    
    if (script_url.indexOf("?") > -1) {
        script_url += "&";
    } else {
        script_url += "?";
    }
    script_url += 'url=' + encodeURIComponent(url) + '&callback=' + callback_name;
    
    window[callback_name] = function(a){
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
           
            };
        
            img.src = a; 
        }
        delete window[callback_name];
    };
    var script = document.createElement("script");        
    script.setAttribute("src",script_url);
    script.setAttribute("type","text/javascript");                
    document.body.appendChild(script);
    
};