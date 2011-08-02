
// Simple logger
html2canvas.prototype.log = function(a){    
    if (this.opts.logging){
        
        this.opts.logger(a);

    }
}                    

html2canvas.prototype.withinBounds = function(src,dst){
    if (!src) return true;
    // return true; 
    return (
        (src.left <= dst.left || dst.left+dst.width < src.left) &&
        (src.top <= dst.top || dst.top+dst.height < src.top)
        );
 
    
}


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
 
}


/**
 * Function to provide bounds for element
 * @return {Bounds} object with position and dimension information
 */
html2canvas.prototype.getBounds = function(el){
        
    window.scroll(0,0);
        
    if (el.getBoundingClientRect){	
        var clientRect = el.getBoundingClientRect();	
        var bounds = {};
        // need to create new object, as clientrect bounds can't be modified, thanks pufuwozu
        // TODO add scroll position to bounds, so no scrolling of window necessary
        bounds.top = clientRect.top;
        bounds.left = clientRect.left;
        bounds.width = clientRect.width;
        bounds.height = clientRect.height;
        
        
        
        return bounds;
    }else{
            
        // TODO remove jQuery dependancy
        var p = $(el).offset();       
          
        return {               
            left: p.left + this.getCSS(el,"border-left-width",true),
            top: p.top + this.getCSS(el,"border-top-width",true),
            width:$(el).innerWidth(),
            height:$(el).innerHeight()                
        }

    }           
}
    
     
     
/*
 * Function for looping through array
 */
html2canvas.prototype.each = function(arrayLoop,callbackFunc){
    callbackFunc = callbackFunc || function(){};
    for (var i=0;i<arrayLoop.length;i++){       
        if (callbackFunc(i,arrayLoop[i]) === false) return;
    }
}


/*
 * Function to get childNodes of an element in the order they should be rendered (based on z-index)
 * reference http://www.w3.org/TR/CSS21/zindex.html
 */

html2canvas.prototype.contentsInZ = function(el){
    
    // TODO remove jQuery dependency
    
    var contents = $(el).contents();
    
    return contents;
 
}

    
/*
 * Function for fetching the element attribute
 */  
html2canvas.prototype.getAttr = function(el,attribute){
    return el.getAttribute(attribute);
//return $(el).attr(attribute);
}

/*
 * Function to extend object
 */
html2canvas.prototype.extendObj = function(options,defaults){
    for (var key in options){              
        defaults[key] = options[key];
    }
    return defaults;           
}

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
    }
    
}

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
    
}

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
    
   
    
    stackValues.sort(function(a,b){return a - b});
    
    this.each(stackValues, function(i,zValue){
          for (var s = 0;s<=subStacks.length;s++){
              if (subStacks[s].zindex == zValue){
                  var stackChild = subStacks.splice(s,1);
                  _.sortZ(stackChild[0]);
                  break;
                  
              }
          }

    });
 
    
}

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
}

    
/*
 * Function for fetching the css attribute
 * TODO remove jQuery dependancy
 */
html2canvas.prototype.getCSS = function(el,attribute,intOnly){
    if (intOnly){
        return parseInt($(el).css(attribute),10); 
    }else{
        return $(el).css(attribute);
    }
}


html2canvas.prototype.getIndex = function(array,src){
    
    if (array.indexOf){
        return array.indexOf(src);
    }else{
        for(var i = 0; i < array.length; i++){
            if(this[i] == src) return i;
        }
        return -1;
    }
    
}


html2canvas.prototype.isSameOrigin = function(url){
    var link = document.createElement("a");
    link.href = url;

    return ((link.protocol + link.host) == this.pageOrigin);
}
