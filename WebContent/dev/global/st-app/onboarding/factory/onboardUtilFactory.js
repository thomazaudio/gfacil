"use strict";
(function(){

	angular.module("adm")

	.factory("onboardUtil",function($uibModal, $rootScope){

		var _openOnboardIntro = function(){
			
			var confs = $rootScope.config.confs;
			
			if(confs.visualizouOnboardIntro!='true'){
			
				$uibModal.open({
					animation: true,
					templateUrl:"global/st-app/onboarding/template-module/onboardIntro.html",
					size:'lg',
					controllerAs:"vm",
					bindToController:"true",
					controller:"onboardIntroController"
					
				});
		}

		};

	
		return {

			openOnboardIntro:_openOnboardIntro
		};

	})

})();