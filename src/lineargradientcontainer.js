var GradientContainer = require('./gradientcontainer');
var Color = require('./color');

function LinearGradientContainer(imageData) {
    GradientContainer.apply(this, arguments);
    this.type = GradientContainer.TYPES.LINEAR;

    var hasDirection = LinearGradientContainer.REGEXP_DIRECTION.test( imageData.args[0] ) ||
        !GradientContainer.REGEXP_COLORSTOP.test( imageData.args[0] );

    if (imageData.args[0].indexOf('deg') != -1) {
              var rad = parseFloat(imageData.args[0].substr(0, imageData.args[0].length - 3)) * (Math.PI / 180);
              //Finds y start and scales it between 0 and 1
              this.y0 = (Math.cos(rad) + 1) / 2;
              //Flips y1
              this.y1 = 1 - this.y0;
              //Same as for y0 but flip axis to match with css gradient
              this.x0 = (-Math.sin(rad) + 1) / 2;
              this.x1 = 1 - this.x0;
        }else{
            if (hasDirection) {
                imageData.args[0].split(" ").reverse().forEach(function(position) {
                    switch(position) {
                    case "left":
                        this.x0 = 0;
                        this.x1 = 1;
                        break;
                    case "top":
                        this.y0 = 0;
                        this.y1 = 1;
                        break;
                    case "right":
                        this.x0 = 1;
                        this.x1 = 0;
                        break;
                    case "bottom":
                        this.y0 = 1;
                        this.y1 = 0;
                        break;
                    case "to":
                        var y0 = this.y0;
                        var x0 = this.x0;
                        this.y0 = this.y1;
                        this.x0 = this.x1;
                        this.x1 = x0;
                        this.y1 = y0;
                        break;
                    }
                }, this);
            } else {
                this.y0 = 0;
                this.y1 = 1;
            }
        }

    this.colorStops = imageData.args.slice(hasDirection ? 1 : 0).map(function(colorStop) {
        var colorStopMatch = colorStop.match(GradientContainer.REGEXP_COLORSTOP);
        var value = +colorStopMatch[2];
        var unit = value === 0 ? "%" : colorStopMatch[3]; // treat "0" as "0%"
        return {
            color: new Color(colorStopMatch[1]),
            // TODO: support absolute stop positions (e.g., compute gradient line length & convert px to ratio)
            stop: unit === "%" ? value / 100 : null
        };
    });

    if (this.colorStops[0].stop === null) {
        this.colorStops[0].stop = 0;
    }

    if (this.colorStops[this.colorStops.length - 1].stop === null) {
        this.colorStops[this.colorStops.length - 1].stop = 1;
    }

    // calculates and fills-in explicit stop positions when omitted from rule
    this.colorStops.forEach(function(colorStop, index) {
        if (colorStop.stop === null) {
            this.colorStops.slice(index).some(function(find, count) {
                if (find.stop !== null) {
                    colorStop.stop = ((find.stop - this.colorStops[index - 1].stop) / (count + 1)) + this.colorStops[index - 1].stop;
                    return true;
                } else {
                    return false;
                }
            }, this);
        }
    }, this);
}

LinearGradientContainer.prototype = Object.create(GradientContainer.prototype);

// TODO: support <angle> (e.g. -?\d{1,3}(?:\.\d+)deg, etc. : https://developer.mozilla.org/docs/Web/CSS/angle )
LinearGradientContainer.REGEXP_DIRECTION = /^\s*(?:to|left|right|top|bottom|center|\d{1,3}(?:\.\d+)?%?)(?:\s|$)/i;

module.exports = LinearGradientContainer;
