
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

    test('resizeBounds', function(){
      
      QUnit.deepEqual( 
        _html2canvas.Util.resizeBounds(100, 100, 100, 100),
        { width: 100, height: 100 },
        'no resize'
      );
      
      QUnit.deepEqual( 
        _html2canvas.Util.resizeBounds(100, 100, 2, 100),
        { width: 20, height: 100 },
        'stretch'
      );
      
      QUnit.deepEqual( 
        _html2canvas.Util.resizeBounds(100, 100, 2, 100, 'contain'),
        { width: 2, height: 2 },
        'contain'
      );
      
      QUnit.deepEqual( 
        _html2canvas.Util.resizeBounds(100, 100, 2, 100, 'cover'),
        { width: 100, height: 100 },
        'contain'
      );

    });
    
});
