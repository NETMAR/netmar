/*global YAHOO */
/**
 * Class that extends TerminalInput with specific CSS and that mimics Taverna 
 * @class WireIt.util.TerminalInputGISTaverna
 * @extends WireIt.util.TerminalInputTaverna
 * @constructor
 * @param {HTMLElement} parentEl Parent dom element
 * @param {Object} options configuration object
 * @param {WireIt.Container} container (Optional) Container containing this terminal
 */
WireIt.util.TerminalInputGISTaverna = function(parentEl, options, container) {
   WireIt.util.TerminalInputGISTaverna.superclass.constructor.call(this,parentEl, options, container);
};
//nothing to extend for now :)
YAHOO.lang.extend(WireIt.util.TerminalInputGISTaverna, WireIt.util.TerminalInputTaverna, {
	 /**
	    * @property xtype
	    * @description String representing this class for exporting as JSON
	    * @default "WireIt.TerminalInputTaverna"
	    * @type String
	  */
	   xtype: "WireIt.TerminalInputGISTaverna",
	
	
	   /** 
	    * @property className
	    * @description CSS class name for the terminal element
	    * @default "WireIt-Terminal"
	    * @type String
	    */
	   className: "WireIt-Terminal-Input-Taverna-GIS",

	   /** 
		 * @property connectedClassName
		 * @description CSS class added to the terminal when it is connected
		 * @default "WireIt-connected"
		 * @type String
		 */
		connectedClassName: "WireIt-Terminal-Input-Taverna-GIS-connected",	
		
		/** 
		 * @property dropinviteClassName
		 * @description CSS class added for drop invitation
		 * @default "WireIt-dropinvite"
		 * @type String
		 */
		dropinviteClassName: "WireIt-Terminal-Input-Taverna-GIS-dropinvite",
		
		 /**
		 * @property labelClassName
		 * @description CSS class used for the terminal label
		 * @default "WireIt-Terminal-Input-Taverna-label"
		 * @type String 
		 */
		labelClassName: "WireIt-Terminal-Input-Taverna-GIS-label",
			
});