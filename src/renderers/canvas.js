function CanvasRenderer(width, height) {
    Renderer.apply(this, arguments);
    this.canvas = document.createElement("canvas");
    this.canvas.width = width;
    this.canvas.height = height;
    this.ctx = this.canvas.getContext("2d");
    this.ctx.textBaseline = "bottom";
}

CanvasRenderer.prototype = Object.create(Renderer.prototype);

CanvasRenderer.prototype.setFillStyle = function(color) {
    this.ctx.fillStyle = color;
    return this.ctx;
};

CanvasRenderer.prototype.rectangle = function(left, top, width, height, color) {
    this.setFillStyle(color).fillRect(left, top, width, height);
};

CanvasRenderer.prototype.drawShape = function(shape, color) {
    this.shape(shape);
    this.setFillStyle(color).fill();
};

CanvasRenderer.prototype.clip = function(shape, callback, context) {
    this.ctx.save();
    this.shape(shape).clip();
    callback.call(context);
    this.ctx.restore();
};

CanvasRenderer.prototype.shape = function(shape) {
    this.ctx.beginPath();
    shape.forEach(function(point, index) {
        this.ctx[(index === 0) ? "moveTo" : point[0] + "To" ].apply(this.ctx, point.slice(1));
    }, this);
    this.ctx.closePath();
    return this.ctx;
};

CanvasRenderer.prototype.font = function(color, style, variant, weight, size, family) {
    this.setFillStyle(color).font = [style, variant, weight, size, family].join(" ");
};

CanvasRenderer.prototype.setOpacity = function(opacity) {
    this.ctx.globalAlpha = opacity;
};

CanvasRenderer.prototype.text = function(text, left, bottom) {
    this.ctx.fillText(text, left, bottom);
};

CanvasRenderer.prototype.backgroundRepeatShape = function(imageContainer, backgroundPosition, bounds, left, top, width, height) {
    var shape = [
        ["line", Math.round(left), Math.round(top)],
        ["line", Math.round(left + width), Math.round(top)],
        ["line", Math.round(left + width), Math.round(height + top)],
        ["line", Math.round(left), Math.round(height + top)]
    ];
    console.log(shape);
    this.clip(shape, function() {
        this.renderBackgroundRepeat(imageContainer, backgroundPosition, bounds);
    }, this);
};

CanvasRenderer.prototype.renderBackgroundRepeat = function(imageContainer, backgroundPosition, bounds) {
    var offsetX = Math.round(bounds.left + backgroundPosition.left), offsetY = Math.round(bounds.top + backgroundPosition.top);
    this.setFillStyle(this.ctx.createPattern(imageContainer.image, "repeat"));
    this.ctx.translate(offsetX, offsetY);
    this.ctx.fill();
    this.ctx.translate(-offsetX, -offsetY);
};
