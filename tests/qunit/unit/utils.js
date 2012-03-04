
$(function() {  
   
  
   var el = $('#qunit-fixture');
   
      
    test('Children()', 1, function() { 
       var arr = [],
       cont = el.contents();
       $.each(cont, function(i,e){
           arr.push(e);
       });
       // text nodes differ
        QUnit.equal( _html2canvas.Util.Children(el[0]), arr, "Util.Children === jQuery.children()" ); 
    });
    
});
