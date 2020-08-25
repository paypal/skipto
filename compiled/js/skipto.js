/*! skipto - v4.0.0 - 2020-08-24
* https://github.com/paypal/skipto
* Copyright (c) 2020 PayPal Accessibility Team and University of Illinois; Licensed BSD */
 /*@cc_on @*/
/*@if (@_jscript_version >= 5.8) @*/
/*jslint devel: true */
/* ========================================================================
* Copyright (c) <2020> PayPal

* All rights reserved.

* Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.

* Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.

* Neither the name of PayPal or any of its subsidiaries or affiliates nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission.

* THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
* ======================================================================== */

(function () {
	'use strict';

	var SkipTo = {

		headingElementsArr: [],
		landmarkElementsArr: [],
		domNode: null,
		buttonNode: null,
		menuNode: null,
	  menuitemNodes: [],
	  firstMenuitem: false,
	  lastMenuitem: false,
	  firstChars: [],
	  skipToIdIndex: 1,

		// Default configuration values
		config: {
			// Customization of button and menu
			accessKey: 'S',
			attachElement: null,
			displayOption: 'static', // options: static (default), fixed, popup
			// container element
			containerElement: 'div',
			containerClass: 'skipTo',
			containerRole: 'navigation',
			containerTitle: 'Skip To Keyboard Navigation',
			// labels and messages
			buttonLabel:    'Skip To ...',
			menuLabel:      'Landmarks and Headings',
			landmarkGroupLabel: 'Landmarks',
			headingGroupLabel:  'Main Headings',
			mainLabel: 'main',
			searchLabel: 'search',
			navLabel: 'menu',
			asideLabel: 'aside',
			footerLabel: 'footer',
			headerLabel: 'header',
			formLabel: 'form',
			msgNoLandmarksFound: 'No landmarks to skip to',
			msgNoHeadingsFound: 'No main headings to skip to',
			// Selectors for landmark and headings sections
			landmarks: 'main, [role="main"], [role="search"], nav, [role="navigation"], aside, [role="complementary"]',
			headings:  'main h1, [role="main"] h1, main h2, [role="main"] h2, main h3, [role="main"] h3',
			// Custom CSS position and colors
			buttonTop: '',
			buttonLeft: '',
			color: '',
			backgroundColor: '',
			focusColor: '',
			focusBackgroundColor: ''
		},

		defaultCSS: '.skipTo{position:relative}.skipTo.popup{position:absolute;top:-30em;left:-3000em}.skipTo.fixed,.skipTo.popup.focus{position:absolute;top:.5em;left:.5em}.skipTo button{margin:0;padding:4px;position:relative;border-radius:5px;background-color:#eee;border-width:0;border-style:none;color:#000;z-index:1000}.skipTo [role="menu"]{position:absolute;min-width:17em;display:none;margin:0;padding:0;border-width:2px;border-style:solid;border-color:#000;border-radius:5px;z-index:1000}.skipTo [role="separator"]:first-child{border-radius:5px 5px 0 0}.skipTo [role="menuitem"]{margin:0;padding:4px;display:block;width:auto;background-color:#eee;border-width:0px;border-style:solid;color:#000;z-index:1000}.skipTo [role="menuitem"]:first-letter{text-decoration:underline;text-transform:uppercase}.skipTo [role="separator"]{margin:0;padding:4px;display:block;width:auto;font-weight:bold;text-align:center;border-bottom-width:1px;border-bottom-style:solid;border-bottom-color:#000;background-color:#eee;color:#000;z-index:1000}.skipTo [role="separator"]:first-child{border-radius:5px 5px 0 0}.skipTo [role="menuitem"].last{border-radius:0 0 5px 5px}.skipTo [role="menuitem"].skipto-h2{padding-left:1em}.skipTo [role="menuitem"].skipto-h3{padding-left:2em}.skipTo [role="menuitem"].skipto-h4{padding-left:3em}.skipTo [role="menuitem"].skipto-h5{padding-left:4em}.skipTo [role="menuitem"].skipto-h6{padding-left:5em}.skipTo.focus{display:block}.skipTo button:focus,.skipTo button:hover{padding:2px;border-width:2px;border-style:solid;border-color:#000}.skipTo [role="menuitem"]:focus{padding:2px;border-width:2px;border-style:solid;border-color:#000;background-color:#000;color:#fff;margin:0}.skipTo [role="menuitem"].skipto-h2,.skipTo [role="menuitem"].skipto-h2:focus{padding-left:1em}.skipTo [role="menuitem"].skipto-h3,.skipTo [role="menuitem"].skipto-h3:focus{padding-left:2em}.skipTo [role="menuitem"].skipto-h4,.skipTo [role="menuitem"].skipto-h4:focus{padding-left:3em}.skipTo [role="menuitem"].skipto-h5,.skipTo [role="menuitem"].skipto-h5:focus{padding-left:4em}.skipTo [role="menuitem"].skipto-h6,.skipTo [role="menuitem"].skipto-h6:focus{padding-left:5em}',

		hasProperty: function (index, prop) {
			var index1 = this.defaultCSS.indexOf('}', index);
			return this.defaultCSS.substring(index, index1).indexOf(prop) >= 0;
		},

		updateStyle: function (sel, prop, value) {

			prop = prop + ':';
			if (prop.indexOf('-') < 0) {
				prop = ';' + prop;
			}

			var index =  this.defaultCSS.indexOf(sel);
			while (index >= 0) {
				if(this.hasProperty(index, prop)) {
					index = this.defaultCSS.indexOf(prop, index);
					if ( index >= 0) {
						index = this.defaultCSS.indexOf(':', index);
						if (index >= 0) {
							index += 1;
							var index1 = this.defaultCSS.indexOf(';', index);
							var index2 = this.defaultCSS.indexOf('}', index);
							if (index1 >= 0 || index2 >= 0) {
								if (index1 >= 0 && index2 >= 0) {
									index1 = Math.min(index1, index2);
								}
								else {
									if (index2 >= 0) {
										index1 = index2;
									}
								}
								this.defaultCSS = this.defaultCSS.substring(0, index) + value + this.defaultCSS.substring(index1);
								return;
							}
						}
					}
				}
				index =  this.defaultCSS.indexOf(sel, index+1);
			}
		},

		updateCSSWithCustomColors: function() {
			function isColor (color) {
				return typeof color === 'string' && color.length;
			}

			function isDimension (dimension) {
				return typeof dimension === 'string' && dimension.length;
			}

			if (isDimension(this.config.buttonTop)) {
				this.updateStyle('.skipTo.fixed', 'top', this.config.buttonTop);
			}

			if (isDimension(this.config.buttonLeft)) {
				this.updateStyle('.skipTo.fixed', 'left', this.config.buttonLeft);
			}

			if (isColor(this.config.backgroundColor)) {
				this.updateStyle('.skipTo button', 'background-color', this.config.backgroundColor);
				this.updateStyle('.skipTo [role="menuitem"]', 'color', this.config.backgroundColor);
				this.updateStyle('.skipTo [role="separator"]', 'color', this.config.backgroundColor);
			}

			if (isColor(this.config.color)) {
				this.updateStyle('.skipTo button', 'color', this.config.color);
				this.updateStyle('.skipTo [role="menuitem"]', 'background-color', this.config.color);
				this.updateStyle('.skipTo [role="separator"]', 'background-color', this.config.color);
			}

			if (isColor(this.config.focusBackgroundColor)) {
  			this.updateStyle('.skipTo button:focus', 'border-color', this.config.focusBackgroundColor);
				this.updateStyle('.skipTo [role="menuitem"]:focus', 'color', this.config.focusBackgroundColor);
			}

			if (isColor(this.config.focusColor)) {
				this.updateStyle('.skipTo [role="menu"]', 'border-color', this.config.focusColor);
				this.updateStyle('.skipTo [role="menuitem"]:focus', 'border-color', this.config.focusColor);
				this.updateStyle('.skipTo [role="menuitem"]:focus', 'background-color', this.config.focusColor);
				this.updateStyle('.skipTo [role="separator"]', 'border-bottom-color', this.config.focusColor);
			}
		},

		isNotEmptyString: function (str) {
			return (typeof str === 'string') && str.length;
		},

		hasSufficientContrast: function (color1, color2) {

			function luminance(r, g, b) {
		    var a = [r, g, b].map(function (v) {
    	    v /= 255;
      	  return v <= 0.03928 ? v / 12.92 : Math.pow( (v + 0.055) / 1.055, 2.4 );
    		});
    		return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
			}

			function splitRGB(rgb) {
				var a = rgb.split("(")[1].split(")")[0].split(",");
				var b = {};
				b.r = parseInt(a[0]);
				b.b = parseInt(a[1]);
				b.g = parseInt(a[2]);
				return b;
			}

			var c1 = splitRGB(color1);
			var c2 = splitRGB(color2);

			var l1 = luminance(c1.r, c1.g, c1.b);
			var l2 = luminance(c2.r, c2.g, c2.b);

			var ccr = l1 < l2 ? ((l2 + 0.05) / (l1 + 0.05)) : ((l1 + 0.05) / (l2 + 0.05));

			return ccr > 4.5; // From WCAG Standard
		},

		init: function (config) {

			var attachElement = document.body;

			if (config) {
				this.setUpConfig(config);
			}

		  if (typeof this.config.attachElement === 'string') {
		  	var node = document.querySelector(this.config.attachElement);
		  	if (node && node.nodeType === Node.ELEMENT_NODE) {
		  		attachElement = node;
		  	}
		  }

			if (!this.config.color.length &&
				  !this.config.backgroundColor.length) {
				var attachElementStyle = window.getComputedStyle(attachElement);
				var color = attachElementStyle.getPropertyValue('color');
				var backgroundColor = attachElementStyle.getPropertyValue('background-color');

				if (this.hasSufficientContrast(color, backgroundColor)) {
					this.config.color = color;
					this.config.backgroundColor = backgroundColor;
					this.config.focusColor = backgroundColor;
					this.config.focusBackgroundColor = color;
				}
			}

			this.updateCSSWithCustomColors();
			this.addStyles(this.defaultCSS);

		  this.domNode = document.createElement(this.config.containerElement);
		  if (this.isNotEmptyString(this.config.containerClass)) {
			  this.domNode.classList.add(this.config.containerClass);
			}
			else {
			  this.domNode.classList.add('skipTo');
			}
		  if (this.isNotEmptyString(this.config.containerRole)) {
			  this.domNode.setAttribute('role', this.config.containerRole);
		  }
		  if (this.isNotEmptyString(this.config.containerTitle)) {
		  	this.domNode.setAttribute('title', this.config.containerTitle);
			}

		  var displayOption = this.config.displayOption;

		  if (typeof displayOption === 'string') {
		  	displayOption = displayOption.trim().toLowerCase();
		  	if (displayOption.length) {
				  switch (this.config.displayOption) {
				  	case 'fixed':
						  this.domNode.classList.add('fixed');
				  		break;

				  	case 'popup':
						  this.domNode.classList.add('popup');
				  		break;

				  	default:
				  		break;

				 	}
		  	}
		  }

		  // Place skip to at the beginning of the document

		  if (attachElement.firstElementChild) {
		  	attachElement.insertBefore(this.domNode, attachElement.firstElementChild);
		  }
		  else {
		  	attachElement.appendChild(this.domNode);
		  }

		  this.buttonNode    = document.createElement('button');
		  this.buttonNode.textContent = this.config.buttonLabel;
		  this.buttonNode.setAttribute('aria-haspopup', 'true');
		  this.buttonNode.setAttribute('aria-expanded', 'false');
		  this.buttonNode.setAttribute('accesskey', this.config.accessKey);
		  this.domNode.appendChild(this.buttonNode);

		  this.menuNode  = document.createElement('div');
		  this.menuNode.setAttribute('role', 'menu');
		  this.domNode.appendChild(this.menuNode);

		  this.buttonNode.addEventListener('keydown', this.handleButtonKeydown.bind(this));
		  this.buttonNode.addEventListener('click', this.handleButtonClick.bind(this));

		  this.domNode.addEventListener('focusin', this.handleFocusin.bind(this));
		  this.domNode.addEventListener('focusout', this.handleFocusout.bind(this));

		  window.addEventListener('mousedown', this.handleBackgroundMousedown.bind(this), true);
		},

		setUpConfig: function (appConfig) {
			var localConfig = this.config,
				name,
				appConfigSettings = typeof appConfig.settings !== 'undefined' ? appConfig.settings.skipTo : {};

			for (name in appConfigSettings) {
				//overwrite values of our local config, based on the external config
				if (localConfig.hasOwnProperty(name) &&
					   typeof appConfigSettings[name] === 'string' &&
					   appConfigSettings[name].length > 0) {
					localConfig[name] = appConfigSettings[name];
				}
			}
		},

		addStyles: function (cssString) {
			var styleNode = document.createElement('style'),
				headNode = document.getElementsByTagName('head')[0],
				css = document.createTextNode(cssString);

			styleNode.setAttribute("type", "text/css");
			styleNode.appendChild(css);
			headNode.appendChild(styleNode);
		},

		getFirstChar: function (text) {
			var c = '';
			if (typeof text === 'string' && text.length > 0) {
				c = text[0].toLowerCase();
			}
			return c;
		},

	addMenuitemGroup: function(title, menuitems, msgNoItemsFound) {
			var menuNode =  this.menuNode;
			if (title) {
		    var labelNode = document.createElement('div');
		    labelNode.setAttribute('role', 'separator');
		    labelNode.textContent = title;
		    menuNode.appendChild(labelNode);

		    var groupNode = document.createElement('div');
		    groupNode.setAttribute('role', 'group');
		    groupNode.setAttribute('aria-label', title);
		    menuNode.appendChild(groupNode);
		    menuNode = groupNode;
			}

			var len  = menuitems.length;

			if (menuitems.length === 0) {
				var item = {};
				item.name = msgNoItemsFound;
				item.tagName = '';
				item.role = '';
				item.class = 'noitems';
				item.id = '';
				menuitems.push(item);
				len = menuitems.length;
			}


			for (var i = 0; i < len; i += 1) {
				var mi = menuitems[i];

		    var menuitemNode = document.createElement('div');
				menuitemNode.appendChild(document.createTextNode(mi.name));
		    menuitemNode.setAttribute('role', 'menuitem');
		    menuitemNode.classList.add(mi.class);
		    if (mi.tagName.length) {
			    menuitemNode.classList.add('skipto-' + mi.tagName);
		    }
		    menuitemNode.setAttribute('data-id', mi.dataId);
		    menuitemNode.tabIndex = -1;

		    menuNode.appendChild(menuitemNode);
		    this.menuitemNodes.push(menuitemNode);

		    this.firstChars.push(this.getFirstChar(mi.name));

		    menuitemNode.addEventListener('keydown', this.handleMenuitemKeydown.bind(this));
		    menuitemNode.addEventListener('click', this.handleMenuitemClick.bind(this));
		    menuitemNode.addEventListener('mouseover', this.handleMenuitemMouseover.bind(this));

		    if(!this.firstMenuitem) {
		      this.firstMenuitem = menuitemNode;
		    }
		    this.lastMenuitem = menuitemNode;
		  }
		},
	 	updateMenuitems: function () {
			// remove current menu items from menu
			while (this.menuNode.lastElementChild) {
    		this.menuNode.removeChild(this.menuNode.lastElementChild);
  		}

			this.menuitemNodes = [];
			this.firstChars = [];
		  this.firstMenuitem = false;
		  this.lastMenuitem = false;
		  this.skipToIdIndex = 1;

			this.getLandmarks();
			this.addMenuitemGroup(this.config.landmarkGroupLabel, this.landmarkElementsArr, this.config.msgNoLandmarksFound);

			this.getHeadings();
			this.addMenuitemGroup(this.config.headingGroupLabel, this.headingElementsArr, this.config.msgNoHeadingsFound);
			this.lastMenuitem.classList.add('last');
		},

		setFocusToMenuitem: function (newMenuitem) {
			if (newMenuitem) {
				newMenuitem.focus();
			}
		},

		setFocusToFirstMenuitem: function () {
		  this.setFocusToMenuitem(this.firstMenuitem);
		},

		setFocusToLastMenuitem: function () {
		  this.setFocusToMenuitem(this.lastMenuitem);
		},

		setFocusToPreviousMenuitem: function (currentMenuitem) {
		  var newMenuitem, index;

		  if (currentMenuitem === this.firstMenuitem) {
		    newMenuitem = this.lastMenuitem;
		  }
		  else {
		    index = this.menuitemNodes.indexOf(currentMenuitem);
		    newMenuitem = this.menuitemNodes[ index - 1 ];
		  }

		  this.setFocusToMenuitem(newMenuitem);

		  return newMenuitem;
		},

		setFocusToNextMenuitem: function (currentMenuitem) {
		  var newMenuitem, index;

		  if (currentMenuitem === this.lastMenuitem) {
		    newMenuitem = this.firstMenuitem;
		  }
		  else {
		    index = this.menuitemNodes.indexOf(currentMenuitem);
		    newMenuitem = this.menuitemNodes[ index + 1 ];
		  }
		  this.setFocusToMenuitem(newMenuitem);

		  return newMenuitem;
		},

		setFocusByFirstCharacter: function (currentMenuitem, char) {
		  var start, index;

		  if (char.length > 1) {
		    return;
		  }

		  char = char.toLowerCase();

		  // Get start index for search based on position of currentItem
		  start = this.menuitemNodes.indexOf(currentMenuitem) + 1;
		  if (start >=  this.menuitemNodes.length) {
		    start = 0;
		  }

		  // Check remaining slots in the menu
		  index = this.firstChars.indexOf(char, start);

		  // If not found in remaining slots, check from beginning
		  if (index === -1) {
		    index = this.firstChars.indexOf(char, 0);
		  }

		  // If match was found...
		  if (index > -1) {
		    this.setFocusToMenuitem(this.menuitemNodes[index]);
		  }
		},

		// Utilities

		getIndexFirstChars: function (startIndex, char) {
		  for (var i = startIndex; i < this.firstChars.length; i += 1) {
		    if (char === this.firstChars[i]) {
		      return i;
		    }
		  }
		  return -1;
		},

		// Popup menu methods

		openPopup: function () {
			this.updateMenuitems();
		  this.menuNode.style.display = 'block';
		  this.buttonNode.setAttribute('aria-expanded', 'true');
		},

		closePopup: function () {
		  if (this.isOpen()) {
		    this.buttonNode.setAttribute('aria-expanded', 'false');
		    this.menuNode.style.display = 'none';
		  }
		},

		isOpen: function () {
		  return this.buttonNode.getAttribute('aria-expanded') === 'true';
		},

		// Menu event handlers

		handleFocusin: function () {
		  this.domNode.classList.add('focus');
		},

		handleFocusout: function () {
		  this.domNode.classList.remove('focus');
		},

		handleButtonKeydown: function (event) {
		  var key = event.key,
		    flag = false;

		  switch (key) {
		    case ' ':
		    case 'Enter':
		    case 'ArrowDown':
		    case 'Down':
		      this.openPopup();
		      this.setFocusToFirstMenuitem();
		      flag = true;
		     break;

		    case 'Esc':
		    case 'Escape':
		        this.closePopup();
		        this.buttonNode.focus();
		        flag = true;
		      break;

		    case 'Up':
		    case 'ArrowUp':
		      this.openPopup();
		      this.setFocusToLastMenuitem();
		      flag = true;
		      break;

		    default:
		      break;
		  }

		  if (flag) {
		    event.stopPropagation();
		    event.preventDefault();
		  }
		},

		handleButtonClick: function (event) {
		  if (this.isOpen()) {
		    this.closePopup();
		    this.buttonNode.focus();
		  }
		  else {
		    this.openPopup();
		    this.setFocusToFirstMenuitem();
		  }

		  event.stopPropagation();
		  event.preventDefault();
		},

		skipToElement: function (elem) {
    	var node = document.querySelector(elem.getAttribute('data-id'));
     	if (node) {
     		node.tabIndex = -1;
     		node.focus();
     	}
		},

		handleMenuitemKeydown: function (event) {
		  var tgt = event.currentTarget,
		    key = event.key,
		    flag = false;

		  function isPrintableCharacter (str) {
		    return str.length === 1 && str.match(/\S/);
		  }

		  if (event.ctrlKey || event.altKey  || event.metaKey) {
		    return;
		  }

		  if (event.shiftKey) {
		    if (isPrintableCharacter(key)) {
		      this.setFocusByFirstCharacter(tgt, key);
		      flag = true;
		    }

		    if (event.key === 'Tab') {
		      this.buttonNode.focus();
		      this.closePopup();
		      flag = true;
		    }
		  }
		  else {

		    switch (key) {
		      case 'Enter':
		      case ' ':
		       this.closePopup();
		       this.skipToElement(tgt);
		       flag = true;
		       break;

		      case 'Esc':
		      case 'Escape':
		        this.closePopup();
		        this.buttonNode.focus();
		        flag = true;
		        break;

		      case 'Up':
		      case 'ArrowUp':
		        this.setFocusToPreviousMenuitem(tgt);
		        flag = true;
		        break;

		      case 'ArrowDown':
		      case 'Down':
		        this.setFocusToNextMenuitem(tgt);
		        flag = true;
		        break;

		      case 'Home':
		      case 'PageUp':
		        this.setFocusToFirstMenuitem();
		        flag = true;
		        break;

		      case 'End':
		      case 'PageDown':
		        this.setFocusToLastMenuitem();
		        flag = true;
		        break;

		      case 'Tab':
		        this.closePopup();
		        break;

		      default:
		        if (isPrintableCharacter(key)) {
		          this.setFocusByFirstCharacter(tgt, key);
		          flag = true;
		        }
		        break;
		    }

		  }

		  if (flag) {
		    event.stopPropagation();
		    event.preventDefault();
		  }
		},

		handleMenuitemClick: function (event) {
			var tgt = event.currentTarget;
     	this.closePopup();
     	this.skipToElement(tgt);

		  event.stopPropagation();
		  event.preventDefault();
		},
		handleMenuitemMouseover: function (event) {
	  	var tgt = event.currentTarget;
		  tgt.focus();
		},

		handleBackgroundMousedown: function (event) {
		  if (!this.domNode.contains(event.target)) {
		    if (this.isOpen()) {
		      this.closePopup();
		      this.buttonNode.focus();
		    }
		  }
		},

		// methods to extract lanndmarks, headings and ids

		normalizeName: function (name) {
			if (typeof name === 'string') return name.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
			return "";
		},

		getTextContent: function (elem) {

			function getText(e, strings) {
				// If text node get the text and return
				if( e.nodeType ===  Node.TEXT_NODE ) {
					strings.push(e.data);
				} else {
					// if an element for through all the children elements looking for text
					if( e.nodeType === Node.ELEMENT_NODE ) {
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

		isVisible: function(element) {

			function isVisibleRec (el) {
				if (el.nodeType === 9) return true; /*IE8 does not support Node.DOCUMENT_NODE*/

				var computedStyle = window.getComputedStyle(el);

				var display = computedStyle.getPropertyValue('display');
				var visibility = computedStyle.getPropertyValue('visibility');
				var hidden = el.getAttribute('hidden');

				if ((display === 'none') ||
						(visibility === 'hidden') ||
						(hidden !== null)) {
					return false;
				}

				return isVisibleRec(el.parentNode);
			}

			return isVisibleRec(element);
		},

		getHeadings: function () {
			this.headingElementsArr = [];
			var targets = this.config.headings;
			if (typeof targets !== 'string' || targets.length === 0) return;
			var headings = document.querySelectorAll(targets);

			for (var i = 0, j = 0, len = headings.length; i < len; i += 1) {
				var heading = headings[i];
				var role = heading.getAttribute('role');
				if ((typeof role === 'string') && (role === 'presentation')) continue;
				if (this.isVisible(heading)) {

					heading.setAttribute('data-skip-to-id', this.skipToIdIndex);

					var headingItem = {};
					headingItem.dataId = '[data-skip-to-id="' + this.skipToIdIndex + '"]';
					headingItem.class = 'heading';
					headingItem.name = this.getTextContent(heading);
					headingItem.tagName = heading.tagName.toLowerCase();
					headingItem.role = 'heading';

					this.headingElementsArr.push(headingItem);

					j += 1;
					this.skipToIdIndex +=1;
				}
			}
		},

		getLocalizedLandmarkName: function (tagName, name) {
			var n;

			switch (tagName) {
				case 'aside':
					n = this.config.asideLabel;
					break;

				case 'footer':
					n = this.config.footerLabel;
					break;

				case 'form':
					n = this.config.formLabel;
					break;

				case 'header':
					n = this.config.headerLabel;
					break;

				case 'main':
					n = this.config.mainLabel;
					break;

				case 'nav':
					n = this.config.navLabel;
					break;

				case 'search':
					n = this.config.searchLabel;
					break;

				// When an ID is used as a selector, assume for main content
				default:
					n = this.config.mainLabel;
					break;
			}

			if (this.isNotEmptyString(name)) {
				n += ': ' + name;
			}

			return n;
		},

		getLandmarks: function () {
			this.landmarkElementsArr = [];
			var targets = this.config.landmarks;
			if (typeof targets !== 'string' || targets.length === 0) return;
			var landmarks = document.querySelectorAll(targets);

			var mainElems = [];
			var searchElems = [];
			var navElems = [];
			var asideElems = [];
			var footerElems = [];
			var otherElems = [];

			for (var i = 0, j = 0, len = landmarks.length; i < len; i = i + 1) {
				var landmark = landmarks[i];
				// if skipto is a landmark don't include it in the list
				if (landmark === this.domNode) {
					continue;
				}
				var role = landmark.getAttribute('role');
				var tagName = landmark.tagName.toLowerCase();

				if ((typeof role === 'string') && (role === 'presentation')) continue;

				if (this.isVisible(landmark)) {

					if (!role) role = landmark.tagName.toLowerCase();
					var name = this.getAccessibleName(landmark);
					if (typeof name !== 'string') {
						name = '';
					}

					// normalize tagNames
					switch (role) {
						case 'banner':
							tagName = 'header';
							break;

						case 'complementary':
							tagName = 'aside';
							break;

						case 'contentinfo':
							tagName = 'footer';
							break;

						case 'form':
							tagName = 'form';
							break;

						case 'main':
							tagName = 'main';
							break;

						case 'navigation':
							tagName = 'nav';
							break;

						case 'search':
							tagName = 'search';
							break;

						default:
							break;

					}

					// if using ID for selectQuery give tagName as main
					if (['aside','footer','form','header','main','nav','search'].indexOf(tagName) < 0) {
						tagName = 'main';
					}

					landmark.setAttribute('data-skip-to-id', this.skipToIdIndex);

					var landmarkItem = {};
					landmarkItem.dataId = '[data-skip-to-id="' + this.skipToIdIndex + '"]';
					landmarkItem.class = 'landmark';
					landmarkItem.name = this.getLocalizedLandmarkName(tagName, name);
					landmarkItem.tagName = tagName;
					j += 1;
					this.skipToIdIndex += 1;

					// For sorting landmarks into groups
					switch (tagName) {
						case 'main':
							mainElems.push(landmarkItem);
							break;

						case 'search':
							searchElems.push(landmarkItem);
							break;

						case 'nav':
							navElems.push(landmarkItem);
							break;

						case 'aside':
							asideElems.push(landmarkItem);
							break;

						case 'footer':
							footerElems.push(landmarkItem);
							break;

						default:
							otherElems.push(landmarkItem);
							break;
					}
				}
			}

			this.landmarkElementsArr = [].concat(mainElems, searchElems, navElems, asideElems, footerElems, otherElems);
		}

	};

	// Initialize skipto menu button with onload event
	window.addEventListener('load', function () {
		SkipTo.init(window.SkipToConfig || window.Drupal || window.Wordpress || {});
		SkipTo.updateMenuitems();
		console.log('Skipto loaded');
	});

})();
/*@end @*/
