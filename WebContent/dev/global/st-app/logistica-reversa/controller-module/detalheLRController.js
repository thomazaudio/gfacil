"use strict";
(function(){
	angular.module("adm") 

	.controller("detalheLRController",function(lr,callback, stService, stUtil, $modalInstance){

		var vm = this;
		vm.lr = lr || {};
		vm.lr.dataCadastro  = vm.lr.dataCadastro || new Date();

		vm.salvar = function(){

			//Emprestimo
			vm.lr.tipo = 2;

			if(!vm.lr || !vm.lr.quantidade || !vm.lr.pessoa){
				stUtil.showMessage("","Preencha os campos corretamente!","danger");
				return;
			}

			stService.save("logisticareversa",vm.lr).success(function(){

				stUtil.showMessage("","Cadastrado com sucesso!","info");
				$modalInstance.close();
				callback(vm.lr);

			});

		}

	})

})();
