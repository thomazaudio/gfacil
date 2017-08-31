"use strict";
(function(){
	angular.module("adm") 

	.controller("baixarLRController",function(pessoa, emprestimo, callback, stService, dateUtil, $rootScope, stUtil, $modalInstance){

		var vm = this;
		vm.pessoa = pessoa;
		vm.emprestimo = emprestimo;
	

		vm.salvarEmp= function(){
			
			var emprestimo = vm.emprestimo;
			var quantidadeBaixar = vm.quantidadeBaixar;

			if(quantidadeBaixar > (vm.emprestimo.quantidadeReceber)){
				stUtil.showMessage("","A quantidade não deve ser maior do que o restante a receber!","danger");
				return;
			}
			
			if(!quantidadeBaixar || quantidadeBaixar==0){
				stUtil.showMessage("","Informe uma quantidade válida","danger");
				return;
			}

			//Salva uma lr de entrada (tipo=1)
			var lr = {
					tipo:1,
					pessoa:pessoa,
					quantidade: quantidadeBaixar
			}
            
			vm.salvando = true;
			stService.save("logisticareversa",lr).success(function(data){

				vm.salvando = false;
				$modalInstance.close();
				stUtil.showMessage("","Atualizado com sucesso!","info");
				callback();

			}).error(function(){
				vm.salvando = false;
				stUtil.showMessage("","Ocorreu um erro, verifique sua conexão com a internet","danger");
			});
		}

	

	})

})();
