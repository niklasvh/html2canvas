/**
 * Creates a render of the element el
 * @constructor
 */

function html2canvas(el, userOptions) {

    var options = userOptions || {};
  
    
    this.opts = this.extendObj(options, {          
        logging: false,
        ready: function (canvas) {
            document.body.appendChild(canvas);
        },
        iframeDefault: "default",
        flashCanvasPath: "http://html2canvas.hertzen.com/external/flashcanvas/flashcanvas.js",
        renderViewport: false,
        reorderZ: true
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
    
    this.ignoreRe = new RegExp("("+this.ignoreElements+")");
    
    // test how to measure text bounding boxes
    this.useRangeBounds = false;
    
    // Check disabled as Opera doesn't provide bounds.height/bottom even though it supports the method.
    // TODO take the check back into use, but fix the issue for Opera
    /*
    if (document.createRange){
        var r = document.createRange();
        this.useRangeBounds = new Boolean(r.getBoundingClientRect);
    }*/
  
    // Start script
    this.init();
    
    return this;
}
	
        
        
                                
html2canvas.prototype.init = function(){
     
    var _ = this;
       
    this.ctx = new this.stackingContext($(document).width(),$(document).height());    
              
    if (!this.ctx){
        // canvas not initialized, let's kill it here
        this.log('Canvas not available');
        return;
    }
       
    this.canvas = this.ctx.canvas;
        
    this.log('Finding background images');
        
    this.getImages(this.element);
            
    this.log('Finding images');
    this.each(document.images,function(i,e){
        _.preloadImage(_.getAttr(e,'src'));
    });
      
        
    if (this.images.length == 0){
        this.start();
    }  
        
        
}

/*
 * Check whether all assets have been loaded and start traversing the DOM
 */
 
html2canvas.prototype.start = function(){
          
    if (this.images.length == 0 || this.imagesLoaded==this.images.length/2){    
        this.log('Started parsing');
        this.bodyOverflow = document.getElementsByTagName('body')[0].style.overflow;
        document.getElementsByTagName('body')[0].style.overflow = "hidden";
       
        var ctx = this.newElement(this.element, this.ctx) || this.ctx;		
          
        this.parseElement(this.element,ctx);      
     
    }            
}


html2canvas.prototype.stackingContext = function(width,height){
    this.canvas = document.createElement('canvas');
        
    // TODO remove jQuery dependency
    this.canvas.width = $(document).width();
    this.canvas.height = $(document).height();
    
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
          
}

html2canvas.prototype.storageContext = function(width,height){
    this.storage = [];

    
    
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
    }  
    
    return this;
    
}


/*
* Finished rendering, send callback
*/ 

html2canvas.prototype.finish = function(){
    this.log("Finished rendering");
    document.getElementsByTagName('body')[0].style.overflow = this.bodyOverflow;
    
    if (this.opts.renderViewport){
        // let's crop it to viewport only then
        var newCanvas = document.createElement('canvas');
        var newctx = newCanvas.getContext('2d');
        newCanvas.width = window.innerWidth;
        newCanvas.height = window.innerHeight;
            
    }
    this.opts.ready(this);          
}

