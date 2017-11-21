"use strict";
(function(){
	angular.module("adm") 

	.controller("filterLeadsController",function($scope, $rootScope, dateUtil){
		
		var vm = this;
		
		var _getQueryAtivacaoLastDays = function(days){
			
			var lastDays = new Date();
			lastDays.setDate(lastDays.getDate() - days);
			console.log("lastDays: ");
			console.log(lastDays);
			var query = "dataUltimoLogin>="+lastDays.getTime();
			return query;
		}
		
		vm.listaBuscaLabel = [
		  {attr:"nome",titulo:"Buscar pelo nome do Lead"},  
		  {attr:"telefone",titulo:"Buscar pelo Telefone"},    
		  {attr:"email",titulo:"Buscar pelo Email"},
		  {attr:"codOrigem",titulo:"Origem de aquisição"}
		 ];
		
		vm.buscaLabel =  vm.listaBuscaLabel[0];
		
		vm.filtrosOnboard = [
		   {attr:"metrics.metrics_KEY",titulo:"Menu"},  
		   {attr:"metrics.onboard_intro",titulo:"Introdução"},  
		   {attr:"metrics.onboard_listagem_produtos",titulo:"Listagem dos produtos"},  
		];
		
		
		
		vm.changeFilters = function(){
			
			var qs = [];
			
			if(vm.buscaLabel && vm.buscaLabel.value)
				qs.push(vm.buscaLabel.attr+" like '%"+vm.buscaLabel.value+"%'");
			
			if(vm.ativacaoLastDays && vm.ativacaoLastDays>0)
				qs.push(_getQueryAtivacaoLastDays(vm.ativacaoLastDays));
			
		
			
			if(vm.attrData && vm.dataValue){
				
				var dataDe = dateUtil.getDate(vm.dataValue).getTime();
				
				var dataAte = dateUtil.getDate(vm.dataValue);
				dataAte.setHours(23,59,59,0);
				dataAte = dataAte.getTime();
		
				var queryData = vm.attrData+" >= "+dataDe+" and "+vm.attrData+" <= "+dataAte;
				qs.push(queryData);
				
			}
			
			if(vm.buscaEtapaFunil){
				qs.push("etapaFunil='"+vm.buscaEtapaFunil+"'");
			}
			
			console.log(vm.filtrosOnboard);
			
			console.log(qs);
			vm.qs = qs;
			
		}
		
		vm.limparFiltros = function(){
			vm.qs = [];
			vm.buscaLabel = vm.listaBuscaLabel[0];
			vm.ativacaoLastDays = 0;
			vm.dataValue = "";
			vm.buscaEtapaFunil = "";
			vm.aplicarFiltros();
		}
		
		vm.aplicarFiltros = function(){
			 vm.submit();
			 var max = $rootScope.config.confs.maxItensPage||7
			 $scope.$parent.getLikeMap(vm.qs,0,max,"","","");
		}
	

	})

})();
