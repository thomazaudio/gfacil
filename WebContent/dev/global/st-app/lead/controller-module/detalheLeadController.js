"use strict";
(function(){
	angular.module("adm") 

	.controller("detalheLeadController",function(lead, stService, dateUtil, movUtil, $rootScope, $modalInstance, stUtil, leadUtil){

		var vm = this;

		var qs  = $rootScope.config.confs.questoesLead.split(",");
		vm.questions = [];
	
		for(var i in qs){
			var _attr = qs[i].toLowerCase();
			_attr = _attr.split(" ").join("_");
			vm.questions.push({label: qs[i], attr: _attr});
		}

		vm.lead = lead;
		
		vm.diasUltimaEtapaLead = dateUtil.daysBetween(vm.lead.dataUltimaEtapa, new Date().getTime());
		
		vm.atualizarLead = function(){
			stService.getById("lead", vm.lead.id).success(function(data){
				stUtil.showMessage("","Atualizado com sucesso!");
				vm.lead = data.item;
			});
		}
		vm.salvar = function(lead){

			stService.executePost("lead/add/",lead).success(function(){

				stUtil.showMessage("","Salvo com sucesso!");
			});

		},
		
		vm.changeEtapaLead = function(lead){

			lead.dataUltimaEtapa =  new Date().getTime();
			vm.salvar(lead);

		}

	})

})();
