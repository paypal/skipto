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
			this.addStyles(".skipTo{padding:.5em;position:absolute;top:-5em;left:0;background:transparent;color:#000;-webkit-transition:top .5s ease-out,background .5s linear;-moz-transition:top .5s ease-out,background .5s linear;-o-transition:top .5s ease-out,background .5s linear;transition:top .5s ease-out,background .5s linear}.skipTo:focus{position:absolute;top:0;left:0;background:#ccc;-webkit-transition:top .1s ease-in,background .3s linear;-moz-transition:top .1s ease-in,background .3s linear;-o-transition:top .1s ease-in,background .3s linear;transition:top .1s ease-in,background .3s linear}.dropup,.dropMenu{position:relative}.dropMenu-toggle{*margin-bottom:-3px}.dropMenu-toggle:active,.open .dropMenu-toggle{outline:0}.caret{display:inline-block;width:0;height:0;vertical-align:top;border-top:4px solid #000;border-right:4px solid transparent;border-left:4px solid transparent;content:''}.dropMenu .caret{margin-top:8px;margin-left:2px}.dropMenu-menu{position:absolute;top:100%;left:0;z-index:1000;display:none;float:left;min-width:160px;padding:5px 0;margin:2px 0 0;list-style:none;background-color:#fff;border:1px solid #ccc;border:1px solid rgba(0,0,0,0.2);*border-right-width:2px;*border-bottom-width:2px;-webkit-border-radius:6px;-moz-border-radius:6px;border-radius:6px;-webkit-box-shadow:0 5px 10px rgba(0,0,0,0.2);-moz-box-shadow:0 5px 10px rgba(0,0,0,0.2);box-shadow:0 5px 10px rgba(0,0,0,0.2);-webkit-background-clip:padding-box;-moz-background-clip:padding;background-clip:padding-box}.dropMenu-menu.pull-right{right:0;left:auto}.dropMenu-menu .divider{*width:100%;height:1px;margin:9px 1px;*margin:-5px 0 5px;overflow:hidden;background-color:#e5e5e5;border-bottom:1px solid #fff}.dropMenu-menu>li>a{display:block;padding:3px 20px;clear:both;font-weight:normal;line-height:20px;color:#333;white-space:nowrap;text-decoration:none}.dropMenu-menu>li>a:hover,.dropMenu-menu>li>a:focus,.dropMenu-submenu:hover>a,.dropMenu-submenu:focus>a{text-decoration:none;color:#fff;background-color:#0081c2;background-image:-moz-linear-gradient(top,#08c,#0077b3);background-image:-webkit-gradient(linear,0 0,0 100%,from(#08c),to(#0077b3));background-image:-webkit-linear-gradient(top,#08c,#0077b3);background-image:-o-linear-gradient(top,#08c,#0077b3);background-image:linear-gradient(to bottom,#08c,#0077b3);background-repeat:repeat-x;filter:progid:DXImageTransform.Microsoft.gradient(startColorstr='#ff0088cc',endColorstr='#ff0077b3',GradientType=0)}.dropMenu-menu>.active>a,.dropMenu-menu>.active>a:hover,.dropMenu-menu>.active>a:focus{color:#fff;text-decoration:none;outline:0;background-color:#0081c2;background-image:-moz-linear-gradient(top,#08c,#0077b3);background-image:-webkit-gradient(linear,0 0,0 100%,from(#08c),to(#0077b3));background-image:-webkit-linear-gradient(top,#08c,#0077b3);background-image:-o-linear-gradient(top,#08c,#0077b3);background-image:linear-gradient(to bottom,#08c,#0077b3);background-repeat:repeat-x;filter:progid:DXImageTransform.Microsoft.gradient(startColorstr='#ff0088cc',endColorstr='#ff0077b3',GradientType=0)}.dropMenu-menu>.disabled>a,.dropMenu-menu>.disabled>a:hover,.dropMenu-menu>.disabled>a:focus{color:#999}.dropMenu-menu>.disabled>a:hover,.dropMenu-menu>.disabled>a:focus{text-decoration:none;background-color:transparent;background-image:none;filter:progid:DXImageTransform.Microsoft.gradient(enabled = false);cursor:default}.open{*z-index:1000}.open>.dropMenu-menu{display:block}.pull-right>.dropMenu-menu{right:0;left:auto}.dropup .caret,.navbar-fixed-bottom .dropMenu .caret{border-top:0;border-bottom:4px solid #000;content:''}.dropup .dropMenu-menu,.navbar-fixed-bottom .dropMenu .dropMenu-menu{top:auto;bottom:100%;margin-bottom:1px}.dropMenu-submenu{position:relative}.dropMenu-submenu>.dropMenu-menu{top:0;left:100%;margin-top:-6px;margin-left:-1px;-webkit-border-radius:0 6px 6px 6px;-moz-border-radius:0 6px 6px 6px;border-radius:0 6px 6px 6px}.dropMenu-submenu:hover>.dropMenu-menu{display:block}.dropup .dropMenu-submenu>.dropMenu-menu{top:auto;bottom:0;margin-top:0;margin-bottom:-2px;-webkit-border-radius:5px 5px 5px 0;-moz-border-radius:5px 5px 5px 0;border-radius:5px 5px 5px 0}.dropMenu-submenu>a:after{display:block;content:' ';float:right;width:0;height:0;border-color:transparent;border-style:solid;border-width:5px 0 5px 5px;border-left-color:#ccc;margin-top:5px;margin-right:-10px}.dropMenu-submenu:hover>a:after{border-left-color:#fff}.dropMenu-submenu.pull-left{float:none}.dropMenu-submenu.pull-left>.dropMenu-menu{left:-100%;margin-left:10px;-webkit-border-radius:6px 0 6px 6px;-moz-border-radius:6px 0 6px 6px;border-radius:6px 0 6px 6px}.dropMenu .dropMenu-menu .nav-header{padding-left:20px;padding-right:20px}");

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

}(window.Drupal || window.Wordpress || window.SkipToConfig || {}));
;(function () {
	"use strict";

	var Dropdown = {};

	Dropdown.prototype = {
		btn: null,
		prt: null,
		wrap: "false",

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

		toggleOptList: function (e) {
			this.btn = e.target;
			this.prt = this.btn.parentNode;

			if(typeof this.btn.dataset.wrap !== 'undefined') {
				this.wrap = this.btn.dataset.wrap;
			}
			//toggles (i.e. adds or removes) the existence of a class in classList
			this.prt.classList.toggle('open');
			//Set Aria-expanded to true only if the class open exists in dropMenu div
			if (this.prt.classList.contains('open')) {
				this.btn.setAttribute('aria-expanded', 'true');
			} else {
				this.btn.setAttribute('aria-expanded', 'false');
			}
			this.prt.querySelectorAll('[role=menu] li:not(.divider) a')[0].focus();
		},

		navigateMenus: function (e) {
			var keyCode = e.keyCode || e.which,
				arrow = {
					enter: 32,
					up: 38,
					esc: 27,
					down: 40
				},
				isActive = this.prt.classList.contains('open'),
				items = this.prt.querySelectorAll('[role=menu] li:not(.divider) a'),
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

		init: function () {
			var toggle = document.getElementsByClassName('dropMenu-toggle'),
				toggleBtn,
				k,
				l,
				menu,
				items,
				i,
				j,
				item;
			for (k = 0, l = toggle.length; k < l; k = k + 1) {
				toggleBtn = toggle[k];
				menu = document.getElementById(toggleBtn.dataset.target);
				items = menu.getElementsByTagName("a");

				toggleBtn.addEventListener('click', this.toggleOptList.bind(this), false);

				for (i = 0, j = items.length; i < j; i = i + 1) {
					item = items[i];
					item.addEventListener('keydown', this.navigateMenus.bind(this));
					item.addEventListener('blur', this.clearMenus.bind(this));
				}
			}
		} //end init

	}; //End Dropdown class

	Dropdown.prototype.init();

}());