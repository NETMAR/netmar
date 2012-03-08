/**
* jQuert plugin for io panel
* init() functionality and panel position relative to layer map 
*/

(function( $ ){

  var methods = {
    init : function( options ) {
	  var $this=$(this);
	  
	  $this.ioPlugin("enableTrigger");
	  ioMenuProperties($this);
	  	},
  enableTrigger: function(){
			$(".trigger#ioMenu").click(function(){
			$(".panel#ioPanel").trigger("isOpen");	
			$(".panel#ioPanel").toggle("fast");
			$(this).toggleClass("active");
			return false;
			});//end click
	}//end of enable trigger	
  };//end methods

  $.fn.ioPlugin = function( method,options ) {
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
    }    
  
  };

})( jQuery );

function ioMenuProperties($thisPanel){
	//service list menu
	//important feature, position is webpage
	var panelWidth=$thisPanel.width()
	//better to push it -100 to the ledt
	leftPos=$("div.serviceEditor").width()-panelWidth-100;
	topPos=-($("div#titleGroup").height()+$("div#linkGroup").height());
	//heigth=($(document).height()-$("div#titleGroup").height()-$("div#linkGroup").height());
	//$thisPanel.css({'left':leftPos,'top':topPos,'height':heigth});
	$thisPanel.css({'left':leftPos,'top':topPos});
	// Generate the dummy Input / Output to be dragged
	dummyInput=makeDummyIO("input");
	$thisPanel.children("#ioInput").append(dummyInput);
	dummyOutput=makeDummyIO("output");
	$thisPanel.children("#ioOutput").append(dummyOutput);
	//Generate the dummy GIS I/O to be dragged
	dummyOutput=makeDummyIO("inputGIS");
	$thisPanel.children("#ioInputGIS").append(dummyOutput);
	dummyOutput=makeDummyIO("outputGIS");
	$thisPanel.children("#ioOutputGIS").append(dummyOutput);
	
	
	
	//dummyInputGIS=makeDummyIO("inputGIS");
	//$thisPanel.children("#ioInput").append(dummyInput)
	
	
	//multiple selector
	//$(".serviceLi,#dummyInputContainer")
	
	//make them draggable (#ioInput,ioOutput,ioInputGIS,ioOutputGIS):

	$("div#ioPanel.panel").children("div").draggable({
		drag: function(event, ui) {},
		containment: 'div.serviceEditor',
		appendTo: 'body',
		zIndex:27000,
		opacity: 0.35,
		helper:  'clone',
		dragstop: function(event,ui){var originalPosition=ui.originalPosition}
			})
	
	
		if ($(options.droppableEl.parentEl).hasClass("ui-droppable")){
				//get the current droppable and ad this one
			var accept = $(options.droppableEl.parentEl).droppable( "option", "accept" );
			$(options.droppableEl.parentEl).droppable("option","accept",options.acceptableEl+","+accept)
				
		}else {
			$(options.droppableEl.parentEl).droppable({accept:options.acceptableEl})
			$(options.droppableEl.parentEl).bind("drop",serviceDropped)
		}			
	
	/*
	if ($(options.droppableEl.parentEl).hasClass("ui-droppable")){
		//get the current droppable and ad this one
		var accept = $(options.droppableEl.parentEl).droppable( "option", "accept" );
		$(options.droppableEl.parentEl).droppable("option","accept",options.acceptableEl+","+accept)
		
	}else {
	$(options.droppableEl.parentEl).droppable({accept:options.acceptableEl})
	$(options.droppableEl.parentEl).bind("drop",serviceDropped)
	}*/
	
}

function makeDummyIO(ioType){
	//it generates the HMLT that will be inside <div id="ioInput"> or  <div id="ioOutput"> 
switch(ioType)
{
case "input":
	var dummyIO=$("<div class='dummyIOContainer'>" 
			+"<div class='WireIt-Container-closebutton'></div>"
			+"<div class='WireIt-Terminal-Output-Taverna'></div>"
			+"<div class='WireIt-Container-editbutton'></div>" 
					+"</div>");
	break;
	case "output": 
		var dummyIO=$("<div class='dummyIOContainer'>" 
				+"<div class='WireIt-Container-closebutton'></div>" 
				+"<div class='WireIt-Terminal-Input-Taverna'></div>"
				+"<div class='WireIt-Container-editbutton'>"
				+"</div>");
	break;
	 //end of ioType
	
	
	case "inputGIS":
		
	var dummyIO=$("<div class='dummyIOContainer'>" 
			+"<div class='WireIt-Container-closebutton'></div>"
			+"<div class='WireIt-Terminal-Output-Taverna-GIS'></div>"
			+"<div class='WireIt-Container-editbutton'></div>" 
					+"</div>");
		break;

	case "outputGIS":
		var dummyIO=$("<div class='dummyIOContainer'>" 
			+"<div class='WireIt-Container-closebutton'></div>"
			+"<div class='WireIt-Terminal-Input-Taverna-GIS'></div>"
			+"<div class='WireIt-Container-editbutton'></div>" 
					+"</div>");
		break;
}//end switch	
	
	return dummyIO
	
} //end of function;

