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
        renderViewport: false		
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
    this.ignoreElements = "IFRAME|OBJECT|PARAM";
    
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
}
	
        
        
                                
html2canvas.prototype.init = function(){
     
    var _ = this;
       
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
        
    if (!this.ctx){
        // canvas not initialized, let's kill it here
        this.log('Canvas not available');
        return;
    }
       
    // set common settings for canvas
    this.ctx.textBaseline = "bottom";
        
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
        this.newElement(this.element);		
          
        this.parseElement(this.element);                         
    }            
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
    this.opts.ready(this.canvas);          
}

