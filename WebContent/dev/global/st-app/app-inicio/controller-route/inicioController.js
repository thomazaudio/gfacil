angular.module("adm").controller("inicioController",function($scope,dateUtil, stService,$route,movUtil, pdvUtil, estoqueUtil){
	
	var hoje = new Date();
	
	$scope.atualizar = function(){
		
		$route.reload();
	}
	
	$scope.atualizarEstoque = function(){
		
		estoqueUtil.openEntradaMercadoria();
	}
	
	$scope.novaVenda = function(){

		pdvUtil.openVendaInModal();
	}

	$scope.setSaldoGeral = function(){
    	
		$scope.carregandoSaldo =true;
		var hoje = new Date();
    	movUtil.getBalanco(hoje,hoje,function(receitas,despesas){
    		$scope.carregandoSaldo= false;
    		$scope.receitas = receitas;
    		$scope.despesas = despesas;
    		
    	});
		
    }
	
    $scope.setSaldoGeral();
	
});