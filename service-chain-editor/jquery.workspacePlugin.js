/**
 * jQuert plugin for Workspace panel,
 * init() functionality and panel position relative to layer map 
 */

(function( $ ){
  //SEE $.fn.workspacePlugin FOR SETTINGS
  var methods = {
    init : function( options ) {
	  
	    $(this).workspacePlugin("enableTrigger");
	    $.fn.workspacePlugin.workspaceMenuHTML($(this));
	    $.fn.workspacePlugin.savedWorkTable();
	    $.fn.workspacePlugin.workspaceMenuPropertiesGeneric($(this));
	    
	
    },
    show : function( ) {
      
    },
    hide : function( ) { 
      
    },
    update : function( content ) { 
       
    },
    enableTrigger: function(){
    	$(".trigger#workspaceMenu").click(function(){
    		$(".panel#workspacePanel").trigger("isOpen");	
    		$(".panel#workspacePanel").toggle("fast");
    		$(this).toggleClass("active");
    		return false;
    		});
    	}//end of enable trigger	

};//end of methods


  
$.fn.workspacePlugin = function( method,options ) {
	//PLUGIN SETTINGS
	 $.fn.workspacePlugin.settings = {
			  'panelWidth':350,
			  'height': 200,
			  'border':'2px solid #111111',
			  'paddingTop':10,
			  'paddingRight':20,
			  'paddingBottom':30,
			  'paddingLeft':100,
			  'radiusTopRight':20,
			  'radiusBottomRight':20};
	  $.fn.workspacePlugin.defaultOptions={};
	  
	  
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
  
  }; //end of $.fn.workspacePlugin


})( jQuery );


//ADDING THE SETTINGS ARRAY AND FUNCTIONS INSIDE $.fn.wsdlPlugin  WE TAKE ADVANTAGE OF NAMESPACE
//ALSO IT HELPS WITH CONSOLE.DIR
//ATTENTION: IT HAS TO BE OUTSIDE THE ANONYMOUS FUNCTION OTHERWISE THEY ARE CALLED SEVERAL TIMES


$.fn.workspacePlugin.workspaceMenuPropertiesGeneric=function($thisPanel){

	//The table meeds to be redrawn affter each toggle
	$("#tableSavedPanel").css("display","none");

	//saving structure
	$("#saver").css("display","none");

	//upload strubure
	$("#uploader").css("display","none");

	
	/*
	 * TRIGGERS
	 */
	function listIsOpen(e){
		//When a list is active and open close all others
		
		$currentLi=$(e.target);
		$("li.savedLi:not(#"+this.id+")").each(function(index,el){
			//check if they are active
			if ($(el).hasClass("active"))
				//click event 
				$(el).trigger("click");
		})
	}
	/*
	 * EVENT
	 */
		$("li.tableSaved").bind("listIsOpen",listIsOpen);
		$("li.saver").bind("listIsOpen",listIsOpen);
		$("li.uploader").bind("listIsOpen",listIsOpen);
	/*
	 * CSS of worspacePanel
	 */
	var settings=$.fn.workspacePlugin.settings;
	$thisPanel.css({
		'top': 0,
		'left': 0,
		'height':'auto',
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

	
	//workSpace menu structure
	
	//setting the savedWorkTable properties and structure;

	//this is the li that contains Load,Save and Upload
	$("li.savedLi").click(function(e){
		if(e.target.name!="inputbox"){
			$(this).toggleClass("active");
			//$("li.savedLi").toggleClass("active",false);
	
			
			$("li.savedLi:not(li.savedLi.active)").toggleClass("active",false);
	
		//toogle savedTable
			var $target=$(e.target);
		//for savedTable

		//switch li.tableSaved,li.saver,li.uploader using is
			
			//li Load
			if ($target.is("li.tableSaved")){
				$("li.tableSaved").trigger("listIsOpen");
				if ($("li.tableSaved.savedLi.active").length>0){
					$("#tableSavedPanel").toggle("slow",function(e){oTable.fnAdjustColumnSizing();});
					//deactivate any filename structure
					$("li.saver").toggleClass("active",false);
					$("li.fileName.savedLi").toggleClass("active",false);
					$("li.fileName.savedLi").toggle("slow");
		
				} else {
					$("#tableSavedPanel").toggle("slow");
				};

				$("li.saver").toggleClass("active",false);	
			};//end if is li.tableSaved

			if($target.is("li.saver")){
				//deactvate the tabled panel
				$("li.saver").trigger("listIsOpen");
				if ($("#tableSavedPanel").is(":visible")){
					$("#tableSavedPanel").toggle("slow");
				}
	
				if($("li.saver.savedLi.active").length>0){
			
					$("div#saver").toggle("slow");
					$("li.fileName.savedLi").toggleClass("active",true);
			
				} else { 
				
					$("li.fileName.savedLi").toggleClass("active",false);
					$("div#saver").toggle("slow");
				}	
			};  //end target is li.saver

			if($target.is("li.uploader")){
				$("li.uploader").trigger("listIsOpen");
				if ($("#tableSavedPanel").is(":visible")){
					$("#tableSavedPanel").toggle("slow");
				}
				if($("li.uploader.savedLi.active").length>0){
					$("div#uploader").toggle("slow");
					$("li.uploader.savedLi").toggleClass("active",true);
				} else {
					$("li.uploader.savedLi").toggleClass("active",false);
					$("div#uploader").toggle("slow");
				}
			};//end of li.uploader
		};  //if(e.target.name!="inputbox")


	//else { console.log("do northing");  }  //end of e.target.name!=inputbox
		
	});/*end of li.saved $("li.savedLi").click(function(e)*/
	
	
	$("form[name=saveFile]").click(function(e){
	if (e.target.name!="inputbox"){
	$("div#saver").toggle("slow");
	$("li.saver.savedLi").toggleClass("active",false);
	}});//end of click form 

	/*
	 * BUTTON STRUCTURE
	 */
	
	$("button#saveButton").button({disabled:true});
	$("button#saveButton").click(function(event){
		 storeWorkflow();
	});
			
		
	
	$("input[name='inputbox']").change(function(e){$("button#saveButton").button("option","disabled",false)})
	
	//Change <input type=file /> to something managable !!! with CSS and proper buttons
   	$('input[type="file"]').file();

   	$("input[type='submit']").click(function(event){
			///$("li.saver").click(); no need the even bubbles up
			 storeWorkflow();
 	})
//$("button#deleteButton").button( "option", "disabled", false );
	
	
	//UPLOAD BUTTON
	//$("button#uploadButton").button( "option", "disabled", false );
	$("button#uploadButton").button({ disabled: true });
	$("input[name='browse']").change(function(e){$("button#uploadButton").button("option","disabled",false);});
	//$("button#uploadButton").button("options","disabled",false)
	$("button#uploadButton").click(function(e){
		$(this).button("disable");
		$("li.uploader").click();
		startRead();
	});
	
};


$.fn.workspacePlugin.savedWorkTable=function() {
	// loads the saved cookies and appends them workspace panel as table
	// to add CSS class {"sTitle":"Date2","sClass":"center"}
		/* Add a click handler to the rows - this could be used as a callback */
			$("#tableSaved tbody").click(function(event) {
				
				$(oTable.fnSettings().aoData).each(function (){
					$(this.nTr).removeClass('row_selected');
					
				});
				$(event.target.parentNode).addClass('row_selected');
				//activate buttons
				$("button#deleteButton").button( "option", "disabled", false );
				$("button#loadButton").button("option", "disabled", false );
				$("button#downloadButton").button("option", "disabled", false );
			});
		//	"aaData":[
			//			["workfltytytytytyow1","03/May/11 13:56"],
				//		["workflow2","04/May/11 13:56"],
					//	["workflow2","04/May/11 13:56"]
						//],
		initObj={
				"bPaginate":true,
				//"sPaginationType": "full_numbers",
				//"aLengthMenu": [[4, 8, 10, -1], [4, 8, 10, "All"]]
				"bSort":true,
				"sScrollY": "75px",
				"bPaginate": false,
				"bFilter":false,
				"bAutoWidth":true, 
				"bJQueryUI":true,
			//	"aaData":savedWFData,
				"aoColumns":[{"sTitle":"Name"},{"sTitle":"DateSaved"}]
		}
		if (savedWFData){
			initObj["aaData"]=savedWFData
			} else {
				//nothing no need to add a thing
				}
			
		 oTable=$('#tableSaved').dataTable(initObj);
		
		

			//setting the buttons to work
		 $("button#deleteButton").button({ disabled: true });
		 $("button#loadButton").button({ disabled: true });
		 $("button#downloadButton").button({ disabled: true });

		 //setting onclick forbuttons
		$("button#deleteButton").click(function(event){
			
			var anSelected = fnGetSelected( oTable );
			$(anSelected).each(function(){
				//remove from jStorage
				var key=$($(this).children()[0]).text();
				$.jStorage.deleteKey(key);
				//remove key from list of saved objects
				savedWFData=$.jStorage.get("savedWorkflow");
				updatedWFData=$.grep(savedWFData,function(val,idx){return !(val[0]==key)})
				$.jStorage.set("savedWorkflow",updatedWFData);
				$(this).toggle("slow",function()
						{oTable.fnDeleteRow( anSelected[0] );}
				);});
			});
		$("button#loadButton").click(function(event){
			fileName=$($(fnGetSelected(oTable)).children()[0]).text();
			workflow=JSON.parse($.jStorage.get(fileName));
			//update the input WSDL field
			$("input[id=inputWSDL]").val(workflow.wsdlURL);
			//load services to service list
			$("input[name=inputbox]").trigger('change');
			//it adds the containers and wires
			generateLayerContent(workflow);
			//Check if panel if open is so close it
		}); //emd of load Button

		$("button#downloadButton").click(function(event){
			//selected items
			fileName=$($(fnGetSelected(oTable)).children()[0]).text();
			workflow=$.jStorage.get(fileName);

			s64=Base64.encode(workflow);
			//returnObj="data:application/json;charset=utf-8;base64," + s64;
			//var $linkSave=$("div.trash").append("<a id='file' href='www.google.com'>wwww</a>")
			var $linkSave=$("div.trash").append("<a id='file' href='data:application/json;charset=utf-8;base64,"+s64+"' filename='"+fileName+"'></a>").hide();
			//location.href=$("a").attr('href')
			//var $linkSave=$("body").add("<a id='file' filename='"+fileName+"'")
			location.href=$("a#file").attr('href');
			//$linkSave.
			$linkSave.children().remove()
			
			}); //end of saveAsButton	

		 
		}; //end of Savedworktable

$.fn.workspacePlugin.workspaceMenuHTML=function($thisPanel){
	var $header=$('<h1 align="center" class="serviceEditor">Workspace</h1>');
	$thisPanel.append($header);
	
	//First panel section load
	var $loadSection=$('<div id="loadSection"></div>')
	$thisPanel.append($loadSection);
	$loadSection.append($('<ul><li class="tableSaved savedLi" id="li1">Load</li></ul>'))
	var $tableSaved=$('<div id="tableSavedPanel">'+
			'<table table cellpadding="0" cellspacing="0" border="0" id="tableSaved"><tbody></tbody></table>'+
			'<button id="deleteButton">Delete</button>'+
			'<button id="loadButton">Load</button>'+
			'<button id="downloadButton">Download</button>'+
			'</div>');
	$loadSection.append($tableSaved);
	
	//Save section
	var $saveSection=$('<div id="saveSection"></div>')
	$thisPanel.append($saveSection);
	$saveSection.append('<ul><li class="saver savedLi" id="li2">Save</li></ul>')
	var $saverForm=$('<ul><div id="saver">'+
			'<form NAME="saveFile" ACTION="" METHOD="GET" onsubmit="return false;">'+
			'<input id="inputNameSave" TYPE="text" NAME="inputbox" VALUE=""></input><button type="submit" value="Save" id="saveButton">Save</button>'+
			'</form>'+
			'</div></ul>')
	$saveSection.append($saverForm);
	
	//Uploader section
	var $uploadSection=$('<div id="uploaderSection"></div>')
	$thisPanel.append($uploadSection);
	$uploadSection.append('<ul><li class="uploader savedLi" id="li3">Upload</li></ul>');
	var $uploadForm=$('<ul><div align="center" id=uploader><input type="file" id="file[]" name="browse" /></input></div></ul>');
	$uploadSection.append($uploadForm);
	
	
	
};





