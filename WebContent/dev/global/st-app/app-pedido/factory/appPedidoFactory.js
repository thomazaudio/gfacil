"use strict";
(function(){

	angular.module("adm") 

	//Funções uteis para pedidos
	.factory("pedidoUtil",function(dateUtil, stService, stUtil, $uibModal){
		
		
		var _openPedidosInModal = function(pedidos, callback){

			$uibModal.open({
				animation: true,
				templateUrl:"global/st-app/app-pedido/template-module/appSimplePedidoModal.html",
				size:'lg',
				controllerAs: "vm",
				bindToController: true,
				controller:function($modalInstance){

					var vm = this;
					vm.pedidos = pedidos;
					
					vm.ok = function(){
						   
						  console.log("Pedidos retornados: ");
						  console.log(vm.pedidos);
						  $modalInstance.close();
						  callback(vm.pedidos);
					}
				}
			});	
			
		}
		
		
		var _openDetalhePedido = function(pedido, callback){

			$uibModal.open({
				animation: true,
				templateUrl:"global/st-app/app-pedido/template-module/detalhePedido.html",
				size:'lg',
				controllerAs: "vm",
				bindToController: true,
				controller:function($modalInstance){

					var vm = this;
					vm.pedido = pedido;
					
					vm.okAction = function(){
						  $modalInstance.close();
						   callback(vm.pedido);
					}
					
					vm.cancelAction = function(){
						  $modalInstance.close();
						   callback();
					}
				}
			});	
			
		}

		//Recupera o nome completo do pedido
		var _getNomePedido = function(p){

			console.log("--");
			var nomePedido =  p.produto.nome;

			if(p.opcao){
				nomePedido += " "+p.opcao.nomeOpcao;
			}

			return nomePedido;

		}

		//Seta a quantidade anterior nos pedidos (Para atualizações, etc)
		var _setQuantAntInPedidos = function(pedidos){

			for(var i in pedidos){
				pedidos[i].quantAnt = pedidos[i].quantidade;
			}
			return pedidos;
		}

		var _getTotalPedidos = function(pedidos){

			var total = 0;

			for(var i in pedidos){
				total+=(pedidos[i].valorUnitario||0) * (pedidos[i].quantidade||0); 
			}

			return total;

		}

		//tipo pode assumir os valores: 'grafico' ou tabela
		var _getRelatorioVendasGrafico = function(dataDe, dataAte, maxItens, callback){

			var qs = [];
			qs.push(dateUtil.getQueryOfPeriod("date",dataDe,dataAte));
			qs.push("tipoEntrada=0");
			qs.push("quantidade>0");
			qs.push("valorUnitario>0");
			qs.push("disable=0");
			//qs.push("valorUnitario>0");
			var ops = {
					qs:qs,
					columns:"nomePedido,sum(quantidade)",
					groupBy:"nomePedido",
					objeto:"Pedido",
					max: maxItens || 0
			};


			stService.getProjecoes(ops).success(function(data){

				var totalQuant = 0;
				var itens = data.itens;
				var labelsGrafico =  [];
				var dataGrafico = [];
				for(var i in itens ){

					labelsGrafico.push(itens[i][0]);
					dataGrafico.push(itens[i][1]);
				}

				var projecaoGrafico = {labels:labelsGrafico, data:dataGrafico};

				callback(projecaoGrafico);

			});

		}

		var _mergeProdutoInPedidos= function(produtos, pedidos){

			pedidos = pedidos.filter(function(ped){

				if(ped.produto)
					return ped;
			});

			for(var i in produtos){

				if(produtos[i] && stUtil.buscaOb(pedidos,produtos[i].id,"produto.id")==-1){
					pedidos.push({produto:produtos[i]});
				}
			}

			return pedidos;

		}

		return{

			getTotalPedidos:  _getTotalPedidos,
			getNomePedido: _getNomePedido,
			getRelatorioVendasGrafico: _getRelatorioVendasGrafico,
			mergeProdutoInPedidos: _mergeProdutoInPedidos,
			setQuantAntInPedidos: _setQuantAntInPedidos,
			openPedidosInModal: _openPedidosInModal,
			openDetalhePedido: _openDetalhePedido
		}

	})

})();
