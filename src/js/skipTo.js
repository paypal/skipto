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
		elementsArr:  [],
		dropdownHTML: null,
		config: {
			headings: 'h1, h2, h3, h4',
			landmarks: '[role="banner"], [role="navigation"], [role="main"], [role="search"]',
			ids: '#a1, #a2',
			accessKey: '0',
			wrap: "false",
			visibility: "onFocus"
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
				attachElement = document.body,
				htmlStr = '';
			this.addStyles("@@cssContent");

			this.dropdownHTML = '<a accesskey="'+ this.config.accessKey +'" data-wrap="'+ this.config.wrap +'"class="dropMenu-toggle skipTo '+ this.config.visibility +'" id="drop4" role="button" aria-haspopup="true" ';
			this.dropdownHTML += 'aria-expanded="false" data-toggle="dropMenu" href="#" data-target="menu1">Skip to<b class="caret"></b></a>';
			this.dropdownHTML += '<ul id="menu1" class="dropMenu-menu" role="menu" aria-labelledby="drop4" style="top:3%; text-align:left">';

			this.getLandMarks();
			this.getHeadings();
			this.getIdElements();

			htmlStr = this.getdropdownHTML();
			this.dropdownHTML += htmlStr + '</ul>';

			if ( htmlStr.length >0 ) {
				div.className = "dropMenu";
				attachElement.insertBefore(div, attachElement.firstChild);
				div.innerHTML = this.dropdownHTML;
				this.addListeners();
			}
		},

		getHeadings: function () {
			var headings = document.querySelectorAll(this.config.headings),
				i,
				j,
				heading,
				id,
				val;
			for (i = 0, j = headings.length; i < j; i = i + 1) {
				heading = headings[i];
				id = heading.getAttribute('id') || heading.innerHTML.replace(/\s+/g, '_').toLowerCase().replace(/[&\/\\#,+()$~%.'"!:*?<>{}¹]/g, '') + '_' + i;
				heading.tabIndex = "-1";
				heading.setAttribute('id', id);
				val = heading.innerHTML.replace(/<\/?[^>]+>/gi, '');
				this.elementsArr[id] = val;
			}
		},

		getLandMarks: function () {
			var landmarks = document.querySelectorAll(this.config.landmarks),
				k,
				l,
				landmark,
				id1,
				role,
				val;

			for (k = 0, l = landmarks.length; k < l; k = k + 1) {
				landmark = landmarks[k];
				id1 = landmark.getAttribute('id') || 'ui-skip-' + Math.floor((Math.random() * 100) + 1);
				landmark.tabIndex = "-1";
				landmark.setAttribute('id', id1);
				role = landmark.getAttribute('role');
				if (role === 'contentinfo') {
					role = 'footer';
				} //contentinfo is ambiguous
				val = role.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
				if (role === 'main') {
					val += ' Content';
				}else{
					val += ' Landmark';
				}
				this.elementsArr[id1] = val;
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
				this.elementsArr[id] = val;
			}
		},

		getdropdownHTML: function(){
			var key,
				val,
				htmlStr = '' ;

			// window.console.log(this.elementsArr);

			for (key in this.elementsArr) {
				val = this.elementsArr[key];
				htmlStr += '<li role="presentation" style="list-style:none outside none"><a tabindex="-1" role="menuitem" href="#';
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

			if (ss1.styleSheet) {							// IE
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
