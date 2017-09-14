module.exports = function (grunt) {


	grunt.loadNpmTasks('grunt-contrib-jshint');

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		clean: ["dist", '.tmp'],

		copy: {
			main: {
				expand: true,
				cwd: 'dev/',
				src: ['**', '!js/**', '!lib/**','!**/*.css','!**/*.png'],
				dest: 'dist/'
			},
			shims: {
				expand: true,
				cwd: 'dev/global/font-awesome-4.7.0/fonts/',
				src: ['**'],
				dest: 'dist/fonts'
			}


		},


		jshint: {
			files: ['gruntfile.js','dev/**/*.js'],
			options: {
				globals: {
					jQuery: true,
					console: true,
					module: true
				}
			}
		},



		rev: {
			files: {
				src: ['dist/**/*.{js,css}', '!dev/global/font-awesome-4.7.0/fonts/**']
			}
		},

		useminPrepare: {
			html: 'dev/index.html'
		},

		usemin: {
			html: ['dist/index.html']
		},

		uglify: {
			options: {
				report: 'min',
				mangle: false
			}
		},



		karma: {
			unit: {
				configFile: 'karma.conf.js'
			}
		}
		,

		protractor: {

			options: {
				keepAlive: true,
				configFile: "prot.js",
				suite:"fluxoprincipal",

			},
			singlerun: {}

		}




	});

	grunt.loadNpmTasks('grunt-protractor-runner');
	grunt.loadNpmTasks('grunt-karma');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-rev'); //Adiciona números aleatórios aos nomes dos arquivos minificados (Util para lógicas de cache)
	grunt.loadNpmTasks('grunt-usemin');

	// Tell Grunt what to do when we type "grunt" into the terminal

	grunt.registerTask('war', [
	                           'war'
	                           ]);
	grunt.registerTask('default', [
	                               'karma',
	                               'copy',
	                               'useminPrepare',
	                               'concat',
	                               'uglify',
	                               'cssmin',
	                               //'rev', //Adiciona números aleatórios aos nomes dos arquivos minificados (Util para lógicas de cache)
	                               'usemin'
	                               ]);

	grunt.registerTask('end2end', ['protractor']);
};