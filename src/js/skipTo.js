(function (appConfig) {
	"use strict";
	var SkipTo = {};

	SkipTo.prototype = {
		hasHeading: false,
		dropdownHTML: null,
		config: {
			headings: 'h1 ,h2, h3',
			landmarks: '[role="main"],[role="search"]',
			accessKey: '0',
			wrap: "false"
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
				attachElement = document.body;
			this.addStyles('@@cssContent');

			this.dropdownHTML = '<a accesskey="'+ this.config.accessKey +'" data-wrap="'+ this.config.wrap +'"class="dropMenu-toggle skipTo" id="drop4" role="button" aria-haspopup="true" ';
			this.dropdownHTML += 'aria-expanded="false" data-toggle="dropMenu" href="#" data-target="menu1">Skip to<b class="caret"></b></a>';
			this.dropdownHTML += '<ul id="menu1" class="dropMenu-menu" role="menu" aria-labelledby="drop4" style="top:3%; text-align:left">';

			this.getHeadings();
			this.getLandMarks();

			this.dropdownHTML += '</ul>';

			if (this.hasHeading) {
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
				id;
			for (i = 0, j = headings.length; i < j; i = i + 1) {
				this.hasHeading = true;
				heading = headings[i];
				id = heading.getAttribute('id') || heading.innerHTML.replace(/\s+/g, '_').toLowerCase().replace(/[&\/\\#,+()$~%.'"!:*?<>{}¹]/g, '') + '_' + i;
				heading.tabIndex = "-1";
				heading.setAttribute('id', id);
				this.dropdownHTML += '<li role="presentation" style="list-style:none outside none"><a tabindex="-1" role="menuitem"';
				this.dropdownHTML += ' href="#';
				this.dropdownHTML += id;
				this.dropdownHTML += '">';
				this.dropdownHTML += heading.innerHTML.replace(/<\/?[^>]+>/gi, '');
				this.dropdownHTML += '</a></li>';
			}
		},

		getLandMarks: function () {
			var landmarks = document.querySelectorAll(this.config.landmarks),
				k,
				l,
				landmark,
				id1,
				role;
			for (k = 0, l = landmarks.length; k < l; k = k + 1) {
				this.hasHeading = true;
				landmark = landmarks[k];
				id1 = landmark.getAttribute('id') || 'ui-skip-' + Math.floor((Math.random() * 100) + 1);
				landmark.tabIndex = "-1";
				landmark.setAttribute('id', id1);
				role = landmark.getAttribute('role');
				if (role === 'contentinfo') {
					role = 'footer';
				} //contentinfo is ambiguous
				this.dropdownHTML += '<li role="presentation" style="list-style:none outside none"><a tabindex="-1" role="menuitem"';
				this.dropdownHTML += ' href="#';
				this.dropdownHTML += id1 + '">';
				this.dropdownHTML += role;
				this.dropdownHTML += ' landmark role</a></li>';
			}
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

}(window.Drupal || window.Wordpress || {}));
