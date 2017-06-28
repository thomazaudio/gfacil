"use strict";
(function(){

	angular.module("adm") 

	.controller("movListController",function(movUtil, stUtil, stService, $filter, $uibModal, pdvUtil, $rootScope, $timeout, dateUtil, movListControllerFactory){

		var vm = this;
		movListControllerFactory.init(vm);
		
		vm.imprimir = function(){
			$window.print();

		}

		vm.deletar = function(mov){

			movUtil.deleteMov(mov,function(){

				atualizaMovs();
			});
		}

		//Caso seja definida a quantidade máxima de itens, esta função exibe um modal com todas a movimentações
		vm.visualizarTodas = function(){

			var activeTab = 0;

			//Receitas
			if(vm.fixProperties.tipo==2)
				activeTab=1;

			movUtil.openMovListInModal(activeTab);

		}

		if(!vm.querys)
			vm.querys=[];

		//Altera o Status
		vm.alterarBaixa =function(mov){

			movUtil.alterarBaixa(mov,function(data){

				mov =data;

			});
		}

		//tipo = fixa ou variavel, tipoMov = 1 ou 2 (Despesa ou Receita)
		//De acordo com o período
		vm.getMovimentacoes = function(){

			vm.escolheuPeriodo  =  true;
			vm.loadingStatus =true;
			var qs = movListControllerFactory.configureQuerysForBusca(vm);

			//Ordenação dos dados
			var oderMovs = vm.orderMovs || vm.tipoDataBusca;
			var params = {
					qs: qs,
					pagina: 0,
					max: vm.maxItens||0,
					extra: " order by "+oderMovs
			}

			stService.executeGet("/movimentacao/busca/map",params).success(function(data){

				vm.loadingStatus =false;
				var movs = data.itens;

				//Auxiliar para mudança 
				vm.movsAux = data.itens;

				vm.total = getTotalMovs(data.itens);

				for(var k in movs){
					movs[k] = movUtil.setStatusMov(movs[k]);
				}

				vm.baixa="todas";

				params.qs = movListControllerFactory.configureQuerysForBuscaFixa(vm);
				stService.executeGet("/movimentacao/busca/map",params).success(function(data){

					
					var allMovs = [];
					
					//Realiza a junção com as movimentações variáveis
					if(!vm.allPeriod || vm.allPeriod==false)
					   allMovs = movs.concat(movListControllerFactory.getAbstractsMovsFixas(data.itens, vm));
					else 
						allMovs = data.itens;
						

					if(allMovs.length==0)
						vm.noResults=true;
					else 
						vm.noResults=false;

					movListControllerFactory.agruparMovimentacoes(allMovs, vm);

					vm.baixa="todas";
					vm.loadingStatus =false;
				});

			});

		}

		//Mudança de visualização de movimentações (Todas, não-pagas, pagas)
		vm.changeTipoBaixa = function(baixa){

			var aux = [].concat(vm.movsAux);
			aux = movListControllerFactory.filtraMovsByBaixa(aux, baixa);
			vm.total =getTotalMovs(aux);
			movListControllerFactory.agruparMovimentacoes(aux,vm);
			
		}

		function getTotalMovs(movs){

			return movUtil.getTotalMovs(movs);

		}
		vm.getTotalMovs  = getTotalMovs;

		//Atualiza Receitas e Desepesas
		function atualizaMovs(){

			vm.getMovimentacoes();

		}

		if(vm.allPeriod==true)
			atualizaMovs();

		vm.openDetalheMov = function(mov){

			//Operação de vendas
			if(mov && mov.tipoOperacaoLancamento==1){
				pdvUtil.goToPdvFromMov(mov);
				return;
			}

			//Operação de atualização de estoque
			if(mov && mov.tipoOperacaoLancamento==2){
				movUtil.goToAtEstoqueFromMov(mov);
				return;
			}

			movUtil.openMov(mov, vm.fixProperties,function(){
				atualizaMovs();

			});
		}

	})

})();
