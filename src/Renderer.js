_html2canvas.Renderer = function(parseQueue, options){

  function createRenderQueue(parseQueue) {
    var queue = [];

    var sortZ = function(zStack){
      var subStacks = [],
      stackValues = [];

      zStack.children.forEach(function(stackChild) {
        if (stackChild.children && stackChild.children.length > 0){
          subStacks.push(stackChild);
          stackValues.push(stackChild.zindex);
        } else {
          queue.push(stackChild);
        }
      });

      stackValues.sort(function(a, b) {
        return a - b;
      });

      stackValues.forEach(function(zValue) {
        var index;

        subStacks.some(function(stack, i){
          index = i;
          return (stack.zindex === zValue);
        });
        sortZ(subStacks.splice(index, 1)[0]);

      });
    };

    sortZ(parseQueue.zIndex);

    return queue;
  }

  function getRenderer(rendererName) {
    var renderer;

    if (typeof options.renderer === "string" && _html2canvas.Renderer[rendererName] !== undefined) {
      renderer = _html2canvas.Renderer[rendererName](options);
    } else if (typeof rendererName === "function") {
      renderer = rendererName(options);
    } else {
      throw new Error("Unknown renderer");
    }

    if ( typeof renderer !== "function" ) {
      throw new Error("Invalid renderer defined");
    }
    return renderer;
  }

  return getRenderer(options.renderer)(parseQueue, options, document, createRenderQueue(parseQueue), _html2canvas);
};
