"use strict";
(function(){
	angular.module("adm") 

	.controller("emprestimoEmbalagemController",function(lrUtil, stService){

		var vm = this;

		//Recupera os empréstimos de um cliente
		vm.getEmprestimo = function(pessoa){
			vm.emprestimo = null;
			vm.carregando=true;
            lrUtil.getInfoEmprestimos(pessoa, function(emprestimo){
            	
            	vm.carregando=false;
            	vm.emprestimo = emprestimo;
            	
            	if(emprestimo==null){
            		
            		vm.erro=true;
    				
            	}
            	
            });

		}

		vm.getEmprestimo(vm.pessoa);

		//Baixa de empréstimo
		vm.baixarEmprestimo = function(pessoa, emprestimo){

			lrUtil.baixarLR(pessoa,emprestimo,function(){

				vm.getEmprestimo(vm.pessoa);
			});

		}

		//Visualizar histórico
		vm.showHistorico = function(emprestimo){

			lrUtil.showHistorico(emprestimo);
		}

	})

})();
