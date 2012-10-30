if(!loadedPlugins['initPlugins']) {       
	loadedPlugins['initPlugins'] = true;
	//$("#wsdlPanel").wsdlPlugin(options={'defaultWSDL': wsdlURL});
	//$("#workspacePanel").workspacePlugin(options={});
	//$("#ioPanel").ioPlugin(options={'droppableEl':layerEditor,acceptableEl:".ioContainer"});
	//$("#exportPanel").exportPlugin(options={});
	//$.settingsPlugin();
	servicePlugin.bind();
	settingsPlugin.bind();
	workspacePlugin.bind();
}