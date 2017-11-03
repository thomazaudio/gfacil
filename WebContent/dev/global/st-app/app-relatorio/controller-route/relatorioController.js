"use strict";
(function(){
angular.module("adm").controller("relatorioController",function($scope,$rootScope,$route,$window,stService,movimentacaoService,$filter,movUtil, stUtil,dateUtil, leadUtil){

	$scope.imprimirRelatorio = function(){
		leadUtil.addIncMetric("impressoes_relatorio",1);
		$window.print();
	}
	
	$scope.dataHoje = new Date();

    //Relatórios fixos
	$scope.relatorioGastosCategoria = {
			qs: ["tipo='1'","disable=0","baixada=1","valor>0"],
			periodColumn:"dataBaixa",
			labelColumn:"categoria",
			valueColumn:"sum(valor)",
			objeto:"Movimentacao",
			
	}

	$scope.atualizarDados = function(){
		
		leadUtil.addIncMetric("visualizacoes_relatorio",1);

		if(!$scope.dataDe && !$scope.dataAte){
			stUtil.showMessage("","Defina um período para geração do relatório.","danger");
			return;
		}

		if(!$scope.dataDe){
			stUtil.showMessage("","Escolha  a data inicial.","danger");
			return;
		}

		if(!$scope.dataAte){
			stUtil.showMessage("","Escolha  a data final.","danger");
			return;
		}

		$scope.escolheuPeriodo = true;
		$rootScope.$broadcast("changePeriod");

	}

	if($scope.dataDe && $scope.dataAte)
		$scope.atualizarDados();

});

})();
