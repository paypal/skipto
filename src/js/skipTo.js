/* ========================================================================
* Copyright (c) <2013> eBay Software Foundation

* All rights reserved.

* Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.

* Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.

* Neither the name of eBay or any of its subsidiaries or affiliates nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission.

* THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
* ======================================================================== */


(function (appConfig) {
	"use strict";
	var SkipTo = {};

	SkipTo.prototype = {
		headingElementsArr:  [],
		landmarkElementsArr:  [],
		idElementsArr:  [],
		dropdownHTML: null,
		config: {
			buttonLabel:    'Skip To...',
			menuLabel:      'Skip To and Page Outline',
			landmarksLabel: 'Skip To',
			headingsLabel:  'Page Outline',
			main:      'main, [role="main"]',
			landmarks: '[role="navigation"], [role="search"]',
			sections:  'nav',
			headings:  'h1, h2, h3',
			ids:       '#SkipToA1, #SkipToA2',
			accessKey: '0',
			wrap: "false",
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

			var div = document.createElement('div'),
			attachElement = (!this.config.attachElement.nodeType) ? document.querySelector(this.config.attachElement) : this.config.attachElement,
			htmlStr = '';
			div.setAttribute('id', 'skipToMenu');
			div.setAttribute('role', 'complementary');
			div.setAttribute('title', 'Skip To Keyboard Navigation');

			this.addStyles("@@cssContent");

			this.dropdownHTML = '<a accesskey="'+ this.config.accessKey +'" tabindex="0" data-wrap="'+ this.config.wrap +'"class="dropMenu-toggle skipTo '+ this.config.visibility + ' '+ this.config.customClass +'" id="drop4" role="button" aria-haspopup="true" ';
			this.dropdownHTML += 'aria-expanded="false" data-toggle="dropMenu" href="#" data-target="menu1">' + this.config.buttonLabel + '<b class="caret"></b></a>';
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
		},

		normalizeName: function (name) {
			return name.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
		},

		getTextContent: function (elem) {
			
			function getText(e, strings) {
				// If text node get the text and return
				if( e.nodeType === Node.TEXT_NODE ) {
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

		getHeadings: function () {
			var targets = this.config.headings;
			if (typeof targets !== 'string' || targets.length === 0) return;
			var headings = document.querySelectorAll(targets),
				i,
				j,
				heading,
				id;
			for (i = 0, j = headings.length; i < j; i = i + 1) {
				heading = headings[i];
				id = heading.getAttribute('id') || heading.innerHTML.replace(/\s+/g, '_').toLowerCase().replace(/[&\/\\#,+()$~%.'"!:*?<>{}¹]/g, '') + '_' + i;
				heading.tabIndex = "-1";
				heading.setAttribute('id', id);
				this.headingElementsArr[id] = heading.tagName.toLowerCase() + ": " + this.getTextContent(heading);
			}
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
				id1 = section.getAttribute('id') || 'ui-skip-' + Math.floor((Math.random() * 100) + 1);
				section.tabIndex = "-1";
				section.setAttribute('id', id1);
				role = section.tagName.toLowerCase();
				val = this.normalizeName(role);

				name = this.getAccessibleName(section);

				if (name && name.length) {
					val += ": " + name;
				}
				else {
					if (role === 'main') {
						val += ' Content';
					}
				}

				this.landmarkElementsArr[id1] = val;
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
				id1 = landmark.getAttribute('id') || 'ui-skip-' + Math.floor((Math.random() * 100) + 1);
				landmark.tabIndex = "-1";
				landmark.setAttribute('id', id1);
				role = landmark.getAttribute('role');
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

				val = this.normalizeName(role);

				if (name && name.length) {
					val += ": " + name;
				}
				else {
					if (role === 'main') {
						val += ' Content';
					}
				}
				this.landmarkElementsArr[id1] = val;
			}
		},

		getIdElements: function () {
			var els = document.querySelectorAll(this.config.ids),
				i,
				j,
				el,
				id,
				val;

			for (i = 0, j = els.length; i < j; i = i + 1) {
				el = els[i];
				id = el.getAttribute('id');
				val = el.innerHTML.replace(/<\/?[^>]+>/gi, '').replace(/\s+/g, ' ').trim();

				if (val.length > 30)	val = val.replace(val, val.substr(0, 30)	+	'...');
				this.idElementsArr[id] = "id: " + val;
			}
		},

		getdropdownHTML: function(){
			var key,
				val,
				htmlStr = '',
				landmarkSep = true,
				headingSep = true,
				headingClass = '';

			// window.console.log(this.elementsArr);

			for (key in this.landmarkElementsArr) {
				if (landmarkSep) {
					htmlStr += '<li role="presentation" style="list-style:none outside none"><a tabindex="-1" role="separator" href="#" aria-label="' + this.config.landmarksLabel + '">' + this.config.landmarksLabel + '</a></li>';
					landmarkSep = false;
				}
				val = this.landmarkElementsArr[key];
				htmlStr += '<li role="presentation" style="list-style:none outside none"><a tabindex="-1" role="menuitem" href="#';
				htmlStr += key + '">' + val;
				htmlStr += '</a></li>';
			}

			for (key in this.idElementsArr) {
				if (landmarkSep) {
					htmlStr += '<li role="presentation" style="list-style:none outside none"><a tabindex="-1" role="separator" href="#" aria-label="' + this.config.landmarksLabel + '">' + this.config.landmarksLabel + '</a></li>';
					landmarkSep = false;
				}
				val = this.idElementsArr[key];
				htmlStr += '<li role="presentation" style="list-style:none outside none"><a tabindex="-1" role="menuitem" href="#';
				htmlStr += key + '">' + val;
				htmlStr += '</a></li>';
			}

			for (key in this.headingElementsArr) {
				if (headingSep) {
					htmlStr += '<li role="presentation" style="list-style:none outside none"><a tabindex="-1" role="separator" href="#" aria-label="' + this.config.headingsLabel + '">' + this.config.headingsLabel + '</a></li>';
					headingSep = false;
				}
				val = this.headingElementsArr[key];
				
				headingClass = val.substring(0,2);
				
				htmlStr += '<li role="presentation" style="list-style:none outside none"><a class="po-' + headingClass + '" tabindex="-1" role="menuitem" href="#';
				htmlStr += key + '">' + val;
				htmlStr += '</a></li>';
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
			window.addEventListener("hashchange", function () {
				var element = document.getElementById(location.hash.substring(1));
				if (element) {
					if (!/^(?:a|select|input|button|textarea)$/i.test(element.tagName)) {
						element.tabIndex = -1;
					}
					element.focus();
				}
			}, false);
		}
	};

	SkipTo.prototype.init(appConfig);

}(window.Drupal || window.Wordpress || window.SkipToConfig || {}));
