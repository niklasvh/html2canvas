var log = require('./log');
var Promise = require('./promise');

var html2canvasCanvasCloneAttribute = "data-html2canvas-canvas-clone";
var html2canvasCanvasCloneIndex = 0;

function cloneNodeValues(document, clone, nodeName) {
    var originalNodes = document.getElementsByTagName(nodeName);
    var clonedNodes = clone.getElementsByTagName(nodeName);
    var count = originalNodes.length;
    for (var i = 0; i < count; i++) {
        clonedNodes[i].value = originalNodes[i].value;
    }
}

function restoreOwnerScroll(ownerDocument, x, y) {
    if (ownerDocument.defaultView && (x !== ownerDocument.defaultView.pageXOffset || y !== ownerDocument.defaultView.pageYOffset)) {
        ownerDocument.defaultView.scrollTo(x, y);
    }
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

function isIE9() {
    return document.documentMode && document.documentMode <= 9;
}

// https://github.com/niklasvh/html2canvas/issues/503
function cloneNodeIE9(node, javascriptEnabled) {
    var clone = node.nodeType === 3 ? document.createTextNode(node.nodeValue) : node.cloneNode(false);

    var child = node.firstChild;
    while(child) {
        if (javascriptEnabled === true || child.nodeType !== 1 || child.nodeName !== 'SCRIPT') {
            clone.appendChild(cloneNodeIE9(child, javascriptEnabled));
        }
        child = child.nextSibling;
    }

    return clone;
}



function isElementNode(node) {
    return node.nodeType === Node.ELEMENT_NODE;
}

module.exports = function(ownerDocument, containerDocument, width, height, options, x ,y) {
    labelCanvasElements(ownerDocument);
    var documentElement = isIE9() ? cloneNodeIE9(ownerDocument.documentElement, options.javascriptEnabled) : ownerDocument.documentElement.cloneNode(true);
    var container = containerDocument.createElement("iframe");

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

        cloneNodeValues(ownerDocument.documentElement, documentElement, "textarea");
        cloneNodeValues(ownerDocument.documentElement, documentElement, "select");

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

        documentClone.open();
        documentClone.write("<!DOCTYPE html><html></html>");
        // Chrome scrolls the parent document for some reason after the write to the cloned window???
        restoreOwnerScroll(ownerDocument, x, y);
        documentClone.replaceChild(options.javascriptEnabled === true ? documentClone.adoptNode(documentElement) : removeScriptNodes(documentClone.adoptNode(documentElement)), documentClone.documentElement);
        documentClone.close();
    });
};
