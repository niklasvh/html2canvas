/*
  html2canvas @VERSION@ <http://html2canvas.hertzen.com>
  Copyright (c) 2011 Niklas von Hertzen. All rights reserved.
  http://www.twitter.com/niklasvh

  Released under MIT License
*/

_html2canvas.Preload = function( options ) {

    var images = {
        numLoaded: 0,   // also failed are counted here
        numFailed: 0,
        numTotal: 0,
        cleanupDone: false
    },
    pageOrigin,
    methods,
    i,
    count = 0,
    element = options.elements[0] || document.body,
    doc = element.ownerDocument,
    domImages = doc.images, // TODO probably should limit it to images present in the element only
    imgLen = domImages.length,
    link = doc.createElement("a"),
    supportCORS = (function( img ){
        return (img.crossOrigin !== undefined);
    })(new Image()),
    timeoutTimer;

    link.href = window.location.href;
    pageOrigin  = link.protocol + link.host;






    function isSameOrigin(url){
        link.href = url;
        link.href = link.href; // YES, BELIEVE IT OR NOT, that is required for IE9 - http://jsfiddle.net/niklasvh/2e48b/
        var origin = link.protocol + link.host;
        return (origin === pageOrigin);
    }

    function start(){
        h2clog("html2canvas: start: images: " + images.numLoaded + " / " + images.numTotal + " (failed: " + images.numFailed + ")");
        if (!images.firstRun && images.numLoaded >= images.numTotal){
            h2clog("Finished loading images: # " + images.numTotal + " (failed: " + images.numFailed + ")");

            if (typeof options.complete === "function"){
                options.complete(images);
            }

        }
    }

    // TODO modify proxy to serve images with CORS enabled, where available
    function proxyGetImage(url, img, imageObj){
        var callback_name,
        scriptUrl = options.proxy,
        script;

        link.href = url;
        url = link.href; // work around for pages with base href="" set - WARNING: this may change the url

        callback_name = 'html2canvas_' + (count++);
        imageObj.callbackname = callback_name;

        if (scriptUrl.indexOf("?") > -1) {
            scriptUrl += "&";
        } else {
            scriptUrl += "?";
        }
        scriptUrl += 'url=' + encodeURIComponent(url) + '&callback=' + callback_name;
        script = doc.createElement("script");

        window[callback_name] = function(a){
            if (a.substring(0,6) === "error:"){
                imageObj.succeeded = false;
                images.numLoaded++;
                images.numFailed++;
                start();
            } else {
                setImageLoadHandlers(img, imageObj);
                img.src = a;
            }
            window[callback_name] = undefined; // to work with IE<9  // NOTE: that the undefined callback property-name still exists on the window object (for IE<9)
            try {
                delete window[callback_name];  // for all browser that support this
            } catch(ex) {}
            script.parentNode.removeChild(script);
            script = null;
            delete imageObj.script;
            delete imageObj.callbackname;
        };

        script.setAttribute("type", "text/javascript");
        script.setAttribute("src", scriptUrl);
        imageObj.script = script;
        window.document.body.appendChild(script);

    }

    function getImages (el) {



        // if (!this.ignoreRe.test(el.nodeName)){
        //

        var contents = _html2canvas.Util.Children(el),
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
            h2clog("html2canvas: failed to access some element's nodeType - Exception: " + ex.message);
        }

        if (elNodeType === 1 || elNodeType === undefined){

            // opera throws exception on external-content.html
            try {
                background_image = _html2canvas.Util.getCSS(el, 'backgroundImage');
            }catch(e) {
                h2clog("html2canvas: failed to get background-image - Exception: " + e.message);
            }
            if ( background_image && background_image !== "1" && background_image !== "none" ) {

                // TODO add multi image background support

                if (/^(-webkit|-o|-moz|-ms|linear)-/.test( background_image )) {
                    //       if (background_image.substring(0,7) === "-webkit" || background_image.substring(0,3) === "-o-" || background_image.substring(0,4) === "-moz") {

                    img = _html2canvas.Generate.Gradient( background_image, _html2canvas.Util.Bounds( el ) );

                    if ( img !== undefined ){
                        images[background_image] = {
                            img: img,
                            succeeded: true
                        };
                        images.numTotal++;
                        images.numLoaded++;
                        start();

                    }

                } else {
                    src = _html2canvas.Util.backgroundImage(background_image.match(/data:image\/.*;base64,/i) ? background_image : background_image.split(",")[0]);
                    methods.loadImage(src);
                }

            /*
            if (background_image && background_image !== "1" && background_image !== "none" && background_image.substring(0,7) !== "-webkit" && background_image.substring(0,3)!== "-o-" && background_image.substring(0,4) !== "-moz"){
                // TODO add multi image background support
                src = _html2canvas.Util.backgroundImage(background_image.split(",")[0]);
                methods.loadImage(src);            */
            }
        }
    }

    function setImageLoadHandlers(img, imageObj) {
        img.onload = function() {
            if ( imageObj.timer !== undefined ) {
                // CORS succeeded
                window.clearTimeout( imageObj.timer );
            }

            images.numLoaded++;
            imageObj.succeeded = true;
            img.onerror = img.onload = null;
            start();
        };
        img.onerror = function() {

            if (img.crossOrigin === "anonymous") {
                // CORS failed
                window.clearTimeout( imageObj.timer );

                // let's try with proxy instead
                if ( options.proxy ) {
                    var src = img.src;
                    img = new Image();
                    imageObj.img = img;
                    img.src = src;

                    proxyGetImage( img.src, img, imageObj );
                    return;
                }
            }


            images.numLoaded++;
            images.numFailed++;
            imageObj.succeeded = false;
            img.onerror = img.onload = null;
            start();

        };

    // TODO Opera has no load/error event for SVG images

    // Opera ninja onload's cached images
    /*
        window.setTimeout(function(){
            if ( img.width !== 0 && imageObj.succeeded === undefined ) {
                img.onload();
            }
        }, 100); // needs a reflow for base64 encoded images? interestingly timeout of 0 doesn't work but 1 does.
        */
    }


    methods = {
        loadImage: function( src ) {
            var img, imageObj;
            if ( src && images[src] === undefined ) {
                img = new Image();
                if ( src.match(/data:image\/.*;base64,/i) ) {
                    img.src = src.replace(/url\(['"]{0,}|['"]{0,}\)$/ig, '');
                    imageObj = images[src] = {
                        img: img
                    };
                    images.numTotal++;
                    setImageLoadHandlers(img, imageObj);
                } else if ( isSameOrigin( src ) || options.allowTaint ===  true ) {
                    imageObj = images[src] = {
                        img: img
                    };
                    images.numTotal++;
                    setImageLoadHandlers(img, imageObj);
                    img.src = src;
                } else if ( supportCORS && !options.allowTaint && options.useCORS ) {
                    // attempt to load with CORS

                    img.crossOrigin = "anonymous";
                    imageObj = images[src] = {
                        img: img
                    };
                    images.numTotal++;
                    setImageLoadHandlers(img, imageObj);
                    img.src = src;

                    // work around for https://bugs.webkit.org/show_bug.cgi?id=80028
                    img.customComplete = function () {
                        if (!this.img.complete) {
                            this.timer = window.setTimeout(this.img.customComplete, 100);
                        } else {
                            this.img.onerror();
                        }
                    }.bind(imageObj);
                    img.customComplete();

                } else if ( options.proxy ) {
                    imageObj = images[src] = {
                        img: img
                    };
                    images.numTotal++;
                    proxyGetImage( src, img, imageObj );
                }
            }

        },
        cleanupDOM: function(cause) {
            var img, src;
            if (!images.cleanupDone) {
                if (cause && typeof cause === "string") {
                    h2clog("html2canvas: Cleanup because: " + cause);
                } else {
                    h2clog("html2canvas: Cleanup after timeout: " + options.timeout + " ms.");
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
                            h2clog("html2canvas: Cleaned up failed img: '" + src + "' Steps: " + images.numLoaded + " / " + images.numTotal);
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
    h2clog('html2canvas: Preload starts: finding background-images');
    images.firstRun = true;

    getImages( element );

    h2clog('html2canvas: Preload: Finding images');
    // load <img> images
    for (i = 0; i < imgLen; i+=1){
        methods.loadImage( domImages[i].getAttribute( "src" ) );
    }

    images.firstRun = false;
    h2clog('html2canvas: Preload: Done.');
    if ( images.numTotal === images.numLoaded ) {
        start();
    }

    return methods;

};



