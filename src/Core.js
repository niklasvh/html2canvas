/**
 * Creates a render of the element el
 * @constructor
 */

function html2canvas(el, userOptions) {

    var options = userOptions || {};
  
    
    this.opts = this.extendObj(options, {          
        logging: false,
        ready: function (stack) {
            document.body.appendChild(stack.canvas);
        },
        storageReady: function(obj){
            obj.Renderer(obj.contextStacks);
        },
        iframeDefault: "default",
        flashCanvasPath: "http://html2canvas.hertzen.com/external/flashcanvas/flashcanvas.js",
        renderViewport: false,
        reorderZ: true,
        throttle:true,
        letterRendering:false,
        proxyUrl: null,
        logger: function(a){
            if (window.console && window.console.log){
                window.console.log(a);     
            }else{
                alert(a);
            }
        },
        canvasWidth:0,
        canvasHeight:0,
        useOverflow: true,
        renderOrder: "canvas flash html"
    });

    this.element = el;
    
    var imageLoaded,
    canvas,
    ctx,
    bgx,
    bgy,
    image;
    this.imagesLoaded = 0;
    this.images = [];
    this.fontData = [];
    this.numDraws = 0;
    this.contextStacks = [];
    this.ignoreElements = "IFRAME|OBJECT|PARAM";
    this.needReorder = false;
    this.blockElements = new RegExp("(BR|PARAM)");
    this.pageOrigin = window.location.protocol + window.location.host;
    this.queue = [];

    this.ignoreRe = new RegExp("("+this.ignoreElements+")");
    
    
    this.support = {
        rangeBounds: false
        
    };
    
    // Test whether we can use ranges to measure bounding boxes
    // Opera doesn't provide valid bounds.height/bottom even though it supports the method.

    
    if (document.createRange){
        var r = document.createRange();
        //this.support.rangeBounds = new Boolean(r.getBoundingClientRect);
        if (r.getBoundingClientRect){
            var testElement = document.createElement('boundtest');
            testElement.style.height = "123px";
            testElement.style.display = "block";
            document.getElementsByTagName('body')[0].appendChild(testElement);
            
            r.selectNode(testElement);
            var rangeBounds = r.getBoundingClientRect();
            var rangeHeight = rangeBounds.height;

            if (rangeHeight==123){
                this.support.rangeBounds = true;
            }
            document.getElementsByTagName('body')[0].removeChild(testElement);

            
        }
        
    }
  
   
    
    // Start script
    this.init();
    
    return this;
}
	
        
        
                                
html2canvas.prototype.init = function(){
     
    var _ = this;
    /*
    this.ctx = new this.stackingContext($(document).width(),$(document).height());    
              
    if (!this.ctx){
        // canvas not initialized, let's kill it here
        this.log('Canvas not available');
        return;
    }
       
    this.canvas = this.ctx.canvas;
        */
    this.log('Finding background-images');
        
    this.images.push('start');
    
    this.getImages(this.element);
            
    this.log('Finding images');
    // console.log(this.element.ownerDocument);
   
    
   
    this.each(this.element.ownerDocument.images,function(i,e){
        _.preloadImage(_.getAttr(e,'src'));
    });
    this.images.splice(0,1);  
    //  console.log(this.images);   
    if (this.images.length === 0){
        this.start();
    }  
        
        
};

/*
 * Check whether all assets have been loaded and start traversing the DOM
 */
 
html2canvas.prototype.start = function(){
    //     console.log(this.images);
    var _ = this, documentDimension, rootStack, stack;
    if (_.images.length === 0 || _.imagesLoaded == _.images.length/2){    

        _.log('Finished loading '+_.imagesLoaded+' images, Started parsing');
        _.bodyOverflow = document.getElementsByTagName('body')[0].style.overflow;
        documentDimension = _.getDocumentDimension();
        document.getElementsByTagName('body')[0].style.overflow = "hidden";
        rootStack = new _.storageContext(documentDimension[0], documentDimension[1]);
        rootStack.opacity = _.getCSS(_.element, "opacity");
        stack = _.newElement(_.element, rootStack);

        _.parseElement(_.element, stack);
    }
        
};


html2canvas.prototype.stackingContext = function(width,height){
    this.canvas = document.createElement('canvas');
        

    this.canvas.width = width;
    this.canvas.height = width;
    
    if (!this.canvas.getContext){
           
    // TODO include Flashcanvas
    /*
        var script = document.createElement('script');
        script.type = "text/javascript";
        script.src = this.opts.flashCanvasPath;
        var s = document.getElementsByTagName('script')[0]; 
        s.parentNode.insertBefore(script, s);

        if (typeof FlashCanvas != "undefined") {
                
            FlashCanvas.initElement(this.canvas);
            this.ctx = this.canvas.getContext('2d');
        }	*/
            
    }else{
        this.ctx = this.canvas.getContext('2d');
    }    
    
    // set common settings for canvas
    this.ctx.textBaseline = "bottom";
    
    return this.ctx;
          
};

html2canvas.prototype.storageContext = function(width,height){
    this.storage = [];
    this.width = width;
    this.height = height;
    //this.zIndex;
    
    // todo simplify this whole section
    this.fillRect = function(x, y, w, h){
        this.storage.push(
        {
            type: "function",
            name:"fillRect",
            arguments:[x,y,w,h]            
        });
        
    };
    

        
    this.drawImage = function(image,sx,sy,sw,sh,dx,dy,dw,dh){     
        this.storage.push(
        {
            type: "function",
            name:"drawImage",
            arguments:[image,sx,sy,sw,sh,dx,dy,dw,dh]            
        });
    };
    
    this.fillText = function(currentText,x,y){
        
        this.storage.push(
        {
            type: "function",
            name:"fillText",
            arguments:[currentText,x,y]            
        });      
    }; 
    
    return this;
    
};


/*
* Finished rendering, send callback
*/ 

html2canvas.prototype.finish = function(){
    
    this.log("Finished rendering");
    
    document.getElementsByTagName('body')[0].style.overflow = this.bodyOverflow;
    /*
    if (this.opts.renderViewport){
        // let's crop it to viewport only then
        var newCanvas = document.createElement('canvas');
        var newctx = newCanvas.getContext('2d');
        newCanvas.width = window.innerWidth;
        newCanvas.height = window.innerHeight;
            
    }*/
    this.opts.ready(this);          
};

