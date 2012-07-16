/*global YAHOO */
/**
 * Class that extends TerminalInput with specific CSS and that mimics Taverna 
 * @class WireIt.util.TerminalInputTaverna
 * @extends WireIt.util.TerminalInput
 * @constructor
 * @param {HTMLElement} parentEl Parent dom element
 * @param {Object} options configuration object
 * @param {WireIt.Container} container (Optional) Container containing this terminal
 */
WireIt.util.TerminalInputTaverna = function(parentEl, options, container) {
   WireIt.util.TerminalInputTaverna.superclass.constructor.call(this,parentEl, options, container);
   if (options.hasOwnProperty('label')) {this.setLabel()}
   
};
YAHOO.lang.extend(WireIt.util.TerminalInputTaverna, WireIt.util.TerminalInput, {

	
	label: null,
	/** 
    * @property xtype
    * @description String representing this class for exporting as JSON
    * @default "WireIt.TerminalInputTaverna"
    * @type String
    */
   xtype: "WireIt.TerminalInputTaverna",
   
   /** 
    * @property className
    * @description CSS class name for the terminal element
    * @default "WireIt-Terminal"
    * @type String
    */
	className: "WireIt-Terminal-Input-Taverna",
	
	/** 
	 * @property connectedClassName
	 * @description CSS class added to the terminal when it is connected
	 * @default "WireIt-connected"
	 * @type String
	 */
	connectedClassName: "WireIt-Terminal-Input-Taverna-connected",
		
	/** 
	 * @property dropinviteClassName
	 * @description CSS class added for drop invitation
	 * @default "WireIt-dropinvite"
	 * @type String
	 */
	dropinviteClassName: "WireIt-Terminal-Input-Taverna-dropinvite",
	
	 /**
	 * @property labelClassName
	 * @description CSS class used for the terminal label
	 * @default "WireIt-Terminal-Input-Taverna-label"
	 * @type String 
	 */
	labelClassName: "WireIt-Terminal-Input-Taverna-label",
		
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
	} //end of set label


});