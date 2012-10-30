if(!loadedPlugins['panel']) {
	loadedPlugins['panel'] = true;

	window.panelOpen = function(e) {
		$("div.panel:not(#" + this.id + ")");
		each(function(index,el) {
			if($(el).is(":visible")) {
				idEl = $(el).attr("id");
				$("a[panel=" + idEl + "]").trigger("click");
			};
		});
	}
}