function FrameContainer(container) {
    this.image = null;
    this.src = container;
    var self = this;
    var bounds = getBounds(container);
    this.promise = new Promise(function(resolve) {
        if (container.contentWindow.document.URL === "about:blank" || container.contentWindow.document.documentElement == null) {
            container.contentWindow.onload = container.onload = function() {
                resolve(container);
            };
        } else {
            resolve(container);
        }

    }).then(function(container) {
        return html2canvas(container.contentWindow.document.documentElement, {
            width: bounds.width,
            height: bounds.height
        });
    }).then(function(canvas) {
        return self.image = canvas;
    });
}
