if(!loadedPlugins['servicePlugin']) {
	loadedPlugins['servicePlugin'] = true;
	

	window.servicePlugin = {
		panel: '#servicePanel',
		menu: '#serviceMenu',
		bind: function() {
			$('.serviceio_title .title').bind('click', function() {
				$('.serviceio_puts').toggle();
				$(window).trigger('resize');
			});
			$('#serviceScrollArea').tinyscrollbar();
			$('.serviceListSearchFilter input').live('keyup', function(e) {
				var search = $(this).val().toLowerCase();
				$.each($('.accordionList'), function(index, value) {
					value = $(value);
					$.each(value.find('.serviceListAccordionHeader span'), function(i, v) {
						v = $(v);
						if(v.text().toLowerCase().indexOf(search) > -1) {
							v.parent().show().next().show();
						} else {
							v.parent().hide().next().hide();
						}
					});
				});
				$(window).trigger('resize');
			});
			$(window).trigger('resize');
		},
		open: function() {
			if($(this.menu).length < 1 || $(this.panel).length < 1) {return false;}
			$(this.menu).addClass('active');
			$(this.panel).addClass('animating').animate({
				'margin-left': '0px'
			}, {
				duration: 500,
				complete: function() {
					$(servicePlugin.panel).addClass('opened').removeClass('animating');
				},
				step: function(i, f) {
					$('.zoomBoxShadow').css('left', 96 - i);
				}
			});
		},
		close: function() {
			if($(this.menu).length < 1 || $(this.panel).length < 1) {return false;}
			$(this.menu).removeClass('active');
			$(this.panel).addClass('animating').animate({
				'margin-left': '300px'
			}, {
				duration: 500,
				complete: function() {
					$(servicePlugin.panel).removeClass('opened').removeClass('animating');
				},
				step: function(i, f) {
					$('.zoomBoxShadow').css('left', (-i) + 96);
				}
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
		title: function(title) {
			title = title.split('ExecuteProcess_');
			return title[1];
		},
		list: function(arrayContainers) {
			//if($('.serviceLi-WSDL').length < 1) {
			//	setTimeout(function(arrayContainers) {servicePlugin.list(arrayContainers, false);}, 200, arrayContainers);
			//	return false;
			//}
			//console.log('gotpast');
			arrayContainers = loadedWSDLs[arrayContainers];
			var wsdl = arrayContainers.splice(0, 1)[0];
			wsdl = wsdl.wsdl;
			var $service = '';
			var $wsdl = $('<div>' + $.data(document, 'serviceLi-WSDL') + '<div class="accordionList"></div></div>');
			//console.log($wsdl.find('.title-wsdl')[0]);
			$($wsdl.find('.title-wsdl')[0]).text($(wsdl.split('/')).last()[0]).attr('title', wsdl);/*.bind('click', function() {
				$.each($(this).parent().find('.serviceLi'), function(index, value) {
					if($(value).attr('rel') !== 'undefined') {
						//$(value).toggle();
					}
				});
				$('.serviceLi .serviceLi').show();
				var $this = $(this).parent();
				$this.toggleClass('collapsed');
				if($this.hasClass('collapsed')) {
					$this.css({'padding-bottom':'0px'});
				} else {
					$this.css({'padding-bottom':'20px'});
				}
			});*/
			$.each(arrayContainers, function(index, value) {
				if(typeof(value) == 'object') {
					$service = $($.data(document, 'serviceList-syncItem'));
					$service.attr('rel', value.label);
					$service.attr('wsdl', wsdl);
					$($service[0]).find('span').text(servicePlugin.title(value.label))
					/*$service.text(servicePlugin.title(value.label)).bind('click', function() {
						//$(this).parent().find('ul').toggle();
					});*/
					var inputs = false;
					var outputs = false;
					if(servicePlugin.title(value.label) !== undefined) {
						$.each(value.containerInputs, function(index, value) {
							$service.find('.serviceInputs').parent().append($($.data(document, 'serviceList-LI')).text(value).addClass('input'));
							inputs = true;
						});
						if(inputs == false) {
							$service.find('.serviceInputs').parent().remove();
						}
						$.each(value.containerOutputs, function(index, value) {
							$service.find('.serviceOutputs').parent().append($($.data(document, 'serviceList-LI')).text(value).addClass('output'));
							outputs = true;
						});
						if(outputs == false) {
							$service.find('.serviceOutputs').parent().remove();
						}
						$service.find('ul').css('display', 'none');
						$wsdl.find('.accordionList').append($service);
					}
				}
			});
			$wsdl.live('click', function() {
				//console.log($(this));
				var $this = $(this).next();
				$this.toggle();
				$('#serviceScrollArea').tinyscrollbar_update('relative');
			});
			wsdlList += $wsdl.html();
			$('#serviceAccordion').accordion('destroy').html(wsdlList).accordion({header:'.serviceLi-WSDL'});
			$('.serviceListAccordionHeader span').bind('click', function() {$(this).next().find('ul').toggle();$('#serviceScrollArea').tinyscrollbar_update('relative');});
			$('.serviceListAccordionHeader .help').bind('click', function() {alert('help window');});
			$('#serviceScrollArea').tinyscrollbar_update('relative');
			$(document).trigger('resize');
		}
	};

	$('.serviceio_puts div').live('mousedown', function(mouse) {
		var $this = $(this);
		var $service = null;
		service_mouseDown = true;
		//console.log($this.text());
		switch($this.text()) {
			case 'Input':
				$service = {
					containerInputs: [''],
					containerOutputs: ['input'],
					label: 'Service I/O - Input',
					wsdl: '',
					serviceio: true,
					serviceio_content: $($.data(document, 'serviceWindow-Link')).html('<div style="width:216px;margin-left:-103px;">' + $($.data(document, 'serviceWindow-IO-Input')).html() + '</div>').css({height:'auto'}).addClass('right').addClass('content').addClass('serviceLink')[0].outerHTML,
					service_type: 'input'
				};
			break;
			case 'Output':
				$service = {
					containerInputs: ['output'],
					containerOutputs: [''],
					label: 'Service I/O - Output',
					wsdl: '',
					serviceio: true,
					//serviceio_content: $($.data(document, 'serviceWindow-Link')).html('<div style="width:226px;">bob</div>').css({height:'auto'}).addClass('left').addClass('content').addClass('serviceLink')[0].outerHTML,
					serviceio_content: $($.data(document, 'serviceWindow-Link')).html('<div style="width:216px;margin-left:0px;">' + $($.data(document, 'serviceWindow-IO-Output')).html() + '</div>').css({height:'auto'}).addClass('left').addClass('content').addClass('serviceLink')[0].outerHTML,
					service_type: 'output'
				};
			break;
			case 'Encode':
				$service = {
					containerInputs:	['bytes'],
					containerOutputs:	['base64'],
					label:				'Encode Base64 Arr',
					wsdl:				'',
					serviceio:			true,
					serviceio_content:	$($.data(document, 'serviceList-LI-Services')).find('encode64').html(),//'<div style="width:216px;margin-left:0px;">' + $($.data(document, 'serviceWindow-IO-Output')).html() + '</div>').css({height:'auto'}).addClass('left').addClass('content').addClass('serviceLink')[0].outerHTML,
					service_type:		'encode64'
				};
			break;
			case 'Decode':
				$service = {
					containerInputs:	['base64'],
					containerOutputs:	['bytes'],
					label:				'Decode Base64 Arr',
					wsdl:				'',
					serviceio:			true,
					serviceio_content:	$($.data(document, 'serviceList-LI-Services')).find('decode64').html(),
					service_type:		'decode64'
				};
			break;
			default:
				$service = null;
				service_mouseDown = false;
			break;
		}
		service_currentWindow = $service;
		//console.log(service_currentWindow);
	});
	$('#servicePanel .serviceListAccordionHeader').live('mousedown', function(mouse) {
		var $this = $(this);
		var $service = null;
		service_mouseDown = true;
		$.each(loadedWSDLs[$this.attr('wsdl').replace(/\./g, '').replace(/\//g, '').replace(/\\/g, '')], function(index, value) {
			if(value.wsdl == $this.attr('wsdl') && value.label == $this.attr('rel')) {
				$service = value;
			}
			/*$.each(value, function(index, value2) {
				if(value2.wsdl == $this.attr('wsdl') && value2.label == $this.attr('rel')) {
					$service = value2;
				}
			});*/
		});
		service_currentWindow = $service;
		//console.log(service_currentWindow);
		if(mouse.which == 1) {
			var potentials = [];
			var x = mouse.pageX - 190;
			var y = mouse.pageY - 50;
			var left = 0;
			var top = 0;
			/*if(potentials.length > 0) {
				var topmost = -1;
				layer_currentWindow = potentials[0];
				$.each(potentials, function(index, value) {
					if(parseInt($(value).css('z-index')) > topmost) {
						layer_currentWindow = value;
						left = parseInt($(value).css('left'));
						top = parseInt($(value).css('top'));
						layer_currentWindowOffset = [(x - left), (y - top)];
					}
				});
				layer_mouseDown = true;
			} else {
				layer_currentWindow = null;
			}*/
		}
	}).live('mousemove', function(mouse) {
		/*if(layer_mouseDown && layer_currentWindow !== null) {
			var x = mouse.pageX - 190;
			var y = mouse.pageY - 50;
			x = (x * ((current_scale == 1) ? 1 : ((current_scale == 0.75) ? 1.333 : ((current_scale == 0.5) ? 2 : ((current_scale == 0.25) ? 4 : 1))))) - layer_currentWindowOffset[0];
			y = (y * ((current_scale == 1) ? 1 : ((current_scale == 0.75) ? 1.333 : ((current_scale == 0.5) ? 2 : ((current_scale == 0.25) ? 4 : 1))))) - layer_currentWindowOffset[1];
			if(x < 0) {x = 0;}
			if(y < 0) {y = 0;}
			if(snapToGrid) {
				x = parseInt(x / snapToSize) * snapToSize;
				y = parseInt(y / snapToSize) * snapToSize;
			}
			$(layer_currentWindow).css({
				'left':x + 'px',
				'top':y + 'px'
			});
		}*/
	});

	$('.serviceListLoadWSDL .button').bind('click', function() {
		$('.emuis_loading_progressbar').progressbar({value: 0});
		$.dialogBox($.data(document, 'loadWSDL-Dialog'), 'none', {Load: 1, Cancel: 0}, function(result) {
			if(result == 1) {
				$('.eumis_loading_screen').css({opacity: 1, display: 'block'});
				parseWSDL($('.loadWSDLDialogInput').val(), function(arrayContainers) {
					$(window).resize();
					servicePlugin.list(arrayContainers);
				}, function(val, max) {
					if(val == -1) {
						$('.emuis_loading_progressbar').progressbar({value: 100});
						$('.hex-container').addClass('hex-container-zoomed');
						setTimeout(function($this) {
							$('.eumis_loading_screen').animate({'opacity': 0}, 750, function() {
								if(!$this) {$this = $(this);}
								$this.hide();
							});
						}, 2500, (typeof($this) == 'undefined') ? false : $this);
					} else {
						$('.emuis_loading_progressbar').progressbar({value: (val / max) * 100});
					}
				});
			}
		});
	});
}