/*
 * FlashCanvas
 *
 * Copyright (c) 2009      Tim Cameron Ryan
 * Copyright (c) 2009-2011 FlashCanvas Project
 * Released under the MIT/X License
 */

// Reference:
//   http://www.whatwg.org/specs/web-apps/current-work/multipage/the-canvas-element.html
//   http://dev.w3.org/html5/spec/the-canvas-element.html

// If the browser is IE and does not support HTML5 Canvas
if (window["ActiveXObject"] && !window["CanvasRenderingContext2D"]) {

    (function(window, document, undefined) {

        /*
 * Constant
 */

        var NULL                        = null;
        var CANVAS                      = "canvas";
        var CANVAS_RENDERING_CONTEXT_2D = "CanvasRenderingContext2D";
        var CANVAS_GRADIENT             = "CanvasGradient";
        var CANVAS_PATTERN              = "CanvasPattern";
        var FLASH_CANVAS                = "FlashCanvas";
        var G_VML_CANVAS_MANAGER        = "G_vmlCanvasManager";
        var OBJECT_ID_PREFIX            = "external";
        var ON_FOCUS                    = "onfocus";
        var ON_PROPERTY_CHANGE          = "onpropertychange";
        var ON_READY_STATE_CHANGE       = "onreadystatechange";
        var ON_UNLOAD                   = "onunload";

        var config   = window[FLASH_CANVAS + "Options"] || {};
        var BASE_URL = config["swfPath"] || getScriptUrl().replace(/[^\/]+$/, "");
        var SWF_URL  = BASE_URL + "flashcanvas.swf";

        // DOMException code
        var INDEX_SIZE_ERR              =  1;
        var NOT_SUPPORTED_ERR           =  9;
        var INVALID_STATE_ERR           = 11;
        var SYNTAX_ERR                  = 12;
        var TYPE_MISMATCH_ERR           = 17;
        var SECURITY_ERR                = 18;

        /**
 * @constructor
 */
        function Lookup(array) {
            for (var i = 0, n = array.length; i < n; i++)
                this[array[i]] = i;
        }

        var properties = new Lookup([
            // Canvas element
            "toDataURL",

            // CanvasRenderingContext2D
            "save",
            "restore",
            "scale",
            "rotate",
            "translate",
            "transform",
            "setTransform",
            "globalAlpha",
            "globalCompositeOperation",
            "strokeStyle",
            "fillStyle",
            "createLinearGradient",
            "createRadialGradient",
            "createPattern",
            "lineWidth",
            "lineCap",
            "lineJoin",
            "miterLimit",
            "shadowOffsetX",
            "shadowOffsetY",
            "shadowBlur",
            "shadowColor",
            "clearRect",
            "fillRect",
            "strokeRect",
            "beginPath",
            "closePath",
            "moveTo",
            "lineTo",
            "quadraticCurveTo",
            "bezierCurveTo",
            "arcTo",
            "rect",
            "arc",
            "fill",
            "stroke",
            "clip",
            "isPointInPath",
            //  "drawFocusRing",
            "font",
            "textAlign",
            "textBaseline",
            "fillText",
            "strokeText",
            "measureText",
            "drawImage",
            "createImageData",
            "getImageData",
            "putImageData",

            // CanvasGradient
            "addColorStop",

            // Internal use
            "direction",
            "resize"
            ]);

        // Whether swf is ready for use
        var isReady = {};

        // Cache of images loaded by createPattern() or drawImage()
        var images = {};

        // Monitor the number of loading files
        var lock = {};

        // Callback functions passed to loadImage()
        var callbacks = {};

        // Canvas elements
        var canvases = {};

        // SPAN element embedded in the canvas
        var spans = {};

        /**
 * 2D context
 * @constructor
 */
        var CanvasRenderingContext2D = function(canvas, swf) {
            // back-reference to the canvas
            this.canvas = canvas;

            // back-reference to the swf
            this._swf = swf;

            // unique ID of canvas
            this._canvasId = swf.id.slice(8);

            // initialize drawing states
            this._initialize();

            // Count CanvasGradient and CanvasPattern objects
            this._gradientPatternId = 0;

            // Directionality of the canvas element
            this._direction = "";

            // This ensures that font properties of the canvas element is
            // transmitted to Flash.
            this._font = "";

            // frame update interval
            var self = this;
            setInterval(function() {
                if (lock[self._canvasId] === 0) {
                    self._executeCommand();
                }
            }, 30);
        };

        CanvasRenderingContext2D.prototype = {
            /*
     * state
     */

            save: function() {
                // write all properties
                this._setCompositing();
                this._setShadows();
                this._setStrokeStyle();
                this._setFillStyle();
                this._setLineStyles();
                this._setFontStyles();

                // push state
                this._stateStack.push([
                    this._globalAlpha,
                    this._globalCompositeOperation,
                    this._strokeStyle,
                    this._fillStyle,
                    this._lineWidth,
                    this._lineCap,
                    this._lineJoin,
                    this._miterLimit,
                    this._shadowOffsetX,
                    this._shadowOffsetY,
                    this._shadowBlur,
                    this._shadowColor,
                    this._font,
                    this._textAlign,
                    this._textBaseline
                    ]);

                this._queue.push(properties.save);
            },

            restore: function() {
                // pop state
                var stateStack = this._stateStack;
                if (stateStack.length) {
                    var state = stateStack.pop();
                    this.globalAlpha              = state[0];
                    this.globalCompositeOperation = state[1];
                    this.strokeStyle              = state[2];
                    this.fillStyle                = state[3];
                    this.lineWidth                = state[4];
                    this.lineCap                  = state[5];
                    this.lineJoin                 = state[6];
                    this.miterLimit               = state[7];
                    this.shadowOffsetX            = state[8];
                    this.shadowOffsetY            = state[9];
                    this.shadowBlur               = state[10];
                    this.shadowColor              = state[11];
                    this.font                     = state[12];
                    this.textAlign                = state[13];
                    this.textBaseline             = state[14];
                }

                this._queue.push(properties.restore);
            },

            /*
     * transformations
     */

            scale: function(x, y) {
                this._queue.push(properties.scale, x, y);
            },

            rotate: function(angle) {
                this._queue.push(properties.rotate, angle);
            },

            translate: function(x, y) {
                this._queue.push(properties.translate, x, y);
            },

            transform: function(m11, m12, m21, m22, dx, dy) {
                this._queue.push(properties.transform, m11, m12, m21, m22, dx, dy);
            },

            setTransform: function(m11, m12, m21, m22, dx, dy) {
                this._queue.push(properties.setTransform, m11, m12, m21, m22, dx, dy);
            },

            /*
     * compositing
     */

            _setCompositing: function() {
                var queue = this._queue;
                if (this._globalAlpha !== this.globalAlpha) {
                    this._globalAlpha = this.globalAlpha;
                    queue.push(properties.globalAlpha, this._globalAlpha);
                }
                if (this._globalCompositeOperation !== this.globalCompositeOperation) {
                    this._globalCompositeOperation = this.globalCompositeOperation;
                    queue.push(properties.globalCompositeOperation, this._globalCompositeOperation);
                }
            },

            /*
     * colors and styles
     */

            _setStrokeStyle: function() {
                if (this._strokeStyle !== this.strokeStyle) {
                    var style = this._strokeStyle = this.strokeStyle;
                    if (typeof style === "string") {
                    // OK
                    } else if (style instanceof CanvasGradient ||
                        style instanceof CanvasPattern) {
                        style = style.id;
                    } else {
                        return;
                    }
                    this._queue.push(properties.strokeStyle, style);
                }
            },

            _setFillStyle: function() {
                if (this._fillStyle !== this.fillStyle) {
                    var style = this._fillStyle = this.fillStyle;
                    if (typeof style === "string") {
                    // OK
                    } else if (style instanceof CanvasGradient ||
                        style instanceof CanvasPattern) {
                        style = style.id;
                    } else {
                        return;
                    }
                    this._queue.push(properties.fillStyle, style);
                }
            },

            createLinearGradient: function(x0, y0, x1, y1) {
                // If any of the arguments are not finite numbers, throws a
                // NOT_SUPPORTED_ERR exception.
                if (!(isFinite(x0) && isFinite(y0) && isFinite(x1) && isFinite(y1))) {
                    throwException(NOT_SUPPORTED_ERR);
                }

                this._queue.push(properties.createLinearGradient, x0, y0, x1, y1);
                return new CanvasGradient(this);
            },

            createRadialGradient: function(x0, y0, r0, x1, y1, r1) {
                // If any of the arguments are not finite numbers, throws a
                // NOT_SUPPORTED_ERR exception.
                if (!(isFinite(x0) && isFinite(y0) && isFinite(r0) &&
                    isFinite(x1) && isFinite(y1) && isFinite(r1))) {
                    throwException(NOT_SUPPORTED_ERR);
                }

                // If either of the radii are negative, throws an INDEX_SIZE_ERR
                // exception.
                if (r0 < 0 || r1 < 0) {
                    throwException(INDEX_SIZE_ERR);
                }

                this._queue.push(properties.createRadialGradient, x0, y0, r0, x1, y1, r1);
                return new CanvasGradient(this);
            },

            createPattern: function(image, repetition) {
                // If the image is null, the implementation must raise a
                // TYPE_MISMATCH_ERR exception.
                if (!image) {
                    throwException(TYPE_MISMATCH_ERR);
                }

                var tagName = image.tagName, src;
                var canvasId = this._canvasId;

                // If the first argument isn't an img, canvas, or video element,
                // throws a TYPE_MISMATCH_ERR exception.
                if (tagName) {
                    tagName = tagName.toLowerCase();
                    if (tagName === "img") {
                        src = image.getAttribute("src", 2);
                    } else if (tagName === CANVAS || tagName === "video") {
                        // For now, only HTMLImageElement is supported.
                        return;
                    } else {
                        throwException(TYPE_MISMATCH_ERR);
                    }
                }

                // Additionally, we accept any object that has a src property.
                // This is useful when you'd like to specify a long data URI.
                else if (image.src) {
                    src = image.src;
                } else {
                    throwException(TYPE_MISMATCH_ERR);
                }

                // If the second argument isn't one of the allowed values, throws a
                // SYNTAX_ERR exception.
                if (!(repetition === "repeat"   || repetition === "no-repeat" ||
                    repetition === "repeat-x" || repetition === "repeat-y"  ||
                    repetition === ""         || repetition === NULL)) {
                    throwException(SYNTAX_ERR);
                }

                // Special characters in the filename need escaping.
                this._queue.push(properties.createPattern, encodeXML(src), repetition);

                // If this is the first time to access the URL, the canvas should be
                // locked while the image is being loaded asynchronously.
                if (!images[canvasId][src] && isReady[canvasId]) {
                    this._executeCommand();
                    ++lock[canvasId];
                    images[canvasId][src] = true;
                }

                return new CanvasPattern(this);
            },

            /*
     * line caps/joins
     */

            _setLineStyles: function() {
                var queue = this._queue;
                if (this._lineWidth !== this.lineWidth) {
                    this._lineWidth = this.lineWidth;
                    queue.push(properties.lineWidth, this._lineWidth);
                }
                if (this._lineCap !== this.lineCap) {
                    this._lineCap = this.lineCap;
                    queue.push(properties.lineCap, this._lineCap);
                }
                if (this._lineJoin !== this.lineJoin) {
                    this._lineJoin = this.lineJoin;
                    queue.push(properties.lineJoin, this._lineJoin);
                }
                if (this._miterLimit !== this.miterLimit) {
                    this._miterLimit = this.miterLimit;
                    queue.push(properties.miterLimit, this._miterLimit);
                }
            },

            /*
     * shadows
     */

            _setShadows: function() {
                var queue = this._queue;
                if (this._shadowOffsetX !== this.shadowOffsetX) {
                    this._shadowOffsetX = this.shadowOffsetX;
                    queue.push(properties.shadowOffsetX, this._shadowOffsetX);
                }
                if (this._shadowOffsetY !== this.shadowOffsetY) {
                    this._shadowOffsetY = this.shadowOffsetY;
                    queue.push(properties.shadowOffsetY, this._shadowOffsetY);
                }
                if (this._shadowBlur !== this.shadowBlur) {
                    this._shadowBlur = this.shadowBlur;
                    queue.push(properties.shadowBlur, this._shadowBlur);
                }
                if (this._shadowColor !== this.shadowColor) {
                    this._shadowColor = this.shadowColor;
                    queue.push(properties.shadowColor, this._shadowColor);
                }
            },

            /*
     * rects
     */

            clearRect: function(x, y, w, h) {
                this._queue.push(properties.clearRect, x, y, w, h);
            },

            fillRect: function(x, y, w, h) {
                this._setCompositing();
                this._setShadows();
                this._setFillStyle();
                this._queue.push(properties.fillRect, x, y, w, h);
            },

            strokeRect: function(x, y, w, h) {
                this._setCompositing();
                this._setShadows();
                this._setStrokeStyle();
                this._setLineStyles();
                this._queue.push(properties.strokeRect, x, y, w, h);
            },

            /*
     * path API
     */

            beginPath: function() {
                this._queue.push(properties.beginPath);
            },

            closePath: function() {
                this._queue.push(properties.closePath);
            },

            moveTo: function(x, y) {
                this._queue.push(properties.moveTo, x, y);
            },

            lineTo: function(x, y) {
                this._queue.push(properties.lineTo, x, y);
            },

            quadraticCurveTo: function(cpx, cpy, x, y) {
                this._queue.push(properties.quadraticCurveTo, cpx, cpy, x, y);
            },

            bezierCurveTo: function(cp1x, cp1y, cp2x, cp2y, x, y) {
                this._queue.push(properties.bezierCurveTo, cp1x, cp1y, cp2x, cp2y, x, y);
            },

            arcTo: function(x1, y1, x2, y2, radius) {
                // Throws an INDEX_SIZE_ERR exception if the given radius is negative.
                if (radius < 0 && isFinite(radius)) {
                    throwException(INDEX_SIZE_ERR);
                }

                this._queue.push(properties.arcTo, x1, y1, x2, y2, radius);
            },

            rect: function(x, y, w, h) {
                this._queue.push(properties.rect, x, y, w, h);
            },

            arc: function(x, y, radius, startAngle, endAngle, anticlockwise) {
                // Throws an INDEX_SIZE_ERR exception if the given radius is negative.
                if (radius < 0 && isFinite(radius)) {
                    throwException(INDEX_SIZE_ERR);
                }

                this._queue.push(properties.arc, x, y, radius, startAngle, endAngle, anticlockwise ? 1 : 0);
            },

            fill: function() {
                this._setCompositing();
                this._setShadows();
                this._setFillStyle();
                this._queue.push(properties.fill);
            },

            stroke: function() {
                this._setCompositing();
                this._setShadows();
                this._setStrokeStyle();
                this._setLineStyles();
                this._queue.push(properties.stroke);
            },

            clip: function() {
                this._queue.push(properties.clip);
            },

            isPointInPath: function(x, y) {
            // TODO: Implement
            },

            /*
     * text
     */

            _setFontStyles: function() {
                var queue = this._queue;
                if (this._font !== this.font) {
                    try {
                        var span = spans[this._canvasId];
                        span.style.font = this._font = this.font;

                        var style = span.currentStyle;
                        var fontSize = span.offsetHeight;
                        var font = [style.fontStyle, style.fontWeight, fontSize, style.fontFamily].join(" ");
                        queue.push(properties.font, font);
                    } catch(e) {
                    // If this.font cannot be parsed as a CSS font value, then it
                    // must be ignored.
                    }
                }
                if (this._textAlign !== this.textAlign) {
                    this._textAlign = this.textAlign;
                    queue.push(properties.textAlign, this._textAlign);
                }
                if (this._textBaseline !== this.textBaseline) {
                    this._textBaseline = this.textBaseline;
                    queue.push(properties.textBaseline, this._textBaseline);
                }
                if (this._direction !== this.canvas.currentStyle.direction) {
                    this._direction = this.canvas.currentStyle.direction;
                    queue.push(properties.direction, this._direction);
                }
            },

            fillText: function(text, x, y, maxWidth) {
                this._setCompositing();
                this._setFillStyle();
                this._setShadows();
                this._setFontStyles();
                this._queue.push(properties.fillText, encodeXML(text), x, y,
                    maxWidth === undefined ? Infinity : maxWidth);
            },

            strokeText: function(text, x, y, maxWidth) {
                this._setCompositing();
                this._setStrokeStyle();
                this._setShadows();
                this._setFontStyles();
                this._queue.push(properties.strokeText, encodeXML(text), x, y,
                    maxWidth === undefined ? Infinity : maxWidth);
            },

            measureText: function(text) {
                var span = spans[this._canvasId];
                try {
                    span.style.font = this.font;
                } catch(e) {
                // If this.font cannot be parsed as a CSS font value, then it must
                // be ignored.
                }

                // Replace space characters with tab characters because innerText
                // removes trailing white spaces.
                span.innerText = text.replace(/[ \n\f\r]/g, "\t");

                return new TextMetrics(span.offsetWidth);
            },

            /*
     * drawing images
     */

            drawImage: function(image, x1, y1, w1, h1, x2, y2, w2, h2) {
                // If the image is null, the implementation must raise a
                // TYPE_MISMATCH_ERR exception.
               
                if (!image) {
                    throwException(TYPE_MISMATCH_ERR);
                }

                var tagName = image.tagName, src, argc = arguments.length;
                var canvasId = this._canvasId;

                // If the first argument isn't an img, canvas, or video element,
                // throws a TYPE_MISMATCH_ERR exception.
                if (tagName) {
                    tagName = tagName.toLowerCase();
                    if (tagName === "img") {
                        src = image.getAttribute("src", 2);
                    } else if (tagName === CANVAS || tagName === "video") {
                        // For now, only HTMLImageElement is supported.
                        return;
                    } else {
                        throwException(TYPE_MISMATCH_ERR);
                    }
                }

                // Additionally, we accept any object that has a src property.
                // This is useful when you'd like to specify a long data URI.
                else if (image.src) {
                    src = image.src;
                } else {
                    throwException(TYPE_MISMATCH_ERR);
                }

                this._setCompositing();
                this._setShadows();

                // Special characters in the filename need escaping.
                src = encodeXML(src);
                
                if (argc === 3) {
                    this._queue.push(properties.drawImage, argc, src, x1, y1);
                } else if (argc === 5) {
                    this._queue.push(properties.drawImage, argc, src, x1, y1, w1, h1);
                } else if (argc === 9) {
                    // If one of the sw or sh arguments is zero, the implementation
                    // must raise an INDEX_SIZE_ERR exception.
                    if (w1 === 0 || h1 === 0) {
                        throwException(INDEX_SIZE_ERR);
                    }

                    this._queue.push(properties.drawImage, argc, src, x1, y1, w1, h1, x2, y2, w2, h2);
                } else {
                    return;
                }

                // If this is the first time to access the URL, the canvas should be
                // locked while the image is being loaded asynchronously.
                if (!images[canvasId][src] && isReady[canvasId]) {
                    this._executeCommand();
                    ++lock[canvasId];
                    images[canvasId][src] = true;
                }
            },

            /*
     * pixel manipulation
     */

            // ImageData createImageData(in float sw, in float sh);
            // ImageData createImageData(in ImageData imagedata);
            createImageData: function() {
            // TODO: Implement
            },

            // ImageData getImageData(in float sx, in float sy, in float sw, in float sh);
            getImageData: function(sx, sy, sw, sh) {
            // TODO: Implement
            },

            // void putImageData(in ImageData imagedata, in float dx, in float dy, [Optional] in float dirtyX, in float dirtyY, in float dirtyWidth, in float dirtyHeight);
            putImageData: function(imagedata, dx, dy, dirtyX, dirtyY, dirtyWidth, dirtyHeight) {
            // TODO: Implement
            },

            /*
     * extended functions
     */

            loadImage: function(image, onload, onerror) {
                var tagName = image.tagName, src;
                var canvasId = this._canvasId;

                // Get the URL of the image.
                if (tagName) {
                    if (tagName.toLowerCase() === "img") {
                        src = image.getAttribute("src", 2);
                    }
                } else if (image.src) {
                    src = image.src;
                }

                // Do nothing in the following cases:
                //  - The first argument is neither an img element nor an object
                //    with a src property,
                //  - The image has been already cached.
                if (!src || images[canvasId][src]) {
                    return;
                }

                // Store the objects.
                if (onload || onerror) {
                    callbacks[canvasId][src] = [image, onload, onerror];
                }

                // Load the image without drawing.
                this._queue.push(properties.drawImage, 1, encodeXML(src));

                // Execute the command immediately if possible.
                if (isReady[canvasId]) {
                    this._executeCommand();
                    ++lock[canvasId];
                    images[canvasId][src] = true;
                }
            },

            /*
     * private methods
     */

            _initialize: function() {
                // compositing
                this.globalAlpha = this._globalAlpha = 1.0;
                this.globalCompositeOperation = this._globalCompositeOperation = "source-over";

                // colors and styles
                this.strokeStyle = this._strokeStyle = "#000000";
                this.fillStyle   = this._fillStyle   = "#000000";

                // line caps/joins
                this.lineWidth  = this._lineWidth  = 1.0;
                this.lineCap    = this._lineCap    = "butt";
                this.lineJoin   = this._lineJoin   = "miter";
                this.miterLimit = this._miterLimit = 10.0;

                // shadows
                this.shadowOffsetX = this._shadowOffsetX = 0;
                this.shadowOffsetY = this._shadowOffsetY = 0;
                this.shadowBlur    = this._shadowBlur    = 0;
                this.shadowColor   = this._shadowColor   = "rgba(0, 0, 0, 0.0)";

                // text
                this.font         = this._font         = "10px sans-serif";
                this.textAlign    = this._textAlign    = "start";
                this.textBaseline = this._textBaseline = "alphabetic";

                // command queue
                this._queue = [];

                // stack of drawing states
                this._stateStack = [];
            },

            _flush: function() {
                var queue = this._queue;
                this._queue = [];
                return queue;
            },

            _executeCommand: function() {
                // execute commands
                var commands = this._flush();
                if (commands.length > 0) {
                    return eval(this._swf.CallFunction(
                        '<invoke name="executeCommand" returntype="javascript"><arguments><string>'
                        + commands.join("&#0;") + "</string></arguments></invoke>"
                        ));
                }
            },

            _resize: function(width, height) {
                // Flush commands in the queue
                this._executeCommand();

                // Clear back to the initial state
                this._initialize();

                // Adjust the size of Flash to that of the canvas
                if (width > 0) {
                    this._swf.width = width;
                }
                if (height > 0) {
                    this._swf.height = height;
                }

                // Execute a resize command at the start of the next frame
                this._queue.push(properties.resize, width, height);
            }
        };

        /**
 * CanvasGradient stub
 * @constructor
 */
        var CanvasGradient = function(ctx) {
            this._ctx = ctx;
            this.id   = ctx._gradientPatternId++;
        };

        CanvasGradient.prototype = {
            addColorStop: function(offset, color) {
                // Throws an INDEX_SIZE_ERR exception if the offset is out of range.
                if (isNaN(offset) || offset < 0 || offset > 1) {
                    throwException(INDEX_SIZE_ERR);
                }

                this._ctx._queue.push(properties.addColorStop, this.id, offset, color);
            }
        };

        /**
 * CanvasPattern stub
 * @constructor
 */
        var CanvasPattern = function(ctx) {
            this.id = ctx._gradientPatternId++;
        };

        /**
 * TextMetrics stub
 * @constructor
 */
        var TextMetrics = function(width) {
            this.width = width;
        };

        /**
 * DOMException
 * @constructor
 */
        var DOMException = function(code) {
            this.code    = code;
            this.message = DOMExceptionNames[code];
        };

        DOMException.prototype = new Error;

        var DOMExceptionNames = {
            1:  "INDEX_SIZE_ERR",
            9:  "NOT_SUPPORTED_ERR",
            11: "INVALID_STATE_ERR",
            12: "SYNTAX_ERR",
            17: "TYPE_MISMATCH_ERR",
            18: "SECURITY_ERR"
        };

        /*
 * Event handlers
 */

        function onReadyStateChange() {
            if (document.readyState === "complete") {
                document.detachEvent(ON_READY_STATE_CHANGE, onReadyStateChange);

                var canvases = document.getElementsByTagName(CANVAS);
                for (var i = 0, n = canvases.length; i < n; ++i) {
                    FlashCanvas.initElement(canvases[i]);
                }
            }
        }

        function onFocus() {
            // forward the event to the parent
            var swf = event.srcElement, canvas = swf.parentNode;
            swf.blur();
            canvas.focus();
        }

        function onPropertyChange() {
            var prop = event.propertyName;
            if (prop === "width" || prop === "height") {
                var canvas = event.srcElement;
                var value  = canvas[prop];
                var number = parseInt(value, 10);

                if (isNaN(number) || number < 0) {
                    number = (prop === "width") ? 300 : 150;
                }

                if (value === number) {
                    canvas.style[prop] = number + "px";
                    canvas.getContext("2d")._resize(canvas.width, canvas.height);
                } else {
                    canvas[prop] = number;
                }
            }
        }

        function onUnload() {
            window.detachEvent(ON_UNLOAD, onUnload);

            for (var canvasId in canvases) {
                var canvas = canvases[canvasId], swf = canvas.firstChild, prop;

                // clean up the references of swf.executeCommand and swf.resize
                for (prop in swf) {
                    if (typeof swf[prop] === "function") {
                        swf[prop] = NULL;
                    }
                }

                // clean up the references of canvas.getContext and canvas.toDataURL
                for (prop in canvas) {
                    if (typeof canvas[prop] === "function") {
                        canvas[prop] = NULL;
                    }
                }

                // remove event listeners
                swf.detachEvent(ON_FOCUS, onFocus);
                canvas.detachEvent(ON_PROPERTY_CHANGE, onPropertyChange);
            }

            // delete exported symbols
            window[CANVAS_RENDERING_CONTEXT_2D] = NULL;
            window[CANVAS_GRADIENT]             = NULL;
            window[CANVAS_PATTERN]              = NULL;
            window[FLASH_CANVAS]                = NULL;
            window[G_VML_CANVAS_MANAGER]        = NULL;
        }

        /*
 * FlashCanvas API
 */

        var FlashCanvas = {
            initElement: function(canvas) {
                // Check whether the initialization is required or not.
                if (canvas.getContext) {
                    return canvas;
                }

                // initialize lock
                var canvasId        = getUniqueId();
                var objectId        = OBJECT_ID_PREFIX + canvasId;
                isReady[canvasId]   = false;
                images[canvasId]    = {};
                lock[canvasId]      = 1;
                callbacks[canvasId] = {};

                // Set the width and height attributes.
                setCanvasSize(canvas);

                // embed swf and SPAN element
                canvas.innerHTML =
                '<object classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000"' +
                ' codebase="' + location.protocol + '//fpdownload.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=9,0,0,0"' +
                ' width="100%" height="100%" id="' + objectId + '">' +
                '<param name="allowScriptAccess" value="always">' +
                '<param name="flashvars" value="id=' + objectId + '">' +
                '<param name="wmode" value="transparent">' +
                '</object>' +
                '<span style="margin:0;padding:0;border:0;display:inline-block;position:static;height:1em;overflow:visible;white-space:nowrap">' +
                '</span>';

                canvases[canvasId] = canvas;
                var swf            = canvas.firstChild;
                spans[canvasId]    = canvas.lastChild;

                // Check whether the canvas element is in the DOM tree
                var documentContains = document.body.contains;
                if (documentContains(canvas)) {
                    // Load swf file immediately
                    swf["movie"] = SWF_URL;
                } else {
                    // Wait until the element is added to the DOM tree
                    var intervalId = setInterval(function() {
                        if (documentContains(canvas)) {
                            clearInterval(intervalId);
                            swf["movie"] = SWF_URL;
                        }
                    }, 0);
                }

                // If the browser is IE6 or in quirks mode
                if (document.compatMode === "BackCompat" || !window.XMLHttpRequest) {
                    spans[canvasId].style.overflow = "hidden";
                }

                // initialize context
                var ctx = new CanvasRenderingContext2D(canvas, swf);

                // canvas API
                canvas.getContext = function(contextId) {
                    return contextId === "2d" ? ctx : NULL;
                };

                canvas.toDataURL = function(type, quality) {
                    if (("" + type).replace(/[A-Z]+/g, toLowerCase) === "image/jpeg") {
                        ctx._queue.push(properties.toDataURL, type,
                            typeof quality === "number" ? quality : "");
                    } else {
                        ctx._queue.push(properties.toDataURL, type);
                    }
                    return ctx._executeCommand();
                };

                // add event listener
                swf.attachEvent(ON_FOCUS, onFocus);

                return canvas;
            },

            saveImage: function(canvas) {
                var swf = canvas.firstChild;
                swf.saveImage();
            },

            setOptions: function(options) {
            // TODO: Implement
            },

            trigger: function(canvasId, type) {
                var canvas = canvases[canvasId];
                canvas.fireEvent("on" + type);
            },

            unlock: function(canvasId, url, error) {
                var canvas, swf, width, height;
                var _callback, image, callback;

                if (lock[canvasId]) {
                    --lock[canvasId];
                }

                // If Flash becomes ready
                if (url === undefined) {
                    canvas = canvases[canvasId];
                    swf    = canvas.firstChild;

                    // Set the width and height attributes of the canvas element.
                    setCanvasSize(canvas);
                    width  = canvas.width;
                    height = canvas.height;

                    canvas.style.width  = width  + "px";
                    canvas.style.height = height + "px";

                    // Adjust the size of Flash to that of the canvas
                    if (width > 0) {
                        swf.width = width;
                    }
                    if (height > 0) {
                        swf.height = height;
                    }
                    swf.resize(width, height);

                    // Add event listener
                    canvas.attachEvent(ON_PROPERTY_CHANGE, onPropertyChange);

                    // ExternalInterface is now ready for use
                    isReady[canvasId] = true;

                    // Call the onload event handler
                    if (typeof canvas.onload === "function") {
                        setTimeout(function() {
                            canvas.onload();
                        }, 0);
                    }
                }

                // If callback functions were defined
                else if (_callback = callbacks[canvasId][url]) {
                    image    = _callback[0];
                    callback = _callback[1 + error];
                    delete callbacks[canvasId][url];

                    // Call the onload or onerror callback function.
                    if (typeof callback === "function") {
                        callback.call(image);
                    }
                }
            }
        };

        /*
 * Utility methods
 */

        // Get the absolute URL of flashcanvas.js
        function getScriptUrl() {
            var scripts = document.getElementsByTagName("script");
            var script  = scripts[scripts.length - 1];

            // @see http://msdn.microsoft.com/en-us/library/ms536429(VS.85).aspx
            if (document.documentMode >= 8) {
                return script.src;
            } else {
                return script.getAttribute("src", 4);
            }
        }

        // Get a unique ID composed of alphanumeric characters.
        function getUniqueId() {
            return Math.random().toString(36).slice(2) || "0";
        }

        // Escape characters not permitted in XML.
        function encodeXML(str) {
            return ("" + str).replace(/&/g, "&amp;").replace(/</g, "&lt;");
        }

        function toLowerCase(str) {
            return str.toLowerCase();
        }

        function throwException(code) {
            throw new DOMException(code);
        }

        // The width and height attributes of a canvas element must have values that
        // are valid non-negative integers.
        function setCanvasSize(canvas) {
            var width  = parseInt(canvas.width, 10);
            var height = parseInt(canvas.height, 10);

            if (isNaN(width) || width < 0) {
                width = 300;
            }
            if (isNaN(height) || height < 0) {
                height = 150;
            }

            canvas.width  = width;
            canvas.height = height;
        }

        /*
 * initialization
 */

        // IE HTML5 shiv
        document.createElement(CANVAS);

        // setup default CSS
        document.createStyleSheet().cssText =
        CANVAS + "{display:inline-block;overflow:hidden;width:300px;height:150px}";

        // initialize canvas elements
        if (document.readyState === "complete") {
            onReadyStateChange();
        } else {
            document.attachEvent(ON_READY_STATE_CHANGE, onReadyStateChange);
        }

        // prevent IE6 memory leaks
        window.attachEvent(ON_UNLOAD, onUnload);

        // preload SWF file if it's in the same domain
        if (SWF_URL.indexOf(location.protocol + "//" + location.host + "/") === 0) {
            var req = new ActiveXObject("Microsoft.XMLHTTP");
            req.open("GET", SWF_URL, false);
            req.send(NULL);
        }

        /*
 * public API
 */

        window[CANVAS_RENDERING_CONTEXT_2D] = CanvasRenderingContext2D;
        window[CANVAS_GRADIENT]             = CanvasGradient;
        window[CANVAS_PATTERN]              = CanvasPattern;
        window[FLASH_CANVAS]                = FlashCanvas;

        // ExplorerCanvas-compatible APIs for convenience
        window[G_VML_CANVAS_MANAGER] = {
            init:  function(){},
            init_: function(){},
            initElement: FlashCanvas.initElement
        };

        // Prevent Closure Compiler from removing the function.
        keep = [
        CanvasRenderingContext2D.measureText,
        CanvasRenderingContext2D.loadImage
        ];

    })(window, document);

}