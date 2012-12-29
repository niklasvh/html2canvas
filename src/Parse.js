_html2canvas.Parse = function (images, options) {
  window.scroll(0,0);

  var support = {
    rangeBounds: false,
    svgRendering: options.svgRendering && (function( ){
      var img = new Image(),
      canvas = document.createElement("canvas"),
      ctx = (canvas.getContext === undefined) ? false : canvas.getContext("2d");
      if (ctx === false) {
        // browser doesn't support canvas, good luck supporting SVG on canvas
        return false;
      }
      canvas.width = canvas.height = 10;
      img.src = [
      "data:image/svg+xml,",
      "<svg xmlns='http://www.w3.org/2000/svg' width='10' height='10'>",
      "<foreignObject width='10' height='10'>",
      "<div xmlns='http://www.w3.org/1999/xhtml' style='width:10;height:10;'>",
      "sup",
      "</div>",
      "</foreignObject>",
      "</svg>"
      ].join("");
      try {
        ctx.drawImage(img, 0, 0);
        canvas.toDataURL();
      } catch(e) {
        return false;
      }
      h2clog('html2canvas: Parse: SVG powered rendering available');
      return true;

    })()
  },
  element = (( options.elements === undefined ) ? document.body : options.elements[0]), // select body by default
  numDraws = 0,
  fontData = {},
  doc = element.ownerDocument,
  ignoreElementsRegExp = new RegExp("(" + options.ignoreElements + ")"),
  body = doc.body,
  r,
  testElement,
  rangeBounds,
  rangeHeight,
  stack,
  ctx,
  i,
  children,
  childrenLen;


  function documentWidth () {
    return Math.max(
      Math.max(doc.body.scrollWidth, doc.documentElement.scrollWidth),
      Math.max(doc.body.offsetWidth, doc.documentElement.offsetWidth),
      Math.max(doc.body.clientWidth, doc.documentElement.clientWidth)
      );
  }

  function documentHeight () {
    return Math.max(
      Math.max(doc.body.scrollHeight, doc.documentElement.scrollHeight),
      Math.max(doc.body.offsetHeight, doc.documentElement.offsetHeight),
      Math.max(doc.body.clientHeight, doc.documentElement.clientHeight)
      );
  }

  images = images || {};

  // Test whether we can use ranges to measure bounding boxes
  // Opera doesn't provide valid bounds.height/bottom even though it supports the method.


  if (doc.createRange) {
    r = doc.createRange();
    //this.support.rangeBounds = new Boolean(r.getBoundingClientRect);
    if (r.getBoundingClientRect){
      testElement = doc.createElement('boundtest');
      testElement.style.height = "123px";
      testElement.style.display = "block";
      body.appendChild(testElement);

      r.selectNode(testElement);
      rangeBounds = r.getBoundingClientRect();
      rangeHeight = rangeBounds.height;

      if (rangeHeight === 123) {
        support.rangeBounds = true;
      }
      body.removeChild(testElement);
    }

  }

  var getCSS = _html2canvas.Util.getCSS;

  function getCSSInt(element, attribute) {
    var val = parseInt(getCSS(element, attribute), 10);
    return (isNaN(val)) ? 0 : val; // borders in old IE are throwing 'medium' for demo.html
  }

  function renderRect (ctx, x, y, w, h, bgcolor) {
    if (bgcolor !== "transparent"){
      ctx.setVariable("fillStyle", bgcolor);
      ctx.fillRect(x, y, w, h);
      numDraws+=1;
    }
  }

  function textTransform (text, transform) {
    switch(transform){
      case "lowercase":
        return text.toLowerCase();
      case "capitalize":
        return text.replace( /(^|\s|:|-|\(|\))([a-z])/g , function (m, p1, p2) {
          if (m.length > 0) {
            return p1 + p2.toUpperCase();
          }
        } );
      case "uppercase":
        return text.toUpperCase();
      default:
        return text;
    }
  }

  function noLetterSpacing(letter_spacing) {
    return (/^(normal|none|0px)$/.test(letter_spacing));
  }

  function trimText (text) {
    return text.replace(/^\s*/g, "").replace(/\s*$/g, "");
  }

  function fontMetrics (font, fontSize) {

    if (fontData[font + "-" + fontSize] !== undefined) {
      return fontData[font + "-" + fontSize];
    }

    var container = doc.createElement('div'),
    img = doc.createElement('img'),
    span = doc.createElement('span'),
    sampleText = 'Hidden Text',
    baseline,
    middle,
    metricsObj;

    container.style.visibility = "hidden";
    container.style.fontFamily = font;
    container.style.fontSize = fontSize;
    container.style.margin = 0;
    container.style.padding = 0;

    body.appendChild(container);

    // http://probablyprogramming.com/2009/03/15/the-tiniest-gif-ever (handtinywhite.gif)
    img.src = "data:image/gif;base64,R0lGODlhAQABAIABAP///wAAACwAAAAAAQABAAACAkQBADs=";
    img.width = 1;
    img.height = 1;

    img.style.margin = 0;
    img.style.padding = 0;
    img.style.verticalAlign = "baseline";

    span.style.fontFamily = font;
    span.style.fontSize = fontSize;
    span.style.margin = 0;
    span.style.padding = 0;

    span.appendChild(doc.createTextNode(sampleText));
    container.appendChild(span);
    container.appendChild(img);
    baseline = (img.offsetTop - span.offsetTop) + 1;

    container.removeChild(span);
    container.appendChild(doc.createTextNode(sampleText));

    container.style.lineHeight = "normal";
    img.style.verticalAlign = "super";

    middle = (img.offsetTop-container.offsetTop) + 1;
    metricsObj = {
      baseline: baseline,
      lineWidth: 1,
      middle: middle
    };

    fontData[font + "-" + fontSize] = metricsObj;

    body.removeChild(container);

    return metricsObj;
  }

  function drawText(currentText, x, y, ctx){
    if (currentText !== null && trimText(currentText).length > 0) {
      ctx.fillText(currentText, x, y);
      numDraws+=1;
    }
  }

  function setTextVariables(ctx, el, text_decoration, color) {
    var align = false,
    font_style = getCSS(el, "fontStyle"),
    bold = getCSS(el, "fontWeight"),
    family = getCSS(el, "fontFamily"),
    size = getCSS(el, "fontSize"),
    font_variant = getCSS(el, "fontVariant");

    switch(parseInt(bold, 10)){
      case 401:
        bold = "bold";
        break;
      case 400:
        bold = "normal";
        break;
    }

    ctx.setVariable("fillStyle", color);
    ctx.setVariable("font", [font_style, font_variant, bold, size, family].join(" "));
    ctx.setVariable("textAlign", (align) ? "right" : "left");

    if (text_decoration !== "none"){
      return fontMetrics(family, size);
    }
  }

  function renderTextDecoration(text_decoration, bounds, metrics, color) {
    switch(text_decoration) {
      case "underline":
        // Draws a line at the baseline of the font
        // TODO As some browsers display the line as more than 1px if the font-size is big, need to take that into account both in position and size
        renderRect(ctx, bounds.left, Math.round(bounds.top + metrics.baseline + metrics.lineWidth), bounds.width, 1, color);
        break;
      case "overline":
        renderRect(ctx, bounds.left, bounds.top, bounds.width, 1, color);
        break;
      case "line-through":
        // TODO try and find exact position for line-through
        renderRect(ctx, bounds.left, Math.ceil(bounds.top + metrics.middle + metrics.lineWidth), bounds.width, 1, color);
        break;
    }
  }

  function renderText(el, textNode, stack) {
    var ctx = stack.ctx,
    color = getCSS(el, "color"),
    text_decoration = getCSS(el, "textDecoration"),
    text_align = getCSS(el, "textAlign"),
    letter_spacing = getCSS(el, "letterSpacing"),
    bounds,
    text,
    metrics,
    renderList,
    listLen,
    newTextNode,
    textValue,
    textOffset = 0,
    oldTextNode,
    c,
    range,
    parent,
    wrapElement,
    backupText;

    textNode.nodeValue = textTransform(textNode.nodeValue, getCSS(el, "textTransform"));
    text = trimText(textNode.nodeValue);

    if (text.length > 0){

      text_align = text_align.replace(["-webkit-auto"],["auto"]);

      renderList = (!options.letterRendering && /^(left|right|justify|auto)$/.test(text_align) && noLetterSpacing(letter_spacing)) ?
      textNode.nodeValue.split(/(\b| )/)
      : textNode.nodeValue.split("");

      metrics = setTextVariables(ctx, el, text_decoration, color);
      oldTextNode = textNode;

      for ( c=0, listLen = renderList.length; c < listLen; c+=1 ) {
        textValue = null;

        if (support.rangeBounds){
          // getBoundingClientRect is supported for ranges
          if (text_decoration !== "none" || trimText(renderList[c]).length !== 0) {
            textValue = renderList[c];
            if (doc.createRange){
              range = doc.createRange();

              range.setStart(textNode, textOffset);
              range.setEnd(textNode, textOffset + textValue.length);
            } else {
              // TODO add IE support
              range = body.createTextRange();
            }

            if (range.getBoundingClientRect()) {
              bounds = range.getBoundingClientRect();
            } else {
              bounds = {};
            }

          }
        } else {
          // it isn't supported, so let's wrap it inside an element instead and get the bounds there

          // IE 9 bug
          if (!oldTextNode || typeof oldTextNode.nodeValue !== "string" ){
            continue;
          }

          newTextNode = (i < listLen-1) ? oldTextNode.splitText(renderList[c].length) : null;

          parent = oldTextNode.parentNode;
          wrapElement = doc.createElement('wrapper');
          backupText = oldTextNode.cloneNode(true);

          wrapElement.appendChild(oldTextNode.cloneNode(true));
          parent.replaceChild(wrapElement, oldTextNode);

          bounds = _html2canvas.Util.Bounds(wrapElement);

          textValue = oldTextNode.nodeValue;

          oldTextNode = newTextNode;
          parent.replaceChild(backupText, wrapElement);
        }

        if (textValue !== null) {
          drawText(textValue, bounds.left, bounds.bottom, ctx);
        }
        renderTextDecoration(text_decoration, bounds, metrics, color);

        textOffset += renderList[c].length;

      }

    }

  }

  function listPosition (element, val) {
    var boundElement = doc.createElement( "boundelement" ),
    originalType,
    bounds;

    boundElement.style.display = "inline";

    originalType = element.style.listStyleType;
    element.style.listStyleType = "none";

    boundElement.appendChild(doc.createTextNode(val));

    element.insertBefore(boundElement, element.firstChild);

    bounds = _html2canvas.Util.Bounds(boundElement);
    element.removeChild(boundElement);
    element.style.listStyleType = originalType;
    return bounds;
  }

  function elementIndex( el ) {
    var i = -1,
    count = 1,
    childs = el.parentNode.childNodes;

    if ( el.parentNode ) {
      while( childs[ ++i ] !== el ) {
        if ( childs[ i ].nodeType === 1 ) {
          count++;
        }
      }
      return count;
    } else {
      return -1;
    }

  }

  function listItemText(element, type) {
    var currentIndex = elementIndex(element),
    text;
    switch(type){
      case "decimal":
        text = currentIndex;
        break;
      case "decimal-leading-zero":
        text = (currentIndex.toString().length === 1) ? currentIndex = "0" + currentIndex.toString() : currentIndex.toString();
        break;
      case "upper-roman":
        text = _html2canvas.Generate.ListRoman( currentIndex );
        break;
      case "lower-roman":
        text = _html2canvas.Generate.ListRoman( currentIndex ).toLowerCase();
        break;
      case "lower-alpha":
        text = _html2canvas.Generate.ListAlpha( currentIndex ).toLowerCase();
        break;
      case "upper-alpha":
        text = _html2canvas.Generate.ListAlpha( currentIndex );
        break;
    }

    text += ". ";
    return text;
  }

  function renderListItem(element, stack, elBounds) {
    var x,
    text,
    type = getCSS(element, "listStyleType"),
    listBounds;

    if (/^(decimal|decimal-leading-zero|upper-alpha|upper-latin|upper-roman|lower-alpha|lower-greek|lower-latin|lower-roman)$/i.test(type)) {
      text = listItemText(element, type);
      listBounds = listPosition(element, text);
      setTextVariables(ctx, element, "none", getCSS(element, "color"));

      if (getCSS(element, "listStylePosition") === "inside") {
        ctx.setVariable("textAlign", "left");
        x = elBounds.left;
      } else {
        return;
      }

      drawText(text, x, listBounds.bottom, ctx);
    }
  }

  function loadImage (src){
    var img = images[src];
    if (img && img.succeeded === true) {
      return img.img;
    } else {
      return false;
    }
  }

  function clipBounds(src, dst){
    var x = Math.max(src.left, dst.left),
    y = Math.max(src.top, dst.top),
    x2 = Math.min((src.left + src.width), (dst.left + dst.width)),
    y2 = Math.min((src.top + src.height), (dst.top + dst.height));

    return {
      left:x,
      top:y,
      width:x2-x,
      height:y2-y
    };
  }

  function setZ(zIndex, parentZ){
    // TODO fix static elements overlapping relative/absolute elements under same stack, if they are defined after them
    var newContext;
    if (!parentZ){
      newContext = h2czContext(0);
      return newContext;
    }

    if (zIndex !== "auto"){
      newContext = h2czContext(zIndex);
      parentZ.children.push(newContext);
      return newContext;

    }

    return parentZ;
  }

  function renderBorders(el, ctx, bounds, clip){
    var x = bounds.left,
    y = bounds.top,
    w = bounds.width,
    h = bounds.height,
    borderSide,
    borderData,
    bx,
    by,
    bw,
    bh,
    i,
    borderArgs,
    borderBounds,
    borders = (function(el){
      var borders = [],
      sides = ["Top","Right","Bottom","Left"],
      s;

      for (s = 0; s < 4; s+=1){
        borders.push({
          width: getCSSInt(el, 'border' + sides[s] + 'Width'),
          color: getCSS(el, 'border' + sides[s] + 'Color')
        });
      }

      return borders;

    }(el)),
    // http://www.w3.org/TR/css3-background/#the-border-radius
    borderRadius = (function( el ) {
      var borders = [],
      sides = ["TopLeft","TopRight","BottomRight","BottomLeft"],
      s;

      for (s = 0; s < 4; s+=1){
        borders.push( getCSS(el, 'border' + sides[s] + 'Radius') );
      }

      return borders;
    })( el );



    for ( borderSide = 0; borderSide < 4; borderSide+=1 ) {
      borderData = borders[ borderSide ];
      borderArgs = [];
      if (borderData.width>0){
        bx = x;
        by = y;
        bw = w;
        bh = h - (borders[2].width);

        switch(borderSide){
          case 0:
            // top border
            bh = borders[0].width;

            i = 0;
            borderArgs[ i++ ] = [ "line", bx, by ];  // top left
            borderArgs[ i++ ] = [ "line", bx + bw, by ]; // top right
            borderArgs[ i++ ] = [ "line", bx + bw - borders[ 1 ].width, by + bh  ]; // bottom right
            borderArgs[ i++ ] = [ "line", bx + borders[ 3 ].width, by + bh ]; // bottom left

            break;
          case 1:
            // right border
            bx = x + w - (borders[1].width);
            bw = borders[1].width;

            i = 0;
            borderArgs[ i++ ] = [ "line", bx, by + borders[ 0 ].width];  // top left
            borderArgs[ i++ ] = [ "line", bx + bw, by ]; // top right
            borderArgs[ i++ ] = [ "line", bx + bw, by + bh + borders[ 2 ].width ]; // bottom right
            borderArgs[ i++ ] = [ "line", bx, by + bh ]; // bottom left

            break;
          case 2:
            // bottom border
            by = (by + h) - (borders[2].width);
            bh = borders[2].width;

            i = 0;
            borderArgs[ i++ ] = [ "line", bx + borders[ 3 ].width, by ];  // top left
            borderArgs[ i++ ] = [ "line", bx + bw - borders[ 2 ].width, by ]; // top right
            borderArgs[ i++ ] = [ "line", bx + bw, by + bh ]; // bottom right
            borderArgs[ i++ ] = [ "line", bx, by + bh ]; // bottom left

            break;
          case 3:
            // left border
            bw = borders[3].width;

            i = 0;
            borderArgs[ i++ ] = [ "line", bx, by ];  // top left
            borderArgs[ i++ ] = [ "line", bx + bw, by + borders[ 0 ].width ]; // top right
            borderArgs[ i++ ] = [ "line", bx + bw, by + bh ]; // bottom right
            borderArgs[ i++ ] = [ "line", bx, by + bh + borders[ 2 ].width ]; // bottom left

            break;
        }

        borderBounds = {
          left:bx,
          top:by,
          width: bw,
          height:bh
        };

        if (clip){
          borderBounds = clipBounds(borderBounds, clip);
        }


        if ( borderBounds.width > 0 && borderBounds.height > 0 ) {

          if ( borderData.color !== "transparent" ){
            ctx.setVariable( "fillStyle", borderData.color );

            var shape = ctx.drawShape(),
            numBorderArgs = borderArgs.length;

            for ( i = 0; i < numBorderArgs; i++ ) {
              shape[( i === 0) ? "moveTo" : borderArgs[ i ][ 0 ] + "To" ].apply( null, borderArgs[ i ].slice(1) );
            }

            numDraws+=1;
          }

        }


      }
    }

    return borders;
  }


  function renderFormValue (el, bounds, stack){

    var valueWrap = doc.createElement('valuewrap'),
    cssPropertyArray = ['lineHeight','textAlign','fontFamily','color','fontSize','paddingLeft','paddingTop','width','height','border','borderLeftWidth','borderTopWidth'],
    textValue,
    textNode;

    cssPropertyArray.forEach(function(property) {
      try {
        valueWrap.style[property] = getCSS(el, property);
      } catch(e) {
        // Older IE has issues with "border"
        h2clog("html2canvas: Parse: Exception caught in renderFormValue: " + e.message);
      }
    });

    valueWrap.style.borderColor = "black";
    valueWrap.style.borderStyle = "solid";
    valueWrap.style.display = "block";
    valueWrap.style.position = "absolute";

    if (/^(submit|reset|button|text|password)$/.test(el.type) || el.nodeName === "SELECT"){
      valueWrap.style.lineHeight = getCSS(el, "height");
    }

    valueWrap.style.top = bounds.top + "px";
    valueWrap.style.left = bounds.left + "px";

    textValue = (el.nodeName === "SELECT") ? el.options[el.selectedIndex].text : el.value;
    textNode = doc.createTextNode(textValue);

    valueWrap.appendChild(textNode);
    body.appendChild(valueWrap);

    renderText(el, textNode, stack);
    body.removeChild(valueWrap);
  }

  function renderImage (ctx) {
    ctx.drawImage.apply(ctx, Array.prototype.slice.call(arguments, 1));
    numDraws+=1;
  }

  function renderBackgroundRepeat (ctx, image, x, y, width, height, elx, ely){
    var sourceX = (elx - x > 0) ? elx-x :0,
    sourceY= (ely - y > 0) ? ely-y : 0;

    renderImage(
      ctx,
      image,
      Math.floor(sourceX), // source X
      Math.floor(sourceY), // source Y
      Math.ceil(width-sourceX), // source Width
      Math.ceil(height-sourceY), // source Height
      Math.ceil(x+sourceX), // destination X
      Math.ceil(y+sourceY), // destination Y
      Math.ceil(width-sourceX), // destination width
      Math.ceil(height-sourceY) // destination height
      );
  }


  function renderBackgroundRepeatY (ctx, image, backgroundPosition, x, y, w, h){
    var height,
    width = Math.min(image.width, w),
    bgy;

    backgroundPosition.top -= Math.ceil(backgroundPosition.top / image.height) * image.height;

    for (bgy = y + backgroundPosition.top; bgy < h + y; bgy = Math.round(bgy + image.height)){
      height = (Math.floor(bgy + image.height) > h + y) ? (h+y) - bgy : image.height;
      renderBackgroundRepeat(ctx, image, x + backgroundPosition.left, bgy,width, height, x, y);
    }
  }

  function renderBackgroundRepeatX(ctx, image, backgroundPosition, x, y, w, h){
    var height = Math.min(image.height, h),
    width,
    bgx;

    backgroundPosition.left -= Math.ceil(backgroundPosition.left / image.width) * image.width;

    for (bgx = x + backgroundPosition.left; bgx < w + x; bgx = Math.round(bgx + image.width)) {
      width = (Math.floor(bgx + image.width) > w + x) ? (w + x) - bgx : image.width;
      renderBackgroundRepeat(ctx, image, bgx,(y + backgroundPosition.top), width, height, x, y);
    }
  }

  function renderBackground(el,bounds,ctx){
    // TODO add support for multi background-images
    var background_image = getCSS(el, "backgroundImage"),
    background_repeat = getCSS(el, "backgroundRepeat").split(",")[0],
    image,
    bgp,
    bgy,
    bgw,
    bgsx,
    bgsy,
    bgdx,
    bgdy,
    bgh,
    h,
    height,
    add;

    if ( !/data:image\/.*;base64,/i.test(background_image) && !/^(-webkit|-moz|linear-gradient|-o-)/.test(background_image) ) {
      background_image = background_image.split(",")[0];
    }

    if ( typeof background_image !== "undefined" && /^(1|none)$/.test(background_image) === false ) {
      background_image = _html2canvas.Util.backgroundImage(background_image);
      image = loadImage(background_image);


      bgp = _html2canvas.Util.BackgroundPosition(el, bounds, image);

      // TODO add support for background-origin
      if ( image ){
        switch ( background_repeat ) {
          case "repeat-x":
            renderBackgroundRepeatX(ctx, image, bgp, bounds.left, bounds.top, bounds.width, bounds.height);
            break;

          case "repeat-y":
            renderBackgroundRepeatY(ctx, image, bgp, bounds.left, bounds.top, bounds.width, bounds.height);
            break;

          case "no-repeat":
            bgw = bounds.width - bgp.left;
            bgh = bounds.height - bgp.top;
            bgsx = bgp.left;
            bgsy = bgp.top;
            bgdx = bgp.left+bounds.left;
            bgdy = bgp.top+bounds.top;

            if (bgsx<0){
              bgsx = Math.abs(bgsx);
              bgdx += bgsx;
              bgw = Math.min(bounds.width,image.width-bgsx);
            }else{
              bgw = Math.min(bgw,image.width);
              bgsx = 0;
            }

            if (bgsy<0){
              bgsy = Math.abs(bgsy);
              bgdy += bgsy;
              // bgh = bgh-bgsy;
              bgh = Math.min(bounds.height,image.height-bgsy);
            }else{
              bgh = Math.min(bgh,image.height);
              bgsy = 0;
            }

            if (bgh>0 && bgw > 0){
              renderImage(
                ctx,
                image,
                bgsx, // source X : 0
                bgsy, // source Y : 1695
                bgw, // source Width : 18
                bgh, // source Height : 1677
                bgdx, // destination X :906
                bgdy, // destination Y : 1020
                bgw, // destination width : 18
                bgh // destination height : 1677
                );

            }
            break;
          default:
            bgp.top = bgp.top-Math.ceil(bgp.top/image.height)*image.height;

            for(bgy=(bounds.top+bgp.top);bgy<bounds.height+bounds.top;) {
              h = Math.min(image.height,(bounds.height+bounds.top)-bgy);
              height = (Math.floor(bgy+image.height) > h + bgy) ? (h+bgy)-bgy : image.height;
              if (bgy<bounds.top){
                add = bounds.top-bgy;
                bgy = bounds.top;
              }else{
                add = 0;
              }

              renderBackgroundRepeatX(ctx, image, bgp, bounds.left, bgy, bounds.width, height);
              if (add>0){
                bgp.top += add;
              }
              bgy = Math.floor(bgy+image.height)-add;
            }
            break;

        }
      }else{
        h2clog("html2canvas: Error loading background:" + background_image);
      }

    }
  }

  function createStack(element, parentStack, bounds) {

    var stack = {
      ctx: h2cRenderContext((!parentStack) ? documentWidth() : bounds.width , (!parentStack) ? documentHeight() : bounds.height),
      zIndex: setZ(getCSS(element, "zIndex"), (parentStack) ? parentStack.zIndex : null),
      opacity: getCSS(element, "opacity") * ((parentStack) ? parentStack.opacity : 1),
      cssPosition: getCSS(element, "position"),
      clip: (parentStack && parentStack.clip) ? _html2canvas.Util.Extend( {}, parentStack.clip ) : null
    };

    return stack;
  }

  function getBackgroundBounds(borders, bounds, clip) {
    var backgroundBounds = {
      left: bounds.left + borders[3].width,
      top: bounds.top + borders[0].width,
      width: bounds.width - (borders[1].width + borders[3].width),
      height: bounds.height - (borders[0].width + borders[2].width)
    };

    if (clip) {
      backgroundBounds = clipBounds(backgroundBounds, clip);
    }

    return backgroundBounds;
  }

  function renderElement(el, parentStack){
    var bounds = _html2canvas.Util.Bounds(el),
    x = bounds.left,
    y = bounds.top,
    w = bounds.width,
    h = bounds.height,
    image,
    bgcolor = getCSS(el, "backgroundColor"),
    zindex,
    stack,
    stackLength,
    borders,
    ctx,
    backgroundBounds,
    imgSrc,
    paddingLeft,
    paddingTop,
    paddingRight,
    paddingBottom;

    stack = createStack(el, parentStack, bounds);
    zindex = stack.zIndex;

    // TODO correct overflow for absolute content residing under a static position

    if (options.useOverflow === true && /(hidden|scroll|auto)/.test(getCSS(el, "overflow")) === true && /(BODY)/i.test(el.nodeName) === false){
      stack.clip = (stack.clip) ? clipBounds(stack.clip, bounds) : bounds;
    }

    stackLength = zindex.children.push(stack);

    ctx = zindex.children[stackLength-1].ctx;

    ctx.setVariable("globalAlpha", stack.opacity);


    borders = renderBorders(el, ctx, bounds, false);
    stack.borders = borders;

    if (ignoreElementsRegExp.test(el.nodeName) && options.iframeDefault !== "transparent"){
      bgcolor = (options.iframeDefault === "default") ? "#efefef" : options.iframeDefault;
    }

    backgroundBounds = getBackgroundBounds(borders, bounds, stack.clip);

    if (backgroundBounds.height > 0 && backgroundBounds.width > 0){
      renderRect(
        ctx,
        backgroundBounds.left,
        backgroundBounds.top,
        backgroundBounds.width,
        backgroundBounds.height,
        bgcolor
        );

      renderBackground(el, backgroundBounds, ctx);
    }

    switch(el.nodeName){
      case "IMG":
        imgSrc = el.getAttribute('src');
        image = loadImage(imgSrc);
        if (image){

          paddingLeft = getCSSInt(el, 'paddingLeft');
          paddingTop = getCSSInt(el, 'paddingTop');
          paddingRight = getCSSInt(el, 'paddingRight');
          paddingBottom = getCSSInt(el, 'paddingBottom');


          renderImage(
            ctx,
            image,
            0, //sx
            0, //sy
            image.width, //sw
            image.height, //sh
            x + paddingLeft + borders[3].width, //dx
            y + paddingTop + borders[0].width, // dy
            bounds.width - (borders[1].width + borders[3].width + paddingLeft + paddingRight), //dw
            bounds.height - (borders[0].width + borders[2].width + paddingTop + paddingBottom) //dh
            );

        }else{
          h2clog("html2canvas: Error loading <img>:" + imgSrc);
        }
        break;
      case "INPUT":
        // TODO add all relevant type's, i.e. HTML5 new stuff
        // todo add support for placeholder attribute for browsers which support it
        if (/^(text|url|email|submit|button|reset)$/.test(el.type) && el.value.length > 0){
          renderFormValue(el, bounds, stack);
        }
        break;
      case "TEXTAREA":
        if (el.value.length > 0){
          renderFormValue(el, bounds, stack);
        }
        break;
      case "SELECT":
        if (el.options.length > 0){
          renderFormValue(el, bounds, stack);
        }
        break;
      case "LI":
        renderListItem(el, stack, backgroundBounds);
        break;
      case "CANVAS":
        paddingLeft = getCSSInt(el, 'paddingLeft');
        paddingTop = getCSSInt(el, 'paddingTop');
        paddingRight = getCSSInt(el, 'paddingRight');
        paddingBottom = getCSSInt(el, 'paddingBottom');
        renderImage(
          ctx,
          el,
          0,
          0,
          el.width,
          el.height,
          x + paddingLeft + borders[3].width,
          y + paddingTop + borders[0].width,
          bounds.width - (borders[1].width + borders[3].width + paddingLeft + paddingRight),
          bounds.height - (borders[0].width + borders[2].width + paddingTop + paddingBottom)
          );
        break;
    }

    return zindex.children[stackLength - 1];
  }

  function isElementVisible(element) {
    return (getCSS(element, 'display') !== "none" && getCSS(element, 'visibility') !== "hidden" && !element.hasAttribute("data-html2canvas-ignore"));
  }

  function parseElement (el, stack) {

    if (isElementVisible(el)) {
      stack = renderElement(el, stack) || stack;
      ctx = stack.ctx;

      if (!ignoreElementsRegExp.test(el.nodeName)) {
        _html2canvas.Util.Children(el).forEach(function(node) {
          if (node.nodeType === 1) {
            parseElement(node, stack);
          } else if (node.nodeType === 3) {
            renderText(el, node, stack);
          }
        });
      }
    }
  }

  stack = renderElement(element, null);

  /*
    SVG powered HTML rendering, non-tainted canvas available from FF 11+ onwards
 */

  if ( support.svgRendering ) {
    (function( body ){
      var img = new Image(),
      docWidth = documentWidth(),
      docHeight = documentHeight(),
      html = "";

      function parseDOM( el ) {
        var children = _html2canvas.Util.Children( el ),
        len = children.length,
        attr,
        a,
        alen,
        elm,
        i;
        for ( i = 0; i < len; i+=1 ) {
          elm = children[ i ];
          if ( elm.nodeType === 3 ) {
            // Text node
            html += elm.nodeValue.replace(/</g,"&lt;").replace(/>/g,"&gt;");
          } else if ( elm.nodeType === 1 ) {
            // Element
            if ( !/^(script|meta|title)$/.test(elm.nodeName.toLowerCase()) ) {

              html += "<" + elm.nodeName.toLowerCase();

              // add attributes
              if ( elm.hasAttributes() ) {
                attr = elm.attributes;
                alen = attr.length;
                for ( a = 0; a < alen; a+=1 ) {
                  html += " " + attr[ a ].name + '="' + attr[ a ].value + '"';
                }
              }


              html += '>';

              parseDOM( elm );


              html += "</" + elm.nodeName.toLowerCase() + ">";
            }
          }

        }

      }

      parseDOM(body);
      img.src = [
      "data:image/svg+xml,",
      "<svg xmlns='http://www.w3.org/2000/svg' version='1.1' width='" + docWidth + "' height='" + docHeight + "'>",
      "<foreignObject width='" + docWidth + "' height='" + docHeight + "'>",
      "<html xmlns='http://www.w3.org/1999/xhtml' style='margin:0;'>",
      html.replace(/\#/g,"%23"),
      "</html>",
      "</foreignObject>",
      "</svg>"
      ].join("");

      img.onload = function() {
        stack.svgRender = img;
      };

    })(document.documentElement);

  }


  // parse every child element
  for (i = 0, children = element.children, childrenLen = children.length; i < childrenLen; i+=1){
    parseElement(children[i], stack);
  }

  stack.backgroundColor = getCSS(document.documentElement, "backgroundColor");

  return stack;

};

function h2czContext(zindex) {
  return {
    zindex: zindex,
    children: []
  };
}