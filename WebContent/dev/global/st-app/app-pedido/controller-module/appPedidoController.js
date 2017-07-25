"use strict";
(function(){

	angular.module("adm") 

	.controller("appSimplePedidoController",function(stUtil, $rootScope, cacheGet, pedidoUtil, estoqueUtil, configUtil){

		
		var vm = this;
		
		var _init = function(){

			vm.attrBuscaProduto = vm.attrBuscaProduto || $rootScope.config.confs.attrBuscaProdutoInPdv ||'nome';

			vm.tagsProduto = cacheGet.get("tagsProduto"); 

			if(vm.modoAtEstoque==1){
				vm.fator = -1;
			}
			else{
				vm.fator=1;
			}

			if(!vm.pedidos)
				vm.pedidos=[];
		}
		_init();

		//Mudar attr de busca de produto
		vm.changeAttrBuscaProduto = function(attr){
			vm.attrBuscaProduto  = attr;
			configUtil.setConfig("attrBuscaProdutoInPdv",attr);
			vm.buscaProduto(vm.nomeProduto);
		}

		vm.buscaProduto = function(attrBuscaProduto, nome){

			vm.resultadoBusca=null;

			var ini = new Date().getTime();

			var prods = cacheGet.get("produto",attrBuscaProduto, nome); 

			var pedidos = 	pedidoUtil.mergeProdutoInPedidos(prods,vm.pedidos);
			pedidos = jlinq.from(pedidos)
			// para ser case sensitive
			.contains('produto.'+attrBuscaProduto, nome)
			.select();

			if(pedidos.length>5)
				pedidos.length=5;

			vm.resultadoBusca = pedidos;

			var pedidosLast = angular.copy(vm.pedidos);

			vm.pedidos = null;

			vm.pedidos =	pedidosLast;	
			
			console.log("resultadoBusca: ");
			console.log(vm.resultadoBusca);

		}

		vm.addPedido = function(pedido){

			var pedidos = vm.pedidos;

			var posPedido = stUtil.buscaOb(pedidos,pedido.produto.id,"produto.id");

			if(posPedido==-1){
				pedidos.push(pedido);
			}
			else {
				pedidos[posPedido] = pedido;
			}

			vm.pedidos = pedidos;
		}

		vm.cadProduto = function(nome){

			estoqueUtil.openProdutoInModal({nome:nome, setQuantidade:false},function(produto){

				console.log("Produto retornado!!!!: ");
				console.log(produto);

				//Garante que o produto seja buscado pelo nome cadastrado
				vm.attrBuscaProduto = "nome";
				vm.nomeProduto= produto.nome;
				vm.buscaProduto(produto.nome);
			});

		}

		vm.deletarPedido = function(pedido){

			var pos = stUtil.buscaOb(vm.pedidos,pedido.produto.id,"produto.id");
			delete pedido.quantidade;
			//delete pedido.valorUnitario;
			if(pos!=-1){
				delete vm.pedidos[pos].quantidade;
				//delete $scope.pedidos[pos].valorUnitario;
			}
		}

	})

})();
