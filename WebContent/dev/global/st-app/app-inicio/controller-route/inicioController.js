angular.module("adm").controller("inicioController",function($scope,dateUtil, stService,$route,movUtil, pdvUtil, estoqueUtil, onboardUtil){

	//onboardUtil.openOnboardIntro();
	
	
	$scope.myCallbackFunction = function(){
		
		console.log("chamou");
		
		$("#button-menu-mobile").click();
		
	}
	
	$scope.onboardingSteps = [
	                          {
	                        	  title: "Olá!",
	                        	  position: "centered",
	                        	  description: "Seja bem vindo ao CeasaPlus!!",
	                        	  width: 300,
	                        	  nextButtonText:"Iniciar"
	                          },
	                          {
	                        	  title: "Account Setup",
	                        	  position: "left",
	                        	  description: "Este é o menu",
	                        	  attachTo: "#button-menu-mobile",
	                        	 
	                        	  nextButtonText:"Proximo",
	                        	  overlayOpacity: 0.2
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




});