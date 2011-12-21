/*
 * jQuery helper plugin for examples and tests
 */
(function( $ ){
    $.fn.html2canvas = function(options) {
        var date = new Date(),
        $message = null,
        timeoutTimer = false,
        timer = date.getTime();
	html2canvas.logging = options && options.logging;
        html2canvas.Preload(this[0], $.extend({
            complete: function(images){
                var queue = html2canvas.Parse(this[0], images, options),
                $canvas = $(html2canvas.Renderer(queue, options)),
                finishTime = new Date();

                $canvas.css({ position: 'absolute', left: 0, top: 0 }).appendTo(document.body);
                $canvas.siblings().toggle();

                $(window).click(function(){
                    if (!$canvas.is(':visible')){
                        $canvas.toggle().siblings().toggle();
                        throwMessage("Canvas Render visible");
                    } else{
                        $canvas.siblings().toggle();
                        $canvas.toggle();
                        throwMessage("Canvas Render hidden");
                    }
                });
                throwMessage('Screenshot created in '+ ((finishTime.getTime()-timer)/1000) + " seconds<br />",4000);
            }
        }, options));

        function throwMessage(msg,duration){
            window.clearTimeout(timeoutTimer);
            timeoutTimer = window.setTimeout(function(){
                $message.fadeOut(function(){
                    $message.remove();
                });
            },duration || 2000);
            if ($message)
                $message.remove();
            $message = $('<div />').html(msg).css({
                margin:0,
                padding:10,
                background: "#000",
                opacity:0.7,
                position:"fixed",
                top:10,
                right:10,
                fontFamily: 'Tahoma',
                color:'#fff',
                fontSize:12,
                borderRadius:12,
                width:'auto',
                height:'auto',
                textAlign:'center',
                textDecoration:'none'
            }).hide().fadeIn().appendTo('body');
        }
    };
})( jQuery );
