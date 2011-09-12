/* 
 * html2canvas v0.30 <http://html2canvas.hertzen.com>
 * Copyright (c) 2011 Niklas von Hertzen. All rights reserved.
 * http://www.twitter.com/niklasvh 
 * 
 * Released under MIT License
 */

/*
 * The MIT License

 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:

 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.

 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */


/*
 * jQuery helper plugin for examples and tests
 */
			
(function( $ ){
    $.fn.html2canvas = function(options) {
  
        var date = new Date();
        var message,
        timeoutTimer,
        timer = date.getTime();
       
        var preload = html2canvas.Preload(this[0], {
            "complete": function(images){
                
                var queue = html2canvas.Parse(this[0], images);
               
                
                var canvas = $(html2canvas.Renderer(queue));
                var finishTime = new Date();
         
          
                canvas.css('position','absolute')
                .css('left',0).css('top',0);
                $('body').append(canvas);
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
                throwMessage('Screenshot created in '+ ((finishTime.getTime()-timer)/1000) + " seconds<br />",4000);
                  
            }
        });
       
  
       

         

      
        /*
        var date = new Date();
        var message,
        timeoutTimer,
        timer = date.getTime();
        
        var object = $.extend({},{
            logging: false,
            proxyUrl: "http://html2canvas.appspot.com/", // running html2canvas-python proxy
            ready: function(renderer) {
                
                var finishTime = new Date();
               // console.log((finishTime.getTime()-timer)/1000);
                

                document.body.appendChild(renderer.canvas);
                
                
                
                var canvas = $(renderer.canvas);
                canvas.css('position','absolute')
                .css('left',0).css('top',0);
                

                
               // $('body').append(canvas);
                $(canvas).siblings().toggle();
                
                throwMessage('Screenshot created in '+ ((finishTime.getTime()-timer)/1000) + " seconds<br />Total of "+renderer.numDraws+" draws performed",4000);
                
                
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
            
        },options)
        
        new html2canvas(this.get(0), object);
        
         */
        
        function throwMessage(msg,duration){
            
            window.clearTimeout(timeoutTimer);
            timeoutTimer = window.setTimeout(function(){
                message.fadeOut(function(){
                    message.remove();   
                });                   
            },duration || 2000);
            $(message).remove();
            message = $('<div />').html(msg).css({
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
                textAlign:'center',
                textDecoration:'none'
            }).hide().fadeIn().appendTo('body');
        }

    };
   
})( jQuery );
	
