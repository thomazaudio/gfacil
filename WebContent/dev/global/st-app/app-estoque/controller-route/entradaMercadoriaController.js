"use strict";
(function(){
	angular.module("adm").controller("entradaMercadoriaController",function($filter,movUtil,$location,st,$uibModal,$rootScope,estoqueUtil,cacheGet,$stModal,$scope, stUtil,stService,$route,entradaMercadoria,callback, $modalInstance){



		$scope.changeStep = function(step){

			$scope.step=step;

			var _infoModal = {};

			//Escolha de produtos
			if(step==1){
				_infoModal.titulo = "Entrada de mercadoria";
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
		
		
		$scope.changeStep(1);



		//Métrica para análise do tempo de atalização do estoque
		var ini = new Date().getTime();

		if(entradaMercadoria){

			$scope.em = entradaMercadoria;

		}
		else {

			$scope.em = {};
			$scope.em.movimentacao = {};
			$scope.em.movimentacao.data = new Date();
		}

		$scope.$watch("em.movimentacao",function(mov){

			if(mov)
				$scope.totalEM = movUtil.getTotalMov(mov);
		},true);

		$scope.cancelar = function(){

			$location.path("produto");
		} 


		$scope.cancelAction = function(){

			if($scope.step==2){

				$scope.changeStep(1);
				return;
			}
			
			$modalInstance.close();
		}

		$scope.salvar = function(){


			if($scope.step==1){

				$scope.changeStep(2);
				return;
			}

			var em = $scope.em;

			$scope.carregandoFinalizar = true;

			//Apenas pedidos válidos
			em.movimentacao.pedidos = em.movimentacao.pedidos.filter(function(pedido){

				if(pedido.quantidade){
					pedido.tipoEntrada=1;
					return pedido;

				}
			});

			//Validações
			if(em.movimentacao.pedidos.length==0){

				stUtil.showMessage("","Escolha pelo menos um produto para atualizar o estoque.","danger");
				$scope.carregandoFinalizar = false;
				return;
			}

			//Lança a movimentacao
			stService.save("entradamercadoria",em).success(function(){

				$scope.carregandoFinalizar = false;

				stUtil.showMessage("","Estoque atualizado com sucesso para "+$rootScope.currentFilial.xNome,"info");

				st.evt({evento:"tempo_atualizar_estoque",descricao:((new Date().getTime()-ini)/1000)+""});

				var path = $route.current.$$route.originalPath;

				if(path=='/entradamercadoria/:id')
					$location.path("entradamercadoria");

				else  if(path=='/produto')
					$route.reload();
				else 
					$location.path("produto");

			}).error(function(){

				$scope.carregandoFinalizar = false;
				stUtil.showMessage("","Ocorreu um erro ao atualizar o estoque, verifique sua conexão com a internet e tente novamente","danger");
			});

		}

	});
})();



