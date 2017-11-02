"use strict";
(function(){
	angular.module("adm") 

	.controller("detalheLeadController",function(lead, stService, dateUtil, movUtil, $rootScope, $modalInstance, stUtil){

		console.log("lead");
		console.log(lead);
		
		var vm = this;
		vm.lead = lead;
		vm.salvar = function(lead){
			
			stService.executePost("lead/add/",lead).success(function(){
				
				stUtil.showMessage("","Salvo com sucesso!");
			});
			
		}

	})

})();
