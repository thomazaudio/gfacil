"use strict";
(function(){
	angular.module("adm") 

	.controller("historicoLRController",function(emprestimo,callback){

		var vm = this;
		vm.emprestimo = emprestimo;

		vm.fechar = function(ele){

			ele.$dismiss('cancel');
			callback();

		}

	})

})();
