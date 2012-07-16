/**
 * The Taverna container widget
 * @class TavernaContainer
 * @namespace WireIt
 * @extends WireIt.Container
 * @constructor
 * @param {Object} options
 * @param {WireIt.Layer} layer
 */

WireIt.TavernaContainer = function(options, layer) {
   WireIt.TavernaContainer.superclass.constructor.call(this, options, layer);
   //The closeButton isnt working, better to extend it
   var this_container=this;
   $(this.closeButton).click(function(e){this_container.remove()})
   
   /**
    * Event that is fired when a terminal is added
    * You can register this event with myContainer.eventAddTerminal.subscribe(function(e,params) { var wire=params[0];}, scope);
    * @event eventAddTerminal
    */
   this.eventAddTerminal = new YAHOO.util.CustomEvent("eventAddTerminal"); 
   this.eventAddTerminal.subscribe(function(e,options) {this_container.accomTerminals()});
   //prevent text selection in input/output text
   $(this.bodyEl).parent().disableSelection();
   

};
YAHOO.lang.extend(WireIt.TavernaContainer, WireIt.Container, {
	/**
	 * It extends the size of container to accomodate for added terminals
	 */
	 accomTerminals: function (){
		//getting last terminal
		var terminals=this.terminals;
		var lastTerminal=terminals[terminals.length-1];
		if (lastTerminal==null){return};
		var terminalYOffset=lastTerminal.offsetPosition[1];
		var newBoxHeigth=terminalYOffset+20;
		this.bodyEl.style.height= String(newBoxHeigth+"px");                  
		}
});




//YAHOO.lang.augmentObject(WireIt.TavernaContainer,WireIt.Container.addons);

