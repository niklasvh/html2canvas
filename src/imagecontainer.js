function ImageContainer(src, cors) {
    this.src = src;
    this.image = new Image();
    var image = this.image;
    this.promise = new Promise(function(resolve, reject) {
        image.onload = resolve;
        image.onerror = reject;
        if (cors) {
            image.crossOrigin = "anonymous";
        }
        image.src = src;
    });
}

