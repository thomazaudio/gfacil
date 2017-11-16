"use strict";

(function(){

	angular.module("adm")

	//Diretiva para lista de movimentações
	.directive('filterLeads', function (){
		return {
			restrict: 'E',
			scope:{

				qs:"=",
				submit:"="
			},

			templateUrl:'global/st-app/lead/template-module/filterLead.html',
			bindToController:true,
			controllerAs:"vm",
			controller: "filterLeadsController"
		}
	})

})();

