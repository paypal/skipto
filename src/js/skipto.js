/* ========================================================================
* Copyright (c) <2022> (ver 5.0) Jon Gunderson
* Copyright (c) <2021> PayPal and University of Illinois
* All rights reserved.
* Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:
* Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
* Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
* Neither the name of PayPal or any of its subsidiaries or affiliates, nor the name of the University of Illinois, nor the names of any other contributors contributors may be used to endorse or promote products derived from this software without specific prior written permission.
* THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
* ======================================================================== */

(function() {
  'use strict';

  // Helper functions

  const skipableElements = [
    'base',
    'content',
    'frame',
    'iframe',
    'input[type=hidden]',
    'link',
    'meta',
    'noscript',
    'script',
    'style',
    'template',
    'shadow',
    'title'
  ];

  const allowedHeadingsSelectors = [
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'main'
  ];

  const allowedLandmarkSelectors = [
  'banner',
  'complementary',
  'contentinfo',
  'main',
  'navigation',
  'region',
  'search'
  ];

  // Tests if a tag name can be skipped
  function isSkipableElement(tagName, type) {
      const elemSelector = (typeof type !== 'string') ? tagName : `${tagName}[type=${type}]`;
      return skipableElements.includes(elemSelector);
  }

  // Tests if a tag name is a custom element
  function isCustomElement(tagName) {
    return tagName.indexOf('-') >= 0;
  }

  // Tests if a node is a slot element
  function isSlotElement(node) {
    return (node instanceof HTMLSlotElement);
  }

  // checks if an element node is a landmark
  function checkForLandmark (node) {
    if (node.hasAttribute('role')) {
      const role = node.getAttribute('role').toLowerCase();
      console.log(`[role]: ${role}`);
      if (allowedLandmarkSelectors.indexOf(role) >= 0) {
        return role;
      }
    } else {
      const tagName = node.tagName.toLowerCase();
      console.log(`[tagName]: ${tagName}`);

      switch (tagName) {
        case 'aside':
          return 'complementary';

        case 'main':
          return 'main';

        case 'nav':
          return 'navigation';

        case 'section':
          if (node.hasAttribute('aria-label') || node.hasAttribute('aria-labelledby')) {
            return 'region';
          }
          break;

        default:
          break;  
      }
    }
    return '';
  }

  const SkipTo = {
    skipToId: 'id-skip-to-js-50',
    skipToMenuId: 'id-skip-to-menu-50',
    domNode: null,
    buttonNode: null,
    menuNode: null,
    menuitemNodes: [],
    firstMenuitem: false,
    lastMenuitem: false,
    firstChars: [],
    headingLevels: [],
    skipToIdIndex: 1,
    // Default configuration values
    config: {
      // Feature switches
      enableHeadingLevelShortcuts: true,

      // Customization of button and menu
      altShortcut: '0', // default shortcut key is the number zero
      optionShortcut: 'º', // default shortcut key character associated with option+0 on mac 
      attachElement: 'header',
      displayOption: 'static', // options: static (default), popup
      // container element, use containerClass for custom styling
      containerElement: 'div',
      containerRole: '',
      customClass: '',

      // Button labels and messages
      buttonLabel: 'Skip To Content',
      altLabel: 'Alt',
      optionLabel: 'Option',
      buttonShortcut: ' ($modifier+$key)',
      altButtonAriaLabel: 'Skip To Content, shortcut Alt plus $key',
      optionButtonAriaLabel: 'Skip To Content, shortcut Option plus $key',

      // Menu labels and messages
      menuLabel: 'Landmarks and Headings',
      landmarkGroupLabel: 'Landmarks',
      headingGroupLabel: 'Headings',
      headingLevelLabel: 'Heading level',
      mainLabel: 'main',
      searchLabel: 'search',
      navLabel: 'navigation',
      regionLabel: 'region',
      asideLabel: 'complementary',
      footerLabel: 'contentinfo',
      headerLabel: 'banner',
      formLabel: 'form',
      msgNoLandmarksFound: 'No landmarks found',
      msgNoHeadingsFound: 'No headings found',

      // Selectors for landmark and headings sections
      landmarks: 'main search navigation complementary',
      headings: 'main h1 h2 h3',

      // Custom CSS position and colors
      colorTheme: '',
      fontFamily: '',
      fontSize: '',
      positionLeft: '',
      menuTextColor: '',
      menuBackgroundColor: '',
      menuitemFocusTextColor: '',
      menuitemFocusBackgroundColor: '',
      focusBorderColor: '',
      buttonTextColor: '',
      buttonBackgroundColor: '',

      // Deprecated configuration options, that are ignored during initialization
      // These are included for compatibility with older configuration objects
      // They are included so an error is not thrown during initialization
      buttonTitle: '',
      buttonTitleWithAccesskey: '',
      enableActions: false,
      actionGroupLabel: '',
      actionShowHeadingsHelp: '',
      actionShowSelectedHeadingsLabel: '',
      actionShowAllHeadingsLabel: '',
      actionShowLandmarksHelp: '',
      actionShowSelectedLandmarksLabel: '',
      actionShowAllLandmarksLabel: '',
      actionShowSelectedHeadingsAriaLabel: '',
      actionShowAllHeadingsAriaLabel: '',
      actionShowSelectedLandmarksAriaLabel: '',
      actionShowAllLandmarksAriaLabel: '',
    },
    colorThemes: {
      'default': {
        fontFamily: 'inherit',
        fontSize: 'inherit',
        positionLeft: '46%',
        menuTextColor: '#1a1a1a',
        menuBackgroundColor: '#dcdcdc',
        menuitemFocusTextColor: '#eeeeee',
        menuitemFocusBackgroundColor: '#1a1a1a',
        focusBorderColor: '#1a1a1a',
        buttonTextColor: '#1a1a1a',
        buttonBackgroundColor: '#eeeeee',
      },
      'aria': {
        fontFamily: 'sans-serif',
        fontSize: '10pt',
        positionLeft: '7%',
        menuTextColor: '#000',
        menuBackgroundColor: '#def',
        menuitemFocusTextColor: '#fff',
        menuitemFocusBackgroundColor: '#005a9c',
        focusBorderColor: '#005a9c',
        buttonTextColor: '#005a9c',
        buttonBackgroundColor: '#ddd',
      },
      'illinois': {
        fontFamily: 'inherit',
        fontSize: 'inherit',
        positionLeft: '46%',
        menuTextColor: '#00132c',
        menuBackgroundColor: '#cad9ef',
        menuitemFocusTextColor: '#eeeeee',
        menuitemFocusBackgroundColor: '#00132c',
        focusBorderColor: '#ff552e',
        buttonTextColor: '#444444',
        buttonBackgroundColor: '#dddede',
      },
      'wai': {
        fontFamily: 'sans-serif',
        fontSize: '10pt',
        positionLeft: '7%',
        displayOption: 'popup',
        menuTextColor: '#000',
        menuBackgroundColor: '#def',
        menuitemFocusTextColor: '#fff',
        menuitemFocusBackgroundColor: '#005a9c',
        focusBorderColor: '#005a9c',
        buttonTextColor: '#005a9c',
        buttonBackgroundColor: '#ddd',
      }
    },
    defaultCSS: '@@cssContent',

    // Utility methods

    /*
     * @method isNotEmptyString
     *
     * @desc Tests a string to see if it contains any printable characters
     *
     * @return {boolean} True if contains printable characters, otherwise false
     */
    isNotEmptyString: function(str) {
      return (typeof str === 'string') && str.length && str.trim() && str !== "&nbsp;";
    },

    /*
     * @method isEmptyString
     *
     * @desc Tests a string to see if it contains non-printable characters
     *
     * @return {boolean} True if contains only non-printable characters, otherwise false
     */
    isEmptyString: function(str) {
      return (typeof str !== 'string') || str.length === 0 && !str.trim();
    },

    /*
     * @method getTheme
     *
     * @desc Returns a reference to named configuration options, if theme name
     *       does not exist then return the default configuration options
     *
     * @return {object} see @desc
     */
    getTheme: function () {
      if (typeof this.colorThemes[this.config.colorTheme] === 'object') {
        return this.colorThemes[this.config.colorTheme];
      }
      return this.colorThemes['default'];
    },

    /*
     * @method init
     *
     * @desc Initializes the skipto button and menu with default and user 
     *       defined options
     *
     * @param  {object} config - Reference to configuration object
     *                           can be undefined
     */
    init: function(config) {
      let node;
      let buttonVisibleLabel;
      let buttonAriaLabel;

      // Check if skipto is already loaded
      if (document.querySelector('style#' + this.skipToId)) {
        return;
      }

      let attachElement = document.body;
      if (config) {
        this.setupConfig(config);
      }
      if (typeof this.config.attachElement === 'string') {
        node = document.querySelector(this.config.attachElement);
        if (node && node.nodeType === Node.ELEMENT_NODE) {
          attachElement = node;
        }
      }
      this.addCSSColors();
      this.renderStyleElement(this.defaultCSS);
      let elem = this.config.containerElement.toLowerCase().trim();
      if (!this.isNotEmptyString(elem)) {
        elem = 'div';
      }
      this.domNode = document.createElement(elem);
      this.domNode.classList.add('skip-to');
      if (this.isNotEmptyString(this.config.customClass)) {
        this.domNode.classList.add(this.config.customClass);
      }
      if (this.isNotEmptyString(this.config.containerRole)) {
        this.domNode.setAttribute('role', this.config.containerRole);
      }
      let displayOption = this.config.displayOption;
      if (typeof displayOption === 'string') {
        displayOption = displayOption.trim().toLowerCase();
        if (displayOption.length) {
          switch (this.config.displayOption) {
            case 'fixed':
              this.domNode.classList.add('fixed');
              break;
            case 'onfocus':  // Legacy option
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
      } else {
        attachElement.appendChild(this.domNode);
      }
      
      // Menu button
      [buttonVisibleLabel, buttonAriaLabel] = this.getBrowserSpecificShortcut();

      this.buttonNode = document.createElement('button');
      this.buttonNode.textContent = buttonVisibleLabel;
      this.buttonNode.setAttribute('aria-label', buttonAriaLabel);
      this.buttonNode.setAttribute('aria-haspopup', 'true');
      this.buttonNode.setAttribute('aria-expanded', 'false');
      this.buttonNode.setAttribute('aria-controls', this.skipToMenuId);

      this.buttonNode.addEventListener('keydown', this.handleButtonKeydown.bind(this));
      this.buttonNode.addEventListener('click', this.handleButtonClick.bind(this));

      this.domNode.appendChild(this.buttonNode);


      this.menuNode = document.createElement('div');
      this.menuNode.setAttribute('role', 'menu');
      this.menuNode.setAttribute('aria-label', this.config.menuLabel);
      this.menuNode.setAttribute('aria-busy', 'true');
      this.menuNode.setAttribute('id', this.skipToMenuId);

      this.domNode.appendChild(this.menuNode);
      this.domNode.addEventListener('focusin', this.handleFocusin.bind(this));
      this.domNode.addEventListener('focusout', this.handleFocusout.bind(this));
      window.addEventListener('pointerdown', this.handleBackgroundPointerdown.bind(this), true);

      if (this.usesAltKey || this.usesOptionKey) {
        document.addEventListener(
          'keydown',
          this.handleDocumentKeydown.bind(this)
        );
      }
    },

    updateStyle: function(stylePlaceholder, value, defaultValue) {
      if (typeof value !== 'string' || value.length === 0) {
        value = defaultValue;
      }
      let index1 = this.defaultCSS.indexOf(stylePlaceholder);
      let index2 = index1 + stylePlaceholder.length;
      while (index1 >= 0 && index2 < this.defaultCSS.length) {
        this.defaultCSS = this.defaultCSS.substring(0, index1) + value + this.defaultCSS.substring(index2);
        index1 = this.defaultCSS.indexOf(stylePlaceholder, index2);
        index2 = index1 + stylePlaceholder.length;
      }
    },

    /*
     * @method addCSSColors
     *
     * @desc Updates the styling information in the attached
     *       stylesheet to use the configured colors  
     */
    addCSSColors: function() {
      const theme = this.getTheme();

      this.updateStyle('$fontFamily', this.config.fontFamily, theme.fontFamily);
      this.updateStyle('$fontSize', this.config.fontSize, theme.fontSize);

      this.updateStyle('$positionLeft', this.config.positionLeft, theme.positionLeft);

      this.updateStyle('$menuTextColor', this.config.menuTextColor, theme.menuTextColor);
      this.updateStyle('$menuBackgroundColor', this.config.menuBackgroundColor, theme.menuBackgroundColor);

      this.updateStyle('$menuitemFocusTextColor', this.config.menuitemFocusTextColor, theme.menuitemFocusTextColor);
      this.updateStyle('$menuitemFocusBackgroundColor', this.config.menuitemFocusBackgroundColor, theme.menuitemFocusBackgroundColor);

      this.updateStyle('$focusBorderColor', this.config.focusBorderColor, theme.focusBorderColor);

      this.updateStyle('$buttonTextColor', this.config.buttonTextColor, theme.buttonTextColor);
      this.updateStyle('$buttonBackgroundColor', this.config.buttonBackgroundColor, theme.buttonBackgroundColor);
    },

    /*
     * @method getBrowserSpecificShortcut
     *
     * @desc Identifies the operating system and updates labels for 
     *       shortcut key to use either the "alt" or the "option"
     *       label  
     */
    getBrowserSpecificShortcut: function () {
      const platform =  navigator.platform.toLowerCase();
      const userAgent = navigator.userAgent.toLowerCase();

      const hasWin    = platform.indexOf('win') >= 0;
      const hasMac    = platform.indexOf('mac') >= 0;
      const hasLinux  = platform.indexOf('linux') >= 0 || platform.indexOf('bsd') >= 0;
      const hasAndroid = userAgent.indexOf('android') >= 0;

      this.usesAltKey = hasWin || (hasLinux && !hasAndroid);
      this.usesOptionKey = hasMac;

      let label = this.config.buttonLabel;
      let ariaLabel = this.config.buttonLabel;
      let buttonShortcut;

      // Check to make sure a shortcut key is defined
      if (this.config.altShortcut && this.config.optionShortcut) {
        if (this.usesAltKey || this.usesOptionKey) {
          buttonShortcut = this.config.buttonShortcut.replace(
            '$key',
            this.config.altShortcut
          );
        }
        if (this.usesAltKey) {
          buttonShortcut = buttonShortcut.replace(
            '$modifier',
            this.config.altLabel
          );
          label = label + buttonShortcut;
          ariaLabel = this.config.altButtonAriaLabel.replace('$key', this.config.altShortcut);
        }

        if (this.usesOptionKey) {
          buttonShortcut = buttonShortcut.replace(
            '$modifier',
            this.config.optionLabel
          );
          label = label + buttonShortcut;
          ariaLabel = this.config.optionButtonAriaLabel.replace('$key', this.config.altShortcut);
        }
      }
      return [label, ariaLabel];
    },

    /*
     * @method setupConfig
     *
     * @desc Get configuration information from user configuration to change 
     *       default settings 
     *
     * @param  {object}  appConfig - Javascript object with configuration information
     */
    setupConfig: function(appConfig) {
      let appConfigSettings;
      // Support version 4.1 configuration object structure 
      // If found use it
      if ((typeof appConfig.settings === 'object') && 
          (typeof appConfig.settings.skipTo === 'object')) {
        appConfigSettings = appConfig.settings.skipTo;
      }
      else {
        // Version 5.0 removes the requirement for the "settings" and "skipto" properties
        // to reduce the complexity of configuring skipto
        if ((typeof appConfig === 'undefined') || 
             (typeof appConfig !== 'object')) {
          appConfigSettings = {};
        }
        else {
          appConfigSettings = appConfig;
        }
      }

      for (const name in appConfigSettings) {
        //overwrite values of our local config, based on the external config
        if ((typeof this.config[name] !== 'undefined') &&
           ((typeof appConfigSettings[name] === 'string') &&
            (appConfigSettings[name].length > 0 ) ||
           typeof appConfigSettings[name] === 'boolean')
          ) {
          this.config[name] = appConfigSettings[name];
        } else {
          throw new Error('** SkipTo problem with configuration option "' + name + '".');
        }
      }
    },
    renderStyleElement: function(cssString) {
      const styleNode = document.createElement('style');
      const headNode = document.getElementsByTagName('head')[0];
      const css = document.createTextNode(cssString);

      styleNode.setAttribute("type", "text/css");
      // ID is used to test whether skipto is already loaded
      styleNode.id = this.skipToId;
      styleNode.appendChild(css);
      headNode.appendChild(styleNode);
    },

    //
    // Functions related to creating and populating the
    // the popup menu
    //

    getFirstChar: function(menuitem) {
      const label = menuitem.querySelector('.label');
      if (label && this.isNotEmptyString(label.textContent)) {
        return label.textContent.trim()[0].toLowerCase();
      }
      return '';
    },

    getHeadingLevelFromAttribute: function(menuitem) {
      if (menuitem.hasAttribute('data-level')) {
        return menuitem.getAttribute('data-level');
      }
      return '';
    },

    updateKeyboardShortCuts: function () {
      let mi;
      this.firstChars = [];
      this.headingLevels = [];

      for(let i = 0; i < this.menuitemNodes.length; i += 1) {
        mi = this.menuitemNodes[i];
        this.firstChars.push(this.getFirstChar(mi));
        this.headingLevels.push(this.getHeadingLevelFromAttribute(mi));
      }
    },

    updateMenuitems: function () {
      let menuitemNodes = this.menuNode.querySelectorAll('[role=menuitem');

      this.menuitemNodes = [];
      for(let i = 0; i < menuitemNodes.length; i += 1) {
        this.menuitemNodes.push(menuitemNodes[i]);
      }

      this.firstMenuitem = this.menuitemNodes[0];
      this.lastMenuitem = this.menuitemNodes[this.menuitemNodes.length-1];
      this.lastMenuitem.classList.add('last');
      this.updateKeyboardShortCuts();
    },

    renderMenuitemToGroup: function (groupNode, mi) {
      let tagNode, tagNodeChild, labelNode, nestingNode;

      let menuitemNode = document.createElement('div');
      menuitemNode.setAttribute('role', 'menuitem');
      menuitemNode.classList.add(mi.class);
      if (this.isNotEmptyString(mi.tagName)) {
        menuitemNode.classList.add('skip-to-' + mi.tagName.toLowerCase());
      }
      menuitemNode.setAttribute('data-id', mi.dataId);
      menuitemNode.tabIndex = -1;
      if (this.isNotEmptyString(mi.ariaLabel)) {
        menuitemNode.setAttribute('aria-label', mi.ariaLabel);
      }

      // add event handlers
      menuitemNode.addEventListener('keydown', this.handleMenuitemKeydown.bind(this));
      menuitemNode.addEventListener('click', this.handleMenuitemClick.bind(this));
      menuitemNode.addEventListener('pointerenter', this.handleMenuitemPointerenter.bind(this));

      groupNode.appendChild(menuitemNode);

      // add heading level and label
      if (mi.class.includes('heading')) {
        if (this.config.enableHeadingLevelShortcuts) {
          tagNode = document.createElement('span');
          tagNodeChild = document.createElement('span');
          tagNodeChild.appendChild(document.createTextNode(mi.level));
          tagNode.append(tagNodeChild);
          tagNode.appendChild(document.createTextNode(')'));
          tagNode.classList.add('level');
          menuitemNode.append(tagNode);
        } else {
          menuitemNode.classList.add('no-level');
        }
        menuitemNode.setAttribute('data-level', mi.level);
        if (this.isNotEmptyString(mi.tagName)) {
          menuitemNode.classList.add('skip-to-' + mi.tagName);
        }
      }

      // add nesting level for landmarks
      if (mi.class.includes('landmark')) {
        menuitemNode.setAttribute('data-nesting', mi.nestingLevel);
        menuitemNode.classList.add('skip-to-nesting-level-' + mi.nestingLevel);

        if (mi.nestingLevel > 0 && (mi.nestingLevel > this.lastNestingLevel)) {
          nestingNode = document.createElement('span');
          nestingNode.classList.add('nesting');
          menuitemNode.append(nestingNode);
        }
        this.lastNestingLevel = mi.nestingLevel;
      }

      labelNode = document.createElement('span');
      labelNode.appendChild(document.createTextNode(mi.name));
      labelNode.classList.add('label');
      menuitemNode.append(labelNode);

      return menuitemNode;
    },

    renderGroupLabel: function (groupLabelId, title) {
      const  groupLabelNode = document.getElementById(groupLabelId);
      const titleNode = groupLabelNode.querySelector('.title');
      titleNode.textContent = title;
    },

    renderMenuitemGroup: function(groupId, title) {
      let labelNode, groupNode, spanNode;
      let menuNode = this.menuNode;
      if (this.isNotEmptyString(title)) {
        labelNode = document.createElement('div');
        labelNode.id = groupId + "-label";
        labelNode.setAttribute('role', 'separator');
        menuNode.appendChild(labelNode);

        spanNode = document.createElement('span');
        spanNode.classList.add('title');
        spanNode.textContent = title;
        labelNode.append(spanNode);

        spanNode = document.createElement('span');
        spanNode.classList.add('mofn');
        labelNode.append(spanNode);

        groupNode = document.createElement('div');
        groupNode.setAttribute('role', 'group');
        groupNode.setAttribute('aria-labelledby', labelNode.id);
        groupNode.id = groupId;
        menuNode.appendChild(groupNode);
        menuNode = groupNode;
      }
      return groupNode;
    },

    renderMenuitemsToGroup: function(groupNode, menuitems, msgNoItemsFound) {
      groupNode.innerHTML = '';
      this.lastNestingLevel = 0;

      if (menuitems.length === 0) {
          const item = {};
          item.name = msgNoItemsFound;
          item.tagName = '';
          item.class = 'no-items';
          item.dataId = '';
          this.renderMenuitemToGroup(groupNode, item);
      }
      else {
          for (let i = 0; i < menuitems.length; i += 1) {
          this.renderMenuitemToGroup(groupNode, menuitems[i]);
          }
      }
    },

    renderMenu: function() {
      let groupNode;

      // remove current menu items from menu
      while (this.menuNode.lastElementChild) {
        this.menuNode.removeChild(this.menuNode.lastElementChild);
      }

      // Create landmarks group
      const landmarkElements = this.getLandmarks(this.config.landmarks);

      groupNode = this.renderMenuitemGroup('id-skip-to-group-landmarks', this.config.landmarkGroupLabel);
      this.renderMenuitemsToGroup(groupNode, landmarkElements, this.config.msgNoLandmarksFound);
      this.renderGroupLabel('id-skip-to-group-landmarks-label', this.config.landmarkGroupLabel);

      // Create headings group
      const headingElements = this.getHeadings(this.config.headings);

      groupNode = this.renderMenuitemGroup('id-skip-to-group-headings', this.config.headingGroupLabel);
      this.renderMenuitemsToGroup(groupNode, headingElements, this.config.msgNoHeadingsFound);
      this.renderGroupLabel('id-skip-to-group-headings-label', this.config.headingGroupLabel);

      // Update list of menuitems
      this.updateMenuitems();
    },

    //
    // Menu scripting event functions and utilities
    //

    setFocusToMenuitem: function(menuitem) {
      if (menuitem) {
        menuitem.focus();
      }
    },

    setFocusToFirstMenuitem: function() {
      this.setFocusToMenuitem(this.firstMenuitem);
    },

    setFocusToLastMenuitem: function() {
      this.setFocusToMenuitem(this.lastMenuitem);
    },

    setFocusToPreviousMenuitem: function(menuitem) {
      let newMenuitem, index;
      if (menuitem === this.firstMenuitem) {
        newMenuitem = this.lastMenuitem;
      } else {
        index = this.menuitemNodes.indexOf(menuitem);
        newMenuitem = this.menuitemNodes[index - 1];
      }
      this.setFocusToMenuitem(newMenuitem);
      return newMenuitem;
    },

    setFocusToNextMenuitem: function(menuitem) {
      let newMenuitem, index;
      if (menuitem === this.lastMenuitem) {
        newMenuitem = this.firstMenuitem;
      } else {
        index = this.menuitemNodes.indexOf(menuitem);
        newMenuitem = this.menuitemNodes[index + 1];
      }
      this.setFocusToMenuitem(newMenuitem);
      return newMenuitem;
    },

    setFocusByFirstCharacter: function(menuitem, char) {
      let start, index;
      if (char.length > 1) {
        return;
      }
      char = char.toLowerCase();

      // Get start index for search based on position of currentItem
      start = this.menuitemNodes.indexOf(menuitem) + 1;
      if (start >= this.menuitemNodes.length) {
        start = 0;
      }

      // Check remaining items in the menu
      index = this.firstChars.indexOf(char, start);

      // If not found in remaining items, check headings
      if (index === -1) {
        index = this.headingLevels.indexOf(char, start);
      }

      // If not found in remaining items, check from beginning
      if (index === -1) {
        index = this.firstChars.indexOf(char, 0);
      }

      // If not found in remaining items, check headings from beginning
      if (index === -1) {
        index = this.headingLevels.indexOf(char, 0);
      }

      // If match was found...
      if (index > -1) {
        this.setFocusToMenuitem(this.menuitemNodes[index]);
      }
    },

    // Utilities
    getIndexFirstChars: function(startIndex, char) {
      for (let i = startIndex; i < this.firstChars.length; i += 1) {
        if (char === this.firstChars[i]) {
          return i;
        }
      }
      return -1;
    },
    // Popup menu methods
    openPopup: function() {
      this.menuNode.setAttribute('aria-busy', 'true');
      const h = (80 * window.innerHeight) / 100;
      this.menuNode.style.maxHeight = h + 'px';
      this.renderMenu();
      this.menuNode.style.display = 'block';
      this.menuNode.removeAttribute('aria-busy');
      this.buttonNode.setAttribute('aria-expanded', 'true');
    },

    closePopup: function() {
      if (this.isOpen()) {
        this.buttonNode.setAttribute('aria-expanded', 'false');
        this.menuNode.style.display = 'none';
      }
    },
    isOpen: function() {
      return this.buttonNode.getAttribute('aria-expanded') === 'true';
    },
    // Menu event handlers
    handleFocusin: function() {
      this.domNode.classList.add('focus');
    },
    handleFocusout: function() {
      this.domNode.classList.remove('focus');
    },
    handleButtonKeydown: function(event) {
      let key = event.key,
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
    handleButtonClick: function(event) {
      if (this.isOpen()) {
        this.closePopup();
        this.buttonNode.focus();
      } else {
        this.openPopup();
        this.setFocusToFirstMenuitem();
      }
      event.stopPropagation();
      event.preventDefault();
    },
    handleDocumentKeydown: function (event) {
      let key = event.key,
        flag = false;

      let altPressed =
        this.usesAltKey &&
        event.altKey &&
        !event.ctrlKey &&
        !event.shiftKey &&
        !event.metaKey;

      let optionPressed =
        this.usesOptionKey &&
        event.altKey &&
        !event.ctrlKey &&
        !event.shiftKey &&
        !event.metaKey;

      if (
        (optionPressed && this.config.optionShortcut === key) ||
        (altPressed && this.config.altShortcut === key)
      ) {
        this.openPopup();
        this.setFocusToFirstMenuitem();
        flag = true;
      }
      if (flag) {
        event.stopPropagation();
        event.preventDefault();
      }
    },    

    queryDOMForSkipToId: function (targetId) {
      function transverseDOMForSkipToId(startingNode) {
        var targetNode = null;
        for (let node = startingNode.firstChild; node !== null; node = node.nextSibling ) {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const tagName = node.tagName.toLowerCase();
            if (node.getAttribute('data-skip-to-id') === targetId) {
              return node;
            }
            if (!isSkipableElement(tagName, node.getAttribute('type'))) {
              // check for slotted content
              if (isSlotElement(node)) {
                  // if no slotted elements, check for default slotted content
                const assignedNodes = node.assignedNodes().length ?
                                      node.assignedNodes() :
                                      node.assignedNodes({ flatten: true });
                for (let i = 0; i < assignedNodes.length; i += 1) {
                  const assignedNode = assignedNodes[i];
                  targetNode = transverseDOMForSkipToId(assignedNode);
                  if (targetNode) {
                    return targetNode;
                  }
                }
              } else {
                // check for custom elements
                if (isCustomElement(tagName)) {
                  if (node.shadowRoot) {
                    targetNode = transverseDOMForSkipToId(node.shadowRoot);
                    if (targetNode) {
                      return targetNode;
                    }
                  }
                } else {
                  targetNode = transverseDOMForSkipToId(node);
                  if (targetNode) {
                    return targetNode;
                  }
                }
              }
            }
          } // end if
        } // end for
        return false;
      } // end function
      return transverseDOMForSkipToId(document.body);
    },

    skipToElement: function(menuitem) {

      const isVisible = this.isVisible;
      let focusNode = false;
      let scrollNode = false;
      let elem;

      function findVisibleElement(e, selectors) {
        if (e) {
          for (let j = 0; j < selectors.length; j += 1) {
            const elems = e.querySelectorAll(selectors[j]);
            for(let i = 0; i < elems.length; i +=1) {
              if (isVisible(elems[i])) {
                return elems[i];
              }
            }
          }
        }
        return e;
      }

      const searchSelectors = ['input', 'button', 'input[type=button]', 'input[type=submit]', 'a'];
      const navigationSelectors = ['a', 'input', 'button', 'input[type=button]', 'input[type=submit]'];
      const landmarkSelectors = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'section', 'article', 'p', 'li', 'a'];

      const isLandmark = menuitem.classList.contains('landmark');
      const isSearch = menuitem.classList.contains('skip-to-search');
      const isNav = menuitem.classList.contains('skip-to-nav');

      elem = this.queryDOMForSkipToId(menuitem.getAttribute('data-id'));

      if (elem) {
        if (isSearch) {
          focusNode = findVisibleElement(elem, searchSelectors);
        }
        if (isNav) {
          focusNode = findVisibleElement(elem, navigationSelectors);
        }
        if (focusNode && this.isVisible(focusNode)) {
          focusNode.focus();
          focusNode.scrollIntoView({block: 'nearest'});
        }
        else {
          if (isLandmark) {
            scrollNode = findVisibleElement(elem, landmarkSelectors);
            if (scrollNode) {
              elem = scrollNode;
            }
          }
          elem.tabIndex = -1;
          elem.focus();
          elem.scrollIntoView({block: 'center'});
        }
      }
    },
    handleMenuitemAction: function(tgt) {
      switch (tgt.getAttribute('data-id')) {
        case '':
          // this means there were no headings or landmarks in the list
          break;

        default:
          this.closePopup();
          this.skipToElement(tgt);
          break;
      }
    },
    handleMenuitemKeydown: function(event) {
      let tgt = event.currentTarget,
        key = event.key,
        flag = false;

      function isPrintableCharacter(str) {
        return str.length === 1 && str.match(/\S/);
      }
      if (event.ctrlKey || event.altKey || event.metaKey) {
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
      } else {
        switch (key) {
          case 'Enter':
          case ' ':
            this.handleMenuitemAction(tgt);
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
    handleMenuitemClick: function(event) {
      this.handleMenuitemAction(event.currentTarget);
      event.stopPropagation();
      event.preventDefault();
    },
    handleMenuitemPointerenter: function(event) {
      let tgt = event.currentTarget;
      tgt.focus();
    },
    handleBackgroundPointerdown: function(event) {
      if (!this.domNode.contains(event.target)) {
        if (this.isOpen()) {
          this.closePopup();
          this.buttonNode.focus();
        }
      }
    },
    // methods to extract landmarks, headings and ids
    normalizeName: function(name) {
      if (typeof name === 'string') return name.replace(/\w\S*/g, function(txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      });
      return "";
    },
    getTextContent: function(elem) {
      function getText(e, strings) {
        // If text node get the text and return
        if (e.nodeType === Node.TEXT_NODE) {
          strings.push(e.data);
        } else {
          // if an element for through all the children elements looking for text
          if (e.nodeType === Node.ELEMENT_NODE) {
            // check to see if IMG or AREA element and to use ALT content if defined
            let tagName = e.tagName.toLowerCase();
            if ((tagName === 'img') || (tagName === 'area')) {
              if (e.alt) {
                strings.push(e.alt);
              }
            } else {
              let c = e.firstChild;
              while (c) {
                getText(c, strings);
                c = c.nextSibling;
              } // end loop
            }
          }
        }
      } // end function getStrings
      // Create return object
      let str = "Test",
        strings = [];
      getText(elem, strings);
      if (strings.length) str = strings.join(" ");
      return str;
    },
    getAccessibleName: function(elem) {
      let labelledbyIds = elem.getAttribute('aria-labelledby'),
        label = elem.getAttribute('aria-label'),
        title = elem.getAttribute('title'),
        name = "";
      if (labelledbyIds && labelledbyIds.length) {
        let str,
          strings = [],
          ids = labelledbyIds.split(' ');
        if (!ids.length) ids = [labelledbyIds];
        for (let i = 0, l = ids.length; i < l; i += 1) {
          let e = document.getElementById(ids[i]);
          if (e) str = this.getTextContent(e);
          if (str && str.length) strings.push(str);
        }
        name = strings.join(" ");
      } else {
        if (this.isNotEmptyString(label)) {
          name = label;
        } else {
          if (this.isNotEmptyString(title)) {
            name = title;
          }
        }
      }
      return name;
    },
    isVisible: function(element) {
      function isVisibleRec(el) {
        if (el.parentNode.nodeType !== 1 || 
            (el.parentNode.tagName === 'BODY')) {
          return true;
        }
        const computedStyle = window.getComputedStyle(el);
        const display = computedStyle.getPropertyValue('display');
        const visibility = computedStyle.getPropertyValue('visibility');
        const hidden = el.getAttribute('hidden');
        if ((display === 'none') ||
          (visibility === 'hidden') ||
          (hidden !== null)) {
          return false;
        }
        const isVis = isVisibleRec(el.parentNode);
        return isVis;
      }

      return isVisibleRec(element);
    },

    getHeadingTargets(targets) {
      let targetHeadings = [];
      let items = targets.split(' ');
      items.forEach( item => {
        item = item.toLowerCase().trim();
        if ((allowedHeadingsSelectors.indexOf(item) >= 0) && 
            (item !== 'main')) {
          targetHeadings.push(item);
        }
      });
      return targetHeadings;
    },

    queryDOMForHeadings: function (targets) {
      let headingNodes = [];
      let targetHeadings = this.getHeadingTargets(targets);
      let onlyInMain = targets.toLowerCase().indexOf('main') >= 0;

      function transverseDOMForHeadings(startingNode, inMain = false) {
        for (let node = startingNode.firstChild; node !== null; node = node.nextSibling ) {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const tagName = node.tagName.toLowerCase();
            if (targetHeadings.indexOf(tagName) >= 0) {
              if (!onlyInMain || inMain) {
                headingNodes.push(node);
              }
            }
            if ((tagName === 'main') || 
                (node.hasAttribute('role') && node.getAttribute('role').toLowerCase === 'role')) {
              inMain = true;
            }
            if (!isSkipableElement(tagName, node.getAttribute('type'))) {
              // check for slotted content
              if (isSlotElement(node)) {
                  // if no slotted elements, check for default slotted content
                const assignedNodes = node.assignedNodes().length ?
                                      node.assignedNodes() :
                                      node.assignedNodes({ flatten: true });
                assignedNodes.forEach( assignedNode => {
                  transverseDOMForHeadings(assignedNode, inMain);
                });
              } else {
                // check for custom elements
                if (isCustomElement(tagName)) {
                  if (node.shadowRoot) {
                    transverseDOMForHeadings(node.shadowRoot, inMain);
                  }
                } else {
                  transverseDOMForHeadings(node, inMain);
                }
              }
            }
          } // end if
        } // end for
      } // end function

      transverseDOMForHeadings(document.body);

      // If no elements found when onlyInMain is set, try 
      // to find any headings
      if (headingNodes.length === 0 && onlyInMain) {
        onlyInMain = false;
        transverseDOMForHeadings(document.body);
      }

      return headingNodes;
    },
    getHeadings: function(targets) {
      let dataId, level;
      if (typeof targets !== 'string') {
        targets = this.config.headings;
      }
      let headingElementsArr = [];
      if (typeof targets !== 'string' || targets.length === 0) return;
      const headings = this.queryDOMForHeadings(targets);
      for (let i = 0, len = headings.length; i < len; i += 1) {
        let heading = headings[i];
        let role = heading.getAttribute('role');
        if ((typeof role === 'string') && (role === 'presentation')) continue;
        if (this.isVisible(heading) && this.isNotEmptyString(heading.innerHTML)) {
          if (heading.hasAttribute('data-skip-to-id')) {
            dataId = heading.getAttribute('data-skip-to-id');
          } else {
            heading.setAttribute('data-skip-to-id', this.skipToIdIndex);
            dataId = this.skipToIdIndex;
          }
          level = heading.tagName.substring(1);
          const headingItem = {};
          headingItem.dataId = dataId.toString();
          headingItem.class = 'heading';
          headingItem.name = this.getTextContent(heading);
          headingItem.ariaLabel = headingItem.name + ', ';
          headingItem.ariaLabel += this.config.headingLevelLabel + ' ' + level;
          headingItem.tagName = heading.tagName.toLowerCase();
          headingItem.role = 'heading';
          headingItem.level = level;
          headingElementsArr.push(headingItem);
          this.skipToIdIndex += 1;
        }
      }
      return headingElementsArr;
    },
    getLocalizedLandmarkName: function(tagName, name) {
      let n;
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
        case 'section':
        case 'region':
          n = this.config.regionLabel;
          break;
        case 'search':
          n = this.config.searchLabel;
          break;
          // When an ID is used as a selector, assume for main content
        default:
          n = tagName;
          break;
      }
      if (this.isNotEmptyString(name)) {
        n += ': ' + name;
      }
      return n;
    },
    getNestingLevel: function(landmark, landmarks) {
      let nestingLevel = 0;
      let parentNode = landmark.parentNode;
      while (parentNode) {
        for (let i = 0; i < landmarks.length; i += 1) {
          if (landmarks[i] === parentNode) {
            nestingLevel += 1;
            // no more than 3 levels of nesting supported
            if (nestingLevel === 3) {
              return 3;
            }
            continue;
          }
        }
        parentNode = parentNode.parentNode;
      }
      return nestingLevel;
    },

    getLandmarkTargets: function (targets) {
      let targetLandmarks = [];
      let items = targets.split(' ');
      items.forEach( item => {
        item = item.toLowerCase().trim();
        if (allowedLandmarkSelectors.indexOf(item) >= 0) {
          targetLandmarks.push(item);
        }
      });
      return targetLandmarks;
    },

    queryDOMForLandmarks: function (targets) {
      let landmarkNodes = [];
      let targetLandmarks = this.getLandmarkTargets(targets);
      console.log(`[targetLandmarks]: ${targetLandmarks}`);

      function transverseDOMForLandmarks(startingNode) {
        for (let node = startingNode.firstChild; node !== null; node = node.nextSibling ) {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const tagName = node.tagName.toLowerCase();
            console.log(`[checkForLandmark]: ${checkForLandmark(node)}`);
            if (targetLandmarks.indexOf(checkForLandmark(node)) >= 0) {
              landmarkNodes.push(node);
            }

            if (!isSkipableElement(tagName, node.getAttribute('type'))) {
              // check for slotted content
              if (isSlotElement(node)) {
                  // if no slotted elements, check for default slotted content
                const assignedNodes = node.assignedNodes().length ?
                                      node.assignedNodes() :
                                      node.assignedNodes({ flatten: true });
                assignedNodes.forEach( assignedNode => {
                  transverseDOMForLandmarks(assignedNode);
                });
              } else {
                // check for custom elements
                if (isCustomElement(tagName)) {
                  if (node.shadowRoot) {
                    transverseDOMForLandmarks(node.shadowRoot);
                  }
                } else {
                  transverseDOMForLandmarks(node);
                }
              }
            }
          } // end if
        } // end for
      } // end function

      transverseDOMForLandmarks(document.body);

      return landmarkNodes;
    },

    getLandmarks: function(targets) {
      if (typeof targets !== 'string') {
        targets = this.config.landmarks;
      }
      let landmarks = this.queryDOMForLandmarks(targets);
      let mainElements = [];
      let searchElements = [];
      let navElements = [];
      let asideElements = [];
      let footerElements = [];
      let regionElements = [];
      let otherElements = [];
      let allLandmarks = [];
      let dataId = '';
      for (let i = 0, len = landmarks.length; i < len; i += 1) {
        let landmark = landmarks[i];
        // if skipto is a landmark don't include it in the list
        if (landmark === this.domNode) {
          continue;
        }
        let role = landmark.getAttribute('role');
        let tagName = landmark.tagName.toLowerCase();
        if ((typeof role === 'string') && (role === 'presentation')) continue;
        if (this.isVisible(landmark)) {
          if (!role) role = tagName;
          let name = this.getAccessibleName(landmark);
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
            case 'region':
              tagName = 'section';
              break;
            case 'search':
              tagName = 'search';
              break;
            default:
              break;
          }
          // if using ID for selectQuery give tagName as main
          if (['aside', 'footer', 'form', 'header', 'main', 'nav', 'section', 'search'].indexOf(tagName) < 0) {
            tagName = 'main';
          }
          if (landmark.hasAttribute('aria-roledescription')) {
            tagName = landmark.getAttribute('aria-roledescription').trim().replace(' ', '-');
          }
          if (landmark.hasAttribute('data-skip-to-id')) {
            dataId = landmark.getAttribute('data-skip-to-id');
          } else {
            landmark.setAttribute('data-skip-to-id', this.skipToIdIndex);
            dataId =  this.skipToIdIndex;
          }
          const landmarkItem = {};
          landmarkItem.dataId = dataId.toString();
          landmarkItem.class = 'landmark';
          landmarkItem.hasName = name.length > 0;
          landmarkItem.name = this.getLocalizedLandmarkName(tagName, name);
          landmarkItem.tagName = tagName;
          landmarkItem.nestingLevel = 0;
          this.skipToIdIndex += 1;
          allLandmarks.push(landmarkItem);

          // For sorting landmarks into groups
          switch (tagName) {
            case 'main':
              mainElements.push(landmarkItem);
              break;
            case 'search':
              searchElements.push(landmarkItem);
              break;
            case 'nav':
              navElements.push(landmarkItem);
              break;
            case 'aside':
              asideElements.push(landmarkItem);
              break;
            case 'footer':
              footerElements.push(landmarkItem);
              break;
            case 'section':
              // Regions must have accessible name to be included
              if (landmarkItem.hasName) {
                regionElements.push(landmarkItem);
              }
              break;
            default:
              otherElements.push(landmarkItem);
              break;
          }
        }
      }
      return [].concat(mainElements, searchElements, navElements, asideElements, regionElements, footerElements, otherElements);
    }
  };
  // Initialize skipto menu button with onload event
  window.addEventListener('load', function() {
    SkipTo.init(window.SkipToConfig ||
                ((typeof window.Joomla === 'object' && typeof window.Joomla.getOptions === 'function') ? window.Joomla.getOptions('skipto-settings', {}) : {})
                );
  });
})();
