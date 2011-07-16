
/*
 * jQuery helper plugin for examples and tests
 */
			
(function( $ ){
    $.fn.html2canvas = function() {
  
        var date = new Date();
        var message,
        timeoutTimer,
        timer = date.getTime();
        
        new html2canvas(this.get(0), {
            logging: true,
            ready: function(canvas) {
                
                var finishTime = new Date();
               // console.log((finishTime.getTime()-timer)/1000);
                
                
                document.body.appendChild(canvas);
                var canvas = $(canvas);
                canvas.css('position','absolute')
                .css('left',0).css('top',0);
               // $('body').append(canvas);
                $(canvas).siblings().toggle();
                $(window).click(function(){
                    if (!canvas.is(':visible')){
                        $(canvas).toggle().siblings().toggle();  
                        throwMessage("Canvas Render visible");
                    } else{
                        $(canvas).siblings().toggle();  
                        $(canvas).toggle();
                        throwMessage("Canvas Render hidden");
                    }
                    
          
                });
            }
            
        });
        
        
        function throwMessage(msg){
            window.clearTimeout(timeoutTimer);
            timeoutTimer = window.setTimeout(function(){
                message.fadeOut(function(){
                    message.remove();   
                });                   
            },2000);
            $(message).remove();
            message = $('<div />').text(msg).css({
                margin:0,
                padding:10,
                background: "#000",
                opacity:0.7,
                position:"fixed",
                top:10,
                right:10,
                fontFamily: 'Tahoma' ,
                color:'#fff',
                fontSize:12,
                borderRadius:12,
                width:'auto',
                height:'auto',
                textDecoration:'none'
            }).hide().fadeIn().appendTo('body');
        }

    };
})( jQuery );
	