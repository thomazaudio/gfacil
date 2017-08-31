angular.module("adm").controller("inicioController",function($scope,dateUtil, stService,$route,movUtil, pdvUtil, estoqueUtil){
	
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