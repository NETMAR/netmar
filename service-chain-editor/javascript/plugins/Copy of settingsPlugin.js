if(!loadedPlugins['settingsPlugin']) {
	loadedPlugins['settingsPlugin'] = true;

	function redrawGrid() {
		var canvas = document.getElementById('snapToGridCanvas');
		$(canvas).css({
			'height': $(document).height()+ 'px',
			'width': $(document).width() + 'px'
		});
		var ctx = canvas.getContext('2d');
		canvas.height = $(document).height();
		canvas.width = $(document).width();
		var canvasData = ctx.getImageData(0, 0, canvas.width, canvas.height);
		for (var x = 0; x < canvasData.width; x++) {
			for (var y = 0; y < canvasData.height; y++) {
				if(!(x % parseInt(snapToSize * current_scale)) || !(y % parseInt(snapToSize * current_scale)) && x !==0&& y !== 0) {
					//console.log(x + " - " + y);
					var idx = ((x) + y * canvas.width) * 4;
					var r = 255;
					var g = 0;
					var b = 0;
					var gray = 0
					canvasData.data[idx + 0] = gray;
					canvasData.data[idx + 1] = gray;
					canvasData.data[idx + 2] = gray;
					canvasData.data[idx + 3] = 255;
				}
			}
		}
		ctx.putImageData(canvasData, 0, 0);
	}

	function snapWindowsToGrid() {
		$.each($('.layer .layerCanvas .nmWindow'), function(index, value) {
			//console.log(((($(value).offset().left - 1) * ((current_scale == 1) ? 1 : ((current_scale == 0.75) ? 1.333 : ((current_scale == 0.5) ? 2 : ((current_scale == 0.25) ? 4 : 1))))) ));
			var x = $(value).offset().left - 190;
			var y = $(value).offset().top - 50;
			x = parseInt((x * ((current_scale == 1) ? 1 : ((current_scale == 0.75) ? 1.333 : ((current_scale == 0.5) ? 2 : ((current_scale == 0.25) ? 4 : 1))))) / snapToSize) * snapToSize;
			y = parseInt((y * ((current_scale == 1) ? 1 : ((current_scale == 0.75) ? 1.333 : ((current_scale == 0.5) ? 2 : ((current_scale == 0.25) ? 4 : 1))))) / snapToSize) * snapToSize;
			$(this).css({
				'left': x + 'px',
				'top': y + 'px'
			});
		});
	}

	var settingsPlugin = {
		panel: '#settingsPanel',
		menu: '#settingsMenu',
		snapMin: 60,
		snapMax: 200,
		snapStep: 10,
		bind: function() {
			var snapTo = $(this.panel).find('.snapTo');
			var $this = this;
			if(snapTo.length > 0) {
				$('.snapToSize').slider({
					min: $this.snapMin,
					max: $this.snapMax,
					step: $this.snapStep,
					value: snapToSize,
					change: function(event, ui) {
						snapToSize = ui.value;
						if(snapToGrid) {
							snapWindowsToGrid();
						}
						redrawGrid();
					}
				});
				$(this.panel).bind('mousewheel', function(e, d) {
					if(typeof(d) == 'undefined') {
						d = e.originalEvent.wheelDelta;
					}
					d = d > 0 ? 1 : -1;
					var sts = $('.snapToSize');
					var value = sts.slider('value');
					var max = sts.slider('max');
					var min = sts.slider('min');
					if(d == 1) {
						$('.snapToSize').slider({value: ((value < $this.snapMax) ? value + $this.snapStep : $this.snapMax)});
					} else {
						if(d == -1) {
							$('.snapToSize').slider({value: ((value > $this.snapMin) ? value - $this.snapStep : $this.snapMin)});
						}
					}
				}).find('.snapTo').bind('click', function() {
					snapToGrid = !$(this).hasClass('checked');
					if(snapToGrid) {
						$('#snapToGridCanvas').show();
						snapWindowsToGrid();
					} else {
						$('#snapToGridCanvas').hide();
					}
				});

				panelInits.settings = null;
			} else {
				if(panelInits.settings == null) {
					panelInits.settings = setInterval(function() {settingsPlugin.bind();}, 200);
				}
			}
		},
		open: function() {
			if($(this.menu).length < 1 || $(this.panel).length < 1) {return false;}
			$(this.menu).addClass('active');
			$(this.panel).addClass('animating').animate({
				'margin-top': '0px'
			}, 500, function() {
				$(settingsPlugin.panel).addClass('opened').removeClass('animating');
			});
		},
		close: function() {
			if($(this.menu).length < 1 || $(this.panel).length < 1) {return false;}
			$(this.menu).removeClass('active');
			$(this.panel).addClass('animating').animate({
				'margin-top': '240px'
			}, 500, function() {
				$(settingsPlugin.panel).removeClass('opened').removeClass('animating');
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
		}
	};
}