/*! skipto - v2.0.4 - 2019-07-30
* https://github.com/paypal/skipto
* Copyright (c) 2019 PayPal Accessibility Team and University of Illinois; Licensed BSD */
 /*@cc_on @*/
/*@if (@_jscript_version >= 5.8) @*/
/* ========================================================================
* Copyright (c) <2019> PayPal

* All rights reserved.

* Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.

* Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.

* Neither the name of PayPal or any of its subsidiaries or affiliates nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission.

* THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
* ======================================================================== */

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

if (!Window.prototype.addEventListener){

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
		// Call the function handler callback originally provided...if callback function available
		if (typeof fCallback === 'function')
			fCallback.call(nodeWithListener, e); // Re-bases 'this' to be correct for the callback.
	  });
	}

	// Extend Event.prototype with a few of the W3C standard APIs on Event Add 'target' object (read-only)
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

}());;/* ========================================================================
* Copyright (c) <2019> PayPal

* All rights reserved.

* Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.

* Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.

* Neither the name of PayPal or any of its subsidiaries or affiliates nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission.

* THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
* ======================================================================== */

(function () {
	"use strict";

	var Dropdown = {};

	Dropdown.prototype = {
		btn: null,
		prt: null,
		menu: null,
		wrap: "false",
		config: {
			callbacks: [],
			focusOnClick: "false",
		},

		setUpConfig: function (config) {
			var i,
				idConfig;

			// TODO: This only applies to ids for now. Think through how to extend to other elements
			if (typeof config.ids !== 'object') return;

			for (i = 0;  i < config.ids.length; i = i + 1) {
				idConfig = config.ids[i];
				if (typeof idConfig === 'object' && idConfig.callback) {
					this.config.callbacks[idConfig.id] = idConfig.callback;
				}
			}

			this.config.focusOnClick = config.focusOnClick;
		},

		clearMenus: function () {
			var self = this;
			setTimeout(function () {
				var isActive = self.prt.classList.contains('open');
				if ((!isActive) || (self.prt.contains(document.activeElement))) {
					return;
				}
				self.prt.classList.remove('open');
				self.btn.setAttribute('aria-expanded', 'false');
			}, 150);
		},

		initOptList: function (e) {
			this.btn = e.target;
			this.prt = this.btn.parentNode;
			this.menu = document.getElementById(this.btn.getAttribute('data-target'));
			this.toggleOptList();
		},

		toggleOptList: function () {
			if(typeof this.btn.getAttribute('data-wrap') !== 'undefined') {
				this.wrap = this.btn.getAttribute('data-wrap');
			}
			this.prt.classList.toggle('open');
			//Set Aria-expanded to true only if the class open exists in dropMenu div
			if (this.prt.classList.contains('open')) {
				this.btn.setAttribute('aria-expanded', 'true');
			} else {
				this.btn.setAttribute('aria-expanded', 'false');
			}
			try {
				this.menu.getElementsByTagName('a')[0].focus();
			}
			catch(err) {
			}
		},

		navigateMenus: function (e) {
			var keyCode = e.keyCode || e.which,
				arrow = {
					spacebar: 32,
					up: 38,
					esc: 27,
					down: 40
				},
				isActive = this.prt.classList.contains('open'),
				items = this.menu.getElementsByTagName("a"),
				index = Array.prototype.indexOf.call(items, e.target);
	
			if (!/(32|38|40|27)/.test(keyCode)) {
				return;
			}
			e.preventDefault();

			switch (keyCode) {
				case arrow.down:
					index = index + 1;
					break;
				case arrow.up:
					index = index - 1;
					break;
				case arrow.esc:
					if (isActive) {
						this.btn.click();
						this.btn.focus();
						return;
					}
					break;
			}
			if (index < 0) {
				if(this.wrap === 'true'){
					index = items.length - 1;
				}else{
					index=0;
				}
			}
			if (index === items.length) {
				if(this.wrap === 'true'){
					index = 0;
				}else{
					index = items.length -1;
				}
			}

			items.item(index).focus();
		},

		executeCallback: function (e) {
			var id = e.target.getAttribute('href').replace('#', ''),
				target;

			if (this.config.callbacks.hasOwnProperty(id)) {
				e.preventDefault();
				this.config.callbacks[id]();
				this.toggleOptList();
			} else if (this.config.focusOnClick !== 'false') {
				e.preventDefault();
				target = document.getElementById(id);
				target.tabIndex = 0;
				target.focus();
				target.scrollIntoView(true); //IE8 - Make sure to scroll to top
				this.toggleOptList();
			}
		},

		init: function (config) {
			var toggle = document.getElementsByClassName('dropMenu-toggle'),
				toggleBtn,
				k,
				l,
				menu,
				items,
				i,
				j,
				self=this,
				item;

			this.setUpConfig(config);

			for (k = 0, l = toggle.length; k < l; k = k + 1) {
				toggleBtn = toggle[k];
				menu = document.getElementById(toggleBtn.getAttribute('data-target'));
				items = menu.getElementsByTagName("a");

				toggleBtn.addEventListener('click', function(e) {
					self.initOptList(e);
				});
				toggleBtn.addEventListener('keydown', function(e){
					var keyCode = e.keyCode || e.which,
						arrow = {
							spacebar: 32,
							down: 40
						};
					/* 
						SpaceBar and down arrow should open the menu 
						https://www.w3.org/TR/wai-aria-practices-1.1/examples/menu-button/menu-button-links.html
					*/
					if(keyCode === arrow.spacebar || keyCode === arrow.down) {
						this.click(e);
						e.preventDefault();
					}
				});

				for (i = 0, j = items.length; i < j; i = i + 1) {
					item = items[i];
					item.addEventListener('keydown', function(e) {
						self.navigateMenus(e);
					});

					item.addEventListener('blur', function(e) {
						self.clearMenus(e);
					});

					item.addEventListener('click', function(e) {
						self.executeCallback(e);
					});
				}
			}
		} //end init

	}; //End Dropdown class

	// Dropdown.prototype.init();

	window.skipToDropDownInit = function(customConfig) {
		Dropdown.prototype.init(customConfig || window.Drupal || window.Wordpress || window.SkipToConfig || {});
	};

}(window.Drupal || window.Wordpress || window.SkipToConfig || {}));;/* ========================================================================
* Copyright (c) <2019> PayPal

* All rights reserved.

* Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.

* Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.

* Neither the name of PayPal or any of its subsidiaries or affiliates nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission.

* THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
* ======================================================================== */


(function () {
	"use strict";
	var SkipTo = {};

	SkipTo.prototype = {
		headingElementsArr:  [],
		landmarkElementsArr:  [],
		idElementsArr:  [],
		dropdownHTML: null,
		config: {
			buttonLabel:    'Skip To...',
			buttonDivTitle: 'Skip To Keyboard Navigation',
			buttonDivRole: 'complementary',
			buttonDivLabel: '',
			menuLabel:      'Skip To and Page Outline',
			landmarksLabel: 'Skip To',
			headingsLabel:  'Page Outline',
			contentLabel: ' Content',
			main:      'main, [role="main"]',
			landmarks: '[role="navigation"], [role="search"]',
			sections:  'nav',
			headings:  'h1, h2, h3',
			ids:       '#SkipToA1, #SkipToA2',
			accessKey: '0',
			wrap: "false",
			focusOnClick: "false",
			hashOnMenu: "true",
			enumerateElements: "false",
			visibility: "onFocus",
			customClass: "",
			attachElement: document.body
		},

		setUpConfig: function (appConfig) {
			var localConfig = this.config,
				name,
				appConfigSettings = typeof appConfig.settings !== 'undefined' ? appConfig.settings.skipTo : {};
				
			for (name in appConfigSettings) {
				//overwrite values of our local config, based on the external config
				if (localConfig.hasOwnProperty(name)) {
					localConfig[name] = appConfigSettings[name];
				}
			}
		},

		init: function (appConfig) {

			this.setUpConfig(appConfig);
			// if the menu exists, recreate it
			if(document.getElementById('skipToMenu')!==null){
				var existingMenu=document.getElementById('skipToMenu');
				existingMenu.parentNode.removeChild(existingMenu);
			}

			var div = document.createElement('div'),
			attachElement = (!this.config.attachElement.nodeType) ? document.querySelector(this.config.attachElement) : this.config.attachElement,
			htmlStr = '';

			div.setAttribute('id', 'skipToMenu');
			if(this.config.buttonDivRole!==''){div.setAttribute('role', this.config.buttonDivRole);}
			if(this.config.buttonDivTitle!==''){div.setAttribute('title', this.config.buttonDivTitle);}
			if(this.config.buttonDivLabel!==''){div.setAttribute('aria-label', this.config.buttonDivLabel);}

			this.addStyles(".skipTo{padding:.5em;position:absolute;background:transparent;color:#000;-webkit-transition:top .5s ease-out, background .5s linear;-moz-transition:top .5s ease-out, background .5s linear;-o-transition:top .5s ease-out, background .5s linear;transition:top .5s ease-out, background .5s linear}.skipTo:focus{position:absolute;top:0;left:0;background:#ccc;z-index:3000;text-decoration:underline;-webkit-transition:top .1s ease-in, background .3s linear;-moz-transition:top .1s ease-in, background .3s linear;-o-transition:top .1s ease-in, background .3s linear;transition:top .1s ease-in, background .3s linear}.onFocus{top:-5em;left:0}.onLoad{top:0 ;left:0;background:#ccc}.dropup,.dropMenu{position:relative}.dropMenu-toggle{*margin-bottom:-3px}.dropMenu-toggle:active,.open .dropMenu-toggle{outline:0}#skipToMenu .caret{display:inline-block;width:0;height:0;vertical-align:top;border-top:4px solid #000;border-right:4px solid transparent;border-left:4px solid transparent;content:'';pointer-events:none}#skipToMenu .dropMenu .caret{margin-top:8px;margin-left:2px}.dropMenu-menu{position:absolute;top:100%;left:0;z-index:3000;display:none;float:left;min-width:160px;padding:5px 0;margin:2px 0 0;list-style:none;background-color:#fff;border:1px solid #ccc;border:1px solid rgba(0,0,0,0.2);*border-right-width:2px;*border-bottom-width:2px;-webkit-border-radius:6px;-moz-border-radius:6px;border-radius:6px;-webkit-box-shadow:0 5px 10px rgba(0,0,0,0.2);-moz-box-shadow:0 5px 10px rgba(0,0,0,0.2);box-shadow:0 5px 10px rgba(0,0,0,0.2);-webkit-background-clip:padding-box;-moz-background-clip:padding;background-clip:padding-box}.dropMenu-menu.pull-right{right:0;left:auto}.dropMenu-menu .divider{*width:100%;height:1px;margin:9px 1px;*margin:-5px 0 5px;overflow:hidden;background-color:#e5e5e5;border-bottom:1px solid #fff}.dropMenu-menu>li>a{display:block;padding:3px 20px;clear:both;font-weight:normal;line-height:20px;color:#333;white-space:nowrap;text-decoration:none}.dropMenu-menu>li>a.po-h1{font-size:110%}.dropMenu-menu>li>a.po-h2{padding-left:28px}.dropMenu-menu>li>a.po-h3{padding-left:36px}.dropMenu-menu>li>a.po-h4{padding-left:44px}.dropMenu-menu>li>a.po-h5{padding-left:52px}.dropMenu-menu>li>a.po-6{padding-left:60px}.dropMenu-menu>li[role=separator]{padding-left:20px;margin-top:9px;font-weight:bold;border-bottom:thin solid black}.dropMenu-menu>li>a:hover,.dropMenu-menu>li>a:focus,.dropMenu-submenu:hover>a,.dropMenu-submenu:focus>a{text-decoration:none;color:#fff;background-color:#0081c2;background-image:-moz-linear-gradient(top, #08c, #0077b3);background-image:-webkit-gradient(linear, 0 0, 0 100%, from(#08c), to(#0077b3));background-image:-webkit-linear-gradient(top, #08c, #0077b3);background-image:-o-linear-gradient(top, #08c, #0077b3);background-image:linear-gradient(to bottom, #08c, #0077b3);background-repeat:repeat-x;filter:progid:DXImageTransform.Microsoft.gradient(startColorstr='#ff0088cc', endColorstr='#ff0077b3', GradientType=0)}.dropMenu-menu>.active>a,.dropMenu-menu>.active>a:hover,.dropMenu-menu>.active>a:focus{color:#fff;text-decoration:none;outline:0;background-color:#0081c2;background-image:-moz-linear-gradient(top, #08c, #0077b3);background-image:-webkit-gradient(linear, 0 0, 0 100%, from(#08c), to(#0077b3));background-image:-webkit-linear-gradient(top, #08c, #0077b3);background-image:-o-linear-gradient(top, #08c, #0077b3);background-image:linear-gradient(to bottom, #08c, #0077b3);background-repeat:repeat-x;filter:progid:DXImageTransform.Microsoft.gradient(startColorstr='#ff0088cc', endColorstr='#ff0077b3', GradientType=0)}.dropMenu-menu>.disabled>a,.dropMenu-menu>.disabled>a:hover,.dropMenu-menu>.disabled>a:focus{color:#999}.dropMenu-menu>.disabled>a:hover,.dropMenu-menu>.disabled>a:focus{text-decoration:none;background-color:transparent;background-image:none;filter:progid:DXImageTransform.Microsoft.gradient(enabled = false);cursor:default}.open{*z-index:3000}.open>.dropMenu-menu{display:block}.pull-right>.dropMenu-menu{right:0;left:auto}#skipToMenu .dropup .caret,#skipToMenu .navbar-fixed-bottom .dropMenu .caret{border-top:0;border-bottom:4px solid #000;content:''}#skipToMenu .dropup .dropMenu-menu,#skipToMenu .navbar-fixed-bottom .dropMenu .dropMenu-menu{top:auto;bottom:100%;margin-bottom:1px}.dropMenu-submenu{position:relative}.dropMenu-submenu>.dropMenu-menu{top:0;left:100%;margin-top:-6px;margin-left:-1px;-webkit-border-radius:0 6px 6px 6px;-moz-border-radius:0 6px 6px 6px;border-radius:0 6px 6px 6px}.dropMenu-submenu:hover>.dropMenu-menu{display:block}.dropup .dropMenu-submenu>.dropMenu-menu{top:auto;bottom:0;margin-top:0;margin-bottom:-2px;-webkit-border-radius:5px 5px 5px 0;-moz-border-radius:5px 5px 5px 0;border-radius:5px 5px 5px 0}.dropMenu-submenu>a:after{display:block;content:' ';float:right;width:0;height:0;border-color:transparent;border-style:solid;border-width:5px 0 5px 5px;border-left-color:#ccc;margin-top:5px;margin-right:-10px}.dropMenu-submenu:hover>a:after{border-left-color:#fff}.dropMenu-submenu.pull-left{float:none}.dropMenu-submenu.pull-left>.dropMenu-menu{left:-100%;margin-left:10px;-webkit-border-radius:6px 0 6px 6px;-moz-border-radius:6px 0 6px 6px;border-radius:6px 0 6px 6px}.dropMenu .dropMenu-menu .nav-header{padding-left:20px;padding-right:20px}");

			this.dropdownHTML = '<a accesskey="'+ this.config.accessKey +'" tabindex="0" data-wrap="'+ this.config.wrap +'"class="dropMenu-toggle skipTo '+ this.config.visibility + ' '+ this.config.customClass +'" id="drop4" role="button" aria-haspopup="true" ';
			this.dropdownHTML += 'aria-expanded="false" data-toggle="dropMenu" data-target="menu1"';
			if (this.config.hashOnMenu === 'true') {
				this.dropdownHTML += ' href="#"';
			}
			this.dropdownHTML += '>' + this.config.buttonLabel + '<span class="caret"></span></a>';
			this.dropdownHTML += '<ul id="menu1" class="dropMenu-menu" role="menu" aria-label="' + this.config.menuLabel + '" style="top:3%; text-align:left">';

			this.getLandMarks(this.config.main);
			this.getLandMarks(this.config.landmarks);
			this.getSections(this.config.sections);

			this.getIdElements();

			this.getHeadings();

			htmlStr = this.getdropdownHTML();
			this.dropdownHTML += htmlStr + '</ul>';

			if ( htmlStr.length >0 ) {
				div.className = "dropMenu";
				attachElement.insertBefore(div, attachElement.firstChild);
				div.innerHTML = this.dropdownHTML;
				this.addListeners();
			}
			window.skipToDropDownInit(this.config);
		},

		normalizeName: function (name) {
			if (typeof name === 'string') return name.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
			return "";
		},

		getTextContent: function (elem) {
			
			function getText(e, strings) {
				// If text node get the text and return
				if( e.nodeType === 3 ) { /*IE8 - Node.TEXT_NODE*/
					strings.push(e.data);
				} else {
					// if an element for through all the children elements looking for text
					if( e.nodeType === 1 ) { /*IE8 - Node.ELEMENT_NODE*/
					// check to see if IMG or AREA element and to use ALT content if defined
						var tagName = e.tagName.toLowerCase();
						if((tagName === 'img') || (tagName === 'area')) {
							if (e.alt) {
								strings.push(e.alt);
							}
						} else {
							var c = e.firstChild;
							while (c) {
								getText(c, strings);
								c = c.nextSibling;
							} // end loop
						}
					}
				}
			} // end function getStrings

			// Create return object
			var str = "Test",
			strings = [];
			getText(elem, strings);
			if (strings.length) str = strings.join(" ");
			if (str.length > 30) str = str.substring(0,27) + "...";
			return str;
		},

		getAccessibleName: function (elem) {
			var labelledbyIds = elem.getAttribute('aria-labelledby'),
			label = elem.getAttribute('aria-label'),
			title = elem.getAttribute('title'),
			name = "";
			
			if (labelledbyIds && labelledbyIds.length) {
				var str,
				strings = [],
				ids = labelledbyIds.split(' ');
				if (!ids.length) ids = [labelledbyIds];
				for (var i = 0, l = ids.length; i < l; i += 1) {
					var e = document.getElementById(ids[i]);
					if (e) str = this.getTextContent(e);
					if (str.length) strings.push(str);
				}
				name = strings.join(" ");
			}
			else {
				if (label && label.length) {
					name = label;
				}
				else {
					if (title && title.length) {
						name = title;
					}
				}
			}
			return name;
		},

		getHeadings: function () {
			var targets = this.config.headings;
			if (typeof targets !== 'string' || targets.length === 0) return;
			var headings = document.querySelectorAll(targets),
				i,
				j,
				heading,
				role,
				id,
				name;
			for (i = 0, j = headings.length; i < j; i = i + 1) {
				heading = headings[i];
				role = heading.getAttribute('role');
				if ((typeof role === 'string') && (role === 'presentation')) continue;
				if (this.isVisible(heading)) {
					id = heading.getAttribute('id') || heading.innerHTML.replace(/\s+/g, '_').toLowerCase().replace(/[&\/\\#,+()$~%.'"!:*?<>{}¹]/g, '') + '_' + i;

					heading.tabIndex = "-1";
					heading.setAttribute('id', id);

					name = this.getTextContent(heading);
					if (this.config.enumerateElements === 'false') {
						name = heading.tagName.toLowerCase() + ": " + name;
					}
					
					//this.headingElementsArr[id] = heading.tagName.toLowerCase() + ": " + this.getTextContent(heading);
					//IE8 fix: Use JSON object to supply names to array values. This allows enumerating over the array without picking up prototype properties.
					this.headingElementsArr[id] = {id: id, name: name};
				}
			}
		},
		
		isVisible: function(element) {
		
			function isVisibleRec (el) {
				if (el.nodeType === 9) return true; /*IE8 does not support Node.DOCUMENT_NODE*/

				//For IE8: Use standard means if available, otherwise use the IE methods
				var display = document.defaultView?document.defaultView.getComputedStyle(el,null).getPropertyValue('display'):el.currentStyle.display;
				var visibility = document.defaultView?document.defaultView.getComputedStyle(el,null).getPropertyValue('visibility'):el.currentStyle.visibility;
				//var computedStyle = window.getComputedStyle(el, null);
				//var display = computedStyle.getPropertyValue('display');
				//var visibility = computedStyle.getPropertyValue('visibility');
				var hidden = el.getAttribute('hidden');
				var ariaHidden = el.getAttribute('aria-hidden');
				var clientRect = el.getBoundingClientRect();

				if ((display === 'none') ||
						(visibility === 'hidden') ||
						(hidden !== null) ||
						(ariaHidden === 'true') ||
						(clientRect.height < 4) ||
						(clientRect.width < 4)) {
					return false;
				}
				
				return isVisibleRec(el.parentNode);
			}
			
			return isVisibleRec(element);
		},

		getSections: function (targets) {
			if (typeof targets !== 'string' || targets.length === 0) return;
			var sections = document.querySelectorAll(targets),
				k,
				l,
				section,
				id1,
				role,
				val,
				name;

			for (k = 0, l = sections.length; k < l; k = k + 1) {
				section = sections[k];
				role = section.getAttribute(role);
				if ((typeof role === 'string') && (role === 'presentation')) continue;
				if (this.isVisible(section)) {
					id1 = section.getAttribute('id') || 'ui-skip-' + Math.floor((Math.random() * 100) + 1);
					section.tabIndex = "-1";
					section.setAttribute('id', id1);
					role = section.tagName.toLowerCase();

					val = (this.config.enumerateElements === 'false') ? this.normalizeName(role) + ": " : '';
					name = this.getAccessibleName(section);

					if (name && name.length) {
						val += name;
					}
					else {
						if (role === 'main') {
							val += this.config.contentLabel;
						}
					}
					this.landmarkElementsArr[id1] = val;
				}
			}
		},


		getLandMarks: function (targets) {
			if (typeof targets !== 'string' || targets.length === 0) return;
			var landmarks = document.querySelectorAll(targets),
				k,
				l,
				landmark,
				id1,
				role,
				name,
				val;

			for (k = 0, l = landmarks.length; k < l; k = k + 1) {
				landmark = landmarks[k];
				role = landmark.getAttribute('role');
				if ((typeof role === 'string') && (role === 'presentation')) continue;
				if (this.isVisible(landmark)) {
					id1 = landmark.getAttribute('id') || 'ui-skip-' + Math.floor((Math.random() * 100) + 1);
					landmark.tabIndex = "-1";
					landmark.setAttribute('id', id1);
					if (!role) role = landmark.tagName.toLowerCase();
					name = this.getAccessibleName(landmark);

					if (role === 'banner') {
						role = 'header';
					} // banner landmark is the same as header element in HTML5

					if (role === 'contentinfo') {
						role = 'footer';
					} //contentinfo landmark is the same as footer element in HTML5

					if (role === 'navigation') {
						role = 'nav';
					} // navigation landmark is the same as nav element in HTML5

					val = (this.config.enumerateElements === 'false') ? this.normalizeName(role) + ": " : '';

					if (name && name.length) {
						val += name;
					}
					else {
						if (role === 'main') {
							val += this.config.contentLabel;
						}
					}
					this.landmarkElementsArr[id1] = val;
				}
			}
		},

		getIdElements: function () {
			var i, els, el, id, val;

			if (typeof this.config.ids === 'object') {
				els = this.config.ids;
			} else if (typeof this.config.ids === 'string') {
				els = this.config.ids.split(',');
				els = els.map(function (el) {
					return {id: el.trim()};
				});
			} else {
				els = [];
			}

			for (i = 0; i < els.length; i = i + 1) {
				id = els[i].id.replace('#', '');
				el = document.getElementById(id);
				if (el === null) continue;

				val = els[i].description || el.innerHTML.replace(/<\/?[^>]+>/gi, '').replace(/\s+/g, ' ').replace(/^\s+|\s+$/g, "");/*for IE8*/
				if (val.length > 30) {
					val = val.replace(val, val.substr(0, 30) + '...');
				}

				if (this.config.enumerateElements === 'false') {
					val = "id: " + val;
				}
				this.idElementsArr[id] = val;
			}
		},

		getdropdownHTML: function(){
			var key,
				val,
				htmlStr = '',
				landmarkSep = true,
				headingSep = true,
				headingClass = '',
				elementCnt = 1;
			
			//IE8 fix: for...in loop enumerates over all properties in an object including its prototype. This was returning some undesirable items such as indexof
			//Make sure that the key is not from the prototype.
			for (key in this.landmarkElementsArr) {
				if (this.landmarkElementsArr.hasOwnProperty(key)){
					if (landmarkSep) {
						htmlStr += '<li role="separator" style="list-style:none outside none">' + this.config.landmarksLabel + '</li>';
						landmarkSep = false;
					}
					val = this.landmarkElementsArr[key];
					htmlStr += '<li role="presentation" style="list-style:none outside none"><a tabindex="-1" role="menuitem" href="#';
					htmlStr += key + '">';
					if (this.config.enumerateElements !== 'false') {
						htmlStr += elementCnt + ": ";
						elementCnt = elementCnt + 1;
					}
					htmlStr += val + '</a></li>';
				}
			}

			//IE8 fix: for...in loop enumerates over all properties in an object including its prototype. This was returning some undesirable items such as indexof
			//Make sure that the key is not from the prototype.
			for (key in this.idElementsArr) {
				if (this.idElementsArr.hasOwnProperty(key)){
					if (landmarkSep) {
						htmlStr += '<li role="separator" style="list-style:none outside none">' + this.config.landmarksLabel + '</li>';
						landmarkSep = false;
					}
					val = this.idElementsArr[key];
					htmlStr += '<li role="presentation" style="list-style:none outside none"><a tabindex="-1" role="menuitem" href="#';
					htmlStr += key + '">';
					if (this.config.enumerateElements !== 'false') {
						htmlStr += elementCnt + ": ";
						elementCnt = elementCnt + 1;
					}
					htmlStr += val + '</a></li>';
				}
			}
			//for...in loop enumerates over all properties in an object including its prototype. This was returning some undesirable items such as indexof
			//James' workaround to get for JSON name/value pair appears to address the issue.
			for (key in this.headingElementsArr) {
				if (this.headingElementsArr[key].name){
					if (headingSep) {
						htmlStr += '<li role="separator" style="list-style:none outside none">' + this.config.headingsLabel + '</li>';
						headingSep = false;
					}
					val = this.headingElementsArr[key].name;
				
					headingClass = val.substring(0,2);
				
					htmlStr += '<li role="presentation" style="list-style:none outside none"><a class="po-' + headingClass + '" tabindex="-1" role="menuitem" href="#';
					htmlStr += key + '">';
					if (this.config.enumerateElements !== 'false') {
						htmlStr += elementCnt + ": ";
						elementCnt = elementCnt + 1;
					}
					htmlStr += val + '</a></li>';
				}
			}

			return htmlStr;
		},

		addStyles: function (cssString) {
			var ss1 = document.createElement('style'),
				hh1 = document.getElementsByTagName('head')[0],
				tt1;

			ss1.setAttribute("type", "text/css");
			hh1.appendChild(ss1);

			if (ss1.styleSheet) {
				// IE
				ss1.styleSheet.cssText = cssString;
			} else {
				tt1 = document.createTextNode(cssString);
				ss1.appendChild(tt1);
			}
		},

		addListeners: function () {
			if (this.config.focusOnClick === 'false') {
				window.addEventListener("hashchange", function () {
					var element = document.getElementById(location.hash.substring(1));
					if (element) {
						if (!/^(?:a|select|input|button|textarea)$/i.test(element.tagName)) {
							element.tabIndex = -1;
						}
						element.focus();
						element.scrollIntoView(true); //IE8 - Make sure to scroll to top
					}
				}, false);
			}
		}
	};

	// SkipTo.prototype.init(appConfig);

	// Make this public so it can be called again in the future;
	window.skipToMenuInit = function(customConfig) {
		// var config = {
		// 	settings: {
		// 		skipTo: customConfig
		// 	}
		// };
		SkipTo.prototype.init(customConfig || window.Drupal || window.Wordpress || window.SkipToConfig || {});
	};

}(window.Drupal || window.Wordpress || window.SkipToConfig || {}));
/*@end @*/
