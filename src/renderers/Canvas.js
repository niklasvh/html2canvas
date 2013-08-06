_html2canvas.Renderer.Canvas = function(options) {
  options = options || {};

  var doc = document,
  safeImages = [],
  testCanvas = document.createElement("canvas"),
  testctx = testCanvas.getContext("2d"),
  canvas = options.canvas || doc.createElement('canvas');

  function createShape(ctx, args) {
    ctx.beginPath();
    args.forEach(function(arg) {
      ctx[arg.name].apply(ctx, arg['arguments']);
    });
    ctx.closePath();
  }

  function safeImage(item) {
    if (safeImages.indexOf(item['arguments'][0].src ) === -1) {
      testctx.drawImage(item['arguments'][0], 0, 0);
      try {
        testctx.getImageData(0, 0, 1, 1);
      } catch(e) {
        testCanvas = doc.createElement("canvas");
        testctx = testCanvas.getContext("2d");
        return false;
      }
      safeImages.push(item['arguments'][0].src);
    }
    return true;
  }

  function isTransparent(backgroundColor) {
    return (backgroundColor === "transparent" || backgroundColor === "rgba(0, 0, 0, 0)");
  }

  function renderItem(ctx, item) {
    switch(item.type){
      case "variable":
        ctx[item.name] = item['arguments'];
        break;
      case "function":
        if (item.name === "createPattern") {
          if (item['arguments'][0].width > 0 && item['arguments'][0].height > 0) {
            try {
              ctx.fillStyle = ctx.createPattern(item['arguments'][0], "repeat");
            }
            catch(e) {
              _html2canvas.Util.log("html2canvas: Renderer: Error creating pattern", e.message);
            }
          }
        } else if (item.name === "drawShape") {
          createShape(ctx, item['arguments']);
        } else if (item.name === "drawImage") {
          if (item['arguments'][8] > 0 && item['arguments'][7] > 0) {
            if (!options.taintTest || (options.taintTest && safeImage(item))) {
              ctx.drawImage.apply( ctx, item['arguments'] );
            }
          }
        } else {
          ctx[item.name].apply(ctx, item['arguments']);
        }
        break;
    }
  }

  return function(zStack, options, document, queue, _html2canvas) {
    var ctx = canvas.getContext("2d"),
    render = renderItem.bind(null, ctx),
    newCanvas,
    bounds,
    fstyle;

    canvas.width = canvas.style.width =  options.width || zStack.ctx.width;
    canvas.height = canvas.style.height = options.height || zStack.ctx.height;

    fstyle = ctx.fillStyle;
    ctx.fillStyle = (isTransparent(zStack.backgroundColor) && options.background !== undefined) ? options.background : zStack.backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = fstyle;

    queue.forEach(function(storageContext) {
      // set common settings for canvas
      ctx.textBaseline = "bottom";
      ctx.save();

      if (storageContext.transform.matrix) {
        ctx.translate(storageContext.transform.origin[0], storageContext.transform.origin[1]);
        ctx.transform.apply(ctx, storageContext.transform.matrix);
        ctx.translate(-storageContext.transform.origin[0], -storageContext.transform.origin[1]);
      }

      if (storageContext.clip){
        ctx.beginPath();
        ctx.rect(storageContext.clip.left, storageContext.clip.top, storageContext.clip.width, storageContext.clip.height);
        ctx.clip();
      }

      if (storageContext.ctx.storage) {
        storageContext.ctx.storage.forEach(render);
      }

      ctx.restore();
    });

    _html2canvas.Util.log("html2canvas: Renderer: Canvas renderer done - returning canvas obj");

    if (options.elements.length === 1) {
      if (typeof options.elements[0] === "object" && options.elements[0].nodeName !== "BODY") {
        // crop image to the bounds of selected (single) element
        bounds = _html2canvas.Util.Bounds(options.elements[0]);
        newCanvas = document.createElement('canvas');
        newCanvas.width = Math.ceil(bounds.width);
        newCanvas.height = Math.ceil(bounds.height);
        ctx = newCanvas.getContext("2d");

        ctx.drawImage(canvas, bounds.left, bounds.top, bounds.width, bounds.height, 0, 0, bounds.width, bounds.height);
        canvas = null;
        return newCanvas;
      }
    }

    return canvas;
  };
};