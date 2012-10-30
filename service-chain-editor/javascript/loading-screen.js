if(!loadedPlugins['loading-screen']) {
	loadedPlugins['loading-screen'] = true;
	window.updateProgressBar = function(left) {
		$('.eumis_update_progressbar_handler').animate({'left': left + 'px'}, {
			duration:45000,
			step: function(currentLeft) {
				var $hex = $('.hex-container');
				if($('.hex-container-zoomed').length > 0 && !$hex.hasClass('animating')) {
					$hex.removeClass('animating').css({
						'left':	'130px',
						'top':	'25px'
					});
				} else {
					var loading_block = $('.eumis_loading_block');
					$hex.removeClass('animating').css({
						'left':	loading_block.offset().left	+ 15,
						'top':	loading_block.offset().top	+ 130
					});
				}
				if(initialLoaded) {
					$('.emuis_loading_progressbar div').css({'display': 'block', 'width': currentProgressBar + '%'});
				} else {
					$('.emuis_loading_progressbar div').css({'display': 'block', 'width': ((initialLoadedScripts / initialScripts) * 100) + '%'});
				}
			},
			complete: function() {
				updateProgressBar((left == 1) ? 0 : 1);
			}
		});
	}
	window.spinHex = function(working, deg) {
		var timeOut = 8000;
		setTimeout(function(deg) {
			$('.hex').rotate(deg);
			if(deg == 180) {
				deg = -18;
			}
			spinHex(true, (deg + 9));
		}, timeOut / 100, deg);
	}
	spinHex(false, 0);
}