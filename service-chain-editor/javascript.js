/*JQuery*/

	/*!
	 * jQuery JavaScript Library v1.7.2
	 * http://jquery.com/
	 *
	 * Copyright 2011, John Resig
	 * Dual licensed under the MIT or GPL Version 2 licenses.
	 * http://jquery.org/license
	 *
	 * Includes Sizzle.js
	 * http://sizzlejs.com/
	 * Copyright 2011, The Dojo Foundation
	 * Released under the MIT, BSD, and GPL Licenses.
	 *
	 * Date: Wed Mar 21 12:46:34 2012 -0700
	 */
	(function( window, undefined ) {

	// Use the correct document accordingly with window argument (sandbox)
	var document = window.document,
		navigator = window.navigator,
		location = window.location;
	var jQuery = (function() {

	// Define a local copy of jQuery
	var jQuery = function( selector, context ) {
			// The jQuery object is actually just the init constructor 'enhanced'
			return new jQuery.fn.init( selector, context, rootjQuery );
		},

		// Map over jQuery in case of overwrite
		_jQuery = window.jQuery,

		// Map over the $ in case of overwrite
		_$ = window.$,

		// A central reference to the root jQuery(document)
		rootjQuery,

		// A simple way to check for HTML strings or ID strings
		// Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
		quickExpr = /^(?:[^#<]*(<[\w\W]+>)[^>]*$|#([\w\-]*)$)/,

		// Check if a string has a non-whitespace character in it
		rnotwhite = /\S/,

		// Used for trimming whitespace
		trimLeft = /^\s+/,
		trimRight = /\s+$/,

		// Match a standalone tag
		rsingleTag = /^<(\w+)\s*\/?>(?:<\/\1>)?$/,

		// JSON RegExp
		rvalidchars = /^[\],:{}\s]*$/,
		rvalidescape = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,
		rvalidtokens = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,
		rvalidbraces = /(?:^|:|,)(?:\s*\[)+/g,

		// Useragent RegExp
		rwebkit = /(webkit)[ \/]([\w.]+)/,
		ropera = /(opera)(?:.*version)?[ \/]([\w.]+)/,
		rmsie = /(msie) ([\w.]+)/,
		rmozilla = /(mozilla)(?:.*? rv:([\w.]+))?/,

		// Matches dashed string for camelizing
		rdashAlpha = /-([a-z]|[0-9])/ig,
		rmsPrefix = /^-ms-/,

		// Used by jQuery.camelCase as callback to replace()
		fcamelCase = function( all, letter ) {
			return ( letter + "" ).toUpperCase();
		},

		// Keep a UserAgent string for use with jQuery.browser
		userAgent = navigator.userAgent,

		// For matching the engine and version of the browser
		browserMatch,

		// The deferred used on DOM ready
		readyList,

		// The ready event handler
		DOMContentLoaded,

		// Save a reference to some core methods
		toString = Object.prototype.toString,
		hasOwn = Object.prototype.hasOwnProperty,
		push = Array.prototype.push,
		slice = Array.prototype.slice,
		trim = String.prototype.trim,
		indexOf = Array.prototype.indexOf,

		// [[Class]] -> type pairs
		class2type = {};

	jQuery.fn = jQuery.prototype = {
		constructor: jQuery,
		init: function( selector, context, rootjQuery ) {
			var match, elem, ret, doc;

			// Handle $(""), $(null), or $(undefined)
			if ( !selector ) {
				return this;
			}

			// Handle $(DOMElement)
			if ( selector.nodeType ) {
				this.context = this[0] = selector;
				this.length = 1;
				return this;
			}

			// The body element only exists once, optimize finding it
			if ( selector === "body" && !context && document.body ) {
				this.context = document;
				this[0] = document.body;
				this.selector = selector;
				this.length = 1;
				return this;
			}

			// Handle HTML strings
			if ( typeof selector === "string" ) {
				// Are we dealing with HTML string or an ID?
				if ( selector.charAt(0) === "<" && selector.charAt( selector.length - 1 ) === ">" && selector.length >= 3 ) {
					// Assume that strings that start and end with <> are HTML and skip the regex check
					match = [ null, selector, null ];

				} else {
					match = quickExpr.exec( selector );
				}

				// Verify a match, and that no context was specified for #id
				if ( match && (match[1] || !context) ) {

					// HANDLE: $(html) -> $(array)
					if ( match[1] ) {
						context = context instanceof jQuery ? context[0] : context;
						doc = ( context ? context.ownerDocument || context : document );

						// If a single string is passed in and it's a single tag
						// just do a createElement and skip the rest
						ret = rsingleTag.exec( selector );

						if ( ret ) {
							if ( jQuery.isPlainObject( context ) ) {
								selector = [ document.createElement( ret[1] ) ];
								jQuery.fn.attr.call( selector, context, true );

							} else {
								selector = [ doc.createElement( ret[1] ) ];
							}

						} else {
							ret = jQuery.buildFragment( [ match[1] ], [ doc ] );
							selector = ( ret.cacheable ? jQuery.clone(ret.fragment) : ret.fragment ).childNodes;
						}

						return jQuery.merge( this, selector );

					// HANDLE: $("#id")
					} else {
						elem = document.getElementById( match[2] );

						// Check parentNode to catch when Blackberry 4.6 returns
						// nodes that are no longer in the document #6963
						if ( elem && elem.parentNode ) {
							// Handle the case where IE and Opera return items
							// by name instead of ID
							if ( elem.id !== match[2] ) {
								return rootjQuery.find( selector );
							}

							// Otherwise, we inject the element directly into the jQuery object
							this.length = 1;
							this[0] = elem;
						}

						this.context = document;
						this.selector = selector;
						return this;
					}

				// HANDLE: $(expr, $(...))
				} else if ( !context || context.jquery ) {
					return ( context || rootjQuery ).find( selector );

				// HANDLE: $(expr, context)
				// (which is just equivalent to: $(context).find(expr)
				} else {
					return this.constructor( context ).find( selector );
				}

			// HANDLE: $(function)
			// Shortcut for document ready
			} else if ( jQuery.isFunction( selector ) ) {
				return rootjQuery.ready( selector );
			}

			if ( selector.selector !== undefined ) {
				this.selector = selector.selector;
				this.context = selector.context;
			}

			return jQuery.makeArray( selector, this );
		},

		// Start with an empty selector
		selector: "",

		// The current version of jQuery being used
		jquery: "1.7.2",

		// The default length of a jQuery object is 0
		length: 0,

		// The number of elements contained in the matched element set
		size: function() {
			return this.length;
		},

		toArray: function() {
			return slice.call( this, 0 );
		},

		// Get the Nth element in the matched element set OR
		// Get the whole matched element set as a clean array
		get: function( num ) {
			return num == null ?

				// Return a 'clean' array
				this.toArray() :

				// Return just the object
				( num < 0 ? this[ this.length + num ] : this[ num ] );
		},

		// Take an array of elements and push it onto the stack
		// (returning the new matched element set)
		pushStack: function( elems, name, selector ) {
			// Build a new jQuery matched element set
			var ret = this.constructor();

			if ( jQuery.isArray( elems ) ) {
				push.apply( ret, elems );

			} else {
				jQuery.merge( ret, elems );
			}

			// Add the old object onto the stack (as a reference)
			ret.prevObject = this;

			ret.context = this.context;

			if ( name === "find" ) {
				ret.selector = this.selector + ( this.selector ? " " : "" ) + selector;
			} else if ( name ) {
				ret.selector = this.selector + "." + name + "(" + selector + ")";
			}

			// Return the newly-formed element set
			return ret;
		},

		// Execute a callback for every element in the matched set.
		// (You can seed the arguments with an array of args, but this is
		// only used internally.)
		each: function( callback, args ) {
			return jQuery.each( this, callback, args );
		},

		ready: function( fn ) {
			// Attach the listeners
			jQuery.bindReady();

			// Add the callback
			readyList.add( fn );

			return this;
		},

		eq: function( i ) {
			i = +i;
			return i === -1 ?
				this.slice( i ) :
				this.slice( i, i + 1 );
		},

		first: function() {
			return this.eq( 0 );
		},

		last: function() {
			return this.eq( -1 );
		},

		slice: function() {
			return this.pushStack( slice.apply( this, arguments ),
				"slice", slice.call(arguments).join(",") );
		},

		map: function( callback ) {
			return this.pushStack( jQuery.map(this, function( elem, i ) {
				return callback.call( elem, i, elem );
			}));
		},

		end: function() {
			return this.prevObject || this.constructor(null);
		},

		// For internal use only.
		// Behaves like an Array's method, not like a jQuery method.
		push: push,
		sort: [].sort,
		splice: [].splice
	};

	// Give the init function the jQuery prototype for later instantiation
	jQuery.fn.init.prototype = jQuery.fn;

	jQuery.extend = jQuery.fn.extend = function() {
		var options, name, src, copy, copyIsArray, clone,
			target = arguments[0] || {},
			i = 1,
			length = arguments.length,
			deep = false;

		// Handle a deep copy situation
		if ( typeof target === "boolean" ) {
			deep = target;
			target = arguments[1] || {};
			// skip the boolean and the target
			i = 2;
		}

		// Handle case when target is a string or something (possible in deep copy)
		if ( typeof target !== "object" && !jQuery.isFunction(target) ) {
			target = {};
		}

		// extend jQuery itself if only one argument is passed
		if ( length === i ) {
			target = this;
			--i;
		}

		for ( ; i < length; i++ ) {
			// Only deal with non-null/undefined values
			if ( (options = arguments[ i ]) != null ) {
				// Extend the base object
				for ( name in options ) {
					src = target[ name ];
					copy = options[ name ];

					// Prevent never-ending loop
					if ( target === copy ) {
						continue;
					}

					// Recurse if we're merging plain objects or arrays
					if ( deep && copy && ( jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)) ) ) {
						if ( copyIsArray ) {
							copyIsArray = false;
							clone = src && jQuery.isArray(src) ? src : [];

						} else {
							clone = src && jQuery.isPlainObject(src) ? src : {};
						}

						// Never move original objects, clone them
						target[ name ] = jQuery.extend( deep, clone, copy );

					// Don't bring in undefined values
					} else if ( copy !== undefined ) {
						target[ name ] = copy;
					}
				}
			}
		}

		// Return the modified object
		return target;
	};

	jQuery.extend({
		noConflict: function( deep ) {
			if ( window.$ === jQuery ) {
				window.$ = _$;
			}

			if ( deep && window.jQuery === jQuery ) {
				window.jQuery = _jQuery;
			}

			return jQuery;
		},

		// Is the DOM ready to be used? Set to true once it occurs.
		isReady: false,

		// A counter to track how many items to wait for before
		// the ready event fires. See #6781
		readyWait: 1,

		// Hold (or release) the ready event
		holdReady: function( hold ) {
			if ( hold ) {
				jQuery.readyWait++;
			} else {
				jQuery.ready( true );
			}
		},

		// Handle when the DOM is ready
		ready: function( wait ) {
			// Either a released hold or an DOMready/load event and not yet ready
			if ( (wait === true && !--jQuery.readyWait) || (wait !== true && !jQuery.isReady) ) {
				// Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).
				if ( !document.body ) {
					return setTimeout( jQuery.ready, 1 );
				}

				// Remember that the DOM is ready
				jQuery.isReady = true;

				// If a normal DOM Ready event fired, decrement, and wait if need be
				if ( wait !== true && --jQuery.readyWait > 0 ) {
					return;
				}

				// If there are functions bound, to execute
				readyList.fireWith( document, [ jQuery ] );

				// Trigger any bound ready events
				if ( jQuery.fn.trigger ) {
					jQuery( document ).trigger( "ready" ).off( "ready" );
				}
			}
		},

		bindReady: function() {
			if ( readyList ) {
				return;
			}

			readyList = jQuery.Callbacks( "once memory" );

			// Catch cases where $(document).ready() is called after the
			// browser event has already occurred.
			if ( document.readyState === "complete" ) {
				// Handle it asynchronously to allow scripts the opportunity to delay ready
				return setTimeout( jQuery.ready, 1 );
			}

			// Mozilla, Opera and webkit nightlies currently support this event
			if ( document.addEventListener ) {
				// Use the handy event callback
				document.addEventListener( "DOMContentLoaded", DOMContentLoaded, false );

				// A fallback to window.onload, that will always work
				window.addEventListener( "load", jQuery.ready, false );

			// If IE event model is used
			} else if ( document.attachEvent ) {
				// ensure firing before onload,
				// maybe late but safe also for iframes
				document.attachEvent( "onreadystatechange", DOMContentLoaded );

				// A fallback to window.onload, that will always work
				window.attachEvent( "onload", jQuery.ready );

				// If IE and not a frame
				// continually check to see if the document is ready
				var toplevel = false;

				try {
					toplevel = window.frameElement == null;
				} catch(e) {}

				if ( document.documentElement.doScroll && toplevel ) {
					doScrollCheck();
				}
			}
		},

		// See test/unit/core.js for details concerning isFunction.
		// Since version 1.3, DOM methods and functions like alert
		// aren't supported. They return false on IE (#2968).
		isFunction: function( obj ) {
			return jQuery.type(obj) === "function";
		},

		isArray: Array.isArray || function( obj ) {
			return jQuery.type(obj) === "array";
		},

		isWindow: function( obj ) {
			return obj != null && obj == obj.window;
		},

		isNumeric: function( obj ) {
			return !isNaN( parseFloat(obj) ) && isFinite( obj );
		},

		type: function( obj ) {
			return obj == null ?
				String( obj ) :
				class2type[ toString.call(obj) ] || "object";
		},

		isPlainObject: function( obj ) {
			// Must be an Object.
			// Because of IE, we also have to check the presence of the constructor property.
			// Make sure that DOM nodes and window objects don't pass through, as well
			if ( !obj || jQuery.type(obj) !== "object" || obj.nodeType || jQuery.isWindow( obj ) ) {
				return false;
			}

			try {
				// Not own constructor property must be Object
				if ( obj.constructor &&
					!hasOwn.call(obj, "constructor") &&
					!hasOwn.call(obj.constructor.prototype, "isPrototypeOf") ) {
					return false;
				}
			} catch ( e ) {
				// IE8,9 Will throw exceptions on certain host objects #9897
				return false;
			}

			// Own properties are enumerated firstly, so to speed up,
			// if last one is own, then all properties are own.

			var key;
			for ( key in obj ) {}

			return key === undefined || hasOwn.call( obj, key );
		},

		isEmptyObject: function( obj ) {
			for ( var name in obj ) {
				return false;
			}
			return true;
		},

		error: function( msg ) {
			throw new Error( msg );
		},

		parseJSON: function( data ) {
			if ( typeof data !== "string" || !data ) {
				return null;
			}

			// Make sure leading/trailing whitespace is removed (IE can't handle it)
			data = jQuery.trim( data );

			// Attempt to parse using the native JSON parser first
			if ( window.JSON && window.JSON.parse ) {
				return window.JSON.parse( data );
			}

			// Make sure the incoming data is actual JSON
			// Logic borrowed from http://json.org/json2.js
			if ( rvalidchars.test( data.replace( rvalidescape, "@" )
				.replace( rvalidtokens, "]" )
				.replace( rvalidbraces, "")) ) {

				return ( new Function( "return " + data ) )();

			}
			jQuery.error( "Invalid JSON: " + data );
		},

		// Cross-browser xml parsing
		parseXML: function( data ) {
			if ( typeof data !== "string" || !data ) {
				return null;
			}
			var xml, tmp;
			try {
				if ( window.DOMParser ) { // Standard
					tmp = new DOMParser();
					xml = tmp.parseFromString( data , "text/xml" );
				} else { // IE
					xml = new ActiveXObject( "Microsoft.XMLDOM" );
					xml.async = "false";
					xml.loadXML( data );
				}
			} catch( e ) {
				xml = undefined;
			}
			if ( !xml || !xml.documentElement || xml.getElementsByTagName( "parsererror" ).length ) {
				jQuery.error( "Invalid XML: " + data );
			}
			return xml;
		},

		noop: function() {},

		// Evaluates a script in a global context
		// Workarounds based on findings by Jim Driscoll
		// http://weblogs.java.net/blog/driscoll/archive/2009/09/08/eval-javascript-global-context
		globalEval: function( data ) {
			if ( data && rnotwhite.test( data ) ) {
				// We use execScript on Internet Explorer
				// We use an anonymous function so that context is window
				// rather than jQuery in Firefox
				( window.execScript || function( data ) {
					window[ "eval" ].call( window, data );
				} )( data );
			}
		},

		// Convert dashed to camelCase; used by the css and data modules
		// Microsoft forgot to hump their vendor prefix (#9572)
		camelCase: function( string ) {
			return string.replace( rmsPrefix, "ms-" ).replace( rdashAlpha, fcamelCase );
		},

		nodeName: function( elem, name ) {
			return elem.nodeName && elem.nodeName.toUpperCase() === name.toUpperCase();
		},

		// args is for internal usage only
		each: function( object, callback, args ) {
			var name, i = 0,
				length = object.length,
				isObj = length === undefined || jQuery.isFunction( object );

			if ( args ) {
				if ( isObj ) {
					for ( name in object ) {
						if ( callback.apply( object[ name ], args ) === false ) {
							break;
						}
					}
				} else {
					for ( ; i < length; ) {
						if ( callback.apply( object[ i++ ], args ) === false ) {
							break;
						}
					}
				}

			// A special, fast, case for the most common use of each
			} else {
				if ( isObj ) {
					for ( name in object ) {
						if ( callback.call( object[ name ], name, object[ name ] ) === false ) {
							break;
						}
					}
				} else {
					for ( ; i < length; ) {
						if ( callback.call( object[ i ], i, object[ i++ ] ) === false ) {
							break;
						}
					}
				}
			}

			return object;
		},

		// Use native String.trim function wherever possible
		trim: trim ?
			function( text ) {
				return text == null ?
					"" :
					trim.call( text );
			} :

			// Otherwise use our own trimming functionality
			function( text ) {
				return text == null ?
					"" :
					text.toString().replace( trimLeft, "" ).replace( trimRight, "" );
			},

		// results is for internal usage only
		makeArray: function( array, results ) {
			var ret = results || [];

			if ( array != null ) {
				// The window, strings (and functions) also have 'length'
				// Tweaked logic slightly to handle Blackberry 4.7 RegExp issues #6930
				var type = jQuery.type( array );

				if ( array.length == null || type === "string" || type === "function" || type === "regexp" || jQuery.isWindow( array ) ) {
					push.call( ret, array );
				} else {
					jQuery.merge( ret, array );
				}
			}

			return ret;
		},

		inArray: function( elem, array, i ) {
			var len;

			if ( array ) {
				if ( indexOf ) {
					return indexOf.call( array, elem, i );
				}

				len = array.length;
				i = i ? i < 0 ? Math.max( 0, len + i ) : i : 0;

				for ( ; i < len; i++ ) {
					// Skip accessing in sparse arrays
					if ( i in array && array[ i ] === elem ) {
						return i;
					}
				}
			}

			return -1;
		},

		merge: function( first, second ) {
			var i = first.length,
				j = 0;

			if ( typeof second.length === "number" ) {
				for ( var l = second.length; j < l; j++ ) {
					first[ i++ ] = second[ j ];
				}

			} else {
				while ( second[j] !== undefined ) {
					first[ i++ ] = second[ j++ ];
				}
			}

			first.length = i;

			return first;
		},

		grep: function( elems, callback, inv ) {
			var ret = [], retVal;
			inv = !!inv;

			// Go through the array, only saving the items
			// that pass the validator function
			for ( var i = 0, length = elems.length; i < length; i++ ) {
				retVal = !!callback( elems[ i ], i );
				if ( inv !== retVal ) {
					ret.push( elems[ i ] );
				}
			}

			return ret;
		},

		// arg is for internal usage only
		map: function( elems, callback, arg ) {
			var value, key, ret = [],
				i = 0,
				length = elems.length,
				// jquery objects are treated as arrays
				isArray = elems instanceof jQuery || length !== undefined && typeof length === "number" && ( ( length > 0 && elems[ 0 ] && elems[ length -1 ] ) || length === 0 || jQuery.isArray( elems ) ) ;

			// Go through the array, translating each of the items to their
			if ( isArray ) {
				for ( ; i < length; i++ ) {
					value = callback( elems[ i ], i, arg );

					if ( value != null ) {
						ret[ ret.length ] = value;
					}
				}

			// Go through every key on the object,
			} else {
				for ( key in elems ) {
					value = callback( elems[ key ], key, arg );

					if ( value != null ) {
						ret[ ret.length ] = value;
					}
				}
			}

			// Flatten any nested arrays
			return ret.concat.apply( [], ret );
		},

		// A global GUID counter for objects
		guid: 1,

		// Bind a function to a context, optionally partially applying any
		// arguments.
		proxy: function( fn, context ) {
			if ( typeof context === "string" ) {
				var tmp = fn[ context ];
				context = fn;
				fn = tmp;
			}

			// Quick check to determine if target is callable, in the spec
			// this throws a TypeError, but we will just return undefined.
			if ( !jQuery.isFunction( fn ) ) {
				return undefined;
			}

			// Simulated bind
			var args = slice.call( arguments, 2 ),
				proxy = function() {
					return fn.apply( context, args.concat( slice.call( arguments ) ) );
				};

			// Set the guid of unique handler to the same of original handler, so it can be removed
			proxy.guid = fn.guid = fn.guid || proxy.guid || jQuery.guid++;

			return proxy;
		},

		// Mutifunctional method to get and set values to a collection
		// The value/s can optionally be executed if it's a function
		access: function( elems, fn, key, value, chainable, emptyGet, pass ) {
			var exec,
				bulk = key == null,
				i = 0,
				length = elems.length;

			// Sets many values
			if ( key && typeof key === "object" ) {
				for ( i in key ) {
					jQuery.access( elems, fn, i, key[i], 1, emptyGet, value );
				}
				chainable = 1;

			// Sets one value
			} else if ( value !== undefined ) {
				// Optionally, function values get executed if exec is true
				exec = pass === undefined && jQuery.isFunction( value );

				if ( bulk ) {
					// Bulk operations only iterate when executing function values
					if ( exec ) {
						exec = fn;
						fn = function( elem, key, value ) {
							return exec.call( jQuery( elem ), value );
						};

					// Otherwise they run against the entire set
					} else {
						fn.call( elems, value );
						fn = null;
					}
				}

				if ( fn ) {
					for (; i < length; i++ ) {
						fn( elems[i], key, exec ? value.call( elems[i], i, fn( elems[i], key ) ) : value, pass );
					}
				}

				chainable = 1;
			}

			return chainable ?
				elems :

				// Gets
				bulk ?
					fn.call( elems ) :
					length ? fn( elems[0], key ) : emptyGet;
		},

		now: function() {
			return ( new Date() ).getTime();
		},

		// Use of jQuery.browser is frowned upon.
		// More details: http://docs.jquery.com/Utilities/jQuery.browser
		uaMatch: function( ua ) {
			ua = ua.toLowerCase();

			var match = rwebkit.exec( ua ) ||
				ropera.exec( ua ) ||
				rmsie.exec( ua ) ||
				ua.indexOf("compatible") < 0 && rmozilla.exec( ua ) ||
				[];

			return { browser: match[1] || "", version: match[2] || "0" };
		},

		sub: function() {
			function jQuerySub( selector, context ) {
				return new jQuerySub.fn.init( selector, context );
			}
			jQuery.extend( true, jQuerySub, this );
			jQuerySub.superclass = this;
			jQuerySub.fn = jQuerySub.prototype = this();
			jQuerySub.fn.constructor = jQuerySub;
			jQuerySub.sub = this.sub;
			jQuerySub.fn.init = function init( selector, context ) {
				if ( context && context instanceof jQuery && !(context instanceof jQuerySub) ) {
					context = jQuerySub( context );
				}

				return jQuery.fn.init.call( this, selector, context, rootjQuerySub );
			};
			jQuerySub.fn.init.prototype = jQuerySub.fn;
			var rootjQuerySub = jQuerySub(document);
			return jQuerySub;
		},

		browser: {}
	});

	// Populate the class2type map
	jQuery.each("Boolean Number String Function Array Date RegExp Object".split(" "), function(i, name) {
		class2type[ "[object " + name + "]" ] = name.toLowerCase();
	});

	browserMatch = jQuery.uaMatch( userAgent );
	if ( browserMatch.browser ) {
		jQuery.browser[ browserMatch.browser ] = true;
		jQuery.browser.version = browserMatch.version;
	}

	// Deprecated, use jQuery.browser.webkit instead
	if ( jQuery.browser.webkit ) {
		jQuery.browser.safari = true;
	}

	// IE doesn't match non-breaking spaces with \s
	if ( rnotwhite.test( "\xA0" ) ) {
		trimLeft = /^[\s\xA0]+/;
		trimRight = /[\s\xA0]+$/;
	}

	// All jQuery objects should point back to these
	rootjQuery = jQuery(document);

	// Cleanup functions for the document ready method
	if ( document.addEventListener ) {
		DOMContentLoaded = function() {
			document.removeEventListener( "DOMContentLoaded", DOMContentLoaded, false );
			jQuery.ready();
		};

	} else if ( document.attachEvent ) {
		DOMContentLoaded = function() {
			// Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).
			if ( document.readyState === "complete" ) {
				document.detachEvent( "onreadystatechange", DOMContentLoaded );
				jQuery.ready();
			}
		};
	}

	// The DOM ready check for Internet Explorer
	function doScrollCheck() {
		if ( jQuery.isReady ) {
			return;
		}

		try {
			// If IE is used, use the trick by Diego Perini
			// http://javascript.nwbox.com/IEContentLoaded/
			document.documentElement.doScroll("left");
		} catch(e) {
			setTimeout( doScrollCheck, 1 );
			return;
		}

		// and execute any waiting functions
		jQuery.ready();
	}

	return jQuery;

	})();


	// String to Object flags format cache
	var flagsCache = {};

	// Convert String-formatted flags into Object-formatted ones and store in cache
	function createFlags( flags ) {
		var object = flagsCache[ flags ] = {},
			i, length;
		flags = flags.split( /\s+/ );
		for ( i = 0, length = flags.length; i < length; i++ ) {
			object[ flags[i] ] = true;
		}
		return object;
	}

	/*
	 * Create a callback list using the following parameters:
	 *
	 *	flags:	an optional list of space-separated flags that will change how
	 *			the callback list behaves
	 *
	 * By default a callback list will act like an event callback list and can be
	 * "fired" multiple times.
	 *
	 * Possible flags:
	 *
	 *	once:			will ensure the callback list can only be fired once (like a Deferred)
	 *
	 *	memory:			will keep track of previous values and will call any callback added
	 *					after the list has been fired right away with the latest "memorized"
	 *					values (like a Deferred)
	 *
	 *	unique:			will ensure a callback can only be added once (no duplicate in the list)
	 *
	 *	stopOnFalse:	interrupt callings when a callback returns false
	 *
	 */
	jQuery.Callbacks = function( flags ) {

		// Convert flags from String-formatted to Object-formatted
		// (we check in cache first)
		flags = flags ? ( flagsCache[ flags ] || createFlags( flags ) ) : {};

		var // Actual callback list
			list = [],
			// Stack of fire calls for repeatable lists
			stack = [],
			// Last fire value (for non-forgettable lists)
			memory,
			// Flag to know if list was already fired
			fired,
			// Flag to know if list is currently firing
			firing,
			// First callback to fire (used internally by add and fireWith)
			firingStart,
			// End of the loop when firing
			firingLength,
			// Index of currently firing callback (modified by remove if needed)
			firingIndex,
			// Add one or several callbacks to the list
			add = function( args ) {
				var i,
					length,
					elem,
					type,
					actual;
				for ( i = 0, length = args.length; i < length; i++ ) {
					elem = args[ i ];
					type = jQuery.type( elem );
					if ( type === "array" ) {
						// Inspect recursively
						add( elem );
					} else if ( type === "function" ) {
						// Add if not in unique mode and callback is not in
						if ( !flags.unique || !self.has( elem ) ) {
							list.push( elem );
						}
					}
				}
			},
			// Fire callbacks
			fire = function( context, args ) {
				args = args || [];
				memory = !flags.memory || [ context, args ];
				fired = true;
				firing = true;
				firingIndex = firingStart || 0;
				firingStart = 0;
				firingLength = list.length;
				for ( ; list && firingIndex < firingLength; firingIndex++ ) {
					if ( list[ firingIndex ].apply( context, args ) === false && flags.stopOnFalse ) {
						memory = true; // Mark as halted
						break;
					}
				}
				firing = false;
				if ( list ) {
					if ( !flags.once ) {
						if ( stack && stack.length ) {
							memory = stack.shift();
							self.fireWith( memory[ 0 ], memory[ 1 ] );
						}
					} else if ( memory === true ) {
						self.disable();
					} else {
						list = [];
					}
				}
			},
			// Actual Callbacks object
			self = {
				// Add a callback or a collection of callbacks to the list
				add: function() {
					if ( list ) {
						var length = list.length;
						add( arguments );
						// Do we need to add the callbacks to the
						// current firing batch?
						if ( firing ) {
							firingLength = list.length;
						// With memory, if we're not firing then
						// we should call right away, unless previous
						// firing was halted (stopOnFalse)
						} else if ( memory && memory !== true ) {
							firingStart = length;
							fire( memory[ 0 ], memory[ 1 ] );
						}
					}
					return this;
				},
				// Remove a callback from the list
				remove: function() {
					if ( list ) {
						var args = arguments,
							argIndex = 0,
							argLength = args.length;
						for ( ; argIndex < argLength ; argIndex++ ) {
							for ( var i = 0; i < list.length; i++ ) {
								if ( args[ argIndex ] === list[ i ] ) {
									// Handle firingIndex and firingLength
									if ( firing ) {
										if ( i <= firingLength ) {
											firingLength--;
											if ( i <= firingIndex ) {
												firingIndex--;
											}
										}
									}
									// Remove the element
									list.splice( i--, 1 );
									// If we have some unicity property then
									// we only need to do this once
									if ( flags.unique ) {
										break;
									}
								}
							}
						}
					}
					return this;
				},
				// Control if a given callback is in the list
				has: function( fn ) {
					if ( list ) {
						var i = 0,
							length = list.length;
						for ( ; i < length; i++ ) {
							if ( fn === list[ i ] ) {
								return true;
							}
						}
					}
					return false;
				},
				// Remove all callbacks from the list
				empty: function() {
					list = [];
					return this;
				},
				// Have the list do nothing anymore
				disable: function() {
					list = stack = memory = undefined;
					return this;
				},
				// Is it disabled?
				disabled: function() {
					return !list;
				},
				// Lock the list in its current state
				lock: function() {
					stack = undefined;
					if ( !memory || memory === true ) {
						self.disable();
					}
					return this;
				},
				// Is it locked?
				locked: function() {
					return !stack;
				},
				// Call all callbacks with the given context and arguments
				fireWith: function( context, args ) {
					if ( stack ) {
						if ( firing ) {
							if ( !flags.once ) {
								stack.push( [ context, args ] );
							}
						} else if ( !( flags.once && memory ) ) {
							fire( context, args );
						}
					}
					return this;
				},
				// Call all the callbacks with the given arguments
				fire: function() {
					self.fireWith( this, arguments );
					return this;
				},
				// To know if the callbacks have already been called at least once
				fired: function() {
					return !!fired;
				}
			};

		return self;
	};




	var // Static reference to slice
		sliceDeferred = [].slice;

	jQuery.extend({

		Deferred: function( func ) {
			var doneList = jQuery.Callbacks( "once memory" ),
				failList = jQuery.Callbacks( "once memory" ),
				progressList = jQuery.Callbacks( "memory" ),
				state = "pending",
				lists = {
					resolve: doneList,
					reject: failList,
					notify: progressList
				},
				promise = {
					done: doneList.add,
					fail: failList.add,
					progress: progressList.add,

					state: function() {
						return state;
					},

					// Deprecated
					isResolved: doneList.fired,
					isRejected: failList.fired,

					then: function( doneCallbacks, failCallbacks, progressCallbacks ) {
						deferred.done( doneCallbacks ).fail( failCallbacks ).progress( progressCallbacks );
						return this;
					},
					always: function() {
						deferred.done.apply( deferred, arguments ).fail.apply( deferred, arguments );
						return this;
					},
					pipe: function( fnDone, fnFail, fnProgress ) {
						return jQuery.Deferred(function( newDefer ) {
							jQuery.each( {
								done: [ fnDone, "resolve" ],
								fail: [ fnFail, "reject" ],
								progress: [ fnProgress, "notify" ]
							}, function( handler, data ) {
								var fn = data[ 0 ],
									action = data[ 1 ],
									returned;
								if ( jQuery.isFunction( fn ) ) {
									deferred[ handler ](function() {
										returned = fn.apply( this, arguments );
										if ( returned && jQuery.isFunction( returned.promise ) ) {
											returned.promise().then( newDefer.resolve, newDefer.reject, newDefer.notify );
										} else {
											newDefer[ action + "With" ]( this === deferred ? newDefer : this, [ returned ] );
										}
									});
								} else {
									deferred[ handler ]( newDefer[ action ] );
								}
							});
						}).promise();
					},
					// Get a promise for this deferred
					// If obj is provided, the promise aspect is added to the object
					promise: function( obj ) {
						if ( obj == null ) {
							obj = promise;
						} else {
							for ( var key in promise ) {
								obj[ key ] = promise[ key ];
							}
						}
						return obj;
					}
				},
				deferred = promise.promise({}),
				key;

			for ( key in lists ) {
				deferred[ key ] = lists[ key ].fire;
				deferred[ key + "With" ] = lists[ key ].fireWith;
			}

			// Handle state
			deferred.done( function() {
				state = "resolved";
			}, failList.disable, progressList.lock ).fail( function() {
				state = "rejected";
			}, doneList.disable, progressList.lock );

			// Call given func if any
			if ( func ) {
				func.call( deferred, deferred );
			}

			// All done!
			return deferred;
		},

		// Deferred helper
		when: function( firstParam ) {
			var args = sliceDeferred.call( arguments, 0 ),
				i = 0,
				length = args.length,
				pValues = new Array( length ),
				count = length,
				pCount = length,
				deferred = length <= 1 && firstParam && jQuery.isFunction( firstParam.promise ) ?
					firstParam :
					jQuery.Deferred(),
				promise = deferred.promise();
			function resolveFunc( i ) {
				return function( value ) {
					args[ i ] = arguments.length > 1 ? sliceDeferred.call( arguments, 0 ) : value;
					if ( !( --count ) ) {
						deferred.resolveWith( deferred, args );
					}
				};
			}
			function progressFunc( i ) {
				return function( value ) {
					pValues[ i ] = arguments.length > 1 ? sliceDeferred.call( arguments, 0 ) : value;
					deferred.notifyWith( promise, pValues );
				};
			}
			if ( length > 1 ) {
				for ( ; i < length; i++ ) {
					if ( args[ i ] && args[ i ].promise && jQuery.isFunction( args[ i ].promise ) ) {
						args[ i ].promise().then( resolveFunc(i), deferred.reject, progressFunc(i) );
					} else {
						--count;
					}
				}
				if ( !count ) {
					deferred.resolveWith( deferred, args );
				}
			} else if ( deferred !== firstParam ) {
				deferred.resolveWith( deferred, length ? [ firstParam ] : [] );
			}
			return promise;
		}
	});




	jQuery.support = (function() {

		var support,
			all,
			a,
			select,
			opt,
			input,
			fragment,
			tds,
			events,
			eventName,
			i,
			isSupported,
			div = document.createElement( "div" ),
			documentElement = document.documentElement;

		// Preliminary tests
		div.setAttribute("className", "t");
		div.innerHTML = "   <link/><table></table><a href='/a' style='top:1px;float:left;opacity:.55;'>a</a><input type='checkbox'/>";

		all = div.getElementsByTagName( "*" );
		a = div.getElementsByTagName( "a" )[ 0 ];

		// Can't get basic test support
		if ( !all || !all.length || !a ) {
			return {};
		}

		// First batch of supports tests
		select = document.createElement( "select" );
		opt = select.appendChild( document.createElement("option") );
		input = div.getElementsByTagName( "input" )[ 0 ];

		support = {
			// IE strips leading whitespace when .innerHTML is used
			leadingWhitespace: ( div.firstChild.nodeType === 3 ),

			// Make sure that tbody elements aren't automatically inserted
			// IE will insert them into empty tables
			tbody: !div.getElementsByTagName("tbody").length,

			// Make sure that link elements get serialized correctly by innerHTML
			// This requires a wrapper element in IE
			htmlSerialize: !!div.getElementsByTagName("link").length,

			// Get the style information from getAttribute
			// (IE uses .cssText instead)
			style: /top/.test( a.getAttribute("style") ),

			// Make sure that URLs aren't manipulated
			// (IE normalizes it by default)
			hrefNormalized: ( a.getAttribute("href") === "/a" ),

			// Make sure that element opacity exists
			// (IE uses filter instead)
			// Use a regex to work around a WebKit issue. See #5145
			opacity: /^0.55/.test( a.style.opacity ),

			// Verify style float existence
			// (IE uses styleFloat instead of cssFloat)
			cssFloat: !!a.style.cssFloat,

			// Make sure that if no value is specified for a checkbox
			// that it defaults to "on".
			// (WebKit defaults to "" instead)
			checkOn: ( input.value === "on" ),

			// Make sure that a selected-by-default option has a working selected property.
			// (WebKit defaults to false instead of true, IE too, if it's in an optgroup)
			optSelected: opt.selected,

			// Test setAttribute on camelCase class. If it works, we need attrFixes when doing get/setAttribute (ie6/7)
			getSetAttribute: div.className !== "t",

			// Tests for enctype support on a form(#6743)
			enctype: !!document.createElement("form").enctype,

			// Makes sure cloning an html5 element does not cause problems
			// Where outerHTML is undefined, this still works
			html5Clone: document.createElement("nav").cloneNode( true ).outerHTML !== "<:nav></:nav>",

			// Will be defined later
			submitBubbles: true,
			changeBubbles: true,
			focusinBubbles: false,
			deleteExpando: true,
			noCloneEvent: true,
			inlineBlockNeedsLayout: false,
			shrinkWrapBlocks: false,
			reliableMarginRight: true,
			pixelMargin: true
		};

		// jQuery.boxModel DEPRECATED in 1.3, use jQuery.support.boxModel instead
		jQuery.boxModel = support.boxModel = (document.compatMode === "CSS1Compat");

		// Make sure checked status is properly cloned
		input.checked = true;
		support.noCloneChecked = input.cloneNode( true ).checked;

		// Make sure that the options inside disabled selects aren't marked as disabled
		// (WebKit marks them as disabled)
		select.disabled = true;
		support.optDisabled = !opt.disabled;

		// Test to see if it's possible to delete an expando from an element
		// Fails in Internet Explorer
		try {
			delete div.test;
		} catch( e ) {
			support.deleteExpando = false;
		}

		if ( !div.addEventListener && div.attachEvent && div.fireEvent ) {
			div.attachEvent( "onclick", function() {
				// Cloning a node shouldn't copy over any
				// bound event handlers (IE does this)
				support.noCloneEvent = false;
			});
			div.cloneNode( true ).fireEvent( "onclick" );
		}

		// Check if a radio maintains its value
		// after being appended to the DOM
		input = document.createElement("input");
		input.value = "t";
		input.setAttribute("type", "radio");
		support.radioValue = input.value === "t";

		input.setAttribute("checked", "checked");

		// #11217 - WebKit loses check when the name is after the checked attribute
		input.setAttribute( "name", "t" );

		div.appendChild( input );
		fragment = document.createDocumentFragment();
		fragment.appendChild( div.lastChild );

		// WebKit doesn't clone checked state correctly in fragments
		support.checkClone = fragment.cloneNode( true ).cloneNode( true ).lastChild.checked;

		// Check if a disconnected checkbox will retain its checked
		// value of true after appended to the DOM (IE6/7)
		support.appendChecked = input.checked;

		fragment.removeChild( input );
		fragment.appendChild( div );

		// Technique from Juriy Zaytsev
		// http://perfectionkills.com/detecting-event-support-without-browser-sniffing/
		// We only care about the case where non-standard event systems
		// are used, namely in IE. Short-circuiting here helps us to
		// avoid an eval call (in setAttribute) which can cause CSP
		// to go haywire. See: https://developer.mozilla.org/en/Security/CSP
		if ( div.attachEvent ) {
			for ( i in {
				submit: 1,
				change: 1,
				focusin: 1
			}) {
				eventName = "on" + i;
				isSupported = ( eventName in div );
				if ( !isSupported ) {
					div.setAttribute( eventName, "return;" );
					isSupported = ( typeof div[ eventName ] === "function" );
				}
				support[ i + "Bubbles" ] = isSupported;
			}
		}

		fragment.removeChild( div );

		// Null elements to avoid leaks in IE
		fragment = select = opt = div = input = null;

		// Run tests that need a body at doc ready
		jQuery(function() {
			var container, outer, inner, table, td, offsetSupport,
				marginDiv, conMarginTop, style, html, positionTopLeftWidthHeight,
				paddingMarginBorderVisibility, paddingMarginBorder,
				body = document.getElementsByTagName("body")[0];

			if ( !body ) {
				// Return for frameset docs that don't have a body
				return;
			}

			conMarginTop = 1;
			paddingMarginBorder = "padding:0;margin:0;border:";
			positionTopLeftWidthHeight = "position:absolute;top:0;left:0;width:1px;height:1px;";
			paddingMarginBorderVisibility = paddingMarginBorder + "0;visibility:hidden;";
			style = "style='" + positionTopLeftWidthHeight + paddingMarginBorder + "5px solid #000;";
			html = "<div " + style + "display:block;'><div style='" + paddingMarginBorder + "0;display:block;overflow:hidden;'></div></div>" +
				"<table " + style + "' cellpadding='0' cellspacing='0'>" +
				"<tr><td></td></tr></table>";

			container = document.createElement("div");
			container.style.cssText = paddingMarginBorderVisibility + "width:0;height:0;position:static;top:0;margin-top:" + conMarginTop + "px";
			body.insertBefore( container, body.firstChild );

			// Construct the test element
			div = document.createElement("div");
			container.appendChild( div );

			// Check if table cells still have offsetWidth/Height when they are set
			// to display:none and there are still other visible table cells in a
			// table row; if so, offsetWidth/Height are not reliable for use when
			// determining if an element has been hidden directly using
			// display:none (it is still safe to use offsets if a parent element is
			// hidden; don safety goggles and see bug #4512 for more information).
			// (only IE 8 fails this test)
			div.innerHTML = "<table><tr><td style='" + paddingMarginBorder + "0;display:none'></td><td>t</td></tr></table>";
			tds = div.getElementsByTagName( "td" );
			isSupported = ( tds[ 0 ].offsetHeight === 0 );

			tds[ 0 ].style.display = "";
			tds[ 1 ].style.display = "none";

			// Check if empty table cells still have offsetWidth/Height
			// (IE <= 8 fail this test)
			support.reliableHiddenOffsets = isSupported && ( tds[ 0 ].offsetHeight === 0 );

			// Check if div with explicit width and no margin-right incorrectly
			// gets computed margin-right based on width of container. For more
			// info see bug #3333
			// Fails in WebKit before Feb 2011 nightlies
			// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
			if ( window.getComputedStyle ) {
				div.innerHTML = "";
				marginDiv = document.createElement( "div" );
				marginDiv.style.width = "0";
				marginDiv.style.marginRight = "0";
				div.style.width = "2px";
				div.appendChild( marginDiv );
				support.reliableMarginRight =
					( parseInt( ( window.getComputedStyle( marginDiv, null ) || { marginRight: 0 } ).marginRight, 10 ) || 0 ) === 0;
			}

			if ( typeof div.style.zoom !== "undefined" ) {
				// Check if natively block-level elements act like inline-block
				// elements when setting their display to 'inline' and giving
				// them layout
				// (IE < 8 does this)
				div.innerHTML = "";
				div.style.width = div.style.padding = "1px";
				div.style.border = 0;
				div.style.overflow = "hidden";
				div.style.display = "inline";
				div.style.zoom = 1;
				support.inlineBlockNeedsLayout = ( div.offsetWidth === 3 );

				// Check if elements with layout shrink-wrap their children
				// (IE 6 does this)
				div.style.display = "block";
				div.style.overflow = "visible";
				div.innerHTML = "<div style='width:5px;'></div>";
				support.shrinkWrapBlocks = ( div.offsetWidth !== 3 );
			}

			div.style.cssText = positionTopLeftWidthHeight + paddingMarginBorderVisibility;
			div.innerHTML = html;

			outer = div.firstChild;
			inner = outer.firstChild;
			td = outer.nextSibling.firstChild.firstChild;

			offsetSupport = {
				doesNotAddBorder: ( inner.offsetTop !== 5 ),
				doesAddBorderForTableAndCells: ( td.offsetTop === 5 )
			};

			inner.style.position = "fixed";
			inner.style.top = "20px";

			// safari subtracts parent border width here which is 5px
			offsetSupport.fixedPosition = ( inner.offsetTop === 20 || inner.offsetTop === 15 );
			inner.style.position = inner.style.top = "";

			outer.style.overflow = "hidden";
			outer.style.position = "relative";

			offsetSupport.subtractsBorderForOverflowNotVisible = ( inner.offsetTop === -5 );
			offsetSupport.doesNotIncludeMarginInBodyOffset = ( body.offsetTop !== conMarginTop );

			if ( window.getComputedStyle ) {
				div.style.marginTop = "1%";
				support.pixelMargin = ( window.getComputedStyle( div, null ) || { marginTop: 0 } ).marginTop !== "1%";
			}

			if ( typeof container.style.zoom !== "undefined" ) {
				container.style.zoom = 1;
			}

			body.removeChild( container );
			marginDiv = div = container = null;

			jQuery.extend( support, offsetSupport );
		});

		return support;
	})();




	var rbrace = /^(?:\{.*\}|\[.*\])$/,
		rmultiDash = /([A-Z])/g;

	jQuery.extend({
		cache: {},

		// Please use with caution
		uuid: 0,

		// Unique for each copy of jQuery on the page
		// Non-digits removed to match rinlinejQuery
		expando: "jQuery" + ( jQuery.fn.jquery + Math.random() ).replace( /\D/g, "" ),

		// The following elements throw uncatchable exceptions if you
		// attempt to add expando properties to them.
		noData: {
			"embed": true,
			// Ban all objects except for Flash (which handle expandos)
			"object": "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000",
			"applet": true
		},

		hasData: function( elem ) {
			elem = elem.nodeType ? jQuery.cache[ elem[jQuery.expando] ] : elem[ jQuery.expando ];
			return !!elem && !isEmptyDataObject( elem );
		},

		data: function( elem, name, data, pvt /* Internal Use Only */ ) {
			if ( !jQuery.acceptData( elem ) ) {
				return;
			}

			var privateCache, thisCache, ret,
				internalKey = jQuery.expando,
				getByName = typeof name === "string",

				// We have to handle DOM nodes and JS objects differently because IE6-7
				// can't GC object references properly across the DOM-JS boundary
				isNode = elem.nodeType,

				// Only DOM nodes need the global jQuery cache; JS object data is
				// attached directly to the object so GC can occur automatically
				cache = isNode ? jQuery.cache : elem,

				// Only defining an ID for JS objects if its cache already exists allows
				// the code to shortcut on the same path as a DOM node with no cache
				id = isNode ? elem[ internalKey ] : elem[ internalKey ] && internalKey,
				isEvents = name === "events";

			// Avoid doing any more work than we need to when trying to get data on an
			// object that has no data at all
			if ( (!id || !cache[id] || (!isEvents && !pvt && !cache[id].data)) && getByName && data === undefined ) {
				return;
			}

			if ( !id ) {
				// Only DOM nodes need a new unique ID for each element since their data
				// ends up in the global cache
				if ( isNode ) {
					elem[ internalKey ] = id = ++jQuery.uuid;
				} else {
					id = internalKey;
				}
			}

			if ( !cache[ id ] ) {
				cache[ id ] = {};

				// Avoids exposing jQuery metadata on plain JS objects when the object
				// is serialized using JSON.stringify
				if ( !isNode ) {
					cache[ id ].toJSON = jQuery.noop;
				}
			}

			// An object can be passed to jQuery.data instead of a key/value pair; this gets
			// shallow copied over onto the existing cache
			if ( typeof name === "object" || typeof name === "function" ) {
				if ( pvt ) {
					cache[ id ] = jQuery.extend( cache[ id ], name );
				} else {
					cache[ id ].data = jQuery.extend( cache[ id ].data, name );
				}
			}

			privateCache = thisCache = cache[ id ];

			// jQuery data() is stored in a separate object inside the object's internal data
			// cache in order to avoid key collisions between internal data and user-defined
			// data.
			if ( !pvt ) {
				if ( !thisCache.data ) {
					thisCache.data = {};
				}

				thisCache = thisCache.data;
			}

			if ( data !== undefined ) {
				thisCache[ jQuery.camelCase( name ) ] = data;
			}

			// Users should not attempt to inspect the internal events object using jQuery.data,
			// it is undocumented and subject to change. But does anyone listen? No.
			if ( isEvents && !thisCache[ name ] ) {
				return privateCache.events;
			}

			// Check for both converted-to-camel and non-converted data property names
			// If a data property was specified
			if ( getByName ) {

				// First Try to find as-is property data
				ret = thisCache[ name ];

				// Test for null|undefined property data
				if ( ret == null ) {

					// Try to find the camelCased property
					ret = thisCache[ jQuery.camelCase( name ) ];
				}
			} else {
				ret = thisCache;
			}

			return ret;
		},

		removeData: function( elem, name, pvt /* Internal Use Only */ ) {
			if ( !jQuery.acceptData( elem ) ) {
				return;
			}

			var thisCache, i, l,

				// Reference to internal data cache key
				internalKey = jQuery.expando,

				isNode = elem.nodeType,

				// See jQuery.data for more information
				cache = isNode ? jQuery.cache : elem,

				// See jQuery.data for more information
				id = isNode ? elem[ internalKey ] : internalKey;

			// If there is already no cache entry for this object, there is no
			// purpose in continuing
			if ( !cache[ id ] ) {
				return;
			}

			if ( name ) {

				thisCache = pvt ? cache[ id ] : cache[ id ].data;

				if ( thisCache ) {

					// Support array or space separated string names for data keys
					if ( !jQuery.isArray( name ) ) {

						// try the string as a key before any manipulation
						if ( name in thisCache ) {
							name = [ name ];
						} else {

							// split the camel cased version by spaces unless a key with the spaces exists
							name = jQuery.camelCase( name );
							if ( name in thisCache ) {
								name = [ name ];
							} else {
								name = name.split( " " );
							}
						}
					}

					for ( i = 0, l = name.length; i < l; i++ ) {
						delete thisCache[ name[i] ];
					}

					// If there is no data left in the cache, we want to continue
					// and let the cache object itself get destroyed
					if ( !( pvt ? isEmptyDataObject : jQuery.isEmptyObject )( thisCache ) ) {
						return;
					}
				}
			}

			// See jQuery.data for more information
			if ( !pvt ) {
				delete cache[ id ].data;

				// Don't destroy the parent cache unless the internal data object
				// had been the only thing left in it
				if ( !isEmptyDataObject(cache[ id ]) ) {
					return;
				}
			}

			// Browsers that fail expando deletion also refuse to delete expandos on
			// the window, but it will allow it on all other JS objects; other browsers
			// don't care
			// Ensure that `cache` is not a window object #10080
			if ( jQuery.support.deleteExpando || !cache.setInterval ) {
				delete cache[ id ];
			} else {
				cache[ id ] = null;
			}

			// We destroyed the cache and need to eliminate the expando on the node to avoid
			// false lookups in the cache for entries that no longer exist
			if ( isNode ) {
				// IE does not allow us to delete expando properties from nodes,
				// nor does it have a removeAttribute function on Document nodes;
				// we must handle all of these cases
				if ( jQuery.support.deleteExpando ) {
					delete elem[ internalKey ];
				} else if ( elem.removeAttribute ) {
					elem.removeAttribute( internalKey );
				} else {
					elem[ internalKey ] = null;
				}
			}
		},

		// For internal use only.
		_data: function( elem, name, data ) {
			return jQuery.data( elem, name, data, true );
		},

		// A method for determining if a DOM node can handle the data expando
		acceptData: function( elem ) {
			if ( elem.nodeName ) {
				var match = jQuery.noData[ elem.nodeName.toLowerCase() ];

				if ( match ) {
					return !(match === true || elem.getAttribute("classid") !== match);
				}
			}

			return true;
		}
	});

	jQuery.fn.extend({
		data: function( key, value ) {
			var parts, part, attr, name, l,
				elem = this[0],
				i = 0,
				data = null;

			// Gets all values
			if ( key === undefined ) {
				if ( this.length ) {
					data = jQuery.data( elem );

					if ( elem.nodeType === 1 && !jQuery._data( elem, "parsedAttrs" ) ) {
						attr = elem.attributes;
						for ( l = attr.length; i < l; i++ ) {
							name = attr[i].name;

							if ( name.indexOf( "data-" ) === 0 ) {
								name = jQuery.camelCase( name.substring(5) );

								dataAttr( elem, name, data[ name ] );
							}
						}
						jQuery._data( elem, "parsedAttrs", true );
					}
				}

				return data;
			}

			// Sets multiple values
			if ( typeof key === "object" ) {
				return this.each(function() {
					jQuery.data( this, key );
				});
			}

			parts = key.split( ".", 2 );
			parts[1] = parts[1] ? "." + parts[1] : "";
			part = parts[1] + "!";

			return jQuery.access( this, function( value ) {

				if ( value === undefined ) {
					data = this.triggerHandler( "getData" + part, [ parts[0] ] );

					// Try to fetch any internally stored data first
					if ( data === undefined && elem ) {
						data = jQuery.data( elem, key );
						data = dataAttr( elem, key, data );
					}

					return data === undefined && parts[1] ?
						this.data( parts[0] ) :
						data;
				}

				parts[1] = value;
				this.each(function() {
					var self = jQuery( this );

					self.triggerHandler( "setData" + part, parts );
					jQuery.data( this, key, value );
					self.triggerHandler( "changeData" + part, parts );
				});
			}, null, value, arguments.length > 1, null, false );
		},

		removeData: function( key ) {
			return this.each(function() {
				jQuery.removeData( this, key );
			});
		}
	});

	function dataAttr( elem, key, data ) {
		// If nothing was found internally, try to fetch any
		// data from the HTML5 data-* attribute
		if ( data === undefined && elem.nodeType === 1 ) {

			var name = "data-" + key.replace( rmultiDash, "-$1" ).toLowerCase();

			data = elem.getAttribute( name );

			if ( typeof data === "string" ) {
				try {
					data = data === "true" ? true :
					data === "false" ? false :
					data === "null" ? null :
					jQuery.isNumeric( data ) ? +data :
						rbrace.test( data ) ? jQuery.parseJSON( data ) :
						data;
				} catch( e ) {}

				// Make sure we set the data so it isn't changed later
				jQuery.data( elem, key, data );

			} else {
				data = undefined;
			}
		}

		return data;
	}

	// checks a cache object for emptiness
	function isEmptyDataObject( obj ) {
		for ( var name in obj ) {

			// if the public data object is empty, the private is still empty
			if ( name === "data" && jQuery.isEmptyObject( obj[name] ) ) {
				continue;
			}
			if ( name !== "toJSON" ) {
				return false;
			}
		}

		return true;
	}




	function handleQueueMarkDefer( elem, type, src ) {
		var deferDataKey = type + "defer",
			queueDataKey = type + "queue",
			markDataKey = type + "mark",
			defer = jQuery._data( elem, deferDataKey );
		if ( defer &&
			( src === "queue" || !jQuery._data(elem, queueDataKey) ) &&
			( src === "mark" || !jQuery._data(elem, markDataKey) ) ) {
			// Give room for hard-coded callbacks to fire first
			// and eventually mark/queue something else on the element
			setTimeout( function() {
				if ( !jQuery._data( elem, queueDataKey ) &&
					!jQuery._data( elem, markDataKey ) ) {
					jQuery.removeData( elem, deferDataKey, true );
					defer.fire();
				}
			}, 0 );
		}
	}

	jQuery.extend({

		_mark: function( elem, type ) {
			if ( elem ) {
				type = ( type || "fx" ) + "mark";
				jQuery._data( elem, type, (jQuery._data( elem, type ) || 0) + 1 );
			}
		},

		_unmark: function( force, elem, type ) {
			if ( force !== true ) {
				type = elem;
				elem = force;
				force = false;
			}
			if ( elem ) {
				type = type || "fx";
				var key = type + "mark",
					count = force ? 0 : ( (jQuery._data( elem, key ) || 1) - 1 );
				if ( count ) {
					jQuery._data( elem, key, count );
				} else {
					jQuery.removeData( elem, key, true );
					handleQueueMarkDefer( elem, type, "mark" );
				}
			}
		},

		queue: function( elem, type, data ) {
			var q;
			if ( elem ) {
				type = ( type || "fx" ) + "queue";
				q = jQuery._data( elem, type );

				// Speed up dequeue by getting out quickly if this is just a lookup
				if ( data ) {
					if ( !q || jQuery.isArray(data) ) {
						q = jQuery._data( elem, type, jQuery.makeArray(data) );
					} else {
						q.push( data );
					}
				}
				return q || [];
			}
		},

		dequeue: function( elem, type ) {
			type = type || "fx";

			var queue = jQuery.queue( elem, type ),
				fn = queue.shift(),
				hooks = {};

			// If the fx queue is dequeued, always remove the progress sentinel
			if ( fn === "inprogress" ) {
				fn = queue.shift();
			}

			if ( fn ) {
				// Add a progress sentinel to prevent the fx queue from being
				// automatically dequeued
				if ( type === "fx" ) {
					queue.unshift( "inprogress" );
				}

				jQuery._data( elem, type + ".run", hooks );
				fn.call( elem, function() {
					jQuery.dequeue( elem, type );
				}, hooks );
			}

			if ( !queue.length ) {
				jQuery.removeData( elem, type + "queue " + type + ".run", true );
				handleQueueMarkDefer( elem, type, "queue" );
			}
		}
	});

	jQuery.fn.extend({
		queue: function( type, data ) {
			var setter = 2;

			if ( typeof type !== "string" ) {
				data = type;
				type = "fx";
				setter--;
			}

			if ( arguments.length < setter ) {
				return jQuery.queue( this[0], type );
			}

			return data === undefined ?
				this :
				this.each(function() {
					var queue = jQuery.queue( this, type, data );

					if ( type === "fx" && queue[0] !== "inprogress" ) {
						jQuery.dequeue( this, type );
					}
				});
		},
		dequeue: function( type ) {
			return this.each(function() {
				jQuery.dequeue( this, type );
			});
		},
		// Based off of the plugin by Clint Helfers, with permission.
		// http://blindsignals.com/index.php/2009/07/jquery-delay/
		delay: function( time, type ) {
			time = jQuery.fx ? jQuery.fx.speeds[ time ] || time : time;
			type = type || "fx";

			return this.queue( type, function( next, hooks ) {
				var timeout = setTimeout( next, time );
				hooks.stop = function() {
					clearTimeout( timeout );
				};
			});
		},
		clearQueue: function( type ) {
			return this.queue( type || "fx", [] );
		},
		// Get a promise resolved when queues of a certain type
		// are emptied (fx is the type by default)
		promise: function( type, object ) {
			if ( typeof type !== "string" ) {
				object = type;
				type = undefined;
			}
			type = type || "fx";
			var defer = jQuery.Deferred(),
				elements = this,
				i = elements.length,
				count = 1,
				deferDataKey = type + "defer",
				queueDataKey = type + "queue",
				markDataKey = type + "mark",
				tmp;
			function resolve() {
				if ( !( --count ) ) {
					defer.resolveWith( elements, [ elements ] );
				}
			}
			while( i-- ) {
				if (( tmp = jQuery.data( elements[ i ], deferDataKey, undefined, true ) ||
						( jQuery.data( elements[ i ], queueDataKey, undefined, true ) ||
							jQuery.data( elements[ i ], markDataKey, undefined, true ) ) &&
						jQuery.data( elements[ i ], deferDataKey, jQuery.Callbacks( "once memory" ), true ) )) {
					count++;
					tmp.add( resolve );
				}
			}
			resolve();
			return defer.promise( object );
		}
	});




	var rclass = /[\n\t\r]/g,
		rspace = /\s+/,
		rreturn = /\r/g,
		rtype = /^(?:button|input)$/i,
		rfocusable = /^(?:button|input|object|select|textarea)$/i,
		rclickable = /^a(?:rea)?$/i,
		rboolean = /^(?:autofocus|autoplay|async|checked|controls|defer|disabled|hidden|loop|multiple|open|readonly|required|scoped|selected)$/i,
		getSetAttribute = jQuery.support.getSetAttribute,
		nodeHook, boolHook, fixSpecified;

	jQuery.fn.extend({
		attr: function( name, value ) {
			return jQuery.access( this, jQuery.attr, name, value, arguments.length > 1 );
		},

		removeAttr: function( name ) {
			return this.each(function() {
				jQuery.removeAttr( this, name );
			});
		},

		prop: function( name, value ) {
			return jQuery.access( this, jQuery.prop, name, value, arguments.length > 1 );
		},

		removeProp: function( name ) {
			name = jQuery.propFix[ name ] || name;
			return this.each(function() {
				// try/catch handles cases where IE balks (such as removing a property on window)
				try {
					this[ name ] = undefined;
					delete this[ name ];
				} catch( e ) {}
			});
		},

		addClass: function( value ) {
			var classNames, i, l, elem,
				setClass, c, cl;

			if ( jQuery.isFunction( value ) ) {
				return this.each(function( j ) {
					jQuery( this ).addClass( value.call(this, j, this.className) );
				});
			}

			if ( value && typeof value === "string" ) {
				classNames = value.split( rspace );

				for ( i = 0, l = this.length; i < l; i++ ) {
					elem = this[ i ];

					if ( elem.nodeType === 1 ) {
						if ( !elem.className && classNames.length === 1 ) {
							elem.className = value;

						} else {
							setClass = " " + elem.className + " ";

							for ( c = 0, cl = classNames.length; c < cl; c++ ) {
								if ( !~setClass.indexOf( " " + classNames[ c ] + " " ) ) {
									setClass += classNames[ c ] + " ";
								}
							}
							elem.className = jQuery.trim( setClass );
						}
					}
				}
			}

			return this;
		},

		removeClass: function( value ) {
			var classNames, i, l, elem, className, c, cl;

			if ( jQuery.isFunction( value ) ) {
				return this.each(function( j ) {
					jQuery( this ).removeClass( value.call(this, j, this.className) );
				});
			}

			if ( (value && typeof value === "string") || value === undefined ) {
				classNames = ( value || "" ).split( rspace );

				for ( i = 0, l = this.length; i < l; i++ ) {
					elem = this[ i ];

					if ( elem.nodeType === 1 && elem.className ) {
						if ( value ) {
							className = (" " + elem.className + " ").replace( rclass, " " );
							for ( c = 0, cl = classNames.length; c < cl; c++ ) {
								className = className.replace(" " + classNames[ c ] + " ", " ");
							}
							elem.className = jQuery.trim( className );

						} else {
							elem.className = "";
						}
					}
				}
			}

			return this;
		},

		toggleClass: function( value, stateVal ) {
			var type = typeof value,
				isBool = typeof stateVal === "boolean";

			if ( jQuery.isFunction( value ) ) {
				return this.each(function( i ) {
					jQuery( this ).toggleClass( value.call(this, i, this.className, stateVal), stateVal );
				});
			}

			return this.each(function() {
				if ( type === "string" ) {
					// toggle individual class names
					var className,
						i = 0,
						self = jQuery( this ),
						state = stateVal,
						classNames = value.split( rspace );

					while ( (className = classNames[ i++ ]) ) {
						// check each className given, space seperated list
						state = isBool ? state : !self.hasClass( className );
						self[ state ? "addClass" : "removeClass" ]( className );
					}

				} else if ( type === "undefined" || type === "boolean" ) {
					if ( this.className ) {
						// store className if set
						jQuery._data( this, "__className__", this.className );
					}

					// toggle whole className
					this.className = this.className || value === false ? "" : jQuery._data( this, "__className__" ) || "";
				}
			});
		},

		hasClass: function( selector ) {
			var className = " " + selector + " ",
				i = 0,
				l = this.length;
			for ( ; i < l; i++ ) {
				if ( this[i].nodeType === 1 && (" " + this[i].className + " ").replace(rclass, " ").indexOf( className ) > -1 ) {
					return true;
				}
			}

			return false;
		},

		val: function( value ) {
			var hooks, ret, isFunction,
				elem = this[0];

			if ( !arguments.length ) {
				if ( elem ) {
					hooks = jQuery.valHooks[ elem.type ] || jQuery.valHooks[ elem.nodeName.toLowerCase() ];

					if ( hooks && "get" in hooks && (ret = hooks.get( elem, "value" )) !== undefined ) {
						return ret;
					}

					ret = elem.value;

					return typeof ret === "string" ?
						// handle most common string cases
						ret.replace(rreturn, "") :
						// handle cases where value is null/undef or number
						ret == null ? "" : ret;
				}

				return;
			}

			isFunction = jQuery.isFunction( value );

			return this.each(function( i ) {
				var self = jQuery(this), val;

				if ( this.nodeType !== 1 ) {
					return;
				}

				if ( isFunction ) {
					val = value.call( this, i, self.val() );
				} else {
					val = value;
				}

				// Treat null/undefined as ""; convert numbers to string
				if ( val == null ) {
					val = "";
				} else if ( typeof val === "number" ) {
					val += "";
				} else if ( jQuery.isArray( val ) ) {
					val = jQuery.map(val, function ( value ) {
						return value == null ? "" : value + "";
					});
				}

				hooks = jQuery.valHooks[ this.type ] || jQuery.valHooks[ this.nodeName.toLowerCase() ];

				// If set returns undefined, fall back to normal setting
				if ( !hooks || !("set" in hooks) || hooks.set( this, val, "value" ) === undefined ) {
					this.value = val;
				}
			});
		}
	});

	jQuery.extend({
		valHooks: {
			option: {
				get: function( elem ) {
					// attributes.value is undefined in Blackberry 4.7 but
					// uses .value. See #6932
					var val = elem.attributes.value;
					return !val || val.specified ? elem.value : elem.text;
				}
			},
			select: {
				get: function( elem ) {
					var value, i, max, option,
						index = elem.selectedIndex,
						values = [],
						options = elem.options,
						one = elem.type === "select-one";

					// Nothing was selected
					if ( index < 0 ) {
						return null;
					}

					// Loop through all the selected options
					i = one ? index : 0;
					max = one ? index + 1 : options.length;
					for ( ; i < max; i++ ) {
						option = options[ i ];

						// Don't return options that are disabled or in a disabled optgroup
						if ( option.selected && (jQuery.support.optDisabled ? !option.disabled : option.getAttribute("disabled") === null) &&
								(!option.parentNode.disabled || !jQuery.nodeName( option.parentNode, "optgroup" )) ) {

							// Get the specific value for the option
							value = jQuery( option ).val();

							// We don't need an array for one selects
							if ( one ) {
								return value;
							}

							// Multi-Selects return an array
							values.push( value );
						}
					}

					// Fixes Bug #2551 -- select.val() broken in IE after form.reset()
					if ( one && !values.length && options.length ) {
						return jQuery( options[ index ] ).val();
					}

					return values;
				},

				set: function( elem, value ) {
					var values = jQuery.makeArray( value );

					jQuery(elem).find("option").each(function() {
						this.selected = jQuery.inArray( jQuery(this).val(), values ) >= 0;
					});

					if ( !values.length ) {
						elem.selectedIndex = -1;
					}
					return values;
				}
			}
		},

		attrFn: {
			val: true,
			css: true,
			html: true,
			text: true,
			data: true,
			width: true,
			height: true,
			offset: true
		},

		attr: function( elem, name, value, pass ) {
			var ret, hooks, notxml,
				nType = elem.nodeType;

			// don't get/set attributes on text, comment and attribute nodes
			if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
				return;
			}

			if ( pass && name in jQuery.attrFn ) {
				return jQuery( elem )[ name ]( value );
			}

			// Fallback to prop when attributes are not supported
			if ( typeof elem.getAttribute === "undefined" ) {
				return jQuery.prop( elem, name, value );
			}

			notxml = nType !== 1 || !jQuery.isXMLDoc( elem );

			// All attributes are lowercase
			// Grab necessary hook if one is defined
			if ( notxml ) {
				name = name.toLowerCase();
				hooks = jQuery.attrHooks[ name ] || ( rboolean.test( name ) ? boolHook : nodeHook );
			}

			if ( value !== undefined ) {

				if ( value === null ) {
					jQuery.removeAttr( elem, name );
					return;

				} else if ( hooks && "set" in hooks && notxml && (ret = hooks.set( elem, value, name )) !== undefined ) {
					return ret;

				} else {
					elem.setAttribute( name, "" + value );
					return value;
				}

			} else if ( hooks && "get" in hooks && notxml && (ret = hooks.get( elem, name )) !== null ) {
				return ret;

			} else {

				ret = elem.getAttribute( name );

				// Non-existent attributes return null, we normalize to undefined
				return ret === null ?
					undefined :
					ret;
			}
		},

		removeAttr: function( elem, value ) {
			var propName, attrNames, name, l, isBool,
				i = 0;

			if ( value && elem.nodeType === 1 ) {
				attrNames = value.toLowerCase().split( rspace );
				l = attrNames.length;

				for ( ; i < l; i++ ) {
					name = attrNames[ i ];

					if ( name ) {
						propName = jQuery.propFix[ name ] || name;
						isBool = rboolean.test( name );

						// See #9699 for explanation of this approach (setting first, then removal)
						// Do not do this for boolean attributes (see #10870)
						if ( !isBool ) {
							jQuery.attr( elem, name, "" );
						}
						elem.removeAttribute( getSetAttribute ? name : propName );

						// Set corresponding property to false for boolean attributes
						if ( isBool && propName in elem ) {
							elem[ propName ] = false;
						}
					}
				}
			}
		},

		attrHooks: {
			type: {
				set: function( elem, value ) {
					// We can't allow the type property to be changed (since it causes problems in IE)
					if ( rtype.test( elem.nodeName ) && elem.parentNode ) {
						jQuery.error( "type property can't be changed" );
					} else if ( !jQuery.support.radioValue && value === "radio" && jQuery.nodeName(elem, "input") ) {
						// Setting the type on a radio button after the value resets the value in IE6-9
						// Reset value to it's default in case type is set after value
						// This is for element creation
						var val = elem.value;
						elem.setAttribute( "type", value );
						if ( val ) {
							elem.value = val;
						}
						return value;
					}
				}
			},
			// Use the value property for back compat
			// Use the nodeHook for button elements in IE6/7 (#1954)
			value: {
				get: function( elem, name ) {
					if ( nodeHook && jQuery.nodeName( elem, "button" ) ) {
						return nodeHook.get( elem, name );
					}
					return name in elem ?
						elem.value :
						null;
				},
				set: function( elem, value, name ) {
					if ( nodeHook && jQuery.nodeName( elem, "button" ) ) {
						return nodeHook.set( elem, value, name );
					}
					// Does not return so that setAttribute is also used
					elem.value = value;
				}
			}
		},

		propFix: {
			tabindex: "tabIndex",
			readonly: "readOnly",
			"for": "htmlFor",
			"class": "className",
			maxlength: "maxLength",
			cellspacing: "cellSpacing",
			cellpadding: "cellPadding",
			rowspan: "rowSpan",
			colspan: "colSpan",
			usemap: "useMap",
			frameborder: "frameBorder",
			contenteditable: "contentEditable"
		},

		prop: function( elem, name, value ) {
			var ret, hooks, notxml,
				nType = elem.nodeType;

			// don't get/set properties on text, comment and attribute nodes
			if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
				return;
			}

			notxml = nType !== 1 || !jQuery.isXMLDoc( elem );

			if ( notxml ) {
				// Fix name and attach hooks
				name = jQuery.propFix[ name ] || name;
				hooks = jQuery.propHooks[ name ];
			}

			if ( value !== undefined ) {
				if ( hooks && "set" in hooks && (ret = hooks.set( elem, value, name )) !== undefined ) {
					return ret;

				} else {
					return ( elem[ name ] = value );
				}

			} else {
				if ( hooks && "get" in hooks && (ret = hooks.get( elem, name )) !== null ) {
					return ret;

				} else {
					return elem[ name ];
				}
			}
		},

		propHooks: {
			tabIndex: {
				get: function( elem ) {
					// elem.tabIndex doesn't always return the correct value when it hasn't been explicitly set
					// http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
					var attributeNode = elem.getAttributeNode("tabindex");

					return attributeNode && attributeNode.specified ?
						parseInt( attributeNode.value, 10 ) :
						rfocusable.test( elem.nodeName ) || rclickable.test( elem.nodeName ) && elem.href ?
							0 :
							undefined;
				}
			}
		}
	});

	// Add the tabIndex propHook to attrHooks for back-compat (different case is intentional)
	jQuery.attrHooks.tabindex = jQuery.propHooks.tabIndex;

	// Hook for boolean attributes
	boolHook = {
		get: function( elem, name ) {
			// Align boolean attributes with corresponding properties
			// Fall back to attribute presence where some booleans are not supported
			var attrNode,
				property = jQuery.prop( elem, name );
			return property === true || typeof property !== "boolean" && ( attrNode = elem.getAttributeNode(name) ) && attrNode.nodeValue !== false ?
				name.toLowerCase() :
				undefined;
		},
		set: function( elem, value, name ) {
			var propName;
			if ( value === false ) {
				// Remove boolean attributes when set to false
				jQuery.removeAttr( elem, name );
			} else {
				// value is true since we know at this point it's type boolean and not false
				// Set boolean attributes to the same name and set the DOM property
				propName = jQuery.propFix[ name ] || name;
				if ( propName in elem ) {
					// Only set the IDL specifically if it already exists on the element
					elem[ propName ] = true;
				}

				elem.setAttribute( name, name.toLowerCase() );
			}
			return name;
		}
	};

	// IE6/7 do not support getting/setting some attributes with get/setAttribute
	if ( !getSetAttribute ) {

		fixSpecified = {
			name: true,
			id: true,
			coords: true
		};

		// Use this for any attribute in IE6/7
		// This fixes almost every IE6/7 issue
		nodeHook = jQuery.valHooks.button = {
			get: function( elem, name ) {
				var ret;
				ret = elem.getAttributeNode( name );
				return ret && ( fixSpecified[ name ] ? ret.nodeValue !== "" : ret.specified ) ?
					ret.nodeValue :
					undefined;
			},
			set: function( elem, value, name ) {
				// Set the existing or create a new attribute node
				var ret = elem.getAttributeNode( name );
				if ( !ret ) {
					ret = document.createAttribute( name );
					elem.setAttributeNode( ret );
				}
				return ( ret.nodeValue = value + "" );
			}
		};

		// Apply the nodeHook to tabindex
		jQuery.attrHooks.tabindex.set = nodeHook.set;

		// Set width and height to auto instead of 0 on empty string( Bug #8150 )
		// This is for removals
		jQuery.each([ "width", "height" ], function( i, name ) {
			jQuery.attrHooks[ name ] = jQuery.extend( jQuery.attrHooks[ name ], {
				set: function( elem, value ) {
					if ( value === "" ) {
						elem.setAttribute( name, "auto" );
						return value;
					}
				}
			});
		});

		// Set contenteditable to false on removals(#10429)
		// Setting to empty string throws an error as an invalid value
		jQuery.attrHooks.contenteditable = {
			get: nodeHook.get,
			set: function( elem, value, name ) {
				if ( value === "" ) {
					value = "false";
				}
				nodeHook.set( elem, value, name );
			}
		};
	}


	// Some attributes require a special call on IE
	if ( !jQuery.support.hrefNormalized ) {
		jQuery.each([ "href", "src", "width", "height" ], function( i, name ) {
			jQuery.attrHooks[ name ] = jQuery.extend( jQuery.attrHooks[ name ], {
				get: function( elem ) {
					var ret = elem.getAttribute( name, 2 );
					return ret === null ? undefined : ret;
				}
			});
		});
	}

	if ( !jQuery.support.style ) {
		jQuery.attrHooks.style = {
			get: function( elem ) {
				// Return undefined in the case of empty string
				// Normalize to lowercase since IE uppercases css property names
				return elem.style.cssText.toLowerCase() || undefined;
			},
			set: function( elem, value ) {
				return ( elem.style.cssText = "" + value );
			}
		};
	}

	// Safari mis-reports the default selected property of an option
	// Accessing the parent's selectedIndex property fixes it
	if ( !jQuery.support.optSelected ) {
		jQuery.propHooks.selected = jQuery.extend( jQuery.propHooks.selected, {
			get: function( elem ) {
				var parent = elem.parentNode;

				if ( parent ) {
					parent.selectedIndex;

					// Make sure that it also works with optgroups, see #5701
					if ( parent.parentNode ) {
						parent.parentNode.selectedIndex;
					}
				}
				return null;
			}
		});
	}

	// IE6/7 call enctype encoding
	if ( !jQuery.support.enctype ) {
		jQuery.propFix.enctype = "encoding";
	}

	// Radios and checkboxes getter/setter
	if ( !jQuery.support.checkOn ) {
		jQuery.each([ "radio", "checkbox" ], function() {
			jQuery.valHooks[ this ] = {
				get: function( elem ) {
					// Handle the case where in Webkit "" is returned instead of "on" if a value isn't specified
					return elem.getAttribute("value") === null ? "on" : elem.value;
				}
			};
		});
	}
	jQuery.each([ "radio", "checkbox" ], function() {
		jQuery.valHooks[ this ] = jQuery.extend( jQuery.valHooks[ this ], {
			set: function( elem, value ) {
				if ( jQuery.isArray( value ) ) {
					return ( elem.checked = jQuery.inArray( jQuery(elem).val(), value ) >= 0 );
				}
			}
		});
	});




	var rformElems = /^(?:textarea|input|select)$/i,
		rtypenamespace = /^([^\.]*)?(?:\.(.+))?$/,
		rhoverHack = /(?:^|\s)hover(\.\S+)?\b/,
		rkeyEvent = /^key/,
		rmouseEvent = /^(?:mouse|contextmenu)|click/,
		rfocusMorph = /^(?:focusinfocus|focusoutblur)$/,
		rquickIs = /^(\w*)(?:#([\w\-]+))?(?:\.([\w\-]+))?$/,
		quickParse = function( selector ) {
			var quick = rquickIs.exec( selector );
			if ( quick ) {
				//   0  1    2   3
				// [ _, tag, id, class ]
				quick[1] = ( quick[1] || "" ).toLowerCase();
				quick[3] = quick[3] && new RegExp( "(?:^|\\s)" + quick[3] + "(?:\\s|$)" );
			}
			return quick;
		},
		quickIs = function( elem, m ) {
			var attrs = elem.attributes || {};
			return (
				(!m[1] || elem.nodeName.toLowerCase() === m[1]) &&
				(!m[2] || (attrs.id || {}).value === m[2]) &&
				(!m[3] || m[3].test( (attrs[ "class" ] || {}).value ))
			);
		},
		hoverHack = function( events ) {
			return jQuery.event.special.hover ? events : events.replace( rhoverHack, "mouseenter$1 mouseleave$1" );
		};

	/*
	 * Helper functions for managing events -- not part of the public interface.
	 * Props to Dean Edwards' addEvent library for many of the ideas.
	 */
	jQuery.event = {

		add: function( elem, types, handler, data, selector ) {

			var elemData, eventHandle, events,
				t, tns, type, namespaces, handleObj,
				handleObjIn, quick, handlers, special;

			// Don't attach events to noData or text/comment nodes (allow plain objects tho)
			if ( elem.nodeType === 3 || elem.nodeType === 8 || !types || !handler || !(elemData = jQuery._data( elem )) ) {
				return;
			}

			// Caller can pass in an object of custom data in lieu of the handler
			if ( handler.handler ) {
				handleObjIn = handler;
				handler = handleObjIn.handler;
				selector = handleObjIn.selector;
			}

			// Make sure that the handler has a unique ID, used to find/remove it later
			if ( !handler.guid ) {
				handler.guid = jQuery.guid++;
			}

			// Init the element's event structure and main handler, if this is the first
			events = elemData.events;
			if ( !events ) {
				elemData.events = events = {};
			}
			eventHandle = elemData.handle;
			if ( !eventHandle ) {
				elemData.handle = eventHandle = function( e ) {
					// Discard the second event of a jQuery.event.trigger() and
					// when an event is called after a page has unloaded
					return typeof jQuery !== "undefined" && (!e || jQuery.event.triggered !== e.type) ?
						jQuery.event.dispatch.apply( eventHandle.elem, arguments ) :
						undefined;
				};
				// Add elem as a property of the handle fn to prevent a memory leak with IE non-native events
				eventHandle.elem = elem;
			}

			// Handle multiple events separated by a space
			// jQuery(...).bind("mouseover mouseout", fn);
			types = jQuery.trim( hoverHack(types) ).split( " " );
			for ( t = 0; t < types.length; t++ ) {

				tns = rtypenamespace.exec( types[t] ) || [];
				type = tns[1];
				namespaces = ( tns[2] || "" ).split( "." ).sort();

				// If event changes its type, use the special event handlers for the changed type
				special = jQuery.event.special[ type ] || {};

				// If selector defined, determine special event api type, otherwise given type
				type = ( selector ? special.delegateType : special.bindType ) || type;

				// Update special based on newly reset type
				special = jQuery.event.special[ type ] || {};

				// handleObj is passed to all event handlers
				handleObj = jQuery.extend({
					type: type,
					origType: tns[1],
					data: data,
					handler: handler,
					guid: handler.guid,
					selector: selector,
					quick: selector && quickParse( selector ),
					namespace: namespaces.join(".")
				}, handleObjIn );

				// Init the event handler queue if we're the first
				handlers = events[ type ];
				if ( !handlers ) {
					handlers = events[ type ] = [];
					handlers.delegateCount = 0;

					// Only use addEventListener/attachEvent if the special events handler returns false
					if ( !special.setup || special.setup.call( elem, data, namespaces, eventHandle ) === false ) {
						// Bind the global event handler to the element
						if ( elem.addEventListener ) {
							elem.addEventListener( type, eventHandle, false );

						} else if ( elem.attachEvent ) {
							elem.attachEvent( "on" + type, eventHandle );
						}
					}
				}

				if ( special.add ) {
					special.add.call( elem, handleObj );

					if ( !handleObj.handler.guid ) {
						handleObj.handler.guid = handler.guid;
					}
				}

				// Add to the element's handler list, delegates in front
				if ( selector ) {
					handlers.splice( handlers.delegateCount++, 0, handleObj );
				} else {
					handlers.push( handleObj );
				}

				// Keep track of which events have ever been used, for event optimization
				jQuery.event.global[ type ] = true;
			}

			// Nullify elem to prevent memory leaks in IE
			elem = null;
		},

		global: {},

		// Detach an event or set of events from an element
		remove: function( elem, types, handler, selector, mappedTypes ) {

			var elemData = jQuery.hasData( elem ) && jQuery._data( elem ),
				t, tns, type, origType, namespaces, origCount,
				j, events, special, handle, eventType, handleObj;

			if ( !elemData || !(events = elemData.events) ) {
				return;
			}

			// Once for each type.namespace in types; type may be omitted
			types = jQuery.trim( hoverHack( types || "" ) ).split(" ");
			for ( t = 0; t < types.length; t++ ) {
				tns = rtypenamespace.exec( types[t] ) || [];
				type = origType = tns[1];
				namespaces = tns[2];

				// Unbind all events (on this namespace, if provided) for the element
				if ( !type ) {
					for ( type in events ) {
						jQuery.event.remove( elem, type + types[ t ], handler, selector, true );
					}
					continue;
				}

				special = jQuery.event.special[ type ] || {};
				type = ( selector? special.delegateType : special.bindType ) || type;
				eventType = events[ type ] || [];
				origCount = eventType.length;
				namespaces = namespaces ? new RegExp("(^|\\.)" + namespaces.split(".").sort().join("\\.(?:.*\\.)?") + "(\\.|$)") : null;

				// Remove matching events
				for ( j = 0; j < eventType.length; j++ ) {
					handleObj = eventType[ j ];

					if ( ( mappedTypes || origType === handleObj.origType ) &&
						 ( !handler || handler.guid === handleObj.guid ) &&
						 ( !namespaces || namespaces.test( handleObj.namespace ) ) &&
						 ( !selector || selector === handleObj.selector || selector === "**" && handleObj.selector ) ) {
						eventType.splice( j--, 1 );

						if ( handleObj.selector ) {
							eventType.delegateCount--;
						}
						if ( special.remove ) {
							special.remove.call( elem, handleObj );
						}
					}
				}

				// Remove generic event handler if we removed something and no more handlers exist
				// (avoids potential for endless recursion during removal of special event handlers)
				if ( eventType.length === 0 && origCount !== eventType.length ) {
					if ( !special.teardown || special.teardown.call( elem, namespaces ) === false ) {
						jQuery.removeEvent( elem, type, elemData.handle );
					}

					delete events[ type ];
				}
			}

			// Remove the expando if it's no longer used
			if ( jQuery.isEmptyObject( events ) ) {
				handle = elemData.handle;
				if ( handle ) {
					handle.elem = null;
				}

				// removeData also checks for emptiness and clears the expando if empty
				// so use it instead of delete
				jQuery.removeData( elem, [ "events", "handle" ], true );
			}
		},

		// Events that are safe to short-circuit if no handlers are attached.
		// Native DOM events should not be added, they may have inline handlers.
		customEvent: {
			"getData": true,
			"setData": true,
			"changeData": true
		},

		trigger: function( event, data, elem, onlyHandlers ) {
			// Don't do events on text and comment nodes
			if ( elem && (elem.nodeType === 3 || elem.nodeType === 8) ) {
				return;
			}

			// Event object or event type
			var type = event.type || event,
				namespaces = [],
				cache, exclusive, i, cur, old, ontype, special, handle, eventPath, bubbleType;

			// focus/blur morphs to focusin/out; ensure we're not firing them right now
			if ( rfocusMorph.test( type + jQuery.event.triggered ) ) {
				return;
			}

			if ( type.indexOf( "!" ) >= 0 ) {
				// Exclusive events trigger only for the exact event (no namespaces)
				type = type.slice(0, -1);
				exclusive = true;
			}

			if ( type.indexOf( "." ) >= 0 ) {
				// Namespaced trigger; create a regexp to match event type in handle()
				namespaces = type.split(".");
				type = namespaces.shift();
				namespaces.sort();
			}

			if ( (!elem || jQuery.event.customEvent[ type ]) && !jQuery.event.global[ type ] ) {
				// No jQuery handlers for this event type, and it can't have inline handlers
				return;
			}

			// Caller can pass in an Event, Object, or just an event type string
			event = typeof event === "object" ?
				// jQuery.Event object
				event[ jQuery.expando ] ? event :
				// Object literal
				new jQuery.Event( type, event ) :
				// Just the event type (string)
				new jQuery.Event( type );

			event.type = type;
			event.isTrigger = true;
			event.exclusive = exclusive;
			event.namespace = namespaces.join( "." );
			event.namespace_re = event.namespace? new RegExp("(^|\\.)" + namespaces.join("\\.(?:.*\\.)?") + "(\\.|$)") : null;
			ontype = type.indexOf( ":" ) < 0 ? "on" + type : "";

			// Handle a global trigger
			if ( !elem ) {

				// TODO: Stop taunting the data cache; remove global events and always attach to document
				cache = jQuery.cache;
				for ( i in cache ) {
					if ( cache[ i ].events && cache[ i ].events[ type ] ) {
						jQuery.event.trigger( event, data, cache[ i ].handle.elem, true );
					}
				}
				return;
			}

			// Clean up the event in case it is being reused
			event.result = undefined;
			if ( !event.target ) {
				event.target = elem;
			}

			// Clone any incoming data and prepend the event, creating the handler arg list
			data = data != null ? jQuery.makeArray( data ) : [];
			data.unshift( event );

			// Allow special events to draw outside the lines
			special = jQuery.event.special[ type ] || {};
			if ( special.trigger && special.trigger.apply( elem, data ) === false ) {
				return;
			}

			// Determine event propagation path in advance, per W3C events spec (#9951)
			// Bubble up to document, then to window; watch for a global ownerDocument var (#9724)
			eventPath = [[ elem, special.bindType || type ]];
			if ( !onlyHandlers && !special.noBubble && !jQuery.isWindow( elem ) ) {

				bubbleType = special.delegateType || type;
				cur = rfocusMorph.test( bubbleType + type ) ? elem : elem.parentNode;
				old = null;
				for ( ; cur; cur = cur.parentNode ) {
					eventPath.push([ cur, bubbleType ]);
					old = cur;
				}

				// Only add window if we got to document (e.g., not plain obj or detached DOM)
				if ( old && old === elem.ownerDocument ) {
					eventPath.push([ old.defaultView || old.parentWindow || window, bubbleType ]);
				}
			}

			// Fire handlers on the event path
			for ( i = 0; i < eventPath.length && !event.isPropagationStopped(); i++ ) {

				cur = eventPath[i][0];
				event.type = eventPath[i][1];

				handle = ( jQuery._data( cur, "events" ) || {} )[ event.type ] && jQuery._data( cur, "handle" );
				if ( handle ) {
					handle.apply( cur, data );
				}
				// Note that this is a bare JS function and not a jQuery handler
				handle = ontype && cur[ ontype ];
				if ( handle && jQuery.acceptData( cur ) && handle.apply( cur, data ) === false ) {
					event.preventDefault();
				}
			}
			event.type = type;

			// If nobody prevented the default action, do it now
			if ( !onlyHandlers && !event.isDefaultPrevented() ) {

				if ( (!special._default || special._default.apply( elem.ownerDocument, data ) === false) &&
					!(type === "click" && jQuery.nodeName( elem, "a" )) && jQuery.acceptData( elem ) ) {

					// Call a native DOM method on the target with the same name name as the event.
					// Can't use an .isFunction() check here because IE6/7 fails that test.
					// Don't do default actions on window, that's where global variables be (#6170)
					// IE<9 dies on focus/blur to hidden element (#1486)
					if ( ontype && elem[ type ] && ((type !== "focus" && type !== "blur") || event.target.offsetWidth !== 0) && !jQuery.isWindow( elem ) ) {

						// Don't re-trigger an onFOO event when we call its FOO() method
						old = elem[ ontype ];

						if ( old ) {
							elem[ ontype ] = null;
						}

						// Prevent re-triggering of the same event, since we already bubbled it above
						jQuery.event.triggered = type;
						elem[ type ]();
						jQuery.event.triggered = undefined;

						if ( old ) {
							elem[ ontype ] = old;
						}
					}
				}
			}

			return event.result;
		},

		dispatch: function( event ) {

			// Make a writable jQuery.Event from the native event object
			event = jQuery.event.fix( event || window.event );

			var handlers = ( (jQuery._data( this, "events" ) || {} )[ event.type ] || []),
				delegateCount = handlers.delegateCount,
				args = [].slice.call( arguments, 0 ),
				run_all = !event.exclusive && !event.namespace,
				special = jQuery.event.special[ event.type ] || {},
				handlerQueue = [],
				i, j, cur, jqcur, ret, selMatch, matched, matches, handleObj, sel, related;

			// Use the fix-ed jQuery.Event rather than the (read-only) native event
			args[0] = event;
			event.delegateTarget = this;

			// Call the preDispatch hook for the mapped type, and let it bail if desired
			if ( special.preDispatch && special.preDispatch.call( this, event ) === false ) {
				return;
			}

			// Determine handlers that should run if there are delegated events
			// Avoid non-left-click bubbling in Firefox (#3861)
			if ( delegateCount && !(event.button && event.type === "click") ) {

				// Pregenerate a single jQuery object for reuse with .is()
				jqcur = jQuery(this);
				jqcur.context = this.ownerDocument || this;

				for ( cur = event.target; cur != this; cur = cur.parentNode || this ) {

					// Don't process events on disabled elements (#6911, #8165)
					if ( cur.disabled !== true ) {
						selMatch = {};
						matches = [];
						jqcur[0] = cur;
						for ( i = 0; i < delegateCount; i++ ) {
							handleObj = handlers[ i ];
							sel = handleObj.selector;

							if ( selMatch[ sel ] === undefined ) {
								selMatch[ sel ] = (
									handleObj.quick ? quickIs( cur, handleObj.quick ) : jqcur.is( sel )
								);
							}
							if ( selMatch[ sel ] ) {
								matches.push( handleObj );
							}
						}
						if ( matches.length ) {
							handlerQueue.push({ elem: cur, matches: matches });
						}
					}
				}
			}

			// Add the remaining (directly-bound) handlers
			if ( handlers.length > delegateCount ) {
				handlerQueue.push({ elem: this, matches: handlers.slice( delegateCount ) });
			}

			// Run delegates first; they may want to stop propagation beneath us
			for ( i = 0; i < handlerQueue.length && !event.isPropagationStopped(); i++ ) {
				matched = handlerQueue[ i ];
				event.currentTarget = matched.elem;

				for ( j = 0; j < matched.matches.length && !event.isImmediatePropagationStopped(); j++ ) {
					handleObj = matched.matches[ j ];

					// Triggered event must either 1) be non-exclusive and have no namespace, or
					// 2) have namespace(s) a subset or equal to those in the bound event (both can have no namespace).
					if ( run_all || (!event.namespace && !handleObj.namespace) || event.namespace_re && event.namespace_re.test( handleObj.namespace ) ) {

						event.data = handleObj.data;
						event.handleObj = handleObj;

						ret = ( (jQuery.event.special[ handleObj.origType ] || {}).handle || handleObj.handler )
								.apply( matched.elem, args );

						if ( ret !== undefined ) {
							event.result = ret;
							if ( ret === false ) {
								event.preventDefault();
								event.stopPropagation();
							}
						}
					}
				}
			}

			// Call the postDispatch hook for the mapped type
			if ( special.postDispatch ) {
				special.postDispatch.call( this, event );
			}

			return event.result;
		},

		// Includes some event props shared by KeyEvent and MouseEvent
		// *** attrChange attrName relatedNode srcElement  are not normalized, non-W3C, deprecated, will be removed in 1.8 ***
		props: "attrChange attrName relatedNode srcElement altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),

		fixHooks: {},

		keyHooks: {
			props: "char charCode key keyCode".split(" "),
			filter: function( event, original ) {

				// Add which for key events
				if ( event.which == null ) {
					event.which = original.charCode != null ? original.charCode : original.keyCode;
				}

				return event;
			}
		},

		mouseHooks: {
			props: "button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
			filter: function( event, original ) {
				var eventDoc, doc, body,
					button = original.button,
					fromElement = original.fromElement;

				// Calculate pageX/Y if missing and clientX/Y available
				if ( event.pageX == null && original.clientX != null ) {
					eventDoc = event.target.ownerDocument || document;
					doc = eventDoc.documentElement;
					body = eventDoc.body;

					event.pageX = original.clientX + ( doc && doc.scrollLeft || body && body.scrollLeft || 0 ) - ( doc && doc.clientLeft || body && body.clientLeft || 0 );
					event.pageY = original.clientY + ( doc && doc.scrollTop  || body && body.scrollTop  || 0 ) - ( doc && doc.clientTop  || body && body.clientTop  || 0 );
				}

				// Add relatedTarget, if necessary
				if ( !event.relatedTarget && fromElement ) {
					event.relatedTarget = fromElement === event.target ? original.toElement : fromElement;
				}

				// Add which for click: 1 === left; 2 === middle; 3 === right
				// Note: button is not normalized, so don't use it
				if ( !event.which && button !== undefined ) {
					event.which = ( button & 1 ? 1 : ( button & 2 ? 3 : ( button & 4 ? 2 : 0 ) ) );
				}

				return event;
			}
		},

		fix: function( event ) {
			if ( event[ jQuery.expando ] ) {
				return event;
			}

			// Create a writable copy of the event object and normalize some properties
			var i, prop,
				originalEvent = event,
				fixHook = jQuery.event.fixHooks[ event.type ] || {},
				copy = fixHook.props ? this.props.concat( fixHook.props ) : this.props;

			event = jQuery.Event( originalEvent );

			for ( i = copy.length; i; ) {
				prop = copy[ --i ];
				event[ prop ] = originalEvent[ prop ];
			}

			// Fix target property, if necessary (#1925, IE 6/7/8 & Safari2)
			if ( !event.target ) {
				event.target = originalEvent.srcElement || document;
			}

			// Target should not be a text node (#504, Safari)
			if ( event.target.nodeType === 3 ) {
				event.target = event.target.parentNode;
			}

			// For mouse/key events; add metaKey if it's not there (#3368, IE6/7/8)
			if ( event.metaKey === undefined ) {
				event.metaKey = event.ctrlKey;
			}

			return fixHook.filter? fixHook.filter( event, originalEvent ) : event;
		},

		special: {
			ready: {
				// Make sure the ready event is setup
				setup: jQuery.bindReady
			},

			load: {
				// Prevent triggered image.load events from bubbling to window.load
				noBubble: true
			},

			focus: {
				delegateType: "focusin"
			},
			blur: {
				delegateType: "focusout"
			},

			beforeunload: {
				setup: function( data, namespaces, eventHandle ) {
					// We only want to do this special case on windows
					if ( jQuery.isWindow( this ) ) {
						this.onbeforeunload = eventHandle;
					}
				},

				teardown: function( namespaces, eventHandle ) {
					if ( this.onbeforeunload === eventHandle ) {
						this.onbeforeunload = null;
					}
				}
			}
		},

		simulate: function( type, elem, event, bubble ) {
			// Piggyback on a donor event to simulate a different one.
			// Fake originalEvent to avoid donor's stopPropagation, but if the
			// simulated event prevents default then we do the same on the donor.
			var e = jQuery.extend(
				new jQuery.Event(),
				event,
				{ type: type,
					isSimulated: true,
					originalEvent: {}
				}
			);
			if ( bubble ) {
				jQuery.event.trigger( e, null, elem );
			} else {
				jQuery.event.dispatch.call( elem, e );
			}
			if ( e.isDefaultPrevented() ) {
				event.preventDefault();
			}
		}
	};

	// Some plugins are using, but it's undocumented/deprecated and will be removed.
	// The 1.7 special event interface should provide all the hooks needed now.
	jQuery.event.handle = jQuery.event.dispatch;

	jQuery.removeEvent = document.removeEventListener ?
		function( elem, type, handle ) {
			if ( elem.removeEventListener ) {
				elem.removeEventListener( type, handle, false );
			}
		} :
		function( elem, type, handle ) {
			if ( elem.detachEvent ) {
				elem.detachEvent( "on" + type, handle );
			}
		};

	jQuery.Event = function( src, props ) {
		// Allow instantiation without the 'new' keyword
		if ( !(this instanceof jQuery.Event) ) {
			return new jQuery.Event( src, props );
		}

		// Event object
		if ( src && src.type ) {
			this.originalEvent = src;
			this.type = src.type;

			// Events bubbling up the document may have been marked as prevented
			// by a handler lower down the tree; reflect the correct value.
			this.isDefaultPrevented = ( src.defaultPrevented || src.returnValue === false ||
				src.getPreventDefault && src.getPreventDefault() ) ? returnTrue : returnFalse;

		// Event type
		} else {
			this.type = src;
		}

		// Put explicitly provided properties onto the event object
		if ( props ) {
			jQuery.extend( this, props );
		}

		// Create a timestamp if incoming event doesn't have one
		this.timeStamp = src && src.timeStamp || jQuery.now();

		// Mark it as fixed
		this[ jQuery.expando ] = true;
	};

	function returnFalse() {
		return false;
	}
	function returnTrue() {
		return true;
	}

	// jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
	// http://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
	jQuery.Event.prototype = {
		preventDefault: function() {
			this.isDefaultPrevented = returnTrue;

			var e = this.originalEvent;
			if ( !e ) {
				return;
			}

			// if preventDefault exists run it on the original event
			if ( e.preventDefault ) {
				e.preventDefault();

			// otherwise set the returnValue property of the original event to false (IE)
			} else {
				e.returnValue = false;
			}
		},
		stopPropagation: function() {
			this.isPropagationStopped = returnTrue;

			var e = this.originalEvent;
			if ( !e ) {
				return;
			}
			// if stopPropagation exists run it on the original event
			if ( e.stopPropagation ) {
				e.stopPropagation();
			}
			// otherwise set the cancelBubble property of the original event to true (IE)
			e.cancelBubble = true;
		},
		stopImmediatePropagation: function() {
			this.isImmediatePropagationStopped = returnTrue;
			this.stopPropagation();
		},
		isDefaultPrevented: returnFalse,
		isPropagationStopped: returnFalse,
		isImmediatePropagationStopped: returnFalse
	};

	// Create mouseenter/leave events using mouseover/out and event-time checks
	jQuery.each({
		mouseenter: "mouseover",
		mouseleave: "mouseout"
	}, function( orig, fix ) {
		jQuery.event.special[ orig ] = {
			delegateType: fix,
			bindType: fix,

			handle: function( event ) {
				var target = this,
					related = event.relatedTarget,
					handleObj = event.handleObj,
					selector = handleObj.selector,
					ret;

				// For mousenter/leave call the handler if related is outside the target.
				// NB: No relatedTarget if the mouse left/entered the browser window
				if ( !related || (related !== target && !jQuery.contains( target, related )) ) {
					event.type = handleObj.origType;
					ret = handleObj.handler.apply( this, arguments );
					event.type = fix;
				}
				return ret;
			}
		};
	});

	// IE submit delegation
	if ( !jQuery.support.submitBubbles ) {

		jQuery.event.special.submit = {
			setup: function() {
				// Only need this for delegated form submit events
				if ( jQuery.nodeName( this, "form" ) ) {
					return false;
				}

				// Lazy-add a submit handler when a descendant form may potentially be submitted
				jQuery.event.add( this, "click._submit keypress._submit", function( e ) {
					// Node name check avoids a VML-related crash in IE (#9807)
					var elem = e.target,
						form = jQuery.nodeName( elem, "input" ) || jQuery.nodeName( elem, "button" ) ? elem.form : undefined;
					if ( form && !form._submit_attached ) {
						jQuery.event.add( form, "submit._submit", function( event ) {
							event._submit_bubble = true;
						});
						form._submit_attached = true;
					}
				});
				// return undefined since we don't need an event listener
			},
			
			postDispatch: function( event ) {
				// If form was submitted by the user, bubble the event up the tree
				if ( event._submit_bubble ) {
					delete event._submit_bubble;
					if ( this.parentNode && !event.isTrigger ) {
						jQuery.event.simulate( "submit", this.parentNode, event, true );
					}
				}
			},

			teardown: function() {
				// Only need this for delegated form submit events
				if ( jQuery.nodeName( this, "form" ) ) {
					return false;
				}

				// Remove delegated handlers; cleanData eventually reaps submit handlers attached above
				jQuery.event.remove( this, "._submit" );
			}
		};
	}

	// IE change delegation and checkbox/radio fix
	if ( !jQuery.support.changeBubbles ) {

		jQuery.event.special.change = {

			setup: function() {

				if ( rformElems.test( this.nodeName ) ) {
					// IE doesn't fire change on a check/radio until blur; trigger it on click
					// after a propertychange. Eat the blur-change in special.change.handle.
					// This still fires onchange a second time for check/radio after blur.
					if ( this.type === "checkbox" || this.type === "radio" ) {
						jQuery.event.add( this, "propertychange._change", function( event ) {
							if ( event.originalEvent.propertyName === "checked" ) {
								this._just_changed = true;
							}
						});
						jQuery.event.add( this, "click._change", function( event ) {
							if ( this._just_changed && !event.isTrigger ) {
								this._just_changed = false;
								jQuery.event.simulate( "change", this, event, true );
							}
						});
					}
					return false;
				}
				// Delegated event; lazy-add a change handler on descendant inputs
				jQuery.event.add( this, "beforeactivate._change", function( e ) {
					var elem = e.target;

					if ( rformElems.test( elem.nodeName ) && !elem._change_attached ) {
						jQuery.event.add( elem, "change._change", function( event ) {
							if ( this.parentNode && !event.isSimulated && !event.isTrigger ) {
								jQuery.event.simulate( "change", this.parentNode, event, true );
							}
						});
						elem._change_attached = true;
					}
				});
			},

			handle: function( event ) {
				var elem = event.target;

				// Swallow native change events from checkbox/radio, we already triggered them above
				if ( this !== elem || event.isSimulated || event.isTrigger || (elem.type !== "radio" && elem.type !== "checkbox") ) {
					return event.handleObj.handler.apply( this, arguments );
				}
			},

			teardown: function() {
				jQuery.event.remove( this, "._change" );

				return rformElems.test( this.nodeName );
			}
		};
	}

	// Create "bubbling" focus and blur events
	if ( !jQuery.support.focusinBubbles ) {
		jQuery.each({ focus: "focusin", blur: "focusout" }, function( orig, fix ) {

			// Attach a single capturing handler while someone wants focusin/focusout
			var attaches = 0,
				handler = function( event ) {
					jQuery.event.simulate( fix, event.target, jQuery.event.fix( event ), true );
				};

			jQuery.event.special[ fix ] = {
				setup: function() {
					if ( attaches++ === 0 ) {
						document.addEventListener( orig, handler, true );
					}
				},
				teardown: function() {
					if ( --attaches === 0 ) {
						document.removeEventListener( orig, handler, true );
					}
				}
			};
		});
	}

	jQuery.fn.extend({

		on: function( types, selector, data, fn, /*INTERNAL*/ one ) {
			var origFn, type;

			// Types can be a map of types/handlers
			if ( typeof types === "object" ) {
				// ( types-Object, selector, data )
				if ( typeof selector !== "string" ) { // && selector != null
					// ( types-Object, data )
					data = data || selector;
					selector = undefined;
				}
				for ( type in types ) {
					this.on( type, selector, data, types[ type ], one );
				}
				return this;
			}

			if ( data == null && fn == null ) {
				// ( types, fn )
				fn = selector;
				data = selector = undefined;
			} else if ( fn == null ) {
				if ( typeof selector === "string" ) {
					// ( types, selector, fn )
					fn = data;
					data = undefined;
				} else {
					// ( types, data, fn )
					fn = data;
					data = selector;
					selector = undefined;
				}
			}
			if ( fn === false ) {
				fn = returnFalse;
			} else if ( !fn ) {
				return this;
			}

			if ( one === 1 ) {
				origFn = fn;
				fn = function( event ) {
					// Can use an empty set, since event contains the info
					jQuery().off( event );
					return origFn.apply( this, arguments );
				};
				// Use same guid so caller can remove using origFn
				fn.guid = origFn.guid || ( origFn.guid = jQuery.guid++ );
			}
			return this.each( function() {
				jQuery.event.add( this, types, fn, data, selector );
			});
		},
		one: function( types, selector, data, fn ) {
			return this.on( types, selector, data, fn, 1 );
		},
		off: function( types, selector, fn ) {
			if ( types && types.preventDefault && types.handleObj ) {
				// ( event )  dispatched jQuery.Event
				var handleObj = types.handleObj;
				jQuery( types.delegateTarget ).off(
					handleObj.namespace ? handleObj.origType + "." + handleObj.namespace : handleObj.origType,
					handleObj.selector,
					handleObj.handler
				);
				return this;
			}
			if ( typeof types === "object" ) {
				// ( types-object [, selector] )
				for ( var type in types ) {
					this.off( type, selector, types[ type ] );
				}
				return this;
			}
			if ( selector === false || typeof selector === "function" ) {
				// ( types [, fn] )
				fn = selector;
				selector = undefined;
			}
			if ( fn === false ) {
				fn = returnFalse;
			}
			return this.each(function() {
				jQuery.event.remove( this, types, fn, selector );
			});
		},

		bind: function( types, data, fn ) {
			return this.on( types, null, data, fn );
		},
		unbind: function( types, fn ) {
			return this.off( types, null, fn );
		},

		live: function( types, data, fn ) {
			jQuery( this.context ).on( types, this.selector, data, fn );
			return this;
		},
		die: function( types, fn ) {
			jQuery( this.context ).off( types, this.selector || "**", fn );
			return this;
		},

		delegate: function( selector, types, data, fn ) {
			return this.on( types, selector, data, fn );
		},
		undelegate: function( selector, types, fn ) {
			// ( namespace ) or ( selector, types [, fn] )
			return arguments.length == 1? this.off( selector, "**" ) : this.off( types, selector, fn );
		},

		trigger: function( type, data ) {
			return this.each(function() {
				jQuery.event.trigger( type, data, this );
			});
		},
		triggerHandler: function( type, data ) {
			if ( this[0] ) {
				return jQuery.event.trigger( type, data, this[0], true );
			}
		},

		toggle: function( fn ) {
			// Save reference to arguments for access in closure
			var args = arguments,
				guid = fn.guid || jQuery.guid++,
				i = 0,
				toggler = function( event ) {
					// Figure out which function to execute
					var lastToggle = ( jQuery._data( this, "lastToggle" + fn.guid ) || 0 ) % i;
					jQuery._data( this, "lastToggle" + fn.guid, lastToggle + 1 );

					// Make sure that clicks stop
					event.preventDefault();

					// and execute the function
					return args[ lastToggle ].apply( this, arguments ) || false;
				};

			// link all the functions, so any of them can unbind this click handler
			toggler.guid = guid;
			while ( i < args.length ) {
				args[ i++ ].guid = guid;
			}

			return this.click( toggler );
		},

		hover: function( fnOver, fnOut ) {
			return this.mouseenter( fnOver ).mouseleave( fnOut || fnOver );
		}
	});

	jQuery.each( ("blur focus focusin focusout load resize scroll unload click dblclick " +
		"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
		"change select submit keydown keypress keyup error contextmenu").split(" "), function( i, name ) {

		// Handle event binding
		jQuery.fn[ name ] = function( data, fn ) {
			if ( fn == null ) {
				fn = data;
				data = null;
			}

			return arguments.length > 0 ?
				this.on( name, null, data, fn ) :
				this.trigger( name );
		};

		if ( jQuery.attrFn ) {
			jQuery.attrFn[ name ] = true;
		}

		if ( rkeyEvent.test( name ) ) {
			jQuery.event.fixHooks[ name ] = jQuery.event.keyHooks;
		}

		if ( rmouseEvent.test( name ) ) {
			jQuery.event.fixHooks[ name ] = jQuery.event.mouseHooks;
		}
	});



	/*!
	 * Sizzle CSS Selector Engine
	 *  Copyright 2011, The Dojo Foundation
	 *  Released under the MIT, BSD, and GPL Licenses.
	 *  More information: http://sizzlejs.com/
	 */
	(function(){

	var chunker = /((?:\((?:\([^()]+\)|[^()]+)+\)|\[(?:\[[^\[\]]*\]|['"][^'"]*['"]|[^\[\]'"]+)+\]|\\.|[^ >+~,(\[\\]+)+|[>+~])(\s*,\s*)?((?:.|\r|\n)*)/g,
		expando = "sizcache" + (Math.random() + '').replace('.', ''),
		done = 0,
		toString = Object.prototype.toString,
		hasDuplicate = false,
		baseHasDuplicate = true,
		rBackslash = /\\/g,
		rReturn = /\r\n/g,
		rNonWord = /\W/;

	// Here we check if the JavaScript engine is using some sort of
	// optimization where it does not always call our comparision
	// function. If that is the case, discard the hasDuplicate value.
	//   Thus far that includes Google Chrome.
	[0, 0].sort(function() {
		baseHasDuplicate = false;
		return 0;
	});

	var Sizzle = function( selector, context, results, seed ) {
		results = results || [];
		context = context || document;

		var origContext = context;

		if ( context.nodeType !== 1 && context.nodeType !== 9 ) {
			return [];
		}

		if ( !selector || typeof selector !== "string" ) {
			return results;
		}

		var m, set, checkSet, extra, ret, cur, pop, i,
			prune = true,
			contextXML = Sizzle.isXML( context ),
			parts = [],
			soFar = selector;

		// Reset the position of the chunker regexp (start from head)
		do {
			chunker.exec( "" );
			m = chunker.exec( soFar );

			if ( m ) {
				soFar = m[3];

				parts.push( m[1] );

				if ( m[2] ) {
					extra = m[3];
					break;
				}
			}
		} while ( m );

		if ( parts.length > 1 && origPOS.exec( selector ) ) {

			if ( parts.length === 2 && Expr.relative[ parts[0] ] ) {
				set = posProcess( parts[0] + parts[1], context, seed );

			} else {
				set = Expr.relative[ parts[0] ] ?
					[ context ] :
					Sizzle( parts.shift(), context );

				while ( parts.length ) {
					selector = parts.shift();

					if ( Expr.relative[ selector ] ) {
						selector += parts.shift();
					}

					set = posProcess( selector, set, seed );
				}
			}

		} else {
			// Take a shortcut and set the context if the root selector is an ID
			// (but not if it'll be faster if the inner selector is an ID)
			if ( !seed && parts.length > 1 && context.nodeType === 9 && !contextXML &&
					Expr.match.ID.test(parts[0]) && !Expr.match.ID.test(parts[parts.length - 1]) ) {

				ret = Sizzle.find( parts.shift(), context, contextXML );
				context = ret.expr ?
					Sizzle.filter( ret.expr, ret.set )[0] :
					ret.set[0];
			}

			if ( context ) {
				ret = seed ?
					{ expr: parts.pop(), set: makeArray(seed) } :
					Sizzle.find( parts.pop(), parts.length === 1 && (parts[0] === "~" || parts[0] === "+") && context.parentNode ? context.parentNode : context, contextXML );

				set = ret.expr ?
					Sizzle.filter( ret.expr, ret.set ) :
					ret.set;

				if ( parts.length > 0 ) {
					checkSet = makeArray( set );

				} else {
					prune = false;
				}

				while ( parts.length ) {
					cur = parts.pop();
					pop = cur;

					if ( !Expr.relative[ cur ] ) {
						cur = "";
					} else {
						pop = parts.pop();
					}

					if ( pop == null ) {
						pop = context;
					}

					Expr.relative[ cur ]( checkSet, pop, contextXML );
				}

			} else {
				checkSet = parts = [];
			}
		}

		if ( !checkSet ) {
			checkSet = set;
		}

		if ( !checkSet ) {
			Sizzle.error( cur || selector );
		}

		if ( toString.call(checkSet) === "[object Array]" ) {
			if ( !prune ) {
				results.push.apply( results, checkSet );

			} else if ( context && context.nodeType === 1 ) {
				for ( i = 0; checkSet[i] != null; i++ ) {
					if ( checkSet[i] && (checkSet[i] === true || checkSet[i].nodeType === 1 && Sizzle.contains(context, checkSet[i])) ) {
						results.push( set[i] );
					}
				}

			} else {
				for ( i = 0; checkSet[i] != null; i++ ) {
					if ( checkSet[i] && checkSet[i].nodeType === 1 ) {
						results.push( set[i] );
					}
				}
			}

		} else {
			makeArray( checkSet, results );
		}

		if ( extra ) {
			Sizzle( extra, origContext, results, seed );
			Sizzle.uniqueSort( results );
		}

		return results;
	};

	Sizzle.uniqueSort = function( results ) {
		if ( sortOrder ) {
			hasDuplicate = baseHasDuplicate;
			results.sort( sortOrder );

			if ( hasDuplicate ) {
				for ( var i = 1; i < results.length; i++ ) {
					if ( results[i] === results[ i - 1 ] ) {
						results.splice( i--, 1 );
					}
				}
			}
		}

		return results;
	};

	Sizzle.matches = function( expr, set ) {
		return Sizzle( expr, null, null, set );
	};

	Sizzle.matchesSelector = function( node, expr ) {
		return Sizzle( expr, null, null, [node] ).length > 0;
	};

	Sizzle.find = function( expr, context, isXML ) {
		var set, i, len, match, type, left;

		if ( !expr ) {
			return [];
		}

		for ( i = 0, len = Expr.order.length; i < len; i++ ) {
			type = Expr.order[i];

			if ( (match = Expr.leftMatch[ type ].exec( expr )) ) {
				left = match[1];
				match.splice( 1, 1 );

				if ( left.substr( left.length - 1 ) !== "\\" ) {
					match[1] = (match[1] || "").replace( rBackslash, "" );
					set = Expr.find[ type ]( match, context, isXML );

					if ( set != null ) {
						expr = expr.replace( Expr.match[ type ], "" );
						break;
					}
				}
			}
		}

		if ( !set ) {
			set = typeof context.getElementsByTagName !== "undefined" ?
				context.getElementsByTagName( "*" ) :
				[];
		}

		return { set: set, expr: expr };
	};

	Sizzle.filter = function( expr, set, inplace, not ) {
		var match, anyFound,
			type, found, item, filter, left,
			i, pass,
			old = expr,
			result = [],
			curLoop = set,
			isXMLFilter = set && set[0] && Sizzle.isXML( set[0] );

		while ( expr && set.length ) {
			for ( type in Expr.filter ) {
				if ( (match = Expr.leftMatch[ type ].exec( expr )) != null && match[2] ) {
					filter = Expr.filter[ type ];
					left = match[1];

					anyFound = false;

					match.splice(1,1);

					if ( left.substr( left.length - 1 ) === "\\" ) {
						continue;
					}

					if ( curLoop === result ) {
						result = [];
					}

					if ( Expr.preFilter[ type ] ) {
						match = Expr.preFilter[ type ]( match, curLoop, inplace, result, not, isXMLFilter );

						if ( !match ) {
							anyFound = found = true;

						} else if ( match === true ) {
							continue;
						}
					}

					if ( match ) {
						for ( i = 0; (item = curLoop[i]) != null; i++ ) {
							if ( item ) {
								found = filter( item, match, i, curLoop );
								pass = not ^ found;

								if ( inplace && found != null ) {
									if ( pass ) {
										anyFound = true;

									} else {
										curLoop[i] = false;
									}

								} else if ( pass ) {
									result.push( item );
									anyFound = true;
								}
							}
						}
					}

					if ( found !== undefined ) {
						if ( !inplace ) {
							curLoop = result;
						}

						expr = expr.replace( Expr.match[ type ], "" );

						if ( !anyFound ) {
							return [];
						}

						break;
					}
				}
			}

			// Improper expression
			if ( expr === old ) {
				if ( anyFound == null ) {
					Sizzle.error( expr );

				} else {
					break;
				}
			}

			old = expr;
		}

		return curLoop;
	};

	Sizzle.error = function( msg ) {
		throw new Error( "Syntax error, unrecognized expression: " + msg );
	};

	/**
	 * Utility function for retreiving the text value of an array of DOM nodes
	 * @param {Array|Element} elem
	 */
	var getText = Sizzle.getText = function( elem ) {
	    var i, node,
			nodeType = elem.nodeType,
			ret = "";

		if ( nodeType ) {
			if ( nodeType === 1 || nodeType === 9 || nodeType === 11 ) {
				// Use textContent || innerText for elements
				if ( typeof elem.textContent === 'string' ) {
					return elem.textContent;
				} else if ( typeof elem.innerText === 'string' ) {
					// Replace IE's carriage returns
					return elem.innerText.replace( rReturn, '' );
				} else {
					// Traverse it's children
					for ( elem = elem.firstChild; elem; elem = elem.nextSibling) {
						ret += getText( elem );
					}
				}
			} else if ( nodeType === 3 || nodeType === 4 ) {
				return elem.nodeValue;
			}
		} else {

			// If no nodeType, this is expected to be an array
			for ( i = 0; (node = elem[i]); i++ ) {
				// Do not traverse comment nodes
				if ( node.nodeType !== 8 ) {
					ret += getText( node );
				}
			}
		}
		return ret;
	};

	var Expr = Sizzle.selectors = {
		order: [ "ID", "NAME", "TAG" ],

		match: {
			ID: /#((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,
			CLASS: /\.((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,
			NAME: /\[name=['"]*((?:[\w\u00c0-\uFFFF\-]|\\.)+)['"]*\]/,
			ATTR: /\[\s*((?:[\w\u00c0-\uFFFF\-]|\\.)+)\s*(?:(\S?=)\s*(?:(['"])(.*?)\3|(#?(?:[\w\u00c0-\uFFFF\-]|\\.)*)|)|)\s*\]/,
			TAG: /^((?:[\w\u00c0-\uFFFF\*\-]|\\.)+)/,
			CHILD: /:(only|nth|last|first)-child(?:\(\s*(even|odd|(?:[+\-]?\d+|(?:[+\-]?\d*)?n\s*(?:[+\-]\s*\d+)?))\s*\))?/,
			POS: /:(nth|eq|gt|lt|first|last|even|odd)(?:\((\d*)\))?(?=[^\-]|$)/,
			PSEUDO: /:((?:[\w\u00c0-\uFFFF\-]|\\.)+)(?:\((['"]?)((?:\([^\)]+\)|[^\(\)]*)+)\2\))?/
		},

		leftMatch: {},

		attrMap: {
			"class": "className",
			"for": "htmlFor"
		},

		attrHandle: {
			href: function( elem ) {
				return elem.getAttribute( "href" );
			},
			type: function( elem ) {
				return elem.getAttribute( "type" );
			}
		},

		relative: {
			"+": function(checkSet, part){
				var isPartStr = typeof part === "string",
					isTag = isPartStr && !rNonWord.test( part ),
					isPartStrNotTag = isPartStr && !isTag;

				if ( isTag ) {
					part = part.toLowerCase();
				}

				for ( var i = 0, l = checkSet.length, elem; i < l; i++ ) {
					if ( (elem = checkSet[i]) ) {
						while ( (elem = elem.previousSibling) && elem.nodeType !== 1 ) {}

						checkSet[i] = isPartStrNotTag || elem && elem.nodeName.toLowerCase() === part ?
							elem || false :
							elem === part;
					}
				}

				if ( isPartStrNotTag ) {
					Sizzle.filter( part, checkSet, true );
				}
			},

			">": function( checkSet, part ) {
				var elem,
					isPartStr = typeof part === "string",
					i = 0,
					l = checkSet.length;

				if ( isPartStr && !rNonWord.test( part ) ) {
					part = part.toLowerCase();

					for ( ; i < l; i++ ) {
						elem = checkSet[i];

						if ( elem ) {
							var parent = elem.parentNode;
							checkSet[i] = parent.nodeName.toLowerCase() === part ? parent : false;
						}
					}

				} else {
					for ( ; i < l; i++ ) {
						elem = checkSet[i];

						if ( elem ) {
							checkSet[i] = isPartStr ?
								elem.parentNode :
								elem.parentNode === part;
						}
					}

					if ( isPartStr ) {
						Sizzle.filter( part, checkSet, true );
					}
				}
			},

			"": function(checkSet, part, isXML){
				var nodeCheck,
					doneName = done++,
					checkFn = dirCheck;

				if ( typeof part === "string" && !rNonWord.test( part ) ) {
					part = part.toLowerCase();
					nodeCheck = part;
					checkFn = dirNodeCheck;
				}

				checkFn( "parentNode", part, doneName, checkSet, nodeCheck, isXML );
			},

			"~": function( checkSet, part, isXML ) {
				var nodeCheck,
					doneName = done++,
					checkFn = dirCheck;

				if ( typeof part === "string" && !rNonWord.test( part ) ) {
					part = part.toLowerCase();
					nodeCheck = part;
					checkFn = dirNodeCheck;
				}

				checkFn( "previousSibling", part, doneName, checkSet, nodeCheck, isXML );
			}
		},

		find: {
			ID: function( match, context, isXML ) {
				if ( typeof context.getElementById !== "undefined" && !isXML ) {
					var m = context.getElementById(match[1]);
					// Check parentNode to catch when Blackberry 4.6 returns
					// nodes that are no longer in the document #6963
					return m && m.parentNode ? [m] : [];
				}
			},

			NAME: function( match, context ) {
				if ( typeof context.getElementsByName !== "undefined" ) {
					var ret = [],
						results = context.getElementsByName( match[1] );

					for ( var i = 0, l = results.length; i < l; i++ ) {
						if ( results[i].getAttribute("name") === match[1] ) {
							ret.push( results[i] );
						}
					}

					return ret.length === 0 ? null : ret;
				}
			},

			TAG: function( match, context ) {
				if ( typeof context.getElementsByTagName !== "undefined" ) {
					return context.getElementsByTagName( match[1] );
				}
			}
		},
		preFilter: {
			CLASS: function( match, curLoop, inplace, result, not, isXML ) {
				match = " " + match[1].replace( rBackslash, "" ) + " ";

				if ( isXML ) {
					return match;
				}

				for ( var i = 0, elem; (elem = curLoop[i]) != null; i++ ) {
					if ( elem ) {
						if ( not ^ (elem.className && (" " + elem.className + " ").replace(/[\t\n\r]/g, " ").indexOf(match) >= 0) ) {
							if ( !inplace ) {
								result.push( elem );
							}

						} else if ( inplace ) {
							curLoop[i] = false;
						}
					}
				}

				return false;
			},

			ID: function( match ) {
				return match[1].replace( rBackslash, "" );
			},

			TAG: function( match, curLoop ) {
				return match[1].replace( rBackslash, "" ).toLowerCase();
			},

			CHILD: function( match ) {
				if ( match[1] === "nth" ) {
					if ( !match[2] ) {
						Sizzle.error( match[0] );
					}

					match[2] = match[2].replace(/^\+|\s*/g, '');

					// parse equations like 'even', 'odd', '5', '2n', '3n+2', '4n-1', '-n+6'
					var test = /(-?)(\d*)(?:n([+\-]?\d*))?/.exec(
						match[2] === "even" && "2n" || match[2] === "odd" && "2n+1" ||
						!/\D/.test( match[2] ) && "0n+" + match[2] || match[2]);

					// calculate the numbers (first)n+(last) including if they are negative
					match[2] = (test[1] + (test[2] || 1)) - 0;
					match[3] = test[3] - 0;
				}
				else if ( match[2] ) {
					Sizzle.error( match[0] );
				}

				// TODO: Move to normal caching system
				match[0] = done++;

				return match;
			},

			ATTR: function( match, curLoop, inplace, result, not, isXML ) {
				var name = match[1] = match[1].replace( rBackslash, "" );

				if ( !isXML && Expr.attrMap[name] ) {
					match[1] = Expr.attrMap[name];
				}

				// Handle if an un-quoted value was used
				match[4] = ( match[4] || match[5] || "" ).replace( rBackslash, "" );

				if ( match[2] === "~=" ) {
					match[4] = " " + match[4] + " ";
				}

				return match;
			},

			PSEUDO: function( match, curLoop, inplace, result, not ) {
				if ( match[1] === "not" ) {
					// If we're dealing with a complex expression, or a simple one
					if ( ( chunker.exec(match[3]) || "" ).length > 1 || /^\w/.test(match[3]) ) {
						match[3] = Sizzle(match[3], null, null, curLoop);

					} else {
						var ret = Sizzle.filter(match[3], curLoop, inplace, true ^ not);

						if ( !inplace ) {
							result.push.apply( result, ret );
						}

						return false;
					}

				} else if ( Expr.match.POS.test( match[0] ) || Expr.match.CHILD.test( match[0] ) ) {
					return true;
				}

				return match;
			},

			POS: function( match ) {
				match.unshift( true );

				return match;
			}
		},

		filters: {
			enabled: function( elem ) {
				return elem.disabled === false && elem.type !== "hidden";
			},

			disabled: function( elem ) {
				return elem.disabled === true;
			},

			checked: function( elem ) {
				return elem.checked === true;
			},

			selected: function( elem ) {
				// Accessing this property makes selected-by-default
				// options in Safari work properly
				if ( elem.parentNode ) {
					elem.parentNode.selectedIndex;
				}

				return elem.selected === true;
			},

			parent: function( elem ) {
				return !!elem.firstChild;
			},

			empty: function( elem ) {
				return !elem.firstChild;
			},

			has: function( elem, i, match ) {
				return !!Sizzle( match[3], elem ).length;
			},

			header: function( elem ) {
				return (/h\d/i).test( elem.nodeName );
			},

			text: function( elem ) {
				var attr = elem.getAttribute( "type" ), type = elem.type;
				// IE6 and 7 will map elem.type to 'text' for new HTML5 types (search, etc)
				// use getAttribute instead to test this case
				return elem.nodeName.toLowerCase() === "input" && "text" === type && ( attr === type || attr === null );
			},

			radio: function( elem ) {
				return elem.nodeName.toLowerCase() === "input" && "radio" === elem.type;
			},

			checkbox: function( elem ) {
				return elem.nodeName.toLowerCase() === "input" && "checkbox" === elem.type;
			},

			file: function( elem ) {
				return elem.nodeName.toLowerCase() === "input" && "file" === elem.type;
			},

			password: function( elem ) {
				return elem.nodeName.toLowerCase() === "input" && "password" === elem.type;
			},

			submit: function( elem ) {
				var name = elem.nodeName.toLowerCase();
				return (name === "input" || name === "button") && "submit" === elem.type;
			},

			image: function( elem ) {
				return elem.nodeName.toLowerCase() === "input" && "image" === elem.type;
			},

			reset: function( elem ) {
				var name = elem.nodeName.toLowerCase();
				return (name === "input" || name === "button") && "reset" === elem.type;
			},

			button: function( elem ) {
				var name = elem.nodeName.toLowerCase();
				return name === "input" && "button" === elem.type || name === "button";
			},

			input: function( elem ) {
				return (/input|select|textarea|button/i).test( elem.nodeName );
			},

			focus: function( elem ) {
				return elem === elem.ownerDocument.activeElement;
			}
		},
		setFilters: {
			first: function( elem, i ) {
				return i === 0;
			},

			last: function( elem, i, match, array ) {
				return i === array.length - 1;
			},

			even: function( elem, i ) {
				return i % 2 === 0;
			},

			odd: function( elem, i ) {
				return i % 2 === 1;
			},

			lt: function( elem, i, match ) {
				return i < match[3] - 0;
			},

			gt: function( elem, i, match ) {
				return i > match[3] - 0;
			},

			nth: function( elem, i, match ) {
				return match[3] - 0 === i;
			},

			eq: function( elem, i, match ) {
				return match[3] - 0 === i;
			}
		},
		filter: {
			PSEUDO: function( elem, match, i, array ) {
				var name = match[1],
					filter = Expr.filters[ name ];

				if ( filter ) {
					return filter( elem, i, match, array );

				} else if ( name === "contains" ) {
					return (elem.textContent || elem.innerText || getText([ elem ]) || "").indexOf(match[3]) >= 0;

				} else if ( name === "not" ) {
					var not = match[3];

					for ( var j = 0, l = not.length; j < l; j++ ) {
						if ( not[j] === elem ) {
							return false;
						}
					}

					return true;

				} else {
					Sizzle.error( name );
				}
			},

			CHILD: function( elem, match ) {
				var first, last,
					doneName, parent, cache,
					count, diff,
					type = match[1],
					node = elem;

				switch ( type ) {
					case "only":
					case "first":
						while ( (node = node.previousSibling) ) {
							if ( node.nodeType === 1 ) {
								return false;
							}
						}

						if ( type === "first" ) {
							return true;
						}

						node = elem;

						/* falls through */
					case "last":
						while ( (node = node.nextSibling) ) {
							if ( node.nodeType === 1 ) {
								return false;
							}
						}

						return true;

					case "nth":
						first = match[2];
						last = match[3];

						if ( first === 1 && last === 0 ) {
							return true;
						}

						doneName = match[0];
						parent = elem.parentNode;

						if ( parent && (parent[ expando ] !== doneName || !elem.nodeIndex) ) {
							count = 0;

							for ( node = parent.firstChild; node; node = node.nextSibling ) {
								if ( node.nodeType === 1 ) {
									node.nodeIndex = ++count;
								}
							}

							parent[ expando ] = doneName;
						}

						diff = elem.nodeIndex - last;

						if ( first === 0 ) {
							return diff === 0;

						} else {
							return ( diff % first === 0 && diff / first >= 0 );
						}
				}
			},

			ID: function( elem, match ) {
				return elem.nodeType === 1 && elem.getAttribute("id") === match;
			},

			TAG: function( elem, match ) {
				return (match === "*" && elem.nodeType === 1) || !!elem.nodeName && elem.nodeName.toLowerCase() === match;
			},

			CLASS: function( elem, match ) {
				return (" " + (elem.className || elem.getAttribute("class")) + " ")
					.indexOf( match ) > -1;
			},

			ATTR: function( elem, match ) {
				var name = match[1],
					result = Sizzle.attr ?
						Sizzle.attr( elem, name ) :
						Expr.attrHandle[ name ] ?
						Expr.attrHandle[ name ]( elem ) :
						elem[ name ] != null ?
							elem[ name ] :
							elem.getAttribute( name ),
					value = result + "",
					type = match[2],
					check = match[4];

				return result == null ?
					type === "!=" :
					!type && Sizzle.attr ?
					result != null :
					type === "=" ?
					value === check :
					type === "*=" ?
					value.indexOf(check) >= 0 :
					type === "~=" ?
					(" " + value + " ").indexOf(check) >= 0 :
					!check ?
					value && result !== false :
					type === "!=" ?
					value !== check :
					type === "^=" ?
					value.indexOf(check) === 0 :
					type === "$=" ?
					value.substr(value.length - check.length) === check :
					type === "|=" ?
					value === check || value.substr(0, check.length + 1) === check + "-" :
					false;
			},

			POS: function( elem, match, i, array ) {
				var name = match[2],
					filter = Expr.setFilters[ name ];

				if ( filter ) {
					return filter( elem, i, match, array );
				}
			}
		}
	};

	var origPOS = Expr.match.POS,
		fescape = function(all, num){
			return "\\" + (num - 0 + 1);
		};

	for ( var type in Expr.match ) {
		Expr.match[ type ] = new RegExp( Expr.match[ type ].source + (/(?![^\[]*\])(?![^\(]*\))/.source) );
		Expr.leftMatch[ type ] = new RegExp( /(^(?:.|\r|\n)*?)/.source + Expr.match[ type ].source.replace(/\\(\d+)/g, fescape) );
	}
	// Expose origPOS
	// "global" as in regardless of relation to brackets/parens
	Expr.match.globalPOS = origPOS;

	var makeArray = function( array, results ) {
		array = Array.prototype.slice.call( array, 0 );

		if ( results ) {
			results.push.apply( results, array );
			return results;
		}

		return array;
	};

	// Perform a simple check to determine if the browser is capable of
	// converting a NodeList to an array using builtin methods.
	// Also verifies that the returned array holds DOM nodes
	// (which is not the case in the Blackberry browser)
	try {
		Array.prototype.slice.call( document.documentElement.childNodes, 0 )[0].nodeType;

	// Provide a fallback method if it does not work
	} catch( e ) {
		makeArray = function( array, results ) {
			var i = 0,
				ret = results || [];

			if ( toString.call(array) === "[object Array]" ) {
				Array.prototype.push.apply( ret, array );

			} else {
				if ( typeof array.length === "number" ) {
					for ( var l = array.length; i < l; i++ ) {
						ret.push( array[i] );
					}

				} else {
					for ( ; array[i]; i++ ) {
						ret.push( array[i] );
					}
				}
			}

			return ret;
		};
	}

	var sortOrder, siblingCheck;

	if ( document.documentElement.compareDocumentPosition ) {
		sortOrder = function( a, b ) {
			if ( a === b ) {
				hasDuplicate = true;
				return 0;
			}

			if ( !a.compareDocumentPosition || !b.compareDocumentPosition ) {
				return a.compareDocumentPosition ? -1 : 1;
			}

			return a.compareDocumentPosition(b) & 4 ? -1 : 1;
		};

	} else {
		sortOrder = function( a, b ) {
			// The nodes are identical, we can exit early
			if ( a === b ) {
				hasDuplicate = true;
				return 0;

			// Fallback to using sourceIndex (in IE) if it's available on both nodes
			} else if ( a.sourceIndex && b.sourceIndex ) {
				return a.sourceIndex - b.sourceIndex;
			}

			var al, bl,
				ap = [],
				bp = [],
				aup = a.parentNode,
				bup = b.parentNode,
				cur = aup;

			// If the nodes are siblings (or identical) we can do a quick check
			if ( aup === bup ) {
				return siblingCheck( a, b );

			// If no parents were found then the nodes are disconnected
			} else if ( !aup ) {
				return -1;

			} else if ( !bup ) {
				return 1;
			}

			// Otherwise they're somewhere else in the tree so we need
			// to build up a full list of the parentNodes for comparison
			while ( cur ) {
				ap.unshift( cur );
				cur = cur.parentNode;
			}

			cur = bup;

			while ( cur ) {
				bp.unshift( cur );
				cur = cur.parentNode;
			}

			al = ap.length;
			bl = bp.length;

			// Start walking down the tree looking for a discrepancy
			for ( var i = 0; i < al && i < bl; i++ ) {
				if ( ap[i] !== bp[i] ) {
					return siblingCheck( ap[i], bp[i] );
				}
			}

			// We ended someplace up the tree so do a sibling check
			return i === al ?
				siblingCheck( a, bp[i], -1 ) :
				siblingCheck( ap[i], b, 1 );
		};

		siblingCheck = function( a, b, ret ) {
			if ( a === b ) {
				return ret;
			}

			var cur = a.nextSibling;

			while ( cur ) {
				if ( cur === b ) {
					return -1;
				}

				cur = cur.nextSibling;
			}

			return 1;
		};
	}

	// Check to see if the browser returns elements by name when
	// querying by getElementById (and provide a workaround)
	(function(){
		// We're going to inject a fake input element with a specified name
		var form = document.createElement("div"),
			id = "script" + (new Date()).getTime(),
			root = document.documentElement;

		form.innerHTML = "<a name='" + id + "'/>";

		// Inject it into the root element, check its status, and remove it quickly
		root.insertBefore( form, root.firstChild );

		// The workaround has to do additional checks after a getElementById
		// Which slows things down for other browsers (hence the branching)
		if ( document.getElementById( id ) ) {
			Expr.find.ID = function( match, context, isXML ) {
				if ( typeof context.getElementById !== "undefined" && !isXML ) {
					var m = context.getElementById(match[1]);

					return m ?
						m.id === match[1] || typeof m.getAttributeNode !== "undefined" && m.getAttributeNode("id").nodeValue === match[1] ?
							[m] :
							undefined :
						[];
				}
			};

			Expr.filter.ID = function( elem, match ) {
				var node = typeof elem.getAttributeNode !== "undefined" && elem.getAttributeNode("id");

				return elem.nodeType === 1 && node && node.nodeValue === match;
			};
		}

		root.removeChild( form );

		// release memory in IE
		root = form = null;
	})();

	(function(){
		// Check to see if the browser returns only elements
		// when doing getElementsByTagName("*")

		// Create a fake element
		var div = document.createElement("div");
		div.appendChild( document.createComment("") );

		// Make sure no comments are found
		if ( div.getElementsByTagName("*").length > 0 ) {
			Expr.find.TAG = function( match, context ) {
				var results = context.getElementsByTagName( match[1] );

				// Filter out possible comments
				if ( match[1] === "*" ) {
					var tmp = [];

					for ( var i = 0; results[i]; i++ ) {
						if ( results[i].nodeType === 1 ) {
							tmp.push( results[i] );
						}
					}

					results = tmp;
				}

				return results;
			};
		}

		// Check to see if an attribute returns normalized href attributes
		div.innerHTML = "<a href='#'></a>";

		if ( div.firstChild && typeof div.firstChild.getAttribute !== "undefined" &&
				div.firstChild.getAttribute("href") !== "#" ) {

			Expr.attrHandle.href = function( elem ) {
				return elem.getAttribute( "href", 2 );
			};
		}

		// release memory in IE
		div = null;
	})();

	if ( document.querySelectorAll ) {
		(function(){
			var oldSizzle = Sizzle,
				div = document.createElement("div"),
				id = "__sizzle__";

			div.innerHTML = "<p class='TEST'></p>";

			// Safari can't handle uppercase or unicode characters when
			// in quirks mode.
			if ( div.querySelectorAll && div.querySelectorAll(".TEST").length === 0 ) {
				return;
			}

			Sizzle = function( query, context, extra, seed ) {
				context = context || document;

				// Only use querySelectorAll on non-XML documents
				// (ID selectors don't work in non-HTML documents)
				if ( !seed && !Sizzle.isXML(context) ) {
					// See if we find a selector to speed up
					var match = /^(\w+$)|^\.([\w\-]+$)|^#([\w\-]+$)/.exec( query );

					if ( match && (context.nodeType === 1 || context.nodeType === 9) ) {
						// Speed-up: Sizzle("TAG")
						if ( match[1] ) {
							return makeArray( context.getElementsByTagName( query ), extra );

						// Speed-up: Sizzle(".CLASS")
						} else if ( match[2] && Expr.find.CLASS && context.getElementsByClassName ) {
							return makeArray( context.getElementsByClassName( match[2] ), extra );
						}
					}

					if ( context.nodeType === 9 ) {
						// Speed-up: Sizzle("body")
						// The body element only exists once, optimize finding it
						if ( query === "body" && context.body ) {
							return makeArray( [ context.body ], extra );

						// Speed-up: Sizzle("#ID")
						} else if ( match && match[3] ) {
							var elem = context.getElementById( match[3] );

							// Check parentNode to catch when Blackberry 4.6 returns
							// nodes that are no longer in the document #6963
							if ( elem && elem.parentNode ) {
								// Handle the case where IE and Opera return items
								// by name instead of ID
								if ( elem.id === match[3] ) {
									return makeArray( [ elem ], extra );
								}

							} else {
								return makeArray( [], extra );
							}
						}

						try {
							return makeArray( context.querySelectorAll(query), extra );
						} catch(qsaError) {}

					// qSA works strangely on Element-rooted queries
					// We can work around this by specifying an extra ID on the root
					// and working up from there (Thanks to Andrew Dupont for the technique)
					// IE 8 doesn't work on object elements
					} else if ( context.nodeType === 1 && context.nodeName.toLowerCase() !== "object" ) {
						var oldContext = context,
							old = context.getAttribute( "id" ),
							nid = old || id,
							hasParent = context.parentNode,
							relativeHierarchySelector = /^\s*[+~]/.test( query );

						if ( !old ) {
							context.setAttribute( "id", nid );
						} else {
							nid = nid.replace( /'/g, "\\$&" );
						}
						if ( relativeHierarchySelector && hasParent ) {
							context = context.parentNode;
						}

						try {
							if ( !relativeHierarchySelector || hasParent ) {
								return makeArray( context.querySelectorAll( "[id='" + nid + "'] " + query ), extra );
							}

						} catch(pseudoError) {
						} finally {
							if ( !old ) {
								oldContext.removeAttribute( "id" );
							}
						}
					}
				}

				return oldSizzle(query, context, extra, seed);
			};

			for ( var prop in oldSizzle ) {
				Sizzle[ prop ] = oldSizzle[ prop ];
			}

			// release memory in IE
			div = null;
		})();
	}

	(function(){
		var html = document.documentElement,
			matches = html.matchesSelector || html.mozMatchesSelector || html.webkitMatchesSelector || html.msMatchesSelector;

		if ( matches ) {
			// Check to see if it's possible to do matchesSelector
			// on a disconnected node (IE 9 fails this)
			var disconnectedMatch = !matches.call( document.createElement( "div" ), "div" ),
				pseudoWorks = false;

			try {
				// This should fail with an exception
				// Gecko does not error, returns false instead
				matches.call( document.documentElement, "[test!='']:sizzle" );

			} catch( pseudoError ) {
				pseudoWorks = true;
			}

			Sizzle.matchesSelector = function( node, expr ) {
				// Make sure that attribute selectors are quoted
				expr = expr.replace(/\=\s*([^'"\]]*)\s*\]/g, "='$1']");

				if ( !Sizzle.isXML( node ) ) {
					try {
						if ( pseudoWorks || !Expr.match.PSEUDO.test( expr ) && !/!=/.test( expr ) ) {
							var ret = matches.call( node, expr );

							// IE 9's matchesSelector returns false on disconnected nodes
							if ( ret || !disconnectedMatch ||
									// As well, disconnected nodes are said to be in a document
									// fragment in IE 9, so check for that
									node.document && node.document.nodeType !== 11 ) {
								return ret;
							}
						}
					} catch(e) {}
				}

				return Sizzle(expr, null, null, [node]).length > 0;
			};
		}
	})();

	(function(){
		var div = document.createElement("div");

		div.innerHTML = "<div class='test e'></div><div class='test'></div>";

		// Opera can't find a second classname (in 9.6)
		// Also, make sure that getElementsByClassName actually exists
		if ( !div.getElementsByClassName || div.getElementsByClassName("e").length === 0 ) {
			return;
		}

		// Safari caches class attributes, doesn't catch changes (in 3.2)
		div.lastChild.className = "e";

		if ( div.getElementsByClassName("e").length === 1 ) {
			return;
		}

		Expr.order.splice(1, 0, "CLASS");
		Expr.find.CLASS = function( match, context, isXML ) {
			if ( typeof context.getElementsByClassName !== "undefined" && !isXML ) {
				return context.getElementsByClassName(match[1]);
			}
		};

		// release memory in IE
		div = null;
	})();

	function dirNodeCheck( dir, cur, doneName, checkSet, nodeCheck, isXML ) {
		for ( var i = 0, l = checkSet.length; i < l; i++ ) {
			var elem = checkSet[i];

			if ( elem ) {
				var match = false;

				elem = elem[dir];

				while ( elem ) {
					if ( elem[ expando ] === doneName ) {
						match = checkSet[elem.sizset];
						break;
					}

					if ( elem.nodeType === 1 && !isXML ){
						elem[ expando ] = doneName;
						elem.sizset = i;
					}

					if ( elem.nodeName.toLowerCase() === cur ) {
						match = elem;
						break;
					}

					elem = elem[dir];
				}

				checkSet[i] = match;
			}
		}
	}

	function dirCheck( dir, cur, doneName, checkSet, nodeCheck, isXML ) {
		for ( var i = 0, l = checkSet.length; i < l; i++ ) {
			var elem = checkSet[i];

			if ( elem ) {
				var match = false;

				elem = elem[dir];

				while ( elem ) {
					if ( elem[ expando ] === doneName ) {
						match = checkSet[elem.sizset];
						break;
					}

					if ( elem.nodeType === 1 ) {
						if ( !isXML ) {
							elem[ expando ] = doneName;
							elem.sizset = i;
						}

						if ( typeof cur !== "string" ) {
							if ( elem === cur ) {
								match = true;
								break;
							}

						} else if ( Sizzle.filter( cur, [elem] ).length > 0 ) {
							match = elem;
							break;
						}
					}

					elem = elem[dir];
				}

				checkSet[i] = match;
			}
		}
	}

	if ( document.documentElement.contains ) {
		Sizzle.contains = function( a, b ) {
			return a !== b && (a.contains ? a.contains(b) : true);
		};

	} else if ( document.documentElement.compareDocumentPosition ) {
		Sizzle.contains = function( a, b ) {
			return !!(a.compareDocumentPosition(b) & 16);
		};

	} else {
		Sizzle.contains = function() {
			return false;
		};
	}

	Sizzle.isXML = function( elem ) {
		// documentElement is verified for cases where it doesn't yet exist
		// (such as loading iframes in IE - #4833)
		var documentElement = (elem ? elem.ownerDocument || elem : 0).documentElement;

		return documentElement ? documentElement.nodeName !== "HTML" : false;
	};

	var posProcess = function( selector, context, seed ) {
		var match,
			tmpSet = [],
			later = "",
			root = context.nodeType ? [context] : context;

		// Position selectors must be done after the filter
		// And so must :not(positional) so we move all PSEUDOs to the end
		while ( (match = Expr.match.PSEUDO.exec( selector )) ) {
			later += match[0];
			selector = selector.replace( Expr.match.PSEUDO, "" );
		}

		selector = Expr.relative[selector] ? selector + "*" : selector;

		for ( var i = 0, l = root.length; i < l; i++ ) {
			Sizzle( selector, root[i], tmpSet, seed );
		}

		return Sizzle.filter( later, tmpSet );
	};

	// EXPOSE
	// Override sizzle attribute retrieval
	Sizzle.attr = jQuery.attr;
	Sizzle.selectors.attrMap = {};
	jQuery.find = Sizzle;
	jQuery.expr = Sizzle.selectors;
	jQuery.expr[":"] = jQuery.expr.filters;
	jQuery.unique = Sizzle.uniqueSort;
	jQuery.text = Sizzle.getText;
	jQuery.isXMLDoc = Sizzle.isXML;
	jQuery.contains = Sizzle.contains;


	})();


	var runtil = /Until$/,
		rparentsprev = /^(?:parents|prevUntil|prevAll)/,
		// Note: This RegExp should be improved, or likely pulled from Sizzle
		rmultiselector = /,/,
		isSimple = /^.[^:#\[\.,]*$/,
		slice = Array.prototype.slice,
		POS = jQuery.expr.match.globalPOS,
		// methods guaranteed to produce a unique set when starting from a unique set
		guaranteedUnique = {
			children: true,
			contents: true,
			next: true,
			prev: true
		};

	jQuery.fn.extend({
		find: function( selector ) {
			var self = this,
				i, l;

			if ( typeof selector !== "string" ) {
				return jQuery( selector ).filter(function() {
					for ( i = 0, l = self.length; i < l; i++ ) {
						if ( jQuery.contains( self[ i ], this ) ) {
							return true;
						}
					}
				});
			}

			var ret = this.pushStack( "", "find", selector ),
				length, n, r;

			for ( i = 0, l = this.length; i < l; i++ ) {
				length = ret.length;
				jQuery.find( selector, this[i], ret );

				if ( i > 0 ) {
					// Make sure that the results are unique
					for ( n = length; n < ret.length; n++ ) {
						for ( r = 0; r < length; r++ ) {
							if ( ret[r] === ret[n] ) {
								ret.splice(n--, 1);
								break;
							}
						}
					}
				}
			}

			return ret;
		},

		has: function( target ) {
			var targets = jQuery( target );
			return this.filter(function() {
				for ( var i = 0, l = targets.length; i < l; i++ ) {
					if ( jQuery.contains( this, targets[i] ) ) {
						return true;
					}
				}
			});
		},

		not: function( selector ) {
			return this.pushStack( winnow(this, selector, false), "not", selector);
		},

		filter: function( selector ) {
			return this.pushStack( winnow(this, selector, true), "filter", selector );
		},

		is: function( selector ) {
			return !!selector && (
				typeof selector === "string" ?
					// If this is a positional selector, check membership in the returned set
					// so $("p:first").is("p:last") won't return true for a doc with two "p".
					POS.test( selector ) ?
						jQuery( selector, this.context ).index( this[0] ) >= 0 :
						jQuery.filter( selector, this ).length > 0 :
					this.filter( selector ).length > 0 );
		},

		closest: function( selectors, context ) {
			var ret = [], i, l, cur = this[0];

			// Array (deprecated as of jQuery 1.7)
			if ( jQuery.isArray( selectors ) ) {
				var level = 1;

				while ( cur && cur.ownerDocument && cur !== context ) {
					for ( i = 0; i < selectors.length; i++ ) {

						if ( jQuery( cur ).is( selectors[ i ] ) ) {
							ret.push({ selector: selectors[ i ], elem: cur, level: level });
						}
					}

					cur = cur.parentNode;
					level++;
				}

				return ret;
			}

			// String
			var pos = POS.test( selectors ) || typeof selectors !== "string" ?
					jQuery( selectors, context || this.context ) :
					0;

			for ( i = 0, l = this.length; i < l; i++ ) {
				cur = this[i];

				while ( cur ) {
					if ( pos ? pos.index(cur) > -1 : jQuery.find.matchesSelector(cur, selectors) ) {
						ret.push( cur );
						break;

					} else {
						cur = cur.parentNode;
						if ( !cur || !cur.ownerDocument || cur === context || cur.nodeType === 11 ) {
							break;
						}
					}
				}
			}

			ret = ret.length > 1 ? jQuery.unique( ret ) : ret;

			return this.pushStack( ret, "closest", selectors );
		},

		// Determine the position of an element within
		// the matched set of elements
		index: function( elem ) {

			// No argument, return index in parent
			if ( !elem ) {
				return ( this[0] && this[0].parentNode ) ? this.prevAll().length : -1;
			}

			// index in selector
			if ( typeof elem === "string" ) {
				return jQuery.inArray( this[0], jQuery( elem ) );
			}

			// Locate the position of the desired element
			return jQuery.inArray(
				// If it receives a jQuery object, the first element is used
				elem.jquery ? elem[0] : elem, this );
		},

		add: function( selector, context ) {
			var set = typeof selector === "string" ?
					jQuery( selector, context ) :
					jQuery.makeArray( selector && selector.nodeType ? [ selector ] : selector ),
				all = jQuery.merge( this.get(), set );

			return this.pushStack( isDisconnected( set[0] ) || isDisconnected( all[0] ) ?
				all :
				jQuery.unique( all ) );
		},

		andSelf: function() {
			return this.add( this.prevObject );
		}
	});

	// A painfully simple check to see if an element is disconnected
	// from a document (should be improved, where feasible).
	function isDisconnected( node ) {
		return !node || !node.parentNode || node.parentNode.nodeType === 11;
	}

	jQuery.each({
		parent: function( elem ) {
			var parent = elem.parentNode;
			return parent && parent.nodeType !== 11 ? parent : null;
		},
		parents: function( elem ) {
			return jQuery.dir( elem, "parentNode" );
		},
		parentsUntil: function( elem, i, until ) {
			return jQuery.dir( elem, "parentNode", until );
		},
		next: function( elem ) {
			return jQuery.nth( elem, 2, "nextSibling" );
		},
		prev: function( elem ) {
			return jQuery.nth( elem, 2, "previousSibling" );
		},
		nextAll: function( elem ) {
			return jQuery.dir( elem, "nextSibling" );
		},
		prevAll: function( elem ) {
			return jQuery.dir( elem, "previousSibling" );
		},
		nextUntil: function( elem, i, until ) {
			return jQuery.dir( elem, "nextSibling", until );
		},
		prevUntil: function( elem, i, until ) {
			return jQuery.dir( elem, "previousSibling", until );
		},
		siblings: function( elem ) {
			return jQuery.sibling( ( elem.parentNode || {} ).firstChild, elem );
		},
		children: function( elem ) {
			return jQuery.sibling( elem.firstChild );
		},
		contents: function( elem ) {
			return jQuery.nodeName( elem, "iframe" ) ?
				elem.contentDocument || elem.contentWindow.document :
				jQuery.makeArray( elem.childNodes );
		}
	}, function( name, fn ) {
		jQuery.fn[ name ] = function( until, selector ) {
			var ret = jQuery.map( this, fn, until );

			if ( !runtil.test( name ) ) {
				selector = until;
			}

			if ( selector && typeof selector === "string" ) {
				ret = jQuery.filter( selector, ret );
			}

			ret = this.length > 1 && !guaranteedUnique[ name ] ? jQuery.unique( ret ) : ret;

			if ( (this.length > 1 || rmultiselector.test( selector )) && rparentsprev.test( name ) ) {
				ret = ret.reverse();
			}

			return this.pushStack( ret, name, slice.call( arguments ).join(",") );
		};
	});

	jQuery.extend({
		filter: function( expr, elems, not ) {
			if ( not ) {
				expr = ":not(" + expr + ")";
			}

			return elems.length === 1 ?
				jQuery.find.matchesSelector(elems[0], expr) ? [ elems[0] ] : [] :
				jQuery.find.matches(expr, elems);
		},

		dir: function( elem, dir, until ) {
			var matched = [],
				cur = elem[ dir ];

			while ( cur && cur.nodeType !== 9 && (until === undefined || cur.nodeType !== 1 || !jQuery( cur ).is( until )) ) {
				if ( cur.nodeType === 1 ) {
					matched.push( cur );
				}
				cur = cur[dir];
			}
			return matched;
		},

		nth: function( cur, result, dir, elem ) {
			result = result || 1;
			var num = 0;

			for ( ; cur; cur = cur[dir] ) {
				if ( cur.nodeType === 1 && ++num === result ) {
					break;
				}
			}

			return cur;
		},

		sibling: function( n, elem ) {
			var r = [];

			for ( ; n; n = n.nextSibling ) {
				if ( n.nodeType === 1 && n !== elem ) {
					r.push( n );
				}
			}

			return r;
		}
	});

	// Implement the identical functionality for filter and not
	function winnow( elements, qualifier, keep ) {

		// Can't pass null or undefined to indexOf in Firefox 4
		// Set to 0 to skip string check
		qualifier = qualifier || 0;

		if ( jQuery.isFunction( qualifier ) ) {
			return jQuery.grep(elements, function( elem, i ) {
				var retVal = !!qualifier.call( elem, i, elem );
				return retVal === keep;
			});

		} else if ( qualifier.nodeType ) {
			return jQuery.grep(elements, function( elem, i ) {
				return ( elem === qualifier ) === keep;
			});

		} else if ( typeof qualifier === "string" ) {
			var filtered = jQuery.grep(elements, function( elem ) {
				return elem.nodeType === 1;
			});

			if ( isSimple.test( qualifier ) ) {
				return jQuery.filter(qualifier, filtered, !keep);
			} else {
				qualifier = jQuery.filter( qualifier, filtered );
			}
		}

		return jQuery.grep(elements, function( elem, i ) {
			return ( jQuery.inArray( elem, qualifier ) >= 0 ) === keep;
		});
	}




	function createSafeFragment( document ) {
		var list = nodeNames.split( "|" ),
		safeFrag = document.createDocumentFragment();

		if ( safeFrag.createElement ) {
			while ( list.length ) {
				safeFrag.createElement(
					list.pop()
				);
			}
		}
		return safeFrag;
	}

	var nodeNames = "abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|" +
			"header|hgroup|mark|meter|nav|output|progress|section|summary|time|video",
		rinlinejQuery = / jQuery\d+="(?:\d+|null)"/g,
		rleadingWhitespace = /^\s+/,
		rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/ig,
		rtagName = /<([\w:]+)/,
		rtbody = /<tbody/i,
		rhtml = /<|&#?\w+;/,
		rnoInnerhtml = /<(?:script|style)/i,
		rnocache = /<(?:script|object|embed|option|style)/i,
		rnoshimcache = new RegExp("<(?:" + nodeNames + ")[\\s/>]", "i"),
		// checked="checked" or checked
		rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
		rscriptType = /\/(java|ecma)script/i,
		rcleanScript = /^\s*<!(?:\[CDATA\[|\-\-)/,
		wrapMap = {
			option: [ 1, "<select multiple='multiple'>", "</select>" ],
			legend: [ 1, "<fieldset>", "</fieldset>" ],
			thead: [ 1, "<table>", "</table>" ],
			tr: [ 2, "<table><tbody>", "</tbody></table>" ],
			td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],
			col: [ 2, "<table><tbody></tbody><colgroup>", "</colgroup></table>" ],
			area: [ 1, "<map>", "</map>" ],
			_default: [ 0, "", "" ]
		},
		safeFragment = createSafeFragment( document );

	wrapMap.optgroup = wrapMap.option;
	wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
	wrapMap.th = wrapMap.td;

	// IE can't serialize <link> and <script> tags normally
	if ( !jQuery.support.htmlSerialize ) {
		wrapMap._default = [ 1, "div<div>", "</div>" ];
	}

	jQuery.fn.extend({
		text: function( value ) {
			return jQuery.access( this, function( value ) {
				return value === undefined ?
					jQuery.text( this ) :
					this.empty().append( ( this[0] && this[0].ownerDocument || document ).createTextNode( value ) );
			}, null, value, arguments.length );
		},

		wrapAll: function( html ) {
			if ( jQuery.isFunction( html ) ) {
				return this.each(function(i) {
					jQuery(this).wrapAll( html.call(this, i) );
				});
			}

			if ( this[0] ) {
				// The elements to wrap the target around
				var wrap = jQuery( html, this[0].ownerDocument ).eq(0).clone(true);

				if ( this[0].parentNode ) {
					wrap.insertBefore( this[0] );
				}

				wrap.map(function() {
					var elem = this;

					while ( elem.firstChild && elem.firstChild.nodeType === 1 ) {
						elem = elem.firstChild;
					}

					return elem;
				}).append( this );
			}

			return this;
		},

		wrapInner: function( html ) {
			if ( jQuery.isFunction( html ) ) {
				return this.each(function(i) {
					jQuery(this).wrapInner( html.call(this, i) );
				});
			}

			return this.each(function() {
				var self = jQuery( this ),
					contents = self.contents();

				if ( contents.length ) {
					contents.wrapAll( html );

				} else {
					self.append( html );
				}
			});
		},

		wrap: function( html ) {
			var isFunction = jQuery.isFunction( html );

			return this.each(function(i) {
				jQuery( this ).wrapAll( isFunction ? html.call(this, i) : html );
			});
		},

		unwrap: function() {
			return this.parent().each(function() {
				if ( !jQuery.nodeName( this, "body" ) ) {
					jQuery( this ).replaceWith( this.childNodes );
				}
			}).end();
		},

		append: function() {
			return this.domManip(arguments, true, function( elem ) {
				if ( this.nodeType === 1 ) {
					this.appendChild( elem );
				}
			});
		},

		prepend: function() {
			return this.domManip(arguments, true, function( elem ) {
				if ( this.nodeType === 1 ) {
					this.insertBefore( elem, this.firstChild );
				}
			});
		},

		before: function() {
			if ( this[0] && this[0].parentNode ) {
				return this.domManip(arguments, false, function( elem ) {
					this.parentNode.insertBefore( elem, this );
				});
			} else if ( arguments.length ) {
				var set = jQuery.clean( arguments );
				set.push.apply( set, this.toArray() );
				return this.pushStack( set, "before", arguments );
			}
		},

		after: function() {
			if ( this[0] && this[0].parentNode ) {
				return this.domManip(arguments, false, function( elem ) {
					this.parentNode.insertBefore( elem, this.nextSibling );
				});
			} else if ( arguments.length ) {
				var set = this.pushStack( this, "after", arguments );
				set.push.apply( set, jQuery.clean(arguments) );
				return set;
			}
		},

		// keepData is for internal use only--do not document
		remove: function( selector, keepData ) {
			for ( var i = 0, elem; (elem = this[i]) != null; i++ ) {
				if ( !selector || jQuery.filter( selector, [ elem ] ).length ) {
					if ( !keepData && elem.nodeType === 1 ) {
						jQuery.cleanData( elem.getElementsByTagName("*") );
						jQuery.cleanData( [ elem ] );
					}

					if ( elem.parentNode ) {
						elem.parentNode.removeChild( elem );
					}
				}
			}

			return this;
		},

		empty: function() {
			for ( var i = 0, elem; (elem = this[i]) != null; i++ ) {
				// Remove element nodes and prevent memory leaks
				if ( elem.nodeType === 1 ) {
					jQuery.cleanData( elem.getElementsByTagName("*") );
				}

				// Remove any remaining nodes
				while ( elem.firstChild ) {
					elem.removeChild( elem.firstChild );
				}
			}

			return this;
		},

		clone: function( dataAndEvents, deepDataAndEvents ) {
			dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
			deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;

			return this.map( function () {
				return jQuery.clone( this, dataAndEvents, deepDataAndEvents );
			});
		},

		html: function( value ) {
			return jQuery.access( this, function( value ) {
				var elem = this[0] || {},
					i = 0,
					l = this.length;

				if ( value === undefined ) {
					return elem.nodeType === 1 ?
						elem.innerHTML.replace( rinlinejQuery, "" ) :
						null;
				}


				if ( typeof value === "string" && !rnoInnerhtml.test( value ) &&
					( jQuery.support.leadingWhitespace || !rleadingWhitespace.test( value ) ) &&
					!wrapMap[ ( rtagName.exec( value ) || ["", ""] )[1].toLowerCase() ] ) {

					value = value.replace( rxhtmlTag, "<$1></$2>" );

					try {
						for (; i < l; i++ ) {
							// Remove element nodes and prevent memory leaks
							elem = this[i] || {};
							if ( elem.nodeType === 1 ) {
								jQuery.cleanData( elem.getElementsByTagName( "*" ) );
								elem.innerHTML = value;
							}
						}

						elem = 0;

					// If using innerHTML throws an exception, use the fallback method
					} catch(e) {}
				}

				if ( elem ) {
					this.empty().append( value );
				}
			}, null, value, arguments.length );
		},

		replaceWith: function( value ) {
			if ( this[0] && this[0].parentNode ) {
				// Make sure that the elements are removed from the DOM before they are inserted
				// this can help fix replacing a parent with child elements
				if ( jQuery.isFunction( value ) ) {
					return this.each(function(i) {
						var self = jQuery(this), old = self.html();
						self.replaceWith( value.call( this, i, old ) );
					});
				}

				if ( typeof value !== "string" ) {
					value = jQuery( value ).detach();
				}

				return this.each(function() {
					var next = this.nextSibling,
						parent = this.parentNode;

					jQuery( this ).remove();

					if ( next ) {
						jQuery(next).before( value );
					} else {
						jQuery(parent).append( value );
					}
				});
			} else {
				return this.length ?
					this.pushStack( jQuery(jQuery.isFunction(value) ? value() : value), "replaceWith", value ) :
					this;
			}
		},

		detach: function( selector ) {
			return this.remove( selector, true );
		},

		domManip: function( args, table, callback ) {
			var results, first, fragment, parent,
				value = args[0],
				scripts = [];

			// We can't cloneNode fragments that contain checked, in WebKit
			if ( !jQuery.support.checkClone && arguments.length === 3 && typeof value === "string" && rchecked.test( value ) ) {
				return this.each(function() {
					jQuery(this).domManip( args, table, callback, true );
				});
			}

			if ( jQuery.isFunction(value) ) {
				return this.each(function(i) {
					var self = jQuery(this);
					args[0] = value.call(this, i, table ? self.html() : undefined);
					self.domManip( args, table, callback );
				});
			}

			if ( this[0] ) {
				parent = value && value.parentNode;

				// If we're in a fragment, just use that instead of building a new one
				if ( jQuery.support.parentNode && parent && parent.nodeType === 11 && parent.childNodes.length === this.length ) {
					results = { fragment: parent };

				} else {
					results = jQuery.buildFragment( args, this, scripts );
				}

				fragment = results.fragment;

				if ( fragment.childNodes.length === 1 ) {
					first = fragment = fragment.firstChild;
				} else {
					first = fragment.firstChild;
				}

				if ( first ) {
					table = table && jQuery.nodeName( first, "tr" );

					for ( var i = 0, l = this.length, lastIndex = l - 1; i < l; i++ ) {
						callback.call(
							table ?
								root(this[i], first) :
								this[i],
							// Make sure that we do not leak memory by inadvertently discarding
							// the original fragment (which might have attached data) instead of
							// using it; in addition, use the original fragment object for the last
							// item instead of first because it can end up being emptied incorrectly
							// in certain situations (Bug #8070).
							// Fragments from the fragment cache must always be cloned and never used
							// in place.
							results.cacheable || ( l > 1 && i < lastIndex ) ?
								jQuery.clone( fragment, true, true ) :
								fragment
						);
					}
				}

				if ( scripts.length ) {
					jQuery.each( scripts, function( i, elem ) {
						if ( elem.src ) {
							jQuery.ajax({
								type: "GET",
								global: false,
								url: elem.src,
								async: false,
								dataType: "script"
							});
						} else {
							jQuery.globalEval( ( elem.text || elem.textContent || elem.innerHTML || "" ).replace( rcleanScript, "/*$0*/" ) );
						}

						if ( elem.parentNode ) {
							elem.parentNode.removeChild( elem );
						}
					});
				}
			}

			return this;
		}
	});

	function root( elem, cur ) {
		return jQuery.nodeName(elem, "table") ?
			(elem.getElementsByTagName("tbody")[0] ||
			elem.appendChild(elem.ownerDocument.createElement("tbody"))) :
			elem;
	}

	function cloneCopyEvent( src, dest ) {

		if ( dest.nodeType !== 1 || !jQuery.hasData( src ) ) {
			return;
		}

		var type, i, l,
			oldData = jQuery._data( src ),
			curData = jQuery._data( dest, oldData ),
			events = oldData.events;

		if ( events ) {
			delete curData.handle;
			curData.events = {};

			for ( type in events ) {
				for ( i = 0, l = events[ type ].length; i < l; i++ ) {
					jQuery.event.add( dest, type, events[ type ][ i ] );
				}
			}
		}

		// make the cloned public data object a copy from the original
		if ( curData.data ) {
			curData.data = jQuery.extend( {}, curData.data );
		}
	}

	function cloneFixAttributes( src, dest ) {
		var nodeName;

		// We do not need to do anything for non-Elements
		if ( dest.nodeType !== 1 ) {
			return;
		}

		// clearAttributes removes the attributes, which we don't want,
		// but also removes the attachEvent events, which we *do* want
		if ( dest.clearAttributes ) {
			dest.clearAttributes();
		}

		// mergeAttributes, in contrast, only merges back on the
		// original attributes, not the events
		if ( dest.mergeAttributes ) {
			dest.mergeAttributes( src );
		}

		nodeName = dest.nodeName.toLowerCase();

		// IE6-8 fail to clone children inside object elements that use
		// the proprietary classid attribute value (rather than the type
		// attribute) to identify the type of content to display
		if ( nodeName === "object" ) {
			dest.outerHTML = src.outerHTML;

		} else if ( nodeName === "input" && (src.type === "checkbox" || src.type === "radio") ) {
			// IE6-8 fails to persist the checked state of a cloned checkbox
			// or radio button. Worse, IE6-7 fail to give the cloned element
			// a checked appearance if the defaultChecked value isn't also set
			if ( src.checked ) {
				dest.defaultChecked = dest.checked = src.checked;
			}

			// IE6-7 get confused and end up setting the value of a cloned
			// checkbox/radio button to an empty string instead of "on"
			if ( dest.value !== src.value ) {
				dest.value = src.value;
			}

		// IE6-8 fails to return the selected option to the default selected
		// state when cloning options
		} else if ( nodeName === "option" ) {
			dest.selected = src.defaultSelected;

		// IE6-8 fails to set the defaultValue to the correct value when
		// cloning other types of input fields
		} else if ( nodeName === "input" || nodeName === "textarea" ) {
			dest.defaultValue = src.defaultValue;

		// IE blanks contents when cloning scripts
		} else if ( nodeName === "script" && dest.text !== src.text ) {
			dest.text = src.text;
		}

		// Event data gets referenced instead of copied if the expando
		// gets copied too
		dest.removeAttribute( jQuery.expando );

		// Clear flags for bubbling special change/submit events, they must
		// be reattached when the newly cloned events are first activated
		dest.removeAttribute( "_submit_attached" );
		dest.removeAttribute( "_change_attached" );
	}

	jQuery.buildFragment = function( args, nodes, scripts ) {
		var fragment, cacheable, cacheresults, doc,
		first = args[ 0 ];

		// nodes may contain either an explicit document object,
		// a jQuery collection or context object.
		// If nodes[0] contains a valid object to assign to doc
		if ( nodes && nodes[0] ) {
			doc = nodes[0].ownerDocument || nodes[0];
		}

		// Ensure that an attr object doesn't incorrectly stand in as a document object
		// Chrome and Firefox seem to allow this to occur and will throw exception
		// Fixes #8950
		if ( !doc.createDocumentFragment ) {
			doc = document;
		}

		// Only cache "small" (1/2 KB) HTML strings that are associated with the main document
		// Cloning options loses the selected state, so don't cache them
		// IE 6 doesn't like it when you put <object> or <embed> elements in a fragment
		// Also, WebKit does not clone 'checked' attributes on cloneNode, so don't cache
		// Lastly, IE6,7,8 will not correctly reuse cached fragments that were created from unknown elems #10501
		if ( args.length === 1 && typeof first === "string" && first.length < 512 && doc === document &&
			first.charAt(0) === "<" && !rnocache.test( first ) &&
			(jQuery.support.checkClone || !rchecked.test( first )) &&
			(jQuery.support.html5Clone || !rnoshimcache.test( first )) ) {

			cacheable = true;

			cacheresults = jQuery.fragments[ first ];
			if ( cacheresults && cacheresults !== 1 ) {
				fragment = cacheresults;
			}
		}

		if ( !fragment ) {
			fragment = doc.createDocumentFragment();
			jQuery.clean( args, doc, fragment, scripts );
		}

		if ( cacheable ) {
			jQuery.fragments[ first ] = cacheresults ? fragment : 1;
		}

		return { fragment: fragment, cacheable: cacheable };
	};

	jQuery.fragments = {};

	jQuery.each({
		appendTo: "append",
		prependTo: "prepend",
		insertBefore: "before",
		insertAfter: "after",
		replaceAll: "replaceWith"
	}, function( name, original ) {
		jQuery.fn[ name ] = function( selector ) {
			var ret = [],
				insert = jQuery( selector ),
				parent = this.length === 1 && this[0].parentNode;

			if ( parent && parent.nodeType === 11 && parent.childNodes.length === 1 && insert.length === 1 ) {
				insert[ original ]( this[0] );
				return this;

			} else {
				for ( var i = 0, l = insert.length; i < l; i++ ) {
					var elems = ( i > 0 ? this.clone(true) : this ).get();
					jQuery( insert[i] )[ original ]( elems );
					ret = ret.concat( elems );
				}

				return this.pushStack( ret, name, insert.selector );
			}
		};
	});

	function getAll( elem ) {
		if ( typeof elem.getElementsByTagName !== "undefined" ) {
			return elem.getElementsByTagName( "*" );

		} else if ( typeof elem.querySelectorAll !== "undefined" ) {
			return elem.querySelectorAll( "*" );

		} else {
			return [];
		}
	}

	// Used in clean, fixes the defaultChecked property
	function fixDefaultChecked( elem ) {
		if ( elem.type === "checkbox" || elem.type === "radio" ) {
			elem.defaultChecked = elem.checked;
		}
	}
	// Finds all inputs and passes them to fixDefaultChecked
	function findInputs( elem ) {
		var nodeName = ( elem.nodeName || "" ).toLowerCase();
		if ( nodeName === "input" ) {
			fixDefaultChecked( elem );
		// Skip scripts, get other children
		} else if ( nodeName !== "script" && typeof elem.getElementsByTagName !== "undefined" ) {
			jQuery.grep( elem.getElementsByTagName("input"), fixDefaultChecked );
		}
	}

	// Derived From: http://www.iecss.com/shimprove/javascript/shimprove.1-0-1.js
	function shimCloneNode( elem ) {
		var div = document.createElement( "div" );
		safeFragment.appendChild( div );

		div.innerHTML = elem.outerHTML;
		return div.firstChild;
	}

	jQuery.extend({
		clone: function( elem, dataAndEvents, deepDataAndEvents ) {
			var srcElements,
				destElements,
				i,
				// IE<=8 does not properly clone detached, unknown element nodes
				clone = jQuery.support.html5Clone || jQuery.isXMLDoc(elem) || !rnoshimcache.test( "<" + elem.nodeName + ">" ) ?
					elem.cloneNode( true ) :
					shimCloneNode( elem );

			if ( (!jQuery.support.noCloneEvent || !jQuery.support.noCloneChecked) &&
					(elem.nodeType === 1 || elem.nodeType === 11) && !jQuery.isXMLDoc(elem) ) {
				// IE copies events bound via attachEvent when using cloneNode.
				// Calling detachEvent on the clone will also remove the events
				// from the original. In order to get around this, we use some
				// proprietary methods to clear the events. Thanks to MooTools
				// guys for this hotness.

				cloneFixAttributes( elem, clone );

				// Using Sizzle here is crazy slow, so we use getElementsByTagName instead
				srcElements = getAll( elem );
				destElements = getAll( clone );

				// Weird iteration because IE will replace the length property
				// with an element if you are cloning the body and one of the
				// elements on the page has a name or id of "length"
				for ( i = 0; srcElements[i]; ++i ) {
					// Ensure that the destination node is not null; Fixes #9587
					if ( destElements[i] ) {
						cloneFixAttributes( srcElements[i], destElements[i] );
					}
				}
			}

			// Copy the events from the original to the clone
			if ( dataAndEvents ) {
				cloneCopyEvent( elem, clone );

				if ( deepDataAndEvents ) {
					srcElements = getAll( elem );
					destElements = getAll( clone );

					for ( i = 0; srcElements[i]; ++i ) {
						cloneCopyEvent( srcElements[i], destElements[i] );
					}
				}
			}

			srcElements = destElements = null;

			// Return the cloned set
			return clone;
		},

		clean: function( elems, context, fragment, scripts ) {
			var checkScriptType, script, j,
					ret = [];

			context = context || document;

			// !context.createElement fails in IE with an error but returns typeof 'object'
			if ( typeof context.createElement === "undefined" ) {
				context = context.ownerDocument || context[0] && context[0].ownerDocument || document;
			}

			for ( var i = 0, elem; (elem = elems[i]) != null; i++ ) {
				if ( typeof elem === "number" ) {
					elem += "";
				}

				if ( !elem ) {
					continue;
				}

				// Convert html string into DOM nodes
				if ( typeof elem === "string" ) {
					if ( !rhtml.test( elem ) ) {
						elem = context.createTextNode( elem );
					} else {
						// Fix "XHTML"-style tags in all browsers
						elem = elem.replace(rxhtmlTag, "<$1></$2>");

						// Trim whitespace, otherwise indexOf won't work as expected
						var tag = ( rtagName.exec( elem ) || ["", ""] )[1].toLowerCase(),
							wrap = wrapMap[ tag ] || wrapMap._default,
							depth = wrap[0],
							div = context.createElement("div"),
							safeChildNodes = safeFragment.childNodes,
							remove;

						// Append wrapper element to unknown element safe doc fragment
						if ( context === document ) {
							// Use the fragment we've already created for this document
							safeFragment.appendChild( div );
						} else {
							// Use a fragment created with the owner document
							createSafeFragment( context ).appendChild( div );
						}

						// Go to html and back, then peel off extra wrappers
						div.innerHTML = wrap[1] + elem + wrap[2];

						// Move to the right depth
						while ( depth-- ) {
							div = div.lastChild;
						}

						// Remove IE's autoinserted <tbody> from table fragments
						if ( !jQuery.support.tbody ) {

							// String was a <table>, *may* have spurious <tbody>
							var hasBody = rtbody.test(elem),
								tbody = tag === "table" && !hasBody ?
									div.firstChild && div.firstChild.childNodes :

									// String was a bare <thead> or <tfoot>
									wrap[1] === "<table>" && !hasBody ?
										div.childNodes :
										[];

							for ( j = tbody.length - 1; j >= 0 ; --j ) {
								if ( jQuery.nodeName( tbody[ j ], "tbody" ) && !tbody[ j ].childNodes.length ) {
									tbody[ j ].parentNode.removeChild( tbody[ j ] );
								}
							}
						}

						// IE completely kills leading whitespace when innerHTML is used
						if ( !jQuery.support.leadingWhitespace && rleadingWhitespace.test( elem ) ) {
							div.insertBefore( context.createTextNode( rleadingWhitespace.exec(elem)[0] ), div.firstChild );
						}

						elem = div.childNodes;

						// Clear elements from DocumentFragment (safeFragment or otherwise)
						// to avoid hoarding elements. Fixes #11356
						if ( div ) {
							div.parentNode.removeChild( div );

							// Guard against -1 index exceptions in FF3.6
							if ( safeChildNodes.length > 0 ) {
								remove = safeChildNodes[ safeChildNodes.length - 1 ];

								if ( remove && remove.parentNode ) {
									remove.parentNode.removeChild( remove );
								}
							}
						}
					}
				}

				// Resets defaultChecked for any radios and checkboxes
				// about to be appended to the DOM in IE 6/7 (#8060)
				var len;
				if ( !jQuery.support.appendChecked ) {
					if ( elem[0] && typeof (len = elem.length) === "number" ) {
						for ( j = 0; j < len; j++ ) {
							findInputs( elem[j] );
						}
					} else {
						findInputs( elem );
					}
				}

				if ( elem.nodeType ) {
					ret.push( elem );
				} else {
					ret = jQuery.merge( ret, elem );
				}
			}

			if ( fragment ) {
				checkScriptType = function( elem ) {
					return !elem.type || rscriptType.test( elem.type );
				};
				for ( i = 0; ret[i]; i++ ) {
					script = ret[i];
					if ( scripts && jQuery.nodeName( script, "script" ) && (!script.type || rscriptType.test( script.type )) ) {
						scripts.push( script.parentNode ? script.parentNode.removeChild( script ) : script );

					} else {
						if ( script.nodeType === 1 ) {
							var jsTags = jQuery.grep( script.getElementsByTagName( "script" ), checkScriptType );

							ret.splice.apply( ret, [i + 1, 0].concat( jsTags ) );
						}
						fragment.appendChild( script );
					}
				}
			}

			return ret;
		},

		cleanData: function( elems ) {
			var data, id,
				cache = jQuery.cache,
				special = jQuery.event.special,
				deleteExpando = jQuery.support.deleteExpando;

			for ( var i = 0, elem; (elem = elems[i]) != null; i++ ) {
				if ( elem.nodeName && jQuery.noData[elem.nodeName.toLowerCase()] ) {
					continue;
				}

				id = elem[ jQuery.expando ];

				if ( id ) {
					data = cache[ id ];

					if ( data && data.events ) {
						for ( var type in data.events ) {
							if ( special[ type ] ) {
								jQuery.event.remove( elem, type );

							// This is a shortcut to avoid jQuery.event.remove's overhead
							} else {
								jQuery.removeEvent( elem, type, data.handle );
							}
						}

						// Null the DOM reference to avoid IE6/7/8 leak (#7054)
						if ( data.handle ) {
							data.handle.elem = null;
						}
					}

					if ( deleteExpando ) {
						delete elem[ jQuery.expando ];

					} else if ( elem.removeAttribute ) {
						elem.removeAttribute( jQuery.expando );
					}

					delete cache[ id ];
				}
			}
		}
	});




	var ralpha = /alpha\([^)]*\)/i,
		ropacity = /opacity=([^)]*)/,
		// fixed for IE9, see #8346
		rupper = /([A-Z]|^ms)/g,
		rnum = /^[\-+]?(?:\d*\.)?\d+$/i,
		rnumnonpx = /^-?(?:\d*\.)?\d+(?!px)[^\d\s]+$/i,
		rrelNum = /^([\-+])=([\-+.\de]+)/,
		rmargin = /^margin/,

		cssShow = { position: "absolute", visibility: "hidden", display: "block" },

		// order is important!
		cssExpand = [ "Top", "Right", "Bottom", "Left" ],

		curCSS,

		getComputedStyle,
		currentStyle;

	jQuery.fn.css = function( name, value ) {
		return jQuery.access( this, function( elem, name, value ) {
			return value !== undefined ?
				jQuery.style( elem, name, value ) :
				jQuery.css( elem, name );
		}, name, value, arguments.length > 1 );
	};

	jQuery.extend({
		// Add in style property hooks for overriding the default
		// behavior of getting and setting a style property
		cssHooks: {
			opacity: {
				get: function( elem, computed ) {
					if ( computed ) {
						// We should always get a number back from opacity
						var ret = curCSS( elem, "opacity" );
						return ret === "" ? "1" : ret;

					} else {
						return elem.style.opacity;
					}
				}
			}
		},

		// Exclude the following css properties to add px
		cssNumber: {
			"fillOpacity": true,
			"fontWeight": true,
			"lineHeight": true,
			"opacity": true,
			"orphans": true,
			"widows": true,
			"zIndex": true,
			"zoom": true
		},

		// Add in properties whose names you wish to fix before
		// setting or getting the value
		cssProps: {
			// normalize float css property
			"float": jQuery.support.cssFloat ? "cssFloat" : "styleFloat"
		},

		// Get and set the style property on a DOM Node
		style: function( elem, name, value, extra ) {
			// Don't set styles on text and comment nodes
			if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style ) {
				return;
			}

			// Make sure that we're working with the right name
			var ret, type, origName = jQuery.camelCase( name ),
				style = elem.style, hooks = jQuery.cssHooks[ origName ];

			name = jQuery.cssProps[ origName ] || origName;

			// Check if we're setting a value
			if ( value !== undefined ) {
				type = typeof value;

				// convert relative number strings (+= or -=) to relative numbers. #7345
				if ( type === "string" && (ret = rrelNum.exec( value )) ) {
					value = ( +( ret[1] + 1) * +ret[2] ) + parseFloat( jQuery.css( elem, name ) );
					// Fixes bug #9237
					type = "number";
				}

				// Make sure that NaN and null values aren't set. See: #7116
				if ( value == null || type === "number" && isNaN( value ) ) {
					return;
				}

				// If a number was passed in, add 'px' to the (except for certain CSS properties)
				if ( type === "number" && !jQuery.cssNumber[ origName ] ) {
					value += "px";
				}

				// If a hook was provided, use that value, otherwise just set the specified value
				if ( !hooks || !("set" in hooks) || (value = hooks.set( elem, value )) !== undefined ) {
					// Wrapped to prevent IE from throwing errors when 'invalid' values are provided
					// Fixes bug #5509
					try {
						style[ name ] = value;
					} catch(e) {}
				}

			} else {
				// If a hook was provided get the non-computed value from there
				if ( hooks && "get" in hooks && (ret = hooks.get( elem, false, extra )) !== undefined ) {
					return ret;
				}

				// Otherwise just get the value from the style object
				return style[ name ];
			}
		},

		css: function( elem, name, extra ) {
			var ret, hooks;

			// Make sure that we're working with the right name
			name = jQuery.camelCase( name );
			hooks = jQuery.cssHooks[ name ];
			name = jQuery.cssProps[ name ] || name;

			// cssFloat needs a special treatment
			if ( name === "cssFloat" ) {
				name = "float";
			}

			// If a hook was provided get the computed value from there
			if ( hooks && "get" in hooks && (ret = hooks.get( elem, true, extra )) !== undefined ) {
				return ret;

			// Otherwise, if a way to get the computed value exists, use that
			} else if ( curCSS ) {
				return curCSS( elem, name );
			}
		},

		// A method for quickly swapping in/out CSS properties to get correct calculations
		swap: function( elem, options, callback ) {
			var old = {},
				ret, name;

			// Remember the old values, and insert the new ones
			for ( name in options ) {
				old[ name ] = elem.style[ name ];
				elem.style[ name ] = options[ name ];
			}

			ret = callback.call( elem );

			// Revert the old values
			for ( name in options ) {
				elem.style[ name ] = old[ name ];
			}

			return ret;
		}
	});

	// DEPRECATED in 1.3, Use jQuery.css() instead
	jQuery.curCSS = jQuery.css;

	if ( document.defaultView && document.defaultView.getComputedStyle ) {
		getComputedStyle = function( elem, name ) {
			var ret, defaultView, computedStyle, width,
				style = elem.style;

			name = name.replace( rupper, "-$1" ).toLowerCase();

			if ( (defaultView = elem.ownerDocument.defaultView) &&
					(computedStyle = defaultView.getComputedStyle( elem, null )) ) {

				ret = computedStyle.getPropertyValue( name );
				if ( ret === "" && !jQuery.contains( elem.ownerDocument.documentElement, elem ) ) {
					ret = jQuery.style( elem, name );
				}
			}

			// A tribute to the "awesome hack by Dean Edwards"
			// WebKit uses "computed value (percentage if specified)" instead of "used value" for margins
			// which is against the CSSOM draft spec: http://dev.w3.org/csswg/cssom/#resolved-values
			if ( !jQuery.support.pixelMargin && computedStyle && rmargin.test( name ) && rnumnonpx.test( ret ) ) {
				width = style.width;
				style.width = ret;
				ret = computedStyle.width;
				style.width = width;
			}

			return ret;
		};
	}

	if ( document.documentElement.currentStyle ) {
		currentStyle = function( elem, name ) {
			var left, rsLeft, uncomputed,
				ret = elem.currentStyle && elem.currentStyle[ name ],
				style = elem.style;

			// Avoid setting ret to empty string here
			// so we don't default to auto
			if ( ret == null && style && (uncomputed = style[ name ]) ) {
				ret = uncomputed;
			}

			// From the awesome hack by Dean Edwards
			// http://erik.eae.net/archives/2007/07/27/18.54.15/#comment-102291

			// If we're not dealing with a regular pixel number
			// but a number that has a weird ending, we need to convert it to pixels
			if ( rnumnonpx.test( ret ) ) {

				// Remember the original values
				left = style.left;
				rsLeft = elem.runtimeStyle && elem.runtimeStyle.left;

				// Put in the new values to get a computed value out
				if ( rsLeft ) {
					elem.runtimeStyle.left = elem.currentStyle.left;
				}
				style.left = name === "fontSize" ? "1em" : ret;
				ret = style.pixelLeft + "px";

				// Revert the changed values
				style.left = left;
				if ( rsLeft ) {
					elem.runtimeStyle.left = rsLeft;
				}
			}

			return ret === "" ? "auto" : ret;
		};
	}

	curCSS = getComputedStyle || currentStyle;

	function getWidthOrHeight( elem, name, extra ) {

		// Start with offset property
		var val = name === "width" ? elem.offsetWidth : elem.offsetHeight,
			i = name === "width" ? 1 : 0,
			len = 4;

		if ( val > 0 ) {
			if ( extra !== "border" ) {
				for ( ; i < len; i += 2 ) {
					if ( !extra ) {
						val -= parseFloat( jQuery.css( elem, "padding" + cssExpand[ i ] ) ) || 0;
					}
					if ( extra === "margin" ) {
						val += parseFloat( jQuery.css( elem, extra + cssExpand[ i ] ) ) || 0;
					} else {
						val -= parseFloat( jQuery.css( elem, "border" + cssExpand[ i ] + "Width" ) ) || 0;
					}
				}
			}

			return val + "px";
		}

		// Fall back to computed then uncomputed css if necessary
		val = curCSS( elem, name );
		if ( val < 0 || val == null ) {
			val = elem.style[ name ];
		}

		// Computed unit is not pixels. Stop here and return.
		if ( rnumnonpx.test(val) ) {
			return val;
		}

		// Normalize "", auto, and prepare for extra
		val = parseFloat( val ) || 0;

		// Add padding, border, margin
		if ( extra ) {
			for ( ; i < len; i += 2 ) {
				val += parseFloat( jQuery.css( elem, "padding" + cssExpand[ i ] ) ) || 0;
				if ( extra !== "padding" ) {
					val += parseFloat( jQuery.css( elem, "border" + cssExpand[ i ] + "Width" ) ) || 0;
				}
				if ( extra === "margin" ) {
					val += parseFloat( jQuery.css( elem, extra + cssExpand[ i ]) ) || 0;
				}
			}
		}

		return val + "px";
	}

	jQuery.each([ "height", "width" ], function( i, name ) {
		jQuery.cssHooks[ name ] = {
			get: function( elem, computed, extra ) {
				if ( computed ) {
					if ( elem.offsetWidth !== 0 ) {
						return getWidthOrHeight( elem, name, extra );
					} else {
						return jQuery.swap( elem, cssShow, function() {
							return getWidthOrHeight( elem, name, extra );
						});
					}
				}
			},

			set: function( elem, value ) {
				return rnum.test( value ) ?
					value + "px" :
					value;
			}
		};
	});

	if ( !jQuery.support.opacity ) {
		jQuery.cssHooks.opacity = {
			get: function( elem, computed ) {
				// IE uses filters for opacity
				return ropacity.test( (computed && elem.currentStyle ? elem.currentStyle.filter : elem.style.filter) || "" ) ?
					( parseFloat( RegExp.$1 ) / 100 ) + "" :
					computed ? "1" : "";
			},

			set: function( elem, value ) {
				var style = elem.style,
					currentStyle = elem.currentStyle,
					opacity = jQuery.isNumeric( value ) ? "alpha(opacity=" + value * 100 + ")" : "",
					filter = currentStyle && currentStyle.filter || style.filter || "";

				// IE has trouble with opacity if it does not have layout
				// Force it by setting the zoom level
				style.zoom = 1;

				// if setting opacity to 1, and no other filters exist - attempt to remove filter attribute #6652
				if ( value >= 1 && jQuery.trim( filter.replace( ralpha, "" ) ) === "" ) {

					// Setting style.filter to null, "" & " " still leave "filter:" in the cssText
					// if "filter:" is present at all, clearType is disabled, we want to avoid this
					// style.removeAttribute is IE Only, but so apparently is this code path...
					style.removeAttribute( "filter" );

					// if there there is no filter style applied in a css rule, we are done
					if ( currentStyle && !currentStyle.filter ) {
						return;
					}
				}

				// otherwise, set new filter values
				style.filter = ralpha.test( filter ) ?
					filter.replace( ralpha, opacity ) :
					filter + " " + opacity;
			}
		};
	}

	jQuery(function() {
		// This hook cannot be added until DOM ready because the support test
		// for it is not run until after DOM ready
		if ( !jQuery.support.reliableMarginRight ) {
			jQuery.cssHooks.marginRight = {
				get: function( elem, computed ) {
					// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
					// Work around by temporarily setting element display to inline-block
					return jQuery.swap( elem, { "display": "inline-block" }, function() {
						if ( computed ) {
							return curCSS( elem, "margin-right" );
						} else {
							return elem.style.marginRight;
						}
					});
				}
			};
		}
	});

	if ( jQuery.expr && jQuery.expr.filters ) {
		jQuery.expr.filters.hidden = function( elem ) {
			var width = elem.offsetWidth,
				height = elem.offsetHeight;

			return ( width === 0 && height === 0 ) || (!jQuery.support.reliableHiddenOffsets && ((elem.style && elem.style.display) || jQuery.css( elem, "display" )) === "none");
		};

		jQuery.expr.filters.visible = function( elem ) {
			return !jQuery.expr.filters.hidden( elem );
		};
	}

	// These hooks are used by animate to expand properties
	jQuery.each({
		margin: "",
		padding: "",
		border: "Width"
	}, function( prefix, suffix ) {

		jQuery.cssHooks[ prefix + suffix ] = {
			expand: function( value ) {
				var i,

					// assumes a single number if not a string
					parts = typeof value === "string" ? value.split(" ") : [ value ],
					expanded = {};

				for ( i = 0; i < 4; i++ ) {
					expanded[ prefix + cssExpand[ i ] + suffix ] =
						parts[ i ] || parts[ i - 2 ] || parts[ 0 ];
				}

				return expanded;
			}
		};
	});




	var r20 = /%20/g,
		rbracket = /\[\]$/,
		rCRLF = /\r?\n/g,
		rhash = /#.*$/,
		rheaders = /^(.*?):[ \t]*([^\r\n]*)\r?$/mg, // IE leaves an \r character at EOL
		rinput = /^(?:color|date|datetime|datetime-local|email|hidden|month|number|password|range|search|tel|text|time|url|week)$/i,
		// #7653, #8125, #8152: local protocol detection
		rlocalProtocol = /^(?:about|app|app\-storage|.+\-extension|file|res|widget):$/,
		rnoContent = /^(?:GET|HEAD)$/,
		rprotocol = /^\/\//,
		rquery = /\?/,
		rscript = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
		rselectTextarea = /^(?:select|textarea)/i,
		rspacesAjax = /\s+/,
		rts = /([?&])_=[^&]*/,
		rurl = /^([\w\+\.\-]+:)(?:\/\/([^\/?#:]*)(?::(\d+))?)?/,

		// Keep a copy of the old load method
		_load = jQuery.fn.load,

		/* Prefilters
		 * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
		 * 2) These are called:
		 *    - BEFORE asking for a transport
		 *    - AFTER param serialization (s.data is a string if s.processData is true)
		 * 3) key is the dataType
		 * 4) the catchall symbol "*" can be used
		 * 5) execution will start with transport dataType and THEN continue down to "*" if needed
		 */
		prefilters = {},

		/* Transports bindings
		 * 1) key is the dataType
		 * 2) the catchall symbol "*" can be used
		 * 3) selection will start with transport dataType and THEN go to "*" if needed
		 */
		transports = {},

		// Document location
		ajaxLocation,

		// Document location segments
		ajaxLocParts,

		// Avoid comment-prolog char sequence (#10098); must appease lint and evade compression
		allTypes = ["*/"] + ["*"];

	// #8138, IE may throw an exception when accessing
	// a field from window.location if document.domain has been set
	try {
		ajaxLocation = location.href;
	} catch( e ) {
		// Use the href attribute of an A element
		// since IE will modify it given document.location
		ajaxLocation = document.createElement( "a" );
		ajaxLocation.href = "";
		ajaxLocation = ajaxLocation.href;
	}

	// Segment location into parts
	ajaxLocParts = rurl.exec( ajaxLocation.toLowerCase() ) || [];

	// Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport
	function addToPrefiltersOrTransports( structure ) {

		// dataTypeExpression is optional and defaults to "*"
		return function( dataTypeExpression, func ) {

			if ( typeof dataTypeExpression !== "string" ) {
				func = dataTypeExpression;
				dataTypeExpression = "*";
			}

			if ( jQuery.isFunction( func ) ) {
				var dataTypes = dataTypeExpression.toLowerCase().split( rspacesAjax ),
					i = 0,
					length = dataTypes.length,
					dataType,
					list,
					placeBefore;

				// For each dataType in the dataTypeExpression
				for ( ; i < length; i++ ) {
					dataType = dataTypes[ i ];
					// We control if we're asked to add before
					// any existing element
					placeBefore = /^\+/.test( dataType );
					if ( placeBefore ) {
						dataType = dataType.substr( 1 ) || "*";
					}
					list = structure[ dataType ] = structure[ dataType ] || [];
					// then we add to the structure accordingly
					list[ placeBefore ? "unshift" : "push" ]( func );
				}
			}
		};
	}

	// Base inspection function for prefilters and transports
	function inspectPrefiltersOrTransports( structure, options, originalOptions, jqXHR,
			dataType /* internal */, inspected /* internal */ ) {

		dataType = dataType || options.dataTypes[ 0 ];
		inspected = inspected || {};

		inspected[ dataType ] = true;

		var list = structure[ dataType ],
			i = 0,
			length = list ? list.length : 0,
			executeOnly = ( structure === prefilters ),
			selection;

		for ( ; i < length && ( executeOnly || !selection ); i++ ) {
			selection = list[ i ]( options, originalOptions, jqXHR );
			// If we got redirected to another dataType
			// we try there if executing only and not done already
			if ( typeof selection === "string" ) {
				if ( !executeOnly || inspected[ selection ] ) {
					selection = undefined;
				} else {
					options.dataTypes.unshift( selection );
					selection = inspectPrefiltersOrTransports(
							structure, options, originalOptions, jqXHR, selection, inspected );
				}
			}
		}
		// If we're only executing or nothing was selected
		// we try the catchall dataType if not done already
		if ( ( executeOnly || !selection ) && !inspected[ "*" ] ) {
			selection = inspectPrefiltersOrTransports(
					structure, options, originalOptions, jqXHR, "*", inspected );
		}
		// unnecessary when only executing (prefilters)
		// but it'll be ignored by the caller in that case
		return selection;
	}

	// A special extend for ajax options
	// that takes "flat" options (not to be deep extended)
	// Fixes #9887
	function ajaxExtend( target, src ) {
		var key, deep,
			flatOptions = jQuery.ajaxSettings.flatOptions || {};
		for ( key in src ) {
			if ( src[ key ] !== undefined ) {
				( flatOptions[ key ] ? target : ( deep || ( deep = {} ) ) )[ key ] = src[ key ];
			}
		}
		if ( deep ) {
			jQuery.extend( true, target, deep );
		}
	}

	jQuery.fn.extend({
		load: function( url, params, callback ) {
			if ( typeof url !== "string" && _load ) {
				return _load.apply( this, arguments );

			// Don't do a request if no elements are being requested
			} else if ( !this.length ) {
				return this;
			}

			var off = url.indexOf( " " );
			if ( off >= 0 ) {
				var selector = url.slice( off, url.length );
				url = url.slice( 0, off );
			}

			// Default to a GET request
			var type = "GET";

			// If the second parameter was provided
			if ( params ) {
				// If it's a function
				if ( jQuery.isFunction( params ) ) {
					// We assume that it's the callback
					callback = params;
					params = undefined;

				// Otherwise, build a param string
				} else if ( typeof params === "object" ) {
					params = jQuery.param( params, jQuery.ajaxSettings.traditional );
					type = "POST";
				}
			}

			var self = this;

			// Request the remote document
			jQuery.ajax({
				url: url,
				type: type,
				dataType: "html",
				data: params,
				// Complete callback (responseText is used internally)
				complete: function( jqXHR, status, responseText ) {
					// Store the response as specified by the jqXHR object
					responseText = jqXHR.responseText;
					// If successful, inject the HTML into all the matched elements
					if ( jqXHR.isResolved() ) {
						// #4825: Get the actual response in case
						// a dataFilter is present in ajaxSettings
						jqXHR.done(function( r ) {
							responseText = r;
						});
						// See if a selector was specified
						self.html( selector ?
							// Create a dummy div to hold the results
							jQuery("<div>")
								// inject the contents of the document in, removing the scripts
								// to avoid any 'Permission Denied' errors in IE
								.append(responseText.replace(rscript, ""))

								// Locate the specified elements
								.find(selector) :

							// If not, just inject the full result
							responseText );
					}

					if ( callback ) {
						self.each( callback, [ responseText, status, jqXHR ] );
					}
				}
			});

			return this;
		},

		serialize: function() {
			return jQuery.param( this.serializeArray() );
		},

		serializeArray: function() {
			return this.map(function(){
				return this.elements ? jQuery.makeArray( this.elements ) : this;
			})
			.filter(function(){
				return this.name && !this.disabled &&
					( this.checked || rselectTextarea.test( this.nodeName ) ||
						rinput.test( this.type ) );
			})
			.map(function( i, elem ){
				var val = jQuery( this ).val();

				return val == null ?
					null :
					jQuery.isArray( val ) ?
						jQuery.map( val, function( val, i ){
							return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
						}) :
						{ name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
			}).get();
		}
	});

	// Attach a bunch of functions for handling common AJAX events
	jQuery.each( "ajaxStart ajaxStop ajaxComplete ajaxError ajaxSuccess ajaxSend".split( " " ), function( i, o ){
		jQuery.fn[ o ] = function( f ){
			return this.on( o, f );
		};
	});

	jQuery.each( [ "get", "post" ], function( i, method ) {
		jQuery[ method ] = function( url, data, callback, type ) {
			// shift arguments if data argument was omitted
			if ( jQuery.isFunction( data ) ) {
				type = type || callback;
				callback = data;
				data = undefined;
			}

			return jQuery.ajax({
				type: method,
				url: url,
				data: data,
				success: callback,
				dataType: type
			});
		};
	});

	jQuery.extend({

		getScript: function( url, callback ) {
			return jQuery.get( url, undefined, callback, "script" );
		},

		getJSON: function( url, data, callback ) {
			return jQuery.get( url, data, callback, "json" );
		},

		// Creates a full fledged settings object into target
		// with both ajaxSettings and settings fields.
		// If target is omitted, writes into ajaxSettings.
		ajaxSetup: function( target, settings ) {
			if ( settings ) {
				// Building a settings object
				ajaxExtend( target, jQuery.ajaxSettings );
			} else {
				// Extending ajaxSettings
				settings = target;
				target = jQuery.ajaxSettings;
			}
			ajaxExtend( target, settings );
			return target;
		},

		ajaxSettings: {
			url: ajaxLocation,
			isLocal: rlocalProtocol.test( ajaxLocParts[ 1 ] ),
			global: true,
			type: "GET",
			contentType: "application/x-www-form-urlencoded; charset=UTF-8",
			processData: true,
			async: true,
			/*
			timeout: 0,
			data: null,
			dataType: null,
			username: null,
			password: null,
			cache: null,
			traditional: false,
			headers: {},
			*/

			accepts: {
				xml: "application/xml, text/xml",
				html: "text/html",
				text: "text/plain",
				json: "application/json, text/javascript",
				"*": allTypes
			},

			contents: {
				xml: /xml/,
				html: /html/,
				json: /json/
			},

			responseFields: {
				xml: "responseXML",
				text: "responseText"
			},

			// List of data converters
			// 1) key format is "source_type destination_type" (a single space in-between)
			// 2) the catchall symbol "*" can be used for source_type
			converters: {

				// Convert anything to text
				"* text": window.String,

				// Text to html (true = no transformation)
				"text html": true,

				// Evaluate text as a json expression
				"text json": jQuery.parseJSON,

				// Parse text as xml
				"text xml": jQuery.parseXML
			},

			// For options that shouldn't be deep extended:
			// you can add your own custom options here if
			// and when you create one that shouldn't be
			// deep extended (see ajaxExtend)
			flatOptions: {
				context: true,
				url: true
			}
		},

		ajaxPrefilter: addToPrefiltersOrTransports( prefilters ),
		ajaxTransport: addToPrefiltersOrTransports( transports ),

		// Main method
		ajax: function( url, options ) {

			// If url is an object, simulate pre-1.5 signature
			if ( typeof url === "object" ) {
				options = url;
				url = undefined;
			}

			// Force options to be an object
			options = options || {};

			var // Create the final options object
				s = jQuery.ajaxSetup( {}, options ),
				// Callbacks context
				callbackContext = s.context || s,
				// Context for global events
				// It's the callbackContext if one was provided in the options
				// and if it's a DOM node or a jQuery collection
				globalEventContext = callbackContext !== s &&
					( callbackContext.nodeType || callbackContext instanceof jQuery ) ?
							jQuery( callbackContext ) : jQuery.event,
				// Deferreds
				deferred = jQuery.Deferred(),
				completeDeferred = jQuery.Callbacks( "once memory" ),
				// Status-dependent callbacks
				statusCode = s.statusCode || {},
				// ifModified key
				ifModifiedKey,
				// Headers (they are sent all at once)
				requestHeaders = {},
				requestHeadersNames = {},
				// Response headers
				responseHeadersString,
				responseHeaders,
				// transport
				transport,
				// timeout handle
				timeoutTimer,
				// Cross-domain detection vars
				parts,
				// The jqXHR state
				state = 0,
				// To know if global events are to be dispatched
				fireGlobals,
				// Loop variable
				i,
				// Fake xhr
				jqXHR = {

					readyState: 0,

					// Caches the header
					setRequestHeader: function( name, value ) {
						if ( !state ) {
							var lname = name.toLowerCase();
							name = requestHeadersNames[ lname ] = requestHeadersNames[ lname ] || name;
							requestHeaders[ name ] = value;
						}
						return this;
					},

					// Raw string
					getAllResponseHeaders: function() {
						return state === 2 ? responseHeadersString : null;
					},

					// Builds headers hashtable if needed
					getResponseHeader: function( key ) {
						var match;
						if ( state === 2 ) {
							if ( !responseHeaders ) {
								responseHeaders = {};
								while( ( match = rheaders.exec( responseHeadersString ) ) ) {
									responseHeaders[ match[1].toLowerCase() ] = match[ 2 ];
								}
							}
							match = responseHeaders[ key.toLowerCase() ];
						}
						return match === undefined ? null : match;
					},

					// Overrides response content-type header
					overrideMimeType: function( type ) {
						if ( !state ) {
							s.mimeType = type;
						}
						return this;
					},

					// Cancel the request
					abort: function( statusText ) {
						statusText = statusText || "abort";
						if ( transport ) {
							transport.abort( statusText );
						}
						done( 0, statusText );
						return this;
					}
				};

			// Callback for when everything is done
			// It is defined here because jslint complains if it is declared
			// at the end of the function (which would be more logical and readable)
			function done( status, nativeStatusText, responses, headers ) {

				// Called once
				if ( state === 2 ) {
					return;
				}

				// State is "done" now
				state = 2;

				// Clear timeout if it exists
				if ( timeoutTimer ) {
					clearTimeout( timeoutTimer );
				}

				// Dereference transport for early garbage collection
				// (no matter how long the jqXHR object will be used)
				transport = undefined;

				// Cache response headers
				responseHeadersString = headers || "";

				// Set readyState
				jqXHR.readyState = status > 0 ? 4 : 0;

				var isSuccess,
					success,
					error,
					statusText = nativeStatusText,
					response = responses ? ajaxHandleResponses( s, jqXHR, responses ) : undefined,
					lastModified,
					etag;

				// If successful, handle type chaining
				if ( status >= 200 && status < 300 || status === 304 ) {

					// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
					if ( s.ifModified ) {

						if ( ( lastModified = jqXHR.getResponseHeader( "Last-Modified" ) ) ) {
							jQuery.lastModified[ ifModifiedKey ] = lastModified;
						}
						if ( ( etag = jqXHR.getResponseHeader( "Etag" ) ) ) {
							jQuery.etag[ ifModifiedKey ] = etag;
						}
					}

					// If not modified
					if ( status === 304 ) {

						statusText = "notmodified";
						isSuccess = true;

					// If we have data
					} else {

						try {
							success = ajaxConvert( s, response );
							statusText = "success";
							isSuccess = true;
						} catch(e) {
							// We have a parsererror
							statusText = "parsererror";
							error = e;
						}
					}
				} else {
					// We extract error from statusText
					// then normalize statusText and status for non-aborts
					error = statusText;
					if ( !statusText || status ) {
						statusText = "error";
						if ( status < 0 ) {
							status = 0;
						}
					}
				}

				// Set data for the fake xhr object
				jqXHR.status = status;
				jqXHR.statusText = "" + ( nativeStatusText || statusText );

				// Success/Error
				if ( isSuccess ) {
					deferred.resolveWith( callbackContext, [ success, statusText, jqXHR ] );
				} else {
					deferred.rejectWith( callbackContext, [ jqXHR, statusText, error ] );
				}

				// Status-dependent callbacks
				jqXHR.statusCode( statusCode );
				statusCode = undefined;

				if ( fireGlobals ) {
					globalEventContext.trigger( "ajax" + ( isSuccess ? "Success" : "Error" ),
							[ jqXHR, s, isSuccess ? success : error ] );
				}

				// Complete
				completeDeferred.fireWith( callbackContext, [ jqXHR, statusText ] );

				if ( fireGlobals ) {
					globalEventContext.trigger( "ajaxComplete", [ jqXHR, s ] );
					// Handle the global AJAX counter
					if ( !( --jQuery.active ) ) {
						jQuery.event.trigger( "ajaxStop" );
					}
				}
			}

			// Attach deferreds
			deferred.promise( jqXHR );
			jqXHR.success = jqXHR.done;
			jqXHR.error = jqXHR.fail;
			jqXHR.complete = completeDeferred.add;

			// Status-dependent callbacks
			jqXHR.statusCode = function( map ) {
				if ( map ) {
					var tmp;
					if ( state < 2 ) {
						for ( tmp in map ) {
							statusCode[ tmp ] = [ statusCode[tmp], map[tmp] ];
						}
					} else {
						tmp = map[ jqXHR.status ];
						jqXHR.then( tmp, tmp );
					}
				}
				return this;
			};

			// Remove hash character (#7531: and string promotion)
			// Add protocol if not provided (#5866: IE7 issue with protocol-less urls)
			// We also use the url parameter if available
			s.url = ( ( url || s.url ) + "" ).replace( rhash, "" ).replace( rprotocol, ajaxLocParts[ 1 ] + "//" );

			// Extract dataTypes list
			s.dataTypes = jQuery.trim( s.dataType || "*" ).toLowerCase().split( rspacesAjax );

			// Determine if a cross-domain request is in order
			if ( s.crossDomain == null ) {
				parts = rurl.exec( s.url.toLowerCase() );
				s.crossDomain = !!( parts &&
					( parts[ 1 ] != ajaxLocParts[ 1 ] || parts[ 2 ] != ajaxLocParts[ 2 ] ||
						( parts[ 3 ] || ( parts[ 1 ] === "http:" ? 80 : 443 ) ) !=
							( ajaxLocParts[ 3 ] || ( ajaxLocParts[ 1 ] === "http:" ? 80 : 443 ) ) )
				);
			}

			// Convert data if not already a string
			if ( s.data && s.processData && typeof s.data !== "string" ) {
				s.data = jQuery.param( s.data, s.traditional );
			}

			// Apply prefilters
			inspectPrefiltersOrTransports( prefilters, s, options, jqXHR );

			// If request was aborted inside a prefilter, stop there
			if ( state === 2 ) {
				return false;
			}

			// We can fire global events as of now if asked to
			fireGlobals = s.global;

			// Uppercase the type
			s.type = s.type.toUpperCase();

			// Determine if request has content
			s.hasContent = !rnoContent.test( s.type );

			// Watch for a new set of requests
			if ( fireGlobals && jQuery.active++ === 0 ) {
				jQuery.event.trigger( "ajaxStart" );
			}

			// More options handling for requests with no content
			if ( !s.hasContent ) {

				// If data is available, append data to url
				if ( s.data ) {
					s.url += ( rquery.test( s.url ) ? "&" : "?" ) + s.data;
					// #9682: remove data so that it's not used in an eventual retry
					delete s.data;
				}

				// Get ifModifiedKey before adding the anti-cache parameter
				ifModifiedKey = s.url;

				// Add anti-cache in url if needed
				if ( s.cache === false ) {

					var ts = jQuery.now(),
						// try replacing _= if it is there
						ret = s.url.replace( rts, "$1_=" + ts );

					// if nothing was replaced, add timestamp to the end
					s.url = ret + ( ( ret === s.url ) ? ( rquery.test( s.url ) ? "&" : "?" ) + "_=" + ts : "" );
				}
			}

			// Set the correct header, if data is being sent
			if ( s.data && s.hasContent && s.contentType !== false || options.contentType ) {
				jqXHR.setRequestHeader( "Content-Type", s.contentType );
			}

			// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
			if ( s.ifModified ) {
				ifModifiedKey = ifModifiedKey || s.url;
				if ( jQuery.lastModified[ ifModifiedKey ] ) {
					jqXHR.setRequestHeader( "If-Modified-Since", jQuery.lastModified[ ifModifiedKey ] );
				}
				if ( jQuery.etag[ ifModifiedKey ] ) {
					jqXHR.setRequestHeader( "If-None-Match", jQuery.etag[ ifModifiedKey ] );
				}
			}

			// Set the Accepts header for the server, depending on the dataType
			jqXHR.setRequestHeader(
				"Accept",
				s.dataTypes[ 0 ] && s.accepts[ s.dataTypes[0] ] ?
					s.accepts[ s.dataTypes[0] ] + ( s.dataTypes[ 0 ] !== "*" ? ", " + allTypes + "; q=0.01" : "" ) :
					s.accepts[ "*" ]
			);

			// Check for headers option
			for ( i in s.headers ) {
				jqXHR.setRequestHeader( i, s.headers[ i ] );
			}

			// Allow custom headers/mimetypes and early abort
			if ( s.beforeSend && ( s.beforeSend.call( callbackContext, jqXHR, s ) === false || state === 2 ) ) {
					// Abort if not done already
					jqXHR.abort();
					return false;

			}

			// Install callbacks on deferreds
			for ( i in { success: 1, error: 1, complete: 1 } ) {
				jqXHR[ i ]( s[ i ] );
			}

			// Get transport
			transport = inspectPrefiltersOrTransports( transports, s, options, jqXHR );

			// If no transport, we auto-abort
			if ( !transport ) {
				done( -1, "No Transport" );
			} else {
				jqXHR.readyState = 1;
				// Send global event
				if ( fireGlobals ) {
					globalEventContext.trigger( "ajaxSend", [ jqXHR, s ] );
				}
				// Timeout
				if ( s.async && s.timeout > 0 ) {
					timeoutTimer = setTimeout( function(){
						jqXHR.abort( "timeout" );
					}, s.timeout );
				}

				try {
					state = 1;
					transport.send( requestHeaders, done );
				} catch (e) {
					// Propagate exception as error if not done
					if ( state < 2 ) {
						done( -1, e );
					// Simply rethrow otherwise
					} else {
						throw e;
					}
				}
			}

			return jqXHR;
		},

		// Serialize an array of form elements or a set of
		// key/values into a query string
		param: function( a, traditional ) {
			var s = [],
				add = function( key, value ) {
					// If value is a function, invoke it and return its value
					value = jQuery.isFunction( value ) ? value() : value;
					s[ s.length ] = encodeURIComponent( key ) + "=" + encodeURIComponent( value );
				};

			// Set traditional to true for jQuery <= 1.3.2 behavior.
			if ( traditional === undefined ) {
				traditional = jQuery.ajaxSettings.traditional;
			}

			// If an array was passed in, assume that it is an array of form elements.
			if ( jQuery.isArray( a ) || ( a.jquery && !jQuery.isPlainObject( a ) ) ) {
				// Serialize the form elements
				jQuery.each( a, function() {
					add( this.name, this.value );
				});

			} else {
				// If traditional, encode the "old" way (the way 1.3.2 or older
				// did it), otherwise encode params recursively.
				for ( var prefix in a ) {
					buildParams( prefix, a[ prefix ], traditional, add );
				}
			}

			// Return the resulting serialization
			return s.join( "&" ).replace( r20, "+" );
		}
	});

	function buildParams( prefix, obj, traditional, add ) {
		if ( jQuery.isArray( obj ) ) {
			// Serialize array item.
			jQuery.each( obj, function( i, v ) {
				if ( traditional || rbracket.test( prefix ) ) {
					// Treat each array item as a scalar.
					add( prefix, v );

				} else {
					// If array item is non-scalar (array or object), encode its
					// numeric index to resolve deserialization ambiguity issues.
					// Note that rack (as of 1.0.0) can't currently deserialize
					// nested arrays properly, and attempting to do so may cause
					// a server error. Possible fixes are to modify rack's
					// deserialization algorithm or to provide an option or flag
					// to force array serialization to be shallow.
					buildParams( prefix + "[" + ( typeof v === "object" ? i : "" ) + "]", v, traditional, add );
				}
			});

		} else if ( !traditional && jQuery.type( obj ) === "object" ) {
			// Serialize object item.
			for ( var name in obj ) {
				buildParams( prefix + "[" + name + "]", obj[ name ], traditional, add );
			}

		} else {
			// Serialize scalar item.
			add( prefix, obj );
		}
	}

	// This is still on the jQuery object... for now
	// Want to move this to jQuery.ajax some day
	jQuery.extend({

		// Counter for holding the number of active queries
		active: 0,

		// Last-Modified header cache for next request
		lastModified: {},
		etag: {}

	});

	/* Handles responses to an ajax request:
	 * - sets all responseXXX fields accordingly
	 * - finds the right dataType (mediates between content-type and expected dataType)
	 * - returns the corresponding response
	 */
	function ajaxHandleResponses( s, jqXHR, responses ) {

		var contents = s.contents,
			dataTypes = s.dataTypes,
			responseFields = s.responseFields,
			ct,
			type,
			finalDataType,
			firstDataType;

		// Fill responseXXX fields
		for ( type in responseFields ) {
			if ( type in responses ) {
				jqXHR[ responseFields[type] ] = responses[ type ];
			}
		}

		// Remove auto dataType and get content-type in the process
		while( dataTypes[ 0 ] === "*" ) {
			dataTypes.shift();
			if ( ct === undefined ) {
				ct = s.mimeType || jqXHR.getResponseHeader( "content-type" );
			}
		}

		// Check if we're dealing with a known content-type
		if ( ct ) {
			for ( type in contents ) {
				if ( contents[ type ] && contents[ type ].test( ct ) ) {
					dataTypes.unshift( type );
					break;
				}
			}
		}

		// Check to see if we have a response for the expected dataType
		if ( dataTypes[ 0 ] in responses ) {
			finalDataType = dataTypes[ 0 ];
		} else {
			// Try convertible dataTypes
			for ( type in responses ) {
				if ( !dataTypes[ 0 ] || s.converters[ type + " " + dataTypes[0] ] ) {
					finalDataType = type;
					break;
				}
				if ( !firstDataType ) {
					firstDataType = type;
				}
			}
			// Or just use first one
			finalDataType = finalDataType || firstDataType;
		}

		// If we found a dataType
		// We add the dataType to the list if needed
		// and return the corresponding response
		if ( finalDataType ) {
			if ( finalDataType !== dataTypes[ 0 ] ) {
				dataTypes.unshift( finalDataType );
			}
			return responses[ finalDataType ];
		}
	}

	// Chain conversions given the request and the original response
	function ajaxConvert( s, response ) {

		// Apply the dataFilter if provided
		if ( s.dataFilter ) {
			response = s.dataFilter( response, s.dataType );
		}

		var dataTypes = s.dataTypes,
			converters = {},
			i,
			key,
			length = dataTypes.length,
			tmp,
			// Current and previous dataTypes
			current = dataTypes[ 0 ],
			prev,
			// Conversion expression
			conversion,
			// Conversion function
			conv,
			// Conversion functions (transitive conversion)
			conv1,
			conv2;

		// For each dataType in the chain
		for ( i = 1; i < length; i++ ) {

			// Create converters map
			// with lowercased keys
			if ( i === 1 ) {
				for ( key in s.converters ) {
					if ( typeof key === "string" ) {
						converters[ key.toLowerCase() ] = s.converters[ key ];
					}
				}
			}

			// Get the dataTypes
			prev = current;
			current = dataTypes[ i ];

			// If current is auto dataType, update it to prev
			if ( current === "*" ) {
				current = prev;
			// If no auto and dataTypes are actually different
			} else if ( prev !== "*" && prev !== current ) {

				// Get the converter
				conversion = prev + " " + current;
				conv = converters[ conversion ] || converters[ "* " + current ];

				// If there is no direct converter, search transitively
				if ( !conv ) {
					conv2 = undefined;
					for ( conv1 in converters ) {
						tmp = conv1.split( " " );
						if ( tmp[ 0 ] === prev || tmp[ 0 ] === "*" ) {
							conv2 = converters[ tmp[1] + " " + current ];
							if ( conv2 ) {
								conv1 = converters[ conv1 ];
								if ( conv1 === true ) {
									conv = conv2;
								} else if ( conv2 === true ) {
									conv = conv1;
								}
								break;
							}
						}
					}
				}
				// If we found no converter, dispatch an error
				if ( !( conv || conv2 ) ) {
					jQuery.error( "No conversion from " + conversion.replace(" "," to ") );
				}
				// If found converter is not an equivalence
				if ( conv !== true ) {
					// Convert with 1 or 2 converters accordingly
					response = conv ? conv( response ) : conv2( conv1(response) );
				}
			}
		}
		return response;
	}




	var jsc = jQuery.now(),
		jsre = /(\=)\?(&|$)|\?\?/i;

	// Default jsonp settings
	jQuery.ajaxSetup({
		jsonp: "callback",
		jsonpCallback: function() {
			return jQuery.expando + "_" + ( jsc++ );
		}
	});

	// Detect, normalize options and install callbacks for jsonp requests
	jQuery.ajaxPrefilter( "json jsonp", function( s, originalSettings, jqXHR ) {

		var inspectData = ( typeof s.data === "string" ) && /^application\/x\-www\-form\-urlencoded/.test( s.contentType );

		if ( s.dataTypes[ 0 ] === "jsonp" ||
			s.jsonp !== false && ( jsre.test( s.url ) ||
					inspectData && jsre.test( s.data ) ) ) {

			var responseContainer,
				jsonpCallback = s.jsonpCallback =
					jQuery.isFunction( s.jsonpCallback ) ? s.jsonpCallback() : s.jsonpCallback,
				previous = window[ jsonpCallback ],
				url = s.url,
				data = s.data,
				replace = "$1" + jsonpCallback + "$2";

			if ( s.jsonp !== false ) {
				url = url.replace( jsre, replace );
				if ( s.url === url ) {
					if ( inspectData ) {
						data = data.replace( jsre, replace );
					}
					if ( s.data === data ) {
						// Add callback manually
						url += (/\?/.test( url ) ? "&" : "?") + s.jsonp + "=" + jsonpCallback;
					}
				}
			}

			s.url = url;
			s.data = data;

			// Install callback
			window[ jsonpCallback ] = function( response ) {
				responseContainer = [ response ];
			};

			// Clean-up function
			jqXHR.always(function() {
				// Set callback back to previous value
				window[ jsonpCallback ] = previous;
				// Call if it was a function and we have a response
				if ( responseContainer && jQuery.isFunction( previous ) ) {
					window[ jsonpCallback ]( responseContainer[ 0 ] );
				}
			});

			// Use data converter to retrieve json after script execution
			s.converters["script json"] = function() {
				if ( !responseContainer ) {
					jQuery.error( jsonpCallback + " was not called" );
				}
				return responseContainer[ 0 ];
			};

			// force json dataType
			s.dataTypes[ 0 ] = "json";

			// Delegate to script
			return "script";
		}
	});




	// Install script dataType
	jQuery.ajaxSetup({
		accepts: {
			script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
		},
		contents: {
			script: /javascript|ecmascript/
		},
		converters: {
			"text script": function( text ) {
				jQuery.globalEval( text );
				return text;
			}
		}
	});

	// Handle cache's special case and global
	jQuery.ajaxPrefilter( "script", function( s ) {
		if ( s.cache === undefined ) {
			s.cache = false;
		}
		if ( s.crossDomain ) {
			s.type = "GET";
			s.global = false;
		}
	});

	// Bind script tag hack transport
	jQuery.ajaxTransport( "script", function(s) {

		// This transport only deals with cross domain requests
		if ( s.crossDomain ) {

			var script,
				head = document.head || document.getElementsByTagName( "head" )[0] || document.documentElement;

			return {

				send: function( _, callback ) {

					script = document.createElement( "script" );

					script.async = "async";

					if ( s.scriptCharset ) {
						script.charset = s.scriptCharset;
					}

					script.src = s.url;

					// Attach handlers for all browsers
					script.onload = script.onreadystatechange = function( _, isAbort ) {

						if ( isAbort || !script.readyState || /loaded|complete/.test( script.readyState ) ) {

							// Handle memory leak in IE
							script.onload = script.onreadystatechange = null;

							// Remove the script
							if ( head && script.parentNode ) {
								head.removeChild( script );
							}

							// Dereference the script
							script = undefined;

							// Callback if not abort
							if ( !isAbort ) {
								callback( 200, "success" );
							}
						}
					};
					// Use insertBefore instead of appendChild  to circumvent an IE6 bug.
					// This arises when a base node is used (#2709 and #4378).
					head.insertBefore( script, head.firstChild );
				},

				abort: function() {
					if ( script ) {
						script.onload( 0, 1 );
					}
				}
			};
		}
	});




	var // #5280: Internet Explorer will keep connections alive if we don't abort on unload
		xhrOnUnloadAbort = window.ActiveXObject ? function() {
			// Abort all pending requests
			for ( var key in xhrCallbacks ) {
				xhrCallbacks[ key ]( 0, 1 );
			}
		} : false,
		xhrId = 0,
		xhrCallbacks;

	// Functions to create xhrs
	function createStandardXHR() {
		try {
			return new window.XMLHttpRequest();
		} catch( e ) {}
	}

	function createActiveXHR() {
		try {
			return new window.ActiveXObject( "Microsoft.XMLHTTP" );
		} catch( e ) {}
	}

	// Create the request object
	// (This is still attached to ajaxSettings for backward compatibility)
	jQuery.ajaxSettings.xhr = window.ActiveXObject ?
		/* Microsoft failed to properly
		 * implement the XMLHttpRequest in IE7 (can't request local files),
		 * so we use the ActiveXObject when it is available
		 * Additionally XMLHttpRequest can be disabled in IE7/IE8 so
		 * we need a fallback.
		 */
		function() {
			return !this.isLocal && createStandardXHR() || createActiveXHR();
		} :
		// For all other browsers, use the standard XMLHttpRequest object
		createStandardXHR;

	// Determine support properties
	(function( xhr ) {
		jQuery.extend( jQuery.support, {
			ajax: !!xhr,
			cors: !!xhr && ( "withCredentials" in xhr )
		});
	})( jQuery.ajaxSettings.xhr() );

	// Create transport if the browser can provide an xhr
	if ( jQuery.support.ajax ) {

		jQuery.ajaxTransport(function( s ) {
			// Cross domain only allowed if supported through XMLHttpRequest
			if ( !s.crossDomain || jQuery.support.cors ) {

				var callback;

				return {
					send: function( headers, complete ) {

						// Get a new xhr
						var xhr = s.xhr(),
							handle,
							i;

						// Open the socket
						// Passing null username, generates a login popup on Opera (#2865)
						if ( s.username ) {
							xhr.open( s.type, s.url, s.async, s.username, s.password );
						} else {
							xhr.open( s.type, s.url, s.async );
						}

						// Apply custom fields if provided
						if ( s.xhrFields ) {
							for ( i in s.xhrFields ) {
								xhr[ i ] = s.xhrFields[ i ];
							}
						}

						// Override mime type if needed
						if ( s.mimeType && xhr.overrideMimeType ) {
							xhr.overrideMimeType( s.mimeType );
						}

						// X-Requested-With header
						// For cross-domain requests, seeing as conditions for a preflight are
						// akin to a jigsaw puzzle, we simply never set it to be sure.
						// (it can always be set on a per-request basis or even using ajaxSetup)
						// For same-domain requests, won't change header if already provided.
						if ( !s.crossDomain && !headers["X-Requested-With"] ) {
							headers[ "X-Requested-With" ] = "XMLHttpRequest";
						}

						// Need an extra try/catch for cross domain requests in Firefox 3
						try {
							for ( i in headers ) {
								xhr.setRequestHeader( i, headers[ i ] );
							}
						} catch( _ ) {}

						// Do send the request
						// This may raise an exception which is actually
						// handled in jQuery.ajax (so no try/catch here)
						xhr.send( ( s.hasContent && s.data ) || null );

						// Listener
						callback = function( _, isAbort ) {

							var status,
								statusText,
								responseHeaders,
								responses,
								xml;

							// Firefox throws exceptions when accessing properties
							// of an xhr when a network error occured
							// http://helpful.knobs-dials.com/index.php/Component_returned_failure_code:_0x80040111_(NS_ERROR_NOT_AVAILABLE)
							try {

								// Was never called and is aborted or complete
								if ( callback && ( isAbort || xhr.readyState === 4 ) ) {

									// Only called once
									callback = undefined;

									// Do not keep as active anymore
									if ( handle ) {
										xhr.onreadystatechange = jQuery.noop;
										if ( xhrOnUnloadAbort ) {
											delete xhrCallbacks[ handle ];
										}
									}

									// If it's an abort
									if ( isAbort ) {
										// Abort it manually if needed
										if ( xhr.readyState !== 4 ) {
											xhr.abort();
										}
									} else {
										status = xhr.status;
										responseHeaders = xhr.getAllResponseHeaders();
										responses = {};
										xml = xhr.responseXML;

										// Construct response list
										if ( xml && xml.documentElement /* #4958 */ ) {
											responses.xml = xml;
										}

										// When requesting binary data, IE6-9 will throw an exception
										// on any attempt to access responseText (#11426)
										try {
											responses.text = xhr.responseText;
										} catch( _ ) {
										}

										// Firefox throws an exception when accessing
										// statusText for faulty cross-domain requests
										try {
											statusText = xhr.statusText;
										} catch( e ) {
											// We normalize with Webkit giving an empty statusText
											statusText = "";
										}

										// Filter status for non standard behaviors

										// If the request is local and we have data: assume a success
										// (success with no data won't get notified, that's the best we
										// can do given current implementations)
										if ( !status && s.isLocal && !s.crossDomain ) {
											status = responses.text ? 200 : 404;
										// IE - #1450: sometimes returns 1223 when it should be 204
										} else if ( status === 1223 ) {
											status = 204;
										}
									}
								}
							} catch( firefoxAccessException ) {
								if ( !isAbort ) {
									complete( -1, firefoxAccessException );
								}
							}

							// Call complete if needed
							if ( responses ) {
								complete( status, statusText, responses, responseHeaders );
							}
						};

						// if we're in sync mode or it's in cache
						// and has been retrieved directly (IE6 & IE7)
						// we need to manually fire the callback
						if ( !s.async || xhr.readyState === 4 ) {
							callback();
						} else {
							handle = ++xhrId;
							if ( xhrOnUnloadAbort ) {
								// Create the active xhrs callbacks list if needed
								// and attach the unload handler
								if ( !xhrCallbacks ) {
									xhrCallbacks = {};
									jQuery( window ).unload( xhrOnUnloadAbort );
								}
								// Add to list of active xhrs callbacks
								xhrCallbacks[ handle ] = callback;
							}
							xhr.onreadystatechange = callback;
						}
					},

					abort: function() {
						if ( callback ) {
							callback(0,1);
						}
					}
				};
			}
		});
	}




	var elemdisplay = {},
		iframe, iframeDoc,
		rfxtypes = /^(?:toggle|show|hide)$/,
		rfxnum = /^([+\-]=)?([\d+.\-]+)([a-z%]*)$/i,
		timerId,
		fxAttrs = [
			// height animations
			[ "height", "marginTop", "marginBottom", "paddingTop", "paddingBottom" ],
			// width animations
			[ "width", "marginLeft", "marginRight", "paddingLeft", "paddingRight" ],
			// opacity animations
			[ "opacity" ]
		],
		fxNow;

	jQuery.fn.extend({
		show: function( speed, easing, callback ) {
			var elem, display;

			if ( speed || speed === 0 ) {
				return this.animate( genFx("show", 3), speed, easing, callback );

			} else {
				for ( var i = 0, j = this.length; i < j; i++ ) {
					elem = this[ i ];

					if ( elem.style ) {
						display = elem.style.display;

						// Reset the inline display of this element to learn if it is
						// being hidden by cascaded rules or not
						if ( !jQuery._data(elem, "olddisplay") && display === "none" ) {
							display = elem.style.display = "";
						}

						// Set elements which have been overridden with display: none
						// in a stylesheet to whatever the default browser style is
						// for such an element
						if ( (display === "" && jQuery.css(elem, "display") === "none") ||
							!jQuery.contains( elem.ownerDocument.documentElement, elem ) ) {
							jQuery._data( elem, "olddisplay", defaultDisplay(elem.nodeName) );
						}
					}
				}

				// Set the display of most of the elements in a second loop
				// to avoid the constant reflow
				for ( i = 0; i < j; i++ ) {
					elem = this[ i ];

					if ( elem.style ) {
						display = elem.style.display;

						if ( display === "" || display === "none" ) {
							elem.style.display = jQuery._data( elem, "olddisplay" ) || "";
						}
					}
				}

				return this;
			}
		},

		hide: function( speed, easing, callback ) {
			if ( speed || speed === 0 ) {
				return this.animate( genFx("hide", 3), speed, easing, callback);

			} else {
				var elem, display,
					i = 0,
					j = this.length;

				for ( ; i < j; i++ ) {
					elem = this[i];
					if ( elem.style ) {
						display = jQuery.css( elem, "display" );

						if ( display !== "none" && !jQuery._data( elem, "olddisplay" ) ) {
							jQuery._data( elem, "olddisplay", display );
						}
					}
				}

				// Set the display of the elements in a second loop
				// to avoid the constant reflow
				for ( i = 0; i < j; i++ ) {
					if ( this[i].style ) {
						this[i].style.display = "none";
					}
				}

				return this;
			}
		},

		// Save the old toggle function
		_toggle: jQuery.fn.toggle,

		toggle: function( fn, fn2, callback ) {
			var bool = typeof fn === "boolean";

			if ( jQuery.isFunction(fn) && jQuery.isFunction(fn2) ) {
				this._toggle.apply( this, arguments );

			} else if ( fn == null || bool ) {
				this.each(function() {
					var state = bool ? fn : jQuery(this).is(":hidden");
					jQuery(this)[ state ? "show" : "hide" ]();
				});

			} else {
				this.animate(genFx("toggle", 3), fn, fn2, callback);
			}

			return this;
		},

		fadeTo: function( speed, to, easing, callback ) {
			return this.filter(":hidden").css("opacity", 0).show().end()
						.animate({opacity: to}, speed, easing, callback);
		},

		animate: function( prop, speed, easing, callback ) {
			var optall = jQuery.speed( speed, easing, callback );

			if ( jQuery.isEmptyObject( prop ) ) {
				return this.each( optall.complete, [ false ] );
			}

			// Do not change referenced properties as per-property easing will be lost
			prop = jQuery.extend( {}, prop );

			function doAnimation() {
				// XXX 'this' does not always have a nodeName when running the
				// test suite

				if ( optall.queue === false ) {
					jQuery._mark( this );
				}

				var opt = jQuery.extend( {}, optall ),
					isElement = this.nodeType === 1,
					hidden = isElement && jQuery(this).is(":hidden"),
					name, val, p, e, hooks, replace,
					parts, start, end, unit,
					method;

				// will store per property easing and be used to determine when an animation is complete
				opt.animatedProperties = {};

				// first pass over propertys to expand / normalize
				for ( p in prop ) {
					name = jQuery.camelCase( p );
					if ( p !== name ) {
						prop[ name ] = prop[ p ];
						delete prop[ p ];
					}

					if ( ( hooks = jQuery.cssHooks[ name ] ) && "expand" in hooks ) {
						replace = hooks.expand( prop[ name ] );
						delete prop[ name ];

						// not quite $.extend, this wont overwrite keys already present.
						// also - reusing 'p' from above because we have the correct "name"
						for ( p in replace ) {
							if ( ! ( p in prop ) ) {
								prop[ p ] = replace[ p ];
							}
						}
					}
				}

				for ( name in prop ) {
					val = prop[ name ];
					// easing resolution: per property > opt.specialEasing > opt.easing > 'swing' (default)
					if ( jQuery.isArray( val ) ) {
						opt.animatedProperties[ name ] = val[ 1 ];
						val = prop[ name ] = val[ 0 ];
					} else {
						opt.animatedProperties[ name ] = opt.specialEasing && opt.specialEasing[ name ] || opt.easing || 'swing';
					}

					if ( val === "hide" && hidden || val === "show" && !hidden ) {
						return opt.complete.call( this );
					}

					if ( isElement && ( name === "height" || name === "width" ) ) {
						// Make sure that nothing sneaks out
						// Record all 3 overflow attributes because IE does not
						// change the overflow attribute when overflowX and
						// overflowY are set to the same value
						opt.overflow = [ this.style.overflow, this.style.overflowX, this.style.overflowY ];

						// Set display property to inline-block for height/width
						// animations on inline elements that are having width/height animated
						if ( jQuery.css( this, "display" ) === "inline" &&
								jQuery.css( this, "float" ) === "none" ) {

							// inline-level elements accept inline-block;
							// block-level elements need to be inline with layout
							if ( !jQuery.support.inlineBlockNeedsLayout || defaultDisplay( this.nodeName ) === "inline" ) {
								this.style.display = "inline-block";

							} else {
								this.style.zoom = 1;
							}
						}
					}
				}

				if ( opt.overflow != null ) {
					this.style.overflow = "hidden";
				}

				for ( p in prop ) {
					e = new jQuery.fx( this, opt, p );
					val = prop[ p ];

					if ( rfxtypes.test( val ) ) {

						// Tracks whether to show or hide based on private
						// data attached to the element
						method = jQuery._data( this, "toggle" + p ) || ( val === "toggle" ? hidden ? "show" : "hide" : 0 );
						if ( method ) {
							jQuery._data( this, "toggle" + p, method === "show" ? "hide" : "show" );
							e[ method ]();
						} else {
							e[ val ]();
						}

					} else {
						parts = rfxnum.exec( val );
						start = e.cur();

						if ( parts ) {
							end = parseFloat( parts[2] );
							unit = parts[3] || ( jQuery.cssNumber[ p ] ? "" : "px" );

							// We need to compute starting value
							if ( unit !== "px" ) {
								jQuery.style( this, p, (end || 1) + unit);
								start = ( (end || 1) / e.cur() ) * start;
								jQuery.style( this, p, start + unit);
							}

							// If a +=/-= token was provided, we're doing a relative animation
							if ( parts[1] ) {
								end = ( (parts[ 1 ] === "-=" ? -1 : 1) * end ) + start;
							}

							e.custom( start, end, unit );

						} else {
							e.custom( start, val, "" );
						}
					}
				}

				// For JS strict compliance
				return true;
			}

			return optall.queue === false ?
				this.each( doAnimation ) :
				this.queue( optall.queue, doAnimation );
		},

		stop: function( type, clearQueue, gotoEnd ) {
			if ( typeof type !== "string" ) {
				gotoEnd = clearQueue;
				clearQueue = type;
				type = undefined;
			}
			if ( clearQueue && type !== false ) {
				this.queue( type || "fx", [] );
			}

			return this.each(function() {
				var index,
					hadTimers = false,
					timers = jQuery.timers,
					data = jQuery._data( this );

				// clear marker counters if we know they won't be
				if ( !gotoEnd ) {
					jQuery._unmark( true, this );
				}

				function stopQueue( elem, data, index ) {
					var hooks = data[ index ];
					jQuery.removeData( elem, index, true );
					hooks.stop( gotoEnd );
				}

				if ( type == null ) {
					for ( index in data ) {
						if ( data[ index ] && data[ index ].stop && index.indexOf(".run") === index.length - 4 ) {
							stopQueue( this, data, index );
						}
					}
				} else if ( data[ index = type + ".run" ] && data[ index ].stop ){
					stopQueue( this, data, index );
				}

				for ( index = timers.length; index--; ) {
					if ( timers[ index ].elem === this && (type == null || timers[ index ].queue === type) ) {
						if ( gotoEnd ) {

							// force the next step to be the last
							timers[ index ]( true );
						} else {
							timers[ index ].saveState();
						}
						hadTimers = true;
						timers.splice( index, 1 );
					}
				}

				// start the next in the queue if the last step wasn't forced
				// timers currently will call their complete callbacks, which will dequeue
				// but only if they were gotoEnd
				if ( !( gotoEnd && hadTimers ) ) {
					jQuery.dequeue( this, type );
				}
			});
		}

	});

	// Animations created synchronously will run synchronously
	function createFxNow() {
		setTimeout( clearFxNow, 0 );
		return ( fxNow = jQuery.now() );
	}

	function clearFxNow() {
		fxNow = undefined;
	}

	// Generate parameters to create a standard animation
	function genFx( type, num ) {
		var obj = {};

		jQuery.each( fxAttrs.concat.apply([], fxAttrs.slice( 0, num )), function() {
			obj[ this ] = type;
		});

		return obj;
	}

	// Generate shortcuts for custom animations
	jQuery.each({
		slideDown: genFx( "show", 1 ),
		slideUp: genFx( "hide", 1 ),
		slideToggle: genFx( "toggle", 1 ),
		fadeIn: { opacity: "show" },
		fadeOut: { opacity: "hide" },
		fadeToggle: { opacity: "toggle" }
	}, function( name, props ) {
		jQuery.fn[ name ] = function( speed, easing, callback ) {
			return this.animate( props, speed, easing, callback );
		};
	});

	jQuery.extend({
		speed: function( speed, easing, fn ) {
			var opt = speed && typeof speed === "object" ? jQuery.extend( {}, speed ) : {
				complete: fn || !fn && easing ||
					jQuery.isFunction( speed ) && speed,
				duration: speed,
				easing: fn && easing || easing && !jQuery.isFunction( easing ) && easing
			};

			opt.duration = jQuery.fx.off ? 0 : typeof opt.duration === "number" ? opt.duration :
				opt.duration in jQuery.fx.speeds ? jQuery.fx.speeds[ opt.duration ] : jQuery.fx.speeds._default;

			// normalize opt.queue - true/undefined/null -> "fx"
			if ( opt.queue == null || opt.queue === true ) {
				opt.queue = "fx";
			}

			// Queueing
			opt.old = opt.complete;

			opt.complete = function( noUnmark ) {
				if ( jQuery.isFunction( opt.old ) ) {
					opt.old.call( this );
				}

				if ( opt.queue ) {
					jQuery.dequeue( this, opt.queue );
				} else if ( noUnmark !== false ) {
					jQuery._unmark( this );
				}
			};

			return opt;
		},

		easing: {
			linear: function( p ) {
				return p;
			},
			swing: function( p ) {
				return ( -Math.cos( p*Math.PI ) / 2 ) + 0.5;
			}
		},

		timers: [],

		fx: function( elem, options, prop ) {
			this.options = options;
			this.elem = elem;
			this.prop = prop;

			options.orig = options.orig || {};
		}

	});

	jQuery.fx.prototype = {
		// Simple function for setting a style value
		update: function() {
			if ( this.options.step ) {
				this.options.step.call( this.elem, this.now, this );
			}

			( jQuery.fx.step[ this.prop ] || jQuery.fx.step._default )( this );
		},

		// Get the current size
		cur: function() {
			if ( this.elem[ this.prop ] != null && (!this.elem.style || this.elem.style[ this.prop ] == null) ) {
				return this.elem[ this.prop ];
			}

			var parsed,
				r = jQuery.css( this.elem, this.prop );
			// Empty strings, null, undefined and "auto" are converted to 0,
			// complex values such as "rotate(1rad)" are returned as is,
			// simple values such as "10px" are parsed to Float.
			return isNaN( parsed = parseFloat( r ) ) ? !r || r === "auto" ? 0 : r : parsed;
		},

		// Start an animation from one number to another
		custom: function( from, to, unit ) {
			var self = this,
				fx = jQuery.fx;

			this.startTime = fxNow || createFxNow();
			this.end = to;
			this.now = this.start = from;
			this.pos = this.state = 0;
			this.unit = unit || this.unit || ( jQuery.cssNumber[ this.prop ] ? "" : "px" );

			function t( gotoEnd ) {
				return self.step( gotoEnd );
			}

			t.queue = this.options.queue;
			t.elem = this.elem;
			t.saveState = function() {
				if ( jQuery._data( self.elem, "fxshow" + self.prop ) === undefined ) {
					if ( self.options.hide ) {
						jQuery._data( self.elem, "fxshow" + self.prop, self.start );
					} else if ( self.options.show ) {
						jQuery._data( self.elem, "fxshow" + self.prop, self.end );
					}
				}
			};

			if ( t() && jQuery.timers.push(t) && !timerId ) {
				timerId = setInterval( fx.tick, fx.interval );
			}
		},

		// Simple 'show' function
		show: function() {
			var dataShow = jQuery._data( this.elem, "fxshow" + this.prop );

			// Remember where we started, so that we can go back to it later
			this.options.orig[ this.prop ] = dataShow || jQuery.style( this.elem, this.prop );
			this.options.show = true;

			// Begin the animation
			// Make sure that we start at a small width/height to avoid any flash of content
			if ( dataShow !== undefined ) {
				// This show is picking up where a previous hide or show left off
				this.custom( this.cur(), dataShow );
			} else {
				this.custom( this.prop === "width" || this.prop === "height" ? 1 : 0, this.cur() );
			}

			// Start by showing the element
			jQuery( this.elem ).show();
		},

		// Simple 'hide' function
		hide: function() {
			// Remember where we started, so that we can go back to it later
			this.options.orig[ this.prop ] = jQuery._data( this.elem, "fxshow" + this.prop ) || jQuery.style( this.elem, this.prop );
			this.options.hide = true;

			// Begin the animation
			this.custom( this.cur(), 0 );
		},

		// Each step of an animation
		step: function( gotoEnd ) {
			var p, n, complete,
				t = fxNow || createFxNow(),
				done = true,
				elem = this.elem,
				options = this.options;

			if ( gotoEnd || t >= options.duration + this.startTime ) {
				this.now = this.end;
				this.pos = this.state = 1;
				this.update();

				options.animatedProperties[ this.prop ] = true;

				for ( p in options.animatedProperties ) {
					if ( options.animatedProperties[ p ] !== true ) {
						done = false;
					}
				}

				if ( done ) {
					// Reset the overflow
					if ( options.overflow != null && !jQuery.support.shrinkWrapBlocks ) {

						jQuery.each( [ "", "X", "Y" ], function( index, value ) {
							elem.style[ "overflow" + value ] = options.overflow[ index ];
						});
					}

					// Hide the element if the "hide" operation was done
					if ( options.hide ) {
						jQuery( elem ).hide();
					}

					// Reset the properties, if the item has been hidden or shown
					if ( options.hide || options.show ) {
						for ( p in options.animatedProperties ) {
							jQuery.style( elem, p, options.orig[ p ] );
							jQuery.removeData( elem, "fxshow" + p, true );
							// Toggle data is no longer needed
							jQuery.removeData( elem, "toggle" + p, true );
						}
					}

					// Execute the complete function
					// in the event that the complete function throws an exception
					// we must ensure it won't be called twice. #5684

					complete = options.complete;
					if ( complete ) {

						options.complete = false;
						complete.call( elem );
					}
				}

				return false;

			} else {
				// classical easing cannot be used with an Infinity duration
				if ( options.duration == Infinity ) {
					this.now = t;
				} else {
					n = t - this.startTime;
					this.state = n / options.duration;

					// Perform the easing function, defaults to swing
					this.pos = jQuery.easing[ options.animatedProperties[this.prop] ]( this.state, n, 0, 1, options.duration );
					this.now = this.start + ( (this.end - this.start) * this.pos );
				}
				// Perform the next step of the animation
				this.update();
			}

			return true;
		}
	};

	jQuery.extend( jQuery.fx, {
		tick: function() {
			var timer,
				timers = jQuery.timers,
				i = 0;

			for ( ; i < timers.length; i++ ) {
				timer = timers[ i ];
				// Checks the timer has not already been removed
				if ( !timer() && timers[ i ] === timer ) {
					timers.splice( i--, 1 );
				}
			}

			if ( !timers.length ) {
				jQuery.fx.stop();
			}
		},

		interval: 13,

		stop: function() {
			clearInterval( timerId );
			timerId = null;
		},

		speeds: {
			slow: 600,
			fast: 200,
			// Default speed
			_default: 400
		},

		step: {
			opacity: function( fx ) {
				jQuery.style( fx.elem, "opacity", fx.now );
			},

			_default: function( fx ) {
				if ( fx.elem.style && fx.elem.style[ fx.prop ] != null ) {
					fx.elem.style[ fx.prop ] = fx.now + fx.unit;
				} else {
					fx.elem[ fx.prop ] = fx.now;
				}
			}
		}
	});

	// Ensure props that can't be negative don't go there on undershoot easing
	jQuery.each( fxAttrs.concat.apply( [], fxAttrs ), function( i, prop ) {
		// exclude marginTop, marginLeft, marginBottom and marginRight from this list
		if ( prop.indexOf( "margin" ) ) {
			jQuery.fx.step[ prop ] = function( fx ) {
				jQuery.style( fx.elem, prop, Math.max(0, fx.now) + fx.unit );
			};
		}
	});

	if ( jQuery.expr && jQuery.expr.filters ) {
		jQuery.expr.filters.animated = function( elem ) {
			return jQuery.grep(jQuery.timers, function( fn ) {
				return elem === fn.elem;
			}).length;
		};
	}

	// Try to restore the default display value of an element
	function defaultDisplay( nodeName ) {

		if ( !elemdisplay[ nodeName ] ) {

			var body = document.body,
				elem = jQuery( "<" + nodeName + ">" ).appendTo( body ),
				display = elem.css( "display" );
			elem.remove();

			// If the simple way fails,
			// get element's real default display by attaching it to a temp iframe
			if ( display === "none" || display === "" ) {
				// No iframe to use yet, so create it
				if ( !iframe ) {
					iframe = document.createElement( "iframe" );
					iframe.frameBorder = iframe.width = iframe.height = 0;
				}

				body.appendChild( iframe );

				// Create a cacheable copy of the iframe document on first call.
				// IE and Opera will allow us to reuse the iframeDoc without re-writing the fake HTML
				// document to it; WebKit & Firefox won't allow reusing the iframe document.
				if ( !iframeDoc || !iframe.createElement ) {
					iframeDoc = ( iframe.contentWindow || iframe.contentDocument ).document;
					iframeDoc.write( ( jQuery.support.boxModel ? "<!doctype html>" : "" ) + "<html><body>" );
					iframeDoc.close();
				}

				elem = iframeDoc.createElement( nodeName );

				iframeDoc.body.appendChild( elem );

				display = jQuery.css( elem, "display" );
				body.removeChild( iframe );
			}

			// Store the correct default display
			elemdisplay[ nodeName ] = display;
		}

		return elemdisplay[ nodeName ];
	}




	var getOffset,
		rtable = /^t(?:able|d|h)$/i,
		rroot = /^(?:body|html)$/i;

	if ( "getBoundingClientRect" in document.documentElement ) {
		getOffset = function( elem, doc, docElem, box ) {
			try {
				box = elem.getBoundingClientRect();
			} catch(e) {}

			// Make sure we're not dealing with a disconnected DOM node
			if ( !box || !jQuery.contains( docElem, elem ) ) {
				return box ? { top: box.top, left: box.left } : { top: 0, left: 0 };
			}

			var body = doc.body,
				win = getWindow( doc ),
				clientTop  = docElem.clientTop  || body.clientTop  || 0,
				clientLeft = docElem.clientLeft || body.clientLeft || 0,
				scrollTop  = win.pageYOffset || jQuery.support.boxModel && docElem.scrollTop  || body.scrollTop,
				scrollLeft = win.pageXOffset || jQuery.support.boxModel && docElem.scrollLeft || body.scrollLeft,
				top  = box.top  + scrollTop  - clientTop,
				left = box.left + scrollLeft - clientLeft;

			return { top: top, left: left };
		};

	} else {
		getOffset = function( elem, doc, docElem ) {
			var computedStyle,
				offsetParent = elem.offsetParent,
				prevOffsetParent = elem,
				body = doc.body,
				defaultView = doc.defaultView,
				prevComputedStyle = defaultView ? defaultView.getComputedStyle( elem, null ) : elem.currentStyle,
				top = elem.offsetTop,
				left = elem.offsetLeft;

			while ( (elem = elem.parentNode) && elem !== body && elem !== docElem ) {
				if ( jQuery.support.fixedPosition && prevComputedStyle.position === "fixed" ) {
					break;
				}

				computedStyle = defaultView ? defaultView.getComputedStyle(elem, null) : elem.currentStyle;
				top  -= elem.scrollTop;
				left -= elem.scrollLeft;

				if ( elem === offsetParent ) {
					top  += elem.offsetTop;
					left += elem.offsetLeft;

					if ( jQuery.support.doesNotAddBorder && !(jQuery.support.doesAddBorderForTableAndCells && rtable.test(elem.nodeName)) ) {
						top  += parseFloat( computedStyle.borderTopWidth  ) || 0;
						left += parseFloat( computedStyle.borderLeftWidth ) || 0;
					}

					prevOffsetParent = offsetParent;
					offsetParent = elem.offsetParent;
				}

				if ( jQuery.support.subtractsBorderForOverflowNotVisible && computedStyle.overflow !== "visible" ) {
					top  += parseFloat( computedStyle.borderTopWidth  ) || 0;
					left += parseFloat( computedStyle.borderLeftWidth ) || 0;
				}

				prevComputedStyle = computedStyle;
			}

			if ( prevComputedStyle.position === "relative" || prevComputedStyle.position === "static" ) {
				top  += body.offsetTop;
				left += body.offsetLeft;
			}

			if ( jQuery.support.fixedPosition && prevComputedStyle.position === "fixed" ) {
				top  += Math.max( docElem.scrollTop, body.scrollTop );
				left += Math.max( docElem.scrollLeft, body.scrollLeft );
			}

			return { top: top, left: left };
		};
	}

	jQuery.fn.offset = function( options ) {
		if ( arguments.length ) {
			return options === undefined ?
				this :
				this.each(function( i ) {
					jQuery.offset.setOffset( this, options, i );
				});
		}

		var elem = this[0],
			doc = elem && elem.ownerDocument;

		if ( !doc ) {
			return null;
		}

		if ( elem === doc.body ) {
			return jQuery.offset.bodyOffset( elem );
		}

		return getOffset( elem, doc, doc.documentElement );
	};

	jQuery.offset = {

		bodyOffset: function( body ) {
			var top = body.offsetTop,
				left = body.offsetLeft;

			if ( jQuery.support.doesNotIncludeMarginInBodyOffset ) {
				top  += parseFloat( jQuery.css(body, "marginTop") ) || 0;
				left += parseFloat( jQuery.css(body, "marginLeft") ) || 0;
			}

			return { top: top, left: left };
		},

		setOffset: function( elem, options, i ) {
			var position = jQuery.css( elem, "position" );

			// set position first, in-case top/left are set even on static elem
			if ( position === "static" ) {
				elem.style.position = "relative";
			}

			var curElem = jQuery( elem ),
				curOffset = curElem.offset(),
				curCSSTop = jQuery.css( elem, "top" ),
				curCSSLeft = jQuery.css( elem, "left" ),
				calculatePosition = ( position === "absolute" || position === "fixed" ) && jQuery.inArray("auto", [curCSSTop, curCSSLeft]) > -1,
				props = {}, curPosition = {}, curTop, curLeft;

			// need to be able to calculate position if either top or left is auto and position is either absolute or fixed
			if ( calculatePosition ) {
				curPosition = curElem.position();
				curTop = curPosition.top;
				curLeft = curPosition.left;
			} else {
				curTop = parseFloat( curCSSTop ) || 0;
				curLeft = parseFloat( curCSSLeft ) || 0;
			}

			if ( jQuery.isFunction( options ) ) {
				options = options.call( elem, i, curOffset );
			}

			if ( options.top != null ) {
				props.top = ( options.top - curOffset.top ) + curTop;
			}
			if ( options.left != null ) {
				props.left = ( options.left - curOffset.left ) + curLeft;
			}

			if ( "using" in options ) {
				options.using.call( elem, props );
			} else {
				curElem.css( props );
			}
		}
	};


	jQuery.fn.extend({

		position: function() {
			if ( !this[0] ) {
				return null;
			}

			var elem = this[0],

			// Get *real* offsetParent
			offsetParent = this.offsetParent(),

			// Get correct offsets
			offset       = this.offset(),
			parentOffset = rroot.test(offsetParent[0].nodeName) ? { top: 0, left: 0 } : offsetParent.offset();

			// Subtract element margins
			// note: when an element has margin: auto the offsetLeft and marginLeft
			// are the same in Safari causing offset.left to incorrectly be 0
			offset.top  -= parseFloat( jQuery.css(elem, "marginTop") ) || 0;
			offset.left -= parseFloat( jQuery.css(elem, "marginLeft") ) || 0;

			// Add offsetParent borders
			parentOffset.top  += parseFloat( jQuery.css(offsetParent[0], "borderTopWidth") ) || 0;
			parentOffset.left += parseFloat( jQuery.css(offsetParent[0], "borderLeftWidth") ) || 0;

			// Subtract the two offsets
			return {
				top:  offset.top  - parentOffset.top,
				left: offset.left - parentOffset.left
			};
		},

		offsetParent: function() {
			return this.map(function() {
				var offsetParent = this.offsetParent || document.body;
				while ( offsetParent && (!rroot.test(offsetParent.nodeName) && jQuery.css(offsetParent, "position") === "static") ) {
					offsetParent = offsetParent.offsetParent;
				}
				return offsetParent;
			});
		}
	});


	// Create scrollLeft and scrollTop methods
	jQuery.each( {scrollLeft: "pageXOffset", scrollTop: "pageYOffset"}, function( method, prop ) {
		var top = /Y/.test( prop );

		jQuery.fn[ method ] = function( val ) {
			return jQuery.access( this, function( elem, method, val ) {
				var win = getWindow( elem );

				if ( val === undefined ) {
					return win ? (prop in win) ? win[ prop ] :
						jQuery.support.boxModel && win.document.documentElement[ method ] ||
							win.document.body[ method ] :
						elem[ method ];
				}

				if ( win ) {
					win.scrollTo(
						!top ? val : jQuery( win ).scrollLeft(),
						 top ? val : jQuery( win ).scrollTop()
					);

				} else {
					elem[ method ] = val;
				}
			}, method, val, arguments.length, null );
		};
	});

	function getWindow( elem ) {
		return jQuery.isWindow( elem ) ?
			elem :
			elem.nodeType === 9 ?
				elem.defaultView || elem.parentWindow :
				false;
	}




	// Create width, height, innerHeight, innerWidth, outerHeight and outerWidth methods
	jQuery.each( { Height: "height", Width: "width" }, function( name, type ) {
		var clientProp = "client" + name,
			scrollProp = "scroll" + name,
			offsetProp = "offset" + name;

		// innerHeight and innerWidth
		jQuery.fn[ "inner" + name ] = function() {
			var elem = this[0];
			return elem ?
				elem.style ?
				parseFloat( jQuery.css( elem, type, "padding" ) ) :
				this[ type ]() :
				null;
		};

		// outerHeight and outerWidth
		jQuery.fn[ "outer" + name ] = function( margin ) {
			var elem = this[0];
			return elem ?
				elem.style ?
				parseFloat( jQuery.css( elem, type, margin ? "margin" : "border" ) ) :
				this[ type ]() :
				null;
		};

		jQuery.fn[ type ] = function( value ) {
			return jQuery.access( this, function( elem, type, value ) {
				var doc, docElemProp, orig, ret;

				if ( jQuery.isWindow( elem ) ) {
					// 3rd condition allows Nokia support, as it supports the docElem prop but not CSS1Compat
					doc = elem.document;
					docElemProp = doc.documentElement[ clientProp ];
					return jQuery.support.boxModel && docElemProp ||
						doc.body && doc.body[ clientProp ] || docElemProp;
				}

				// Get document width or height
				if ( elem.nodeType === 9 ) {
					// Either scroll[Width/Height] or offset[Width/Height], whichever is greater
					doc = elem.documentElement;

					// when a window > document, IE6 reports a offset[Width/Height] > client[Width/Height]
					// so we can't use max, as it'll choose the incorrect offset[Width/Height]
					// instead we use the correct client[Width/Height]
					// support:IE6
					if ( doc[ clientProp ] >= doc[ scrollProp ] ) {
						return doc[ clientProp ];
					}

					return Math.max(
						elem.body[ scrollProp ], doc[ scrollProp ],
						elem.body[ offsetProp ], doc[ offsetProp ]
					);
				}

				// Get width or height on the element
				if ( value === undefined ) {
					orig = jQuery.css( elem, type );
					ret = parseFloat( orig );
					return jQuery.isNumeric( ret ) ? ret : orig;
				}

				// Set the width or height on the element
				jQuery( elem ).css( type, value );
			}, type, value, arguments.length, null );
		};
	});




	// Expose jQuery to the global object
	window.jQuery = window.$ = jQuery;

	// Expose jQuery as an AMD module, but only for AMD loaders that
	// understand the issues with loading multiple versions of jQuery
	// in a page that all might call define(). The loader will indicate
	// they have special allowances for multiple jQuery versions by
	// specifying define.amd.jQuery = true. Register as a named module,
	// since jQuery can be concatenated with other files that may use define,
	// but not use a proper concatenation script that understands anonymous
	// AMD modules. A named AMD is safest and most robust way to register.
	// Lowercase jquery is used because AMD module names are derived from
	// file names, and jQuery is normally delivered in a lowercase file name.
	// Do this after creating the global so that if an AMD module wants to call
	// noConflict to hide this version of jQuery, it will work.
	if ( typeof define === "function" && define.amd && define.amd.jQuery ) {
		define( "jquery", [], function () { return jQuery; } );
	}



	})( window );
/*jQuery UI*/
	/*! jQuery UI - v1.8.21 - 2012-06-05
	* https://github.com/jquery/jquery-ui
	* Includes: jquery.ui.core.js
	* Copyright (c) 2012 AUTHORS.txt; Licensed MIT, GPL */
	(function(a,b){function c(b,c){var e=b.nodeName.toLowerCase();if("area"===e){var f=b.parentNode,g=f.name,h;return!b.href||!g||f.nodeName.toLowerCase()!=="map"?!1:(h=a("img[usemap=#"+g+"]")[0],!!h&&d(h))}return(/input|select|textarea|button|object/.test(e)?!b.disabled:"a"==e?b.href||c:c)&&d(b)}function d(b){return!a(b).parents().andSelf().filter(function(){return a.curCSS(this,"visibility")==="hidden"||a.expr.filters.hidden(this)}).length}a.ui=a.ui||{};if(a.ui.version)return;a.extend(a.ui,{version:"1.8.21",keyCode:{ALT:18,BACKSPACE:8,CAPS_LOCK:20,COMMA:188,COMMAND:91,COMMAND_LEFT:91,COMMAND_RIGHT:93,CONTROL:17,DELETE:46,DOWN:40,END:35,ENTER:13,ESCAPE:27,HOME:36,INSERT:45,LEFT:37,MENU:93,NUMPAD_ADD:107,NUMPAD_DECIMAL:110,NUMPAD_DIVIDE:111,NUMPAD_ENTER:108,NUMPAD_MULTIPLY:106,NUMPAD_SUBTRACT:109,PAGE_DOWN:34,PAGE_UP:33,PERIOD:190,RIGHT:39,SHIFT:16,SPACE:32,TAB:9,UP:38,WINDOWS:91}}),a.fn.extend({propAttr:a.fn.prop||a.fn.attr,_focus:a.fn.focus,focus:function(b,c){return typeof b=="number"?this.each(function(){var d=this;setTimeout(function(){a(d).focus(),c&&c.call(d)},b)}):this._focus.apply(this,arguments)},scrollParent:function(){var b;return a.browser.msie&&/(static|relative)/.test(this.css("position"))||/absolute/.test(this.css("position"))?b=this.parents().filter(function(){return/(relative|absolute|fixed)/.test(a.curCSS(this,"position",1))&&/(auto|scroll)/.test(a.curCSS(this,"overflow",1)+a.curCSS(this,"overflow-y",1)+a.curCSS(this,"overflow-x",1))}).eq(0):b=this.parents().filter(function(){return/(auto|scroll)/.test(a.curCSS(this,"overflow",1)+a.curCSS(this,"overflow-y",1)+a.curCSS(this,"overflow-x",1))}).eq(0),/fixed/.test(this.css("position"))||!b.length?a(document):b},zIndex:function(c){if(c!==b)return this.css("zIndex",c);if(this.length){var d=a(this[0]),e,f;while(d.length&&d[0]!==document){e=d.css("position");if(e==="absolute"||e==="relative"||e==="fixed"){f=parseInt(d.css("zIndex"),10);if(!isNaN(f)&&f!==0)return f}d=d.parent()}}return 0},disableSelection:function(){return this.bind((a.support.selectstart?"selectstart":"mousedown")+".ui-disableSelection",function(a){a.preventDefault()})},enableSelection:function(){return this.unbind(".ui-disableSelection")}}),a.each(["Width","Height"],function(c,d){function h(b,c,d,f){return a.each(e,function(){c-=parseFloat(a.curCSS(b,"padding"+this,!0))||0,d&&(c-=parseFloat(a.curCSS(b,"border"+this+"Width",!0))||0),f&&(c-=parseFloat(a.curCSS(b,"margin"+this,!0))||0)}),c}var e=d==="Width"?["Left","Right"]:["Top","Bottom"],f=d.toLowerCase(),g={innerWidth:a.fn.innerWidth,innerHeight:a.fn.innerHeight,outerWidth:a.fn.outerWidth,outerHeight:a.fn.outerHeight};a.fn["inner"+d]=function(c){return c===b?g["inner"+d].call(this):this.each(function(){a(this).css(f,h(this,c)+"px")})},a.fn["outer"+d]=function(b,c){return typeof b!="number"?g["outer"+d].call(this,b):this.each(function(){a(this).css(f,h(this,b,!0,c)+"px")})}}),a.extend(a.expr[":"],{data:function(b,c,d){return!!a.data(b,d[3])},focusable:function(b){return c(b,!isNaN(a.attr(b,"tabindex")))},tabbable:function(b){var d=a.attr(b,"tabindex"),e=isNaN(d);return(e||d>=0)&&c(b,!e)}}),a(function(){var b=document.body,c=b.appendChild(c=document.createElement("div"));c.offsetHeight,a.extend(c.style,{minHeight:"100px",height:"auto",padding:0,borderWidth:0}),a.support.minHeight=c.offsetHeight===100,a.support.selectstart="onselectstart"in c,b.removeChild(c).style.display="none"}),a.extend(a.ui,{plugin:{add:function(b,c,d){var e=a.ui[b].prototype;for(var f in d)e.plugins[f]=e.plugins[f]||[],e.plugins[f].push([c,d[f]])},call:function(a,b,c){var d=a.plugins[b];if(!d||!a.element[0].parentNode)return;for(var e=0;e<d.length;e++)a.options[d[e][0]]&&d[e][1].apply(a.element,c)}},contains:function(a,b){return document.compareDocumentPosition?a.compareDocumentPosition(b)&16:a!==b&&a.contains(b)},hasScroll:function(b,c){if(a(b).css("overflow")==="hidden")return!1;var d=c&&c==="left"?"scrollLeft":"scrollTop",e=!1;return b[d]>0?!0:(b[d]=1,e=b[d]>0,b[d]=0,e)},isOverAxis:function(a,b,c){return a>b&&a<b+c},isOver:function(b,c,d,e,f,g){return a.ui.isOverAxis(b,d,f)&&a.ui.isOverAxis(c,e,g)}})})(jQuery);;/*! jQuery UI - v1.8.21 - 2012-06-05
	* https://github.com/jquery/jquery-ui
	* Includes: jquery.ui.widget.js
	* Copyright (c) 2012 AUTHORS.txt; Licensed MIT, GPL */
	(function(a,b){if(a.cleanData){var c=a.cleanData;a.cleanData=function(b){for(var d=0,e;(e=b[d])!=null;d++)try{a(e).triggerHandler("remove")}catch(f){}c(b)}}else{var d=a.fn.remove;a.fn.remove=function(b,c){return this.each(function(){return c||(!b||a.filter(b,[this]).length)&&a("*",this).add([this]).each(function(){try{a(this).triggerHandler("remove")}catch(b){}}),d.call(a(this),b,c)})}}a.widget=function(b,c,d){var e=b.split(".")[0],f;b=b.split(".")[1],f=e+"-"+b,d||(d=c,c=a.Widget),a.expr[":"][f]=function(c){return!!a.data(c,b)},a[e]=a[e]||{},a[e][b]=function(a,b){arguments.length&&this._createWidget(a,b)};var g=new c;g.options=a.extend(!0,{},g.options),a[e][b].prototype=a.extend(!0,g,{namespace:e,widgetName:b,widgetEventPrefix:a[e][b].prototype.widgetEventPrefix||b,widgetBaseClass:f},d),a.widget.bridge(b,a[e][b])},a.widget.bridge=function(c,d){a.fn[c]=function(e){var f=typeof e=="string",g=Array.prototype.slice.call(arguments,1),h=this;return e=!f&&g.length?a.extend.apply(null,[!0,e].concat(g)):e,f&&e.charAt(0)==="_"?h:(f?this.each(function(){var d=a.data(this,c),f=d&&a.isFunction(d[e])?d[e].apply(d,g):d;if(f!==d&&f!==b)return h=f,!1}):this.each(function(){var b=a.data(this,c);b?b.option(e||{})._init():a.data(this,c,new d(e,this))}),h)}},a.Widget=function(a,b){arguments.length&&this._createWidget(a,b)},a.Widget.prototype={widgetName:"widget",widgetEventPrefix:"",options:{disabled:!1},_createWidget:function(b,c){a.data(c,this.widgetName,this),this.element=a(c),this.options=a.extend(!0,{},this.options,this._getCreateOptions(),b);var d=this;this.element.bind("remove."+this.widgetName,function(){d.destroy()}),this._create(),this._trigger("create"),this._init()},_getCreateOptions:function(){return a.metadata&&a.metadata.get(this.element[0])[this.widgetName]},_create:function(){},_init:function(){},destroy:function(){this.element.unbind("."+this.widgetName).removeData(this.widgetName),this.widget().unbind("."+this.widgetName).removeAttr("aria-disabled").removeClass(this.widgetBaseClass+"-disabled "+"ui-state-disabled")},widget:function(){return this.element},option:function(c,d){var e=c;if(arguments.length===0)return a.extend({},this.options);if(typeof c=="string"){if(d===b)return this.options[c];e={},e[c]=d}return this._setOptions(e),this},_setOptions:function(b){var c=this;return a.each(b,function(a,b){c._setOption(a,b)}),this},_setOption:function(a,b){return this.options[a]=b,a==="disabled"&&this.widget()[b?"addClass":"removeClass"](this.widgetBaseClass+"-disabled"+" "+"ui-state-disabled").attr("aria-disabled",b),this},enable:function(){return this._setOption("disabled",!1)},disable:function(){return this._setOption("disabled",!0)},_trigger:function(b,c,d){var e,f,g=this.options[b];d=d||{},c=a.Event(c),c.type=(b===this.widgetEventPrefix?b:this.widgetEventPrefix+b).toLowerCase(),c.target=this.element[0],f=c.originalEvent;if(f)for(e in f)e in c||(c[e]=f[e]);return this.element.trigger(c,d),!(a.isFunction(g)&&g.call(this.element[0],c,d)===!1||c.isDefaultPrevented())}}})(jQuery);;/*! jQuery UI - v1.8.21 - 2012-06-05
	* https://github.com/jquery/jquery-ui
	* Includes: jquery.ui.mouse.js
	* Copyright (c) 2012 AUTHORS.txt; Licensed MIT, GPL */
	(function(a,b){var c=!1;a(document).mouseup(function(a){c=!1}),a.widget("ui.mouse",{options:{cancel:":input,option",distance:1,delay:0},_mouseInit:function(){var b=this;this.element.bind("mousedown."+this.widgetName,function(a){return b._mouseDown(a)}).bind("click."+this.widgetName,function(c){if(!0===a.data(c.target,b.widgetName+".preventClickEvent"))return a.removeData(c.target,b.widgetName+".preventClickEvent"),c.stopImmediatePropagation(),!1}),this.started=!1},_mouseDestroy:function(){
	   if(wireitdraggableelementbody) {
		  return false;
	   }this.element.unbind("."+this.widgetName),a(document).unbind("mousemove."+this.widgetName,this._mouseMoveDelegate).unbind("mouseup."+this.widgetName,this._mouseUpDelegate)},


	_mouseDown:function(b){
	   
	   if(wireitdraggableelementbody) {
		  return false;
	   }
	   if(c)return;this._mouseStarted&&this._mouseUp(b),this._mouseDownEvent=b;var d=this,e=b.which==1,f=typeof this.options.cancel=="string"&&b.target.nodeName?a(b.target).closest(this.options.cancel).length:!1;if(!e||f||!this._mouseCapture(b))return!0;this.mouseDelayMet=!this.options.delay,this.mouseDelayMet||(this._mouseDelayTimer=setTimeout(function(){
	   if(wireitdraggableelementbody) {
		  return false;
	   }d.mouseDelayMet=!0},this.options.delay));if(this._mouseDistanceMet(b)&&this._mouseDelayMet(b)){this._mouseStarted=this._mouseStart(b)!==!1;if(!this._mouseStarted)return b.preventDefault(),!0}return!0===a.data(b.target,this.widgetName+".preventClickEvent")&&a.removeData(b.target,this.widgetName+".preventClickEvent"),this._mouseMoveDelegate=function(a){return d._mouseMove(a)},this._mouseUpDelegate=function(a){
	   if(wireitdraggableelementbody) {
		  return false;
	   }return d._mouseUp(a)},a(document).bind("mousemove."+this.widgetName,this._mouseMoveDelegate).bind("mouseup."+this.widgetName,this._mouseUpDelegate),b.preventDefault(),c=!0,!0},


	_mouseMove:function(b){
	   
	   if(wireitdraggableelementbody) {
		  return false;
	   }
	   return!a.browser.msie||document.documentMode>=9||!!b.button?this._mouseStarted?(this._mouseDrag(b),b.preventDefault()):(this._mouseDistanceMet(b)&&this._mouseDelayMet(b)&&(this._mouseStarted=this._mouseStart(this._mouseDownEvent,b)!==!1,this._mouseStarted?this._mouseDrag(b):this._mouseUp(b)),!this._mouseStarted):this._mouseUp(b)},_mouseUp:function(b){return a(document).unbind("mousemove."+this.widgetName,this._mouseMoveDelegate).unbind("mouseup."+this.widgetName,this._mouseUpDelegate),this._mouseStarted&&(this._mouseStarted=!1,b.target==this._mouseDownEvent.target&&a.data(b.target,this.widgetName+".preventClickEvent",!0),this._mouseStop(b)),!1},_mouseDistanceMet:function(a){return Math.max(Math.abs(this._mouseDownEvent.pageX-a.pageX),Math.abs(this._mouseDownEvent.pageY-a.pageY))>=this.options.distance},_mouseDelayMet:function(a){return this.mouseDelayMet},_mouseStart:function(a){},_mouseDrag:function(a){},_mouseStop:function(a){},_mouseCapture:function(a){return!0}})})(jQuery);;/*! jQuery UI - v1.8.21 - 2012-06-05
	* https://github.com/jquery/jquery-ui
	* Includes: jquery.ui.position.js
	* Copyright (c) 2012 AUTHORS.txt; Licensed MIT, GPL */
	(function(a,b){a.ui=a.ui||{};var c=/left|center|right/,d=/top|center|bottom/,e="center",f={},g=a.fn.position,h=a.fn.offset;a.fn.position=function(b){if(!b||!b.of)return g.apply(this,arguments);b=a.extend({},b);var h=a(b.of),i=h[0],j=(b.collision||"flip").split(" "),k=b.offset?b.offset.split(" "):[0,0],l,m,n;return i.nodeType===9?(l=h.width(),m=h.height(),n={top:0,left:0}):i.setTimeout?(l=h.width(),m=h.height(),n={top:h.scrollTop(),left:h.scrollLeft()}):i.preventDefault?(b.at="left top",l=m=0,n={top:b.of.pageY,left:b.of.pageX}):(l=h.outerWidth(),m=h.outerHeight(),n=h.offset()),a.each(["my","at"],function(){var a=(b[this]||"").split(" ");a.length===1&&(a=c.test(a[0])?a.concat([e]):d.test(a[0])?[e].concat(a):[e,e]),a[0]=c.test(a[0])?a[0]:e,a[1]=d.test(a[1])?a[1]:e,b[this]=a}),j.length===1&&(j[1]=j[0]),k[0]=parseInt(k[0],10)||0,k.length===1&&(k[1]=k[0]),k[1]=parseInt(k[1],10)||0,b.at[0]==="right"?n.left+=l:b.at[0]===e&&(n.left+=l/2),b.at[1]==="bottom"?n.top+=m:b.at[1]===e&&(n.top+=m/2),n.left+=k[0],n.top+=k[1],this.each(function(){var c=a(this),d=c.outerWidth(),g=c.outerHeight(),h=parseInt(a.curCSS(this,"marginLeft",!0))||0,i=parseInt(a.curCSS(this,"marginTop",!0))||0,o=d+h+(parseInt(a.curCSS(this,"marginRight",!0))||0),p=g+i+(parseInt(a.curCSS(this,"marginBottom",!0))||0),q=a.extend({},n),r;b.my[0]==="right"?q.left-=d:b.my[0]===e&&(q.left-=d/2),b.my[1]==="bottom"?q.top-=g:b.my[1]===e&&(q.top-=g/2),f.fractions||(q.left=Math.round(q.left),q.top=Math.round(q.top)),r={left:q.left-h,top:q.top-i},a.each(["left","top"],function(c,e){a.ui.position[j[c]]&&a.ui.position[j[c]][e](q,{targetWidth:l,targetHeight:m,elemWidth:d,elemHeight:g,collisionPosition:r,collisionWidth:o,collisionHeight:p,offset:k,my:b.my,at:b.at})}),a.fn.bgiframe&&c.bgiframe(),c.offset(a.extend(q,{using:b.using}))})},a.ui.position={fit:{left:function(b,c){var d=a(window),e=c.collisionPosition.left+c.collisionWidth-d.width()-d.scrollLeft();b.left=e>0?b.left-e:Math.max(b.left-c.collisionPosition.left,b.left)},top:function(b,c){var d=a(window),e=c.collisionPosition.top+c.collisionHeight-d.height()-d.scrollTop();b.top=e>0?b.top-e:Math.max(b.top-c.collisionPosition.top,b.top)}},flip:{left:function(b,c){if(c.at[0]===e)return;var d=a(window),f=c.collisionPosition.left+c.collisionWidth-d.width()-d.scrollLeft(),g=c.my[0]==="left"?-c.elemWidth:c.my[0]==="right"?c.elemWidth:0,h=c.at[0]==="left"?c.targetWidth:-c.targetWidth,i=-2*c.offset[0];b.left+=c.collisionPosition.left<0?g+h+i:f>0?g+h+i:0},top:function(b,c){if(c.at[1]===e)return;var d=a(window),f=c.collisionPosition.top+c.collisionHeight-d.height()-d.scrollTop(),g=c.my[1]==="top"?-c.elemHeight:c.my[1]==="bottom"?c.elemHeight:0,h=c.at[1]==="top"?c.targetHeight:-c.targetHeight,i=-2*c.offset[1];b.top+=c.collisionPosition.top<0?g+h+i:f>0?g+h+i:0}}},a.offset.setOffset||(a.offset.setOffset=function(b,c){/static/.test(a.curCSS(b,"position"))&&(b.style.position="relative");var d=a(b),e=d.offset(),f=parseInt(a.curCSS(b,"top",!0),10)||0,g=parseInt(a.curCSS(b,"left",!0),10)||0,h={top:c.top-e.top+f,left:c.left-e.left+g};"using"in c?c.using.call(b,h):d.css(h)},a.fn.offset=function(b){var c=this[0];return!c||!c.ownerDocument?null:b?a.isFunction(b)?this.each(function(c){a(this).offset(b.call(this,c,a(this).offset()))}):this.each(function(){a.offset.setOffset(this,b)}):h.call(this)}),function(){var b=document.getElementsByTagName("body")[0],c=document.createElement("div"),d,e,g,h,i;d=document.createElement(b?"div":"body"),g={visibility:"hidden",width:0,height:0,border:0,margin:0,background:"none"},b&&a.extend(g,{position:"absolute",left:"-1000px",top:"-1000px"});for(var j in g)d.style[j]=g[j];d.appendChild(c),e=b||document.documentElement,e.insertBefore(d,e.firstChild),c.style.cssText="position: absolute; left: 10.7432222px; top: 10.432325px; height: 30px; width: 201px;",h=a(c).offset(function(a,b){return b}).offset(),d.innerHTML="",e.removeChild(d),i=h.top+h.left+(b?2e3:0),f.fractions=i>21&&i<22}()})(jQuery);;/*! jQuery UI - v1.8.21 - 2012-06-05
	* https://github.com/jquery/jquery-ui
	* Includes: jquery.ui.draggable.js
	* Copyright (c) 2012 AUTHORS.txt; Licensed MIT, GPL */
	(function(a,b){a.widget("ui.draggable",a.ui.mouse,{widgetEventPrefix:"drag",options:{addClasses:!0,appendTo:"parent",axis:!1,connectToSortable:!1,containment:!1,cursor:"auto",cursorAt:!1,grid:!1,handle:!1,helper:"original",iframeFix:!1,opacity:!1,refreshPositions:!1,revert:!1,revertDuration:500,scope:"default",scroll:!0,scrollSensitivity:20,scrollSpeed:20,snap:!1,snapMode:"both",snapTolerance:20,stack:!1,zIndex:!1},_create:function(){this.options.helper=="original"&&!/^(?:r|a|f)/.test(this.element.css("position"))&&(this.element[0].style.position="relative"),this.options.addClasses&&this.element.addClass("ui-draggable"),this.options.disabled&&this.element.addClass("ui-draggable-disabled"),this._mouseInit()},destroy:function(){if(!this.element.data("draggable"))return;return this.element.removeData("draggable").unbind(".draggable").removeClass("ui-draggable ui-draggable-dragging ui-draggable-disabled"),this._mouseDestroy(),this},_mouseCapture:function(b){var c=this.options;return this.helper||c.disabled||a(b.target).is(".ui-resizable-handle")?!1:(this.handle=this._getHandle(b),this.handle?(c.iframeFix&&a(c.iframeFix===!0?"iframe":c.iframeFix).each(function(){a('<div class="ui-draggable-iframeFix" style="background: #fff;"></div>').css({width:this.offsetWidth+"px",height:this.offsetHeight+"px",position:"absolute",opacity:"0.001",zIndex:1e3}).css(a(this).offset()).appendTo("body")}),!0):!1)},_mouseStart:function(b){var c=this.options;return this.helper=this._createHelper(b),this.helper.addClass("ui-draggable-dragging"),this._cacheHelperProportions(),a.ui.ddmanager&&(a.ui.ddmanager.current=this),this._cacheMargins(),this.cssPosition=this.helper.css("position"),this.scrollParent=this.helper.scrollParent(),this.offset=this.positionAbs=this.element.offset(),this.offset={top:this.offset.top-this.margins.top,left:this.offset.left-this.margins.left},a.extend(this.offset,{click:{left:b.pageX-this.offset.left,top:b.pageY-this.offset.top},parent:this._getParentOffset(),relative:this._getRelativeOffset()}),this.originalPosition=this.position=this._generatePosition(b),this.originalPageX=b.pageX,this.originalPageY=b.pageY,c.cursorAt&&this._adjustOffsetFromHelper(c.cursorAt),c.containment&&this._setContainment(),this._trigger("start",b)===!1?(this._clear(),!1):(this._cacheHelperProportions(),a.ui.ddmanager&&!c.dropBehaviour&&a.ui.ddmanager.prepareOffsets(this,b),this._mouseDrag(b,!0),a.ui.ddmanager&&a.ui.ddmanager.dragStart(this,b),!0)},


	_mouseDrag:function(b,c){
	   if(wireitdraggableelementbody) {
		  return false;
	   }
	   var s=(this.element.hasClass('WireIt-Draggable-Element')?(current_scale?((current_scale==0.5)?2:((current_scale==0.75)?1.333:((current_scale==0.25)?4:1))):1):1);
	   this.position=this._generatePosition(b),
		  this.positionAbs=this._convertPositionTo("absolute");
	   if(!c){
		  var d=this._uiHash();
		  if(this._trigger("drag",b,d)===!1) {
			 if(typeof(redraw_all_wires) == 'function') {
				redraw_all_wires();
			 }
			 return this._mouseUp({}),!1;this.position=d.position
		  }
	   }
	if(!this.options.axis||this.options.axis!="y")
	   this.helper[0].style.left=(this.position.left * s)+"px";
	if(!this.options.axis||this.options.axis!="x")
	   this.helper[0].style.top=(this.position.top *s)+"px";
	if(typeof(redraw_all_wires) == 'function') {
	   redraw_all_wires();
	}
	return a.ui.ddmanager&&a.ui.ddmanager.drag(this,b),!1
	},


	_mouseStop:function(b){
	   var c=!1;
	   a.ui.ddmanager&&!this.options.dropBehaviour&&(c=a.ui.ddmanager.drop(this,b)),
	   this.dropped&&(c=this.dropped,this.dropped=!1);
	   var d=this.element[0],
		  e=!1;
	   while(d&&(d=d.parentNode))
		  d==document&&(e=!0);
	   if(!e&&this.options.helper==="original")
		  return!1;
	   if(this.options.revert=="invalid"&&!c||this.options.revert=="valid"&&c||this.options.revert===!0||a.isFunction(this.options.revert)&&this.options.revert.call(this.element,c)){
		  var f=this;
		  console.log(this.originalPosition);
		  a(this.helper).animate(
			 this.originalPosition,
			 parseInt(this.options.revertDuration,10),
			 function(){
				f._trigger("stop",b)!==!1&&f._clear()
			 }
		  )
	   }else 
	   this._trigger("stop",b)!==!1&&this._clear();
	   return!1
	},


	_mouseUp:function(b){
	   return this.options.iframeFix===!0&&a("div.ui-draggable-iframeFix").each(function(){
		  this.parentNode.removeChild(this)}),
			 a.ui.ddmanager&&a.ui.ddmanager.dragStop(this,b),a.ui.mouse.prototype._mouseUp.call(this,b)
	},



	cancel:function(){return this.helper.is(".ui-draggable-dragging")?this._mouseUp({}):this._clear(),this},_getHandle:function(b){var c=!this.options.handle||!a(this.options.handle,this.element).length?!0:!1;return a(this.options.handle,this.element).find("*").andSelf().each(function(){this==b.target&&(c=!0)}),c},_createHelper:function(b){var c=this.options,d=a.isFunction(c.helper)?a(c.helper.apply(this.element[0],[b])):c.helper=="clone"?this.element.clone().removeAttr("id"):this.element;return d.parents("body").length||d.appendTo(c.appendTo=="parent"?this.element[0].parentNode:c.appendTo),d[0]!=this.element[0]&&!/(fixed|absolute)/.test(d.css("position"))&&d.css("position","absolute"),d},_adjustOffsetFromHelper:function(b){typeof b=="string"&&(b=b.split(" ")),a.isArray(b)&&(b={left:+b[0],top:+b[1]||0}),"left"in b&&(this.offset.click.left=b.left+this.margins.left),"right"in b&&(this.offset.click.left=this.helperProportions.width-b.right+this.margins.left),"top"in b&&(this.offset.click.top=b.top+this.margins.top),"bottom"in b&&(this.offset.click.top=this.helperProportions.height-b.bottom+this.margins.top)},_getParentOffset:function(){this.offsetParent=this.helper.offsetParent();var b=this.offsetParent.offset();this.cssPosition=="absolute"&&this.scrollParent[0]!=document&&a.ui.contains(this.scrollParent[0],this.offsetParent[0])&&(b.left+=this.scrollParent.scrollLeft(),b.top+=this.scrollParent.scrollTop());if(this.offsetParent[0]==document.body||this.offsetParent[0].tagName&&this.offsetParent[0].tagName.toLowerCase()=="html"&&a.browser.msie)b={top:0,left:0};return{top:b.top+(parseInt(this.offsetParent.css("borderTopWidth"),10)||0),left:b.left+(parseInt(this.offsetParent.css("borderLeftWidth"),10)||0)}},_getRelativeOffset:function(){if(this.cssPosition=="relative"){var a=this.element.position();return{top:a.top-(parseInt(this.helper.css("top"),10)||0)+this.scrollParent.scrollTop(),left:a.left-(parseInt(this.helper.css("left"),10)||0)+this.scrollParent.scrollLeft()}}return{top:0,left:0}},_cacheMargins:function(){this.margins={left:parseInt(this.element.css("marginLeft"),10)||0,top:parseInt(this.element.css("marginTop"),10)||0,right:parseInt(this.element.css("marginRight"),10)||0,bottom:parseInt(this.element.css("marginBottom"),10)||0}},_cacheHelperProportions:function(){this.helperProportions={width:this.helper.outerWidth(),height:this.helper.outerHeight()}},_setContainment:function(){var b=this.options;b.containment=="parent"&&(b.containment=this.helper[0].parentNode);if(b.containment=="document"||b.containment=="window")this.containment=[b.containment=="document"?0:a(window).scrollLeft()-this.offset.relative.left-this.offset.parent.left,b.containment=="document"?0:a(window).scrollTop()-this.offset.relative.top-this.offset.parent.top,(b.containment=="document"?0:a(window).scrollLeft())+a(b.containment=="document"?document:window).width()-this.helperProportions.width-this.margins.left,(b.containment=="document"?0:a(window).scrollTop())+(a(b.containment=="document"?document:window).height()||document.body.parentNode.scrollHeight)-this.helperProportions.height-this.margins.top];if(!/^(document|window|parent)$/.test(b.containment)&&b.containment.constructor!=Array){var c=a(b.containment),d=c[0];if(!d)return;var e=c.offset(),f=a(d).css("overflow")!="hidden";this.containment=[(parseInt(a(d).css("borderLeftWidth"),10)||0)+(parseInt(a(d).css("paddingLeft"),10)||0),(parseInt(a(d).css("borderTopWidth"),10)||0)+(parseInt(a(d).css("paddingTop"),10)||0),(f?Math.max(d.scrollWidth,d.offsetWidth):d.offsetWidth)-(parseInt(a(d).css("borderLeftWidth"),10)||0)-(parseInt(a(d).css("paddingRight"),10)||0)-this.helperProportions.width-this.margins.left-this.margins.right,(f?Math.max(d.scrollHeight,d.offsetHeight):d.offsetHeight)-(parseInt(a(d).css("borderTopWidth"),10)||0)-(parseInt(a(d).css("paddingBottom"),10)||0)-this.helperProportions.height-this.margins.top-this.margins.bottom],this.relative_container=c}else b.containment.constructor==Array&&(this.containment=b.containment)},_convertPositionTo:function(b,c){c||(c=this.position);var d=b=="absolute"?1:-1,e=this.options,f=this.cssPosition=="absolute"&&(this.scrollParent[0]==document||!a.ui.contains(this.scrollParent[0],this.offsetParent[0]))?this.offsetParent:this.scrollParent,g=/(html|body)/i.test(f[0].tagName);return{top:c.top+this.offset.relative.top*d+this.offset.parent.top*d-(a.browser.safari&&a.browser.version<526&&this.cssPosition=="fixed"?0:(this.cssPosition=="fixed"?-this.scrollParent.scrollTop():g?0:f.scrollTop())*d),left:c.left+this.offset.relative.left*d+this.offset.parent.left*d-(a.browser.safari&&a.browser.version<526&&this.cssPosition=="fixed"?0:(this.cssPosition=="fixed"?-this.scrollParent.scrollLeft():g?0:f.scrollLeft())*d)}},_generatePosition:function(b){var c=this.options,d=this.cssPosition=="absolute"&&(this.scrollParent[0]==document||!a.ui.contains(this.scrollParent[0],this.offsetParent[0]))?this.offsetParent:this.scrollParent,e=/(html|body)/i.test(d[0].tagName),f=b.pageX,g=b.pageY;if(this.originalPosition){var h;if(this.containment){if(this.relative_container){var i=this.relative_container.offset();h=[this.containment[0]+i.left,this.containment[1]+i.top,this.containment[2]+i.left,this.containment[3]+i.top]}else h=this.containment;b.pageX-this.offset.click.left<h[0]&&(f=h[0]+this.offset.click.left),b.pageY-this.offset.click.top<h[1]&&(g=h[1]+this.offset.click.top),b.pageX-this.offset.click.left>h[2]&&(f=h[2]+this.offset.click.left),b.pageY-this.offset.click.top>h[3]&&(g=h[3]+this.offset.click.top)}if(c.grid){var j=c.grid[1]?this.originalPageY+Math.round((g-this.originalPageY)/c.grid[1])*c.grid[1]:this.originalPageY;g=h?j-this.offset.click.top<h[1]||j-this.offset.click.top>h[3]?j-this.offset.click.top<h[1]?j+c.grid[1]:j-c.grid[1]:j:j;var k=c.grid[0]?this.originalPageX+Math.round((f-this.originalPageX)/c.grid[0])*c.grid[0]:this.originalPageX;f=h?k-this.offset.click.left<h[0]||k-this.offset.click.left>h[2]?k-this.offset.click.left<h[0]?k+c.grid[0]:k-c.grid[0]:k:k}}return{top:g-this.offset.click.top-this.offset.relative.top-this.offset.parent.top+(a.browser.safari&&a.browser.version<526&&this.cssPosition=="fixed"?0:this.cssPosition=="fixed"?-this.scrollParent.scrollTop():e?0:d.scrollTop()),left:f-this.offset.click.left-this.offset.relative.left-this.offset.parent.left+(a.browser.safari&&a.browser.version<526&&this.cssPosition=="fixed"?0:this.cssPosition=="fixed"?-this.scrollParent.scrollLeft():e?0:d.scrollLeft())}},_clear:function(){this.helper.removeClass("ui-draggable-dragging"),this.helper[0]!=this.element[0]&&!this.cancelHelperRemoval&&this.helper.remove(),this.helper=null,this.cancelHelperRemoval=!1},_trigger:function(b,c,d){return d=d||this._uiHash(),a.ui.plugin.call(this,b,[c,d]),b=="drag"&&(this.positionAbs=this._convertPositionTo("absolute")),a.Widget.prototype._trigger.call(this,b,c,d)},plugins:{},_uiHash:function(a){return{helper:this.helper,position:this.position,originalPosition:this.originalPosition,offset:this.positionAbs}}}),a.extend(a.ui.draggable,{version:"1.8.21"}),a.ui.plugin.add("draggable","connectToSortable",{start:function(b,c){var d=a(this).data("draggable"),e=d.options,f=a.extend({},c,{item:d.element});d.sortables=[],a(e.connectToSortable).each(function(){var c=a.data(this,"sortable");c&&!c.options.disabled&&(d.sortables.push({instance:c,shouldRevert:c.options.revert}),c.refreshPositions(),c._trigger("activate",b,f))})},stop:function(b,c){var d=a(this).data("draggable"),e=a.extend({},c,{item:d.element});a.each(d.sortables,function(){this.instance.isOver?(this.instance.isOver=0,d.cancelHelperRemoval=!0,this.instance.cancelHelperRemoval=!1,this.shouldRevert&&(this.instance.options.revert=!0),this.instance._mouseStop(b),this.instance.options.helper=this.instance.options._helper,d.options.helper=="original"&&this.instance.currentItem.css({top:"auto",left:"auto"})):(this.instance.cancelHelperRemoval=!1,this.instance._trigger("deactivate",b,e))})},drag:function(b,c){var d=a(this).data("draggable"),e=this,f=function(b){var c=this.offset.click.top,d=this.offset.click.left,e=this.positionAbs.top,f=this.positionAbs.left,g=b.height,h=b.width,i=b.top,j=b.left;return a.ui.isOver(e+c,f+d,i,j,g,h)};a.each(d.sortables,function(f){this.instance.positionAbs=d.positionAbs,this.instance.helperProportions=d.helperProportions,this.instance.offset.click=d.offset.click,this.instance._intersectsWith(this.instance.containerCache)?(this.instance.isOver||(this.instance.isOver=1,this.instance.currentItem=a(e).clone().removeAttr("id").appendTo(this.instance.element).data("sortable-item",!0),this.instance.options._helper=this.instance.options.helper,this.instance.options.helper=function(){return c.helper[0]},b.target=this.instance.currentItem[0],this.instance._mouseCapture(b,!0),this.instance._mouseStart(b,!0,!0),this.instance.offset.click.top=d.offset.click.top,this.instance.offset.click.left=d.offset.click.left,this.instance.offset.parent.left-=d.offset.parent.left-this.instance.offset.parent.left,this.instance.offset.parent.top-=d.offset.parent.top-this.instance.offset.parent.top,d._trigger("toSortable",b),d.dropped=this.instance.element,d.currentItem=d.element,this.instance.fromOutside=d),this.instance.currentItem&&this.instance._mouseDrag(b)):this.instance.isOver&&(this.instance.isOver=0,this.instance.cancelHelperRemoval=!0,this.instance.options.revert=!1,this.instance._trigger("out",b,this.instance._uiHash(this.instance)),this.instance._mouseStop(b,!0),this.instance.options.helper=this.instance.options._helper,this.instance.currentItem.remove(),this.instance.placeholder&&this.instance.placeholder.remove(),d._trigger("fromSortable",b),d.dropped=!1)})}}),a.ui.plugin.add("draggable","cursor",{start:function(b,c){var d=a("body"),e=a(this).data("draggable").options;d.css("cursor")&&(e._cursor=d.css("cursor")),d.css("cursor",e.cursor)},stop:function(b,c){var d=a(this).data("draggable").options;d._cursor&&a("body").css("cursor",d._cursor)}}),a.ui.plugin.add("draggable","opacity",{start:function(b,c){var d=a(c.helper),e=a(this).data("draggable").options;d.css("opacity")&&(e._opacity=d.css("opacity")),d.css("opacity",e.opacity)},stop:function(b,c){var d=a(this).data("draggable").options;d._opacity&&a(c.helper).css("opacity",d._opacity)}}),a.ui.plugin.add("draggable","scroll",{start:function(b,c){var d=a(this).data("draggable");d.scrollParent[0]!=document&&d.scrollParent[0].tagName!="HTML"&&(d.overflowOffset=d.scrollParent.offset())},drag:function(b,c){var d=a(this).data("draggable"),e=d.options,f=!1;if(d.scrollParent[0]!=document&&d.scrollParent[0].tagName!="HTML"){if(!e.axis||e.axis!="x")d.overflowOffset.top+d.scrollParent[0].offsetHeight-b.pageY<e.scrollSensitivity?d.scrollParent[0].scrollTop=f=d.scrollParent[0].scrollTop+e.scrollSpeed:b.pageY-d.overflowOffset.top<e.scrollSensitivity&&(d.scrollParent[0].scrollTop=f=d.scrollParent[0].scrollTop-e.scrollSpeed);if(!e.axis||e.axis!="y")d.overflowOffset.left+d.scrollParent[0].offsetWidth-b.pageX<e.scrollSensitivity?d.scrollParent[0].scrollLeft=f=d.scrollParent[0].scrollLeft+e.scrollSpeed:b.pageX-d.overflowOffset.left<e.scrollSensitivity&&(d.scrollParent[0].scrollLeft=f=d.scrollParent[0].scrollLeft-e.scrollSpeed)}else{if(!e.axis||e.axis!="x")b.pageY-a(document).scrollTop()<e.scrollSensitivity?f=a(document).scrollTop(a(document).scrollTop()-e.scrollSpeed):a(window).height()-(b.pageY-a(document).scrollTop())<e.scrollSensitivity&&(f=a(document).scrollTop(a(document).scrollTop()+e.scrollSpeed));if(!e.axis||e.axis!="y")b.pageX-a(document).scrollLeft()<e.scrollSensitivity?f=a(document).scrollLeft(a(document).scrollLeft()-e.scrollSpeed):a(window).width()-(b.pageX-a(document).scrollLeft())<e.scrollSensitivity&&(f=a(document).scrollLeft(a(document).scrollLeft()+e.scrollSpeed))}f!==!1&&a.ui.ddmanager&&!e.dropBehaviour&&a.ui.ddmanager.prepareOffsets(d,b)}}),a.ui.plugin.add("draggable","snap",{start:function(b,c){var d=a(this).data("draggable"),e=d.options;d.snapElements=[],a(e.snap.constructor!=String?e.snap.items||":data(draggable)":e.snap).each(function(){var b=a(this),c=b.offset();this!=d.element[0]&&d.snapElements.push({item:this,width:b.outerWidth(),height:b.outerHeight(),top:c.top,left:c.left})})},drag:function(b,c){var d=a(this).data("draggable"),e=d.options,f=e.snapTolerance,g=c.offset.left,h=g+d.helperProportions.width,i=c.offset.top,j=i+d.helperProportions.height;for(var k=d.snapElements.length-1;k>=0;k--){var l=d.snapElements[k].left,m=l+d.snapElements[k].width,n=d.snapElements[k].top,o=n+d.snapElements[k].height;if(!(l-f<g&&g<m+f&&n-f<i&&i<o+f||l-f<g&&g<m+f&&n-f<j&&j<o+f||l-f<h&&h<m+f&&n-f<i&&i<o+f||l-f<h&&h<m+f&&n-f<j&&j<o+f)){d.snapElements[k].snapping&&d.options.snap.release&&d.options.snap.release.call(d.element,b,a.extend(d._uiHash(),{snapItem:d.snapElements[k].item})),d.snapElements[k].snapping=!1;continue}if(e.snapMode!="inner"){var p=Math.abs(n-j)<=f,q=Math.abs(o-i)<=f,r=Math.abs(l-h)<=f,s=Math.abs(m-g)<=f;p&&(c.position.top=d._convertPositionTo("relative",{top:n-d.helperProportions.height,left:0}).top-d.margins.top),q&&(c.position.top=d._convertPositionTo("relative",{top:o,left:0}).top-d.margins.top),r&&(c.position.left=d._convertPositionTo("relative",{top:0,left:l-d.helperProportions.width}).left-d.margins.left),s&&(c.position.left=d._convertPositionTo("relative",{top:0,left:m}).left-d.margins.left)}var t=p||q||r||s;if(e.snapMode!="outer"){var p=Math.abs(n-i)<=f,q=Math.abs(o-j)<=f,r=Math.abs(l-g)<=f,s=Math.abs(m-h)<=f;p&&(c.position.top=d._convertPositionTo("relative",{top:n,left:0}).top-d.margins.top),q&&(c.position.top=d._convertPositionTo("relative",{top:o-d.helperProportions.height,left:0}).top-d.margins.top),r&&(c.position.left=d._convertPositionTo("relative",{top:0,left:l}).left-d.margins.left),s&&(c.position.left=d._convertPositionTo("relative",{top:0,left:m-d.helperProportions.width}).left-d.margins.left)}!d.snapElements[k].snapping&&(p||q||r||s||t)&&d.options.snap.snap&&d.options.snap.snap.call(d.element,b,a.extend(d._uiHash(),{snapItem:d.snapElements[k].item})),d.snapElements[k].snapping=p||q||r||s||t}}}),a.ui.plugin.add("draggable","stack",{start:function(b,c){var d=a(this).data("draggable").options,e=a.makeArray(a(d.stack)).sort(function(b,c){return(parseInt(a(b).css("zIndex"),10)||0)-(parseInt(a(c).css("zIndex"),10)||0)});if(!e.length)return;var f=parseInt(e[0].style.zIndex)||0;a(e).each(function(a){this.style.zIndex=f+a}),this[0].style.zIndex=f+e.length}}),a.ui.plugin.add("draggable","zIndex",{start:function(b,c){var d=a(c.helper),e=a(this).data("draggable").options;d.css("zIndex")&&(e._zIndex=d.css("zIndex")),d.css("zIndex",e.zIndex)},stop:function(b,c){var d=a(this).data("draggable").options;d._zIndex&&a(c.helper).css("zIndex",d._zIndex)}})})(jQuery);;/*! jQuery UI - v1.8.21 - 2012-06-05
	* https://github.com/jquery/jquery-ui
	* Includes: jquery.ui.droppable.js
	* Copyright (c) 2012 AUTHORS.txt; Licensed MIT, GPL */
	(function(a,b){a.widget("ui.droppable",{widgetEventPrefix:"drop",options:{accept:"*",activeClass:!1,addClasses:!0,greedy:!1,hoverClass:!1,scope:"default",tolerance:"intersect"},_create:function(){var b=this.options,c=b.accept;this.isover=0,this.isout=1,this.accept=a.isFunction(c)?c:function(a){return a.is(c)},this.proportions={width:this.element[0].offsetWidth,height:this.element[0].offsetHeight},a.ui.ddmanager.droppables[b.scope]=a.ui.ddmanager.droppables[b.scope]||[],a.ui.ddmanager.droppables[b.scope].push(this),b.addClasses&&this.element.addClass("ui-droppable")},destroy:function(){var b=a.ui.ddmanager.droppables[this.options.scope];for(var c=0;c<b.length;c++)b[c]==this&&b.splice(c,1);return this.element.removeClass("ui-droppable ui-droppable-disabled").removeData("droppable").unbind(".droppable"),this},_setOption:function(b,c){b=="accept"&&(this.accept=a.isFunction(c)?c:function(a){return a.is(c)}),a.Widget.prototype._setOption.apply(this,arguments)},_activate:function(b){var c=a.ui.ddmanager.current;this.options.activeClass&&this.element.addClass(this.options.activeClass),c&&this._trigger("activate",b,this.ui(c))},_deactivate:function(b){var c=a.ui.ddmanager.current;this.options.activeClass&&this.element.removeClass(this.options.activeClass),c&&this._trigger("deactivate",b,this.ui(c))},_over:function(b){var c=a.ui.ddmanager.current;if(!c||(c.currentItem||c.element)[0]==this.element[0])return;this.accept.call(this.element[0],c.currentItem||c.element)&&(this.options.hoverClass&&this.element.addClass(this.options.hoverClass),this._trigger("over",b,this.ui(c)))},_out:function(b){var c=a.ui.ddmanager.current;if(!c||(c.currentItem||c.element)[0]==this.element[0])return;this.accept.call(this.element[0],c.currentItem||c.element)&&(this.options.hoverClass&&this.element.removeClass(this.options.hoverClass),this._trigger("out",b,this.ui(c)))},_drop:function(b,c){var d=c||a.ui.ddmanager.current;if(!d||(d.currentItem||d.element)[0]==this.element[0])return!1;var e=!1;return this.element.find(":data(droppable)").not(".ui-draggable-dragging").each(function(){var b=a.data(this,"droppable");if(b.options.greedy&&!b.options.disabled&&b.options.scope==d.options.scope&&b.accept.call(b.element[0],d.currentItem||d.element)&&a.ui.intersect(d,a.extend(b,{offset:b.element.offset()}),b.options.tolerance))return e=!0,!1}),e?!1:this.accept.call(this.element[0],d.currentItem||d.element)?(this.options.activeClass&&this.element.removeClass(this.options.activeClass),this.options.hoverClass&&this.element.removeClass(this.options.hoverClass),this._trigger("drop",b,this.ui(d)),this.element):!1},ui:function(a){return{draggable:a.currentItem||a.element,helper:a.helper,position:a.position,offset:a.positionAbs}}}),a.extend(a.ui.droppable,{version:"1.8.21"}),a.ui.intersect=function(b,c,d){if(!c.offset)return!1;var e=(b.positionAbs||b.position.absolute).left,f=e+b.helperProportions.width,g=(b.positionAbs||b.position.absolute).top,h=g+b.helperProportions.height,i=c.offset.left,j=i+c.proportions.width,k=c.offset.top,l=k+c.proportions.height;switch(d){case"fit":return i<=e&&f<=j&&k<=g&&h<=l;case"intersect":return i<e+b.helperProportions.width/2&&f-b.helperProportions.width/2<j&&k<g+b.helperProportions.height/2&&h-b.helperProportions.height/2<l;case"pointer":var m=(b.positionAbs||b.position.absolute).left+(b.clickOffset||b.offset.click).left,n=(b.positionAbs||b.position.absolute).top+(b.clickOffset||b.offset.click).top,o=a.ui.isOver(n,m,k,i,c.proportions.height,c.proportions.width);return o;case"touch":return(g>=k&&g<=l||h>=k&&h<=l||g<k&&h>l)&&(e>=i&&e<=j||f>=i&&f<=j||e<i&&f>j);default:return!1}},a.ui.ddmanager={current:null,droppables:{"default":[]},prepareOffsets:function(b,c){var d=a.ui.ddmanager.droppables[b.options.scope]||[],e=c?c.type:null,f=(b.currentItem||b.element).find(":data(droppable)").andSelf();g:for(var h=0;h<d.length;h++){if(d[h].options.disabled||b&&!d[h].accept.call(d[h].element[0],b.currentItem||b.element))continue;for(var i=0;i<f.length;i++)if(f[i]==d[h].element[0]){d[h].proportions.height=0;continue g}d[h].visible=d[h].element.css("display")!="none";if(!d[h].visible)continue;e=="mousedown"&&d[h]._activate.call(d[h],c),d[h].offset=d[h].element.offset(),d[h].proportions={width:d[h].element[0].offsetWidth,height:d[h].element[0].offsetHeight}}},drop:function(b,c){var d=!1;return a.each(a.ui.ddmanager.droppables[b.options.scope]||[],function(){if(!this.options)return;!this.options.disabled&&this.visible&&a.ui.intersect(b,this,this.options.tolerance)&&(d=this._drop.call(this,c)||d),!this.options.disabled&&this.visible&&this.accept.call(this.element[0],b.currentItem||b.element)&&(this.isout=1,this.isover=0,this._deactivate.call(this,c))}),d},dragStart:function(b,c){b.element.parents(":not(body,html)").bind("scroll.droppable",function(){b.options.refreshPositions||a.ui.ddmanager.prepareOffsets(b,c)})},drag:function(b,c){b.options.refreshPositions&&a.ui.ddmanager.prepareOffsets(b,c),a.each(a.ui.ddmanager.droppables[b.options.scope]||[],function(){if(this.options.disabled||this.greedyChild||!this.visible)return;var d=a.ui.intersect(b,this,this.options.tolerance),e=!d&&this.isover==1?"isout":d&&this.isover==0?"isover":null;if(!e)return;var f;if(this.options.greedy){var g=this.element.parents(":data(droppable):eq(0)");g.length&&(f=a.data(g[0],"droppable"),f.greedyChild=e=="isover"?1:0)}f&&e=="isover"&&(f.isover=0,f.isout=1,f._out.call(f,c)),this[e]=1,this[e=="isout"?"isover":"isout"]=0,this[e=="isover"?"_over":"_out"].call(this,c),f&&e=="isout"&&(f.isout=0,f.isover=1,f._over.call(f,c))})},dragStop:function(b,c){b.element.parents(":not(body,html)").unbind("scroll.droppable"),b.options.refreshPositions||a.ui.ddmanager.prepareOffsets(b,c)}}})(jQuery);;/*! jQuery UI - v1.8.21 - 2012-06-05
	* https://github.com/jquery/jquery-ui
	* Includes: jquery.ui.resizable.js
	* Copyright (c) 2012 AUTHORS.txt; Licensed MIT, GPL */
	(function(a,b){a.widget("ui.resizable",a.ui.mouse,{widgetEventPrefix:"resize",options:{alsoResize:!1,animate:!1,animateDuration:"slow",animateEasing:"swing",aspectRatio:!1,autoHide:!1,containment:!1,ghost:!1,grid:!1,handles:"e,s,se",helper:!1,maxHeight:null,maxWidth:null,minHeight:10,minWidth:10,zIndex:1e3},_create:function(){var b=this,c=this.options;this.element.addClass("ui-resizable"),a.extend(this,{_aspectRatio:!!c.aspectRatio,aspectRatio:c.aspectRatio,originalElement:this.element,_proportionallyResizeElements:[],_helper:c.helper||c.ghost||c.animate?c.helper||"ui-resizable-helper":null}),this.element[0].nodeName.match(/canvas|textarea|input|select|button|img/i)&&(this.element.wrap(a('<div class="ui-wrapper" style="overflow: hidden;"></div>').css({position:this.element.css("position"),width:this.element.outerWidth(),height:this.element.outerHeight(),top:this.element.css("top"),left:this.element.css("left")})),this.element=this.element.parent().data("resizable",this.element.data("resizable")),this.elementIsWrapper=!0,this.element.css({marginLeft:this.originalElement.css("marginLeft"),marginTop:this.originalElement.css("marginTop"),marginRight:this.originalElement.css("marginRight"),marginBottom:this.originalElement.css("marginBottom")}),this.originalElement.css({marginLeft:0,marginTop:0,marginRight:0,marginBottom:0}),this.originalResizeStyle=this.originalElement.css("resize"),this.originalElement.css("resize","none"),this._proportionallyResizeElements.push(this.originalElement.css({position:"static",zoom:1,display:"block"})),this.originalElement.css({margin:this.originalElement.css("margin")}),this._proportionallyResize()),this.handles=c.handles||(a(".ui-resizable-handle",this.element).length?{n:".ui-resizable-n",e:".ui-resizable-e",s:".ui-resizable-s",w:".ui-resizable-w",se:".ui-resizable-se",sw:".ui-resizable-sw",ne:".ui-resizable-ne",nw:".ui-resizable-nw"}:"e,s,se");if(this.handles.constructor==String){this.handles=="all"&&(this.handles="n,e,s,w,se,sw,ne,nw");var d=this.handles.split(",");this.handles={};for(var e=0;e<d.length;e++){var f=a.trim(d[e]),g="ui-resizable-"+f,h=a('<div class="ui-resizable-handle '+g+'"></div>');h.css({zIndex:c.zIndex}),"se"==f&&h.addClass("ui-icon ui-icon-gripsmall-diagonal-se"),this.handles[f]=".ui-resizable-"+f,this.element.append(h)}}this._renderAxis=function(b){b=b||this.element;for(var c in this.handles){this.handles[c].constructor==String&&(this.handles[c]=a(this.handles[c],this.element).show());if(this.elementIsWrapper&&this.originalElement[0].nodeName.match(/textarea|input|select|button/i)){var d=a(this.handles[c],this.element),e=0;e=/sw|ne|nw|se|n|s/.test(c)?d.outerHeight():d.outerWidth();var f=["padding",/ne|nw|n/.test(c)?"Top":/se|sw|s/.test(c)?"Bottom":/^e$/.test(c)?"Right":"Left"].join("");b.css(f,e),this._proportionallyResize()}if(!a(this.handles[c]).length)continue}},this._renderAxis(this.element),this._handles=a(".ui-resizable-handle",this.element).disableSelection(),this._handles.mouseover(function(){if(!b.resizing){if(this.className)var a=this.className.match(/ui-resizable-(se|sw|ne|nw|n|e|s|w)/i);b.axis=a&&a[1]?a[1]:"se"}}),c.autoHide&&(this._handles.hide(),a(this.element).addClass("ui-resizable-autohide").hover(function(){if(c.disabled)return;a(this).removeClass("ui-resizable-autohide"),b._handles.show()},function(){if(c.disabled)return;b.resizing||(a(this).addClass("ui-resizable-autohide"),b._handles.hide())})),this._mouseInit()},destroy:function(){this._mouseDestroy();var b=function(b){a(b).removeClass("ui-resizable ui-resizable-disabled ui-resizable-resizing").removeData("resizable").unbind(".resizable").find(".ui-resizable-handle").remove()};if(this.elementIsWrapper){b(this.element);var c=this.element;c.after(this.originalElement.css({position:c.css("position"),width:c.outerWidth(),height:c.outerHeight(),top:c.css("top"),left:c.css("left")})).remove()}return this.originalElement.css("resize",this.originalResizeStyle),b(this.originalElement),this},_mouseCapture:function(b){var c=!1;for(var d in this.handles)a(this.handles[d])[0]==b.target&&(c=!0);return!this.options.disabled&&c},_mouseStart:function(b){var d=this.options,e=this.element.position(),f=this.element;this.resizing=!0,this.documentScroll={top:a(document).scrollTop(),left:a(document).scrollLeft()},(f.is(".ui-draggable")||/absolute/.test(f.css("position")))&&f.css({position:"absolute",top:e.top,left:e.left}),this._renderProxy();var g=c(this.helper.css("left")),h=c(this.helper.css("top"));d.containment&&(g+=a(d.containment).scrollLeft()||0,h+=a(d.containment).scrollTop()||0),this.offset=this.helper.offset(),this.position={left:g,top:h},this.size=this._helper?{width:f.outerWidth(),height:f.outerHeight()}:{width:f.width(),height:f.height()},this.originalSize=this._helper?{width:f.outerWidth(),height:f.outerHeight()}:{width:f.width(),height:f.height()},this.originalPosition={left:g,top:h},this.sizeDiff={width:f.outerWidth()-f.width(),height:f.outerHeight()-f.height()},this.originalMousePosition={left:b.pageX,top:b.pageY},this.aspectRatio=typeof d.aspectRatio=="number"?d.aspectRatio:this.originalSize.width/this.originalSize.height||1;var i=a(".ui-resizable-"+this.axis).css("cursor");return a("body").css("cursor",i=="auto"?this.axis+"-resize":i),f.addClass("ui-resizable-resizing"),this._propagate("start",b),!0},_mouseDrag:function(b){var c=this.helper,d=this.options,e={},f=this,g=this.originalMousePosition,h=this.axis,i=b.pageX-g.left||0,j=b.pageY-g.top||0,k=this._change[h];if(!k)return!1;var l=k.apply(this,[b,i,j]),m=a.browser.msie&&a.browser.version<7,n=this.sizeDiff;this._updateVirtualBoundaries(b.shiftKey);if(this._aspectRatio||b.shiftKey)l=this._updateRatio(l,b);return l=this._respectSize(l,b),this._propagate("resize",b),c.css({top:this.position.top+"px",left:this.position.left+"px",width:this.size.width+"px",height:this.size.height+"px"}),!this._helper&&this._proportionallyResizeElements.length&&this._proportionallyResize(),this._updateCache(l),this._trigger("resize",b,this.ui()),!1},_mouseStop:function(b){this.resizing=!1;var c=this.options,d=this;if(this._helper){var e=this._proportionallyResizeElements,f=e.length&&/textarea/i.test(e[0].nodeName),g=f&&a.ui.hasScroll(e[0],"left")?0:d.sizeDiff.height,h=f?0:d.sizeDiff.width,i={width:d.helper.width()-h,height:d.helper.height()-g},j=parseInt(d.element.css("left"),10)+(d.position.left-d.originalPosition.left)||null,k=parseInt(d.element.css("top"),10)+(d.position.top-d.originalPosition.top)||null;c.animate||this.element.css(a.extend(i,{top:k,left:j})),d.helper.height(d.size.height),d.helper.width(d.size.width),this._helper&&!c.animate&&this._proportionallyResize()}return a("body").css("cursor","auto"),this.element.removeClass("ui-resizable-resizing"),this._propagate("stop",b),this._helper&&this.helper.remove(),!1},_updateVirtualBoundaries:function(a){var b=this.options,c,e,f,g,h;h={minWidth:d(b.minWidth)?b.minWidth:0,maxWidth:d(b.maxWidth)?b.maxWidth:Infinity,minHeight:d(b.minHeight)?b.minHeight:0,maxHeight:d(b.maxHeight)?b.maxHeight:Infinity};if(this._aspectRatio||a)c=h.minHeight*this.aspectRatio,f=h.minWidth/this.aspectRatio,e=h.maxHeight*this.aspectRatio,g=h.maxWidth/this.aspectRatio,c>h.minWidth&&(h.minWidth=c),f>h.minHeight&&(h.minHeight=f),e<h.maxWidth&&(h.maxWidth=e),g<h.maxHeight&&(h.maxHeight=g);this._vBoundaries=h},_updateCache:function(a){var b=this.options;this.offset=this.helper.offset(),d(a.left)&&(this.position.left=a.left),d(a.top)&&(this.position.top=a.top),d(a.height)&&(this.size.height=a.height),d(a.width)&&(this.size.width=a.width)},_updateRatio:function(a,b){var c=this.options,e=this.position,f=this.size,g=this.axis;return d(a.height)?a.width=a.height*this.aspectRatio:d(a.width)&&(a.height=a.width/this.aspectRatio),g=="sw"&&(a.left=e.left+(f.width-a.width),a.top=null),g=="nw"&&(a.top=e.top+(f.height-a.height),a.left=e.left+(f.width-a.width)),a},_respectSize:function(a,b){var c=this.helper,e=this._vBoundaries,f=this._aspectRatio||b.shiftKey,g=this.axis,h=d(a.width)&&e.maxWidth&&e.maxWidth<a.width,i=d(a.height)&&e.maxHeight&&e.maxHeight<a.height,j=d(a.width)&&e.minWidth&&e.minWidth>a.width,k=d(a.height)&&e.minHeight&&e.minHeight>a.height;j&&(a.width=e.minWidth),k&&(a.height=e.minHeight),h&&(a.width=e.maxWidth),i&&(a.height=e.maxHeight);var l=this.originalPosition.left+this.originalSize.width,m=this.position.top+this.size.height,n=/sw|nw|w/.test(g),o=/nw|ne|n/.test(g);j&&n&&(a.left=l-e.minWidth),h&&n&&(a.left=l-e.maxWidth),k&&o&&(a.top=m-e.minHeight),i&&o&&(a.top=m-e.maxHeight);var p=!a.width&&!a.height;return p&&!a.left&&a.top?a.top=null:p&&!a.top&&a.left&&(a.left=null),a},_proportionallyResize:function(){var b=this.options;if(!this._proportionallyResizeElements.length)return;var c=this.helper||this.element;for(var d=0;d<this._proportionallyResizeElements.length;d++){var e=this._proportionallyResizeElements[d];if(!this.borderDif){var f=[e.css("borderTopWidth"),e.css("borderRightWidth"),e.css("borderBottomWidth"),e.css("borderLeftWidth")],g=[e.css("paddingTop"),e.css("paddingRight"),e.css("paddingBottom"),e.css("paddingLeft")];this.borderDif=a.map(f,function(a,b){var c=parseInt(a,10)||0,d=parseInt(g[b],10)||0;return c+d})}if(!a.browser.msie||!a(c).is(":hidden")&&!a(c).parents(":hidden").length)e.css({height:c.height()-this.borderDif[0]-this.borderDif[2]||0,width:c.width()-this.borderDif[1]-this.borderDif[3]||0});else continue}},_renderProxy:function(){var b=this.element,c=this.options;this.elementOffset=b.offset();if(this._helper){this.helper=this.helper||a('<div style="overflow:hidden;"></div>');var d=a.browser.msie&&a.browser.version<7,e=d?1:0,f=d?2:-1;this.helper.addClass(this._helper).css({width:this.element.outerWidth()+f,height:this.element.outerHeight()+f,position:"absolute",left:this.elementOffset.left-e+"px",top:this.elementOffset.top-e+"px",zIndex:++c.zIndex}),this.helper.appendTo("body").disableSelection()}else this.helper=this.element},_change:{e:function(a,b,c){return{width:this.originalSize.width+b}},w:function(a,b,c){var d=this.options,e=this.originalSize,f=this.originalPosition;return{left:f.left+b,width:e.width-b}},n:function(a,b,c){var d=this.options,e=this.originalSize,f=this.originalPosition;return{top:f.top+c,height:e.height-c}},s:function(a,b,c){return{height:this.originalSize.height+c}},se:function(b,c,d){return a.extend(this._change.s.apply(this,arguments),this._change.e.apply(this,[b,c,d]))},sw:function(b,c,d){return a.extend(this._change.s.apply(this,arguments),this._change.w.apply(this,[b,c,d]))},ne:function(b,c,d){return a.extend(this._change.n.apply(this,arguments),this._change.e.apply(this,[b,c,d]))},nw:function(b,c,d){return a.extend(this._change.n.apply(this,arguments),this._change.w.apply(this,[b,c,d]))}},_propagate:function(b,c){a.ui.plugin.call(this,b,[c,this.ui()]),b!="resize"&&this._trigger(b,c,this.ui())},plugins:{},ui:function(){return{originalElement:this.originalElement,element:this.element,helper:this.helper,position:this.position,size:this.size,originalSize:this.originalSize,originalPosition:this.originalPosition}}}),a.extend(a.ui.resizable,{version:"1.8.21"}),a.ui.plugin.add("resizable","alsoResize",{start:function(b,c){var d=a(this).data("resizable"),e=d.options,f=function(b){a(b).each(function(){var b=a(this);b.data("resizable-alsoresize",{width:parseInt(b.width(),10),height:parseInt(b.height(),10),left:parseInt(b.css("left"),10),top:parseInt(b.css("top"),10)})})};typeof e.alsoResize=="object"&&!e.alsoResize.parentNode?e.alsoResize.length?(e.alsoResize=e.alsoResize[0],f(e.alsoResize)):a.each(e.alsoResize,function(a){f(a)}):f(e.alsoResize)},resize:function(b,c){var d=a(this).data("resizable"),e=d.options,f=d.originalSize,g=d.originalPosition,h={height:d.size.height-f.height||0,width:d.size.width-f.width||0,top:d.position.top-g.top||0,left:d.position.left-g.left||0},i=function(b,d){a(b).each(function(){var b=a(this),e=a(this).data("resizable-alsoresize"),f={},g=d&&d.length?d:b.parents(c.originalElement[0]).length?["width","height"]:["width","height","top","left"];a.each(g,function(a,b){var c=(e[b]||0)+(h[b]||0);c&&c>=0&&(f[b]=c||null)}),b.css(f)})};typeof e.alsoResize=="object"&&!e.alsoResize.nodeType?a.each(e.alsoResize,function(a,b){i(a,b)}):i(e.alsoResize)},stop:function(b,c){a(this).removeData("resizable-alsoresize")}}),a.ui.plugin.add("resizable","animate",{stop:function(b,c){var d=a(this).data("resizable"),e=d.options,f=d._proportionallyResizeElements,g=f.length&&/textarea/i.test(f[0].nodeName),h=g&&a.ui.hasScroll(f[0],"left")?0:d.sizeDiff.height,i=g?0:d.sizeDiff.width,j={width:d.size.width-i,height:d.size.height-h},k=parseInt(d.element.css("left"),10)+(d.position.left-d.originalPosition.left)||null,l=parseInt(d.element.css("top"),10)+(d.position.top-d.originalPosition.top)||null;d.element.animate(a.extend(j,l&&k?{top:l,left:k}:{}),{duration:e.animateDuration,easing:e.animateEasing,step:function(){var c={width:parseInt(d.element.css("width"),10),height:parseInt(d.element.css("height"),10),top:parseInt(d.element.css("top"),10),left:parseInt(d.element.css("left"),10)};f&&f.length&&a(f[0]).css({width:c.width,height:c.height}),d._updateCache(c),d._propagate("resize",b)}})}}),a.ui.plugin.add("resizable","containment",{start:function(b,d){var e=a(this).data("resizable"),f=e.options,g=e.element,h=f.containment,i=h instanceof a?h.get(0):/parent/.test(h)?g.parent().get(0):h;if(!i)return;e.containerElement=a(i);console.log('scrollHeight1');if(/document/.test(h)||h==document)e.containerOffset={left:0,top:0},e.containerPosition={left:0,top:0},e.parentData={element:a(document),left:0,top:0,width:a(document).width(),height:a(document).height()||document.body.parentNode.scrollHeight};else{var j=a(i),k=[];a(["Top","Right","Left","Bottom"]).each(function(a,b){k[a]=c(j.css("padding"+b))}),e.containerOffset=j.offset(),e.containerPosition=j.position(),e.containerSize={height:j.innerHeight()-k[3],width:j.innerWidth()-k[1]};console.log('scrollHeight2');var l=e.containerOffset,m=e.containerSize.height,n=e.containerSize.width,o=a.ui.hasScroll(i,"left")?i.scrollWidth:n,p=a.ui.hasScroll(i)?i.scrollHeight:m;e.parentData={element:i,left:l.left,top:l.top,width:o,height:p}}},resize:function(b,c){var d=a(this).data("resizable"),e=d.options,f=d.containerSize,g=d.containerOffset,h=d.size,i=d.position,j=d._aspectRatio||b.shiftKey,k={top:0,left:0},l=d.containerElement;l[0]!=document&&/static/.test(l.css("position"))&&(k=g),i.left<(d._helper?g.left:0)&&(d.size.width=d.size.width+(d._helper?d.position.left-g.left:d.position.left-k.left),j&&(d.size.height=d.size.width/d.aspectRatio),d.position.left=e.helper?g.left:0),i.top<(d._helper?g.top:0)&&(d.size.height=d.size.height+(d._helper?d.position.top-g.top:d.position.top),j&&(d.size.width=d.size.height*d.aspectRatio),d.position.top=d._helper?g.top:0),d.offset.left=d.parentData.left+d.position.left,d.offset.top=d.parentData.top+d.position.top;var m=Math.abs((d._helper?d.offset.left-k.left:d.offset.left-k.left)+d.sizeDiff.width),n=Math.abs((d._helper?d.offset.top-k.top:d.offset.top-g.top)+d.sizeDiff.height),o=d.containerElement.get(0)==d.element.parent().get(0),p=/relative|absolute/.test(d.containerElement.css("position"));o&&p&&(m-=d.parentData.left),m+d.size.width>=d.parentData.width&&(d.size.width=d.parentData.width-m,j&&(d.size.height=d.size.width/d.aspectRatio)),n+d.size.height>=d.parentData.height&&(d.size.height=d.parentData.height-n,j&&(d.size.width=d.size.height*d.aspectRatio))},stop:function(b,c){var d=a(this).data("resizable"),e=d.options,f=d.position,g=d.containerOffset,h=d.containerPosition,i=d.containerElement,j=a(d.helper),k=j.offset(),l=j.outerWidth()-d.sizeDiff.width,m=j.outerHeight()-d.sizeDiff.height;d._helper&&!e.animate&&/relative/.test(i.css("position"))&&a(this).css({left:k.left-h.left-g.left,width:l,height:m}),d._helper&&!e.animate&&/static/.test(i.css("position"))&&a(this).css({left:k.left-h.left-g.left,width:l,height:m})}}),a.ui.plugin.add("resizable","ghost",{start:function(b,c){var d=a(this).data("resizable"),e=d.options,f=d.size;d.ghost=d.originalElement.clone(),d.ghost.css({opacity:.25,display:"block",position:"relative",height:f.height,width:f.width,margin:0,left:0,top:0}).addClass("ui-resizable-ghost").addClass(typeof e.ghost=="string"?e.ghost:""),d.ghost.appendTo(d.helper)},resize:function(b,c){var d=a(this).data("resizable"),e=d.options;d.ghost&&d.ghost.css({position:"relative",height:d.size.height,width:d.size.width})},stop:function(b,c){var d=a(this).data("resizable"),e=d.options;d.ghost&&d.helper&&d.helper.get(0).removeChild(d.ghost.get(0))}}),a.ui.plugin.add("resizable","grid",{resize:function(b,c){var d=a(this).data("resizable"),e=d.options,f=d.size,g=d.originalSize,h=d.originalPosition,i=d.axis,j=e._aspectRatio||b.shiftKey;e.grid=typeof e.grid=="number"?[e.grid,e.grid]:e.grid;var k=Math.round((f.width-g.width)/(e.grid[0]||1))*(e.grid[0]||1),l=Math.round((f.height-g.height)/(e.grid[1]||1))*(e.grid[1]||1);/^(se|s|e)$/.test(i)?(d.size.width=g.width+k,d.size.height=g.height+l):/^(ne)$/.test(i)?(d.size.width=g.width+k,d.size.height=g.height+l,d.position.top=h.top-l):/^(sw)$/.test(i)?(d.size.width=g.width+k,d.size.height=g.height+l,d.position.left=h.left-k):(d.size.width=g.width+k,d.size.height=g.height+l,d.position.top=h.top-l,d.position.left=h.left-k)}});var c=function(a){return parseInt(a,10)||0},d=function(a){return!isNaN(parseInt(a,10))}})(jQuery);;/*! jQuery UI - v1.8.21 - 2012-06-05
	* https://github.com/jquery/jquery-ui
	* Includes: jquery.ui.selectable.js
	* Copyright (c) 2012 AUTHORS.txt; Licensed MIT, GPL */
	(function(a,b){a.widget("ui.selectable",a.ui.mouse,{options:{appendTo:"body",autoRefresh:!0,distance:0,filter:"*",tolerance:"touch"},_create:function(){var b=this;this.element.addClass("ui-selectable"),this.dragged=!1;var c;this.refresh=function(){c=a(b.options.filter,b.element[0]),c.addClass("ui-selectee"),c.each(function(){var b=a(this),c=b.offset();a.data(this,"selectable-item",{element:this,$element:b,left:c.left,top:c.top,right:c.left+b.outerWidth(),bottom:c.top+b.outerHeight(),startselected:!1,selected:b.hasClass("ui-selected"),selecting:b.hasClass("ui-selecting"),unselecting:b.hasClass("ui-unselecting")})})},this.refresh(),this.selectees=c.addClass("ui-selectee"),this._mouseInit(),this.helper=a("<div class='ui-selectable-helper'></div>")},destroy:function(){return this.selectees.removeClass("ui-selectee").removeData("selectable-item"),this.element.removeClass("ui-selectable ui-selectable-disabled").removeData("selectable").unbind(".selectable"),this._mouseDestroy(),this},_mouseStart:function(b){var c=this;this.opos=[b.pageX,b.pageY];if(this.options.disabled)return;var d=this.options;this.selectees=a(d.filter,this.element[0]),this._trigger("start",b),a(d.appendTo).append(this.helper),this.helper.css({left:b.clientX,top:b.clientY,width:0,height:0}),d.autoRefresh&&this.refresh(),this.selectees.filter(".ui-selected").each(function(){var d=a.data(this,"selectable-item");d.startselected=!0,!b.metaKey&&!b.ctrlKey&&(d.$element.removeClass("ui-selected"),d.selected=!1,d.$element.addClass("ui-unselecting"),d.unselecting=!0,c._trigger("unselecting",b,{unselecting:d.element}))}),a(b.target).parents().andSelf().each(function(){var d=a.data(this,"selectable-item");if(d){var e=!b.metaKey&&!b.ctrlKey||!d.$element.hasClass("ui-selected");return d.$element.removeClass(e?"ui-unselecting":"ui-selected").addClass(e?"ui-selecting":"ui-unselecting"),d.unselecting=!e,d.selecting=e,d.selected=e,e?c._trigger("selecting",b,{selecting:d.element}):c._trigger("unselecting",b,{unselecting:d.element}),!1}})},_mouseDrag:function(b){var c=this;this.dragged=!0;if(this.options.disabled)return;var d=this.options,e=this.opos[0],f=this.opos[1],g=b.pageX,h=b.pageY;if(e>g){var i=g;g=e,e=i}if(f>h){var i=h;h=f,f=i}return this.helper.css({left:e,top:f,width:g-e,height:h-f}),this.selectees.each(function(){var i=a.data(this,"selectable-item");if(!i||i.element==c.element[0])return;var j=!1;d.tolerance=="touch"?j=!(i.left>g||i.right<e||i.top>h||i.bottom<f):d.tolerance=="fit"&&(j=i.left>e&&i.right<g&&i.top>f&&i.bottom<h),j?(i.selected&&(i.$element.removeClass("ui-selected"),i.selected=!1),i.unselecting&&(i.$element.removeClass("ui-unselecting"),i.unselecting=!1),i.selecting||(i.$element.addClass("ui-selecting"),i.selecting=!0,c._trigger("selecting",b,{selecting:i.element}))):(i.selecting&&((b.metaKey||b.ctrlKey)&&i.startselected?(i.$element.removeClass("ui-selecting"),i.selecting=!1,i.$element.addClass("ui-selected"),i.selected=!0):(i.$element.removeClass("ui-selecting"),i.selecting=!1,i.startselected&&(i.$element.addClass("ui-unselecting"),i.unselecting=!0),c._trigger("unselecting",b,{unselecting:i.element}))),i.selected&&!b.metaKey&&!b.ctrlKey&&!i.startselected&&(i.$element.removeClass("ui-selected"),i.selected=!1,i.$element.addClass("ui-unselecting"),i.unselecting=!0,c._trigger("unselecting",b,{unselecting:i.element})))}),!1},_mouseStop:function(b){var c=this;this.dragged=!1;var d=this.options;return a(".ui-unselecting",this.element[0]).each(function(){var d=a.data(this,"selectable-item");d.$element.removeClass("ui-unselecting"),d.unselecting=!1,d.startselected=!1,c._trigger("unselected",b,{unselected:d.element})}),a(".ui-selecting",this.element[0]).each(function(){var d=a.data(this,"selectable-item");d.$element.removeClass("ui-selecting").addClass("ui-selected"),d.selecting=!1,d.selected=!0,d.startselected=!0,c._trigger("selected",b,{selected:d.element})}),this._trigger("stop",b),this.helper.remove(),!1}}),a.extend(a.ui.selectable,{version:"1.8.21"})})(jQuery);;/*! jQuery UI - v1.8.21 - 2012-06-05
	* https://github.com/jquery/jquery-ui
	* Includes: jquery.ui.sortable.js
	* Copyright (c) 2012 AUTHORS.txt; Licensed MIT, GPL */
	(function(a,b){a.widget("ui.sortable",a.ui.mouse,{widgetEventPrefix:"sort",ready:!1,options:{appendTo:"parent",axis:!1,connectWith:!1,containment:!1,cursor:"auto",cursorAt:!1,dropOnEmpty:!0,forcePlaceholderSize:!1,forceHelperSize:!1,grid:!1,handle:!1,helper:"original",items:"> *",opacity:!1,placeholder:!1,revert:!1,scroll:!0,scrollSensitivity:20,scrollSpeed:20,scope:"default",tolerance:"intersect",zIndex:1e3},_create:function(){var a=this.options;this.containerCache={},this.element.addClass("ui-sortable"),this.refresh(),this.floating=this.items.length?a.axis==="x"||/left|right/.test(this.items[0].item.css("float"))||/inline|table-cell/.test(this.items[0].item.css("display")):!1,this.offset=this.element.offset(),this._mouseInit(),this.ready=!0},destroy:function(){a.Widget.prototype.destroy.call(this),this.element.removeClass("ui-sortable ui-sortable-disabled"),this._mouseDestroy();for(var b=this.items.length-1;b>=0;b--)this.items[b].item.removeData(this.widgetName+"-item");return this},_setOption:function(b,c){b==="disabled"?(this.options[b]=c,this.widget()[c?"addClass":"removeClass"]("ui-sortable-disabled")):a.Widget.prototype._setOption.apply(this,arguments)},_mouseCapture:function(b,c){var d=this;if(this.reverting)return!1;if(this.options.disabled||this.options.type=="static")return!1;this._refreshItems(b);var e=null,f=this,g=a(b.target).parents().each(function(){if(a.data(this,d.widgetName+"-item")==f)return e=a(this),!1});a.data(b.target,d.widgetName+"-item")==f&&(e=a(b.target));if(!e)return!1;if(this.options.handle&&!c){var h=!1;a(this.options.handle,e).find("*").andSelf().each(function(){this==b.target&&(h=!0)});if(!h)return!1}return this.currentItem=e,this._removeCurrentsFromItems(),!0},_mouseStart:function(b,c,d){var e=this.options,f=this;this.currentContainer=this,this.refreshPositions(),this.helper=this._createHelper(b),this._cacheHelperProportions(),this._cacheMargins(),this.scrollParent=this.helper.scrollParent(),this.offset=this.currentItem.offset(),this.offset={top:this.offset.top-this.margins.top,left:this.offset.left-this.margins.left},a.extend(this.offset,{click:{left:b.pageX-this.offset.left,top:b.pageY-this.offset.top},parent:this._getParentOffset(),relative:this._getRelativeOffset()}),this.helper.css("position","absolute"),this.cssPosition=this.helper.css("position"),this.originalPosition=this._generatePosition(b),this.originalPageX=b.pageX,this.originalPageY=b.pageY,e.cursorAt&&this._adjustOffsetFromHelper(e.cursorAt),this.domPosition={prev:this.currentItem.prev()[0],parent:this.currentItem.parent()[0]},this.helper[0]!=this.currentItem[0]&&this.currentItem.hide(),this._createPlaceholder(),e.containment&&this._setContainment(),e.cursor&&(a("body").css("cursor")&&(this._storedCursor=a("body").css("cursor")),a("body").css("cursor",e.cursor)),e.opacity&&(this.helper.css("opacity")&&(this._storedOpacity=this.helper.css("opacity")),this.helper.css("opacity",e.opacity)),e.zIndex&&(this.helper.css("zIndex")&&(this._storedZIndex=this.helper.css("zIndex")),this.helper.css("zIndex",e.zIndex)),this.scrollParent[0]!=document&&this.scrollParent[0].tagName!="HTML"&&(this.overflowOffset=this.scrollParent.offset()),this._trigger("start",b,this._uiHash()),this._preserveHelperProportions||this._cacheHelperProportions();if(!d)for(var g=this.containers.length-1;g>=0;g--)this.containers[g]._trigger("activate",b,f._uiHash(this));return a.ui.ddmanager&&(a.ui.ddmanager.current=this),a.ui.ddmanager&&!e.dropBehaviour&&a.ui.ddmanager.prepareOffsets(this,b),this.dragging=!0,this.helper.addClass("ui-sortable-helper"),this._mouseDrag(b),!0},_mouseDrag:function(b){this.position=this._generatePosition(b),this.positionAbs=this._convertPositionTo("absolute"),this.lastPositionAbs||(this.lastPositionAbs=this.positionAbs);if(this.options.scroll){var c=this.options,d=!1;this.scrollParent[0]!=document&&this.scrollParent[0].tagName!="HTML"?(this.overflowOffset.top+this.scrollParent[0].offsetHeight-b.pageY<c.scrollSensitivity?this.scrollParent[0].scrollTop=d=this.scrollParent[0].scrollTop+c.scrollSpeed:b.pageY-this.overflowOffset.top<c.scrollSensitivity&&(this.scrollParent[0].scrollTop=d=this.scrollParent[0].scrollTop-c.scrollSpeed),this.overflowOffset.left+this.scrollParent[0].offsetWidth-b.pageX<c.scrollSensitivity?this.scrollParent[0].scrollLeft=d=this.scrollParent[0].scrollLeft+c.scrollSpeed:b.pageX-this.overflowOffset.left<c.scrollSensitivity&&(this.scrollParent[0].scrollLeft=d=this.scrollParent[0].scrollLeft-c.scrollSpeed)):(b.pageY-a(document).scrollTop()<c.scrollSensitivity?d=a(document).scrollTop(a(document).scrollTop()-c.scrollSpeed):a(window).height()-(b.pageY-a(document).scrollTop())<c.scrollSensitivity&&(d=a(document).scrollTop(a(document).scrollTop()+c.scrollSpeed)),b.pageX-a(document).scrollLeft()<c.scrollSensitivity?d=a(document).scrollLeft(a(document).scrollLeft()-c.scrollSpeed):a(window).width()-(b.pageX-a(document).scrollLeft())<c.scrollSensitivity&&(d=a(document).scrollLeft(a(document).scrollLeft()+c.scrollSpeed))),d!==!1&&a.ui.ddmanager&&!c.dropBehaviour&&a.ui.ddmanager.prepareOffsets(this,b)}this.positionAbs=this._convertPositionTo("absolute");if(!this.options.axis||this.options.axis!="y")this.helper[0].style.left=this.position.left+"px";if(!this.options.axis||this.options.axis!="x")this.helper[0].style.top=this.position.top+"px";for(var e=this.items.length-1;e>=0;e--){var f=this.items[e],g=f.item[0],h=this._intersectsWithPointer(f);if(!h)continue;if(g!=this.currentItem[0]&&this.placeholder[h==1?"next":"prev"]()[0]!=g&&!a.ui.contains(this.placeholder[0],g)&&(this.options.type=="semi-dynamic"?!a.ui.contains(this.element[0],g):!0)){this.direction=h==1?"down":"up";if(this.options.tolerance=="pointer"||this._intersectsWithSides(f))this._rearrange(b,f);else break;this._trigger("change",b,this._uiHash());break}}return this._contactContainers(b),a.ui.ddmanager&&a.ui.ddmanager.drag(this,b),this._trigger("sort",b,this._uiHash()),this.lastPositionAbs=this.positionAbs,!1},_mouseStop:function(b,c){if(!b)return;a.ui.ddmanager&&!this.options.dropBehaviour&&a.ui.ddmanager.drop(this,b);if(this.options.revert){var d=this,e=d.placeholder.offset();d.reverting=!0,a(this.helper).animate({left:e.left-this.offset.parent.left-d.margins.left+(this.offsetParent[0]==document.body?0:this.offsetParent[0].scrollLeft),top:e.top-this.offset.parent.top-d.margins.top+(this.offsetParent[0]==document.body?0:this.offsetParent[0].scrollTop)},parseInt(this.options.revert,10)||500,function(){d._clear(b)})}else this._clear(b,c);return!1},cancel:function(){var b=this;if(this.dragging){this._mouseUp({target:null}),this.options.helper=="original"?this.currentItem.css(this._storedCSS).removeClass("ui-sortable-helper"):this.currentItem.show();for(var c=this.containers.length-1;c>=0;c--)this.containers[c]._trigger("deactivate",null,b._uiHash(this)),this.containers[c].containerCache.over&&(this.containers[c]._trigger("out",null,b._uiHash(this)),this.containers[c].containerCache.over=0)}return this.placeholder&&(this.placeholder[0].parentNode&&this.placeholder[0].parentNode.removeChild(this.placeholder[0]),this.options.helper!="original"&&this.helper&&this.helper[0].parentNode&&this.helper.remove(),a.extend(this,{helper:null,dragging:!1,reverting:!1,_noFinalSort:null}),this.domPosition.prev?a(this.domPosition.prev).after(this.currentItem):a(this.domPosition.parent).prepend(this.currentItem)),this},serialize:function(b){var c=this._getItemsAsjQuery(b&&b.connected),d=[];return b=b||{},a(c).each(function(){var c=(a(b.item||this).attr(b.attribute||"id")||"").match(b.expression||/(.+)[-=_](.+)/);c&&d.push((b.key||c[1]+"[]")+"="+(b.key&&b.expression?c[1]:c[2]))}),!d.length&&b.key&&d.push(b.key+"="),d.join("&")},toArray:function(b){var c=this._getItemsAsjQuery(b&&b.connected),d=[];return b=b||{},c.each(function(){d.push(a(b.item||this).attr(b.attribute||"id")||"")}),d},_intersectsWith:function(a){var b=this.positionAbs.left,c=b+this.helperProportions.width,d=this.positionAbs.top,e=d+this.helperProportions.height,f=a.left,g=f+a.width,h=a.top,i=h+a.height,j=this.offset.click.top,k=this.offset.click.left,l=d+j>h&&d+j<i&&b+k>f&&b+k<g;return this.options.tolerance=="pointer"||this.options.forcePointerForContainers||this.options.tolerance!="pointer"&&this.helperProportions[this.floating?"width":"height"]>a[this.floating?"width":"height"]?l:f<b+this.helperProportions.width/2&&c-this.helperProportions.width/2<g&&h<d+this.helperProportions.height/2&&e-this.helperProportions.height/2<i},_intersectsWithPointer:function(b){var c=this.options.axis==="x"||a.ui.isOverAxis(this.positionAbs.top+this.offset.click.top,b.top,b.height),d=this.options.axis==="y"||a.ui.isOverAxis(this.positionAbs.left+this.offset.click.left,b.left,b.width),e=c&&d,f=this._getDragVerticalDirection(),g=this._getDragHorizontalDirection();return e?this.floating?g&&g=="right"||f=="down"?2:1:f&&(f=="down"?2:1):!1},_intersectsWithSides:function(b){var c=a.ui.isOverAxis(this.positionAbs.top+this.offset.click.top,b.top+b.height/2,b.height),d=a.ui.isOverAxis(this.positionAbs.left+this.offset.click.left,b.left+b.width/2,b.width),e=this._getDragVerticalDirection(),f=this._getDragHorizontalDirection();return this.floating&&f?f=="right"&&d||f=="left"&&!d:e&&(e=="down"&&c||e=="up"&&!c)},_getDragVerticalDirection:function(){var a=this.positionAbs.top-this.lastPositionAbs.top;return a!=0&&(a>0?"down":"up")},_getDragHorizontalDirection:function(){var a=this.positionAbs.left-this.lastPositionAbs.left;return a!=0&&(a>0?"right":"left")},refresh:function(a){return this._refreshItems(a),this.refreshPositions(),this},_connectWith:function(){var a=this.options;return a.connectWith.constructor==String?[a.connectWith]:a.connectWith},_getItemsAsjQuery:function(b){var c=this,d=[],e=[],f=this._connectWith();if(f&&b)for(var g=f.length-1;g>=0;g--){var h=a(f[g]);for(var i=h.length-1;i>=0;i--){var j=a.data(h[i],this.widgetName);j&&j!=this&&!j.options.disabled&&e.push([a.isFunction(j.options.items)?j.options.items.call(j.element):a(j.options.items,j.element).not(".ui-sortable-helper").not(".ui-sortable-placeholder"),j])}}e.push([a.isFunction(this.options.items)?this.options.items.call(this.element,null,{options:this.options,item:this.currentItem}):a(this.options.items,this.element).not(".ui-sortable-helper").not(".ui-sortable-placeholder"),this]);for(var g=e.length-1;g>=0;g--)e[g][0].each(function(){d.push(this)});return a(d)},_removeCurrentsFromItems:function(){var a=this.currentItem.find(":data("+this.widgetName+"-item)");for(var b=0;b<this.items.length;b++)for(var c=0;c<a.length;c++)a[c]==this.items[b].item[0]&&this.items.splice(b,1)},_refreshItems:function(b){this.items=[],this.containers=[this];var c=this.items,d=this,e=[[a.isFunction(this.options.items)?this.options.items.call(this.element[0],b,{item:this.currentItem}):a(this.options.items,this.element),this]],f=this._connectWith();if(f&&this.ready)for(var g=f.length-1;g>=0;g--){var h=a(f[g]);for(var i=h.length-1;i>=0;i--){var j=a.data(h[i],this.widgetName);j&&j!=this&&!j.options.disabled&&(e.push([a.isFunction(j.options.items)?j.options.items.call(j.element[0],b,{item:this.currentItem}):a(j.options.items,j.element),j]),this.containers.push(j))}}for(var g=e.length-1;g>=0;g--){var k=e[g][1],l=e[g][0];for(var i=0,m=l.length;i<m;i++){var n=a(l[i]);n.data(this.widgetName+"-item",k),c.push({item:n,instance:k,width:0,height:0,left:0,top:0})}}},refreshPositions:function(b){this.offsetParent&&this.helper&&(this.offset.parent=this._getParentOffset());for(var c=this.items.length-1;c>=0;c--){var d=this.items[c];if(d.instance!=this.currentContainer&&this.currentContainer&&d.item[0]!=this.currentItem[0])continue;var e=this.options.toleranceElement?a(this.options.toleranceElement,d.item):d.item;b||(d.width=e.outerWidth(),d.height=e.outerHeight());var f=e.offset();d.left=f.left,d.top=f.top}if(this.options.custom&&this.options.custom.refreshContainers)this.options.custom.refreshContainers.call(this);else for(var c=this.containers.length-1;c>=0;c--){var f=this.containers[c].element.offset();this.containers[c].containerCache.left=f.left,this.containers[c].containerCache.top=f.top,this.containers[c].containerCache.width=this.containers[c].element.outerWidth(),this.containers[c].containerCache.height=this.containers[c].element.outerHeight()}return this},_createPlaceholder:function(b){var c=b||this,d=c.options;if(!d.placeholder||d.placeholder.constructor==String){var e=d.placeholder;d.placeholder={element:function(){var b=a(document.createElement(c.currentItem[0].nodeName)).addClass(e||c.currentItem[0].className+" ui-sortable-placeholder").removeClass("ui-sortable-helper")[0];return e||(b.style.visibility="hidden"),b},update:function(a,b){if(e&&!d.forcePlaceholderSize)return;b.height()||b.height(c.currentItem.innerHeight()-parseInt(c.currentItem.css("paddingTop")||0,10)-parseInt(c.currentItem.css("paddingBottom")||0,10)),b.width()||b.width(c.currentItem.innerWidth()-parseInt(c.currentItem.css("paddingLeft")||0,10)-parseInt(c.currentItem.css("paddingRight")||0,10))}}}c.placeholder=a(d.placeholder.element.call(c.element,c.currentItem)),c.currentItem.after(c.placeholder),d.placeholder.update(c,c.placeholder)},_contactContainers:function(b){var c=null,d=null;for(var e=this.containers.length-1;e>=0;e--){if(a.ui.contains(this.currentItem[0],this.containers[e].element[0]))continue;if(this._intersectsWith(this.containers[e].containerCache)){if(c&&a.ui.contains(this.containers[e].element[0],c.element[0]))continue;c=this.containers[e],d=e}else this.containers[e].containerCache.over&&(this.containers[e]._trigger("out",b,this._uiHash(this)),this.containers[e].containerCache.over=0)}if(!c)return;if(this.containers.length===1)this.containers[d]._trigger("over",b,this._uiHash(this)),this.containers[d].containerCache.over=1;else if(this.currentContainer!=this.containers[d]){var f=1e4,g=null,h=this.positionAbs[this.containers[d].floating?"left":"top"];for(var i=this.items.length-1;i>=0;i--){if(!a.ui.contains(this.containers[d].element[0],this.items[i].item[0]))continue;var j=this.containers[d].floating?this.items[i].item.offset().left:this.items[i].item.offset().top;Math.abs(j-h)<f&&(f=Math.abs(j-h),g=this.items[i],this.direction=j-h>0?"down":"up")}if(!g&&!this.options.dropOnEmpty)return;this.currentContainer=this.containers[d],g?this._rearrange(b,g,null,!0):this._rearrange(b,null,this.containers[d].element,!0),this._trigger("change",b,this._uiHash()),this.containers[d]._trigger("change",b,this._uiHash(this)),this.options.placeholder.update(this.currentContainer,this.placeholder),this.containers[d]._trigger("over",b,this._uiHash(this)),this.containers[d].containerCache.over=1}},_createHelper:function(b){var c=this.options,d=a.isFunction(c.helper)?a(c.helper.apply(this.element[0],[b,this.currentItem])):c.helper=="clone"?this.currentItem.clone():this.currentItem;return d.parents("body").length||a(c.appendTo!="parent"?c.appendTo:this.currentItem[0].parentNode)[0].appendChild(d[0]),d[0]==this.currentItem[0]&&(this._storedCSS={width:this.currentItem[0].style.width,height:this.currentItem[0].style.height,position:this.currentItem.css("position"),top:this.currentItem.css("top"),left:this.currentItem.css("left")}),(d[0].style.width==""||c.forceHelperSize)&&d.width(this.currentItem.width()),(d[0].style.height==""||c.forceHelperSize)&&d.height(this.currentItem.height()),d},_adjustOffsetFromHelper:function(b){typeof b=="string"&&(b=b.split(" ")),a.isArray(b)&&(b={left:+b[0],top:+b[1]||0}),"left"in b&&(this.offset.click.left=b.left+this.margins.left),"right"in b&&(this.offset.click.left=this.helperProportions.width-b.right+this.margins.left),"top"in b&&(this.offset.click.top=b.top+this.margins.top),"bottom"in b&&(this.offset.click.top=this.helperProportions.height-b.bottom+this.margins.top)},_getParentOffset:function(){this.offsetParent=this.helper.offsetParent();var b=this.offsetParent.offset();this.cssPosition=="absolute"&&this.scrollParent[0]!=document&&a.ui.contains(this.scrollParent[0],this.offsetParent[0])&&(b.left+=this.scrollParent.scrollLeft(),b.top+=this.scrollParent.scrollTop());if(this.offsetParent[0]==document.body||this.offsetParent[0].tagName&&this.offsetParent[0].tagName.toLowerCase()=="html"&&a.browser.msie)b={top:0,left:0};return{top:b.top+(parseInt(this.offsetParent.css("borderTopWidth"),10)||0),left:b.left+(parseInt(this.offsetParent.css("borderLeftWidth"),10)||0)}},_getRelativeOffset:function(){if(this.cssPosition=="relative"){var a=this.currentItem.position();return{top:a.top-(parseInt(this.helper.css("top"),10)||0)+this.scrollParent.scrollTop(),left:a.left-(parseInt(this.helper.css("left"),10)||0)+this.scrollParent.scrollLeft()}}return{top:0,left:0}},_cacheMargins:function(){this.margins={left:parseInt(this.currentItem.css("marginLeft"),10)||0,top:parseInt(this.currentItem.css("marginTop"),10)||0}},_cacheHelperProportions:function(){this.helperProportions={width:this.helper.outerWidth(),height:this.helper.outerHeight()}},_setContainment:function(){var b=this.options;b.containment=="parent"&&(b.containment=this.helper[0].parentNode);if(b.containment=="document"||b.containment=="window")this.containment=[0-this.offset.relative.left-this.offset.parent.left,0-this.offset.relative.top-this.offset.parent.top,a(b.containment=="document"?document:window).width()-this.helperProportions.width-this.margins.left,(a(b.containment=="document"?document:window).height()||document.body.parentNode.scrollHeight)-this.helperProportions.height-this.margins.top];if(!/^(document|window|parent)$/.test(b.containment)){var c=a(b.containment)[0],d=a(b.containment).offset(),e=a(c).css("overflow")!="hidden";this.containment=[d.left+(parseInt(a(c).css("borderLeftWidth"),10)||0)+(parseInt(a(c).css("paddingLeft"),10)||0)-this.margins.left,d.top+(parseInt(a(c).css("borderTopWidth"),10)||0)+(parseInt(a(c).css("paddingTop"),10)||0)-this.margins.top,d.left+(e?Math.max(c.scrollWidth,c.offsetWidth):c.offsetWidth)-(parseInt(a(c).css("borderLeftWidth"),10)||0)-(parseInt(a(c).css("paddingRight"),10)||0)-this.helperProportions.width-this.margins.left,d.top+(e?Math.max(c.scrollHeight,c.offsetHeight):c.offsetHeight)-(parseInt(a(c).css("borderTopWidth"),10)||0)-(parseInt(a(c).css("paddingBottom"),10)||0)-this.helperProportions.height-this.margins.top]}},_convertPositionTo:function(b,c){c||(c=this.position);var d=b=="absolute"?1:-1,e=this.options,f=this.cssPosition=="absolute"&&(this.scrollParent[0]==document||!a.ui.contains(this.scrollParent[0],this.offsetParent[0]))?this.offsetParent:this.scrollParent,g=/(html|body)/i.test(f[0].tagName);return{top:c.top+this.offset.relative.top*d+this.offset.parent.top*d-(a.browser.safari&&this.cssPosition=="fixed"?0:(this.cssPosition=="fixed"?-this.scrollParent.scrollTop():g?0:f.scrollTop())*d),left:c.left+this.offset.relative.left*d+this.offset.parent.left*d-(a.browser.safari&&this.cssPosition=="fixed"?0:(this.cssPosition=="fixed"?-this.scrollParent.scrollLeft():g?0:f.scrollLeft())*d)}},_generatePosition:function(b){var c=this.options,d=this.cssPosition=="absolute"&&(this.scrollParent[0]==document||!a.ui.contains(this.scrollParent[0],this.offsetParent[0]))?this.offsetParent:this.scrollParent,e=/(html|body)/i.test(d[0].tagName);this.cssPosition=="relative"&&(this.scrollParent[0]==document||this.scrollParent[0]==this.offsetParent[0])&&(this.offset.relative=this._getRelativeOffset());var f=b.pageX,g=b.pageY;if(this.originalPosition){this.containment&&(b.pageX-this.offset.click.left<this.containment[0]&&(f=this.containment[0]+this.offset.click.left),b.pageY-this.offset.click.top<this.containment[1]&&(g=this.containment[1]+this.offset.click.top),b.pageX-this.offset.click.left>this.containment[2]&&(f=this.containment[2]+this.offset.click.left),b.pageY-this.offset.click.top>this.containment[3]&&(g=this.containment[3]+this.offset.click.top));if(c.grid){var h=this.originalPageY+Math.round((g-this.originalPageY)/c.grid[1])*c.grid[1];g=this.containment?h-this.offset.click.top<this.containment[1]||h-this.offset.click.top>this.containment[3]?h-this.offset.click.top<this.containment[1]?h+c.grid[1]:h-c.grid[1]:h:h;var i=this.originalPageX+Math.round((f-this.originalPageX)/c.grid[0])*c.grid[0];f=this.containment?i-this.offset.click.left<this.containment[0]||i-this.offset.click.left>this.containment[2]?i-this.offset.click.left<this.containment[0]?i+c.grid[0]:i-c.grid[0]:i:i}}return{top:g-this.offset.click.top-this.offset.relative.top-this.offset.parent.top+(a.browser.safari&&this.cssPosition=="fixed"?0:this.cssPosition=="fixed"?-this.scrollParent.scrollTop():e?0:d.scrollTop()),left:f-this.offset.click.left-this.offset.relative.left-this.offset.parent.left+(a.browser.safari&&this.cssPosition=="fixed"?0:this.cssPosition=="fixed"?-this.scrollParent.scrollLeft():e?0:d.scrollLeft())}},_rearrange:function(a,b,c,d){c?c[0].appendChild(this.placeholder[0]):b.item[0].parentNode.insertBefore(this.placeholder[0],this.direction=="down"?b.item[0]:b.item[0].nextSibling),this.counter=this.counter?++this.counter:1;var e=this,f=this.counter;window.setTimeout(function(){f==e.counter&&e.refreshPositions(!d)},0)},_clear:function(b,c){this.reverting=!1;var d=[],e=this;!this._noFinalSort&&this.currentItem.parent().length&&this.placeholder.before(this.currentItem),this._noFinalSort=null;if(this.helper[0]==this.currentItem[0]){for(var f in this._storedCSS)if(this._storedCSS[f]=="auto"||this._storedCSS[f]=="static")this._storedCSS[f]="";this.currentItem.css(this._storedCSS).removeClass("ui-sortable-helper")}else this.currentItem.show();this.fromOutside&&!c&&d.push(function(a){this._trigger("receive",a,this._uiHash(this.fromOutside))}),(this.fromOutside||this.domPosition.prev!=this.currentItem.prev().not(".ui-sortable-helper")[0]||this.domPosition.parent!=this.currentItem.parent()[0])&&!c&&d.push(function(a){this._trigger("update",a,this._uiHash())});if(!a.ui.contains(this.element[0],this.currentItem[0])){c||d.push(function(a){this._trigger("remove",a,this._uiHash())});for(var f=this.containers.length-1;f>=0;f--)a.ui.contains(this.containers[f].element[0],this.currentItem[0])&&!c&&(d.push(function(a){return function(b){a._trigger("receive",b,this._uiHash(this))}}.call(this,this.containers[f])),d.push(function(a){return function(b){a._trigger("update",b,this._uiHash(this))}}.call(this,this.containers[f])))}for(var f=this.containers.length-1;f>=0;f--)c||d.push(function(a){return function(b){a._trigger("deactivate",b,this._uiHash(this))}}.call(this,this.containers[f])),this.containers[f].containerCache.over&&(d.push(function(a){return function(b){a._trigger("out",b,this._uiHash(this))}}.call(this,this.containers[f])),this.containers[f].containerCache.over=0);this._storedCursor&&a("body").css("cursor",this._storedCursor),this._storedOpacity&&this.helper.css("opacity",this._storedOpacity),this._storedZIndex&&this.helper.css("zIndex",this._storedZIndex=="auto"?"":this._storedZIndex),this.dragging=!1;if(this.cancelHelperRemoval){if(!c){this._trigger("beforeStop",b,this._uiHash());for(var f=0;f<d.length;f++)d[f].call(this,b);this._trigger("stop",b,this._uiHash())}return!1}c||this._trigger("beforeStop",b,this._uiHash()),this.placeholder[0].parentNode.removeChild(this.placeholder[0]),this.helper[0]!=this.currentItem[0]&&this.helper.remove(),this.helper=null;if(!c){for(var f=0;f<d.length;f++)d[f].call(this,b);this._trigger("stop",b,this._uiHash())}return this.fromOutside=!1,!0},_trigger:function(){a.Widget.prototype._trigger.apply(this,arguments)===!1&&this.cancel()},_uiHash:function(b){var c=b||this;return{helper:c.helper,placeholder:c.placeholder||a([]),position:c.position,originalPosition:c.originalPosition,offset:c.positionAbs,item:c.currentItem,sender:b?b.element:null}}}),a.extend(a.ui.sortable,{version:"1.8.21"})})(jQuery);;/*! jQuery UI - v1.8.21 - 2012-06-05
	* https://github.com/jquery/jquery-ui
	* Includes: jquery.ui.accordion.js
	* Copyright (c) 2012 AUTHORS.txt; Licensed MIT, GPL */
	(function(a,b){a.widget("ui.accordion",{options:{active:0,animated:"slide",autoHeight:!0,clearStyle:!1,collapsible:!1,event:"click",fillSpace:!1,header:"> li > :first-child,> :not(li):even",icons:{header:"ui-icon-triangle-1-e",headerSelected:"ui-icon-triangle-1-s"},navigation:!1,navigationFilter:function(){return this.href.toLowerCase()===location.href.toLowerCase()}},_create:function(){var b=this,c=b.options;b.running=0,b.element.addClass("ui-accordion ui-widget ui-helper-reset").children("li").addClass("ui-accordion-li-fix"),b.headers=b.element.find(c.header).addClass("ui-accordion-header ui-helper-reset ui-state-default ui-corner-all").bind("mouseenter.accordion",function(){if(c.disabled)return;a(this).addClass("ui-state-hover")}).bind("mouseleave.accordion",function(){if(c.disabled)return;a(this).removeClass("ui-state-hover")}).bind("focus.accordion",function(){if(c.disabled)return;a(this).addClass("ui-state-focus")}).bind("blur.accordion",function(){if(c.disabled)return;a(this).removeClass("ui-state-focus")}),b.headers.next().addClass("ui-accordion-content ui-helper-reset ui-widget-content ui-corner-bottom");if(c.navigation){var d=b.element.find("a").filter(c.navigationFilter).eq(0);if(d.length){var e=d.closest(".ui-accordion-header");e.length?b.active=e:b.active=d.closest(".ui-accordion-content").prev()}}b.active=b._findActive(b.active||c.active).addClass("ui-state-default ui-state-active").toggleClass("ui-corner-all").toggleClass("ui-corner-top"),b.active.next().addClass("ui-accordion-content-active"),b._createIcons(),b.resize(),b.element.attr("role","tablist"),b.headers.attr("role","tab").bind("keydown.accordion",function(a){return b._keydown(a)}).next().attr("role","tabpanel"),b.headers.not(b.active||"").attr({"aria-expanded":"false","aria-selected":"false",tabIndex:-1}).next().hide(),b.active.length?b.active.attr({"aria-expanded":"true","aria-selected":"true",tabIndex:0}):b.headers.eq(0).attr("tabIndex",0),a.browser.safari||b.headers.find("a").attr("tabIndex",-1),c.event&&b.headers.bind(c.event.split(" ").join(".accordion ")+".accordion",function(a){b._clickHandler.call(b,a,this),a.preventDefault()})},_createIcons:function(){var b=this.options;b.icons&&(a("<span></span>").addClass("ui-icon "+b.icons.header).prependTo(this.headers),this.active.children(".ui-icon").toggleClass(b.icons.header).toggleClass(b.icons.headerSelected),this.element.addClass("ui-accordion-icons"))},_destroyIcons:function(){this.headers.children(".ui-icon").remove(),this.element.removeClass("ui-accordion-icons")},destroy:function(){var b=this.options;this.element.removeClass("ui-accordion ui-widget ui-helper-reset").removeAttr("role"),this.headers.unbind(".accordion").removeClass("ui-accordion-header ui-accordion-disabled ui-helper-reset ui-state-default ui-corner-all ui-state-active ui-state-disabled ui-corner-top").removeAttr("role").removeAttr("aria-expanded").removeAttr("aria-selected").removeAttr("tabIndex"),this.headers.find("a").removeAttr("tabIndex"),this._destroyIcons();var c=this.headers.next().css("display","").removeAttr("role").removeClass("ui-helper-reset ui-widget-content ui-corner-bottom ui-accordion-content ui-accordion-content-active ui-accordion-disabled ui-state-disabled");return(b.autoHeight||b.fillHeight)&&c.css("height",""),a.Widget.prototype.destroy.call(this)},_setOption:function(b,c){a.Widget.prototype._setOption.apply(this,arguments),b=="active"&&this.activate(c),b=="icons"&&(this._destroyIcons(),c&&this._createIcons()),b=="disabled"&&this.headers.add(this.headers.next())[c?"addClass":"removeClass"]("ui-accordion-disabled ui-state-disabled")},_keydown:function(b){if(this.options.disabled||b.altKey||b.ctrlKey)return;var c=a.ui.keyCode,d=this.headers.length,e=this.headers.index(b.target),f=!1;switch(b.keyCode){case c.RIGHT:case c.DOWN:f=this.headers[(e+1)%d];break;case c.LEFT:case c.UP:f=this.headers[(e-1+d)%d];break;case c.SPACE:case c.ENTER:this._clickHandler({target:b.target},b.target),b.preventDefault()}return f?(a(b.target).attr("tabIndex",-1),a(f).attr("tabIndex",0),f.focus(),!1):!0},resize:function(){var b=this.options,c;if(b.fillSpace){if(a.browser.msie){var d=this.element.parent().css("overflow");this.element.parent().css("overflow","hidden")}c=this.element.parent().height(),a.browser.msie&&this.element.parent().css("overflow",d),this.headers.each(function(){c-=a(this).outerHeight(!0)}),this.headers.next().each(function(){a(this).height(Math.max(0,c-a(this).innerHeight()+a(this).height()))}).css("overflow","auto")}else b.autoHeight&&(c=0,this.headers.next().each(function(){c=Math.max(c,a(this).height("").height())}).height(c));return this},activate:function(a){this.options.active=a;var b=this._findActive(a)[0];return this._clickHandler({target:b},b),this},_findActive:function(b){return b?typeof b=="number"?this.headers.filter(":eq("+b+")"):this.headers.not(this.headers.not(b)):b===!1?a([]):this.headers.filter(":eq(0)")},_clickHandler:function(b,c){var d=this.options;if(d.disabled)return;if(!b.target){if(!d.collapsible)return;this.active.removeClass("ui-state-active ui-corner-top").addClass("ui-state-default ui-corner-all").children(".ui-icon").removeClass(d.icons.headerSelected).addClass(d.icons.header),this.active.next().addClass("ui-accordion-content-active");var e=this.active.next(),f={options:d,newHeader:a([]),oldHeader:d.active,newContent:a([]),oldContent:e},g=this.active=a([]);this._toggle(g,e,f);return}var h=a(b.currentTarget||c),i=h[0]===this.active[0];d.active=d.collapsible&&i?!1:this.headers.index(h);if(this.running||!d.collapsible&&i)return;var j=this.active,g=h.next(),e=this.active.next(),f={options:d,newHeader:i&&d.collapsible?a([]):h,oldHeader:this.active,newContent:i&&d.collapsible?a([]):g,oldContent:e},k=this.headers.index(this.active[0])>this.headers.index(h[0]);this.active=i?a([]):h,this._toggle(g,e,f,i,k),j.removeClass("ui-state-active ui-corner-top").addClass("ui-state-default ui-corner-all").children(".ui-icon").removeClass(d.icons.headerSelected).addClass(d.icons.header),i||(h.removeClass("ui-state-default ui-corner-all").addClass("ui-state-active ui-corner-top").children(".ui-icon").removeClass(d.icons.header).addClass(d.icons.headerSelected),h.next().addClass("ui-accordion-content-active"));return},_toggle:function(b,c,d,e,f){var g=this,h=g.options;g.toShow=b,g.toHide=c,g.data=d;var i=function(){if(!g)return;return g._completed.apply(g,arguments)};g._trigger("changestart",null,g.data),g.running=c.size()===0?b.size():c.size();if(h.animated){var j={};h.collapsible&&e?j={toShow:a([]),toHide:c,complete:i,down:f,autoHeight:h.autoHeight||h.fillSpace}:j={toShow:b,toHide:c,complete:i,down:f,autoHeight:h.autoHeight||h.fillSpace},h.proxied||(h.proxied=h.animated),h.proxiedDuration||(h.proxiedDuration=h.duration),h.animated=a.isFunction(h.proxied)?h.proxied(j):h.proxied,h.duration=a.isFunction(h.proxiedDuration)?h.proxiedDuration(j):h.proxiedDuration;var k=a.ui.accordion.animations,l=h.duration,m=h.animated;m&&!k[m]&&!a.easing[m]&&(m="slide"),k[m]||(k[m]=function(a){this.slide(a,{easing:m,duration:l||700})}),k[m](j)}else h.collapsible&&e?b.toggle():(c.hide(),b.show()),i(!0);c.prev().attr({"aria-expanded":"false","aria-selected":"false",tabIndex:-1}).blur(),b.prev().attr({"aria-expanded":"true","aria-selected":"true",tabIndex:0}).focus()},_completed:function(a){this.running=a?0:--this.running;if(this.running)return;this.options.clearStyle&&this.toShow.add(this.toHide).css({height:"",overflow:""}),this.toHide.removeClass("ui-accordion-content-active"),this.toHide.length&&(this.toHide.parent()[0].className=this.toHide.parent()[0].className),this._trigger("change",null,this.data)}}),a.extend(a.ui.accordion,{version:"1.8.21",animations:{slide:function(b,c){b=a.extend({easing:"swing",duration:300},b,c);if(!b.toHide.size()){b.toShow.animate({height:"show",paddingTop:"show",paddingBottom:"show"},b);return}if(!b.toShow.size()){b.toHide.animate({height:"hide",paddingTop:"hide",paddingBottom:"hide"},b);return}var d=b.toShow.css("overflow"),e=0,f={},g={},h=["height","paddingTop","paddingBottom"],i,j=b.toShow;i=j[0].style.width,j.width(j.parent().width()-parseFloat(j.css("paddingLeft"))-parseFloat(j.css("paddingRight"))-(parseFloat(j.css("borderLeftWidth"))||0)-(parseFloat(j.css("borderRightWidth"))||0)),a.each(h,function(c,d){g[d]="hide";var e=(""+a.css(b.toShow[0],d)).match(/^([\d+-.]+)(.*)$/);f[d]={value:e[1],unit:e[2]||"px"}}),b.toShow.css({height:0,overflow:"hidden"}).show(),b.toHide.filter(":hidden").each(b.complete).end().filter(":visible").animate(g,{step:function(a,c){c.prop=="height"&&(e=c.end-c.start===0?0:(c.now-c.start)/(c.end-c.start)),b.toShow[0].style[c.prop]=e*f[c.prop].value+f[c.prop].unit},duration:b.duration,easing:b.easing,complete:function(){b.autoHeight||b.toShow.css("height",""),b.toShow.css({width:i,overflow:d}),b.complete()}})},bounceslide:function(a){this.slide(a,{easing:a.down?"easeOutBounce":"swing",duration:a.down?1e3:200})}}})})(jQuery);;/*! jQuery UI - v1.8.21 - 2012-06-05
	* https://github.com/jquery/jquery-ui
	* Includes: jquery.ui.autocomplete.js
	* Copyright (c) 2012 AUTHORS.txt; Licensed MIT, GPL */
	(function(a,b){var c=0;a.widget("ui.autocomplete",{options:{appendTo:"body",autoFocus:!1,delay:300,minLength:1,position:{my:"left top",at:"left bottom",collision:"none"},source:null},pending:0,_create:function(){var b=this,c=this.element[0].ownerDocument,d;this.isMultiLine=this.element.is("textarea"),this.element.addClass("ui-autocomplete-input").attr("autocomplete","off").attr({role:"textbox","aria-autocomplete":"list","aria-haspopup":"true"}).bind("keydown.autocomplete",function(c){if(b.options.disabled||b.element.propAttr("readOnly"))return;d=!1;var e=a.ui.keyCode;switch(c.keyCode){case e.PAGE_UP:b._move("previousPage",c);break;case e.PAGE_DOWN:b._move("nextPage",c);break;case e.UP:b._keyEvent("previous",c);break;case e.DOWN:b._keyEvent("next",c);break;case e.ENTER:case e.NUMPAD_ENTER:b.menu.active&&(d=!0,c.preventDefault());case e.TAB:if(!b.menu.active)return;b.menu.select(c);break;case e.ESCAPE:b.element.val(b.term),b.close(c);break;default:clearTimeout(b.searching),b.searching=setTimeout(function(){b.term!=b.element.val()&&(b.selectedItem=null,b.search(null,c))},b.options.delay)}}).bind("keypress.autocomplete",function(a){d&&(d=!1,a.preventDefault())}).bind("focus.autocomplete",function(){if(b.options.disabled)return;b.selectedItem=null,b.previous=b.element.val()}).bind("blur.autocomplete",function(a){if(b.options.disabled)return;clearTimeout(b.searching),b.closing=setTimeout(function(){b.close(a),b._change(a)},150)}),this._initSource(),this.menu=a("<ul></ul>").addClass("ui-autocomplete").appendTo(a(this.options.appendTo||"body",c)[0]).mousedown(function(c){var d=b.menu.element[0];a(c.target).closest(".ui-menu-item").length||setTimeout(function(){a(document).one("mousedown",function(c){c.target!==b.element[0]&&c.target!==d&&!a.ui.contains(d,c.target)&&b.close()})},1),setTimeout(function(){clearTimeout(b.closing)},13)}).menu({focus:function(a,c){var d=c.item.data("item.autocomplete");!1!==b._trigger("focus",a,{item:d})&&/^key/.test(a.originalEvent.type)&&b.element.val(d.value)},selected:function(a,d){var e=d.item.data("item.autocomplete"),f=b.previous;b.element[0]!==c.activeElement&&(b.element.focus(),b.previous=f,setTimeout(function(){b.previous=f,b.selectedItem=e},1)),!1!==b._trigger("select",a,{item:e})&&b.element.val(e.value),b.term=b.element.val(),b.close(a),b.selectedItem=e},blur:function(a,c){b.menu.element.is(":visible")&&b.element.val()!==b.term&&b.element.val(b.term)}}).zIndex(this.element.zIndex()+1).css({top:0,left:0}).hide().data("menu"),a.fn.bgiframe&&this.menu.element.bgiframe(),b.beforeunloadHandler=function(){b.element.removeAttr("autocomplete")},a(window).bind("beforeunload",b.beforeunloadHandler)},destroy:function(){this.element.removeClass("ui-autocomplete-input").removeAttr("autocomplete").removeAttr("role").removeAttr("aria-autocomplete").removeAttr("aria-haspopup"),this.menu.element.remove(),a(window).unbind("beforeunload",this.beforeunloadHandler),a.Widget.prototype.destroy.call(this)},_setOption:function(b,c){a.Widget.prototype._setOption.apply(this,arguments),b==="source"&&this._initSource(),b==="appendTo"&&this.menu.element.appendTo(a(c||"body",this.element[0].ownerDocument)[0]),b==="disabled"&&c&&this.xhr&&this.xhr.abort()},_initSource:function(){var b=this,c,d;a.isArray(this.options.source)?(c=this.options.source,this.source=function(b,d){d(a.ui.autocomplete.filter(c,b.term))}):typeof this.options.source=="string"?(d=this.options.source,this.source=function(c,e){b.xhr&&b.xhr.abort(),b.xhr=a.ajax({url:d,data:c,dataType:"json",success:function(a,b){e(a)},error:function(){e([])}})}):this.source=this.options.source},search:function(a,b){a=a!=null?a:this.element.val(),this.term=this.element.val();if(a.length<this.options.minLength)return this.close(b);clearTimeout(this.closing);if(this._trigger("search",b)===!1)return;return this._search(a)},_search:function(a){this.pending++,this.element.addClass("ui-autocomplete-loading"),this.source({term:a},this._response())},_response:function(){var a=this,b=++c;return function(d){b===c&&a.__response(d),a.pending--,a.pending||a.element.removeClass("ui-autocomplete-loading")}},__response:function(a){!this.options.disabled&&a&&a.length?(a=this._normalize(a),this._suggest(a),this._trigger("open")):this.close()},close:function(a){clearTimeout(this.closing),this.menu.element.is(":visible")&&(this.menu.element.hide(),this.menu.deactivate(),this._trigger("close",a))},_change:function(a){this.previous!==this.element.val()&&this._trigger("change",a,{item:this.selectedItem})},_normalize:function(b){return b.length&&b[0].label&&b[0].value?b:a.map(b,function(b){return typeof b=="string"?{label:b,value:b}:a.extend({label:b.label||b.value,value:b.value||b.label},b)})},_suggest:function(b){var c=this.menu.element.empty().zIndex(this.element.zIndex()+1);this._renderMenu(c,b),this.menu.deactivate(),this.menu.refresh(),c.show(),this._resizeMenu(),c.position(a.extend({of:this.element},this.options.position)),this.options.autoFocus&&this.menu.next(new a.Event("mouseover"))},_resizeMenu:function(){var a=this.menu.element;a.outerWidth(Math.max(a.width("").outerWidth()+1,this.element.outerWidth()))},_renderMenu:function(b,c){var d=this;a.each(c,function(a,c){d._renderItem(b,c)})},_renderItem:function(b,c){return a("<li></li>").data("item.autocomplete",c).append(a("<a></a>").text(c.label)).appendTo(b)},_move:function(a,b){if(!this.menu.element.is(":visible")){this.search(null,b);return}if(this.menu.first()&&/^previous/.test(a)||this.menu.last()&&/^next/.test(a)){this.element.val(this.term),this.menu.deactivate();return}this.menu[a](b)},widget:function(){return this.menu.element},_keyEvent:function(a,b){if(!this.isMultiLine||this.menu.element.is(":visible"))this._move(a,b),b.preventDefault()}}),a.extend(a.ui.autocomplete,{escapeRegex:function(a){return a.replace(/[-[\]{}()*+?.,\\^$|#\s]/g,"\\$&")},filter:function(b,c){var d=new RegExp(a.ui.autocomplete.escapeRegex(c),"i");return a.grep(b,function(a){return d.test(a.label||a.value||a)})}})})(jQuery),function(a){a.widget("ui.menu",{_create:function(){var b=this;this.element.addClass("ui-menu ui-widget ui-widget-content ui-corner-all").attr({role:"listbox","aria-activedescendant":"ui-active-menuitem"}).click(function(c){if(!a(c.target).closest(".ui-menu-item a").length)return;c.preventDefault(),b.select(c)}),this.refresh()},refresh:function(){var b=this,c=this.element.children("li:not(.ui-menu-item):has(a)").addClass("ui-menu-item").attr("role","menuitem");c.children("a").addClass("ui-corner-all").attr("tabindex",-1).mouseenter(function(c){b.activate(c,a(this).parent())}).mouseleave(function(){b.deactivate()})},activate:function(a,b){this.deactivate();if(this.hasScroll()){var c=b.offset().top-this.element.offset().top,d=this.element.scrollTop(),e=this.element.height();c<0?this.element.scrollTop(d+c):c>=e&&this.element.scrollTop(d+c-e+b.height())}this.active=b.eq(0).children("a").addClass("ui-state-hover").attr("id","ui-active-menuitem").end(),this._trigger("focus",a,{item:b})},deactivate:function(){if(!this.active)return;this.active.children("a").removeClass("ui-state-hover").removeAttr("id"),this._trigger("blur"),this.active=null},next:function(a){this.move("next",".ui-menu-item:first",a)},previous:function(a){this.move("prev",".ui-menu-item:last",a)},first:function(){return this.active&&!this.active.prevAll(".ui-menu-item").length},last:function(){return this.active&&!this.active.nextAll(".ui-menu-item").length},move:function(a,b,c){if(!this.active){this.activate(c,this.element.children(b));return}var d=this.active[a+"All"](".ui-menu-item").eq(0);d.length?this.activate(c,d):this.activate(c,this.element.children(b))},nextPage:function(b){if(this.hasScroll()){if(!this.active||this.last()){this.activate(b,this.element.children(".ui-menu-item:first"));return}var c=this.active.offset().top,d=this.element.height(),e=this.element.children(".ui-menu-item").filter(function(){var b=a(this).offset().top-c-d+a(this).height();return b<10&&b>-10});e.length||(e=this.element.children(".ui-menu-item:last")),this.activate(b,e)}else this.activate(b,this.element.children(".ui-menu-item").filter(!this.active||this.last()?":first":":last"))},previousPage:function(b){if(this.hasScroll()){if(!this.active||this.first()){this.activate(b,this.element.children(".ui-menu-item:last"));return}var c=this.active.offset().top,d=this.element.height(),e=this.element.children(".ui-menu-item").filter(function(){var b=a(this).offset().top-c+d-a(this).height();return b<10&&b>-10});e.length||(e=this.element.children(".ui-menu-item:first")),this.activate(b,e)}else this.activate(b,this.element.children(".ui-menu-item").filter(!this.active||this.first()?":last":":first"))},hasScroll:function(){console.log('scrollHeight3');return this.element.height()<this.element[a.fn.prop?"prop":"attr"]("scrollHeight")},select:function(a){this._trigger("selected",a,{item:this.active})}})}(jQuery);;/*! jQuery UI - v1.8.21 - 2012-06-05
	* https://github.com/jquery/jquery-ui
	* Includes: jquery.ui.button.js
	* Copyright (c) 2012 AUTHORS.txt; Licensed MIT, GPL */
	(function(a,b){var c,d,e,f,g="ui-button ui-widget ui-state-default ui-corner-all",h="ui-state-hover ui-state-active ",i="ui-button-icons-only ui-button-icon-only ui-button-text-icons ui-button-text-icon-primary ui-button-text-icon-secondary ui-button-text-only",j=function(){var b=a(this).find(":ui-button");setTimeout(function(){b.button("refresh")},1)},k=function(b){var c=b.name,d=b.form,e=a([]);return c&&(d?e=a(d).find("[name='"+c+"']"):e=a("[name='"+c+"']",b.ownerDocument).filter(function(){return!this.form})),e};a.widget("ui.button",{options:{disabled:null,text:!0,label:null,icons:{primary:null,secondary:null}},_create:function(){this.element.closest("form").unbind("reset.button").bind("reset.button",j),typeof this.options.disabled!="boolean"?this.options.disabled=!!this.element.propAttr("disabled"):this.element.propAttr("disabled",this.options.disabled),this._determineButtonType(),this.hasTitle=!!this.buttonElement.attr("title");var b=this,h=this.options,i=this.type==="checkbox"||this.type==="radio",l="ui-state-hover"+(i?"":" ui-state-active"),m="ui-state-focus";h.label===null&&(h.label=this.buttonElement.html()),this.buttonElement.addClass(g).attr("role","button").bind("mouseenter.button",function(){if(h.disabled)return;a(this).addClass("ui-state-hover"),this===c&&a(this).addClass("ui-state-active")}).bind("mouseleave.button",function(){if(h.disabled)return;a(this).removeClass(l)}).bind("click.button",function(a){h.disabled&&(a.preventDefault(),a.stopImmediatePropagation())}),this.element.bind("focus.button",function(){b.buttonElement.addClass(m)}).bind("blur.button",function(){b.buttonElement.removeClass(m)}),i&&(this.element.bind("change.button",function(){if(f)return;b.refresh()}),this.buttonElement.bind("mousedown.button",function(a){if(h.disabled)return;f=!1,d=a.pageX,e=a.pageY}).bind("mouseup.button",function(a){if(h.disabled)return;if(d!==a.pageX||e!==a.pageY)f=!0})),this.type==="checkbox"?this.buttonElement.bind("click.button",function(){if(h.disabled||f)return!1;a(this).toggleClass("ui-state-active"),b.buttonElement.attr("aria-pressed",b.element[0].checked)}):this.type==="radio"?this.buttonElement.bind("click.button",function(){if(h.disabled||f)return!1;a(this).addClass("ui-state-active"),b.buttonElement.attr("aria-pressed","true");var c=b.element[0];k(c).not(c).map(function(){return a(this).button("widget")[0]}).removeClass("ui-state-active").attr("aria-pressed","false")}):(this.buttonElement.bind("mousedown.button",function(){if(h.disabled)return!1;a(this).addClass("ui-state-active"),c=this,a(document).one("mouseup",function(){c=null})}).bind("mouseup.button",function(){if(h.disabled)return!1;a(this).removeClass("ui-state-active")}).bind("keydown.button",function(b){if(h.disabled)return!1;(b.keyCode==a.ui.keyCode.SPACE||b.keyCode==a.ui.keyCode.ENTER)&&a(this).addClass("ui-state-active")}).bind("keyup.button",function(){a(this).removeClass("ui-state-active")}),this.buttonElement.is("a")&&this.buttonElement.keyup(function(b){b.keyCode===a.ui.keyCode.SPACE&&a(this).click()})),this._setOption("disabled",h.disabled),this._resetButton()},_determineButtonType:function(){this.element.is(":checkbox")?this.type="checkbox":this.element.is(":radio")?this.type="radio":this.element.is("input")?this.type="input":this.type="button";if(this.type==="checkbox"||this.type==="radio"){var a=this.element.parents().filter(":last"),b="label[for='"+this.element.attr("id")+"']";this.buttonElement=a.find(b),this.buttonElement.length||(a=a.length?a.siblings():this.element.siblings(),this.buttonElement=a.filter(b),this.buttonElement.length||(this.buttonElement=a.find(b))),this.element.addClass("ui-helper-hidden-accessible");var c=this.element.is(":checked");c&&this.buttonElement.addClass("ui-state-active"),this.buttonElement.attr("aria-pressed",c)}else this.buttonElement=this.element},widget:function(){return this.buttonElement},destroy:function(){this.element.removeClass("ui-helper-hidden-accessible"),this.buttonElement.removeClass(g+" "+h+" "+i).removeAttr("role").removeAttr("aria-pressed").html(this.buttonElement.find(".ui-button-text").html()),this.hasTitle||this.buttonElement.removeAttr("title"),a.Widget.prototype.destroy.call(this)},_setOption:function(b,c){a.Widget.prototype._setOption.apply(this,arguments);if(b==="disabled"){c?this.element.propAttr("disabled",!0):this.element.propAttr("disabled",!1);return}this._resetButton()},refresh:function(){var b=this.element.is(":disabled");b!==this.options.disabled&&this._setOption("disabled",b),this.type==="radio"?k(this.element[0]).each(function(){a(this).is(":checked")?a(this).button("widget").addClass("ui-state-active").attr("aria-pressed","true"):a(this).button("widget").removeClass("ui-state-active").attr("aria-pressed","false")}):this.type==="checkbox"&&(this.element.is(":checked")?this.buttonElement.addClass("ui-state-active").attr("aria-pressed","true"):this.buttonElement.removeClass("ui-state-active").attr("aria-pressed","false"))},_resetButton:function(){if(this.type==="input"){this.options.label&&this.element.val(this.options.label);return}var b=this.buttonElement.removeClass(i),c=a("<span></span>",this.element[0].ownerDocument).addClass("ui-button-text").html(this.options.label).appendTo(b.empty()).text(),d=this.options.icons,e=d.primary&&d.secondary,f=[];d.primary||d.secondary?(this.options.text&&f.push("ui-button-text-icon"+(e?"s":d.primary?"-primary":"-secondary")),d.primary&&b.prepend("<span class='ui-button-icon-primary ui-icon "+d.primary+"'></span>"),d.secondary&&b.append("<span class='ui-button-icon-secondary ui-icon "+d.secondary+"'></span>"),this.options.text||(f.push(e?"ui-button-icons-only":"ui-button-icon-only"),this.hasTitle||b.attr("title",c))):f.push("ui-button-text-only"),b.addClass(f.join(" "))}}),a.widget("ui.buttonset",{options:{items:":button, :submit, :reset, :checkbox, :radio, a, :data(button)"},_create:function(){this.element.addClass("ui-buttonset")},_init:function(){this.refresh()},_setOption:function(b,c){b==="disabled"&&this.buttons.button("option",b,c),a.Widget.prototype._setOption.apply(this,arguments)},refresh:function(){var b=this.element.css("direction")==="rtl";this.buttons=this.element.find(this.options.items).filter(":ui-button").button("refresh").end().not(":ui-button").button().end().map(function(){return a(this).button("widget")[0]}).removeClass("ui-corner-all ui-corner-left ui-corner-right").filter(":first").addClass(b?"ui-corner-right":"ui-corner-left").end().filter(":last").addClass(b?"ui-corner-left":"ui-corner-right").end().end()},destroy:function(){this.element.removeClass("ui-buttonset"),this.buttons.map(function(){return a(this).button("widget")[0]}).removeClass("ui-corner-left ui-corner-right").end().button("destroy"),a.Widget.prototype.destroy.call(this)}})})(jQuery);;/*! jQuery UI - v1.8.21 - 2012-06-05
	* https://github.com/jquery/jquery-ui
	* Includes: jquery.ui.dialog.js
	* Copyright (c) 2012 AUTHORS.txt; Licensed MIT, GPL */
	(function(a,b){var c="ui-dialog ui-widget ui-widget-content ui-corner-all ",d={buttons:!0,height:!0,maxHeight:!0,maxWidth:!0,minHeight:!0,minWidth:!0,width:!0},e={maxHeight:!0,maxWidth:!0,minHeight:!0,minWidth:!0},f=a.attrFn||{val:!0,css:!0,html:!0,text:!0,data:!0,width:!0,height:!0,offset:!0,click:!0};a.widget("ui.dialog",{options:{autoOpen:!0,buttons:{},closeOnEscape:!0,closeText:"close",dialogClass:"",draggable:!0,hide:null,height:"auto",maxHeight:!1,maxWidth:!1,minHeight:150,minWidth:150,modal:!1,position:{my:"center",at:"center",collision:"fit",using:function(b){var c=a(this).css(b).offset().top;c<0&&a(this).css("top",b.top-c)}},resizable:!0,show:null,stack:!0,title:"",width:300,zIndex:1e3},_create:function(){this.originalTitle=this.element.attr("title"),typeof this.originalTitle!="string"&&(this.originalTitle=""),this.options.title=this.options.title||this.originalTitle;var b=this,d=b.options,e=d.title||"&#160;",f=a.ui.dialog.getTitleId(b.element),g=(b.uiDialog=a("<div></div>")).appendTo(document.body).hide().addClass(c+d.dialogClass).css({zIndex:d.zIndex}).attr("tabIndex",-1).css("outline",0).keydown(function(c){d.closeOnEscape&&!c.isDefaultPrevented()&&c.keyCode&&c.keyCode===a.ui.keyCode.ESCAPE&&(b.close(c),c.preventDefault())}).attr({role:"dialog","aria-labelledby":f}).mousedown(function(a){b.moveToTop(!1,a)}),h=b.element.show().removeAttr("title").addClass("ui-dialog-content ui-widget-content").appendTo(g),i=(b.uiDialogTitlebar=a("<div></div>")).addClass("ui-dialog-titlebar ui-widget-header ui-corner-all ui-helper-clearfix").prependTo(g),j=a('<a href="#"></a>').addClass("ui-dialog-titlebar-close ui-corner-all").attr("role","button").hover(function(){j.addClass("ui-state-hover")},function(){j.removeClass("ui-state-hover")}).focus(function(){j.addClass("ui-state-focus")}).blur(function(){j.removeClass("ui-state-focus")}).click(function(a){return b.close(a),!1}).appendTo(i),k=(b.uiDialogTitlebarCloseText=a("<span></span>")).addClass("ui-icon ui-icon-closethick").text(d.closeText).appendTo(j),l=a("<span></span>").addClass("ui-dialog-title").attr("id",f).html(e).prependTo(i);a.isFunction(d.beforeclose)&&!a.isFunction(d.beforeClose)&&(d.beforeClose=d.beforeclose),i.find("*").add(i).disableSelection(),d.draggable&&a.fn.draggable&&b._makeDraggable(),d.resizable&&a.fn.resizable&&b._makeResizable(),b._createButtons(d.buttons),b._isOpen=!1,a.fn.bgiframe&&g.bgiframe()},_init:function(){this.options.autoOpen&&this.open()},destroy:function(){var a=this;return a.overlay&&a.overlay.destroy(),a.uiDialog.hide(),a.element.unbind(".dialog").removeData("dialog").removeClass("ui-dialog-content ui-widget-content").hide().appendTo("body"),a.uiDialog.remove(),a.originalTitle&&a.element.attr("title",a.originalTitle),a},widget:function(){return this.uiDialog},close:function(b){var c=this,d,e;if(!1===c._trigger("beforeClose",b))return;return c.overlay&&c.overlay.destroy(),c.uiDialog.unbind("keypress.ui-dialog"),c._isOpen=!1,c.options.hide?c.uiDialog.hide(c.options.hide,function(){c._trigger("close",b)}):(c.uiDialog.hide(),c._trigger("close",b)),a.ui.dialog.overlay.resize(),c.options.modal&&(d=0,a(".ui-dialog").each(function(){this!==c.uiDialog[0]&&(e=a(this).css("z-index"),isNaN(e)||(d=Math.max(d,e)))}),a.ui.dialog.maxZ=d),c},isOpen:function(){return this._isOpen},moveToTop:function(b,c){var d=this,e=d.options,f;return e.modal&&!b||!e.stack&&!e.modal?d._trigger("focus",c):(e.zIndex>a.ui.dialog.maxZ&&(a.ui.dialog.maxZ=e.zIndex),d.overlay&&(a.ui.dialog.maxZ+=1,d.overlay.$el.css("z-index",a.ui.dialog.overlay.maxZ=a.ui.dialog.maxZ)),f={scrollTop:d.element.scrollTop(),scrollLeft:d.element.scrollLeft()},a.ui.dialog.maxZ+=1,d.uiDialog.css("z-index",a.ui.dialog.maxZ),d.element.attr(f),d._trigger("focus",c),d)},open:function(){if(this._isOpen)return;var b=this,c=b.options,d=b.uiDialog;return b.overlay=c.modal?new a.ui.dialog.overlay(b):null,b._size(),b._position(c.position),d.show(c.show),b.moveToTop(!0),c.modal&&d.bind("keydown.ui-dialog",function(b){if(b.keyCode!==a.ui.keyCode.TAB)return;var c=a(":tabbable",this),d=c.filter(":first"),e=c.filter(":last");if(b.target===e[0]&&!b.shiftKey)return d.focus(1),!1;if(b.target===d[0]&&b.shiftKey)return e.focus(1),!1}),a(b.element.find(":tabbable").get().concat(d.find(".ui-dialog-buttonpane :tabbable").get().concat(d.get()))).eq(0).focus(),b._isOpen=!0,b._trigger("open"),b},_createButtons:function(b){var c=this,d=!1,e=a("<div></div>").addClass("ui-dialog-buttonpane ui-widget-content ui-helper-clearfix"),g=a("<div></div>").addClass("ui-dialog-buttonset").appendTo(e);c.uiDialog.find(".ui-dialog-buttonpane").remove(),typeof b=="object"&&b!==null&&a.each(b,function(){return!(d=!0)}),d&&(a.each(b,function(b,d){d=a.isFunction(d)?{click:d,text:b}:d;var e=a('<button type="button"></button>').click(function(){d.click.apply(c.element[0],arguments)}).appendTo(g);a.each(d,function(a,b){if(a==="click")return;a in f?e[a](b):e.attr(a,b)}),a.fn.button&&e.button()}),e.appendTo(c.uiDialog))},_makeDraggable:function(){function f(a){return{position:a.position,offset:a.offset}}var b=this,c=b.options,d=a(document),e;b.uiDialog.draggable({cancel:".ui-dialog-content, .ui-dialog-titlebar-close",handle:".ui-dialog-titlebar",containment:"document",start:function(d,g){e=c.height==="auto"?"auto":a(this).height(),a(this).height(a(this).height()).addClass("ui-dialog-dragging"),b._trigger("dragStart",d,f(g))},drag:function(a,c){b._trigger("drag",a,f(c))},stop:function(g,h){c.position=[h.position.left-d.scrollLeft(),h.position.top-d.scrollTop()],a(this).removeClass("ui-dialog-dragging").height(e),b._trigger("dragStop",g,f(h)),a.ui.dialog.overlay.resize()}})},_makeResizable:function(c){function h(a){return{originalPosition:a.originalPosition,originalSize:a.originalSize,position:a.position,size:a.size}}c=c===b?this.options.resizable:c;var d=this,e=d.options,f=d.uiDialog.css("position"),g=typeof c=="string"?c:"n,e,s,w,se,sw,ne,nw";d.uiDialog.resizable({cancel:".ui-dialog-content",containment:"document",alsoResize:d.element,maxWidth:e.maxWidth,maxHeight:e.maxHeight,minWidth:e.minWidth,minHeight:d._minHeight(),handles:g,start:function(b,c){a(this).addClass("ui-dialog-resizing"),d._trigger("resizeStart",b,h(c))},resize:function(a,b){d._trigger("resize",a,h(b))},stop:function(b,c){a(this).removeClass("ui-dialog-resizing"),e.height=a(this).height(),e.width=a(this).width(),d._trigger("resizeStop",b,h(c)),a.ui.dialog.overlay.resize()}}).css("position",f).find(".ui-resizable-se").addClass("ui-icon ui-icon-grip-diagonal-se")},_minHeight:function(){var a=this.options;return a.height==="auto"?a.minHeight:Math.min(a.minHeight,a.height)},_position:function(b){var c=[],d=[0,0],e;if(b){if(typeof b=="string"||typeof b=="object"&&"0"in b)c=b.split?b.split(" "):[b[0],b[1]],c.length===1&&(c[1]=c[0]),a.each(["left","top"],function(a,b){+c[a]===c[a]&&(d[a]=c[a],c[a]=b)}),b={my:c.join(" "),at:c.join(" "),offset:d.join(" ")};b=a.extend({},a.ui.dialog.prototype.options.position,b)}else b=a.ui.dialog.prototype.options.position;e=this.uiDialog.is(":visible"),e||this.uiDialog.show(),this.uiDialog.css({top:0,left:0}).position(a.extend({of:window},b)),e||this.uiDialog.hide()},_setOptions:function(b){var c=this,f={},g=!1;a.each(b,function(a,b){c._setOption(a,b),a in d&&(g=!0),a in e&&(f[a]=b)}),g&&this._size(),this.uiDialog.is(":data(resizable)")&&this.uiDialog.resizable("option",f)},_setOption:function(b,d){var e=this,f=e.uiDialog;switch(b){case"beforeclose":b="beforeClose";break;case"buttons":e._createButtons(d);break;case"closeText":e.uiDialogTitlebarCloseText.text(""+d);break;case"dialogClass":f.removeClass(e.options.dialogClass).addClass(c+d);break;case"disabled":d?f.addClass("ui-dialog-disabled"):f.removeClass("ui-dialog-disabled");break;case"draggable":var g=f.is(":data(draggable)");g&&!d&&f.draggable("destroy"),!g&&d&&e._makeDraggable();break;case"position":e._position(d);break;case"resizable":var h=f.is(":data(resizable)");h&&!d&&f.resizable("destroy"),h&&typeof d=="string"&&f.resizable("option","handles",d),!h&&d!==!1&&e._makeResizable(d);break;case"title":a(".ui-dialog-title",e.uiDialogTitlebar).html(""+(d||"&#160;"))}a.Widget.prototype._setOption.apply(e,arguments)},_size:function(){var b=this.options,c,d,e=this.uiDialog.is(":visible");this.element.show().css({width:"auto",minHeight:0,height:0}),b.minWidth>b.width&&(b.width=b.minWidth),c=this.uiDialog.css({height:"auto",width:b.width}).height(),d=Math.max(0,b.minHeight-c);if(b.height==="auto")if(a.support.minHeight)this.element.css({minHeight:d,height:"auto"});else{this.uiDialog.show();var f=this.element.css("height","auto").height();e||this.uiDialog.hide(),this.element.height(Math.max(f,d))}else this.element.height(Math.max(b.height-c,0));this.uiDialog.is(":data(resizable)")&&this.uiDialog.resizable("option","minHeight",this._minHeight())}}),a.extend(a.ui.dialog,{version:"1.8.21",uuid:0,maxZ:0,getTitleId:function(a){var b=a.attr("id");return b||(this.uuid+=1,b=this.uuid),"ui-dialog-title-"+b},overlay:function(b){this.$el=a.ui.dialog.overlay.create(b)}}),a.extend(a.ui.dialog.overlay,{instances:[],oldInstances:[],maxZ:0,events:a.map("focus,mousedown,mouseup,keydown,keypress,click".split(","),function(a){return a+".dialog-overlay"}).join(" "),create:function(b){this.instances.length===0&&(setTimeout(function(){a.ui.dialog.overlay.instances.length&&a(document).bind(a.ui.dialog.overlay.events,function(b){if(a(b.target).zIndex()<a.ui.dialog.overlay.maxZ)return!1})},1),a(document).bind("keydown.dialog-overlay",function(c){b.options.closeOnEscape&&!c.isDefaultPrevented()&&c.keyCode&&c.keyCode===a.ui.keyCode.ESCAPE&&(b.close(c),c.preventDefault())}),a(window).bind("resize.dialog-overlay",a.ui.dialog.overlay.resize));var c=(this.oldInstances.pop()||a("<div></div>").addClass("ui-widget-overlay")).appendTo(document.body).css({width:this.width(),height:this.height()});return a.fn.bgiframe&&c.bgiframe(),this.instances.push(c),c},destroy:function(b){var c=a.inArray(b,this.instances);c!=-1&&this.oldInstances.push(this.instances.splice(c,1)[0]),this.instances.length===0&&a([document,window]).unbind(".dialog-overlay"),b.remove();var d=0;a.each(this.instances,function(){d=Math.max(d,this.css("z-index"))}),this.maxZ=d},height:function(){console.log('scrollHeight4');var b,c;return a.browser.msie&&a.browser.version<7?(b=Math.max(document.documentElement.scrollHeight,document.body.scrollHeight),c=Math.max(document.documentElement.offsetHeight,document.body.offsetHeight),b<c?a(window).height()+"px":b+"px"):a(document).height()+"px"},width:function(){var b,c;return a.browser.msie?(b=Math.max(document.documentElement.scrollWidth,document.body.scrollWidth),c=Math.max(document.documentElement.offsetWidth,document.body.offsetWidth),b<c?a(window).width()+"px":b+"px"):a(document).width()+"px"},resize:function(){var b=a([]);a.each(a.ui.dialog.overlay.instances,function(){b=b.add(this)}),b.css({width:0,height:0}).css({width:a.ui.dialog.overlay.width(),height:a.ui.dialog.overlay.height()})}}),a.extend(a.ui.dialog.overlay.prototype,{destroy:function(){a.ui.dialog.overlay.destroy(this.$el)}})})(jQuery);;/*! jQuery UI - v1.8.21 - 2012-06-05
	* https://github.com/jquery/jquery-ui
	* Includes: jquery.ui.slider.js
	* Copyright (c) 2012 AUTHORS.txt; Licensed MIT, GPL */
	(function(a,b){var c=5;a.widget("ui.slider",a.ui.mouse,{widgetEventPrefix:"slide",options:{animate:!1,distance:0,max:100,min:0,orientation:"horizontal",range:!1,step:1,value:0,values:null},_create:function(){var b=this,d=this.options,e=this.element.find(".ui-slider-handle").addClass("ui-state-default ui-corner-all"),f="<a class='ui-slider-handle ui-state-default ui-corner-all' href='#'></a>",g=d.values&&d.values.length||1,h=[];this._keySliding=!1,this._mouseSliding=!1,this._animateOff=!0,this._handleIndex=null,this._detectOrientation(),this._mouseInit(),this.element.addClass("ui-slider ui-slider-"+this.orientation+" ui-widget"+" ui-widget-content"+" ui-corner-all"+(d.disabled?" ui-slider-disabled ui-disabled":"")),this.range=a([]),d.range&&(d.range===!0&&(d.values||(d.values=[this._valueMin(),this._valueMin()]),d.values.length&&d.values.length!==2&&(d.values=[d.values[0],d.values[0]])),this.range=a("<div></div>").appendTo(this.element).addClass("ui-slider-range ui-widget-header"+(d.range==="min"||d.range==="max"?" ui-slider-range-"+d.range:"")));for(var i=e.length;i<g;i+=1)h.push(f);this.handles=e.add(a(h.join("")).appendTo(b.element)),this.handle=this.handles.eq(0),this.handles.add(this.range).filter("a").click(function(a){a.preventDefault()}).hover(function(){d.disabled||a(this).addClass("ui-state-hover")},function(){a(this).removeClass("ui-state-hover")}).focus(function(){d.disabled?a(this).blur():(a(".ui-slider .ui-state-focus").removeClass("ui-state-focus"),a(this).addClass("ui-state-focus"))}).blur(function(){a(this).removeClass("ui-state-focus")}),this.handles.each(function(b){a(this).data("index.ui-slider-handle",b)}),this.handles.keydown(function(d){var e=a(this).data("index.ui-slider-handle"),f,g,h,i;if(b.options.disabled)return;switch(d.keyCode){case a.ui.keyCode.HOME:case a.ui.keyCode.END:case a.ui.keyCode.PAGE_UP:case a.ui.keyCode.PAGE_DOWN:case a.ui.keyCode.UP:case a.ui.keyCode.RIGHT:case a.ui.keyCode.DOWN:case a.ui.keyCode.LEFT:d.preventDefault();if(!b._keySliding){b._keySliding=!0,a(this).addClass("ui-state-active"),f=b._start(d,e);if(f===!1)return}}i=b.options.step,b.options.values&&b.options.values.length?g=h=b.values(e):g=h=b.value();switch(d.keyCode){case a.ui.keyCode.HOME:h=b._valueMin();break;case a.ui.keyCode.END:h=b._valueMax();break;case a.ui.keyCode.PAGE_UP:h=b._trimAlignValue(g+(b._valueMax()-b._valueMin())/c);break;case a.ui.keyCode.PAGE_DOWN:h=b._trimAlignValue(g-(b._valueMax()-b._valueMin())/c);break;case a.ui.keyCode.UP:case a.ui.keyCode.RIGHT:if(g===b._valueMax())return;h=b._trimAlignValue(g+i);break;case a.ui.keyCode.DOWN:case a.ui.keyCode.LEFT:if(g===b._valueMin())return;h=b._trimAlignValue(g-i)}b._slide(d,e,h)}).keyup(function(c){var d=a(this).data("index.ui-slider-handle");b._keySliding&&(b._keySliding=!1,b._stop(c,d),b._change(c,d),a(this).removeClass("ui-state-active"))}),this._refreshValue(),this._animateOff=!1},destroy:function(){return this.handles.remove(),this.range.remove(),this.element.removeClass("ui-slider ui-slider-horizontal ui-slider-vertical ui-slider-disabled ui-widget ui-widget-content ui-corner-all").removeData("slider").unbind(".slider"),this._mouseDestroy(),this},_mouseCapture:function(b){var c=this.options,d,e,f,g,h,i,j,k,l;return c.disabled?!1:(this.elementSize={width:this.element.outerWidth(),height:this.element.outerHeight()},this.elementOffset=this.element.offset(),d={x:b.pageX,y:b.pageY},e=this._normValueFromMouse(d),f=this._valueMax()-this._valueMin()+1,h=this,this.handles.each(function(b){var c=Math.abs(e-h.values(b));f>c&&(f=c,g=a(this),i=b)}),c.range===!0&&this.values(1)===c.min&&(i+=1,g=a(this.handles[i])),j=this._start(b,i),j===!1?!1:(this._mouseSliding=!0,h._handleIndex=i,g.addClass("ui-state-active").focus(),k=g.offset(),l=!a(b.target).parents().andSelf().is(".ui-slider-handle"),this._clickOffset=l?{left:0,top:0}:{left:b.pageX-k.left-g.width()/2,top:b.pageY-k.top-g.height()/2-(parseInt(g.css("borderTopWidth"),10)||0)-(parseInt(g.css("borderBottomWidth"),10)||0)+(parseInt(g.css("marginTop"),10)||0)},this.handles.hasClass("ui-state-hover")||this._slide(b,i,e),this._animateOff=!0,!0))},_mouseStart:function(a){return!0},_mouseDrag:function(a){var b={x:a.pageX,y:a.pageY},c=this._normValueFromMouse(b);return this._slide(a,this._handleIndex,c),!1},_mouseStop:function(a){return this.handles.removeClass("ui-state-active"),this._mouseSliding=!1,this._stop(a,this._handleIndex),this._change(a,this._handleIndex),this._handleIndex=null,this._clickOffset=null,this._animateOff=!1,!1},_detectOrientation:function(){this.orientation=this.options.orientation==="vertical"?"vertical":"horizontal"},_normValueFromMouse:function(a){var b,c,d,e,f;return this.orientation==="horizontal"?(b=this.elementSize.width,c=a.x-this.elementOffset.left-(this._clickOffset?this._clickOffset.left:0)):(b=this.elementSize.height,c=a.y-this.elementOffset.top-(this._clickOffset?this._clickOffset.top:0)),d=c/b,d>1&&(d=1),d<0&&(d=0),this.orientation==="vertical"&&(d=1-d),e=this._valueMax()-this._valueMin(),f=this._valueMin()+d*e,this._trimAlignValue(f)},_start:function(a,b){var c={handle:this.handles[b],value:this.value()};return this.options.values&&this.options.values.length&&(c.value=this.values(b),c.values=this.values()),this._trigger("start",a,c)},_slide:function(a,b,c){var d,e,f;this.options.values&&this.options.values.length?(d=this.values(b?0:1),this.options.values.length===2&&this.options.range===!0&&(b===0&&c>d||b===1&&c<d)&&(c=d),c!==this.values(b)&&(e=this.values(),e[b]=c,f=this._trigger("slide",a,{handle:this.handles[b],value:c,values:e}),d=this.values(b?0:1),f!==!1&&this.values(b,c,!0))):c!==this.value()&&(f=this._trigger("slide",a,{handle:this.handles[b],value:c}),f!==!1&&this.value(c))},_stop:function(a,b){var c={handle:this.handles[b],value:this.value()};this.options.values&&this.options.values.length&&(c.value=this.values(b),c.values=this.values()),this._trigger("stop",a,c)},_change:function(a,b){if(!this._keySliding&&!this._mouseSliding){var c={handle:this.handles[b],value:this.value()};this.options.values&&this.options.values.length&&(c.value=this.values(b),c.values=this.values()),this._trigger("change",a,c)}},value:function(a){if(arguments.length){this.options.value=this._trimAlignValue(a),this._refreshValue(),this._change(null,0);return}return this._value()},values:function(b,c){var d,e,f;if(arguments.length>1){this.options.values[b]=this._trimAlignValue(c),this._refreshValue(),this._change(null,b);return}if(!arguments.length)return this._values();if(!a.isArray(arguments[0]))return this.options.values&&this.options.values.length?this._values(b):this.value();d=this.options.values,e=arguments[0];for(f=0;f<d.length;f+=1)d[f]=this._trimAlignValue(e[f]),this._change(null,f);this._refreshValue()},_setOption:function(b,c){var d,e=0;a.isArray(this.options.values)&&(e=this.options.values.length),a.Widget.prototype._setOption.apply(this,arguments);switch(b){case"disabled":c?(this.handles.filter(".ui-state-focus").blur(),this.handles.removeClass("ui-state-hover"),this.handles.propAttr("disabled",!0),this.element.addClass("ui-disabled")):(this.handles.propAttr("disabled",!1),this.element.removeClass("ui-disabled"));break;case"orientation":this._detectOrientation(),this.element.removeClass("ui-slider-horizontal ui-slider-vertical").addClass("ui-slider-"+this.orientation),this._refreshValue();break;case"value":this._animateOff=!0,this._refreshValue(),this._change(null,0),this._animateOff=!1;break;case"values":this._animateOff=!0,this._refreshValue();for(d=0;d<e;d+=1)this._change(null,d);this._animateOff=!1}},_value:function(){var a=this.options.value;return a=this._trimAlignValue(a),a},_values:function(a){var b,c,d;if(arguments.length)return b=this.options.values[a],b=this._trimAlignValue(b),b;c=this.options.values.slice();for(d=0;d<c.length;d+=1)c[d]=this._trimAlignValue(c[d]);return c},_trimAlignValue:function(a){if(a<=this._valueMin())return this._valueMin();if(a>=this._valueMax())return this._valueMax();var b=this.options.step>0?this.options.step:1,c=(a-this._valueMin())%b,d=a-c;return Math.abs(c)*2>=b&&(d+=c>0?b:-b),parseFloat(d.toFixed(5))},_valueMin:function(){return this.options.min},_valueMax:function(){return this.options.max},_refreshValue:function(){var b=this.options.range,c=this.options,d=this,e=this._animateOff?!1:c.animate,f,g={},h,i,j,k;this.options.values&&this.options.values.length?this.handles.each(function(b,i){f=(d.values(b)-d._valueMin())/(d._valueMax()-d._valueMin())*100,g[d.orientation==="horizontal"?"left":"bottom"]=f+"%",a(this).stop(1,1)[e?"animate":"css"](g,c.animate),d.options.range===!0&&(d.orientation==="horizontal"?(b===0&&d.range.stop(1,1)[e?"animate":"css"]({left:f+"%"},c.animate),b===1&&d.range[e?"animate":"css"]({width:f-h+"%"},{queue:!1,duration:c.animate})):(b===0&&d.range.stop(1,1)[e?"animate":"css"]({bottom:f+"%"},c.animate),b===1&&d.range[e?"animate":"css"]({height:f-h+"%"},{queue:!1,duration:c.animate}))),h=f}):(i=this.value(),j=this._valueMin(),k=this._valueMax(),f=k!==j?(i-j)/(k-j)*100:0,g[d.orientation==="horizontal"?"left":"bottom"]=f+"%",this.handle.stop(1,1)[e?"animate":"css"](g,c.animate),b==="min"&&this.orientation==="horizontal"&&this.range.stop(1,1)[e?"animate":"css"]({width:f+"%"},c.animate),b==="max"&&this.orientation==="horizontal"&&this.range[e?"animate":"css"]({width:100-f+"%"},{queue:!1,duration:c.animate}),b==="min"&&this.orientation==="vertical"&&this.range.stop(1,1)[e?"animate":"css"]({height:f+"%"},c.animate),b==="max"&&this.orientation==="vertical"&&this.range[e?"animate":"css"]({height:100-f+"%"},{queue:!1,duration:c.animate}))}}),a.extend(a.ui.slider,{version:"1.8.21"})})(jQuery);;/*! jQuery UI - v1.8.21 - 2012-06-05
	* https://github.com/jquery/jquery-ui
	* Includes: jquery.ui.tabs.js
	* Copyright (c) 2012 AUTHORS.txt; Licensed MIT, GPL */
	(function(a,b){function e(){return++c}function f(){return++d}var c=0,d=0;a.widget("ui.tabs",{options:{add:null,ajaxOptions:null,cache:!1,cookie:null,collapsible:!1,disable:null,disabled:[],enable:null,event:"click",fx:null,idPrefix:"ui-tabs-",load:null,panelTemplate:"<div></div>",remove:null,select:null,show:null,spinner:"<em>Loading&#8230;</em>",tabTemplate:"<li><a href='#{href}'><span>#{label}</span></a></li>"},_create:function(){this._tabify(!0)},_setOption:function(a,b){if(a=="selected"){if(this.options.collapsible&&b==this.options.selected)return;this.select(b)}else this.options[a]=b,this._tabify()},_tabId:function(a){return a.title&&a.title.replace(/\s/g,"_").replace(/[^\w\u00c0-\uFFFF-]/g,"")||this.options.idPrefix+e()},_sanitizeSelector:function(a){return a.replace(/:/g,"\\:")},_cookie:function(){var b=this.cookie||(this.cookie=this.options.cookie.name||"ui-tabs-"+f());return a.cookie.apply(null,[b].concat(a.makeArray(arguments)))},_ui:function(a,b){return{tab:a,panel:b,index:this.anchors.index(a)}},_cleanup:function(){this.lis.filter(".ui-state-processing").removeClass("ui-state-processing").find("span:data(label.tabs)").each(function(){var b=a(this);b.html(b.data("label.tabs")).removeData("label.tabs")})},_tabify:function(c){function m(b,c){b.css("display",""),!a.support.opacity&&c.opacity&&b[0].style.removeAttribute("filter")}var d=this,e=this.options,f=/^#.+/;this.list=this.element.find("ol,ul").eq(0),this.lis=a(" > li:has(a[href])",this.list),this.anchors=this.lis.map(function(){return a("a",this)[0]}),this.panels=a([]),this.anchors.each(function(b,c){var g=a(c).attr("href"),h=g.split("#")[0],i;h&&(h===location.toString().split("#")[0]||(i=a("base")[0])&&h===i.href)&&(g=c.hash,c.href=g);if(f.test(g))d.panels=d.panels.add(d.element.find(d._sanitizeSelector(g)));else if(g&&g!=="#"){a.data(c,"href.tabs",g),a.data(c,"load.tabs",g.replace(/#.*$/,""));var j=d._tabId(c);c.href="#"+j;var k=d.element.find("#"+j);k.length||(k=a(e.panelTemplate).attr("id",j).addClass("ui-tabs-panel ui-widget-content ui-corner-bottom").insertAfter(d.panels[b-1]||d.list),k.data("destroy.tabs",!0)),d.panels=d.panels.add(k)}else e.disabled.push(b)}),c?(this.element.addClass("ui-tabs ui-widget ui-widget-content ui-corner-all"),this.list.addClass("ui-tabs-nav ui-helper-reset ui-helper-clearfix ui-widget-header ui-corner-all"),this.lis.addClass("ui-state-default ui-corner-top"),this.panels.addClass("ui-tabs-panel ui-widget-content ui-corner-bottom"),e.selected===b?(location.hash&&this.anchors.each(function(a,b){if(b.hash==location.hash)return e.selected=a,!1}),typeof e.selected!="number"&&e.cookie&&(e.selected=parseInt(d._cookie(),10)),typeof e.selected!="number"&&this.lis.filter(".ui-tabs-selected").length&&(e.selected=this.lis.index(this.lis.filter(".ui-tabs-selected"))),e.selected=e.selected||(this.lis.length?0:-1)):e.selected===null&&(e.selected=-1),e.selected=e.selected>=0&&this.anchors[e.selected]||e.selected<0?e.selected:0,e.disabled=a.unique(e.disabled.concat(a.map(this.lis.filter(".ui-state-disabled"),function(a,b){return d.lis.index(a)}))).sort(),a.inArray(e.selected,e.disabled)!=-1&&e.disabled.splice(a.inArray(e.selected,e.disabled),1),this.panels.addClass("ui-tabs-hide"),this.lis.removeClass("ui-tabs-selected ui-state-active"),e.selected>=0&&this.anchors.length&&(d.element.find(d._sanitizeSelector(d.anchors[e.selected].hash)).removeClass("ui-tabs-hide"),this.lis.eq(e.selected).addClass("ui-tabs-selected ui-state-active"),d.element.queue("tabs",function(){d._trigger("show",null,d._ui(d.anchors[e.selected],d.element.find(d._sanitizeSelector(d.anchors[e.selected].hash))[0]))}),this.load(e.selected)),a(window).bind("unload",function(){d.lis.add(d.anchors).unbind(".tabs"),d.lis=d.anchors=d.panels=null})):e.selected=this.lis.index(this.lis.filter(".ui-tabs-selected")),this.element[e.collapsible?"addClass":"removeClass"]("ui-tabs-collapsible"),e.cookie&&this._cookie(e.selected,e.cookie);for(var g=0,h;h=this.lis[g];g++)a(h)[a.inArray(g,e.disabled)!=-1&&!a(h).hasClass("ui-tabs-selected")?"addClass":"removeClass"]("ui-state-disabled");e.cache===!1&&this.anchors.removeData("cache.tabs"),this.lis.add(this.anchors).unbind(".tabs");if(e.event!=="mouseover"){var i=function(a,b){b.is(":not(.ui-state-disabled)")&&b.addClass("ui-state-"+a)},j=function(a,b){b.removeClass("ui-state-"+a)};this.lis.bind("mouseover.tabs",function(){i("hover",a(this))}),this.lis.bind("mouseout.tabs",function(){j("hover",a(this))}),this.anchors.bind("focus.tabs",function(){i("focus",a(this).closest("li"))}),this.anchors.bind("blur.tabs",function(){j("focus",a(this).closest("li"))})}var k,l;e.fx&&(a.isArray(e.fx)?(k=e.fx[0],l=e.fx[1]):k=l=e.fx);var n=l?function(b,c){a(b).closest("li").addClass("ui-tabs-selected ui-state-active"),c.hide().removeClass("ui-tabs-hide").animate(l,l.duration||"normal",function(){m(c,l),d._trigger("show",null,d._ui(b,c[0]))})}:function(b,c){a(b).closest("li").addClass("ui-tabs-selected ui-state-active"),c.removeClass("ui-tabs-hide"),d._trigger("show",null,d._ui(b,c[0]))},o=k?function(a,b){b.animate(k,k.duration||"normal",function(){d.lis.removeClass("ui-tabs-selected ui-state-active"),b.addClass("ui-tabs-hide"),m(b,k),d.element.dequeue("tabs")})}:function(a,b,c){d.lis.removeClass("ui-tabs-selected ui-state-active"),b.addClass("ui-tabs-hide"),d.element.dequeue("tabs")};this.anchors.bind(e.event+".tabs",function(){var b=this,c=a(b).closest("li"),f=d.panels.filter(":not(.ui-tabs-hide)"),g=d.element.find(d._sanitizeSelector(b.hash));if(c.hasClass("ui-tabs-selected")&&!e.collapsible||c.hasClass("ui-state-disabled")||c.hasClass("ui-state-processing")||d.panels.filter(":animated").length||d._trigger("select",null,d._ui(this,g[0]))===!1)return this.blur(),!1;e.selected=d.anchors.index(this),d.abort();if(e.collapsible){if(c.hasClass("ui-tabs-selected"))return e.selected=-1,e.cookie&&d._cookie(e.selected,e.cookie),d.element.queue("tabs",function(){o(b,f)}).dequeue("tabs"),this.blur(),!1;if(!f.length)return e.cookie&&d._cookie(e.selected,e.cookie),d.element.queue("tabs",function(){n(b,g)}),d.load(d.anchors.index(this)),this.blur(),!1}e.cookie&&d._cookie(e.selected,e.cookie);if(g.length)f.length&&d.element.queue("tabs",function(){o(b,f)}),d.element.queue("tabs",function(){n(b,g)}),d.load(d.anchors.index(this));else throw"jQuery UI Tabs: Mismatching fragment identifier.";a.browser.msie&&this.blur()}),this.anchors.bind("click.tabs",function(){return!1})},_getIndex:function(a){return typeof a=="string"&&(a=this.anchors.index(this.anchors.filter("[href$='"+a+"']"))),a},destroy:function(){var b=this.options;return this.abort(),this.element.unbind(".tabs").removeClass("ui-tabs ui-widget ui-widget-content ui-corner-all ui-tabs-collapsible").removeData("tabs"),this.list.removeClass("ui-tabs-nav ui-helper-reset ui-helper-clearfix ui-widget-header ui-corner-all"),this.anchors.each(function(){var b=a.data(this,"href.tabs");b&&(this.href=b);var c=a(this).unbind(".tabs");a.each(["href","load","cache"],function(a,b){c.removeData(b+".tabs")})}),this.lis.unbind(".tabs").add(this.panels).each(function(){a.data(this,"destroy.tabs")?a(this).remove():a(this).removeClass(["ui-state-default","ui-corner-top","ui-tabs-selected","ui-state-active","ui-state-hover","ui-state-focus","ui-state-disabled","ui-tabs-panel","ui-widget-content","ui-corner-bottom","ui-tabs-hide"].join(" "))}),b.cookie&&this._cookie(null,b.cookie),this},add:function(c,d,e){e===b&&(e=this.anchors.length);var f=this,g=this.options,h=a(g.tabTemplate.replace(/#\{href\}/g,c).replace(/#\{label\}/g,d)),i=c.indexOf("#")?this._tabId(a("a",h)[0]):c.replace("#","");h.addClass("ui-state-default ui-corner-top").data("destroy.tabs",!0);var j=f.element.find("#"+i);return j.length||(j=a(g.panelTemplate).attr("id",i).data("destroy.tabs",!0)),j.addClass("ui-tabs-panel ui-widget-content ui-corner-bottom ui-tabs-hide"),e>=this.lis.length?(h.appendTo(this.list),j.appendTo(this.list[0].parentNode)):(h.insertBefore(this.lis[e]),j.insertBefore(this.panels[e])),g.disabled=a.map(g.disabled,function(a,b){return a>=e?++a:a}),this._tabify(),this.anchors.length==1&&(g.selected=0,h.addClass("ui-tabs-selected ui-state-active"),j.removeClass("ui-tabs-hide"),this.element.queue("tabs",function(){f._trigger("show",null,f._ui(f.anchors[0],f.panels[0]))}),this.load(0)),this._trigger("add",null,this._ui(this.anchors[e],this.panels[e])),this},remove:function(b){b=this._getIndex(b);var c=this.options,d=this.lis.eq(b).remove(),e=this.panels.eq(b).remove();return d.hasClass("ui-tabs-selected")&&this.anchors.length>1&&this.select(b+(b+1<this.anchors.length?1:-1)),c.disabled=a.map(a.grep(c.disabled,function(a,c){return a!=b}),function(a,c){return a>=b?--a:a}),this._tabify(),this._trigger("remove",null,this._ui(d.find("a")[0],e[0])),this},enable:function(b){b=this._getIndex(b);var c=this.options;if(a.inArray(b,c.disabled)==-1)return;return this.lis.eq(b).removeClass("ui-state-disabled"),c.disabled=a.grep(c.disabled,function(a,c){return a!=b}),this._trigger("enable",null,this._ui(this.anchors[b],this.panels[b])),this},disable:function(a){a=this._getIndex(a);var b=this,c=this.options;return a!=c.selected&&(this.lis.eq(a).addClass("ui-state-disabled"),c.disabled.push(a),c.disabled.sort(),this._trigger("disable",null,this._ui(this.anchors[a],this.panels[a]))),this},select:function(a){a=this._getIndex(a);if(a==-1)if(this.options.collapsible&&this.options.selected!=-1)a=this.options.selected;else return this;return this.anchors.eq(a).trigger(this.options.event+".tabs"),this},load:function(b){b=this._getIndex(b);var c=this,d=this.options,e=this.anchors.eq(b)[0],f=a.data(e,"load.tabs");this.abort();if(!f||this.element.queue("tabs").length!==0&&a.data(e,"cache.tabs")){this.element.dequeue("tabs");return}this.lis.eq(b).addClass("ui-state-processing");if(d.spinner){var g=a("span",e);g.data("label.tabs",g.html()).html(d.spinner)}return this.xhr=a.ajax(a.extend({},d.ajaxOptions,{url:f,success:function(f,g){c.element.find(c._sanitizeSelector(e.hash)).html(f),c._cleanup(),d.cache&&a.data(e,"cache.tabs",!0),c._trigger("load",null,c._ui(c.anchors[b],c.panels[b]));try{d.ajaxOptions.success(f,g)}catch(h){}},error:function(a,f,g){c._cleanup(),c._trigger("load",null,c._ui(c.anchors[b],c.panels[b]));try{d.ajaxOptions.error(a,f,b,e)}catch(g){}}})),c.element.dequeue("tabs"),this},abort:function(){return this.element.queue([]),this.panels.stop(!1,!0),this.element.queue("tabs",this.element.queue("tabs").splice(-2,2)),this.xhr&&(this.xhr.abort(),delete this.xhr),this._cleanup(),this},url:function(a,b){return this.anchors.eq(a).removeData("cache.tabs").data("load.tabs",b),this},length:function(){return this.anchors.length}}),a.extend(a.ui.tabs,{version:"1.8.21"}),a.extend(a.ui.tabs.prototype,{rotation:null,rotate:function(a,b){var c=this,d=this.options,e=c._rotate||(c._rotate=function(b){clearTimeout(c.rotation),c.rotation=setTimeout(function(){var a=d.selected;c.select(++a<c.anchors.length?a:0)},a),b&&b.stopPropagation()}),f=c._unrotate||(c._unrotate=b?function(a){e()}:function(a){a.clientX&&c.rotate(null)});return a?(this.element.bind("tabsshow",e),this.anchors.bind(d.event+".tabs",f),e()):(clearTimeout(c.rotation),this.element.unbind("tabsshow",e),this.anchors.unbind(d.event+".tabs",f),delete this._rotate,delete this._unrotate),this}})})(jQuery);;/*! jQuery UI - v1.8.21 - 2012-06-05
	* https://github.com/jquery/jquery-ui
	* Includes: jquery.ui.datepicker.js
	* Copyright (c) 2012 AUTHORS.txt; Licensed MIT, GPL */
	(function($,undefined){function Datepicker(){this.debug=!1,this._curInst=null,this._keyEvent=!1,this._disabledInputs=[],this._datepickerShowing=!1,this._inDialog=!1,this._mainDivId="ui-datepicker-div",this._inlineClass="ui-datepicker-inline",this._appendClass="ui-datepicker-append",this._triggerClass="ui-datepicker-trigger",this._dialogClass="ui-datepicker-dialog",this._disableClass="ui-datepicker-disabled",this._unselectableClass="ui-datepicker-unselectable",this._currentClass="ui-datepicker-current-day",this._dayOverClass="ui-datepicker-days-cell-over",this.regional=[],this.regional[""]={closeText:"Done",prevText:"Prev",nextText:"Next",currentText:"Today",monthNames:["January","February","March","April","May","June","July","August","September","October","November","December"],monthNamesShort:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],dayNames:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],dayNamesShort:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],dayNamesMin:["Su","Mo","Tu","We","Th","Fr","Sa"],weekHeader:"Wk",dateFormat:"mm/dd/yy",firstDay:0,isRTL:!1,showMonthAfterYear:!1,yearSuffix:""},this._defaults={showOn:"focus",showAnim:"fadeIn",showOptions:{},defaultDate:null,appendText:"",buttonText:"...",buttonImage:"",buttonImageOnly:!1,hideIfNoPrevNext:!1,navigationAsDateFormat:!1,gotoCurrent:!1,changeMonth:!1,changeYear:!1,yearRange:"c-10:c+10",showOtherMonths:!1,selectOtherMonths:!1,showWeek:!1,calculateWeek:this.iso8601Week,shortYearCutoff:"+10",minDate:null,maxDate:null,duration:"fast",beforeShowDay:null,beforeShow:null,onSelect:null,onChangeMonthYear:null,onClose:null,numberOfMonths:1,showCurrentAtPos:0,stepMonths:1,stepBigMonths:12,altField:"",altFormat:"",constrainInput:!0,showButtonPanel:!1,autoSize:!1,disabled:!1},$.extend(this._defaults,this.regional[""]),this.dpDiv=bindHover($('<div id="'+this._mainDivId+'" class="ui-datepicker ui-widget ui-widget-content ui-helper-clearfix ui-corner-all"></div>'))}function bindHover(a){var b="button, .ui-datepicker-prev, .ui-datepicker-next, .ui-datepicker-calendar td a";return a.bind("mouseout",function(a){var c=$(a.target).closest(b);if(!c.length)return;c.removeClass("ui-state-hover ui-datepicker-prev-hover ui-datepicker-next-hover")}).bind("mouseover",function(c){var d=$(c.target).closest(b);if($.datepicker._isDisabledDatepicker(instActive.inline?a.parent()[0]:instActive.input[0])||!d.length)return;d.parents(".ui-datepicker-calendar").find("a").removeClass("ui-state-hover"),d.addClass("ui-state-hover"),d.hasClass("ui-datepicker-prev")&&d.addClass("ui-datepicker-prev-hover"),d.hasClass("ui-datepicker-next")&&d.addClass("ui-datepicker-next-hover")})}function extendRemove(a,b){$.extend(a,b);for(var c in b)if(b[c]==null||b[c]==undefined)a[c]=b[c];return a}function isArray(a){return a&&($.browser.safari&&typeof a=="object"&&a.length||a.constructor&&a.constructor.toString().match(/\Array\(\)/))}$.extend($.ui,{datepicker:{version:"1.8.21"}});var PROP_NAME="datepicker",dpuuid=(new Date).getTime(),instActive;$.extend(Datepicker.prototype,{markerClassName:"hasDatepicker",maxRows:4,log:function(){this.debug&&console.log.apply("",arguments)},_widgetDatepicker:function(){return this.dpDiv},setDefaults:function(a){return extendRemove(this._defaults,a||{}),this},_attachDatepicker:function(target,settings){var inlineSettings=null;for(var attrName in this._defaults){var attrValue=target.getAttribute("date:"+attrName);if(attrValue){inlineSettings=inlineSettings||{};try{inlineSettings[attrName]=eval(attrValue)}catch(err){inlineSettings[attrName]=attrValue}}}var nodeName=target.nodeName.toLowerCase(),inline=nodeName=="div"||nodeName=="span";target.id||(this.uuid+=1,target.id="dp"+this.uuid);var inst=this._newInst($(target),inline);inst.settings=$.extend({},settings||{},inlineSettings||{}),nodeName=="input"?this._connectDatepicker(target,inst):inline&&this._inlineDatepicker(target,inst)},_newInst:function(a,b){var c=a[0].id.replace(/([^A-Za-z0-9_-])/g,"\\\\$1");return{id:c,input:a,selectedDay:0,selectedMonth:0,selectedYear:0,drawMonth:0,drawYear:0,inline:b,dpDiv:b?bindHover($('<div class="'+this._inlineClass+' ui-datepicker ui-widget ui-widget-content ui-helper-clearfix ui-corner-all"></div>')):this.dpDiv}},_connectDatepicker:function(a,b){var c=$(a);b.append=$([]),b.trigger=$([]);if(c.hasClass(this.markerClassName))return;this._attachments(c,b),c.addClass(this.markerClassName).keydown(this._doKeyDown).keypress(this._doKeyPress).keyup(this._doKeyUp).bind("setData.datepicker",function(a,c,d){b.settings[c]=d}).bind("getData.datepicker",function(a,c){return this._get(b,c)}),this._autoSize(b),$.data(a,PROP_NAME,b),b.settings.disabled&&this._disableDatepicker(a)},_attachments:function(a,b){var c=this._get(b,"appendText"),d=this._get(b,"isRTL");b.append&&b.append.remove(),c&&(b.append=$('<span class="'+this._appendClass+'">'+c+"</span>"),a[d?"before":"after"](b.append)),a.unbind("focus",this._showDatepicker),b.trigger&&b.trigger.remove();var e=this._get(b,"showOn");(e=="focus"||e=="both")&&a.focus(this._showDatepicker);if(e=="button"||e=="both"){var f=this._get(b,"buttonText"),g=this._get(b,"buttonImage");b.trigger=$(this._get(b,"buttonImageOnly")?$("<img/>").addClass(this._triggerClass).attr({src:g,alt:f,title:f}):$('<button type="button"></button>').addClass(this._triggerClass).html(g==""?f:$("<img/>").attr({src:g,alt:f,title:f}))),a[d?"before":"after"](b.trigger),b.trigger.click(function(){return $.datepicker._datepickerShowing&&$.datepicker._lastInput==a[0]?$.datepicker._hideDatepicker():$.datepicker._datepickerShowing&&$.datepicker._lastInput!=a[0]?($.datepicker._hideDatepicker(),$.datepicker._showDatepicker(a[0])):$.datepicker._showDatepicker(a[0]),!1})}},_autoSize:function(a){if(this._get(a,"autoSize")&&!a.inline){var b=new Date(2009,11,20),c=this._get(a,"dateFormat");if(c.match(/[DM]/)){var d=function(a){var b=0,c=0;for(var d=0;d<a.length;d++)a[d].length>b&&(b=a[d].length,c=d);return c};b.setMonth(d(this._get(a,c.match(/MM/)?"monthNames":"monthNamesShort"))),b.setDate(d(this._get(a,c.match(/DD/)?"dayNames":"dayNamesShort"))+20-b.getDay())}a.input.attr("size",this._formatDate(a,b).length)}},_inlineDatepicker:function(a,b){var c=$(a);if(c.hasClass(this.markerClassName))return;c.addClass(this.markerClassName).append(b.dpDiv).bind("setData.datepicker",function(a,c,d){b.settings[c]=d}).bind("getData.datepicker",function(a,c){return this._get(b,c)}),$.data(a,PROP_NAME,b),this._setDate(b,this._getDefaultDate(b),!0),this._updateDatepicker(b),this._updateAlternate(b),b.settings.disabled&&this._disableDatepicker(a),b.dpDiv.css("display","block")},_dialogDatepicker:function(a,b,c,d,e){var f=this._dialogInst;if(!f){this.uuid+=1;var g="dp"+this.uuid;this._dialogInput=$('<input type="text" id="'+g+'" style="position: absolute; top: -100px; width: 0px; z-index: -10;"/>'),this._dialogInput.keydown(this._doKeyDown),$("body").append(this._dialogInput),f=this._dialogInst=this._newInst(this._dialogInput,!1),f.settings={},$.data(this._dialogInput[0],PROP_NAME,f)}extendRemove(f.settings,d||{}),b=b&&b.constructor==Date?this._formatDate(f,b):b,this._dialogInput.val(b),this._pos=e?e.length?e:[e.pageX,e.pageY]:null;if(!this._pos){var h=document.documentElement.clientWidth,i=document.documentElement.clientHeight,j=document.documentElement.scrollLeft||document.body.scrollLeft,k=document.documentElement.scrollTop||document.body.scrollTop;this._pos=[h/2-100+j,i/2-150+k]}return this._dialogInput.css("left",this._pos[0]+20+"px").css("top",this._pos[1]+"px"),f.settings.onSelect=c,this._inDialog=!0,this.dpDiv.addClass(this._dialogClass),this._showDatepicker(this._dialogInput[0]),$.blockUI&&$.blockUI(this.dpDiv),$.data(this._dialogInput[0],PROP_NAME,f),this},_destroyDatepicker:function(a){var b=$(a),c=$.data(a,PROP_NAME);if(!b.hasClass(this.markerClassName))return;var d=a.nodeName.toLowerCase();$.removeData(a,PROP_NAME),d=="input"?(c.append.remove(),c.trigger.remove(),b.removeClass(this.markerClassName).unbind("focus",this._showDatepicker).unbind("keydown",this._doKeyDown).unbind("keypress",this._doKeyPress).unbind("keyup",this._doKeyUp)):(d=="div"||d=="span")&&b.removeClass(this.markerClassName).empty()},_enableDatepicker:function(a){var b=$(a),c=$.data(a,PROP_NAME);if(!b.hasClass(this.markerClassName))return;var d=a.nodeName.toLowerCase();if(d=="input")a.disabled=!1,c.trigger.filter("button").each(function(){this.disabled=!1}).end().filter("img").css({opacity:"1.0",cursor:""});else if(d=="div"||d=="span"){var e=b.children("."+this._inlineClass);e.children().removeClass("ui-state-disabled"),e.find("select.ui-datepicker-month, select.ui-datepicker-year").removeAttr("disabled")}this._disabledInputs=$.map(this._disabledInputs,function(b){return b==a?null:b})},_disableDatepicker:function(a){var b=$(a),c=$.data(a,PROP_NAME);if(!b.hasClass(this.markerClassName))return;var d=a.nodeName.toLowerCase();if(d=="input")a.disabled=!0,c.trigger.filter("button").each(function(){this.disabled=!0}).end().filter("img").css({opacity:"0.5",cursor:"default"});else if(d=="div"||d=="span"){var e=b.children("."+this._inlineClass);e.children().addClass("ui-state-disabled"),e.find("select.ui-datepicker-month, select.ui-datepicker-year").attr("disabled","disabled")}this._disabledInputs=$.map(this._disabledInputs,function(b){return b==a?null:b}),this._disabledInputs[this._disabledInputs.length]=a},_isDisabledDatepicker:function(a){if(!a)return!1;for(var b=0;b<this._disabledInputs.length;b++)if(this._disabledInputs[b]==a)return!0;return!1},_getInst:function(a){try{return $.data(a,PROP_NAME)}catch(b){throw"Missing instance data for this datepicker"}},_optionDatepicker:function(a,b,c){var d=this._getInst(a);if(arguments.length==2&&typeof b=="string")return b=="defaults"?$.extend({},$.datepicker._defaults):d?b=="all"?$.extend({},d.settings):this._get(d,b):null;var e=b||{};typeof b=="string"&&(e={},e[b]=c);if(d){this._curInst==d&&this._hideDatepicker();var f=this._getDateDatepicker(a,!0),g=this._getMinMaxDate(d,"min"),h=this._getMinMaxDate(d,"max");extendRemove(d.settings,e),g!==null&&e.dateFormat!==undefined&&e.minDate===undefined&&(d.settings.minDate=this._formatDate(d,g)),h!==null&&e.dateFormat!==undefined&&e.maxDate===undefined&&(d.settings.maxDate=this._formatDate(d,h)),this._attachments($(a),d),this._autoSize(d),this._setDate(d,f),this._updateAlternate(d),this._updateDatepicker(d)}},_changeDatepicker:function(a,b,c){this._optionDatepicker(a,b,c)},_refreshDatepicker:function(a){var b=this._getInst(a);b&&this._updateDatepicker(b)},_setDateDatepicker:function(a,b){var c=this._getInst(a);c&&(this._setDate(c,b),this._updateDatepicker(c),this._updateAlternate(c))},_getDateDatepicker:function(a,b){var c=this._getInst(a);return c&&!c.inline&&this._setDateFromField(c,b),c?this._getDate(c):null},_doKeyDown:function(a){var b=$.datepicker._getInst(a.target),c=!0,d=b.dpDiv.is(".ui-datepicker-rtl");b._keyEvent=!0;if($.datepicker._datepickerShowing)switch(a.keyCode){case 9:$.datepicker._hideDatepicker(),c=!1;break;case 13:var e=$("td."+$.datepicker._dayOverClass+":not(."+$.datepicker._currentClass+")",b.dpDiv);e[0]&&$.datepicker._selectDay(a.target,b.selectedMonth,b.selectedYear,e[0]);var f=$.datepicker._get(b,"onSelect");if(f){var g=$.datepicker._formatDate(b);f.apply(b.input?b.input[0]:null,[g,b])}else $.datepicker._hideDatepicker();return!1;case 27:$.datepicker._hideDatepicker();break;case 33:$.datepicker._adjustDate(a.target,a.ctrlKey?-$.datepicker._get(b,"stepBigMonths"):-$.datepicker._get(b,"stepMonths"),"M");break;case 34:$.datepicker._adjustDate(a.target,a.ctrlKey?+$.datepicker._get(b,"stepBigMonths"):+$.datepicker._get(b,"stepMonths"),"M");break;case 35:(a.ctrlKey||a.metaKey)&&$.datepicker._clearDate(a.target),c=a.ctrlKey||a.metaKey;break;case 36:(a.ctrlKey||a.metaKey)&&$.datepicker._gotoToday(a.target),c=a.ctrlKey||a.metaKey;break;case 37:(a.ctrlKey||a.metaKey)&&$.datepicker._adjustDate(a.target,d?1:-1,"D"),c=a.ctrlKey||a.metaKey,a.originalEvent.altKey&&$.datepicker._adjustDate(a.target,a.ctrlKey?-$.datepicker._get(b,"stepBigMonths"):-$.datepicker._get(b,"stepMonths"),"M");break;case 38:(a.ctrlKey||a.metaKey)&&$.datepicker._adjustDate(a.target,-7,"D"),c=a.ctrlKey||a.metaKey;break;case 39:(a.ctrlKey||a.metaKey)&&$.datepicker._adjustDate(a.target,d?-1:1,"D"),c=a.ctrlKey||a.metaKey,a.originalEvent.altKey&&$.datepicker._adjustDate(a.target,a.ctrlKey?+$.datepicker._get(b,"stepBigMonths"):+$.datepicker._get(b,"stepMonths"),"M");break;case 40:(a.ctrlKey||a.metaKey)&&$.datepicker._adjustDate(a.target,7,"D"),c=a.ctrlKey||a.metaKey;break;default:c=!1}else a.keyCode==36&&a.ctrlKey?$.datepicker._showDatepicker(this):c=!1;c&&(a.preventDefault(),a.stopPropagation())},_doKeyPress:function(a){var b=$.datepicker._getInst(a.target);if($.datepicker._get(b,"constrainInput")){var c=$.datepicker._possibleChars($.datepicker._get(b,"dateFormat")),d=String.fromCharCode(a.charCode==undefined?a.keyCode:a.charCode);return a.ctrlKey||a.metaKey||d<" "||!c||c.indexOf(d)>-1}},_doKeyUp:function(a){var b=$.datepicker._getInst(a.target);if(b.input.val()!=b.lastVal)try{var c=$.datepicker.parseDate($.datepicker._get(b,"dateFormat"),b.input?b.input.val():null,$.datepicker._getFormatConfig(b));c&&($.datepicker._setDateFromField(b),$.datepicker._updateAlternate(b),$.datepicker._updateDatepicker(b))}catch(d){$.datepicker.log(d)}return!0},_showDatepicker:function(a){a=a.target||a,a.nodeName.toLowerCase()!="input"&&(a=$("input",a.parentNode)[0]);if($.datepicker._isDisabledDatepicker(a)||$.datepicker._lastInput==a)return;var b=$.datepicker._getInst(a);$.datepicker._curInst&&$.datepicker._curInst!=b&&($.datepicker._curInst.dpDiv.stop(!0,!0),b&&$.datepicker._datepickerShowing&&$.datepicker._hideDatepicker($.datepicker._curInst.input[0]));var c=$.datepicker._get(b,"beforeShow"),d=c?c.apply(a,[a,b]):{};if(d===!1)return;extendRemove(b.settings,d),b.lastVal=null,$.datepicker._lastInput=a,$.datepicker._setDateFromField(b),$.datepicker._inDialog&&(a.value=""),$.datepicker._pos||($.datepicker._pos=$.datepicker._findPos(a),$.datepicker._pos[1]+=a.offsetHeight);var e=!1;$(a).parents().each(function(){return e|=$(this).css("position")=="fixed",!e}),e&&$.browser.opera&&($.datepicker._pos[0]-=document.documentElement.scrollLeft,$.datepicker._pos[1]-=document.documentElement.scrollTop);var f={left:$.datepicker._pos[0],top:$.datepicker._pos[1]};$.datepicker._pos=null,b.dpDiv.empty(),b.dpDiv.css({position:"absolute",display:"block",top:"-1000px"}),$.datepicker._updateDatepicker(b),f=$.datepicker._checkOffset(b,f,e),b.dpDiv.css({position:$.datepicker._inDialog&&$.blockUI?"static":e?"fixed":"absolute",display:"none",left:f.left+"px",top:f.top+"px"});if(!b.inline){var g=$.datepicker._get(b,"showAnim"),h=$.datepicker._get(b,"duration"),i=function(){var a=b.dpDiv.find("iframe.ui-datepicker-cover");if(!!a.length){var c=$.datepicker._getBorders(b.dpDiv);a.css({left:-c[0],top:-c[1],width:b.dpDiv.outerWidth(),height:b.dpDiv.outerHeight()})}};b.dpDiv.zIndex($(a).zIndex()+1),$.datepicker._datepickerShowing=!0,$.effects&&$.effects[g]?b.dpDiv.show(g,$.datepicker._get(b,"showOptions"),h,i):b.dpDiv[g||"show"](g?h:null,i),(!g||!h)&&i(),b.input.is(":visible")&&!b.input.is(":disabled")&&b.input.focus(),$.datepicker._curInst=b}},_updateDatepicker:function(a){var b=this;b.maxRows=4;var c=$.datepicker._getBorders(a.dpDiv);instActive=a,a.dpDiv.empty().append(this._generateHTML(a));var d=a.dpDiv.find("iframe.ui-datepicker-cover");!d.length||d.css({left:-c[0],top:-c[1],width:a.dpDiv.outerWidth(),height:a.dpDiv.outerHeight()}),a.dpDiv.find("."+this._dayOverClass+" a").mouseover();var e=this._getNumberOfMonths(a),f=e[1],g=17;a.dpDiv.removeClass("ui-datepicker-multi-2 ui-datepicker-multi-3 ui-datepicker-multi-4").width(""),f>1&&a.dpDiv.addClass("ui-datepicker-multi-"+f).css("width",g*f+"em"),a.dpDiv[(e[0]!=1||e[1]!=1?"add":"remove")+"Class"]("ui-datepicker-multi"),a.dpDiv[(this._get(a,"isRTL")?"add":"remove")+"Class"]("ui-datepicker-rtl"),a==$.datepicker._curInst&&$.datepicker._datepickerShowing&&a.input&&a.input.is(":visible")&&!a.input.is(":disabled")&&a.input[0]!=document.activeElement&&a.input.focus();if(a.yearshtml){var h=a.yearshtml;setTimeout(function(){h===a.yearshtml&&a.yearshtml&&a.dpDiv.find("select.ui-datepicker-year:first").replaceWith(a.yearshtml),h=a.yearshtml=null},0)}},_getBorders:function(a){var b=function(a){return{thin:1,medium:2,thick:3}[a]||a};return[parseFloat(b(a.css("border-left-width"))),parseFloat(b(a.css("border-top-width")))]},_checkOffset:function(a,b,c){var d=a.dpDiv.outerWidth(),e=a.dpDiv.outerHeight(),f=a.input?a.input.outerWidth():0,g=a.input?a.input.outerHeight():0,h=document.documentElement.clientWidth+$(document).scrollLeft(),i=document.documentElement.clientHeight+$(document).scrollTop();return b.left-=this._get(a,"isRTL")?d-f:0,b.left-=c&&b.left==a.input.offset().left?$(document).scrollLeft():0,b.top-=c&&b.top==a.input.offset().top+g?$(document).scrollTop():0,b.left-=Math.min(b.left,b.left+d>h&&h>d?Math.abs(b.left+d-h):0),b.top-=Math.min(b.top,b.top+e>i&&i>e?Math.abs(e+g):0),b},_findPos:function(a){var b=this._getInst(a),c=this._get(b,"isRTL");while(a&&(a.type=="hidden"||a.nodeType!=1||$.expr.filters.hidden(a)))a=a[c?"previousSibling":"nextSibling"];var d=$(a).offset();return[d.left,d.top]},_hideDatepicker:function(a){var b=this._curInst;if(!b||a&&b!=$.data(a,PROP_NAME))return;if(this._datepickerShowing){var c=this._get(b,"showAnim"),d=this._get(b,"duration"),e=function(){$.datepicker._tidyDialog(b)};$.effects&&$.effects[c]?b.dpDiv.hide(c,$.datepicker._get(b,"showOptions"),d,e):b.dpDiv[c=="slideDown"?"slideUp":c=="fadeIn"?"fadeOut":"hide"](c?d:null,e),c||e(),this._datepickerShowing=!1;var f=this._get(b,"onClose");f&&f.apply(b.input?b.input[0]:null,[b.input?b.input.val():"",b]),this._lastInput=null,this._inDialog&&(this._dialogInput.css({position:"absolute",left:"0",top:"-100px"}),$.blockUI&&($.unblockUI(),$("body").append(this.dpDiv))),this._inDialog=!1}},_tidyDialog:function(a){a.dpDiv.removeClass(this._dialogClass).unbind(".ui-datepicker-calendar")},_checkExternalClick:function(a){if(!$.datepicker._curInst)return;var b=$(a.target),c=$.datepicker._getInst(b[0]);(b[0].id!=$.datepicker._mainDivId&&b.parents("#"+$.datepicker._mainDivId).length==0&&!b.hasClass($.datepicker.markerClassName)&&!b.closest("."+$.datepicker._triggerClass).length&&$.datepicker._datepickerShowing&&(!$.datepicker._inDialog||!$.blockUI)||b.hasClass($.datepicker.markerClassName)&&$.datepicker._curInst!=c)&&$.datepicker._hideDatepicker()},_adjustDate:function(a,b,c){var d=$(a),e=this._getInst(d[0]);if(this._isDisabledDatepicker(d[0]))return;this._adjustInstDate(e,b+(c=="M"?this._get(e,"showCurrentAtPos"):0),c),this._updateDatepicker(e)},_gotoToday:function(a){var b=$(a),c=this._getInst(b[0]);if(this._get(c,"gotoCurrent")&&c.currentDay)c.selectedDay=c.currentDay,c.drawMonth=c.selectedMonth=c.currentMonth,c.drawYear=c.selectedYear=c.currentYear;else{var d=new Date;c.selectedDay=d.getDate(),c.drawMonth=c.selectedMonth=d.getMonth(),c.drawYear=c.selectedYear=d.getFullYear()}this._notifyChange(c),this._adjustDate(b)},_selectMonthYear:function(a,b,c){var d=$(a),e=this._getInst(d[0]);e["selected"+(c=="M"?"Month":"Year")]=e["draw"+(c=="M"?"Month":"Year")]=parseInt(b.options[b.selectedIndex].value,10),this._notifyChange(e),this._adjustDate(d)},_selectDay:function(a,b,c,d){var e=$(a);if($(d).hasClass(this._unselectableClass)||this._isDisabledDatepicker(e[0]))return;var f=this._getInst(e[0]);f.selectedDay=f.currentDay=$("a",d).html(),f.selectedMonth=f.currentMonth=b,f.selectedYear=f.currentYear=c,this._selectDate(a,this._formatDate(f,f.currentDay,f.currentMonth,f.currentYear))},_clearDate:function(a){var b=$(a),c=this._getInst(b[0]);this._selectDate(b,"")},_selectDate:function(a,b){var c=$(a),d=this._getInst(c[0]);b=b!=null?b:this._formatDate(d),d.input&&d.input.val(b),this._updateAlternate(d);var e=this._get(d,"onSelect");e?e.apply(d.input?d.input[0]:null,[b,d]):d.input&&d.input.trigger("change"),d.inline?this._updateDatepicker(d):(this._hideDatepicker(),this._lastInput=d.input[0],typeof d.input[0]!="object"&&d.input.focus(),this._lastInput=null)},_updateAlternate:function(a){var b=this._get(a,"altField");if(b){var c=this._get(a,"altFormat")||this._get(a,"dateFormat"),d=this._getDate(a),e=this.formatDate(c,d,this._getFormatConfig(a));$(b).each(function(){$(this).val(e)})}},noWeekends:function(a){var b=a.getDay();return[b>0&&b<6,""]},iso8601Week:function(a){var b=new Date(a.getTime());b.setDate(b.getDate()+4-(b.getDay()||7));var c=b.getTime();return b.setMonth(0),b.setDate(1),Math.floor(Math.round((c-b)/864e5)/7)+1},parseDate:function(a,b,c){if(a==null||b==null)throw"Invalid arguments";b=typeof b=="object"?b.toString():b+"";if(b=="")return null;var d=(c?c.shortYearCutoff:null)||this._defaults.shortYearCutoff;d=typeof d!="string"?d:(new Date).getFullYear()%100+parseInt(d,10);var e=(c?c.dayNamesShort:null)||this._defaults.dayNamesShort,f=(c?c.dayNames:null)||this._defaults.dayNames,g=(c?c.monthNamesShort:null)||this._defaults.monthNamesShort,h=(c?c.monthNames:null)||this._defaults.monthNames,i=-1,j=-1,k=-1,l=-1,m=!1,n=function(b){var c=s+1<a.length&&a.charAt(s+1)==b;return c&&s++,c},o=function(a){var c=n(a),d=a=="@"?14:a=="!"?20:a=="y"&&c?4:a=="o"?3:2,e=new RegExp("^\\d{1,"+d+"}"),f=b.substring(r).match(e);if(!f)throw"Missing number at position "+r;return r+=f[0].length,parseInt(f[0],10)},p=function(a,c,d){var e=$.map(n(a)?d:c,function(a,b){return[[b,a]]}).sort(function(a,b){return-(a[1].length-b[1].length)}),f=-1;$.each(e,function(a,c){var d=c[1];if(b.substr(r,d.length).toLowerCase()==d.toLowerCase())return f=c[0],r+=d.length,!1});if(f!=-1)return f+1;throw"Unknown name at position "+r},q=function(){if(b.charAt(r)!=a.charAt(s))throw"Unexpected literal at position "+r;r++},r=0;for(var s=0;s<a.length;s++)if(m)a.charAt(s)=="'"&&!n("'")?m=!1:q();else switch(a.charAt(s)){case"d":k=o("d");break;case"D":p("D",e,f);break;case"o":l=o("o");break;case"m":j=o("m");break;case"M":j=p("M",g,h);break;case"y":i=o("y");break;case"@":var t=new Date(o("@"));i=t.getFullYear(),j=t.getMonth()+1,k=t.getDate();break;case"!":var t=new Date((o("!")-this._ticksTo1970)/1e4);i=t.getFullYear(),j=t.getMonth()+1,k=t.getDate();break;case"'":n("'")?q():m=!0;break;default:q()}if(r<b.length)throw"Extra/unparsed characters found in date: "+b.substring(r);i==-1?i=(new Date).getFullYear():i<100&&(i+=(new Date).getFullYear()-(new Date).getFullYear()%100+(i<=d?0:-100));if(l>-1){j=1,k=l;do{var u=this._getDaysInMonth(i,j-1);if(k<=u)break;j++,k-=u}while(!0)}var t=this._daylightSavingAdjust(new Date(i,j-1,k));if(t.getFullYear()!=i||t.getMonth()+1!=j||t.getDate()!=k)throw"Invalid date";return t},ATOM:"yy-mm-dd",COOKIE:"D, dd M yy",ISO_8601:"yy-mm-dd",RFC_822:"D, d M y",RFC_850:"DD, dd-M-y",RFC_1036:"D, d M y",RFC_1123:"D, d M yy",RFC_2822:"D, d M yy",RSS:"D, d M y",TICKS:"!",TIMESTAMP:"@",W3C:"yy-mm-dd",_ticksTo1970:(718685+Math.floor(492.5)-Math.floor(19.7)+Math.floor(4.925))*24*60*60*1e7,formatDate:function(a,b,c){if(!b)return"";var d=(c?c.dayNamesShort:null)||this._defaults.dayNamesShort,e=(c?c.dayNames:null)||this._defaults.dayNames,f=(c?c.monthNamesShort:null)||this._defaults.monthNamesShort,g=(c?c.monthNames:null)||this._defaults.monthNames,h=function(b){var c=m+1<a.length&&a.charAt(m+1)==b;return c&&m++,c},i=function(a,b,c){var d=""+b;if(h(a))while(d.length<c)d="0"+d;return d},j=function(a,b,c,d){return h(a)?d[b]:c[b]},k="",l=!1;if(b)for(var m=0;m<a.length;m++)if(l)a.charAt(m)=="'"&&!h("'")?l=!1:k+=a.charAt(m);else switch(a.charAt(m)){case"d":k+=i("d",b.getDate(),2);break;case"D":k+=j("D",b.getDay(),d,e);break;case"o":k+=i("o",Math.round(((new Date(b.getFullYear(),b.getMonth(),b.getDate())).getTime()-(new Date(b.getFullYear(),0,0)).getTime())/864e5),3);break;case"m":k+=i("m",b.getMonth()+1,2);break;case"M":k+=j("M",b.getMonth(),f,g);break;case"y":k+=h("y")?b.getFullYear():(b.getYear()%100<10?"0":"")+b.getYear()%100;break;case"@":k+=b.getTime();break;case"!":k+=b.getTime()*1e4+this._ticksTo1970;break;case"'":h("'")?k+="'":l=!0;break;default:k+=a.charAt(m)}return k},_possibleChars:function(a){var b="",c=!1,d=function(b){var c=e+1<a.length&&a.charAt(e+1)==b;return c&&e++,c};for(var e=0;e<a.length;e++)if(c)a.charAt(e)=="'"&&!d("'")?c=!1:b+=a.charAt(e);else switch(a.charAt(e)){case"d":case"m":case"y":case"@":b+="0123456789";break;case"D":case"M":return null;case"'":d("'")?b+="'":c=!0;break;default:b+=a.charAt(e)}return b},_get:function(a,b){return a.settings[b]!==undefined?a.settings[b]:this._defaults[b]},_setDateFromField:function(a,b){if(a.input.val()==a.lastVal)return;var c=this._get(a,"dateFormat"),d=a.lastVal=a.input?a.input.val():null,e,f;e=f=this._getDefaultDate(a);var g=this._getFormatConfig(a);try{e=this.parseDate(c,d,g)||f}catch(h){this.log(h),d=b?"":d}a.selectedDay=e.getDate(),a.drawMonth=a.selectedMonth=e.getMonth(),a.drawYear=a.selectedYear=e.getFullYear(),a.currentDay=d?e.getDate():0,a.currentMonth=d?e.getMonth():0,a.currentYear=d?e.getFullYear():0,this._adjustInstDate(a)},_getDefaultDate:function(a){return this._restrictMinMax(a,this._determineDate(a,this._get(a,"defaultDate"),new Date))},_determineDate:function(a,b,c){var d=function(a){var b=new Date;return b.setDate(b.getDate()+a),b},e=function(b){try{return $.datepicker.parseDate($.datepicker._get(a,"dateFormat"),b,$.datepicker._getFormatConfig(a))}catch(c){}var d=(b.toLowerCase().match(/^c/)?$.datepicker._getDate(a):null)||new Date,e=d.getFullYear(),f=d.getMonth(),g=d.getDate(),h=/([+-]?[0-9]+)\s*(d|D|w|W|m|M|y|Y)?/g,i=h.exec(b);while(i){switch(i[2]||"d"){case"d":case"D":g+=parseInt(i[1],10);break;case"w":case"W":g+=parseInt(i[1],10)*7;break;case"m":case"M":f+=parseInt(i[1],10),g=Math.min(g,$.datepicker._getDaysInMonth(e,f));break;case"y":case"Y":e+=parseInt(i[1],10),g=Math.min(g,$.datepicker._getDaysInMonth(e,f))}i=h.exec(b)}return new Date(e,f,g)},f=b==null||b===""?c:typeof b=="string"?e(b):typeof b=="number"?isNaN(b)?c:d(b):new Date(b.getTime());return f=f&&f.toString()=="Invalid Date"?c:f,f&&(f.setHours(0),f.setMinutes(0),f.setSeconds(0),f.setMilliseconds(0)),this._daylightSavingAdjust(f)},_daylightSavingAdjust:function(a){return a?(a.setHours(a.getHours()>12?a.getHours()+2:0),a):null},_setDate:function(a,b,c){var d=!b,e=a.selectedMonth,f=a.selectedYear,g=this._restrictMinMax(a,this._determineDate(a,b,new Date));a.selectedDay=a.currentDay=g.getDate(),a.drawMonth=a.selectedMonth=a.currentMonth=g.getMonth(),a.drawYear=a.selectedYear=a.currentYear=g.getFullYear(),(e!=a.selectedMonth||f!=a.selectedYear)&&!c&&this._notifyChange(a),this._adjustInstDate(a),a.input&&a.input.val(d?"":this._formatDate(a))},_getDate:function(a){var b=!a.currentYear||a.input&&a.input.val()==""?null:this._daylightSavingAdjust(new Date(a.currentYear,a.currentMonth,a.currentDay));return b},_generateHTML:function(a){var b=new Date;b=this._daylightSavingAdjust(new Date(b.getFullYear(),b.getMonth(),b.getDate()));var c=this._get(a,"isRTL"),d=this._get(a,"showButtonPanel"),e=this._get(a,"hideIfNoPrevNext"),f=this._get(a,"navigationAsDateFormat"),g=this._getNumberOfMonths(a),h=this._get(a,"showCurrentAtPos"),i=this._get(a,"stepMonths"),j=g[0]!=1||g[1]!=1,k=this._daylightSavingAdjust(a.currentDay?new Date(a.currentYear,a.currentMonth,a.currentDay):new Date(9999,9,9)),l=this._getMinMaxDate(a,"min"),m=this._getMinMaxDate(a,"max"),n=a.drawMonth-h,o=a.drawYear;n<0&&(n+=12,o--);if(m){var p=this._daylightSavingAdjust(new Date(m.getFullYear(),m.getMonth()-g[0]*g[1]+1,m.getDate()));p=l&&p<l?l:p;while(this._daylightSavingAdjust(new Date(o,n,1))>p)n--,n<0&&(n=11,o--)}a.drawMonth=n,a.drawYear=o;var q=this._get(a,"prevText");q=f?this.formatDate(q,this._daylightSavingAdjust(new Date(o,n-i,1)),this._getFormatConfig(a)):q;var r=this._canAdjustMonth(a,-1,o,n)?'<a class="ui-datepicker-prev ui-corner-all" onclick="DP_jQuery_'+dpuuid+".datepicker._adjustDate('#"+a.id+"', -"+i+", 'M');\""+' title="'+q+'"><span class="ui-icon ui-icon-circle-triangle-'+(c?"e":"w")+'">'+q+"</span></a>":e?"":'<a class="ui-datepicker-prev ui-corner-all ui-state-disabled" title="'+q+'"><span class="ui-icon ui-icon-circle-triangle-'+(c?"e":"w")+'">'+q+"</span></a>",s=this._get(a,"nextText");s=f?this.formatDate(s,this._daylightSavingAdjust(new Date(o,n+i,1)),this._getFormatConfig(a)):s;var t=this._canAdjustMonth(a,1,o,n)?'<a class="ui-datepicker-next ui-corner-all" onclick="DP_jQuery_'+dpuuid+".datepicker._adjustDate('#"+a.id+"', +"+i+", 'M');\""+' title="'+s+'"><span class="ui-icon ui-icon-circle-triangle-'+(c?"w":"e")+'">'+s+"</span></a>":e?"":'<a class="ui-datepicker-next ui-corner-all ui-state-disabled" title="'+s+'"><span class="ui-icon ui-icon-circle-triangle-'+(c?"w":"e")+'">'+s+"</span></a>",u=this._get(a,"currentText"),v=this._get(a,"gotoCurrent")&&a.currentDay?k:b;u=f?this.formatDate(u,v,this._getFormatConfig(a)):u;var w=a.inline?"":'<button type="button" class="ui-datepicker-close ui-state-default ui-priority-primary ui-corner-all" onclick="DP_jQuery_'+dpuuid+'.datepicker._hideDatepicker();">'+this._get(a,"closeText")+"</button>",x=d?'<div class="ui-datepicker-buttonpane ui-widget-content">'+(c?w:"")+(this._isInRange(a,v)?'<button type="button" class="ui-datepicker-current ui-state-default ui-priority-secondary ui-corner-all" onclick="DP_jQuery_'+dpuuid+".datepicker._gotoToday('#"+a.id+"');\""+">"+u+"</button>":"")+(c?"":w)+"</div>":"",y=parseInt(this._get(a,"firstDay"),10);y=isNaN(y)?0:y;var z=this._get(a,"showWeek"),A=this._get(a,"dayNames"),B=this._get(a,"dayNamesShort"),C=this._get(a,"dayNamesMin"),D=this._get(a,"monthNames"),E=this._get(a,"monthNamesShort"),F=this._get(a,"beforeShowDay"),G=this._get(a,"showOtherMonths"),H=this._get(a,"selectOtherMonths"),I=this._get(a,"calculateWeek")||this.iso8601Week,J=this._getDefaultDate(a),K="";for(var L=0;L<g[0];L++){var M="";this.maxRows=4;for(var N=0;N<g[1];N++){var O=this._daylightSavingAdjust(new Date(o,n,a.selectedDay)),P=" ui-corner-all",Q="";if(j){Q+='<div class="ui-datepicker-group';if(g[1]>1)switch(N){case 0:Q+=" ui-datepicker-group-first",P=" ui-corner-"+(c?"right":"left");break;case g[1]-1:Q+=" ui-datepicker-group-last",P=" ui-corner-"+(c?"left":"right");break;default:Q+=" ui-datepicker-group-middle",P=""}Q+='">'}Q+='<div class="ui-datepicker-header ui-widget-header ui-helper-clearfix'+P+'">'+(/all|left/.test(P)&&L==0?c?t:r:"")+(/all|right/.test(P)&&L==0?c?r:t:"")+this._generateMonthYearHeader(a,n,o,l,m,L>0||N>0,D,E)+'</div><table class="ui-datepicker-calendar"><thead>'+"<tr>";var R=z?'<th class="ui-datepicker-week-col">'+this._get(a,"weekHeader")+"</th>":"";for(var S=0;S<7;S++){var T=(S+y)%7;R+="<th"+((S+y+6)%7>=5?' class="ui-datepicker-week-end"':"")+">"+'<span title="'+A[T]+'">'+C[T]+"</span></th>"}Q+=R+"</tr></thead><tbody>";var U=this._getDaysInMonth(o,n);o==a.selectedYear&&n==a.selectedMonth&&(a.selectedDay=Math.min(a.selectedDay,U));var V=(this._getFirstDayOfMonth(o,n)-y+7)%7,W=Math.ceil((V+U)/7),X=j?this.maxRows>W?this.maxRows:W:W;this.maxRows=X;var Y=this._daylightSavingAdjust(new Date(o,n,1-V));for(var Z=0;Z<X;Z++){Q+="<tr>";var _=z?'<td class="ui-datepicker-week-col">'+this._get(a,"calculateWeek")(Y)+"</td>":"";for(var S=0;S<7;S++){var ba=F?F.apply(a.input?a.input[0]:null,[Y]):[!0,""],bb=Y.getMonth()!=n,bc=bb&&!H||!ba[0]||l&&Y<l||m&&Y>m;_+='<td class="'+((S+y+6)%7>=5?" ui-datepicker-week-end":"")+(bb?" ui-datepicker-other-month":"")+(Y.getTime()==O.getTime()&&n==a.selectedMonth&&a._keyEvent||J.getTime()==Y.getTime()&&J.getTime()==O.getTime()?" "+this._dayOverClass:"")+(bc?" "+this._unselectableClass+" ui-state-disabled":"")+(bb&&!G?"":" "+ba[1]+(Y.getTime()==k.getTime()?" "+this._currentClass:"")+(Y.getTime()==b.getTime()?" ui-datepicker-today":""))+'"'+((!bb||G)&&ba[2]?' title="'+ba[2]+'"':"")+(bc?"":' onclick="DP_jQuery_'+dpuuid+".datepicker._selectDay('#"+a.id+"',"+Y.getMonth()+","+Y.getFullYear()+', this);return false;"')+">"+(bb&&!G?"&#xa0;":bc?'<span class="ui-state-default">'+Y.getDate()+"</span>":'<a class="ui-state-default'+(Y.getTime()==b.getTime()?" ui-state-highlight":"")+(Y.getTime()==k.getTime()?" ui-state-active":"")+(bb?" ui-priority-secondary":"")+'" href="#">'+Y.getDate()+"</a>")+"</td>",Y.setDate(Y.getDate()+1),Y=this._daylightSavingAdjust(Y)}Q+=_+"</tr>"}n++,n>11&&(n=0,o++),Q+="</tbody></table>"+(j?"</div>"+(g[0]>0&&N==g[1]-1?'<div class="ui-datepicker-row-break"></div>':""):""),M+=Q}K+=M}return K+=x+($.browser.msie&&parseInt($.browser.version,10)<7&&!a.inline?'<iframe src="javascript:false;" class="ui-datepicker-cover" frameborder="0"></iframe>':""),a._keyEvent=!1,K},_generateMonthYearHeader:function(a,b,c,d,e,f,g,h){var i=this._get(a,"changeMonth"),j=this._get(a,"changeYear"),k=this._get(a,"showMonthAfterYear"),l='<div class="ui-datepicker-title">',m="";if(f||!i)m+='<span class="ui-datepicker-month">'+g[b]+"</span>";else{var n=d&&d.getFullYear()==c,o=e&&e.getFullYear()==c;m+='<select class="ui-datepicker-month" onchange="DP_jQuery_'+dpuuid+".datepicker._selectMonthYear('#"+a.id+"', this, 'M');\" "+">";for(var p=0;p<12;p++)(!n||p>=d.getMonth())&&(!o||p<=e.getMonth())&&(m+='<option value="'+p+'"'+(p==b?' selected="selected"':"")+">"+h[p]+"</option>");m+="</select>"}k||(l+=m+(f||!i||!j?"&#xa0;":""));if(!a.yearshtml){a.yearshtml="";if(f||!j)l+='<span class="ui-datepicker-year">'+c+"</span>";else{var q=this._get(a,"yearRange").split(":"),r=(new Date).getFullYear(),s=function(a){var b=a.match(/c[+-].*/)?c+parseInt(a.substring(1),10):a.match(/[+-].*/)?r+parseInt(a,10):parseInt(a,10);return isNaN(b)?r:b},t=s(q[0]),u=Math.max(t,s(q[1]||""));t=d?Math.max(t,d.getFullYear()):t,u=e?Math.min(u,e.getFullYear()):u,a.yearshtml+='<select class="ui-datepicker-year" onchange="DP_jQuery_'+dpuuid+".datepicker._selectMonthYear('#"+a.id+"', this, 'Y');\" "+">";for(;t<=u;t++)a.yearshtml+='<option value="'+t+'"'+(t==c?' selected="selected"':"")+">"+t+"</option>";a.yearshtml+="</select>",l+=a.yearshtml,a.yearshtml=null}}return l+=this._get(a,"yearSuffix"),k&&(l+=(f||!i||!j?"&#xa0;":"")+m),l+="</div>",l},_adjustInstDate:function(a,b,c){var d=a.drawYear+(c=="Y"?b:0),e=a.drawMonth+(c=="M"?b:0),f=Math.min(a.selectedDay,this._getDaysInMonth(d,e))+(c=="D"?b:0),g=this._restrictMinMax(a,this._daylightSavingAdjust(new Date(d,e,f)));a.selectedDay=g.getDate(),a.drawMonth=a.selectedMonth=g.getMonth(),a.drawYear=a.selectedYear=g.getFullYear(),(c=="M"||c=="Y")&&this._notifyChange(a)},_restrictMinMax:function(a,b){var c=this._getMinMaxDate(a,"min"),d=this._getMinMaxDate(a,"max"),e=c&&b<c?c:b;return e=d&&e>d?d:e,e},_notifyChange:function(a){var b=this._get(a,"onChangeMonthYear");b&&b.apply(a.input?a.input[0]:null,[a.selectedYear,a.selectedMonth+1,a])},_getNumberOfMonths:function(a){var b=this._get(a,"numberOfMonths");return b==null?[1,1]:typeof b=="number"?[1,b]:b},_getMinMaxDate:function(a,b){return this._determineDate(a,this._get(a,b+"Date"),null)},_getDaysInMonth:function(a,b){return 32-this._daylightSavingAdjust(new Date(a,b,32)).getDate()},_getFirstDayOfMonth:function(a,b){return(new Date(a,b,1)).getDay()},_canAdjustMonth:function(a,b,c,d){var e=this._getNumberOfMonths(a),f=this._daylightSavingAdjust(new Date(c,d+(b<0?b:e[0]*e[1]),1));return b<0&&f.setDate(this._getDaysInMonth(f.getFullYear(),f.getMonth())),this._isInRange(a,f)},_isInRange:function(a,b){var c=this._getMinMaxDate(a,"min"),d=this._getMinMaxDate(a,"max");return(!c||b.getTime()>=c.getTime())&&(!d||b.getTime()<=d.getTime())},_getFormatConfig:function(a){var b=this._get(a,"shortYearCutoff");return b=typeof b!="string"?b:(new Date).getFullYear()%100+parseInt(b,10),{shortYearCutoff:b,dayNamesShort:this._get(a,"dayNamesShort"),dayNames:this._get(a,"dayNames"),monthNamesShort:this._get(a,"monthNamesShort"),monthNames:this._get(a,"monthNames")}},_formatDate:function(a,b,c,d){b||(a.currentDay=a.selectedDay,a.currentMonth=a.selectedMonth,a.currentYear=a.selectedYear);var e=b?typeof b=="object"?b:this._daylightSavingAdjust(new Date(d,c,b)):this._daylightSavingAdjust(new Date(a.currentYear,a.currentMonth,a.currentDay));return this.formatDate(this._get(a,"dateFormat"),e,this._getFormatConfig(a))}}),$.fn.datepicker=function(a){if(!this.length)return this;$.datepicker.initialized||($(document).mousedown($.datepicker._checkExternalClick).find("body").append($.datepicker.dpDiv),$.datepicker.initialized=!0);var b=Array.prototype.slice.call(arguments,1);return typeof a!="string"||a!="isDisabled"&&a!="getDate"&&a!="widget"?a=="option"&&arguments.length==2&&typeof arguments[1]=="string"?$.datepicker["_"+a+"Datepicker"].apply($.datepicker,[this[0]].concat(b)):this.each(function(){typeof a=="string"?$.datepicker["_"+a+"Datepicker"].apply($.datepicker,[this].concat(b)):$.datepicker._attachDatepicker(this,a)}):$.datepicker["_"+a+"Datepicker"].apply($.datepicker,[this[0]].concat(b))},$.datepicker=new Datepicker,$.datepicker.initialized=!1,$.datepicker.uuid=(new Date).getTime(),$.datepicker.version="1.8.21",window["DP_jQuery_"+dpuuid]=$})(jQuery);;/*! jQuery UI - v1.8.21 - 2012-06-05
	* https://github.com/jquery/jquery-ui
	* Includes: jquery.ui.progressbar.js
	* Copyright (c) 2012 AUTHORS.txt; Licensed MIT, GPL */
	(function(a,b){a.widget("ui.progressbar",{options:{value:0,max:100},min:0,_create:function(){this.element.addClass("ui-progressbar ui-widget ui-widget-content ui-corner-all").attr({role:"progressbar","aria-valuemin":this.min,"aria-valuemax":this.options.max,"aria-valuenow":this._value()}),this.valueDiv=a("<div class='ui-progressbar-value ui-widget-header ui-corner-left'></div>").appendTo(this.element),this.oldValue=this._value(),this._refreshValue()},destroy:function(){this.element.removeClass("ui-progressbar ui-widget ui-widget-content ui-corner-all").removeAttr("role").removeAttr("aria-valuemin").removeAttr("aria-valuemax").removeAttr("aria-valuenow"),this.valueDiv.remove(),a.Widget.prototype.destroy.apply(this,arguments)},value:function(a){return a===b?this._value():(this._setOption("value",a),this)},_setOption:function(b,c){b==="value"&&(this.options.value=c,this._refreshValue(),this._value()===this.options.max&&this._trigger("complete")),a.Widget.prototype._setOption.apply(this,arguments)},_value:function(){var a=this.options.value;return typeof a!="number"&&(a=0),Math.min(this.options.max,Math.max(this.min,a))},_percentage:function(){return 100*this._value()/this.options.max},_refreshValue:function(){var a=this.value(),b=this._percentage();this.oldValue!==a&&(this.oldValue=a,this._trigger("change")),this.valueDiv.toggle(a>this.min).toggleClass("ui-corner-right",a===this.options.max).width(b.toFixed(0)+"%"),this.element.attr("aria-valuenow",a)}}),a.extend(a.ui.progressbar,{version:"1.8.21"})})(jQuery);;/*! jQuery UI - v1.8.21 - 2012-06-05
	* https://github.com/jquery/jquery-ui
	* Includes: jquery.effects.core.js
	* Copyright (c) 2012 AUTHORS.txt; Licensed MIT, GPL */
	jQuery.effects||function(a,b){function c(b){var c;return b&&b.constructor==Array&&b.length==3?b:(c=/rgb\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*\)/.exec(b))?[parseInt(c[1],10),parseInt(c[2],10),parseInt(c[3],10)]:(c=/rgb\(\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*\)/.exec(b))?[parseFloat(c[1])*2.55,parseFloat(c[2])*2.55,parseFloat(c[3])*2.55]:(c=/#([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{2})/.exec(b))?[parseInt(c[1],16),parseInt(c[2],16),parseInt(c[3],16)]:(c=/#([a-fA-F0-9])([a-fA-F0-9])([a-fA-F0-9])/.exec(b))?[parseInt(c[1]+c[1],16),parseInt(c[2]+c[2],16),parseInt(c[3]+c[3],16)]:(c=/rgba\(0, 0, 0, 0\)/.exec(b))?e.transparent:e[a.trim(b).toLowerCase()]}function d(b,d){var e;do{e=a.curCSS(b,d);if(e!=""&&e!="transparent"||a.nodeName(b,"body"))break;d="backgroundColor"}while(b=b.parentNode);return c(e)}function h(){var a=document.defaultView?document.defaultView.getComputedStyle(this,null):this.currentStyle,b={},c,d;if(a&&a.length&&a[0]&&a[a[0]]){var e=a.length;while(e--)c=a[e],typeof a[c]=="string"&&(d=c.replace(/\-(\w)/g,function(a,b){return b.toUpperCase()}),b[d]=a[c])}else for(c in a)typeof a[c]=="string"&&(b[c]=a[c]);return b}function i(b){var c,d;for(c in b)d=b[c],(d==null||a.isFunction(d)||c in g||/scrollbar/.test(c)||!/color/i.test(c)&&isNaN(parseFloat(d)))&&delete b[c];return b}function j(a,b){var c={_:0},d;for(d in b)a[d]!=b[d]&&(c[d]=b[d]);return c}function k(b,c,d,e){typeof b=="object"&&(e=c,d=null,c=b,b=c.effect),a.isFunction(c)&&(e=c,d=null,c={});if(typeof c=="number"||a.fx.speeds[c])e=d,d=c,c={};return a.isFunction(d)&&(e=d,d=null),c=c||{},d=d||c.duration,d=a.fx.off?0:typeof d=="number"?d:d in a.fx.speeds?a.fx.speeds[d]:a.fx.speeds._default,e=e||c.complete,[b,c,d,e]}function l(b){return!b||typeof b=="number"||a.fx.speeds[b]?!0:typeof b=="string"&&!a.effects[b]?!0:!1}a.effects={},a.each(["backgroundColor","borderBottomColor","borderLeftColor","borderRightColor","borderTopColor","borderColor","color","outlineColor"],function(b,e){a.fx.step[e]=function(a){a.colorInit||(a.start=d(a.elem,e),a.end=c(a.end),a.colorInit=!0),a.elem.style[e]="rgb("+Math.max(Math.min(parseInt(a.pos*(a.end[0]-a.start[0])+a.start[0],10),255),0)+","+Math.max(Math.min(parseInt(a.pos*(a.end[1]-a.start[1])+a.start[1],10),255),0)+","+Math.max(Math.min(parseInt(a.pos*(a.end[2]-a.start[2])+a.start[2],10),255),0)+")"}});var e={aqua:[0,255,255],azure:[240,255,255],beige:[245,245,220],black:[0,0,0],blue:[0,0,255],brown:[165,42,42],cyan:[0,255,255],darkblue:[0,0,139],darkcyan:[0,139,139],darkgrey:[169,169,169],darkgreen:[0,100,0],darkkhaki:[189,183,107],darkmagenta:[139,0,139],darkolivegreen:[85,107,47],darkorange:[255,140,0],darkorchid:[153,50,204],darkred:[139,0,0],darksalmon:[233,150,122],darkviolet:[148,0,211],fuchsia:[255,0,255],gold:[255,215,0],green:[0,128,0],indigo:[75,0,130],khaki:[240,230,140],lightblue:[173,216,230],lightcyan:[224,255,255],lightgreen:[144,238,144],lightgrey:[211,211,211],lightpink:[255,182,193],lightyellow:[255,255,224],lime:[0,255,0],magenta:[255,0,255],maroon:[128,0,0],navy:[0,0,128],olive:[128,128,0],orange:[255,165,0],pink:[255,192,203],purple:[128,0,128],violet:[128,0,128],red:[255,0,0],silver:[192,192,192],white:[255,255,255],yellow:[255,255,0],transparent:[255,255,255]},f=["add","remove","toggle"],g={border:1,borderBottom:1,borderColor:1,borderLeft:1,borderRight:1,borderTop:1,borderWidth:1,margin:1,padding:1};a.effects.animateClass=function(b,c,d,e){return a.isFunction(d)&&(e=d,d=null),this.queue(function(){var g=a(this),k=g.attr("style")||" ",l=i(h.call(this)),m,n=g.attr("class")||"";a.each(f,function(a,c){b[c]&&g[c+"Class"](b[c])}),m=i(h.call(this)),g.attr("class",n),g.animate(j(l,m),{queue:!1,duration:c,easing:d,complete:function(){a.each(f,function(a,c){b[c]&&g[c+"Class"](b[c])}),typeof g.attr("style")=="object"?(g.attr("style").cssText="",g.attr("style").cssText=k):g.attr("style",k),e&&e.apply(this,arguments),a.dequeue(this)}})})},a.fn.extend({_addClass:a.fn.addClass,addClass:function(b,c,d,e){return c?a.effects.animateClass.apply(this,[{add:b},c,d,e]):this._addClass(b)},_removeClass:a.fn.removeClass,removeClass:function(b,c,d,e){return c?a.effects.animateClass.apply(this,[{remove:b},c,d,e]):this._removeClass(b)},_toggleClass:a.fn.toggleClass,toggleClass:function(c,d,e,f,g){return typeof d=="boolean"||d===b?e?a.effects.animateClass.apply(this,[d?{add:c}:{remove:c},e,f,g]):this._toggleClass(c,d):a.effects.animateClass.apply(this,[{toggle:c},d,e,f])},switchClass:function(b,c,d,e,f){return a.effects.animateClass.apply(this,[{add:c,remove:b},d,e,f])}}),a.extend(a.effects,{version:"1.8.21",save:function(a,b){for(var c=0;c<b.length;c++)b[c]!==null&&a.data("ec.storage."+b[c],a[0].style[b[c]])},restore:function(a,b){for(var c=0;c<b.length;c++)b[c]!==null&&a.css(b[c],a.data("ec.storage."+b[c]))},setMode:function(a,b){return b=="toggle"&&(b=a.is(":hidden")?"show":"hide"),b},getBaseline:function(a,b){var c,d;switch(a[0]){case"top":c=0;break;case"middle":c=.5;break;case"bottom":c=1;break;default:c=a[0]/b.height}switch(a[1]){case"left":d=0;break;case"center":d=.5;break;case"right":d=1;break;default:d=a[1]/b.width}return{x:d,y:c}},createWrapper:function(b){if(b.parent().is(".ui-effects-wrapper"))return b.parent();var c={width:b.outerWidth(!0),height:b.outerHeight(!0),"float":b.css("float")},d=a("<div></div>").addClass("ui-effects-wrapper").css({fontSize:"100%",background:"transparent",border:"none",margin:0,padding:0}),e=document.activeElement;try{e.id}catch(f){e=document.body}return b.wrap(d),(b[0]===e||a.contains(b[0],e))&&a(e).focus(),d=b.parent(),b.css("position")=="static"?(d.css({position:"relative"}),b.css({position:"relative"})):(a.extend(c,{position:b.css("position"),zIndex:b.css("z-index")}),a.each(["top","left","bottom","right"],function(a,d){c[d]=b.css(d),isNaN(parseInt(c[d],10))&&(c[d]="auto")}),b.css({position:"relative",top:0,left:0,right:"auto",bottom:"auto"})),d.css(c).show()},removeWrapper:function(b){var c,d=document.activeElement;return b.parent().is(".ui-effects-wrapper")?(c=b.parent().replaceWith(b),(b[0]===d||a.contains(b[0],d))&&a(d).focus(),c):b},setTransition:function(b,c,d,e){return e=e||{},a.each(c,function(a,c){var f=b.cssUnit(c);f[0]>0&&(e[c]=f[0]*d+f[1])}),e}}),a.fn.extend({effect:function(b,c,d,e){var f=k.apply(this,arguments),g={options:f[1],duration:f[2],callback:f[3]},h=g.options.mode,i=a.effects[b];return a.fx.off||!i?h?this[h](g.duration,g.callback):this.each(function(){g.callback&&g.callback.call(this)}):i.call(this,g)},_show:a.fn.show,show:function(a){if(l(a))return this._show.apply(this,arguments);var b=k.apply(this,arguments);return b[1].mode="show",this.effect.apply(this,b)},_hide:a.fn.hide,hide:function(a){if(l(a))return this._hide.apply(this,arguments);var b=k.apply(this,arguments);return b[1].mode="hide",this.effect.apply(this,b)},__toggle:a.fn.toggle,toggle:function(b){if(l(b)||typeof b=="boolean"||a.isFunction(b))return this.__toggle.apply(this,arguments);var c=k.apply(this,arguments);return c[1].mode="toggle",this.effect.apply(this,c)},cssUnit:function(b){var c=this.css(b),d=[];return a.each(["em","px","%","pt"],function(a,b){c.indexOf(b)>0&&(d=[parseFloat(c),b])}),d}}),a.easing.jswing=a.easing.swing,a.extend(a.easing,{def:"easeOutQuad",swing:function(b,c,d,e,f){return a.easing[a.easing.def](b,c,d,e,f)},easeInQuad:function(a,b,c,d,e){return d*(b/=e)*b+c},easeOutQuad:function(a,b,c,d,e){return-d*(b/=e)*(b-2)+c},easeInOutQuad:function(a,b,c,d,e){return(b/=e/2)<1?d/2*b*b+c:-d/2*(--b*(b-2)-1)+c},easeInCubic:function(a,b,c,d,e){return d*(b/=e)*b*b+c},easeOutCubic:function(a,b,c,d,e){return d*((b=b/e-1)*b*b+1)+c},easeInOutCubic:function(a,b,c,d,e){return(b/=e/2)<1?d/2*b*b*b+c:d/2*((b-=2)*b*b+2)+c},easeInQuart:function(a,b,c,d,e){return d*(b/=e)*b*b*b+c},easeOutQuart:function(a,b,c,d,e){return-d*((b=b/e-1)*b*b*b-1)+c},easeInOutQuart:function(a,b,c,d,e){return(b/=e/2)<1?d/2*b*b*b*b+c:-d/2*((b-=2)*b*b*b-2)+c},easeInQuint:function(a,b,c,d,e){return d*(b/=e)*b*b*b*b+c},easeOutQuint:function(a,b,c,d,e){return d*((b=b/e-1)*b*b*b*b+1)+c},easeInOutQuint:function(a,b,c,d,e){return(b/=e/2)<1?d/2*b*b*b*b*b+c:d/2*((b-=2)*b*b*b*b+2)+c},easeInSine:function(a,b,c,d,e){return-d*Math.cos(b/e*(Math.PI/2))+d+c},easeOutSine:function(a,b,c,d,e){return d*Math.sin(b/e*(Math.PI/2))+c},easeInOutSine:function(a,b,c,d,e){return-d/2*(Math.cos(Math.PI*b/e)-1)+c},easeInExpo:function(a,b,c,d,e){return b==0?c:d*Math.pow(2,10*(b/e-1))+c},easeOutExpo:function(a,b,c,d,e){return b==e?c+d:d*(-Math.pow(2,-10*b/e)+1)+c},easeInOutExpo:function(a,b,c,d,e){return b==0?c:b==e?c+d:(b/=e/2)<1?d/2*Math.pow(2,10*(b-1))+c:d/2*(-Math.pow(2,-10*--b)+2)+c},easeInCirc:function(a,b,c,d,e){return-d*(Math.sqrt(1-(b/=e)*b)-1)+c},easeOutCirc:function(a,b,c,d,e){return d*Math.sqrt(1-(b=b/e-1)*b)+c},easeInOutCirc:function(a,b,c,d,e){return(b/=e/2)<1?-d/2*(Math.sqrt(1-b*b)-1)+c:d/2*(Math.sqrt(1-(b-=2)*b)+1)+c},easeInElastic:function(a,b,c,d,e){var f=1.70158,g=0,h=d;if(b==0)return c;if((b/=e)==1)return c+d;g||(g=e*.3);if(h<Math.abs(d)){h=d;var f=g/4}else var f=g/(2*Math.PI)*Math.asin(d/h);return-(h*Math.pow(2,10*(b-=1))*Math.sin((b*e-f)*2*Math.PI/g))+c},easeOutElastic:function(a,b,c,d,e){var f=1.70158,g=0,h=d;if(b==0)return c;if((b/=e)==1)return c+d;g||(g=e*.3);if(h<Math.abs(d)){h=d;var f=g/4}else var f=g/(2*Math.PI)*Math.asin(d/h);return h*Math.pow(2,-10*b)*Math.sin((b*e-f)*2*Math.PI/g)+d+c},easeInOutElastic:function(a,b,c,d,e){var f=1.70158,g=0,h=d;if(b==0)return c;if((b/=e/2)==2)return c+d;g||(g=e*.3*1.5);if(h<Math.abs(d)){h=d;var f=g/4}else var f=g/(2*Math.PI)*Math.asin(d/h);return b<1?-0.5*h*Math.pow(2,10*(b-=1))*Math.sin((b*e-f)*2*Math.PI/g)+c:h*Math.pow(2,-10*(b-=1))*Math.sin((b*e-f)*2*Math.PI/g)*.5+d+c},easeInBack:function(a,c,d,e,f,g){return g==b&&(g=1.70158),e*(c/=f)*c*((g+1)*c-g)+d},easeOutBack:function(a,c,d,e,f,g){return g==b&&(g=1.70158),e*((c=c/f-1)*c*((g+1)*c+g)+1)+d},easeInOutBack:function(a,c,d,e,f,g){return g==b&&(g=1.70158),(c/=f/2)<1?e/2*c*c*(((g*=1.525)+1)*c-g)+d:e/2*((c-=2)*c*(((g*=1.525)+1)*c+g)+2)+d},easeInBounce:function(b,c,d,e,f){return e-a.easing.easeOutBounce(b,f-c,0,e,f)+d},easeOutBounce:function(a,b,c,d,e){return(b/=e)<1/2.75?d*7.5625*b*b+c:b<2/2.75?d*(7.5625*(b-=1.5/2.75)*b+.75)+c:b<2.5/2.75?d*(7.5625*(b-=2.25/2.75)*b+.9375)+c:d*(7.5625*(b-=2.625/2.75)*b+.984375)+c},easeInOutBounce:function(b,c,d,e,f){return c<f/2?a.easing.easeInBounce(b,c*2,0,e,f)*.5+d:a.easing.easeOutBounce(b,c*2-f,0,e,f)*.5+e*.5+d}})}(jQuery);;/*! jQuery UI - v1.8.21 - 2012-06-05
	* https://github.com/jquery/jquery-ui
	* Includes: jquery.effects.blind.js
	* Copyright (c) 2012 AUTHORS.txt; Licensed MIT, GPL */
	(function(a,b){a.effects.blind=function(b){return this.queue(function(){var c=a(this),d=["position","top","bottom","left","right"],e=a.effects.setMode(c,b.options.mode||"hide"),f=b.options.direction||"vertical";a.effects.save(c,d),c.show();var g=a.effects.createWrapper(c).css({overflow:"hidden"}),h=f=="vertical"?"height":"width",i=f=="vertical"?g.height():g.width();e=="show"&&g.css(h,0);var j={};j[h]=e=="show"?i:0,g.animate(j,b.duration,b.options.easing,function(){e=="hide"&&c.hide(),a.effects.restore(c,d),a.effects.removeWrapper(c),b.callback&&b.callback.apply(c[0],arguments),c.dequeue()})})}})(jQuery);;/*! jQuery UI - v1.8.21 - 2012-06-05
	* https://github.com/jquery/jquery-ui
	* Includes: jquery.effects.bounce.js
	* Copyright (c) 2012 AUTHORS.txt; Licensed MIT, GPL */
	(function(a,b){a.effects.bounce=function(b){return this.queue(function(){var c=a(this),d=["position","top","bottom","left","right"],e=a.effects.setMode(c,b.options.mode||"effect"),f=b.options.direction||"up",g=b.options.distance||20,h=b.options.times||5,i=b.duration||250;/show|hide/.test(e)&&d.push("opacity"),a.effects.save(c,d),c.show(),a.effects.createWrapper(c);var j=f=="up"||f=="down"?"top":"left",k=f=="up"||f=="left"?"pos":"neg",g=b.options.distance||(j=="top"?c.outerHeight({margin:!0})/3:c.outerWidth({margin:!0})/3);e=="show"&&c.css("opacity",0).css(j,k=="pos"?-g:g),e=="hide"&&(g=g/(h*2)),e!="hide"&&h--;if(e=="show"){var l={opacity:1};l[j]=(k=="pos"?"+=":"-=")+g,c.animate(l,i/2,b.options.easing),g=g/2,h--}for(var m=0;m<h;m++){var n={},p={};n[j]=(k=="pos"?"-=":"+=")+g,p[j]=(k=="pos"?"+=":"-=")+g,c.animate(n,i/2,b.options.easing).animate(p,i/2,b.options.easing),g=e=="hide"?g*2:g/2}if(e=="hide"){var l={opacity:0};l[j]=(k=="pos"?"-=":"+=")+g,c.animate(l,i/2,b.options.easing,function(){c.hide(),a.effects.restore(c,d),a.effects.removeWrapper(c),b.callback&&b.callback.apply(this,arguments)})}else{var n={},p={};n[j]=(k=="pos"?"-=":"+=")+g,p[j]=(k=="pos"?"+=":"-=")+g,c.animate(n,i/2,b.options.easing).animate(p,i/2,b.options.easing,function(){a.effects.restore(c,d),a.effects.removeWrapper(c),b.callback&&b.callback.apply(this,arguments)})}c.queue("fx",function(){c.dequeue()}),c.dequeue()})}})(jQuery);;/*! jQuery UI - v1.8.21 - 2012-06-05
	* https://github.com/jquery/jquery-ui
	* Includes: jquery.effects.clip.js
	* Copyright (c) 2012 AUTHORS.txt; Licensed MIT, GPL */
	(function(a,b){a.effects.clip=function(b){return this.queue(function(){var c=a(this),d=["position","top","bottom","left","right","height","width"],e=a.effects.setMode(c,b.options.mode||"hide"),f=b.options.direction||"vertical";a.effects.save(c,d),c.show();var g=a.effects.createWrapper(c).css({overflow:"hidden"}),h=c[0].tagName=="IMG"?g:c,i={size:f=="vertical"?"height":"width",position:f=="vertical"?"top":"left"},j=f=="vertical"?h.height():h.width();e=="show"&&(h.css(i.size,0),h.css(i.position,j/2));var k={};k[i.size]=e=="show"?j:0,k[i.position]=e=="show"?0:j/2,h.animate(k,{queue:!1,duration:b.duration,easing:b.options.easing,complete:function(){e=="hide"&&c.hide(),a.effects.restore(c,d),a.effects.removeWrapper(c),b.callback&&b.callback.apply(c[0],arguments),c.dequeue()}})})}})(jQuery);;/*! jQuery UI - v1.8.21 - 2012-06-05
	* https://github.com/jquery/jquery-ui
	* Includes: jquery.effects.drop.js
	* Copyright (c) 2012 AUTHORS.txt; Licensed MIT, GPL */
	(function(a,b){a.effects.drop=function(b){return this.queue(function(){var c=a(this),d=["position","top","bottom","left","right","opacity"],e=a.effects.setMode(c,b.options.mode||"hide"),f=b.options.direction||"left";a.effects.save(c,d),c.show(),a.effects.createWrapper(c);var g=f=="up"||f=="down"?"top":"left",h=f=="up"||f=="left"?"pos":"neg",i=b.options.distance||(g=="top"?c.outerHeight({margin:!0})/2:c.outerWidth({margin:!0})/2);e=="show"&&c.css("opacity",0).css(g,h=="pos"?-i:i);var j={opacity:e=="show"?1:0};j[g]=(e=="show"?h=="pos"?"+=":"-=":h=="pos"?"-=":"+=")+i,c.animate(j,{queue:!1,duration:b.duration,easing:b.options.easing,complete:function(){e=="hide"&&c.hide(),a.effects.restore(c,d),a.effects.removeWrapper(c),b.callback&&b.callback.apply(this,arguments),c.dequeue()}})})}})(jQuery);;/*! jQuery UI - v1.8.21 - 2012-06-05
	* https://github.com/jquery/jquery-ui
	* Includes: jquery.effects.explode.js
	* Copyright (c) 2012 AUTHORS.txt; Licensed MIT, GPL */
	(function(a,b){a.effects.explode=function(b){return this.queue(function(){var c=b.options.pieces?Math.round(Math.sqrt(b.options.pieces)):3,d=b.options.pieces?Math.round(Math.sqrt(b.options.pieces)):3;b.options.mode=b.options.mode=="toggle"?a(this).is(":visible")?"hide":"show":b.options.mode;var e=a(this).show().css("visibility","hidden"),f=e.offset();f.top-=parseInt(e.css("marginTop"),10)||0,f.left-=parseInt(e.css("marginLeft"),10)||0;var g=e.outerWidth(!0),h=e.outerHeight(!0);for(var i=0;i<c;i++)for(var j=0;j<d;j++)e.clone().appendTo("body").wrap("<div></div>").css({position:"absolute",visibility:"visible",left:-j*(g/d),top:-i*(h/c)}).parent().addClass("ui-effects-explode").css({position:"absolute",overflow:"hidden",width:g/d,height:h/c,left:f.left+j*(g/d)+(b.options.mode=="show"?(j-Math.floor(d/2))*(g/d):0),top:f.top+i*(h/c)+(b.options.mode=="show"?(i-Math.floor(c/2))*(h/c):0),opacity:b.options.mode=="show"?0:1}).animate({left:f.left+j*(g/d)+(b.options.mode=="show"?0:(j-Math.floor(d/2))*(g/d)),top:f.top+i*(h/c)+(b.options.mode=="show"?0:(i-Math.floor(c/2))*(h/c)),opacity:b.options.mode=="show"?1:0},b.duration||500);setTimeout(function(){b.options.mode=="show"?e.css({visibility:"visible"}):e.css({visibility:"visible"}).hide(),b.callback&&b.callback.apply(e[0]),e.dequeue(),a("div.ui-effects-explode").remove()},b.duration||500)})}})(jQuery);;/*! jQuery UI - v1.8.21 - 2012-06-05
	* https://github.com/jquery/jquery-ui
	* Includes: jquery.effects.fade.js
	* Copyright (c) 2012 AUTHORS.txt; Licensed MIT, GPL */
	(function(a,b){a.effects.fade=function(b){return this.queue(function(){var c=a(this),d=a.effects.setMode(c,b.options.mode||"hide");c.animate({opacity:d},{queue:!1,duration:b.duration,easing:b.options.easing,complete:function(){b.callback&&b.callback.apply(this,arguments),c.dequeue()}})})}})(jQuery);;/*! jQuery UI - v1.8.21 - 2012-06-05
	* https://github.com/jquery/jquery-ui
	* Includes: jquery.effects.fold.js
	* Copyright (c) 2012 AUTHORS.txt; Licensed MIT, GPL */
	(function(a,b){a.effects.fold=function(b){return this.queue(function(){var c=a(this),d=["position","top","bottom","left","right"],e=a.effects.setMode(c,b.options.mode||"hide"),f=b.options.size||15,g=!!b.options.horizFirst,h=b.duration?b.duration/2:a.fx.speeds._default/2;a.effects.save(c,d),c.show();var i=a.effects.createWrapper(c).css({overflow:"hidden"}),j=e=="show"!=g,k=j?["width","height"]:["height","width"],l=j?[i.width(),i.height()]:[i.height(),i.width()],m=/([0-9]+)%/.exec(f);m&&(f=parseInt(m[1],10)/100*l[e=="hide"?0:1]),e=="show"&&i.css(g?{height:0,width:f}:{height:f,width:0});var n={},p={};n[k[0]]=e=="show"?l[0]:f,p[k[1]]=e=="show"?l[1]:0,i.animate(n,h,b.options.easing).animate(p,h,b.options.easing,function(){e=="hide"&&c.hide(),a.effects.restore(c,d),a.effects.removeWrapper(c),b.callback&&b.callback.apply(c[0],arguments),c.dequeue()})})}})(jQuery);;/*! jQuery UI - v1.8.21 - 2012-06-05
	* https://github.com/jquery/jquery-ui
	* Includes: jquery.effects.highlight.js
	* Copyright (c) 2012 AUTHORS.txt; Licensed MIT, GPL */
	(function(a,b){a.effects.highlight=function(b){return this.queue(function(){var c=a(this),d=["backgroundImage","backgroundColor","opacity"],e=a.effects.setMode(c,b.options.mode||"show"),f={backgroundColor:c.css("backgroundColor")};e=="hide"&&(f.opacity=0),a.effects.save(c,d),c.show().css({backgroundImage:"none",backgroundColor:b.options.color||"#ffff99"}).animate(f,{queue:!1,duration:b.duration,easing:b.options.easing,complete:function(){e=="hide"&&c.hide(),a.effects.restore(c,d),e=="show"&&!a.support.opacity&&this.style.removeAttribute("filter"),b.callback&&b.callback.apply(this,arguments),c.dequeue()}})})}})(jQuery);;/*! jQuery UI - v1.8.21 - 2012-06-05
	* https://github.com/jquery/jquery-ui
	* Includes: jquery.effects.pulsate.js
	* Copyright (c) 2012 AUTHORS.txt; Licensed MIT, GPL */
	(function(a,b){a.effects.pulsate=function(b){return this.queue(function(){var c=a(this),d=a.effects.setMode(c,b.options.mode||"show"),e=(b.options.times||5)*2-1,f=b.duration?b.duration/2:a.fx.speeds._default/2,g=c.is(":visible"),h=0;g||(c.css("opacity",0).show(),h=1),(d=="hide"&&g||d=="show"&&!g)&&e--;for(var i=0;i<e;i++)c.animate({opacity:h},f,b.options.easing),h=(h+1)%2;c.animate({opacity:h},f,b.options.easing,function(){h==0&&c.hide(),b.callback&&b.callback.apply(this,arguments)}),c.queue("fx",function(){c.dequeue()}).dequeue()})}})(jQuery);;/*! jQuery UI - v1.8.21 - 2012-06-05
	* https://github.com/jquery/jquery-ui
	* Includes: jquery.effects.scale.js
	* Copyright (c) 2012 AUTHORS.txt; Licensed MIT, GPL */
	(function(a,b){a.effects.puff=function(b){return this.queue(function(){var c=a(this),d=a.effects.setMode(c,b.options.mode||"hide"),e=parseInt(b.options.percent,10)||150,f=e/100,g={height:c.height(),width:c.width()};a.extend(b.options,{fade:!0,mode:d,percent:d=="hide"?e:100,from:d=="hide"?g:{height:g.height*f,width:g.width*f}}),c.effect("scale",b.options,b.duration,b.callback),c.dequeue()})},a.effects.scale=function(b){return this.queue(function(){var c=a(this),d=a.extend(!0,{},b.options),e=a.effects.setMode(c,b.options.mode||"effect"),f=parseInt(b.options.percent,10)||(parseInt(b.options.percent,10)==0?0:e=="hide"?0:100),g=b.options.direction||"both",h=b.options.origin;e!="effect"&&(d.origin=h||["middle","center"],d.restore=!0);var i={height:c.height(),width:c.width()};c.from=b.options.from||(e=="show"?{height:0,width:0}:i);var j={y:g!="horizontal"?f/100:1,x:g!="vertical"?f/100:1};c.to={height:i.height*j.y,width:i.width*j.x},b.options.fade&&(e=="show"&&(c.from.opacity=0,c.to.opacity=1),e=="hide"&&(c.from.opacity=1,c.to.opacity=0)),d.from=c.from,d.to=c.to,d.mode=e,c.effect("size",d,b.duration,b.callback),c.dequeue()})},a.effects.size=function(b){return this.queue(function(){var c=a(this),d=["position","top","bottom","left","right","width","height","overflow","opacity"],e=["position","top","bottom","left","right","overflow","opacity"],f=["width","height","overflow"],g=["fontSize"],h=["borderTopWidth","borderBottomWidth","paddingTop","paddingBottom"],i=["borderLeftWidth","borderRightWidth","paddingLeft","paddingRight"],j=a.effects.setMode(c,b.options.mode||"effect"),k=b.options.restore||!1,l=b.options.scale||"both",m=b.options.origin,n={height:c.height(),width:c.width()};c.from=b.options.from||n,c.to=b.options.to||n;if(m){var p=a.effects.getBaseline(m,n);c.from.top=(n.height-c.from.height)*p.y,c.from.left=(n.width-c.from.width)*p.x,c.to.top=(n.height-c.to.height)*p.y,c.to.left=(n.width-c.to.width)*p.x}var q={from:{y:c.from.height/n.height,x:c.from.width/n.width},to:{y:c.to.height/n.height,x:c.to.width/n.width}};if(l=="box"||l=="both")q.from.y!=q.to.y&&(d=d.concat(h),c.from=a.effects.setTransition(c,h,q.from.y,c.from),c.to=a.effects.setTransition(c,h,q.to.y,c.to)),q.from.x!=q.to.x&&(d=d.concat(i),c.from=a.effects.setTransition(c,i,q.from.x,c.from),c.to=a.effects.setTransition(c,i,q.to.x,c.to));(l=="content"||l=="both")&&q.from.y!=q.to.y&&(d=d.concat(g),c.from=a.effects.setTransition(c,g,q.from.y,c.from),c.to=a.effects.setTransition(c,g,q.to.y,c.to)),a.effects.save(c,k?d:e),c.show(),a.effects.createWrapper(c),c.css("overflow","hidden").css(c.from);if(l=="content"||l=="both")h=h.concat(["marginTop","marginBottom"]).concat(g),i=i.concat(["marginLeft","marginRight"]),f=d.concat(h).concat(i),c.find("*[width]").each(function(){var c=a(this);k&&a.effects.save(c,f);var d={height:c.height(),width:c.width()};c.from={height:d.height*q.from.y,width:d.width*q.from.x},c.to={height:d.height*q.to.y,width:d.width*q.to.x},q.from.y!=q.to.y&&(c.from=a.effects.setTransition(c,h,q.from.y,c.from),c.to=a.effects.setTransition(c,h,q.to.y,c.to)),q.from.x!=q.to.x&&(c.from=a.effects.setTransition(c,i,q.from.x,c.from),c.to=a.effects.setTransition(c,i,q.to.x,c.to)),c.css(c.from),c.animate(c.to,b.duration,b.options.easing,function(){k&&a.effects.restore(c,f)})});c.animate(c.to,{queue:!1,duration:b.duration,easing:b.options.easing,complete:function(){c.to.opacity===0&&c.css("opacity",c.from.opacity),j=="hide"&&c.hide(),a.effects.restore(c,k?d:e),a.effects.removeWrapper(c),b.callback&&b.callback.apply(this,arguments),c.dequeue()}})})}})(jQuery);;/*! jQuery UI - v1.8.21 - 2012-06-05
	* https://github.com/jquery/jquery-ui
	* Includes: jquery.effects.shake.js
	* Copyright (c) 2012 AUTHORS.txt; Licensed MIT, GPL */
	(function(a,b){a.effects.shake=function(b){return this.queue(function(){var c=a(this),d=["position","top","bottom","left","right"],e=a.effects.setMode(c,b.options.mode||"effect"),f=b.options.direction||"left",g=b.options.distance||20,h=b.options.times||3,i=b.duration||b.options.duration||140;a.effects.save(c,d),c.show(),a.effects.createWrapper(c);var j=f=="up"||f=="down"?"top":"left",k=f=="up"||f=="left"?"pos":"neg",l={},m={},n={};l[j]=(k=="pos"?"-=":"+=")+g,m[j]=(k=="pos"?"+=":"-=")+g*2,n[j]=(k=="pos"?"-=":"+=")+g*2,c.animate(l,i,b.options.easing);for(var p=1;p<h;p++)c.animate(m,i,b.options.easing).animate(n,i,b.options.easing);c.animate(m,i,b.options.easing).animate(l,i/2,b.options.easing,function(){a.effects.restore(c,d),a.effects.removeWrapper(c),b.callback&&b.callback.apply(this,arguments)}),c.queue("fx",function(){c.dequeue()}),c.dequeue()})}})(jQuery);;/*! jQuery UI - v1.8.21 - 2012-06-05
	* https://github.com/jquery/jquery-ui
	* Includes: jquery.effects.slide.js
	* Copyright (c) 2012 AUTHORS.txt; Licensed MIT, GPL */
	(function(a,b){a.effects.slide=function(b){return this.queue(function(){var c=a(this),d=["position","top","bottom","left","right"],e=a.effects.setMode(c,b.options.mode||"show"),f=b.options.direction||"left";a.effects.save(c,d),c.show(),a.effects.createWrapper(c).css({overflow:"hidden"});var g=f=="up"||f=="down"?"top":"left",h=f=="up"||f=="left"?"pos":"neg",i=b.options.distance||(g=="top"?c.outerHeight({margin:!0}):c.outerWidth({margin:!0}));e=="show"&&c.css(g,h=="pos"?isNaN(i)?"-"+i:-i:i);var j={};j[g]=(e=="show"?h=="pos"?"+=":"-=":h=="pos"?"-=":"+=")+i,c.animate(j,{queue:!1,duration:b.duration,easing:b.options.easing,complete:function(){e=="hide"&&c.hide(),a.effects.restore(c,d),a.effects.removeWrapper(c),b.callback&&b.callback.apply(this,arguments),c.dequeue()}})})}})(jQuery);;/*! jQuery UI - v1.8.21 - 2012-06-05
	* https://github.com/jquery/jquery-ui
	* Includes: jquery.effects.transfer.js
	* Copyright (c) 2012 AUTHORS.txt; Licensed MIT, GPL */
	(function(a,b){a.effects.transfer=function(b){return this.queue(function(){var c=a(this),d=a(b.options.to),e=d.offset(),f={top:e.top,left:e.left,height:d.innerHeight(),width:d.innerWidth()},g=c.offset(),h=a('<div class="ui-effects-transfer"></div>').appendTo(document.body).addClass(b.options.className).css({top:g.top,left:g.left,height:c.innerHeight(),width:c.innerWidth(),position:"absolute"}).animate(f,b.duration,b.options.easing,function(){h.remove(),b.callback&&b.callback.apply(c[0],arguments),c.dequeue()})})}})(jQuery);;
/*JQuery Slider*/
	/*!
	 * jQuery UI Slider 1.8.21
	 *
	 * Copyright 2012, AUTHORS.txt (http://jqueryui.com/about)
	 * Dual licensed under the MIT or GPL Version 2 licenses.
	 * http://jquery.org/license
	 *
	 * http://docs.jquery.com/UI/Slider
	 *
	 * Depends:
	 *	jquery.ui.core.js
	 *	jquery.ui.mouse.js
	 *	jquery.ui.widget.js
	 */
	(function($, undefined) {
	// number of pages in a slider
	// (how many times can you page up/down to go through the whole range)
	var numPages = 5;
	$.widget( "ui.slider", $.ui.mouse, {
		widgetEventPrefix: "slide",
		options: {
			animate: false,
			distance: 0,
			max: 100,
			min: 0,
			orientation: "horizontal",
			range: false,
			step: 1,
			value: 0,
			values: null
		},
		_create: function() {
			var self = this,
				o = this.options,
				existingHandles = this.element.find( ".ui-slider-handle" ).addClass( "ui-state-default ui-corner-all" ),
				handle = "<a class='ui-slider-handle ui-state-default ui-corner-all' href='#'></a>",
				handleCount = ( o.values && o.values.length ) || 1,
				handles = [];
			this._keySliding = false;
			this._mouseSliding = false;
			this._animateOff = true;
			this._handleIndex = null;
			this._detectOrientation();
			this._mouseInit();
			this.element
				.addClass( "ui-slider" +
					" ui-slider-" + this.orientation +
					" ui-widget" +
					" ui-widget-content" +
					" ui-corner-all" +
					( o.disabled ? " ui-slider-disabled ui-disabled" : "" ) );
			this.range = $([]);
			if(o.range) {
				if(o.range === true) {
					if(!o.values) {
						o.values = [this._valueMin(), this._valueMin()];
					}
					if(o.values.length && o.values.length !== 2) {
						o.values = [o.values[0], o.values[0]];
					}
				}

				this.range = $("<div></div>")
					.appendTo(this.element)
					.addClass("ui-slider-range" +
					// note: this isn't the most fittingly semantic framework class for this element,
					// but worked best visually with a variety of themes
					" ui-widget-header" + 
					((o.range === "min" || o.range === "max" ) ? " ui-slider-range-" + o.range : ""));
			}
			for(var i = existingHandles.length; i < handleCount; i += 1) {
				handles.push( handle );
			}
			this.handles = existingHandles.add($(handles.join("")).appendTo(self.element));
			this.handle = this.handles.eq(0);
			this.handles.add(this.range).filter("a")
				.click(function(event) {
					event.preventDefault();
				})
				.hover(function() {
					if ( !o.disabled ) {
						$( this ).addClass("ui-state-hover");
					}
				}, function() {
					$( this ).removeClass("ui-state-hover");
				})
				.focus(function() {
					if(!o.disabled) {
						$(".ui-slider .ui-state-focus").removeClass("ui-state-focus");
						$(this).addClass("ui-state-focus");
					} else {
						$(this).blur();
					}
				})
				.blur(function() {
					$(this).removeClass("ui-state-focus");
				});
			this.handles.each(function(i) {
				$(this).data("index.ui-slider-handle", i);
			});
			this.handles
				.keydown(function(event) {
					var index = $(this).data("index.ui-slider-handle"),
						allowed,
						curVal,
						newVal,
						step;
					if(self.options.disabled) {
						return;
					}
					switch(event.keyCode) {
						case $.ui.keyCode.HOME:
						case $.ui.keyCode.END:
						case $.ui.keyCode.PAGE_UP:
						case $.ui.keyCode.PAGE_DOWN:
						case $.ui.keyCode.UP:
						case $.ui.keyCode.RIGHT:
						case $.ui.keyCode.DOWN:
						case $.ui.keyCode.LEFT:
							event.preventDefault();
							if(!self._keySliding) {
								self._keySliding = true;
								$(this).addClass("ui-state-active");
								allowed = self._start(event, index);
								if(allowed === false) {
									return;
								}
							}
						break;
					}
					step = self.options.step;
					if(self.options.values && self.options.values.length) {
						curVal = newVal = self.values(index);
					} else {
						curVal = newVal = self.value();
					}
					switch ( event.keyCode ) {
						case $.ui.keyCode.HOME:
							newVal = self._valueMin();
							break;
						case $.ui.keyCode.END:
							newVal = self._valueMax();
							break;
						case $.ui.keyCode.PAGE_UP:
							newVal = self._trimAlignValue(curVal + ((self._valueMax() - self._valueMin()) / numPages));
							break;
						case $.ui.keyCode.PAGE_DOWN:
							newVal = self._trimAlignValue(curVal - ((self._valueMax() - self._valueMin()) / numPages));
							break;
						case $.ui.keyCode.UP:
						case $.ui.keyCode.RIGHT:
							if ( curVal === self._valueMax() ) {
								return;
							}
							newVal = self._trimAlignValue( curVal + step );
							break;
						case $.ui.keyCode.DOWN:
						case $.ui.keyCode.LEFT:
							if(curVal === self._valueMin()) {
								return;
							}
							newVal = self._trimAlignValue(curVal - step);
						break;
					}
					self._slide(event, index, newVal);
				})
				.keyup(function(event) {
					var index = $(this).data("index.ui-slider-handle");
					if(self._keySliding) {
						self._keySliding = false;
						self._stop(event, index);
						self._change(event, index);
						$( this ).removeClass("ui-state-active");
					}
				});
			this._refreshValue();
			this._animateOff = false;
		},
		destroy: function() {
			this.handles.remove();
			this.range.remove();
			this.element
				.removeClass("ui-slider" +
					" ui-slider-horizontal" +
					" ui-slider-vertical" +
					" ui-slider-disabled" +
					" ui-widget" +
					" ui-widget-content" +
					" ui-corner-all")
				.removeData("slider")
				.unbind(".slider");
			this._mouseDestroy();
			return this;
		},
		_mouseCapture: function(event) {
			var o = this.options,
				position,
				normValue,
				distance,
				closestHandle,
				self,
				index,
				allowed,
				offset,
				mouseOverHandle;
			if(o.disabled) {
				return false;
			}
			this.elementSize = {
				width:	this.element.outerWidth(),
				height:	this.element.outerHeight()
			};
			this.elementOffset = this.element.offset();
			position	= {x: event.pageX, y: event.pageY};
			normValue	= this._normValueFromMouse(position);
			distance	= this._valueMax() - this._valueMin() + 1;
			self		= this;
			this.handles.each(function(i) {
				var thisDistance = Math.abs(normValue - self.values(i));
				if(distance > thisDistance) {
					distance		= thisDistance;
					closestHandle	= $(this);
					index			= i;
				}
			});
			// workaround for bug #3736 (if both handles of a range are at 0,
			// the first is always used as the one with least distance,
			// and moving it is obviously prevented by preventing negative ranges)
			if(o.range === true && this.values(1) === o.min) {
				index += 1;
				closestHandle = $( this.handles[index] );
			}
			allowed = this._start(event, index);
			if(allowed === false) {
				return false;
			}
			this._mouseSliding = true;
			self._handleIndex = index;
			closestHandle
				.addClass("ui-state-active")
				.focus();
			offset = closestHandle.offset();
			mouseOverHandle = !$(event.target).parents().andSelf().is(".ui-slider-handle");
			this._clickOffset = mouseOverHandle ? {left: 0, top: 0} : {
				left: event.pageX - offset.left - (closestHandle.width() / 2),
				top: event.pageY - offset.top -
					(closestHandle.height() / 2) -
					(parseInt(closestHandle.css("borderTopWidth"), 10) || 0) -
					(parseInt(closestHandle.css("borderBottomWidth"), 10) || 0) +
					(parseInt(closestHandle.css("marginTop"), 10) || 0)
			};
			if(!this.handles.hasClass("ui-state-hover")) {
				this._slide(event, index, normValue);
			}
			this._animateOff = true;
			return true;
		},
		_mouseStart: function(event) {
			return true;
		},
		_mouseDrag: function(event) {
			var position	= {x: event.pageX, y: event.pageY},
				normValue	= this._normValueFromMouse(position);
			this._slide(event, this._handleIndex, normValue);
			return false;
		},
		_mouseStop: function(event) {
			this.handles.removeClass("ui-state-active");
			this._mouseSliding = false;
			this._stop(event, this._handleIndex);
			this._change(event, this._handleIndex);
			this._handleIndex = null;
			this._clickOffset = null;
			this._animateOff = false;
			return false;
		},
		_detectOrientation: function() {
			this.orientation = (this.options.orientation === "vertical") ? "vertical" : "horizontal";
		},
		_normValueFromMouse: function(position) {
			var pixelTotal,
				pixelMouse,
				percentMouse,
				valueTotal,
				valueMouse;
			if(this.orientation === "horizontal") {
				pixelTotal = this.elementSize.width;
				pixelMouse = position.x - this.elementOffset.left - (this._clickOffset ? this._clickOffset.left : 0);
			} else {
				pixelTotal = this.elementSize.height;
				pixelMouse = position.y - this.elementOffset.top - (this._clickOffset ? this._clickOffset.top : 0);
			}
			percentMouse = (pixelMouse / pixelTotal);
			if(percentMouse > 1) {
				percentMouse = 1;
			}
			if(percentMouse < 0) {
				percentMouse = 0;
			}
			if(this.orientation === "vertical") {
				percentMouse = 1 - percentMouse;
			}
			valueTotal = this._valueMax() - this._valueMin();
			valueMouse = this._valueMin() + percentMouse * valueTotal;
			return this._trimAlignValue(valueMouse);
		},
		_start: function(event, index) {
			var uiHash = {
				handle: this.handles[ index ],
				value: this.value()
			};
			if(this.options.values && this.options.values.length) {
				uiHash.value = this.values(index);
				uiHash.values = this.values();
			}
			return this._trigger("start", event, uiHash);
		},
		_slide: function(event, index, newVal) {
			var otherVal,
				newValues,
				allowed;
			if(this.options.values && this.options.values.length) {
				otherVal = this.values(index ? 0 : 1);
				if((this.options.values.length === 2 && this.options.range === true) &&
						((index === 0 && newVal > otherVal) || (index === 1 && newVal < otherVal))
					) {
					newVal = otherVal;
				}
				if(newVal !== this.values(index)) {
					newValues = this.values();
					newValues[index] = newVal;
					// A slide can be canceled by returning false from the slide callback
					allowed = this._trigger("slide", event, {
						handle:	this.handles[index],
						value:	newVal,
						values:	newValues
					});
					otherVal = this.values(index ? 0 : 1);
					if(allowed !== false) {
						this.values(index, newVal, true);
					}
				}
			} else {
				if(newVal !== this.value()) {
					// A slide can be canceled by returning false from the slide callback
					allowed = this._trigger("slide", event, {
						handle: this.handles[index],
						value: newVal
					});
					if(allowed !== false) {
						this.value(newVal);
					}
				}
			}
		},
		_stop: function(event, index) {
			var uiHash = {
				handle: this.handles[index],
				value: this.value()
			};
			if(this.options.values && this.options.values.length) {
				uiHash.value = this.values(index);
				uiHash.values = this.values();
			}
			this._trigger("stop", event, uiHash);
		},
		_change: function(event, index) {
			if(!this._keySliding && !this._mouseSliding) {
				var uiHash = {
					handle: this.handles[ index ],
					value: this.value()
				};
				if(this.options.values && this.options.values.length) {
					uiHash.value = this.values(index);
					uiHash.values = this.values();
				}
				this._trigger("change", event, uiHash);
			}
		},
		value: function(newValue) {
			if(arguments.length) {
				this.options.value = this._trimAlignValue(newValue);
				this._refreshValue();
				this._change(null, 0);
				return;
			}
			return this._value();
		},
		values: function(index, newValue) {
			var vals,
				newValues,
				i;
			if(arguments.length > 1) {
				this.options.values[index] = this._trimAlignValue(newValue);
				this._refreshValue();
				this._change(null, index);
				return;
			}
			if(arguments.length) {
				if($.isArray(arguments[0])) {
					vals = this.options.values;
					newValues = arguments[0];
					for(i = 0; i < vals.length; i += 1) {
						vals[i] = this._trimAlignValue(newValues[i]);
						this._change(null, i);
					}
					this._refreshValue();
				} else {
					if(this.options.values && this.options.values.length) {
						return this._values(index);
					} else {
						return this.value();
					}
				}
			} else {
				return this._values();
			}
		},
		_setOption: function(key, value) {
			var i,
				valsLength = 0;
			if($.isArray(this.options.values)) {
				valsLength = this.options.values.length;
			}
			$.Widget.prototype._setOption.apply(this, arguments);
			switch(key) {
				case "disabled":
					if(value) {
						this.handles.filter(".ui-state-focus").blur();
						this.handles.removeClass("ui-state-hover");
						this.handles.propAttr("disabled", true);
						this.element.addClass("ui-disabled");
					} else {
						this.handles.propAttr("disabled", false);
						this.element.removeClass("ui-disabled");
					}
					break;
				case "orientation":
					this._detectOrientation();
					this.element
						.removeClass("ui-slider-horizontal ui-slider-vertical")
						.addClass("ui-slider-" + this.orientation);
					this._refreshValue();
					break;
				case "value":
					this._animateOff = true;
					this._refreshValue();
					this._change(null, 0);
					this._animateOff = false;
					break;
				case "values":
					this._animateOff = true;
					this._refreshValue();
					for(i = 0; i < valsLength; i += 1) {
						this._change(null, i);
					}
					this._animateOff = false;
					break;
			}
		},
		//internal value getter
		// _value() returns value trimmed by min and max, aligned by step
		_value: function() {
			var val = this.options.value;
			val = this._trimAlignValue(val);
			return val;
		},
		//internal values getter
		// _values() returns array of values trimmed by min and max, aligned by step
		// _values( index ) returns single value trimmed by min and max, aligned by step
		_values: function(index) {
			var val,
				vals,
				i;
			if(arguments.length) {
				val = this.options.values[index];
				val = this._trimAlignValue(val);
				return val;
			} else {
				// .slice() creates a copy of the array
				// this copy gets trimmed by min and max and then returned
				vals = this.options.values.slice();
				for(i = 0; i < vals.length; i+= 1) {
					vals[i] = this._trimAlignValue(vals[i]);
				}
				return vals;
			}
		},
		// returns the step-aligned value that val is closest to, between (inclusive) min and max
		_trimAlignValue: function(val) {
			if(val <= this._valueMin()) {
				return this._valueMin();
			}
			if(val >= this._valueMax()) {
				return this._valueMax();
			}
			var step = (this.options.step > 0) ? this.options.step : 1,
				valModStep = (val - this._valueMin()) % step,
				alignValue = val - valModStep;
			if(Math.abs(valModStep) * 2 >= step) {
				alignValue += (valModStep > 0) ? step : (-step);
			}
			// Since JavaScript has problems with large floats, round
			// the final value to 5 digits after the decimal point (see #4124)
			return parseFloat(alignValue.toFixed(5));
		},
		_valueMin: function() {
			return this.options.min;
		},
		_valueMax: function() {
			return this.options.max;
		},
		_refreshValue: function() {
			var oRange = this.options.range,
				o = this.options,
				self = this,
				animate = ( !this._animateOff ) ? o.animate : false,
				valPercent,
				_set = {},
				lastValPercent,
				value,
				valueMin,
				valueMax;
			if(this.options.values && this.options.values.length) {
				this.handles.each(function(i, j) {
					valPercent = (self.values(i) - self._valueMin()) / (self._valueMax() - self._valueMin()) * 100;
					_set[self.orientation === "horizontal" ? "left" : "bottom"] = valPercent + "%";
					$(this).stop(1, 1)[animate ? "animate" : "css"](_set, o.animate);
					if(self.options.range === true) {
						if(self.orientation === "horizontal") {
							if(i === 0) {
								self.range.stop(1, 1)[animate ? "animate" : "css"]({left: valPercent + "%"}, o.animate);
							}
							if(i === 1) {
								self.range[animate ? "animate" : "css"]({width: (valPercent - lastValPercent) + "%"}, {queue: false, duration: o.animate});
							}
						} else {
							if(i === 0) {
								self.range.stop(1, 1)[animate ? "animate" : "css"]({bottom: (valPercent) + "%"}, o.animate);
							}
							if(i === 1) {
								self.range[animate ? "animate" : "css"]({height: (valPercent - lastValPercent) + "%"}, {queue: false, duration: o.animate});
							}
						}
					}
					lastValPercent = valPercent;
				});
			} else {
				value = this.value();
				valueMin = this._valueMin();
				valueMax = this._valueMax();
				valPercent = (valueMax !== valueMin) ?
						(value - valueMin ) / ( valueMax - valueMin) * 100 :
						0;
				_set[self.orientation === "horizontal" ? "left" : "bottom"] = valPercent + "%";
				this.handle.stop(1, 1)[animate ? "animate" : "css"](_set, o.animate);
				if(oRange === "min" && this.orientation === "horizontal") {
					this.range.stop(1, 1)[animate ? "animate" : "css"]({width: valPercent + "%"}, o.animate);
				}
				if(oRange === "max" && this.orientation === "horizontal") {
					this.range[animate ? "animate" : "css"]({width: (100 - valPercent) + "%"}, {queue: false, duration: o.animate});
				}
				if(oRange === "min" && this.orientation === "vertical") {
					this.range.stop(1, 1)[animate ? "animate" : "css"]({height: valPercent + "%"}, o.animate);
				}
				if(oRange === "max" && this.orientation === "vertical") {
					this.range[animate ? "animate" : "css"]({height: (100 - valPercent) + "%"}, {queue: false, duration: o.animate});
				}
			}
		}
	});
	$.extend($.ui.slider, {
		version: "1.8.21"
	});
	}(jQuery));
/*JQuery Mouse Wheel*/
	/*! Copyright (c) 2011 Brandon Aaron (http://brandonaaron.net)
	 * Licensed under the MIT License (LICENSE.txt).
	 *
	 * Thanks to: http://adomas.org/javascript-mouse-wheel/ for some pointers.
	 * Thanks to: Mathias Bank(http://www.mathias-bank.de) for a scope bug fix.
	 * Thanks to: Seamus Leahy for adding deltaX and deltaY
	 *
	 * Version: 3.0.6
	 * 
	 * Requires: 1.2.2+
	 */
	(function(a){function d(b){var c=b||window.event,d=[].slice.call(arguments,1),e=0,f=!0,g=0,h=0;return b=a.event.fix(c),b.type="mousewheel",c.wheelDelta&&(e=c.wheelDelta/120),c.detail&&(e=-c.detail/3),h=e,c.axis!==undefined&&c.axis===c.HORIZONTAL_AXIS&&(h=0,g=-1*e),c.wheelDeltaY!==undefined&&(h=c.wheelDeltaY/120),c.wheelDeltaX!==undefined&&(g=-1*c.wheelDeltaX/120),d.unshift(b,e,g,h),(a.event.dispatch||a.event.handle).apply(this,d)}var b=["DOMMouseScroll","mousewheel"];if(a.event.fixHooks)for(var c=b.length;c;)a.event.fixHooks[b[--c]]=a.event.mouseHooks;a.event.special.mousewheel={setup:function(){if(this.addEventListener)for(var a=b.length;a;)this.addEventListener(b[--a],d,!1);else this.onmousewheel=d},teardown:function(){if(this.removeEventListener)for(var a=b.length;a;)this.removeEventListener(b[--a],d,!1);else this.onmousewheel=null}},a.fn.extend({mousewheel:function(a){return a?this.bind("mousewheel",a):this.trigger("mousewheel")},unmousewheel:function(a){return this.unbind("mousewheel",a)}})})(jQuery)
/*JQuery Context Menu*/
	// jQuery Context Menu Plugin
	//
	// Version 1.01
	//
	// Cory S.N. LaViska
	// A Beautiful Site (http://abeautifulsite.net/)
	//
	// More info: http://abeautifulsite.net/2008/09/jquery-context-menu-plugin/
	//
	// Terms of Use
	//
	// This plugin is dual-licensed under the GNU General Public License
	//   and the MIT License and is copyright A Beautiful Site, LLC.
	//
	if(jQuery)( function() {
		$.extend($.fn, {
			
			contextMenu: function(o, callback) {
				// Defaults
				if( o.menu == undefined ) return false;
				if( o.inSpeed == undefined ) o.inSpeed = 150;
				if( o.outSpeed == undefined ) o.outSpeed = 75;
				// 0 needs to be -1 for expected results (no fade)
				if( o.inSpeed == 0 ) o.inSpeed = -1;
				if( o.outSpeed == 0 ) o.outSpeed = -1;
				// Loop each context menu
				$(this).each( function() {
					var el = $(this);
					var offset = $(el).offset();
					// Add contextMenu class
					$('#' + o.menu).addClass('contextMenu');
					// Simulate a true right click
					$(this).mousedown( function(e) {
						var evt = e;
						if(e.button != 2) {
							return;
						}
						evt.stopPropagation();
						$(this).mouseup( function(e) {
							e.stopPropagation();
							var srcElement = $(this);
							$(this).unbind('mouseup');
							if( evt.button == 2 ) {
								// Hide context menus that may be showing
								$(".contextMenu").hide();
								// Get this context menu
								var menu = $('#' + o.menu);
								
								if( $(el).hasClass('disabled') ) return false;
								
								// Detect mouse position
								var d = {}, x, y;
								if( self.innerHeight ) {
									d.pageYOffset = self.pageYOffset;
									d.pageXOffset = self.pageXOffset;
									d.innerHeight = self.innerHeight;
									d.innerWidth = self.innerWidth;
								} else if( document.documentElement &&
									document.documentElement.clientHeight ) {
									d.pageYOffset = document.documentElement.scrollTop;
									d.pageXOffset = document.documentElement.scrollLeft;
									d.innerHeight = document.documentElement.clientHeight;
									d.innerWidth = document.documentElement.clientWidth;
								} else if( document.body ) {
									d.pageYOffset = document.body.scrollTop;
									d.pageXOffset = document.body.scrollLeft;
									d.innerHeight = document.body.clientHeight;
									d.innerWidth = document.body.clientWidth;
								}
								(e.pageX) ? x = e.pageX : x = e.clientX + d.scrollLeft;
								(e.pageY) ? y = e.pageY : y = e.clientY + d.scrollTop;
								
								// Show the menu
								$(document).unbind('click');
								$(menu).css({ top: y, left: x }).fadeIn(o.inSpeed);
								// Hover events
								$(menu).find('A').mouseover( function() {
									$(menu).find('LI.hover').removeClass('hover');
									$(this).parent().addClass('hover');
								}).mouseout( function() {
									$(menu).find('LI.hover').removeClass('hover');
								});
								
								// Keyboard
								$(document).keypress( function(e) {
									switch( e.keyCode ) {
										case 38: // up
											if( $(menu).find('LI.hover').size() == 0 ) {
												$(menu).find('LI:last').addClass('hover');
											} else {
												$(menu).find('LI.hover').removeClass('hover').prevAll('LI:not(.disabled)').eq(0).addClass('hover');
												if( $(menu).find('LI.hover').size() == 0 ) $(menu).find('LI:last').addClass('hover');
											}
										break;
										case 40: // down
											if( $(menu).find('LI.hover').size() == 0 ) {
												$(menu).find('LI:first').addClass('hover');
											} else {
												$(menu).find('LI.hover').removeClass('hover').nextAll('LI:not(.disabled)').eq(0).addClass('hover');
												if( $(menu).find('LI.hover').size() == 0 ) $(menu).find('LI:first').addClass('hover');
											}
										break;
										case 13: // enter
											$(menu).find('LI.hover A').trigger('click');
										break;
										case 27: // esc
											$(document).trigger('click');
										break
									}
								});
								
								// When items are selected
								$('#' + o.menu).find('A').unbind('click');
								$('#' + o.menu).find('LI:not(.disabled) A').click( function() {
									$(document).unbind('click').unbind('keypress');
									$(".contextMenu").hide();
									// Callback
									if( callback ) callback( $(this).attr('href').substr(1), $(srcElement), {x: x - offset.left, y: y - offset.top, docX: x, docY: y} );
									return false;
								});
								
								// Hide bindings
								setTimeout( function() { // Delay for Mozilla
									$(document).click( function() {
										$(document).unbind('click').unbind('keypress');
										$(menu).fadeOut(o.outSpeed);
										return false;
									});
								}, 0);
							}
						});
					});
					
					// Disable text selection
					if( $.browser.mozilla ) {
						$('#' + o.menu).each( function() { $(this).css({ 'MozUserSelect' : 'none' }); });
					} else if( $.browser.msie ) {
						$('#' + o.menu).each( function() { $(this).bind('selectstart.disableTextSelect', function() { return false; }); });
					} else {
						$('#' + o.menu).each(function() { $(this).bind('mousedown.disableTextSelect', function() { return false; }); });
					}
					// Disable browser context menu (requires both selectors to work in IE/Safari + FF/Chrome)
					$(el).add($('UL.contextMenu')).bind('contextmenu', function() { return false; });
					
				});
				return $(this);
			},
			
			// Disable context menu items on the fly
			disableContextMenuItems: function(o) {
				if( o == undefined ) {
					// Disable all
					$(this).find('LI').addClass('disabled');
					return( $(this) );
				}
				$(this).each( function() {
					if( o != undefined ) {
						var d = o.split(',');
						for( var i = 0; i < d.length; i++ ) {
							$(this).find('A[href="' + d[i] + '"]').parent().addClass('disabled');
							
						}
					}
				});
				return( $(this) );
			},
			
			// Enable context menu items on the fly
			enableContextMenuItems: function(o) {
				if( o == undefined ) {
					// Enable all
					$(this).find('LI.disabled').removeClass('disabled');
					return( $(this) );
				}
				$(this).each( function() {
					if( o != undefined ) {
						var d = o.split(',');
						for( var i = 0; i < d.length; i++ ) {
							$(this).find('A[href="' + d[i] + '"]').parent().removeClass('disabled');
							
						}
					}
				});
				return( $(this) );
			},
			
			// Disable context menu(s)
			disableContextMenu: function() {
				$(this).each( function() {
					$(this).addClass('disabled');
				});
				return( $(this) );
			},
			
			// Enable context menu(s)
			enableContextMenu: function() {
				$(this).each( function() {
					$(this).removeClass('disabled');
				});
				return( $(this) );
			},
			
			// Destroy context menu(s)
			destroyContextMenu: function() {
				// Destroy specified context menus
				$(this).each( function() {
					// Disable action
					$(this).unbind('mousedown').unbind('mouseup');
				});
				return( $(this) );
			}
			
		});
	})(jQuery);
/*JQuery Data Tables*/
	/*
	 * File:        jquery.dataTables.js
	 * Version:     1.7.6
	 * Description: Paginate, search and sort HTML tables
	 * Author:      Allan Jardine (www.sprymedia.co.uk)
	 * Created:     28/3/2008
	 * Language:    Javascript
	 * License:     GPL v2 or BSD 3 point style
	 * Project:     Mtaala
	 * Contact:     allan.jardine@sprymedia.co.uk
	 * 
	 * Copyright 2008-2010 Allan Jardine, all rights reserved.
	 *
	 * This source file is free software, under either the GPL v2 license or a
	 * BSD style license, as supplied with this software.
	 * 
	 * This source file is distributed in the hope that it will be useful, but 
	 * WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY 
	 * or FITNESS FOR A PARTICULAR PURPOSE. See the license files for details.
	 * 
	 * For details please refer to: http://www.datatables.net
	 */

	/*
	 * When considering jsLint, we need to allow eval() as it it is used for reading cookies and 
	 * building the dynamic multi-column sort functions.
	 */
	/*jslint evil: true, undef: true, browser: true */
	/*globals $, jQuery,_fnExternApiFunc,_fnInitalise,_fnInitComplete,_fnLanguageProcess,_fnAddColumn,_fnColumnOptions,_fnAddData,_fnGatherData,_fnDrawHead,_fnDraw,_fnReDraw,_fnAjaxUpdate,_fnAjaxUpdateDraw,_fnAddOptionsHtml,_fnFeatureHtmlTable,_fnScrollDraw,_fnAjustColumnSizing,_fnFeatureHtmlFilter,_fnFilterComplete,_fnFilterCustom,_fnFilterColumn,_fnFilter,_fnBuildSearchArray,_fnBuildSearchRow,_fnFilterCreateSearch,_fnDataToSearch,_fnSort,_fnSortAttachListener,_fnSortingClasses,_fnFeatureHtmlPaginate,_fnPageChange,_fnFeatureHtmlInfo,_fnUpdateInfo,_fnFeatureHtmlLength,_fnFeatureHtmlProcessing,_fnProcessingDisplay,_fnVisibleToColumnIndex,_fnColumnIndexToVisible,_fnNodeToDataIndex,_fnVisbleColumns,_fnCalculateEnd,_fnConvertToWidth,_fnCalculateColumnWidths,_fnScrollingWidthAdjust,_fnGetWidestNode,_fnGetMaxLenString,_fnStringToCss,_fnArrayCmp,_fnDetectType,_fnSettingsFromNode,_fnGetDataMaster,_fnGetTrNodes,_fnGetTdNodes,_fnEscapeRegex,_fnDeleteIndex,_fnReOrderIndex,_fnColumnOrdering,_fnLog,_fnClearTable,_fnSaveState,_fnLoadState,_fnCreateCookie,_fnReadCookie,_fnGetUniqueThs,_fnScrollBarWidth,_fnApplyToChildren,_fnMap*/

	(function($, window, document) {
		/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
		 * Section - DataTables variables
		 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
		
		/*
		 * Variable: dataTableSettings
		 * Purpose:  Store the settings for each dataTables instance
		 * Scope:    jQuery.fn
		 */
		$.fn.dataTableSettings = [];
		var _aoSettings = $.fn.dataTableSettings; /* Short reference for fast internal lookup */
		
		/*
		 * Variable: dataTableExt
		 * Purpose:  Container for customisable parts of DataTables
		 * Scope:    jQuery.fn
		 */
		$.fn.dataTableExt = {};
		var _oExt = $.fn.dataTableExt;
		
		
		/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
		 * Section - DataTables extensible objects
		 * 
		 * The _oExt object is used to provide an area where user dfined plugins can be 
		 * added to DataTables. The following properties of the object are used:
		 *   oApi - Plug-in API functions
		 *   aTypes - Auto-detection of types
		 *   oSort - Sorting functions used by DataTables (based on the type)
		 *   oPagination - Pagination functions for different input styles
		 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
		
		/*
		 * Variable: sVersion
		 * Purpose:  Version string for plug-ins to check compatibility
		 * Scope:    jQuery.fn.dataTableExt
		 * Notes:    Allowed format is a.b.c.d.e where:
		 *   a:int, b:int, c:int, d:string(dev|beta), e:int. d and e are optional
		 */
		_oExt.sVersion = "1.7.6";
		
		/*
		 * Variable: sErrMode
		 * Purpose:  How should DataTables report an error. Can take the value 'alert' or 'throw'
		 * Scope:    jQuery.fn.dataTableExt
		 */
		_oExt.sErrMode = "alert";
		
		/*
		 * Variable: iApiIndex
		 * Purpose:  Index for what 'this' index API functions should use
		 * Scope:    jQuery.fn.dataTableExt
		 */
		_oExt.iApiIndex = 0;
		
		/*
		 * Variable: oApi
		 * Purpose:  Container for plugin API functions
		 * Scope:    jQuery.fn.dataTableExt
		 */
		_oExt.oApi = { };
		
		/*
		 * Variable: aFiltering
		 * Purpose:  Container for plugin filtering functions
		 * Scope:    jQuery.fn.dataTableExt
		 */
		_oExt.afnFiltering = [ ];
		
		/*
		 * Variable: aoFeatures
		 * Purpose:  Container for plugin function functions
		 * Scope:    jQuery.fn.dataTableExt
		 * Notes:    Array of objects with the following parameters:
		 *   fnInit: Function for initialisation of Feature. Takes oSettings and returns node
		 *   cFeature: Character that will be matched in sDom - case sensitive
		 *   sFeature: Feature name - just for completeness :-)
		 */
		_oExt.aoFeatures = [ ];
		
		/*
		 * Variable: ofnSearch
		 * Purpose:  Container for custom filtering functions
		 * Scope:    jQuery.fn.dataTableExt
		 * Notes:    This is an object (the name should match the type) for custom filtering function,
		 *   which can be used for live DOM checking or formatted text filtering
		 */
		_oExt.ofnSearch = { };
		
		/*
		 * Variable: afnSortData
		 * Purpose:  Container for custom sorting data source functions
		 * Scope:    jQuery.fn.dataTableExt
		 * Notes:    Array (associative) of functions which is run prior to a column of this 
		 *   'SortDataType' being sorted upon.
		 *   Function input parameters:
		 *     object:oSettings-  DataTables settings object
		 *     int:iColumn - Target column number
		 *   Return value: Array of data which exactly matched the full data set size for the column to
		 *     be sorted upon
		 */
		_oExt.afnSortData = [ ];
		
		/*
		 * Variable: oStdClasses
		 * Purpose:  Storage for the various classes that DataTables uses
		 * Scope:    jQuery.fn.dataTableExt
		 */
		_oExt.oStdClasses = {
			/* Two buttons buttons */
			"sPagePrevEnabled": "paginate_enabled_previous",
			"sPagePrevDisabled": "paginate_disabled_previous",
			"sPageNextEnabled": "paginate_enabled_next",
			"sPageNextDisabled": "paginate_disabled_next",
			"sPageJUINext": "",
			"sPageJUIPrev": "",
			
			/* Full numbers paging buttons */
			"sPageButton": "paginate_button",
			"sPageButtonActive": "paginate_active",
			"sPageButtonStaticDisabled": "paginate_button",
			"sPageFirst": "first",
			"sPagePrevious": "previous",
			"sPageNext": "next",
			"sPageLast": "last",
			
			/* Stripping classes */
			"sStripOdd": "odd",
			"sStripEven": "even",
			
			/* Empty row */
			"sRowEmpty": "dataTables_empty",
			
			/* Features */
			"sWrapper": "dataTables_wrapper",
			"sFilter": "dataTables_filter",
			"sInfo": "dataTables_info",
			"sPaging": "dataTables_paginate paging_", /* Note that the type is postfixed */
			"sLength": "dataTables_length",
			"sProcessing": "dataTables_processing",
			
			/* Sorting */
			"sSortAsc": "sorting_asc",
			"sSortDesc": "sorting_desc",
			"sSortable": "sorting", /* Sortable in both directions */
			"sSortableAsc": "sorting_asc_disabled",
			"sSortableDesc": "sorting_desc_disabled",
			"sSortableNone": "sorting_disabled",
			"sSortColumn": "sorting_", /* Note that an int is postfixed for the sorting order */
			"sSortJUIAsc": "",
			"sSortJUIDesc": "",
			"sSortJUI": "",
			"sSortJUIAscAllowed": "",
			"sSortJUIDescAllowed": "",
			"sSortJUIWrapper": "",
			
			/* Scrolling */
			"sScrollWrapper": "dataTables_scroll",
			"sScrollHead": "dataTables_scrollHead",
			"sScrollHeadInner": "dataTables_scrollHeadInner",
			"sScrollBody": "dataTables_scrollBody",
			"sScrollFoot": "dataTables_scrollFoot",
			"sScrollFootInner": "dataTables_scrollFootInner",
			
			/* Misc */
			"sFooterTH": ""
		};
		
		/*
		 * Variable: oJUIClasses
		 * Purpose:  Storage for the various classes that DataTables uses - jQuery UI suitable
		 * Scope:    jQuery.fn.dataTableExt
		 */
		_oExt.oJUIClasses = {
			/* Two buttons buttons */
			"sPagePrevEnabled": "fg-button ui-button ui-state-default ui-corner-left",
			"sPagePrevDisabled": "fg-button ui-button ui-state-default ui-corner-left ui-state-disabled",
			"sPageNextEnabled": "fg-button ui-button ui-state-default ui-corner-right",
			"sPageNextDisabled": "fg-button ui-button ui-state-default ui-corner-right ui-state-disabled",
			"sPageJUINext": "ui-icon ui-icon-circle-arrow-e",
			"sPageJUIPrev": "ui-icon ui-icon-circle-arrow-w",
			
			/* Full numbers paging buttons */
			"sPageButton": "fg-button ui-button ui-state-default",
			"sPageButtonActive": "fg-button ui-button ui-state-default ui-state-disabled",
			"sPageButtonStaticDisabled": "fg-button ui-button ui-state-default ui-state-disabled",
			"sPageFirst": "first ui-corner-tl ui-corner-bl",
			"sPagePrevious": "previous",
			"sPageNext": "next",
			"sPageLast": "last ui-corner-tr ui-corner-br",
			
			/* Stripping classes */
			"sStripOdd": "odd",
			"sStripEven": "even",
			
			/* Empty row */
			"sRowEmpty": "dataTables_empty",
			
			/* Features */
			"sWrapper": "dataTables_wrapper",
			"sFilter": "dataTables_filter",
			"sInfo": "dataTables_info",
			"sPaging": "dataTables_paginate fg-buttonset ui-buttonset fg-buttonset-multi "+
				"ui-buttonset-multi paging_", /* Note that the type is postfixed */
			"sLength": "dataTables_length",
			"sProcessing": "dataTables_processing",
			
			/* Sorting */
			"sSortAsc": "ui-state-default",
			"sSortDesc": "ui-state-default",
			"sSortable": "ui-state-default",
			"sSortableAsc": "ui-state-default",
			"sSortableDesc": "ui-state-default",
			"sSortableNone": "ui-state-default",
			"sSortColumn": "sorting_", /* Note that an int is postfixed for the sorting order */
			"sSortJUIAsc": "css_right ui-icon ui-icon-triangle-1-n",
			"sSortJUIDesc": "css_right ui-icon ui-icon-triangle-1-s",
			"sSortJUI": "css_right ui-icon ui-icon-carat-2-n-s",
			"sSortJUIAscAllowed": "css_right ui-icon ui-icon-carat-1-n",
			"sSortJUIDescAllowed": "css_right ui-icon ui-icon-carat-1-s",
			"sSortJUIWrapper": "DataTables_sort_wrapper",
			
			/* Scrolling */
			"sScrollWrapper": "dataTables_scroll",
			"sScrollHead": "dataTables_scrollHead ui-state-default",
			"sScrollHeadInner": "dataTables_scrollHeadInner",
			"sScrollBody": "dataTables_scrollBody",
			"sScrollFoot": "dataTables_scrollFoot ui-state-default",
			"sScrollFootInner": "dataTables_scrollFootInner",
			
			/* Misc */
			"sFooterTH": "ui-state-default"
		};
		
		/*
		 * Variable: oPagination
		 * Purpose:  Container for the various type of pagination that dataTables supports
		 * Scope:    jQuery.fn.dataTableExt
		 */
		_oExt.oPagination = {
			/*
			 * Variable: two_button
			 * Purpose:  Standard two button (forward/back) pagination
			 * Scope:    jQuery.fn.dataTableExt.oPagination
			 */
			"two_button": {
				/*
				 * Function: oPagination.two_button.fnInit
				 * Purpose:  Initalise dom elements required for pagination with forward/back buttons only
				 * Returns:  -
				 * Inputs:   object:oSettings - dataTables settings object
			 *           node:nPaging - the DIV which contains this pagination control
				 *           function:fnCallbackDraw - draw function which must be called on update
				 */
				"fnInit": function ( oSettings, nPaging, fnCallbackDraw )
				{
					var nPrevious, nNext, nPreviousInner, nNextInner;
					
					/* Store the next and previous elements in the oSettings object as they can be very
					 * usful for automation - particularly testing
					 */
					if ( !oSettings.bJUI )
					{
						nPrevious = document.createElement( 'div' );
						nNext = document.createElement( 'div' );
					}
					else
					{
						nPrevious = document.createElement( 'a' );
						nNext = document.createElement( 'a' );
						
						nNextInner = document.createElement('span');
						nNextInner.className = oSettings.oClasses.sPageJUINext;
						nNext.appendChild( nNextInner );
						
						nPreviousInner = document.createElement('span');
						nPreviousInner.className = oSettings.oClasses.sPageJUIPrev;
						nPrevious.appendChild( nPreviousInner );
					}
					
					nPrevious.className = oSettings.oClasses.sPagePrevDisabled;
					nNext.className = oSettings.oClasses.sPageNextDisabled;
					
					nPrevious.title = oSettings.oLanguage.oPaginate.sPrevious;
					nNext.title = oSettings.oLanguage.oPaginate.sNext;
					
					nPaging.appendChild( nPrevious );
					nPaging.appendChild( nNext );
					
					$(nPrevious).bind( 'click.DT', function() {
						if ( oSettings.oApi._fnPageChange( oSettings, "previous" ) )
						{
							/* Only draw when the page has actually changed */
							fnCallbackDraw( oSettings );
						}
					} );
					
					$(nNext).bind( 'click.DT', function() {
						if ( oSettings.oApi._fnPageChange( oSettings, "next" ) )
						{
							fnCallbackDraw( oSettings );
						}
					} );
					
					/* Take the brutal approach to cancelling text selection */
					$(nPrevious).bind( 'selectstart.DT', function () { return false; } );
					$(nNext).bind( 'selectstart.DT', function () { return false; } );
					
					/* ID the first elements only */
					if ( oSettings.sTableId !== '' && typeof oSettings.aanFeatures.p == "undefined" )
					{
						nPaging.setAttribute( 'id', oSettings.sTableId+'_paginate' );
						nPrevious.setAttribute( 'id', oSettings.sTableId+'_previous' );
						nNext.setAttribute( 'id', oSettings.sTableId+'_next' );
					}
				},
				
				/*
				 * Function: oPagination.two_button.fnUpdate
				 * Purpose:  Update the two button pagination at the end of the draw
				 * Returns:  -
				 * Inputs:   object:oSettings - dataTables settings object
				 *           function:fnCallbackDraw - draw function to call on page change
				 */
				"fnUpdate": function ( oSettings, fnCallbackDraw )
				{
					if ( !oSettings.aanFeatures.p )
					{
						return;
					}
					
					/* Loop over each instance of the pager */
					var an = oSettings.aanFeatures.p;
					for ( var i=0, iLen=an.length ; i<iLen ; i++ )
					{
						if ( an[i].childNodes.length !== 0 )
						{
							an[i].childNodes[0].className = 
								( oSettings._iDisplayStart === 0 ) ? 
								oSettings.oClasses.sPagePrevDisabled : oSettings.oClasses.sPagePrevEnabled;
							
							an[i].childNodes[1].className = 
								( oSettings.fnDisplayEnd() == oSettings.fnRecordsDisplay() ) ? 
								oSettings.oClasses.sPageNextDisabled : oSettings.oClasses.sPageNextEnabled;
						}
					}
				}
			},
			
			
			/*
			 * Variable: iFullNumbersShowPages
			 * Purpose:  Change the number of pages which can be seen
			 * Scope:    jQuery.fn.dataTableExt.oPagination
			 */
			"iFullNumbersShowPages": 5,
			
			/*
			 * Variable: full_numbers
			 * Purpose:  Full numbers pagination
			 * Scope:    jQuery.fn.dataTableExt.oPagination
			 */
			"full_numbers": {
				/*
				 * Function: oPagination.full_numbers.fnInit
				 * Purpose:  Initalise dom elements required for pagination with a list of the pages
				 * Returns:  -
				 * Inputs:   object:oSettings - dataTables settings object
			 *           node:nPaging - the DIV which contains this pagination control
				 *           function:fnCallbackDraw - draw function which must be called on update
				 */
				"fnInit": function ( oSettings, nPaging, fnCallbackDraw )
				{
					var nFirst = document.createElement( 'span' );
					var nPrevious = document.createElement( 'span' );
					var nList = document.createElement( 'span' );
					var nNext = document.createElement( 'span' );
					var nLast = document.createElement( 'span' );
					
					nFirst.innerHTML = oSettings.oLanguage.oPaginate.sFirst;
					nPrevious.innerHTML = oSettings.oLanguage.oPaginate.sPrevious;
					nNext.innerHTML = oSettings.oLanguage.oPaginate.sNext;
					nLast.innerHTML = oSettings.oLanguage.oPaginate.sLast;
					
					var oClasses = oSettings.oClasses;
					nFirst.className = oClasses.sPageButton+" "+oClasses.sPageFirst;
					nPrevious.className = oClasses.sPageButton+" "+oClasses.sPagePrevious;
					nNext.className= oClasses.sPageButton+" "+oClasses.sPageNext;
					nLast.className = oClasses.sPageButton+" "+oClasses.sPageLast;
					
					nPaging.appendChild( nFirst );
					nPaging.appendChild( nPrevious );
					nPaging.appendChild( nList );
					nPaging.appendChild( nNext );
					nPaging.appendChild( nLast );
					
					$(nFirst).bind( 'click.DT', function () {
						if ( oSettings.oApi._fnPageChange( oSettings, "first" ) )
						{
							fnCallbackDraw( oSettings );
						}
					} );
					
					$(nPrevious).bind( 'click.DT', function() {
						if ( oSettings.oApi._fnPageChange( oSettings, "previous" ) )
						{
							fnCallbackDraw( oSettings );
						}
					} );
					
					$(nNext).bind( 'click.DT', function() {
						if ( oSettings.oApi._fnPageChange( oSettings, "next" ) )
						{
							fnCallbackDraw( oSettings );
						}
					} );
					
					$(nLast).bind( 'click.DT', function() {
						if ( oSettings.oApi._fnPageChange( oSettings, "last" ) )
						{
							fnCallbackDraw( oSettings );
						}
					} );
					
					/* Take the brutal approach to cancelling text selection */
					$('span', nPaging)
						.bind( 'mousedown.DT', function () { return false; } )
						.bind( 'selectstart.DT', function () { return false; } );
					
					/* ID the first elements only */
					if ( oSettings.sTableId !== '' && typeof oSettings.aanFeatures.p == "undefined" )
					{
						nPaging.setAttribute( 'id', oSettings.sTableId+'_paginate' );
						nFirst.setAttribute( 'id', oSettings.sTableId+'_first' );
						nPrevious.setAttribute( 'id', oSettings.sTableId+'_previous' );
						nNext.setAttribute( 'id', oSettings.sTableId+'_next' );
						nLast.setAttribute( 'id', oSettings.sTableId+'_last' );
					}
				},
				
				/*
				 * Function: oPagination.full_numbers.fnUpdate
				 * Purpose:  Update the list of page buttons shows
				 * Returns:  -
				 * Inputs:   object:oSettings - dataTables settings object
				 *           function:fnCallbackDraw - draw function to call on page change
				 */
				"fnUpdate": function ( oSettings, fnCallbackDraw )
				{
					if ( !oSettings.aanFeatures.p )
					{
						return;
					}
					
					var iPageCount = _oExt.oPagination.iFullNumbersShowPages;
					var iPageCountHalf = Math.floor(iPageCount / 2);
					var iPages = Math.ceil((oSettings.fnRecordsDisplay()) / oSettings._iDisplayLength);
					var iCurrentPage = Math.ceil(oSettings._iDisplayStart / oSettings._iDisplayLength) + 1;
					var sList = "";
					var iStartButton, iEndButton, i, iLen;
					var oClasses = oSettings.oClasses;
					
					/* Pages calculation */
					if (iPages < iPageCount)
					{
						iStartButton = 1;
						iEndButton = iPages;
					}
					else
					{
						if (iCurrentPage <= iPageCountHalf)
						{
							iStartButton = 1;
							iEndButton = iPageCount;
						}
						else
						{
							if (iCurrentPage >= (iPages - iPageCountHalf))
							{
								iStartButton = iPages - iPageCount + 1;
								iEndButton = iPages;
							}
							else
							{
								iStartButton = iCurrentPage - Math.ceil(iPageCount / 2) + 1;
								iEndButton = iStartButton + iPageCount - 1;
							}
						}
					}
					
					/* Build the dynamic list */
					for ( i=iStartButton ; i<=iEndButton ; i++ )
					{
						if ( iCurrentPage != i )
						{
							sList += '<span class="'+oClasses.sPageButton+'">'+i+'</span>';
						}
						else
						{
							sList += '<span class="'+oClasses.sPageButtonActive+'">'+i+'</span>';
						}
					}
					
					/* Loop over each instance of the pager */
					var an = oSettings.aanFeatures.p;
					var anButtons, anStatic, nPaginateList;
					var fnClick = function() {
						/* Use the information in the element to jump to the required page */
						var iTarget = (this.innerHTML * 1) - 1;
						oSettings._iDisplayStart = iTarget * oSettings._iDisplayLength;
						fnCallbackDraw( oSettings );
						return false;
					};
					var fnFalse = function () { return false; };
					
					for ( i=0, iLen=an.length ; i<iLen ; i++ )
					{
						if ( an[i].childNodes.length === 0 )
						{
							continue;
						}
						
						/* Build up the dynamic list forst - html and listeners */
						var qjPaginateList = $('span:eq(2)', an[i]);
						qjPaginateList.html( sList );
						$('span', qjPaginateList).bind( 'click.DT', fnClick ).bind( 'mousedown.DT', fnFalse )
							.bind( 'selectstart.DT', fnFalse );
						
						/* Update the 'premanent botton's classes */
						anButtons = an[i].getElementsByTagName('span');
						anStatic = [
							anButtons[0], anButtons[1], 
							anButtons[anButtons.length-2], anButtons[anButtons.length-1]
						];
						$(anStatic).removeClass( oClasses.sPageButton+" "+oClasses.sPageButtonActive+" "+oClasses.sPageButtonStaticDisabled );
						if ( iCurrentPage == 1 )
						{
							anStatic[0].className += " "+oClasses.sPageButtonStaticDisabled;
							anStatic[1].className += " "+oClasses.sPageButtonStaticDisabled;
						}
						else
						{
							anStatic[0].className += " "+oClasses.sPageButton;
							anStatic[1].className += " "+oClasses.sPageButton;
						}
						
						if ( iPages === 0 || iCurrentPage == iPages || oSettings._iDisplayLength == -1 )
						{
							anStatic[2].className += " "+oClasses.sPageButtonStaticDisabled;
							anStatic[3].className += " "+oClasses.sPageButtonStaticDisabled;
						}
						else
						{
							anStatic[2].className += " "+oClasses.sPageButton;
							anStatic[3].className += " "+oClasses.sPageButton;
						}
					}
				}
			}
		};
		
		/*
		 * Variable: oSort
		 * Purpose:  Wrapper for the sorting functions that can be used in DataTables
		 * Scope:    jQuery.fn.dataTableExt
		 * Notes:    The functions provided in this object are basically standard javascript sort
		 *   functions - they expect two inputs which they then compare and then return a priority
		 *   result. For each sort method added, two functions need to be defined, an ascending sort and
		 *   a descending sort.
		 */
		_oExt.oSort = {
			/*
			 * text sorting
			 */
			"string-asc": function ( a, b )
			{
				var x = a.toLowerCase();
				var y = b.toLowerCase();
				return ((x < y) ? -1 : ((x > y) ? 1 : 0));
			},
			
			"string-desc": function ( a, b )
			{
				var x = a.toLowerCase();
				var y = b.toLowerCase();
				return ((x < y) ? 1 : ((x > y) ? -1 : 0));
			},
			
			
			/*
			 * html sorting (ignore html tags)
			 */
			"html-asc": function ( a, b )
			{
				var x = a.replace( /<.*?>/g, "" ).toLowerCase();
				var y = b.replace( /<.*?>/g, "" ).toLowerCase();
				return ((x < y) ? -1 : ((x > y) ? 1 : 0));
			},
			
			"html-desc": function ( a, b )
			{
				var x = a.replace( /<.*?>/g, "" ).toLowerCase();
				var y = b.replace( /<.*?>/g, "" ).toLowerCase();
				return ((x < y) ? 1 : ((x > y) ? -1 : 0));
			},
			
			
			/*
			 * date sorting
			 */
			"date-asc": function ( a, b )
			{
				var x = Date.parse( a );
				var y = Date.parse( b );
				
				if ( isNaN(x) || x==="" )
				{
				x = Date.parse( "01/01/1970 00:00:00" );
				}
				if ( isNaN(y) || y==="" )
				{
					y =	Date.parse( "01/01/1970 00:00:00" );
				}
				
				return x - y;
			},
			
			"date-desc": function ( a, b )
			{
				var x = Date.parse( a );
				var y = Date.parse( b );
				
				if ( isNaN(x) || x==="" )
				{
				x = Date.parse( "01/01/1970 00:00:00" );
				}
				if ( isNaN(y) || y==="" )
				{
					y =	Date.parse( "01/01/1970 00:00:00" );
				}
				
				return y - x;
			},
			
			
			/*
			 * numerical sorting
			 */
			"numeric-asc": function ( a, b )
			{
				var x = (a=="-" || a==="") ? 0 : a*1;
				var y = (b=="-" || b==="") ? 0 : b*1;
				return x - y;
			},
			
			"numeric-desc": function ( a, b )
			{
				var x = (a=="-" || a==="") ? 0 : a*1;
				var y = (b=="-" || b==="") ? 0 : b*1;
				return y - x;
			}
		};
		
		
		/*
		 * Variable: aTypes
		 * Purpose:  Container for the various type of type detection that dataTables supports
		 * Scope:    jQuery.fn.dataTableExt
		 * Notes:    The functions in this array are expected to parse a string to see if it is a data
		 *   type that it recognises. If so then the function should return the name of the type (a
		 *   corresponding sort function should be defined!), if the type is not recognised then the
		 *   function should return null such that the parser and move on to check the next type.
		 *   Note that ordering is important in this array - the functions are processed linearly,
		 *   starting at index 0.
		 *   Note that the input for these functions is always a string! It cannot be any other data
		 *   type
		 */
		_oExt.aTypes = [
			/*
			 * Function: -
			 * Purpose:  Check to see if a string is numeric
			 * Returns:  string:'numeric' or null
			 * Inputs:   string:sText - string to check
			 */
			function ( sData )
			{
				/* Allow zero length strings as a number */
				if ( sData.length === 0 )
				{
					return 'numeric';
				}
				
				var sValidFirstChars = "0123456789-";
				var sValidChars = "0123456789.";
				var Char;
				var bDecimal = false;
				
				/* Check for a valid first char (no period and allow negatives) */
				Char = sData.charAt(0); 
				if (sValidFirstChars.indexOf(Char) == -1) 
				{
					return null;
				}
				
				/* Check all the other characters are valid */
				for ( var i=1 ; i<sData.length ; i++ ) 
				{
					Char = sData.charAt(i); 
					if (sValidChars.indexOf(Char) == -1) 
					{
						return null;
					}
					
					/* Only allowed one decimal place... */
					if ( Char == "." )
					{
						if ( bDecimal )
						{
							return null;
						}
						bDecimal = true;
					}
				}
				
				return 'numeric';
			},
			
			/*
			 * Function: -
			 * Purpose:  Check to see if a string is actually a formatted date
			 * Returns:  string:'date' or null
			 * Inputs:   string:sText - string to check
			 */
			function ( sData )
			{
				var iParse = Date.parse(sData);
				if ( (iParse !== null && !isNaN(iParse)) || sData.length === 0 )
				{
					return 'date';
				}
				return null;
			},
			
			/*
			 * Function: -
			 * Purpose:  Check to see if a string should be treated as an HTML string
			 * Returns:  string:'html' or null
			 * Inputs:   string:sText - string to check
			 */
			function ( sData )
			{
				if ( sData.indexOf('<') != -1 && sData.indexOf('>') != -1 )
				{
					return 'html';
				}
				return null;
			}
		];
		
		/*
		 * Function: fnVersionCheck
		 * Purpose:  Check a version string against this version of DataTables. Useful for plug-ins
		 * Returns:  bool:true -this version of DataTables is greater or equal to the required version
		 *                false -this version of DataTales is not suitable
		 * Inputs:   string:sVersion - the version to check against. May be in the following formats:
		 *             "a", "a.b" or "a.b.c"
		 * Notes:    This function will only check the first three parts of a version string. It is
		 *   assumed that beta and dev versions will meet the requirements. This might change in future
		 */
		_oExt.fnVersionCheck = function( sVersion )
		{
			/* This is cheap, but very effective */
			var fnZPad = function (Zpad, count)
			{
				while(Zpad.length < count) {
					Zpad += '0';
				}
				return Zpad;
			};
			var aThis = _oExt.sVersion.split('.');
			var aThat = sVersion.split('.');
			var sThis = '', sThat = '';
			
			for ( var i=0, iLen=aThat.length ; i<iLen ; i++ )
			{
				sThis += fnZPad( aThis[i], 3 );
				sThat += fnZPad( aThat[i], 3 );
			}
			
			return parseInt(sThis, 10) >= parseInt(sThat, 10);
		};
		
		/*
		 * Variable: _oExternConfig
		 * Purpose:  Store information for DataTables to access globally about other instances
		 * Scope:    jQuery.fn.dataTableExt
		 */
		_oExt._oExternConfig = {
			/* int:iNextUnique - next unique number for an instance */
			"iNextUnique": 0
		};
		
		
		/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
		 * Section - DataTables prototype
		 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
		
		/*
		 * Function: dataTable
		 * Purpose:  DataTables information
		 * Returns:  -
		 * Inputs:   object:oInit - initalisation options for the table
		 */
		$.fn.dataTable = function( oInit )
		{
			/*
			 * Function: classSettings
			 * Purpose:  Settings container function for all 'class' properties which are required
			 *   by dataTables
			 * Returns:  -
			 * Inputs:   -
			 */
			function classSettings ()
			{
				this.fnRecordsTotal = function ()
				{
					if ( this.oFeatures.bServerSide ) {
						return parseInt(this._iRecordsTotal, 10);
					} else {
						return this.aiDisplayMaster.length;
					}
				};
				
				this.fnRecordsDisplay = function ()
				{
					if ( this.oFeatures.bServerSide ) {
						return parseInt(this._iRecordsDisplay, 10);
					} else {
						return this.aiDisplay.length;
					}
				};
				
				this.fnDisplayEnd = function ()
				{
					if ( this.oFeatures.bServerSide ) {
						if ( this.oFeatures.bPaginate === false || this._iDisplayLength == -1 ) {
							return this._iDisplayStart+this.aiDisplay.length;
						} else {
							return Math.min( this._iDisplayStart+this._iDisplayLength, 
								this._iRecordsDisplay );
						}
					} else {
						return this._iDisplayEnd;
					}
				};
				
				/*
				 * Variable: oInstance
				 * Purpose:  The DataTables object for this table
				 * Scope:    jQuery.dataTable.classSettings 
				 */
				this.oInstance = null;
				
				/*
				 * Variable: sInstance
				 * Purpose:  Unique idendifier for each instance of the DataTables object
				 * Scope:    jQuery.dataTable.classSettings 
				 */
				this.sInstance = null;
				
				/*
				 * Variable: oFeatures
				 * Purpose:  Indicate the enablement of key dataTable features
				 * Scope:    jQuery.dataTable.classSettings 
				 */
				this.oFeatures = {
					"bPaginate": true,
					"bLengthChange": true,
					"bFilter": true,
					"bSort": true,
					"bInfo": true,
					"bAutoWidth": true,
					"bProcessing": false,
					"bSortClasses": true,
					"bStateSave": false,
					"bServerSide": false
				};
				
				/*
				 * Variable: oScroll
				 * Purpose:  Container for scrolling options
				 * Scope:    jQuery.dataTable.classSettings 
				 */
				this.oScroll = {
					"sX": "",
					"sXInner": "",
					"sY": "",
					"bCollapse": false,
					"bInfinite": false,
					"iLoadGap": 100,
					"iBarWidth": 0,
					"bAutoCss": true
				};
				
				/*
				 * Variable: aanFeatures
				 * Purpose:  Array referencing the nodes which are used for the features
				 * Scope:    jQuery.dataTable.classSettings 
				 * Notes:    The parameters of this object match what is allowed by sDom - i.e.
				 *   'l' - Length changing
				 *   'f' - Filtering input
				 *   't' - The table!
				 *   'i' - Information
				 *   'p' - Pagination
				 *   'r' - pRocessing
				 */
				this.aanFeatures = [];
				
				/*
				 * Variable: oLanguage
				 * Purpose:  Store the language strings used by dataTables
				 * Scope:    jQuery.dataTable.classSettings
				 * Notes:    The words in the format _VAR_ are variables which are dynamically replaced
				 *   by javascript
				 */
				this.oLanguage = {
					"sProcessing": "Processing...",
					"sLengthMenu": "Show _MENU_ entries",
					"sZeroRecords": "No matching records found",
					"sEmptyTable": "No data available in table",
					"sInfo": "Showing _START_ to _END_ of _TOTAL_ entries",
					"sInfoEmpty": "Showing 0 to 0 of 0 entries",
					"sInfoFiltered": "(filtered from _MAX_ total entries)",
					"sInfoPostFix": "",
					"sSearch": "Search:",
					"sUrl": "",
					"oPaginate": {
						"sFirst":    "First",
						"sPrevious": "Previous",
						"sNext":     "Next",
						"sLast":     "Last"
					},
					"fnInfoCallback": null
				};
				
				/*
				 * Variable: aoData
				 * Purpose:  Store data information
				 * Scope:    jQuery.dataTable.classSettings 
				 * Notes:    This is an array of objects with the following parameters:
				 *   int: _iId - internal id for tracking
				 *   array: _aData - internal data - used for sorting / filtering etc
				 *   node: nTr - display node
				 *   array node: _anHidden - hidden TD nodes
				 *   string: _sRowStripe
				 */
				this.aoData = [];
				
				/*
				 * Variable: aiDisplay
				 * Purpose:  Array of indexes which are in the current display (after filtering etc)
				 * Scope:    jQuery.dataTable.classSettings
				 */
				this.aiDisplay = [];
				
				/*
				 * Variable: aiDisplayMaster
				 * Purpose:  Array of indexes for display - no filtering
				 * Scope:    jQuery.dataTable.classSettings
				 */
				this.aiDisplayMaster = [];
								
				/*
				 * Variable: aoColumns
				 * Purpose:  Store information about each column that is in use
				 * Scope:    jQuery.dataTable.classSettings 
				 */
				this.aoColumns = [];
				
				/*
				 * Variable: iNextId
				 * Purpose:  Store the next unique id to be used for a new row
				 * Scope:    jQuery.dataTable.classSettings 
				 */
				this.iNextId = 0;
				
				/*
				 * Variable: asDataSearch
				 * Purpose:  Search data array for regular expression searching
				 * Scope:    jQuery.dataTable.classSettings
				 */
				this.asDataSearch = [];
				
				/*
				 * Variable: oPreviousSearch
				 * Purpose:  Store the previous search incase we want to force a re-search
				 *   or compare the old search to a new one
				 * Scope:    jQuery.dataTable.classSettings
				 */
				this.oPreviousSearch = {
					"sSearch": "",
					"bRegex": false,
					"bSmart": true
				};
				
				/*
				 * Variable: aoPreSearchCols
				 * Purpose:  Store the previous search for each column
				 * Scope:    jQuery.dataTable.classSettings
				 */
				this.aoPreSearchCols = [];
				
				/*
				 * Variable: aaSorting
				 * Purpose:  Sorting information
				 * Scope:    jQuery.dataTable.classSettings
				 * Notes:    Index 0 - column number
				 *           Index 1 - current sorting direction
				 *           Index 2 - index of asSorting for this column
				 */
				this.aaSorting = [ [0, 'asc', 0] ];
				
				/*
				 * Variable: aaSortingFixed
				 * Purpose:  Sorting information that is always applied
				 * Scope:    jQuery.dataTable.classSettings
				 */
				this.aaSortingFixed = null;
				
				/*
				 * Variable: asStripClasses
				 * Purpose:  Classes to use for the striping of a table
				 * Scope:    jQuery.dataTable.classSettings
				 */
				this.asStripClasses = [];
				
				/*
				 * Variable: asDestoryStrips
				 * Purpose:  If restoring a table - we should restore it's striping classes as well
				 * Scope:    jQuery.dataTable.classSettings
				 */
				this.asDestoryStrips = [];
				
				/*
				 * Variable: sDestroyWidth
				 * Purpose:  If restoring a table - we should restore it's width
				 * Scope:    jQuery.dataTable.classSettings
				 */
				this.sDestroyWidth = 0;
				
				/*
				 * Variable: fnRowCallback
				 * Purpose:  Call this function every time a row is inserted (draw)
				 * Scope:    jQuery.dataTable.classSettings
				 */
				this.fnRowCallback = null;
				
				/*
				 * Variable: fnHeaderCallback
				 * Purpose:  Callback function for the header on each draw
				 * Scope:    jQuery.dataTable.classSettings
				 */
				this.fnHeaderCallback = null;
				
				/*
				 * Variable: fnFooterCallback
				 * Purpose:  Callback function for the footer on each draw
				 * Scope:    jQuery.dataTable.classSettings
				 */
				this.fnFooterCallback = null;
				
				/*
				 * Variable: aoDrawCallback
				 * Purpose:  Array of callback functions for draw callback functions
				 * Scope:    jQuery.dataTable.classSettings
				 * Notes:    Each array element is an object with the following parameters:
				 *   function:fn - function to call
				 *   string:sName - name callback (feature). useful for arranging array
				 */
				this.aoDrawCallback = [];
				
				/*
				 * Variable: fnInitComplete
				 * Purpose:  Callback function for when the table has been initalised
				 * Scope:    jQuery.dataTable.classSettings
				 */
				this.fnInitComplete = null;
				
				/*
				 * Variable: sTableId
				 * Purpose:  Cache the table ID for quick access
				 * Scope:    jQuery.dataTable.classSettings
				 */
				this.sTableId = "";
				
				/*
				 * Variable: nTable
				 * Purpose:  Cache the table node for quick access
				 * Scope:    jQuery.dataTable.classSettings
				 */
				this.nTable = null;
				
				/*
				 * Variable: nTHead
				 * Purpose:  Permanent ref to the thead element
				 * Scope:    jQuery.dataTable.classSettings
				 */
				this.nTHead = null;
				
				/*
				 * Variable: nTFoot
				 * Purpose:  Permanent ref to the tfoot element - if it exists
				 * Scope:    jQuery.dataTable.classSettings
				 */
				this.nTFoot = null;
				
				/*
				 * Variable: nTBody
				 * Purpose:  Permanent ref to the tbody element
				 * Scope:    jQuery.dataTable.classSettings
				 */
				this.nTBody = null;
				
				/*
				 * Variable: nTableWrapper
				 * Purpose:  Cache the wrapper node (contains all DataTables controlled elements)
				 * Scope:    jQuery.dataTable.classSettings
				 */
				this.nTableWrapper = null;
				
				/*
				 * Variable: bInitialised
				 * Purpose:  Indicate if all required information has been read in
				 * Scope:    jQuery.dataTable.classSettings
				 */
				this.bInitialised = false;
				
				/*
				 * Variable: aoOpenRows
				 * Purpose:  Information about open rows
				 * Scope:    jQuery.dataTable.classSettings
				 * Notes:    Has the parameters 'nTr' and 'nParent'
				 */
				this.aoOpenRows = [];
				
				/*
				 * Variable: sDom
				 * Purpose:  Dictate the positioning that the created elements will take
				 * Scope:    jQuery.dataTable.classSettings
				 * Notes:    
				 *   The following options are allowed:
				 *     'l' - Length changing
				 *     'f' - Filtering input
				 *     't' - The table!
				 *     'i' - Information
				 *     'p' - Pagination
				 *     'r' - pRocessing
				 *   The following constants are allowed:
				 *     'H' - jQueryUI theme "header" classes
				 *     'F' - jQueryUI theme "footer" classes
				 *   The following syntax is expected:
				 *     '<' and '>' - div elements
				 *     '<"class" and '>' - div with a class
				 *   Examples:
				 *     '<"wrapper"flipt>', '<lf<t>ip>'
				 */
				this.sDom = 'lfrtip';
				
				/*
				 * Variable: sPaginationType
				 * Purpose:  Note which type of sorting should be used
				 * Scope:    jQuery.dataTable.classSettings
				 */
				this.sPaginationType = "two_button";
				
				/*
				 * Variable: iCookieDuration
				 * Purpose:  The cookie duration (for bStateSave) in seconds - default 2 hours
				 * Scope:    jQuery.dataTable.classSettings
				 */
				this.iCookieDuration = 60 * 60 * 2;
				
				/*
				 * Variable: sCookiePrefix
				 * Purpose:  The cookie name prefix
				 * Scope:    jQuery.dataTable.classSettings
				 */
				this.sCookiePrefix = "SpryMedia_DataTables_";
				
				/*
				 * Variable: fnCookieCallback
				 * Purpose:  Callback function for cookie creation
				 * Scope:    jQuery.dataTable.classSettings
				 */
				this.fnCookieCallback = null;
				
				/*
				 * Variable: aoStateSave
				 * Purpose:  Array of callback functions for state saving
				 * Scope:    jQuery.dataTable.classSettings
				 * Notes:    Each array element is an object with the following parameters:
				 *   function:fn - function to call. Takes two parameters, oSettings and the JSON string to
				 *     save that has been thus far created. Returns a JSON string to be inserted into a 
				 *     json object (i.e. '"param": [ 0, 1, 2]')
				 *   string:sName - name of callback
				 */
				this.aoStateSave = [];
				
				/*
				 * Variable: aoStateLoad
				 * Purpose:  Array of callback functions for state loading
				 * Scope:    jQuery.dataTable.classSettings
				 * Notes:    Each array element is an object with the following parameters:
				 *   function:fn - function to call. Takes two parameters, oSettings and the object stored.
				 *     May return false to cancel state loading.
				 *   string:sName - name of callback
				 */
				this.aoStateLoad = [];
				
				/*
				 * Variable: oLoadedState
				 * Purpose:  State that was loaded from the cookie. Useful for back reference
				 * Scope:    jQuery.dataTable.classSettings
				 */
				this.oLoadedState = null;
				
				/*
				 * Variable: sAjaxSource
				 * Purpose:  Source url for AJAX data for the table
				 * Scope:    jQuery.dataTable.classSettings
				 */
				this.sAjaxSource = null;
				
				/*
				 * Variable: bAjaxDataGet
				 * Purpose:  Note if draw should be blocked while getting data
				 * Scope:    jQuery.dataTable.classSettings
				 */
				this.bAjaxDataGet = true;
				
				/*
				 * Variable: fnServerData
				 * Purpose:  Function to get the server-side data - can be overruled by the developer
				 * Scope:    jQuery.dataTable.classSettings
				 */
				this.fnServerData = function ( url, data, callback ) {
					$.ajax( {
						"url": url,
						"data": data,
						"success": callback,
						"dataType": "json",
						"cache": false,
						"error": function (xhr, error, thrown) {
							if ( error == "parsererror" ) {
								alert( "DataTables warning: JSON data from server could not be parsed. "+
									"This is caused by a JSON formatting error." );
							}
						}
					} );
				};
				
				/*
				 * Variable: fnFormatNumber
				 * Purpose:  Format numbers for display
				 * Scope:    jQuery.dataTable.classSettings
				 */
				this.fnFormatNumber = function ( iIn )
				{
					if ( iIn < 1000 )
					{
						/* A small optimisation for what is likely to be the vast majority of use cases */
						return iIn;
					}
					else
					{
						var s=(iIn+""), a=s.split(""), out="", iLen=s.length;
						
						for ( var i=0 ; i<iLen ; i++ )
						{
							if ( i%3 === 0 && i !== 0 )
							{
								out = ','+out;
							}
							out = a[iLen-i-1]+out;
						}
					}
					return out;
				};
				
				/*
				 * Variable: aLengthMenu
				 * Purpose:  List of options that can be used for the user selectable length menu
				 * Scope:    jQuery.dataTable.classSettings
				 * Note:     This varaible can take for form of a 1D array, in which case the value and the 
				 *   displayed value in the menu are the same, or a 2D array in which case the value comes
				 *   from the first array, and the displayed value to the end user comes from the second
				 *   array. 2D example: [ [ 10, 25, 50, 100, -1 ], [ 10, 25, 50, 100, 'All' ] ];
				 */
				this.aLengthMenu = [ 10, 25, 50, 100 ];
				
				/*
				 * Variable: iDraw
				 * Purpose:  Counter for the draws that the table does. Also used as a tracker for
				 *   server-side processing
				 * Scope:    jQuery.dataTable.classSettings
				 */
				this.iDraw = 0;
				
				/*
				 * Variable: bDrawing
				 * Purpose:  Indicate if a redraw is being done - useful for Ajax
				 * Scope:    jQuery.dataTable.classSettings
				 */
				this.bDrawing = 0;
				
				/*
				 * Variable: iDrawError
				 * Purpose:  Last draw error
				 * Scope:    jQuery.dataTable.classSettings
				 */
				this.iDrawError = -1;
				
				/*
				 * Variable: _iDisplayLength, _iDisplayStart, _iDisplayEnd
				 * Purpose:  Display length variables
				 * Scope:    jQuery.dataTable.classSettings
				 * Notes:    These variable must NOT be used externally to get the data length. Rather, use
				 *   the fnRecordsTotal() (etc) functions.
				 */
				this._iDisplayLength = 10;
				this._iDisplayStart = 0;
				this._iDisplayEnd = 10;
				
				/*
				 * Variable: _iRecordsTotal, _iRecordsDisplay
				 * Purpose:  Display length variables used for server side processing
				 * Scope:    jQuery.dataTable.classSettings
				 * Notes:    These variable must NOT be used externally to get the data length. Rather, use
				 *   the fnRecordsTotal() (etc) functions.
				 */
				this._iRecordsTotal = 0;
				this._iRecordsDisplay = 0;
				
				/*
				 * Variable: bJUI
				 * Purpose:  Should we add the markup needed for jQuery UI theming?
				 * Scope:    jQuery.dataTable.classSettings
				 */
				this.bJUI = false;
				
				/*
				 * Variable: bJUI
				 * Purpose:  Should we add the markup needed for jQuery UI theming?
				 * Scope:    jQuery.dataTable.classSettings
				 */
				this.oClasses = _oExt.oStdClasses;
				
				/*
				 * Variable: bFiltered and bSorted
				 * Purpose:  Flags to allow callback functions to see what actions have been performed
				 * Scope:    jQuery.dataTable.classSettings
				 */
				this.bFiltered = false;
				this.bSorted = false;
				
				/*
				 * Variable: oInit
				 * Purpose:  Initialisation object that is used for the table
				 * Scope:    jQuery.dataTable.classSettings
				 */
				this.oInit = null;
			}
			
			/*
			 * Variable: oApi
			 * Purpose:  Container for publicly exposed 'private' functions
			 * Scope:    jQuery.dataTable
			 */
			this.oApi = {};
			
			
			/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
			 * Section - API functions
			 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
			
			/*
			 * Function: fnDraw
			 * Purpose:  Redraw the table
			 * Returns:  -
			 * Inputs:   bool:bComplete - Refilter and resort (if enabled) the table before the draw.
			 *             Optional: default - true
			 */
			this.fnDraw = function( bComplete )
			{
				var oSettings = _fnSettingsFromNode( this[_oExt.iApiIndex] );
				if ( typeof bComplete != 'undefined' && bComplete === false )
				{
					_fnCalculateEnd( oSettings );
					_fnDraw( oSettings );
				}
				else
				{
					_fnReDraw( oSettings );
				}
			};
			
			/*
			 * Function: fnFilter
			 * Purpose:  Filter the input based on data
			 * Returns:  -
			 * Inputs:   string:sInput - string to filter the table on
			 *           int:iColumn - optional - column to limit filtering to
			 *           bool:bRegex - optional - treat as regular expression or not - default false
			 *           bool:bSmart - optional - perform smart filtering or not - default true
			 *           bool:bShowGlobal - optional - show the input global filter in it's input box(es)
			 *              - default true
			 */
			this.fnFilter = function( sInput, iColumn, bRegex, bSmart, bShowGlobal )
			{
				var oSettings = _fnSettingsFromNode( this[_oExt.iApiIndex] );
				
				if ( !oSettings.oFeatures.bFilter )
				{
					return;
				}
				
				if ( typeof bRegex == 'undefined' )
				{
					bRegex = false;
				}
				
				if ( typeof bSmart == 'undefined' )
				{
					bSmart = true;
				}
				
				if ( typeof bShowGlobal == 'undefined' )
				{
					bShowGlobal = true;
				}
				
				if ( typeof iColumn == "undefined" || iColumn === null )
				{
					/* Global filter */
					_fnFilterComplete( oSettings, {
						"sSearch":sInput,
						"bRegex": bRegex,
						"bSmart": bSmart
					}, 1 );
					
					if ( bShowGlobal && typeof oSettings.aanFeatures.f != 'undefined' )
					{
						var n = oSettings.aanFeatures.f;
						for ( var i=0, iLen=n.length ; i<iLen ; i++ )
						{
							$('input', n[i]).val( sInput );
						}
					}
				}
				else
				{
					/* Single column filter */
					oSettings.aoPreSearchCols[ iColumn ].sSearch = sInput;
					oSettings.aoPreSearchCols[ iColumn ].bRegex = bRegex;
					oSettings.aoPreSearchCols[ iColumn ].bSmart = bSmart;
					_fnFilterComplete( oSettings, oSettings.oPreviousSearch, 1 );
				}
			};
			
			/*
			 * Function: fnSettings
			 * Purpose:  Get the settings for a particular table for extern. manipulation
			 * Returns:  -
			 * Inputs:   -
			 */
			this.fnSettings = function( nNode  )
			{
				return _fnSettingsFromNode( this[_oExt.iApiIndex] );
			};
			
			/*
			 * Function: fnVersionCheck
			 * Notes:    The function is the same as the 'static' function provided in the ext variable
			 */
			this.fnVersionCheck = _oExt.fnVersionCheck;
			
			/*
			 * Function: fnSort
			 * Purpose:  Sort the table by a particular row
			 * Returns:  -
			 * Inputs:   int:iCol - the data index to sort on. Note that this will
			 *   not match the 'display index' if you have hidden data entries
			 */
			this.fnSort = function( aaSort )
			{
				var oSettings = _fnSettingsFromNode( this[_oExt.iApiIndex] );
				oSettings.aaSorting = aaSort;
				_fnSort( oSettings );
			};
			
			/*
			 * Function: fnSortListener
			 * Purpose:  Attach a sort listener to an element for a given column
			 * Returns:  -
			 * Inputs:   node:nNode - the element to attach the sort listener to
			 *           int:iColumn - the column that a click on this node will sort on
			 *           function:fnCallback - callback function when sort is run - optional
			 */
			this.fnSortListener = function( nNode, iColumn, fnCallback )
			{
				_fnSortAttachListener( _fnSettingsFromNode( this[_oExt.iApiIndex] ), nNode, iColumn,
					fnCallback );
			};
			
			/*
			 * Function: fnAddData
			 * Purpose:  Add new row(s) into the table
			 * Returns:  array int: array of indexes (aoData) which have been added (zero length on error)
			 * Inputs:   array:mData - the data to be added. The length must match
			 *               the original data from the DOM
			 *             or
			 *             array array:mData - 2D array of data to be added
			 *           bool:bRedraw - redraw the table or not - default true
			 * Notes:    Warning - the refilter here will cause the table to redraw
			 *             starting at zero
			 * Notes:    Thanks to Yekimov Denis for contributing the basis for this function!
			 */
			this.fnAddData = function( mData, bRedraw )
			{
				if ( mData.length === 0 )
				{
					return [];
				}
				
				var aiReturn = [];
				var iTest;
				
				/* Find settings from table node */
				var oSettings = _fnSettingsFromNode( this[_oExt.iApiIndex] );
				
				/* Check if we want to add multiple rows or not */
				if ( typeof mData[0] == "object" )
				{
					for ( var i=0 ; i<mData.length ; i++ )
					{
						iTest = _fnAddData( oSettings, mData[i] );
						if ( iTest == -1 )
						{
							return aiReturn;
						}
						aiReturn.push( iTest );
					}
				}
				else
				{
					iTest = _fnAddData( oSettings, mData );
					if ( iTest == -1 )
					{
						return aiReturn;
					}
					aiReturn.push( iTest );
				}
				
				oSettings.aiDisplay = oSettings.aiDisplayMaster.slice();
				
				if ( typeof bRedraw == 'undefined' || bRedraw )
				{
					_fnReDraw( oSettings );
				}
				return aiReturn;
			};
			
			/*
			 * Function: fnDeleteRow
			 * Purpose:  Remove a row for the table
			 * Returns:  array:aReturn - the row that was deleted
			 * Inputs:   mixed:mTarget - 
			 *             int: - index of aoData to be deleted, or
			 *             node(TR): - TR element you want to delete
			 *           function:fnCallBack - callback function - default null
			 *           bool:bRedraw - redraw the table or not - default true
			 */
			this.fnDeleteRow = function( mTarget, fnCallBack, bRedraw )
			{
				/* Find settings from table node */
				var oSettings = _fnSettingsFromNode( this[_oExt.iApiIndex] );
				var i, iAODataIndex;
				
				iAODataIndex = (typeof mTarget == 'object') ? 
					_fnNodeToDataIndex(oSettings, mTarget) : mTarget;
				
				/* Return the data array from this row */
				var oData = oSettings.aoData.splice( iAODataIndex, 1 );
				
				/* Remove the target row from the search array */
				var iDisplayIndex = $.inArray( iAODataIndex, oSettings.aiDisplay );
				oSettings.asDataSearch.splice( iDisplayIndex, 1 );
				
				/* Delete from the display arrays */
				_fnDeleteIndex( oSettings.aiDisplayMaster, iAODataIndex );
				_fnDeleteIndex( oSettings.aiDisplay, iAODataIndex );
				
				/* If there is a user callback function - call it */
				if ( typeof fnCallBack == "function" )
				{
					fnCallBack.call( this, oSettings, oData );
				}
				
				/* Check for an 'overflow' they case for dislaying the table */
				if ( oSettings._iDisplayStart >= oSettings.aiDisplay.length )
				{
					oSettings._iDisplayStart -= oSettings._iDisplayLength;
					if ( oSettings._iDisplayStart < 0 )
					{
						oSettings._iDisplayStart = 0;
					}
				}
				
				if ( typeof bRedraw == 'undefined' || bRedraw )
				{
					_fnCalculateEnd( oSettings );
					_fnDraw( oSettings );
				}
				
				return oData;
			};
			
			/*
			 * Function: fnClearTable
			 * Purpose:  Quickly and simply clear a table
			 * Returns:  -
			 * Inputs:   bool:bRedraw - redraw the table or not - default true
			 * Notes:    Thanks to Yekimov Denis for contributing the basis for this function!
			 */
			this.fnClearTable = function( bRedraw )
			{
				/* Find settings from table node */
				var oSettings = _fnSettingsFromNode( this[_oExt.iApiIndex] );
				_fnClearTable( oSettings );
				
				if ( typeof bRedraw == 'undefined' || bRedraw )
				{
					_fnDraw( oSettings );
				}
			};
			
			/*
			 * Function: fnOpen
			 * Purpose:  Open a display row (append a row after the row in question)
			 * Returns:  node:nNewRow - the row opened
			 * Inputs:   node:nTr - the table row to 'open'
			 *           string:sHtml - the HTML to put into the row
			 *           string:sClass - class to give the new TD cell
			 */
			this.fnOpen = function( nTr, sHtml, sClass )
			{
				/* Find settings from table node */
				var oSettings = _fnSettingsFromNode( this[_oExt.iApiIndex] );
				
				/* the old open one if there is one */
				this.fnClose( nTr );
				
				var nNewRow = document.createElement("tr");
				var nNewCell = document.createElement("td");
				nNewRow.appendChild( nNewCell );
				nNewCell.className = sClass;
				nNewCell.colSpan = _fnVisbleColumns( oSettings );
				nNewCell.innerHTML = sHtml;
				
				/* If the nTr isn't on the page at the moment - then we don't insert at the moment */
				var nTrs = $('tr', oSettings.nTBody);
				if ( $.inArray(nTr, nTrs) != -1 )
				{
					$(nNewRow).insertAfter(nTr);
				}
				
				oSettings.aoOpenRows.push( {
					"nTr": nNewRow,
					"nParent": nTr
				} );
				
				return nNewRow;
			};
			
			/*
			 * Function: fnClose
			 * Purpose:  Close a display row
			 * Returns:  int: 0 (success) or 1 (failed)
			 * Inputs:   node:nTr - the table row to 'close'
			 */
			this.fnClose = function( nTr )
			{
				/* Find settings from table node */
				var oSettings = _fnSettingsFromNode( this[_oExt.iApiIndex] );
				
				for ( var i=0 ; i<oSettings.aoOpenRows.length ; i++ )
				{
					if ( oSettings.aoOpenRows[i].nParent == nTr )
					{
						var nTrParent = oSettings.aoOpenRows[i].nTr.parentNode;
						if ( nTrParent )
						{
							/* Remove it if it is currently on display */
							nTrParent.removeChild( oSettings.aoOpenRows[i].nTr );
						}
						oSettings.aoOpenRows.splice( i, 1 );
						return 0;
					}
				}
				return 1;
			};
			
			/*
			 * Function: fnGetData
			 * Purpose:  Return an array with the data which is used to make up the table
			 * Returns:  array array string: 2d data array ([row][column]) or array string: 1d data array
			 *           or
			 *           array string (if iRow specified)
			 * Inputs:   mixed:mRow - optional - if not present, then the full 2D array for the table 
			 *             if given then:
			 *               int: - return 1D array for aoData entry of this index
			 *               node(TR): - return 1D array for this TR element
			 * Inputs:   int:iRow - optional - if present then the array returned will be the data for
			 *             the row with the index 'iRow'
			 */
			this.fnGetData = function( mRow )
			{
				var oSettings = _fnSettingsFromNode( this[_oExt.iApiIndex] );
				
				if ( typeof mRow != 'undefined' )
				{
					var iRow = (typeof mRow == 'object') ? 
						_fnNodeToDataIndex(oSettings, mRow) : mRow;
					return ( (aRowData = oSettings.aoData[iRow]) ? aRowData._aData : null);
				}
				return _fnGetDataMaster( oSettings );
			};
			
			/*
			 * Function: fnGetNodes
			 * Purpose:  Return an array with the TR nodes used for drawing the table
			 * Returns:  array node: TR elements
			 *           or
			 *           node (if iRow specified)
			 * Inputs:   int:iRow - optional - if present then the array returned will be the node for
			 *             the row with the index 'iRow'
			 */
			this.fnGetNodes = function( iRow )
			{
				var oSettings = _fnSettingsFromNode( this[_oExt.iApiIndex] );
				
				if ( typeof iRow != 'undefined' )
				{
					return ( (aRowData = oSettings.aoData[iRow]) ? aRowData.nTr : null );
				}
				return _fnGetTrNodes( oSettings );
			};
			
			/*
			 * Function: fnGetPosition
			 * Purpose:  Get the array indexes of a particular cell from it's DOM element
			 * Returns:  int: - row index, or array[ int, int, int ]: - row index, column index (visible)
			 *             and column index including hidden columns
			 * Inputs:   node:nNode - this can either be a TR or a TD in the table, the return is
			 *             dependent on this input
			 */
			this.fnGetPosition = function( nNode )
			{
				var oSettings = _fnSettingsFromNode( this[_oExt.iApiIndex] );
				var i;
				
				if ( nNode.nodeName.toUpperCase() == "TR" )
				{
					return _fnNodeToDataIndex(oSettings, nNode);
				}
				else if ( nNode.nodeName.toUpperCase() == "TD" )
				{
					var iDataIndex = _fnNodeToDataIndex(oSettings, nNode.parentNode);
					var iCorrector = 0;
					for ( var j=0 ; j<oSettings.aoColumns.length ; j++ )
					{
						if ( oSettings.aoColumns[j].bVisible )
						{
							if ( oSettings.aoData[iDataIndex].nTr.getElementsByTagName('td')[j-iCorrector] == nNode )
							{
								return [ iDataIndex, j-iCorrector, j ];
							}
						}
						else
						{
							iCorrector++;
						}
					}
				}
				return null;
			};
			
			/*
			 * Function: fnUpdate
			 * Purpose:  Update a table cell or row
			 * Returns:  int: 0 okay, 1 error
			 * Inputs:   array string 'or' string:mData - data to update the cell/row with
			 *           mixed:mRow - 
			 *             int: - index of aoData to be updated, or
			 *             node(TR): - TR element you want to update
			 *           int:iColumn - the column to update - optional (not used of mData is 2D)
			 *           bool:bRedraw - redraw the table or not - default true
			 *           bool:bAction - perform predraw actions or not (you will want this as 'true' if
			 *             you have bRedraw as true) - default true
			 */
			this.fnUpdate = function( mData, mRow, iColumn, bRedraw, bAction )
			{
				var oSettings = _fnSettingsFromNode( this[_oExt.iApiIndex] );
				var iVisibleColumn;
				var sDisplay;
				var iRow = (typeof mRow == 'object') ? 
					_fnNodeToDataIndex(oSettings, mRow) : mRow;
				
				if ( typeof mData != 'object' )
				{
					sDisplay = mData;
					oSettings.aoData[iRow]._aData[iColumn] = sDisplay;
					
					if ( oSettings.aoColumns[iColumn].fnRender !== null )
					{
						sDisplay = oSettings.aoColumns[iColumn].fnRender( {
							"iDataRow": iRow,
							"iDataColumn": iColumn,
							"aData": oSettings.aoData[iRow]._aData,
							"oSettings": oSettings
						} );
						
						if ( oSettings.aoColumns[iColumn].bUseRendered )
						{
							oSettings.aoData[iRow]._aData[iColumn] = sDisplay;
						}
					}
					
					iVisibleColumn = _fnColumnIndexToVisible( oSettings, iColumn );
					if ( iVisibleColumn !== null )
					{
						oSettings.aoData[iRow].nTr.getElementsByTagName('td')[iVisibleColumn].innerHTML = 
							sDisplay;
					}
					else
					{
						oSettings.aoData[iRow]._anHidden[iColumn].innerHTML = sDisplay;
					}
				}
				else
				{
					if ( mData.length != oSettings.aoColumns.length )
					{
						_fnLog( oSettings, 0, 'An array passed to fnUpdate must have the same number of '+
							'columns as the table in question - in this case '+oSettings.aoColumns.length );
						return 1;
					}
					
					for ( var i=0 ; i<mData.length ; i++ )
					{
						sDisplay = mData[i];
						oSettings.aoData[iRow]._aData[i] = sDisplay;
						
						if ( oSettings.aoColumns[i].fnRender !== null )
						{
							sDisplay = oSettings.aoColumns[i].fnRender( {
								"iDataRow": iRow,
								"iDataColumn": i,
								"aData": oSettings.aoData[iRow]._aData,
								"oSettings": oSettings
							} );
							
							if ( oSettings.aoColumns[i].bUseRendered )
							{
								oSettings.aoData[iRow]._aData[i] = sDisplay;
							}
						}
						
						iVisibleColumn = _fnColumnIndexToVisible( oSettings, i );
						if ( iVisibleColumn !== null )
						{
							oSettings.aoData[iRow].nTr.getElementsByTagName('td')[iVisibleColumn].innerHTML = 
								sDisplay;
						}
						else
						{
							oSettings.aoData[iRow]._anHidden[i].innerHTML = sDisplay;
						}
					}
				}
				
				/* Modify the search index for this row (strictly this is likely not needed, since fnReDraw
				 * will rebuild the search array - however, the redraw might be disabled by the user)
				 */
				var iDisplayIndex = $.inArray( iRow, oSettings.aiDisplay );
				oSettings.asDataSearch[iDisplayIndex] = _fnBuildSearchRow( oSettings, 
					oSettings.aoData[iRow]._aData );
				
				/* Perform pre-draw actions */
				if ( typeof bAction == 'undefined' || bAction )
				{
					_fnAjustColumnSizing( oSettings );
				}
				
				/* Redraw the table */
				if ( typeof bRedraw == 'undefined' || bRedraw )
				{
					_fnReDraw( oSettings );
				}
				return 0;
			};
			
			
			/*
			 * Function: fnShowColoumn
			 * Purpose:  Show a particular column
			 * Returns:  -
			 * Inputs:   int:iCol - the column whose display should be changed
			 *           bool:bShow - show (true) or hide (false) the column
			 *           bool:bRedraw - redraw the table or not - default true
			 */
			this.fnSetColumnVis = function ( iCol, bShow, bRedraw )
			{
				var oSettings = _fnSettingsFromNode( this[_oExt.iApiIndex] );
				var i, iLen;
				var iColumns = oSettings.aoColumns.length;
				var nTd, anTds, nCell, anTrs, jqChildren;
				
				/* No point in doing anything if we are requesting what is already true */
				if ( oSettings.aoColumns[iCol].bVisible == bShow )
				{
					return;
				}
				
				var nTrHead = $('>tr', oSettings.nTHead)[0];
				var nTrFoot = $('>tr', oSettings.nTFoot)[0];
				var anTheadTh = [];
				var anTfootTh = [];
				for ( i=0 ; i<iColumns ; i++ )
				{
					anTheadTh.push( oSettings.aoColumns[i].nTh );
					anTfootTh.push( oSettings.aoColumns[i].nTf );
				}
				
				/* Show the column */
				if ( bShow )
				{
					var iInsert = 0;
					for ( i=0 ; i<iCol ; i++ )
					{
						if ( oSettings.aoColumns[i].bVisible )
						{
							iInsert++;
						}
					}
					
					/* Need to decide if we should use appendChild or insertBefore */
					if ( iInsert >= _fnVisbleColumns( oSettings ) )
					{
						nTrHead.appendChild( anTheadTh[iCol] );
						anTrs = $('>tr', oSettings.nTHead);
						for ( i=1, iLen=anTrs.length ; i<iLen ; i++ )
						{
							anTrs[i].appendChild( oSettings.aoColumns[iCol].anThExtra[i-1] );
						}	
						
						if ( nTrFoot )
						{
							nTrFoot.appendChild( anTfootTh[iCol] );
							anTrs = $('>tr', oSettings.nTFoot);
							for ( i=1, iLen=anTrs.length ; i<iLen ; i++ )
							{
								anTrs[i].appendChild( oSettings.aoColumns[iCol].anTfExtra[i-1] );
							}	
						}
						
						for ( i=0, iLen=oSettings.aoData.length ; i<iLen ; i++ )
						{
							nTd = oSettings.aoData[i]._anHidden[iCol];
							oSettings.aoData[i].nTr.appendChild( nTd );
						}
					}
					else
					{
						/* Which coloumn should we be inserting before? */
						var iBefore;
						for ( i=iCol ; i<iColumns ; i++ )
						{
							iBefore = _fnColumnIndexToVisible( oSettings, i );
							if ( iBefore !== null )
							{
								break;
							}
						}
						
						nTrHead.insertBefore( anTheadTh[iCol], nTrHead.getElementsByTagName('th')[iBefore] );
						anTrs = $('>tr', oSettings.nTHead);
						for ( i=1, iLen=anTrs.length ; i<iLen ; i++ )
						{
							jqChildren = $(anTrs[i]).children();
							anTrs[i].insertBefore( oSettings.aoColumns[iCol].anThExtra[i-1], jqChildren[iBefore] );
						}	
						
						if ( nTrFoot )
						{
							nTrFoot.insertBefore( anTfootTh[iCol], nTrFoot.getElementsByTagName('th')[iBefore] );
							anTrs = $('>tr', oSettings.nTFoot);
							for ( i=1, iLen=anTrs.length ; i<iLen ; i++ )
							{
								jqChildren = $(anTrs[i]).children();
								anTrs[i].insertBefore( oSettings.aoColumns[iCol].anTfExtra[i-1], jqChildren[iBefore] );
							}	
						}
						
						anTds = _fnGetTdNodes( oSettings );
						for ( i=0, iLen=oSettings.aoData.length ; i<iLen ; i++ )
						{
							nTd = oSettings.aoData[i]._anHidden[iCol];
							oSettings.aoData[i].nTr.insertBefore( nTd, $('>td:eq('+iBefore+')', 
								oSettings.aoData[i].nTr)[0] );
						}
					}
					
					oSettings.aoColumns[iCol].bVisible = true;
				}
				else
				{
					/* Remove a column from display */
					nTrHead.removeChild( anTheadTh[iCol] );
					for ( i=0, iLen=oSettings.aoColumns[iCol].anThExtra.length ; i<iLen ; i++ )
					{
						nCell = oSettings.aoColumns[iCol].anThExtra[i];
						nCell.parentNode.removeChild( nCell );
					}
					
					if ( nTrFoot )
					{
						nTrFoot.removeChild( anTfootTh[iCol] );
						for ( i=0, iLen=oSettings.aoColumns[iCol].anTfExtra.length ; i<iLen ; i++ )
						{
							nCell = oSettings.aoColumns[iCol].anTfExtra[i];
							nCell.parentNode.removeChild( nCell );
						}
					}
					
					anTds = _fnGetTdNodes( oSettings );
					for ( i=0, iLen=oSettings.aoData.length ; i<iLen ; i++ )
					{
						nTd = anTds[ ( i*oSettings.aoColumns.length) + (iCol*1) ];
						oSettings.aoData[i]._anHidden[iCol] = nTd;
						nTd.parentNode.removeChild( nTd );
					}
					
					oSettings.aoColumns[iCol].bVisible = false;
				}
				
				/* If there are any 'open' rows, then we need to alter the colspan for this col change */
				for ( i=0, iLen=oSettings.aoOpenRows.length ; i<iLen ; i++ )
				{
					oSettings.aoOpenRows[i].nTr.colSpan = _fnVisbleColumns( oSettings );
				}
				
				/* Do a redraw incase anything depending on the table columns needs it 
				 * (built-in: scrolling) 
				 */
				if ( typeof bRedraw == 'undefined' || bRedraw )
				{
					_fnAjustColumnSizing( oSettings );
					_fnDraw( oSettings );
				}
				
				_fnSaveState( oSettings );
			};
			
			/*
			 * Function: fnPageChange
			 * Purpose:  Change the pagination
			 * Returns:  -
			 * Inputs:   string:sAction - paging action to take: "first", "previous", "next" or "last"
			 *           bool:bRedraw - redraw the table or not - optional - default true
			 */
			this.fnPageChange = function ( sAction, bRedraw )
			{
				var oSettings = _fnSettingsFromNode( this[_oExt.iApiIndex] );
				_fnPageChange( oSettings, sAction );
				_fnCalculateEnd( oSettings );
				
				if ( typeof bRedraw == 'undefined' || bRedraw )
				{
					_fnDraw( oSettings );
				}
			};
			
			/*
			 * Function: fnDestroy
			 * Purpose:  Destructor for the DataTable
			 * Returns:  -
			 * Inputs:   -
			 */
			this.fnDestroy = function ( )
			{
				var oSettings = _fnSettingsFromNode( this[_oExt.iApiIndex] );
				var nOrig = oSettings.nTableWrapper.parentNode;
				var nBody = oSettings.nTBody;
				var i, iLen;
				
				/* Flag to note that the table is currently being destoryed - no action should be taken */
				oSettings.bDestroying = true;
				
				/* Blitz all DT events */
				$(oSettings.nTableWrapper).find('*').andSelf().unbind('.DT');
				
				/* Restore hidden columns */
				for ( i=0, iLen=oSettings.aoColumns.length ; i<iLen ; i++ )
				{
					if ( oSettings.aoColumns[i].bVisible === false )
					{
						this.fnSetColumnVis( i, true );
					}
				}
				
				/* If there is an 'empty' indicator row, remove it */
				$('tbody>tr>td.'+oSettings.oClasses.sRowEmpty, oSettings.nTable).parent().remove();
				
				/* When scrolling we had to break the table up - restore it */
				if ( oSettings.nTable != oSettings.nTHead.parentNode )
				{
					$('>thead', oSettings.nTable).remove();
					oSettings.nTable.appendChild( oSettings.nTHead );
				}
				
				if ( oSettings.nTFoot && oSettings.nTable != oSettings.nTFoot.parentNode )
				{
					$('>tfoot', oSettings.nTable).remove();
					oSettings.nTable.appendChild( oSettings.nTFoot );
				}
				
				/* Remove the DataTables generated nodes, events and classes */
				oSettings.nTable.parentNode.removeChild( oSettings.nTable );
				$(oSettings.nTableWrapper).remove();
				
				oSettings.aaSorting = [];
				oSettings.aaSortingFixed = [];
				_fnSortingClasses( oSettings );
				
				$(_fnGetTrNodes( oSettings )).removeClass( oSettings.asStripClasses.join(' ') );
				
				if ( !oSettings.bJUI )
				{
					$('th', oSettings.nTHead).removeClass( [ _oExt.oStdClasses.sSortable,
						_oExt.oStdClasses.sSortableAsc,
						_oExt.oStdClasses.sSortableDesc,
						_oExt.oStdClasses.sSortableNone ].join(' ')
					);
				}
				else
				{
					$('th', oSettings.nTHead).removeClass( [ _oExt.oStdClasses.sSortable,
						_oExt.oJUIClasses.sSortableAsc,
						_oExt.oJUIClasses.sSortableDesc,
						_oExt.oJUIClasses.sSortableNone ].join(' ')
					);
					$('th span', oSettings.nTHead).remove();
				}
				
				/* Add the TR elements back into the table in their original order */
				nOrig.appendChild( oSettings.nTable );
				for ( i=0, iLen=oSettings.aoData.length ; i<iLen ; i++ )
				{
					nBody.appendChild( oSettings.aoData[i].nTr );
				}
				
				/* Restore the width of the original table */
				oSettings.nTable.style.width = _fnStringToCss(oSettings.sDestroyWidth);
				
				/* If the were originally odd/even type classes - then we add them back here. Note
				 * this is not fool proof (for example if not all rows as odd/even classes - but 
				 * it's a good effort without getting carried away
				 */
				$('>tr:even', nBody).addClass( oSettings.asDestoryStrips[0] );
				$('>tr:odd', nBody).addClass( oSettings.asDestoryStrips[1] );
				
				/* Remove the settings object from the settings array */
				for ( i=0, iLen=_aoSettings.length ; i<iLen ; i++ )
				{
					if ( _aoSettings[i] == oSettings )
					{
						_aoSettings.splice( i, 1 );
					}
				}
				
				/* End it all */
				oSettings = null;
			};
			
			/*
			 * Function: fnAjustColumnSizing
			 * Purpose:  Update tale sizing based on content. This would most likely be used for scrolling
			 *   and will typically need a redraw after it.
			 * Returns:  -
			 * Inputs:   bool:bRedraw - redraw the table or not, you will typically want to - default true
			 */
			this.fnAdjustColumnSizing = function ( bRedraw )
			{
				var oSettings = _fnSettingsFromNode(this[_oExt.iApiIndex]);
				_fnAjustColumnSizing( oSettings );
				
				if ( typeof bRedraw == 'undefined' || bRedraw )
				{
					this.fnDraw( false );
				}
				else if ( oSettings.oScroll.sX !== "" || oSettings.oScroll.sY !== "" )
				{
					/* If not redrawing, but scrolling, we want to apply the new column sizes anyway */
					this.oApi._fnScrollDraw(oSettings);
				}
			};
			
			/*
			 * Plugin API functions
			 * 
			 * This call will add the functions which are defined in _oExt.oApi to the
			 * DataTables object, providing a rather nice way to allow plug-in API functions. Note that
			 * this is done here, so that API function can actually override the built in API functions if
			 * required for a particular purpose.
			 */
			
			/*
			 * Function: _fnExternApiFunc
			 * Purpose:  Create a wrapper function for exporting an internal func to an external API func
			 * Returns:  function: - wrapped function
			 * Inputs:   string:sFunc - API function name
			 */
			function _fnExternApiFunc (sFunc)
			{
				return function() {
						var aArgs = [_fnSettingsFromNode(this[_oExt.iApiIndex])].concat( 
							Array.prototype.slice.call(arguments) );
						return _oExt.oApi[sFunc].apply( this, aArgs );
					};
			}
			
			for ( var sFunc in _oExt.oApi )
			{
				if ( sFunc )
				{
					/*
					 * Function: anon
					 * Purpose:  Wrap the plug-in API functions in order to provide the settings as 1st arg 
					 *   and execute in this scope
					 * Returns:  -
					 * Inputs:   -
					 */
					this[sFunc] = _fnExternApiFunc(sFunc);
				}
			}
			
			
			
			/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
			 * Section - Local functions
			 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
			
			/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
			 * Section - Initalisation
			 */
			
			/*
			 * Function: _fnInitalise
			 * Purpose:  Draw the table for the first time, adding all required features
			 * Returns:  -
			 * Inputs:   object:oSettings - dataTables settings object
			 */
			function _fnInitalise ( oSettings )
			{
				var i, iLen;
				
				/* Ensure that the table data is fully initialised */
				if ( oSettings.bInitialised === false )
				{
					setTimeout( function(){ _fnInitalise( oSettings ); }, 200 );
					return;
				}
				
				/* Show the display HTML options */
				_fnAddOptionsHtml( oSettings );
				
				/* Draw the headers for the table */
				_fnDrawHead( oSettings );
				
				/* Okay to show that something is going on now */
				_fnProcessingDisplay( oSettings, true );
				
				/* Calculate sizes for columns */
				if ( oSettings.oFeatures.bAutoWidth )
				{
					_fnCalculateColumnWidths( oSettings );
				}
				
				for ( i=0, iLen=oSettings.aoColumns.length ; i<iLen ; i++ )
				{
					if ( oSettings.aoColumns[i].sWidth !== null )
					{
						oSettings.aoColumns[i].nTh.style.width = _fnStringToCss( oSettings.aoColumns[i].sWidth );
					}
				}
				
				/* If there is default sorting required - let's do it. The sort function will do the
				 * drawing for us. Otherwise we draw the table regardless of the Ajax source - this allows
				 * the table to look initialised for Ajax sourcing data (show 'loading' message possibly)
				 */
				if ( oSettings.oFeatures.bSort )
				{
					_fnSort( oSettings );
				}
				else
				{
					oSettings.aiDisplay = oSettings.aiDisplayMaster.slice();
					_fnCalculateEnd( oSettings );
					_fnDraw( oSettings );
				}
				
				/* if there is an ajax source load the data */
				if ( oSettings.sAjaxSource !== null && !oSettings.oFeatures.bServerSide )
				{
					oSettings.fnServerData.call( oSettings.oInstance, oSettings.sAjaxSource, [], function(json) {
						/* Got the data - add it to the table */
						for ( i=0 ; i<json.aaData.length ; i++ )
						{
							_fnAddData( oSettings, json.aaData[i] );
						}
						
						/* Reset the init display for cookie saving. We've already done a filter, and
						 * therefore cleared it before. So we need to make it appear 'fresh'
						 */
						oSettings.iInitDisplayStart = oSettings._iDisplayStart;
						
						if ( oSettings.oFeatures.bSort )
						{
							_fnSort( oSettings );
						}
						else
						{
							oSettings.aiDisplay = oSettings.aiDisplayMaster.slice();
							_fnCalculateEnd( oSettings );
							_fnDraw( oSettings );
						}
						
						_fnProcessingDisplay( oSettings, false );
						_fnInitComplete( oSettings, json );
					} );
					return;
				}
				
				/* Server-side processing initialisation complete is done at the end of _fnDraw */
				if ( !oSettings.oFeatures.bServerSide )
				{
					_fnProcessingDisplay( oSettings, false );
					_fnInitComplete( oSettings );
				}
			}
			
			/*
			 * Function: _fnInitalise
			 * Purpose:  Draw the table for the first time, adding all required features
			 * Returns:  -
			 * Inputs:   object:oSettings - dataTables settings object
			 */
			function _fnInitComplete ( oSettings, json )
			{
				oSettings._bInitComplete = true;
				if ( typeof oSettings.fnInitComplete == 'function' )
				{
					if ( typeof json != 'undefined' )
					{
						oSettings.fnInitComplete.call( oSettings.oInstance, oSettings, json );
					}
					else
					{
						oSettings.fnInitComplete.call( oSettings.oInstance, oSettings );
					}
				}
			}
			
			/*
			 * Function: _fnLanguageProcess
			 * Purpose:  Copy language variables from remote object to a local one
			 * Returns:  -
			 * Inputs:   object:oSettings - dataTables settings object
			 *           object:oLanguage - Language information
			 *           bool:bInit - init once complete
			 */
			function _fnLanguageProcess( oSettings, oLanguage, bInit )
			{
				_fnMap( oSettings.oLanguage, oLanguage, 'sProcessing' );
				_fnMap( oSettings.oLanguage, oLanguage, 'sLengthMenu' );
				_fnMap( oSettings.oLanguage, oLanguage, 'sEmptyTable' );
				_fnMap( oSettings.oLanguage, oLanguage, 'sZeroRecords' );
				_fnMap( oSettings.oLanguage, oLanguage, 'sInfo' );
				_fnMap( oSettings.oLanguage, oLanguage, 'sInfoEmpty' );
				_fnMap( oSettings.oLanguage, oLanguage, 'sInfoFiltered' );
				_fnMap( oSettings.oLanguage, oLanguage, 'sInfoPostFix' );
				_fnMap( oSettings.oLanguage, oLanguage, 'sSearch' );
				
				if ( typeof oLanguage.oPaginate != 'undefined' )
				{
					_fnMap( oSettings.oLanguage.oPaginate, oLanguage.oPaginate, 'sFirst' );
					_fnMap( oSettings.oLanguage.oPaginate, oLanguage.oPaginate, 'sPrevious' );
					_fnMap( oSettings.oLanguage.oPaginate, oLanguage.oPaginate, 'sNext' );
					_fnMap( oSettings.oLanguage.oPaginate, oLanguage.oPaginate, 'sLast' );
				}
				
				/* Backwards compatibility - if there is no sEmptyTable given, then use the same as
				 * sZeroRecords - assuming that is given.
				 */
				if ( typeof oLanguage.sEmptyTable == 'undefined' && 
					 typeof oLanguage.sZeroRecords != 'undefined' )
				{
					_fnMap( oSettings.oLanguage, oLanguage, 'sZeroRecords', 'sEmptyTable' );
				}
				
				if ( bInit )
				{
					_fnInitalise( oSettings );
				}
			}
			
			/*
			 * Function: _fnAddColumn
			 * Purpose:  Add a column to the list used for the table with default values
			 * Returns:  -
			 * Inputs:   object:oSettings - dataTables settings object
			 *           node:nTh - the th element for this column
			 */
			function _fnAddColumn( oSettings, nTh )
			{
				oSettings.aoColumns[ oSettings.aoColumns.length++ ] = {
					"sType": null,
					"_bAutoType": true,
					"bVisible": true,
					"bSearchable": true,
					"bSortable": true,
					"asSorting": [ 'asc', 'desc' ],
					"sSortingClass": oSettings.oClasses.sSortable,
					"sSortingClassJUI": oSettings.oClasses.sSortJUI,
					"sTitle": nTh ? nTh.innerHTML : '',
					"sName": '',
					"sWidth": null,
					"sWidthOrig": null,
					"sClass": null,
					"fnRender": null,
					"bUseRendered": true,
					"iDataSort": oSettings.aoColumns.length-1,
					"sSortDataType": 'std',
					"nTh": nTh ? nTh : document.createElement('th'),
					"nTf": null,
					"anThExtra": [],
					"anTfExtra": []
				};
				
				var iCol = oSettings.aoColumns.length-1;
				var oCol = oSettings.aoColumns[ iCol ];
				
				/* Add a column specific filter */
				if ( typeof oSettings.aoPreSearchCols[ iCol ] == 'undefined' ||
					 oSettings.aoPreSearchCols[ iCol ] === null )
				{
					oSettings.aoPreSearchCols[ iCol ] = {
						"sSearch": "",
						"bRegex": false,
						"bSmart": true
					};
				}
				else
				{
					/* Don't require that the user must specify bRegex and / or bSmart */
					if ( typeof oSettings.aoPreSearchCols[ iCol ].bRegex == 'undefined' )
					{
						oSettings.aoPreSearchCols[ iCol ].bRegex = true;
					}
					
					if ( typeof oSettings.aoPreSearchCols[ iCol ].bSmart == 'undefined' )
					{
						oSettings.aoPreSearchCols[ iCol ].bSmart = true;
					}
				} 
				
				/* Use the column options function to initialise classes etc */
				_fnColumnOptions( oSettings, iCol, null );
			}
			
			/*
			 * Function: _fnColumnOptions
			 * Purpose:  Apply options for a column
			 * Returns:  -
			 * Inputs:   object:oSettings - dataTables settings object
			 *           int:iCol - column index to consider
			 *           object:oOptions - object with sType, bVisible and bSearchable
			 */
			function _fnColumnOptions( oSettings, iCol, oOptions )
			{
				var oCol = oSettings.aoColumns[ iCol ];
				
				/* User specified column options */
				if ( typeof oOptions != 'undefined' && oOptions !== null )
				{
					if ( typeof oOptions.sType != 'undefined' )
					{
						oCol.sType = oOptions.sType;
						oCol._bAutoType = false;
					}
					
					_fnMap( oCol, oOptions, "bVisible" );
					_fnMap( oCol, oOptions, "bSearchable" );
					_fnMap( oCol, oOptions, "bSortable" );
					_fnMap( oCol, oOptions, "sTitle" );
					_fnMap( oCol, oOptions, "sName" );
					_fnMap( oCol, oOptions, "sWidth" );
					_fnMap( oCol, oOptions, "sWidth", "sWidthOrig" );
					_fnMap( oCol, oOptions, "sClass" );
					_fnMap( oCol, oOptions, "fnRender" );
					_fnMap( oCol, oOptions, "bUseRendered" );
					_fnMap( oCol, oOptions, "iDataSort" );
					_fnMap( oCol, oOptions, "asSorting" );
					_fnMap( oCol, oOptions, "sSortDataType" );
				}
				
				/* Feature sorting overrides column specific when off */
				if ( !oSettings.oFeatures.bSort )
				{
					oCol.bSortable = false;
				}
				
				/* Check that the class assignment is correct for sorting */
				if ( !oCol.bSortable ||
						 ($.inArray('asc', oCol.asSorting) == -1 && $.inArray('desc', oCol.asSorting) == -1) )
				{
					oCol.sSortingClass = oSettings.oClasses.sSortableNone;
					oCol.sSortingClassJUI = "";
				}
				else if ( $.inArray('asc', oCol.asSorting) != -1 && $.inArray('desc', oCol.asSorting) == -1 )
				{
					oCol.sSortingClass = oSettings.oClasses.sSortableAsc;
					oCol.sSortingClassJUI = oSettings.oClasses.sSortJUIAscAllowed;
				}
				else if ( $.inArray('asc', oCol.asSorting) == -1 && $.inArray('desc', oCol.asSorting) != -1 )
				{
					oCol.sSortingClass = oSettings.oClasses.sSortableDesc;
					oCol.sSortingClassJUI = oSettings.oClasses.sSortJUIDescAllowed;
				}
			}
			
			/*
			 * Function: _fnAddData
			 * Purpose:  Add a data array to the table, creating DOM node etc
			 * Returns:  int: - >=0 if successful (index of new aoData entry), -1 if failed
			 * Inputs:   object:oSettings - dataTables settings object
			 *           array:aData - data array to be added
			 * Notes:    There are two basic methods for DataTables to get data to display - a JS array
			 *   (which is dealt with by this function), and the DOM, which has it's own optimised
			 *   function (_fnGatherData). Be careful to make the same changes here as there and vice-versa
			 */
			function _fnAddData ( oSettings, aDataSupplied )
			{
				/* Sanity check the length of the new array */
				if ( aDataSupplied.length != oSettings.aoColumns.length &&
					oSettings.iDrawError != oSettings.iDraw )
				{
					_fnLog( oSettings, 0, "Added data (size "+aDataSupplied.length+") does not match known "+
						"number of columns ("+oSettings.aoColumns.length+")" );
					oSettings.iDrawError = oSettings.iDraw;
					return -1;
				}
				
				
				/* Create the object for storing information about this new row */
				var aData = aDataSupplied.slice();
				var iThisIndex = oSettings.aoData.length;
				oSettings.aoData.push( {
					"nTr": document.createElement('tr'),
					"_iId": oSettings.iNextId++,
					"_aData": aData,
					"_anHidden": [],
					"_sRowStripe": ''
				} );
				
				/* Create the cells */
				var nTd, sThisType;
				for ( var i=0 ; i<aData.length ; i++ )
				{
					nTd = document.createElement('td');
					
					/* Allow null data (from a data array) - simply deal with it as a blank string */
					if ( aData[i] === null )
					{
						aData[i] = '';
					}
					
					if ( typeof oSettings.aoColumns[i].fnRender == 'function' )
					{
						var sRendered = oSettings.aoColumns[i].fnRender( {
								"iDataRow": iThisIndex,
								"iDataColumn": i,
								"aData": aData,
								"oSettings": oSettings
							} );
						nTd.innerHTML = sRendered;
						if ( oSettings.aoColumns[i].bUseRendered )
						{
							/* Use the rendered data for filtering/sorting */
							oSettings.aoData[iThisIndex]._aData[i] = sRendered;
						}
					}
					else
					{
						nTd.innerHTML = aData[i];
					}
					
					/* Cast everything as a string - so we can treat everything equally when sorting */
					if ( typeof aData[i] != 'string' )
					{
						aData[i] += "";
					}
					aData[i] = $.trim(aData[i]);
					
					/* Add user defined class */
					if ( oSettings.aoColumns[i].sClass !== null )
					{
						nTd.className = oSettings.aoColumns[i].sClass;
					}
					
					/* See if we should auto-detect the column type */
					if ( oSettings.aoColumns[i]._bAutoType && oSettings.aoColumns[i].sType != 'string' )
					{
						/* Attempt to auto detect the type - same as _fnGatherData() */
						sThisType = _fnDetectType( oSettings.aoData[iThisIndex]._aData[i] );
						if ( oSettings.aoColumns[i].sType === null )
						{
							oSettings.aoColumns[i].sType = sThisType;
						}
						else if ( oSettings.aoColumns[i].sType != sThisType )
						{
							/* String is always the 'fallback' option */
							oSettings.aoColumns[i].sType = 'string';
						}
					}
						
					if ( oSettings.aoColumns[i].bVisible )
					{
						oSettings.aoData[iThisIndex].nTr.appendChild( nTd );
						oSettings.aoData[iThisIndex]._anHidden[i] = null;
					}
					else
					{
						oSettings.aoData[iThisIndex]._anHidden[i] = nTd;
					}
				}
				
				/* Add to the display array */
				oSettings.aiDisplayMaster.push( iThisIndex );
				return iThisIndex;
			}
			
			/*
			 * Function: _fnGatherData
			 * Purpose:  Read in the data from the target table from the DOM
			 * Returns:  -
			 * Inputs:   object:oSettings - dataTables settings object
			 * Notes:    This is a optimised version of _fnAddData (more or less) for reading information
			 *   from the DOM. The basic actions must be identical in the two functions.
			 */
			function _fnGatherData( oSettings )
			{
				var iLoop, i, iLen, j, jLen, jInner,
					nTds, nTrs, nTd, aLocalData, iThisIndex,
					iRow, iRows, iColumn, iColumns;
				
				/*
				 * Process by row first
				 * Add the data object for the whole table - storing the tr node. Note - no point in getting
				 * DOM based data if we are going to go and replace it with Ajax source data.
				 */
				if ( oSettings.sAjaxSource === null )
				{
					nTrs = oSettings.nTBody.childNodes;
					for ( i=0, iLen=nTrs.length ; i<iLen ; i++ )
					{
						if ( nTrs[i].nodeName.toUpperCase() == "TR" )
						{
							iThisIndex = oSettings.aoData.length;
							oSettings.aoData.push( {
								"nTr": nTrs[i],
								"_iId": oSettings.iNextId++,
								"_aData": [],
								"_anHidden": [],
								"_sRowStripe": ''
							} );
							
							oSettings.aiDisplayMaster.push( iThisIndex );
							
							aLocalData = oSettings.aoData[iThisIndex]._aData;
							nTds = nTrs[i].childNodes;
							jInner = 0;
							
							for ( j=0, jLen=nTds.length ; j<jLen ; j++ )
							{
								if ( nTds[j].nodeName.toUpperCase() == "TD" )
								{
									aLocalData[jInner] = $.trim(nTds[j].innerHTML);
									jInner++;
								}
							}
						}
					}
				}
				
				/* Gather in the TD elements of the Table - note that this is basically the same as
				 * fnGetTdNodes, but that function takes account of hidden columns, which we haven't yet
				 * setup!
				 */
				nTrs = _fnGetTrNodes( oSettings );
				nTds = [];
				for ( i=0, iLen=nTrs.length ; i<iLen ; i++ )
				{
					for ( j=0, jLen=nTrs[i].childNodes.length ; j<jLen ; j++ )
					{
						nTd = nTrs[i].childNodes[j];
						if ( nTd.nodeName.toUpperCase() == "TD" )
						{
							nTds.push( nTd );
						}
					}
				}
				
				/* Sanity check */
				if ( nTds.length != nTrs.length * oSettings.aoColumns.length )
				{
					_fnLog( oSettings, 1, "Unexpected number of TD elements. Expected "+
						(nTrs.length * oSettings.aoColumns.length)+" and got "+nTds.length+". DataTables does "+
						"not support rowspan / colspan in the table body, and there must be one cell for each "+
						"row/column combination." );
				}
				
				/* Now process by column */
				for ( iColumn=0, iColumns=oSettings.aoColumns.length ; iColumn<iColumns ; iColumn++ )
				{
					/* Get the title of the column - unless there is a user set one */
					if ( oSettings.aoColumns[iColumn].sTitle === null )
					{
						oSettings.aoColumns[iColumn].sTitle = oSettings.aoColumns[iColumn].nTh.innerHTML;
					}
					
					var
						bAutoType = oSettings.aoColumns[iColumn]._bAutoType,
						bRender = typeof oSettings.aoColumns[iColumn].fnRender == 'function',
						bClass = oSettings.aoColumns[iColumn].sClass !== null,
						bVisible = oSettings.aoColumns[iColumn].bVisible,
						nCell, sThisType, sRendered;
					
					/* A single loop to rule them all (and be more efficient) */
					if ( bAutoType || bRender || bClass || !bVisible )
					{
						for ( iRow=0, iRows=oSettings.aoData.length ; iRow<iRows ; iRow++ )
						{
							nCell = nTds[ (iRow*iColumns) + iColumn ];
							
							/* Type detection */
							if ( bAutoType )
							{
								if ( oSettings.aoColumns[iColumn].sType != 'string' )
								{
									sThisType = _fnDetectType( oSettings.aoData[iRow]._aData[iColumn] );
									if ( oSettings.aoColumns[iColumn].sType === null )
									{
										oSettings.aoColumns[iColumn].sType = sThisType;
									}
									else if ( oSettings.aoColumns[iColumn].sType != sThisType )
									{
										/* String is always the 'fallback' option */
										oSettings.aoColumns[iColumn].sType = 'string';
									}
								}
							}
							
							/* Rendering */
							if ( bRender )
							{
								sRendered = oSettings.aoColumns[iColumn].fnRender( {
										"iDataRow": iRow,
										"iDataColumn": iColumn,
										"aData": oSettings.aoData[iRow]._aData,
										"oSettings": oSettings
									} );
								nCell.innerHTML = sRendered;
								if ( oSettings.aoColumns[iColumn].bUseRendered )
								{
									/* Use the rendered data for filtering/sorting */
									oSettings.aoData[iRow]._aData[iColumn] = sRendered;
								}
							}
							
							/* Classes */
							if ( bClass )
							{
								nCell.className += ' '+oSettings.aoColumns[iColumn].sClass;
							}
							
							/* Column visability */
							if ( !bVisible )
							{
								oSettings.aoData[iRow]._anHidden[iColumn] = nCell;
								nCell.parentNode.removeChild( nCell );
							}
							else
							{
								oSettings.aoData[iRow]._anHidden[iColumn] = null;
							}
						}
					}
				}
			}
			
			
			
			/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
			 * Section - Drawing functions
			 */
			
			/*
			 * Function: _fnDrawHead
			 * Purpose:  Create the HTML header for the table
			 * Returns:  -
			 * Inputs:   object:oSettings - dataTables settings object
			 */
			function _fnDrawHead( oSettings )
			{
				var i, nTh, iLen, j, jLen;
				var anTr = oSettings.nTHead.getElementsByTagName('tr');
				var iThs = oSettings.nTHead.getElementsByTagName('th').length;
				var iCorrector = 0;
				var jqChildren;
				
				/* If there is a header in place - then use it - otherwise it's going to get nuked... */
				if ( iThs !== 0 )
				{
					/* We've got a thead from the DOM, so remove hidden columns and apply width to vis cols */
					for ( i=0, iLen=oSettings.aoColumns.length ; i<iLen ; i++ )
					{
						nTh = oSettings.aoColumns[i].nTh;
						
						if ( oSettings.aoColumns[i].sClass !== null )
						{
							$(nTh).addClass( oSettings.aoColumns[i].sClass );
						}
						
						/* Cache and remove (if needed) any extra elements for this column in the header */
						for ( j=1, jLen=anTr.length ; j<jLen ; j++ )
						{
							jqChildren = $(anTr[j]).children();
							oSettings.aoColumns[i].anThExtra.push( jqChildren[i-iCorrector] );
							if ( !oSettings.aoColumns[i].bVisible )
							{
								anTr[j].removeChild( jqChildren[i-iCorrector] );
							}
						}
						
						if ( oSettings.aoColumns[i].bVisible )
						{
							/* Set the title of the column if it is user defined (not what was auto detected) */
							if ( oSettings.aoColumns[i].sTitle != nTh.innerHTML )
							{
								nTh.innerHTML = oSettings.aoColumns[i].sTitle;
							}
						}
						else
						{
							nTh.parentNode.removeChild( nTh );
							iCorrector++;
						}
					}
				}
				else
				{
					/* We don't have a header in the DOM - so we are going to have to create one */
					var nTr = document.createElement( "tr" );
					
					for ( i=0, iLen=oSettings.aoColumns.length ; i<iLen ; i++ )
					{
						nTh = oSettings.aoColumns[i].nTh;
						nTh.innerHTML = oSettings.aoColumns[i].sTitle;
						
						if ( oSettings.aoColumns[i].sClass !== null )
						{
							$(nTh).addClass( oSettings.aoColumns[i].sClass );
						}
						
						if ( oSettings.aoColumns[i].bVisible )
						{
							nTr.appendChild( nTh );
						}
					}
					$(oSettings.nTHead).html( '' )[0].appendChild( nTr );
				}
				
				/* Add the extra markup needed by jQuery UI's themes */
				if ( oSettings.bJUI )
				{
					for ( i=0, iLen=oSettings.aoColumns.length ; i<iLen ; i++ )
					{
						nTh = oSettings.aoColumns[i].nTh;
						
						var nDiv = document.createElement('div');
						nDiv.className = oSettings.oClasses.sSortJUIWrapper;
						$(nTh).contents().appendTo(nDiv);
						
						nDiv.appendChild( document.createElement('span') );
						nTh.appendChild( nDiv );
					}
				}
				
				/* Add sort listener */
				var fnNoSelect = function (e) {
					this.onselectstart = function() { return false; };
					return false;
				};
				
				if ( oSettings.oFeatures.bSort )
				{
					for ( i=0 ; i<oSettings.aoColumns.length ; i++ )
					{
						if ( oSettings.aoColumns[i].bSortable !== false )
						{
							_fnSortAttachListener( oSettings, oSettings.aoColumns[i].nTh, i );
							
							/* Take the brutal approach to cancelling text selection in header */
							$(oSettings.aoColumns[i].nTh).bind( 'mousedown.DT', fnNoSelect );
						}
						else
						{
							$(oSettings.aoColumns[i].nTh).addClass( oSettings.oClasses.sSortableNone );
						}
					}
				}
				
				/* Cache the footer elements */
				if ( oSettings.nTFoot !== null )
				{
					iCorrector = 0;
					anTr = oSettings.nTFoot.getElementsByTagName('tr');
					var nTfs = anTr[0].getElementsByTagName('th');
					
					for ( i=0, iLen=nTfs.length ; i<iLen ; i++ )
					{
						if ( typeof oSettings.aoColumns[i] != 'undefined' )
						{
							oSettings.aoColumns[i].nTf = nTfs[i-iCorrector];
							
							if ( oSettings.oClasses.sFooterTH !== "" )
							{
								oSettings.aoColumns[i].nTf.className += " "+oSettings.oClasses.sFooterTH;
							}
							
							/* Deal with any extra elements for this column from the footer */
							for ( j=1, jLen=anTr.length ; j<jLen ; j++ )
							{
								jqChildren = $(anTr[j]).children();
								oSettings.aoColumns[i].anTfExtra.push( jqChildren[i-iCorrector] );
								if ( !oSettings.aoColumns[i].bVisible )
								{
									anTr[j].removeChild( jqChildren[i-iCorrector] );
								}
							}
							
							if ( !oSettings.aoColumns[i].bVisible )
							{
								nTfs[i-iCorrector].parentNode.removeChild( nTfs[i-iCorrector] );
								iCorrector++;
							}
						}
					}
				}
			}
			
			/*
			 * Function: _fnDraw
			 * Purpose:  Insert the required TR nodes into the table for display
			 * Returns:  -
			 * Inputs:   object:oSettings - dataTables settings object
			 */
			function _fnDraw( oSettings )
			{
				var i, iLen;
				var anRows = [];
				var iRowCount = 0;
				var bRowError = false;
				var iStrips = oSettings.asStripClasses.length;
				var iOpenRows = oSettings.aoOpenRows.length;
				
				oSettings.bDrawing = true;
				
				/* Check and see if we have an initial draw position from state saving */
				if ( typeof oSettings.iInitDisplayStart != 'undefined' && oSettings.iInitDisplayStart != -1 )
				{
					if ( oSettings.oFeatures.bServerSide )
					{
						oSettings._iDisplayStart = oSettings.iInitDisplayStart;
					}
					else
					{
						oSettings._iDisplayStart = (oSettings.iInitDisplayStart >= oSettings.fnRecordsDisplay()) ?
							0 : oSettings.iInitDisplayStart;
					}
					oSettings.iInitDisplayStart = -1;
					_fnCalculateEnd( oSettings );
				}
				
				/* If we are dealing with Ajax - do it here */
				if ( !oSettings.bDestroying && oSettings.oFeatures.bServerSide && 
					 !_fnAjaxUpdate( oSettings ) )
				{
					return;
				}
				else if ( !oSettings.oFeatures.bServerSide )
				{
					oSettings.iDraw++;
				}
				
				if ( oSettings.aiDisplay.length !== 0 )
				{
					var iStart = oSettings._iDisplayStart;
					var iEnd = oSettings._iDisplayEnd;
					
					if ( oSettings.oFeatures.bServerSide )
					{
						iStart = 0;
						iEnd = oSettings.aoData.length;
					}
					
					for ( var j=iStart ; j<iEnd ; j++ )
					{
						var aoData = oSettings.aoData[ oSettings.aiDisplay[j] ];
						var nRow = aoData.nTr;
						
						/* Remove the old stripping classes and then add the new one */
						if ( iStrips !== 0 )
						{
							var sStrip = oSettings.asStripClasses[ iRowCount % iStrips ];
							if ( aoData._sRowStripe != sStrip )
							{
								$(nRow).removeClass( aoData._sRowStripe ).addClass( sStrip );
								aoData._sRowStripe = sStrip;
							}
						}
						
						/* Custom row callback function - might want to manipule the row */
						if ( typeof oSettings.fnRowCallback == "function" )
						{
							nRow = oSettings.fnRowCallback.call( oSettings.oInstance, nRow, 
								oSettings.aoData[ oSettings.aiDisplay[j] ]._aData, iRowCount, j );
							if ( !nRow && !bRowError )
							{
								_fnLog( oSettings, 0, "A node was not returned by fnRowCallback" );
								bRowError = true;
							}
						}
						
						anRows.push( nRow );
						iRowCount++;
						
						/* If there is an open row - and it is attached to this parent - attach it on redraw */
						if ( iOpenRows !== 0 )
						{
							for ( var k=0 ; k<iOpenRows ; k++ )
							{
								if ( nRow == oSettings.aoOpenRows[k].nParent )
								{
									anRows.push( oSettings.aoOpenRows[k].nTr );
								}
							}
						}
					}
				}
				else
				{
					/* Table is empty - create a row with an empty message in it */
					anRows[ 0 ] = document.createElement( 'tr' );
					
					if ( typeof oSettings.asStripClasses[0] != 'undefined' )
					{
						anRows[ 0 ].className = oSettings.asStripClasses[0];
					}
					
					var nTd = document.createElement( 'td' );
					nTd.setAttribute( 'valign', "top" );
					nTd.colSpan = _fnVisbleColumns( oSettings );
					nTd.className = oSettings.oClasses.sRowEmpty;
					if ( typeof oSettings.oLanguage.sEmptyTable != 'undefined' &&
						 oSettings.fnRecordsTotal() === 0 )
					{
						nTd.innerHTML = oSettings.oLanguage.sEmptyTable;
					}
					else
					{
						nTd.innerHTML = oSettings.oLanguage.sZeroRecords.replace(
							'_MAX_', oSettings.fnFormatNumber(oSettings.fnRecordsTotal()) );
					}
					
					anRows[ iRowCount ].appendChild( nTd );
				}
				
				/* Callback the header and footer custom funcation if there is one */
				if ( typeof oSettings.fnHeaderCallback == 'function' )
				{
					oSettings.fnHeaderCallback.call( oSettings.oInstance, $('>tr', oSettings.nTHead)[0], 
						_fnGetDataMaster( oSettings ), oSettings._iDisplayStart, oSettings.fnDisplayEnd(),
						oSettings.aiDisplay );
				}
				
				if ( typeof oSettings.fnFooterCallback == 'function' )
				{
					oSettings.fnFooterCallback.call( oSettings.oInstance, $('>tr', oSettings.nTFoot)[0], 
						_fnGetDataMaster( oSettings ), oSettings._iDisplayStart, oSettings.fnDisplayEnd(),
						oSettings.aiDisplay );
				}
				
				/* 
				 * Need to remove any old row from the display - note we can't just empty the tbody using
				 * $().html('') since this will unbind the jQuery event handlers (even although the node 
				 * still exists!) - equally we can't use innerHTML, since IE throws an exception.
				 */
				var
					nAddFrag = document.createDocumentFragment(),
					nRemoveFrag = document.createDocumentFragment(),
					nBodyPar, nTrs;
				
				if ( oSettings.nTBody )
				{
					nBodyPar = oSettings.nTBody.parentNode;
					nRemoveFrag.appendChild( oSettings.nTBody );
					
					/* When doing infinite scrolling, only remove child rows when sorting, filtering or start
					 * up. When not infinite scroll, always do it.
					 */
					if ( !oSettings.oScroll.bInfinite || !oSettings._bInitComplete ||
						oSettings.bSorted || oSettings.bFiltered )
					{
						nTrs = oSettings.nTBody.childNodes;
						for ( i=nTrs.length-1 ; i>=0 ; i-- )
						{
							nTrs[i].parentNode.removeChild( nTrs[i] );
						}
					}
					
					/* Put the draw table into the dom */
					for ( i=0, iLen=anRows.length ; i<iLen ; i++ )
					{
						nAddFrag.appendChild( anRows[i] );
					}
					
					oSettings.nTBody.appendChild( nAddFrag );
					if ( nBodyPar !== null )
					{
						nBodyPar.appendChild( oSettings.nTBody );
					}
				}
				
				/* Call all required callback functions for the end of a draw */
				for ( i=oSettings.aoDrawCallback.length-1 ; i>=0 ; i-- )
				{
					oSettings.aoDrawCallback[i].fn.call( oSettings.oInstance, oSettings );
				}
				
				/* Draw is complete, sorting and filtering must be as well */
				oSettings.bSorted = false;
				oSettings.bFiltered = false;
				oSettings.bDrawing = false;
				
				if ( oSettings.oFeatures.bServerSide )
				{
					_fnProcessingDisplay( oSettings, false );
					if ( typeof oSettings._bInitComplete == 'undefined' )
					{
						_fnInitComplete( oSettings );
					}
				}
			}
			
			/*
			 * Function: _fnReDraw
			 * Purpose:  Redraw the table - taking account of the various features which are enabled
			 * Returns:  -
			 * Inputs:   object:oSettings - dataTables settings object
			 */
			function _fnReDraw( oSettings )
			{
				if ( oSettings.oFeatures.bSort )
				{
					/* Sorting will refilter and draw for us */
					_fnSort( oSettings, oSettings.oPreviousSearch );
				}
				else if ( oSettings.oFeatures.bFilter )
				{
					/* Filtering will redraw for us */
					_fnFilterComplete( oSettings, oSettings.oPreviousSearch );
				}
				else
				{
					_fnCalculateEnd( oSettings );
					_fnDraw( oSettings );
				}
			}
			
			/*
			 * Function: _fnAjaxUpdate
			 * Purpose:  Update the table using an Ajax call
			 * Returns:  bool: block the table drawing or not
			 * Inputs:   object:oSettings - dataTables settings object
			 */
			function _fnAjaxUpdate( oSettings )
			{
				if ( oSettings.bAjaxDataGet )
				{
					_fnProcessingDisplay( oSettings, true );
					var iColumns = oSettings.aoColumns.length;
					var aoData = [];
					var i;
					
					/* Paging and general */
					oSettings.iDraw++;
					aoData.push( { "name": "sEcho",          "value": oSettings.iDraw } );
					aoData.push( { "name": "iColumns",       "value": iColumns } );
					aoData.push( { "name": "sColumns",       "value": _fnColumnOrdering(oSettings) } );
					aoData.push( { "name": "iDisplayStart",  "value": oSettings._iDisplayStart } );
					aoData.push( { "name": "iDisplayLength", "value": oSettings.oFeatures.bPaginate !== false ?
						oSettings._iDisplayLength : -1 } );
					
					/* Filtering */
					if ( oSettings.oFeatures.bFilter !== false )
					{
						aoData.push( { "name": "sSearch", "value": oSettings.oPreviousSearch.sSearch } );
						aoData.push( { "name": "bRegex",  "value": oSettings.oPreviousSearch.bRegex } );
						for ( i=0 ; i<iColumns ; i++ )
						{
							aoData.push( { "name": "sSearch_"+i,     "value": oSettings.aoPreSearchCols[i].sSearch } );
							aoData.push( { "name": "bRegex_"+i,      "value": oSettings.aoPreSearchCols[i].bRegex } );
							aoData.push( { "name": "bSearchable_"+i, "value": oSettings.aoColumns[i].bSearchable } );
						}
					}
					
					/* Sorting */
					if ( oSettings.oFeatures.bSort !== false )
					{
						var iFixed = oSettings.aaSortingFixed !== null ? oSettings.aaSortingFixed.length : 0;
						var iUser = oSettings.aaSorting.length;
						aoData.push( { "name": "iSortingCols",   "value": iFixed+iUser } );
						for ( i=0 ; i<iFixed ; i++ )
						{
							aoData.push( { "name": "iSortCol_"+i,  "value": oSettings.aaSortingFixed[i][0] } );
							aoData.push( { "name": "sSortDir_"+i,  "value": oSettings.aaSortingFixed[i][1] } );
						}
						
						for ( i=0 ; i<iUser ; i++ )
						{
							aoData.push( { "name": "iSortCol_"+(i+iFixed),  "value": oSettings.aaSorting[i][0] } );
							aoData.push( { "name": "sSortDir_"+(i+iFixed),  "value": oSettings.aaSorting[i][1] } );
						}
						
						for ( i=0 ; i<iColumns ; i++ )
						{
							aoData.push( { "name": "bSortable_"+i,  "value": oSettings.aoColumns[i].bSortable } );
						}
					}
					
					oSettings.fnServerData.call( oSettings.oInstance, oSettings.sAjaxSource, aoData,
						function(json) {
							_fnAjaxUpdateDraw( oSettings, json );
						} );
					return false;
				}
				else
				{
					return true;
				}
			}
			
			/*
			 * Function: _fnAjaxUpdateDraw
			 * Purpose:  Data the data from the server (nuking the old) and redraw the table
			 * Returns:  -
			 * Inputs:   object:oSettings - dataTables settings object
			 *           object:json - json data return from the server.
			 *             The following must be defined:
			 *               iTotalRecords, iTotalDisplayRecords, aaData
			 *             The following may be defined:
			 *               sColumns
			 */
			function _fnAjaxUpdateDraw ( oSettings, json )
			{
				if ( typeof json.sEcho != 'undefined' )
				{
					/* Protect against old returns over-writing a new one. Possible when you get
					 * very fast interaction, and later queires are completed much faster
					 */
					if ( json.sEcho*1 < oSettings.iDraw )
					{
						return;
					}
					else
					{
						oSettings.iDraw = json.sEcho * 1;
					}
				}
				
				if ( !oSettings.oScroll.bInfinite ||
					   (oSettings.oScroll.bInfinite && (oSettings.bSorted || oSettings.bFiltered)) )
				{
					_fnClearTable( oSettings );
				}
				oSettings._iRecordsTotal = json.iTotalRecords;
				oSettings._iRecordsDisplay = json.iTotalDisplayRecords;
				
				/* Determine if reordering is required */
				var sOrdering = _fnColumnOrdering(oSettings);
				var bReOrder = (typeof json.sColumns != 'undefined' && sOrdering !== "" && json.sColumns != sOrdering );
				if ( bReOrder )
				{
					var aiIndex = _fnReOrderIndex( oSettings, json.sColumns );
				}
				
				for ( var i=0, iLen=json.aaData.length ; i<iLen ; i++ )
				{
					if ( bReOrder )
					{
						/* If we need to re-order, then create a new array with the correct order and add it */
						var aData = [];
						for ( var j=0, jLen=oSettings.aoColumns.length ; j<jLen ; j++ )
						{
							aData.push( json.aaData[i][ aiIndex[j] ] );
						}
						_fnAddData( oSettings, aData );
					}
					else
					{
						/* No re-order required, sever got it "right" - just straight add */
						_fnAddData( oSettings, json.aaData[i] );
					}
				}
				oSettings.aiDisplay = oSettings.aiDisplayMaster.slice();
				
				oSettings.bAjaxDataGet = false;
				_fnDraw( oSettings );
				oSettings.bAjaxDataGet = true;
				_fnProcessingDisplay( oSettings, false );
			}
			
			
			/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
			 * Section - Options (features) HTML
			 */
			
			/*
			 * Function: _fnAddOptionsHtml
			 * Purpose:  Add the options to the page HTML for the table
			 * Returns:  -
			 * Inputs:   object:oSettings - dataTables settings object
			 */
			function _fnAddOptionsHtml ( oSettings )
			{
				/*
				 * Create a temporary, empty, div which we can later on replace with what we have generated
				 * we do it this way to rendering the 'options' html offline - speed :-)
				 */
				var nHolding = document.createElement( 'div' );
				oSettings.nTable.parentNode.insertBefore( nHolding, oSettings.nTable );
				
				/* 
				 * All DataTables are wrapped in a div - this is not currently optional - backwards 
				 * compatability. It can be removed if you don't want it.
				 */
				oSettings.nTableWrapper = document.createElement( 'div' );
				oSettings.nTableWrapper.className = oSettings.oClasses.sWrapper;
				if ( oSettings.sTableId !== '' )
				{
					oSettings.nTableWrapper.setAttribute( 'id', oSettings.sTableId+'_wrapper' );
				}
				
				/* Track where we want to insert the option */
				var nInsertNode = oSettings.nTableWrapper;
				
				/* Loop over the user set positioning and place the elements as needed */
				var aDom = oSettings.sDom.split('');
				var nTmp, iPushFeature, cOption, nNewNode, cNext, sAttr, j;
				for ( var i=0 ; i<aDom.length ; i++ )
				{
					iPushFeature = 0;
					cOption = aDom[i];
					
					if ( cOption == '<' )
					{
						/* New container div */
						nNewNode = document.createElement( 'div' );
						
						/* Check to see if we should append an id and/or a class name to the container */
						cNext = aDom[i+1];
						if ( cNext == "'" || cNext == '"' )
						{
							sAttr = "";
							j = 2;
							while ( aDom[i+j] != cNext )
							{
								sAttr += aDom[i+j];
								j++;
							}
							
							/* Replace jQuery UI constants */
							if ( sAttr == "H" )
							{
								sAttr = "fg-toolbar ui-toolbar ui-widget-header ui-corner-tl ui-corner-tr ui-helper-clearfix";
							}
							else if ( sAttr == "F" )
							{
								sAttr = "fg-toolbar ui-toolbar ui-widget-header ui-corner-bl ui-corner-br ui-helper-clearfix";
							}
							
							/* The attribute can be in the format of "#id.class", "#id" or "class" This logic
							 * breaks the string into parts and applies them as needed
							 */
							if ( sAttr.indexOf('.') != -1 )
							{
								var aSplit = sAttr.split('.');
								nNewNode.setAttribute('id', aSplit[0].substr(1, aSplit[0].length-1) );
								nNewNode.className = aSplit[1];
							}
							else if ( sAttr.charAt(0) == "#" )
							{
								nNewNode.setAttribute('id', sAttr.substr(1, sAttr.length-1) );
							}
							else
							{
								nNewNode.className = sAttr;
							}
							
							i += j; /* Move along the position array */
						}
						
						nInsertNode.appendChild( nNewNode );
						nInsertNode = nNewNode;
					}
					else if ( cOption == '>' )
					{
						/* End container div */
						nInsertNode = nInsertNode.parentNode;
					}
					else if ( cOption == 'l' && oSettings.oFeatures.bPaginate && oSettings.oFeatures.bLengthChange )
					{
						/* Length */
						nTmp = _fnFeatureHtmlLength( oSettings );
						iPushFeature = 1;
					}
					else if ( cOption == 'f' && oSettings.oFeatures.bFilter )
					{
						/* Filter */
						nTmp = _fnFeatureHtmlFilter( oSettings );
						iPushFeature = 1;
					}
					else if ( cOption == 'r' && oSettings.oFeatures.bProcessing )
					{
						/* pRocessing */
						nTmp = _fnFeatureHtmlProcessing( oSettings );
						iPushFeature = 1;
					}
					else if ( cOption == 't' )
					{
						/* Table */
						nTmp = _fnFeatureHtmlTable( oSettings );
						iPushFeature = 1;
					}
					else if ( cOption ==  'i' && oSettings.oFeatures.bInfo )
					{
						/* Info */
						nTmp = _fnFeatureHtmlInfo( oSettings );
						iPushFeature = 1;
					}
					else if ( cOption == 'p' && oSettings.oFeatures.bPaginate )
					{
						/* Pagination */
						nTmp = _fnFeatureHtmlPaginate( oSettings );
						iPushFeature = 1;
					}
					else if ( _oExt.aoFeatures.length !== 0 )
					{
						/* Plug-in features */
						var aoFeatures = _oExt.aoFeatures;
						for ( var k=0, kLen=aoFeatures.length ; k<kLen ; k++ )
						{
							if ( cOption == aoFeatures[k].cFeature )
							{
								nTmp = aoFeatures[k].fnInit( oSettings );
								if ( nTmp )
								{
									iPushFeature = 1;
								}
								break;
							}
						}
					}
					
					/* Add to the 2D features array */
					if ( iPushFeature == 1 && nTmp !== null )
					{
						if ( typeof oSettings.aanFeatures[cOption] != 'object' )
						{
							oSettings.aanFeatures[cOption] = [];
						}
						oSettings.aanFeatures[cOption].push( nTmp );
						nInsertNode.appendChild( nTmp );
					}
				}
				
				/* Built our DOM structure - replace the holding div with what we want */
				nHolding.parentNode.replaceChild( oSettings.nTableWrapper, nHolding );
			}
			
			
			/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
			 * Section - Feature: Filtering
			 */
			
			/*
			 * Function: _fnFeatureHtmlTable
			 * Purpose:  Add any control elements for the table - specifically scrolling
			 * Returns:  node: - Node to add to the DOM
			 * Inputs:   object:oSettings - dataTables settings object
			 */
			function _fnFeatureHtmlTable ( oSettings )
			{
				/* Chack if scrolling is enabled or not - if not then leave the DOM unaltered */
				if ( oSettings.oScroll.sX === "" && oSettings.oScroll.sY === "" )
				{
					return oSettings.nTable;
				}
				
				/*
				 * The HTML structure that we want to generate in this function is:
				 *  div - nScroller
				 *    div - nScrollHead
				 *      div - nScrollHeadInner
				 *        table - nScrollHeadTable
				 *          thead - nThead
				 *    div - nScrollBody
				 *      table - oSettings.nTable
				 *        thead - nTheadSize
				 *        tbody - nTbody
				 *    div - nScrollFoot
				 *      div - nScrollFootInner
				 *        table - nScrollFootTable
				 *          tfoot - nTfoot
				 */
				var
					nScroller = document.createElement('div'),
					nScrollHead = document.createElement('div'),
					nScrollHeadInner = document.createElement('div'),
					nScrollBody = document.createElement('div'),
					nScrollFoot = document.createElement('div'),
					nScrollFootInner = document.createElement('div'),
					nScrollHeadTable = oSettings.nTable.cloneNode(false),
					nScrollFootTable = oSettings.nTable.cloneNode(false),
					nThead = oSettings.nTable.getElementsByTagName('thead')[0],
					nTfoot = oSettings.nTable.getElementsByTagName('tfoot').length === 0 ? null : 
						oSettings.nTable.getElementsByTagName('tfoot')[0],
					oClasses = (typeof oInit.bJQueryUI != 'undefined' && oInit.bJQueryUI) ?
						_oExt.oJUIClasses : _oExt.oStdClasses;
				
				nScrollHead.appendChild( nScrollHeadInner );
				nScrollFoot.appendChild( nScrollFootInner );
				nScrollBody.appendChild( oSettings.nTable );
				nScroller.appendChild( nScrollHead );
				nScroller.appendChild( nScrollBody );
				nScrollHeadInner.appendChild( nScrollHeadTable );
				nScrollHeadTable.appendChild( nThead );
				if ( nTfoot !== null )
				{
					nScroller.appendChild( nScrollFoot );
					nScrollFootInner.appendChild( nScrollFootTable );
					nScrollFootTable.appendChild( nTfoot );
				}
				
				nScroller.className = oClasses.sScrollWrapper;
				nScrollHead.className = oClasses.sScrollHead;
				nScrollHeadInner.className = oClasses.sScrollHeadInner;
				nScrollBody.className = oClasses.sScrollBody;
				nScrollFoot.className = oClasses.sScrollFoot;
				nScrollFootInner.className = oClasses.sScrollFootInner;
				
				if ( oSettings.oScroll.bAutoCss )
				{
					nScrollHead.style.overflow = "hidden";
					nScrollHead.style.position = "relative";
					nScrollFoot.style.overflow = "hidden";
					nScrollBody.style.overflow = "auto";
				}
				
				nScrollHead.style.border = "0";
				nScrollHead.style.width = "100%";
				nScrollFoot.style.border = "0";
				nScrollHeadInner.style.width = "150%"; /* will be overwritten */
				
				/* Modify attributes to respect the clones */
				nScrollHeadTable.removeAttribute('id');
				nScrollHeadTable.style.marginLeft = "0";
				oSettings.nTable.style.marginLeft = "0";
				if ( nTfoot !== null )
				{
					nScrollFootTable.removeAttribute('id');
					nScrollFootTable.style.marginLeft = "0";
				}
				
				/* Move any caption elements from the body to the header */
				var nCaptions = $('>caption', oSettings.nTable);
				for ( var i=0, iLen=nCaptions.length ; i<iLen ; i++ )
				{
					nScrollHeadTable.appendChild( nCaptions[i] );
				}
				
				/*
				 * Sizing
				 */
				/* When xscrolling add the width and a scroller to move the header with the body */
				if ( oSettings.oScroll.sX !== "" )
				{
					nScrollHead.style.width = _fnStringToCss( oSettings.oScroll.sX );
					nScrollBody.style.width = _fnStringToCss( oSettings.oScroll.sX );
					
					if ( nTfoot !== null )
					{
						nScrollFoot.style.width = _fnStringToCss( oSettings.oScroll.sX );	
					}
					
					/* When the body is scrolled, then we also want to scroll the headers */
					$(nScrollBody).scroll( function (e) {
						nScrollHead.scrollLeft = this.scrollLeft;
						
						if ( nTfoot !== null )
						{
							nScrollFoot.scrollLeft = this.scrollLeft;
						}
					} );
				}
				
				/* When yscrolling, add the height */
				if ( oSettings.oScroll.sY !== "" )
				{
					nScrollBody.style.height = _fnStringToCss( oSettings.oScroll.sY );
				}
				
				/* Redraw - align columns across the tables */
				oSettings.aoDrawCallback.push( {
					"fn": _fnScrollDraw,
					"sName": "scrolling"
				} );
				
				/* Infinite scrolling event handlers */
				if ( oSettings.oScroll.bInfinite )
				{
					$(nScrollBody).scroll( function() {
						/* Use a blocker to stop scrolling from loading more data while other data is still loading */
						if ( !oSettings.bDrawing )
						{
							/* Check if we should load the next data set */
							if ( $(this).scrollTop() + $(this).height() > 
								$(oSettings.nTable).height() - oSettings.oScroll.iLoadGap )
							{
								/* Only do the redraw if we have to - we might be at the end of the data */
								if ( oSettings.fnDisplayEnd() < oSettings.fnRecordsDisplay() )
								{
									_fnPageChange( oSettings, 'next' );
									_fnCalculateEnd( oSettings );
									_fnDraw( oSettings );
								}
							}
						}
					} );
				}
				
				oSettings.nScrollHead = nScrollHead;
				oSettings.nScrollFoot = nScrollFoot;
				
				return nScroller;
			}
			
			/*
			 * Function: _fnScrollDraw
			 * Purpose:  Update the various tables for resizing
			 * Returns:  node: - Node to add to the DOM
			 * Inputs:   object:o - dataTables settings object
			 * Notes:    It's a bit of a pig this function, but basically the idea to:
			 *   1. Re-create the table inside the scrolling div
			 *   2. Take live measurements from the DOM
			 *   3. Apply the measurements
			 *   4. Clean up
			 */
			function _fnScrollDraw ( o )
			{
				var
					nScrollHeadInner = o.nScrollHead.getElementsByTagName('div')[0],
					nScrollHeadTable = nScrollHeadInner.getElementsByTagName('table')[0],
					nScrollBody = o.nTable.parentNode,
					i, iLen, j, jLen, anHeadToSize, anHeadSizers, anFootSizers, anFootToSize, oStyle, iVis,
					iWidth, aApplied=[], iSanityWidth;
				
				/*
				 * 1. Re-create the table inside the scrolling div
				 */
				
				/* Remove the old minimised thead and tfoot elements in the inner table */
				var nTheadSize = o.nTable.getElementsByTagName('thead');
				if ( nTheadSize.length > 0 )
				{
					o.nTable.removeChild( nTheadSize[0] );
				}
				
				if ( o.nTFoot !== null )
				{
					/* Remove the old minimised footer element in the cloned header */
					var nTfootSize = o.nTable.getElementsByTagName('tfoot');
					if ( nTfootSize.length > 0 )
					{
						o.nTable.removeChild( nTfootSize[0] );
					}
				}
				
				/* Clone the current header and footer elements and then place it into the inner table */
				nTheadSize = o.nTHead.cloneNode(true);
				o.nTable.insertBefore( nTheadSize, o.nTable.childNodes[0] );
				
				if ( o.nTFoot !== null )
				{
					nTfootSize = o.nTFoot.cloneNode(true);
					o.nTable.insertBefore( nTfootSize, o.nTable.childNodes[1] );
				}
				
				/*
				 * 2. Take live measurements from the DOM - do not alter the DOM itself!
				 */
				
				/* Remove old sizing and apply the calculated column widths
				 * Get the unique column headers in the newly created (cloned) header. We want to apply the
				 * calclated sizes to this header
				 */
				var nThs = _fnGetUniqueThs( nTheadSize );
				for ( i=0, iLen=nThs.length ; i<iLen ; i++ )
				{
					iVis = _fnVisibleToColumnIndex( o, i );
					nThs[i].style.width = o.aoColumns[iVis].sWidth;
				}
				
				if ( o.nTFoot !== null )
				{
					_fnApplyToChildren( function(n) {
						n.style.width = "";
					}, nTfootSize.getElementsByTagName('tr') );
				}
				
				/* Size the table as a whole */
				iSanityWidth = $(o.nTable).outerWidth();
				if ( o.oScroll.sX === "" )
				{
					/* No x scrolling */
					o.nTable.style.width = "100%";
					
					/* I know this is rubbish - but IE7 will make the width of the table when 100% include
					 * the scrollbar - which is shouldn't. This needs feature detection in future - to do
					 */
					if ( $.browser.msie && $.browser.version <= 7 )
					{
						o.nTable.style.width = _fnStringToCss( $(o.nTable).outerWidth()-o.oScroll.iBarWidth );
					}
				}
				else
				{
					if ( o.oScroll.sXInner !== "" )
					{
						/* x scroll inner has been given - use it */
						o.nTable.style.width = _fnStringToCss(o.oScroll.sXInner);
					}
					else if ( iSanityWidth == $(nScrollBody).width() &&
					   $(nScrollBody).height() < $(o.nTable).height() )
					{
						/* There is y-scrolling - try to take account of the y scroll bar */
						o.nTable.style.width = _fnStringToCss( iSanityWidth-o.oScroll.iBarWidth );
						if ( $(o.nTable).outerWidth() > iSanityWidth-o.oScroll.iBarWidth )
						{
							/* Not possible to take account of it */
							o.nTable.style.width = _fnStringToCss( iSanityWidth );
						}
					}
					else
					{
						/* All else fails */
						o.nTable.style.width = _fnStringToCss( iSanityWidth );
					}
				}
				
				/* Recalculate the sanity width - now that we've applied the required width, before it was
				 * a temporary variable. This is required because the column width calculation is done
				 * before this table DOM is created.
				 */
				iSanityWidth = $(o.nTable).outerWidth();
				
				/* We want the hidden header to have zero height, so remove padding and borders. Then
				 * set the width based on the real headers
				 */
				anHeadToSize = o.nTHead.getElementsByTagName('tr');
				anHeadSizers = nTheadSize.getElementsByTagName('tr');
				
				_fnApplyToChildren( function(nSizer, nToSize) {
					oStyle = nSizer.style;
					oStyle.paddingTop = "0";
					oStyle.paddingBottom = "0";
					oStyle.borderTopWidth = "0";
					oStyle.borderBottomWidth = "0";
					oStyle.height = 0;
					
					iWidth = $(nSizer).width();
					nToSize.style.width = _fnStringToCss( iWidth );
					aApplied.push( iWidth );
				}, anHeadSizers, anHeadToSize );
				$(anHeadSizers).height(0);
				
				if ( o.nTFoot !== null )
				{
					/* Clone the current footer and then place it into the body table as a "hidden header" */
					anFootSizers = nTfootSize.getElementsByTagName('tr');
					anFootToSize = o.nTFoot.getElementsByTagName('tr');
					
					_fnApplyToChildren( function(nSizer, nToSize) {
						oStyle = nSizer.style;
						oStyle.paddingTop = "0";
						oStyle.paddingBottom = "0";
						oStyle.borderTopWidth = "0";
						oStyle.borderBottomWidth = "0";
						oStyle.height = 0;
						
						iWidth = $(nSizer).width();
						nToSize.style.width = _fnStringToCss( iWidth );
						aApplied.push( iWidth );
					}, anFootSizers, anFootToSize );
					$(anFootSizers).height(0);
				}
				
				/*
				 * 3. Apply the measurements
				 */
				
				/* "Hide" the header and footer that we used for the sizing. We want to also fix their width
				 * to what they currently are
				 */
				_fnApplyToChildren( function(nSizer) {
					nSizer.innerHTML = "";
					nSizer.style.width = _fnStringToCss( aApplied.shift() );
				}, anHeadSizers );
				
				if ( o.nTFoot !== null )
				{
					_fnApplyToChildren( function(nSizer) {
						nSizer.innerHTML = "";
						nSizer.style.width = _fnStringToCss( aApplied.shift() );
					}, anFootSizers );
				}
				
				/* Sanity check that the table is of a sensible width. If not then we are going to get
				 * misalignment
				 */
				if ( $(o.nTable).outerWidth() < iSanityWidth )
				{
					if ( o.oScroll.sX === "" )
					{
						_fnLog( o, 1, "The table cannot fit into the current element which will cause column"+
							" misalignment. It is suggested that you enable x-scrolling or increase the width"+
							" the table has in which to be drawn" );
					}
					else if ( o.oScroll.sXInner !== "" )
					{
						_fnLog( o, 1, "The table cannot fit into the current element which will cause column"+
							" misalignment. It is suggested that you increase the sScrollXInner property to"+
							" allow it to draw in a larger area, or simply remove that parameter to allow"+
							" automatic calculation" );
					}
				}
				
				
				/*
				 * 4. Clean up
				 */
				
				if ( o.oScroll.sY === "" )
				{
					/* IE7< puts a vertical scrollbar in place (when it shouldn't be) due to subtracting
					 * the scrollbar height from the visible display, rather than adding it on. We need to
					 * set the height in order to sort this. Don't want to do it in any other browsers.
					 */
					if ( $.browser.msie && $.browser.version <= 7 )
					{
						nScrollBody.style.height = _fnStringToCss( o.nTable.offsetHeight+o.oScroll.iBarWidth );
					}
				}
				
				if ( o.oScroll.sY !== "" && o.oScroll.bCollapse )
				{
					nScrollBody.style.height = _fnStringToCss( o.oScroll.sY );
					
					var iExtra = (o.oScroll.sX !== "" && o.nTable.offsetWidth > nScrollBody.offsetWidth) ?
						o.oScroll.iBarWidth : 0;
					if ( o.nTable.offsetHeight < nScrollBody.offsetHeight )
					{
						nScrollBody.style.height = _fnStringToCss( $(o.nTable).height()+iExtra );
					}
				}
				
				/* Finally set the width's of the header and footer tables */
				var iOuterWidth = $(o.nTable).outerWidth();
				nScrollHeadTable.style.width = _fnStringToCss( iOuterWidth );
				nScrollHeadInner.style.width = _fnStringToCss( iOuterWidth+o.oScroll.iBarWidth );
				
				if ( o.nTFoot !== null )
				{
					var
						nScrollFootInner = o.nScrollFoot.getElementsByTagName('div')[0],
						nScrollFootTable = nScrollFootInner.getElementsByTagName('table')[0];
					
					nScrollFootInner.style.width = _fnStringToCss( o.nTable.offsetWidth+o.oScroll.iBarWidth );
					nScrollFootTable.style.width = _fnStringToCss( o.nTable.offsetWidth );
				}
				
				/* If sorting or filtering has occured, jump the scrolling back to the top */
				if ( o.bSorted || o.bFiltered )
				{
					nScrollBody.scrollTop = 0;
				}
			}
			
			/*
			 * Function: _fnAjustColumnSizing
			 * Purpose:  Ajust the table column widths for new data
			 * Returns:  -
			 * Inputs:   object:oSettings - dataTables settings object
			 * Notes:    You would probably want to do a redraw after calling this function!
			 */
			function _fnAjustColumnSizing ( oSettings )
			{
				/* Not interested in doing column width calculation if autowidth is disabled */
				if ( oSettings.oFeatures.bAutoWidth === false )
				{
					return false;
				}
				
				_fnCalculateColumnWidths( oSettings );
				for ( var i=0 , iLen=oSettings.aoColumns.length ; i<iLen ; i++ )
				{
					oSettings.aoColumns[i].nTh.style.width = oSettings.aoColumns[i].sWidth;
				}
			}
			
			
			/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
			 * Section - Feature: Filtering
			 */
			
			/*
			 * Function: _fnFeatureHtmlFilter
			 * Purpose:  Generate the node required for filtering text
			 * Returns:  node
			 * Inputs:   object:oSettings - dataTables settings object
			 */
			function _fnFeatureHtmlFilter ( oSettings )
			{
				var nFilter = document.createElement( 'div' );
				if ( oSettings.sTableId !== '' && typeof oSettings.aanFeatures.f == "undefined" )
				{
					nFilter.setAttribute( 'id', oSettings.sTableId+'_filter' );
				}
				nFilter.className = oSettings.oClasses.sFilter;
				var sSpace = oSettings.oLanguage.sSearch==="" ? "" : " ";
				nFilter.innerHTML = oSettings.oLanguage.sSearch+sSpace+'<input type="text" />';
				
				var jqFilter = $("input", nFilter);
				jqFilter.val( oSettings.oPreviousSearch.sSearch.replace('"','&quot;') );
				jqFilter.bind( 'keyup.DT', function(e) {
					/* Update all other filter input elements for the new display */
					var n = oSettings.aanFeatures.f;
					for ( var i=0, iLen=n.length ; i<iLen ; i++ )
					{
						if ( n[i] != this.parentNode )
						{
							$('input', n[i]).val( this.value );
						}
					}
					
					/* Now do the filter */
					if ( this.value != oSettings.oPreviousSearch.sSearch )
					{
						_fnFilterComplete( oSettings, { 
							"sSearch": this.value, 
							"bRegex":  oSettings.oPreviousSearch.bRegex,
							"bSmart":  oSettings.oPreviousSearch.bSmart 
						} );
					}
				} );
				
				jqFilter.bind( 'keypress.DT', function(e) {
					/* Prevent default */
					if ( e.keyCode == 13 )
					{
						return false;
					}
				} );
				
				return nFilter;
			}
			
			/*
			 * Function: _fnFilterComplete
			 * Purpose:  Filter the table using both the global filter and column based filtering
			 * Returns:  -
			 * Inputs:   object:oSettings - dataTables settings object
			 *           object:oSearch: search information
			 *           int:iForce - optional - force a research of the master array (1) or not (undefined or 0)
			 */
			function _fnFilterComplete ( oSettings, oInput, iForce )
			{
				/* Filter on everything */
				_fnFilter( oSettings, oInput.sSearch, iForce, oInput.bRegex, oInput.bSmart );
				
				/* Now do the individual column filter */
				for ( var i=0 ; i<oSettings.aoPreSearchCols.length ; i++ )
				{
					_fnFilterColumn( oSettings, oSettings.aoPreSearchCols[i].sSearch, i, 
						oSettings.aoPreSearchCols[i].bRegex, oSettings.aoPreSearchCols[i].bSmart );
				}
				
				/* Custom filtering */
				if ( _oExt.afnFiltering.length !== 0 )
				{
					_fnFilterCustom( oSettings );
				}
				
				/* Tell the draw function we have been filtering */
				oSettings.bFiltered = true;
				
				/* Redraw the table */
				oSettings._iDisplayStart = 0;
				_fnCalculateEnd( oSettings );
				_fnDraw( oSettings );
				
				/* Rebuild search array 'offline' */
				_fnBuildSearchArray( oSettings, 0 );
			}
			
			/*
			 * Function: _fnFilterCustom
			 * Purpose:  Apply custom filtering functions
			 * Returns:  -
			 * Inputs:   object:oSettings - dataTables settings object
			 */
			function _fnFilterCustom( oSettings )
			{
				var afnFilters = _oExt.afnFiltering;
				for ( var i=0, iLen=afnFilters.length ; i<iLen ; i++ )
				{
					var iCorrector = 0;
					for ( var j=0, jLen=oSettings.aiDisplay.length ; j<jLen ; j++ )
					{
						var iDisIndex = oSettings.aiDisplay[j-iCorrector];
						
						/* Check if we should use this row based on the filtering function */
						if ( !afnFilters[i]( oSettings, oSettings.aoData[iDisIndex]._aData, iDisIndex ) )
						{
							oSettings.aiDisplay.splice( j-iCorrector, 1 );
							iCorrector++;
						}
					}
				}
			}
			
			/*
			 * Function: _fnFilterColumn
			 * Purpose:  Filter the table on a per-column basis
			 * Returns:  -
			 * Inputs:   object:oSettings - dataTables settings object
			 *           string:sInput - string to filter on
			 *           int:iColumn - column to filter
			 *           bool:bRegex - treat search string as a regular expression or not
			 *           bool:bSmart - use smart filtering or not
			 */
			function _fnFilterColumn ( oSettings, sInput, iColumn, bRegex, bSmart )
			{
				if ( sInput === "" )
				{
					return;
				}
				
				var iIndexCorrector = 0;
				var rpSearch = _fnFilterCreateSearch( sInput, bRegex, bSmart );
				
				for ( var i=oSettings.aiDisplay.length-1 ; i>=0 ; i-- )
				{
					var sData = _fnDataToSearch( oSettings.aoData[ oSettings.aiDisplay[i] ]._aData[iColumn],
						oSettings.aoColumns[iColumn].sType );
					if ( ! rpSearch.test( sData ) )
					{
						oSettings.aiDisplay.splice( i, 1 );
						iIndexCorrector++;
					}
				}
			}
			
			/*
			 * Function: _fnFilter
			 * Purpose:  Filter the data table based on user input and draw the table
			 * Returns:  -
			 * Inputs:   object:oSettings - dataTables settings object
			 *           string:sInput - string to filter on
			 *           int:iForce - optional - force a research of the master array (1) or not (undefined or 0)
			 *           bool:bRegex - treat as a regular expression or not
			 *           bool:bSmart - perform smart filtering or not
			 */
			function _fnFilter( oSettings, sInput, iForce, bRegex, bSmart )
			{
				var i;
				var rpSearch = _fnFilterCreateSearch( sInput, bRegex, bSmart );
				
				/* Check if we are forcing or not - optional parameter */
				if ( typeof iForce == 'undefined' || iForce === null )
				{
					iForce = 0;
				}
				
				/* Need to take account of custom filtering functions - always filter */
				if ( _oExt.afnFiltering.length !== 0 )
				{
					iForce = 1;
				}
				
				/*
				 * If the input is blank - we want the full data set
				 */
				if ( sInput.length <= 0 )
				{
					oSettings.aiDisplay.splice( 0, oSettings.aiDisplay.length);
					oSettings.aiDisplay = oSettings.aiDisplayMaster.slice();
				}
				else
				{
					/*
					 * We are starting a new search or the new search string is smaller 
					 * then the old one (i.e. delete). Search from the master array
					 */
					if ( oSettings.aiDisplay.length == oSettings.aiDisplayMaster.length ||
						   oSettings.oPreviousSearch.sSearch.length > sInput.length || iForce == 1 ||
						   sInput.indexOf(oSettings.oPreviousSearch.sSearch) !== 0 )
					{
						/* Nuke the old display array - we are going to rebuild it */
						oSettings.aiDisplay.splice( 0, oSettings.aiDisplay.length);
						
						/* Force a rebuild of the search array */
						_fnBuildSearchArray( oSettings, 1 );
						
						/* Search through all records to populate the search array
						 * The the oSettings.aiDisplayMaster and asDataSearch arrays have 1 to 1 
						 * mapping
						 */
						for ( i=0 ; i<oSettings.aiDisplayMaster.length ; i++ )
						{
							if ( rpSearch.test(oSettings.asDataSearch[i]) )
							{
								oSettings.aiDisplay.push( oSettings.aiDisplayMaster[i] );
							}
						}
				  }
				  else
					{
					/* Using old search array - refine it - do it this way for speed
					 * Don't have to search the whole master array again
						 */
					var iIndexCorrector = 0;
					
					/* Search the current results */
					for ( i=0 ; i<oSettings.asDataSearch.length ; i++ )
						{
						if ( ! rpSearch.test(oSettings.asDataSearch[i]) )
							{
							oSettings.aiDisplay.splice( i-iIndexCorrector, 1 );
							iIndexCorrector++;
						}
					}
				  }
				}
				oSettings.oPreviousSearch.sSearch = sInput;
				oSettings.oPreviousSearch.bRegex = bRegex;
				oSettings.oPreviousSearch.bSmart = bSmart;
			}
			
			/*
			 * Function: _fnBuildSearchArray
			 * Purpose:  Create an array which can be quickly search through
			 * Returns:  -
			 * Inputs:   object:oSettings - dataTables settings object
			 *           int:iMaster - use the master data array - optional
			 */
			function _fnBuildSearchArray ( oSettings, iMaster )
			{
				/* Clear out the old data */
				oSettings.asDataSearch.splice( 0, oSettings.asDataSearch.length );
				
				var aArray = (typeof iMaster != 'undefined' && iMaster == 1) ?
					oSettings.aiDisplayMaster : oSettings.aiDisplay;
				
				for ( var i=0, iLen=aArray.length ; i<iLen ; i++ )
				{
					oSettings.asDataSearch[i] = _fnBuildSearchRow( oSettings, 
						oSettings.aoData[ aArray[i] ]._aData );
				}
			}
			
			/*
			 * Function: _fnBuildSearchRow
			 * Purpose:  Create a searchable string from a single data row
			 * Returns:  -
			 * Inputs:   object:oSettings - dataTables settings object
			 *           array:aData - aoData[]._aData array to use for the data to search
			 */
			function _fnBuildSearchRow( oSettings, aData )
			{
				var sSearch = '';
				var nTmp = document.createElement('div');
				
				for ( var j=0, jLen=oSettings.aoColumns.length ; j<jLen ; j++ )
				{
					if ( oSettings.aoColumns[j].bSearchable )
					{
						var sData = aData[j];
						sSearch += _fnDataToSearch( sData, oSettings.aoColumns[j].sType )+'  ';
					}
				}
				
				/* If it looks like there is an HTML entity in the string, attempt to decode it */
				if ( sSearch.indexOf('&') !== -1 )
				{
					nTmp.innerHTML = sSearch;
					sSearch = nTmp.textContent ? nTmp.textContent : nTmp.innerText;
					
					/* IE and Opera appear to put an newline where there is a <br> tag - remove it */
					sSearch = sSearch.replace(/\n/g," ").replace(/\r/g,"");
				}
				
				return sSearch;
			}
			
			/*
			 * Function: _fnFilterCreateSearch
			 * Purpose:  Build a regular expression object suitable for searching a table
			 * Returns:  RegExp: - constructed object
			 * Inputs:   string:sSearch - string to search for
			 *           bool:bRegex - treat as a regular expression or not
			 *           bool:bSmart - perform smart filtering or not
			 */
			function _fnFilterCreateSearch( sSearch, bRegex, bSmart )
			{
				var asSearch, sRegExpString;
				
				if ( bSmart )
				{
					/* Generate the regular expression to use. Something along the lines of:
					 * ^(?=.*?\bone\b)(?=.*?\btwo\b)(?=.*?\bthree\b).*$
					 */
					asSearch = bRegex ? sSearch.split( ' ' ) : _fnEscapeRegex( sSearch ).split( ' ' );
					sRegExpString = '^(?=.*?'+asSearch.join( ')(?=.*?' )+').*$';
					return new RegExp( sRegExpString, "i" );
				}
				else
				{
					sSearch = bRegex ? sSearch : _fnEscapeRegex( sSearch );
					return new RegExp( sSearch, "i" );
				}
			}
			
			/*
			 * Function: _fnDataToSearch
			 * Purpose:  Convert raw data into something that the user can search on
			 * Returns:  string: - search string
			 * Inputs:   string:sData - data to be modified
			 *           string:sType - data type
			 */
			function _fnDataToSearch ( sData, sType )
			{
				if ( typeof _oExt.ofnSearch[sType] == "function" )
				{
					return _oExt.ofnSearch[sType]( sData );
				}
				else if ( sType == "html" )
				{
					return sData.replace(/\n/g," ").replace( /<.*?>/g, "" );
				}
				else if ( typeof sData == "string" )
				{
					return sData.replace(/\n/g," ");
				}
				return sData;
			}
			
			
			/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
			 * Section - Feature: Sorting
			 */
			
			/*
			 * Function: _fnSort
			 * Purpose:  Change the order of the table
			 * Returns:  -
			 * Inputs:   object:oSettings - dataTables settings object
			 *           bool:bApplyClasses - optional - should we apply classes or not
			 * Notes:    We always sort the master array and then apply a filter again
			 *   if it is needed. This probably isn't optimal - but atm I can't think
			 *   of any other way which is (each has disadvantages). we want to sort aiDisplayMaster - 
			 *   but according to aoData[]._aData
			 */
			function _fnSort ( oSettings, bApplyClasses )
			{
				var
					iDataSort, iDataType,
					i, iLen, j, jLen,
					aaSort = [],
					aiOrig = [],
					oSort = _oExt.oSort,
					aoData = oSettings.aoData,
					aoColumns = oSettings.aoColumns;
				
				/* No sorting required if server-side or no sorting array */
				if ( !oSettings.oFeatures.bServerSide && 
					(oSettings.aaSorting.length !== 0 || oSettings.aaSortingFixed !== null) )
				{
					if ( oSettings.aaSortingFixed !== null )
					{
						aaSort = oSettings.aaSortingFixed.concat( oSettings.aaSorting );
					}
					else
					{
						aaSort = oSettings.aaSorting.slice();
					}
					
					/* If there is a sorting data type, and a fuction belonging to it, then we need to
					 * get the data from the developer's function and apply it for this column
					 */
					for ( i=0 ; i<aaSort.length ; i++ )
					{
						var iColumn = aaSort[i][0];
						var iVisColumn = _fnColumnIndexToVisible( oSettings, iColumn );
						var sDataType = oSettings.aoColumns[ iColumn ].sSortDataType;
						if ( typeof _oExt.afnSortData[sDataType] != 'undefined' )
						{
							var aData = _oExt.afnSortData[sDataType]( oSettings, iColumn, iVisColumn );
							for ( j=0, jLen=aoData.length ; j<jLen ; j++ )
							{
								aoData[j]._aData[iColumn] = aData[j];
							}
						}
					}
					
					/* Create a value - key array of the current row positions such that we can use their
					 * current position during the sort, if values match, in order to perform stable sorting
					 */
					for ( i=0, iLen=oSettings.aiDisplayMaster.length ; i<iLen ; i++ )
					{
						aiOrig[ oSettings.aiDisplayMaster[i] ] = i;
					}
					
					/* Do the sort - here we want multi-column sorting based on a given data source (column)
					 * and sorting function (from oSort) in a certain direction. It's reasonably complex to
					 * follow on it's own, but this is what we want (example two column sorting):
					 *  fnLocalSorting = function(a,b){
					 *  	var iTest;
					 *  	iTest = oSort['string-asc']('data11', 'data12');
					 *  	if (iTest !== 0)
					 *  		return iTest;
					 *    iTest = oSort['numeric-desc']('data21', 'data22');
					 *    if (iTest !== 0)
					 *  		return iTest;
					 *  	return oSort['numeric-asc']( aiOrig[a], aiOrig[b] );
					 *  }
					 * Basically we have a test for each sorting column, if the data in that column is equal,
					 * test the next column. If all columns match, then we use a numeric sort on the row 
					 * positions in the original data array to provide a stable sort.
					 */
					var iSortLen = aaSort.length;
					oSettings.aiDisplayMaster.sort( function ( a, b ) {
						var iTest;
						for ( i=0 ; i<iSortLen ; i++ )
						{
							iDataSort = aoColumns[ aaSort[i][0] ].iDataSort;
							iDataType = aoColumns[ iDataSort ].sType;
							iTest = oSort[ iDataType+"-"+aaSort[i][1] ](
								aoData[a]._aData[iDataSort],
								aoData[b]._aData[iDataSort]
							);
							
							if ( iTest !== 0 )
							{
								return iTest;
							}
						}
						
						return oSort['numeric-asc']( aiOrig[a], aiOrig[b] );
					} );
				}
				
				/* Alter the sorting classes to take account of the changes */
				if ( typeof bApplyClasses == 'undefined' || bApplyClasses )
				{
					_fnSortingClasses( oSettings );
				}
				
				/* Tell the draw function that we have sorted the data */
				oSettings.bSorted = true;
				
				/* Copy the master data into the draw array and re-draw */
				if ( oSettings.oFeatures.bFilter )
				{
					/* _fnFilter() will redraw the table for us */
					_fnFilterComplete( oSettings, oSettings.oPreviousSearch, 1 );
				}
				else
				{
					oSettings.aiDisplay = oSettings.aiDisplayMaster.slice();
					oSettings._iDisplayStart = 0; /* reset display back to page 0 */
					_fnCalculateEnd( oSettings );
					_fnDraw( oSettings );
				}
			}
			
			/*
			 * Function: _fnSortAttachListener
			 * Purpose:  Attach a sort handler (click) to a node
			 * Returns:  -
			 * Inputs:   object:oSettings - dataTables settings object
			 *           node:nNode - node to attach the handler to
			 *           int:iDataIndex - column sorting index
			 *           function:fnCallback - callback function - optional
			 */
			function _fnSortAttachListener ( oSettings, nNode, iDataIndex, fnCallback )
			{
				$(nNode).bind( 'click.DT', function (e) {
					/* If the column is not sortable - don't to anything */
					if ( oSettings.aoColumns[iDataIndex].bSortable === false )
					{
						return;
					}
					
					/*
					 * This is a little bit odd I admit... I declare a temporary function inside the scope of
					 * _fnDrawHead and the click handler in order that the code presented here can be used 
					 * twice - once for when bProcessing is enabled, and another time for when it is 
					 * disabled, as we need to perform slightly different actions.
					 *   Basically the issue here is that the Javascript engine in modern browsers don't 
					 * appear to allow the rendering engine to update the display while it is still excuting
					 * it's thread (well - it does but only after long intervals). This means that the 
					 * 'processing' display doesn't appear for a table sort. To break the js thread up a bit
					 * I force an execution break by using setTimeout - but this breaks the expected 
					 * thread continuation for the end-developer's point of view (their code would execute
					 * too early), so we on;y do it when we absolutely have to.
					 */
					var fnInnerSorting = function () {
						var iColumn, iNextSort;
						
						/* If the shift key is pressed then we are multipe column sorting */
						if ( e.shiftKey )
						{
							/* Are we already doing some kind of sort on this column? */
							var bFound = false;
							for ( var i=0 ; i<oSettings.aaSorting.length ; i++ )
							{
								if ( oSettings.aaSorting[i][0] == iDataIndex )
								{
									bFound = true;
									iColumn = oSettings.aaSorting[i][0];
									iNextSort = oSettings.aaSorting[i][2]+1;
									
									if ( typeof oSettings.aoColumns[iColumn].asSorting[iNextSort] == 'undefined' )
									{
										/* Reached the end of the sorting options, remove from multi-col sort */
										oSettings.aaSorting.splice( i, 1 );
									}
									else
									{
										/* Move onto next sorting direction */
										oSettings.aaSorting[i][1] = oSettings.aoColumns[iColumn].asSorting[iNextSort];
										oSettings.aaSorting[i][2] = iNextSort;
									}
									break;
								}
							}
							
							/* No sort yet - add it in */
							if ( bFound === false )
							{
								oSettings.aaSorting.push( [ iDataIndex, 
									oSettings.aoColumns[iDataIndex].asSorting[0], 0 ] );
							}
						}
						else
						{
							/* If no shift key then single column sort */
							if ( oSettings.aaSorting.length == 1 && oSettings.aaSorting[0][0] == iDataIndex )
							{
								iColumn = oSettings.aaSorting[0][0];
								iNextSort = oSettings.aaSorting[0][2]+1;
								if ( typeof oSettings.aoColumns[iColumn].asSorting[iNextSort] == 'undefined' )
								{
									iNextSort = 0;
								}
								oSettings.aaSorting[0][1] = oSettings.aoColumns[iColumn].asSorting[iNextSort];
								oSettings.aaSorting[0][2] = iNextSort;
							}
							else
							{
								oSettings.aaSorting.splice( 0, oSettings.aaSorting.length );
								oSettings.aaSorting.push( [ iDataIndex, 
									oSettings.aoColumns[iDataIndex].asSorting[0], 0 ] );
							}
						}
						
						/* Run the sort */
						_fnSort( oSettings );
					}; /* /fnInnerSorting */
					
					if ( !oSettings.oFeatures.bProcessing )
					{
						fnInnerSorting();
					}
					else
					{
						_fnProcessingDisplay( oSettings, true );
						setTimeout( function() {
							fnInnerSorting();
							if ( !oSettings.oFeatures.bServerSide )
							{
								_fnProcessingDisplay( oSettings, false );
							}
						}, 0 );
					}
					
					/* Call the user specified callback function - used for async user interaction */
					if ( typeof fnCallback == 'function' )
					{
						fnCallback( oSettings );
					}
				} );
			}
			
			/*
			 * Function: _fnSortingClasses
			 * Purpose:  Set the sortting classes on the header
			 * Returns:  -
			 * Inputs:   object:oSettings - dataTables settings object
			 * Notes:    It is safe to call this function when bSort and bSortClasses are false
			 */
			function _fnSortingClasses( oSettings )
			{
				var i, iLen, j, jLen, iFound;
				var aaSort, sClass;
				var iColumns = oSettings.aoColumns.length;
				var oClasses = oSettings.oClasses;
				
				for ( i=0 ; i<iColumns ; i++ )
				{
					if ( oSettings.aoColumns[i].bSortable )
					{
						$(oSettings.aoColumns[i].nTh).removeClass( oClasses.sSortAsc +" "+ oClasses.sSortDesc +
							" "+ oSettings.aoColumns[i].sSortingClass );
					}
				}
				
				if ( oSettings.aaSortingFixed !== null )
				{
					aaSort = oSettings.aaSortingFixed.concat( oSettings.aaSorting );
				}
				else
				{
					aaSort = oSettings.aaSorting.slice();
				}
				
				/* Apply the required classes to the header */
				for ( i=0 ; i<oSettings.aoColumns.length ; i++ )
				{
					if ( oSettings.aoColumns[i].bSortable )
					{
						sClass = oSettings.aoColumns[i].sSortingClass;
						iFound = -1;
						for ( j=0 ; j<aaSort.length ; j++ )
						{
							if ( aaSort[j][0] == i )
							{
								sClass = ( aaSort[j][1] == "asc" ) ?
									oClasses.sSortAsc : oClasses.sSortDesc;
								iFound = j;
								break;
							}
						}
						$(oSettings.aoColumns[i].nTh).addClass( sClass );
						
						if ( oSettings.bJUI )
						{
							/* jQuery UI uses extra markup */
							var jqSpan = $("span", oSettings.aoColumns[i].nTh);
							jqSpan.removeClass(oClasses.sSortJUIAsc +" "+ oClasses.sSortJUIDesc +" "+ 
								oClasses.sSortJUI +" "+ oClasses.sSortJUIAscAllowed +" "+ oClasses.sSortJUIDescAllowed );
							
							var sSpanClass;
							if ( iFound == -1 )
							{
								sSpanClass = oSettings.aoColumns[i].sSortingClassJUI;
							}
							else if ( aaSort[iFound][1] == "asc" )
							{
								sSpanClass = oClasses.sSortJUIAsc;
							}
							else
							{
								sSpanClass = oClasses.sSortJUIDesc;
							}
							
							jqSpan.addClass( sSpanClass );
						}
					}
					else
					{
						/* No sorting on this column, so add the base class. This will have been assigned by
						 * _fnAddColumn
						 */
						$(oSettings.aoColumns[i].nTh).addClass( oSettings.aoColumns[i].sSortingClass );
					}
				}
				
				/* 
				 * Apply the required classes to the table body
				 * Note that this is given as a feature switch since it can significantly slow down a sort
				 * on large data sets (adding and removing of classes is always slow at the best of times..)
				 * Further to this, note that this code is admitadly fairly ugly. It could be made a lot 
				 * simpiler using jQuery selectors and add/removeClass, but that is significantly slower
				 * (on the order of 5 times slower) - hence the direct DOM manipulation here.
				 */
				sClass = oClasses.sSortColumn;
				
				if ( oSettings.oFeatures.bSort && oSettings.oFeatures.bSortClasses )
				{
					var nTds = _fnGetTdNodes( oSettings );
					
					/* Remove the old classes */
					if ( nTds.length >= iColumns )
					{
						for ( i=0 ; i<iColumns ; i++ )
						{
							if ( nTds[i].className.indexOf(sClass+"1") != -1 )
							{
								for ( j=0, jLen=(nTds.length/iColumns) ; j<jLen ; j++ )
								{
									nTds[(iColumns*j)+i].className = 
										$.trim( nTds[(iColumns*j)+i].className.replace( sClass+"1", "" ) );
								}
							}
							else if ( nTds[i].className.indexOf(sClass+"2") != -1 )
							{
								for ( j=0, jLen=(nTds.length/iColumns) ; j<jLen ; j++ )
								{
									nTds[(iColumns*j)+i].className = 
										$.trim( nTds[(iColumns*j)+i].className.replace( sClass+"2", "" ) );
								}
							}
							else if ( nTds[i].className.indexOf(sClass+"3") != -1 )
							{
								for ( j=0, jLen=(nTds.length/iColumns) ; j<jLen ; j++ )
								{
									nTds[(iColumns*j)+i].className = 
										$.trim( nTds[(iColumns*j)+i].className.replace( " "+sClass+"3", "" ) );
								}
							}
						}
					}
					
					/* Add the new classes to the table */
					var iClass = 1, iTargetCol;
					for ( i=0 ; i<aaSort.length ; i++ )
					{
						iTargetCol = parseInt( aaSort[i][0], 10 );
						for ( j=0, jLen=(nTds.length/iColumns) ; j<jLen ; j++ )
						{
							nTds[(iColumns*j)+iTargetCol].className += " "+sClass+iClass;
						}
						
						if ( iClass < 3 )
						{
							iClass++;
						}
					}
				}
			}
			
			
			/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
			 * Section - Feature: Pagination. Note that most of the paging logic is done in 
			 * _oExt.oPagination
			 */
			
			/*
			 * Function: _fnFeatureHtmlPaginate
			 * Purpose:  Generate the node required for default pagination
			 * Returns:  node
			 * Inputs:   object:oSettings - dataTables settings object
			 */
			function _fnFeatureHtmlPaginate ( oSettings )
			{
				if ( oSettings.oScroll.bInfinite )
				{
					return null;
				}
				
				var nPaginate = document.createElement( 'div' );
				nPaginate.className = oSettings.oClasses.sPaging+oSettings.sPaginationType;
				
				_oExt.oPagination[ oSettings.sPaginationType ].fnInit( oSettings, nPaginate, 
					function( oSettings ) {
						_fnCalculateEnd( oSettings );
						_fnDraw( oSettings );
					}
				);
				
				/* Add a draw callback for the pagination on first instance, to update the paging display */
				if ( typeof oSettings.aanFeatures.p == "undefined" )
				{
					oSettings.aoDrawCallback.push( {
						"fn": function( oSettings ) {
							_oExt.oPagination[ oSettings.sPaginationType ].fnUpdate( oSettings, function( oSettings ) {
								_fnCalculateEnd( oSettings );
								_fnDraw( oSettings );
							} );
						},
						"sName": "pagination"
					} );
				}
				return nPaginate;
			}
			
			/*
			 * Function: _fnPageChange
			 * Purpose:  Alter the display settings to change the page
			 * Returns:  bool:true - page has changed, false - no change (no effect) eg 'first' on page 1
			 * Inputs:   object:oSettings - dataTables settings object
			 *           string:sAction - paging action to take: "first", "previous", "next" or "last"
			 */
			function _fnPageChange ( oSettings, sAction )
			{
				var iOldStart = oSettings._iDisplayStart;
				
				if ( sAction == "first" )
				{
					oSettings._iDisplayStart = 0;
				}
				else if ( sAction == "previous" )
				{
					oSettings._iDisplayStart = oSettings._iDisplayLength>=0 ?
						oSettings._iDisplayStart - oSettings._iDisplayLength :
						0;
					
					/* Correct for underrun */
					if ( oSettings._iDisplayStart < 0 )
					{
					  oSettings._iDisplayStart = 0;
					}
				}
				else if ( sAction == "next" )
				{
					if ( oSettings._iDisplayLength >= 0 )
					{
						/* Make sure we are not over running the display array */
						if ( oSettings._iDisplayStart + oSettings._iDisplayLength < oSettings.fnRecordsDisplay() )
						{
							oSettings._iDisplayStart += oSettings._iDisplayLength;
						}
					}
					else
					{
						oSettings._iDisplayStart = 0;
					}
				}
				else if ( sAction == "last" )
				{
					if ( oSettings._iDisplayLength >= 0 )
					{
						var iPages = parseInt( (oSettings.fnRecordsDisplay()-1) / oSettings._iDisplayLength, 10 ) + 1;
						oSettings._iDisplayStart = (iPages-1) * oSettings._iDisplayLength;
					}
					else
					{
						oSettings._iDisplayStart = 0;
					}
				}
				else
				{
					_fnLog( oSettings, 0, "Unknown paging action: "+sAction );
				}
				
				return iOldStart != oSettings._iDisplayStart;
			}
			
			
			/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
			 * Section - Feature: HTML info
			 */
			
			/*
			 * Function: _fnFeatureHtmlInfo
			 * Purpose:  Generate the node required for the info display
			 * Returns:  node
			 * Inputs:   object:oSettings - dataTables settings object
			 */
			function _fnFeatureHtmlInfo ( oSettings )
			{
				var nInfo = document.createElement( 'div' );
				nInfo.className = oSettings.oClasses.sInfo;
				
				/* Actions that are to be taken once only for this feature */
				if ( typeof oSettings.aanFeatures.i == "undefined" )
				{
					/* Add draw callback */
					oSettings.aoDrawCallback.push( {
						"fn": _fnUpdateInfo,
						"sName": "information"
					} );
					
					/* Add id */
					if ( oSettings.sTableId !== '' )
					{
						nInfo.setAttribute( 'id', oSettings.sTableId+'_info' );
					}
				}
				
				return nInfo;
			}
			
			/*
			 * Function: _fnUpdateInfo
			 * Purpose:  Update the information elements in the display
			 * Returns:  -
			 * Inputs:   object:oSettings - dataTables settings object
			 */
			function _fnUpdateInfo ( oSettings )
			{
				/* Show information about the table */
				if ( !oSettings.oFeatures.bInfo || oSettings.aanFeatures.i.length === 0 )
				{
					return;
				}
				
				var
					iStart = oSettings._iDisplayStart+1, iEnd = oSettings.fnDisplayEnd(),
					iMax = oSettings.fnRecordsTotal(), iTotal = oSettings.fnRecordsDisplay(),
					sStart = oSettings.fnFormatNumber( iStart ), sEnd = oSettings.fnFormatNumber( iEnd ),
					sMax = oSettings.fnFormatNumber( iMax ), sTotal = oSettings.fnFormatNumber( iTotal ),
					sOut;
				
				/* When infinite scrolling, we are always starting at 1. _iDisplayStart is used only
				 * internally
				 */
				if ( oSettings.oScroll.bInfinite )
				{
					sStart = oSettings.fnFormatNumber( 1 );
				}
				
				if ( oSettings.fnRecordsDisplay() === 0 && 
					   oSettings.fnRecordsDisplay() == oSettings.fnRecordsTotal() )
				{
					/* Empty record set */
					sOut = oSettings.oLanguage.sInfoEmpty+ oSettings.oLanguage.sInfoPostFix;
				}
				else if ( oSettings.fnRecordsDisplay() === 0 )
				{
					/* Rmpty record set after filtering */
					sOut = oSettings.oLanguage.sInfoEmpty +' '+ 
						oSettings.oLanguage.sInfoFiltered.replace('_MAX_', sMax)+
							oSettings.oLanguage.sInfoPostFix;
				}
				else if ( oSettings.fnRecordsDisplay() == oSettings.fnRecordsTotal() )
				{
					/* Normal record set */
					sOut = oSettings.oLanguage.sInfo.
							replace('_START_', sStart).
							replace('_END_',   sEnd).
							replace('_TOTAL_', sTotal)+ 
						oSettings.oLanguage.sInfoPostFix;
				}
				else
				{
					/* Record set after filtering */
					sOut = oSettings.oLanguage.sInfo.
							replace('_START_', sStart).
							replace('_END_',   sEnd).
							replace('_TOTAL_', sTotal) +' '+ 
						oSettings.oLanguage.sInfoFiltered.replace('_MAX_', 
							oSettings.fnFormatNumber(oSettings.fnRecordsTotal()))+ 
						oSettings.oLanguage.sInfoPostFix;
				}
				
				if ( oSettings.oLanguage.fnInfoCallback !== null )
				{
					sOut = oSettings.oLanguage.fnInfoCallback( oSettings, iStart, iEnd, iMax, iTotal, sOut );
				}
				
				var n = oSettings.aanFeatures.i;
				for ( var i=0, iLen=n.length ; i<iLen ; i++ )
				{
					$(n[i]).html( sOut );
				}
			}
			
			
			/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
			 * Section - Feature: Length change
			 */
			
			/*
			 * Function: _fnFeatureHtmlLength
			 * Purpose:  Generate the node required for user display length changing
			 * Returns:  node
			 * Inputs:   object:oSettings - dataTables settings object
			 */
			function _fnFeatureHtmlLength ( oSettings )
			{
				if ( oSettings.oScroll.bInfinite )
				{
					return null;
				}
				
				/* This can be overruled by not using the _MENU_ var/macro in the language variable */
				var sName = (oSettings.sTableId === "") ? "" : 'name="'+oSettings.sTableId+'_length"';
				var sStdMenu = '<select size="1" '+sName+'>';
				var i, iLen;
				
				if ( oSettings.aLengthMenu.length == 2 && typeof oSettings.aLengthMenu[0] == 'object' && 
						typeof oSettings.aLengthMenu[1] == 'object' )
				{
					for ( i=0, iLen=oSettings.aLengthMenu[0].length ; i<iLen ; i++ )
					{
						sStdMenu += '<option value="'+oSettings.aLengthMenu[0][i]+'">'+
							oSettings.aLengthMenu[1][i]+'</option>';
					}
				}
				else
				{
					for ( i=0, iLen=oSettings.aLengthMenu.length ; i<iLen ; i++ )
					{
						sStdMenu += '<option value="'+oSettings.aLengthMenu[i]+'">'+
							oSettings.aLengthMenu[i]+'</option>';
					}
				}
				sStdMenu += '</select>';
				
				var nLength = document.createElement( 'div' );
				if ( oSettings.sTableId !== '' && typeof oSettings.aanFeatures.l == "undefined" )
				{
					nLength.setAttribute( 'id', oSettings.sTableId+'_length' );
				}
				nLength.className = oSettings.oClasses.sLength;
				nLength.innerHTML = oSettings.oLanguage.sLengthMenu.replace( '_MENU_', sStdMenu );
				
				/*
				 * Set the length to the current display length - thanks to Andrea Pavlovic for this fix,
				 * and Stefan Skopnik for fixing the fix!
				 */
				$('select option[value="'+oSettings._iDisplayLength+'"]',nLength).attr("selected",true);
				
				$('select', nLength).bind( 'change.DT', function(e) {
					var iVal = $(this).val();
					
					/* Update all other length options for the new display */
					var n = oSettings.aanFeatures.l;
					for ( i=0, iLen=n.length ; i<iLen ; i++ )
					{
						if ( n[i] != this.parentNode )
						{
							$('select', n[i]).val( iVal );
						}
					}
					
					/* Redraw the table */
					oSettings._iDisplayLength = parseInt(iVal, 10);
					_fnCalculateEnd( oSettings );
					
					/* If we have space to show extra rows (backing up from the end point - then do so */
					if ( oSettings.fnDisplayEnd() == oSettings.fnRecordsDisplay() )
					{
						oSettings._iDisplayStart = oSettings.fnDisplayEnd() - oSettings._iDisplayLength;
						if ( oSettings._iDisplayStart < 0 )
						{
							oSettings._iDisplayStart = 0;
						}
					}
					
					if ( oSettings._iDisplayLength == -1 )
					{
						oSettings._iDisplayStart = 0;
					}
					
					_fnDraw( oSettings );
				} );
				
				return nLength;
			}
			
			
			/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
			 * Section - Feature: Processing incidator
			 */
			
			/*
			 * Function: _fnFeatureHtmlProcessing
			 * Purpose:  Generate the node required for the processing node
			 * Returns:  node
			 * Inputs:   object:oSettings - dataTables settings object
			 */
			function _fnFeatureHtmlProcessing ( oSettings )
			{
				var nProcessing = document.createElement( 'div' );
				
				if ( oSettings.sTableId !== '' && typeof oSettings.aanFeatures.r == "undefined" )
				{
					nProcessing.setAttribute( 'id', oSettings.sTableId+'_processing' );
				}
				nProcessing.innerHTML = oSettings.oLanguage.sProcessing;
				nProcessing.className = oSettings.oClasses.sProcessing;
				oSettings.nTable.parentNode.insertBefore( nProcessing, oSettings.nTable );
				
				return nProcessing;
			}
			
			/*
			 * Function: _fnProcessingDisplay
			 * Purpose:  Display or hide the processing indicator
			 * Returns:  -
			 * Inputs:   object:oSettings - dataTables settings object
			 *           bool:
			 *   true - show the processing indicator
			 *   false - don't show
			 */
			function _fnProcessingDisplay ( oSettings, bShow )
			{
				if ( oSettings.oFeatures.bProcessing )
				{
					var an = oSettings.aanFeatures.r;
					for ( var i=0, iLen=an.length ; i<iLen ; i++ )
					{
						an[i].style.visibility = bShow ? "visible" : "hidden";
					}
				}
			}
			
			
			/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
			 * Section - Support functions
			 */
			
			/*
			 * Function: _fnVisibleToColumnIndex
			 * Purpose:  Covert the index of a visible column to the index in the data array (take account
			 *   of hidden columns)
			 * Returns:  int:i - the data index
			 * Inputs:   object:oSettings - dataTables settings object
			 */
			function _fnVisibleToColumnIndex( oSettings, iMatch )
			{
				var iColumn = -1;
				
				for ( var i=0 ; i<oSettings.aoColumns.length ; i++ )
				{
					if ( oSettings.aoColumns[i].bVisible === true )
					{
						iColumn++;
					}
					
					if ( iColumn == iMatch )
					{
						return i;
					}
				}
				
				return null;
			}
			
			/*
			 * Function: _fnColumnIndexToVisible
			 * Purpose:  Covert the index of an index in the data array and convert it to the visible
			 *   column index (take account of hidden columns)
			 * Returns:  int:i - the data index
			 * Inputs:   object:oSettings - dataTables settings object
			 */
			function _fnColumnIndexToVisible( oSettings, iMatch )
			{
				var iVisible = -1;
				for ( var i=0 ; i<oSettings.aoColumns.length ; i++ )
				{
					if ( oSettings.aoColumns[i].bVisible === true )
					{
						iVisible++;
					}
					
					if ( i == iMatch )
					{
						return oSettings.aoColumns[i].bVisible === true ? iVisible : null;
					}
				}
				
				return null;
			}
			
			
			/*
			 * Function: _fnNodeToDataIndex
			 * Purpose:  Take a TR element and convert it to an index in aoData
			 * Returns:  int:i - index if found, null if not
			 * Inputs:   object:s - dataTables settings object
			 *           node:n - the TR element to find
			 */
			function _fnNodeToDataIndex( s, n )
			{
				var i, iLen;
				
				/* Optimisation - see if the nodes which are currently visible match, since that is
				 * the most likely node to be asked for (a selector or event for example)
				 */
				for ( i=s._iDisplayStart, iLen=s._iDisplayEnd ; i<iLen ; i++ )
				{
					if ( s.aoData[ s.aiDisplay[i] ].nTr == n )
					{
						return s.aiDisplay[i];
					}
				}
				
				/* Otherwise we are in for a slog through the whole data cache */
				for ( i=0, iLen=s.aoData.length ; i<iLen ; i++ )
				{
					if ( s.aoData[i].nTr == n )
					{
						return i;
					}
				}
				return null;
			}
			
			/*
			 * Function: _fnVisbleColumns
			 * Purpose:  Get the number of visible columns
			 * Returns:  int:i - the number of visible columns
			 * Inputs:   object:oS - dataTables settings object
			 */
			function _fnVisbleColumns( oS )
			{
				var iVis = 0;
				for ( var i=0 ; i<oS.aoColumns.length ; i++ )
				{
					if ( oS.aoColumns[i].bVisible === true )
					{
						iVis++;
					}
				}
				return iVis;
			}
			
			/*
			 * Function: _fnCalculateEnd
			 * Purpose:  Rcalculate the end point based on the start point
			 * Returns:  -
			 * Inputs:   object:oSettings - dataTables settings object
			 */
			function _fnCalculateEnd( oSettings )
			{
				if ( oSettings.oFeatures.bPaginate === false )
				{
					oSettings._iDisplayEnd = oSettings.aiDisplay.length;
				}
				else
				{
					/* Set the end point of the display - based on how many elements there are
					 * still to display
					 */
					if ( oSettings._iDisplayStart + oSettings._iDisplayLength > oSettings.aiDisplay.length ||
						   oSettings._iDisplayLength == -1 )
					{
						oSettings._iDisplayEnd = oSettings.aiDisplay.length;
					}
					else
					{
						oSettings._iDisplayEnd = oSettings._iDisplayStart + oSettings._iDisplayLength;
					}
				}
			}
			
			/*
			 * Function: _fnConvertToWidth
			 * Purpose:  Convert a CSS unit width to pixels (e.g. 2em)
			 * Returns:  int:iWidth - width in pixels
			 * Inputs:   string:sWidth - width to be converted
			 *           node:nParent - parent to get the with for (required for
			 *             relative widths) - optional
			 */
			function _fnConvertToWidth ( sWidth, nParent )
			{
				if ( !sWidth || sWidth === null || sWidth === '' )
				{
					return 0;
				}
				
				if ( typeof nParent == "undefined" )
				{
					nParent = document.getElementsByTagName('body')[0];
				}
				
				var iWidth;
				var nTmp = document.createElement( "div" );
				nTmp.style.width = sWidth;
				
				nParent.appendChild( nTmp );
				iWidth = nTmp.offsetWidth;
				nParent.removeChild( nTmp );
				
				return ( iWidth );
			}
			
			/*
			 * Function: _fnCalculateColumnWidths
			 * Purpose:  Calculate the width of columns for the table
			 * Returns:  -
			 * Inputs:   object:oSettings - dataTables settings object
			 */
			function _fnCalculateColumnWidths ( oSettings )
			{
				var iTableWidth = oSettings.nTable.offsetWidth;
				var iUserInputs = 0;
				var iTmpWidth;
				var iVisibleColumns = 0;
				var iColums = oSettings.aoColumns.length;
				var i;
				var oHeaders = $('th', oSettings.nTHead);
				
				/* Convert any user input sizes into pixel sizes */
				for ( i=0 ; i<iColums ; i++ )
				{
					if ( oSettings.aoColumns[i].bVisible )
					{
						iVisibleColumns++;
						
						if ( oSettings.aoColumns[i].sWidth !== null )
						{
							iTmpWidth = _fnConvertToWidth( oSettings.aoColumns[i].sWidthOrig, 
								oSettings.nTable.parentNode );
							if ( iTmpWidth !== null )
							{
								oSettings.aoColumns[i].sWidth = _fnStringToCss( iTmpWidth );
							}
								
							iUserInputs++;
						}
					}
				}
				
				/* If the number of columns in the DOM equals the number that we have to process in 
				 * DataTables, then we can use the offsets that are created by the web-browser. No custom 
				 * sizes can be set in order for this to happen, nor scrolling used
				 */
				if ( iColums == oHeaders.length && iUserInputs === 0 && iVisibleColumns == iColums &&
					oSettings.oScroll.sX === "" && oSettings.oScroll.sY === "" )
				{
					for ( i=0 ; i<oSettings.aoColumns.length ; i++ )
					{
						iTmpWidth = $(oHeaders[i]).width();
						if ( iTmpWidth !== null )
						{
							oSettings.aoColumns[i].sWidth = _fnStringToCss( iTmpWidth );
						}
					}
				}
				else
				{
					/* Otherwise we are going to have to do some calculations to get the width of each column.
					 * Construct a 1 row table with the widest node in the data, and any user defined widths,
					 * then insert it into the DOM and allow the browser to do all the hard work of
					 * calculating table widths.
					 */
					var
						nCalcTmp = oSettings.nTable.cloneNode( false ),
						nBody = document.createElement( 'tbody' ),
						nTr = document.createElement( 'tr' ),
						nDivSizing;
					
					nCalcTmp.removeAttribute( "id" );
					nCalcTmp.appendChild( oSettings.nTHead.cloneNode(true) );
					if ( oSettings.nTFoot !== null )
					{
						nCalcTmp.appendChild( oSettings.nTFoot.cloneNode(true) );
						_fnApplyToChildren( function(n) {
							n.style.width = "";
						}, nCalcTmp.getElementsByTagName('tr') );
					}
					
					nCalcTmp.appendChild( nBody );
					nBody.appendChild( nTr );
					
					/* Remove any sizing that was previously applied by the styles */
					var jqColSizing = $('thead th', nCalcTmp);
					if ( jqColSizing.length === 0 )
					{
						jqColSizing = $('tbody tr:eq(0)>td', nCalcTmp);
					}
					jqColSizing.each( function (i) {
						this.style.width = "";
						
						var iIndex = _fnVisibleToColumnIndex( oSettings, i );
						if ( iIndex !== null && oSettings.aoColumns[iIndex].sWidthOrig !== "" )
						{
							this.style.width = oSettings.aoColumns[iIndex].sWidthOrig;
						}
					} );
					
					/* Find the biggest td for each column and put it into the table */
					for ( i=0 ; i<iColums ; i++ )
					{
						if ( oSettings.aoColumns[i].bVisible )
						{
							var nTd = _fnGetWidestNode( oSettings, i );
							if ( nTd !== null )
							{
								nTd = nTd.cloneNode(true);
								nTr.appendChild( nTd );
							}
						}
					}
					
					/* Build the table and 'display' it */
					var nWrapper = oSettings.nTable.parentNode;
					nWrapper.appendChild( nCalcTmp );
					
					/* When scrolling (X or Y) we want to set the width of the table as appropriate. However,
					 * when not scrolling leave the table width as it is. This results in slightly different,
					 * but I think correct behaviour
					 */
					if ( oSettings.oScroll.sX !== "" && oSettings.oScroll.sXInner !== "" )
					{
						nCalcTmp.style.width = _fnStringToCss(oSettings.oScroll.sXInner);
					}
					else if ( oSettings.oScroll.sX !== "" )
					{
						nCalcTmp.style.width = "";
						if ( $(nCalcTmp).width() < nWrapper.offsetWidth )
						{
							nCalcTmp.style.width = _fnStringToCss( nWrapper.offsetWidth );
						}
					}
					else if ( oSettings.oScroll.sY !== "" )
					{
						nCalcTmp.style.width = _fnStringToCss( nWrapper.offsetWidth );
					}
					nCalcTmp.style.visibility = "hidden";
					
					/* Scrolling considerations */
					_fnScrollingWidthAdjust( oSettings, nCalcTmp );
					
					/* Read the width's calculated by the browser and store them for use by the caller. We
					 * first of all try to use the elements in the body, but it is possible that there are
					 * no elements there, under which circumstances we use the header elements
					 */
					var oNodes = $("tbody tr:eq(0)>td", nCalcTmp);
					if ( oNodes.length === 0 )
					{
						oNodes = $("thead tr:eq(0)>th", nCalcTmp);
					}
					
					var iIndex, iCorrector = 0, iWidth;
					for ( i=0 ; i<oSettings.aoColumns.length ; i++ )
					{
						if ( oSettings.aoColumns[i].bVisible )
						{
							iWidth = $(oNodes[iCorrector]).outerWidth();
							if ( iWidth !== null && iWidth > 0 )
							{
								oSettings.aoColumns[i].sWidth = _fnStringToCss( iWidth );
							}
							iCorrector++;
						}
					}
					
					oSettings.nTable.style.width = _fnStringToCss( $(nCalcTmp).outerWidth() );
					nCalcTmp.parentNode.removeChild( nCalcTmp );
				}
			}
			
			/*
			 * Function: _fnScrollingWidthAdjust
			 * Purpose:  Adjust a table's width to take account of scrolling
			 * Returns:  -
			 * Inputs:   object:oSettings - dataTables settings object
			 *           node:n - table node
			 */
			function _fnScrollingWidthAdjust ( oSettings, n )
			{
				if ( oSettings.oScroll.sX === "" && oSettings.oScroll.sY !== "" )
				{
					/* When y-scrolling only, we want to remove the width of the scroll bar so the table
					 * + scroll bar will fit into the area avaialble.
					 */
					var iOrigWidth = $(n).width();
					n.style.width = _fnStringToCss( $(n).outerWidth()-oSettings.oScroll.iBarWidth );
				}
				else if ( oSettings.oScroll.sX !== "" )
				{
					/* When x-scrolling both ways, fix the table at it's current size, without adjusting */
					n.style.width = _fnStringToCss( $(n).outerWidth() );
				}
			}
			
			/*
			 * Function: _fnGetWidestNode
			 * Purpose:  Get the widest node
			 * Returns:  string: - max strlens for each column
			 * Inputs:   object:oSettings - dataTables settings object
			 *           int:iCol - column of interest
			 *           boolean:bFast - Should we use fast (but non-accurate) calculation - optional,
			 *             default true
			 * Notes:    This operation is _expensive_ (!!!). It requires a lot of DOM interaction, but
			 *   this is the only way to reliably get the widest string. For example 'mmm' would be wider
			 *   than 'iiii' so we can't just ocunt characters. If this can be optimised it would be good
			 *   to do so!
			 */
			function _fnGetWidestNode( oSettings, iCol, bFast )
			{
				/* Use fast not non-accurate calculate based on the strlen */
				if ( typeof bFast == 'undefined' || bFast )
				{
					var iMaxLen = _fnGetMaxLenString( oSettings, iCol );
					var iFastVis = _fnColumnIndexToVisible( oSettings, iCol);
					if ( iMaxLen < 0 )
					{
						return null;
					}
					return oSettings.aoData[iMaxLen].nTr.getElementsByTagName('td')[iFastVis];
				}
				
				/* Use the slow approach, but get high quality answers - note that this code is not actually
				 * used by DataTables by default. If you want to use it you can alter the call to 
				 * _fnGetWidestNode to pass 'false' as the third argument
				 */
				var
					iMax = -1, i, iLen,
					iMaxIndex = -1,
					n = document.createElement('div');
				
				n.style.visibility = "hidden";
				n.style.position = "absolute";
				document.body.appendChild( n );
				
				for ( i=0, iLen=oSettings.aoData.length ; i<iLen ; i++ )
				{
					n.innerHTML = oSettings.aoData[i]._aData[iCol];
					if ( n.offsetWidth > iMax )
					{
						iMax = n.offsetWidth;
						iMaxIndex = i;
					}
				}
				document.body.removeChild( n );
				
				if ( iMaxIndex >= 0 )
				{
					var iVis = _fnColumnIndexToVisible( oSettings, iCol);
					var nRet = oSettings.aoData[iMaxIndex].nTr.getElementsByTagName('td')[iVis];
					if ( nRet )
					{
						return nRet;
					}
				}
				return null;
			}
			
			/*
			 * Function: _fnGetMaxLenString
			 * Purpose:  Get the maximum strlen for each data column
			 * Returns:  string: - max strlens for each column
			 * Inputs:   object:oSettings - dataTables settings object
			 *           int:iCol - column of interest
			 */
			function _fnGetMaxLenString( oSettings, iCol )
			{
				var iMax = -1;
				var iMaxIndex = -1;
				
				for ( var i=0 ; i<oSettings.aoData.length ; i++ )
				{
					var s = oSettings.aoData[i]._aData[iCol];
					if ( s.length > iMax )
					{
						iMax = s.length;
						iMaxIndex = i;
					}
				}
				
				return iMaxIndex;
			}
			
			/*
			 * Function: _fnStringToCss
			 * Purpose:  Append a CSS unit (only if required) to a string
			 * Returns:  0 if match, 1 if length is different, 2 if no match
			 * Inputs:   array:aArray1 - first array
			 *           array:aArray2 - second array
			 */
			function _fnStringToCss( s )
			{
				if ( s === null )
				{
					return "0px";
				}
				
				if ( typeof s == 'number' )
				{
					if ( s < 0 )
					{
						return "0px";
					}
					return s+"px";
				}
				
				/* Check if the last character is not 0-9 */
				var c = s.charCodeAt( s.length-1 );
				if (c < 0x30 || c > 0x39)
				{
					return s;
				}
				return s+"px";
			}
			
			/*
			 * Function: _fnArrayCmp
			 * Purpose:  Compare two arrays
			 * Returns:  0 if match, 1 if length is different, 2 if no match
			 * Inputs:   array:aArray1 - first array
			 *           array:aArray2 - second array
			 */
			function _fnArrayCmp( aArray1, aArray2 )
			{
				if ( aArray1.length != aArray2.length )
				{
					return 1;
				}
				
				for ( var i=0 ; i<aArray1.length ; i++ )
				{
					if ( aArray1[i] != aArray2[i] )
					{
						return 2;
					}
				}
				
				return 0;
			}
			
			/*
			 * Function: _fnDetectType
			 * Purpose:  Get the sort type based on an input string
			 * Returns:  string: - type (defaults to 'string' if no type can be detected)
			 * Inputs:   string:sData - data we wish to know the type of
			 * Notes:    This function makes use of the DataTables plugin objct _oExt 
			 *   (.aTypes) such that new types can easily be added.
			 */
			function _fnDetectType( sData )
			{
				var aTypes = _oExt.aTypes;
				var iLen = aTypes.length;
				
				for ( var i=0 ; i<iLen ; i++ )
				{
					var sType = aTypes[i]( sData );
					if ( sType !== null )
					{
						return sType;
					}
				}
				
				return 'string';
			}
			
			/*
			 * Function: _fnSettingsFromNode
			 * Purpose:  Return the settings object for a particular table
			 * Returns:  object: Settings object - or null if not found
			 * Inputs:   node:nTable - table we are using as a dataTable
			 */
			function _fnSettingsFromNode ( nTable )
			{
				for ( var i=0 ; i<_aoSettings.length ; i++ )
				{
					if ( _aoSettings[i].nTable == nTable )
					{
						return _aoSettings[i];
					}
				}
				
				return null;
			}
			
			/*
			 * Function: _fnGetDataMaster
			 * Purpose:  Return an array with the full table data
			 * Returns:  array array:aData - Master data array
			 * Inputs:   object:oSettings - dataTables settings object
			 */
			function _fnGetDataMaster ( oSettings )
			{
				var aData = [];
				var iLen = oSettings.aoData.length;
				for ( var i=0 ; i<iLen; i++ )
				{
					aData.push( oSettings.aoData[i]._aData );
				}
				return aData;
			}
			
			/*
			 * Function: _fnGetTrNodes
			 * Purpose:  Return an array with the TR nodes for the table
			 * Returns:  array: - TR array
			 * Inputs:   object:oSettings - dataTables settings object
			 */
			function _fnGetTrNodes ( oSettings )
			{
				var aNodes = [];
				var iLen = oSettings.aoData.length;
				for ( var i=0 ; i<iLen ; i++ )
				{
					aNodes.push( oSettings.aoData[i].nTr );
				}
				return aNodes;
			}
			
			/*
			 * Function: _fnGetTdNodes
			 * Purpose:  Return an array with the TD nodes for the table
			 * Returns:  array: - TD array
			 * Inputs:   object:oSettings - dataTables settings object
			 */
			function _fnGetTdNodes ( oSettings )
			{
				var nTrs = _fnGetTrNodes( oSettings );
				var nTds = [], nTd;
				var anReturn = [];
				var iCorrector;
				var iRow, iRows, iColumn, iColumns;
				
				for ( iRow=0, iRows=nTrs.length ; iRow<iRows ; iRow++ )
				{
					nTds = [];
					for ( iColumn=0, iColumns=nTrs[iRow].childNodes.length ; iColumn<iColumns ; iColumn++ )
					{
						nTd = nTrs[iRow].childNodes[iColumn];
						if ( nTd.nodeName.toUpperCase() == "TD" )
						{
							nTds.push( nTd );
						}
					}
					
					iCorrector = 0;
					for ( iColumn=0, iColumns=oSettings.aoColumns.length ; iColumn<iColumns ; iColumn++ )
					{
						if ( oSettings.aoColumns[iColumn].bVisible )
						{
							anReturn.push( nTds[iColumn-iCorrector] );
						}
						else
						{
							anReturn.push( oSettings.aoData[iRow]._anHidden[iColumn] );
							iCorrector++;
						}
					}
				}
				return anReturn;
			}
			
			/*
			 * Function: _fnEscapeRegex
			 * Purpose:  scape a string stuch that it can be used in a regular expression
			 * Returns:  string: - escaped string
			 * Inputs:   string:sVal - string to escape
			 */
			function _fnEscapeRegex ( sVal )
			{
				var acEscape = [ '/', '.', '*', '+', '?', '|', '(', ')', '[', ']', '{', '}', '\\', '$', '^' ];
			  var reReplace = new RegExp( '(\\' + acEscape.join('|\\') + ')', 'g' );
			  return sVal.replace(reReplace, '\\$1');
			}
			
			/*
			 * Function: _fnDeleteIndex
			 * Purpose:  Take an array of integers (index array) and remove a target integer (value - not 
			 *             the key!)
			 * Returns:  -
			 * Inputs:   a:array int - Index array to target
			 *           int:iTarget - value to find
			 */
			function _fnDeleteIndex( a, iTarget )
			{
				var iTargetIndex = -1;
				
				for ( var i=0, iLen=a.length ; i<iLen ; i++ )
				{
					if ( a[i] == iTarget )
					{
						iTargetIndex = i;
					}
					else if ( a[i] > iTarget )
					{
						a[i]--;
					}
				}
				
				if ( iTargetIndex != -1 )
				{
					a.splice( iTargetIndex, 1 );
				}
			}
			
			/*
			 * Function: _fnReOrderIndex
			 * Purpose:  Figure out how to reorder a display list
			 * Returns:  array int:aiReturn - index list for reordering
			 * Inputs:   object:oSettings - dataTables settings object
			 */
			function _fnReOrderIndex ( oSettings, sColumns )
			{
				var aColumns = sColumns.split(',');
				var aiReturn = [];
				
				for ( var i=0, iLen=oSettings.aoColumns.length ; i<iLen ; i++ )
				{
					for ( var j=0 ; j<iLen ; j++ )
					{
						if ( oSettings.aoColumns[i].sName == aColumns[j] )
						{
							aiReturn.push( j );
							break;
						}
					}
				}
				
				return aiReturn;
			}
			
			/*
			 * Function: _fnColumnOrdering
			 * Purpose:  Get the column ordering that DataTables expects
			 * Returns:  string: - comma separated list of names
			 * Inputs:   object:oSettings - dataTables settings object
			 */
			function _fnColumnOrdering ( oSettings )
			{
				var sNames = '';
				for ( var i=0, iLen=oSettings.aoColumns.length ; i<iLen ; i++ )
				{
					sNames += oSettings.aoColumns[i].sName+',';
				}
				if ( sNames.length == iLen )
				{
					return "";
				}
				return sNames.slice(0, -1);
			}
			
			/*
			 * Function: _fnLog
			 * Purpose:  Log an error message
			 * Returns:  -
			 * Inputs:   int:iLevel - log error messages, or display them to the user
			 *           string:sMesg - error message
			 */
			function _fnLog( oSettings, iLevel, sMesg )
			{
				var sAlert = oSettings.sTableId === "" ?
					"DataTables warning: " +sMesg :
					"DataTables warning (table id = '"+oSettings.sTableId+"'): " +sMesg;
				
				if ( iLevel === 0 )
				{
					if ( _oExt.sErrMode == 'alert' )
					{
						alert( sAlert );
					}
					else
					{
						throw sAlert;
					}
					return;
				}
				else if ( typeof console != 'undefined' && typeof console.log != 'undefined' )
				{
					console.log( sAlert );
				}
			}
			
			/*
			 * Function: _fnClearTable
			 * Purpose:  Nuke the table
			 * Returns:  -
			 * Inputs:   object:oSettings - dataTables settings object
			 */
			function _fnClearTable( oSettings )
			{
				oSettings.aoData.splice( 0, oSettings.aoData.length );
				oSettings.aiDisplayMaster.splice( 0, oSettings.aiDisplayMaster.length );
				oSettings.aiDisplay.splice( 0, oSettings.aiDisplay.length );
				_fnCalculateEnd( oSettings );
			}
			
			/*
			 * Function: _fnSaveState
			 * Purpose:  Save the state of a table in a cookie such that the page can be reloaded
			 * Returns:  -
			 * Inputs:   object:oSettings - dataTables settings object
			 */
			function _fnSaveState ( oSettings )
			{
				if ( !oSettings.oFeatures.bStateSave || typeof oSettings.bDestroying != 'undefined' )
				{
					return;
				}
				
				/* Store the interesting variables */
				var i, iLen, sTmp;
				var sValue = "{";
				sValue += '"iCreate":'+ new Date().getTime()+',';
				sValue += '"iStart":'+ oSettings._iDisplayStart+',';
				sValue += '"iEnd":'+ oSettings._iDisplayEnd+',';
				sValue += '"iLength":'+ oSettings._iDisplayLength+',';
				sValue += '"sFilter":"'+ encodeURIComponent(oSettings.oPreviousSearch.sSearch)+'",';
				sValue += '"sFilterEsc":'+ !oSettings.oPreviousSearch.bRegex+',';
				
				sValue += '"aaSorting":[ ';
				for ( i=0 ; i<oSettings.aaSorting.length ; i++ )
				{
					sValue += '['+oSettings.aaSorting[i][0]+',"'+oSettings.aaSorting[i][1]+'"],';
				}
				sValue = sValue.substring(0, sValue.length-1);
				sValue += "],";
				
				sValue += '"aaSearchCols":[ ';
				for ( i=0 ; i<oSettings.aoPreSearchCols.length ; i++ )
				{
					sValue += '["'+encodeURIComponent(oSettings.aoPreSearchCols[i].sSearch)+
						'",'+!oSettings.aoPreSearchCols[i].bRegex+'],';
				}
				sValue = sValue.substring(0, sValue.length-1);
				sValue += "],";
				
				sValue += '"abVisCols":[ ';
				for ( i=0 ; i<oSettings.aoColumns.length ; i++ )
				{
					sValue += oSettings.aoColumns[i].bVisible+",";
				}
				sValue = sValue.substring(0, sValue.length-1);
				sValue += "]";
				
				/* Save state from any plug-ins */
				for ( i=0, iLen=oSettings.aoStateSave.length ; i<iLen ; i++ )
				{
					sTmp = oSettings.aoStateSave[i].fn( oSettings, sValue );
					if ( sTmp !== "" )
					{
						sValue = sTmp;
					}
				}
				
				sValue += "}";
				
				_fnCreateCookie( oSettings.sCookiePrefix+oSettings.sInstance, sValue, 
					oSettings.iCookieDuration, oSettings.sCookiePrefix, oSettings.fnCookieCallback );
			}
			
			/*
			 * Function: _fnLoadState
			 * Purpose:  Attempt to load a saved table state from a cookie
			 * Returns:  -
			 * Inputs:   object:oSettings - dataTables settings object
			 *           object:oInit - DataTables init object so we can override settings
			 */
			function _fnLoadState ( oSettings, oInit )
			{
				if ( !oSettings.oFeatures.bStateSave )
				{
					return;
				}
				
				var oData, i, iLen;
				var sData = _fnReadCookie( oSettings.sCookiePrefix+oSettings.sInstance );
				if ( sData !== null && sData !== '' )
				{
					/* Try/catch the JSON eval - if it is bad then we ignore it - note that 1.7.0 and before
					 * incorrectly used single quotes for some strings - hence the replace below
					 */
					try
					{
						oData = (typeof $.parseJSON == 'function') ? 
							$.parseJSON( sData.replace(/'/g, '"') ) : eval( '('+sData+')' );
					}
					catch( e )
					{
						return;
					}
					
					/* Allow custom and plug-in manipulation functions to alter the data set which was
					 * saved, and also reject any saved state by returning false
					 */
					for ( i=0, iLen=oSettings.aoStateLoad.length ; i<iLen ; i++ )
					{
						if ( !oSettings.aoStateLoad[i].fn( oSettings, oData ) )
						{
							return;
						}
					}
					
					/* Store the saved state so it might be accessed at any time (particualrly a plug-in */
					oSettings.oLoadedState = $.extend( true, {}, oData );
					
					/* Restore key features */
					oSettings._iDisplayStart = oData.iStart;
					oSettings.iInitDisplayStart = oData.iStart;
					oSettings._iDisplayEnd = oData.iEnd;
					oSettings._iDisplayLength = oData.iLength;
					oSettings.oPreviousSearch.sSearch = decodeURIComponent(oData.sFilter);
					oSettings.aaSorting = oData.aaSorting.slice();
					oSettings.saved_aaSorting = oData.aaSorting.slice();
					
					/*
					 * Search filtering - global reference added in 1.4.1
					 * Note that we use a 'not' for the value of the regular expression indicator to maintain
					 * compatibility with pre 1.7 versions, where this was basically inverted. Added in 1.7.0
					 */
					if ( typeof oData.sFilterEsc != 'undefined' )
					{
						oSettings.oPreviousSearch.bRegex = !oData.sFilterEsc;
					}
					
					/* Column filtering - added in 1.5.0 beta 6 */
					if ( typeof oData.aaSearchCols != 'undefined' )
					{
						for ( i=0 ; i<oData.aaSearchCols.length ; i++ )
						{
							oSettings.aoPreSearchCols[i] = {
								"sSearch": decodeURIComponent(oData.aaSearchCols[i][0]),
								"bRegex": !oData.aaSearchCols[i][1]
							};
						}
					}
					
					/* Column visibility state - added in 1.5.0 beta 10 */
					if ( typeof oData.abVisCols != 'undefined' )
					{
						/* Pass back visibiliy settings to the init handler, but to do not here override
						 * the init object that the user might have passed in
						 */
						oInit.saved_aoColumns = [];
						for ( i=0 ; i<oData.abVisCols.length ; i++ )
						{
							oInit.saved_aoColumns[i] = {};
							oInit.saved_aoColumns[i].bVisible = oData.abVisCols[i];
						}
					}
				}
			}
			
			/*
			 * Function: _fnCreateCookie
			 * Purpose:  Create a new cookie with a value to store the state of a table
			 * Returns:  -
			 * Inputs:   string:sName - name of the cookie to create
			 *           string:sValue - the value the cookie should take
			 *           int:iSecs - duration of the cookie
			 *           string:sBaseName - sName is made up of the base + file name - this is the base
			 *           function:fnCallback - User definable function to modify the cookie
			 */
			function _fnCreateCookie ( sName, sValue, iSecs, sBaseName, fnCallback )
			{
				var date = new Date();
				date.setTime( date.getTime()+(iSecs*1000) );
				
				/* 
				 * Shocking but true - it would appear IE has major issues with having the path not having
				 * a trailing slash on it. We need the cookie to be available based on the path, so we
				 * have to append the file name to the cookie name. Appalling. Thanks to vex for adding the
				 * patch to use at least some of the path
				 */
				var aParts = window.location.pathname.split('/');
				var sNameFile = sName + '_' + aParts.pop().replace(/[\/:]/g,"").toLowerCase();
				var sFullCookie, oData;
				
				if ( fnCallback !== null )
				{
					oData = (typeof $.parseJSON == 'function') ? 
						$.parseJSON( sValue ) : eval( '('+sValue+')' );
					sFullCookie = fnCallback( sNameFile, oData, date.toGMTString(),
						aParts.join('/')+"/" );
				}
				else
				{
					sFullCookie = sNameFile + "=" + encodeURIComponent(sValue) +
						"; expires=" + date.toGMTString() +"; path=" + aParts.join('/')+"/";
				}
				
				/* Are we going to go over the cookie limit of 4KiB? If so, try to delete a cookies
				 * belonging to DataTables. This is FAR from bullet proof
				 */
				var sOldName="", iOldTime=9999999999999;
				var iLength = _fnReadCookie( sNameFile )!==null ? document.cookie.length : 
					sFullCookie.length + document.cookie.length;
				
				if ( iLength+10 > 4096 ) /* Magic 10 for padding */
				{
					var aCookies =document.cookie.split(';');
					for ( var i=0, iLen=aCookies.length ; i<iLen ; i++ )
					{
						if ( aCookies[i].indexOf( sBaseName ) != -1 )
						{
							/* It's a DataTables cookie, so eval it and check the time stamp */
							var aSplitCookie = aCookies[i].split('=');
							try { oData = eval( '('+decodeURIComponent(aSplitCookie[1])+')' ); }
							catch( e ) { continue; }
							
							if ( typeof oData.iCreate != 'undefined' && oData.iCreate < iOldTime )
							{
								sOldName = aSplitCookie[0];
								iOldTime = oData.iCreate;
							}
						}
					}
					
					if ( sOldName !== "" )
					{
						document.cookie = sOldName+"=; expires=Thu, 01-Jan-1970 00:00:01 GMT; path="+
							aParts.join('/') + "/";
					}
				}
				
				document.cookie = sFullCookie;
			}
			
			/*
			 * Function: _fnReadCookie
			 * Purpose:  Read an old cookie to get a cookie with an old table state
			 * Returns:  string: - contents of the cookie - or null if no cookie with that name found
			 * Inputs:   string:sName - name of the cookie to read
			 */
			function _fnReadCookie ( sName )
			{
				var
					aParts = window.location.pathname.split('/'),
					sNameEQ = sName + '_' + aParts[aParts.length-1].replace(/[\/:]/g,"").toLowerCase() + '=',
					sCookieContents = document.cookie.split(';');
				
				for( var i=0 ; i<sCookieContents.length ; i++ )
				{
					var c = sCookieContents[i];
					
					while (c.charAt(0)==' ')
					{
						c = c.substring(1,c.length);
					}
					
					if (c.indexOf(sNameEQ) === 0)
					{
						return decodeURIComponent( c.substring(sNameEQ.length,c.length) );
					}
				}
				return null;
			}
			
			/*
			 * Function: _fnGetUniqueThs
			 * Purpose:  Get an array of unique th elements, one for each column
			 * Returns:  array node:aReturn - list of unique ths
			 * Inputs:   node:nThead - The thead element for the table
			 */
			function _fnGetUniqueThs ( nThead )
			{
				var nTrs = nThead.getElementsByTagName('tr');
				
				/* Nice simple case */
				if ( nTrs.length == 1 )
				{
					return nTrs[0].getElementsByTagName('th');
				}
				
				/* Otherwise we need to figure out the layout array to get the nodes */
				var aLayout = [], aReturn = [];
				var ROWSPAN = 2, COLSPAN = 3, TDELEM = 4;
				var i, j, k, iLen, jLen, iColumnShifted;
				var fnShiftCol = function ( a, i, j ) {
					while ( typeof a[i][j] != 'undefined' ) {
						j++;
					}
					return j;
				};
				var fnAddRow = function ( i ) {
					if ( typeof aLayout[i] == 'undefined' ) {
						aLayout[i] = [];
					}
				};
				
				/* Calculate a layout array */
				for ( i=0, iLen=nTrs.length ; i<iLen ; i++ )
				{
					fnAddRow( i );
					var iColumn = 0;
					var nTds = [];
					
					for ( j=0, jLen=nTrs[i].childNodes.length ; j<jLen ; j++ )
					{
						if ( nTrs[i].childNodes[j].nodeName.toUpperCase() == "TD" ||
							 nTrs[i].childNodes[j].nodeName.toUpperCase() == "TH" )
						{
							nTds.push( nTrs[i].childNodes[j] );
						}
					}
					
					for ( j=0, jLen=nTds.length ; j<jLen ; j++ )
					{
						var iColspan = nTds[j].getAttribute('colspan') * 1;
						var iRowspan = nTds[j].getAttribute('rowspan') * 1;
						
						if ( !iColspan || iColspan===0 || iColspan===1 )
						{
							iColumnShifted = fnShiftCol( aLayout, i, iColumn );
							aLayout[i][iColumnShifted] = (nTds[j].nodeName.toUpperCase()=="TD") ? TDELEM : nTds[j];
							if ( iRowspan || iRowspan===0 || iRowspan===1 )
							{
								for ( k=1 ; k<iRowspan ; k++ )
								{
									fnAddRow( i+k );
									aLayout[i+k][iColumnShifted] = ROWSPAN;
								}
							}
							iColumn++;
						}
						else
						{
							iColumnShifted = fnShiftCol( aLayout, i, iColumn );
							for ( k=0 ; k<iColspan ; k++ )
							{
								aLayout[i][iColumnShifted+k] = COLSPAN;
							}
							iColumn += iColspan;
						}
					}
				}
				
				/* Convert the layout array into a node array */
				for ( i=0, iLen=aLayout.length ; i<iLen ; i++ )
				{
					for ( j=0, jLen=aLayout[i].length ; j<jLen ; j++ )
					{
						if ( typeof aLayout[i][j] == 'object' && typeof aReturn[j] == 'undefined' )
						{
							aReturn[j] = aLayout[i][j];
						}
					}
				}
				
				return aReturn;
			}
			
			/*
			 * Function: _fnScrollBarWidth
			 * Purpose:  Get the width of a scroll bar in this browser being used
			 * Returns:  int: - width in pixels
			 * Inputs:   -
			 * Notes:    All credit for this function belongs to Alexandre Gomes. Thanks for sharing!
			 *   http://www.alexandre-gomes.com/?p=115
			 */
			function _fnScrollBarWidth ()
			{  
				var inner = document.createElement('p');  
				var style = inner.style;
				style.width = "100%";  
				style.height = "200px";  
				
				var outer = document.createElement('div');  
				style = outer.style;
				style.position = "absolute";  
				style.top = "0px";  
				style.left = "0px";  
				style.visibility = "hidden";  
				style.width = "200px";  
				style.height = "150px";  
				style.overflow = "hidden";  
				outer.appendChild(inner);  
				
				document.body.appendChild(outer);  
				var w1 = inner.offsetWidth;  
				outer.style.overflow = 'scroll';  
				var w2 = inner.offsetWidth;  
				if ( w1 == w2 )
				{
					w2 = outer.clientWidth;  
				}
				
				document.body.removeChild(outer); 
				return (w1 - w2);  
			}
			
			/*
			 * Function: _fnApplyToChildren
			 * Purpose:  Apply a given function to the display child nodes of an element array (typically
			 *   TD children of TR rows
			 * Returns:  - (done by reference)
			 * Inputs:   function:fn - Method to apply to the objects
			 *           array nodes:an1 - List of elements to look through for display children
			 *           array nodes:an2 - Another list (identical structure to the first) - optional
			 */
			function _fnApplyToChildren( fn, an1, an2 )
			{
				for ( var i=0, iLen=an1.length ; i<iLen ; i++ )
				{
					for ( var j=0, jLen=an1[i].childNodes.length ; j<jLen ; j++ )
					{
						if ( an1[i].childNodes[j].nodeType == 1 )
						{
							if ( typeof an2 != 'undefined' )
							{
								fn( an1[i].childNodes[j], an2[i].childNodes[j] );
							}
							else
							{
								fn( an1[i].childNodes[j] );
							}
						}
					}
				}
			}
			
			/*
			 * Function: _fnMap
			 * Purpose:  See if a property is defined on one object, if so assign it to the other object
			 * Returns:  - (done by reference)
			 * Inputs:   object:oRet - target object
			 *           object:oSrc - source object
			 *           string:sName - property
			 *           string:sMappedName - name to map too - optional, sName used if not given
			 */
			function _fnMap( oRet, oSrc, sName, sMappedName )
			{
				if ( typeof sMappedName == 'undefined' )
				{
					sMappedName = sName;
				}
				if ( typeof oSrc[sName] != 'undefined' )
				{
					oRet[sMappedName] = oSrc[sName];
				}
			}
			
			/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
			 * Section - API
			 * 
			 * I'm not overly happy with this solution - I'd much rather that there was a way of getting
			 * a list of all the private functions and do what we need to dynamically - but that doesn't
			 * appear to be possible. Bonkers. A better solution would be to provide a 'bind' type object
			 * To do - bind type method in DTs 2.x.
			 */
			this.oApi._fnExternApiFunc = _fnExternApiFunc;
			this.oApi._fnInitalise = _fnInitalise;
			this.oApi._fnLanguageProcess = _fnLanguageProcess;
			this.oApi._fnAddColumn = _fnAddColumn;
			this.oApi._fnColumnOptions = _fnColumnOptions;
			this.oApi._fnAddData = _fnAddData;
			this.oApi._fnGatherData = _fnGatherData;
			this.oApi._fnDrawHead = _fnDrawHead;
			this.oApi._fnDraw = _fnDraw;
			this.oApi._fnReDraw = _fnReDraw;
			this.oApi._fnAjaxUpdate = _fnAjaxUpdate;
			this.oApi._fnAjaxUpdateDraw = _fnAjaxUpdateDraw;
			this.oApi._fnAddOptionsHtml = _fnAddOptionsHtml;
			this.oApi._fnFeatureHtmlTable = _fnFeatureHtmlTable;
			this.oApi._fnScrollDraw = _fnScrollDraw;
			this.oApi._fnAjustColumnSizing = _fnAjustColumnSizing;
			this.oApi._fnFeatureHtmlFilter = _fnFeatureHtmlFilter;
			this.oApi._fnFilterComplete = _fnFilterComplete;
			this.oApi._fnFilterCustom = _fnFilterCustom;
			this.oApi._fnFilterColumn = _fnFilterColumn;
			this.oApi._fnFilter = _fnFilter;
			this.oApi._fnBuildSearchArray = _fnBuildSearchArray;
			this.oApi._fnBuildSearchRow = _fnBuildSearchRow;
			this.oApi._fnFilterCreateSearch = _fnFilterCreateSearch;
			this.oApi._fnDataToSearch = _fnDataToSearch;
			this.oApi._fnSort = _fnSort;
			this.oApi._fnSortAttachListener = _fnSortAttachListener;
			this.oApi._fnSortingClasses = _fnSortingClasses;
			this.oApi._fnFeatureHtmlPaginate = _fnFeatureHtmlPaginate;
			this.oApi._fnPageChange = _fnPageChange;
			this.oApi._fnFeatureHtmlInfo = _fnFeatureHtmlInfo;
			this.oApi._fnUpdateInfo = _fnUpdateInfo;
			this.oApi._fnFeatureHtmlLength = _fnFeatureHtmlLength;
			this.oApi._fnFeatureHtmlProcessing = _fnFeatureHtmlProcessing;
			this.oApi._fnProcessingDisplay = _fnProcessingDisplay;
			this.oApi._fnVisibleToColumnIndex = _fnVisibleToColumnIndex;
			this.oApi._fnColumnIndexToVisible = _fnColumnIndexToVisible;
			this.oApi._fnNodeToDataIndex = _fnNodeToDataIndex;
			this.oApi._fnVisbleColumns = _fnVisbleColumns;
			this.oApi._fnCalculateEnd = _fnCalculateEnd;
			this.oApi._fnConvertToWidth = _fnConvertToWidth;
			this.oApi._fnCalculateColumnWidths = _fnCalculateColumnWidths;
			this.oApi._fnScrollingWidthAdjust = _fnScrollingWidthAdjust;
			this.oApi._fnGetWidestNode = _fnGetWidestNode;
			this.oApi._fnGetMaxLenString = _fnGetMaxLenString;
			this.oApi._fnStringToCss = _fnStringToCss;
			this.oApi._fnArrayCmp = _fnArrayCmp;
			this.oApi._fnDetectType = _fnDetectType;
			this.oApi._fnSettingsFromNode = _fnSettingsFromNode;
			this.oApi._fnGetDataMaster = _fnGetDataMaster;
			this.oApi._fnGetTrNodes = _fnGetTrNodes;
			this.oApi._fnGetTdNodes = _fnGetTdNodes;
			this.oApi._fnEscapeRegex = _fnEscapeRegex;
			this.oApi._fnDeleteIndex = _fnDeleteIndex;
			this.oApi._fnReOrderIndex = _fnReOrderIndex;
			this.oApi._fnColumnOrdering = _fnColumnOrdering;
			this.oApi._fnLog = _fnLog;
			this.oApi._fnClearTable = _fnClearTable;
			this.oApi._fnSaveState = _fnSaveState;
			this.oApi._fnLoadState = _fnLoadState;
			this.oApi._fnCreateCookie = _fnCreateCookie;
			this.oApi._fnReadCookie = _fnReadCookie;
			this.oApi._fnGetUniqueThs = _fnGetUniqueThs;
			this.oApi._fnScrollBarWidth = _fnScrollBarWidth;
			this.oApi._fnApplyToChildren = _fnApplyToChildren;
			this.oApi._fnMap = _fnMap;
			
			
			/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
			 * Section - Constructor
			 */
			
			/* Want to be able to reference "this" inside the this.each function */
			var _that = this;
			return this.each(function()
			{
				var i=0, iLen, j, jLen, k, kLen;
				
				/* Check to see if we are re-initalising a table */
				for ( i=0, iLen=_aoSettings.length ; i<iLen ; i++ )
				{
					/* Base check on table node */
					if ( _aoSettings[i].nTable == this )
					{
						if ( typeof oInit == 'undefined' || 
						   ( typeof oInit.bRetrieve != 'undefined' && oInit.bRetrieve === true ) )
						{
							return _aoSettings[i].oInstance;
						}
						else if ( typeof oInit.bDestroy != 'undefined' && oInit.bDestroy === true )
						{
							_aoSettings[i].oInstance.fnDestroy();
							break;
						}
						else
						{
							_fnLog( _aoSettings[i], 0, "Cannot reinitialise DataTable.\n\n"+
								"To retrieve the DataTables object for this table, please pass either no arguments "+
								"to the dataTable() function, or set bRetrieve to true. Alternatively, to destory "+
								"the old table and create a new one, set bDestroy to true (note that a lot of "+
								"changes to the configuration can be made through the API which is usually much "+
								"faster)." );
							return;
						}
					}
					
					/* If the element we are initialising has the same ID as a table which was previously
					 * initialised, but the table nodes don't match (from before) then we destory the old
					 * instance by simply deleting it. This is under the assumption that the table has been
					 * destroyed by other methods. Anyone using non-id selectors will need to do this manually
					 */
					if ( _aoSettings[i].sTableId !== "" && _aoSettings[i].sTableId == this.getAttribute('id') )
					{
						_aoSettings.splice( i, 1 );
						break;
					}
				}
				
				/* Make a complete and independent copy of the settings object */
				var oSettings = new classSettings();
				_aoSettings.push( oSettings );
				
				var bInitHandedOff = false;
				var bUsePassedData = false;
				
				/* Set the id */
				var sId = this.getAttribute( 'id' );
				if ( sId !== null )
				{
					oSettings.sTableId = sId;
					oSettings.sInstance = sId;
				}
				else
				{
					oSettings.sInstance = _oExt._oExternConfig.iNextUnique ++;
				}
				
				/* Sanity check */
				if ( this.nodeName.toLowerCase() != 'table' )
				{
					_fnLog( oSettings, 0, "Attempted to initialise DataTables on a node which is not a "+
						"table: "+this.nodeName );
					return;
				}
				
				/* Set the table node */
				oSettings.nTable = this;
				
				/* Keep a reference to the 'this' instance for the table. Note that if this table is being
				 * created with others, we retrieve a unique instance to ease API access.
				 */
				oSettings.oInstance = _that.length == 1 ? _that : $(this).dataTable();
				
				/* Bind the API functions to the settings, so we can perform actions whenever oSettings is
				 * available
				 */
				oSettings.oApi = _that.oApi;
				
				/* State the table's width for if a destroy is called at a later time */
				oSettings.sDestroyWidth = $(this).width();
				
				/* Store the features that we have available */
				if ( typeof oInit != 'undefined' && oInit !== null )
				{
					oSettings.oInit = oInit;
					_fnMap( oSettings.oFeatures, oInit, "bPaginate" );
					_fnMap( oSettings.oFeatures, oInit, "bLengthChange" );
					_fnMap( oSettings.oFeatures, oInit, "bFilter" );
					_fnMap( oSettings.oFeatures, oInit, "bSort" );
					_fnMap( oSettings.oFeatures, oInit, "bInfo" );
					_fnMap( oSettings.oFeatures, oInit, "bProcessing" );
					_fnMap( oSettings.oFeatures, oInit, "bAutoWidth" );
					_fnMap( oSettings.oFeatures, oInit, "bSortClasses" );
					_fnMap( oSettings.oFeatures, oInit, "bServerSide" );
					_fnMap( oSettings.oScroll, oInit, "sScrollX", "sX" );
					_fnMap( oSettings.oScroll, oInit, "sScrollXInner", "sXInner" );
					_fnMap( oSettings.oScroll, oInit, "sScrollY", "sY" );
					_fnMap( oSettings.oScroll, oInit, "bScrollCollapse", "bCollapse" );
					_fnMap( oSettings.oScroll, oInit, "bScrollInfinite", "bInfinite" );
					_fnMap( oSettings.oScroll, oInit, "iScrollLoadGap", "iLoadGap" );
					_fnMap( oSettings.oScroll, oInit, "bScrollAutoCss", "bAutoCss" );
					_fnMap( oSettings, oInit, "asStripClasses" );
					_fnMap( oSettings, oInit, "fnRowCallback" );
					_fnMap( oSettings, oInit, "fnHeaderCallback" );
					_fnMap( oSettings, oInit, "fnFooterCallback" );
					_fnMap( oSettings, oInit, "fnCookieCallback" );
					_fnMap( oSettings, oInit, "fnInitComplete" );
					_fnMap( oSettings, oInit, "fnServerData" );
					_fnMap( oSettings, oInit, "fnFormatNumber" );
					_fnMap( oSettings, oInit, "aaSorting" );
					_fnMap( oSettings, oInit, "aaSortingFixed" );
					_fnMap( oSettings, oInit, "aLengthMenu" );
					_fnMap( oSettings, oInit, "sPaginationType" );
					_fnMap( oSettings, oInit, "sAjaxSource" );
					_fnMap( oSettings, oInit, "iCookieDuration" );
					_fnMap( oSettings, oInit, "sCookiePrefix" );
					_fnMap( oSettings, oInit, "sDom" );
					_fnMap( oSettings, oInit, "oSearch", "oPreviousSearch" );
					_fnMap( oSettings, oInit, "aoSearchCols", "aoPreSearchCols" );
					_fnMap( oSettings, oInit, "iDisplayLength", "_iDisplayLength" );
					_fnMap( oSettings, oInit, "bJQueryUI", "bJUI" );
					_fnMap( oSettings.oLanguage, oInit, "fnInfoCallback" );
					
					/* Callback functions which are array driven */
					if ( typeof oInit.fnDrawCallback == 'function' )
					{
						oSettings.aoDrawCallback.push( {
							"fn": oInit.fnDrawCallback,
							"sName": "user"
						} );
					}
					
					if ( typeof oInit.fnStateSaveCallback == 'function' )
					{
						oSettings.aoStateSave.push( {
							"fn": oInit.fnStateSaveCallback,
							"sName": "user"
						} );
					}
					
					if ( typeof oInit.fnStateLoadCallback == 'function' )
					{
						oSettings.aoStateLoad.push( {
							"fn": oInit.fnStateLoadCallback,
							"sName": "user"
						} );
					}
					
					if ( oSettings.oFeatures.bServerSide && oSettings.oFeatures.bSort &&
						   oSettings.oFeatures.bSortClasses )
					{
						/* Enable sort classes for server-side processing. Safe to do it here, since server-side
						 * processing must be enabled by the developer
						 */
						oSettings.aoDrawCallback.push( {
							"fn": _fnSortingClasses,
							"sName": "server_side_sort_classes"
						} );
					}
					
					if ( typeof oInit.bJQueryUI != 'undefined' && oInit.bJQueryUI )
					{
						/* Use the JUI classes object for display. You could clone the oStdClasses object if 
						 * you want to have multiple tables with multiple independent classes 
						 */
						oSettings.oClasses = _oExt.oJUIClasses;
						
						if ( typeof oInit.sDom == 'undefined' )
						{
							/* Set the DOM to use a layout suitable for jQuery UI's theming */
							oSettings.sDom = '<"H"lfr>t<"F"ip>';
						}
					}
					
					/* Calculate the scroll bar width and cache it for use later on */
					if ( oSettings.oScroll.sX !== "" || oSettings.oScroll.sY !== "" )
					{
						oSettings.oScroll.iBarWidth = _fnScrollBarWidth();
					}
					
					if ( typeof oInit.iDisplayStart != 'undefined' && 
						 typeof oSettings.iInitDisplayStart == 'undefined' )
					{
						/* Display start point, taking into account the save saving */
						oSettings.iInitDisplayStart = oInit.iDisplayStart;
						oSettings._iDisplayStart = oInit.iDisplayStart;
					}
					
					/* Must be done after everything which can be overridden by a cookie! */
					if ( typeof oInit.bStateSave != 'undefined' )
					{
						oSettings.oFeatures.bStateSave = oInit.bStateSave;
						_fnLoadState( oSettings, oInit );
						oSettings.aoDrawCallback.push( {
							"fn": _fnSaveState,
							"sName": "state_save"
						} );
					}
					
					if ( typeof oInit.aaData != 'undefined' )
					{
						bUsePassedData = true;
					}
					
					/* Backwards compatability */
					/* aoColumns / aoData - remove at some point... */
					if ( typeof oInit != 'undefined' && typeof oInit.aoData != 'undefined' )
					{
						oInit.aoColumns = oInit.aoData;
					}
					
					/* Language definitions */
					if ( typeof oInit.oLanguage != 'undefined' )
					{
						if ( typeof oInit.oLanguage.sUrl != 'undefined' && oInit.oLanguage.sUrl !== "" )
						{
							/* Get the language definitions from a file */
							oSettings.oLanguage.sUrl = oInit.oLanguage.sUrl;
							$.getJSON( oSettings.oLanguage.sUrl, null, function( json ) { 
								_fnLanguageProcess( oSettings, json, true ); } );
							bInitHandedOff = true;
						}
						else
						{
							_fnLanguageProcess( oSettings, oInit.oLanguage, false );
						}
					}
					/* Warning: The _fnLanguageProcess function is async to the remainder of this function due
					 * to the XHR. We use _bInitialised in _fnLanguageProcess() to check this the processing 
					 * below is complete. The reason for spliting it like this is optimisation - we can fire
					 * off the XHR (if needed) and then continue processing the data.
					 */
				}
				else
				{
					/* Create a dummy object for quick manipulation later on. */
					oInit = {};
				}
				
				/*
				 * Stripes
				 * Add the strip classes now that we know which classes to apply - unless overruled
				 */
				if ( typeof oInit.asStripClasses == 'undefined' )
				{
					oSettings.asStripClasses.push( oSettings.oClasses.sStripOdd );
					oSettings.asStripClasses.push( oSettings.oClasses.sStripEven );
				}
				
				/* Remove row stripe classes if they are already on the table row */
				var bStripeRemove = false;
				var anRows = $('>tbody>tr', this);
				for ( i=0, iLen=oSettings.asStripClasses.length ; i<iLen ; i++ )
				{
					if ( anRows.filter(":lt(2)").hasClass( oSettings.asStripClasses[i]) )
					{
						bStripeRemove = true;
						break;
					}
				}
						
				if ( bStripeRemove )
				{
					/* Store the classes which we are about to remove so they can be readded on destory */
					oSettings.asDestoryStrips = [ '', '' ];
					if ( $(anRows[0]).hasClass(oSettings.oClasses.sStripOdd) )
					{
						oSettings.asDestoryStrips[0] += oSettings.oClasses.sStripOdd+" ";
					}
					if ( $(anRows[0]).hasClass(oSettings.oClasses.sStripEven) )
					{
						oSettings.asDestoryStrips[0] += oSettings.oClasses.sStripEven;
					}
					if ( $(anRows[1]).hasClass(oSettings.oClasses.sStripOdd) )
					{
						oSettings.asDestoryStrips[1] += oSettings.oClasses.sStripOdd+" ";
					}
					if ( $(anRows[1]).hasClass(oSettings.oClasses.sStripEven) )
					{
						oSettings.asDestoryStrips[1] += oSettings.oClasses.sStripEven;
					}
					
					anRows.removeClass( oSettings.asStripClasses.join(' ') );
				}
				
				/*
				 * Columns
				 * See if we should load columns automatically or use defined ones
				 */
				var nThead = this.getElementsByTagName('thead');
				var anThs = nThead.length===0 ? [] : _fnGetUniqueThs( nThead[0] );
				var aoColumnsInit;
				
				/* If not given a column array, generate one with nulls */
				if ( typeof oInit.aoColumns == 'undefined' )
				{
					aoColumnsInit = [];
					for ( i=0, iLen=anThs.length ; i<iLen ; i++ )
					{
						aoColumnsInit.push( null );
					}
				}
				else
				{
					aoColumnsInit = oInit.aoColumns;
				}
				
				/* Add the columns */
				for ( i=0, iLen=aoColumnsInit.length ; i<iLen ; i++ )
				{
					/* Check if we have column visibilty state to restore */
					if ( typeof oInit.saved_aoColumns != 'undefined' && oInit.saved_aoColumns.length == iLen )
					{
						if ( aoColumnsInit[i] === null )
						{
							aoColumnsInit[i] = {};
						}
						aoColumnsInit[i].bVisible = oInit.saved_aoColumns[i].bVisible;
					}
					
					_fnAddColumn( oSettings, anThs ? anThs[i] : null );
				}
				
				/* Add options from column definations */
				if ( typeof oInit.aoColumnDefs != 'undefined' )
				{
					/* Loop over the column defs array - loop in reverse so first instace has priority */
					for ( i=oInit.aoColumnDefs.length-1 ; i>=0 ; i-- )
					{
						/* Each column def can target multiple columns, as it is an array */
						var aTargets = oInit.aoColumnDefs[i].aTargets;
						if ( !$.isArray( aTargets ) )
						{
							_fnLog( oSettings, 1, 'aTargets must be an array of targets, not a '+(typeof aTargets) );
						}
						for ( j=0, jLen=aTargets.length ; j<jLen ; j++ )
						{
							if ( typeof aTargets[j] == 'number' && aTargets[j] >= 0 )
							{
								/* 0+ integer, left to right column counting. We add columns which are unknown
								 * automatically. Is this the right behaviour for this? We should at least
								 * log it in future. We cannot do this for the negative or class targets, only here.
								 */
								while( oSettings.aoColumns.length <= aTargets[j] )
								{
									_fnAddColumn( oSettings );
								}
								_fnColumnOptions( oSettings, aTargets[j], oInit.aoColumnDefs[i] );
							}
							else if ( typeof aTargets[j] == 'number' && aTargets[j] < 0 )
							{
								/* Negative integer, right to left column counting */
								_fnColumnOptions( oSettings, oSettings.aoColumns.length+aTargets[j], 
									oInit.aoColumnDefs[i] );
							}
							else if ( typeof aTargets[j] == 'string' )
							{
								/* Class name matching on TH element */
								for ( k=0, kLen=oSettings.aoColumns.length ; k<kLen ; k++ )
								{
									if ( aTargets[j] == "_all" ||
										 oSettings.aoColumns[k].nTh.className.indexOf( aTargets[j] ) != -1 )
									{
										_fnColumnOptions( oSettings, k, oInit.aoColumnDefs[i] );
									}
								}
							}
						}
					}
				}
				
				/* Add options from column array - after the defs array so this has priority */
				if ( typeof aoColumnsInit != 'undefined' )
				{
					for ( i=0, iLen=aoColumnsInit.length ; i<iLen ; i++ )
					{
						_fnColumnOptions( oSettings, i, aoColumnsInit[i] );
					}
				}
				
				/*
				 * Sorting
				 * Check the aaSorting array
				 */
				for ( i=0, iLen=oSettings.aaSorting.length ; i<iLen ; i++ )
				{
					if ( oSettings.aaSorting[i][0] >= oSettings.aoColumns.length )
					{
						oSettings.aaSorting[i][0] = 0;
					}
					var oColumn = oSettings.aoColumns[ oSettings.aaSorting[i][0] ];
					
					/* Add a default sorting index */
					if ( typeof oSettings.aaSorting[i][2] == 'undefined' )
					{
						oSettings.aaSorting[i][2] = 0;
					}
					
					/* If aaSorting is not defined, then we use the first indicator in asSorting */
					if ( typeof oInit.aaSorting == "undefined" && 
							 typeof oSettings.saved_aaSorting == "undefined" )
					{
						oSettings.aaSorting[i][1] = oColumn.asSorting[0];
					}
					
					/* Set the current sorting index based on aoColumns.asSorting */
					for ( j=0, jLen=oColumn.asSorting.length ; j<jLen ; j++ )
					{
						if ( oSettings.aaSorting[i][1] == oColumn.asSorting[j] )
						{
							oSettings.aaSorting[i][2] = j;
							break;
						}
					}
				}
					
				/* Do a first pass on the sorting classes (allows any size changes to be taken into
				 * account, and also will apply sorting disabled classes if disabled
				 */
				_fnSortingClasses( oSettings );
				
				/*
				 * Final init
				 * Sanity check that there is a thead and tbody. If not let's just create them
				 */
				if ( this.getElementsByTagName('thead').length === 0 )
				{
					this.appendChild( document.createElement( 'thead' ) );
				}
				
				if ( this.getElementsByTagName('tbody').length === 0 )
				{
					this.appendChild( document.createElement( 'tbody' ) );
				}
				
				oSettings.nTHead = this.getElementsByTagName('thead')[0];
				oSettings.nTBody = this.getElementsByTagName('tbody')[0];
				if ( this.getElementsByTagName('tfoot').length > 0 )
				{
					oSettings.nTFoot = this.getElementsByTagName('tfoot')[0];
				}
				
				/* Check if there is data passing into the constructor */
				if ( bUsePassedData )
				{
					for ( i=0 ; i<oInit.aaData.length ; i++ )
					{
						_fnAddData( oSettings, oInit.aaData[ i ] );
					}
				}
				else
				{
					/* Grab the data from the page */
					_fnGatherData( oSettings );
				}
				
				/* Copy the data index array */
				oSettings.aiDisplay = oSettings.aiDisplayMaster.slice();
				
				/* Initialisation complete - table can be drawn */
				oSettings.bInitialised = true;
				
				/* Check if we need to initialise the table (it might not have been handed off to the
				 * language processor)
				 */
				if ( bInitHandedOff === false )
				{
					_fnInitalise( oSettings );
				}
			});
		};
	})(jQuery, window, document);
/*JQuery Transform CSS*/
	/**/(function ($) {
		// Monkey patch jQuery 1.3.1+ to add support for setting or animating CSS
		// scale and rotation independently.
		// 2009-2010 Zachary Johnson www.zachstronaut.com
		// Updated 2010.11.06
		var rotateUnits = 'deg';
		$.fn.rotate = function (val) {
			var style = $(this).css('transform') || 'none';
			if(typeof val == 'undefined') {
				if(style) {
					var m = style.match(/rotate\(([^)]+)\)/);
					if(m && m[1]) {
						return m[1];
					}
				}
				return 0;
			}
			var m = val.toString().match(/^(-?\d+(\.\d+)?)(.+)?$/);
			if(m) {
				if(m[3]) {
					rotateUnits = m[3];
				}
				$(this).css({
					'-webkit-transform':style.replace(/none|rotate\([^)]*\)/, '') + 'rotate(' + m[1] + rotateUnits + ')',
					'-moz-transform':	style.replace(/none|rotate\([^)]*\)/, '') + 'rotate(' + m[1] + rotateUnits + ')',
					'-ms-transform':	style.replace(/none|rotate\([^)]*\)/, '') + 'rotate(' + m[1] + rotateUnits + ')',
					'-o-transform':		style.replace(/none|rotate\([^)]*\)/, '') + 'rotate(' + m[1] + rotateUnits + ')',
					'transform':		style.replace(/none|rotate\([^)]*\)/, '') + 'rotate(' + m[1] + rotateUnits + ')'
				});
			}
			return this;
		}
		// Note that scale is unitless.
		$.fn.scale = function (val, duration, options) {
			var style = $(this).css('transform');
			if(typeof val == 'undefined') {
				if(style) {
					var m = style.match(/scale\(([^)]+)\)/);
					if(m && m[1]) {
						return m[1];
					}
				}
				return 1;
			}
			$(this).css({
				'-webkit-transform':	style.replace(/none|scale\([^)]*\)/, '') + 'scale(' + val + ')',
				'-moz-transform':		style.replace(/none|scale\([^)]*\)/, '') + 'scale(' + val + ')',
				'-ms-transform':		style.replace(/none|scale\([^)]*\)/, '') + 'scale(' + val + ')',
				'-o-transform':			style.replace(/none|scale\([^)]*\)/, '') + 'scale(' + val + ')',
				'transform':			style.replace(/none|scale\([^)]*\)/, '') + 'scale(' + val + ')'

			});
			return this;
		}
		// fx.cur() must be monkey patched because otherwise it would always
		// return 0 for current rotate and scale values
		var curProxied = $.fx.prototype.cur;
		$.fx.prototype.cur = function () {
			if(this.prop == 'rotate') {
				return parseFloat($(this.elem).rotate());
			} else {
				if(this.prop == 'scale') {
					return parseFloat($(this.elem).scale());
				}
			}
			return curProxied.apply(this, arguments);
		}
		$.fx.step.rotate = function (fx) {
			$(fx.elem).rotate(fx.now + rotateUnits);
		}
		$.fx.step.scale = function (fx) {
			$(fx.elem).scale(fx.now);
		}
		/*
		Starting on line 3905 of jquery-1.3.2.js we have this code:
		// We need to compute starting value
		if ( unit != "px" ) {
			self.style[ name ] = (end || 1) + unit;
			start = ((end || 1) / e.cur(true)) * start;
			self.style[ name ] = start + unit;
		}
		This creates a problem where we cannot give units to our custom animation
		because if we do then this code will execute and because self.style[name]
		does not exist where name is our custom animation's name then e.cur(true)
		will likely return zero and create a divide by zero bug which will set
		start to NaN.
		The following monkey patch for animate() gets around this by storing the
		units used in the rotation definition and then stripping the units off.
		*/
		var animateProxied = $.fn.animate;
		$.fn.animate = function (prop) {
			if(typeof prop['rotate'] != 'undefined') {
				var m = prop['rotate'].toString().match(/^(([+-]=)?(-?\d+(\.\d+)?))(.+)?$/);
				if(m && m[5]) {
					rotateUnits = m[5];
				}
				prop['rotate'] = m[1];
			}
			return animateProxied.apply(this, arguments);
		}
	})(jQuery);
/*JQuery 3D Transform CSS*/
	(function ($) {
		// Monkey patch jQuery 1.3.1+ css() method to support CSS 'transform'
		// property uniformly across Safari/Chrome/Webkit, Firefox 3.5+, IE 9+, and Opera 11+.
		// 2009-2011 Zachary Johnson www.zachstronaut.com
		// Updated 2011.05.04 (May the fourth be with you!)
		function getTransformProperty(element) {
			// Try transform first for forward compatibility
			// In some versions of IE9, it is critical for msTransform to be in
			// this list before MozTranform.
			var properties = ['transform', 'WebkitTransform', 'msTransform', 'MozTransform', 'OTransform'];
			var p;
			while(p = properties.shift()) {
				if(typeof(element.style[p]) != 'undefined') {
					return p;
				}
			}
			// Default to transform also
			return 'transform';
		}

		var _propsObj = null;

		var proxied = $.fn.css;
		$.fn.css = function (arg, val) {
			// Temporary solution for current 1.6.x incompatibility, while
			// preserving 1.3.x compatibility, until I can rewrite using CSS Hooks
			if(_propsObj === null) {
				if (typeof $.cssProps != 'undefined') {
					_propsObj = $.cssProps;
				} else if (typeof $.props != 'undefined') {
					_propsObj = $.props;
				} else {
					_propsObj = {}
				}
			}

			// Find the correct browser specific property and setup the mapping using
			// $.props which is used internally by jQuery.attr() when setting CSS
			// properties via either the css(name, value) or css(properties) method.
			// The problem with doing this once outside of css() method is that you
			// need a DOM node to find the right CSS property, and there is some risk
			// that somebody would call the css() method before body has loaded or any
			// DOM-is-ready events have fired.
			if(
				typeof(_propsObj['transform']) == 'undefined' &&
				(arg == 'transform' ||
					(typeof arg == 'object' && typeof arg['transform'] != 'undefined')
				)
			) {
				_propsObj['transform'] = getTransformProperty(this.get(0));
			}

			// We force the property mapping here because jQuery.attr() does
			// property mapping with jQuery.props when setting a CSS property,
			// but curCSS() does *not* do property mapping when *getting* a
			// CSS property.  (It probably should since it manually does it
			// for 'float' now anyway... but that'd require more testing.)
			//
			// But, only do the forced mapping if the correct CSS property
			// is not 'transform' and is something else.
			if(_propsObj['transform'] != 'transform') {
				// Call in form of css('transform' ...)
				if(arg == 'transform') {
					arg = _propsObj['transform'];

					// User wants to GET the transform CSS, and in jQuery 1.4.3
					// calls to css() for transforms return a matrix rather than
					// the actual string specified by the user... avoid that
					// behavior and return the string by calling jQuery.style()
					// directly
					if(typeof(val) == 'undefined' && jQuery.style) {
						return jQuery.style(this.get(0), arg);
					}
				} else {
					if(typeof(arg) == 'object' && typeof(arg['transform']) != 'undefined') { // Call in form of css({'transform': ...})
						arg[_propsObj['transform']] = arg['transform'];
						delete arg['transform'];
					}
				}
			}
			return proxied.apply(this, arguments);
		};
	})(jQuery);


	(function ($) {
		// rotate3Di v0.9 - 2009.03.11 Zachary Johnson www.zachstronaut.com
		// "3D" isometric rotation and animation using CSS3 transformations
		// currently supported in Safari/Chrome/Webkit, Firefox 3.5+, IE 9+,
		// and Opera 11+. Tested with jQuery 1.3.x through 1.6.


		var calcRotate3Di = {
			direction: function (now) {return (now < 0 ? -1 : 1);},
			degrees: function (now) {return (Math.floor(Math.abs(now))) % 360;},
			scale: function (degrees) {return (1 - (degrees % 180) / 90)
				* (degrees >= 180 ? -1 : 1);}
		}

		// Custom animator
		$.fx.step.rotate3Di = function (fx) {
			direction = calcRotate3Di.direction(fx.now);
			degrees = calcRotate3Di.degrees(fx.now);
			scale = calcRotate3Di.scale(degrees);

			if(fx.options && typeof(fx.options['sideChange']) != 'undefined') {
				if(fx.options['sideChange']) {
					var prevScale = $(fx.elem).data('rotate3Di.prevScale');

					// negative scale means back side
					// positive scale means front side
					// if one is pos and one is neg then we have changed sides
					// (but one could actually be zero).
					if(scale * prevScale <= 0) {
						// if one was zero, deduce from the other which way we are
						// flipping: to the front (pos) or to the back (neg)?
						fx.options['sideChange'].call(
							fx.elem,
							(scale > 0 || prevScale < 0)
						);
						// this was commented out to prevent calling it more than
						// once, but then that broke legitimate need to call it
						// more than once for rotations of 270+ degrees!
						//fx.options['sideChange'] = null;

						// this is my answer to commenting the above thing out...
						// if we just flipped sides, flip-flop the old previous
						// scale so that we can fire the sideChange event correctly
						// if we flip sides again.
						$(fx.elem).data(
							'rotate3Di.prevScale',
							$(fx.elem).data('rotate3Di.prevScale') * -1
						);
					}
				}

				// Making scale positive before setting it prevents flip-side
				// content from showing up mirrored/reversed.
				scale = Math.abs(scale);
			}

			// Since knowing the current degrees is important for detecting side
			// change, and since Firefox 3.0.x seems to not be able to reliably get
			// a value for css('transform') the first time after the page is loaded
			// with my flipbox demo... I am storing degrees someplace where I know
			// I can get them.
			$(fx.elem).data('rotate3Di.degrees', direction * degrees);
			$(fx.elem).css(
				'transform',
				'skew(0deg, ' + direction * degrees + 'deg)'
					+ ' scale(' + scale + ', 1)'
			);
		}

		// fx.cur() must be monkey patched because otherwise it would always
		// return 0 for current rotate3Di value
		var proxied = $.fx.prototype.cur;
		$.fx.prototype.cur = function () {
			if(this.prop == 'rotate3Di') {
				var style = $(this.elem).css('transform');
				if(style) {
					var m = style.match(/, (-?[0-9]+)deg\)/);
					if(m && m[1]) {
						return parseInt(m[1]);
					} else {
						return 0;
					}
				}
			}
			return proxied.apply(this, arguments);
		}

		$.fn.rotate3Di = function (degrees, duration, options) {
			if(typeof duration == 'undefined') {
				duration = 0;
			}
			if(typeof options == 'object') {
				$.extend(options, {duration: duration});
			} else {
				options = {duration: duration};
			}
			if(degrees == 'toggle') {
				// Yes, jQuery has the toggle() event but that's only good for
				// clicks, and likewise hover() is only good for mouse in/out.
				// What if you want to toggle based on a timer or something else?
				if($(this).data('rotate3Di.flipped')) {
					degrees = 'unflip'
				} else {
					degrees = 'flip';
				}
			}
			if(degrees == 'flip') {
				$(this).data('rotate3Di.flipped', true);

				var direction = -1;
				if(
					typeof(options) == 'object' &&
					options['direction'] &&
					options['direction'] == 'clockwise'
				) {
					direction = 1;
				}

				degrees = direction * 180;

			} else if (degrees == 'unflip') {
				$(this).data('rotate3Di.flipped', false);

				degrees = 0;
			}

			var d = $(this).data('rotate3Di.degrees') || 0;
			$(this).data('rotate3Di.prevScale', calcRotate3Di.scale(calcRotate3Di.degrees(d))
		);
		$(this).animate({rotate3Di: degrees}, options);
		}
	})(jQuery);
/*JQuery Local Storage*/
	/*
	 * ----------------------------- JSTORAGE -------------------------------------
	 * Simple local storage wrapper to save data on the browser side, supporting
	 * all major browsers - IE6+, Firefox2+, Safari4+, Chrome4+ and Opera 10.5+
	 *
	 * Copyright (c) 2010 Andris Reinman, andris.reinman@gmail.com
	 * Project homepage: www.jstorage.info
	 *
	 * Licensed under MIT-style license:
	 *
	 * Permission is hereby granted, free of charge, to any person obtaining a copy
	 * of this software and associated documentation files (the "Software"), to deal
	 * in the Software without restriction, including without limitation the rights
	 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	 * copies of the Software, and to permit persons to whom the Software is
	 * furnished to do so, subject to the following conditions:
	 *
	 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
	 * SOFTWARE.
	 */

	/**
	 * $.jStorage
	 *
	 * USAGE:
	 *
	 * jStorage requires Prototype, MooTools or jQuery! If jQuery is used, then
	 * jQuery-JSON (http://code.google.com/p/jquery-json/) is also needed.
	 * (jQuery-JSON needs to be loaded BEFORE jStorage!)
	 *
	 * Methods:
	 *
	 * -set(key, value[, options])
	 * $.jStorage.set(key, value) -> saves a value
	 *
	 * -get(key[, default])
	 * value = $.jStorage.get(key [, default]) ->
	 *    retrieves value if key exists, or default if it doesn't
	 *
	 * -deleteKey(key)
	 * $.jStorage.deleteKey(key) -> removes a key from the storage
	 *
	 * -flush()
	 * $.jStorage.flush() -> clears the cache
	 *
	 * -storageObj()
	 * $.jStorage.storageObj() -> returns a read-ony copy of the actual storage
	 *
	 * -storageSize()
	 * $.jStorage.storageSize() -> returns the size of the storage in bytes
	 *
	 * -index()
	 * $.jStorage.index() -> returns the used keys as an array
	 *
	 * -storageAvailable()
	 * $.jStorage.storageAvailable() -> returns true if storage is available
	 *
	 * -reInit()
	 * $.jStorage.reInit() -> reloads the data from browser storage
	 *
	 * <value> can be any JSON-able value, including objects and arrays.
	 *
	 **/


	;(function($){
		if(!$ || !($.toJSON || Object.toJSON || window.JSON)){
			throw new Error("jQuery, MooTools or Prototype needs to be loaded before jStorage!");
		}
		var
			/* This is the object, that holds the cached values */
			_storage			= {},
			/* Actual browser storage (localStorage or globalStorage['domain']) */
			_storage_service	= {jStorage:"{}"},
			/* DOM element for older IE versions, holds userData behavior */
			_storage_elm		= null,
			/* How much space does the storage take */
			_storage_size		= 0,
			/* function to encode objects to JSON strings */
			json_encode			= $.toJSON || Object.toJSON || (window.JSON && (window.JSON.encode || window.JSON.stringify)),
			/* function to decode objects from JSON strings */
			json_decode			= $.evalJSON || (window.JSON && (window.JSON.decode || window.JSON.parse)) || function(str){
				return String(str).evalJSON();
			},
			/* which backend is currently used */
			_backend			= false,
			/* Next check for TTL */
			_ttl_timeout,
			/**
			 * XML encoding and decoding as XML nodes can't be JSON'ized
			 * XML nodes are encoded and decoded if the node is the value to be saved
			 * but not if it's as a property of another object
			 * Eg. -
			 *   $.jStorage.set("key", xmlNode);        // IS OK
			 *   $.jStorage.set("key", {xml: xmlNode}); // NOT OK
			 */
			_XMLService			= {
				/**
				 * Validates a XML node to be XML
				 * based on jQuery.isXML function
				 */
				isXML: function(elm) {
					var documentElement = (elm ? elm.ownerDocument || elm : 0).documentElement;
					return documentElement ? documentElement.nodeName !== "HTML" : false;
				},
				/**
				 * Encodes a XML node to string
				 * based on http://www.mercurytide.co.uk/news/article/issues-when-working-ajax/
				 */
				encode: function(xmlNode) {
					if(!this.isXML(xmlNode)) {
						return false;
					}
					try { // Mozilla, Webkit, Opera
						return new XMLSerializer().serializeToString(xmlNode);
					} catch(E1) {
						try { // IE
							return xmlNode.xml;
						} catch(E2) {}
					}
					return false;
				},
				/**
				 * Decodes a XML node from string
				 * loosely based on http://outwestmedia.com/jquery-plugins/xmldom/
				 */
				decode: function(xmlString) {
					var dom_parser = ("DOMParser" in window && (new DOMParser()).parseFromString) ||
							(window.ActiveXObject && function(_xmlString) {
						var xml_doc		= new ActiveXObject('Microsoft.XMLDOM');
						xml_doc.async	= 'false';
						xml_doc.loadXML(_xmlString);
						return xml_doc;
					}),
					resultXML;
					if(!dom_parser) {
						return false;
					}
					resultXML = dom_parser.call("DOMParser" in window && (new DOMParser()) || window, xmlString, 'text/xml');
					return this.isXML(resultXML)?resultXML:false;
				}
			};
		////////////////////////// PRIVATE METHODS ////////////////////////
		/**
		 * Initialization function. Detects if the browser supports DOM Storage
		 * or userData behavior and behaves accordingly.
		 * @returns undefined
		 */
		function _init() {
			/* Check if browser supports localStorage */
			var localStorageReallyWorks = false;
			if("localStorage" in window){
				try {
					window.localStorage.setItem('_tmptest', 'tmpval');
					localStorageReallyWorks = true;
					window.localStorage.removeItem('_tmptest');
				} catch(BogusQuotaExceededErrorOnIos5) {
					// Thanks be to iOS5 Private Browsing mode which throws
					// QUOTA_EXCEEDED_ERRROR DOM Exception 22.
				}
			}
			if(localStorageReallyWorks){
				try {
					if(window.localStorage) {
						_storage_service = window.localStorage;
						_backend = "localStorage";
					}
				} catch(E3) {/* Firefox fails when touching localStorage and cookies are disabled */}
			}
			/* Check if browser supports globalStorage */
			else if("globalStorage" in window){
				try {
					if(window.globalStorage) {
						_storage_service = window.globalStorage[window.location.hostname];
						_backend = "globalStorage";
					}
				} catch(E4) {/* Firefox fails when touching localStorage and cookies are disabled */}
			}
			/* Check if browser supports userData behavior */
			else {
				_storage_elm = document.createElement('link');
				if(_storage_elm.addBehavior){

					/* Use a DOM element to act as userData storage */
					_storage_elm.style.behavior = 'url(#default#userData)';

					/* userData element needs to be inserted into the DOM! */
					document.getElementsByTagName('head')[0].appendChild(_storage_elm);

					_storage_elm.load("jStorage");
					var data = "{}";
					try{
						data = _storage_elm.getAttribute("jStorage");
					}catch(E5){}
					_storage_service.jStorage = data;
					_backend = "userDataBehavior";
				} else {
					_storage_elm = null;
					return;
				}
			}
			_load_storage();
			// remove dead keys
			_handleTTL();
		}
		/**
		 * Loads the data from the storage based on the supported mechanism
		 * @returns undefined
		 */
		function _load_storage() {
			/* if jStorage string is retrieved, then decode it */
			if(_storage_service.jStorage){
				try{
					_storage = json_decode(String(_storage_service.jStorage));
				}catch(E6){_storage_service.jStorage = "{}";}
			}else{
				_storage_service.jStorage = "{}";
			}
			_storage_size = _storage_service.jStorage?String(_storage_service.jStorage).length:0;
		}
		/**
		 * This functions provides the "save" mechanism to store the jStorage object
		 * @returns undefined
		 */
		function _save() {
			try{
				_storage_service.jStorage = json_encode(_storage);
				// If userData is used as the storage engine, additional
				if(_storage_elm) {
					_storage_elm.setAttribute("jStorage",_storage_service.jStorage);
					_storage_elm.save("jStorage");
				}
				_storage_size = _storage_service.jStorage?String(_storage_service.jStorage).length:0;
			}catch(E7){/* probably cache is full, nothing is saved this way*/}
		}
		/**
		 * Function checks if a key is set and is string or numberic
		 */
		function _checkKey(key) {
			if(!key || (typeof key != "string" && typeof key != "number")){
				throw new TypeError('Key name must be string or numeric');
			}
			if(key == "__jstorage_meta"){
				throw new TypeError('Reserved key name');
			}
			return true;
		}
		/**
		 * Removes expired keys
		 */
		function _handleTTL(){
			var curtime, i, TTL, nextExpire = Infinity, changed = false;
			clearTimeout(_ttl_timeout);
			if(!_storage.__jstorage_meta || typeof _storage.__jstorage_meta.TTL != "object"){
				// nothing to do here
				return;
			}
			curtime = +new Date();
			TTL = _storage.__jstorage_meta.TTL;
			for(i in TTL){
				if(TTL.hasOwnProperty(i)){
					if(TTL[i] <= curtime){
						delete TTL[i];
						delete _storage[i];
						changed = true;
					}else if(TTL[i] < nextExpire){
						nextExpire = TTL[i];
					}
				}
			}
			// set next check
			if(nextExpire != Infinity){
				_ttl_timeout = setTimeout(_handleTTL, nextExpire - curtime);
			}
			// save changes
			if(changed){
				_save();
			}
		}
		////////////////////////// PUBLIC INTERFACE /////////////////////////
		$.jStorage = {
			/* Version number */
			version: "0.1.7.0",
			/**
			 * Sets a key's value.
			 *
			 * @param {String} key - Key to set. If this value is not set or not
			 *              a string an exception is raised.
			 * @param {Mixed} value - Value to set. This can be any value that is JSON
			 *              compatible (Numbers, Strings, Objects etc.).
			 * @param {Object} [options] - possible options to use
			 * @param {Number} [options.TTL] - optional TTL value
			 * @returns the used value
			 */
			set: function(key, value, options) {
				_checkKey(key);
				options = options || {};
				if(_XMLService.isXML(value)) {
					value = {_is_xml:true,xml:_XMLService.encode(value)};
				}else if(typeof value == "function") {
					value = null; // functions can't be saved!
				}else if(value && typeof value == "object"){
					// clone the object before saving to _storage tree
					value = json_decode(json_encode(value));
				}
				_storage[key] = value;

				if(!isNaN(options.TTL)){
					this.setTTL(key, options.TTL);
					// also handles saving
				}else{
					_save();
				}
				return value;
			},
			/**
			 * Looks up a key in cache
			 *
			 * @param {String} key - Key to look up.
			 * @param {mixed} def - Default value to return, if key didn't exist.
			 * @returns the key value, default value or <null>
			 */
			get: function(key, def) {
				_checkKey(key);
				if(key in _storage){
					if(_storage[key] && typeof _storage[key] == "object" &&
							_storage[key]._is_xml &&
								_storage[key]._is_xml){
						return _XMLService.decode(_storage[key].xml);
					}else{
						return _storage[key];
					}
				}
				return typeof(def) == 'undefined' ? null : def;
			},
			/**
			 * Deletes a key from cache.
			 *
			 * @param {String} key - Key to delete.
			 * @returns true if key existed or false if it didn't
			 */
			deleteKey: function(key) {
				_checkKey(key);
				if(key in _storage){
					delete _storage[key];
					// remove from TTL list
					if(_storage.__jstorage_meta &&
					  typeof _storage.__jstorage_meta.TTL == "object" &&
					  key in _storage.__jstorage_meta.TTL){
						delete _storage.__jstorage_meta.TTL[key];
					}
					_save();
					return true;
				}
				return false;
			},
			/**
			 * Sets a TTL for a key, or remove it if ttl value is 0 or below
			 *
			 * @param {String} key - key to set the TTL for
			 * @param {Number} ttl - TTL timeout in milliseconds
			 * @returns true if key existed or false if it didn't
			 */
			setTTL: function(key, ttl) {
				var curtime = +new Date();
				_checkKey(key);
				ttl = Number(ttl) || 0;
				if(key in _storage){
					if(!_storage.__jstorage_meta){
						_storage.__jstorage_meta = {};
					}
					if(!_storage.__jstorage_meta.TTL){
						_storage.__jstorage_meta.TTL = {};
					}
					// Set TTL value for the key
					if(ttl>0){
						_storage.__jstorage_meta.TTL[key] = curtime + ttl;
					}else{
						delete _storage.__jstorage_meta.TTL[key];
					}
					_save();
					_handleTTL();
					return true;
				}
				return false;
			},
			/**
			 * Deletes everything in cache.
			 *
			 * @return true
			 */
			flush: function(){
				_storage = {};
				_save();
				return true;
			},
			/**
			 * Returns a read-only copy of _storage
			 *
			 * @returns Object
			*/
			storageObj: function(){
				function F() {}
				F.prototype = _storage;
				return new F();
			},
			/**
			 * Returns an index of all used keys as an array
			 * ['key1', 'key2',..'keyN']
			 *
			 * @returns Array
			*/
			index: function(){
				var index = [], i;
				for(i in _storage){
					if(_storage.hasOwnProperty(i) && i != "__jstorage_meta"){
						index.push(i);
					}
				}
				return index;
			},
			/**
			 * How much space in bytes does the storage take?
			 *
			 * @returns Number
			 */
			storageSize: function(){
				return _storage_size;
			},
			/**
			 * Which backend is currently in use?
			 *
			 * @returns String
			 */
			currentBackend: function(){
				return _backend;
			},
			/**
			 * Test if storage is available
			 *
			 * @returns Boolean
			 */
			storageAvailable: function(){
				return !!_backend;
			},
			/**
			 * Reloads the data from browser storage
			 *
			 * @returns undefined
			 */
			reInit: function(){
				var new_storage_elm, data;
				if(_storage_elm && _storage_elm.addBehavior){
					new_storage_elm = document.createElement('link');

					_storage_elm.parentNode.replaceChild(new_storage_elm, _storage_elm);
					_storage_elm = new_storage_elm;

					/* Use a DOM element to act as userData storage */
					_storage_elm.style.behavior = 'url(#default#userData)';

					/* userData element needs to be inserted into the DOM! */
					document.getElementsByTagName('head')[0].appendChild(_storage_elm);

					_storage_elm.load("jStorage");
					data = "{}";
					try{
						data = _storage_elm.getAttribute("jStorage");
					}catch(E5){}
					_storage_service.jStorage = data;
					_backend = "userDataBehavior";
				}
				_load_storage();
			}
		};
		// Initialize jStorage
		_init();
	})(window.$ || window.jQuery);
/*JQuery File Input*/
	/**
	 * --------------------------------------------------------------------
	 * jQuery File Input Widget
	 * Author: Justin Jones, justin@jstnjns.com
	 * Version: 0.0.2
	 * Copyright (c) 2011 Justin Jones
	 *
	 * Styling a <input type="file" /> sucks.  Or, it used to.. before this
	 * widget was created. You can now style them just like the text inputs
	 * and buttons already being used in your forms.
	 *
	 * Uses similar method as http://www.quirksmode.org/dom/inputfile.html
	 *
	 * --------------------------------------------------------------------
	 */
	(function($) {
		var elements = {},
		methods = {
			init: function() {
				return this.each(function() {
					var $file	= $(this).addClass('ui-file'),
					$wrapper	=	$('<div />', {
										'class'	: 'ui-file-wrapper'
									}).insertBefore($file),
					$fake_group	=	$('<div />', {
										'class' : 'ui-file-fake-wrapper'
									}).appendTo($wrapper),
					$fake_input	=	(elements.$fake_input = $('<input />', {
										'class' : 'ui-file-fake-input',
										'type'  : 'text'
									})).appendTo($fake_group),
					$fake_button=	(elements.$fake_button = $('<button />', {
										'class' : 'ui-file-fake-button',
										'type'  : 'button',
										'text'  : 'Upload',
										'id'	: 'uploadButton'
									})).appendTo($fake_group);
					$file.prependTo($wrapper).change(function() {$fake_input.val($file.val());});
					$file.attr('disabled') && disable();
				});
			},
			disable: function() {
				elements.$fake_button.attr('disabled', 'disabled').addClass('ui-disabled');
				elements.$fake_input.attr('disabled', 'disabled').addClass('ui-disabled');
			},
			enable: function() {
				elements.$fake_button.attr('disabled', false).removeClass('ui-disabled');
				elements.$fake_input.attr('disabled', false).removeClass('ui-disabled');
			}
		};
		$.fn.file = function(method) {
			if(methods[method]) {
				return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
			} else {
				if(typeof(method) === 'object' || !method) {
					return methods.init.apply(this, arguments);
				}
			}
			$.error('Method ' +  method + ' does not exist on jQuery.tooltip');
		};
	})(jQuery);

/*Globals*/
	var layer_currentViewAllowed	= true;
	var domainProxy					= "proxy.php?url";																	//====================================\
	var wsdlURL						= "http://rsg.pml.ac.uk/wps/generic.cgi?WSDL";										//====================================|
	var arrContainers				= [];																				//====			=======			======|
	var initialWSDL					= false;																			//====			=======			======|
	var wsdlList					= '';																				//====			=======			======|
	var layerEditor					= null;																				//====			=======			======|
	var currentProgressBar			= 0;																				//====			=======			======|
	var current_scale				= 1;																				//====			=======			======|
	var wireitdraggableelementbody	= false;																			//====			=======			======|
	var initialScripts				= 0;																				//====			=======			======|
	var initialLoadedScripts		= 0;																				//====			=======			======|
	var initialLoaded				= false;
	var devel						= true;		//(window.location && window.location.host == 'localhost');
	var layer_dirty					= false;																					//=============================
	var layer_mouseDown				= false;																				//===============================
	var layer_ctrlDown				= false;																				//==========
	var layer_ctrlWindows			= [];																				//========
	var layer_currentWindow			= null;																				//=====
	var layer_currentWindowOffset	= [0, 0];																			//====
	var layer_currentMouseOffset	= [0, 0];																			//====
	var layer_currentViewOffset		= [0, 0];																			//=====
	var layer_currentViewMovable	= false;																			//========
	var drawingWire					= false;																				//==========
	var drawingWireWindow			= null;																					//===============================
	var drawingWireIO				= null;																						//=============================
	var service_mouseDown			= false;
	var service_currentWindow		= null;																				
	var service_currentWindowOffset	= [0, 0];																			//====================================|
	var snapToGrid					= false;																			//====================================|
	var snapToSize					= 60;																											//=====
	var help_mousetimer				= null;																										//=====
	var userUnderstandsGlowError	= false;																								//=====
	var panelInits 					= {																									//=====
		settings:	null																											//=====
	};																															//=====
	var mousewhich					= 0;																							//=====
	var loadedWSDLs					= [];																								//=====
	var previousSave_prompt			= 'Workflow';																							//=====
	var importData					= null;																										//=====
	var importDataListener			= null;																											//=====
	var layer_options				= [];																				//====================================|
	var layer_optionDefaults		= {																					//====================================|
		title:		'Window',
		close:		true,
		collapse:	true,																								//====							======|
		collapsed:	false,																								//====							======|
		tooltip:	'',																									//====							======|
		body:		'',																									//====							======|
		help:		{																									//====================================|
			enabled:	false,																							//====================================|
			content:	''																								//====							======|
		}																												//====							======|
	};																													//====							======|
/*Functions*/																											//====							======|
	/*Types*/
		function typeString(param) {	return (typeof(param) == 'string');};
		function typeNumber(param) {	return (typeof(param) == 'number');};											  //====		    ==============-
		function typeNumStr(param) {	return (typeNumber(param) || typeString(param));};								 //====			  ==================\
		function typeObject(param) {	return (typeof(param) == 'object');};											//====			 ====================\
		function typeFunction(param) {	return (typeof(param) == 'function');};											//====			 =======	  ========|
	/*Templates*/																										//====			======= 	   =======|
		function ajax(file, avoidCache) {																				//====			======			======|
			return $.ajax({url: file + (avoidCache ? '?_t=' + (new Date().getTime()) : ''), async: false}).responseText;//=====			======			======|
		}																												 //======	   ======			======|
		function getTemplate(template, avoidCache) {																	  //================		   =======|
			return ajax('templates/' + template + '.xhtml', avoidCache);												   //==============			 ========/
		}																												     //=========			=======/
	function xmlStrip(value) {return (value == undefined) ? '' : value.replace(/[^a-zA-Z0-9]/g, '_');}
	/*Colours*/
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
	/*UUID(*/
		function UUID(){}
		UUID.generate=function(){var a=UUID._getRandomInt,b=UUID._hexAligner;return b(a(32),8)+"-"+b(a(16),4)+"-"+b(16384|a(12),4)+"-"+b(32768|a(14),4)+"-"+b(a(48),12)};
		UUID._getRandomInt=function(a){if(a<0)return NaN;if(a<=30)return 0|Math.random()*(1<<a);if(a<=53)return(0|Math.random()*1073741824)+(0|Math.random()*(1<<a-30))*1073741824;return NaN};
		UUID._getIntAligner=function(a){return function(b,f){for(var c=b.toString(a),d=f-c.length,e="0";d>0;d>>>=1,e+=e)if(d&1)c=e+c;return c}};
		UUID._hexAligner=UUID._getIntAligner(16);
	/*Debug*/
		var cl = function() {
			if(typeof(console) == 'undefined' || typeof(console.log) == 'undefined') {
				alert(arguments);
			} else {
				console.log(arguments);
			}
		};
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
	/*Panel*/
		function panelOpen(e) {
			$("div.panel:not(#" + this.id + ")");
			each(function(index,el) {
				if($(el).is(":visible")) {
					idEl = $(el).attr("id");
					$("a[panel=" + idEl + "]").trigger("click");
				};
			});
		}
		function load_panel(panel, callback) {
			if($panel_handler.length < 1) {
				$panel_handler = $('#panelGroup');
			}
			//console.log($(getTemplate(panel + 'Panel', true)));
			$panel_handler.append($($.data(document, panel + 'Panel')).bind('click', function() {return callback();}));
		}
	/*Menu*/
		function alignMenu($this, topMost, leftMost, rightMost, bottomMost) {
			var position = [
				((parseInt($(window).width()) / 2)	- (parseInt($('#' + $this.attr('panel')).width()) / 2))		+ 'px',
				((parseInt($(window).height()) / 2)	- (parseInt($('#' + $this.attr('panel')).height()) / 2))	+ 'px'
			];
			if(topMost)		{position[1] = 0;}
			if(leftMost)	{position[0] = 0;}
			if(rightMost)	{position[0] = (parseInt($(window).width())		- parseInt($('#' + $this.attr('panel')).width()))	+ 'px';}
			if(bottomMost)	{position[0] = (parseInt($(window).height())	- parseInt($('#' + $this.attr('panel')).height()))	+ 'px';}
			$('#' + $this.attr('panel')).css({
				'left': position[0],
				'top': position[1]
			});
		}
		function load_menu(panel, text, callback) {
			var $menu = $($.data(document, 'template-menu'));
			$menu_handler.append($menu.attr('id', panel + $menu.attr('id')).attr('panel', panel + $menu.attr('panel')).text(text).bind('click', function() {callback($(this));return false;}).bind("isOpen", panelOpen));
		}
	/*Parse WSDL*/
		function isValidURL(textval) {
			var urlregex = new RegExp(
				"^(http|https|ftp)\://([a-zA-Z0-9\.\-]+(\:[a-zA-Z0-9\.&amp;%\$\-]+)*@)*((25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9])\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[0-9])|([a-zA-Z0-9\-]+\.)*[a-zA-Z0-9\-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(\:[0-9]+)*(/($|[a-zA-Z0-9\.\,\?\'\\\+&amp;%\$#\=~_\-]+))*$");
			return urlregex.test(textval);
		}

		function addContainer(labelText,inputs, outputs, wsdl){
			//creates and adds container to arrContainer based on the last container position
			var obj = {'label':labelText,containerInputs:inputs,containerOutputs:outputs, wsdl: wsdl};
			arrContainers.push(obj);
			wsdl = wsdl.replace(/\./g, '').replace(/\//g, '').replace(/\\/g, '');
			if(typeof(loadedWSDLs[wsdl]) == 'undefined') {
				loadedWSDLs[wsdl] = [];
			}
			loadedWSDLs[wsdl][loadedWSDLs[wsdl].length] = obj;
			//console.warn(wsdl);
		}

		function getMessage(data, name) {
			console.log(typeof(data), "MESSAGE", data);
			if(typeof(data) == 'undefined') {
			} else {
			//} && $(data).length > 0) {
				return $(data).find('message[name="' + name + '"]');
			}
			return $('');
		}

		function getLocalName(elementName) {
			//from element name, remove name space if existing
			//console.log(elementName);
			//console.log('elementName');
			try {
			if(elementName.indexOf(":") < 0) {
				//no namespace
				return elementName;
			} else  {
				return elementName.split(":")[1];
			}
			} catch(e) {}
		}

		function getIOFromSchema(schemaEl, elCount, prog_callback, counter) {
			//get element content from schema, it can be I/O
			//returns an array with 0,1,n size according to the WSDL caracteristics
			//3 situations, no input, one input or multiple inputs
			var arr=new Array();
			//no input
			if(!schemaEl.attr('sequence')) {
				var elements = schemaEl.find('element');
				if(elements.length > 0) {
					elements.each(function(index, value) {
						arr.push($(value).attr('name'));
						if(elCount && prog_callback) {
						//prog_callback(arrContainers.length, elCount);
						}
					});
				} else {
					arr.push(schemaEl.attr('name'));
				}
			}
			currentProgressBar = (counter / elCount) * 100;
			//alert(currentProgressBar);
			//upb(prog_callback, counter, elCount);
			if(elCount && prog_callback) {
				//alert(arrContainers.length);
				//prog_callback(arrContainers.length, elCount);
			}

			return arr;

		} //end function


		function getElement(data, name) {
			return $(data).find('types schema element[name="' + name + '"]');
		}

		function URLExists(fileLocation) {
			//console.log(fileLocation);
			return getTemplate('../' + fileLocation + '&head=true&') == 200 ? true : false;
			//var response = getTemplate('..')
			console.log(fileLocation);
			console.log(fileLocation);
			console.log(fileLocation);
			var response = $.ajax({
				url: fileLocation,
				type: 'HEAD',
				async: false
			}).status;
			return (response == 404) ? false : true;
		}

		function parseWSDL(wsdlURL, callback, prog_callback){
			if(loadedWSDLs[wsdlURL.replace(/\./g, '').replace(/\//g, '').replace(/\\/g, '')]) {
				callback(loadedWSDLs[wsdlURL.replace(/\./g, '').replace(/\//g, '').replace(/\\/g, '')]);
				if(prog_callback) {
					prog_callback(-1, 100);
				}
				return;
			}

			//check if URL existis and is ok
			//console.log((domainProxy ? domainProxy + '=' : '') + wsdlURL);
			if(!(URLExists((domainProxy ? domainProxy + '=' : '') + wsdlURL))) {
				alert("NO WSDL IN URL~") //need a proper pop up
				return null;
			}
			$.ajax({
				url: (domainProxy ? domainProxy + '=' : '') + wsdlURL,
				type: "POST",
				dataType: "html",
				async: true,
				success: function(data) {
					addContainer('', {}, {}, wsdlURL);
					var resource_found = false;
					var $data = $('<wsdl>' + $(data).outerHTML() + '</wsdl>').find('definitions');
					var $error = $data.find('parseerror');

					if($error.length > 0) {
						alert($error.text());
						return null;
					}

					var counter = 0;
					var elCount = $data.find('sequence element[name="input"]').length;
					currentProgressBar = 0;
					var $operations = $data.find('portType operation');
					$operations.each(function(index, value) {
						value = $(value);
						++counter;
						var outputArray = [];
						var outName = getElement($data, getLocalName($(getMessage($data, getLocalName(value.find('output').attr('message')))).find('part').attr('element')));
						if($(outName).length > 0) {
							outputArray = getIOFromSchema(outName, $operations.length, prog_callback, counter, wsdlURL);
							var inputArray = [];
							var inName = getElement($data, getLocalName(getMessage($data, getLocalName($(value).find('input').attr('message'))).find('part').attr('element')));
							if(inName.length > 0) {
								inputArray = getIOFromSchema(inName, $operations.length, prog_callback, counter);
							}
							addContainer($(value).attr('name'), inputArray, outputArray, wsdlURL);
							if(callback && (index == $operations.length - 1)) {
								if(prog_callback) {
									prog_callback(-1, 100);
								}
								callback(wsdlURL.replace(/\./g, '').replace(/\//g, '').replace(/\\/g, ''));
							}
						}
					});
				}
			});
		}
	/*Loading Screen*/
		function updateProgressBar(left) {
			$('.eumis_update_progressbar_handler').animate({'left': left + 'px'}, {
				duration:45000,
				step: function(currentLeft) {
					var $hex = $('.hex-container');
					if($('.hex-container-zoomed').length > 0 && !$hex.hasClass('animating')) {
						$hex.removeClass('animating').css({
							'left':	'130px',
							'top':	'25px'
						});
					} else {
						var loading_block = $('.eumis_loading_block');
						$hex.removeClass('animating').css({
							'left':	loading_block.offset().left	+ 15,
							'top':	loading_block.offset().top	+ 130
						});
					}
					if(initialLoaded) {
						$('.emuis_loading_progressbar div').css({'display': 'block', 'width': currentProgressBar + '%'});
					} else {
						$('.emuis_loading_progressbar div').css({'display': 'block', 'width': ((initialLoadedScripts / initialScripts) * 100) + '%'});
					}
				},
				complete: function() {
					updateProgressBar((left == 1) ? 0 : 1);
				}
			});
		}

		function spinHex(working, deg) {
			var timeOut = 8000;
			setTimeout(function(deg) {
				$('.hex').rotate(deg);
				if(deg == 180) {
					deg = -18;
				}
				spinHex(true, (deg + 9));
			}, timeOut / 100, deg);
		}
	/*WorkFlow*/
		function storeWorkflow() {
			//List of all saved object key: savedWorkflow
			jsonToSave	= getJSONWorkflow();
			saveName	= $("input[id=inputNameSave]").val();
			//$.jStorage.set(saveName,jsonToSave);
			var currentTime = new Date();
			date	= currentTime.toLocaleDateString();
			time	= currentTime.toLocaleTimeString();
			savedWF	= $.jStorage.get("savedWorkflow");
			if(savedWF) {
				savedWF.push([saveName,date + " " + time]);
			} else {
				savedWF = new Array();
				savedWF.push([saveName,date + " " + time]);
			}
			$.jStorage.set("savedWorkflow", savedWF);
			oTable.fnAddData([saveName,date + " " + time]);
			//Saving the actual JSON object
			$.jStorage.set(saveName,jsonToSave);
		}

		function getJSONWorkflow(stringify) {
			var stringify	= (typeof stringify == 'undefined') ? true : stringify;
			//creating JSON object
			//getting WSDL location
			wsdlURL			= $("input[name=inputbox]").val();
			positions		= getJSONStructure();
			wires			= getJSONWires();
			var date		= new Date();
			var dataArr		= date.toLocaleString().split(" ");
			var monthInt	= date.getMonth()+1;
			//Create month as string
			if (monthInt <= 9) {var monthString = "0" + String(monthInt);} else {var monthString = String(monthInt);}
			// 2011-08-25 16:03:36.21 BST //
			//Wed 04 Jan 2012 16:17:30 BST"
			var dateTaverna	= dataArr[3] + "-" + monthString + "-" + dataArr[1] + " " + dataArr[4] + " " + dataArr[5];
			workflow		= {"wsdlURL":wsdlURL, "positions":positions, "wires":wires,"uuid":UUID.generate(),"date":dateTaverna};
			if(stringify) {
				return JSON.stringify(workflow);
			} else {
				return workflow;
			};
		}; //end function
	/*Date*/
		Date.prototype.monthNames = new Array(
			"January",		"February",		"March",		"April",
			"May",			"June",			"July",			"August",
			"September",	"October",		"November",		"December"
		);


		Date.prototype.dayNames = new Array(
			"Sunday",		"Monday",		"Tuesday",		"Wednesday",
			"Thursday",		"Friday",		"Saturday"
		);


		Date.prototype.format = function (formatStr) {
			var heap = formatStr.toString().split("");
			var resHeap = new Array(heap.length);
			var escapeChar = "\\";	//  you can change this to something different, but
									//  don't use a character that has a formatting meaning, 
									//  unless you want to disable it's functionality
			
			//  go through array and extract identifiers from its fields
			for (var i = 0; i < heap.length; i++) {
			   switch(heap[i]) {
					case escapeChar:
						resHeap[i] = heap[i+1];
						i++;
						break;

					case "a":   //  "am" or "pm"
						var temp = this.getHours();
						resHeap[i] = (temp < 12) ? "am" : "pm";
						break;

					case "A":   //  "AM" or "PM"
						var temp = this.getHours();
						resHeap[i] = (temp < 12) ? "AM" : "PM";
						break;

					case "d":   //  day of the month, 2 digits with leading zeros; i.e. "01" to "31"
						var temp = String(this.getDate());
						resHeap[i] = (temp.length > 1) ? temp : "0" + temp;
						break;

					case "D":   //  day of the week, textual, 3 letters; i.e. "Fri"
						var temp = this.dayNames[this.getDay()];
						resHeap[i] = temp.substring(0, 3);
						break;

					case "F":   //  month, textual, long; i.e. "January"
						resHeap[i] = this.monthNames[this.getMonth()];
						break;

					case "g":   //  hour, 12-hour format without leading zeros; i.e. "1" to "12"
						var temp = this.getHours();
						resHeap[i] = (temp <= 12) ? temp : (temp - 12);
						break;

					case "G":   //  hour, 24-hour format without leading zeros; i.e. "0" to "23"
						resHeap[i] = String(this.getHours());
						break;

					case "h":   //  hour, 12-hour format; i.e. "01" to "12"
						var temp = String(this.getHours());
						temp = (temp <= 12) ? temp : (temp - 12);
						resHeap[i] = (temp.length > 1) ? temp : "0" + temp;
						break;

					case "H":   //  hour, 24-hour format; i.e. "00" to "23"
						var temp = String(this.getHours());
						resHeap[i] = (temp.length > 1) ? temp : "0" + temp;
						break;
						
					case "i":   //  minutes; i.e. "00" to "59" 
						var temp   = String(this.getMinutes());
						resHeap[i] = (temp.length > 1) ? temp : "0" + temp;
						break;
						
					case "I":   //  "1" if Daylight Savings Time, "0" otherwise. Works only on the northern hemisphere
						var firstDay = new Date(this.getFullYear(), 0, 1);
						resHeap[i] = (this.getTimezoneOffset() != firstDay.getTimezoneOffset()) ? (1) : (0);
						break;
					
					case "J":   //  day of the month without leading zeros; i.e. "1" to "31" 
						resHeap[i] = this.getDate();
						break;

					case "l":   //  day of the week, textual, long; i.e. "Friday"
						resHeap[i] = this.dayNames[this.getDay()];
						break;

					case "L":   //  boolean for whether it is a leap year; i.e. "0" or "1" 
						resHeap[i] = (this.getFullYear() % 4) ? false : true;
						break;

					case "m":   //  month; i.e. "01" to "12"
						var temp = String(this.getMonth() + 1);
						resHeap[i] = (temp.length > 1) ? temp : "0" + temp;
						break;

					case "M":   //  month, textual, 3 letters; i.e. "Jan"
						resHeap[i] = this.monthNames[this.getMonth()];
						break;

					case "n":   //  month without leading zeros; i.e. "1" to "12"
						resHeap[i] = this.getMonth() + 1;
						break;

					case "O":    //  Difference to Greenwich time in hours; i.e. "+0200"
						var minZone = this.getTimezoneOffset();
						var mins = minZone % 60;
						var hour = String(((minZone - mins) / 60) * -1);
						
						if (hour.charAt(0) != "-") {
							hour = "+" + hour;
						}
						
						hour = (hour.length == 3) ? (hour) : (hour.replace(/([+-])(\d)/, "$1" + 0 + "$2")); 
						resHeap[i]  = hour + mins + "0";
						break;
					
					case "r":    //  RFC 822 formatted date; e.g. "Thu, 21 Dec 2000 16:01:07 +0200" 
						var dayName = this.dayNames[this.getDay()].substr(0, 3);
						var monthName = this.monthNames[this.getMonth()].substr(0, 3); 
						resHeap[i] = dayName + ", " + this.getDate() + " " + monthName + this.format(" Y H:i:s O");
						break;
								
					case "s":    //  seconds; i.e. "00" to "59"
						var temp    = String(this.getSeconds());  
						resHeap[i]  = (temp.length > 1) ? temp : "0" + temp;
						break;

					case "S":    //  English ordinal suffix for the day of the month, 2 characters; i.e. "st", "nd", "rd" or "th"
						var temp     = this.getDate();
						var suffixes = ["st", "nd", "rd"];
						var suffix   = "";
						
						if (temp >= 11 && temp <= 13) {
							resHeap[i] = "th";
						} else {
							resHeap[i]  = (suffix = suffixes[String(temp).substr(-1) - 1]) ? (suffix) : ("th"); 
						}
						break;
						
					
					case "t":    //  number of days in the given month; i.e. "28" to "31" 
						resHeap[i] = this.getDay();
						break;
					
					/* 
					*   T: Not implemented
					*/
					
					case "U":    //  seconds since the Unix Epoch (January 1 1970 00:00:00 GMT)
								 //  remember that this does not return milisecs!    
						resHeap[i] = Math.floor(this.getTime() / 1000);  
						break;
								
					case "w":    //  day of the week, numeric, i.e. "0" (Sunday) to "6" (Saturday) 
						resHeap[i] = this.getDay();
						break;
					
					
					case "W":    //  ISO-8601 week number of year, weeks starting on Monday 
						var startOfYear = new Date(this.getFullYear(), 0, 1, 0, 0, 0, 0);
						var firstDay = startOfYear.getDay() - 1; 
						
						if (firstDay < 0) {
							firstDay = 6;
						} 
						
						var firstMonday = Date.UTC(this.getFullYear(), 0, 8 - firstDay);
						var thisDay = Date.UTC(this.getFullYear(), this.getMonth(), this.getDate());    
						resHeap[i] = Math.floor((thisDay - firstMonday) / (1000 * 60 * 60 * 24 * 7)) + 2;
						break;
								
					case "y":    //  year, 2 digits; i.e. "99"
						resHeap[i] = String(this.getFullYear()).substring(2);
						break;

					case "Y":    //  year, 4 digits; i.e. "1999"
						resHeap[i] = this.getFullYear();
						break;
								   
					case "z":    //  day of the year; i.e. "0" to "365" 
						var firstDay = Date.UTC(this.getFullYear(), 0, 0);
						var thisDay = Date.UTC(this.getFullYear(), this.getMonth(), this.getDate());    
						resHeap[i] = Math.floor((thisDay - firstDay) / (1000 * 60 * 60 * 24));
						break;
					
					case "Z":    //  timezone offset in seconds (i.e. "-43200" to "43200"). 
						resHeap[i] = this.getTimezoneOffset() * 60;
						break;
					
					default:
						resHeap[i] = heap[i];
				}
			}

			//  return joined array
			return resHeap.join("");
		}
	/*JSON*/
		// ========================================================================
		//  XML.ObjTree -- XML source code from/to JavaScript object like E4X
		// ========================================================================

		if(typeof(XML) == 'undefined') {window.XML = function() {};}
		//  constructor
		XML.ObjTree = function () {
			return this;
		};

		//  class variables
		XML.ObjTree.VERSION = "0.23";

		//  object prototype
		XML.ObjTree.prototype.xmlDecl		= '<?xml version="1.0" encoding="UTF-8" ?>\n';
		XML.ObjTree.prototype.attr_prefix	= '-';

		//  method: parseXML( xmlsource )
		XML.ObjTree.prototype.parseXML = function (xml) {
			var root;
			if(window.DOMParser) {
				var xmldom = new DOMParser();
				//xmldom.async = false;           // DOMParser is always sync-mode
				var dom = xmldom.parseFromString(xml, "application/xml");
				if(!dom) {return;}
				root = dom.documentElement;
			} else {
				if(window.ActiveXObject) {
					xmldom = new ActiveXObject('Microsoft.XMLDOM');
					xmldom.async = false;
					xmldom.loadXML(xml);
					root = xmldom.documentElement;
				}
			}
			if(!root) {return;}
			return this.parseDOM( root );
		};

		//  method: parseHTTP( url, options, callback )
		XML.ObjTree.prototype.parseHTTP = function(url, options, callback) {
			var myopt = {};
			for(var key in options) {
				myopt[key] = options[key];	// copy object
			}
			if(!myopt.method) {
				if(
					typeof(myopt.postBody) == "undefined" &&
					typeof(myopt.postbody) == "undefined" &&
					typeof(myopt.parameters) == "undefined"
				) {
					myopt.method = "get";
				} else {
					myopt.method = "post";
				}
			}
			if(callback) {
				myopt.asynchronous = true;	// async-mode
				var __this = this;
				var __func = callback;
				var __save = myopt.onComplete;
				myopt.onComplete = function(trans) {
					var tree;
					if(trans && trans.responseXML && trans.responseXML.documentElement) {
						tree = __this.parseDOM(trans.responseXML.documentElement);
					}
					__func(tree, trans);
					if(__save ) {__save(trans);}
				};
			} else {
				myopt.asynchronous = false;		// sync-mode
			}
			var trans;
			if(typeof(HTTP) != "undefined" && HTTP.Request) {
				myopt.uri = url;
				var req = new HTTP.Request(myopt);		// JSAN
				if(req) {trans = req.transport;}
			} else {
				if(typeof(Ajax) != "undefined" && Ajax.Request) {
					var req = new Ajax.Request(url, myopt);		// ptorotype.js
					if(req) {trans = req.transport;}
				}
			}
			if(callback) {return trans;}
			if(trans && trans.responseXML && trans.responseXML.documentElement) {
				return this.parseDOM(trans.responseXML.documentElement);
			}
		}

		//  method: parseDOM( documentroot )
		XML.ObjTree.prototype.parseDOM = function(root) {
			if(!root) {return;}

			this.__force_array = {};
			if(this.force_array) {
				for(var i=0; i<this.force_array.length; i++) {
					this.__force_array[this.force_array[i]] = 1;
				}
			}

			var json = this.parseElement(root);		// parse root node
			if(this.__force_array[root.nodeName]) {
				json = [json];
			}
			if(root.nodeType != 11) {				// DOCUMENT_FRAGMENT_NODE
				var tmp = {};
				tmp[root.nodeName] = json;			// root nodeName
				json = tmp;
			}
			return json;
		};

		//  method: parseElement( element )
		XML.ObjTree.prototype.parseElement = function(elem) {
			//  COMMENT_NODE
			if(elem.nodeType == 7) {
				return;
			}

			//  TEXT_NODE CDATA_SECTION_NODE
			if(elem.nodeType == 3 || elem.nodeType == 4) {
				var bool = elem.nodeValue.match(/[^\x00-\x20]/);
				if(bool == null) {return;}	// ignore white spaces
				return elem.nodeValue;
			}

			var retval;
			var cnt = {};

			//  parse attributes
			if(elem.attributes && elem.attributes.length) {
				retval = {};
				for(var i = 0; i < elem.attributes.length; i++) {
					var key = elem.attributes[i].nodeName;
					if(typeof(key) != "string") {continue;}
					var val = elem.attributes[i].nodeValue;
					if(!val) {continue;}
					key = this.attr_prefix + key;
					if(typeof(cnt[key]) == "undefined") {cnt[key] = 0;}
					cnt[key] ++;
					this.addNode(retval, key, cnt[key], val);
				}
			}

			//  parse child nodes (recursive)
			if(elem.childNodes && elem.childNodes.length) {
			var textonly = true;
			if(retval) {textonly = false;}			// some attributes exists
			for(var i = 0; i < elem.childNodes.length && textonly; i++) {
			var ntype = elem.childNodes[i].nodeType;
			if( ntype == 3 || ntype == 4 ) continue;
			textonly = false;
			}
			if ( textonly ) {
			if ( ! retval ) retval = "";
			for ( var i=0; i<elem.childNodes.length; i++ ) {
			retval += elem.childNodes[i].nodeValue;
			}
			} else {
			if ( ! retval ) retval = {};
			for ( var i=0; i<elem.childNodes.length; i++ ) {
			var key = elem.childNodes[i].nodeName;
			if ( typeof(key) != "string" ) continue;
			var val = this.parseElement( elem.childNodes[i] );
			if ( ! val ) continue;
			if ( typeof(cnt[key]) == "undefined" ) cnt[key] = 0;
			cnt[key] ++;
			this.addNode( retval, key, cnt[key], val );
			}
			}
			}
			return retval;
		};

		//  method: addNode( hash, key, count, value )
		XML.ObjTree.prototype.addNode = function ( hash, key, cnts, val ) {
			if ( this.__force_array[key] ) {
			if ( cnts == 1 ) hash[key] = [];
			hash[key][hash[key].length] = val;      // push
			} else if ( cnts == 1 ) {                   // 1st sibling
			hash[key] = val;
			} else if ( cnts == 2 ) {                   // 2nd sibling
			hash[key] = [ hash[key], val ];
			} else {                                    // 3rd sibling and more
			hash[key][hash[key].length] = val;
			}
		};

		//  method: writeXML( tree )
		XML.ObjTree.prototype.writeXML = function ( tree ) {
			var xml = this.hash_to_xml( null, tree );
			return this.xmlDecl + xml;
		};

		//  method: hash_to_xml( tagName, tree )
		XML.ObjTree.prototype.hash_to_xml = function ( name, tree ) {
			var elem = [];
			var attr = [];
			for( var key in tree ) {
			if ( ! tree.hasOwnProperty(key) ) continue;
			var val = tree[key];
			if ( key.charAt(0) != this.attr_prefix ) {
			if ( typeof(val) == "undefined" || val == null ) {
			elem[elem.length] = "<"+key+" />";
			} else if ( typeof(val) == "object" && val.constructor == Array ) {
			elem[elem.length] = this.array_to_xml( key, val );
			} else if ( typeof(val) == "object" ) {
			elem[elem.length] = this.hash_to_xml( key, val );
			} else {
			elem[elem.length] = this.scalar_to_xml( key, val );
			}
			} else {
			attr[attr.length] = " "+(key.substring(1))+'="'+(this.xml_escape( val ))+'"';
			}
			}
			var jattr = attr.join("");
			var jelem = elem.join("");
			if ( typeof(name) == "undefined" || name == null ) {
			// no tag
			} else if ( elem.length > 0 ) {
			if ( jelem.match( /\n/ )) {
			jelem = "<"+name+jattr+">\n"+jelem+"</"+name+">\n";
			} else {
			jelem = "<"+name+jattr+">"  +jelem+"</"+name+">\n";
			}
			} else {
			jelem = "<"+name+jattr+" />\n";
			}
			return jelem;
		};

		//  method: array_to_xml( tagName, array )
		XML.ObjTree.prototype.array_to_xml = function ( name, array ) {
			var out = [];
			for( var i=0; i<array.length; i++ ) {
			var val = array[i];
			if ( typeof(val) == "undefined" || val == null ) {
			out[out.length] = "<"+name+" />";
			} else if ( typeof(val) == "object" && val.constructor == Array ) {
			out[out.length] = this.array_to_xml( name, val );
			} else if ( typeof(val) == "object" ) {
			out[out.length] = this.hash_to_xml( name, val );
			} else {
			out[out.length] = this.scalar_to_xml( name, val );
			}
			}
			return out.join("");
		};

		//  method: scalar_to_xml( tagName, text )
		XML.ObjTree.prototype.scalar_to_xml = function ( name, text ) {
			if ( name == "#text" ) {
			return this.xml_escape(text);
			} else {
			return "<"+name+">"+this.xml_escape(text)+"</"+name+">\n";
			}
		};

		//  method: xml_escape( text )

		XML.ObjTree.prototype.xml_escape = function ( text ) {
			return (text + '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
		};

		/* Comments
			// ========================================================================

			=head1 NAME

			XML.ObjTree -- XML source code from/to JavaScript object like E4X

			=head1 SYNOPSIS

			var xotree = new XML.ObjTree();
			var tree1 = {
			root: {
			node: "Hello, World!"
			}
			};
			var xml1 = xotree.writeXML( tree1 );        // object tree to XML source
			alert( "xml1: "+xml1 );

			var xml2 = '<?xml version="1.0"?><response><error>0</error></response>';
			var tree2 = xotree.parseXML( xml2 );        // XML source to object tree
			alert( "error: "+tree2.response.error );

			=head1 DESCRIPTION

			XML.ObjTree class is a parser/generater between XML source code
			and JavaScript object like E4X, ECMAScript for XML.
			This is a JavaScript version of the XML::TreePP module for Perl.
			This also works as a wrapper for XMLHTTPRequest and successor to JKL.ParseXML class
			when this is used with prototype.js or JSAN's HTTP.Request class.

			=head2 JavaScript object tree format

			A sample XML source:

			<?xml version="1.0" encoding="UTF-8"?>
			<family name="Kawasaki">
			<father>Yasuhisa</father>
			<mother>Chizuko</mother>
			<children>
			<girl>Shiori</girl>
			<boy>Yusuke</boy>
			<boy>Kairi</boy>
			</children>
			</family>

			Its JavaScript object tree like JSON/E4X:

			{
			'family': {
			'-name':    'Kawasaki',
			'father':   'Yasuhisa',
			'mother':   'Chizuko',
			'children': {
			'girl': 'Shiori'
			'boy': [
			'Yusuke',
			'Kairi'
			]
			}
			}
			};

			Each elements are parsed into objects:

			tree.family.father;             # the father's given name.

			Prefix '-' is inserted before every attributes' name.

			tree.family["-name"];           # this family's family name

			A array is used because this family has two boys.

			tree.family.children.boy[0];    # first boy's name
			tree.family.children.boy[1];    # second boy's name
			tree.family.children.girl;      # (girl has no other sisiters)

			=head1 METHODS

			=head2 xotree = new XML.ObjTree()

			This constructor method returns a new XML.ObjTree object.

			=head2 xotree.force_array = [ "rdf:li", "item", "-xmlns" ];

			This property allows you to specify a list of element names
			which should always be forced into an array representation.
			The default value is null, it means that context of the elements
			will determine to make array or to keep it scalar.

			=head2 xotree.attr_prefix = '@';

			This property allows you to specify a prefix character which is
			inserted before each attribute names.
			Instead of default prefix '-', E4X-style prefix '@' is also available.
			The default character is '-'.
			Or set '@' to access attribute values like E4X, ECMAScript for XML.
			The length of attr_prefix must be just one character and not be empty.

			=head2 tree = xotree.parseXML( xmlsrc );

			This method loads an XML document using the supplied string
			and returns its JavaScript object converted.

			=head2 tree = xotree.parseDOM( domnode );

			This method parses a DOM tree (ex. responseXML.documentElement)
			and returns its JavaScript object converted.

			=head2 tree = xotree.parseHTTP( url, options );

			This method loads a XML file from remote web server
			and returns its JavaScript object converted.
			XMLHTTPRequest's synchronous mode is always used.
			This mode blocks the process until the response is completed.

			First argument is a XML file's URL
			which must exist in the same domain as parent HTML file's.
			Cross-domain loading is not available for security reasons.

			Second argument is options' object which can contains some parameters:
			method, postBody, parameters, onLoading, etc.

			This method requires JSAN's L<HTTP.Request> class or prototype.js's Ajax.Request class.

			=head2 xotree.parseHTTP( url, options, callback );

			If a callback function is set as third argument,
			XMLHTTPRequest's asynchronous mode is used.

			This mode calls a callback function with XML file's JavaScript object converted
			after the response is completed.

			=head2 xmlsrc = xotree.writeXML( tree );

			This method parses a JavaScript object tree
			and returns its XML source generated.

			=head1 EXAMPLES

			=head2 Text node and attributes

			If a element has both of a text node and attributes
			or both of a text node and other child nodes,
			text node's value is moved to a special node named "#text".

			var xotree = new XML.ObjTree();
			var xmlsrc = '<span class="author">Kawasaki Yusuke</span>';
			var tree = xotree.parseXML( xmlsrc );
			var class = tree.span["-class"];        # attribute
			var name  = tree.span["#text"];         # text node

			=head2 parseHTTP() method with HTTP-GET and sync-mode

			HTTP/Request.js or prototype.js must be loaded before calling this method.

			var xotree = new XML.ObjTree();
			var url = "http://example.com/index.html";
			var tree = xotree.parseHTTP( url );
			xotree.attr_prefix = '@';                   // E4X-style
			alert( tree.html["@lang"] );

			This code shows C<lang=""> attribute from a X-HTML source code.

			=head2 parseHTTP() method with HTTP-POST and async-mode

			Third argument is a callback function which is called on onComplete.

			var xotree = new XML.ObjTree();
			var url = "http://example.com/mt-tb.cgi";
			var opts = {
			postBody:   "title=...&excerpt=...&url=...&blog_name=..."
			};
			var func = function ( tree ) {
			alert( tree.response.error );
			};
			xotree.parseHTTP( url, opts, func );

			This code send a trackback ping and shows its response code.

			=head2 Simple RSS reader

			This is a RSS reader which loads RDF file and displays all items.

			var xotree = new XML.ObjTree();
			xotree.force_array = [ "rdf:li", "item" ];
			var url = "http://example.com/news-rdf.xml";
			var func = function( tree ) {
			var elem = document.getElementById("rss_here");
			for( var i=0; i<tree["rdf:RDF"].item.length; i++ ) {
			var divtag = document.createElement( "div" );
			var atag = document.createElement( "a" );
			atag.href = tree["rdf:RDF"].item[i].link;
			var title = tree["rdf:RDF"].item[i].title;
			var tnode = document.createTextNode( title );
			atag.appendChild( tnode );
			divtag.appendChild( atag );
			elem.appendChild( divtag );
			}
			};
			xotree.parseHTTP( url, {}, func );

			=head2  XML-RPC using writeXML, prototype.js and parseDOM

			If you wish to use prototype.js's Ajax.Request class by yourself:

			var xotree = new XML.ObjTree();
			var reqtree = {
			methodCall: {
			methodName: "weblogUpdates.ping",
			params: {
			param: [
			{ value: "Kawa.net xp top page" },  // 1st param
			{ value: "http://www.kawa.net/" }   // 2nd param
			]
			}
			}
			};
			var reqxml = xotree.writeXML( reqtree );       // JS-Object to XML code
			var url = "http://example.com/xmlrpc";
			var func = function( req ) {
			var resdom = req.responseXML.documentElement;
			xotree.force_array = [ "member" ];
			var restree = xotree.parseDOM( resdom );   // XML-DOM to JS-Object
			alert( restree.methodResponse.params.param.value.struct.member[0].value.string );
			};
			var opt = {
			method:         "post",
			postBody:       reqxml,
			asynchronous:   true,
			onComplete:     func
			};
			new Ajax.Request( url, opt );

			=head1 AUTHOR

			Yusuke Kawasaki http://www.kawa.net/

			=head1 COPYRIGHT AND LICENSE

			Copyright (c) 2005-2006 Yusuke Kawasaki. All rights reserved.
			This program is free software; you can redistribute it and/or
			modify it under the Artistic license. Or whatever license I choose,
			which I will do instead of keeping this documentation like it is.

			=cut
			// ========================================================================
		*/



		/* Comments
			json2.js
			2011-10-19

			Public Domain.

			NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.

			See http://www.JSON.org/js.html


			This code should be minified before deployment.
			See http://javascript.crockford.com/jsmin.html

			USE YOUR OWN COPY. IT IS EXTREMELY UNWISE TO LOAD CODE FROM SERVERS YOU DO
			NOT CONTROL.


			This file creates a global JSON object containing two methods: stringify
			and parse.

			JSON.stringify(value, replacer, space)
			value       any JavaScript value, usually an object or array.

			replacer    an optional parameter that determines how object
			values are stringified for objects. It can be a
			function or an array of strings.

			space       an optional parameter that specifies the indentation
			of nested structures. If it is omitted, the text will
			be packed without extra whitespace. If it is a number,
			it will specify the number of spaces to indent at each
			level. If it is a string (such as '\t' or '&nbsp;'),
			it contains the characters used to indent at each level.

			This method produces a JSON text from a JavaScript value.

			When an object value is found, if the object contains a toJSON
			method, its toJSON method will be called and the result will be
			stringified. A toJSON method does not serialize: it returns the
			value represented by the name/value pair that should be serialized,
			or undefined if nothing should be serialized. The toJSON method
			will be passed the key associated with the value, and this will be
			bound to the value

			For example, this would serialize Dates as ISO strings.

			Date.prototype.toJSON = function (key) {
			function f(n) {
			// Format integers to have at least two digits.
			return n < 10 ? '0' + n : n;
			}

			return this.getUTCFullYear()   + '-' +
			f(this.getUTCMonth() + 1) + '-' +
			f(this.getUTCDate())      + 'T' +
			f(this.getUTCHours())     + ':' +
			f(this.getUTCMinutes())   + ':' +
			f(this.getUTCSeconds())   + 'Z';
			};

			You can provide an optional replacer method. It will be passed the
			key and value of each member, with this bound to the containing
			object. The value that is returned from your method will be
			serialized. If your method returns undefined, then the member will
			be excluded from the serialization.

			If the replacer parameter is an array of strings, then it will be
			used to select the members to be serialized. It filters the results
			such that only members with keys listed in the replacer array are
			stringified.

			Values that do not have JSON representations, such as undefined or
			functions, will not be serialized. Such values in objects will be
			dropped; in arrays they will be replaced with null. You can use
			a replacer function to replace those with JSON values.
			JSON.stringify(undefined) returns undefined.

			The optional space parameter produces a stringification of the
			value that is filled with line breaks and indentation to make it
			easier to read.

			If the space parameter is a non-empty string, then that string will
			be used for indentation. If the space parameter is a number, then
			the indentation will be that many spaces.

			Example:

			text = JSON.stringify(['e', {pluribus: 'unum'}]);
			// text is '["e",{"pluribus":"unum"}]'


			text = JSON.stringify(['e', {pluribus: 'unum'}], null, '\t');
			// text is '[\n\t"e",\n\t{\n\t\t"pluribus": "unum"\n\t}\n]'

			text = JSON.stringify([new Date()], function (key, value) {
			return this[key] instanceof Date ?
			'Date(' + this[key] + ')' : value;
			});
			// text is '["Date(---current time---)"]'


			JSON.parse(text, reviver)
			This method parses a JSON text to produce an object or array.
			It can throw a SyntaxError exception.

			The optional reviver parameter is a function that can filter and
			transform the results. It receives each of the keys and values,
			and its return value is used instead of the original value.
			If it returns what it received, then the structure is not modified.
			If it returns undefined then the member is deleted.

			Example:

			// Parse the text. Values that look like ISO date strings will
			// be converted to Date objects.

			myData = JSON.parse(text, function (key, value) {
			var a;
			if (typeof value === 'string') {
			a =
			/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/.exec(value);
			if (a) {
			return new Date(Date.UTC(+a[1], +a[2] - 1, +a[3], +a[4],
			+a[5], +a[6]));
			}
			}
			return value;
			});

			myData = JSON.parse('["Date(09/09/2001)"]', function (key, value) {
			var d;
			if (typeof value === 'string' &&
			value.slice(0, 5) === 'Date(' &&
			value.slice(-1) === ')') {
			d = new Date(value.slice(5, -1));
			if (d) {
			return d;
			}
			}
			return value;
			});


			This is a reference implementation. You are free to copy, modify, or
			redistribute.
		*/

		/*jslint evil: true, regexp: true */

		/*members "", "\b", "\t", "\n", "\f", "\r", "\"", JSON, "\\", apply,
			call, charCodeAt, getUTCDate, getUTCFullYear, getUTCHours,
			getUTCMinutes, getUTCMonth, getUTCSeconds, hasOwnProperty, join,
			lastIndex, length, parse, prototype, push, replace, slice, stringify,
			test, toJSON, toString, valueOf
		*/


		// Create a JSON object only if one does not already exist. We create the
		// methods in a closure to avoid creating global variables.

		var JSON;
		if (!JSON) {
			JSON = {};
		}

		(function () {
		'use strict';

		function f(n) {
			// Format integers to have at least two digits.
			return n < 10 ? '0' + n : n;
		}

		if (typeof Date.prototype.toJSON !== 'function') {

			Date.prototype.toJSON = function (key) {

			return isFinite(this.valueOf())
			? this.getUTCFullYear()     + '-' +
			f(this.getUTCMonth() + 1) + '-' +
			f(this.getUTCDate())      + 'T' +
			f(this.getUTCHours())     + ':' +
			f(this.getUTCMinutes())   + ':' +
			f(this.getUTCSeconds())   + 'Z'
			: null;
			};

			String.prototype.toJSON      =
			Number.prototype.toJSON  =
			Boolean.prototype.toJSON = function (key) {
				return this.valueOf();
			};
		}

		var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
		escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
		gap,
		indent,
		meta = {    // table of character substitutions
			'\b': '\\b',
			'\t': '\\t',
			'\n': '\\n',
			'\f': '\\f',
			'\r': '\\r',
			'"' : '\\"',
			'\\': '\\\\'
		},
		rep;


		function quote(string) {

			// If the string contains no control characters, no quote characters, and no
			// backslash characters, then we can safely slap some quotes around it.
			// Otherwise we must also replace the offending characters with safe escape
			// sequences.

			escapable.lastIndex = 0;
			return escapable.test(string) ? '"' + string.replace(escapable, function (a) {
			var c = meta[a];
			return typeof c === 'string'
			? c
			: '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
			}) + '"' : '"' + string + '"';
		}


		function str(key, holder) {

			// Produce a string from holder[key].

			var i,          // The loop counter.
			k,          // The member key.
			v,          // The member value.
			length,
			mind = gap,
			partial,
			value = holder[key];

			// If the value has a toJSON method, call it to obtain a replacement value.

			if (value && typeof value === 'object' &&
			typeof value.toJSON === 'function') {
			value = value.toJSON(key);
			}

			// If we were called with a replacer function, then call the replacer to
			// obtain a replacement value.

			if (typeof rep === 'function') {
			value = rep.call(holder, key, value);
			}

			// What happens next depends on the value's type.

			switch (typeof value) {
			case 'string':
			return quote(value);

			case 'number':

			// JSON numbers must be finite. Encode non-finite numbers as null.

			return isFinite(value) ? String(value) : 'null';

			case 'boolean':
			case 'null':

			// If the value is a boolean or null, convert it to a string. Note:
			// typeof null does not produce 'null'. The case is included here in
			// the remote chance that this gets fixed someday.

			return String(value);

			// If the type is 'object', we might be dealing with an object or an array or
			// null.

			case 'object':

			// Due to a specification blunder in ECMAScript, typeof null is 'object',
			// so watch out for that case.

			if (!value) {
			return 'null';
			}

			// Make an array to hold the partial results of stringifying this object value.

			gap += indent;
			partial = [];

			// Is the value an array?

			if (Object.prototype.toString.apply(value) === '[object Array]') {

			// The value is an array. Stringify every element. Use null as a placeholder
			// for non-JSON values.

			length = value.length;
			for (i = 0; i < length; i += 1) {
			partial[i] = str(i, value) || 'null';
			}

			// Join all of the elements together, separated with commas, and wrap them in
			// brackets.

			v = partial.length === 0
			? '[]'
			: gap
			? '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']'
			: '[' + partial.join(',') + ']';
			gap = mind;
			return v;
			}

			// If the replacer is an array, use it to select the members to be stringified.

			if (rep && typeof rep === 'object') {
			length = rep.length;
			for (i = 0; i < length; i += 1) {
			if (typeof rep[i] === 'string') {
			k = rep[i];
			v = str(k, value);
			if (v) {
			partial.push(quote(k) + (gap ? ': ' : ':') + v);
			}
			}
			}
			} else {

			// Otherwise, iterate through all of the keys in the object.

			for (k in value) {
			if (Object.prototype.hasOwnProperty.call(value, k)) {
			v = str(k, value);
			if (v) {
			partial.push(quote(k) + (gap ? ': ' : ':') + v);
			}
			}
			}
			}

			// Join all of the member texts together, separated with commas,
			// and wrap them in braces.

			v = partial.length === 0
			? '{}'
			: gap
			? '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}'
			: '{' + partial.join(',') + '}';
			gap = mind;
			return v;
			}
		}

		// If the JSON object does not yet have a stringify method, give it one.

		if (typeof JSON.stringify !== 'function') {
			JSON.stringify = function (value, replacer, space) {

			// The stringify method takes a value and an optional replacer, and an optional
			// space parameter, and returns a JSON text. The replacer can be a function
			// that can replace values, or an array of strings that will select the keys.
			// A default replacer method can be provided. Use of the space parameter can
			// produce text that is more easily readable.

			var i;
			gap = '';
			indent = '';

			// If the space parameter is a number, make an indent string containing that
			// many spaces.

			if (typeof space === 'number') {
			for (i = 0; i < space; i += 1) {
			indent += ' ';
			}

			// If the space parameter is a string, it will be used as the indent string.

			} else if (typeof space === 'string') {
			indent = space;
			}

			// If there is a replacer, it must be a function or an array.
			// Otherwise, throw an error.

			rep = replacer;
			if (replacer && typeof replacer !== 'function' &&
			(typeof replacer !== 'object' ||
			typeof replacer.length !== 'number')) {
			throw new Error('JSON.stringify');
			}

			// Make a fake root object containing our value under the key of ''.
			// Return the result of stringifying the value.

			return str('', {'': value});
			};
		}


		// If the JSON object does not yet have a parse method, give it one.

		if (typeof JSON.parse !== 'function') {
			JSON.parse = function (text, reviver) {

			// The parse method takes a text and an optional reviver function, and returns
			// a JavaScript value if the text is a valid JSON text.

			var j;

			function walk(holder, key) {

			// The walk method is used to recursively walk the resulting structure so
			// that modifications can be made.

			var k, v, value = holder[key];
			if (value && typeof value === 'object') {
			for (k in value) {
			if (Object.prototype.hasOwnProperty.call(value, k)) {
			v = walk(value, k);
			if (v !== undefined) {
			value[k] = v;
			} else {
			delete value[k];
			}
			}
			}
			}
			return reviver.call(holder, key, value);
			}


			// Parsing happens in four stages. In the first stage, we replace certain
			// Unicode characters with escape sequences. JavaScript handles many characters
			// incorrectly, either silently deleting them, or treating them as line endings.

			text = String(text);
			cx.lastIndex = 0;
			if (cx.test(text)) {
			text = text.replace(cx, function (a) {
			return '\\u' +
			('0000' + a.charCodeAt(0).toString(16)).slice(-4);
			});
			}

			// In the second stage, we run the text against regular expressions that look
			// for non-JSON patterns. We are especially concerned with '()' and 'new'
			// because they can cause invocation, and '=' because it can cause mutation.
			// But just to be safe, we want to reject all unexpected forms.

			// We split the second stage into 4 regexp operations in order to work around
			// crippling inefficiencies in IE's and Safari's regexp engines. First we
			// replace the JSON backslash pairs with '@' (a non-JSON character). Second, we
			// replace all simple value tokens with ']' characters. Third, we delete all
			// open brackets that follow a colon or comma or that begin the text. Finally,
			// we look to see that the remaining characters are only whitespace or ']' or
			// ',' or ':' or '{' or '}'. If that is so, then the text is safe for eval.

			if (/^[\],:{}\s]*$/
			.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@')
			.replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
			.replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {

			// In the third stage we use the eval function to compile the text into a
			// JavaScript structure. The '{' operator is subject to a syntactic ambiguity
			// in JavaScript: it can begin a block or an object literal. We wrap the text
			// in parens to eliminate the ambiguity.

			j = eval('(' + text + ')');

			// In the optional fourth stage, we recursively walk the new structure, passing
			// each name/value pair to a reviver function for possible transformation.

			return typeof reviver === 'function'
			? walk({'': j}, '')
			: j;
			}

			// If the text is not JSON parseable, then a SyntaxError is thrown.

			throw new SyntaxError('JSON.parse');
			};
			}
		}());

		window.toJson = function(data) {
			var xotree = new XML.ObjTree();
			var dumper = new JKL.Dumper(); 
			var tree = xotree.parseXML(data);
			return dumper.dump(tree);
		};

		window.toXml = function(data) {
			var xotree = new XML.ObjTree();
			var json = eval("(" + data + ")");
			return formatXml(xotree.writeXML(json));
		};


		window.formatXml = function (xml) {
			var reg = /(>)(<)(\/*)/g;
			var wsexp = / *(.*) +\n/g;
			var contexp = /(<.+>)(.+\n)/g;
			xml = xml.replace(reg, '$1\n$2$3').replace(wsexp, '$1\n').replace(contexp, '$1\n$2');
			var pad = 0;
			var formatted = '';
			var lines = xml.split('\n');
			var indent = 0;
			var lastType = 'other';
			// 4 types of tags - single, closing, opening, other (text, doctype, comment) - 4*4 = 16 transitions 
			var transitions = {
			'single->single': 0,
			'single->closing': -1,
			'single->opening': 0,
			'single->other': 0,
			'closing->single': 0,
			'closing->closing': -1,
			'closing->opening': 0,
			'closing->other': 0,
			'opening->single': 1,
			'opening->closing': 0,
			'opening->opening': 1,
			'opening->other': 1,
			'other->single': 0,
			'other->closing': -1,
			'other->opening': 0,
			'other->other': 0
			};

			for (var i = 0; i < lines.length; i++) {
			var ln = lines[i];
			var single = Boolean(ln.match(/<.+\/>/)); // is this line a single tag? ex. <br />
			var closing = Boolean(ln.match(/<\/.+>/)); // is this a closing tag? ex. </a>
			var opening = Boolean(ln.match(/<[^!].*>/)); // is this even a tag (that's not <!something>)
			var type = single ? 'single' : closing ? 'closing' : opening ? 'opening' : 'other';
			var fromTo = lastType + '->' + type;
			lastType = type;
			var padding = '';

			indent += transitions[fromTo];
			for (var j = 0; j < indent; j++) {
			padding += '\t';
			}
			if (fromTo == 'opening->closing')
			formatted = formatted.substr(0, formatted.length - 1) + ln + '\n'; // substr removes line break (\n) from prev loop
			else
			formatted += padding + ln + '\n';
			}

			return formatted;
		};
	/*A-Star*/
		/*
			Copyright (C) 2009 by Benjamin Hardin

			Permission is hereby granted, free of charge, to any person obtaining a copy
			of this software and associated documentation files (the "Software"), to deal
			in the Software without restriction, including without limitation the rights
			to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
			copies of the Software, and to permit persons to whom the Software is
			furnished to do so, subject to the following conditions:

			The above copyright notice and this permission notice shall be included in
			all copies or substantial portions of the Software.

			THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
			IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
			FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
			AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
			LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
			OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
			THE SOFTWARE.
		*/
		function a_star(start, destination, board, columns, rows, ignore) {
			//Create start and destination as true nodes
			start		= new node(start[0], start[1], -1, -1, -1, -1);
			destination	= new node(destination[0], destination[1], -1, -1, -1, -1);
			var open	= []; //List of open nodes (nodes to be inspected)
			var closed	= []; //List of closed nodes (nodes we've already inspected)
			var g		= 0; //Cost from start to current node
			var h		= heuristic(start, destination); //Cost from current node to destination
			var f		= g+h; //Cost from start to destination going through the current node
			//Push the start node onto the list of open nodes
			open.push(start); 
			//Keep going while there's nodes in our open list
			var timeOut	= (new Date().getTime()) + 1000;
			while(open.length > 0) {
				if((new Date().getTime()) > timeOut) {
					return [];
				}
				//Find the best open node (lowest f value)
				//Alternately, you could simply keep the open list sorted by f value lowest to highest,
				//in which case you always use the first node
				var best_cost	= open[0].f;
				var best_node	= 0;
				for(var i = 1; i < open.length; i++) {
					if(open[i].f < best_cost) {
						best_cost = open[i].f;
						best_node = i;
					}
				}
				//Set it as our current node
				var current_node = open[best_node];
				//Check if we've reached our destination
				if(current_node.x == destination.x && current_node.y == destination.y) {
					var path = [destination]; //Initialize the path with the destination node
					//Go up the chain to recreate the path 
					while(current_node.parent_index != -1) {
						current_node = closed[current_node.parent_index];
						path.unshift(current_node);
						if((new Date().getTime()) > timeOut) {
							return [];
						}
					}
					return path;
				}
				//Remove the current node from our open list
				open.splice(best_node, 1);
				//Push it onto the closed list
				closed.push(current_node);
				//Expand our current node (look in all 8 directions)
				for(var new_node_x = Math.max(0, current_node.x-1); new_node_x <= Math.min(columns-1, current_node.x+1); new_node_x++) {
					for(var new_node_y = Math.max(0, current_node.y-1); new_node_y <= Math.min(rows-1, current_node.y+1); new_node_y++) {
						if(board[new_node_x][new_node_y] == 0 //If the new node is open
						|| (destination.x == new_node_x && destination.y == new_node_y) || ignore) {//or the new node is our destination
							//See if the node is already in our closed list. If so, skip it.
							var found_in_closed = false;
							for(var i in closed) {
								if(closed[i].x == new_node_x && closed[i].y == new_node_y) {
									found_in_closed = true;
									break;
								}
							}
							if(found_in_closed) {
								continue;
							}
							//See if the node is in our open list. If not, use it.
							var found_in_open = false;
							for(var i in open) {
								if(open[i].x == new_node_x && open[i].y == new_node_y) {
									found_in_open = true;
									break;
								}
							}
							if(!found_in_open) {
								var new_node	= new node(new_node_x, new_node_y, closed.length-1, -1, -1, -1);
								new_node.g		= current_node.g + Math.floor(Math.sqrt(Math.pow(new_node.x-current_node.x, 2)+Math.pow(new_node.y-current_node.y, 2)));
								new_node.h		= heuristic(new_node, destination);
								new_node.f		= new_node.g+new_node.h;
								open.push(new_node);
							}
						}
					}
				}
			}
			return [];
		};
		//An A* heurisitic must be admissible, meaning it must never overestimate the distance to the goal.
		//In other words, it must either underestimate or return exactly the distance to the goal.
		function heuristic(current_node, destination) {
			//Find the straight-line distance between the current node and the destination. (Thanks to id for the improvement)
			//return Math.floor(Math.sqrt(Math.pow(current_node.x-destination.x, 2)+Math.pow(current_node.y-destination.y, 2)));
			var x = current_node.x - destination.x;
			var y = current_node.y - destination.y;
			return x * x + y * y;
		};
		/* Each node will have six values: 
		 X position
		 Y position
		 Index of the node's parent in the closed array
		 Cost from start to current node
		 Heuristic cost from current node to destination
		 Cost from start to destination going through the current node
		*/
		function node(x, y, parent_index, g, h, f) {
			this.x				= x;
			this.y				= y;
			this.parent_index	= parent_index;
			this.g				= g;
			this.h				= h;
			this.f				= f;
		};

var InitPlugins = setInterval(function() {if($) {
/*Plugins*/																												  //====		    ==============-
	/*HidVis*/																											 //====			  ==================\
		(function($) {																									//====			 ====================\
			$.fn.hidden = function(method, options) {																	//====			 =======	  ========|
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
	/*DialogBox*/
		(function($) {
			var methods = {
				init: function(options) {	// (message, icon, type, callback)
					var template	= dialogBoxTemplate;
					var type		= "Ok";
					var callback	= function() {};
					var callbackpre	= function() {};
					var icon		= "None";
					var message		= "";

					//console.error(dialogBoxTemplate);

					var throwError = function() {
						throw new Error('Dialog Box plugin - usage: $(element).dialogBox(/*String*/ "Message", /*String*/ "Icon" /*[Warning, Question, Alert, None*/, /*String/Object*/ "Type" /*Yes/No, Cancel, Yes/No/Cancel, Retry, Yes/No/Cancel/Retry, Retry/Abort*/ /*{"Option1": "yes", "Option2": "no"}*/, /*post-done-function*/ function() {callback();}, /*pre-done-function*/ function({callback();});');
						return false;
					};
					var isBadRequest = false;
					if(arguments.length == 0 || arguments.length > 5) {
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
						if(arguments.length > 4) {
							if(typeFunction(arguments[4])) {
								callbackpre = arguments[4];
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
					//console.log(buttons);
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
						//console.log(k);
						if(k.keyCode == 13) {
							temp.find('.button[rel=1]').trigger('click');
						}
					});
					//console.log(temp)
					this.append(temp);
					callbackpre();
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
	/*Tiny Scroll*/
		(function(a) {
			a.tiny = a.tiny || {};
			a.tiny.scrollbar = {
				options : {
					axis : "y",
					wheel : 40,
					scroll : true,
					lockscroll : true,
					size : "auto",
					sizethumb : "auto"
				}
			};
			a.fn.tinyscrollbar = function(d) {
				var c = a.extend({}, a.tiny.scrollbar.options, d);
				this.each(function() {
					a(this).data("tsb", new b(a(this), c))
				});
				return this
			};
			a.fn.tinyscrollbar_update = function(c) {
				return a(this).data("tsb").update(c)
			};
			function b(q, g) {
				var k = this, t = q, j = {
					obj : a(".viewport", q)
				}, h = {
					obj : a(".overview", q)
				}, d = {
					obj : a(".scrollbar", q)
				}, m = {
					obj : a(".track", d.obj)
				}, p = {
					obj : a(".thumb", d.obj)
				}, l = g.axis === "x", n = l ? "left" : "top", v = l ? "Width" : "Height", r = 0, y = {
					start : 0,
					now : 0
				}, o = {}, e = ("ontouchstart" in document.documentElement) ? true : false;
				function c() {
					k.update();
					s();
					return k
				}
				this.update = function(z) {
					j[g.axis] = j.obj[0]["offset" + v];
					h[g.axis] = h.obj[0]["scroll" + v];
					h.ratio = j[g.axis] / h[g.axis];
					d.obj.toggleClass("disable", h.ratio >= 1);
					m[g.axis] = g.size === "auto" ? j[g.axis] : g.size;
					p[g.axis] = Math.min(m[g.axis], Math.max(0, (g.sizethumb === "auto" ? (m[g.axis] * h.ratio) : g.sizethumb)));
					d.ratio = g.sizethumb === "auto" ? (h[g.axis] / m[g.axis]) : (h[g.axis] - j[g.axis]) / (m[g.axis] - p[g.axis]);
					r = (z === "relative" && h.ratio <= 1) ? Math.min((h[g.axis] - j[g.axis]), Math.max(0, r)) : 0;
					r = (z === "bottom" && h.ratio <= 1) ? (h[g.axis] - j[g.axis]) : isNaN(parseInt(z, 10)) ? r : parseInt(z, 10);
					w()
				};
				function w() {
					var z = v.toLowerCase();
					p.obj.css(n, r / d.ratio);
					h.obj.css(n, -r);
					o.start = p.obj.offset()[n];
					d.obj.css(z, m[g.axis]);
					m.obj.css(z, m[g.axis]);
					p.obj.css(z, p[g.axis])
				}

				function s() {
					if (!e) {
						p.obj.bind("mousedown", i);
						m.obj.bind("mouseup", u)
					} else {
						j.obj[0].ontouchstart = function(z) {
							if (1 === z.touches.length) {
								i(z.touches[0]);
								z.stopPropagation()
							}
						}
					}
					if (g.scroll && window.addEventListener) {
						t[0].addEventListener("DOMMouseScroll", x, false);
						t[0].addEventListener("mousewheel", x, false)
					} else {
						if (g.scroll) {
							t[0].onmousewheel = x
						}
					}
				}

				function i(A) {
					var z = parseInt(p.obj.css(n), 10);
					o.start = l ? A.pageX : A.pageY;
					y.start = z == "auto" ? 0 : z;
					if (!e) {
						a(document).bind("mousemove", u);
						a(document).bind("mouseup", f);
						p.obj.bind("mouseup", f)
					} else {
						document.ontouchmove = function(B) {
							B.preventDefault();
							u(B.touches[0])
						};
						document.ontouchend = f
					}
				}

				function x(B) {
					if (h.ratio < 1) {
						var A = B || window.event, z = A.wheelDelta ? A.wheelDelta / 120 : -A.detail / 3;
						r -= z * g.wheel;
						r = Math.min((h[g.axis] - j[g.axis]), Math.max(0, r));
						p.obj.css(n, r / d.ratio);
						h.obj.css(n, -r);
						if (g.lockscroll || (r !== (h[g.axis] - j[g.axis]) && r !== 0)) {
							A = a.event.fix(A);
							A.preventDefault()
						}
					}
				}

				function u(z) {
					if (h.ratio < 1) {
						if (!e) {
							y.now = Math.min((m[g.axis] - p[g.axis]), Math.max(0, (y.start + (( l ? z.pageX : z.pageY) - o.start))))
						} else {
							y.now = Math.min((m[g.axis] - p[g.axis]), Math.max(0, (y.start + (o.start - ( l ? z.pageX : z.pageY)))))
						}
						r = y.now * d.ratio;
						h.obj.css(n, -r);
						p.obj.css(n, y.now)
					}
				}

				function f() {
					a(document).unbind("mousemove", u);
					a(document).unbind("mouseup", f);
					p.obj.unbind("mouseup", f);
					document.ontouchmove = document.ontouchend = null
				}
				return c()
			}

		}(jQuery));
	/*Scroll Sync*/
		/*
		 * jQuery scrollsync Plugin
		 * version: 1.0 (30 -Jun-2009)
		 * Copyright (c) 2009 Miquel Herrera
		 *
		 * Dual licensed under the MIT and GPL licenses:
		 *   http://www.opensource.org/licenses/mit-license.php
		 *   http://www.gnu.org/licenses/gpl.html
		 *
		 */

		/**
		 * Synchronizes scroll of one element (first matching targetSelector filter)
		 * with all the rest meaning that the rest of elements scroll will follow the 
		 * matched one.
		 * 
		 * options is composed of the following properties:
		 *	------------------------------------------------------------------------
		 *	targetSelector	| A jQuery selector applied to filter. The first element of
		 *					| the resulting set will be the target all the rest scrolls
		 *					| will be synchronised against. Defaults to ':first' which 
		 *					| selects the first element in the set.
		 *	------------------------------------------------------------------------
		 *	axis			| sets the scroll axis which will be synchronised, can be
		 *					| x, y or xy. Defaults to xy which will synchronise both.
		 *	------------------------------------------------------------------------
		 */
		(function($) { // secure $ jQuery alias
			$.fn.scrollsync = function( options ){
				var settings = $.extend(
						{   
							targetSelector:':first',
							axis: 'xy'
						},options || {});
				
				
				function scrollHandler(event) {
					if (event.data.xaxis){
						event.data.followers.scrollLeft(event.data.target.scrollLeft());
					}
					if (event.data.yaxis){
						event.data.followers.scrollTop(event.data.target.scrollTop());
					}
				}
				
				// Find target to follow and separate from followers
				settings.target = this.filter(settings.targetSelector).filter(':first');
				settings.followers=this.not(settings.target); // the rest of elements
			
				// Parse axis
				settings.xaxis= (settings.axis=='xy' || settings.axis=='x') ? true : false; 
				settings.yaxis= (settings.axis=='xy' || settings.axis=='y') ? true : false;
				if (!settings.xaxis && !settings.yaxis) return;  // No axis left 
				
				// bind scroll event passing array of followers
				settings.target.bind('scroll', settings, scrollHandler);
				
			}; // end plugin scrollsync
		})( jQuery ); // confine scope
	/*Drag Scrollable*/
		/*
		 * jQuery dragscrollable Plugin
		 * version: 1.0 (25-Jun-2009)
		 * Copyright (c) 2009 Miquel Herrera
		 *
		 * Dual licensed under the MIT and GPL licenses:
		 *   http://www.opensource.org/licenses/mit-license.php
		 *   http://www.gnu.org/licenses/gpl.html
		 *
		 */
		/**
		 * Adds the ability to manage elements scroll by dragging
		 * one or more of its descendant elements. Options parameter
		 * allow to specifically select which inner elements will
		 * respond to the drag events.
		 * 
		 * options properties:
		 * ------------------------------------------------------------------------		
		 *  dragSelector         | jquery selector to apply to each wrapped element 
		 *                       | to find which will be the dragging elements. 
		 *                       | Defaults to '>:first' which is the first child of 
		 *                       | scrollable element
		 * ------------------------------------------------------------------------		
		 *  acceptPropagatedEvent| Will the dragging element accept propagated 
		 *	                     | events? default is yes, a propagated mouse event 
		 *	                     | on a inner element will be accepted and processed.
		 *	                     | If set to false, only events originated on the
		 *	                     | draggable elements will be processed.
		 * ------------------------------------------------------------------------
		 *  preventDefault       | Prevents the event to propagate further effectivey
		 *                       | dissabling other default actions. Defaults to true
		 * ------------------------------------------------------------------------
		 *  
		 *  usage examples:
		 *
		 *  To add the scroll by drag to the element id=viewport when dragging its 
		 *  first child accepting any propagated events
		 *	$('#viewport').dragscrollable(); 
		 *
		 *  To add the scroll by drag ability to any element div of class viewport
		 *  when dragging its first descendant of class dragMe responding only to
		 *  evcents originated on the '.dragMe' elements.
		 *	$('div.viewport').dragscrollable({dragSelector:'.dragMe:first',
		 *									  acceptPropagatedEvent: false});
		 *
		 *  Notice that some 'viewports' could be nested within others but events
		 *  would not interfere as acceptPropagatedEvent is set to false.
		 *		
		 */
		(function($) { // secure $ jQuery alias
			$.fn.dragscrollable = function(options){
				var settings = $.extend({
						dragSelector:'>:first',
						acceptPropagatedEvent: true,
						preventDefault: true
					},options || {});
				 
				
				var dragscroll = {
					mouseDownHandler: function(event) {
						// mousedown, left click, check propagation
						//if($(this).parents('.layer').hasClass('Dragger')) {
							console.log(event.target);
							console.log(this);
							if (event.which != 1 || (!event.data.acceptPropagatedEvent && event.target != this)) {
								//return false;
							} else {
								
								// Initial coordinates will be the last when dragging
								event.data.lastCoord = {left: event.clientX, top: event.clientY};
							
								$.event.add(document, "mouseup", dragscroll.mouseUpHandler, event.data);
								$.event.add(document, "mousemove", dragscroll.mouseMoveHandler, event.data);
								if(event.data.preventDefault) {
									event.preventDefault();
									return false;
								}
							}
						//}
					},
					mouseMoveHandler: function(event) { // User is dragging
						// How much did the mouse move?
						//if($(this).parents('.layer').hasClass('Dragger')) {
							var delta = {left:	(event.clientX - event.data.lastCoord.left),
										top:	(event.clientY - event.data.lastCoord.top)};
							
							// Set the scroll position relative to what ever the scroll is now
							event.data.scrollable.scrollLeft(event.data.scrollable.scrollLeft() - delta.left);
							event.data.scrollable.scrollTop(event.data.scrollable.scrollTop() - delta.top);
							
							// Save where the cursor is
							event.data.lastCoord = {left: event.clientX, top: event.clientY}
							if(event.data.preventDefault) {
								event.preventDefault();
								return false;
							}
						//}
					},
					mouseUpHandler: function(event) { // Stop scrolling
						//if($(this).parents('.layer').hasClass('Dragger')) {
							$.event.remove(document, "mousemove", dragscroll.mouseMoveHandler);
							$.event.remove(document, "mouseup", dragscroll.mouseUpHandler);
							if (event.data.preventDefault) {
								event.preventDefault();
								return false;
							}
						//}
					}
				}
				
				// set up the initial events
				this.each(function() {
					// closure object data for each scrollable element
					var data = {scrollable: $(this), acceptPropagatedEvent: settings.acceptPropagatedEvent, preventDefault: settings.preventDefault}
					// Set mouse initiating event on the desired descendant
					$(this).find(settings.dragSelector).bind('mousedown', data, dragscroll.mouseDownHandler);
				});
			}; //end plugin dragscrollable
		})(jQuery); // confine scope
	/*WorkSpace*/
		console.log2 = console.log;//console.log = function() {if(arguments.length > 0) {if(typeof(arguments[0] == 'string')) {if(arguments[0].toString().substring(0,7) == 'SERVICE'){return console.log2(arguments);}}}return;};
		window.workspacePlugin = {
			panel: '#workspacePanel',
			menu: '#workspaceMenu',
			redraw: function() {
				var dataWorkspace = [];
				if($.jStorage.get('sceWorkspace') == null) {
					$.jStorage.set('sceWorkspace', []);
				} else {
					$.each($.jStorage.get('sceWorkspace'), function(index, value) {
						dataWorkspace[dataWorkspace.length] = [value.name, value.date];
					});
				}

				$('.workspaceDataContainer').html('<table cellpadding="0" cellspacing="0" border="0" class="display workspaceDataTable"></table>');
				$('.workspaceDataTable').dataTable({
					"iDisplayLength": 10000,
					"aLengthMenu": [[-1], ['All']],
					"aaData": dataWorkspace,
					"aoColumns": [
						{"sTitle": "Name"},
						{"sTitle": "Date"}
					]
				});
				$('.workspaceDataTable tr').bind('click', function() {
					$('.workspaceDataTable tr').removeClass('highlighted');
					$(this).addClass('highlighted');
				});
			},
			bind: function() {
				var workspaceButtons = $('.workspaceButtons');
				var $this = this;
				if(workspaceButtons.length > 0) {
					workspacePlugin.redraw();

					$('.workspaceSave').bind('click', function() {
						workspacePlugin.save();
					});

					$('.workspaceDelete').bind('click', function() {
						workspacePlugin.remove();
					});


					$('.workspaceImport').bind('click', function() {
						workspacePlugin.import();
					});

					$('.workspaceLoad').bind('click', function() {
						workspacePlugin.load();
					});

					$('#workspacePanel .export').next().bind('click', function(e) {
						checkWindowsForErrors();
						if($('.nmError').length > 0) {
							$.dialogBox('Cannot export workflow, errors have been found<br />Please correct any highlighted windows and try again.');
						} else {
							console.log(e);
							//var netmar = ((e.pageX - $(this).offset().left) >= 202) ? true : false;
							var service = ((e.pageX - $(this).offset().left) >= 133) ? (((e.pageX - $(this).offset().left) >= 267) ? 'netmar' : 'taverna') : 'run';
							if(service == 'run') {

								$('.dialogBoxWorkFlowRun').parents('.dialogBox').remove();
								$.dialogBox('<div class="dialogBoxWorkFlowRun"><div>Your flow is currently: <span>Loading</span></div></div>', 'none', {});

							}
							//console.log(encodeURIComponent(workspacePlugin.flowXML(workspacePlugin.flowJSON())));
							$.ajax({
								type:'POST',
								url:'download.php?type=' + service + '&t=' + (new Date().getTime()),
								data: {data: workspacePlugin.flowXML(workspacePlugin.flowJSON())},
								success: function(data) {
									console.log(data);
									if(service == 'run') {
										workspacePlugin.runWorkflow(data);
									} else {
										window.location.href='download.php?type=get&obj=' + data;
									}
								},
								dataType:'text'
							});
							//window.location.href += (netmar ? 'netmar' : 'taverna') + '.php?xmlContent='
						}
					});
				} else {
					if(panelInits.workspace == null) {
						panelInits.workspace = setInterval(function() {workspacePlugin.bind();}, 200);
					}
				}
			},
			runWorkflow: function(data, ticker) {
				if(ticker !== true) {
					$('.dialogBoxWorkFlowRun').parents('.dialogBox').remove();
					$.dialogBox('<div class="dialogBoxWorkFlowRun"><div>Your flow is currently: <span>Loading</span>&gt;<span>Starting</span>.</div><div></div></div>', 'none', {});
				}
				$.ajax({
					type:'GET',
					url:'download.php?type=run&obj=' + data + '&t=' + (new Date().getTime()),
					dataType:'text',
					success: function(state) {
						if(state == 'Finished') {
							$.ajax({
								type:'GET',
								url:'download.php?type=run&obj=' + data + '&out=wd&t=' + (new Date().getTime()),
								dataType:'text',
								success: function(content) {
									var content = $(content.replace(/ts\:/g, 'ts-').replace(/ts-rest\:/g, 'ts-rest').replace(/ts-rest\:/g, 'ts-rest').replace(/xmlns\:/g, 'xmlns-').replace(/xlink\:/g, 'xlink-'));
									window.t = content;
									$('.dialogBoxWorkFlowRun').parents('.dialogBox').remove();
									var files = '';
									$.each(content.find('ts-file'), function(index, value) {
										value = $(value);
										files = files + '<div><strong>' + value.attr('ts-name') + '</strong>: <a href="' + value.attr('xlink-href') + '" target="_new">View</a></div>';
									});
									if(files == '') {
										$.dialogBox('<div class="dialogBoxWorkFlowRun"><div>Your flow has finished but there were no results available.</div></div>', 'none', {'Ok': 1});
									} else {
										$.dialogBox('<div class="dialogBoxWorkFlowRun"><div>Your flow has finished and your results are available;</div>' + files + '</div>', 'none', {'Ok': 1});
									}
									//console.log(content);
								}
							});
						} else {
							$('.dialogBoxWorkFlowRun').find('div').last().append('.');
							if(state !== 'Operating' && state !== 'Initialized') {
								$('.dialogBoxWorkFlowRun').parents('.dialogBox').remove();
								$.dialogBox('There was a problem with your workflow', 'none', {'Ok': 1});
							} else {
								if($('.dialogBoxWorkFlowRun').find('div span').last().text() !== state) {
									$('.dialogBoxWorkFlowRun').find('div span').last().after('&gt;<span>' + state + '</span>');
								}
								setTimeout(function() {workspacePlugin.runWorkflow(data, true);}, 3750);
							}
						}
					}
				});
			},
			flowXML: function(data) {
				data = $("<xml>" + toXml('{"root":' + JSON.stringify(data) + '}') + "</xml>").find('root');
				$.each(data.find('positions'), function(index, value) {
					value = $(value);
					var inputs = '';
					var outputs = '';
					$.each(value.find('inputterminals'), function(index, term) {
						term = $(term);
						inputs = '<inputTerminals isconnected="' + term.find('isconnected').text() + '">' + term.find('text').text() + '</inputTerminals>' + "\n" + inputs;
					});
					$.each(value.find('outputterminals'), function(index, term) {
						term = $(term);
						outputs = '<outputTerminals isconnected="' + term.find('isconnected').text() + '">' + term.find('text').text() + '</outputTerminals>' + "\n" + outputs;
					});
					value.find('inputterminals').remove();
					value.find('outputterminals').remove();
					value.find('label').after($(outputs));
					value.find('label').after($(inputs));
				});
				var result = data.html();

				result = result.replace(/\<inputterminals isconnected=\"/g,		"<inputTerminals isConnected=\"");
				result = result.replace(/\<outputterminals isconnected=\"/g,	"<outputTerminals isConnected=\"");
				result = result.replace(/\<\/inputterminals\>/g,				"</inputTerminals>");
				result = result.replace(/\<\/outputterminals\>/g,				"</outputTerminals>");
				result = result.replace(/\<wsdlurl\>/g,							"<wsdlURL>");
				result = result.replace(/\<\/wsdlurl\>/g,						"</wsdlURL>");
				result = result.replace(/\<moduleid\>/g,						"<moduleId>");
				result = result.replace(/\<\/moduleid\>/g,						"</moduleId>");
				result = result.replace(/\<outputports\>/g,						"<outputPorts>");
				result = result.replace(/\<\/outputports\>/g,					"</outputPorts>");
				result = result.replace(/\<inputurl\>/g,						"<inputURL>");
				result = result.replace(/\<\/inputurl\>/g,						"</inputURL>");
				result = result.replace(/\<literaldata\>/g,						"<literalData>");
				result = result.replace(/\<\/literaldata\>/g,					"</literalData>");
				result = result.replace(/\<containertype\>/g,					"<containerType>");
				result = result.replace(/\<\/containertype\>/g,					"</containerType>");
				result = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n\t<root>" + result + "</root>";

				return result;
			},
			flowJSON: function() {
				var date		= new Date();
				var dataArr		= date.toLocaleString().split(' ');
				var monthInt	= date.getMonth() + 1;
				var monthString	='0';
				if(monthInt <= 9) {
					monthString += monthInt;
				} else {
					monthString = monthInt;
				}
				var dateTaverna = (new Date().format('Y-m-d H:i:s \\G\\M\\T O')).replace(/\+/g, '');
				var result = {};
				result.wsdlURL = [];

				$.each(workspacePlugin.loadedWSDLs(), function(index, value) {
					if(
						value !== undefined &&
						value.toLowerCase().substring(0, 6) !== 'ftp://' &&
						value.toLowerCase().substring(0, 7) !== 'sftp://' &&
						value.toLowerCase().substring(0, 7) !== 'http://' &&
						value.toLowerCase().substring(0, 8) !== 'https://'
					) {
						value = window.location.href.replace(/\#/g, '') + value;
					}
					if(value !== window.location.href.replace(/\#/g, '')) {
						result.wsdlURL[result.wsdlURL.length] = value;
					}
				});
				result.positions = [];
				$.each($('.nmWindow'), function(index, vindow) {
					vindow = $(vindow);
					var serviceio = vindow.hasClass('serviceio');
					var vttr_id = vindow.attr('id');
					var vlabel = '';
					if(serviceio) {
						vlabel = vindow.find('.header .handler');
						if(vlabel.length > 0) {
							vlabel = vlabel.text();
						} else {
							vlabel = '';
						}
					}
					if(vlabel == '') {
						vlabel = vindow.attr('wsdl-label');
					}

					result.positions[result.positions.length] = {};
					result.positions[result.positions.length - 1].label = xmlStrip(vlabel);
					result.positions[result.positions.length - 1].name	= xmlStrip(vindow.find('.header .handler').text());
					result.positions[result.positions.length - 1].inputTerminals = [];

					$.each(vindow.find('.body .left'), function(index, vnput) {
						vnput = $(vnput);
						var vonnected = false;
						if(vnput.text() !== '') {
							$.each($.data(document, 'wires-dest'), function(index, vid) {
								if(serviceio) {
									if(
										(vid.tid == vttr_id && vid.name == vindow.text()) ||
										(vid.pid == vttr_id && vid.partner == vindow.text())
									) {
										vonnected = true;
									}
								} else {
									if(
										(vid.tid == vttr_id && vid.name == vnput.text()) ||
										(vid.pid == vttr_id && vid.partner == vnput.text())
									) {
										vonnected = true;
									}
								}
							});
							result.positions[result.positions.length - 1].inputTerminals[result.positions[result.positions.length - 1].inputTerminals.length] = {
								text: (serviceio && !vindow.hasClass('servicee') && !vindow.hasClass('serviced')) ? 'Service_Output' : xmlStrip(vnput.text()),
								isConnected: xmlStrip(vonnected.toString())
							};
						}
					});
					result.positions[result.positions.length - 1].outputTerminals = [];

					$.each(vindow.find('.body .right'), function(index, vutput) {
						vutput = $(vutput);
						var vonnected = false;
						if(vutput.text() !== '') {
							$.each($.data(document, 'wires-dest'), function(index, vid) {
								if(serviceio) {
									if(
										(vid.tid == vttr_id && vid.name == vindow.find('.body').text()) ||
										(vid.pid == vttr_id && vid.partner == vindow.find('.body').text())
									) {
										vonnected = true;
									}
								} else {
									if(
										(vid.tid == vttr_id && vid.name == vutput.text()) ||
										(vid.pid == vttr_id && vid.partner == vutput.text())
									) {
										vonnected = true;
									}
								}
							});
							result.positions[result.positions.length - 1].outputTerminals[result.positions[result.positions.length - 1].outputTerminals.length] = {
								text: (serviceio && !vindow.hasClass('servicee') && !vindow.hasClass('serviced')) ? 'Service_Input' : xmlStrip(vutput.text()),
								isConnected: xmlStrip(vonnected.toString())
							};
						}
					});
					if(serviceio && !vindow.hasClass('servicee') && !vindow.hasClass('serviced')) {
						result.positions[result.positions.length - 1].containerType = vindow.find('.right').length > 0 ? 'input' : 'output';
						if(result.positions[result.positions.length - 1].containerType == 'input') {
							result.positions[result.positions.length - 1].inputURL		= vindow.find('.inputURL').length		> 0 ? vindow.find('.inputURL').val()	: '';
							result.positions[result.positions.length - 1].literalData	= vindow.find('.literalData').length	> 0 ? vindow.find('.literalData').val()	: '';
						}
					}
					if(!serviceio) {
						result.positions[result.positions.length - 1].xtype	= 'WireIt.TavernaContainer';
					}
					if(vindow.hasClass('servicee')) {
						result.positions[result.positions.length - 1].xtype	= 'localService.Encode';
					}
					if(vindow.hasClass('serviced')) {
						result.positions[result.positions.length - 1].xtype	= 'localService.Decode';
					}
					result.positions[result.positions.length - 1].position	= [vindow.css('left'), vindow.css('top')];
				});

				result.wires = [];
				$.each($.data(document, 'wires-dest'), function(index, value) {
					var found = false;
					var tindow = $('#' + value.tid);
					var pindow = $('#' + value.pid);
					var terviceio = tindow.hasClass('serviceio');
					var perviceio = pindow.hasClass('serviceio');
					if(value.type == 'input') {
						var tlabel = '';
						var plabel = '';
						var tname	= value.name;
						var pname	= value.partner;
						if(terviceio) {
							//tlabel = tindow.find('.labelinput');
							tlabel = tindow.find('.header .handler');
							if(tlabel.length > 0) {
								if(tlabel.parent().hasClass('right')) {
									//tname = 'Input value';
									if(tindow.hasClass('servicei')) {
										tname == 'value';
									}
								} else {
									if(tindow.hasClass('servicei')) {
										tname == 'value';
									}
									//tname = 'Output value';
								}
								tlabel = tlabel.text();
							} else {
								tlabel = '';
							}
						}
						if(tindow.hasClass('servicei')) {
							tname == 'value';
						}
						if(perviceio) {
							//plabel = pindow.find('.labelinput');
							plabel = pindow.find('.header .handler');
							if(plabel.length > 0) {
								if(plabel.parent().hasClass('right')) {
									if(pindow.hasClass('servicei')) {
										pname == 'value';
									}
									//pname = 'Input value';
								} else {
									if(pindow.hasClass('servicei')) {
										pname == 'value';
									}
									//pname = 'Output value';
								}
								plabel = plabel.text();
							} else {
								plabel = '';
							}
						}
						if(pindow.hasClass('servicei')) {
							pname = "value";
						}
						if(tindow.hasClass('servicei')) {
							tname = "value";
						}
						if(tlabel == '') {tlabel = tindow.find('.header .handler').text();}//attr('wsdl-label');}
						if(plabel == '') {plabel = pindow.find('.header .handler').text();}//attr('wsdl-label');}
						result.wires[result.wires.length] = {
							src: {
								moduleid:	xmlStrip(plabel),
								terminal:	xmlStrip(pname),
								xtype:		'WireIt.TavernaContainer'
							},
							tgt: {
								moduleid:	xmlStrip(tlabel),
								terminal:	xmlStrip(tname),
								xtype:		'WireIt.TavernaContainer'
							}
						};
						if(pindow.hasClass('servicee')) {result.wires[result.wires.length - 1].src.xtype = 'localServiceBase64Encode';}
						if(pindow.hasClass('serviced')) {result.wires[result.wires.length - 1].src.xtype = 'localServiceBase64Decode';}
						if(pindow.hasClass('servicei')) {result.wires[result.wires.length - 1].src.xtype = 'input';}
						if(pindow.hasClass('serviceo')) {result.wires[result.wires.length - 1].src.xtype = 'output';}
						if(tindow.hasClass('servicee')) {result.wires[result.wires.length - 1].tgt.xtype = 'localServiceBase64Encode';}
						if(tindow.hasClass('serviced')) {result.wires[result.wires.length - 1].tgt.xtype = 'localServiceBase64Decode';}
						if(tindow.hasClass('servicei')) {result.wires[result.wires.length - 1].tgt.xtype = 'input';}
						if(tindow.hasClass('serviceo')) {result.wires[result.wires.length - 1].tgt.xtype = 'output';}
					}
					if(value.type == 'output') {
						var tlabel	= '';
						var plabel	= '';
						var tname	= value.name;
						var pname	= value.partner;
						if(terviceio) {
							tlabel = tindow.find('.header .handler');
							if(tlabel.length > 0) {
								if(tlabel.parent().hasClass('right')) {
									//tname = 'Input value';
								} else {
									//tname = 'Output value';
								}
								tlabel = tlabel.text();
							} else {
								tlabel = '';
							}
						}
						if(perviceio) {
							plabel = pindow.find('.header .handler');
							if(plabel.length > 0) {
								if(plabel.parent().hasClass('right')) {
									//pname = 'Input value';
								} else {
									//pname = 'Output value';
								}
								plabel = plabel.text();
							} else {
								plabel = '';
							}
						}
						if(tlabel == '') {tlabel = tindow.attr('wsdl-label');}
						if(plabel == '') {plabel = pindow.attr('wsdl-label');}
						result.wires[result.wires.length] = {
							src: {
								moduleid:	xmlStrip(tlabel),
								terminal:	xmlStrip(tname),
								xtype:		'WireIt.TavernaContainer'
							},
							tgt: {
								moduleid:	xmlStrip(plabel),
								terminal:	xmlStrip(pname),
								xtype:		'WireIt.TavernaContainer'
							}
						};
						if(tindow.hasClass('servicee')) {result.wires[result.wires.length - 1].src.xtype = 'localServiceBase64Encode';}
						if(tindow.hasClass('serviced')) {result.wires[result.wires.length - 1].src.xtype = 'localServiceBase64Decode';}
						if(tindow.hasClass('servicei')) {result.wires[result.wires.length - 1].src.xtype = 'input';}
						if(tindow.hasClass('serviceo')) {result.wires[result.wires.length - 1].src.xtype = 'output';}
						if(pindow.hasClass('servicee')) {result.wires[result.wires.length - 1].tgt.xtype = 'localServiceBase64Encode';}
						if(pindow.hasClass('serviced')) {result.wires[result.wires.length - 1].tgt.xtype = 'localServiceBase64Decode';}
						if(pindow.hasClass('servicei')) {result.wires[result.wires.length - 1].tgt.xtype = 'input';}
						if(pindow.hasClass('serviceo')) {result.wires[result.wires.length - 1].tgt.xtype = 'output';}
					}
				});

				result.uuid = UUID.generate();
				result.date = dateTaverna;
				return result;
			},
			import: function() {
				$.dialogBox($.data(document, 'template-importdialog'), 'none', {'Upload': 1, 'Cancel': 0}, function(index) {
					importData = null;
					importDataListener = null;
					if(index == 1) {
						if($.hasFileReader) {
							index = document.getElementById('workflowupload');
							if(index.files.length > 0) {
								//console.log(index.files);
								if(index.files[0]) {
									var f = index.files[0];
									if(f.type == 'text/xml' && f.size > 0 && $((f.name).split('.')).last()[0] == 'xml') {
										var r = new FileReader();
										//console.log('it passed');
										r.onload = (function(t) {
											var res = $('<res>' + t.target.result + '</res>').find('root');
											var obj = {};
											obj.positions = [];
											obj.wsdlURL = [];
											obj.wires = [];
											obj.uuid = '';
											obj.date = '';
											$.each(res.find('wsdlurl'), function(index, value) {obj.wsdlURL[obj.wsdlURL.length] = $(value).text();});
											$.each(res.find('uuid'), function(index, value) {obj.uuid = $(value).text();});
											$.each(res.find('date'), function(index, value) {obj.date = $(value).text();});
											$.each(res.find('positions'), function(index, value) {
												var d					= obj.positions.length;
												value					= $(value);
												obj.positions[d]		= {};
												obj.positions[d].label	= value.find('label').text();
												obj.positions[d].name	= value.find('name').text();
												console.log(value);
												if(value.find('containertype').length > 0) {
													obj.positions[d].containertype	= value.find('containertype').text();
												}
												if(value.find('xtype').length > 0) {
													obj.positions[d].xtype			= value.find('xtype').text();
												}
												if(value.find('inputURL').length > 0) {
													obj.positions[d].inputURL		= value.find('inputurl').text();
												}
												if(value.find('literalData').length > 0) {
													obj.positions[d].literalData	= value.find('literaldata').text();
												}
												obj.positions[d].position = [value.find('position').first().text(), value.find('position').last().text()];
											});
											$.each(res.find('wires'), function(index, value) {
												var d = obj.wires.length;
												value = $(value);
												obj.wires[d]				= {};
												obj.wires[d].src			= {
													moduleid:	value.find('src moduleid').text(),
													terminal:	value.find('src terminal').text(),
													xtype:  	value.find('src xtype').text()
												};
												obj.wires[d].terminal 		= value.find('terminal').text();
												obj.wires[d].tgt			= {
													moduleid:	value.find('tgt moduleid').text(),
													terminal:	value.find('tgt terminal').text(),
													xtype:  	value.find('tgt xtype').text()
												};
											});
											//console.log(obj);
											//console.log(res.html());
											console.log(obj);
											workspacePlugin.save(obj);
										});
										r.readAsText(f);
									}
								}
								/*getAsText(index.files[0]);
								importDataListener = setInterval(function() {
									if(importData !== null) {
										console.log(importData);
										importData = $('<div>' + importData + '</div>').find('root');
										if(importData.length == 1) {
											if(
												importData.find('wsdlurl').length > 0 &&
												importData.find('date').length > 0 &&
												importData.find('uuid').length > 0
											) {
												var store = {}
												store.date = importData.find('date').text();
												store.uuid = importData.find('uuid').text();
												store.wsdlURL = [];
												$.each(importData.find('wsdlurl'), function(index, value) {
													store.wsdlURL[store.wsdlURL.length] = $(value).text();
												});
												store.positions = [];
												$.each(importData.find('positions'), function(index, value) {
													index = store.positions.length;
													store.positions[index] = {};
													store.positions[index].label = $(value).find('label').text();
													store.positions[index].position = [];
													$.each($(value).find('position'), function(sindex, svalue) {
														store.positions[index].position[store.positions[index].position.length] = $(svalue).text();
													});
													store.positions[index].inputTerminals = [];
													$.each($(value).find('inputterminals'), function(sindex, svalue) {
														svalue = $(svalue);
														store.positions[index].inputTerminals[store.positions[index].inputTerminals.length] = {
															text: svalue.text(),
															isConnected: svalue.attr('isconnected')
														};
													});
													store.positions[index].outputTerminals = [];
													$.each($(value).find('outputterminals'), function(sindex, svalue) {
														svalue = $(svalue);
														store.positions[index].outputTerminals[store.positions[index].outputTerminals.length] = {
															text: svalue.text(),
															isConnected: svalue.attr('isconnected')
														};
													});
												});
												store.wires = [];
												$.each(importData.find('wires'), function(index, value) {
													index = store.wires.length;
													value = $(value);
													store.wires[index] = {
														src: {
															moduleid: value.find('src moduleid').text(),
															terminal: value.find('src terminal').text()
														},
														tgt: {
															moduleid: value.find('tgt moduleid').text(),
															terminal: value.find('tgt terminal').text()
														}
													};
												});
												workspacePlugin.save(store);
											}
										}
										clearInterval(importDataListener);
									}
								}, 100);*/
							}
						}
					}
				});
			},
			load: function() {
				var dataItem = $('.workspaceDataTable .highlighted td:first').text();
				var workspaceData = null;
				var $service = null;
				if(dataItem !== '') {
					var data = $.jStorage.get('sceWorkspace');
					var sceData = [];
					$.each(data, function(index, value) {
						if(value.name == dataItem) {
							workspaceData = value;
						}
					});
				}
				//console.log(workspaceData);
				//console.log(workspaceData);
				if(workspaceData !== null) {
					if(workspaceData.flow) {
						$('.nmWindow').not('.nmWelcome').remove();
						checkRedundantWires();
						$.each(workspaceData.flow.positions, function(index, value) {
							$service = null;
							if(value.label !== '') {
								if(value.xtype) {
									switch(value.xtype) {
										case 'localService.Encode':
											$service = {
												containerInputs:	['bytes'],
												containerOutputs:	['base64'],
												label:				value.label,
												wsdl:				'',
												serviceio:			true,
												serviceio_content:	$($.data(document, 'serviceList-LI-Services')).find('encode64').html(),//'<div style="width:216px;margin-left:0px;">' + $($.data(document, 'serviceWindow-IO-Output')).html() + '</div>').css({height:'auto'}).addClass('left').addClass('content').addClass('serviceLink')[0].outerHTML,
												service_type:		'encode64',
												position:			[value.position[0], value.position[1]]
											};
										break;
										case 'localService.Decode':
											$service = {
												containerInputs:	['base64'],
												containerOutputs:	['bytes'],
												label:				value.label,
												wsdl:				'',
												serviceio:			true,
												serviceio_content:	$($.data(document, 'serviceList-LI-Services')).find('decode64').html(),
												service_type:		'decode64',
												position:			[value.position[0], value.position[1]]
											};
										break;
										case 'WireIt.TavernaContainer':
											//console.log("SERVICE TEST1", $service, value);
											$.each(workspaceData.flow.wsdlURL, function(index, val1) {
												var found = false;
												var wsdls = workspacePlugin.loadedWSDLs();
												$.each(wsdls, function(ind2, val2) {
													if(val1 == val2) {
														found = true;
													}
												});
												if(workspacePlugin.loadedWSDLsLength() > 0 && val1 !== undefined && val1 !== null && (found || $.inArray(val1, wsdls))) {
													//console.log2(val1);
													var wsdl_url_stripped = val1.replace(/\./g, '').replace(/\//g, '').replace(/\\/g, '');
													//console.log('SERVICE STRIPPED WSDL', wsdl_url_stripped);
													$.each(loadedWSDLs[wsdl_url_stripped], function(ind, val2) {
														//console.log('SERVICE WSDL STRIPPED', val2);
														//console.log(val1, val2);
														if(val2.wsdl == val1 && val2.label == value.label) {
															$service = val2;
															$service.label = value.label;
															$service.position = [value.position[0], value.position[1]];
														}
													});
												}
											});
											//console.log("SERVICE TEST2", $service, value);
										break;
										default:
											$service = null;
											service_mouseDown = false;
										break;
									}
									service_currentWindow = $service;
									service_mouseDown = true;
									$('.layer').trigger('mouseup');
									service_mouseDown = false;
								}
								if(value.containerType) {value.containertype = value.containerType;}
								if(value.containertype) {
									switch(value.containertype) {
										case 'input':
											$service = {
												containerInputs:	[''],
												containerOutputs:	['input'],
												label:				value.label,
												wsdl:				'',
												serviceio:			true,
												serviceio_content:	$($.data(document, 'serviceWindow-Link')).html('<div style="width:216px;margin-left:-103px;">' + $($.data(document, 'serviceWindow-IO-Input')).html() + '</div>').css({height:'auto'}).addClass('right').addClass('content').addClass('serviceLink')[0].outerHTML,
												service_type:		'input',
												position:			[value.position[0], value.position[1]],
												url:				(value.inputURL ? value.inputURL : ''),
												data:				(value.literalData ? value.literalData : '')
											};
											console.log("VALUE", $service);
										break;
										case 'output':
											$service = {
												containerInputs: ['output'],
												containerOutputs: [''],
												label: value.label,
												wsdl: '',
												serviceio: true,
												//serviceio_content: $($.data(document, 'serviceWindow-Link')).html('<div style="width:226px;">bob</div>').css({height:'auto'}).addClass('left').addClass('content').addClass('serviceLink')[0].outerHTML,
												serviceio_content: $($.data(document, 'serviceWindow-Link')).html('<div style="width:216px;margin-left:0px;">' + $($.data(document, 'serviceWindow-IO-Output')).html() + '</div>').css({height:'auto'}).addClass('left').addClass('content').addClass('serviceLink')[0].outerHTML,
												service_type: 'output',
												position:			[value.position[0], value.position[1]]
											};
										break;
										default:
											$service = null;
											service_mouseDown = false;
										break;
									}
									service_currentWindow = $service;
									service_mouseDown = true;
									$('.layer').trigger('mouseup');
									service_mouseDown = false;
								} else {
									/*var found = false;
									console.warn('test');
									$.each(workspaceData.flow.wsdlURL, function(index, val1) {
										if(workspacePlugin.loadedWSDLsLength() > 0 && val1 !== undefined && val1 !== null && $.inArray(val1, workspacePlugin.loadedWSDLs())) {
											//console.log(val1);
											var wsdl_url_stripped = val1.replace(/\./g, '').replace(/\//g, '').replace(/\\/g, '');
											$.each(loadedWSDLs[wsdl_url_stripped], function(ind, val2) {
												//console.log(val1, val2);
												if(val2.wsdl == val1 && val2.label == value.label) {
													generateLayerWindow(val2, parseInt(value.position[0]), parseInt(value.position[1]));
												}
											});
										}
									});*/
								}
							}
						});
						var destData = [];
						var srcData = [];
						$.each(workspaceData.flow.wires, function(index, value) {

							/*destData[destData.length] = {name: (($(this).parents('.nmWindow').hasClass('serviceio') && $(this).parents('.nmWindow').find('.labelinput').length) ? $(this).parents('.nmWindow').find('.labelinput').val() : $(this).text()), partner: drawingWireIO[1], tid: $(this).parents('.nmWindow').attr('id'), pid: drawingWireWindow, type: (drawingWireIO[0] == 'input' ? 'output' : 'input')};
							srcData[srcData.length] = {name: drawingWireIO[1], partner: (($(this).parents('.nmWindow').hasClass('serviceio') && $(this).parents('.nmWindow').find('.labelinput').length) ? $(this).parents('.nmWindow').find('.labelinput').val() : $(this).text()), tid: drawingWireWindow, pid: $(this).parents('.nmWindow').attr('id'), type: (drawingWireIO[0] == 'input' ? 'input' : 'output')};
							

							destData[destData.length] = {name: value.tgt.terminal, }*/

							console.log('ws');
							console.log(value);
							console.log('we');
						});
					}
					//console.log(workspaceData);
				}
				//$.dialogBox($.data(document, 'template-importdialog'), 'none', {'Ok': 1}, function(index) {});
			},
			save: function(object) {
				$.dialogBox($.data(document, 'template-savedialog'), 'none', {'Save':1, 'Cancel': 0}, function(index) {
					if($('.nmWindow').not('.nmWelcome').length < 1) {
						$.dialogBox("Your flow does not have any services added to it.", 'none', {'Replace': 1, 'Back': 0});
					} else {
						var name = $('.dialogBoxWindow .saveName').val();
						if(index == 1 && previousSave_prompt !== '' && previousSave_prompt !== null) {
							$('.dialogBoxWindow .saveName').val(previousSave_prompt);
							var sceWorkspace = $.jStorage.get('sceWorkspace');
							var found = null;
							var name = $('.dialogBoxWindow .saveName').val();
							$.each(sceWorkspace, function(index, value) {
								if(value.name == previousSave_prompt) {
									found = index;
								}
							});
							if(found == null) {
								sceWorkspace[sceWorkspace.length] = {name: previousSave_prompt, date: (new Date().format('dS of M, Y ~ H:i:s')), flow: object ? object : workspacePlugin.flowJSON()};
								$.jStorage.set('sceWorkspace', sceWorkspace);
								workspacePlugin.redraw();
							} else {
								$.dialogBox($.data(document, 'template-saveoverdialog'), 'none', {'Replace': 1, 'Back': 0}, function(index) {
									if(index == 1) {
										sceWorkspace[found] = {name: sceWorkspace[found].name, date: (new Date().format('dS of M, Y ~ H:i:s')), flow: object ? object : workspacePlugin.flowJSON()};
										$.jStorage.set('sceWorkspace', sceWorkspace);
										workspacePlugin.redraw();
									} else {
										workspacePlugin.save();
									}
								}, function() {
									$('.dialogBoxWindow .saveover span').text(previousSave_prompt);
								});
							}
						} else {
							if(index == 1) {
								workspacePlugin.save();
							}
						}
					}
				}, function() {
					$('.dialogBoxWindow .saveName').val(previousSave_prompt);
					$('.dialogBoxWindow .saveName').live('change', function() {
						previousSave_prompt = $(this).val();
					});
					$('.dialogBoxWindow .saveName').live('keyup', function() {
						previousSave_prompt = $(this).val();
					});
				});
			},
			remove: function() {
				$.dialogBox($.data(document, 'template-deletedialog'), 'none', {'Delete':1, 'Cancel': 0}, function(index) {
					if(index == 1) {
						var dataItem = $('.workspaceDataTable .highlighted td:first').text();
						if(dataItem !== '') {
							var data = $.jStorage.get('sceWorkspace');
							var sceData = [];
							$.each(data, function(index, value) {
								if(value.name !== dataItem) {
									sceData[sceData.length] = value;
								}
							});
							$.jStorage.set('sceWorkspace', sceData);
							workspacePlugin.redraw();
						}
					}
				}, function() {
					$('.dialogBoxWindow .deletedialogbox span').text($('.workspaceDataTable .highlighted td:first').text());
				});
			},
			open: function() {
				if($(this.menu).length < 1 || $(this.panel).length < 1) {return false;}
				$(this.menu).addClass('active');
				$(this.panel).addClass('animating').animate({
					'margin-left': '0px'
				}, 500, function() {
					$(workspacePlugin.panel).addClass('opened').removeClass('animating');
				});
			},
			close: function() {
				if($(this.menu).length < 1 || $(this.panel).length < 1) {return false;}
				$(this.menu).removeClass('active');
				$(this.panel).addClass('animating').animate({
					'margin-left': '-452px'
				}, 500, function() {
					$(workspacePlugin.panel).removeClass('opened').removeClass('animating');
				});
			},
			toggle: function() {
				if($(this.menu).length < 1 || $(this.panel).length < 1) {return false;}
				if(!$(this.panel).hasClass('animating')) {
					if($(this.panel).hasClass('opened')) {
						this.close();
					} else {
						this.open();
					}
				}
			},
			loadedWSDLs: function() {
				var windows = $('.nmWindow');
				var wsdls = [];
				for(val in loadedWSDLs) {
					if(val !== undefined && val !== '') {
						val = loadedWSDLs[val].shift();
						if(val.wsdl) {
							wsdls[wsdls.length] = val.wsdl;
						}
					}
				}
				$.each(windows, function(index, value) {
					var wsdl = $(value).attr('wsdl-path');
					var found = false;
					$.each(wsdls, function(index, value) {
						if(value == wsdl) {
							found = true;
						}
					});
					if(!found) {
						if(wsdl !== undefined && wsdl !== '') {
							wsdls[wsdls.length] = wsdl;
						}
					}
				});
				return wsdls;
			},
			loadedWSDLsLength: function() {
				var i = 0;
				for(val in loadedWSDLs) {
					if(val !== undefined) {i++};
				}
				return i;
			},
			loadedProcesses: function() {
				var windows = $('.nmWindow');
				var processes = [];
				$.each(windows, function(index, value) {
					var value = $(value);
					processes[processes.length] = {
						index:		value.css('z-index'),
						left:		value.css('left'),
						top:		value.css('top'),
						height:		value.height(),
						id:			value.attr('id'),
						relheight:	value.attr('rel-height'),
						collapsed:	value.hasClass('collapsed'),
						collapsable:value.hasClass('collapsable'),
						label:		value.attr('wsdl-label'),
						path:		value.attr('wsdl-path')
					};
				});
				return processes;
			}
		};
	/*Services*/
		window.servicePlugin = {
			panel: '#servicePanel',
			menu: '#serviceMenu',
			bind: function() {
				$('.serviceio_title .title').bind('click', function() {
					$('.serviceio_puts').toggle();
					$(window).trigger('resize');
				});
				$('#serviceScrollArea').tinyscrollbar();
				$('.serviceListSearchFilter input').live('keyup', function(e) {
					var search = $(this).val().toLowerCase();
					$.each($('.accordionList'), function(index, value) {
						value = $(value);
						$.each(value.find('.serviceListAccordionHeader span'), function(i, v) {
							v = $(v);
							if(v.text().toLowerCase().indexOf(search) > -1) {
								v.parent().show().next().show();
							} else {
								v.parent().hide().next().hide();
							}
						});
					});
					$(window).trigger('resize');
				});
				$('.serviceListLoadWSDL .button').bind('click', function() {
					$('.emuis_loading_progressbar').progressbar({value: 0});
					$.dialogBox($.data(document, 'loadWSDL-Dialog'), 'none', {Load: 1, Cancel: 0}, function(result) {
						if(result == 1) {
							$('.eumis_loading_screen').css({opacity: 1, display: 'block'});
							parseWSDL($('.loadWSDLDialogInput').val(), function(arrayContainers) {
								$(window).resize();
								servicePlugin.list(arrayContainers);
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
					});
				});
				$(window).trigger('resize');
			},
			open: function() {
				if($(this.menu).length < 1 || $(this.panel).length < 1) {return false;}
				$(this.menu).addClass('active');
				$(this.panel).addClass('animating').animate({
					'margin-left': '0px'
				}, {
					duration: 500,
					complete: function() {
						$(servicePlugin.panel).addClass('opened').removeClass('animating');
					},
					step: function(i, f) {
						$('.zoomBoxShadow').css('left', 96 - i);
					}
				});
			},
			close: function() {
				if($(this.menu).length < 1 || $(this.panel).length < 1) {return false;}
				$(this.menu).removeClass('active');
				$(this.panel).addClass('animating').animate({
					'margin-left': '300px'
				}, {
					duration: 500,
					complete: function() {
						$(servicePlugin.panel).removeClass('opened').removeClass('animating');
					},
					step: function(i, f) {
						$('.zoomBoxShadow').css('left', (-i) + 96);
					}
				});
			},
			toggle: function() {
				if($(this.menu).length < 1 || $(this.panel).length < 1) {return false;}
				if(!$(this.panel).hasClass('animating')) {
					if($(this.panel).hasClass('opened')) {
						this.close();
					} else {
						this.open();
					}
				}
			},
			title: function(title) {
				title = title.split('ExecuteProcess_');
				return title[1];
			},
			list: function(arrayContainers) {
				//if($('.serviceLi-WSDL').length < 1) {
				//	setTimeout(function(arrayContainers) {servicePlugin.list(arrayContainers, false);}, 200, arrayContainers);
				//	return false;
				//}
				arrayContainers = loadedWSDLs[arrayContainers];
				var wsdl = arrayContainers.splice(0, 1)[0];
				wsdl = wsdl.wsdl;
				var $service = '';
				var $wsdl = $('<div>' + $.data(document, 'serviceLi-WSDL') + '<div class="accordionList"></div></div>');
				//console.log($wsdl.find('.title-wsdl')[0]);
				$($wsdl.find('.title-wsdl')[0]).text($(wsdl.split('/')).last()[0]).attr('title', wsdl);/*.bind('click', function() {
					$.each($(this).parent().find('.serviceLi'), function(index, value) {
						if($(value).attr('rel') !== 'undefined') {
							//$(value).toggle();
						}
					});
					$('.serviceLi .serviceLi').show();
					var $this = $(this).parent();
					$this.toggleClass('collapsed');
					if($this.hasClass('collapsed')) {
						$this.css({'padding-bottom':'0px'});
					} else {
						$this.css({'padding-bottom':'20px'});
					}
				});*/
				$.each(arrayContainers, function(index, value) {
					if(typeof(value) == 'object') {
						$service = $($.data(document, 'serviceList-syncItem'));
						$service.attr('rel', value.label);
						$service.attr('wsdl', wsdl);
						$($service[0]).find('span').text(servicePlugin.title(value.label))
						/*$service.text(servicePlugin.title(value.label)).bind('click', function() {
							//$(this).parent().find('ul').toggle();
						});*/
						var inputs = false;
						var outputs = false;
						if(servicePlugin.title(value.label) !== undefined) {
							$.each(value.containerInputs, function(index, value) {
								$service.find('.serviceInputs').parent().append($($.data(document, 'serviceList-LI')).text(value).addClass('input'));
								inputs = true;
							});
							if(inputs == false) {
								$service.find('.serviceInputs').parent().remove();
							}
							$.each(value.containerOutputs, function(index, value) {
								$service.find('.serviceOutputs').parent().append($($.data(document, 'serviceList-LI')).text(value).addClass('output'));
								outputs = true;
							});
							if(outputs == false) {
								$service.find('.serviceOutputs').parent().remove();
							}
							$service.find('ul').css('display', 'none');
							$wsdl.find('.accordionList').append($service);
						}
					}
				});
				$wsdl.live('click', function() {
					var $this = $(this).next();
					$this.toggle();
					$('#serviceScrollArea').tinyscrollbar_update('relative');
				});
				wsdlList += $wsdl.html();
				$('#serviceAccordion').accordion('destroy').html(wsdlList).accordion({header:'.serviceLi-WSDL'});
				$('.serviceListAccordionHeader span').bind('click', function() {$(this).parent().next().find('ul').toggle();$('#serviceScrollArea').tinyscrollbar_update('relative');});
				$('.serviceListAccordionHeader .help').bind('click', function() {alert('help window');});
				$('#serviceScrollArea').tinyscrollbar_update('relative');
				$(document).trigger('resize');
			}
		};

		$('.serviceio_puts div').live('mousedown', function(mouse) {
			var $this = $(this);
			var $service = null;
			service_mouseDown = true;
			switch($this.text()) {
				case 'Input':
					$service = {
						containerInputs: [''],
						containerOutputs: ['input'],
						label: 'Service I/O - Input',
						wsdl: '',
						serviceio: true,
						serviceio_content: $($.data(document, 'serviceWindow-Link')).html('<div style="width:216px;margin-left:-103px;">' + $($.data(document, 'serviceWindow-IO-Input')).html() + '</div>').css({height:'auto'}).addClass('right').addClass('content').addClass('serviceLink')[0].outerHTML,
						service_type: 'input'
					};
				break;
				case 'Output':
					$service = {
						containerInputs: ['output'],
						containerOutputs: [''],
						label: 'Service I/O - Output',
						wsdl: '',
						serviceio: true,
						//serviceio_content: $($.data(document, 'serviceWindow-Link')).html('<div style="width:226px;">bob</div>').css({height:'auto'}).addClass('left').addClass('content').addClass('serviceLink')[0].outerHTML,
						serviceio_content: $($.data(document, 'serviceWindow-Link')).html('<div style="width:216px;margin-left:0px;">' + $($.data(document, 'serviceWindow-IO-Output')).html() + '</div>').css({height:'auto'}).addClass('left').addClass('content').addClass('serviceLink')[0].outerHTML,
						service_type: 'output'
					};
				break;
				case 'Encode':
					$service = {
						containerInputs:	['bytes'],
						containerOutputs:	['base64'],
						label:				'Encode Base64 Arr',
						wsdl:				'',
						serviceio:			true,
						serviceio_content:	$($.data(document, 'serviceList-LI-Services')).find('encode64').html(),//'<div style="width:216px;margin-left:0px;">' + $($.data(document, 'serviceWindow-IO-Output')).html() + '</div>').css({height:'auto'}).addClass('left').addClass('content').addClass('serviceLink')[0].outerHTML,
						service_type:		'encode64'
					};
				break;
				case 'Decode':
					$service = {
						containerInputs:	['base64'],
						containerOutputs:	['bytes'],
						label:				'Decode Base64 Arr',
						wsdl:				'',
						serviceio:			true,
						serviceio_content:	$($.data(document, 'serviceList-LI-Services')).find('decode64').html(),
						service_type:		'decode64'
					};
				break;
				default:
					$service = null;
					service_mouseDown = false;
				break;
			}
			service_currentWindow = $service;
		});
		$('#servicePanel .serviceListAccordionHeader').live('mousedown', function(mouse) {
			var $this = $(this);
			var $service = null;
			service_mouseDown = true;
			$.each(loadedWSDLs[$this.attr('wsdl').replace(/\./g, '').replace(/\//g, '').replace(/\\/g, '')], function(index, value) {
				if(value.wsdl == $this.attr('wsdl') && value.label == $this.attr('rel')) {
					$service = value;
				}
				/*$.each(value, function(index, value2) {
					if(value2.wsdl == $this.attr('wsdl') && value2.label == $this.attr('rel')) {
						$service = value2;
					}
				});*/
			});
			service_currentWindow = $service;
			if(mouse.which == 1) {
				var potentials = [];
				var x = mouse.pageX - 190;
				var y = mouse.pageY - 50;
				var left = 0;
				var top = 0;
				/*if(potentials.length > 0) {
					var topmost = -1;
					layer_currentWindow = potentials[0];
					$.each(potentials, function(index, value) {
						if(parseInt($(value).css('z-index')) > topmost) {
							layer_currentWindow = value;
							left = parseInt($(value).css('left'));
							top = parseInt($(value).css('top'));
							layer_currentWindowOffset = [(x - left), (y - top)];
						}
					});
					layer_mouseDown = true;
				} else {
					layer_currentWindow = null;
				}*/
			}
		}).live('mousemove', function(mouse) {
			/*if(layer_mouseDown && layer_currentWindow !== null) {
				var x = mouse.pageX - 190;
				var y = mouse.pageY - 50;
				x = (x * ((current_scale == 1) ? 1 : ((current_scale == 0.75) ? 1.333 : ((current_scale == 0.5) ? 2 : ((current_scale == 0.25) ? 4 : 1))))) - layer_currentWindowOffset[0];
				y = (y * ((current_scale == 1) ? 1 : ((current_scale == 0.75) ? 1.333 : ((current_scale == 0.5) ? 2 : ((current_scale == 0.25) ? 4 : 1))))) - layer_currentWindowOffset[1];
				if(x < 0) {x = 0;}
				if(y < 0) {y = 0;}
				if(snapToGrid) {
					x = parseInt(x / snapToSize) * snapToSize;
					y = parseInt(y / snapToSize) * snapToSize;
				}
				$(layer_currentWindow).css({
					'left':x + 'px',
					'top':y + 'px'
				});
			}*/
		});		
	/*Settings*/
		window.redrawGrid = function() {
			var canvas = document.getElementById('snapToGridCanvas');
			$(canvas).css({
				'height': $(document).height()+ 'px',
				'width': $(document).width() + 'px'
			});
			var ctx = canvas.getContext('2d');
			canvas.height = $(document).height();
			canvas.width = $(document).width();
			var canvasData = ctx.getImageData(0, 0, canvas.width, canvas.height);
			for (var x = 0; x < canvasData.width; x++) {
				for (var y = 0; y < canvasData.height; y++) {
					if(!(x % parseInt(snapToSize * current_scale)) || !(y % parseInt(snapToSize * current_scale)) && x !==0&& y !== 0) {
						var idx = ((x) + y * canvas.width) * 4;
						var r = 255;
						var g = 0;
						var b = 0;
						var gray = 0
						canvasData.data[idx + 0] = gray;
						canvasData.data[idx + 1] = gray;
						canvasData.data[idx + 2] = gray;
						canvasData.data[idx + 3] = 255;
					}
				}
			}
			ctx.putImageData(canvasData, 0, 0);
		}

		window.snapWindowsToGrid = function() {
			$.each($('.layer .layerCanvas .nmWindow'), function(index, value) {
				var x = $(value).offset().left - 190;
				var y = $(value).offset().top - 50;
				x = parseInt(curScale(x) / snapToSize) * snapToSize;
				y = parseInt(curScale(y) / snapToSize) * snapToSize;
				$(this).css({
					'left': x + 'px',
					'top': y + 'px'
				});
			});
		}

		window.settingsPlugin = {
			panel: '#settingsPanel',
			menu: '#settingsMenu',
			snapMin: 60,
			snapMax: 200,
			snapStep: 10,
			bind: function() {
				var snapTo = $(this.panel).find('.snapTo');
				var $this = this;
				if(snapTo.length > 0) {
					$('.snapToSize').slider({
						min: $this.snapMin,
						max: $this.snapMax,
						step: $this.snapStep,
						value: snapToSize,
						change: function(event, ui) {
							snapToSize = ui.value;
							if(snapToGrid) {
								snapWindowsToGrid();
							}
							redrawGrid();
						}
					});
					$(this.panel).bind('mousewheel', function(e, d) {
						if(typeof(d) == 'undefined') {
							d = e.originalEvent.wheelDelta;
						}
						d = d > 0 ? 1 : -1;
						var sts = $('.snapToSize');
						var value = sts.slider('value');
						var max = sts.slider('max');
						var min = sts.slider('min');
						if(d == 1) {
							$('.snapToSize').slider({value: ((value < $this.snapMax) ? value + $this.snapStep : $this.snapMax)});
						} else {
							if(d == -1) {
								$('.snapToSize').slider({value: ((value > $this.snapMin) ? value - $this.snapStep : $this.snapMin)});
							}
						}
					}).find('.snapTo').bind('click', function() {
						snapToGrid = !$(this).hasClass('checked');
						if(snapToGrid) {
							$('#snapToGridCanvas').show();
							snapWindowsToGrid();
						} else {
							$('#snapToGridCanvas').hide();
						}
					});

					panelInits.settings = null;
				} else {
					if(panelInits.settings == null) {
						panelInits.settings = setInterval(function() {settingsPlugin.bind();}, 200);
					}
				}
			},
			open: function() {
				if($(this.menu).length < 1 || $(this.panel).length < 1) {return false;}
				$(this.menu).addClass('active');
				$(this.panel).addClass('animating').animate({
					'margin-top': '0px'
				}, 500, function() {
					$(settingsPlugin.panel).addClass('opened').removeClass('animating');
				});
			},
			close: function() {
				if($(this.menu).length < 1 || $(this.panel).length < 1) {return false;}
				$(this.menu).removeClass('active');
				$(this.panel).addClass('animating').animate({
					'margin-top': '240px'
				}, 500, function() {
					$(settingsPlugin.panel).removeClass('opened').removeClass('animating');
				});
			},
			toggle: function() {
				if($(this.menu).length < 1 || $(this.panel).length < 1) {return false;}
				if(!$(this.panel).hasClass('animating')) {
					if($(this.panel).hasClass('opened')) {
						this.close();
					} else {
						this.open();
					}
				}
			}
		};
																														 //====			  ==================\
window.$panel_handler	= $('#panelGroup');																				 //====			  ==================\
window.$menu_handler	= $('#linkGroup');																				//====			 ====================\
																														//====			 =======	  ========|
/*Layer*/																												//====			======= 	   =======|
	window.layerWindowZBase		= 2000;																					//====			======			======|
	service_currentWindow		= null;																					//=====			======			======|
	window.$layerErrorIteration	= 0;																					 //======	   ======			======|
	window.$layerErrorDirection	= 1;																					  //================		   =======|
	window.$layerErrorValue		= 0;																					   //==============			 ========/
																														     //=========			=======/
	window.$layerErrorAnimation = setInterval(function() {
		var $size1 = 33 + $layerErrorValue;
		var $size2 = $size1 - 12;
		if($size2 < 0) {$size2 = 0;}
		$('.nmWindow.nmError').css({
			'-webkit-box-shadow':	'0 3px ' + $size1 + 'px rgba(255, 70, 0, 1), 0 3px ' + $size2 + 'px rgba(255, 0, 0, 1)',
			'-moz-box-shadow':		'0 3px ' + $size1 + 'px rgba(255, 70, 0, 1), 0 3px ' + $size2 + 'px rgba(255, 0, 0, 1)',
			'-ms-box-shadow':		'0 3px ' + $size1 + 'px rgba(255, 70, 0, 1), 0 3px ' + $size2 + 'px rgba(255, 0, 0, 1)',
			'-o-box-shadow':		'0 3px ' + $size1 + 'px rgba(255, 70, 0, 1), 0 3px ' + $size2 + 'px rgba(255, 0, 0, 1)',
			'box-shadow':			'0 3px ' + $size1 + 'px rgba(255, 70, 0, 1), 0 3px ' + $size2 + 'px rgba(255, 0, 0, 1)'
		});
		var $glow = 300 - (49 + ((200 / 30) * $layerErrorValue));
		$('.nmWindow.nmRedundant').css({
			'-webkit-box-shadow':	'0 3px ' + $size1 + 'px rgba(' + $glow + ', 70, 255, 1), 0 3px ' + $size2 + 'px rgba(' + $glow + ', 0, 255, 1)',
			'-moz-box-shadow':		'0 3px ' + $size1 + 'px rgba(' + $glow + ', 70, 255, 1), 0 3px ' + $size2 + 'px rgba(' + $glow + ', 0, 255, 1)',
			'-ms-box-shadow':		'0 3px ' + $size1 + 'px rgba(' + $glow + ', 70, 255, 1), 0 3px ' + $size2 + 'px rgba(' + $glow + ', 0, 255, 1)',
			'-o-box-shadow':		'0 3px ' + $size1 + 'px rgba(' + $glow + ', 70, 255, 1), 0 3px ' + $size2 + 'px rgba(' + $glow + ', 0, 255, 1)',
			'box-shadow':			'0 3px ' + $size1 + 'px rgba(' + $glow + ', 70, 255, 1), 0 3px ' + $size2 + 'px rgba(' + $glow + ', 0, 255, 1)'
		});
		if($layerErrorIteration > 30) {
			$layerErrorIteration = 0;
			if($layerErrorDirection == 1) {
				$layerErrorDirection = -1;
			} else {
				$layerErrorDirection = 1;
			}
		}
		$layerErrorValue = $layerErrorValue + $layerErrorDirection;
		$layerErrorIteration++;
	}, 10);

	window.checkWindowsForErrors = function() {
		$handlers = [];
		$problems = [];
		$windows = $('.nmWindow');
		$.each($windows, function(index, $value) {
			$value = $($value);
			$handlers[$handlers.length] = $value.find('.header .handler').text().toLowerCase();
		});
		$.each($handlers, function(index1, value1) {
			$.each($handlers, function(index2, value2) {
				if(index1 !== index2 && value1 == value2) {
					$problems[$problems.length] = value1;
				}
			});
		});
		$windows.removeClass('nmError').css({
			'-webkit-box-shadow':	'6px 8px 23px rgba(0, 162, 162, 1)',
			'-moz-box-shadow':		'6px 8px 23px rgba(0, 162, 162, 1)',
			'-ms-box-shadow':		'6px 8px 23px rgba(0, 162, 162, 1)',
			'-o-box-shadow':		'6px 8px 23px rgba(0, 162, 162, 1)',
			'box-shadow':			'6px 8px 23px rgba(0, 162, 162, 1)'
		});
		$.each($windows, function(index, $value) {
			$value = $($value);
			$.each($problems, function(index, value) {
				if($value.find('.header .handler').text().toLowerCase() == value) {
					$value.addClass('nmError');
				}
			});
		});
		if(!userUnderstandsGlowError) {
			if($('.nmError').length > 0) {
				$.dialogBox('The current highlighted windows have errors because they have the same title.<br />Right click the title of a window to rename it.');
				userUnderstandsGlowError = true;
			}
		}
	}

	$(".layer").contextMenu({
		menu: 'layerContext'
	}, function(action, el, pos) {
		if(action == 'rename'){
			var $this = $('#' + $('#layerContext .rename').attr('nmWindow'));
			if(!$this.hasClass('nmWelcome')) {
				$.data(document, 'nmRename_ID', $this.attr('id'));
				$.dialogBox(
					'<input type="text" class="nmRenameLabel" value="' + $this.find('.header .handler').text() + '"/>',
					'none',
					{
						'Cancel': 0,
						'Rename': 1
					},
					function(val) {
						if(val == 1) {
							$('#' + $.data(document, 'nmRename_ID')).find('.header .handler').text($.data(document, 'nmRename_value'));
							checkWindowsForErrors();
						}
					},
					function() {
						console.log($('.nmRenameLabel').val());
						$('.nmRenameLabel').bind('change', function() {
							$.data(document, 'nmRename_value', $('.nmRenameLabel').val());
						});
						$('.nmRenameLabel').bind('keypress', function() {
							$.data(document, 'nmRename_value', $('.nmRenameLabel').val());
						});
					}
				);
			}
		} else {
			$windows = $('.nmWindow.collapsable');
			$.each($windows, function(index, value) {
				switch(action) {
					case 'collapse_all':
						if(!$(this).hasClass('collapsed')) {
							$(this).find('.handler').trigger('dblclick');
						}
					break;
					case 'expand_all':
						if($(this).hasClass('collapsed')) {
							$(this).find('.handler').trigger('dblclick');
						}
					break;
				}
			});
		}
	});
	$('.service_draggable').live('mouseup', function(mouse) {
		mouse.pageX = $(this).offset().left;
		mouse.pageY = $(this).offset().top;
		$('.layer').trigger('mouseup', mouse);
	});
	$(document).live('mousemove', function(mouse) {
		if(service_mouseDown && service_currentWindow !== null) {
			if(typeof(service_currentWindow.label) !== 'undefined') {
				if(service_currentWindow.label !== '') {
					$('.service_draggable .title').text((!service_currentWindow.serviceio ? servicePlugin.title(service_currentWindow.label) : service_currentWindow.label)).parent().css({
						display:	'block',
						left:		mouse.pageX,
						top:		mouse.pageY
					});
					return;
				}
			}
		}
		$('.service_draggable .title').text('').parent().css({display: 'none', left: 0, top: 0});
	}).live('mouseup', function(mouse) {
		$('.service_draggable .title').text('').parent().css({display: 'none', left: 0, top: 0});
	});
	window.layer_option = function(id, options) {
		var properties = layer_optionDefaults;
		if(typeof(options) == 'object') {
			$.each(options, function(index, value) {
				switch(index) {
					case 'title':		properties.title		= value; break;
					case 'close':		properties.close		= value ? true : false; break;
					case 'collapse':	properties.collapse		= value ? true : false; break;
					case 'collapsed':	properties.collapsed	= value ? true : false; break;
					case 'tooltip':		properties.tooltip		= value; break;
					case 'body':		properties.body			= value; break;
					case 'help':
						if(typeof(value) == 'object') {
							$.each(value, function(index, item) {
								if(typeof(item) !== 'undefined') {
									properties.help.enabled = item ? true : false;
								}
								if(typeof(item) == 'string') {
									properties.help.content = item;
								}
							});
						}
					break;
				}
			});
			layer_options[id] = properties;
		}
		return properties;
	}
	window.layerWindowToFront = function($this) {
		$.each($('.layer .layerCanvas .nmWindow'), function(index, value) {
			var z = parseInt($(value).css('z-index'));
			$(value).css('z-index', ((z < (layerWindowZBase + 1)) ? (layerWindowZBase + 1) : z)  - 1);
		});
		$this.css('z-index', $('.layer .layerCanvas .nmWindow').length + layerWindowZBase);
	}
	window.getLayerWindowHeight = function($id) {
		var $window = $('.layer .layerCanvas #nmWindow_' + $id);
		return $window.height() + $window.find('.body').height();
	}
	window.createHelpWindow = function() {
		$('body').append($.data(document, 'template-layerhelp'));
	}
	window.triggerLayerWindowHelp = function(id) {
		var $help = $('.layerhelp');
		if($help.length < 1) {
			createHelpWindow();
			$('.layerhelp .close').bind('click', function() {
				$('.layerhelp').hide();
			});
		}
		$help = $('.layerhelp');
		if($help.length < 1) {
			return false;
		}
		$help.find('.body').html((layer_option(id).help.content));
		var $window = $('.layer .layerCanvas #nmWindow_' + id);
		$help.css({
			'left':	(190	+ (parseInt($window.css('left'))/ curScale(1))) + 'px',
			'top':	(50		+ (parseInt($window.css('top'))	/ curScale(1))) + 'px',
			'display':	'block'
		});
	}
	window.updateLayerWindow = function(id, options) {
		var $window = $('.layer .layerCanvas #nmWindow_' + id);
		var properties = layer_option(id, options);
		if(typeof(options) == 'object') {
			$.each(options, function(index, value) {
				switch(index) {
					case 'title':		properties.title		= value; break;
					case 'close':		properties.close		= value ? true : false; break;
					case 'collapse':	properties.collapse		= value ? true : false; break;
					case 'collapsed':	properties.collapsed	= value ? true : false; break;
					case 'tooltip':		properties.tooltip		= value; break;
					case 'body':		properties.body			= value; break;
					case 'help':
						if(typeof(value) == 'object') {
							$.each(value, function(index, item) {
								if(typeof(item) !== 'undefined') {
									properties.help.enabled = item ? true : false;
								}
								if(typeof(item) == 'string') {
									properties.help.content = item;
								}
							});
						}
					break;
				}
			});
		}
		$.data($window, 'layer_options', options);
		$window.find('.handler').text(properties.title);
		$window.find('.body').html(properties.body);
	}
	window.createLayerWindow = function(options, aSync) {
		//console.log("OPTIONS", options);
		var properties = layer_optionDefaults;
		if(typeof(options) == 'object') {
			$.each(options, function(index, value) {
				//console.log("EACH", index, value);
				switch(index) {
					case 'title':		properties.title		= value; break;
					case 'close':		properties.close		= value ? true : false; break;
					case 'collapse':	properties.collapse		= value ? true : false; break;
					case 'collapsed':	properties.collapsed	= value ? true : false; break;
					case 'tooltip':		properties.tooltip		= value; break;
					case 'body':		properties.body			= value; break;
					case 'help':
						if(typeof(value) == 'object') {
							$.each(value, function(index, item) {
								if(typeof(item) !== 'undefined') {
									properties.help.enabled = item ? true : false;
								}
								if(typeof(item) == 'string') {
									properties.help.content = item;
								}
							});
						}
					break;
					case 'serviceio':			properties.serviceio		= value ? true : false; break;
					case 'serviceio_content':	properties.serviceio_content= value;break;
					case 'service_type':		properties.service_type		= value;break;
					case 'position':			properties.position			= (value) ? value : null;break;
					case 'data':				properties.data				= value;break;
					case 'url':					properties.url				= value;break;
				}
			});
		}
		var z = $('.layer .layerCanvas .nmWindow').length + layerWindowZBase;
		var id = null;
		for(var i = 0; i < 1000; i++) {
			if(id == null) {
				id = parseInt(Math.random() * 1000000);
				if($('.layer .layerCanvas #nmWindow_' + id).length > 0) {
					id = null;
				}
			}
		}
		var $window = $((aSync) ? $.data(document, 'template-layerwindow_async') : $.data(document, 'template-layerwindow_sync'));
		$window.css({'z-index': z});
		if(!properties.collapse) {
			$window.addClass('nmWindow_noncollapse');
		}
		var $windows = $('.nmWindow');
		var titles = [];
		var title_done = false;
		$.each($windows, function(index, value) {
			titles[titles.length] = $(value).find('.header .handler').text();
		});
		var ttl = properties.title;
		$.each(titles, function(index, value) {
			var i = 1;
			if(ttl == value && !title_done) {
				for(i = 1; i < 100; i++) {
					$.each(titles, function(index, value2) {
						if((ttl + '_' + i) !== value2 && !title_done) {
							properties.title = ttl + '_' + i;
							title_done = true;
							$.each(titles, function(index, value3) {if(properties.title == value3) {title_done = false;}});
						}
					});
				}
			}
		});
		$window.find('.handler').text(properties.title);
		$window.find('.body').append(properties.body);
		var right = $window.find('.body .right');
		$.each(right, function(index, value) {
			value = $(value);
			if(value.text() !== '') {
			}
		});
		$window.attr('id', 'nmWindow_' + id);
		if(!properties.close) {
			$window.find('.close').hide();
		}
		if(properties.collapse) {
			if(properties.collapsed) {
				$window.addClass('collapsed');
			}
			$window.addClass('collapsable');
		}
		if(!properties.help.enabled) {
			$window.find('.help').hide();
		}
		$window.find('.close').bind('click', function() {
			$(this).parents('.nmWindow').remove();
			checkRedundantWires();
			checkWindowsForErrors();
		});
		$window.find('.help').bind('mouseenter', function(mouse) {
			help_mousetimer	= setInterval(function() {
				layer_mouseDown		= false;
				layer_currentWindow	= null;
			}, 10);
		}).bind('mouseleave', function() {
			clearInterval(help_mousetimer);
		}).bind('click', id, function(id) {
			triggerLayerWindowHelp(id.data);
		});
		$('.layer .layerCanvas').append($window);
		var height = getLayerWindowHeight(id);
		$('.layer .layerCanvas #nmWindow_' + id).css('height', height + 'px').attr('rel-height', height);
		if(properties.collapsed) {
			$window.addClass('nmWindow_collapsed').css({'height': '24px'});
		}
		if(properties.position) {
			$('.layer .layerCanvas #nmWindow_' + id).css({
				'left':	properties.position[0],
				'top':	properties.position[1]
			});
		}
		if(properties.serviceio) {
			//console.log("bob", properties);
			//alert(properties.url);
			$window.addClass('serviceio');
			//alert($('.nmWindow_' + id).length);
			if(properties.service_type) {
				$window.addClass('service' + properties.service_type.substring(0, 1).toLowerCase());
			}
			if(properties.serviceio_content) {
				$window.find('.body').html(properties.serviceio_content);
			}
			$window.find('.header .handler').trigger('dblclick');
		}
		checkWindowsForErrors();
		return id;
	}
	window.curScale = function(value) {
		return (value * ((current_scale == 1) ? 1 : ((current_scale == 0.75) ? 1.333 : ((current_scale == 0.5) ? 2 : ((current_scale == 0.25) ? 4 : 1)))));
	}
	window.generateLayerWindow = function(service, x, y) {
		cl("serv", service);
		if(service.label) {
			//cl(service.position);
			if(service.position && service.position.length == 2) {
				x = parseInt(service.position[0]);
				y = parseInt(service.position[1]);
			}
			cl(x, y);
			if(snapToGrid) {
				x = parseInt(x / snapToSize) * snapToSize;
				y = parseInt(y / snapToSize) * snapToSize;
			}
			var len		= 0;
			var i		= 0;
			var j		= 0;
			var html	= '';

			if(service.containerInputs.length >= service.containerOutputs.length && !service.serviceio) {
				len = service.containerInputs.length - service.containerOutputs.length;
				for(i = 0; i < service.containerInputs.length; i++) {
					html += $($.data(document, 'serviceWindow-Link')).addClass('left').addClass('content').addClass('serviceLink').html(service.containerInputs[i])[0].outerHTML;
					if(i >= len) {
						html += $($.data(document, 'serviceWindow-Link')).addClass('right').addClass('content').addClass('serviceLink').html(service.containerOutputs[j])[0].outerHTML;
						j++;
					} else {
						html += $($.data(document, 'serviceWindow-Link')).addClass('right').addClass('serviceLink')[0].outerHTML;
					}
				}
			} else {
				len = service.containerOutputs.length - service.containerInputs.length;
			}
			var $id			= createLayerWindow({
				title:(!service.serviceio ? servicePlugin.title(service.label) : service.label),
				body:html,
				help:{enabled:true,content:'Loading description...'},
				serviceio:!!service.serviceio,
				serviceio_content:service.serviceio_content ? service.serviceio_content : '',
				service_type:service.service_type || '',
				collapsed:service.serviceio ? true : false,
				data:service.data,
				url:service.url
			}, false);
			var nmWindow	= $('#nmWindow_' + $id);

			if(typeof(service.url) !== undefined && typeof(service.data) !== 'undefined') {
				nmWindow.find('.inputURL').attr('value', service.url);
				nmWindow.find('.literalData').attr('value', service.data);
			}
			nmWindow.css({
				'left':	x + 'px',
				'top':	y + 'px'
			}).attr('wsdl-label', service.label).attr('wsdl-path', service.wsdl).attr('wsdl-uri', service.uri).find('.header .help').bind('click', function() {
				var parent			= $(this).parents('.nmWindow');
				var wsdl_path		= parent.attr('wsdl-path');
				var wsdl_label		= parent.attr('wsdl-label');
				var wsdl_uri		= parent.attr('wsdl-uri');
				var wsdl_replace	= wsdl_path.replace(/\./g, '').replace(/\//g, '').replace(/\\/g, '');
				$.each(loadedWSDLs[wsdl_replace], function(index, value) {
					if(value.label == wsdl_label && value.wsdl == wsdl_path) {
						if(typeof(value.help) == undefined || !value.help || value.help == '' || value.help == 'Loading description...') {
							$data = $.ajax({url: './wsdlproxy.php?uri=' + wsdl_uri + '&wsdl=' + servicePlugin.title(value.label), async: true, wsdl_replace:wsdl_replace, wsdl_path:wsdl_path, wsdl_label:wsdl_label, success: function(data) {
								var $this = this;
								data = $(data.replace(/ows:/g, 'ows'));
								$.each(loadedWSDLs[this.wsdl_replace], function(index, value) {
									if(value.label == $this.wsdl_label && value.wsdl == $this.wsdl_path) {
										value.data = data;
										value.help = $(data.find('owstitle')[0]).text() || 'No service information available.';
										$('.layerhelp .body').text(value.help);
									}
								});
							}});
						} else {
							$('.layerhelp .body').text(value.help);
						}
					}
				});
			});
			nmWindow.find('.body .serviceLink').bind('mousedown', function() {
				if(!drawingWire && $(this).hasClass('content')) {
					drawingWireWindow	= $(this).parents('.nmWindow').attr('id');
					drawingWire			= true;
					drawingWireIO		= [($(this).hasClass('left') ? 'input' : ($(this).hasClass('right') ? 'output' : null)), $(this).text()];
				}
			}).bind('mouseup', function() {
				if(drawingWire && drawingWireWindow !== null && drawingWireIO !== null) {
					if($(this).hasClass('content') && $(this).parents('.nmWindow').attr('id') !== drawingWireWindow && (($(this).hasClass('left') && drawingWireIO[0] == 'output') || ($(this).hasClass('right') && drawingWireIO[0] == 'input'))) {
						var destData	= $.data(document, 'wires-dest');
						var srcData		= $.data(document, 'wires-src');
						if(destData == undefined) {
							destData	= [];
						}
						if(srcData == undefined) {
							srcData		= [];
						}
						var found = false;
						$.each(destData, function(index, valueD) {
							$.each(srcData, function(index, valueS) {
								if($(this).parents('.nmWindow').attr('id') == valueS.pid && valueD.pid == valueS.tid && $(this).text() == valueS.partner && valueD.partner == valueS.name) {
									found = true;
								}
							});
						});
						var x1	= 0;
						var y1	= 0;
						var x2	= 0;
						var y2	= 0;
						var win	= null;
						if(!found) {
							destData[destData.length] = {name: (($(this).parents('.nmWindow').hasClass('serviceio') && $(this).parents('.nmWindow').find('.labelinput').length) ? $(this).parents('.nmWindow').find('.labelinput').val() : $(this).text()), partner: drawingWireIO[1], tid: $(this).parents('.nmWindow').attr('id'), pid: drawingWireWindow, type: (drawingWireIO[0] == 'input' ? 'output' : 'input')};
							srcData[srcData.length] = {name: drawingWireIO[1], partner: (($(this).parents('.nmWindow').hasClass('serviceio') && $(this).parents('.nmWindow').find('.labelinput').length) ? $(this).parents('.nmWindow').find('.labelinput').val() : $(this).text()), tid: drawingWireWindow, pid: $(this).parents('.nmWindow').attr('id'), type: (drawingWireIO[0] == 'input' ? 'input' : 'output')};
							if(drawingWireIO[0] == 'input') {
								win = $('#' + drawingWireWindow + ' .body .left');
								$.each(win, function(index, value) {
									if($(value).text() == drawingWireIO[1]) {
										win = $(value);
									}
								});
								x1 = ($(this).offset().left + (113 + 40)) - 190;
								y1 = ($(this).offset().top + 20) - 50;
								x2 = (win.offset().left - 40) - 190;
								y2 = (win.offset().top + 20) - 50;
							} else {
								win = $('#' + drawingWireWindow + ' .body .right');
								$.each(win, function(index, value) {
									if($(value).text() == drawingWireIO[1]) {
										win = $(value);
									}
								});
								x1 = (win.offset().left + (113 + 40)) - 190;
								y1 = (win.offset().top + 20) - 50;
								x2 = ($(this).offset().left - 40) - 190;
								y2 = ($(this).offset().top + 20) - 50;
							}
							drawPathLine(x1, y1, x2, y2, x1 - 40, x2 + 40);
						}
						$.data(document, 'wires-dest',	destData);
						$.data(document, 'wires-src',	srcData);
					}
				}
				drawingWireWindow	= null;
				drawingWire			= false;
				drawingWireIO		= null;
			});
		}
	}
	$('.layer .nmWindow .body .content.serviceLink').live('mousedown', function(mouse) {
		layer_currentViewAllowed = false;
	}).live('mouseup', function() {
		layer_currentViewAllowed = true;
	});
	$('.layer').live('mousedown', function(mouse) {
		if($.browser.mozilla) {mousewhich = mouse.which;}
		$('.layerhelp').hide();
		if(mouse.which == 1) {
			var potentials	= [];
			var x			= mouse.pageX - 190;
			var y			= mouse.pageY - 50;
			var left		= 0;
			var top			= 0;
			x				= curScale(x);
			y				= curScale(y);
			var layerMovable= true;
			var x1			= x - parseInt($('.layer .viewport').css('margin-left'));
			var y1			= y - parseInt($('.layer .viewport').css('margin-top'));
			
			layer_currentMouseOffset	= [mouse.pageX, mouse.pageY];
			layer_currentViewOffset		= [parseInt($('.layer .viewport').css('margin-left')), parseInt($('.layer .viewport').css('margin-top'))];
			$.each($('.layer .layerCanvas .nmWindow .handler'), function(index, value) {
				left	= parseInt($(value).parents('.nmWindow').css('left'));
				top		= parseInt($(value).parents('.nmWindow').css('top'));
				if(isNaN(left))	{left	= 0;}
				if(isNaN(top))	{top	= 0;}
				var right	= $(value).parents('.nmWindow').width() + left;
				var bottom	= $(value).parents('.nmWindow .header').height() + top;
				$(value).parents('.nmWindow').css({'opacity': 1});
				if(x1 >= left && x1 <= right && y1 >= top && y1 <= bottom) {
					$(value).parents('.nmWindow').css({'opacity': 0.7});
					potentials[potentials.length] = $(value).parents('.nmWindow');
				}
				bottom		= $(value).parents('.nmWindow').attr('rel-height') + top;
				if(x1 >= left && x1 <= right && y1 >= top && y1 <= bottom) {
					layerMovable = false;
				}
			});
			if(potentials.length > 0) {
				var topmost = -1;
				layerMovable = false;
				layer_currentWindow = potentials[0];
				if(layer_ctrlDown) {
					$.each(potentials, function(index, value) {
						$(value).toggleClass('nmWindow_multiselect');
					});
				} else {
					$.each(potentials, function(index, value) {
						if(parseInt($(value).css('z-index')) > topmost) {
							layer_currentWindow = value;
							left	= parseInt($(value).css('left'));
							top		= parseInt($(value).css('top'));
							layer_currentWindowOffset = [(x - left), (y - top)];
						}
					});
					layer_mouseDown = true;
				}
			} else {
				layer_currentWindow = null;
			}
			if(layer_currentWindow == null && layer_currentViewAllowed) {
				$('.layer').addClass('Dragger');
				$('.layer').addClass('move');
			} else {
				$('.layer').removeClass('Dragger');
				$('.layer').removeClass('move');
			}
			layerWindowToFront($(layer_currentWindow));
		}
		layer_currentViewMovable = layerMovable;
		if(!layerMovable) {
			$('.layer').removeClass('move');
		}
	}).live('mouseup', function(mouse) {
		if($.browser.mozilla) {mouse.which = mousewhich;}
		$('.layer').removeClass('move');
		if(service_mouseDown && service_currentWindow !== null) {
			if(service_currentWindow.label) {
				var x	= mouse.pageX + $('.layer').scrollLeft() - 190;
				var y	= mouse.pageY + $('.layer').scrollTop() - 50;
				x		= curScale(x) - 115;
				y		= curScale(y) - 12;
				x		= x - parseInt($('.layer .viewport').css('margin-left'));
				y		= y - parseInt($('.layer .viewport').css('margin-top'));
				generateLayerWindow(service_currentWindow, x, y);
				
			}
			service_mouseDown		= false;
			service_currentWindow	= null;
		}
		if(layer_currentWindow == null) {
			$('.nmWindow_multiselect').removeClass('nmWindow_multiselect');
			checkWindowsForErrors();
		}
		layer_mouseDown		= false;
		layer_currentWindow	= null;
		$('.layer').addClass('Dragger');
		$('.layer .layerCanvas .nmWindow').css({'opacity': 1});
		if($.browser.mozilla) {mousewhich = 0;}
	}).live('mousemove', function(mouse) {
		if($.browser.mozilla) {mouse.which = mousewhich;}
		if($('#layerContext').hidden()) {
			var tmp_layer_currentWindow	= null;
			var potentials				= [];
			var x						= mouse.pageX - 190;
			var y						= mouse.pageY - 50;
			var left					= 0;
			var top						= 0;
			x							= curScale(x);
			y							= curScale(y);
			$.each($('.layer .layerCanvas .nmWindow .handler'), function(index, value) {
				left	= parseInt($(value).parents('.nmWindow').css('left')) + parseInt($('.layer .viewport').css('margin-left'));
				top		= parseInt($(value).parents('.nmWindow').css('top')) + parseInt($('.layer .viewport').css('margin-top'));
				if(isNaN(left))	{left	= 0;}
				if(isNaN(top))	{top	= 0;}
				var right	= $(value).parents('.nmWindow').width() + left;
				var bottom	= $(value).parents('.nmWindow .header').height() + top;
				$(value).parents('.nmWindow').css({'opacity': 1});
				if(x >= left && x <= right && y >= top && y <= bottom) {
					$(value).parents('.nmWindow').css({'opacity': 0.9});
					potentials[potentials.length] = $(value).parents('.nmWindow');
				}
			});
			if(potentials.length > 0) {
				var topmost = -1;
				tmp_layer_currentWindow = potentials[0];
				$.each(potentials, function(index, value) {
					if(parseInt($(value).css('z-index')) > topmost) {
						layer_currentWindow = value;
						left	= parseInt($(value).css('left'));
						top		= parseInt($(value).css('top'));
					}
				});
			} else {
				tmp_layer_currentWindow = null;
			}
			$('#layerContext .rename').attr('nmWindow', (tmp_layer_currentWindow == null) ? '' : $(tmp_layer_currentWindow).attr('id'));
			if(tmp_layer_currentWindow !== null) {
				$('#layerContext .rename').show();
			} else {
				$('#layerContext .rename').hide();
			}
		}
		if(layer_mouseDown && layer_currentWindow !== null) {
			var x = mouse.pageX - 190;
			var y = mouse.pageY - 50;
			x = curScale(x) - layer_currentWindowOffset[0];
			y = curScale(y) - layer_currentWindowOffset[1];
			if(snapToGrid) {
				x = parseInt(x / snapToSize) * snapToSize;
				y = parseInt(y / snapToSize) * snapToSize;
			}
			if(drawingWire) {
			} else {
				$multiselectWindows = $('.nmWindow_multiselect');
				if(!$(layer_currentWindow).hasClass('nmWindow_multiselect')) {
					$multiselectWindows.removeClass('nmWindow_multiselect');
					$multiselectWindows = [];
				}
				var left	= parseInt($(layer_currentWindow).css('left'));
				var top		= parseInt($(layer_currentWindow).css('top'));
				if($multiselectWindows.length > 0) {
					var enable_move_x = true;
					var enable_move_y = true;
					var _x = 0;
					var _y = 0;
					var move = {};
					$.each($multiselectWindows, function(index, value) {
						if($(layer_currentWindow).attr('id') !== $(value).attr('id')) {
							_x = parseInt($(value).css('left'))	+ (x - left);
							_y = parseInt($(value).css('top'))	+ (y - top);
							enable_move_x = _x > 0 ? true : false;
							enable_move_y = _y > 0 ? true : false;
						}
					});
					if(enable_move_x) {
						move.left = x + 'px';
					}
					if(enable_move_y) {
						move.top = y + 'px';
					}
					$(layer_currentWindow).css(move);
					$.each($multiselectWindows, function(index, value) {
						if($(layer_currentWindow).attr('id') !== $(value).attr('id')) {
							_x = parseInt($(value).css('left'))	+ (x - left);
							_y = parseInt($(value).css('top'))	+ (y - top);
							if(enable_move_x) {
								move.left = _x + 'px';
							}
							if(enable_move_y) {
								move.top = _y + 'px';
							}
							$(value).css(move);
						}
					});
				} else {
					$(layer_currentWindow).css({
						'left':	x + 'px',
						'top':	y + 'px'
					});
				}
			}
			renderPathLine();
		} else {
			if(mouse.which == 1 && service_currentWindow == null && layer_currentViewMovable && layer_currentViewAllowed) {
				var x = mouse.pageX - layer_currentMouseOffset[0];
				var y = mouse.pageY - layer_currentMouseOffset[1];
				$('.layer .viewport').css({
					'margin-left':	layer_currentViewOffset[0] + x,
					'margin-top':	layer_currentViewOffset[1] + y
				});
				renderPathLine();
			}
		}
	});
	$('.nmWindow .handler').live('dblclick', function() {
		var $this = $(this).parents('.nmWindow');
		$this.toggleClass('collapsed');
		var temp_height = 24 + $this.find('.body').height();
		$this.attr('rel-height', $this.attr('rel-height') > temp_height ? $this.attr('rel-height') : temp_height);
		if($this.hasClass('collapsed')) {
			$this.css('height', '24px');
			$this.find('.body .content').css({left: '16px', position: 'absolute', top: '-26px', opacity: 0});
			$this.find('.body .right').css({left: '86px'});
			$this.find('.body .right').css({left: '86px'});
		} else {
			$this.find('.body .content').css({left: '0px', position: '', top: '0px', opacity: 1});
			$this.find('.body .right').css({left: '0px'});
			$this.css('height', $this.attr('rel-height') + 'px');
		}
		checkWindowsForErrors();
		$(window).trigger('resize');
	});
	$('.nmWindow .handler').live('tripleclick_Disabled', function() {
		var $this = $(this).parents('.nmWindow');
		if(!$this.hasClass('nmWelcome')) {
			$.data(document, 'nmRename_ID', $this.attr('id'));
			$this.addClass('collapsed');
			$(this).trigger('dblclick');
			$.dialogBox(
				'<input type="text" class="nmRenameLabel" value="' + $this.find('.header .handler').text() + '"/>',
				'none',
				{
					'Cancel': 0,
					'Rename': 1
				},
				function(val) {
					if(val == 1) {
						$('#' + $.data(document, 'nmRename_ID')).find('.header .handler').text($.data(document, 'nmRename_value'));
						checkWindowsForErrors();
					}
				},
				function() {
					$('.nmRenameLabel').bind('change', function() {
						$.data(document, 'nmRename_value', $('.nmRenameLabel').val());
					});
					$('.nmRenameLabel').bind('keypress', function() {
						$.data(document, 'nmRename_value', $('.nmRenameLabel').val());
					});
				}
			);
		}
	});
	$(document).live('keydown', function(k) {
		if(k.keyCode == 17) { //Ctrl
			layer_ctrlDown = true;
		}
	}).live('keyup', function(k) {
		if(k.keyCode == 17) { //Ctrl
			layer_ctrlDown = false;
		}
	});
	$(window).keydown(function(e) {
		if(e.keyCode == 17) { //Ctrl
		}
	}).keyup(function(e) {
		if(e.keyCode == 17) { //Ctrl
		}
	});
/*Scale*/																												//====			======			======|
	$('.scale_zoom .slider').slider({
		min: -3,
		max: 0,
		change: function(event, ui) {
			var value = (ui.value >= 0) ? ui.value + 1 : ui.value;
			switch(ui.value) {
				case 3:
					value = 1.75;
				break;
				case 2:
					value = 1.5;
				break;
				case 1:
					value = 1.25;
				break;
				case 0:
					value = 1;
				break;
				case -1:
					value = 0.75;
				break;
				case -2:
					value = 0.5;
				break;
				case -3:
					value = 0.25;
				break;
				default:
					value = 1;
				break;
			}
			current_scale = value;
			$('.layer .layerCanvas').css({
				'-webkit-transform':'scale(' + value + ')',
				'-moz-transform':	'scale(' + value + ')',
				'-ms-transform':	'scale(' + value + ')',
				'-o-transform':		'scale(' + value + ')',
				'transform':		'scale(' + value + ')'
			});
			$(window).trigger('resize');
		}
	});
	$('.layer').bind('mousewheel', function(e, d) {
		var slider_val = $('.scale_zoom .slider').slider('value');
		var slider_ori = slider_val;
		if(typeof(d) == 'undefined') {
			d = e.originalEvent.wheelDelta;
		}
		d = d > 0 ? 1 : -1;
		switch(slider_val) {
			case 0:
				slider_val = (d == 1) ? 0	: (d == -1) ? -1 : slider_val;
			break;
			case -1:
				slider_val = (d == 1) ? 0 	: (d == -1) ? -2 : slider_val;
			break;
			case -2:
				slider_val = (d == 1) ? -1	: (d == -1) ? -3 : slider_val;
			break;
			case -3:
				slider_val = (d == 1) ? -2	: (d == -1) ? -3 : slider_val;
			break;
			default:
			break;
		}
		if(slider_ori !== slider_val) {
			$('.layerCanvas').css({
				//'margin-left': '' + e.offsetX + 'px'
			});
		}
		$('.scale_zoom .slider').slider('value', slider_val);
	});
/*Help Screen*/																											//=====			======			======|
	$(window).keydown(function(e) {
		switch(e.keyCode) {
			case 112: //F1
				load_help_menu();
				return false;
			 break;
		}
	});
	window.load_help_menu = function() {
		var $this = $('.f1_help_screen');
		if($this.hasClass('animating')) {
			return false;
		}
		$this.addClass('animating');
		if($this.hasClass('expanded')) {
			$this.css({'opacity': 1, 'display': 'block'}).animate({'opacity': 0}, 400, function() {
				$this.removeClass('expanded').removeClass('animating').hide();
			});
			} else {
				$this.css({'opacity': 0, 'display': 'block'}).animate({'opacity': 1}, 400, function() {
				$this.addClass('expanded').removeClass('animating');
			});
		}
		return false;
	}
/*Resize*/																												 //======	   ======			======|
	$([window, document]).resize(function() {
		$('body').css({
			height:	$(window).height(),
			width:	$(window).width()
		});
		$('html').css({
			height:	$(window).height(),
			width:	$(window).width()
		});
		$('.scale_zoom').css({
			'left':		((($(window).width() - 200 ) > 0)	? $(window).width() - 200  : 0) + 'px',
			'top':		((($(window).height() - 40) > 0)	? $(window).height() - 40 : 0) + 'px',
		});
		$('.layer').css({
			'left':		'190px',
			'top':		'50px',
			'width':	((($(window).width() - 190 ) > 0)	? $(window).width() - 190  : 0) + 'px',
			'height':	((($(window).height() - 50) > 0)	? $(window).height() - 50 : 0) + 'px',
		});

		var canvas = document.getElementById('wireGridCanvas');
		$(canvas).css({
			'height':	$(document).height()+ 'px',
			'width':	$(document).width() + 'px'
		});
		var ctx	= null;
		if(canvas !== null) {
			ctx			= canvas.getContext('2d');
			canvas.height	= $(document).height();
			canvas.width	= $(document).width();
		}
		var $scale = (
			(current_scale == 1)	? 100 : (
			(current_scale == 0.25)	? 400 : (
			(current_scale == 0.5)	? 200 : (
			(current_scale == 0.75)	? 133.3 : (
			(current_scale == 0)	? 100 : (
			0
		))))));
		var $margin = (
			(current_scale == 1)	? 0 : (
			(current_scale == 0.25) ? 2.666 : (
			(current_scale == 0.5)	? 4 : (
			(current_scale == 0.75)	? 8 : (
			(current_scale == 0)	? 0 : (
			0
		))))));
		var $radius = (
			(current_scale == 1)	? 24 : (
			(current_scale == 0.25)	? 94 : (
			(current_scale == 0.5)	? 45 : (
			(current_scale == 0.75)	? 30 : (
			(current_scale == 0)	? 24 : (
			0
		))))));

		var Infinity = 0;
		var width	= ((($('.layer').width()	/ 100) * $scale));
		var height	= ((($('.layer').height()	/ 100) * $scale));
		var left	=-((($('.layer').width()	/ 100) * $scale) / $margin);
		var top		=-((($('.layer').height()	/ 100) * $scale) / $margin);
		//console.log(height);
		if(current_scale == 1) {
			left = 0;
			top = 0;
		}
		/*$.each($('.nmWindow'), function(index, value) {
			if(230 + $(this).offset().left > width) {
				width = 330 + $(this).offset().left;
			}
			if($(this).attr('rel-height') + $(this).offset().top > height) {
				height = ($(this).attr('rel-height') + 100) + $(this).offset().top;
			}
		});*/
		$('.layer .layerCanvas').css({
			'width':	width + 'px',
			'left':		left + 'px',
			'height':	height + 'px',
			'top':		top + 'px',
			'-webkit-border-radius':$radius + 'px 0 0 0',
			'-moz-border-radius':	$radius + 'px 0 0 0',
			'-ms-border-radius':	$radius + 'px 0 0 0',
			'-o-border-radius':		$radius + 'px 0 0 0',
			'border-radius':		$radius + 'px 0 0 0'
		});
		$('#servicePanel').css({'height':$(window).height() - 45, 'left': $(window).width() - 300});
		$('#settingsPanel').css({'top': ($(document).height() - 240) + 'px', 'left': (($(document).width() / 2) -  ($('#settingsPanel').width() / 2)) + 'px'});

		$('#serviceScrollArea, #serviceScrollArea .viewport').height($('#servicePanel').height() - ($('.serviceListSearchFilterAndIO').height() + ($.browser.msie ? 35 : 55)));
		//console.log($('#serviceScrollArea'));
		$('#serviceScrollArea').tinyscrollbar_update();
		//console.log($('#serviceScrollArea'));
		var settingsMenuObj = $('#settingsMenu');
		$('#workspacePanel').css({top:(settingsMenuObj.outerHeight(true) + settingsMenuObj.offset().top + 3) + 'px'});

		redrawGrid();
		renderPathLine();

		$.each($('.dialogBoxWindow'), function(index, value) {
			$(value).css({
				'left':	($(value).parent().width() / 2)		- ($(value).width() / 2),
				'top':	($(value).parent().height() / 2)	- ($(value).height() / 2)
			});
		});
	});

	$(document).bind('mousemove', function(mouse) {
		
	});
	$(document).bind('mouseup', function(mouse) {
		layer_mouseDown			= false;
		layer_currentWindow		= null;
		service_mouseDown		= false;
		service_currentWindow	= null;
	});
																														  //================		   =======|
load_panel('workspace', function() {return false;});																	   //==============			 ========/
load_panel('service', function() {return false;});																		     //=========			=======/
load_panel('settings', function() {return false;});
load_menu('workspace', 'Workspace', function($this) {workspacePlugin.toggle(); $(window).resize();});
load_menu('service', 'Service List', function($this) {servicePlugin.toggle(); $(window).resize();});
load_menu('settings', 'Settings', function($this) {settingsPlugin.toggle(); $(window).resize();});
spinHex(false, 0);
if($.browser.msie) {
}
servicePlugin.bind();
settingsPlugin.bind();
workspacePlugin.bind();
																											
/*Load INIT WSDL*/
	initialLoaded = true;
	$('.emuis_loading_progressbar').progressbar({value: 0});
	parseWSDL(wsdlURL, function(arrayContainers) {
		$(window).resize();
		console.log(arrayContainers);
		servicePlugin.list(arrayContainers);
		$(document).resize();
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
/*After INIT WSDL*/
	$('#nmWindow_' + createLayerWindow({
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
	$('.checkbox-ui').bind('click', function() {$(this).toggleClass('checked');});

$('.serviceio_title .title').trigger('click');
clearInterval(InitPlugins);}}, 100);

/*Controller*/
	devel?0:console={log:function(){}};
	jQuery.fn.outerHTML=function(s){return s?this.before(s).remove():jQuery("<div>").append(this.eq(0).clone()).html();};
	window.templates = $(ajax('templates.php', true));
	$.hasFileReader = (typeof(File) == 'function' && typeof(FileReader) == 'function' && typeof(FileList) == 'function' && typeof(Blob) == 'function') ? true : false;
	$.data(document, 'template-importdialog',		templates.find('importdialog' + ($.hasFileReader ? '_async' : '') + 'late').html());
	$.data(document, 'template-layerwindow_sync',	templates.find('layerwindow_synclate').html());
	$.data(document, 'template-layerwindow_async',	templates.find('layerwindow_asynclate').html());
	$.data(document, 'template-layerhelp',			templates.find('layerhelplate').html());
	$.data(document, 'template-menu',				templates.find('menulate').html());
	$.data(document, 'template-savedialog',			templates.find('savedialoglate').html());
	$.data(document, 'template-saveoverdialog',		templates.find('saveoverdialoglate').html());
	$.data(document, 'template-deletedialog',		templates.find('deletedialoglate').html());
	$.data(document, 'serviceList-syncItem',		templates.find('serviceList-syncItemlate').html());
	$.data(document, 'serviceList-aSyncItem',		templates.find('serviceList-aSyncItemlate').html());
	$.data(document, 'serviceList-LI',				templates.find('serviceList-aSyncItemlate').html());
	$.data(document, 'serviceList-LI-Services',		templates.find('serviceList-LI-Serviceslate').html());
	$.data(document, 'serviceLi-WSDL',				templates.find('serviceList-WSDLItemlate').html());
	$.data(document, 'serviceWindow-IO-Input',		templates.find('serviceWindow-IO-Inputlate').html());
	$.data(document, 'serviceWindow-IO-Output',		templates.find('serviceWindow-IO-Outputlate').html());
	$.data(document, 'serviceWindow-Link',			templates.find('serviceWindow-Linklate').html());
	$.data(document, 'loadWSDL-Dialog',				templates.find('loadWSDL-Dialoglate').html());
	$.data(document, 'workspacePanel',				templates.find('workspacePanellate').html());
	$.data(document, 'settingsPanel',				templates.find('settingsPanellate').html());
	$.data(document, 'servicePanel',				templates.find('servicePanellate').html());
	window.dialogBoxTemplate = 						$(templates.find('dialogBoxlate').html());

function checkRedundantWires() {
	var src		= $.data(document, 'wiresSrc');
	var dest	= $.data(document, 'wiresDest');
	if(src	== undefined) {src	= []};
	if(dest	== undefined) {dest	= []};
	$.each(src, function(index, value) {
		console.log(value);
		if($('#' + value.pid).length < 1) {
			src.splice(index, 1);
		}
		if($('#' + value.tid).length < 1) {
			src.splice(index, 1);
		}
	});
	$.each(dest, function(index, value) {
		if($('#' + value.pid).length < 1) {
			dest.splice(index, 1);
		}
		if($('#' + value.tid).length < 1) {
			dest.splice(index, 1);
		}
	});
	$.data(document, 'wiresSrc', src);
	$.data(document, 'wiresDest', dest);
}

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
	var c		= document.getElementById('wireGridCanvas');
	var v		= $('#wireGridCanvas');
	var x		= c.getContext('2d');
	var grid	= [];
	var windows	= $('.nmWindow');
	x.lineWidth	= 5;
	size = 20 * 1;//current_scale;
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
	var rows	= Math.ceil(v.height() / size);
	var columns	= Math.ceil(v.width() / size);
	for(var _x = 0; _x < columns; _x++) {
		grid[_x] = [];
		for(var _y = 0; _y < rows; _y++) {
			var inWay = false;
			$.each(windows, function(index, value) {
				if(_x >= value[0] && _x <= value[2] && _y >= value[1] && _y <= value[3]) {
					inWay = true;
				}
			});
			grid[_x][_y]	= (inWay ? 1 : 0);
			if(inWay) {
			}
		}
	}
	if(!update) {
		var start	= [Math.floor(parseInt(x1) / size), Math.floor(parseInt(y1) / size)];
		var end		= [Math.floor(parseInt(x2) / size), Math.floor(parseInt(y2) / size)];
		var path	= a_star(start, end, grid, rows, columns, !(grid[start[0]][start[1]] !== 1 && grid[end[0]][end[1]] !== 1));
	} else {
	}
	x.beginPath();
	$.each(windows, function(index, value) {
	});
	if(!update) {
		x.moveTo(start[0] * size, start[1] * size);
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
			});
		} else {
			x.lineTo(x2, y2);
		}
		if(x3 == 0 || x4 == 0) {
		} else {
			x.lineTo(x4, y2);
		}
	} else {
		var wires = $.data(document, 'wires-dest') || [];
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
			/*to.left = to.left * current_scale;
			to.top = to.top * current_scale;
			po.left = po.left * current_scale;
			po.top = po.top * current_scale;*/
			x.moveTo((to.left - 190) + ((value.type == 'input') ? -16 : 140), to.top - 35);
			x.lineTo((po.left - 190) + ((value.type == 'input') ? 140 : -16), po.top - 35);
		});
	}
	x.stroke();
}