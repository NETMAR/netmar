if(!loadedPlugins['load-menus']) {
	loadedPlugins['load-menus'] = true;
	var $menu_handler = $('#linkGroup');
	window.alignMenu = function($this, topMost, leftMost, rightMost, bottomMost) {
		var position = [
			((parseInt($(window).width()) / 2)	- (parseInt($('#' + $this.attr('panel')).width()) / 2))		+ 'px',
			((parseInt($(window).height()) / 2)	- (parseInt($('#' + $this.attr('panel')).height()) / 2))	+ 'px'
		];
		if(topMost)		{position[1] = 0;}
		if(leftMost)	{position[0] = 0;}
		if(rightMost)	{position[0] = (parseInt($(window).width())		- parseInt($('#' + $this.attr('panel')).width()))	+ 'px';}
		if(bottomMost)	{position[0] = (parseInt($(window).height())	- parseInt($('#' + $this.attr('panel')).height()))	+ 'px';}
		$('#' + $this.attr('panel')).css({
			'left': position[0],
			'top': position[1]
		});
	}
	window.load_menu = function(panel, text, callback) {
		var $menu = $($.data(document, 'template-menu'));
		$menu_handler.append($menu.attr('id', panel + $menu.attr('id')).attr('panel', panel + $menu.attr('panel')).text(text).bind('click', function() {callback($(this));return false;}).bind("isOpen", panelOpen));
	}
	//load_menu('wsdl', 'WSDL', function($this) {$('#' + $this.attr('panel')).css({'left':0, 'top': ($menu_handler.offset().top + $menu_handler.height()) + 'px'});});
	load_menu('workspace', 'Workspace', function($this) {workspacePlugin.toggle(); $(window).resize();}); //$('#' + $this.attr('panel')).css({'left':0, 'top': ($menu_handler.offset().top + $menu_handler.height()) + 'px'});});
	//load_menu('service', 'Service List', function($this) {$('#' + $this.attr('panel')).css({'left':parseInt($(window).width()) - parseInt($('#' + $this.attr('panel')).width()) + 'px', 'top': 0});});
	load_menu('service', 'Service List', function($this) {servicePlugin.toggle(); $(window).resize();});
	//load_menu('io', 'Service I/O', function($this) {$('#' + $this.attr('panel')).css({'left':parseInt($(window).width()) - parseInt($('#' + $this.attr('panel')).width()) + 'px', 'top': 0});});
	//load_menu('export', 'Export', function($this) {$('#' + $this.attr('panel')).css({'left':parseInt($(window).width()) - parseInt($('#' + $this.attr('panel')).width()) + 'px', 'top': 0});});
	load_menu('settings', 'Settings', function($this) {settingsPlugin.toggle(); $(window).resize();});
}