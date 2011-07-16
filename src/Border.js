/*
 * Function to provide border details for an element
 */

html2canvas.prototype.getBorderData = function(el){
     
    var borders = [];
    var _ = this;
    this.each(["top","right","bottom","left"],function(i,borderSide){
        borders.push({
            width: parseInt(_.getCSS(el,'border-'+borderSide+'-width'),10),
            color: _.getCSS(el,'border-'+borderSide+'-color')
        });
    });
            
    return borders;
            
}