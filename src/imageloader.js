function ImageLoader(options, support) {
    this.link = null;
    this.options = options;
    this.support = support;
    this.origin = window.location.protocol + window.location.host;
}

ImageLoader.prototype.findImages = function(nodes) {
    var images = [];
    nodes.filter(isImage).map(src).forEach(this.addImage(images, this.loadImage), this);
    return images;
};

ImageLoader.prototype.findBackgroundImage = function(images, container) {
    container.parseBackgroundImages().filter(this.isImageBackground).map(this.getBackgroundUrl).forEach(this.addImage(images, this.loadImage), this);
    return images;
};

ImageLoader.prototype.addImage = function(images, callback) {
    return function(newImage) {
        if (!this.imageExists(images, newImage)) {
            images.splice(0, 0, callback.apply(this, arguments));
            log('Added image #' + (images.length), newImage.substring(0, 100));
        }
    };
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

ImageLoader.prototype.imageExists = function(images, src) {
    return images.some(function(image) {
        return image.src === src;
    });
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

ImageLoader.prototype.get = function(src) {
    var found = null;
    return this.images.some(function(img) {
        return (found = img).src === src;
    }) ? found : null;
};

ImageLoader.prototype.fetch = function(nodes) {
    this.images = nodes.reduce(bind(this.findBackgroundImage, this), this.findImages(nodes));
    this.images.forEach(function(image, index) {
        image.promise.then(function() {
            log("Succesfully loaded image #"+ (index+1));
        }, function() {
            log("Failed loading image #"+ (index+1));
        });
    });
    this.ready = Promise.all(this.images.map(this.getPromise));
    log("Finished searching images");
    return this;
};

function isImage(container) {
    return container.node.nodeName === "IMG";
}

function src(container) {
    return container.node.src;
}
