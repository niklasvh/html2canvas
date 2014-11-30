var html2canvasNodeAttribute = "data-html2canvas-node";
var html2canvasCanvasCloneAttribute = "data-html2canvas-canvas-clone";
var html2canvasCanvasCloneIndex = 0;

window.html2canvas = function(nodeList, options) {
    options = options || {};
    if (options.logging) {
        window.html2canvas.logging = true;
        window.html2canvas.start = Date.now();
    }

    options.async = typeof(options.async) === "undefined" ? true : options.async;
    options.allowTaint = typeof(options.allowTaint) === "undefined" ? false : options.allowTaint;
    options.removeContainer = typeof(options.removeContainer) === "undefined" ? true : options.removeContainer;
    options.javascriptEnabled = typeof(options.javascriptEnabled) === "undefined" ? false : options.javascriptEnabled;
    options.imageTimeout = typeof(options.imageTimeout) === "undefined" ? 10000 : options.imageTimeout;

    if (typeof(nodeList) === "string") {
        if (typeof(options.proxy) !== "string") {
            return Promise.reject("Proxy must be used when rendering url");
        }
        return loadUrlDocument(absoluteUrl(nodeList), options.proxy, document, window.innerWidth, window.innerHeight, options).then(function(container) {
            return renderWindow(container.contentWindow.document.documentElement, container, options, window.innerWidth, window.innerHeight);
        });
    }

    var node = ((nodeList === undefined) ? [document.documentElement] : ((nodeList.length) ? nodeList : [nodeList]))[0];
    node.setAttribute(html2canvasNodeAttribute, "true");
    return renderDocument(node.ownerDocument, options, node.ownerDocument.defaultView.innerWidth, node.ownerDocument.defaultView.innerHeight).then(function(canvas) {
        if (typeof(options.onrendered) === "function") {
            log("options.onrendered is deprecated, html2canvas returns a Promise containing the canvas");
            options.onrendered(canvas);
        }
        return canvas;
    });
};

window.html2canvas.punycode = this.punycode;
window.html2canvas.proxy = {};

function renderDocument(document, options, windowWidth, windowHeight) {
    return createWindowClone(document, document, windowWidth, windowHeight, options).then(function(container) {
        log("Document cloned");
        var selector = "[" + html2canvasNodeAttribute + "='true']";
        document.querySelector(selector).removeAttribute(html2canvasNodeAttribute);
        var clonedWindow = container.contentWindow;
        var node = clonedWindow.document.querySelector(selector);
        var oncloneHandler = (typeof(options.onclone) === "function") ? Promise.resolve(options.onclone(clonedWindow.document)) : Promise.resolve(true);
        return oncloneHandler.then(function() {
            return renderWindow(node, container, options, windowWidth, windowHeight);
        });
    });
}

function renderWindow(node, container, options, windowWidth, windowHeight) {
    var clonedWindow = container.contentWindow;
    var support = new Support(clonedWindow.document);
    var imageLoader = new ImageLoader(options, support);
    var bounds = getBounds(node);
    var width = options.type === "view" ? windowWidth : documentWidth(clonedWindow.document);
    var height = options.type === "view" ? windowHeight : documentHeight(clonedWindow.document);
    var renderer = new CanvasRenderer(width, height, imageLoader, options, document);
    var parser = new NodeParser(node, renderer, support, imageLoader, options);
    return parser.ready.then(function() {
        log("Finished rendering");
        var canvas;

        if (options.type === "view") {
            canvas = crop(renderer.canvas, {width: renderer.canvas.width, height: renderer.canvas.height, top: 0, left: 0, x: 0, y: 0});
        } else if (node === clonedWindow.document.body || node === clonedWindow.document.documentElement || options.canvas != null) {
            canvas = renderer.canvas;
        } else {
            canvas = crop(renderer.canvas, {width:  options.width != null ? options.width : bounds.width, height: options.height != null ? options.height : bounds.height, top: bounds.top, left: bounds.left, x: clonedWindow.pageXOffset, y: clonedWindow.pageYOffset});
        }

        cleanupContainer(container, options);
        return canvas;
    });
}

function cleanupContainer(container, options) {
    if (options.removeContainer) {
        container.parentNode.removeChild(container);
        log("Cleaned up container");
    }
}

function crop(canvas, bounds) {
    var croppedCanvas = document.createElement("canvas");
    var x1 = Math.min(canvas.width - 1, Math.max(0, bounds.left));
    var x2 = Math.min(canvas.width, Math.max(1, bounds.left + bounds.width));
    var y1 = Math.min(canvas.height - 1, Math.max(0, bounds.top));
    var y2 = Math.min(canvas.height, Math.max(1, bounds.top + bounds.height));
    croppedCanvas.width = bounds.width;
    croppedCanvas.height =  bounds.height;
    log("Cropping canvas at:", "left:", bounds.left, "top:", bounds.top, "width:", (x2-x1), "height:", (y2-y1));
    log("Resulting crop with width", bounds.width, "and height", bounds.height, " with x", x1, "and y", y1);
    croppedCanvas.getContext("2d").drawImage(canvas, x1, y1, x2-x1, y2-y1, bounds.x, bounds.y, x2-x1, y2-y1);
    return croppedCanvas;
}

function documentWidth (doc) {
    return Math.max(
        Math.max(doc.body.scrollWidth, doc.documentElement.scrollWidth),
        Math.max(doc.body.offsetWidth, doc.documentElement.offsetWidth),
        Math.max(doc.body.clientWidth, doc.documentElement.clientWidth)
    );
}

function documentHeight (doc) {
    return Math.max(
        Math.max(doc.body.scrollHeight, doc.documentElement.scrollHeight),
        Math.max(doc.body.offsetHeight, doc.documentElement.offsetHeight),
        Math.max(doc.body.clientHeight, doc.documentElement.clientHeight)
    );
}

function smallImage() {
    return "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
}

function createWindowClone(ownerDocument, containerDocument, width, height, options) {
    labelCanvasElements(ownerDocument);
    var documentElement = ownerDocument.documentElement.cloneNode(true),
        container = containerDocument.createElement("iframe");

    container.className = "html2canvas-container";
    container.style.visibility = "hidden";
    container.style.position = "fixed";
    container.style.left = "-10000px";
    container.style.top = "0px";
    container.style.border = "0";
    container.width = width;
    container.height = height;
    container.scrolling = "no"; // ios won't scroll without it
    containerDocument.body.appendChild(container);

    return new Promise(function(resolve) {
        var documentClone = container.contentWindow.document;
        /* Chrome doesn't detect relative background-images assigned in inline <style> sheets when fetched through getComputedStyle
        if window url is about:blank, we can assign the url to current by writing onto the document
         */
        container.contentWindow.onload = container.onload = function() {
            var interval = setInterval(function() {
                if (documentClone.body.childNodes.length > 0) {
                    cloneCanvasContents(ownerDocument, documentClone);
                    clearInterval(interval);
                    if (options.type === "view") {
                        container.contentWindow.scrollTo(x, y);
                    }
                    resolve(container);
                }
            }, 50);
        };

        var x = ownerDocument.defaultView.pageXOffset;
        var y = ownerDocument.defaultView.pageYOffset;

        documentClone.open();
        documentClone.write("<!DOCTYPE html><html></html>");
        // Chrome scrolls the parent document for some reason after the write to the cloned window???
        restoreOwnerScroll(ownerDocument, x, y);
        documentClone.replaceChild(options.javascriptEnabled === true ? documentClone.adoptNode(documentElement) : removeScriptNodes(documentClone.adoptNode(documentElement)), documentClone.documentElement);
        documentClone.close();
    });
}

function restoreOwnerScroll(ownerDocument, x, y) {
    if (x !== ownerDocument.defaultView.pageXOffset || y !== ownerDocument.defaultView.pageYOffset) {
        ownerDocument.defaultView.scrollTo(x, y);
    }
}

function loadUrlDocument(src, proxy, document, width, height, options) {
    return new Proxy(src, proxy, window.document).then(documentFromHTML(src)).then(function(doc) {
        return createWindowClone(doc, document, width, height, options);
    });
}

function documentFromHTML(src) {
    return function(html) {
        var parser = new DOMParser(), doc;
        try {
            doc = parser.parseFromString(html, "text/html");
        } catch(e) {
            log("DOMParser not supported, falling back to createHTMLDocument");
            doc = document.implementation.createHTMLDocument("");
            try {
                doc.open();
                doc.write(html);
                doc.close();
            } catch(ee) {
                log("createHTMLDocument write not supported, falling back to document.body.innerHTML");
                doc.body.innerHTML = html; // ie9 doesnt support writing to documentElement
            }
        }

        var b = doc.querySelector("base");
        if (!b || !b.href.host) {
            var base = doc.createElement("base");
            base.href = src;
            doc.head.insertBefore(base, doc.head.firstChild);
        }

        return doc;
    };
}


function labelCanvasElements(ownerDocument) {
    [].slice.call(ownerDocument.querySelectorAll("canvas"), 0).forEach(function(canvas) {
        canvas.setAttribute(html2canvasCanvasCloneAttribute, "canvas-" + html2canvasCanvasCloneIndex++);
    });
}

function cloneCanvasContents(ownerDocument, documentClone) {
    [].slice.call(ownerDocument.querySelectorAll("[" + html2canvasCanvasCloneAttribute + "]"), 0).forEach(function(canvas) {
        try {
            var clonedCanvas = documentClone.querySelector('[' + html2canvasCanvasCloneAttribute + '="' + canvas.getAttribute(html2canvasCanvasCloneAttribute) + '"]');
            if (clonedCanvas) {
                clonedCanvas.width = canvas.width;
                clonedCanvas.height = canvas.height;
                clonedCanvas.getContext("2d").putImageData(canvas.getContext("2d").getImageData(0, 0, canvas.width, canvas.height), 0, 0);
            }
        } catch(e) {
            log("Unable to copy canvas content from", canvas, e);
        }
        canvas.removeAttribute(html2canvasCanvasCloneAttribute);
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

function absoluteUrl(url) {
    var link = document.createElement("a");
    link.href = url;
    link.href = link.href;
    return link;
}
