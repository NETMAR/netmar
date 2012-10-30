<?php
	header('Content-type: text/javascript');
	$beforeFunc = '';//"(function(){";
	$afterFunc = '';//"}),\n\n";
	//if(typeof(document)==='undefined'){var document={debugging:true,createElement:function(){return {};},getElementsByTagName:function(){return {item:function(){return {appendChild:function(Object){if(Object.type&&Object.type=='text/javascript'&&Object.src&&Object.src!==''){if(typeof(require)=='function'){require('../'+Object.src.split('?_t=')[0]);}}}}}};}};}if(typeof(window)=='undefined'){var window={location:{host:''}};}
	echo file_get_contents(getcwd() . '/../jquery/jquery.js') . "\n\n";
	echo $beforeFunc . file_get_contents(getcwd() . '/../jquery/jquery.ui.js') . $afterFunc . "/*E*/";
	echo $beforeFunc . file_get_contents(getcwd() . '/../jquery/jquery.transform-css.js') . $afterFunc . "/*F*/";
	echo $beforeFunc . file_get_contents(getcwd() . '/../jquery/jquery.3dtransform-css.js') . $afterFunc . "/*0*/";
	echo $beforeFunc . file_get_contents(getcwd() . '/../jquery/jquery.slider.js') . $afterFunc . "/*1*/";
	echo $beforeFunc . file_get_contents(getcwd() . '/../jquery/jquery.data-tables.js') . $afterFunc  . "/*2*/";
	echo $beforeFunc . file_get_contents(getcwd() . '/../jquery/jquery.fileinput.js') . $afterFunc  . "/*3*/";
	echo $beforeFunc . file_get_contents(getcwd() . '/../jquery/jquery.context-menu.js') . $afterFunc  . "/*4*/";
	echo $beforeFunc . file_get_contents(getcwd() . '/../jquery/jquery.mousewheel.js') . $afterFunc  . "/*5*/";
	echo $beforeFunc . file_get_contents(getcwd() . '/../jquery/jstorage.js') . $afterFunc;
	echo file_get_contents(getcwd() . '/../controller.js') . "\n\n";
	echo file_get_contents(getcwd() . '/../globals.js') . "\n\n";
	?>
	

	//console.log($.data(document));
	//loadedPlugins['jquery.loader'] = true;
	alert('bob');
	//addScript('javascript/jquery/jquery.js');
	var preload_functions = [];
	var timer_functions = setInterval(function() {
		console.log('bob');
		if($('body').length > 0) {
			clearInterval(timer_functions);
			<?php
			//echo $beforeFunc . file_get_contents(getcwd() . '/../functions.js') . $afterFunc;
			//echo $beforeFunc . file_get_contents(getcwd() . '/../loading-screen.js') . $afterFunc;
			//echo $beforeFunc . file_get_contents(getcwd() . '/../help-screen.js') . $afterFunc;
			//echo $beforeFunc . file_get_contents(getcwd() . '/../wsdl-parse.js') . $afterFunc;
			/*echo $beforeFunc . file_get_contents(getcwd() . '/../panel.js') . $afterFunc;
			echo $beforeFunc . file_get_contents(getcwd() . '/../load-menus.js') . $afterFunc;
			echo $beforeFunc . file_get_contents(getcwd() . '/../load-panels.js') . $afterFunc;*/
			//echo $beforeFunc . file_get_contents(getcwd() . '/../plugins/json.js') . $afterFunc;
			//echo $beforeFunc . file_get_contents(getcwd() . '/../plugins/tinyscroll.js') . $afterFunc;
			////echo $beforeFunc . file_get_contents(getcwd() . '/../plugins/wsdlPlugin.js') . $afterFunc;
			//echo $beforeFunc . file_get_contents(getcwd() . '/../plugins/workspacePlugin.js') . $afterFunc;
			////echo $beforeFunc . file_get_contents(getcwd() . '/../plugins/ioPlugin.js') . $afterFunc;
			//echo $beforeFunc . file_get_contents(getcwd() . '/../plugins/servicePlugin.js') . $afterFunc;
			////echo $beforeFunc . file_get_contents(getcwd() . '/../plugins/exportPlugin.js') . $afterFunc;
			//echo $beforeFunc . file_get_contents(getcwd() . '/../plugins/settingsPlugin.js') . $afterFunc;
			//echo $beforeFunc . file_get_contents(getcwd() . '/../plugins/scrollsync.js') . $afterFunc;
			//echo $beforeFunc . file_get_contents(getcwd() . '/../plugins/dragscrollable.js') . $afterFunc;
			//echo $beforeFunc . file_get_contents(getcwd() . '/../workflow.js') . $afterFunc;
			//echo $beforeFunc . file_get_contents(getcwd() . '/../plugins/date.js') . $afterFunc;
			//echo $beforeFunc . file_get_contents(getcwd() . '/../plugins/dialogBox.js') . $afterFunc;
			//echo $beforeFunc . file_get_contents(getcwd() . '/../plugins/hidvis.js') . $afterFunc;
			//echo $beforeFunc . file_get_contents(getcwd() . '/../scale.js') . $afterFunc;
			//echo $beforeFunc . file_get_contents(getcwd() . '/../astar.js') . $afterFunc;
			//echo $beforeFunc . file_get_contents(getcwd() . '/../layer.js') . $afterFunc;
			//echo $beforeFunc . file_get_contents(getcwd() . '/../resize.js') . $afterFunc;
			//echo $beforeFunc . file_get_contents(getcwd() . '/../plugins/initPlugins.js') . $afterFunc;
			//echo $beforeFunc . file_get_contents(getcwd() . '/../load-init-wsdl.js') . $afterFunc;
			
			?>
			/*$('#nmWindow_' + createLayerWindow({
				title: 'SCE: Welcome!',
				close: true,
				collapse: true,
				collapsed: false,
				tooltip: 'Welcome!',
				body: '<div style="position:absolute;border-left:4px solid #000000;border-top:4px solid #000000;height:10px;width:10px;display:block;left:3px;top:3px;-webkit-transform:rotate(45deg);-moz-transform:rotate(45deg);-ms-transform:rotate(45deg);-o-transform:rotate(45deg);transform:rotate(45deg);border-radius:0px 8px 0px 8px;"><div style="position:relative;height:4px;width:130px;-webkit-transform:rotate(45deg);-moz-transform:rotate(45deg);-ms-transform:rotate(45deg);-o-transform:rotate(45deg);transform:rotate(45deg);background: #000000;left:-20px;top:43px;border-radius:0px 130px 0px 0px;"></div></div><p style="width:196px;margin-left:27px;">Welcome to the EUMIS SCE (Service Chain Editor).</p><p style="width:196px;margin-left:27px;">Please select the help icon, in the top left of this window, for assistance using this service tool.</p>',
				help: {
					enabled: true,
					content: '<!-- More details! -->Please press your F1 key to get to the Help Screen<br /><br />Using your mouse, you can left-click, hold and drag window around the screen<br /><br />With multiple windows on the screen at one time, you can hold the left Control (Ctrl) key on your keyboard, and then with your mouse, left click on the titles of windows to "Multi-select" them, so you can drag multiple windows together - simply click on a white space or de-select windows by holding Ctrl again and clicking already selected windows<br /><br />You can bring windows which are behind other windows to the foreground by "clicking through windows", left clicking where the window\'s title is behind the other windows<br /><br />The Help Icon in the top left of windows will try and bring you the most relavent information about the selected window\'s service abilities<br /><br />Clicking on the (X) in the top right of windows, will remove that window from the Service Chain Editor (SCE)<br /><br />You can also right-click anywhere on the window canvas area, to view the context menu, with which, you can select to collapse, or expand all windows in the area in one easy click<br /><br /><br /><br /><br />Thank you for using the EUMIS Service Chain Editor!'
				}
			})).addClass('nmWelcome').css({
				left:	$('.layer').scrollLeft() + (($('.layer').width() / 2) - ($('.nmWelcome').width() / 2)),
				top:	$('.layer').scrollTop() + (($('.layer').height() / 2) - ($('.nmWelcome').height() / 2))
			});
			$('.checkbox-ui').bind('click', function() {$(this).toggleClass('checked');});*/
		}
	}, 100);//(function() {
		
	//})];
	
	/*var preload_function_length = preload_functions.length;
	var postload_function_length = 0;
	var lastload_function_length = -1;
	
	console.log('test');
	var loadedPlugins_length = loadedPlugins.length - 1;
	function loadFunction() {
		if(postload_function_length <= preload_function_length) {
			setTimeout(function() {
				
				if((loadedPlugins.length -1) > postload_function_length) {
					if(lastload_function_length !== (loadedPlugins.length -1)) {
						
						//preload_functions[preload_function_length]();
						
						preload_function_length++;
					}
				}
			}, 10);
		}
	}
	$.each(preload_functions, function(index, value) {
		value();
	});*/
	<?php ?>