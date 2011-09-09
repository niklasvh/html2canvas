/*
 * simple feature detection
 * copied over the relevant parts from jQuery.
 */
html2canvas.support = (function(){
    var support = {}, div = document.createElement( "div" );
    
    // Figure out if the W3C box model works as expected
    div.style.width = div.style.paddingLeft = "1px";

    support.boxModel = div.offsetWidth === 2;
    
    return support;
})();


// Simple logger
html2canvas.prototype.log = function(a){    
    if (this.opts.logging){
        
        this.opts.logger(a);

    }
}   ;                 

html2canvas.prototype.withinBounds = function(src,dst){
    if (!src) {return true;}
    // return true; 
    return (
        (src.left <= dst.left || dst.left+dst.width < src.left) &&
        (src.top <= dst.top || dst.top+dst.height < src.top)
        );
 
    
};


html2canvas.prototype.clipBounds = function(src,dst){
 
    var x = Math.max(src.left,dst.left);
    var y = Math.max(src.top,dst.top);
 
    var x2 = Math.min((src.left+src.width),(dst.left+dst.width));
    var y2 = Math.min((src.top+src.height),(dst.top+dst.height));
 
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
        
    window.scroll(0,0);
        
    if (el.getBoundingClientRect){	
        var clientRect = el.getBoundingClientRect();	
        // need to create new object, as clientrect bounds can't be modified, thanks pufuwozu
        // TODO add scroll position to bounds, so no scrolling of window necessary
        return {
            top: clientRect.top,
            bottom: clientRect.bottom || (clientRect.top + clientRect.height),
            left: clientRect.left,
            width: clientRect.width,
            height: clientRect.height
        };
        
    } else {

        var p = this.offset(el);

        return {               
            left: p.left + this.getCSS(el, "borderLeftWidth", true),
            top: p.top + this.getCSS(el, "borderTopWidth", true),
            width: this.inner('width', el),
            height: this.inner('height', el)
        };

    }
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

/*
 *todo remove this function
html2canvas.prototype.leadingZero = function(num,size){
    
    var s = "000000000" + num;
    return s.substr(s.length-size);    
}    
*/

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
 *todo remove this function

html2canvas.prototype.formatZ = function(zindex,position,parentZ,parentNode){
    
    if (!parentZ){
        parentZ = "0";
    }


    if (position!="static" && parentZ.charAt(0)=="0"){
        this.needReorder = true;
        parentZ = "1"+parentZ.slice(1);        
    }

    if (zindex=="auto"){
        var parentPosition = this.getCSS(parentNode,"position");
        if (parentPosition!="static" && typeof parentPosition != "undefined"){
            zindex = 0;
        }
    else{
            return parentZ;
        }
    }
    
    var b = this.leadingZero(this.numDraws,9);  
    
    
    var s = this.leadingZero(zindex+1,9);

    // var s = "000000000" + num;
    return parentZ+""+""+s+""+b;
    
    
    
}
    */
    
    
    
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

/* 
 * Get inner width/height of element
 */
html2canvas.prototype.inner = function(el, type){
    return el && el.style ?
        parseFloat( jQuery.css( el, type, "padding" ) ) :
        null; // TODO remove jQuery dependency
};

html2canvas.prototype.getDocumentDimension = function(){
    var width, height;

    // gecko/webkit/presto/IE7
    if (window.innerWidth) {
        width = window.innerWidth;
    }

    // gecko/webkit/presto/IE7
    if (window.innerHeight) {
        height = window.innerHeight;
    }

    return [width, height];
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

/*
 * returns position of element in page
 */
html2canvas.prototype.offset = (function(){
    if ("jQuery" in window) {
        return function(elem){
            return jQuery(elem).offset();
        };
    } else if ( "getBoundingClientRect" in document.documentElement ) {
        return function(elem) {
            var box;

            if ( !elem || !elem.ownerDocument ) {
                return null;
            }

            if ( elem === elem.ownerDocument.body ) {
                return jQuery.offset.bodyOffset( elem ); // TODO: remove jQuery dependency
            }

            try {
                box = elem.getBoundingClientRect();
            } catch(e) {}

            var doc = elem.ownerDocument,
            docElem = doc.documentElement;

            // Make sure we're not dealing with a disconnected DOM node
            if ( !box || !this.contains( docElem, elem ) ) {
                return box ? { top: box.top, left: box.left } : { top: 0, left: 0 };
            }

            var body = doc.body,
            win = this.getWindow(doc),
            clientTop  = docElem.clientTop  || body.clientTop  || 0,
            clientLeft = docElem.clientLeft || body.clientLeft || 0,
            scrollTop  = win.pageYOffset || html2canvas.support.boxModel && docElem.scrollTop  || body.scrollTop,
            scrollLeft = win.pageXOffset || html2canvas.support.boxModel && docElem.scrollLeft || body.scrollLeft,
            top  = box.top  + scrollTop  - clientTop,
            left = box.left + scrollLeft - clientLeft;

            return { top: top, left: left };
        };

    } else {
        // TODO: implement for old browsers
        return function() {
            return null;
        };
    }
})();


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
