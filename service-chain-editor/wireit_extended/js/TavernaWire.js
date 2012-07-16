/**
 * The Taverna wire widget
 * @class TavernaWire
 * @namespace WireIt
 * @extends WireIt.BezierArrowWire
 * @constructor
 * @param  {WireIt.Terminal}    terminal1   Source terminal
 * @param  {WireIt.Terminal}    terminal2   Target terminal
 * @param  {HTMLElement} parentEl    Container of the CANVAS tag
 * @param  {Obj}                options      Wire configuration (see properties)
 */

WireIt.TavernaWire = function( terminal1, terminal2, parentEl, options) {
	WireIt.TavernaWire.superclass.constructor.call(this, terminal1, terminal2, parentEl, options);
};

YAHOO.lang.extend(WireIt.TavernaWire, WireIt.BezierArrowWire, {
	/** 
    * @property xtype
    * @description String representing this class for exporting as JSON
    * @default "WireIt.TavernaWire"
    * @type String
    */
   xtype: "WireIt.TavernaWire",
   
   /** 
    * @property color
    * @description Wire color
    * @default 'rgb(0, 0, 0)'
    * @type String
    */
	color: 'rgb(0, 0, 0)',
   
	/** 
	 * @property bordercolor
	 * @description Border color
	 * @default '#000000'
	 * @type String
	 */
	bordercolor: '#000000'
   });