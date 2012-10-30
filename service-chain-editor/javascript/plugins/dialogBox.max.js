if(!loadedPlugins['dialogBox']) {
	loadedPlugins['dialogBox'] = true;
	var dialogBoxTemplate = $($.ajax({url: 'templates/dialogBox.xhtml', async: false}).responseText);
	(function($) {
		var methods = {
			init: function(options) {	// (message, icon, type, callback)
				var template	= dialogBoxTemplate;
				var type		= "Ok";
				var callback	= function() {};
				var icon		= "None";
				var message		= "";

				//console.error(dialogBoxTemplate);

				var throwError = function() {
					throw new Error('Dialog Box plugin - usage: $(element).dialogBox(/*String*/ "Message", /*String*/ "Icon" /*[Warning, Question, Alert, None*/, /*String/Object*/ "Type" /*Yes/No, Cancel, Yes/No/Cancel, Retry, Yes/No/Cancel/Retry, Retry/Abort*/ /*{"Option1": "yes", "Option2": "no"}*/, /*function*/ function() {callback();});');
					return false;
				};
				var isBadRequest = false;
				if(arguments.length == 0 || arguments.length > 4) {
					isBadRequest = true;
				} else {
					if(arguments.length > 0) {
						if(typeNumStr(arguments[0])) {
							message = arguments[0];
						} else {
							isBadRequest = true;
						}
					}
					if(arguments.length > 1) {
						if(typeNumStr(arguments[1])) {
							icon = arguments[1];
						} else {
							isBadRequest = true;
						}
					}
					if(arguments.length > 2) {
						if(typeNumStr(arguments[2]) || typeObject(arguments[2])) {
							type = arguments[2];
						} else {
							isBadRequest = true;
						}
					}
					if(arguments.length > 3) {
						if(typeFunction(arguments[3])) {
							callback = arguments[3];
						} else {
							isBadRequest = true;
						}
					}
				}

				if(isBadRequest) {
					return throwError();
				}

				if(typeNumStr(type)) {
					switch(type.toLowerCase().replace(/\ /g, '').replace(/\//g, '')) {
						case 'ok':
							type = {
								'OK': 1
							};
						break;
						case 'yesno':
						case 'noyes':
						case 'truefalse':
						case 'falsetrue':
						case 'yn':
						case 'ny':
						case '01':
						case '10':
							type = {
								'No':	0,
								'Yes':	1
							};
						break;
						case 'retryok':
						case 'okretry':
						case 'yesretry':
						case 'retryyes':
							type = {
								'OK':	1,
								'Retry':0
							};
						break;
						default:
							type = {
								'OK':	1
							};
						break;
					}
				}
				switch(icon.toLowerCase().replace(/\ /g, '').replace(/\//g, '')) {
					case 'none':
						icon = '';
					break;
					case 'warn':
						icon = 'Warning';
					break;
					default:
						icon = '';
					break;
				}

				var buttons = '';
				$.each(type, function(index, value) {
					var button = $(template.find('buttonarray').html());
					button.find('.dialogBox_button_value').text(index).attr('rel', value).removeClass('dialogBox_button_value');
					buttons += button.html();
				});
				console.log(buttons);
				buttons = $(buttons);
				$.each(buttons, function(index, value) {
					$(value).bind('click', function() {
						if(typeof($(this).attr('rel')) !== 'undefined') {
							callback($(this).attr('rel'));
						} else {
							callback($(this).find('.button').attr('rel'));
						}
						$(this).parents('.dialogBox').remove();
					});
				});

				var temp = $(template.find('objectcontainer').html());
				temp.find('.dialogBox_button_values').append(buttons).removeClass('dialogBox_button_values');
				temp.find('.dialogBox_text_value').html(message).removeClass('dialogBox_text_value');
				temp.find('.dialogBox_icon_value').text(icon).removeClass('dialogBox_icon_value');
				temp.bind('keypress', function(k) {
					console.log(k);
					if(k.keyCode == 13) {
						temp.find('.button[rel=1]').trigger('click');
					}
				});
				console.log(temp)
				this.append(temp);
				$(window).trigger('resize');
				return true;
			}
		};

		$.fn.dialogBox = function(method, options) {
			var $this = (this == $) ? $('body') : this;
			if(methods[method]) {
				return methods[method].apply($this, Array.prototype.slice.call(arguments, 1));
			} else {
				if(typeof(method) == 'object' || !method) {
					return methods.init.apply($this, arguments);
				} else {
					return methods.init.apply($this, arguments);
				}
			}
		}
	})(jQuery);

	$.dialogBox = $.fn.dialogBox;
}