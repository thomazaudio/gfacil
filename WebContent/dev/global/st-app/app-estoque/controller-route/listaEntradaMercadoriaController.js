
"use strict";
(function(){
angular.module("adm").controller("listaEntradaMercadoriaController",function($filter,movUtil,$location,st,$uibModal,$rootScope,dateUtil,estoqueUtil,cacheGet,$stModal,$scope,stService, stUtil ,$route){

	$scope.buscarDados = function(){
		var qs = [];
		qs.push(dateUtil.getQueryOfPeriod("movimentacao.data",$scope.dataDe,$scope.dataAte));
		$scope.$parent.getLikeMap(qs,0,0,"","movimentacao.data","ASC");
	}
	
	
	$scope.openEntradaMercadoria = function(em){
		estoqueUtil.openEntradaMercadoria(em,function(){
			$route.reload();
		});
	}

	$scope.deletarEM = function(index,ems){

		var em = ems[index];
		stService.executePost("entradamercadoria/delete/",em).success(function(data){

			ems.splice(index,1);
			stUtil.showMessage("","Entrada de mercadoria excluida com sucesso","info");		

		}).error(function(){

			stUtil.showMessage("","Ocorreu um erro ao deletar entrada de mercadoria, verifique sua conexão com a internet e tente novamente","danger");		

		});

	}

});

})();



