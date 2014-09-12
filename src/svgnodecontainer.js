function SVGNodeContainer(node) {
    this.src = node;
    this.image = null;
    var self = this;

    this.promise = this.hasFabric().then(function() {
        return new Promise(function(resolve) {
            html2canvas.fabric.parseSVGDocument(node, self.createCanvas.call(self, resolve));
        });
    });
}

SVGNodeContainer.prototype = Object.create(SVGContainer.prototype);
