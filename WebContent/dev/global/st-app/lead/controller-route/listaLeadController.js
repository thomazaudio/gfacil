"use strict";
(function(){
	angular.module("adm") 
	
	.controller("listaLeadController",function($scope, stService, dateUtil, movUtil, $rootScope, $uibModal){

	           $scope.openDetalhe = function(lead_){
	        	   
	        	   var modal = $uibModal.open({
						animation: true,
						templateUrl:"global/st-app/lead/template-module/detalheLead.html",
						size:'lg',
						controller:"detalheLeadController",
						controllerAs:"vm",
						bindToController:true,
						resolve: {
							lead: function(){
								return lead_
							}
						}
						
					});
	           }
		         

	})

})();
