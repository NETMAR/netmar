if(!loadedPlugins['resize']) {
	loadedPlugins['resize'] = true;
	$([window, document]).resize(function() {
		$('body').css({
			height:	$(window).height(),
			width:	$(window).width()
		});
		$('html').css({
			height:	$(window).height(),
			width:	$(window).width()
		});
		$('.scale_zoom').css({
			'left':		((($(window).width() - 200 ) > 0)	? $(window).width() - 200  : 0) + 'px',
			'top':		((($(window).height() - 40) > 0)	? $(window).height() - 40 : 0) + 'px',
		});
		$('.layer').css({
			'left':		'190px',
			'top':		'50px',
			'width':	((($(window).width() - 190 ) > 0)	? $(window).width() - 190  : 0) + 'px',
			'height':	((($(window).height() - 50) > 0)	? $(window).height() - 50 : 0) + 'px',
		});

		var canvas = document.getElementById('wireGridCanvas');
		$(canvas).css({
			'height':	$(document).height()+ 'px',
			'width':	$(document).width() + 'px'
		});
		var ctx	= null;
		if(canvas !== null) {
			ctx			= canvas.getContext('2d');
			canvas.height	= $(document).height();
			canvas.width	= $(document).width();
		}

		var $scale = (
			(current_scale == 1)	? 100 : (
			(current_scale == 0.25)	? 400 : (
			(current_scale == 0.5)	? 200 : (
			(current_scale == 0.75)	? 133.3 : (
			(current_scale == 0)	? 100 : (
			0
		))))));
		var $margin = (
			(current_scale == 1)	? 0 : (
			(current_scale == 0.25) ? 2.666 : (
			(current_scale == 0.5)	? 4 : (
			(current_scale == 0.75)	? 8 : (
			(current_scale == 0)	? 0 : (
			0
		))))));
		var $radius = (
			(current_scale == 1)	? 24 : (
			(current_scale == 0.25)	? 94 : (
			(current_scale == 0.5)	? 45 : (
			(current_scale == 0.75)	? 30 : (
			(current_scale == 0)	? 24 : (
			0
		))))));

		var Infinity = 0;
		var width	= ((($('.layer').width()	/ 100) * $scale));
		var height	= ((($('.layer').height()	/ 100) * $scale));
		var left	=-((($('.layer').width()	/ 100) * $scale) / $margin);
		var top		=-((($('.layer').height()	/ 100) * $scale) / $margin);
		if(current_scale == 1) {
			left = 0;
			top = 0;
		}
		$.each($('.nmWindow'), function(index, value) {
			//console.log(($(this).attr('rel-height')));
			if(230 + $(this).offset().left > width) {
				width = 330 + $(this).offset().left;
			}
			if($(this).attr('rel-height') + $(this).offset().top > height) {
				height = ($(this).attr('rel-height') + 100) + $(this).offset().top;
			}
		});
		$('.layer .layerCanvas').css({
			'width':	width + 'px',
			'left':		left + 'px',
			'height':	height + 'px',
			'top':		top + 'px',
			'-webkit-border-radius':$radius + 'px 0 0 0',
			'-moz-border-radius':	$radius + 'px 0 0 0',
			'-ms-border-radius':	$radius + 'px 0 0 0',
			'-o-border-radius':		$radius + 'px 0 0 0',
			'border-radius':		$radius + 'px 0 0 0'
		});
		//$('#servicePanel, #exportPanel, #ioPanel').css({'height':$(window).height() - 42});
		$('#servicePanel').css({'height':$(window).height() - 45, 'left': $(window).width() - 300});
		//$('#workspacePanel').css({'top': (parseInt($('#linkGroup').css('top')) + $('#linkGroup').height()) + 'px'});
		//$('#wsdlPanel').css({'top': (parseInt($('#linkGroup').css('top')) + $('#linkGroup').height()) + 'px'});
		$('#settingsPanel').css({'top': ($(document).height() - 240) + 'px', 'left': (($(document).width() / 2) -  ($('#settingsPanel').width() / 2)) + 'px'});
		//console.log(((($('.layer').width() / 100) * $scale) / $margin) + 1);

		$('#serviceScrollArea, #serviceScrollArea .viewport').height($('#servicePanel').height() - ($('.serviceListSearchFilterAndIO').height() + 55));
		console.log($('#serviceScrollArea'));
		$('#serviceScrollArea').tinyscrollbar_update();
		console.log($('#serviceScrollArea'));

		redrawGrid();

		$.each($('.dialogBoxWindow'), function(index, value) {
			$(value).css({
				'left':	($(value).parent().width() / 2)		- ($(value).width() / 2),
				'top':	($(value).parent().height() / 2)	- ($(value).height() / 2)
			});
		});
	});

	$(document).bind('mousemove', function(mouse) {
		
	});
	$(document).bind('mouseup', function(mouse) {
		layer_mouseDown			= false;
		layer_currentWindow		= null;
		service_mouseDown		= false;
		service_currentWindow	= null;
	});
}