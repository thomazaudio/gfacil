"use strict";
(function(){

	angular.module("adm") 

	.controller("appSimplePedidoController",function($scope,stUtil,$rootScope,cacheGet,pedidoUtil,estoqueUtil,configUtil){

		$scope.attrBuscaProduto = $scope.attrBuscaProduto || $rootScope.config.confs.attrBuscaProdutoInPdv ||'nome';
		
		$scope.tagsProduto = cacheGet.get("tagsProduto"); 

		if($scope.modoAtEstoque==1){
			$scope.fator = -1;
		}
		else{
			$scope.fator=1;
		}

		if(!$scope.pedidos)
			$scope.pedidos=[];

		//Mudar attr de busca de produto
		$scope.changeAttrBuscaProduto = function(attr){
			$scope.attrBuscaProduto  = attr;
			configUtil.setConfig("attrBuscaProdutoInPdv",attr);
			$scope.buscaProduto($scope.nomeProduto);
		}

		$scope.buscaProduto = function(attrBuscaProduto, nome){
			
			$scope.resultadoBusca=null;

			var ini = new Date().getTime();

			var prods = cacheGet.get("produto",attrBuscaProduto, nome); 

			var pedidos = 	pedidoUtil.mergeProdutoInPedidos(prods,$scope.pedidos);
			pedidos = jlinq.from(pedidos)
			// para ser case sensitive
			.contains('produto.'+attrBuscaProduto, nome)
			.select();
			
		
			if(pedidos.length>5)
				pedidos.length=5;

			$scope.resultadoBusca = pedidos;
			
			console.log("resultadoBusca: ");
			console.log($scope.resultadoBusca);

			var pedidosLast = angular.copy($scope.pedidos);

			$scope.pedidos = null;

			$scope.pedidos =	pedidosLast;	

		}

		$scope.addPedido = function(pedido){
			
			console.log("Adicionar o pedido: ");
			console.log(pedido);
			
			var pedidos = $scope.pedidos;

			var posPedido = stUtil.buscaOb(pedidos,pedido.produto.id,"produto.id");

			if(posPedido==-1){
				pedidos.push(pedido);
			}
			else {
				pedidos[posPedido] = pedido;
			}

			$scope.pedidos = pedidos;
		}

		$scope.cadProduto = function(nome){

			estoqueUtil.openProdutoInModal({nome:nome, setQuantidade:false},function(produto){
				
				console.log("Produto retornado!!!!: ");
				console.log(produto);

				//Garante que o produto seja buscado pelo nome cadastrado
				$scope.attrBuscaProduto = "nome";
				$scope.nomeProduto= produto.nome;
				$scope.buscaProduto(produto.nome);
			});

		}

		$scope.deletarPedido = function(pedido){

			var pos = stUtil.buscaOb($scope.pedidos,pedido.produto.id,"produto.id");
			delete pedido.quantidade;
			//delete pedido.valorUnitario;
			if(pos!=-1){
				delete $scope.pedidos[pos].quantidade;
				//delete $scope.pedidos[pos].valorUnitario;
			}
		}

	})

})();
