"use strict";
(function(){
angular.module("adm").controller("listaProdutoController",function(estoqueUtil,$rootScope,stUtil,$scope,$location,$stModal,stService,$route,$stDetalhe){

	var atalhoBuscaProduto = "";
	if($rootScope.config)
		atalhoBuscaProduto = $rootScope.config.confs.atalhoBuscaProduto ||'nome';
	
	else
		atalhoBuscaProduto="nome";
	
	var placeHolder = 'Digite o nome do produto';

	if(atalhoBuscaProduto=='codigoBarras'){

		placeHolder = 'Digite o código de barras  do produto';
	}

	$scope.addEntradaMercadoria = function(){
		estoqueUtil.openEntradaMercadoria();
	}
	
	$scope.verPrecosCompra = function(produto){
		
		estoqueUtil.openPrecosCompraProduto(produto);
	}

	$scope.buscaEspecial = {

			attr:atalhoBuscaProduto,
			tipo:'input',placeHolder:placeHolder,
			icon:'fa-list'	
	}

	$scope.deletarProduto = function(produto){

		produto.disable = 1;
		stService.save("produto",produto).success(function(data){

		    $route.reload();
			stUtil.showMessage("","Produto Deletado com sucesso!","info");		

		});

	}

	$scope.cadProdutoStep = function(){

		estoqueUtil.cadProdutoStep(function(produto){


		});
	}	

	$scope.openAdd = function(opcao,produto){

		estoqueUtil.openAdd(opcao,produto,function(){


		});

	}

	$scope.openDetalhe = function(produto){
        
		estoqueUtil.openProdutoInModal(produto,function(res){

			$route.reload();

		});

	}

	$scope.getTotalItens = function(){

		//Recupera o estoque de todos os itens
		estoqueUtil.getEstoqueProduto(null,function(total){

			$scope.totalItensEstoque = total;
		});
	}

	$scope.getTotalItens();

});

})();