"use strict";
(function(){

	angular.module("adm")

	//Diretiva input group do estoque
	.directive('buttonEstoque', function (movUtil,stUtil,stService,$filter,$uibModal,estoqueUtil) {
		return {
			restrict: 'E',
			templateUrl:'global/st-app/app-estoque/template-module/buttonEstoque.html',
			scope:{

				produto:"=",
				classLabel:"=",
				autoLoad:"=",//carregamento automatico da quantidade, padrão = true

			},
			controller:function($scope){

				//Carrega o estoque de um produto
				$scope.carregaEstoqueProduto = function(produto){

					if(!produto.id)
						return;

					$scope.carregandoEstoque = true;

					estoqueUtil.getEstoqueProduto(produto,function(prod){

						produto = prod;
						$scope.carregandoEstoque = false;

					});
				}

				$scope.editQuantidade = function(produto){

					estoqueUtil.openEdit(produto,function(){

					});

				}

				if($scope.autoLoad!=false){
					$scope.carregaEstoqueProduto($scope.produto);
				}
				else{
					delete $scope.produto.quantidade;
				}

			}
		}
	})

	.directive("listEstoqueMin",function(estoqueUtil){

		return{
			restrict:"E",
			templateUrl:"global/st-app/app-estoque/template-module/listEstoqueMin.html",
			controller:function($scope,$timeout,stService,$uibModal, $location,$stDetalhe, $route){

				estoqueUtil.getProdutosEstoqueMin(function(itens){
					$scope.itens = itens;
				});	

				$scope.toProduct = function(idProduto,modal){


					stService.getById("produto",idProduto).success(function(data){

						$stDetalhe.open("view/produto/addAndUpdateProduto.html",data.item,$scope,function(res){

							$route.reload();

						}); 

					});		
				}

			}

		}
	});

})();
