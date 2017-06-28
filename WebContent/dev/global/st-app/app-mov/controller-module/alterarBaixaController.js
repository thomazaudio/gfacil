"use strict";
(function(){
	angular.module("adm") 

	.controller("alterarBaixaController",function(mov, stService, dateUtil, movUtil, $rootScope, $modalInstance){

		var vm = this;
		vm.dataPagamento = new Date();
		vm.formaPagamento = $rootScope.config.confs.formaPagamentoPadrao;
		vm.valorMov  = mov.valor;

		vm.cancelar = function(modal){

			mov.baixada=false;
			$modalInstance.close();
		}

		vm.confirmar = function(){
			
			var data = vm.data;
			var valor = vm.valor;
			var formaPagamento = vm.formaPagamento;

			var dataBaixa = dateUtil.getDate(data);
			$modalInstance.close();
			mov.valor = valor;
			mov.formaPagamento = formaPagamento;
			mov.dataBaixa = dataBaixa||new Date();

			//Para movimentação fixa
			//Caso seja uma movimentação fixa (modoRepeticao!=0), cadastra da movimentação abastrata gerada
			if(mov.originalMov && mov.originalMov.modoRepeticao!=0){

				var originalMov = mov.originalMov;

				originalMov = movUtil.addBaixaForMov(originalMov,mov.data);

				//Salva a movimentação fixa original (Com a baixa adicionada)
				stService.save("movimentacao",originalMov).success(function(){

					//Cadastrada a movimentação fixa abstrata gerada
					movUtil.cadMov([mov]);

				});

				return;
			}

			else{

				mov.dataBaixa = dataBaixa||new Date();
				movUtil.confirmAlterarBaixa (mov);
			}
		}

	})

})();
