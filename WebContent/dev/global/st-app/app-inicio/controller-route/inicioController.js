
"use strict";
(function(){
angular.module("adm").controller("inicioController",function($scope, $rootScope, dateUtil, stService, $route, movUtil, pdvUtil, estoqueUtil, onboardUtil, deviceDetector, $timeout, menuUtil, configUtil, leadUtil){


	$scope.showOnboardMenu = $rootScope.config.confs.visualizouOnboardingMenu!='true' && deviceDetector.isMobile()==true;



	$scope.finalizarOnboardingMenu = function(){

		configUtil.setConfig("visualizouOnboardingMenu","true", function(){

			leadUtil.addSubsMetric("onboard_menu", 1);
			onboardUtil.openOnboardIntro();

		})

	}




	$scope.stepsMenu = [


{

	title: "Seja bem vindo ao CeasaPlus!",
	position: "bottom",
	description: "Este é o menu com todas as opções do sistema.",
	attachTo: "#button-menu-mobile",
	arrowClass:"onboarding-button-menu-arrow",
	nextButtonText:"OK",
	overlayOpacity: 0,
	xOffset:45,
	yOffset:30

},

{

	title: "Entrada de mercadoria",
	position: "top",
	description: "Para lançar a entrada de mercadoria do dia é só clicar aqui.",
	attachTo: "#atalho-entrada-mercadoria",
	showPreviousButton:false,
	nextButtonText:"OK",
	overlayOpacity: 0,
	xOffset:-120,
	yOffset:10


},

{

	title: "Lançar venda",
	position: "top",
	description: "Para efetuar uma nova venda é só clicar aqui.",
	attachTo: "#atalho-nova-venda",
	showPreviousButton:false,
	doneButtonText:"OK",
	overlayOpacity: 0,
	xOffset:-120,
	yOffset:10

}



];




	$scope.hoje = new Date();

	$scope.atualizar = function(){

		$route.reload();
	}

	$scope.atualizarEstoque = function(){

		estoqueUtil.openEntradaMercadoria();
	}

	$scope.novaVenda = function(){

		pdvUtil.openVendaInModal();
	}

})

})();