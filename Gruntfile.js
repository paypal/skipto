// jshint node: true, strict: false

module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
			'<%= grunt.template.today("yyyy-mm-dd") %>\n' +
			'<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
			'* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author %>;' +
			' Licensed <%= _.map(pkg.licenses, "type").join(", ") %> */\n' ,

		bannerCond:
			'/*@cc_on @*/\n' +
			'/*@if (@_jscript_version >= 5.8) @*/\n',

		footer: '/*@end @*/\n',

		greaseBanner:
			'// -----------------------------------------------------' + '\n' +
			'// Title: Skip to Options User script' + '\n' +
			'// version: <%= pkg.version %>' + '\n' +
			'// Date: <%=grunt.template.today("yyyy-mm-dd")%>' + '\n' +
			'// Author: <%= pkg.author %>' + '\n' +
			'// Homepage: <%= pkg.homepage %>' + '\n' +
			'// Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author %>' + '\n' +
			'// -----------------------------------------------------' + '\n' +
			'//' + '\n' +
			'// ==UserScript==' + '\n' +
			'// @name <%=pkg.name %>' + '\n' +
			'// @namespace <%=pkg.name %>' + '\n' +
			'// @description <%=pkg.description%>' + '\n' +
			'// @include *' + '\n' +
			'// ==/UserScript==' + '\n' + '\n',
		jshint: {
			files: [
				'**/*.js',
				'!**/*.min.js',
				'!compiled/**',
				'!node_modules/**'
			],
			options: {
				jshintrc: "./src/js/.jshintrc"
			}
		},

		concat: {
			core: {
				options: {
					separator: ';',
					banner: '<%= banner %> <%= bannerCond %>',
					footer: '<%= footer %>'
				},
				src:   ['src/js/<%= pkg.name %>.js'],
				dest:  './compiled/js/<%= pkg.name %>.js'
			},
			gm: {
				options: {
					banner: '<%= greaseBanner %>'
				},
				src:   './compiled/js/<%= pkg.name %>.min.js',
				dest:  './compiled/js/<%= pkg.name %>.user.js'
			}
		},
		uglify: {
			options: {
				sourceMap: './compiled/js/<%= pkg.name %>.min.map',
				banner: '<%= banner %> <%= bannerCond %>',
				footer: '<%= footer %>',
				mangle: false,
				sourceMappingURL: 'http://paypal.github.io/SkipTo/downloads/js/<%= pkg.name %>.min.map'
				//	  , beautify: true
			},
			dist: {
				files: {
					'./compiled/js/<%= pkg.name %>.min.js': ['src/js/<%= pkg.name %>.js']
				}
			}
		},

		cssmin: {
			target:{
				files: {
					'src/css/SkipTo.css': ['src/css/SkipTo.template.css']
				}
			}
		},

		replace: {
			dist: {
				options: {
					variables: {
						'cssContent': '<%= grunt.file.read("src/css/SkipTo.css") %>'
					}
				},
				files: [{
						expand: true,
						flatten: true,
						src: ['./compiled/js/<%= pkg.name %>.js', './compiled/js/<%= pkg.name %>.min.js'],
						dest: './compiled/js/'
					}
				]
			}
		},
		copy: {
			main: {
				files: [{
						expand: true,
						flatten: true,
						src: ['./compiled/js/<%= pkg.name %>.min.js'],
						dest: './src/WordPress/skipTo/js'
					}, {
						expand: true,
						flatten: true,
						src: ['./compiled/js/<%= pkg.name %>.min.js'],
						dest: './src/Drupal/skipTo/js'
					}

				]
			}

		},
		compress: {
			WordPress: {
				options: {
					mode: 'zip',
					archive: './compiled/WordPress/<%= pkg.name %>.zip'
				},
				files: [{
						expand: true,
						cwd: './src/WordPress/',
						src: ['**'],
						dest: '.',
						filter: 'isFile'
					}
				]
			},
			Drupal: {
				options: {
					mode: 'tar',
					archive: './compiled/Drupal/<%= pkg.name %>.tar'
				},
				files: [{
						expand: true,
						cwd: './src/Drupal/',
						src: ['**'],
						dest: '.',
						filter: 'isFile'
					}
				]
			}
		},
		clean: {
			compiled: {
				src: ["compiled/*", "./src/WordPress/skipTo/js/<%= pkg.name %>.min.js", "./src/Drupal/skipTo/js/<%= pkg.name %>.min.js"]
			}
		}

	});

	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-replace');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-compress');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-cssmin');

	grunt.registerTask('test', ['jshint']);
	grunt.registerTask('wordpress', ['compress:WordPress']);
	grunt.registerTask('drupal', ['compress:Drupal']);
	grunt.registerTask('gm', 'concat:gm');
	grunt.registerTask('default', ['jshint', 'concat:core', 'uglify', 'cssmin', 'replace', 'copy','concat:gm']);
	grunt.registerTask('all', ['jshint', 'concat:core', 'uglify', 'replace', 'copy', 'compress', 'concat:gm']);
};
