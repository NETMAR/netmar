/**
 * jQuert plugin for taverna panel,
 * init() functionality and panel position relative to layer map 
 */

(function( $ ){
  //need to pass it to namespace !!!!	
  this.transformURL="./transform2Taverna.php";
  var methods = {
    init : function( options ) { 
	    $(this).exportPlugin("enableTrigger");
	    //generate panel structure wuth HTML and Icons
	    exportMenuPropertiesGeneric($(this));
	    //enable click trigger in icon and HTML title
	    exportMenuPropertiesClick($(this));    
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
		$(".trigger#exportMenu").click(function(){
		$(".panel#exportPanel").trigger("isOpen");	
		$(".panel#exportPanel").toggle("fast");
		$(this).toggleClass("active");
		return false;
		});//end click
}//end of enable trigger	
  };//end of methods

  $.fn.exportPlugin = function( method,options ) {
	//options contains the container array
	  var defaultOptions = {};
	  if ( options ) { 
	        $.extend( settings, options );
	      } else {options=defaultOptions}
	  
    // Method calling logic
    if ( methods[method] ) {
      return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
    } else if ( typeof method === 'object' || ! method ) {
      return methods.init.apply( this, arguments );
    } else {
      $.error( 'Method ' +  method + ' does not exist on jQuery.tooltip' );
    };    
  };
})( jQuery );
window.exportMenuPropertiesClick = function($thisPanel){
	//$thisPanel-->div#exportPanel.panel
	//enable click on the icons
	$thisPanel.click(function(event) {
		event.stopPropagation();
		
		if (event.target.id == "iconTaverna" || event.target.id == "tavernaH3"){
			//Export Taverna format
			makeTavernaXML()
			
		};
		if (event.target.id=="iconNetmar" || event.target.id == "netmarH3" ){
			//Export Netmar XML
			makeNetmarXML();
		};
	});
};

window.makeNetmarXML = function(){
	//this works
	//json2xml(JSON.parse(getJSONWorkflow()))

	var netmarJSON=getJSONWorkflow(false);
	var worker=new Worker('json2xml.js')
	worker.onmessage=function(event){
		//send XML back to user
		s64=Base64.encode(event.data);
		if (typeof fileName === 'undefined') {
		    fileName="tmp";
		};
		var $linkSave=$("div.trash").append("<a id='file' href='data:application/json;charset=utf-8;base64,"+s64+"' filename='"+fileName+"'></a>").hide();
		location.href=$("a#file").attr('href');
		$linkSave.children().remove()
		}
	worker.postMessage(netmarJSON);
}

window.makeTavernaXML = function(){
	//this works
	//json2xml(JSON.parse(getJSONWorkflow()))
	var netmarJSON=getJSONWorkflow(false);
	var worker=new Worker('json2xml.js');
	worker.onmessage=function(event){
		//send it to transformation service, in the future this should be done by the browser 
		s64=Base64.encode(event.data);
		//better to send everything s64
		$.download(transformURL,s64,'post');
		};
	worker.postMessage(netmarJSON);
};

window.exportMenuPropertiesGeneric = function($thisPanel){
	//$thisPanel-->div#exportPanel.panel
	//Position and CSS
	var panelWidth=250;
	
	
	//Content HTML'
	var $header=$('<h1 class="serviceEditor" align="center">Export</h2>');
	$thisPanel.append($header);
	
	//Taverna icons and stuff
	var $taverna=$('<h2 class="serviceEditor" style="text-align:center;"></h2>'
			+'<div style="text-align:center;"><img src="./images/tavernaIcon.png" height=48px width=48px  id="iconTaverna"/></div>'
			+'<h3 style="text-align:center;" id="tavernaH3">Taverna 2.3</h3>')
	$thisPanel.append($taverna);
	
	var $netmar=$('<h2 class="serviceEditor" style="text-align:center;"></h2>'
			+'<div style="text-align:center;"><img src="./images/netmarIcon.png" height=110px width=110px id="iconNetmar" /></div>'
			+'<h3 style="text-align:center;" id="netmarH3">Netmar XML</h3>');
	$thisPanel.append($netmar);

	//better to push it -100 to the left
	//leftPos=$("div.serviceEditor").width()-panelWidth-100;
	//topPos=-($("div#titleGroup").height()+$("div#linkGroup").height());
	//heigth=($(document).height()-$("div#titleGroup").height()-$("div#linkGroup").height());
	//$thisPanel.css({'left':leftPos,'top':topPos,'height':heigth});
	//default CSS for round boxes
	//<h2>Export</h2> 
	$thisPanel.css({
		'width': panelWidth,
		'overflow':'auto',
		/*'height':'auto',*/
		'padding-top':'10px',
		'padding-right':'30px',
		'padding-bottom':'30px',
		'padding-left':'30px',
		/*'border':'1px solid #444444',
		'border-top-left-radius':'20px',
		'border-top-right-radius':'20px',	
		'-moz-border-radius-topleft': '20px',
	    '-moz-border-radius-topright': '20px',
	    '-webkit-border-top-left-radius': '20px',
	    '-webkit-border-top-right-radius': '20px',
		'border-bottom-left-radius':'20px',
		'border-bottom-right-radius':'20px',
	    '-moz-border-radius-bottomleft': '20px',
	    '-moz-border-radius-bottomright': '20px',
	    '-webkit-border-bottom-left-radius': '20px',
	    '-webkit-border-bottom-right-radius': '20px'*/
      'border':'1px solid rgba(0, 136, 136, 0.75)',
      'background-color':' rgba(0, 136, 136, 0.75)',
      '-webkit-box-shadow':' 0px 0px 23px #006666, 0px 0px 4px #006666',
      '-moz-box-shadow':'    0px 0px 23px #006666, 0px 0px 4px #006666',
      '-ms-box-shadow':' 0px 0px 23px #006666, 0px 0px 4px #006666',
      '-o-box-shadow':'0px 0px 23px #006666, 0px 0px 4px #006666',
      'box-shadow':'         0px 0px 23px #006666, 0px 0px 4px #006666',
      '-webkit-border-radius':' 0px 0px 0px 33px',
      '-moz-border-radius':' 0px 0px 0px 33px',
      '-ms-border-radius':' 0px 0px 0px 33px',
      '-o-border-radius':' 0px 0px 0px 33px',
      'border-radius':' 0px 0px 0px 33px',
         'float':'right'
	});	
}; //end of exportMenuProperties


