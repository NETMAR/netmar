if(!loadedPlugins['functions']) {
	loadedPlugins['functions'] = true;
	window.typeString = function(param) {	return (typeof(param) == 'string');};
	window.typeNumber = function(param) {	return (typeof(param) == 'number');};
	window.typeNumStr = function(param) {	return (typeNumber(param) || typeString(param));};
	window.typeObject = function(param) {	return (typeof(param) == 'object');};
	window.typeFunction = function(param) {	return (typeof(param) == 'function');};
}