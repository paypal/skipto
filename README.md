<<<<<<< HEAD
# SkipTo
======

SkipTo is a replacement for your old classic "Skipnav" (so please use it as such)!
This script will create a drop-down menu consisting of the most important places on a given web page. The menu will make it easier for keyboard and screen reader users to quickly jump to the desired location by simply choosing it from the list of options.
The SkipTo menu becomes visible the first time the user tabs into the page. It is also possible to reach the menu by pressing the global access key (0 by default).

## Wow, how do I get it on my web site?
If you are using Drupal or Wordpress, you are in great luck! We are providing plugins for both of these content management systems. Simply search the repository of plugins and install it just like you would install any other plugins.


## How to use
All you need is the js/skipNav.min.js and css/skipNav.css
If you like your code to be debugged in production, add the source map as well in your js directory js/skipNav.min.js.map
Include the JS in the bottom most part of your code, example footer. 
You can also Lazy load the JS and CSS files



## Compiling CSS and JavaScript

Code directory contains less and JS files that needs to be compiled.

SkipTo includes a [makefile](Makefile) with convenient methods for working with the framework.Please install the [dependencies](package.json):

For windows users, or for users who have not configured make, you have the convenience of running build.sh. But again after installing [dependencies](package.json): 

Also kindly note that build.sh wouldn't stop on JSHint errors whereas Makefile would. So make sure you correct the errors and re-run build.sh

```
$ npm install
```

#### make - `make` or `make build`

```
$ make
```
(Or)

```
$ ./build.sh
```

#### clean - `make clean`
Just cleans the JS and CSS directory

### Contributing
You are most welcome to raise pull requests. But make sure your CSS and JS compiles without any errors and you follow coding guidelines.
=======
SkipToMenu
==========
>>>>>>> 6667e07cc0dfb713a9284d8a7b5efbae5aad7239
