---
layout: index
---


# SkipTo, version 2.0
## by PayPal Accessibility Team 
see the [Authors](#authors) section for more information.

SkipTo is a replacement for your old classic "Skipnav" link, (so please use it as such)!
The SkipTo script creates a drop-down menu consisting of the links to the important places on a given web page. The menu will make it easier for keyboard and screen reader users to quickly jump to the desired location by simply choosing it from the list of options.

![Example Screen Shot](http://paypal.github.io/SkipTo/images/example_screen_shot.png "Example Screen Shot")

## How it works
1.  The SkipTo menu becomes visible the first time the user tabs into the page.
2.  Once the keyboard focus is on the menu, pressing the ENTER key will pull down the list of high-level headings and landmarks on the current page.
3.  Use arrow keys to select your choice and press ENTER to skip to it.
4.  If you decide to reach the menu again, simply press the built-in access key (0 by default). See the notes on [Access keys](#access-keys) for More information on how to use them.

## How do I get it on my web site?
If you are using Drupal or Wordpress, you are in great luck. We are providing plugins for both of these content management systems below. The SkipTo can also be downloaded from the [Drupal](https://drupal.org/project/SkipTo) and [Wordpress](http://wordpress.org/plugins/skip-to/) repositories.
To sweeten your day even more, the GreaseMonkey script and Safari bookmarklet are also available. See the "downloads" section below for related links.
By the way, this page is a great chance to see the "SkipTo menu" in action! Did you find the menu at the top?

## What about plain JavaScript?
All you need are either SkipTo.js or SkipTo.min.js from the "compiled/js" directory. Please note that SkipTo.min.js is a minified (a lighter version) of the script.
If you would like to be able to debug your production-ready script, include the provided SkipTo.min.map file as well.

To use the SkipTo script, just include it at the bottom of your HTML page or template, as follows:

```html
<script type="text/javascript" src="http://paypal.github.io/SkipTo/downloads/js/SkipTo.min.js"></script>
```

Note that by default the path is set to load the script from the Github external source. If this is not what you want, please make sure that "src" points to the place where you put the Javascript file, otherwise, things will not work as intended.

## Configuring SkipTo options
By default, SkipTo menu will inlcude the following places on the page:

*  Heading (level 1, 2, 3 and 4).
*  ARIA landmarks (banner, navigation, main and search).
*  Any element with the id specified via the configuration file.
*  Any element with the custom class specified via the configuration file.

and options:

*  The "access key" is set to 0.
*  The menu is set not to wrap.
*  The menu is visible on keyboard focus only (can be changed to be always visible via the "onload" parameter).

You may have different requirements for your web site and include other heading levels as well as ARIA landmarks.
If you are using either WordPress plugin or Drupal module, you can change the SkipTo options under the "settings" section of your particular content management system. If, however, you are utilizing the plain vanilla Javascript, you will need to provide a JSON object containing the necessary configuration parameters. This may look like the following:

```html
<script>
var skipToConfig =
{
	"settings": {
	"skipTo": {
	"headings": "h1, h2, h3, h4",
	"landmarks": "[role=banner], [role=navigation], [role=main], [role=search]",
	"ids": "#SkipToA1, #SkipToA2",
	"customClass": "MyClass",
	"accesskey": "0",
	"wrap": "true",
	"visibility": "onfocus",
	"attachElement": ".MyCustomClass" // or "attachElement": "#MyCustomId"
		}
	}
};

</script>
```

The code above  will need  to be inserted before including the SkipTo.js or SkipTo.min.js into your page or template.

### Notes
*  Most parameters are optional.
*  SkipTo can be attached to any element on the page (see the "attachElement" parameter). if no "attachElement" is found, the script will be attached as the first element after body.
*  When the custom class is specified (see the customClass parameter), the user can override the style, EG

```CSS
.dropMenu .MyCustomClass {
	background:  red;
	left: 50px;
	top: 50px;
}
```

## Compiling CSS and JavaScript
You may feel slightly adventurous and decide to change some colors or even enhance the script with your changes. Once you do this, here is how you compile the skipTo script for production.

1.  [Get NodeJS from http://nodejs.org](http://nodejs.org) and install it on the operating system of your choice.
2.  Get the [latest code from Github from http://github.com/paypal/SkipTo](http://github.com/paypal/SkipTo).
3.  After unzipping or downloading the source code into the directory of your choice, switch to that directory and type these commands:

  ```sh
   sudo npm install grunt-cli -g
   npm install  
   grunt
  ```
4.  You should now have a directory called <code>**compiled**</code> with the necessary files in it.
5.  See instructions above on which files you need to get the SkipTo script running on your web site.

## Cleaning up
If you would like to revert your local code repository to its initial state, simply run 
```sh
grunt clean
```
from the root directory of your repository.
## Of course, we want feedback!
Please do not hesitate to raise issues and comment on Github if something doesn't work or you have ideas on how to improve the script.

Happy skipping!

PayPal Accessibility Gang
(http://www.twitter.com/PayPalInclusive)

## <a name="authors"></a>Authors
**Nawaz Khan**
[https://github.com/mpnkhan](https://github.com/mpnkhan) || [@mpnkhan](https://twitter.com/mpnkhan)

**Victor Tsaran**
[https://github.com/vick08](https://github.com/vick08) || [@vick08](https://twitter.com/vick08)

**Ron Feathers**
[https://github.com/rfeathers](https://github.com/rfeathers) || [@ronfeathers](https://twitter.com/ronfeathers)

**Marc Kocher**
[https://github.com/mdkocher](https://github.com/mdkocher) || [@marckocher](https://twitter.com/marckocher)

**The rest of the PayPal Accessibility Team.**

## <a name="access-keys"></a>Access keys
Access keys work  just like regular shortcut keys except that they need a browser-specific modifier key in order to work. For example, to use the "SkipTo" access key, you would press the modifier key + the access key (0 in this particular case). here is a quick list for how this would work in most popular browsers.

*  Microsoft Internet Explorer -- ALT+0.
*  Mozilla Firefox -- ALT+SHIFT+0.
*  Google Chrome -- CONTROL+ALT+0 (Windows) and CONTROL+OPTION+0 (Mac OS).
*  Safari -- CONTROL+0.
