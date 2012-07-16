
//$.noConflict();
var tempdata = [];
/* GLOBAL VARIABLES */
var oTable=null;
var giRedraw = false; //Variable comes comes from datatable
//var domainProxy=null;
//in server: 
var domainProxy="proxy.php?url"
//var domainProxy="http://localhost/v1/proxy.php?url="; //if  domainProxy=null then we dont use the proxy (WSDL and URL in the same domain)
//wsdl
var arrContainers=new Array();
var data;
//debug
var tmp=null;
var wsdlURL="./example.wsdl";
//var wsdlURL="localhost/v1/example.wsdl";

//workflow editor variables
var layerEditor=null;

/* GENERIC PLUGIN  METHOD*/
$.fn.textWidth = function(){
   // e g.: $("ul#serviceList > li.serviceLi").each(function(){console.log($(this).textWidth());})
   var calc = '<span style="display:none">' + $(this).justtext() + '</span>';
   $('body').append(calc);
   var width = $('body').find('span:last').width();
   $('body').find('span:last').remove();
   return width;
}

$.fn.justtext = function() {
   return $(this).clone().children().remove().end().text();
}

/* EVENTS */

function panelOpen(e){ 
   //get all panels that aren't this:
   //check if they are open, if so trigger click to close them
   $("div.panel:not(#"+this.id+")")
   .each(function(index,el){
      if ($(el).is(":visible")){
         idEl=$(el).attr("id");
         $("a[panel="+idEl+"]").trigger("click");
      }; //end of is visible
   });
} //end of is paneOpen

//This event is called after the servicePlugin and ioPlugin we need a switch
function serviceDropped(event,ui){
   layerOffset=$(this).offset();
   posX=ui.helper.position().left-layerOffset.left;
   posY=ui.helper.position().top-layerOffset.top;
   switch(current_scale) {
      case 0.75:
         posX = posX * 1.333;
         posY = posY * 1.333;
      break;
      case 0.5:
         posX = posX * 2;
         posY = posY * 2;
      break;
      case 0.25:
         posX = posX * 4;
         posY = posY * 4;
      break;
      default:
      break;
   }
   //SWITCH
   typeDropped=ui.draggable.attr('class');
   switch(typeDropped){
      case 'ioContainer ui-draggable':
         //check ioInput,ioOutput,ioInputGIS,ioOutputGIS,
         var idDropped=ui.draggable.attr('id')
         switch(idDropped){
            case 'ioInput':
               containerTypeValue="input";
            break;
            case 'ioOutput':
               containerTypeValue="output";
            break;
            case 'ioInputGIS':
               containerTypeValue="inputGIS";
            break;
            case 'ioOutputGIS':
               containerTypeValue="outputGIS";
            break;
            default:
               containerTypeValue="input"
            break;
         }//end switch_idDropped;

         newIO=new WireIt.TavernaContainerIO({position:[posX,posY],xtype:"WireIt.TavernaContainerIO",containerType:containerTypeValue},layerEditor);
         layerEditor.containers.push(newIO);

      break;//break from typedropped
      case 'serviceLi ui-draggable':
      case 'serviceLi ui-draggable active':
         //serviceName=ui.draggable[0].childNodes[0].textContent;
         //console.log($(ui.draggable[0].childNodes[0]));
         serviceName=$(ui.draggable[0]).attr('rel');//.textContent;
         //this --> <div class="layer ui-droppable"
         //get container from arrContainer
         container=getContainer(serviceName);
         newContainer=new WireIt.TavernaContainer(
         {height:100,
         width:220,
         xtype:"WireIt.TavernaContainer",
         position:[posX,posY],
         label:container.label,
         title:container.label}, 
         layerEditor);
         layerEditor.containers.push(newContainer);
         //add terminals Inputs
         inputTerminals=container.containerInputs;
         addInputTerminals(newContainer,inputTerminals)

         //add terminals 
         //container has a event accomTerminals that resizes the container to 
         //fit 
         outputTerminals=container.containerOutputs;
         addOutputTerminals(newContainer,outputTerminals)

         //close service I/O
         $(".ui-draggable.active").click()
      break;
      default:
      //do nothing
      break;
   } //end switch_typeDropped
}
/*
 *  UPLOAD READFUNCTIONS
 */

function startRead() {  
   // obtain input element through DOM 
   //<input type="file" id="file[]" name="browse" /></input>
   var file=$("input[name='browse']")[0].files[0]

   if(file){
      var reader = new FileReader();
      reader.readAsText(file, "UTF-8");
      //BETTER function calling than using (function(){})(reader)
      reader.onload=loaded
      reader.onerror=errored

      /*
      reader.onerror =(function(){
      if(reader.error && reader.error.name == "NOT_READABLE_ERR") {
      // The file could not be read
      }
      })(reader); 
      */
   }//end if(file)
} //end of startRead()

function loaded(event){
   try {

      var obj=JSON.parse(event.target.result);

   //var obj=jQuery.parseJSON(event.target.result);
   }
      catch (err) { 
         console.log("Not a valid JSON" ); 
         return false
   }
   if (!(obj)){ 
      console.log("Null JSON object"); 
      return false
   }
   //passed all the problems lets see if we can make the workflow
   generateLayerContent(obj);
}

function errored(event){if (event.target.error && event.target.error.name=="NOT_READABLE_ERR"){console.log("couldnt read file")}} 

function savedWorkTable(){
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
} //end of Savedworktable

function generateLayerContent(workflow){
   //clean everything
   if (typeof(layerEditor)!="undefined"){
      //delete demoLayer
      //reset everything !!! ATTENTION TO GLOBLA VARIABLES
      layerEditor.clear()
      $(layerEditor.el).remove()
      delete layerEditor;
      //NEW LAYER
      layerEditor = new WireIt.Layer({
      layerMap: false,
      parentEl:$(".layer")[0]});
      //GENERATE CONTAINERS
      jQuery.each(workflow.positions,function(index,container){
         //Going thru container type
         switch(container.containerType){
            case "input":
               newContainer=new WireIt.TavernaContainerIO({position:[parseFloat(container.position[0])
               ,parseFloat(container.position[1])],
               xtype:"WireIt.TavernaContainerIO",
               containerType:"input",
               label:container.label,
               literalData:container.literalData,
               inputURL:container.inputURL},
               layerEditor);
            break;
            case "output":
               newContainer=new WireIt.TavernaContainerIO({position:[parseFloat(container.position[0]),
               parseFloat(container.position[1])],
               xtype:"WireIt.TavernaContainerIO",
               containerType:"output",
               label:container.label,
               literalData:container.literalData,
               inputURL:container.inputURL},
               layerEditor);
            break;
            default:
               newContainer=new WireIt.TavernaContainer({height:100,width:220,
               xtype:"WireIt.TavernaContainer",
               position:[parseFloat(container.position[0]),parseFloat(container.position[1])],
               label:container.label,
               title:container.label}, 
               layerEditor);
               containerStructure=getContainer(container.label);
               //adding terminals
               //add terminals Inputs
            try {
               inputTerminals=containerStructure.containerInputs;
               addInputTerminals(newContainer,inputTerminals);
            } catch(err) { console.log("No terminal inputs")}
            try {
               outputTerminals=containerStructure.containerOutputs;
               addOutputTerminals(newContainer,outputTerminals);
            } catch(err) {console.log("No terminal output")}
         };//end switch
         layerEditor.containers.push(newContainer);
      });//end for each
      //CREATE WIRES
      //Attention that moduleId need to be a number and not a label
      workflow.wires=replaceLabel2Id(workflow.wires);
      jQuery.each(workflow.wires,function(idx,wires){layerEditor.addWire(wires)});
      if ($(".panel#workspacePanel").is(":visible")){$("a#workspaceMenu").trigger("click")};
   }; //end cleaning+ layer regeneration 
} //end of generateLayerContent()

function storeWorkflow(){

   //List of all saved object key: savedWorkflow
   jsonToSave=getJSONWorkflow();
   saveName=$("input[id=inputNameSave]").val();
   //$.jStorage.set(saveName,jsonToSave);
   var currentTime=new Date();
   date=currentTime.toLocaleDateString();
   time=currentTime.toLocaleTimeString();

   savedWF=$.jStorage.get("savedWorkflow")
   if (savedWF){
      savedWF.push([saveName,date+" "+time]);
   } else {
      savedWF=new Array();
      savedWF.push([saveName,date+" "+time]);
   }

   $.jStorage.set("savedWorkflow",savedWF);
   oTable.fnAddData([saveName,date+" "+time]);

   //Saving the actual JSON object
   $.jStorage.set(saveName,jsonToSave);
}
var wireitdraggableelementbody = false;

var current_scale = 1;
var global_term_list  = [];
var global_service_resources = [];
var currentProgressBar = 0;
var is_hovering_line = false;

function updateGlobalTerminals(terminal) {
   var i = 0;
   if(terminal.dd._domRef) {
   } else {
      return false;
   }
   var found = false;
   for(i = 0; i < global_term_list.length; i++) {
      if(global_term_list[i].dd._domRef == terminal.dd._domRef) {
         found = true;
      }
   }
   if(found) {
      //Do nothing
   } else {
      global_term_list[global_term_list.length] = terminal;
   }
   return false;
}
function refreshDragElements() {
   $('.WireIt-Draggable-Element').draggable();
}
$(document).ready(function(){
   $('.WireIt-Draggable-Element').live('mouseover', function() {
      if($(this).hasClass('Draggable_enabled')) {
         return false;
      }
      $(this).draggable().addClass('Draggable_enabled');
   });
   //starting conditions:
   //$("li.nestedList").toggleClass("active",false);	
   //necessay or the li.addHTTP is displaid when the WSDLbutton is clicked

   /* TRIGGERS */
   //if panel is open then close all other panels
   $("#wsdlPanel").bind("isOpen",panelOpen);
   //the workspacePanel requires the jQuery table plugin
   $("#workspacePanel").bind("isOpen",panelOpen);
   $("#servicePanel").bind("isOpen",panelOpen);
   $("#ioPanel").bind("isOpen",panelOpen);
   $("#exportPanel").bind("isOpen",panelOpen);

   /* DROPPABLE */
   $(".dropBox").droppable({accept:".serviceLi",drop: function(event,ui){
      //console.log(ui.draggable);
      movedBox=$(ui.draggable).clone()
      $(this).append(movedBox);
      //after append disolve and remove !!!
      movedBox.fadeOut("slow");
   }});

   //CENTER LAYER MAP DIV
   //window or document height ?!

   leftMargin=parseInt($("a.trigger").css("width"))+100; //panels
   rightMargin=300; //service list
   topMargin=50; //title etc
   
   layerWidth=$(document).width()- leftMargin-rightMargin;
   layerHeight=$(document).height()- topMargin;

   $(".layer").css({'width': layerWidth, 
      'height': layerHeight, 
      'top': topMargin,
      'left':leftMargin
   });
   layerEditor = new WireIt.Layer({
      layerMap: false,
      parentEl:$(".layer")[0]
   });
   $("#wsdlPanel").wsdlPlugin(options={'defaultWSDL': wsdlURL});
   $("#workspacePanel").workspacePlugin(options={});
   $("#ioPanel").ioPlugin(options={'droppableEl':layerEditor,acceptableEl:".ioContainer"});
   $("#exportPanel").exportPlugin(options={});
   parseWSDL(wsdlURL, function(arrayContainers) {
      $("#servicePanel").servicePlugin(options={'containers':arrayContainers,'droppableEl':layerEditor,acceptableEl:".serviceLi"});
   }, function(val, max) {
      if(val == -1) {
         $('.emuis_loading_progressbar').progressbar({value: 100});
         $('.hex-container').addClass('hex-container-zoomed');
         setTimeout(function($this) {
            $('.eumis_loading_screen').animate({'opacity': 0}, 750, function() {
               if(!$this) {$this = $(this);}
               $this.hide();
            });
         }, 2500, $this);
      } else {
            $('.emuis_loading_progressbar').progressbar({value: (val / max) * 100});
      }
   });
   var wireit_nondrag_items = '.WireIt-Draggable-Element .body, .WireIt-Draggable-Element .WireIt-Container-resizehandle, .WireIt-Draggable-Element .WireIt-Terminal-Input-Taverna, .WireIt-Draggable-Element .WireIt-Terminal-Output-Taverna, .WireIt-Draggable-Element span';
   $(wireit_nondrag_items).live('mousedown', function() {wireitdraggableelementbody = true;});
   $(wireit_nondrag_items).live('mouseenter', function() {wireitdraggableelementbody = true;});
   $(wireit_nondrag_items).live('mouseup', function() {wireitdraggableelementbody = false;});
   $(wireit_nondrag_items).live('mouseleave', function() {wireitdraggableelementbody = false;});
   $('.emuis_loading_progressbar').progressbar({value: 0});
   $('.WireIt-Wire').live('mouseup', function(e) {
      $(this).attr('id', 'tempCanvasIdentifier');
      var c = document.getElementById('tempCanvasIdentifier');
      $(this).attr('id', '');
      var ctx = c.getContext("2d");
      var offset = $(this).offset();
      var x = e.pageX - offset.left;
      var y = e.pageY - offset.top;
      var imgd = ctx.getImageData(x, y, 1, 1);
      var pix = imgd.data;
      is_hovering_line = false;
      if(pix[3] > 0) {
         is_hovering_line = true;
         $('.WireIt-Container').removeClass('WireIt-Container-focused');
      }
   });
   $('.WireIt-Wire').live('dblclick', function(e) {
      return false;
      $(this).attr('id', 'tempCanvasIdentifier');
      var c = document.getElementById('tempCanvasIdentifier');
      $(this).attr('id', '');
      var ctx = c.getContext("2d");
      var offset = $(this).offset();
      var x = e.pageX - offset.left;
      var y = e.pageY - offset.top;
      var imgd = ctx.getImageData(x, y, 1, 1);
      var pix = imgd.data;
      if(pix[3] > 0) {
         imgd = ctx.getImageData(x, y, $(this).width(), $(this).height());
         var imgd_hl = imgd;
         var i = 0;
         var k = 0;
         $.each(imgd.data, function(index, value) {
            //console.log(index);

            
            switch(i) {
               case 3: //Alpha
                  i = -1;
                  a = imgd.data[index];
                  if(a > 0) {
                     imgd.data[index] = 255;
                  }
               break;
            }
            k++;
            i++;
         });
         //console.log(imgd);
         ctx.putImageData(imgd, 0, 0);
         /*setTimeout(function(imgd, imgd_hl, ctx) {
            console.log(imgd);
            console.log(imgd_hl);
            var original_imgd = imgd;
            setTimeout(function(imgd, imgd_hl, ctx) {
               imgd.data = imgd_hl;
               console.log(imgd);
               ctx.putImageData(imgd, 0, 0);
               return false;
            }, 200, imgd, imgd_hl, ctx);
            return false;
            ctx.putImageData(imgd_hl, 0, 0);
         }, 200, imgd, imgd_hl, ctx);*/
      }
   });
   $("body").live('mousemove', function(e) {
      var x = e.clientX;
      var y = e.clientY;
      var hovered = [];
      var multiplier = 1;
      if(current_scale == 0.75) {
         multiplier =1.333;
      }
      if(current_scale == 0.5) {
         multiplier = 2;
      }
      if(current_scale == 0.25) {
         multiplier = 4;
      }
      x = (x * multiplier) - (190 * multiplier);
      y = (y *  multiplier) - (50 * multiplier);
      //$('.temp_canvas_test').css({left: (x * multiplier) - (190 * multiplier), top: (y *  multiplier) - (50 * multiplier), width: '20px', height: '20px'});
      $.each($('.WireIt-Wire'), function(index, value) {
         var $this = $(this);
         $this.attr('id', 'tempCanvasIdentifier');
         var c = document.getElementById('tempCanvasIdentifier');
         $this.attr('id', '');
         var ctx = c.getContext("2d");
         var offset = $(this).offset();
         var imgd = ctx.getImageData(x - parseInt($(this).css('left')), y - parseInt($(this).css('top')), 1, 1);
         var pix = imgd.data;
         if(pix[3] > 0) {
            hovered[hovered.length] = $(this);
            //console.log(pix[3]);
         }
      });
      if(hovered.length > 0) {
         $('.WireIt-Wire').css('opacity', 0.4);
         $.each(hovered, function(index, value) {
            value.css('opacity', 1);
         });
      } else {
         $('.WireIt-Wire').css('opacity', 0.6);
      }
   });
   $('.WireIt-Wire').live('mousemove', function(e) {
      /*var $this = $(this);
      $this.attr('id', 'tempCanvasIdentifier').addClass('highlighting');
      var c = document.getElementById('tempCanvasIdentifier');
      $this.attr('id', '');
      var ctx = c.getContext("2d");
      var offset = $(this).offset();
      var x = e.pageX - offset.left;
      var y = e.pageY - offset.top;
      var imgd = ctx.getImageData(x, y, 1, 1);
      var pix = imgd.data;
      //console.log(pix[3]);
      if(pix[3] > 0) {
         //$('.WireIt-Container').removeClass('WireIt-Container-focused');
         $this.css('opacity', 1);
         $('.WireIt-Wire').each(function(index, value) {
            //if(value !== $this) {
            if(!$(value).hasClass('highlighting')) {
               $(this).css('opacity', 0.4);
            }
         });
      } else {
         $('.WireIt-Wire').css('opacity', 0.4);
         console.log(x);
         (function(x, y) {
            $.each($('.WireIt-Wire'), function(index, value) {
               var offset = $(this).offset();
               var imgd = ctx.getImageData(x - offset.left, y - offset.top, 1, 1);
               var pix = imgd.data;
               if(pix[3] > 0) {
                  $(this).css('opacity',1);
               }
            });
         });
         $('.WireIt-Wire').css('opacity', 1);
      }
      $this.removeClass('highlighting');*/
   });
   $('.WireIt-Wire').live('mouseleave', function(e) {
      var $this = $(this);
      $('.WireIt-Wire').css('opacity', 1);
   });
   $('.WireIt-Container-ddhandle').live('dblclick', function() {
      var $this = $(this).parents('.WireIt-Container');
      if($this.hasClass('collapsed')) {
         // Uncollapse container
         $this.find('.WireIt-Terminal-Input-Taverna, .WireIt-Terminal-Output-Taverna').each(function(index, value) {
            $(this).css('top', $(this).attr('rel_top'));
            $(this).css('opacity', 1);
            $(this).css('z-index', 6);
         });
         $(this).parent().height($(this).attr('rel_height'));
         $(this).css({
            '-webkit-border-radius': '13px 13px 0 0',
            '-moz-border-radius': '13px 13px 0 0',
            '-ms-border-radius': '13px 13px 0 0',
            '-o-border-radius': '13px 13px 0 0',
            'border-radius': '13px 13px 0 0'
         });
         $this.find('.body').css('display', 'block');
         $this.removeClass('collapsed');
      } else {
         // Collapse container
         $this.addClass('collapsed');
         $(this).parent().attr('rel_height', $(this).parent().height());
         $this.find('.WireIt-Terminal-Input-Taverna, .WireIt-Terminal-Output-Taverna').each(function(index, value) {
            $(this).attr('rel_top', $(this).css('top'));
            $(this).css('top', 0);
            $(this).css('opacity', 0);
            $(this).css('z-index', -10);
         });
         $(this).css({
            '-webkit-border-radius': '13px 13px 9px 8px',
            '-moz-border-radius': '13px 13px 9px 8px',
            '-ms-border-radius': '13px 13px 9px 8px',
            '-o-border-radius': '13px 13px 9px 8px',
            'border-radius': '13px 13px 9px 8px'
         });
         $(this).parent().height($(this).height());
         $this.find('.body').css('display', 'none');
      }
      redraw_all_wires();
   });
   $('.WireIt-Container-ddhandle').live('mousemove', function() {
   });
   $('.scale_zoom .slider').slider({
      min: -3,
      max: 0,
      change: function(event, ui) {
         var value = (ui.value >= 0) ? ui.value + 1 : ui.value;

         switch(ui.value) {
            case 3:
               value = 1.75;
            break;
            case 2:
               value = 1.5;
            break;
            case 1:
               value = 1.25;
            break;
            case 0:
               value = 1;
            break;
            case -1:
               value = 0.75;
            break;
            case -2:
               value = 0.5;
            break;
            case -3:
               value = 0.25;
            break;
            default:
               value = 1;
            break;
         }
         current_scale = value;
         $('.WireIt-Layer').css({
            'zoom': value,
            '-webkit-transform': 'scale(' + value + ')',
            '-moz-transform': 'scale(' + value + ')',
            '-ms-transform': 'scale(' + value + ')',
            '-o-transform': 'scale(' + value + ')',
            'transform': 'scale(' + value + ')',
         });
         $(window).trigger('resize');
      }
   });
   $(window).keypress(function(e) {
      console.log(e);
      switch(e.keyCode) {
         case 112://F1
            //Load help menu
            load_help_menu();
            return false;
         break;
      }
   });
   $(window, document).resize(function() {
      $('.scale_zoom').css({
         'left':  ((($(window).width() - 200 ) > 0) ? $(window).width() - 200  : 0) + 'px',
         'top':   ((($(window).height() - 40) > 0) ? $(window).height() - 40 : 0) + 'px',
      });
      $('.layer').css({
         'width':   ((($(window).width() - 190 ) > 0) ? $(window).width() - 190  : 0) + 'px',
         'height': ((($(window).height() - 50) > 0) ? $(window).height() - 50 : 0) + 'px',
      });
      var $scale = (
         (current_scale == 1) ? 100 : (
         (current_scale == 0.25) ? 400 : (
         (current_scale == 0.5) ? 200 : (
         (current_scale == 0.75) ? 133.3 : (
         (current_scale == 0) ? 100 : (
         0
      ))))));
      var $margin = (
         (current_scale == 1) ? 0 : (
         (current_scale == 0.25) ? 2.666 : (
         (current_scale == 0.5) ? 4 : (
         (current_scale == 0.75) ? 8 : (
         (current_scale == 0) ? 0 : (
         0
      ))))));
      var Infinity = 0;
      var width = ((($('.layer').width() / 100) * $scale));
      var height = ((($('.layer').height() / 100) * $scale));
      var left = -((($('.layer').width() / 100) * $scale) / $margin);
      var top = -((($('.layer').height() / 100) * $scale) / $margin);
      if(current_scale == 1) {
         left = 0;
         top = 0;
      }
      $('.WireIt-Layer').css({
         'width':      width + 'px',
         'left':          left + 'px',
         'height':    height + 'px',
         'top':          top + 'px'
      });
      $('#servicePanel, #exportPanel, #ioPanel').css({'height':$(window).height() - 42});
      $('#workspacePanel').css({'top': (parseInt($('#linkGroup').css('top')) + $('#linkGroup').height()) + 'px'});
      $('#wsdlPanel').css({'top': (parseInt($('#linkGroup').css('top')) + $('#linkGroup').height()) + 'px'});
      //console.log(((($('.layer').width() / 100) * $scale) / $margin) + 1);
   });
   $('.layer').bind('mousewheel', function(e, d) {
      var slider_val = $('.scale_zoom .slider').slider('value');
      switch(slider_val) {
         case 0:
            slider_val = (d == 1) ? 0 : (d == -1) ? -1 : slider_val;
         break;
         case -1:
            slider_val = (d == 1) ? 0 : (d == -1) ? -2 : slider_val;
         break;
         case -2:
            slider_val = (d == 1) ? -1 : (d == -1) ? -3 : slider_val;
         break;
         case -3:
            slider_val = (d == 1) ? -2 : (d == -1) ? -3 : slider_val;
         break;
         default:
         break;
      }
      $('.scale_zoom .slider').slider({'value': slider_val});
   });
   $(".layer").bind('click', function(e) {
      if(is_hovering_line) {
         return false;
      }
      var x = e.pageX - $(this).offset().left;
      var y = e.pageY - $(this).offset().top;
      var elements = $('.WireIt-Container');
      var z_element = null;
      var last_z = -100;
      $.each(elements, function(index, value) {
         value = $(value);
         if(parseInt(value.css('top')) <= y && parseInt(value.css('left')) <= x && ((parseInt(value.css('top')) + 14) + value.height()) > y && (parseInt(value.css('left')) + value.width()) > x) {
         console.log(value.css('z-index'));
            if(value.css('z-index') > last_z) {
               z_element = value;
            }
         }
      });
      if(z_element !== null && z_element.length > 0) {
         elements.removeClass("WireIt-Container-focused");
         z_element.addClass("WireIt-Container-focused").find('.body').trigger('click');
      }
      //console.log(z_element);
   });
   $(".layer").contextMenu({
      menu: 'myMenu'
   }, function(action, el, pos) {
      switch(action) {
         case 'collapse_all':
            var ddHandlers = $('.WireIt-Container-ddhandle');
            $.each(ddHandlers, function(index, value) {
               if(!$(value).parent().hasClass('collapsed')) {
                  $(value).trigger('dblclick');
               }
            });
         break;
         case 'expand_all':
            var ddHandlers = $('.WireIt-Container-ddhandle');
            $.each(ddHandlers, function(index, value) {
               if($(value).parent().hasClass('collapsed')) {
                  $(value).trigger('dblclick');
               }
            });
         break;
         default:
         alert(
            'Action: ' + action + '\n\n' +
            'Element ID: ' + $(el).attr('id') + '\n\n' + 
            'X: ' + pos.x + '  Y: ' + pos.y + ' (relative to element)\n\n' + 
            'X: ' + pos.docX + '  Y: ' + pos.docY+ ' (relative to document)'
         );
         break;
      }
   });
   //$('.WireIt-Layer').append($('<div class="temp_canvas_test" style="width:0;height:0;position:absolute;left:0;top:0;background:orange;"></div>'));
   /*$('.serviceListSearchFilter select').live('change', function() {
      $('.emuis_loading_progressbar').progressbar({value: 0});
      $('.hex-container').removeClass('hex-container-zoomed');
      $('.eumis_loading_screen').css({'display': 'block', 'opacity': 1});
      parseWSDL($(this).value(), function(arrayContainers) {
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
   });*/
   $('.serviceListSearchFilter input').live('keyup', function() {
      var service_items = $('#serviceList .ui-draggable');
      var $this = $(this);
      $.each(service_items, function(index, value) {
         var serviceLi = $($(value).html());
         serviceLi = $(value).text().substring(0, $(value).text().length - serviceLi.text().length);
         //console.log($(serviceLi).text());
         //console.log($(serviceLi).find('ul').remove());
         //serviceLi = $(serviceLi).text();
         //console.log(serviceLi);
         /*console.log(serviceLi);
         console.log(serviceLi.toLowerCase());
         console.log($this.val().toLowerCase());
         console.log(strpos(serviceLi.toLowerCase(), $this.val().toLowerCase(), 0));
         console.log($(value));*/
         $(value).css({'display': ((strpos(serviceLi.toLowerCase(), $this.val().toLowerCase(), 0) === false) ? 'none' : 'block')});
      });
   });
   $('.WireIt-ddHandle-Help').live('click', function() {
   });
   $(window).trigger('resize');
   updateProgressBar(1);
   spinHex(false, 0);
   //$('.hex').animate({'left': '800px'}, {duration:45000});
}); //end of ready
function spinHex(working, deg) {
   var timeOut = 8000;
   setTimeout(function(deg) {
      $('.hex').rotate3Di(deg, 0);
      if(deg == 180) {
         deg = -18;
      }
      spinHex(true, (deg + 18));
   }, timeOut / 100, deg);
}
function updateProgressBar(left) {
   $('.eumis_update_progressbar_handler').animate({'left': left + 'px'}, {
      duration:45000,
      step: function(currentLeft) {
         var $hex = $('.hex-container');
         if($('.hex-container-zoomed').length > 0 && !$hex.hasClass('animating')) {
         
            $hex.removeClass('animating').css({
                  'left': '130px',
                  'top': '25px'
            });
            /*if(parseInt($hex.css('left')) !== 130 || parseInt($hex.css('top')) !== 25) {
               $hex.addClass('animating');
               $hex.animate({
                  'left': '130px',
                  'top': '25px'
               }, 2000, function() {
                  $hex.removeClass('animating');
               });
            }*/
         } else {
            var loading_block = $('.eumis_loading_block');
            $hex.removeClass('animating').css({
               'left': loading_block.offset().left + 15,
               'top': loading_block.offset().top + 130
            });
         }
         $('.emuis_loading_progressbar div').css({'display': 'block', 'width': currentProgressBar + '%'});//progressbar({'value': currentProgressBar});
         if(currentProgressBar == 100) {
         }
      },
      complete: function() {
         updateProgressBar((left == 1) ? 0 : 1);
      }
   });
}
function load_help_menu() {
   var $this = $('.f1_help_screen');
   if($this.hasClass('animating')) {
      return false;
   }
   $this.addClass('animating');
   if($this.hasClass('expanded')) {
      $this.css({'opacity': 1, 'display': 'block'}).animate({'opacity': 0}, 400, function() {


         $this.removeClass('expanded').removeClass('animating').hide();;
      });
   } else {
      $this.css({'opacity': 0, 'display': 'block'}).animate({'opacity': 1}, 400, function() {
         $this.addClass('expanded').removeClass('animating');
      });
   }
   return false;
}
function redraw_all_wires() {
   for(var i = 0 ; i < global_term_list.length ; i++) {
      global_term_list[i].redrawAllWires();
   }
}
function strpos (haystack, needle, offset) {
  var i = (haystack+'').indexOf(needle, (offset || 0));
  return i === -1 ? false : i;
}
//Adding dummy saved data
savedWFData=$.jStorage.get("savedWorkflow");
if (savedWFData){
      //there was something saved
      savedWorkFlows=$.jStorage.get("savedWorkflow")
} else {
   //nothing everything is clean
   savedWorkFlows=null;
}

function upb(prog_callback, arrLength, counter) {
   //alert(arrLength + " - " + counter);
   setTimeout(function(prog_callback, arrLength, counter) {
      if(prog_callback) {
         prog_callback(counter, arrLength);
      }
   }, 0, prog_callback, counter, arrLength);
}

//Dealing with click on transparent canvas
/*$("canvas.WireIt-Wire").live('click',function(e){
   var clickPoint=new Object()
   clickPoint.x=e.pageX
   clickPoint.y=e.pageY
   
   //$(".WireIt-Container").map(function(){return getContainerCoord(this)})
   $(".WireIt-Container").each(function(){
      rect=getContainerCoord(this);
      if (isPointInside(clickPoint,rect)){$(this).addClass("WireIt-Container-focused");};
})});*/