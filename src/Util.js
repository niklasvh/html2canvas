// Simple logger
html2canvas.prototype.log = function(a){    
    if (this.opts.logging){
        this.opts.logger(a);
    }
};                 

html2canvas.prototype.withinBounds = function(src,dst){
    if (!src) {return true;}
    // return true; 
    return (
        (src.left <= dst.left || dst.left+dst.width < src.left) &&
        (src.top <= dst.top || dst.top+dst.height < src.top)
    );
};

html2canvas.prototype.clipBounds = function(src,dst){
    var x = Math.max(src.left,dst.left),
        y = Math.max(src.top,dst.top),
        x2 = Math.min((src.left+src.width),(dst.left+dst.width)),
        y2 = Math.min((src.top+src.height),(dst.top+dst.height));
 
    return {
        left:x,
        top:y,
        width:x2-x,
        height:y2-y
    };
};


/**
 * Function to provide bounds for element
 * @return {Object} Bounds object with position and dimension information
 */
html2canvas.prototype.getBounds = function(el){
    return this.offset(el);
};

/*
 * Function for looping through array
 */
html2canvas.prototype.each = function(arrayLoop,callbackFunc){
    callbackFunc = callbackFunc || function(){};
    for (var i=0;i<arrayLoop.length;i++){       
        if (callbackFunc(i,arrayLoop[i]) === false) {return;}
    }
};

/*
 * Function to get childNodes of an element in the order they should be rendered (based on z-index)
 * reference http://www.w3.org/TR/CSS21/zindex.html
 */
html2canvas.prototype.contentsInZ = function(el){
    
    var contents = el.childNodes;
    
    return contents;
 
};

/*
 * Function for fetching the element attribute
 */  
html2canvas.prototype.getAttr = function(el,attribute){
    return el.getAttribute(attribute);
//return $(el).attr(attribute);
};

/*
 * Function to extend object
 */
html2canvas.prototype.extendObj = function(options,defaults){
    for (var key in options){              
        defaults[key] = options[key];
    }
    return defaults;           
};

html2canvas.prototype.zContext = function(zindex){
    return {
        zindex: zindex,
        children: []
    };
    
};

html2canvas.prototype.setZ = function(zindex,position,parentZ,parentNode){
    // TODO fix static elements overlapping relative/absolute elements under same stack, if they are defined after them
    if (!parentZ){
        this.zStack = new this.zContext(0);
        return this.zStack;
    }
    
    if (zindex!="auto"){
        this.needReorder = true;
        var newContext = new this.zContext(zindex);
        parentZ.children.push(newContext);
        
        return newContext;
        
    }else {
        return parentZ;
    }
    
};

html2canvas.prototype.sortZ = function(zStack){
    var subStacks = [];
    var stackValues = [];
    var _ = this;

    this.each(zStack.children, function(i,stackChild){
        if (stackChild.children && stackChild.children.length > 0){
            subStacks.push(stackChild);
            stackValues.push(stackChild.zindex);
        }else{         
          

                _.queue.push(stackChild);

        }
        
    });

    stackValues.sort(function(a,b){
        return a - b;
    });
    
    this.each(stackValues, function(i,zValue){
        for (var s = 0;s<=subStacks.length;s++){
            if (subStacks[s].zindex == zValue){
                var stackChild = subStacks.splice(s,1);
                _.sortZ(stackChild[0]);
                break;
                  
            }
        }

    });
};

    
/*
 * Get element childNodes
 */
html2canvas.prototype.getContents = function(el){
    return (el.nodeName ==  "iframe" ) ?
      el.contentDocument || el.contentWindow.document :
      el.childNodes;
};

    
/*
 * Function for fetching the css attribute
 * The attribute parameter _must_ be in camelCase, not in the css style with dashes.
 */
html2canvas.prototype.getCSS = (function(){
    return function(el,attribute,intOnly){
        var val;
        if (el.currentStyle) {
            val = el.currentStyle[attribute];
        } else if (window.getComputedStyle) {
            val = document.defaultView.getComputedStyle(el,null)[attribute];
        }
        if (intOnly){
            val = parseInt(val, 10); 
        }
        return val;
    };
})();

/*
 * Function for fetching the css attribute
 */
html2canvas.prototype.setCSS = function(el, attribute, value){
    el.style[attribute] = value;
};

html2canvas.prototype.getDocumentDimension = function(){
    // gecko/webkit/presto/IE7
    return [window.innerWidth, window.innerHeight];
}

/*
 * checks if element a contains element b
 */
html2canvas.prototype.contains = (function(){
  if ( document.documentElement.contains ) {
      return function( a, b ) {
          return a !== b && (a.contains ? a.contains(b) : true);
      };
  } else if ( document.documentElement.compareDocumentPosition ) {
      return function( a, b ) {
          return !!(a.compareDocumentPosition(b) & 16);
      };
  } else {
      return function() {
          return false;
      };
  }
})();


/*
 * gets the corresponding window element for the dom node
 */
html2canvas.prototype.getWindow = function( elem ) {
    return (elem && typeof elem === "object" && "setInterval" in elem)/* jQuery's isWindow */ ?
        elem :
        elem.nodeType === 9 ?
        elem.defaultView || elem.parentWindow :
        false;
};

/**
 * Returns element left offset
*/
html2canvas.prototype.getX = function(el) {
    if (el.offsetWidth === 0) { // IE
        return parseInt(el.style.left);
    }
    var el = args && args.nodeType ? args : el;
    // if the given element has a parent node
    if (el.offsetParent) {
        return el.offsetLeft + this.getX(el.offsetParent);
    }
    return !el.offsetLeft && el.style.left > 0 ? el.style.left : el.offsetLeft;
};

/**
 * Returns element top offset
*/
html2canvas.prototype.getY = function(el) {
    if (el.offsetWidth === 0) { // IE
        return parseInt(el.style.top);
    }
    var _el = args && args.nodeType ? args : el;
    // if the given element has a parent node
    if (_el.offsetParent) {
        return _el.offsetTop + this.getY(_el.offsetParent);
    }
    return !_el.offsetTop && el.style.top > 0 ? el.style.top : _el.offsetTop;
};

/**
 * Returns scroll width
*/
html2canvas.prototype.getScrollWidth = function() {
    // gecko/webkit/presto/IE7
    if (window.pageXOffset) {
        return window.pageXOffset;
    }
    // IE6- standards mode
    if (document.documentElement.scrollLeft) {
        return document.documentElement.scrollLeft;
    }
    // IE6- quirks mode
    if (document.body.scrollLeft) {
        return document.body.scrollLeft;
    }
    return 0;
};

/**
 * Returns scroll height
*/
html2canvas.prototype.getScrollHeight = function() {
    // gecko/webkit/presto/IE7
    if (window.pageYOffset) {
        return window.pageYOffset;
    }
    // IE6- standards mode
    if (document.documentElement.scrollTop) {
        return document.documentElement.scrollTop;
    }
    // IE6- quirks mode
    if (document.body.scrollTop) {
        return document.body.scrollTop;
    }
    return 0;
};

/*
 * returns position of element in page
 */
html2canvas.prototype.offset = function(elem){
    if (typeof elem.getBoundingClientRect === "undefined") {
        var _x = this.getX(), _y = this.getY();
        _offset = {
            top    : _y,
            right  : Math.abs(_x + this.getWidth()),
            bottom : Math.abs(_y + this.getHeight()),
            left   : _x
        };
    } else {
        _offset = el.getBoundingClientRect();
        var _scrollHeight = this.getScrollHeight(),
            _scrollWidth  = this.getScrollWidth();

        if(/*@cc_on!@*/false) {
            if (typeof XDomainRequest !== "function") {
                _scrollWidth -= 2;
                _scrollHeight -= 2;
            }
        }
        // getBoundingClientRect properties are read-only
        _offset = {
            top : _offset.top + _scrollHeight,
            right : _offset.right + _scrollWidth,
            bottom : _offset.bottom + _scrollHeight,
            left : _offset.left + _scrollWidth
        };
        // extended getBoundingClientRect (FF 3.5)
        if ('width' in _offset) {
            return _offset;
        }
    }

    _offset.width  = Math.abs(_offset.left - _offset.right);
    _offset.height = Math.abs(_offset.top - _offset.bottom);
    return _offset;
};

html2canvas.prototype.getIndex = (function(){
    var indexOf = Array.prototype.indexOf;
    if (indexOf){
        return function(array, src){ return indexOf.call(array, src); };
    } else {
        return function(array, src){
            for(var i = 0; i < array.length; i+=1){
                if(array[i] == src) {return i;}
            }
            return -1;
        };
    }
})();

html2canvas.prototype.getLinkElement = function(url) {
    var _ = this;
    if (!_.tempA) {
        _.tempA = document.createElement("a");
    }
    _.tempA.href = url;
    return _.tempA;
};

html2canvas.prototype.isSameOrigin = function(url){
    var link = this.getLinkElement(url);
    return ((link.protocol + link.host) == this.pageOrigin);
};