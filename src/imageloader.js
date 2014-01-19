function ImageLoader(nodes, options, support) {
    this.link = null;
    this.options = options;
    this.support = support;
    this.origin = window.location.protocol + window.location.host;
    this.images = nodes.reduce(bind(this.findImages, this), []);
    this.ready = Promise.all(this.images.map(this.getPromise));
}

ImageLoader.prototype.findImages = function(images, container) {
    var backgrounds = container.parseBackgroundImages();
    var backgroundImages = backgrounds.filter(this.isImageBackground).map(this.getBackgroundUrl).filter(this.imageExists(images)).map(this.loadImage, this);
    return images.concat(backgroundImages);
};

ImageLoader.prototype.getBackgroundUrl = function(imageData) {
    return imageData.args[0];
};

ImageLoader.prototype.isImageBackground = function(imageData) {
    return imageData.method === "url";
};

ImageLoader.prototype.loadImage = function(src) {
    if (src.match(/data:image\/.*;base64,/i)) {
        return new ImageContainer(src.replace(/url\(['"]{0,}|['"]{0,}\)$/ig, ''), false);
    } else if (this.isSameOrigin(src) || this.options.allowTaint === true) {
        return new ImageContainer(src, false);
    } else if (this.support.cors && !this.options.allowTaint && this.options.useCORS) {
        return new ImageContainer(src, true);
    } else if (this.options.proxy) {
        return new ProxyImageContainer(src);
    } else {
        return new DummyImageContainer(src);
    }
};

ImageLoader.prototype.imageExists = function(images) {
    return function(newImage) {
        return !images.some(function(image) {
            return image.src !== newImage.src;
        });
    };
};

ImageLoader.prototype.isSameOrigin = function(url) {
    var link = this.link || (this.link = document.createElement("a"));
    link.href = url;
    link.href = link.href; // IE9, LOL! - http://jsfiddle.net/niklasvh/2e48b/
    var origin = link.protocol + link.host;
    return (origin === this.origin);
};

ImageLoader.prototype.getPromise = function(container) {
    return container.promise;
};
