var html2canvasNodeAttribute = "data-html2canvas-node";

window.html2canvas = function(nodeList, options) {
    options = options || {};
    if (options.logging) {
        window.html2canvas.logging = true;
        window.html2canvas.start = Date.now();
    }

    options.async = typeof(options.async) === "undefined" ? true : options.async;
    options.allowTaint = typeof(options.allowTaint) === "undefined" ? false : options.allowTaint;
    options.removeContainer = typeof(options.removeContainer) === "undefined" ? true : options.removeContainer;

    var node = ((nodeList === undefined) ? [document.documentElement] : ((nodeList.length) ? nodeList : [nodeList]))[0];
    node.setAttribute(html2canvasNodeAttribute, "true");
    return renderDocument(node.ownerDocument, options, window.innerWidth, window.innerHeight).then(function(canvas) {
        if (typeof(options.onrendered) === "function") {
            log("options.onrendered is deprecated, html2canvas returns a Promise containing the canvas");
            options.onrendered(canvas);
        }
        return canvas;
    });
};

function renderDocument(document, options, windowWidth, windowHeight) {
    return createWindowClone(document, windowWidth, windowHeight, options).then(function(container) {
        log("Document cloned");
        var selector = "[" + html2canvasNodeAttribute + "='true']";
        document.querySelector(selector).removeAttribute(html2canvasNodeAttribute);
        var clonedWindow = container.contentWindow;
        var node = clonedWindow.document.querySelector(selector);
        var support = new Support(clonedWindow.document);
        var imageLoader = new ImageLoader(options, support);
        var bounds = getBounds(node);
        var width = options.type === "view" ? Math.min(bounds.width, windowWidth) : documentWidth();
        var height = options.type === "view" ? Math.min(bounds.height, windowHeight) : documentHeight();
        var renderer = new CanvasRenderer(width, height, imageLoader, options);
        var parser = new NodeParser(node, renderer, support, imageLoader, options);
        return parser.ready.then(function() {
            log("Finished rendering");
            var canvas = (options.type !== "view" && (node === clonedWindow.document.body || node === clonedWindow.document.documentElement)) ? renderer.canvas : crop(renderer.canvas, bounds);
            if (options.removeContainer) {
                container.parentNode.removeChild(container);
                log("Cleaned up container");
            }
            return canvas;
        });
    });
}

function crop(canvas, bounds) {
    var croppedCanvas = document.createElement("canvas");
    var x1 = Math.min(canvas.width - 1, Math.max(0, bounds.left));
    var x2 = Math.min(canvas.width, Math.max(1, bounds.left + bounds.width));
    var y1 = Math.min(canvas.height - 1, Math.max(0, bounds.top));
    var y2 = Math.min(canvas.height, Math.max(1, bounds.top + bounds.height));
    var width = croppedCanvas.width = x2 - x1;
    var height = croppedCanvas.height =  y2 - y1;
    log("Cropping canvas at:", "left:", bounds.left, "top:", bounds.top, "width:", bounds.width, "height:", bounds.height);
    log("Resulting crop with width", width, "and height", height, " with x", x1, "and y", y1);
    croppedCanvas.getContext("2d").drawImage(canvas, x1, y1, width, height, 0, 0, width, height);
    return croppedCanvas;
}

function documentWidth () {
    return Math.max(
        Math.max(document.body.scrollWidth, document.documentElement.scrollWidth),
        Math.max(document.body.offsetWidth, document.documentElement.offsetWidth),
        Math.max(document.body.clientWidth, document.documentElement.clientWidth)
    );
}

function documentHeight () {
    return Math.max(
        Math.max(document.body.scrollHeight, document.documentElement.scrollHeight),
        Math.max(document.body.offsetHeight, document.documentElement.offsetHeight),
        Math.max(document.body.clientHeight, document.documentElement.clientHeight)
    );
}

function smallImage() {
    return "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
}

function createWindowClone(ownerDocument, width, height, options) {
    var documentElement = ownerDocument.documentElement.cloneNode(true),
        container = ownerDocument.createElement("iframe");

    container.style.visibility = "hidden";
    container.style.position = "absolute";
    container.style.left = container.style.top = "-10000px";
    container.width = width;
    container.height = height;
    container.scrolling = "no"; // ios won't scroll without it
    ownerDocument.body.appendChild(container);

    return new Promise(function(resolve) {
        var documentClone = container.contentWindow.document;
        /* Chrome doesn't detect relative background-images assigned in inline <style> sheets when fetched through getComputedStyle
        if window url is about:blank, we can assign the url to current by writing onto the document
         */
        container.contentWindow.onload = container.onload = function() {
            resolve(container);
        };

        documentClone.open();
        documentClone.write("<!DOCTYPE html>");
        documentClone.close();

        documentClone.replaceChild(removeScriptNodes(documentClone.adoptNode(documentElement)), documentClone.documentElement);
        if (options.type === "view") {
            container.contentWindow.scrollTo(window.pageXOffset, window.pageYOffset);
        }
    });
}

function removeScriptNodes(parent) {
    [].slice.call(parent.childNodes, 0).filter(isElementNode).forEach(function(node) {
        if (node.tagName === "SCRIPT") {
            parent.removeChild(node);
        } else {
            removeScriptNodes(node);
        }
    });
    return parent;
}

function isElementNode(node) {
    return node.nodeType === Node.ELEMENT_NODE;
}
