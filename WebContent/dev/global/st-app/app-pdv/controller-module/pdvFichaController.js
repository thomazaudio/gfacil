
"use strict";
(function(){
	angular.module("adm").controller("pdvFichaController",function(cacheGet, $location ,cachePost, $uibModal, pdvUtil, pedidoUtil, $rootScope, $scope, stService ,pdv, stUtil ,movUtil,$route, $filter, st, nfeUtil, $modalInstance, lrUtil){

		console.log("pdv aqui: ");
		console.log(pdv);
		
		var ini = new Date().getTime(); 

		var vm = this;

		vm.changeStep = function(step){

			vm.step=step;

			var _infoModal = {};

			if(step==0){
				_infoModal.titulo = "Defina um cliente";
				_infoModal.okActionLabel = "Avançar";
				_infoModal.okActionIcon = "fa-angle-double-right";
			}

			//Escolha de produtos
			else if(step==1){
				_infoModal.titulo = "Definição dos produtos";
				_infoModal.okActionLabel = "Avançar";
				_infoModal.okActionIcon = "fa-angle-double-right";
			}
			else if(step==2){
				_infoModal.titulo = "Outras informações";
				_infoModal.okActionLabel  = "Finalizar";
				_infoModal.okActionIcon = "fa-check";
			}

			vm.infoModal = _infoModal;

		}

		vm.changeStep(0);

		vm.cancelAction = function(){

			if(vm.step>=1){
				vm.changeStep(vm.step-1);
			}
			else {
				//TODO confirmação
				$modalInstance.close();
			}
		}

		$scope.$watch("vm.pdv.movimentacao.pessoa", function(){

			if(!vm.pdv.movimentacao.pessoa)
				return;

			vm.pdv.movimentacao.pessoa = cacheGet.getObjectById("cliente",vm.pdv.movimentacao.pessoa.id);

			getProdutosSugeridosByCliente(vm.pdv.movimentacao.pessoa);

			lrUtil.getInfoEmprestimos(vm.pdv.movimentacao.pessoa, function(emprestimo){

				if(emprestimo)
					vm.quantidadeEmbalagemReceber = emprestimo.quantidadeReceber;

			});

		});

		//Para cálculo da métrica "tempo_finalizar_venda"
		var ini = new Date().getTime();

		vm.deletarVenda = function(){

			pdvUtil.deletarVenda(vm.pdv,function(data){

				stUtil.showMessage("","Venda deletada com sucesso!");
				$modalInstance.close();
				$route.reload();

			});

		}

		//A cada mudança nos pedidos o valor total é atualizado
		$scope.$watch('vm.pdv.movimentacao.pedidos',function(pedidos){

			vm.totalPdv = pedidoUtil.getTotalPedidos(pedidos);

		},true);

		//NFe a partir da movimentacao da venda
		vm.toNFe = function(pdv, modal){

			nfeUtil.openNFe(null,pdv.movimentacao.id);
		}

		//Lançamento da venda
		vm.lancarVenda = function(){

			var pdv = vm.pdv;
			
			if(!pdv.movimentacao.pessoa && $rootScope.config.confs.escolhaClientePdv=='true'){

				stUtil.showMessage("","Selecione um cliente para continuar.","danger");
				vm.changeStep(0);
				return;
			}

			if(vm.step==1){
				
				//Somente pedidos com quantidade>0
				pdv.movimentacao.pedidos = pdv.movimentacao.pedidos.filter(function(pedido){

					//Contabilidade de empréstimo de caixas plásticas
					pedido.lancaEmprestimo=true;

					//O pedido deve ter a quantidade>0 ou já ter sido salvo na venda
					if(pedido.quantidade>0 || pedido.id)
						return pedido;
				});
				
				if(pdv.movimentacao.pedidos.length==0){
					stUtil.showMessage("","Adicione pelo menos um produto!","danger");
				   return;
				}
			}


			if(vm.step<2){
				vm.changeStep(vm.step+1);
				return;
			}

			var msg = "";

			if(!pdv.id)
				msg="Venda lançada com sucesso!";
			else
				msg="Venda atualizada com sucesso!";

			if(!pdv.movimentacao.data)
				pdv.movimentacao.data = $filter("date")(new Date(),"dd/MM/yyyy");

			pdv.tipoPdvLancamento="pdvficha";//Tipo de pdv em que a venda foi lançada

			//Nome do evento
			var nomeEvento = "";

			if(pdv.id)
				nomeEvento = "tempo_editar_venda";

			else 
				nomeEvento = "tempo_finalizar_venda";

			//Tempo de resposta do servidor
			var iniTempoResposta = new Date().getTime();

			vm.carregandoFinalizarVenda =true;
			
			cachePost.add("pdv/add/", pdv, function(){
				
				
				vm.carregandoFinalizarVenda =false;

				//Evento tempo de resposta do servidor ao finalizar venda
				st.evt({evento:nomeEvento,descricao:((new Date().getTime()-ini)/1000)+""});

				//Tempo total para finalizar a venda
				st.evt({evento:"tempo_resposta_finalizar_venda",descricao:((new Date().getTime()-iniTempoResposta)/1000)+""});

				$modalInstance.close();
				$uibModal.open({
					animation: true,
					templateUrl:"modalPosVenda.html",
					size:'lg',
					controller:function($scope, $modalInstance){

						$scope.pdv = pdv;

						$scope.getTotalPedidos = function(pedidos){

							return pedidoUtil.getTotalPedidos(pedidos);
						}

						$scope.novaVenda = function(modal){

							//(Função definida no controller externo ao modal)
							modal.$dismiss("cancel");
							pdvUtil.openVendaInModal();

						}

						$scope.editarVenda= function(pdv,modal){

							modal.$dismiss();
							pdvUtil.openVendaInModal(pdv);

						}

						$scope.toNFe = function(pdv,modal){

							modal.$dismiss('cancel');
							nfeUtil.openNFe(null,pdv.movimentacao.id);
						}

						$scope.toVendas= function(){

							$modalInstance.close();

							if($location.$$path=='/pdv')
								$route.reload();

							else
								$location.path("pdv");

						}

						$scope.fechar = function(ele){

							ele.$dismiss('cancel');
							callback($scope.objeto);

						}

					}
				});
				
			});


		}

		vm.imprimirCupom = function(idMov){

			var ids = [];
			ids.push(idMov);
			movUtil.imprimirCupom(ids,function(){

			});
		}

		//Sugestão de produtos para o cliente selecionado
		var getProdutosSugeridosByCliente = function(cliente){

			if(!cliente.sugestoesProdutos || cliente.sugestoesProdutos==null)
				return;

			var prods = cliente.sugestoesProdutos.split(",");
			var produtos = [];
			for(var i in prods){
				produtos.push(cacheGet.getObjectById("produto",Number(prods[i])));
			}

			vm.pdv.movimentacao.pedidos = vm.pdv.movimentacao.pedidos.filter(function(ped){

				if(ped.quantidade && ped.quantidade>0)
					return ped;
			});

			vm.pdv.movimentacao.pedidos = pedidoUtil.mergeProdutoInPedidos(produtos, vm.pdv.movimentacao.pedidos);

		}

		//Sugestão de produtos mais vendidos
		var sugestaoProdutos=function(){

			var proj = null;

			//Máximo de itens a serem sugeridos
			var max = parseInt($rootScope.config.confs.maxSugestaoProdutosPDV);
			max = max || 5;

			if($rootScope.config.confs.sugestaoProdutosPDV=='allProdutos'){

				proj = {
						qs: ["id>0"],
						columns:"id",
						objeto:"Produto",
						groupBy:"id",
						extra: "order by id desc",
						max:max
				}

			}

			else if($rootScope.config.confs.sugestaoProdutosPDV=='maisVendidos'){

				proj = {
						qs: ["tipoEntrada=0"],
						columns:"produto.id",
						objeto:"Pedido",
						groupBy:"produto.id",
						extra: " order by sum(quantidade) desc",
						max:max
				}

			}


			if(proj==null)
				return;

			stService.getProjecoes(proj).success(function(data){

				var ids=data.itens;
				var prods= [];

				for(var i in ids){
					prods.push(cacheGet.getObjectById("produto",ids[i]));
				}

				$scope.pdv.movimentacao.pedidos = pedidoUtil.mergeProdutoInPedidos(prods,$scope.pdv.movimentacao.pedidos);
			});
		}

		//Configuração de PDV não-vazio (Edição)
		function configureEditPdv(pdv){

			var peds  = pdv.movimentacao.pedidos;

			for(var i in peds){

				peds[i].quantAnt = peds[i].quantidade;

				//Atualiza o produto do pedido de acordo com o cache
				peds[i].produto = cacheGet.getObjectById("produto",peds[i].produto.id) || peds[i].produto;

			}

			pdv.movimentacao.pedidos = peds;

			vm.pdv = pdv;
		}


		//Configura um pdv vazio no escopo
		function configurePdvVazio(){

			vm.pdv = {};
			vm.pdv.data =  new Date();
			vm.pdv.movimentacao = {};
			vm.pdv.movimentacao.pedidos=[];

			console.log("Tempo gasto: "+ (new Date().getTime() - ini));

			//Recupera os produtos mais vendidos
			//$scope.sugestaoProdutos();
		}
		if(pdv.data){

			configureEditPdv(pdv.data.item);
			vm.titulo = "Editar venda";

		}

		else{

			configurePdvVazio();
			vm.titulo = "Nova venda";

		}

	});
})();
