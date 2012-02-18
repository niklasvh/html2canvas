/*
  html2canvas @VERSION@ <http://html2canvas.hertzen.com>
  Copyright (c) 2011 Niklas von Hertzen. All rights reserved.
  http://www.twitter.com/niklasvh

  Released under MIT License
*/

html2canvas.Preload = function(element, opts){
    
    var options = {
        proxy: "http://html2canvas.appspot.com/",
        timeout: 0    // no timeout
    },
    images = {
        numLoaded: 0,   // also failed are counted here
        numFailed: 0,
        numTotal: 0,
        cleanupDone: false
    },
    pageOrigin,
    methods,
    i,
    count = 0,
    doc = element.ownerDocument,
    domImages = doc.images, // TODO probably should limit it to images present in the element only
    imgLen = domImages.length,
    link = doc.createElement("a"),
    timeoutTimer;
    
    link.href = window.location.href;
    pageOrigin  = link.protocol + link.host;
    opts = opts || {};
    
    options = html2canvas.Util.Extend(opts, options);
    
   
    
    element = element || doc.body;
    
    function isSameOrigin(url){
        link.href = url;
        var origin = link.protocol + link.host;
        return ":" === origin || (origin === pageOrigin);
    }
    
    function start(){
        html2canvas.log("html2canvas: start: images: " + images.numLoaded + " / " + images.numTotal + " (failed: " + images.numFailed + ")");
        if (!images.firstRun && images.numLoaded >= images.numTotal){
        
            /*
            this.log('Finished loading '+this.imagesLoaded+' images, Started parsing');
            this.bodyOverflow = document.getElementsByTagName('body')[0].style.overflow;
            document.getElementsByTagName('body')[0].style.overflow = "hidden";
            */
            if (typeof options.complete === "function"){
                options.complete(images);
            }

            html2canvas.log("Finished loading images: # " + images.numTotal + " (failed: " + images.numFailed + ")");
        }
    }
    
    function proxyGetImage(url, img){
        var callback_name,
            scriptUrl = options.proxy,
            script,
            imgObj = images[url];

        link.href = url;
        url = link.href; // work around for pages with base href="" set - WARNING: this may change the url -> so access imgObj from images map before changing that url!

        callback_name = 'html2canvas_' + count;
        imgObj.callbackname = callback_name;
        
        if (scriptUrl.indexOf("?") > -1) {
            scriptUrl += "&";
        } else {
            scriptUrl += "?";
        }
        scriptUrl += 'url=' + encodeURIComponent(url) + '&callback=' + callback_name;
    
        window[callback_name] = function(a){
            if (a.substring(0,6) === "error:"){
                imgObj.succeeded = false;
                images.numLoaded++;
                images.numFailed++;
                start();  
            } else {
                img.onload = function(){
                    imgObj.succeeded = true;
                    images.numLoaded++;
                    start();
                };
                img.src = a; 
            }
            window[callback_name] = undefined; // to work with IE<9  // NOTE: that the undefined callback property-name still exists on the window object (for IE<9)
            try {
                delete window[callback_name];  // for all browser that support this
            } catch(ex) {}
            script.parentNode.removeChild(script);
            script = null;
            imgObj.callbackname = undefined;
        };

        count += 1;
        
        script = doc.createElement("script");        
        script.setAttribute("src", scriptUrl);
        script.setAttribute("type", "text/javascript");
        imgObj.script = script;
        window.document.body.appendChild(script);

    /*
 
    //  enable xhr2 requests where available (no need for base64 / json)
    
        $.ajax({
            data:{
                xhr2:false,
                url:url
            },
            url: options.proxy,
            dataType: "jsonp",
            success: function(a){
            
                if (a.substring(0,6) === "error:"){
                    images.splice(getIndex(images, url), 2);
                    start();  
                }else{
                    img.onload = function(){
                        imagesLoaded+=1;               
                        start();   
               
                    };     
                    img.src = a; 
                }


            },
            error: function(){ 
                images.splice(getIndex(images, url), 2);
                start();          
            }
        
        
        });
    */
    }
    
    function getImages (el) {
        
     
    
        // if (!this.ignoreRe.test(el.nodeName)){
        // 

        var contents = html2canvas.Util.Children(el),
        i,
        contentsLen = contents.length,
        background_image,
        src,
        img,
        elNodeType = false;
        
        for (i = 0;  i < contentsLen; i+=1 ){
            // var ignRe = new RegExp("("+this.ignoreElements+")");
            // if (!ignRe.test(element.nodeName)){
            getImages(contents[i]);
        // }
        }
            
        // }
        try {
            elNodeType = el.nodeType;
        } catch (ex) {
            elNodeType = false;
            html2canvas.log("html2canvas: failed to access some element's nodeType - Exception: " + ex.message);
        }

        if (elNodeType === 1 || elNodeType === undefined){
            
            background_image = html2canvas.Util.getCSS(el, 'backgroundImage');
            
            if ( background_image && background_image !== "1" && background_image !== "none" ) {	
                
                // TODO add multi image background support
                
                if (background_image.substring(0,7) === "-webkit" || background_image.substring(0,3) === "-o-" || background_image.substring(0,4) === "-moz") {
                  
                    img = html2canvas.Generate.Gradient( background_image, html2canvas.Util.Bounds( el ) );

                    if ( img !== undefined ){
                        images[background_image] = { img: img, succeeded: true };
                        images.numTotal++;
                        images.numLoaded++;
                        start();
                        
                    }
                    
                } else {	
                    src = html2canvas.Util.backgroundImage(background_image.match(/data:image\/.*;base64,/i) ? background_image : background_image.split(",")[0]);		
                    methods.loadImage(src); 		
                }
           
            /*
            if (background_image && background_image !== "1" && background_image !== "none" && background_image.substring(0,7) !== "-webkit" && background_image.substring(0,3)!== "-o-" && background_image.substring(0,4) !== "-moz"){
                // TODO add multi image background support
                src = html2canvas.Util.backgroundImage(background_image.split(",")[0]);                    
                methods.loadImage(src);            */        
            }
        }
    }  
    
    methods = {
        loadImage: function( src ) {
            var img;
            if ( src && images[src] === undefined ) {
                if ( src.match(/data:image\/.*;base64,/i) ) {
                
                    //Base64 src                  
                    img = new Image();
                    img.src = src.replace(/url\(['"]{0,}|['"]{0,}\)$/ig, '');
                    images[src] = { img: img, succeeded: true };
                    images.numTotal++;
                    images.numLoaded++;
                    start();
                    
                }else if ( isSameOrigin( src ) ) {
            
                    img = new Image();
                    images[src] = { img: img };
                    images.numTotal++;
                    
                    img.onload = function() {
                        images.numLoaded++;
                        images[src].succeeded = true;
                        start();
                    };	
                    
                    img.onerror = function() {
                        images.numLoaded++;
                        images.numFailed++;
                        images[src].succeeded = false;
                        start();
                    };
                    
                    img.src = src;
            
                }else if ( options.proxy ){
                    //    console.log('b'+src);
                    img = new Image();
                    images[src] = { img: img };
                    images.numTotal++;
                    proxyGetImage( src, img );
                }
            }     
          
        },
        cleanupDOM: function(cause) {
            var img, src;
            if (!images.cleanupDone) {
                if (cause && typeof cause === "string") {
                    html2canvas.log("html2canvas: Cleanup because: " + cause);
                } else {
                    html2canvas.log("html2canvas: Cleanup after timeout: " + options.timeout + " ms.");
                }

                for (src in images) {
                    if (images.hasOwnProperty(src)) {
                        img = images[src];
                        if (typeof img === "object" && img.callbackname && img.succeeded === undefined) {
                            // cancel proxy image request
                            window[img.callbackname] = undefined; // to work with IE<9  // NOTE: that the undefined callback property-name still exists on the window object (for IE<9)
                            try {
                                delete window[img.callbackname];  // for all browser that support this
                            } catch(ex) {}
                            if (img.script && img.script.parentNode) {
                                img.script.setAttribute("src", "about:blank");  // try to cancel running request
                                img.script.parentNode.removeChild(img.script);
                            }
                            images.numLoaded++;
                            images.numFailed++;
                            html2canvas.log("html2canvas: Cleaned up failed img: '" + src + "' Steps: " + images.numLoaded + " / " + images.numTotal);
                        }
                    }
                }

                // cancel any pending requests
                if(window.stop !== undefined) {
                    window.stop();
                } else if(document.execCommand !== undefined) {
                    document.execCommand("Stop", false);
                }
                if (document.close !== undefined) {
                    document.close();
                }
                images.cleanupDone = true;
                if (!(cause && typeof cause === "string")) {
                    start();
                }
            }
        },
        renderingDone: function() {
          if (timeoutTimer) {
            window.clearTimeout(timeoutTimer);
          }
        }
        
    };

    if (options.timeout > 0) {
        timeoutTimer = window.setTimeout(methods.cleanupDOM, options.timeout);
    }
    var startTime = (new Date()).getTime();
    html2canvas.log('html2canvas: Preload starts: finding background-images');
    images.firstRun = true;

    getImages( element );
    
    html2canvas.log('html2canvas: Preload: Finding images');
    // load <img> images
    for (i = 0; i < imgLen; i+=1){
        methods.loadImage( domImages[i].getAttribute( "src" ) );
    }
    
    images.firstRun = false;
    html2canvas.log('html2canvas: Preload: Done.');
    if ( images.numTotal === images.numLoaded ) {
        start();
    }  
    
    return methods;
    
};



