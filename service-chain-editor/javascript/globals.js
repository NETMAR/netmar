	domainProxy					= "proxy.php?url";
	wsdlURL						= "http://rsg.pml.ac.uk/wps/generic.cgi?WSDL";
	arrContainers				= [];
	initialWSDL					= false;
	wsdlList					= '';
	layerEditor					= null;
	currentProgressBar			= 0;
	current_scale				= 1;
	wireitdraggableelementbody	= false;
	initialScripts				= 0;
	initialLoadedScripts		= 0;
	initialLoaded				= false;
	devel						= true;//(window.location && window.location.host == 'localhost');
	layer_dirty					= false;
	layer_mouseDown				= false;
	layer_ctrlDown				= false;
	layer_ctrlWindows			= [];
	layer_currentWindow			= null;
	layer_currentWindowOffset	= [0, 0];
	drawingWire					= false;
	drawingWireWindow			= null;
	drawingWireIO				= null;
	service_mouseDown			= false;
	service_currentWindow		= null;
	service_currentWindowOffset	= [0, 0];
	snapToGrid					= false;
	snapToSize					= 60;
	help_mousetimer				= null;
	userUnderstandsGlowError	= false;
	panelInits 					= {
		settings:	null
	};
	loadedWSDLs					= [];
	previousSave_prompt			= 'Workflow';
	importData					= null;
	importDataListener			= null;
	layer_options				= [];
	layer_optionDefaults		= {
		title:		'Window',
		close:		true,
		collapse:	true,
		collapsed:	false,
		tooltip:	'',
		body:		'',
		help:		{
			enabled:	false,
			content:	''
		}
	};