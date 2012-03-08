/*
* GENERIC SUPPORT FUNCTIONS
*
*
*/

/*
 *  @param {String} containerLabel
 */

function getContainerByLabel(containerLabel){
	//arrContainer is a global variable
	//console.log(arrContainers)
}

/*
 *  @param {String} containerLabel
 *  @return {Object} WireIt.Container
 */

function getContainer(containerLabel){
//gets container object based on label
	returnObj=null;
	jQuery.each(arrContainers,function(index,obj){if (obj.label==containerLabel){returnObj=obj}})
	return returnObj;
}//end function

/*
 * @param {WireIt.Container} container
 * @return {Array[WireIt.util.TerminalInput]} inputTerminals
 */
function addInputTerminals(container,inputTerminals){
	/*GENERIC PARAMETERS*/
	newXPos=-10 // half the background image, it is to compliate to get the image size
	newYPos=25; //starting YPos of label
	for(var j=inputTerminals.length-1; j>=0; j--){
		//get last terminal position
		if (container.terminals.length==0){
			container.addTerminal({xtype:"WireIt.util.TerminalInputTaverna",label:inputTerminals[j],name:inputTerminals[j], offsetPosition:[newXPos,25],wireConfig: { xtype: "WireIt.TavernaWire"} });
			
		} else {
		newYPos=newContainer.terminals[container.terminals.length-1].offsetPosition[1]+30;
		
		container.addTerminal({xtype:"WireIt.util.TerminalInputTaverna",label:inputTerminals[j],name:inputTerminals[j],offsetPosition:[newXPos,newYPos],wireConfig: { xtype: "WireIt.TavernaWire"} });
		}

		

	}; //for loop for input terminals	
	
}//end of addInputTerminals


/*
 * @param {WireIt.Container} container
 * @return {Array[WireIt.util.TerminalOutput]} outputTerminals
 */
function addOutputTerminals(container,outputTerminals){
	/*GENERIC PARAMETERS*/
	newXPos=newContainer.width-20  // half the background image, it is to compliate to get the image size
	newYPos=25; //starting YPos of label
	for(var j=outputTerminals.length-1; j>=0; j--){
		//get last terminal position
		if (container.terminals.length==0){
			container.addTerminal({xtype:"WireIt.util.TerminalOutputTaverna",label:outputTerminals[j],name:outputTerminals[j], offsetPosition:[newXPos,25],wireConfig: { xtype: "WireIt.TavernaWire"} });
			
		} else {
		newYPos=newContainer.terminals[container.terminals.length-1].offsetPosition[1]+30;
		
		container.addTerminal({xtype:"WireIt.util.TerminalOutputTaverna",label:outputTerminals[j],name:outputTerminals[j],offsetPosition:[newXPos,newYPos],wireConfig: { xtype: "WireIt.TavernaWire"} });
		}

		

	}; //for loop for input terminals	
	
}//end of addInputTerminals


function isPointInside(point,rect){
	//generic point rectangle interception
	//http://stackoverflow.com/questions/2752725/finding-whether-a-point-lies-inside-a-rectangle-or-not
	//point oject with point.x,point.y
	//rect with rect.Ax rect.Ay etc etc ,rect.B,rect.D with
		var x=point.x;
		var y=point.y;

		var ax=rect.Ax;
		var ay=rect.Ay;
		var bx=rect.Bx;
		var by=rect.By;
		var dx=rect.Dx;
		var dy=rect.Dy;

		var bax=bx-ax;
		var bay=by-ay;
		var dax=dx-ax;
		var day=dy-ay;

		if ((x-ax)*bax+(y-ay)*bay<0.0) return false
		if ((x-bx)*bax+(y-by)*bay>0.0) return false
		if ((x-ax)*dax+(y-ay)*day<0.0) return false
		if ((x-dx)*dax+(y-dy)*day>0.0) return false
		return true
	}
	//$(".WireIt-Container").map(function(){return getContainerCoord(this)})
function getContainerCoord(container){
	//function that acept a $object with wireIt container and returns rect.Ax,etc rectAy object
		container=$(container);
		var rect=new Object();
		A=container.offset(); //relative to the document
		rect.Ax=A.left;
		rect.Ay=A.top;
		
		rect.Bx=A.left+container.width();
		rect.By=A.top;
		rect.Dx=A.left;
		rect.Dy=A.top+container.height();

		return rect
	}

	
function getJSONWorkflow(stringify){
		var stringify=(typeof stringify == 'undefined') ? true : stringify 

		//creating JSON object
		//getting WSDL location
		wsdlURL=$("input[name=inputbox]").val();
		
		positions=getJSONStructure();
    	wires=getJSONWires();
    	
    	var date=new Date();
    	
    	var dataArr=date.toLocaleString().split(" ");
    	var monthInt=date.getMonth()+1;
    	//Create month as string
    	if (monthInt<=9) { var monthString="0"+String(monthInt);}else{ var monthString=String(monthInt);}
    	// 2011-08-25 16:03:36.21 BST //
    	//Wed 04 Jan 2012 16:17:30 BST"
    	var dateTaverna=dataArr[3]+"-"+monthString+"-"+dataArr[1]+" "+dataArr[4]+" "+dataArr[5];
		workflow={"wsdlURL":wsdlURL, "positions":positions, "wires":wires,"uuid":UUID.generate(),"date":dateTaverna };
		if (stringify)
		{
			return JSON.stringify(workflow) 
		} else {
			return workflow
		};

};//end function


function getJSONWires(){
	//gets container object based on label
	//NOTE: The wires need to have the xtype of the source/dest container. This is redundat information
	//BUT it helps alot on the t2flow.xslt
		var jsonObj=[];
		if (typeof(layerEditor)=="undefined"){return null};
		var containers=layerEditor.containers
		for (var i=0;i<containers.length;i++){
	      		//loop thur wires
			var wires=containers[i].wires		
			for (var j=0;j<wires.length;j++){
				var containerTypeSrc=null;
				var containerTypeTgt=null;
				if (i==getContainerId(wires[j].terminal2.container.label)){
					continue;
				} else {
					//adding the container type from/to where the wire is going
					//SRC
					
					if (containers[i].xtype=='WireIt.TavernaContainerIO'){
						containerTypeSrc=containers[i].containerType;
					} else {containerTypeSrc=containers[i].xtype};
					
					//TGT
					if (wires[j].terminal2.container.xtype=='WireIt.TavernaContainerIO'){
						
						containerTypeTgt=wires[j].terminal2.container.containerType;
						} else {
						containerTypeTgt=wires[j].terminal2.container.xtype;
						}
					
				jsonObj.push({
				"src":{"moduleId":containers[i].label,"terminal":wires[j].terminal1.name,"xtype":containerTypeSrc},
				"tgt":{"moduleId":wires[j].terminal2.container.label,"terminal":wires[j].terminal2.name,"xtype": containerTypeTgt},
				"xtype": "WireIt.TavernaWire"
				})
				};//end of if
			}
		}//end of container loop
		return jsonObj;
	}//end function

function getJSONStructure(){
		
	//goes thru all the containers and makes a json with label+pos
	//NOTE: We need to add containers's I/O that will be used in the t2flow.xslt
	
	//Example for value and text
	/*
	<e name="value">text</e>

	{
	  "e":{
	    "@name":"value",
	    "#text":"text"
	  }
	}

	<e name="value">text</e>
	*/
		if (typeof(layerEditor)=="undefined"){return null}
		
		var jsonObj=[];
		var containers=layerEditor.containers	
		
		for (var i=0;i < containers.length;i++){
			//QUESTION? should it be only WireIt.TavernaContainerIO why check of input without output ?
			if ((containers[i].xtype=="WireIt.TavernaContainerIO") && (containers[i].containerType=="input" )){
				//Input/Output
				jsonObj.push(
						{label: containers[i].label,
							containerType: containers[i].containerType,
							xtype: containers[i].xtype,
							inputURL:containers[i].inputURL,
							literalData:containers[i].literalData,
						 position: [$(layerEditor.containers[i].bodyEl).parent()[0].style.left,
							    $(layerEditor.containers[i].bodyEl).parent()[0].style.top]
						})
			} 
			else {
				//Getting terminals (to determine container's I/O)
				var inputTerminals=[];
				var outputTerminals=[];

				//loop thru terminals
				containerTerminals=containers[i].terminals
				for (var l=0;l<containerTerminals.length;l++){
					var isTerminalConnected="false";
					if (containerTerminals[l].ddConfig.type=="input"){
						containers[0].terminals[1].wires.length
						if (containerTerminals[l].wires.length==0){isTerminalConnected="false"} else {isTerminalConnected="true"}
						inputTerminals.push({"@isConnected":isTerminalConnected,"#text":containerTerminals[l].name});
						
					} //endif input
					if (containerTerminals[l].ddConfig.type=="output"){
						if (containerTerminals[l].wires.length==0){isTerminalConnected="false"} else {isTerminalConnected="true"}
							outputTerminals.push({"@isConnected":isTerminalConnected,"#text":containerTerminals[l].name});
					} //endif output
				}//end for
			
					
				
			jsonObj.push(
			{label: containers[i].label,
				"inputTerminals":inputTerminals,
				"outputTerminals":outputTerminals,
				containerType: containers[i].containerType,
				xtype: containers[i].xtype,
			 position: [$(layerEditor.containers[i].bodyEl).parent()[0].style.left,
				    $(layerEditor.containers[i].bodyEl).parent()[0].style.top]
			})
			} //end of if container xtype
		} //end of for
		return jsonObj
	}

function getContainerId(containerLabel){
	//gets container object based on label
		if (typeof(layerEditor)=="undefined"){return null};
		var containers=layerEditor.containers
		for (var i=0;i<containers.length;i++){
	      		if (containers[i].label==containerLabel){
				return i
			}
		}
		return null;
	}//end function
function getTerminal(terminalName,containerLabel){
		//gets the terminal from a certain container with label x and by terminal name
		//containers should have an id or name
			if (typeof(demoLayer)=="undefined"){return null}
			container=getContainer(containerLabel);
			terminals=container.terminals
			for (var i=0;i<terminals.length;i++){
				if (terminals[i].name==terminalName){
					return terminals[i]
				}
		};
			return null	
	}


function getJSONWiresId(){
	//gets container object based on label
		var jsonObj=[];
		if (typeof(demoLayer)=="undefined"){return null};
		var containers=demoLayer.containers
		for (var i=0;i<containers.length;i++){
	      		//loop thur wires
			var wires=containers[i].wires		
			for (var j=0;j<wires.length;j++){
				//there is a rep of wires, due to the algorithm this appears as moduleId being always equal
				if (i==getContainerId(wires[j].terminal2.container.label)){
					continue;
				} else {
					jsonObj.push({
					"src":{"moduleId":i,"terminal":wires[j].terminal1.name},
					"tgt":{"moduleId":getContainerId(wires[j].terminal2.container.label),"terminal":wires[j].terminal2.name},
					"xtype": "WireIt.TavernaWire"
				})
				}//end if
			}//end for wire
		}//end of container loop
		return jsonObj;
	}//end function

function replaceLabel2Id(jsonObj){
	for (var i=0;i<jsonObj.length;i++){
		//go thru the object
		jsonObj[i].src.moduleId=translateLabel2Id(jsonObj[i].src.moduleId);
		jsonObj[i].tgt.moduleId=translateLabel2Id(jsonObj[i].tgt.moduleId);
	}
	return jsonObj
}// end replace Label
function translateLabel2Id(label){
	//retursn module ID (numeric position in array) from label 
	var containers=layerEditor.containers
	for (var i=0;i<containers.length;i++){
		if (containers[i].label==label){
			return i
		}
	}
	return null;
	} //end function


/* Get the table rows which are currently selected */
function fnGetSelected( oTableLocal )
{
	var aReturn = new Array();
	var aTrs = oTableLocal.fnGetNodes();
	
	for ( var i=0 ; i<aTrs.length ; i++ )
	{
		if ( $(aTrs[i]).hasClass('row_selected') )
		{
			aReturn.push( aTrs[i] );
		}
	}
	return aReturn;
}
/*
function setContainersPosition(jsonObj){
	
	if (typeof(layerEditor)=="undefined"){return null}
	var containers=demoLayer.containers
	for (var i=0;i<containers.length;i++){
		//get label
		//jsonPath(tmp,"$..[?(@['label']=='ExecuteProcess_v.univar')]")
		//jsonPath(tmp,"$..[?(@.label=='ExecuteProcess_gml2svg')].position")
		label=containers[i].label
		expPath="$..[?(@['label']=='"+label+"')].position"
		posArr=jsonPath(jsonObj,expPath)[0];
		//$(demoLayer.containers[2].bodyEl).parent()[0].style.left="100px" 
		//setting pos
		$(demoLayer.containers[i].bodyEl).parent()[0].style.left=posArr[0]
		$(demoLayer.containers[i].bodyEl).parent()[0].style.top=posArr[1]
	}//end for

}
*/
// to help with the download of the taverna flow file, we cant do it using ajax since 
//http://filamentgroup.com/lab/jquery_plugin_for_requesting_ajax_like_file_downloads/
jQuery.download = function(url, data, method){
	//url and data options required
	
	input='<input type="hidden" name="xmlContent" value="'+data+'" />'; 
	$('<form id="dummy" name="formTaverna" action="'+ url +'" method="'+ (method||'post') +'">'+input+'</form>').appendTo('body').trigger("submit").remove()
	/*
	if( url && data ){ 
		//data can be string of parameters or array/object
		data = typeof data == 'string' ? data : jQuery.param(data);
		//split params into form inputs
		var inputs = '';
		jQuery.each(data.split('&'), function(){ 
			var pair = this.split('=');
			inputs+='<input type="hidden" name="'+ pair[0] +'" value="'+ pair[1] +'" />'; 
		});
		//send request
		jQuery('<form action="'+ url +'" method="'+ (method||'post') +'">'+inputs+'</form>')
		.appendTo('body').submit().remove();
	};
	*/
};
/*
The MIT License: Copyright (c) 2010 LiosK.
https://github.com/LiosK/UUID.js/blob/master/dist/uuid.core.js
*/
function UUID(){}UUID.generate=function(){var a=UUID._getRandomInt,b=UUID._hexAligner;return b(a(32),8)+"-"+b(a(16),4)+"-"+b(16384|a(12),4)+"-"+b(32768|a(14),4)+"-"+b(a(48),12)};UUID._getRandomInt=function(a){if(a<0)return NaN;if(a<=30)return 0|Math.random()*(1<<a);if(a<=53)return(0|Math.random()*1073741824)+(0|Math.random()*(1<<a-30))*1073741824;return NaN};UUID._getIntAligner=function(a){return function(b,f){for(var c=b.toString(a),d=f-c.length,e="0";d>0;d>>>=1,e+=e)if(d&1)c=e+c;return c}};
UUID._hexAligner=UUID._getIntAligner(16);

/**
*
*  Base64 encode / decode
*  http://www.webtoolkit.info/
*
**/
 
var Base64 = {
 
	// private property
	_keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
 
	// public method for encoding
	encode : function (input) {
		var output = "";
		var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
		var i = 0;
 
		input = Base64._utf8_encode(input);
 
		while (i < input.length) {
 
			chr1 = input.charCodeAt(i++);
			chr2 = input.charCodeAt(i++);
			chr3 = input.charCodeAt(i++);
 
			enc1 = chr1 >> 2;
			enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
			enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
			enc4 = chr3 & 63;
 
			if (isNaN(chr2)) {
				enc3 = enc4 = 64;
			} else if (isNaN(chr3)) {
				enc4 = 64;
			}
 
			output = output +
			this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
			this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);
 
		}
 
		return output;
	},
 
	// public method for decoding
	decode : function (input) {
		var output = "";
		var chr1, chr2, chr3;
		var enc1, enc2, enc3, enc4;
		var i = 0;
 
		input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
 
		while (i < input.length) {
 
			enc1 = this._keyStr.indexOf(input.charAt(i++));
			enc2 = this._keyStr.indexOf(input.charAt(i++));
			enc3 = this._keyStr.indexOf(input.charAt(i++));
			enc4 = this._keyStr.indexOf(input.charAt(i++));
 
			chr1 = (enc1 << 2) | (enc2 >> 4);
			chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
			chr3 = ((enc3 & 3) << 6) | enc4;
 
			output = output + String.fromCharCode(chr1);
 
			if (enc3 != 64) {
				output = output + String.fromCharCode(chr2);
			}
			if (enc4 != 64) {
				output = output + String.fromCharCode(chr3);
			}
 
		}
 
		output = Base64._utf8_decode(output);
 
		return output;
 
	},
 
	// private method for UTF-8 encoding
	_utf8_encode : function (string) {
		string = string.replace(/\r\n/g,"\n");
		var utftext = "";
 
		for (var n = 0; n < string.length; n++) {
 
			var c = string.charCodeAt(n);
 
			if (c < 128) {
				utftext += String.fromCharCode(c);
			}
			else if((c > 127) && (c < 2048)) {
				utftext += String.fromCharCode((c >> 6) | 192);
				utftext += String.fromCharCode((c & 63) | 128);
			}
			else {
				utftext += String.fromCharCode((c >> 12) | 224);
				utftext += String.fromCharCode(((c >> 6) & 63) | 128);
				utftext += String.fromCharCode((c & 63) | 128);
			}
 
		}
 
		return utftext;
	},
 
	// private method for UTF-8 decoding
	_utf8_decode : function (utftext) {
		var string = "";
		var i = 0;
		var c = c1 = c2 = 0;
 
		while ( i < utftext.length ) {
 
			c = utftext.charCodeAt(i);
 
			if (c < 128) {
				string += String.fromCharCode(c);
				i++;
			}
			else if((c > 191) && (c < 224)) {
				c2 = utftext.charCodeAt(i+1);
				string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
				i += 2;
			}
			else {
				c2 = utftext.charCodeAt(i+1);
				c3 = utftext.charCodeAt(i+2);
				string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
				i += 3;
			}
 
		}
 
		return string;
	}
 
}
