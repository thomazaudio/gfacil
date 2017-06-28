"use strict";
(function(){

	angular.module("adm")
	.directive("emprestimoEmbalagem",function(stService, lrUtil){

		return{

			restrict:"E",
			templateUrl:"global/st-app/logistica-reversa/template-module/emprestimoEmbalagem.html",
			scope:{
				pessoa:"=",//Pessoa referenciada
                onlyDevedores:"="//Se true, exibe apenas clientes que estejam devendo embalagens
			},
			bindToController:true,
			controllerAs:"vm",
			bindToController:true,
			controller:"emprestimoEmbalagemController"

		}
	})
	
	.directive("emprestimoEmbalagemExemplo",function(stService, lrUtil){

		return{

			restrict:"E",
			templateUrl:"global/st-app/logistica-reversa/template-module/emprestimoEmbalagemExemplo.html",
			scope:{
			},
			bindToController:true,
			controllerAs:"vm",
			bindToController:true,
			controller:function(){
				
				var vm = this;
				vm.emprestimo = {
					quantidadeReceber: 100	
				};
				vm.pessoa = {nome:"CLIENTE EXEMPLO"};
			}

		}
	})

})();
