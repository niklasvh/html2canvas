/*
  html2canvas @VERSION@ <http://html2canvas.hertzen.com>
  Copyright (c) 2011 Niklas von Hertzen. All rights reserved.
  http://www.twitter.com/niklasvh

  Released under MIT License
*/


_html2canvas.Renderer.Canvas = function( options ) {

    options = options || {};
    
    var doc = document,
    canvas = options.canvas || doc.createElement('canvas'),
    usingFlashcanvas = false,
    _createCalled = false,
    canvasReadyToDraw = false,
    methods,
    flashMaxSize = 2880; // flash bitmap limited to 2880x2880px // http://stackoverflow.com/questions/2033792/argumenterror-error-2015-invalid-bitmapdata

    
    if (canvas.getContext){
        h2clog("html2canvas: Renderer: using canvas renderer");
        canvasReadyToDraw = true;
    } else if ( options.flashcanvas !== undefined ){
        usingFlashcanvas = true;
        h2clog("html2canvas: Renderer: canvas not available, using flashcanvas");
        var script = doc.createElement("script");
        script.src = options.flashcanvas;
                
        script.onload = (function(script, func){
            var intervalFunc; 
    
            if (script.onload === undefined) {
                // IE lack of support for script onload
                                
                if( script.onreadystatechange !== undefined ) {
                                    
                    intervalFunc = function() {
                        if (script.readyState !== "loaded" && script.readyState !== "complete") {
                            window.setTimeout( intervalFunc, 250 );
                                    
                        } else {
                            // it is loaded
                            func();
                                    
                        }
              
                    };
                                    
                    window.setTimeout( intervalFunc, 250 );

                } else {
                    h2clog("html2canvas: Renderer: Can't track when flashcanvas is loaded");
                }
                                
            } else {
                return func;
            }
                            
        })(script, function(){
                    
            if (typeof window.FlashCanvas !== "undefined") {
                h2clog("html2canvas: Renderer: Flashcanvas initialized");
                window.FlashCanvas.initElement( canvas );
                
                canvasReadyToDraw = true;
                if ( _createCalled !== false ) {
                    methods._create.apply( null, _createCalled );
                }
            }
        });
                
        doc.body.appendChild( script );

    }       

    methods = {
        _create: function( zStack, options, doc, queue, _html2canvas ) {
            
            if ( !canvasReadyToDraw ) {
                _createCalled = arguments;
                return canvas;
            }
            
            var ctx = canvas.getContext("2d"),
            storageContext,
            i,
            queueLen,
            a,
            newCanvas,
            bounds,
            testCanvas = document.createElement("canvas"),
            hasCTX = ( testCanvas.getContext !== undefined ),
            storageLen,
            renderItem,
            testctx = ( hasCTX ) ? testCanvas.getContext("2d") : {},
            safeImages = [],
            fstyle;
            
            canvas.width = canvas.style.width = (!usingFlashcanvas) ? options.width || zStack.ctx.width : Math.min(flashMaxSize, (options.width || zStack.ctx.width) );
            canvas.height = canvas.style.height = (!usingFlashcanvas) ? options.height || zStack.ctx.height : Math.min(flashMaxSize, (options.height || zStack.ctx.height) );
   
            fstyle = ctx.fillStyle;
            ctx.fillStyle = zStack.backgroundColor;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = fstyle;

            if ( options.svgRendering && zStack.svgRender !== undefined ) {
                // TODO: enable async rendering to support this 
                ctx.drawImage( zStack.svgRender, 0, 0 );
            } else {
                for ( i = 0, queueLen = queue.length; i < queueLen; i+=1 ) {
            
                    storageContext = queue.splice(0, 1)[0];
                    storageContext.canvasPosition = storageContext.canvasPosition || {};   
           
                    //this.canvasRenderContext(storageContext,parentctx);           

                    // set common settings for canvas
                    ctx.textBaseline = "bottom";
   
                    if (storageContext.clip){
                        ctx.save();
                        ctx.beginPath();
                        // console.log(storageContext);
                        ctx.rect(storageContext.clip.left, storageContext.clip.top, storageContext.clip.width, storageContext.clip.height);
                        ctx.clip();
        
                    }
        
                    if (storageContext.ctx.storage){
               
                        for (a = 0, storageLen = storageContext.ctx.storage.length; a < storageLen; a+=1){
                    
                            renderItem = storageContext.ctx.storage[a];
                    
                    
                            switch(renderItem.type){
                                case "variable":
                                    ctx[renderItem.name] = renderItem['arguments'];              
                                    break;
                                case "function":
                                    if (renderItem.name === "fillRect") {
                                
                                        if (!usingFlashcanvas || renderItem['arguments'][0] + renderItem['arguments'][2] < flashMaxSize  && renderItem['arguments'][1] + renderItem['arguments'][3] < flashMaxSize) {
                                            ctx.fillRect.apply( ctx, renderItem['arguments'] );
                                        }
                                    }else if(renderItem.name === "fillText") {
                                        if (!usingFlashcanvas || renderItem['arguments'][1] < flashMaxSize  && renderItem['arguments'][2] < flashMaxSize) {
                                            ctx.fillText.apply( ctx, renderItem['arguments'] );
                                        }
                                    }else if(renderItem.name === "drawImage") {
 
                                        if (renderItem['arguments'][8] > 0 && renderItem['arguments'][7]){    
                                            if ( hasCTX && options.taintTest ) {
                                                if ( safeImages.indexOf( renderItem['arguments'][ 0 ].src ) === -1 ) {
                                                    testctx.drawImage( renderItem['arguments'][ 0 ], 0, 0 );
                                                    try {
                                                        testctx.getImageData( 0, 0, 1, 1 );
                                                    } catch(e) {      
                                                        testCanvas = doc.createElement("canvas");
                                                        testctx = testCanvas.getContext("2d");
                                                        continue;
                                                    }
                                          
                                                    safeImages.push( renderItem['arguments'][ 0 ].src );
                                        
                                                }
                                            }
                                            ctx.drawImage.apply( ctx, renderItem['arguments'] );                                   
                                        }      
                                    }
                       
  
                                    break;
                                default:
                               
                            }
            
                        }

                    }  
                    if (storageContext.clip){
                        ctx.restore();
                    }
    
                }  
            }
            
            h2clog("html2canvas: Renderer: Canvas renderer done - returning canvas obj");
        
            queueLen = options.elements.length;

            if (queueLen === 1) {
                if (typeof options.elements[ 0 ] === "object" && options.elements[ 0 ].nodeName !== "BODY" && usingFlashcanvas === false) {
                    // crop image to the bounds of selected (single) element
                    bounds = _html2canvas.Util.Bounds( options.elements[ 0 ] );
                    newCanvas = doc.createElement('canvas');
                    newCanvas.width = bounds.width;
                    newCanvas.height = bounds.height;
                    ctx = newCanvas.getContext("2d");
                
                    ctx.drawImage( canvas, bounds.left, bounds.top, bounds.width, bounds.height, 0, 0, bounds.width, bounds.height );
                    canvas = null;
                    return newCanvas;
                }
            } /*else {
        // TODO clip and resize multiple elements
        
            for ( i = 0; i < queueLen; i+=1 ) {
                if (options.elements[ i ] instanceof Element) {
                
                }
              
            }
        }
        */
       
       
        
            return canvas;
        }
    };
    
    return methods;

};
