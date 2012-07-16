/**
 * jQuert plugin for server list panel
 * init() functionality and panel position relative to layer map 
 */
var $this=null; //needed since 'this' changes context at reload

(function( $ ){
	
  var methods = {
    init : function( options ) {
	  	$this=$(this);
	  	var $newHeaderList=$('<h1 align="center" class="serviceEditor">Service List</h1>' +
         '<div class="serviceListSearchFilter">' +
         '<input type="text" value="" />' +
         '</div>' +
         //<select name="serviceListSearch_Value"></select>
      '<ul id="serviceList" ></ul>');
	  	$this.append($newHeaderList);
	  	txtHTML=createServicesHTML(options.containers);
	  	var $ul=$this.children("ul");
	  	$ul.append(txtHTML);
	  	//resize the children
	  	setServiceLiWidth($ul.children());
	  	//$("li.serviceLi").each(function(){console.log($(this).outerWidth());})
	  	
	  	
	  	//generic panel properties
	  	serviceMenuProperties($this);
	  	//activate click properties
	  	activatePluginClick($this);
	  	activatePluginDragDrop($this,options);
	  	//start services hidden
	  	$this.servicePlugin("hideIO");
	  	//activate click on service list
	  	$this.servicePlugin("enableTrigger");
	  	//add triger to form in case user changes services
	  	$("input[id='inputWSDL']").change(function(){$this.servicePlugin("reloadServices")});
	  
	  	
  		},
  	//in case of new WSDL and web services
 
    hideIO : function( ) { //$this.children("ul").$("li.serviceLi > ul").hide(); 
    	$("#servicePanel").find("li.serviceLi > ul").hide();
    	},
    enableTrigger: function(){
    			$(".trigger#serviceMenu").click(function(){
    			$(".panel#servicePanel").trigger("isOpen");	
    			$(".panel#servicePanel").toggle("fast");
    			$(this).toggleClass("active");
    			
    			return false;
    			});//end click
    	}, //end of enable trigger
    reloadServices: function () {
    		//Clean arr container
    		//RECALL: arrContainers and wsdlURL are global variables
    		arrContainers=[];
    		wsdlURL=$('input[id="inputWSDL"]').val();
         $('.emuis_loading_progressbar').progressbar({value: 0});
         $('.hex-container').removeClass('hex-container-zoomed');
         $('.eumis_loading_screen').css({'display': 'block', 'opacity': 1});
         parseWSDL(wsdlURL, function(arrayContainers) {
       		txtHTML=createServicesHTML(arrContainers);
       		var $ul=$this.children("ul");
		   	//remove children li
			   $ul.empty();
   			//append new children
	   		$ul.append(txtHTML);
		   	//resize the children
			   setServiceLiWidth($ul.children());
			
   			activatePluginClick($this);
			
	   		$ul.children("li.serviceLi").draggable({
		   		drag: function(event, ui) {},
			   	containment: 'div.serviceEditor',
				   appendTo: 'body',
   				zIndex:27000,
	   			opacity: 0.35,
		   		helper: 'clone',
			   	dragstop: function(event,ui){var originalPosition=ui.originalPosition}
				  });
   			$this.servicePlugin("hideIO");
         }, function(val, max) {
            //alert(val + " - " + max);
            if(val == -1) {
               $('.emuis_loading_progressbar').progressbar({value: 100});
               $('.hex-container').addClass('hex-container-zoomed');
               $('.eumis_loading_screen').animate({'opacity': 0}, 750, function() {
                  $(this).hide();
               });
            } else {
               $('.emuis_loading_progressbar').progressbar({value: (val / max) * 100});
            }
         });
       }
    
  };
  $.fn.servicePlugin = function( method,options ) {
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
      $.error( 'Method ' +  method + ' does not exist on jQuery.servicePlugin' );
    }    
  
  };

})( jQuery );



function serviceMenuProperties($thisPanel){
	//service list menu
	//important feature, position is webpage
	var panelWidth=$thisPanel.width()
	//better to push it -100 to the ledt
	leftPos=$("div.serviceEditor").width()-panelWidth-100;
	topPos=-($("div#titleGroup").height()+$("div#linkGroup").height());
	heigth=($(document).height()-$("div#titleGroup").height()-$("div#linkGroup").height());
	$thisPanel.css({'height':$(document).height() - 42});
}

function activatePluginDragDrop($thisPanel,options){
	//options contains the parentEl of layer object
	//ATTENTION need to use appendTO body otherwise it doesnt go out of the parent container
	$thisPanel.children("ul#serviceList").children("li.serviceLi").draggable({
		drag: function(event, ui) {},
		containment: 'div.serviceEditor',
		appendTo: 'body',
		zIndex:27000,
		opacity: 0.35,
		helper: 'clone',
		dragstop: function(event,ui){var originalPosition=ui.originalPosition}
			})
	//Droppable
	//$(options.droppableEl).droppable({accept:options.acceptableEl})
	//$(options.droppableEl).bind("drop",serviceDropped)
	//since more object are going to be dropped, better to check if droppable
	if ($(options.droppableEl.parentEl).hasClass("ui-droppable")){
		//get the current droppable and ad this one
		var accept = $(options.droppableEl.parentEl).droppable( "option", "accept" );
		$(options.droppableEl.parentEl).droppable("option","accept",options.acceptableEl+","+accept)
		
	}else {
	$(options.droppableEl.parentEl).droppable({accept:options.acceptableEl})
	$(options.droppableEl.parentEl).bind("drop",serviceDropped)
	}
};


function activatePluginClick($thisPanel){
	//$this --> div#servicePanel.panel
	//only the first li.serviceLi
	$thisPanel.children("ul#serviceList").children("li.serviceLi").click(function(event){
		//stop children events
		event.stopPropagation();
		var $target=$(event.target);
		//$target[0]==this alow for click in the box to activate sevice
		//in case of IO clicked the event is blocked
		if((event.target != this) && !($target.is("ul"))){
			return false
			}else {
				$(this).toggleClass("active");
				if ($(this).hasClass('active')){
					
					$(this).find("ul").show("slow");
				}else {
					$(this).find("ul").hide("slow");
					}
			return false;
			}//end if event.target
		});
};


function createServicesHTML(containers){
	//Appends the services in array arrContainer to the service panel
	//<ul id="serviceList" >
	//<li class="serviceLi">ExecuteProcess_r.covar</li>
	//<li class="serviceLi">ExecuteProcess_r.univar</li>
	//</ul>
	// $("ul#serviceList > li.serviceLi").each(function(){console.log($(this).textWidth());})
	var textToInsert="";
	$.each(containers,function(index,value){
      var label = value.label.split('ExecuteProcess');
      if(label[1].substring(0, 1) == '_') {
         label = label[1].substring(1);
      } else {
         if(label[1].substring(0, 6) == 'Async_') {
            label = label[1].substring(6) + ' ~ Async';
         } else {
            label = value.label;
         }
      }
      
		textToInsert  += '<li class="serviceLi" rel="' + value.label + '">'+label;
		//nested input
		textToInsert += "<ul>";
		textToInsert +="<li class='serviceInputs'>Inputs</li>";
		$.each(value.containerInputs,function(index,valueInput){
			
			textToInsert +="<li class='serviceLi input'>"+valueInput+"</li>";
			});
		textToInsert+="</ul>"; //end of service input
		//nested output
		textToInsert +="<ul>";
		textToInsert +="<li class='serviceOutputs'>Outputs</li>";
		$.each(value.containerOutputs,function(index,valueOutput){
			textToInsert +="<li class='serviceLi output'>"+valueOutput+"</li>";
			});
		textToInsert+="</ul>"; //end of service output
		
		textToInsert +='</li>'; //end service bullet
		});
	//Change CSS to accomodate li.serviceLi 
	
	
	return textToInsert;
	

	//hide everything
	//$("li.serviceLi > ul").hide();
	
	
	}; //end appendServices

function setServiceLiWidth(elArr){
	 var maxValue=0;
	elArr.each(function(){
		currentValue=$(this).textWidth();
		maxValue = currentValue > maxValue ? currentValue : maxValue
	});
	//adding a bit more to look good
	maxValue += 10;
	elArr.each(function(){$(this).css("width",maxValue)})
	// e g.: $("ul#serviceList > li.serviceLi").each(function(){console.log($(this).textWidth());})
	
	
	
}
	
