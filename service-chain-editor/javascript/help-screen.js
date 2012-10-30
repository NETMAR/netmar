if(!loadedPlugins['help-screen']) {
	loadedPlugins['help-screen'] = true;
	$(document).ready(function() {
		$(window).keydown(function(e) {
			switch(e.keyCode) {
				case 112://F1
					//Load help menu
					load_help_menu();
					return false;
				 break;
			}
		});
	});
	function load_help_menu() {
		var $this = $('.f1_help_screen');
		if($this.hasClass('animating')) {
			return false;
		}
		$this.addClass('animating');
		if($this.hasClass('expanded')) {
			$this.css({'opacity': 1, 'display': 'block'}).animate({'opacity': 0}, 400, function() {
				$this.removeClass('expanded').removeClass('animating').hide();
			});
			} else {
				$this.css({'opacity': 0, 'display': 'block'}).animate({'opacity': 1}, 400, function() {
				$this.addClass('expanded').removeClass('animating');
			});
		}
		return false;
	}
}