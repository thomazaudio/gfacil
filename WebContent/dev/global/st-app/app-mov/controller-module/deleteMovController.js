"use strict";
(function(){

	angular.module("adm") 

	.controller("deleteMovController",function(mov,callback ,movimentacaoService,movUtil,stUtil){
		var vm = this;
		vm.mov = mov;

		vm.deletar = function(mov,modo,modal){

			var messageSuccess = "Operação realizada com sucesso";

			//Movimentação abstrata
			if(!mov.id && modo=='onlyPeriod'){

				//baixa falsa da movimentação
				mov.originalMov = movUtil.addBaixaForMov(mov.originalMov,mov.data);

				//Salva a movimentação
				movUtil.cadMov([mov.originalMov],function(){

					//modal.$dismiss();
					stUtil.showMessage("",messageSuccess,"info");

					if(callback)
						callback();

				});
			}
			else{
				if(!mov.id)
					mov = mov.originalMov;
				movimentacaoService.apagar(mov,modo).success(function(){

					if(callback)
						callback();
					//modal.$dismiss();

				});

			}
		}

		vm.fecharModal = function(modal){

			//modal.$dismiss();
		}
	})

})();
