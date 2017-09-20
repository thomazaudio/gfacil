"use strict";
(function(){

	angular.module("adm") 

	//Diretiva auxiliar utilizada em appSimplePedido
	.directive('appListSimplePedido', function (pedidoUtil,dateUtil,stService,stUtil,cacheGet,estoqueUtil) {
		return {
			restrict: 'E',
			templateUrl:"global/st-app/app-pedido/template-module/appListSimplePedido.html",
			scope:{
				itens:"=",
				labelQuantidade:"=",
				labelValorUnitario:"=",
				addPedido:"=",
				deletarPedido:"=",
				fator:"=",
				hideValorUnitario:"=",
				busca:"="
			},
			bindToController:true,
			controllerAs:"vm",
			controller:function(){

				var vm = this;
				//Carrega o estoque de um produto
				vm.carregaEstoqueProduto = function(produto){

					estoqueUtil.getEstoqueProduto(produto,function(prod){

						produto = prod;

					});
				}
				
				
			vm.openDetalhePedido = function(pedido){
					
					pedidoUtil.openDetalhePedido(pedido, function(res){
						
						vm.addPedido(res);
					
					});
				}

			vm.editarProduto = function(produto){

					var prodToEdit = angular.copy(produto);

					estoqueUtil.openProdutoInModal(prodToEdit,function(prod){

						//Indice do pedido ao qual o produto editado pertence	
						var index = stUtil.buscaOb(vm.itens,prod.id,"produto.id");

						//Atualização do produto editado
						if(prod)
							vm.itens[index].produto = prod;

					});

				}
			}
		}
	})

	//Diretiva para pedidos Simples(Esta forma utilizado produtos armazenados em cache)
	.directive('appSimplePedido', function (pedidoUtil,dateUtil,stService,stUtil,cacheGet,configUtil,$rootScope,st,$uibModal,estoqueUtil) {
		return {
			restrict: 'E',
			templateUrl:"global/st-app/app-pedido/template-module/appSimplePedido.html",
			require:'pedidos',
			scope:{

				labelValorUnitario:"=",//Label para exibição em preço unitário do produto
				labelQuantidade:"=",//label para quantidade de um pedido
				pedidos:"=",
				hideValorUnitario:"=",
				totalPedidos:"=",
				modoAtEstoque:"=",//1=somar, 2=subtrair
				attrBuscaProduto:"=",//atributo de produto utilizado para buscas padrão = nome

			},
			bindToController:true,
			controllerAs:"vm",
			controller:"appSimplePedidoController"
		}
	})
	
	.directive("itensPedido", function(){

		return{

			scope:{

				pedidos:"=",
				hideButtonTodos:"=",
				max:"@"
			},
			templateUrl:"global/st-app/app-pedido/template-module/itensPedido.html",
			controller:function($scope,$uibModal){

				//Abre os detalhes dos pedidos
				$scope.openDetalhe = function(pedidos){

					$uibModal.open({
						animation: true,
						templateUrl:"global/st-app/app-pedido/template-module/modalDetalhePedidos.html",
						size:'lg',
						controller:function($scope){

							$scope.pedidos = pedidos;
						}
					});	

				}
			}

		}
	})


})();
