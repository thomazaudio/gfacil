"use strict";
(function(){

	angular.module("adm")
	//Input com detalhes do objeto Pessoa
	.directive("detalhePessoa",function(stService){

		return{

			restrict:"E",
			require:"objeto",
			templateUrl:"global/st-app/app-pessoa/template-module/detalhePessoa.html",
			scope:{

				pessoa:"=",//Pessoa referenciada

			}

		}
	})

	//Input com detalhes do objeto Pessoa
	.directive("detalhePessoaEndereco",function(){

		return{

			restrict:"E",
			require:"objeto",
			templateUrl:"global/st-app/app-pessoa/template-module/detalhePessoaEndereco.html",
			scope:{

				endereco:"=",//Pessoa referenciada
			},

		}
	})

})();
