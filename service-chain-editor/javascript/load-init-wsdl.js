if(!loadedPlugins['load-init-wsdl']) {
	loadedPlugins['load-init-wsdl'] = true;
	initialLoaded = true;
	$('.emuis_loading_progressbar').progressbar({value: 0});
	parseWSDL(wsdlURL, function(arrayContainers) {
		$(window).resize();
		console.log(arrayContainers);
		servicePlugin.list(arrayContainers);
		$(document).resize();
		//$("#servicePanel").servicePlugin(options={'containers':arrayContainers,'droppableEl':layerEditor,acceptableEl:".serviceLi"});
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