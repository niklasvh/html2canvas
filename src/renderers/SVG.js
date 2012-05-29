/*
  html2canvas @VERSION@ <http://html2canvas.hertzen.com>
  Copyright (c) 2011 Niklas von Hertzen. All rights reserved.
  http://www.twitter.com/niklasvh

  Released under MIT License
*/


// WARNING THIS file is outdated, and hasn't been tested in quite a while

_html2canvas.Renderer.SVG = function( options ) {

    options = options || {};

    var doc = document,
    svgNS = "http://www.w3.org/2000/svg",
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
    clipId = 0,
    methods;


    methods = {
        _create: function( zStack, options, doc, queue, _html2canvas ) {
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
                                        el.setAttribute("width", renderItem['arguments'][7]);
                                        el.setAttribute("height", renderItem['arguments'][8]);
                                        el.setAttribute("x", renderItem['arguments'][5]);
                                        el.setAttribute("y", renderItem['arguments'][6]);
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
    };

    return methods;


};
