"use strict";
(function(){

	angular.module("adm")

	.factory("onboardUtil",function($uibModal){

		var _openOnboardIntro = function(){
			
			$uibModal.open({
				animation: true,
				templateUrl:"global/st-app/onboarding/template-module/onboardIntro.html",
				size:'lg',
				controllerAs:"vm",
				bindToController:"true",
				controller:"onboardIntroController"
				
			});

		};

	
		return {

			openOnboardIntro:_openOnboardIntro
		};

	})

})();