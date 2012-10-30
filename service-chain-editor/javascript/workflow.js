if(!loadedPlugins['workflow']) {
	loadedPlugins['workflow'] = true;
	window.storeWorkflow = function() {
		//List of all saved object key: savedWorkflow
		jsonToSave	= getJSONWorkflow();
		saveName	= $("input[id=inputNameSave]").val();
		//$.jStorage.set(saveName,jsonToSave);
		var currentTime = new Date();
		date	= currentTime.toLocaleDateString();
		time	= currentTime.toLocaleTimeString();
		savedWF	= $.jStorage.get("savedWorkflow");
		if(savedWF) {
			savedWF.push([saveName,date + " " + time]);
		} else {
			savedWF = new Array();
			savedWF.push([saveName,date + " " + time]);
		}
		$.jStorage.set("savedWorkflow", savedWF);
		oTable.fnAddData([saveName,date + " " + time]);
		//Saving the actual JSON object
		$.jStorage.set(saveName,jsonToSave);
	}

	window.getJSONWorkflow = function(stringify) {
		var stringify	= (typeof stringify == 'undefined') ? true : stringify;
		//creating JSON object
		//getting WSDL location
		wsdlURL			= $("input[name=inputbox]").val();
		positions		= getJSONStructure();
		wires			= getJSONWires();
		var date		= new Date();
		var dataArr		= date.toLocaleString().split(" ");
		var monthInt	= date.getMonth()+1;
		//Create month as string
		if (monthInt <= 9) {var monthString = "0" + String(monthInt);} else {var monthString = String(monthInt);}
		// 2011-08-25 16:03:36.21 BST //
		//Wed 04 Jan 2012 16:17:30 BST"
		var dateTaverna	= dataArr[3] + "-" + monthString + "-" + dataArr[1] + " " + dataArr[4] + " " + dataArr[5];
		workflow		= {"wsdlURL":wsdlURL, "positions":positions, "wires":wires,"uuid":UUID.generate(),"date":dateTaverna};
		if(stringify) {
			return JSON.stringify(workflow);
		} else {
			return workflow;
		};
	}; //end function
}