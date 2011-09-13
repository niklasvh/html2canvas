html2canvas.canvasContext = function (width, height) {
    this.storage = [];
    this.width = width;
    this.height = height;
    //this.zIndex;
    
    this.fillRect = function(){
        this.storage.push(
        {
            type: "function",
            name: "fillRect",
            'arguments': arguments            
        });
        
    };
    
       
    this.drawImage = function () {     
        this.storage.push(
        {
            type: "function",
            name: "drawImage",
            'arguments': arguments            
        });
    };
    
    
    this.fillText = function () {
        
        this.storage.push(
        {
            type: "function",
            name: "fillText",
            'arguments': arguments            
        });      
    };  
    
    
    this.setVariable = function(variable, value) {
            this.storage.push(
            {
                type: "variable",
                name: variable,
                'arguments': value            
            });
    };
    
    return this;
    
};