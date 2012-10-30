if(typeof(document)=='undefined'){var document={debugging:true,createElement:function(){return {};},getElementsByTagName:function(){return {item:function(){return {appendChild:function(Object){if(Object.type&&Object.type=='text/javascript'&&Object.src&&Object.src!==''){if(typeof(require)=='function'){require('../'+Object.src.split('?_t=')[0]);}}}}}};}};}if(typeof(window)=='undefined'){var window={location:{host:''}};}

document.jQready = function() {
	addScript('javascript/jquery.loader.js');
};

function addjQQueue(queue) {
	if(typeof($) == 'undefined') {
		setTimeout(function(queue) {addjQQueue(queue);}, 200, queue);
		return;
	}
	if(queue.length > 0) {
		if(typeof(initialScripts) !== 'undefined' && initialScripts < queue.length) {
			initialScripts = queue.length;
		}
		var i = 0;
		var foundPlugin = false;
		for(i = 0; i < loadedPlugins.length; ++i) {
			if(loadedPlugins[i] == queue[0]) {
				foundPlugin = true;
			}
		}
		if(!foundPlugin) {
			loadedPlugins[loadedPlugins.length] = queue[0];
			if(typeof(queue[0]) == 'function') {
				queue[0]();
				queue.splice(0, 1);
				addjQQueue(queue);
			} else {
				$.ajax({
					url: queue[0] + "?_t=" + (new Date().getTime())
				}).done(function(data) { 
					queue.splice(0, 1);
					addScript(false, data);
					addjQQueue(queue);
				});
			}
		} else {
			queue.splice(0, 1);
			addjQQueue(queue);
		}
	}
}

function addScript(url, source) {
	var script = document.createElement( 'script' );
	script.type = 'text/javascript';
	if(url == false) {
		script.innerHTML = source;
	} else {
		script.src = url + "?_t=" + (new Date().getTime());
	}
	if(typeof($) == 'undefined') {
		var head = document.getElementsByTagName('head').item(0);
		head.appendChild(script);
	} else {
		$('head').append(script);
	}
}

function addStyle(url) {
	var style = document.createElement( 'link' );
	style.type = 'text/css';
	style.rel = 'stylesheet';
	style.media = 'screen';
	style.href = url;
	if(typeof($) == 'undefined') {
		var head = document.getElementsByTagName('head').item(0);
		head.appendChild(style);
	} else {
		$('head').append(style);
	}
}

var $jqueryInit = setInterval(function() {
	if(typeof($) !== 'undefiend') {
		clearInterval($jqueryInit);
		document.jQready();
	}
}, 200);

function getTemplate(template, avoidCache) {
	return $.ajax({url: 'templates/' + template + '.xhtml' + (avoidCache?'?_t='+(new Date().getTime()):''), async: false}).responseText;
}

var loadedPlugins = [];

addStyle('css/panel.css');
addStyle('css/services.css');
addStyle('css/dialogBox.css');
addStyle('css/workspace.css');
addStyle('css/jquery-ui.css');
addStyle('css/jquery.ui.slider.css');
addStyle('css/jquery.context-menu.css');
addScript('javascript/jquery/jquery.js');







function renderPathLine(x1, y1, x2, y2) {
	clearPathLine();
	drawPathLine(x1, y1, x2, y2);
}

function clearPathLine() {
	var c = document.getElementById('wireGridCanvas');
	var v = $('#wireGridCanvas');
	var x = c.getContext('2d');
	x.fillStyle = 'white';
	x.beginPath();
	x.clearRect(0, 0, v.width(), v.height());
	x.stroke();
}

function drawPathLine(x1, y1, x2, y2) {
	if(x1 == undefined || y1 == undefined || x2 == undefined || y2 == undefined) {
		x1 = 0;
		y1 = 0;
		x2 = 160;
		y2 = 160;
		return false;
	}
	console.log(arguments);
	var c = document.getElementById('wireGridCanvas');
	var v = $('#wireGridCanvas');
	var x = c.getContext('2d');
	var grid = [];
	var windows = $('.nmWindow');
	x.lineWidth = 5;

	size = 20 * current_scale;

	$.each(windows, function(index, value) {
		var l = Math.floor((parseInt($(value).css('left')) - 10) / size);
		var t = Math.floor((parseInt($(value).css('top')) - 10) / size);
		var r = Math.ceil((parseInt($(value).width()) + 30) / size);
		var b = Math.ceil((parseInt($(value).height()) + 30) / size);
		windows[index] = [l, t, l + r, t + b];
	});

	var red = false;

	var rows = Math.ceil(v.height() / size);
	var columns = Math.ceil(v.width() / size);
	console.log(columns);

	for(var _x = 0; _x < columns; _x++) {
		grid[_x] = [];
		for(var _y = 0; _y < rows; _y++) {
			var inWay = false;
			$.each(windows, function(index, value) {
				if(_x >= value[0] && _x <= value[2] && _y >= value[1] && _y <= value[3]) {
					//console.log(value);
					inWay = true;
				}
			});
			grid[_x][_y] = (inWay ? 1 : 0);
			x.fillStyle = red ? 'red' : 'orange';
			x.fillStyle = inWay ? 'red' : 'orange';
			red = !red;
			//x.fillRect(_x, _y, 1, 1);
			x.fillRect(_x*20, _y*20, 20, 20);
		}
	}
	//x.fillStyle = 'black';
	var start	= [Math.round((parseInt(x1) / size)), Math.round((parseInt(y1) / size))];
	var end		= [Math.round((parseInt(x2) / size)), Math.round((parseInt(y2) / size))];
	var path	= a_star(start, end, grid, rows, columns);//, !(grid[start[0]][start[1]] !== 1 && grid[end[0]][end[1]] !== 1));

	console.log("-");
	console.log(columns, rows);
	console.log("-~");
	console.log(grid[start[0]][[start[1]]]);
	console.log(grid[end[0]][[end[1]]]);
	console.log(start);
	console.log(end);
	console.log(path);
	console.log("-+");
	//x.fillStyle = 'orange';

	//$.each(grid, function(index, value) {
		//$.each(value, function(index2, value2) {
			//x.fillRect(index * 20, index2 * 20, (index * 20) + 1, (index2 *20) + 1);
		//});
	//});

	//x.fillStyle = 'green';

	//$.each(path, function(index, value) {
		//$.each(value, function(index2, value2) {
			//x.fillRect(index * 1, index2 * 1, (index * 1) + 1, (index2 *1) + 1);
		//});
	//});

	x.beginPath();
	x.fillStyle = 'black';
	//x.moveTo(start[0] * size, start[1] * size);
	//x.moveTo(x1, y1);


	$.each(path, function(index, value) {
		var rgb = get_random_color();
		rgb = [hexToR(rgb), hexToG(rgb), hexToG(rgb)];
		x.fillStyle = (grid[path[index].x][path[index].y]) ? 'green' : 'rgb(' + (255 - rgb[0]) + ', ' + (255 - rgb[1]) + ', ' + (255 - rgb[2]) + ')';
		x.fillRect(path[index].x*20, path[index].y*20, 20, 20);
		//x.fillRect(path[index].x, path[index].y, 1, 1);
		//$.each(windows, function(index, value) {
			//x.fillStyle = 'purple';
			//x.fillRect(value[0]*20, value[1]*20, value[2], value[3]);
			//x.fillRect(value[0], value[1], value[2], value[3]);
		//});
		
	});
	console.log(path);
	$.each(path, function(index, value) {
		x.fillStyle = 'black';
		x.fillRect(path[index].x * size, path[index].y * size, value[3]*20);
		//x.lineTo(path[index].x * size, path[index].y * size);
		//x.lineTo(path[index].x, path[index].y);
	});
	//x.lineTo(x2, y2);

	x.stroke();
}


function get_random_color() {
	var letters = '0123456789ABCDEF'.split('');
	var color = '#';
	for (var i = 0; i < 6; i++ ) {
		color += letters[Math.round(Math.random() * 15)];
	}
	return color;
}

function hexToR(h) {return parseInt((cutHex(h)).substring(0,2),16)}
function hexToG(h) {return parseInt((cutHex(h)).substring(2,4),16)}
function hexToB(h) {return parseInt((cutHex(h)).substring(4,6),16)}
function cutHex(h) {return (h.charAt(0)=="#") ? h.substring(1,7):h}