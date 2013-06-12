module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
			'<%= grunt.template.today("yyyy-mm-dd") %>\n' +
			'<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
			'* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
			' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',
		jshint: {
			files: ['src/js/<%= pkg.name %>.js', 'src/js/dropMenu.js'],
			options: {
				jshintrc: "./src/js/.jshintrc"
			}
		},

		less: {
			compress: {
				options: {
					paths: ['src/less'],
					compress: true,
					yuicompress: true
				},
				files: {
					'src/css/<%= pkg.name %>.css': ['src/less/<%= pkg.name %>.less']
				}
			}
		},
		concat: {
			options: {
				separator: ';'
			},			
			dist: {
				files: {
					'./compiled/js/<%= pkg.name %>.js': ['src/js/<%= pkg.name %>.js', 'src/js/dropMenu.js']
				}
			}
		},
		uglify: {
			options: {
				sourceMap: './compiled/js/<%= pkg.name %>.min.map',
				banner: '<%= banner %>',
				mangle: false
				//	  , beautify: true
			},
			dist: {
				files: {
					'./compiled/js/<%= pkg.name %>.min.js': ['src/js/<%= pkg.name %>.js', 'src/js/dropMenu.js']
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
						src: ['./compiled/js/<%= pkg.name %>.js'],
						dest: './compiled/js/'
					},
					{
						expand: true,
						flatten: true,
						src: ['./compiled/js/<%= pkg.name %>.min.js'],
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
						src: ['./compiled/js/<%= pkg.name %>.js'],
						dest: './src/WordPress/skipTo/js'
					}, {
						expand: true,
						flatten: true,
						src: ['./compiled/js/<%= pkg.name %>.js'],
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
					//{expand: true, cwd: './src/WordPress/', src: ['**'], dest: 'compiled/WordPress/'}
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
				src: ["compiled/*", "./src/WordPress/skipTo/js/<%= pkg.name %>.js", "./src/Drupal/skipTo/js/<%= pkg.name %>.js"]
			}
		}

	});

	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-replace');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-compress');
	grunt.loadNpmTasks('grunt-contrib-clean');

	grunt.registerTask('test', ['jshint']);
	grunt.registerTask('wordpress', ['compress:WordPress']);
	grunt.registerTask('drupal', ['compress:Drupal']);
	grunt.registerTask('default', ['jshint', 'less', 'concat', 'uglify', 'replace', 'copy']);
	grunt.registerTask('all', ['jshint', 'less', 'concat', 'uglify', 'replace', 'copy', 'compress']);

};