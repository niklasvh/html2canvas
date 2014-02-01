window.html2canvas = function(nodeList, options) {
    options = options || {};
    if (options.logging) {
        window.html2canvas.logging = true;
        window.html2canvas.start = Date.now();
    }
    createWindowClone(document, window.innerWidth, window.innerHeight).then(function(container) {
        log("Document cloned");
        var clonedWindow = container.contentWindow;
        //var element = (nodeList === undefined) ? document.body : nodeList[0];
        var node = clonedWindow.document.documentElement;
        var support = new Support();
        var imageLoader = new ImageLoader(options, support);
        var bounds = NodeParser.prototype.getBounds(node);
        var width = options.type === "view" ? Math.min(bounds.width, window.innerWidth) : documentWidth();
        var height = options.type === "view" ? Math.min(bounds.height, window.innerHeight) : documentHeight();
        var renderer = new CanvasRenderer(width, height, imageLoader);
        var parser = new NodeParser(node, renderer, support, imageLoader, options);

        window.console.log(parser);
    });
};

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

function createWindowClone(ownerDocument, width, height) {
    var documentElement = ownerDocument.documentElement.cloneNode(true),
        container = ownerDocument.createElement("iframe");

    container.style.display = "hidden";
    container.style.position = "absolute";
    container.width = width;
    container.height = height;
    container.scrolling = "no"; // ios won't scroll without it
    ownerDocument.body.appendChild(container);

    return new Promise(function(resolve) {
        var loadedTimer = function() {
            /* Chrome doesn't detect relative background-images assigned in style sheets when fetched through getComputedStyle,
            before a certain time has  passed
             */
            if (container.contentWindow.getComputedStyle(div, null)['backgroundImage'] !== "none") {
                documentClone.body.removeChild(div);
                documentClone.body.removeChild(style);
                resolve(container);
            } else {
                window.setTimeout(loadedTimer, 10);
            }
        };
        var documentClone = container.contentWindow.document;
        /* Chrome doesn't detect relative background-images assigned in inline <style> sheets when fetched through getComputedStyle
        if window url is about:blank, we can assign the url to current by writing onto the document
         */
        documentClone.open();
        documentClone.write("");
        documentClone.close();

        documentClone.replaceChild(documentClone.adoptNode(documentElement), documentClone.documentElement);
        container.contentWindow.scrollTo(window.scrollX, window.scrollY);
        var div = documentClone.createElement("div");
        div.className = "html2canvas-ready-test";
        documentClone.body.appendChild(div);
        var style = documentClone.createElement("style");
        style.innerHTML = "body div.html2canvas-ready-test { background-image:url(data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7); }";
        documentClone.body.appendChild(style);
        window.setTimeout(loadedTimer, 1000);
    });
}
