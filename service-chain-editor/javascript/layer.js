if(!loadedPlugins['layer']) {
	loadedPlugins['layer'] = true;
	window.layerWindowZBase	= 2000;
	service_currentWindow	= null;
	window.$layerErrorIteration	= 0;
	window.$layerErrorDirection	= 1;
	window.$layerErrorValue		= 0;

	window.$layerErrorAnimation = setInterval(function() {
		var $size1 = 33 + $layerErrorValue;
		var $size2 = $size1 - 12;
		if($size2 < 0) {$size2 = 0;}
		$('.nmWindow.nmError').css({
			'-webkit-box-shadow':	'0 3px ' + $size1 + 'px rgba(255, 70, 0, 1), 0 3px ' + $size2 + 'px rgba(255, 0, 0, 1)',
			'-moz-box-shadow':		'0 3px ' + $size1 + 'px rgba(255, 70, 0, 1), 0 3px ' + $size2 + 'px rgba(255, 0, 0, 1)',
			'-ms-box-shadow':		'0 3px ' + $size1 + 'px rgba(255, 70, 0, 1), 0 3px ' + $size2 + 'px rgba(255, 0, 0, 1)',
			'-o-box-shadow':		'0 3px ' + $size1 + 'px rgba(255, 70, 0, 1), 0 3px ' + $size2 + 'px rgba(255, 0, 0, 1)',
			'box-shadow':			'0 3px ' + $size1 + 'px rgba(255, 70, 0, 1), 0 3px ' + $size2 + 'px rgba(255, 0, 0, 1)'
		})
		if($layerErrorIteration > 30) {
			$layerErrorIteration = 0;
			if($layerErrorDirection == 1) {
				$layerErrorDirection = -1;
			} else {
				$layerErrorDirection = 1
			}
		}
		$layerErrorValue = $layerErrorValue + $layerErrorDirection;
		$layerErrorIteration++;
	}, 10);

	window.checkWindowsForErrors = function() {
		$handlers = [];
		$problems = [];
		$windows = $('.nmWindow');
		$.each($windows, function(index, $value) {
			$value = $($value);
			$handlers[$handlers.length] = $value.find('.header .handler').text().toLowerCase();
		});
		$.each($handlers, function(index1, value1) {
			$.each($handlers, function(index2, value2) {
				if(index1 !== index2 && value1 == value2) {
					$problems[$problems.length] = value1;
				}
			});
		});
		$windows.removeClass('nmError').css({
			'-webkit-box-shadow':	'6px 8px 23px rgba(0, 162, 162, 1)',
			'-moz-box-shadow':		'6px 8px 23px rgba(0, 162, 162, 1)',
			'-ms-box-shadow':		'6px 8px 23px rgba(0, 162, 162, 1)',
			'-o-box-shadow':		'6px 8px 23px rgba(0, 162, 162, 1)',
			'box-shadow':			'6px 8px 23px rgba(0, 162, 162, 1)'
		});
		$.each($windows, function(index, $value) {
			$value = $($value);
			$.each($problems, function(index, value) {
				if($value.find('.header .handler').text().toLowerCase() == value) {
					$value.addClass('nmError');
				}
			});
		});
		if(!userUnderstandsGlowError) {
			if($('.nmError').length > 0) {
				$.dialogBox('The current highlighted windows have errors because they have the same title.<br />Triple click the title of a window to change it.');
				userUnderstandsGlowError = true;
			}
		}
	}
	$(".layer").contextMenu({
		menu: 'layerContext'
	}, function(action, el, pos) {
		if(action == 'rename'){
			var $this = $('#' + $('#layerContext .rename').attr('nmWindow'));
			if(!$this.hasClass('nmWelcome')) {
				$.data(document, 'nmRename_ID', $this.attr('id'));
				$.dialogBox(
					'<input type="text" class="nmRenameLabel" value="' + $this.find('.header .handler').text() + '"/>',
					'none',
					{
						'Cancel': 0,
						'Rename': 1
					},
					function(val) {
						if(val == 1) {
							$('#' + $.data(document, 'nmRename_ID')).find('.header .handler').text($.data(document, 'nmRename_value'));
							checkWindowsForErrors();
						}
					},
					function() {
						console.log($('.nmRenameLabel').val());
						$('.nmRenameLabel').bind('change', function() {
							$.data(document, 'nmRename_value', $('.nmRenameLabel').val());
						});
						$('.nmRenameLabel').bind('keypress', function() {
							$.data(document, 'nmRename_value', $('.nmRenameLabel').val());
						});
					}
				);
			}
		} else {
			$windows = $('.nmWindow.collapsable');
			$.each($windows, function(index, value) {
				switch(action) {
					case 'collapse_all':
						if(!$(this).hasClass('collapsed')) {
							$(this).find('.handler').trigger('dblclick');
						}
					break;
					case 'expand_all':
						if($(this).hasClass('collapsed')) {
							$(this).find('.handler').trigger('dblclick');
						}
					break;
				}
			});
		}
	});
	$('.service_draggable').live('mouseup', function(mouse) {
		//console.log(mouse);
		mouse.pageX = $(this).offset().left;
		mouse.pageY = $(this).offset().top;
		$('.layer').trigger('mouseup', mouse);
	});
	$(document).live('mousemove', function(mouse) {
		//console.log(service_mouseDown);
		//console.log(service_currentWindow);
		if(service_mouseDown) {
			if(service_currentWindow.label) {
				$('.service_draggable .title').text((!service_currentWindow.serviceio ? servicePlugin.title(service_currentWindow.label) : service_currentWindow.label)).parent().css({
					display:	'block',
					left:		mouse.pageX,
					top:		mouse.pageY
				});
				return;
			}
		}
		$('.service_draggable .title').text('').parent().css({display: 'none', left: 0, top: 0});
	}).live('mouseup', function(mouse) {
		$('.service_draggable .title').text('').parent().css({display: 'none', left: 0, top: 0});
	});
	window.layer_option = function(id, options) {
		var properties = layer_optionDefaults;
		if(typeof(options) == 'object') {
			$.each(options, function(index, value) {
				switch(index) {
					case 'title':		properties.title		= value; break;
					case 'close':		properties.close		= value ? true : false; break;
					case 'collapse':	properties.collapse		= value ? true : false; break;
					case 'collapsed':	properties.collapsed	= value ? true : false; break;
					case 'tooltip':		properties.tooltip		= value; break;
					case 'body':		properties.body			= value; break;
					case 'help':
						if(typeof(value) == 'object') {
							$.each(value, function(index, item) {
								if(typeof(item) !== 'undefined') {
									properties.help.enabled = item ? true : false;
								}
								if(typeof(item) == 'string') {
									properties.help.content = item;
								}
							});
						}
					break;
				}
			});
			layer_options[id] = properties;
		}
		return properties;
	}
	window.layerWindowToFront = function($this) {
		$.each($('.layer .layerCanvas .nmWindow'), function(index, value) {
			var z = parseInt($(value).css('z-index'));
			$(value).css('z-index', ((z < (layerWindowZBase + 1)) ? (layerWindowZBase + 1) : z)  - 1);
		});
		$this.css('z-index', $('.layer .layerCanvas .nmWindow').length + layerWindowZBase);
	}
	window.getLayerWindowHeight = function($id) {
		var $window = $('.layer .layerCanvas #nmWindow_' + $id);
		console.log($window.height() + $window.find('.body').height());
		return $window.height() + $window.find('.body').height();
	}
	window.createHelpWindow = function() {
		$('body').append($.data(document, 'template-layerhelp'));
	}
	window.triggerLayerWindowHelp = function(id) {
		var $help = $('.layerhelp');
		if($help.length < 1) {
			createHelpWindow();
			$('.layerhelp .close').bind('click', function() {
				$('.layerhelp').hide();
			});
		}
		$help = $('.layerhelp');
		if($help.length < 1) {
			return false;
		}
		$help.find('.body').html((layer_option(id).help.content));
		var $window = $('.layer .layerCanvas #nmWindow_' + id);
		$help.css({
			'left':	(190	+ (parseInt($window.css('left'))/ ((current_scale == 1) ? 1 : ((current_scale == 0.75) ? 1.333 : ((current_scale == 0.5) ? 2 : ((current_scale == 0.25) ? 4 : 1)))))) + 'px',
			'top':	(50		+ (parseInt($window.css('top'))	/ ((current_scale == 1) ? 1 : ((current_scale == 0.75) ? 1.333 : ((current_scale == 0.5) ? 2 : ((current_scale == 0.25) ? 4 : 1)))))) + 'px',
			'display':	'block'
		});
	}
	window.updateLayerWindow = function(id, options) {
		var $window = $('.layer .layerCanvas #nmWindow_' + id);
		var properties = layer_option(id, options);
		if(typeof(options) == 'object') {
			$.each(options, function(index, value) {
				switch(index) {
					case 'title':		properties.title		= value; break;
					case 'close':		properties.close		= value ? true : false; break;
					case 'collapse':	properties.collapse		= value ? true : false; break;
					case 'collapsed':	properties.collapsed	= value ? true : false; break;
					case 'tooltip':		properties.tooltip		= value; break;
					case 'body':		properties.body			= value; break;
					case 'help':
						if(typeof(value) == 'object') {
							$.each(value, function(index, item) {
								if(typeof(item) !== 'undefined') {
									properties.help.enabled = item ? true : false;
								}
								if(typeof(item) == 'string') {
									properties.help.content = item;
								}
							});
						}
					break;
				}
			});
		}
		$.data($window, 'layer_options', options);
		$window.find('.handler').text(properties.title);
		$window.find('.body').html(properties.body);
	}
	window.createLayerWindow = function(options, aSync) {
		//console.log(options);
		var properties = layer_optionDefaults;
		if(typeof(options) == 'object') {
			$.each(options, function(index, value) {
				switch(index) {
					case 'title':		properties.title		= value; break;
					case 'close':		properties.close		= value ? true : false; break;
					case 'collapse':	properties.collapse		= value ? true : false; break;
					case 'collapsed':	properties.collapsed	= value ? true : false; break;
					case 'tooltip':		properties.tooltip		= value; break;
					case 'body':		properties.body			= value; break;
					case 'help':
						if(typeof(value) == 'object') {
							$.each(value, function(index, item) {
								if(typeof(item) !== 'undefined') {
									properties.help.enabled = item ? true : false;
								}
								if(typeof(item) == 'string') {
									properties.help.content = item;
								}
							});
						}
					break;
					case 'serviceio':			properties.serviceio		= value ? true : false; break;
					case 'serviceio_content':	properties.serviceio_content= value;break;
					case 'service_type':		properties.service_type		= value;break;
					case 'position':			properties.position			= (value) ? value : null;
				}
			});
		}
		var z = $('.layer .layerCanvas .nmWindow').length + layerWindowZBase;
		var id = null;
		for(var i = 0; i < 1000; i++) {
			if(id == null) {
				id = parseInt(Math.random() * 1000000);
				if($('.layer .layerCanvas #nmWindow_' + id).length > 0) {
					id = null;
				}
			}
		}
		var $window = $((aSync) ? $.data(document, 'template-layerwindow_async') : $.data(document, 'template-layerwindow_sync'));
		$window.css({'z-index': z});
		if(!properties.collapse) {
			$window.addClass('nmWindow_noncollapse');
		}
		var $windows = $('.nmWindow');
		var titles = [];
		var title_done = false;
		$.each($windows, function(index, value) {
			titles[titles.length] = $(value).find('.header .handler').text();
		});
		var ttl = properties.title;
		$.each(titles, function(index, value) {
			var i = 1;
			if(ttl == value && !title_done) {
				for(i = 1; i < 100; i++) {
					$.each(titles, function(index, value2) {
						if((ttl + '_' + i) !== value2 && !title_done) {
							properties.title = ttl + '_' + i;
							title_done = true;
							$.each(titles, function(index, value3) {if(properties.title == value3) {title_done = false;}});
						}
					});
				}
			}
		});
		$window.find('.handler').text(properties.title);
		$window.find('.body').append(properties.body);
		var right = $window.find('.body .right');
		$.each(right, function(index, value) {
			value = $(value);
			if(value.text() !== '') {
			}
		});
		$window.attr('id', 'nmWindow_' + id);
		if(!properties.close) {
			$window.find('.close').hide();
		}
		if(properties.collapse) {
			if(properties.collapsed) {
				$window.addClass('collapsed');
			}
			$window.addClass('collapsable');
		}
		if(!properties.help.enabled) {
			$window.find('.help').hide();
		}
		$window.find('.close').bind('click', function() {
			//alert('Closing windows has been temporarily disabled.');
			//$(this).parents('.nmWindow').remove();
			checkWindowsForErrors();
		});
		$window.find('.help').bind('mouseenter', function(mouse) {
			help_mousetimer	= setInterval(function() {
				layer_mouseDown		= false;
				layer_currentWindow	= null;
			}, 10);
		}).bind('mouseleave', function() {
			clearInterval(help_mousetimer);
		}).bind('click', id, function(id) {
			triggerLayerWindowHelp(id.data);
		});
		$('.layer .layerCanvas').append($window);
		var height = getLayerWindowHeight(id);
		$('.layer .layerCanvas #nmWindow_' + id).css('height', height + 'px').attr('rel-height', height);
		if(properties.collapsed) {
			$window.addClass('nmWindow_collapsed').css({'height': '24px'});
		}
		console.log('---------------------------------');
		console.log(properties);
		if(properties.position) {
			$('.layer .layerCanvas #nmWindow_' + id).css({
				'left':	properties.position[0],
				'top':	properties.position[1]
			});
		}
		//console.log(properties);
		if(properties.serviceio) {
			$window.addClass('serviceio');
			if(properties.service_type) {
				$window.addClass('service' + properties.service_type.substring(0, 1).toLowerCase());
			}
			if(properties.serviceio_content) {
				$window.find('.body').html(properties.serviceio_content);
			}
		}
		checkWindowsForErrors();
		return id;
	}
	$('.layer').live('mousedown', function(mouse) {
		$('.layerhelp').hide();
		if(mouse.which == 1) {
			var potentials	= [];
			var x			= mouse.pageX + $('.layer').scrollLeft() - 190;
			var y			= mouse.pageY + $('.layer').scrollTop() - 50;
			var left		= 0;
			var top			= 0;
			x				= x * ((current_scale == 1) ? 1 : ((current_scale == 0.75) ? 1.333 : ((current_scale == 0.5) ? 2 : ((current_scale == 0.25) ? 4 : 1))));
			y				= y * ((current_scale == 1) ? 1 : ((current_scale == 0.75) ? 1.333 : ((current_scale == 0.5) ? 2 : ((current_scale == 0.25) ? 4 : 1))));
			$.each($('.layer .layerCanvas .nmWindow .handler'), function(index, value) {
				left	= parseInt($(value).parents('.nmWindow').css('left'));
				top		= parseInt($(value).parents('.nmWindow').css('top'));
				if(isNaN(left))	{left	= 0;}
				if(isNaN(top))	{top	= 0;}
				var right	= $(value).parents('.nmWindow').width() + left;
				var bottom	= $(value).parents('.nmWindow .header').height() + top;
				$(value).parents('.nmWindow').css({'opacity': 1});
				if(x >= left && x <= right && y >= top && y <= bottom) {
					$(value).parents('.nmWindow').css({'opacity': 0.7});
					potentials[potentials.length] = $(value).parents('.nmWindow');
				}
			});
			if(potentials.length > 0) {
				var topmost = -1;
				layer_currentWindow = potentials[0];
				if(layer_ctrlDown) {
					$.each(potentials, function(index, value) {
						$(value).toggleClass('nmWindow_multiselect');
					});
				} else {
					$.each(potentials, function(index, value) {
						if(parseInt($(value).css('z-index')) > topmost) {
							layer_currentWindow = value;
							left	= parseInt($(value).css('left'));
							top		= parseInt($(value).css('top'));
							layer_currentWindowOffset = [(x - left), (y - top)];
						}
					});
					layer_mouseDown = true;
				}
			} else {
				layer_currentWindow = null;
			}
			console.log(layer_currentWindow);
			console.log(mouse.which);
			if(layer_currentWindow == null) {
				$('.layer').addClass('Dragger');
			} else {
				$('.layer').removeClass('Dragger');
			}
			layerWindowToFront($(layer_currentWindow));
		}
	}).live('mouseup', function(mouse) {
		console.log(arguments);
		if(service_mouseDown) {
			if(service_currentWindow.label) {
				var x	= mouse.pageX + $('.layer').scrollLeft() - 190;
				var y	= mouse.pageY + $('.layer').scrollTop() - 50;
				console.log(mouse);
				console.log(x, y, 1);
				x		= (x * ((current_scale == 1) ? 1 : ((current_scale == 0.75) ? 1.333 : ((current_scale == 0.5) ? 2 : ((current_scale == 0.25) ? 4 : 1))))) - 115;
				y		= (y * ((current_scale == 1) ? 1 : ((current_scale == 0.75) ? 1.333 : ((current_scale == 0.5) ? 2 : ((current_scale == 0.25) ? 4 : 1))))) - 12;
				console.log(x, y, 2);
				if(x < 0) {x = 0;}
				if(y < 0) {y = 0;}
				console.log(x, y, 3);
				if(snapToGrid) {
					x = parseInt(x / snapToSize) * snapToSize;
					y = parseInt(y / snapToSize) * snapToSize;
				}
				console.log(x, y, 4);
				var len		= 0;
				var i		= 0;
				var j		= 0;
				var html	= '';
				if(service_currentWindow.containerInputs.length >= service_currentWindow.containerOutputs.length && !service_currentWindow.serviceio) {
					len = service_currentWindow.containerInputs.length - service_currentWindow.containerOutputs.length;
					for(i = 0; i < service_currentWindow.containerInputs.length; i++) {
						html += $($.data(document, 'serviceWindow-Link')).addClass('left').addClass('content').addClass('serviceLink').html(service_currentWindow.containerInputs[i])[0].outerHTML;
						if(i >= len) {
							html += $($.data(document, 'serviceWindow-Link')).addClass('right').addClass('content').addClass('serviceLink').html(service_currentWindow.containerOutputs[j])[0].outerHTML;
							j++;
						} else {
							html += $($.data(document, 'serviceWindow-Link')).addClass('right').addClass('serviceLink')[0].outerHTML;
						}
					}
				} else {
					len = service_currentWindow.containerOutputs.length - service_currentWindow.containerInputs.length;
					
				}
				var $id			= createLayerWindow({title:(!service_currentWindow.serviceio ? servicePlugin.title(service_currentWindow.label) : service_currentWindow.label),body:html,help:{enabled:true,content:'Loading description...'},serviceio:!!service_currentWindow.serviceio,serviceio_content:service_currentWindow.serviceio_content ? service_currentWindow.serviceio_content : '',service_type:service_currentWindow.service_type || '',collapsed:service_currentWindow.serviceio ? true : false}, false);
				var nmWindow	= $('#nmWindow_' + $id);
				console.log($id);
				console.log(x, y, 6);
				nmWindow.css({
					'left':	x + 'px',
					'top':	y + 'px'
				}).attr('wsdl-label', service_currentWindow.label).attr('wsdl-path', service_currentWindow.wsdl).attr('wsdl-uri', service_currentWindow.uri).find('.header .help').bind('click', function() {
					var parent			= $(this).parents('.nmWindow');
					var wsdl_path		= parent.attr('wsdl-path');
					var wsdl_label		= parent.attr('wsdl-label');
					var wsdl_uri		= parent.attr('wsdl-uri');
					var wsdl_replace	= wsdl_path.replace(/\./g, '').replace(/\//g, '').replace(/\\/g, '');
					$.each(loadedWSDLs[wsdl_replace], function(index, value) {
						if(value.label == wsdl_label && value.wsdl == wsdl_path) {
							if(typeof(value.help) == undefined || !value.help || value.help == '' || value.help == 'Loading description...') {
								$data = $.ajax({url: './wsdlproxy.php?uri=' + wsdl_uri + '&wsdl=' + servicePlugin.title(value.label), async: true, wsdl_replace:wsdl_replace, wsdl_path:wsdl_path, wsdl_label:wsdl_label, success: function(data) {
									var $this = this;
									data = $(data.replace(/ows:/g, 'ows'));
									$.each(loadedWSDLs[this.wsdl_replace], function(index, value) {
										if(value.label == $this.wsdl_label && value.wsdl == $this.wsdl_path) {
											value.data = data;
											value.help = $(data.find('owstitle')[0]).text() || 'No service information available.';
											$('.layerhelp .body').text(value.help);
										}
									});
								}});
							} else {
								$('.layerhelp .body').text(value.help);
							}
						}
					});
				});
				nmWindow.find('.body .serviceLink').bind('mousedown', function() {
					if(!drawingWire && $(this).hasClass('content')) {
						drawingWireWindow	= $(this).parents('.nmWindow').attr('id');
						drawingWire			= true;
						drawingWireIO		= [($(this).hasClass('left') ? 'input' : ($(this).hasClass('right') ? 'output' : null)), $(this).text()];
					}
				}).bind('mouseup', function() {
					if(drawingWire && drawingWireWindow !== null && drawingWireIO !== null) {
						if($(this).hasClass('content') && $(this).parents('.nmWindow').attr('id') !== drawingWireWindow && (($(this).hasClass('left') && drawingWireIO[0] == 'output') || ($(this).hasClass('right') && drawingWireIO[0] == 'input'))) {
							var destData	= $.data(document, 'wires-dest');
							var srcData		= $.data(document, 'wires-src');
							//console.log($thisData);
							if(destData == undefined) {
								destData	= [];
							}
							if(srcData == undefined) {
								srcData		= [];
							}
							var found = false;
							$.each(destData, function(index, valueD) {
								$.each(srcData, function(index, valueS) {
									if($(this).parents('.nmWindow').attr('id') == valueS.pid && valueD.pid == valueS.tid && $(this).text() == valueS.partner && valueD.partner == valueS.name) {
										found = true;
									}
								});
							});
							var x1	= 0;
							var y1	= 0;
							var x2	= 0;
							var y2	= 0;
							var win	= null;
							if(!found) {
								destData[destData.length] = {name: (($(this).parents('.nmWindow').hasClass('serviceio') && $(this).parents('.nmWindow').find('.labelinput').length) ? $(this).parents('.nmWindow').find('.labelinput').val() : $(this).text()), partner: drawingWireIO[1], tid: $(this).parents('.nmWindow').attr('id'), pid: drawingWireWindow, type: (drawingWireIO[0] == 'input' ? 'output' : 'input')};
								srcData[srcData.length] = {name: drawingWireIO[1], partner: (($(this).parents('.nmWindow').hasClass('serviceio') && $(this).parents('.nmWindow').find('.labelinput').length) ? $(this).parents('.nmWindow').find('.labelinput').val() : $(this).text()), tid: drawingWireWindow, pid: $(this).parents('.nmWindow').attr('id'), type: (drawingWireIO[0] == 'input' ? 'input' : 'output')};
								if(drawingWireIO[0] == 'input') {
									win = $('#' + drawingWireWindow + ' .body .left');
									$.each(win, function(index, value) {
										if($(value).text() == drawingWireIO[1]) {
											win = $(value);
										}
									});
									x1 = ($(this).offset().left + (113 + 40)) - 190; //parseInt($(this).parents('.nmWindow').css('left'));
									y1 = ($(this).offset().top + 20) - 50; //parseInt($(this).parents('.nmWindow').css('top'));
									x2 = (win.offset().left - 40) - 190;
									y2 = (win.offset().top + 20) - 50;
								} else {
									win = $('#' + drawingWireWindow + ' .body .right');
									$.each(win, function(index, value) {
										if($(value).text() == drawingWireIO[1]) {
											win = $(value);
										}
									});
									x1 = (win.offset().left + (113 + 40)) - 190; //parseInt(win.css('left'));
									y1 = (win.offset().top + 20) - 50; //parseInt(win.css('top'));
									x2 = ($(this).offset().left - 40) - 190; //parseInt($(this).parents('.nmWindow').css('left'));
									y2 = ($(this).offset().top + 20) - 50; //parseInt($(this).parents('.nmWindow').css('top'));
								}
								//console.log('fred');
								drawPathLine(x1, y1, x2, y2, x1 - 40, x2 + 40);
							}
							$.data(document, 'wires-dest',	destData);
							$.data(document, 'wires-src',	srcData);
						}
					}
					drawingWireWindow	= null;
					drawingWire			= false;
					drawingWireIO		= null;
				});
			}
			service_mouseDown		= false;
			service_currentWindow	= null;
		}
		if(layer_currentWindow == null) {
			$('.nmWindow_multiselect').removeClass('nmWindow_multiselect');
			checkWindowsForErrors();
		}
		layer_mouseDown		= false;
		layer_currentWindow	= null;
		$('.layer').addClass('Dragger');
		$('.layer .layerCanvas .nmWindow').css({'opacity': 1});
	}).live('mousemove', function(mouse) {
		if($('#layerContext').hidden()) {
			var tmp_layer_currentWindow	= null;
			var potentials				= [];
			var x						= mouse.pageX + $('.layer').scrollLeft()	- 190;
			var y						= mouse.pageY + $('.layer').scrollTop()		- 50;
			var left					= 0;
			var top						= 0;
			x							= x * ((current_scale == 1) ? 1 : ((current_scale == 0.75) ? 1.333 : ((current_scale == 0.5) ? 2. : ((current_scale == 0.25) ? 4 : 1))));
			y							= y * ((current_scale == 1) ? 1 : ((current_scale == 0.75) ? 1.333 : ((current_scale == 0.5) ? 2. : ((current_scale == 0.25) ? 4 : 1))));
			$.each($('.layer .layerCanvas .nmWindow .handler'), function(index, value) {
				left	= parseInt($(value).parents('.nmWindow').css('left'));
				top		= parseInt($(value).parents('.nmWindow').css('top'));
				if(isNaN(left))	{left	= 0;}
				if(isNaN(top))	{top	= 0;}
				var right	= $(value).parents('.nmWindow').width() + left;
				var bottom	= $(value).parents('.nmWindow .header').height() + top;
				$(value).parents('.nmWindow').css({'opacity': 1});
				if(x >= left && x <= right && y >= top && y <= bottom) {
					$(value).parents('.nmWindow').css({'opacity': 0.7});
					potentials[potentials.length] = $(value).parents('.nmWindow');
				}
			});
			if(potentials.length > 0) {
				var topmost = -1;
				tmp_layer_currentWindow = potentials[0];
				$.each(potentials, function(index, value) {
					if(parseInt($(value).css('z-index')) > topmost) {
						layer_currentWindow = value;
						left	= parseInt($(value).css('left'));
						top		= parseInt($(value).css('top'));
					}
				});
			} else {
				tmp_layer_currentWindow = null;
			}
			$('#layerContext .rename').attr('nmWindow', (tmp_layer_currentWindow == null) ? '' : $(tmp_layer_currentWindow).attr('id'));
			if(tmp_layer_currentWindow !== null) {
				$('#layerContext .rename').show();
			} else {
				$('#layerContext .rename').hide();
			}
		}
		if(layer_mouseDown && layer_currentWindow !== null) {
			var x = mouse.pageX + $('.layer').scrollLeft() - 190;
			var y = mouse.pageY + $('.layer').scrollTop() - 50;
			x = (x * ((current_scale == 1) ? 1 : ((current_scale == 0.75) ? 1.333 : ((current_scale == 0.5) ? 2 : ((current_scale == 0.25) ? 4 : 1))))) - layer_currentWindowOffset[0];
			y = (y * ((current_scale == 1) ? 1 : ((current_scale == 0.75) ? 1.333 : ((current_scale == 0.5) ? 2 : ((current_scale == 0.25) ? 4 : 1))))) - layer_currentWindowOffset[1];
			if(x < 0) {x = 0;}
			if(y < 0) {y = 0;}
			if(snapToGrid) {
				x = parseInt(x / snapToSize) * snapToSize;
				y = parseInt(y / snapToSize) * snapToSize;
			}
			if(drawingWire) {
				//console.log('line');
			} else {
				$multiselectWindows = $('.nmWindow_multiselect');
				if(!$(layer_currentWindow).hasClass('nmWindow_multiselect')) {
					$multiselectWindows.removeClass('nmWindow_multiselect');
					$multiselectWindows = [];
				}
				var left = parseInt($(layer_currentWindow).css('left'));
				var top = parseInt($(layer_currentWindow).css('top'));
				if($multiselectWindows.length > 0) {
					var enable_move_x = true;
					var enable_move_y = true;
					var _x = 0;
					var _y = 0;
					var move = {};
					$.each($multiselectWindows, function(index, value) {
						if($(layer_currentWindow).attr('id') !== $(value).attr('id')) {
							_x = parseInt($(value).css('left'))	+ (x - left);
							_y = parseInt($(value).css('top'))	+ (y - top);
							enable_move_x = _x > 0 ? true : false;
							enable_move_y = _y > 0 ? true : false;
						}
					});
					if(enable_move_x) {
						move.left = x + 'px';
					}
					if(enable_move_y) {
						move.top = y + 'px';
					}
					$(layer_currentWindow).css(move);
					$.each($multiselectWindows, function(index, value) {
						if($(layer_currentWindow).attr('id') !== $(value).attr('id')) {
							_x = parseInt($(value).css('left'))	+ (x - left);
							_y = parseInt($(value).css('top'))	+ (y - top);
							if(enable_move_x) {
								move.left = _x + 'px';
							}
							if(enable_move_y) {
								move.top = _y + 'px';
							}
							$(value).css(move);
						}
					});
				} else {
					$(layer_currentWindow).css({
						'left':	x + 'px',
						'top':	y + 'px'
					});
				}
			}
			renderPathLine();
		} else {
			if(layer_mouseDown) {
				var x = mouse.pageX + $('.layer').scrollLeft() - 190;
				var y = mouse.pageY + $('.layer').scrollTop() - 50;
				x = (x * ((current_scale == 1) ? 1 : ((current_scale == 0.75) ? 1.333 : ((current_scale == 0.5) ? 2 : ((current_scale == 0.25) ? 4 : 1))))) - layer_currentWindowOffset[0];
				y = (y * ((current_scale == 1) ? 1 : ((current_scale == 0.75) ? 1.333 : ((current_scale == 0.5) ? 2 : ((current_scale == 0.25) ? 4 : 1))))) - layer_currentWindowOffset[1];
				if(x < 0) {x = 0;}
				if(y < 0) {y = 0;}
				$('.layer').scrollTop(Math.random() * 6000);
			}
		}
	});
	$('.nmWindow .handler').live('dblclick', function() {
		var $this = $(this).parents('.nmWindow');
		$this.toggleClass('collapsed');
		var temp_height = 24 + $this.find('.body').height();
		$this.attr('rel-height', $this.attr('rel-height') > temp_height ? $this.attr('rel-height') : temp_height);
		if($this.hasClass('collapsed')) {
			$this.css('height', '24px');
			$this.find('.body .content').css({left: '16px', position: 'absolute', top: '-26px', opacity: 0});
			$this.find('.body .right').css({left: '86px'});
			$this.find('.body .right').css({left: '86px'});
		} else {
			$this.find('.body .content').css({left: '0px', position: '', top: '0px', opacity: 1});
			$this.find('.body .right').css({left: '0px'});
			$this.css('height', $this.attr('rel-height') + 'px');
		}
		checkWindowsForErrors();
	});
	$('.nmWindow .handler').live('tripleclick_Disabled', function() {
		var $this = $(this).parents('.nmWindow');
		if(!$this.hasClass('nmWelcome')) {
			$.data(document, 'nmRename_ID', $this.attr('id'));
			$this.addClass('collapsed');
			$(this).trigger('dblclick');
			$.dialogBox(
				'<input type="text" class="nmRenameLabel" value="' + $this.find('.header .handler').text() + '"/>',
				'none',
				{
					'Cancel': 0,
					'Rename': 1
				},
				function(val) {
					if(val == 1) {
						$('#' + $.data(document, 'nmRename_ID')).find('.header .handler').text($.data(document, 'nmRename_value'));
						checkWindowsForErrors();
					}
				},
				function() {
					console.log($('.nmRenameLabel').val());
					$('.nmRenameLabel').bind('change', function() {
						$.data(document, 'nmRename_value', $('.nmRenameLabel').val());
					});
					$('.nmRenameLabel').bind('keypress', function() {
						$.data(document, 'nmRename_value', $('.nmRenameLabel').val());
					});
				}
			);
		}
	});
	$(document).live('keydown', function(k) {
		if(k.keyCode == 17) {
			layer_ctrlDown = true;
		}
	}).live('keyup', function(k) {
		if(k.keyCode == 17) {
			layer_ctrlDown = false;
		}
	});
	$(window).keydown(function(e) {
		if(e.keyCode == 17) {
			//document.title = "multiselect";
		}
	}).keyup(function(e) {
		if(e.keyCode == 17) {
			//document.title = "normal";
		}
	});
}