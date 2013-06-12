# SkipTo

SkipTo is a replacement for your old classic "Skipnav" link, (so please use it as such)!
The SkipTo script creates a drop-down menu consisting of the most important places on a given web page. The menu will make it easier for keyboard and screen reader users to quickly jump to the desired location by simply choosing it from the list of options.

## How it works
1.  The SkipTo menu becomes visible the first time the user tabs into the page.
2.  Once the keyboard focus is on the menu, pressing the ENTER key will pull down the list of high-level headings and landmarks on the current page.
3.  Use arrow keys to select your choice and press ENTER to skip to it.
4.  If you decide to reach the menu again, simply press the built-in access key (0 by default).

## Wow, how do I get it on my web site?
If you are using Drupal or Wordpress, you are in great luck! We are providing plugins for both of these content management systems. Simply search the repository of plugins and install it just like you would install any other plugins.

## What about plain Javascript?
All you need are either skipTo.js or skip.min.js from the "compiled/js" directory. Please note that skipTo.min.js is a minified (a lighter version) of the script.
If you would like to be able to debug your production-ready script, include the provided skipTo.min.map file as well.

To use the skipTo script, just include it at the bottom of your HTML page or template, as follows:

`<script type="text/javascript" src="skipTo.js"></script>`

## Compiling CSS and JavaScript
You may feel slightly adventurous and decide to change some colors or even enhance the script with your changes. Once you do this, here is how you compile the skipTo script for production.

1.  [Get NodeJS from http://nodejs.org](http://nodejs.org) and install it on the operating system of your choice.
2.  Get the [latest code from Github from http://github.com/paypal/SkipTo](http://github.com/paypal/SkipTo).
3.  After unzipping or downloading the source code into the directory of your choice, switch to that directory and type these commands:

	npm install  
	grunt

4.  If everything went well, you should have a new directory called "compiled" with the necessary files in it.
5.  See instructions above on which files you need to get the SkipTo script running on your web site.

## Cleaning up
If you would like to revert your local code repository to its initial state, simply run 

	grunt clean

 from the root directory of your repository.

## Of course, we want feedback!
Please do not hesitate to raise issues and comment on Github if something doesn't work or you have ideas on how to improve the script.

Happy skipping!

PayPal Accessibility Gang
(http://www.twitter.com/PayPalInclusive)
