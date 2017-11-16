"use strict";
(function(){
	angular.module("adm") 

	.controller("filterLeadsController",function($scope, $rootScope){
		
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
		  {attr:"nome",titulo:"Buscar pelo nome do Lead"}                    
		 ];
		
		vm.changeFilters = function(){
			
			var qs = [];
			
			if(vm.buscaLabel && vm.buscaLabel.value)
				qs.push(vm.buscaLabel.attr+" like '%"+vm.buscaLabel.value+"%'");
			
			if(vm.ativacaoLastDays && vm.ativacaoLastDays>0)
				qs.push(_getQueryAtivacaoLastDays(vm.ativacaoLastDays));
			
		
			
			if(vm.attrData){
				
				var dataDe = vm.dataDe.getTime();
				var dataAte = vm.dataAte.getTime();
				var queryData = vm.attrData+" between "+dataDe+" and "+dataAte;
				qs.push(queryData);
				
			}
			
			console.log(qs);
			vm.qs = qs;
			
		}
		
		vm.limparFiltros = function(){
			vm.qs = [];
			vm.buscaLabel = {};
			vm.ativacaoLastDays = 0;
			vm.dataValue = "";
			vm.aplicarFiltros();
		}
		
		vm.aplicarFiltros = function(){
			 vm.submit();
			 var max = $rootScope.config.confs.maxItensPage||7
			 $scope.$parent.getLikeMap(vm.qs,0,max,"","","");
		}
	

	})

})();
