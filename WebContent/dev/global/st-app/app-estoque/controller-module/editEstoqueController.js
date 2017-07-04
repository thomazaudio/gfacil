"use strict";
(function(){

	angular.module("adm")

	.controller("editEstoqueController",function(produto, estoqueUtil, cacheGet, stUtil, stService, $modalInstance){

		var vm = this;
		
		vm.produto = produto;

		vm.fechar = function(modal){

			modal.$dismiss("");

		}
		
		vm.novaEntradaMercadoria = function(){
			
			$modalInstance.close();
			estoqueUtil.openEntradaMercadoria();
		}

		vm.confirmar = function(){

			var produto  = vm.produto;
			var novaQuantidade = vm.novaQuantidade;
			
			estoqueUtil.getEstoqueProduto(produto, function(produtoRes){

				novaQuantidade = parseFloat(novaQuantidade);
				var tipoEntrada;
				var quantidade  = novaQuantidade - produtoRes.quantidade;
				var movEstoque = {};

				//TODO Lança Pedido  de correção de estoque
				var pedido = {

						tipoEntrada:1,
						produto:{id:produto.id},
						quantidade:quantidade,
						tipoOperacao:"Correção manual de estoque"
				}

				stService.save("pedido",pedido).success(function(){

					stUtil.showMessage("","Estoque atualizado com sucesso!","info");

					$modalInstance.close();

					produto.quantidade = novaQuantidade;
					cacheGet.updateObject("produto",produto);

				});

			});

		}

	});

})();
