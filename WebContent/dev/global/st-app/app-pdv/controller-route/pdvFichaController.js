
"use strict";
(function(){
	angular.module("adm").controller("pdvFichaController",function(cacheGet, $location ,cachePost, $uibModal, pdvUtil, pedidoUtil, $rootScope, $scope, stService ,pdv, stUtil ,movUtil,$route, $filter, st, nfeUtil, $modalInstance, lrUtil){
       
		var ini = new Date().getTime(); 

		$scope.changeStep = function(step){

			$scope.step=step;

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

			$scope.infoModal = _infoModal;

		}

		$scope.changeStep(0);

		$scope.cancelAction = function(){

			if($scope.step>=1){
				$scope.changeStep($scope.step-1);
			}
			else {
				//TODO confirmação
				$modalInstance.close();
			}
		}

		$scope.$watch("pdv.movimentacao.pessoa", function(){

			if(!$scope.pdv.movimentacao.pessoa)
				return;
			
			$scope.pdv.movimentacao.pessoa = cacheGet.getObjectById("cliente",$scope.pdv.movimentacao.pessoa.id);
			
			$scope.getProdutosSugeridosByCliente($scope.pdv.movimentacao.pessoa);

			lrUtil.getInfoEmprestimos($scope.pdv.movimentacao.pessoa, function(emprestimo){

				if(emprestimo)
				    $scope.quantidadeEmbalagemReceber = emprestimo.quantidadeReceber;
				
				
				$scope.changeStep(1);

			});

		});

		//Para cálculo da métrica "tempo_finalizar_venda"
		var ini = new Date().getTime();

		$scope.cancelarVenda = function(){
			$modalInstance.close();
		} 

		$scope.openPedidosInModal = function(pedidos){

			pedidoUtil.openPedidosInModal(pedidos, function(pedidos){

				$scope.pdv.movimentacao.pedidos = pedidos;
				$scope.$apply();
			});

		}

		$scope.deletarVenda = function(){

			pdvUtil.deletarVenda($scope.pdv,function(data){

				stUtil.showMessage("","Venda deletada com sucesso!");
				$modalInstance.close();
				$route.reload();

			});

		}

		//A cada mudança nos pedidos o valor total é atualizado
		$scope.$watch('pdv.movimentacao.pedidos',function(pedidos){

			$scope.totalPdv = pedidoUtil.getTotalPedidos(pedidos);

			//if(pedidos.length==0)
				//$scope.sugestaoProdutos();

		},true);

		//NFe a partir da movimentacao da venda
		$scope.toNFe = function(pdv,modal){

			nfeUtil.openNFe(null,pdv.movimentacao.id);
		}

		//Lançamento da venda
		$scope.lancarVenda = function(){

			if($scope.step<2){
				$scope.changeStep($scope.step+1);
				return;
			}



			var pdv = $scope.pdv;

			if(!pdv.movimentacao.pessoa && $rootScope.config.confs.escolhaClientePdv=='true'){

				stUtil.showMessage("","Selecione um Cliente!","danger");
				return;
			}


			if(pdv.movimentacao.pedidos.length==0){

				stUtil.showMessage("","Adicione pelo menos um produto!","danger");
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

			//Somente pedidos com quantidade>0
			pdv.movimentacao.pedidos = pdv.movimentacao.pedidos.filter(function(pedido){

				//Contabilidade de empréstimo de caixas plásticas
				pedido.lancaEmprestimo=true;

				//O pedido deve ter a quantidade>0 ou já ter sido salvo na venda
				if(pedido.quantidade>0 || pedido.id)
					return pedido;
			});


			//Nome do evento
			var nomeEvento = "";

			if(pdv.id)
				nomeEvento = "tempo_editar_venda";

			else 
				nomeEvento = "tempo_finalizar_venda";

			//Tempo de resposta do servidor
			var iniTempoResposta = new Date().getTime();

			$scope.carregandoFinalizarVenda =true;

			cachePost.add("pdv/add/", pdv, function(){


				$scope.carregandoFinalizarVenda =false;

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

						//Alteração de quantidade de emprestimos de embalagens
						$scope.saveEmprestimoEmbalagem = function(pdv, quantidade){

							$scope.carregaSave = true;

							stService.executeGet("pdv/save-emprestimoembalagem",{idPdv:idPdv,quantidade:quantidade}).success(function(){

								stUtil.showMessage("Empréstimo salvo com sucesso!"); 
								$scope.carregaSave = false;

							}).error(function(){

								$scope.carregaSave = false;
							});


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

		$scope.imprimirCupom = function(idMov){

			var ids = [];
			ids.push(idMov);
			movUtil.imprimirCupom(ids,function(){

			});
		}

		//Sugestão de produtos para o cliente selecionado
		$scope.getProdutosSugeridosByCliente = function(cliente){
               
			   if(!cliente.sugestoesProdutos || cliente.sugestoesProdutos==null)
				   return;
			  
				var prods = cliente.sugestoesProdutos.split(",");
				var produtos = [];
				for(var i in prods){
					produtos.push(cacheGet.getObjectById("produto",Number(prods[i])));
				}

				$scope.pdv.movimentacao.pedidos = $scope.pdv.movimentacao.pedidos.filter(function(ped){

					if(ped.quantidade && ped.quantidade>0)
						return ped;
				});

				$scope.pdv.movimentacao.pedidos = pedidoUtil.mergeProdutoInPedidos(produtos,$scope.pdv.movimentacao.pedidos);

			

		}

		//Sugestão de produtos mais vendidos
		$scope.sugestaoProdutos=function(){


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

			$scope.pdv = pdv;
		}
		$scope.configureEditPdv = configureEditPdv;


		//Configura um pdv vazio no escopo
		function configurePdvVazio(){

			$scope.resultadoBusca = [];
			$scope.nomeProduto = "";
			$scope.pdv = {};
			$scope.pdv.data =  new Date();
			$scope.pdv.movimentacao = {};
			$scope.pdv.movimentacao.pedidos=[];
			
			console.log("Tempo gasto: "+ (new Date().getTime() - ini));

			//Recupera os produtos mais vendidos
			//$scope.sugestaoProdutos();
		}
		$scope.configurePdvVazio = configurePdvVazio;
		if(pdv.data){

			configureEditPdv(pdv.data.item);
			$scope.titulo = "Editar venda";

		}

		else{

			configurePdvVazio();
			$scope.titulo = "Nova venda";

		}

	});
})();
