<?php
/**
 * @file
 * A module that provides a menu of headings and ARIA landmarks on a page (configurable).
 */

/**
 * Implements hook_help.
 *
 * Displays help and module information.
 *
 * @param path 
 *   Which path of the site we're using to display help
 * @param arg 
 *   Array that holds the current path as returned from arg() function
 */
function skipTo_help($path, $arg) {
	switch ($path) {
		case "admin/help#skipTo":
			return '<p>' . t("Augments a 'Skip To Main' experience by presenting a menu with links to specified headings and landmarks on the current page") . '</p>';
		break;
	}
}