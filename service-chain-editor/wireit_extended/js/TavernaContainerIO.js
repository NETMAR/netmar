/**
 * The Taverna container widget
 * @class TavernaContainerInput
 * @namespace WireIt
 * @extends WireIt.CanvasContainer
 * @constructor
 * @param {Object} options
 * @param {WireIt.Layer} layer
 */
var CSS_PREFIX = "WireIt-";


WireIt.TavernaContainerIO = function(options, layer) {
   WireIt.TavernaContainerIO.superclass.constructor.call(this, options, layer);

   //The closeButton isnt working, better to extend it
   var thisContainer=this;
   $(this.closeButton).click(function(e){thisContainer.remove()})
   
 // this.redrawCanvas()
   
   //add according to containerType (default containerType: input)
   switch (this.containerType){
   case 'input':
	   this.addTerminal({label:"",xtype:"WireIt.util.TerminalOutputTaverna",offsetPosition:[40,10],wireConfig:{xtype:"WireIt.TavernaWire"}});
	   break;
   case 'output':
	   this.addTerminal({label:"",xtype:"WireIt.util.TerminalInputTaverna",offsetPosition:[40,10],nMaxWires:100,wireConfig:{xtype:"WireIt.TavernaWire"}});
	   break;
   case 'inputGIS':
	   this.addTerminal({label:"",xtype:"WireIt.util.TerminalOutputGISTaverna",offsetPosition:[40,10],wireConfig:{xtype:"WireIt.TavernaWire"}});
	   break;
   case 'outputGIS':
	   this.addTerminal({label:"",xtype:"WireIt.util.TerminalInputGISTaverna", nMaxWires:100,offsetPosition:[40,10],wireConfig:{xtype:"WireIt.TavernaWire"}});
	   break;
   default:
	break;
   } //end of switch_this.containerType
   /*
   if (this.containerType=="input"){
	   this.addTerminal({label:"",xtype:"WireIt.util.TerminalOutputTaverna",offsetPosition:[40,10],wireConfig:{xtype:"WireIt.TavernaWire"}});
   } else { //output container
	   this.addTerminal({label:"",xtype:"WireIt.util.TerminalInputTaverna",offsetPosition:[40,10],wireConfig:{xtype:"WireIt.TavernaWire"}});
   };
   */
   //add edit button, it also changes the label
   this.drawEditButton();
   
   this.makeLabel();
   
   
   
   

};
YAHOO.lang.extend(WireIt.TavernaContainerIO, WireIt.CanvasContainer, {
/** 
* @property width
* @description initial width of the container
* @default 50
* @type Integer
*/
width: 50,
		
/** 
* @property height
* @description initial height of the container
* @default 45
* @type Integer
*/
height: 50,
	
/** 
* @property editButtonClassName
* @description CSS class name for the edit button
* @default "WireIt-Container-editbutton"
* @type String
*/
editButtonClassName: CSS_PREFIX+"Container-editbutton",
			
	
/** 
* @property className
* @description CSS class name for the container element
* @default "WireIt-TavernaContainerInput"
* @type String
*/	
className: "WireIt-Container WireIt-CanvasContainer WireIt-TavernaContainerIO",

/**
 * @property editButton
 * @description edit button to edit input/output
 * @default True
 * @type Boolean
 */
editButton:true,

/**
 * @property literalData
 * @description user input data literalData
 * @default null
 * @type String
 */
literalData:null,


/**
 * @property inputURL
 * @description user input data URL
 * @default null
 * @type URL
 */
inputURL:null,

/**
 * @property label
 * @description label to be used to identifiy input container
 * @default null
 * @type String
 */
label:null,

/**
 * @property containerType
 * @description containerType will define if the sort of terminal to be added, containerType==input will make terminal output 
 * @default null
 * @type String
 */
containerType:"input",

drawEditButton: function(){
	if (this.editButton){
		
		this.editButton = WireIt.cn('div', {className: this.editButtonClassName} );
		//drag and drop handle ??
		if (this.ddHandle) {
			this.ddHandle.appendChild(this.editButton);
			}
		else {
			this.el.appendChild(this.editButton);
		}
		//if we have an editbutton we need to make the form
		form=this.makeForm()

		//make the button clicable
		var thisContainer=this;
		
		$(this.editButton).click(function(e){
			//starting point, is visible the panel will be closed
			//and data wil be parsed
			//this is here different
			//ATTENTION: FORM changes in context cant use the variable aboce when click()
			var containerType=thisContainer.containerType;
			form=Boolean($(thisContainer.bodyEl).siblings(".containerOutputForm").length) ? $(thisContainer.bodyEl).siblings(".containerOutputForm") : $(thisContainer.bodyEl).siblings(".containerInputForm");
			var isVisible=form.is(":visible");
			
			
			form.toggle("slow");
		
			if (isVisible) {
				
				switch (containerType)
				{
				
				case 'input':
					
					thisContainer.inputURL=String(form.find("input#urlContainerInputForm").val());
					thisContainer.literalData=String(form.find("input#literalInputForm").val());
					thisContainer.label=String(form.find("input#labelInputForm").val());
				//No XOR in Javascript: http://www.howtocreate.co.uk/xor.html
				if (Boolean(thisContainer.inputURL) ? !Boolean(thisContainer.literalData) : Boolean(thisContainer.literalData)){
					//different inputs
					
				} else {
				//same input
					if ((thisContainer.inputURL=="") && (thisContainer.literalData=="")){
						//same input BUT empty				
						thisContainer.inputURL=null;
						thisContainer.literalData=null;
					} else {//same input need correction
						//reopen panel put OR in red, recursive
						form.show("slow");
						var orElement=form.find("div#or");
						orElement.css({'color':'red','font-weight':'700'});
					} //end else-if AND
				}//end else-if XOR
			 //change label
				if (Boolean(thisContainer.label)){ thisContainer.changeLabel()}
			   break;
				case 'output':
					thisContainer.label=String(form.find("input#labelOutputForm").val());
					if (Boolean(thisContainer.label)){ thisContainer.changeLabel()};
					break;
				}//end switch	
			}//end isVisivle
			
		});//end of function/click
		
	 }//end of this.editButton
},


/** 
* @description Makes the label structure and appends to container
* @method changeLabel
*/

makeLabel: function(){	
	if (!(this.label)){this.label=this.containerType+String(Math.floor(Math.random()*1100))};
	var label=$("<div class='labelTavernaContainer'>"+this.label+"</div>");
	$(this.bodyEl).before(label);
	
},

/** 
* @description it changes the label of terminal from this.label
* @method changeLabel
*/
changeLabel: function(){
	
	$(this.el).find("div.labelTavernaContainer").html(this.label);

	},


/** 
* @description redraws Canvas with specific TavernaContainerInput attributes
* @method redrawCanvas
*/
drawCanvas: function() {
	/*
	var ctx = this.canvasEl.getContext('2d');
	 
	ctx.strokeStyle = "#FFFFFF"; 
  ctx.lineWidth= 2;

	ctx.save();
	ctx.translate( this.canvasWidth/2, this.canvasHeight/2);
	ctx.scale(this.canvasWidth/2-5, this.canvasHeight/2-5);
	ctx.arc(0, 0, 1, 0, 2*Math.PI, false);
	
	ctx.restore(); // restore so stroke() isn’t scaled
	
	ctx.stroke();
	//ctx.globalAlpha = 0.5;
	ctx.fillStyle = "#FFFFFF"; 
	ctx.fill();
	*/
},
/**
 * @description a DOM structure floating arounf 
 */


makeForm: function (){
	if (this.containerType=="input"){
	var form=$("<div class='containerInputForm'>" +
			"<form NAME='inputContainerURL' ACTION='' METHOD='GET' onsubmit='return false;'> "+
			"<p>Label:<input id='labelInputForm' TYPE='text' NAME='labelInput' VALUE=''></input></p>" +
			"<p>URL:<input id='urlContainerInputForm' TYPE='text' NAME='urlInput' VALUE=''></input></p><div id='or'>OR</div>"+
			"<p>LiteralData: <input id='literalInputForm' TYPE='text' NAME='literalInput' VALUE=''></input></p>"+
			"</form>"+
			"</div>");
	
	} else {
		//containerType=="output"
		var form=$("<div class='containerOutputForm'>" +
				"<form NAME='outputContainerURL' ACTION='' METHOD='GET' onsubmit='return false;'>"+
				"<p>Label:<input id='labelOutputForm' TYPE='text' NAME='labelOutput' VALUE=''></input></p>"+
				"</form>"+
				"</div>");
	}
	form.hide();
	$(this.bodyEl).siblings('div.WireIt-Container-editbutton').after(form);
	return form;
}
		
});


