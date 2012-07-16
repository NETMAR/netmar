/*global YAHOO */
/**
 * Class that extends TerminalOutput with specific CSS and that mimics Taverna 
 * @class WireIt.util.TerminalOutputTaverna
 * @extends WireIt.util.TerminalOutput
 * @constructor
 * @param {HTMLElement} parentEl Parent dom element
 * @param {Object} options configuration object
 * @param {WireIt.Container} container (Optional) Container containing this terminal
 */
WireIt.util.TerminalOutputTaverna = function(parentEl, options, container) {
	
	WireIt.util.TerminalOutputTaverna.superclass.constructor.call(this,parentEl, options, container);
    if (options.hasOwnProperty('label')) {this.setLabel()}
};
YAHOO.lang.extend(WireIt.util.TerminalOutputTaverna, WireIt.util.TerminalOutput, {

	/** 
    * @property xtype
    * @description String representing this class for exporting as JSON
    * @default "WireIt.TerminalInputTaverna"
    * @type String
    */
   xtype: "WireIt.TerminalOutputTaverna",
   /** 
    * @property className
    * @description CSS class name for the terminal element
    * @default "WireIt-Terminal-Output-Taverna"
    * @type String
    */
	className: "WireIt-Terminal-Output-Taverna",
	
	/** 
	 * @property connectedClassName
	 * @description CSS class added to the terminal when it is connected
	 * @default "WireIt-Terminal-Output-Taverna-connected"
	 * @type String
	 */
	connectedClassName: "WireIt-Terminal-Output-Taverna-connected",
		
	/** 
	 * @property dropinviteClassName
	 * @description CSS class added for drop invitation
	 * @default "WireIt-Terminal-Output-Taverna-dropinvite"
	 * @type String
	 */
	dropinviteClassName: "WireIt-Terminal-Output-Taverna-dropinvite",
	
	 /**
	 * @property labelClassName
	 * @description CSS class used for the terminal label
	 * @default "WireIt-Terminal-Input-Taverna-label"
	 * @type String 
	 */
	labelClassName: "WireIt-Terminal-Output-Taverna-label",
	
	/**
	 * @method setLabel
	 * @param {String} function()
	 */
	setLabel: function(){
		//sets the label property based on the labelClassName
		var newLabel=document.createElement('span');
		newLabel.setAttribute("class",this.labelClassName);
		var textLabel= document.createTextNode(String(this.label));
		newLabel.appendChild(textLabel);
		this.el.appendChild(newLabel);
		
		//set the label pos right(label.width+30px[image terminal size] )
		$(newLabel).css("right",$(newLabel).width()+30);
		
		//ajust container size
		//Input/Output container dont have this event (it's not needed) 
		try {
			this.container.eventAddTerminal.fire();
		}
		catch(err){
			//console.log(err) 
			}
	} //end of set label

});