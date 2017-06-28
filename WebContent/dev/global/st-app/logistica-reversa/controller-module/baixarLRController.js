"use strict";
(function(){
	angular.module("adm") 

	.controller("baixarLRController",function(pessoa, emprestimo, callback, stService, dateUtil, $rootScope, stUtil, $modalInstance){

		var vm = this;
		vm.pessoa = pessoa;
		vm.emprestimo = emprestimo;
		vm.quantidadeBaixar = emprestimo.quantidadeReceber;

		vm.salvarEmp= function(){
			
			var emprestimo = vm.emprestimo;
			var quantidadeBaixar = vm.quantidadeBaixar;

			if(quantidadeBaixar > (vm.emprestimo.quantidadeReceber)){
				stUtil.showMessage("","A quantidade não deve ser maior do que o restante a receber!","danger");
				return;
			}

			//Salva uma lr de entrada (tipo=1)
			var lr = {
					tipo:1,
					pessoa:pessoa,
					quantidade: quantidadeBaixar
			}

			stService.save("logisticareversa",lr).success(function(data){

				$modalInstance.close();
				stUtil.showMessage("","Atualizado com sucesso!","info");
				callback();

			});
		}

	

	})

})();
