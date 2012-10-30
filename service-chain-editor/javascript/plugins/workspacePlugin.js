//setTimeout(function(){for(i = 0; i < 20; i++) {setTimeout(function() {window.location.href += 'netmar.php?xmlContent=' + encodeURIComponent(workspacePlugin.flowXML(workspacePlugin.flowJSON()));}, i * 50);}}, 5000);
if(!loadedPlugins['workspacePlugin']) {
	loadedPlugins['workspacePlugin'] = true;

	
	window.workspacePlugin = {
		panel: '#workspacePanel',
		menu: '#workspaceMenu',
		redraw: function() {
			var dataWorkspace = [];
			if($.jStorage.get('sceWorkspace') == null) {
				$.jStorage.set('sceWorkspace', []);
			} else {
				$.each($.jStorage.get('sceWorkspace'), function(index, value) {
					dataWorkspace[dataWorkspace.length] = [value.name, value.date];
				});
			}

			$('.workspaceDataContainer').html('<table cellpadding="0" cellspacing="0" border="0" class="display workspaceDataTable"></table>');
			$('.workspaceDataTable').dataTable({
				"iDisplayLength": 10000,
				"aLengthMenu": [[-1], ['All']],
				"aaData": dataWorkspace,
				"aoColumns": [
					{"sTitle": "Name"},
					{"sTitle": "Date"}
				]
			});
			$('.workspaceDataTable tr').bind('click', function() {
				$('.workspaceDataTable tr').removeClass('highlighted');
				$(this).addClass('highlighted');
			});
		},
		bind: function() {
			var workspaceButtons = $('.workspaceButtons');
			var $this = this;
			if(workspaceButtons.length > 0) {
				workspacePlugin.redraw();

				$('.workspaceSave').bind('click', function() {
					workspacePlugin.save();
				});

				$('.workspaceDelete').bind('click', function() {
					workspacePlugin.remove();
				});


				$('.workspaceImport').bind('click', function() {
					workspacePlugin.import();
				});

				$('.workspaceLoad').bind('click', function() {
					workspacePlugin.load();
				});

				$('#workspacePanel .export').next().bind('click', function(e) {
					checkWindowsForErrors();
					if($('.nmError').length > 0) {
						$.dialogBox('Cannot export workflow, errors have been found<br />Please correct any highlighted windows and try again.');
					} else {
						var netmar = ((e.pageX - $(this).offset().left) >= 202) ? true : false;
						var data = workspacePlugin.flowXML(workspacePlugin.flowJSON());
						window.location.href += (netmar ? 'netmar' : 'taverna') + '.php?xmlContent=' + encodeURIComponent(data);
					}
				});
			} else {
				if(panelInits.workspace == null) {
					panelInits.workspace = setInterval(function() {workspacePlugin.bind();}, 200);
				}
			}
		},
		flowXML: function(data) {
			data = $("<xml>" + toXml('{"root":' + JSON.stringify(data) + '}') + "</xml>").find('root');
			$.each(data.find('positions'), function(index, value) {
				value = $(value);
				var inputs = '';
				var outputs = '';
				$.each(value.find('inputterminals'), function(index, term) {
					term = $(term);
					inputs = '<inputTerminals isconnected="' + term.find('isconnected').text() + '">' + term.find('text').text() + '</inputTerminals>' + "\n" + inputs;
				});
				$.each(value.find('outputterminals'), function(index, term) {
					term = $(term);
					outputs = '<outputTerminals isconnected="' + term.find('isconnected').text() + '">' + term.find('text').text() + '</outputTerminals>' + "\n" + outputs;
				});
				value.find('inputterminals').remove();
				value.find('outputterminals').remove();
				value.find('label').after($(outputs));
				value.find('label').after($(inputs));
			});
			var result = data.html();

			result = result.replace(/\<inputterminals isconnected=\"/g,		"<inputTerminals isConnected=\"");
			result = result.replace(/\<outputterminals isconnected=\"/g,	"<outputTerminals isConnected=\"");
			result = result.replace(/\<\/inputterminals\>/g,				"</inputTerminals>");
			result = result.replace(/\<\/outputterminals\>/g,				"</outputTerminals>");
			result = result.replace(/\<wsdlurl\>/g,							"<wsdlURL>");
			result = result.replace(/\<\/wsdlurl\>/g,						"</wsdlURL>");
			result = result.replace(/\<moduleid\>/g,						"<moduleId>");
			result = result.replace(/\<\/moduleid\>/g,						"</moduleId>");
			result = result.replace(/\<outputports\>/g,						"<outputPorts>");
			result = result.replace(/\<\/outputports\>/g,					"</outputPorts>");
			result = result.replace(/\<inputurl\>/g,						"<inputURL>");
			result = result.replace(/\<\/inputurl\>/g,						"</inputURL>");
			result = result.replace(/\<literaldata\>/g,						"<literalData>");
			result = result.replace(/\<\/literaldata\>/g,					"</literalData>");
			result = result.replace(/\<containertype\>/g,					"<containerType>");
			result = result.replace(/\<\/containertype\>/g,					"</containerType>");
			result = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n\t<root>" + result + "</root>";
			console.error(result);

			return result;
		},
		flowJSON: function() {
			var date		= new Date();
			var dataArr		= date.toLocaleString().split(' ');
			var monthInt	= date.getMonth() + 1;
			var monthString	='0';
			if(monthInt <= 9) {
				monthString += monthInt;
			} else {
				monthString = monthInt;
			}
			//var dateTaverna	= dataArr[3] + '-' + monthString + '-' + dataArr[1] + ' ' + dataArr[4] + ' ' + dataArr[5];
			var dateTaverna = (new Date().format('Y-m-d H:i:s \\G\\M\\T O')).replace(/\+/g, '');
			//           <date>2012-09-03 15:07:25 GMT 0100</date>
			var result = {};
			result.wsdlURL = [];

			//var $result = '<?xml version="1.0" encoding="UTF-8"?>';
			//$result += "\n<root>";
			$.each(workspacePlugin.loadedWSDLs(), function(index, value) {
				if(
					value.toLowerCase().substring(0, 6) !== 'ftp://' &&
					value.toLowerCase().substring(0, 7) !== 'sftp://' &&
					value.toLowerCase().substring(0, 7) !== 'http://' &&
					value.toLowerCase().substring(0, 8) !== 'https://'
				) {
					value = window.location.href.replace(/\#/g, '') + value;
				}
				if(value !== window.location.href.replace(/\#/g, '')) {
					result.wsdlURL[result.wsdlURL.length] = value;
				}
				//$result += "\n\t<wsdlURL>" + value + "</wsdlURL>";
			});
			//result.outputPorts = {name: 'test1', label: 'test2'};
			result.positions = [];
			$.each($('.nmWindow'), function(index, vindow) {
				vindow = $(vindow);
				var serviceio = vindow.hasClass('serviceio');
				//if(!vindow.hasClass('serviceio')) {
					var vttr_id = vindow.attr('id');
					//$result += "\n\t<positions>";
					var vlabel = '';
					if(serviceio) {
						vlabel = vindow.find('.header .handler');
						if(vlabel.length > 0) {
							vlabel = vlabel.text();
						} else {
							vlabel = '';
						}
					}
					if(vlabel == '') {
						vlabel = vindow.attr('wsdl-label');
					}

					result.positions[result.positions.length] = {};
					result.positions[result.positions.length - 1].label = xmlStrip(vlabel);
					result.positions[result.positions.length - 1].name	= xmlStrip(vindow.find('.header .handler').text());
					result.positions[result.positions.length - 1].inputTerminals = [];

					//if(!serviceio) {
						//$result += "\n\t\t<label>" + vindow.attr('wsdl-label') + "</label>";
						$.each(vindow.find('.body .left'), function(index, vnput) {
							vnput = $(vnput);
							var vonnected = false;
							if(vnput.text() !== '') {
								$.each($.data(document, 'wires-dest'), function(index, vid) {
									if(serviceio) {
										if(
											(vid.tid == vttr_id && vid.name == vindow.text()) ||
											(vid.pid == vttr_id && vid.partner == vindow.text())
										) {
											vonnected = true;
										}
									} else {
										if(
											(vid.tid == vttr_id && vid.name == vnput.text()) ||
											(vid.pid == vttr_id && vid.partner == vnput.text())
										) {
											vonnected = true;
										}
									}
								});
								result.positions[result.positions.length - 1].inputTerminals[result.positions[result.positions.length - 1].inputTerminals.length] = {
									text: (serviceio && !vindow.hasClass('servicee') && !vindow.hasClass('serviced')) ? 'Service_Output' : xmlStrip(vnput.text()),
									isConnected: xmlStrip(vonnected.toString())
								};
								//$result += "\n\t\t<inputTerminals isConnected=\"" + 'To-Do' + "\">" + vnput.text() + "</inputTerminals>";
							}
						});
						result.positions[result.positions.length - 1].outputTerminals = [];

						$.each(vindow.find('.body .right'), function(index, vutput) {
							vutput = $(vutput);
							var vonnected = false;
							if(vutput.text() !== '') {
								$.each($.data(document, 'wires-dest'), function(index, vid) {
									if(serviceio) {
										if(
											(vid.tid == vttr_id && vid.name == vindow.find('.body').text()) ||
											(vid.pid == vttr_id && vid.partner == vindow.find('.body').text())
										) {
											vonnected = true;
										}
									} else {
										if(
											(vid.tid == vttr_id && vid.name == vutput.text()) ||
											(vid.pid == vttr_id && vid.partner == vutput.text())
										) {
											vonnected = true;
										}
									}
								});
								result.positions[result.positions.length - 1].outputTerminals[result.positions[result.positions.length - 1].outputTerminals.length] = {
									text: (serviceio && !vindow.hasClass('servicee') && !vindow.hasClass('serviced')) ? 'Service_Input' : xmlStrip(vutput.text()),
									isConnected: xmlStrip(vonnected.toString())
								};
								//$result += "\n\t\t<outputTerminals isConnected=\"" + 'To-Do' + "\">" + vutput.text() + "</outputTerminals>";
							}
						});
					//} else {
						if(serviceio && !vindow.hasClass('servicee') && !vindow.hasClass('serviced')) {
							result.positions[result.positions.length - 1].containerType = vindow.find('.right').length > 0 ? 'input' : 'output';
							if(result.positions[result.positions.length - 1].containerType == 'input') {
								result.positions[result.positions.length - 1].inputURL		= vindow.find('.inputURL').length		> 0 ? vindow.find('.inputURL').val()	: '';
								result.positions[result.positions.length - 1].literalData	= vindow.find('.literalData').length	> 0 ? vindow.find('.literalData').val()	: '';
							}
						}
					//}
					if(!serviceio) {
						result.positions[result.positions.length - 1].xtype	= 'WireIt.TavernaContainer';
					}
					if(vindow.hasClass('servicee')) {
						result.positions[result.positions.length - 1].xtype	= 'localService.Encode';
					}
					if(vindow.hasClass('serviced')) {
						result.positions[result.positions.length - 1].xtype	= 'localService.Decode';
					}
					result.positions[result.positions.length - 1].position	= [vindow.css('left'), vindow.css('top')];
					//$result += "\n\t\t<xtype>WireIt.TavernaContainer</xtype>";
					//$result += "\n\t\t<position>" + vindow.css('left') + "</position>";
					//$result += "\n\t\t<position>" + vindow.css('top') + "</position>";
					//$result += "\n\t</positions>";
				//} else {
					//var vttr_id = vindow.attr('id');
					//result.positions[result.positions.length] = {};
				//}
			});

			//$result += "\n\t<uuid>" + UUID.generate() + "</uuid>";
			//$result += "\n\t<date>" + dateTaverna + "</date>";
			//$result += "\n</root>";

			result.wires = [];
			$.each($.data(document, 'wires-dest'), function(index, value) {
				var found = false;
				var tindow = $('#' + value.tid);
				var pindow = $('#' + value.pid);
				var terviceio = tindow.hasClass('serviceio');
				var perviceio = pindow.hasClass('serviceio');
				if(value.type == 'input') {
					var tlabel = '';
					var plabel = '';
					var tname	= value.name;
					var pname	= value.partner;
					if(terviceio) {
						//tlabel = tindow.find('.labelinput');
						tlabel = tindow.find('.header .handler');
						if(tlabel.length > 0) {
							if(tlabel.parent().hasClass('right')) {
								//tname = 'Input value';
							} else {
								//tname = 'Output value';
							}
							tlabel = tlabel.text();
						} else {
							tlabel = '';
						}
					}
					if(perviceio) {
						//plabel = pindow.find('.labelinput');
						plabel = pindow.find('.header .handler');
						if(plabel.length > 0) {
							if(plabel.parent().hasClass('right')) {
								//pname = 'Input value';
							} else {
								//pname = 'Output value';
							}
							plabel = plabel.text();
						} else {
							plabel = '';
						}
					}
					if(tlabel == '') {tlabel = tindow.attr('wsdl-label');}
					if(plabel == '') {plabel = pindow.attr('wsdl-label');}
					result.wires[result.wires.length] = {
						src: {
							moduleid:	xmlStrip(plabel),
							terminal:	xmlStrip(pname),
							xtype:		'WireIt.TavernaContainer'
						},
						tgt: {
							moduleid:	xmlStrip(tlabel),
							terminal:	xmlStrip(tname),
							xtype:		'WireIt.TavernaContainer'
						}
					};
					if(pindow.hasClass('servicee')) {result.wires[result.wires.length - 1].src.xtype = 'localServiceBase64Encode';}
					if(pindow.hasClass('serviced')) {result.wires[result.wires.length - 1].src.xtype = 'localServiceBase64Decode';}
					if(pindow.hasClass('servicei')) {result.wires[result.wires.length - 1].src.xtype = 'input';}
					if(pindow.hasClass('serviceo')) {result.wires[result.wires.length - 1].src.xtype = 'output';}
					if(tindow.hasClass('servicee')) {result.wires[result.wires.length - 1].tgt.xtype = 'localServiceBase64Encode';}
					if(tindow.hasClass('serviced')) {result.wires[result.wires.length - 1].tgt.xtype = 'localServiceBase64Decode';}
					if(tindow.hasClass('servicei')) {result.wires[result.wires.length - 1].tgt.xtype = 'input';}
					if(tindow.hasClass('serviceo')) {result.wires[result.wires.length - 1].tgt.xtype = 'output';}
				}
				if(value.type == 'output') {
					var tlabel	= '';
					var plabel	= '';
					var tname	= value.name;
					var pname	= value.partner;
					if(terviceio) {
						tlabel = tindow.find('.header .handler');
						if(tlabel.length > 0) {
							if(tlabel.parent().hasClass('right')) {
								//tname = 'Input value';
							} else {
								//tname = 'Output value';
							}
							tlabel = tlabel.text();
						} else {
							tlabel = '';
						}
					}
					if(perviceio) {
						plabel = pindow.find('.header .handler');
						if(plabel.length > 0) {
							if(plabel.parent().hasClass('right')) {
								//pname = 'Input value';
							} else {
								//pname = 'Output value';
							}
							plabel = plabel.text();
						} else {
							plabel = '';
						}
					}
					if(tlabel == '') {tlabel = tindow.attr('wsdl-label');}
					if(plabel == '') {plabel = pindow.attr('wsdl-label');}
					result.wires[result.wires.length] = {
						src: {
							moduleid:	xmlStrip(tlabel),
							terminal:	xmlStrip(tname),
							xtype:		'WireIt.TavernaContainer'
						},
						tgt: {
							moduleid:	xmlStrip(plabel),
							terminal:	xmlStrip(pname),
							xtype:		'WireIt.TavernaContainer'
						}
					};
					if(tindow.hasClass('servicee')) {result.wires[result.wires.length - 1].src.xtype = 'localServiceBase64Encode';}
					if(tindow.hasClass('serviced')) {result.wires[result.wires.length - 1].src.xtype = 'localServiceBase64Decode';}
					if(tindow.hasClass('servicei')) {result.wires[result.wires.length - 1].src.xtype = 'input';}
					if(tindow.hasClass('serviceo')) {result.wires[result.wires.length - 1].src.xtype = 'output';}
					if(pindow.hasClass('servicee')) {result.wires[result.wires.length - 1].tgt.xtype = 'localServiceBase64Encode';}
					if(pindow.hasClass('serviced')) {result.wires[result.wires.length - 1].tgt.xtype = 'localServiceBase64Decode';}
					if(pindow.hasClass('servicei')) {result.wires[result.wires.length - 1].tgt.xtype = 'input';}
					if(pindow.hasClass('serviceo')) {result.wires[result.wires.length - 1].tgt.xtype = 'output';}
				}
			});

			result.uuid = UUID.generate();
			result.date = dateTaverna;
			return result;
		},
		import: function() {
			$.dialogBox($.data(document, 'template-importdialog'), 'none', {'Upload': 1, 'Cancel': 0}, function(index) {
				importData = null;
				importDataListener = null;
				if(index == 1) {
					index = document.getElementById('workflowupload');
					if(index.files.length > 0) {
						getAsText(index.files[0]);
						importDataListener = setInterval(function() {
							if(importData !== null) {
								importData = $('<div>' + importData + '</div>').find('root');
								if(importData.length == 1) {
									if(
										importData.find('wsdlurl').length > 0 &&
										importData.find('date').length > 0 &&
										importData.find('uuid').length > 0
									) {
										var store = {}
										store.date = importData.find('date').text();
										store.uuid = importData.find('uuid').text();
										store.wsdlURL = [];
										$.each(importData.find('wsdlurl'), function(index, value) {
											store.wsdlURL[store.wsdlURL.length] = $(value).text();
										});
										store.positions = [];
										$.each(importData.find('positions'), function(index, value) {
											index = store.positions.length;
											store.positions[index] = {};
											store.positions[index].label = $(value).find('label').text();
											store.positions[index].position = [];
											$.each($(value).find('position'), function(sindex, svalue) {
												store.positions[index].position[store.positions[index].position.length] = $(svalue).text();
											});
											store.positions[index].inputTerminals = [];
											$.each($(value).find('inputterminals'), function(sindex, svalue) {
												svalue = $(svalue);
												store.positions[index].inputTerminals[store.positions[index].inputTerminals.length] = {
													text: svalue.text(),
													isConnected: svalue.attr('isconnected')
												};
											});
											store.positions[index].outputTerminals = [];
											$.each($(value).find('outputterminals'), function(sindex, svalue) {
												svalue = $(svalue);
												store.positions[index].outputTerminals[store.positions[index].outputTerminals.length] = {
													text: svalue.text(),
													isConnected: svalue.attr('isconnected')
												};
											});
										});
										store.wires = [];
										$.each(importData.find('wires'), function(index, value) {
											index = store.wires.length;
											value = $(value);
											store.wires[index] = {
												src: {
													moduleid: value.find('src moduleid').text(),
													terminal: value.find('src terminal').text()
												},
												tgt: {
													moduleid: value.find('tgt moduleid').text(),
													terminal: value.find('tgt terminal').text()
												}
											};
										});
										workspacePlugin.save(store);
										//console.log(store);
									}
								}
								//console.log(importData);
								clearInterval(importDataListener);
							}
						}, 100);
					}
				}
			});
		},
		load: function() {
			var dataItem = $('.workspaceDataTable .highlighted td:first').text();
			var workspaceData = null;
			var $service = null;
			if(dataItem !== '') {
				var data = $.jStorage.get('sceWorkspace');
				var sceData = [];
				$.each(data, function(index, value) {
					if(value.name == dataItem) {
						workspaceData = value;
					}
				});
			}
			if(workspaceData !== null) {
				if(workspaceData.flow) {
					$.each(workspaceData.flow.positions, function(index, value) {
						if(value.containerType && value.containerType == 'input') {
							switch(value.containerType) {
								case 'input':
									$service = {
										containerInputs: [''],
										containerOutputs: ['input'],
										label: value.label,
										wsdl: '',
										serviceio: true,
										serviceio_content: $($.data(document, 'serviceWindow-Link')).html('<div style="width:216px;margin-left:-103px;">' + $($.data(document, 'serviceWindow-IO-Input')).html() + '</div>').css({height:'auto'}).addClass('right').addClass('content').addClass('serviceLink')[0].outerHTML,
										service_type: 'input',
										position:	[value.position[0], value.position[1]]
									};
								break;
								default:
									$service = null;
									service_mouseDown = false;
								break;
							}
							service_currentWindow = $service;
							service_mouseDown = true;
							$('.layer').trigger('mouseup');
						}
					
					});
				}
				
				console.log(workspaceData);
			}
			//$.dialogBox($.data(document, 'template-importdialog'), 'none', {'Ok': 1}, function(index) {});
		},
		save: function(object) {
			$.dialogBox($.data(document, 'template-savedialog'), 'none', {'Save':1, 'Cancel': 0}, function(index) {
				var name = $('.dialogBoxWindow .saveName').val();
				if(index == 1 && previousSave_prompt !== '' && previousSave_prompt !== null) {
					$('.dialogBoxWindow .saveName').val(previousSave_prompt);
					var sceWorkspace = $.jStorage.get('sceWorkspace');
					var found = null;
					var name = $('.dialogBoxWindow .saveName').val();
					$.each(sceWorkspace, function(index, value) {
						if(value.name == previousSave_prompt) {
							found = index;
						}
					});
					if(found == null) {
						sceWorkspace[sceWorkspace.length] = {name: previousSave_prompt, date: (new Date().format('dS of M, Y ~ H:i:s')), flow: object ? object : workspacePlugin.flowJSON()};
						$.jStorage.set('sceWorkspace', sceWorkspace);
						workspacePlugin.redraw();
					} else {
						$.dialogBox($.data(document, 'template-saveoverdialog'), 'none', {'Replace': 1, 'Back': 0}, function(index) {
							if(index == 1) {
								sceWorkspace[found] = {name: sceWorkspace[found].name, date: (new Date().format('dS of M, Y ~ H:i:s')), flow: object ? object : workspacePlugin.flowJSON()};
								$.jStorage.set('sceWorkspace', sceWorkspace);
								workspacePlugin.redraw();
							} else {
								workspacePlugin.save();
							}
						}, function() {
							$('.dialogBoxWindow .saveover span').text(previousSave_prompt);
						});
					}
				} else {
					if(index == 1) {
						workspacePlugin.save();
					}
				}
			}, function() {
				$('.dialogBoxWindow .saveName').val(previousSave_prompt);
				$('.dialogBoxWindow .saveName').live('change', function() {
					previousSave_prompt = $(this).val();
				});
			});
		},
		remove: function() {
			$.dialogBox($.data(document, 'template-deletedialog'), 'none', {'Delete':1, 'Cancel': 0}, function(index) {
				if(index == 1) {
					var dataItem = $('.workspaceDataTable .highlighted td:first').text();
					if(dataItem !== '') {
						var data = $.jStorage.get('sceWorkspace');
						var sceData = [];
						$.each(data, function(index, value) {
							if(value.name !== dataItem) {
								sceData[sceData.length] = value;
							}
						});
						$.jStorage.set('sceWorkspace', sceData);
						workspacePlugin.redraw();
					}
				}
			}, function() {
				$('.dialogBoxWindow .deletedialogbox span').text($('.workspaceDataTable .highlighted td:first').text());
			});
		},
		open: function() {
			if($(this.menu).length < 1 || $(this.panel).length < 1) {return false;}
			$(this.menu).addClass('active');
			$(this.panel).addClass('animating').animate({
				'margin-left': '0px'
			}, 500, function() {
				$(workspacePlugin.panel).addClass('opened').removeClass('animating');
			});
		},
		close: function() {
			if($(this.menu).length < 1 || $(this.panel).length < 1) {return false;}
			$(this.menu).removeClass('active');
			$(this.panel).addClass('animating').animate({
				'margin-left': '-452px'
			}, 500, function() {
				$(workspacePlugin.panel).removeClass('opened').removeClass('animating');
			});
		},
		toggle: function() {
			if($(this.menu).length < 1 || $(this.panel).length < 1) {return false;}
			if(!$(this.panel).hasClass('animating')) {
				if($(this.panel).hasClass('opened')) {
					this.close();
				} else {
					this.open();
				}
			}
		},
		loadedWSDLs: function() {
			var windows = $('.nmWindow');
			var wsdls = [];
			$.each(windows, function(index, value) {
				var wsdl = $(value).attr('wsdl-path');
				var found = false;
				$.each(wsdls, function(index, value) {
					if(value == wsdl) {
						found = true;
					}
				});
				if(!found) {
					wsdls[wsdls.length] = wsdl;
				}
			});
			return wsdls;
		},
		loadedProcesses: function() {
			var windows = $('.nmWindow');
			var processes = [];
			$.each(windows, function(index, value) {
				var value = $(value);
				processes[processes.length] = {
					index:		value.css('z-index'),
					left:		value.css('left'),
					top:		value.css('top'),
					height:		value.height(),
					id:			value.attr('id'),
					relheight:	value.attr('rel-height'),
					collapsed:	value.hasClass('collapsed'),
					collapsable:value.hasClass('collapsable'),
					label:		value.attr('wsdl-label'),
					path:		value.attr('wsdl-path')
				};
			});
			return processes;
		}
	};
}