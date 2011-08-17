html2canvas.prototype.drawListItem = function(element,stack,elBounds){
    
  
    var position = this.getCSS(element,"listStylePosition",false);
    

    var item = this.getListItem(element),
    x,
    y;
        
    var type = this.getCSS(element,"listStyleType",false);
    
    if (/^(decimal|decimal-leading-zero|upper-alpha|upper-latin|upper-roman|lower-alpha|lower-greek|lower-latin|lower-roman)$/i.test(type)){
        var currentIndex = this.getIndex(element.parentNode.childNodes, element)+1,
        text;
        
        if (type == "decimal"){
            text = currentIndex;
        }else if (type == "decimal-leading-zero"){
            if (currentIndex.toString().length == 1){
                text = currentIndex = "0" + currentIndex.toString();
            }else{
                text = currentIndex.toString();   
            }
                   
        }else if (type == "upper-roman"){
            text = this.getListRoman(currentIndex);
        }else if (type == "lower-roman"){
            text = this.getListRoman(currentIndex).toLowerCase();
        }else if (type == "lower-alpha"){
            text = this.getListAlpha(currentIndex).toLowerCase();
        }else if (type == "upper-alpha"){
            text = this.getListAlpha(currentIndex);
        }
           
        text += ". ";
        var  listBounds = this.getListPosition(element,text);
        
        if (position == "inside"){
            this.setFont(stack.ctx,element,false);     
            x = elBounds.left;
        }else{
            return; /* TODO really need to figure out some more accurate way to try and find the position. 
             as defined in http://www.w3.org/TR/CSS21/generate.html#propdef-list-style-position, it does not even have a specified "correct" position, so each browser 
             may display it whatever way it feels like. 
            "The position of the list-item marker adjacent to floats is undefined in CSS 2.1. CSS 2.1 does not specify the precise location of the marker box or its position in the painting order"
 */
            // this.setFont(stack.ctx,element,true);
            // x = elBounds.left-10;
        }
        
        y = listBounds.bottom;
        
        
        this.printText(text, x, y, stack.ctx);   
        
    }
    
    
    
};

html2canvas.prototype.getListPosition = function(element,val){
    var boundElement = document.createElement("boundelement");
    boundElement.style.display = "inline";
    //boundElement.style.width = "1px";
    //boundElement.style.height = "1px";
    
    var type = element.style.listStyleType;
    element.style.listStyleType = "none";
    
    boundElement.appendChild(document.createTextNode(val));
    

    element.insertBefore(boundElement,element.firstChild);

    
    var bounds = this.getBounds(boundElement);
    element.removeChild(boundElement);
    element.style.listStyleType = type;
    return bounds;
    
    
};

html2canvas.prototype.getListItem = function(element){
    

    
};

    
html2canvas.prototype.getListAlpha = function(number){
    var tmp = "";
    do{
        var modulus = number % 26; 
        tmp = String.fromCharCode((modulus) + 64) + tmp;
        number = number / 26;
    }while((number*26) > 26);
   
    return tmp;  
};

html2canvas.prototype.getListRoman = function(number){
    var romanArray = ["M","CM","D","CD","C","XC","L","XL","X","IX","V","IV","I"],
    decimal = [1000,900,500,400,100,90,50,40,10,9,5,4,1],
    roman = "";

    if (number <= 0 || number >= 4000) {return roman;}
    for (var v=0; v<romanArray.length; v++) {
        while (number >= decimal[v]) { 
            number -= decimal[v];
            roman += romanArray[v];
        }
    }
        
    return roman;
    
    
};
