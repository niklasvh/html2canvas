function NodeContainer(node, parent) {
    this.node = node;
    this.parent = parent;
    this.stack = null;
    this.bounds = null;
    this.visible = null;
    this.computedStyles = null;
    this.styles = {};
    this.backgroundImages = null;
}

NodeContainer.prototype.assignStack = function(stack) {
    this.stack = stack;
    stack.children.push(this);
};

NodeContainer.prototype.isElementVisible = function() {
    return this.node.nodeType === Node.TEXT_NODE ? this.parent.visible : (this.css('display') !== "none" && this.css('visibility') !== "hidden" && !this.node.hasAttribute("data-html2canvas-ignore"));
};

NodeContainer.prototype.css = function(attribute) {
    if (!this.computedStyles) {
        this.computedStyles = this.node.ownerDocument.defaultView.getComputedStyle(this.node, null);
    }

    return this.styles[attribute] || (this.styles[attribute] = this.computedStyles[attribute]);
};

NodeContainer.prototype.cssInt = function(attribute) {
    var value = parseInt(this.css(attribute), 10);
    return (Number.isNaN(value)) ? 0 : value; // borders in old IE are throwing 'medium' for demo.html
};

NodeContainer.prototype.cssFloat = function(attribute) {
    var value = parseFloat(this.css(attribute));
    return (Number.isNaN(value)) ? 0 : value;
};

NodeContainer.prototype.fontWeight = function() {
    var weight = this.css("fontWeight");
    switch(parseInt(weight, 10)){
        case 401:
            weight = "bold";
            break;
        case 400:
            weight = "normal";
            break;
    }
    return weight;
};

NodeContainer.prototype.parseBackgroundImages = function() {
    var whitespace = ' \r\n\t',
        method, definition, prefix, prefix_i, block, results = [],
        mode = 0, numParen = 0, quote, args;
    var appendResult = function() {
        if(method) {
            if (definition.substr(0, 1) === '"') {
                definition = definition.substr(1, definition.length - 2);
            }
            if (definition) {
                args.push(definition);
            }
            if (method.substr(0, 1) === '-' && (prefix_i = method.indexOf('-', 1 ) + 1) > 0) {
                prefix = method.substr(0, prefix_i);
                method = method.substr(prefix_i);
            }
            results.push({
                prefix: prefix,
                method: method.toLowerCase(),
                value: block,
                args: args,
                image: null
            });
        }
        args = [];
        method = prefix = definition = block = '';
    };
    args = [];
    method = prefix = definition = block = '';
    this.css("backgroundImage").split("").forEach(function(c) {
        if (mode === 0 && whitespace.indexOf(c) > -1) {
            return;
        }
        switch(c) {
            case '"':
                if(!quote) {
                    quote = c;
                }
                else if(quote === c) {
                    quote = null;
                }
                break;
            case '(':
                if(quote) {
                    break;
                } else if(mode === 0) {
                    mode = 1;
                    block += c;
                    return;
                } else {
                    numParen++;
                }
                break;
            case ')':
                if (quote) {
                    break;
                } else if(mode === 1) {
                    if(numParen === 0) {
                        mode = 0;
                        block += c;
                        appendResult();
                        return;
                    } else {
                        numParen--;
                    }
                }
                break;

            case ',':
                if (quote) {
                    break;
                } else if(mode === 0) {
                    appendResult();
                    return;
                } else if (mode === 1) {
                    if (numParen === 0 && !method.match(/^url$/i)) {
                        args.push(definition);
                        definition = '';
                        block += c;
                        return;
                    }
                }
                break;
        }

        block += c;
        if (mode === 0) {
            method += c;
        } else {
            definition += c;
        }
    });

    appendResult();

    return this.backgroundImages || (this.backgroundImages = results);
};
