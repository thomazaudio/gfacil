
const VisualReview = require('visualreview-protractor');
var vr = new VisualReview ({
	hostname: 'localhost',
	port: 7000
});

var HtmlScreenshotReporter = require("protractor-jasmine2-screenshot-reporter");

exports.config = {

		onPrepare: function(){

			browser.driver.manage().window().maximize();
			var loginTest = require("./spec/end2end/login/loginPage");


			describe('Login no sistema',function(){

				loginTest.logar();

				browser.waitForAngular();
				it('',function(){
					//expect(browser.getTitle()).toBe("In�cio");

				});
			})
			return null;




		},


		beforeLaunch: function () {
			vr.initRun('Gest�o F�cil - VisualReview', 'visualReviewSuite');
		},


		afterLaunch: function (exitCode) {
			return vr.cleanup(exitCode);
		},


		params: {
			visualreview: vr
		},

		framework: 'jasmine2',

		jasmineNodeOpts: {
			defaultTimeoutInterval:100000

		},



		capabilities: {

			'browserName': 'chrome',
			'chromeOptions': {
				'args': ['--disable-web-security']
			},
			'phantomjs.binary.path': require('phantomjs').path,
			'phantomjs.ghostdriver.cli.args': ['--loglevel=DEBUG']
		},



		baseUrl: 'http://localhost:8080/Albar/dev/index.html#/',



		suites :{

			//all: 'spec/end2end/**/*.js',
			//login: 'spec/end2end/login/**/*.js',
			pdv: 'spec/end2end/app-pdv/**/*.js',
			//estoque:'spec/end2end/estoque/**/*.js',
			estoque:'spec/end2end/estoque/**/*.js',
			visualreview:'spec/end2end/visualreview/**/*.js',
			//movimentacao:'spec/end2end/movimentacao/**/*.js',
			fluxoprincipal:'spec/end2end/fluxoPrincipal/fluxoPrincipalTest.js',
			//relatorios:'spec/end2end/app-relatorio/**/*.js',
			//teste:'spec/end2end/teste.js'
		},

		

};
