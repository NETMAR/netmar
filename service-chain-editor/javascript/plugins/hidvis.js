if(!loadedPlugins['hidvis']) {
	loadedPlugins['hidvis'] = true;
	(function($) {
		$.fn.hidden = function(method, options) {
			if(this == $) {return false;}
			if(typeof(this.css) !== 'undefined') {
				return !!(this.css('display') == 'none');
			}
			return false;
		}
		$.fn.visible = function(method, options) {
			if(this == $) {return true;}
			if(typeof(this.css) !== 'undefined') {
				return !(this.css('display') == 'none');
			}
			return false;
		}
	})(jQuery);

	$.hidden	= $.fn.hidden;
	$.visible	= $.fn.visible;
}
/*
http://rsg.pml.ac.uk/wps/testdata/elev_srtm_30m.tif
EPSG:4326
reproject image
geo2tiff
*/