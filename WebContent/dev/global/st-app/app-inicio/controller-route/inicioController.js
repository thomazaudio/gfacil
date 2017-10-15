angular.module("adm").controller("inicioController",function($scope,dateUtil, stService,$route,movUtil, pdvUtil, estoqueUtil){


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
	                        	  position: "right",
	                        	  description: "Para efetuar uma venda é só clicar neste botão",
	                        	  attachTo: "#menu-novavenda",
	                        	  position: "bottom",
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