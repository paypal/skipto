<img src="images/logo_347x50_PPa11y.png" alt="PayPal accessibility logo">

# skipto@3.0
## by PayPal Accessibility Team & University of Illinois
See the [Authors](#authors) section for more information.

SkipTo is a replacement for your old classic "Skipnav" link, (so please use it as such)!
The SkipTo script creates a drop-down menu consisting of the links to important landmarks and headings on a given web page. Once installed and configured, the menu makes it easier for keyboard and screen reader users to quickly jump to the desired location by simply choosing it from the list of options.

![Example Screen Shot](images/example_screen_shot.png "Example Screen Shot")

## How it works
1.  The SkipTo menu button is the first tabable element on the page, and if it is not visible becomes the first time the user tabs into the page.
2.  Once the keyboard focus is on the menu button, pressing the ENTER or the SPACEBAR key will pull down the list of high-level headings and on the current page.
3.  Use arrow keys to select your choice and press ENTER to skip to it.
4.  If you decide to reach the menu again, simply press the built-in access key (0 by default). See the notes on [Access keys](#access-keys) for More information on how to use them.

## How do I get it on my web site?
All you need are either SkipTo.js or SkipTo.min.js from the "compiled/js" directory. Please note that SkipTo.min.js is a minified (a lighter version) of the script.
If you would like to be able to debug your production-ready script, include the provided SkipTo.min.map file as well.

To use the SkipTo script, just include it at the bottom of your HTML page or template, as follows:

```
<script src="http://[your domain]/[path to javascript directory]/SkipTo.min.js"></script>
```

NOTE: Make sure that "src" points to the place where you put the SkipTo Javascript file, otherwise, things will not work as intended.


## What About Drupal or WordPress
A module for version 3 is being considered for Drupal 8 and WordPress.

## Configuring SkipTo options
By default, SkipTo menu includes the following places on the page:

### Options for adding the button

| Property       | default     | Description |
| :------------- | :---------- | :---------- |
| `displayOption` | `static` | Values of `static` or `popup` are defined.  The value `static` the button is visible, when `popup` is used the button is initially not visible, but becomes visible when it receives focus. |
| `accessKey` | `s` | Accesskey provides a way to open the Skip To menu from anywhere on the page. |
| `attachElement` | `header` | A CSS selector for identifying which element to attach the menu button container. |
| `containerElement` | `div` | Element to use as a container for the button and the menu.
| `customClass` | `skipTo` | CSS class added to the container element. Can be used for customize styling of the button and menu with author supplied stylesheet. |
| `containerRole` | none | Optional landmark role added to a container element, if the container element is not within a landmark.  Ideally the menu button is placed within the `banner` landmark (e.g. `header` element. |

### CSS Selectors for identifying Landmarks and Headings

| Property       | Description |
| :------------- | :---------- |
| `landmarks` | These are CSS selectors used by `querySelectorAll` to get an array of landmark nodes. |
| `headings` | These are CSS selectors used by `querySelectorAll` to get an array of headings nodes. |

### Button and Menu labeling

The labels and messages can be localized for s specific languages or updated to reflect custom selectors.

| Property       | Description |
| :------------- | :---------- |
| `containerDivLabel` | If the menu button container is not in a landmark, the container must be a landmark with a label, the default label is 'Skip To Keyboard Navigation'. |
| `containerDivRole` | The landmark role of the menu button container, default role is 'navigation'. |
| `buttonLabel` | Change the label for the button, the default is 'Skip To Content'. |
| `menuLabel` | Change the label for the menu, the default is 'Landmarks and Headings'. |
| `landmarkGroupLabel` | Change the menu group label for landmarks, the default is 'Landmarks'. |
| `headingGroupLabel` | Change the menu group label for headings, the default is  'Main Headings'.
| `msgNoLandmarksFound` | Change message for when no landmarks are found, the default is 'No landmarks to skip to'. |
| `msgNoHeadingsFound` | Change message for when no headings are found, the default is 'No landmarks to skip to'. |

### Colors used for Button and Menu styling

Color values must use [CSS color values](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value), for example `#8AF`, `rgb(40, 50, 90)`, `#a0bf32`, `blue`.

| Property       | Type   | Default | Description |
| :------------- | :----- | :------ | :---------- |
| `buttonColor` | Color | `#1a1a1a`  | Color of "Skip To COntent" button. |
| `buttonBackgroundColor` | Color | `#eeeeee` | d. |
| `buttonColorFocus` | Color | `#000000` | d. |
| `buttonFocusBackgroundColor` | Color | `#dcdcdc`  | d. |
| `buttonFocusBorderColor` | Color | `#1a1a1a`  | d. |
| `menuBackgroundColor` | Color | `#eeeeee` | d. |
| `menuBorderColor` | Color | `1a1a1a` | d. |
| `menuitemColor` | Color | `#1a1a1a`  | d. |
| `menuitemBackgroundColor` | Color | `#eeeeee`  | d. |
| `menuitemFocusColor` | Color | `#eeeeee`  | d. |
| `menuitemFocusBackgroundColor` | Color | `#1a1a1a`  | d. |
| `menuitemFocusBorderColor` | Color | `#1a1a1a`  | d. |

NOTE: Make sure colors meet the color contrast requirements of WCAG 2.1 for text

### Position of Button

| Property       | Type   | Default | Description |
| :------------- | :----- | :------ | :---------- |
| `positionLeft` | length | `46%`  | The position of the "Skip To Content" button from left margin. |

### Example Settings

If have different requirements for your web site and include other heading levels as well as ARIA landmarks, you will need to provide a JSON object containing the necessary configuration parameters. The following is a sample configuration:

```html
    <script>
        var SkipToConfig =  {
            'settings': {
                'skipTo': {
                    landmarks: 'main, [role="main"], [role="search"], nav',
                    headings: 'h1, h2, h3',
                    headingGroupLabel:  'Headings',
                    accessKey: 'S',
                    displayOption: 'popup',
                }
            }
        };
    </script>

```

### Notes
*  Most parameters are optional.
*  SkipTo can be attached to any element on the page (see the "attachElement" parameter). if no "attachElement" is found, the script will be attached as the first element after body.
*  When the custom class is specified (see the customClass parameter), the user can override the style, EG

```CSS
.skipTo.MyCustomClass {
	background:  red;
	left: 50px;
	top: 50px;
}
```

## Compiling CSS and JavaScript
You may feel slightly adventurous and decide to change some colors or even enhance the script with your changes. Once you do this, here is how you compile the skipTo script for production.

  ```sh
   git clone https://github.com/paypal/skipto.git
   cd skipto
   sudo npm install grunt-cli -g
   npm install
   grunt
  ```
4.  You should now have a directory called <code>**compiled**</code> with the necessary files in it.
5.  See instructions above on which files you need to get the SkipTo script running on your web site.

Note: On Windows, build-win.bat runs npm install and grunt modules (Step 3). To successfully run, you must launch a Windows command prompt as an Admin (Ctrl+Shift+Enter) and then run build-win.bat from this command prompt.

## Cleaning up
If you would like to revert your local code repository to its initial state, simply run
```sh
grunt clean
```
from the root directory of your repository.

## Of course, we want feedback!
Please do not hesitate to [raise issues and comment on Github](https://github.com/paypal/skipto/issues) if something doesn't work or you have ideas on how to improve the script.

Happy skipping!

PayPal Accessibility Team
[Twitter: @PayPalInclusive](http://www.twitter.com/PayPalInclusive)

## <a name="authors">Authors</a>
**Prem Nawaz Khan**
[https://github.com/mpnkhan](https://github.com/mpnkhan) || [@mpnkhan](https://twitter.com/mpnkhan)

**Victor Tsaran**
[https://github.com/vick08](https://github.com/vick08) || [@vick08](https://twitter.com/vick08)

**Ron Feathers**
[https://github.com/rfeathers](https://github.com/rfeathers) || [@ronfeathers](https://twitter.com/ronfeathers)

**Marc Kocher**
[https://github.com/mdkocher](https://github.com/mdkocher) || [@marckocher](https://twitter.com/marckocher)

**Jon Gunderson**
[https://github.com/jongund](https://github.com/jongund)

**Nicholas Hoyt**
[https://github.com/nhoyt](https://github.com/nhoyt)

## <a name="access-keys">Access keys</a>
Access keys work  just like regular shortcut keys except that they need a browser-specific modifier key in order to work. For example, to use the "SkipTo" access key, you would press the modifier key + the access key (0 in this particular case). here is a quick list for how this would work in most popular browsers.

*  Mozilla Firefox -- ALT+SHIFT+0.
*  Google Chrome -- CONTROL+ALT+0 (Windows) and CONTROL+OPTION+0 (Mac OS).
*  Safari -- CONTROL+0.

## Version History
### Version 3.0
* Removed id selector options, if ids are needed they could be added to the landmarks selector
* Removed need to call initialization function
* Removed support for Internet Explorer
* Improved code readability and ARIA support, by removing complexity needed to support Internet Explorer
* Improved configuration of button and menu labeling
* Add configuration of button and menu colors, without adding a stylesheet
* Update the landmarks and headings in the menu by querying the DOM every time the menu is opened
* Reduced markup conflicts by using a data attribute rather than an IDREF for targets
* Reduced changes in page markup by only applying tabindex=-1 when focus is moved to a target
* Updated the function for testing if an element is visible

### Version 2.1
* Ignore hidden landmarks and headings, based on:
  * CSS: display: none
  * CSS: visibility: hidden
  * HTML5 hidden attribute
  * ARIA 1.0 aria-hidden=true attribute
  * ARIA 1.0 role=presentation attribute
  * any element that is less than 4 pixels high or wide

### Version 2.0
* Support for HTML5 section elements
* Calculate accessible names for landmarks and headings
* Updated menu to separate headings from landmarks
* Created default for main content
  * main element
  * [role=Main]
* Created default for HTML5 sections
  * nav element
* Updated defaults for landmarks
  * [role=navigation]
  * [role=search]
* Updated defaults for headings
  * h1 element
  * h2 element



## Copyright and license

Copyright 2019, PayPal under the [BSD license](LICENSE.md).
