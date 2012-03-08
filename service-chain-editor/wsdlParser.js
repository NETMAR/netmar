/*!
 * wsdl functions
 * Includes  jkl-parserxml.js
 
 */
//generic functions
function isValidURL(textval) {
      var urlregex = new RegExp(
            "^(http|https|ftp)\://([a-zA-Z0-9\.\-]+(\:[a-zA-Z0-9\.&amp;%\$\-]+)*@)*((25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9])\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[0-9])|([a-zA-Z0-9\-]+\.)*[a-zA-Z0-9\-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(\:[0-9]+)*(/($|[a-zA-Z0-9\.\,\?\'\\\+&amp;%\$#\=~_\-]+))*$");
      return urlregex.test(textval);
    }


function addContainer(labelText,inputs,outputs){
	//creates and adds container to arrContainer based on the last container position
	arrContainers.push({'label':labelText,containerInputs:inputs,containerOutputs:outputs})
	

}; //end addContainer
	
function getMessage(data,name){
	//from WSDL in data array
	//fetch message array with specific name
		for (var x in data["definitions"]["message"]){
			if  (data["definitions"]["message"][x]["name"]==name){
				return data["definitions"]["message"][x];
			}
		};
		return null; 

	};
	
function getLocalName(elementName){
		//from element name, remove name space if existing
			if (elementName.indexOf(":")<0){
			//no namespace
			return elementName;
			}else {
			return elementName.split(":")[1];
			};
		};
		
function URLExists(url)
		{
		    var http = new XMLHttpRequest();
		    try {
		    	//console.log(url);
		    	http.open('HEAD', url, false);
		    	http.send();
		    } catch (err)
		    {	
		    	//the file may exist but there is a cross domain exception.
		    	//But the brower will first do the HEAD check and then raise the exception, 
		    	//unfortunally the HTTP code is not added to http.status
		    	alert("Cross Domain problem");
		    	return false;
		    }
		    return http.status!=404;
		}//end of URLExists



function getElement(data,name){
		//gets Element from schema with specific name
			for (var x in data["definitions"]["types"]["schema"]){
				//needs a try catch since some xsd:schema dont have elements but xsd:include
				try 
				{
					
					if (data["definitions"]["types"]["schema"][x]["element"]["name"]==name){
						return data["definitions"]["types"]["schema"][x]["element"]	
					};
				}
				catch(err)
				{
				//do nothing
				}
			}
			return null; //nothing found

		};

function getIOFromSchema(schemaEl){
			//get element content from schema, it can be I/O
			//returns an array with 0,1,n size according to the WSDL caracteristics
			//3 situations, no input, one input or multiple inputs
			var arr=new Array();
			//no input
			
			if (schemaEl["complexType"].hasOwnProperty("sequence")===false){
				return arr;
				} else {
					if (schemaEl["complexType"]["sequence"]["element"].hasOwnProperty(0)===true){
							// multiple inputs loop
						for (var y in schemaEl["complexType"]["sequence"]["element"]){
							arr.push(schemaEl["complexType"]["sequence"]["element"][y]["name"]);
						}
					} else {
						//direct output 1 input	
						arr.push(schemaEl["complexType"]["sequence"]["element"]["name"]);
					}
					return arr;
				};
					

		}; //end function
		
function parseWSDL(wsdlURL){
	wsdlURL="http://"+wsdlURL;
	
	
	if (domainProxy){
		// proxy
		wsdlURL=domainProxy+wsdlURL;
		
	} else {
		//no proxy
		wsdlURL=wsdlURL;
		
	};
	
	//check if URL existis and is ok
	if (!(URLExists(wsdlURL))){
		alert("NO WSDL IN URL") //need a proper pop up
		return null
	}
	
	
	//start parsing
	var xml = new JKL.ParseXML(wsdlURL);
	//data.hasOwnProperty("parser")
	data = xml.parse();
	if (data.hasOwnProperty("parsererror")){
		alert(data.parsererror["#text"])
		return null
		
	}
	   // document.write( data["items"]["item"]["us_state"] );
	   // document.write( data.items.item.us_state );

		
		for (var x in data["definitions"]["portType"]["operation"]){
			
			var msgNameInput=getLocalName(data["definitions"]["portType"]["operation"][x]["input"]["message"]);
			var msgNameOutput=getLocalName(data["definitions"]["portType"]["operation"][x]["output"]["message"]);
			//var msgNameOutput=getLocalName(data["definitions"]["portType"]["operation"][x]["output"]["message"]);
			//fetch element from the message content based on msgName
			//dataMsg=getMessage(data,msgNameInput);
			//data["definitions"]["message"][x]["name"]
			//fetch element from schema section
			msgInput=getMessage(data,msgNameInput);
			
			schemaElName=getLocalName(msgInput["part"]["element"]);
			
			schemaEl=getElement(data,schemaElName);
			
			var inputArray=[];
			if (schemaEl!=null){
				inputArray=getIOFromSchema(schemaEl);
			};
			
			msgOutput=getMessage(data,msgNameOutput);
			schemaElName=getLocalName(msgOutput["part"]["element"]);
			schemaEl=getElement(data,schemaElName);
			
			var outputArray=[];
			if (schemaEl!=null){
				outputArray=getIOFromSchema(schemaEl);
			//loop thru inputArray
			//at the end add container with all inputs/outputs
			addContainer(data["definitions"]["portType"]["operation"][x]["name"],inputArray,outputArray);
			};
		};



	}; //end of WSDL parser