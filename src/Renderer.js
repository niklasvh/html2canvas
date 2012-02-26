/*
  html2canvas @VERSION@ <http://html2canvas.hertzen.com>
  Copyright (c) 2011 Niklas von Hertzen. All rights reserved.
  http://www.twitter.com/niklasvh

  Released under MIT License
*/
html2canvas.Renderer = function(parseQueue, opts){


    var options = {
        "width": null,
        "height": null,
        "renderer": "canvas"
    },
    queue = [],
    canvas,
    usingFlashcanvas = false,
    flashMaxSize = 2880, // flash bitmap limited to 2880x2880px // http://stackoverflow.com/questions/2033792/argumenterror-error-2015-invalid-bitmapdata
    doc = document;
    
    options = html2canvas.Util.Extend(opts, options);


    
    function sortZ(zStack){
        var subStacks = [],
        stackValues = [],
        zStackChildren = zStack.children,
        s,
        i,
        stackLen,
        zValue,
        zLen,
        stackChild,
        b, 
        subStackLen;
        

        for (s = 0, zLen = zStackChildren.length; s < zLen; s+=1){
            
            stackChild = zStackChildren[s];
            
            if (stackChild.children && stackChild.children.length > 0){
                subStacks.push(stackChild);
                stackValues.push(stackChild.zindex);
            }else{         
                queue.push(stackChild);
            }  
           
        }
      
        stackValues.sort(function(a, b) {
            return a - b;
        });
    
        for (i = 0, stackLen = stackValues.length; i < stackLen; i+=1){
            zValue = stackValues[i];
            for (b = 0, subStackLen = subStacks.length; b <= subStackLen; b+=1){
                
                if (subStacks[b].zindex === zValue){
                    stackChild = subStacks.splice(b, 1);
                    sortZ(stackChild[0]);
                    break;
                  
                }
            }        
        }
  
    }

    function canvasRenderer(zStack){
 
        sortZ(zStack.zIndex);
        

        var ctx = canvas.getContext("2d"),
        storageContext,
        i,
        queueLen,
        a,
        newCanvas,
        bounds,
        storageLen,
        renderItem,
        fstyle;
      
        canvas.width = canvas.style.width = (!usingFlashcanvas) ? options.width || zStack.ctx.width : Math.min(flashMaxSize, (options.width || zStack.ctx.width) );
        canvas.height = canvas.style.height = (!usingFlashcanvas) ? options.height || zStack.ctx.height : Math.min(flashMaxSize, (options.height || zStack.ctx.height) );
   
        fstyle = ctx.fillStyle;
        ctx.fillStyle = "#fff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = fstyle;

        for (i = 0, queueLen = queue.length; i < queueLen; i+=1){
            
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
                                    ctx.fillRect(
                                        renderItem['arguments'][0],
                                        renderItem['arguments'][1],
                                        renderItem['arguments'][2],
                                        renderItem['arguments'][3]
                                        );
                                }
                            }else if(renderItem.name === "fillText") {
                                if (!usingFlashcanvas || renderItem['arguments'][1] < flashMaxSize  && renderItem['arguments'][2] < flashMaxSize) {
                                    ctx.fillText(
                                        renderItem['arguments'][0], 
                                        renderItem['arguments'][1],
                                        renderItem['arguments'][2]
                                        );
                                }
                            }else if(renderItem.name === "drawImage") {
 
                                if (renderItem['arguments'][8] > 0 && renderItem['arguments'][7]){    
                                    ctx.drawImage(
                                        renderItem['arguments'][0],
                                        renderItem['arguments'][1],
                                        renderItem['arguments'][2],
                                        renderItem['arguments'][3],
                                        renderItem['arguments'][4],
                                        renderItem['arguments'][5],
                                        renderItem['arguments'][6],
                                        renderItem['arguments'][7],
                                        renderItem['arguments'][8]
                                        );                                   
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
        h2clog("html2canvas: Renderer: Canvas renderer done - returning canvas obj");
        
        // this.canvasRenderStorage(queue,this.ctx);
        queueLen = options.elements.length;
        
        if (queueLen === 1) {
            if (typeof options.elements[ 0 ] === "object" && options.elements[ 0 ].nodeName !== "BODY" && usingFlashcanvas === false) {
                // crop image to the bounds of selected (single) element
                bounds = html2canvas.Util.Bounds( options.elements[ 0 ] );
                newCanvas = doc.createElement('canvas');
                newCanvas.width = bounds.width;
                newCanvas.height = bounds.height;
                ctx = newCanvas.getContext("2d");
                
                ctx.drawImage( canvas, bounds.left, bounds.top, bounds.width, bounds.height, 0, 0, bounds.width, bounds.height );
                delete canvas;
                return newCanvas;
            }
        } else {
        // TODO clip and resize multiple elements
        /*
            for ( i = 0; i < queueLen; i+=1 ) {
                if (options.elements[ i ] instanceof Element) {
                
                }
              
            }*/
        }
        
       
       
        
        return canvas;
    }

    function svgRenderer(zStack){
        sortZ(zStack.zIndex);
        
        var svgNS = "http://www.w3.org/2000/svg",
        svg = doc.createElementNS(svgNS, "svg"),
        xlinkNS = "http://www.w3.org/1999/xlink",
        defs = doc.createElementNS(svgNS, "defs"),
        i,
        a,
        queueLen,
        storageLen,
        storageContext,
        renderItem,
        el,
        settings = {},
        text,
        fontStyle,
        clipId = 0;
        
        svg.setAttribute("version", "1.1");
        svg.setAttribute("baseProfile", "full");

        svg.setAttribute("viewBox", "0 0 " + Math.max(zStack.ctx.width, options.width) + " " + Math.max(zStack.ctx.height, options.height));
        svg.setAttribute("width", Math.max(zStack.ctx.width, options.width) + "px");
        svg.setAttribute("height", Math.max(zStack.ctx.height, options.height) + "px");
        svg.setAttribute("preserveAspectRatio", "none");
        svg.appendChild(defs);
        
        
        
        for (i = 0, queueLen = queue.length; i < queueLen; i+=1){
            
            storageContext = queue.splice(0, 1)[0];
            storageContext.canvasPosition = storageContext.canvasPosition || {};   
           
            //this.canvasRenderContext(storageContext,parentctx);           

   
            /*
            if (storageContext.clip){
                ctx.save();
                ctx.beginPath();
                // console.log(storageContext);
                ctx.rect(storageContext.clip.left, storageContext.clip.top, storageContext.clip.width, storageContext.clip.height);
                ctx.clip();
        
            }*/
        
            if (storageContext.ctx.storage){
               
                for (a = 0, storageLen = storageContext.ctx.storage.length; a < storageLen; a+=1){
                    
                    renderItem = storageContext.ctx.storage[a];
                    
                   
                    
                    switch(renderItem.type){
                        case "variable":
                            settings[renderItem.name] = renderItem['arguments'];              
                            break;
                        case "function":
                            if (renderItem.name === "fillRect") {
                                
                                el = doc.createElementNS(svgNS, "rect");
                                el.setAttribute("x", renderItem['arguments'][0]);
                                el.setAttribute("y", renderItem['arguments'][1]);
                                el.setAttribute("width", renderItem['arguments'][2]);
                                el.setAttribute("height", renderItem['arguments'][3]);
                                el.setAttribute("fill",  settings.fillStyle);
                                svg.appendChild(el);

                            } else if(renderItem.name === "fillText") {
                                el = doc.createElementNS(svgNS, "text");
                                
                                fontStyle = settings.font.split(" ");
                                
                                el.style.fontVariant = fontStyle.splice(0, 1)[0];
                                el.style.fontWeight = fontStyle.splice(0, 1)[0];
                                el.style.fontStyle = fontStyle.splice(0, 1)[0];
                                el.style.fontSize = fontStyle.splice(0, 1)[0];
                                
                                el.setAttribute("x", renderItem['arguments'][1]);                 
                                el.setAttribute("y", renderItem['arguments'][2] - (parseInt(el.style.fontSize, 10) + 3));
                                
                                el.setAttribute("fill", settings.fillStyle);
                                
                               
                             
                                
                                // TODO get proper baseline
                                el.style.dominantBaseline = "text-before-edge";
                                el.style.fontFamily = fontStyle.join(" ");

                                text = doc.createTextNode(renderItem['arguments'][0]);
                                el.appendChild(text);
                               
                                
                                svg.appendChild(el);
                                
              
                    
                            } else if(renderItem.name === "drawImage") {

                                if (renderItem['arguments'][8] > 0 && renderItem['arguments'][7]){
                                    
                                    // TODO check whether even any clipping is necessary for this particular image
                                    el = doc.createElementNS(svgNS, "clipPath");
                                    el.setAttribute("id", "clipId" + clipId); 
                                    
                                    text = doc.createElementNS(svgNS, "rect");
                                    text.setAttribute("x",  renderItem['arguments'][5] );                 
                                    text.setAttribute("y", renderItem['arguments'][6]);
                                    
                                    text.setAttribute("width", renderItem['arguments'][3]);                 
                                    text.setAttribute("height", renderItem['arguments'][4]);
                                    el.appendChild(text);
                                    defs.appendChild(el);
                                    
                                    el = doc.createElementNS(svgNS, "image");
                                    el.setAttributeNS(xlinkNS, "xlink:href", renderItem['arguments'][0].src);
                                    el.setAttribute("width", renderItem['arguments'][0].width);                 
                                    el.setAttribute("height", renderItem['arguments'][0].height);           
                                    el.setAttribute("x", renderItem['arguments'][5] - renderItem['arguments'][1]);                 
                                    el.setAttribute("y", renderItem['arguments'][6] - renderItem['arguments'][2]);
                                    el.setAttribute("clip-path", "url(#clipId" + clipId + ")");
                                    // el.setAttribute("xlink:href", );
                                    

                                    el.setAttribute("preserveAspectRatio", "none");
                                    
                                    svg.appendChild(el);
                                    
                                    
                                    clipId += 1; 
                                /*
                                    ctx.drawImage(
                                        renderItem['arguments'][0],
                                        renderItem['arguments'][1],
                                        renderItem['arguments'][2],
                                        renderItem['arguments'][3],
                                        renderItem['arguments'][4],
                                        renderItem['arguments'][5],
                                        renderItem['arguments'][6],
                                        renderItem['arguments'][7],
                                        renderItem['arguments'][8]
                                        );
                                        */
                                }      
                            }
                               
                       
  
                            break;
                        default:
                               
                    }
            
                }

            }  
        /*
            if (storageContext.clip){
                ctx.restore();
            }
    */

       
   
        }
        
        
        
        
        
        
        
        
        
        
        h2clog("html2canvas: Renderer: SVG Renderer done - returning SVG DOM obj");
        
        return svg;

    }

    
    //this.each(this.opts.renderOrder.split(" "),function(i,renderer){
        
    //options.renderer = "svg";
    
    switch(options.renderer.toLowerCase()){
        case "canvas":
            canvas = doc.createElement('canvas');
            if (canvas.getContext){
                h2clog("html2canvas: Renderer: using canvas renderer");
                return canvasRenderer(parseQueue);
            } else {
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
                        canvasRenderer(parseQueue);
                    }
                });
                
                doc.body.appendChild( script );
                
                return canvas;
            }               
            break;
        case "svg":
            if (doc.createElementNS){
                h2clog("html2canvas: Renderer: using SVG renderer");
                return svgRenderer(parseQueue);             
            }
            break;
            
    }
         
         
         
    //});
    

    return this;
     

    
};
