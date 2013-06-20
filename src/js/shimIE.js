(function () {

	/*global self, document, DOMException */
	/*! @source http://purl.eligrey.com/github/classList.js/blob/master/classList.js*/

	if (typeof document !== "undefined" && !("classList" in document.createElement("a"))) {

	(function (view) {

	"use strict";

	if (!('HTMLElement' in view) && !('Element' in view)) return;

	var
		  classListProp = "classList"
		, protoProp = "prototype"
		, elemCtrProto = (view.HTMLElement || view.Element)[protoProp]
		, objCtr = Object
		, strTrim = String[protoProp].trim || function () {
			return this.replace(/^\s+|\s+$/g, "");
		}
		, arrIndexOf = Array[protoProp].indexOf || function (item) {
			var
				  i = 0
				, len = this.length
			;
			for (; i < len; i++) {
				if (i in this && this[i] === item) {
					return i;
				}
			}
			return -1;
		}
	// Vendors: please allow content code to instantiate DOMExceptions
	, DOMEx = function (type, message) {
		this.name = type;
		this.code = DOMException[type];
		this.message = message;
	}
	, checkTokenAndGetIndex = function (classList, token) {
		if (token === "") {
			throw new DOMEx(
				  "SYNTAX_ERR"
				, "An invalid or illegal string was specified"
			);
		}
		if (/\s/.test(token)) {
			throw new DOMEx(
				  "INVALID_CHARACTER_ERR"
				, "String contains an invalid character"
			);
		}
		return arrIndexOf.call(classList, token);
	}
	, ClassList = function (elem) {
		var
			  trimmedClasses = strTrim.call(elem.className)
			, classes = trimmedClasses ? trimmedClasses.split(/\s+/) : []
			, i = 0
			, len = classes.length
		;
		for (; i < len; i++) {
			this.push(classes[i]);
		}
		this._updateClassName = function () {
			elem.className = this.toString();
		};
	}
	, classListProto = ClassList[protoProp] = []
	, classListGetter = function () {
		return new ClassList(this);
	}
	;
	// Most DOMException implementations don't allow calling DOMException's toString()
	// on non-DOMExceptions. Error's toString() is sufficient here.
	DOMEx[protoProp] = Error[protoProp];
	classListProto.item = function (i) {
		return this[i] || null;
	};
	classListProto.contains = function (token) {
		token += "";
		return checkTokenAndGetIndex(this, token) !== -1;
	};
	classListProto.add = function () {
		var
			  tokens = arguments
			, i = 0
			, l = tokens.length
			, token
			, updated = false
		;
		do {
			token = tokens[i] + "";
			if (checkTokenAndGetIndex(this, token) === -1) {
				this.push(token);
				updated = true;
			}
		}
		while (++i < l);

		if (updated) {
			this._updateClassName();
		}
	};
	classListProto.remove = function () {
		var
			  tokens = arguments
			, i = 0
			, l = tokens.length
			, token
			, updated = false
		;
		do {
			token = tokens[i] + "";
			var index = checkTokenAndGetIndex(this, token);
			if (index !== -1) {
				this.splice(index, 1);
				updated = true;
			}
		}
		while (++i < l);

		if (updated) {
			this._updateClassName();
		}
	};
	classListProto.toggle = function (token, forse) {
		token += "";

		var
			  result = this.contains(token)
			, method = result ?
				forse !== true && "remove"
			:
				forse !== false && "add"
		;

		if (method) {
			this[method](token);
		}

		return !result;
	};
	classListProto.toString = function () {
		return this.join(" ");
	};

	if (objCtr.defineProperty) {
		var classListPropDesc = {
			  get: classListGetter
			, enumerable: true
			, configurable: true
		};
		try {
			objCtr.defineProperty(elemCtrProto, classListProp, classListPropDesc);
		} catch (ex) { // IE 8 doesn't support enumerable:true
			if (ex.number === -0x7FF5EC54) {
				classListPropDesc.enumerable = false;
				objCtr.defineProperty(elemCtrProto, classListProp, classListPropDesc);
			}
		}
	} else if (objCtr[protoProp].__defineGetter__) {
		elemCtrProto.__defineGetter__(classListProp, classListGetter);
	}

	}(self));

	}
/* End classList.js */

	// Apply addEventListener to all the prototypes where it should be available.
	HTMLDocument.prototype.addEventListener =
	Element.prototype.addEventListener =
	Window.prototype.addEventListener = function (type, fCallback, capture)
	{
	  var modtypeForIE = "on" + type;
	  if (capture)
	  {
		throw new Error("This implementation of addEventListener does not support the capture phase");
	  }
	  var nodeWithListener = this;
	  this.attachEvent(modtypeForIE, function (e) {
		// Add some extensions directly to 'e' (the actual event instance)
		// Create the 'currentTarget' property (read-only)
		Object.defineProperty(e, 'currentTarget', {
		  get: function() {
			 // 'nodeWithListener' as defined at the time the listener was added.
			 return nodeWithListener;
		  }
		});
		// Create the 'eventPhase' property (read-only)
		Object.defineProperty(e, 'eventPhase', {
		  get: function() {
			return (e.srcElement == nodeWithListener) ? 2 : 3; // "AT_TARGET" = 2, "BUBBLING_PHASE" = 3
		  }
		});
		// Create a 'timeStamp' (a read-only Date object)
		var time = new Date(); // The current time when this anonymous function is called.
		Object.defineProperty(e, 'timeStamp', {
		  get: function() {
			return time;
		  }
		});
		// Call the function handler callback originally provided...
		fCallback.call(nodeWithListener, e); // Re-bases 'this' to be correct for the callback.
	  });
	}

	// Extend Event.prototype with a few of the W3C standard APIs on Event
	// Add 'target' object (read-only)
	Object.defineProperty(Event.prototype, 'target', {
	  get: function() {
		return this.srcElement;
	  }
	});
	// Add 'stopPropagation' and 'preventDefault' methods
	Event.prototype.stopPropagation = function () {
	  this.cancelBubble = true;
	};
	Event.prototype.preventDefault = function () {
	  this.returnValue = false;
	};

 // http://ajaxian.com/archives/creating-a-queryselector-for-ie-that-runs-at-native-speed

  if (!document.querySelectorAll) {
	document.querySelectorAll = function (selectors) {
	  var style = document.createElement('style'), elements = [], element;
	  document.documentElement.firstChild.appendChild(style);
	  document._qsa = [];

	  style.styleSheet.cssText = selectors + '{x-qsa:expression(document._qsa && document._qsa.push(this))}';
	  window.scrollBy(0, 0);
	  style.parentNode.removeChild(style);

	  while (document._qsa.length) {
		element = document._qsa.shift();
		element.style.removeAttribute('x-qsa');
		elements.push(element);
	  }
	  document._qsa = null;
	  return elements;
	};
  }

  if (!document.querySelector) {
	document.querySelector = function (selectors) {
	  var elements = document.querySelectorAll(selectors);
	  return (elements.length) ? elements[0] : null;
	};
  }

  if (!document.getElementsByClassName) {
	document.getElementsByClassName = function (classNames) {
		classNames = String(classNames).replace(/^|\s+/g, '.');
		return document.querySelectorAll(classNames);
	};
	Element.prototype.getElementsByClassName = document.getElementsByClassName;
  }

if (!Array.prototype.indexOf) {
  Array.prototype.indexOf = function (searchElement /*, fromIndex */ ) {
	if (this == null) {
	  throw new TypeError();
	}
	var t = Object(this);
	var len = t.length >>> 0;

	if (len === 0) {
	  return -1;
	}
	var n = 0;
	if (arguments.length > 1) {
	  n = Number(arguments[1]);
	  if (n != n) { // shortcut for verifying if it's NaN
		n = 0;
	  } else if (n != 0 && n != Infinity && n != -Infinity) {
		n = (n > 0 || -1) * Math.floor(Math.abs(n));
	  }
	}
	if (n >= len) {
	  return -1;
	}
	var k = n >= 0 ? n : Math.max(len - Math.abs(n), 0);
	for (; k < len; k++) {
	  if (k in t && t[k] === searchElement) {
		return k;
	  }
	}
	return -1;
  }
}


}());