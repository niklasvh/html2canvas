function Renderer() {}
function NYI() {
    return function() {
        throw new Error("Render function not implemented");
    };
}

Renderer.prototype.renderBackground = function(container, bounds) {
    if (bounds.height > 0 && bounds.width > 0) {
        this.renderBackgroundColor(container, bounds);
        this.renderBackgroundImage(container, bounds);
    }
};

Renderer.prototype.renderBackgroundColor = function(container, bounds) {
    var color = container.css("backgroundColor");
    if (!this.isTransparent(color)) {
        this.rectangle(
            bounds.left,
            bounds.top,
            bounds.width,
            bounds.height,
            container.css("backgroundColor")
        );
    }
};

Renderer.prototype.renderBorders = function(borders) {
    borders.forEach(this.renderBorder, this);
};

Renderer.prototype.renderBorder = function(data) {
    if (!this.isTransparent(data.color) && data.args !== null) {
        this.drawShape(data.args, data.color);
    }
};

Renderer.prototype.renderBackgroundImage = function(container, bounds) {

};

Renderer.prototype.isTransparent = function(color) {
    return (!color || color === "transparent" || color === "rgba(0, 0, 0, 0)");
};

Renderer.prototype.clip = NYI();
Renderer.prototype.rectangle = NYI();
Renderer.prototype.shape = NYI();
