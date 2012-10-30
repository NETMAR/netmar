if(!loadedPlugins['wsdl-parse']) {
	loadedPlugins['wsdl-parse'] = true;
	window.isValidURL = function(textval) {
		var urlregex = new RegExp(
			"^(http|https|ftp)\://([a-zA-Z0-9\.\-]+(\:[a-zA-Z0-9\.&amp;%\$\-]+)*@)*((25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9])\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[0-9])|([a-zA-Z0-9\-]+\.)*[a-zA-Z0-9\-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(\:[0-9]+)*(/($|[a-zA-Z0-9\.\,\?\'\\\+&amp;%\$#\=~_\-]+))*$");
		return urlregex.test(textval);
	}

	window.addContainer = function(labelText,inputs,outputs, wsdl){
		//creates and adds container to arrContainer based on the last container position
		var obj = {'label':labelText,containerInputs:inputs,containerOutputs:outputs, wsdl: wsdl};
		arrContainers.push(obj);
		wsdl = wsdl.replace(/\./g, '').replace(/\//g, '').replace(/\\/g, '');
		if(typeof(loadedWSDLs[wsdl]) == 'undefined') {
			loadedWSDLs[wsdl] = [];
		}
		loadedWSDLs[wsdl][loadedWSDLs[wsdl].length] = obj;
	}

	window.getMessage = function(data, name) {
		console.log(typeof(data), "MESSAGE", data);
		if(typeof(data) == 'undefined') {
		} else {
		//} && $(data).length > 0) {
			return $(data).find('message[name="' + name + '"]');
		}
		return $('');
	}

	window.getLocalName = function(elementName) {
		//from element name, remove name space if existing
		//console.log(elementName);
		//console.log('elementName');
		try {
		if(elementName.indexOf(":") < 0) {
			//no namespace
			return elementName;
		} else  {
			return elementName.split(":")[1];
		}
		} catch(e) {}
	}

	window.getIOFromSchema = function(schemaEl, elCount, prog_callback, counter) {
		//get element content from schema, it can be I/O
		//returns an array with 0,1,n size according to the WSDL caracteristics
		//3 situations, no input, one input or multiple inputs
		var arr=new Array();
		//no input
		if(!schemaEl.attr('sequence')) {
			var elements = schemaEl.find('element');
			if(elements.length > 0) {
				elements.each(function(index, value) {
					arr.push($(value).attr('name'));
					if(elCount && prog_callback) {
					//prog_callback(arrContainers.length, elCount);
					}
				});
			} else {
				arr.push(schemaEl.attr('name'));
			}
		}
		currentProgressBar = (counter / elCount) * 100;
		//alert(currentProgressBar);
		//upb(prog_callback, counter, elCount);
		if(elCount && prog_callback) {
			//alert(arrContainers.length);
			//prog_callback(arrContainers.length, elCount);
		}

		return arr;

	} //end function


	window.getElement = function(data, name) {
		return $(data).find('types schema element[name="' + name + '"]');
	}

	window.URLExists = function(fileLocation) {
		//console.log(fileLocation);
		return getTemplate('../' + fileLocation + '&head=true&') == 200 ? true : false;
		//var response = getTemplate('..')
		console.log(fileLocation);
		console.log(fileLocation);
		console.log(fileLocation);
		var response = $.ajax({
			url: fileLocation,
			type: 'HEAD',
			async: false
		}).status;
		return (response == 404) ? false : true;
	}

	window.parseWSDL = function(wsdlURL, callback, prog_callback){
		if(loadedWSDLs[wsdlURL.replace(/\./g, '').replace(/\//g, '').replace(/\\/g, '')]) {
			callback(loadedWSDLs[wsdlURL.replace(/\./g, '').replace(/\//g, '').replace(/\\/g, '')]);
			if(prog_callback) {
				prog_callback(-1, 100);
			}
			return;
		}

		//check if URL existis and is ok
		//console.log((domainProxy ? domainProxy + '=' : '') + wsdlURL);
		if(!(URLExists((domainProxy ? domainProxy + '=' : '') + wsdlURL))) {
			alert("NO WSDL IN URL~") //need a proper pop up
			return null;
		}
		$.ajax({
			url: (domainProxy ? domainProxy + '=' : '') + wsdlURL,
			async: true,
			success: function(data) {
				console.log($(data).find('definitions'));
				console.log($(data));
				console.log($(data));
				alert($(data).html());
				//console.log(data.length);
				//alert("data");
				addContainer('', {}, {}, wsdlURL);
				/*wsdlURL = wsdlURL.replace(/\./g, '').replace(/\//g, '').replace(/\\/g, '');
				
				loadedWSDLs[wsdlURL] = [1];
				console.log(wsdlURL);
				console.log(loadedWSDLs);
				console.log(loadedWSDLs[wsdlURL]);
				console.log('testing1');
				$.each(loadedWSDLs, function(index, value) {
					console.log(index + " - " + value);
				});*/
				var resource_found = false;
				/*$.each(global_service_resources, function(index, value) {
					if(value == wsdlURL) {
						resource_found = true;
					}
				});
				$('#serviceListSearch_Value').html(serviceOption_items);
				if(!resource_found) {
					global_service_resources[global_service_resources.length] = wsdlURL;
				}
				var serviceOption_items = '';
				$.each(global_service_resources, function(index, value) {
					serviceOption_items += '<option value="' + value + '">' + value + '</option>';
				});*/
				//$('.serviceListSearchFilter').html((new Date().getTime()) + '<select name="serviceListSearch_Value">' + serviceOption_items + '</select>');
				console.log(data);
				console.log(data);
				//console.log(data.toString());
				console.log(data);
				var $data = $(data);
				//console.log($data.html());
				$.each($data, function(index, value) {
					console.log(value.html());
				});
				var $error = $data.find('parseerror');

				if($error.length > 0) {
					alert($error.text());
					return null;
				}

				var counter = 0;
				var elCount = $data.find('sequence element[name="input"]').length;
				currentProgressBar =0;
				var $operations = $data.find('portType operation');
				$operations.each(function(index, value) {
					++counter;
					setTimeout(function(data, value, outName, callback, doCallback, prog_callback, arrLength, counter, wsdlURL) {
						setTimeout(function(data, value, outName, callback, doCallback, prog_callback, arrLength, counter, wsdlURL) {
							setTimeout(function(data, value, outName, callback, doCallback, prog_callback, arrLength, counter, wsdlURL) {
								setTimeout(function(data, value, outName, callback, doCallback, prog_callback, arrLength, counter, wsdlURL) {
									setTimeout(function(data, value, outName, callback, doCallback, prog_callback, arrLength, counter, wsdlURL) {
										setTimeout(function(data, value, outName, callback, doCallback, prog_callback, arrLength, counter, wsdlURL) {
											var outputArray = [];
											if(outName.length > 0) {
												outputArray = getIOFromSchema(outName, arrLength, prog_callback, counter, wsdlURL);
												setTimeout(function(data, value, output, callback, doCallback, prog_callback, arrLength, counter, wsdlURL) {
													setTimeout(function(data, value, inName, output, callback, doCallback, prog_callback, arrLength, counter, wsdlURL) {
														setTimeout(function(data, value, inName, output, callback, doCallback, prog_callback, arrLength, counter, wsdlURL) {
															setTimeout(function(data, value, inName, output, callback, doCallback, prog_callback, arrLength, counter, wsdlURL) {
																setTimeout(function(data, value, inName, output, callback, doCallback, prog_callback, arrLength, counter, wsdlURL) {
																	setTimeout(function(data, value, inName, output, callback, doCallback, prog_callback, arrLength, counter, wsdlURL) {
																		setTimeout(function(data, value, inName, output, callback, doCallback, prog_callback, arrLength, counter, wsdlURL) {
																			var inputArray = [];
																			if(inName.length > 0) {
																				inputArray = getIOFromSchema(inName, arrLength, prog_callback, counter);
																			}
																			setTimeout(function(name, input, output, callback, doCallback, prog_callback, arrLength, counter, wsdlURL) {
																				addContainer(name, input, output, wsdlURL);
																				if(callback && doCallback) {
																					if(prog_callback) {
																						prog_callback(-1, 100);
																					}
																					callback(wsdlURL.replace(/\./g, '').replace(/\//g, '').replace(/\\/g, ''));
																				}
																			}, counter*2, $(value).attr('name'), inputArray, output, callback, (index == (arrLength - 1)), prog_callback, arrLength, counter, wsdlURL);
																		}, counter, data, value, getElement(data, inName), output, callback, doCallback, prog_callback, arrLength, counter, wsdlURL);
																	}, counter, data, value, getLocalName(inName), output, callback, doCallback, prog_callback, arrLength, counter, wsdlURL);
																}, counter, data, value, inName.find('part').attr('element'), output, callback, doCallback, prog_callback, arrLength, counter, wsdlURL);
															}, counter, data, value, getMessage(data, inName), output, callback, doCallback, prog_callback, arrLength, counter, wsdlURL);
														}, counter, data, value, getLocalName(inName), output, callback, doCallback, prog_callback, arrLength, counter, wsdlURL);
													}, counter, data, value, $(value).find('input').attr('message'), output, callback, doCallback, prog_callback, arrLength, counter, wsdlURL);
												}, counter, data, value, outputArray, callback, doCallback, prog_callback,arrLength, counter, wsdlURL);
											}
										}, counter, data, value, getElement(data, outName), callback, doCallback, prog_callback, arrLength, counter, wsdlURL);
									}, counter, data, value, getLocalName(outName), callback, doCallback, prog_callback, arrLength, counter, wsdlURL);
								}, counter, data, value, outName.find('part').attr('element'), callback, doCallback, prog_callback, arrLength, counter, wsdlURL);
							}, counter, data, value, getMessage(data, outName), callback, doCallback, prog_callback, arrLength, counter, wsdlURL);
						}, counter, data, value, getLocalName(outName), callback, doCallback, prog_callback, arrLength, counter, wsdlURL);
					}, counter, $data, value, $(value).find('output').attr('message'), callback, (index == $operations.length - 1), prog_callback, $operations.length, counter, wsdlURL);
				});
			}
		});
	}
}