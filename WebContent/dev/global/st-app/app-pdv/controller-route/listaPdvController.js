"use strict";
(function(){
angular.module("adm").controller("listaPdvController",function($scope,$rootScope,printUtil,estoqueUtil,stService,$location,$route,$filter,stUtil,movUtil,pdvUtil,$timeout){

	$scope.hoje = new Date();

	//Query padrão para o dia (Somente hoje)
	$scope.periodoAte = new Date();
	$scope.periodoDe = new Date();
	$scope.periodoDe = $filter("date")($scope.periodoDe,"dd/MM/yyyy");
	$scope.periodoAte = $filter("date")($scope.periodoAte,"dd/MM/yyyy");
	var dataDe = stUtil.formatData($scope.periodoDe);
	var dataAte = stUtil.formatData($scope.periodoAte);
	var query = "(data between '"+dataDe+"' and '"+dataAte+"')";
	$scope.querys =[];
	$scope.querys.push(query);

	$scope.$parent.setMaxIni(5);

	$scope.setPagina  = function(pagina){

		console.log("Chamou aqui");
	}

	$scope.goToPdv = function(pdv){

		console.log("PDV aqui: ");
		console.log(pdv);
		pdvUtil.openVendaInModal(pdv);

	}

	$scope.imprimirCupom = function(mov){

		printUtil.printMovs([mov]);

	}

	$scope.getTotal = function(){

		var pdvs = $scope.$parent.objetos;
		var total  =0;

		for(var i in pdvs){

			total+=pdvs[i].movimentacao.valor;
		}

		return total;

	}

	//Atualiza o status de retirada de um produto
	$scope.saveRetirada = function(pdv){

		stService.executeGet("/pdv/save-retirou",{idPdv:pdv.id,carregado:pdv.carregado}).success(function(){


		});

	}

	$scope.deletarVenda = function(pdv){

		pdvUtil.deletarVenda(pdv,function(data){


		});


		$timeout(function(){

			$route.reload();

		},300);

	}

	$scope.changePeriodo = function(){

		$scope.periodoDe = $filter("date")($scope.periodoDe,"dd/MM/yyyy");
		$scope.periodoAte = $filter("date")($scope.periodoAte,"dd/MM/yyyy");

		var dataDe = stUtil.formatData($scope.periodoDe);
		var dataAte = stUtil.formatData($scope.periodoAte);

		var query = "(data between '"+dataDe+"' and '"+dataAte+"')";

		$scope.querys =[];
		$scope.querys.push(query);

	}

});

})();