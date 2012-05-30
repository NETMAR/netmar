/**
 * jQuert plugin for WSDL panel,
 * init() functionality and panel position relative to layer map 
 */

(function( $ ){
  //SEE $.fn.wsdlPlugin FOR SETTINGS
  var methods = {
    init : function( options ) {
	  
	    $(this).wsdlPlugin("enableTrigger");
	    //generate panel structure wuth HTML and Icons
	    
	    $.fn.wsdlPlugin.wsdlMenuPropertiesGeneric($(this));
	    $.fn.wsdlPlugin.wsdlFileList($(this));
	   // $(this).wsdlPlugin.foo();
	    
    },
    show : function( ) {
      
    },
    hide : function( ) { 
      
    },
    update : function( content ) { 
       
    },
    enableTrigger: function(){
    	/*
    	 * <a class="trigger" id="exportMenu" href="#" panel="exportPanel">Export</a>
    	 * <div class="panel" id="exportPanel">Export</div> <!-- taverna panel -->
    	 */
		$(".trigger#wsdlMenu").click(function(){
		$(".panel#wsdlPanel").trigger("isOpen");	
		$(".panel#wsdlPanel").toggle("fast");
		$(this).toggleClass("active");
		return false;
		});//end click
}//end of enable trigger	
};//end of methods


  
$.fn.wsdlPlugin = function( method,options ) {
	//PLUGIN SETTINGS
	 $.fn.wsdlPlugin.settings = {
			  'panelWidth':300,
			  'height': 150,
			  'border':'2px solid #111111',
			  'paddingTop':10,
			  'paddingRight':20,
			  'paddingBottom':30,
			  'paddingLeft':100,
			  'radiusTopRight':20,
			  'radiusBottomRight':20};
	  $.fn.wsdlPlugin.defaultOptions={};
	  
	  
	  if ( options ) { 
	        $.extend( $.fn.wsdlPlugin.settings, options );
	      } else {options=$.fn.wsdlPlugin.defaultOptions}

	  if ( methods[method] ) {
    // Method calling logic
      return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
    } else if ( typeof method === 'object' || ! method ) {
      return methods.init.apply( this, arguments );
    } else {
      $.error( 'Method ' +  method + ' does not exist on jQuery.tooltip' );
    }    
  
  };


})( jQuery );


//ADDING THE SETTINGS ARRAY AND FUNCTIONS INSIDE $.fn.wsdlPlugin  WE TAKE ADVANTAGE OF NAMESPACE
//ALSO IT HELPS WITH CONSOLE.DIR
//ATTENTION: IT HAS TO BE OUTSIDE THE ANONYMOUS FUNCTION OTHERWISE THEY ARE CALLED SEVERAL TIMES

$.fn.wsdlPlugin.wsdlFileList=function ($thisPanel,settings){
	//WSDL File list to be used in the future.
	var settings=$.fn.wsdlPlugin.settings;
	var urlCancelButton="./images/cancel.png";
	var $addTableLayer=$('<div id="tableLayerWSDL"></div>');
	$thisPanel.append($addTableLayer);
	

	$addTableLayer.css({
		'align':'center',
		'border': 0,
		'margin-left': 'auto',
		'margin-right': 'auto',
		'width': settings.panelWidth*0.8,
		'height': 100,//more or less 3 files
		'overflow-y':'auto'
			});
	
	var $addTableFrame=$('<table border="0"><tr class="fileRow"><td>fileName</td><td class="cancelButton"><img src="'+urlCancelButton+'" class="cancelButton"></td></tr></table>');
	$addTableFrame.css({
		'width':$addTableLayer.width()*0.9 //give some space for the scrool bar
	})
	
	/*
	 * TO BE IMPLEMENTED WHEN WE'LL MULTIPLE WSDL, UNCOMMENT BELOW TO GENERATE
	 * TABLE WITH FILE
	 */
	
	/*
	$addTableFrame.delegate('img.cancelButton',"click",function(){
		$removeEl=$(this).parent().parent();
		$removeEl.fadeOut("slow",function(e){$(this).remove()});
		//$removeEl.remove();
		});
	
	var imgWidth=$addTableFrame.find('img.cancelButton').width();
	var $tdImg=$addTableFrame.find('td.cancelButton');
	$tdImg.css({
		'width':imgWidth,
		'margin-left': 'auto',
		'margin-right': 'auto'
	})
	$addTableLayer.append($addTableFrame);
	
	$trRow=$addTableFrame.find('tr.fileRow');
	for (i=0;i<=2;i++){
		$trRow.clone().appendTo($addTableFrame);
	*/	
	
		
}; //end of wsdlFileList


$.fn.wsdlPlugin.wsdlMenuPropertiesGeneric=function ($thisPanel){
	//$thisPanel-->div#exportPanel.panel
	//Header
	
	var settings=$.fn.wsdlPlugin.settings;
	//border 10px solid #11111 div#wsdlPanel
	//CSS
	$thisPanel.css({
	'top': 0,
	'left': 0,
	'height': settings.height,
	'border': settings.border,
	'width': settings.panelWidth,
	'padding-top':settings.paddingTop,
	'padding-right':settings.paddingRight,
	'padding-bottom':settings.paddingBottom,
	'padding-left':	settings.paddingLeft,
	'-moz-border-radius-topright':settings.radiusTopRight ,
	'-webkit-border-top-right-radius':settings.radiusTopRight ,
	'border-top-right-radius': settings.radiusTopRight,
	'-moz-border-radius-bottomright': settings.radiusBottomRight,
	'-webkit-border-bottom-right-radius': settings.radiusBottomRight,
	'border-bottom-right-radius': settings.radiusBottomRight,
	});
	var $addWSDL=$('<ul><li value="" class="nestedList wsdlLi">'+
			'Or click here to add</li><div class="addHTTP">'+
			'<form NAME="addWSDL" ACTION="" METHOD="GET" onsubmit="return false;">'+
			'http://&nbsp;<input id="inputWSDL" TYPE="text" NAME="inputbox" VALUE="'+options.defaultWSDL+'">'+
			'</input></form></div></ul>');
	$thisPanel.append($addWSDL);
	$addWSDL.children("div.addHTTP").hide();
	
	
	$addWSDL.children("li.nestedList").click(function (e){
		$(this).toggleClass('active');
		$(this).siblings().toggle("slow");
	});
	
	
	$addWSDL.contents().find("input").css({
		'width': options.panelWidth*0.9
	});
	
	//ENTER pressed is like a click above 
	$addWSDL.contents().find("input#inputWSDL").keyup(function(event){
		 if(event.keyCode == 13){
			 $addWSDL.children("li.nestedList").click();
		  }
	});

}; //end of exportMenuProperties







