function FrameContainer(container, sameOrigin, proxy) {
    this.image = null;
    this.src = container;
    var self = this;
    var bounds = getBounds(container);
    this.promise = (!sameOrigin ? this.proxyLoad(proxy, bounds) : new Promise(function(resolve) {
        if (container.contentWindow.document.URL === "about:blank" || container.contentWindow.document.documentElement == null) {
            container.contentWindow.onload = container.onload = function() {
                resolve(container);
            };
        } else {
            resolve(container);
        }
    })).then(function(container) {
        return html2canvas(container.contentWindow.document.documentElement, {type: 'view', proxy: proxy});
    }).then(function(canvas) {
        return self.image = canvas;
    });
}

FrameContainer.prototype.proxyLoad = function(proxy, bounds) {
    var container = this.src;
    return loadUrlDocument(container.src, proxy, container.ownerDocument, bounds.width, bounds.height);
};
