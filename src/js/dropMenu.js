/* ========================================================================
* Copyright (c) <2013> eBay Software Foundation

* All rights reserved.

* Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.

* Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.

* Neither the name of eBay or any of its subsidiaries or affiliates nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission.

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
			this.menu = document.getElementById(this.btn.getAttribute('data-target'));

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
			catch(err){
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

		init: function () {
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
				
			for (k = 0, l = toggle.length; k < l; k = k + 1) {
				toggleBtn = toggle[k];
				menu = document.getElementById(toggleBtn.getAttribute('data-target'));
				items = menu.getElementsByTagName("a");

				toggleBtn.addEventListener('click', function(e) {
					self.toggleOptList(e);
				});
				toggleBtn.addEventListener('keydown', function(e){
					var keyCode = e.keyCode || e.which;
					if(keyCode === 32){						//SpaceBar should open the menu
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
				}
			}
		} //end init

	}; //End Dropdown class

	Dropdown.prototype.init();

}());