//Configurações do Karma para utilização no ambiente de desenvolvimento

module.exports = function(config) {
	config.set({

		// base path that will be used to resolve all patterns (eg. files, exclude)
		basePath: '',

		// frameworks to use
		// available frameworks: https://npmjs.org/browse/keyword/karma-adapter
		frameworks: ['jasmine'],

		// list of files / patterns to load in the browser
		files: [

		        'dev/global/lib/jquery.min.js',
		        'dev/global/lib/angular/angular.js',
		        'dev/global/lib/angular/angular-mocks.js',
		        'dev/global/lib/angular/angular-locale_pt-br.js',
		        'dev/global/lib/jquery-ui.js',
		        'dev/global/lib/angular/angular-spinner.js',
		        'dev/global/lib/Chart.js',
		        'dev/global/lib/angular/angular-chart.js',
		        'dev/global/lib/*.js',
		        'dev/global/lib/**/*.js',
		        'dev/js/app.js',
		        'dev/global/st-app/st-util/factory/stUtilFactory.js',
		        'dev/global/st-app/**/*.js',
		        'dev/js/controllers/**/*.js',
		        'dev/js/controllers/*.js',
		        'dev/value/config.js',
		        'dev/js/controllers/**/*.js',
		        'dev/global/st-app/**/*.html',
		        'spec/unit/rootScopeMock.js',
		        'spec/unit/rootScope.js',
		        'spec/unit/loginTest.js',
		        'spec/unit/**/*.js'
		        ],

		        // list of files to exclude
		        exclude: [
		                  ],

		                  // preprocess matching files before serving them to the browser
		                  // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
		                  preprocessors: {
		                	  '**/*.html': ['ng-html2js'],
		                  },

		                  ngHtml2JsPreprocessor: {
		                	  stripPrefix: 'dev/',
		                	  moduleName: 'karma.templates',

		                  },

		                  plugins: [
		                            'karma-jasmine',
		                            'karma-chrome-launcher',
		                            'karma-spec-reporter',
		                            'karma-ng-html2js-preprocessor',
		                            'karma-browserifast'
		                            ],

		                            // test results reporter to use
		                            // possible values: 'dots', 'progress'
		                            // available reporters: https://npmjs.org/browse/keyword/karma-reporter
		                            reporters: ['spec'],

		                            // web server port
		                            port: 9876,

		                            // enable / disable colors in the output (reporters and logs)
		                            colors: true,

		                            // level of logging
		                            // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
		                            logLevel: config.LOG_INFO,

		                            //
		                            // enable / disable watching file and executing tests whenever any file changes
		                            autoWatch: true,

		                            // start these browsers
		                            // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
		                            browsers: ['Chrome'],

		                            captureTimeout: 60000,

		                            // Continuous Integration mode
		                            // if true, Karma captures browsers, runs the tests and exits
		                            singleRun: false
	})
}
