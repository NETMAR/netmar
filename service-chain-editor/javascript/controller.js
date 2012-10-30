

document.jQready = function() {
	/*$.event.special.tripleclick = {
		setup: function(data, namespaces) {
			var elem = this,
			$elem = jQuery(elem);
			$elem.bind('click', jQuery.event.special.tripleclick.handler);
		},
		teardown: function(namespaces) {
			var elem = this,
			$elem = jQuery(elem);
			$elem.unbind('click', jQuery.event.special.tripleclick.handler);
		},
		handler: function(event) {
			var elem = this,
			$elem = jQuery(elem),
			clicks = $elem.data('clicks') || 0;
			if(($elem.data('last_click') || (new Date().getTime())) < (new Date().getTime()) - 450) {clicks = 0;}
			clicks += 1;
			if(clicks === 3) {
				clicks = 0;
				//set event type to "tripleclick"
				event.type = "tripleclick";
				//let jQuery handle the triggering of "tripleclick" event handlers
				jQuery.event.handle.apply(this, arguments);
			}
			$elem.data('clicks', clicks);
			$elem.data('last_click', (new Date().getTime()));
		}
	};*/
	alert('test');
	//addScript('javascript/jquery.loader.js');
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
		var i			= 0;
		var foundPlugin	= false;
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
	var script	= document.createElement('script');
	script.type	= 'text/javascript';
	var complete = false;
	if(url == false) {
		script.innerHTML = source;
	} else {
		script.src = url + "?_t=" + (new Date().getTime());
	}
	if(typeof($) == 'undefined') {
		var head = document.getElementsByTagName('head').item(0);
		head.appendChild(script);
	} else {
		$('.dynamicscripts').append(script);
	}
	//script.async = true;
	script.onload = script.onreadystatechange = function() {
		if(!complete && (this.readyState || this.readyState === 'loaded' || this.readyState === 'complete')) {
			complete = true;
		}
	}
}
function addStyle(url) {
	var style	= document.createElement('link');
	style.type	= 'text/css';
	style.rel	= 'stylesheet';
	style.media	= 'screen';
	style.href	= url;
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
function ajax(file, avoidCache) {
	return $.ajax({url: file + (avoidCache ? '?_t=' + (new Date().getTime()) : ''), async: false}).responseText;
}
function getTemplate(template, avoidCache) {
	return ajax('templates/' + template + '.xhtml', avoidCache);
}
function xmlStrip(value) {
	return value.replace(/[^a-zA-Z0-9]/g, '_');
}
var loadedPlugins = [];
/*addStyle('css/jquery-ui.css');
addStyle('css/jquery.ui.slider.css');
addStyle('css/jquery.context-menu.css');
addStyle('css/panel.css');
addStyle('css/services.css');
addStyle('css/dialogBox.css');
addStyle('css/workspace.css');
addScript('javascript/jquery/jquery.js');*/
function renderPathLine(x1, y1, x2, y2) {
	clearPathLine();
	drawPathLine(x1, y1, x2, y2);
}
function clearPathLine() {
	var c		= document.getElementById('wireGridCanvas');
	var v		= $('#wireGridCanvas');
	var x		= c.getContext('2d');
	x.fillStyle	= 'white';
	x.beginPath();
	x.clearRect(0, 0, v.width(), v.height());
	x.stroke();
}
function drawPathLine() {
	var update	= false;
	var x1		= arguments[0] ? arguments[0] : 0;
	var y1		= arguments[1] ? arguments[1] : 0;
	var x2		= arguments[2] ? arguments[2] : 0;
	var y2		= arguments[3] ? arguments[3] : 0;
	var x3		= arguments[4] ? arguments[4] : 0;
	var x4		= arguments[5] ? arguments[5] : 0;
	if(x1 + y1 + x2 + y2 == 0) {
		update = true;
	}
	console.log('drawPathLine');
	var c		= document.getElementById('wireGridCanvas');
	var v		= $('#wireGridCanvas');
	var x		= c.getContext('2d');
	var grid	= [];
	var windows	= $('.nmWindow');
	x.lineWidth	= 5;
	size = 20 * current_scale;
	$.each(windows, function(index, value) {
		var l = parseInt($(value).css('left'))
		var t = parseInt($(value).css('top'));
		var r = l + parseInt($(value).width());
		var b = t + parseInt($(value).height());
		windows[index] = [
			Math.floor((l - 20) / size),
			Math.floor((t - 20) / size),
			Math.ceil((	r + 20) / size),
			Math.ceil((	b + 10) / size)
		];
	});
	//var red		= false;
	//console.log('drawPathLine2');
	var rows	= Math.ceil(v.height() / size);
	var columns	= Math.ceil(v.width() / size);
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
			grid[_x][_y]	= (inWay ? 1 : 0);
			//x.fillStyle		= (red == 0) ? 'red' : ((red == 1) ? 'orange' : 'green');
			if(inWay) {
			//	x.fillStyle = 'purple';
			}
			//red++;
			//if(red == 3) {
			//	red = 0;
			//}
			//x.fillRect(_x * 20, _y * 20, 20, 20);
			//x.fillRect(_x, _y, 1, 1);
		}
	}
	//console.log('drawPathLine3');
	//x.fillStyle = 'black';
	if(!update) {
		var start	= [Math.floor(parseInt(x1) / size), Math.floor(parseInt(y1) / size)];
		var end		= [Math.floor(parseInt(x2) / size), Math.floor(parseInt(y2) / size)];
		//console.log(!(grid[start[0]][start[1]] !== 1 && grid[end[0]][end[1]] !== 1));
		var path	= a_star(start, end, grid, rows, columns, !(grid[start[0]][start[1]] !== 1 && grid[end[0]][end[1]] !== 1));
	} else {
		//console.log('testtesttesttesttest');
	}
	//console.log('test');
	//console.log(rows);
	//console.log(columns);
	//console.log('test2');
	//console.log(start);
	//console.log(end);
	x.beginPath();
	/*x.fillStyle = 'orange';
	$.each(grid, function(index, value) {
		$.each(value, function(index2, value2) {
			x.fillRect(index * 20, index2 * 20, (index * 20) + 1, (index2 *20) + 1);
		});
	});
	x.fillStyle = 'green';
	$.each(path, function(index, value) {
		$.each(value, function(index2, value2) {
			x.fillRect(index * 1, index2 * 1, (index * 1) + 1, (index2 *1) + 1);
		});
	});*/
	//x.fillStyle = 'black';
	$.each(windows, function(index, value) {
		//x.fillStyle = 'white';
		//console.log(value);
		//x.fillRect((value[0] * 20) + 10, (value[1] * 20) + 10, (value[2] * 20) - 20, (value[3] * 20) - 20);
		//x.fillRect(value[0], value[1], value[2], value[3]);
	});
	//x.fillStyle = 'yellow';
	//x.fillRect(start[0] * 20, start[1] * 20, 20, 20);
	//x.fillStyle = 'blue';
	//x.fillRect(end[0] * 20, end[1] * 20, 20, 20);
	if(!update) {
		x.moveTo(start[0] * size, start[1] * size);
		console.log(path);
		if(x3 == 0 || x4 == 0) {
			x.moveTo(x1, y1);
		} else {
			x.moveTo(x3, y1);
			x.lineTo(x1, y1);
		}
		if(path.length > 0) {
			$.each(path, function(index, value) {
				var rgb = get_random_color();
				rgb = [hexToR(rgb), hexToG(rgb), hexToG(rgb)];
				//x.fillStyle = (grid[path[index].x][path[index].y]) ? 'green' : 'rgb(' + (255 - rgb[0]) + ', ' + (255 - rgb[1]) + ', ' + (255 - rgb[2]) + ')';
				//x.fillRect(path[index].x*20, path[index].y*20, 20, 20);
				//x.fillRect(path[index].x, path[index].y, 1, 1);
				//x.fillStyle = 'black';
				//x.lineTo(path[index].x * size, path[index].y * size);
				//x.lineTo(path[index].x, path[index].y);
			});
		} else {
			x.lineTo(x2, y2);
		}
		if(x3 == 0 || x4 == 0) {
		} else {
			x.lineTo(x4, y2);
		}
	} else {
		var wires = $.data(document, 'wires-dest');
		
		if(typeof(wires) !== 'undefined') {
			$.each(wires, function(index, value) {
				var tid = $('#' + value.tid + ' .body .' + ((value.type == 'input') ? 'left' : 'right'));
				var pid = $('#' + value.pid + ' .body .' + ((value.type == 'input') ? 'right' : 'left'));
				$.each(tid, function(index, value2) {
					if($(value2).text() == value.name) {
						tid = value2;
					}
				});
				$.each(pid, function(index, value2) {
					if($(value2).text() == value.partner) {
						pid = value2;
					}
				});
				var to = $(tid).offset();
				var po = $(pid).offset();
				x.moveTo((to.left - 190) + ((value.type == 'input') ? -16: 140), to.top - 35);
				x.lineTo((po.left - 190) + ((value.type == 'input') ? 140 : -16), po.top - 35);
				//$(tid).css('border', (Math.round(Math.random() * 20)) + 'px solid black');
				//$(pid).css('border', (Math.round(Math.random() * 20)) + 'px solid black');
		});
		}
	}
	x.stroke();
}
function get_random_color() {
	var letters	= '0123456789ABCDEF'.split('');
	var color	= '#';
	for(var i = 0; i < 6; i++) {
		color += letters[Math.round(Math.random() * 15)];
	}
	return color;
}
function hexToR(h) {return parseInt((cutHex(h)).substring(0,2),16)}
function hexToG(h) {return parseInt((cutHex(h)).substring(2,4),16)}
function hexToB(h) {return parseInt((cutHex(h)).substring(4,6),16)}
function cutHex(h) {return (h.charAt(0)=="#") ? h.substring(1,7):h}
function UUID(){}
UUID.generate=function(){var a=UUID._getRandomInt,b=UUID._hexAligner;return b(a(32),8)+"-"+b(a(16),4)+"-"+b(16384|a(12),4)+"-"+b(32768|a(14),4)+"-"+b(a(48),12)};
UUID._getRandomInt=function(a){if(a<0)return NaN;if(a<=30)return 0|Math.random()*(1<<a);if(a<=53)return(0|Math.random()*1073741824)+(0|Math.random()*(1<<a-30))*1073741824;return NaN};
UUID._getIntAligner=function(a){return function(b,f){for(var c=b.toString(a),d=f-c.length,e="0";d>0;d>>>=1,e+=e)if(d&1)c=e+c;return c}};
UUID._hexAligner=UUID._getIntAligner(16);
var Base64 = {
	// private property
	_keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
	// public method for encoding
	encode: function (input) {
		var output = "";
		var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
		var i = 0;
		input = Base64._utf8_encode(input);
		while(i < input.length) {
			chr1 = input.charCodeAt(i++);
			chr2 = input.charCodeAt(i++);
			chr3 = input.charCodeAt(i++);
			enc1 = chr1 >> 2;
			enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
			enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
			enc4 = chr3 & 63;
			if(isNaN(chr2)) {
				enc3 = enc4 = 64;
			} else {
				if(isNaN(chr3)) {
					enc4 = 64;
				}
			}
			output = output +
			this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
			this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);
		}
		return output;
	},
	// public method for decoding
	decode: function(input) {
		var output = "";
		var chr1, chr2, chr3;
		var enc1, enc2, enc3, enc4;
		var i = 0;
		input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
		while(i < input.length) {
			enc1 = this._keyStr.indexOf(input.charAt(i++));
			enc2 = this._keyStr.indexOf(input.charAt(i++));
			enc3 = this._keyStr.indexOf(input.charAt(i++));
			enc4 = this._keyStr.indexOf(input.charAt(i++));
			chr1 = (enc1 << 2) | (enc2 >> 4);
			chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
			chr3 = ((enc3 & 3) << 6) | enc4;
			output = output + String.fromCharCode(chr1);
			if(enc3 != 64) {
				output = output + String.fromCharCode(chr2);
			}
			if(enc4 != 64) {
				output = output + String.fromCharCode(chr3);
			}
		}
		output = Base64._utf8_decode(output);
		return output;
	},
	// private method for UTF-8 encoding
	_utf8_encode: function(string) {
		string = string.replace(/\r\n/g,"\n");
		var utftext = "";
		for(var n = 0; n < string.length; n++) {
			var c = string.charCodeAt(n);
			if(c < 128) {
				utftext += String.fromCharCode(c);
			} else {
				if((c > 127) && (c < 2048)) {
					utftext += String.fromCharCode((c >> 6) | 192);
					utftext += String.fromCharCode((c & 63) | 128);
				} else {
					utftext += String.fromCharCode((c >> 12) | 224);
					utftext += String.fromCharCode(((c >> 6) & 63) | 128);
					utftext += String.fromCharCode((c & 63) | 128);
				}
			}
		}
		return utftext;
	},
	// private method for UTF-8 decoding
	_utf8_decode: function(utftext) {
		var string = "";
		var i = 0;
		var c = c1 = c2 = 0;
		while(i < utftext.length) {
			c = utftext.charCodeAt(i);
			if(c < 128) {
				string += String.fromCharCode(c);
				i++;
			} else {
				if((c > 191) && (c < 224)) {
					c2 = utftext.charCodeAt(i+1);
					string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
					i += 2;
				} else {
					c2 = utftext.charCodeAt(i+1);
					c3 = utftext.charCodeAt(i+2);
					string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
					i += 3;
				}
			}
		}
		return string;
	}
}
function getAsText(readFile) {
	if(typeof(FileReader) !== 'function') {
		importData = false;
		return;
	}
	var reader = new FileReader();
	reader.readAsText(readFile, "UTF-8");
	reader.onprogress = function(event) {
		if(event.lengthComputable) {
			var loaded = (evt.loaded / evt.total);
			if(loaded < 1) {
				//(loaded * 100) + "%";
			}
		}
	};
	reader.onload = function(event) {
		var fileString = event.target.result;
		if(importData !== false) {
			importData = fileString;
		}
		//document.getElementById('output').innerHTML = fileString;
		//document.getElementById("bar").style.width = 100 + "%";
	};
	reader.onerror = function(event) {
		if(event.target.error.code == event.target.error.NOT_READABLE_ERR) {
			importData = false;
		}
	};
}