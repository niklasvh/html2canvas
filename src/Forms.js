html2canvas.prototype.renderFormValue = function(el,bounds,stack){
    
    var valueWrap = document.createElement('valuewrap'),
    _ = this,
    body = document.body,
    textValue,
    textNode;
                
    _.each(['lineHeight','textAlign','fontFamily','color','fontSize','paddingLeft','paddingTop','width','height','border','borderLeftWidth','borderTopWidth'],function(i,style){                 
        valueWrap.style[style] = _.getCSS(el,style);
    });
                
    valueWrap.style.borderColor = "black";            
    valueWrap.style.borderStyle = "solid";  
    valueWrap.style.display = "block";
    valueWrap.style.position = "absolute";
    if (/^(submit|reset|button|text|password)$/.test(el.type) || el.nodeName == "SELECT"){
        valueWrap.style.lineHeight = _.getCSS(el,"height");
    }
  
                
    valueWrap.style.top = bounds.top+"px";
    valueWrap.style.left = bounds.left+"px";
    if (el.nodeName == "SELECT"){
        // TODO increase accuracy of text position
        textValue = el.options[el.selectedIndex].text;
    } else{   
        textValue = el.value;
        
    }
    textNode = document.createTextNode(textValue);
    
    valueWrap.appendChild(textNode);
    body.appendChild(valueWrap);
    
    _.newText(el,textNode,stack);
    
    body.removeChild(valueWrap);
   
    
};