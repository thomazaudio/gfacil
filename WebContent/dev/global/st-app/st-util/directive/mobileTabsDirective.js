"use strict";
(function(){

	angular.module("adm") 
	
	
	//Diretiva necessária para upload de arquivos
	.directive('mobileTabs',function (onlineStatus) {
		return {
			restrict: 'E',
			templateUrl:"global/st-app/st-util/template-module/mobileTabs.html",
			scope:{
				activeTab:"=",
				tabs: "="
			},
			controllerAs:"vm",
			bindToController:true,
			controller: function() {
				
				var vm = this;
				vm.activeTab = 	vm.activeTab || 0;
				
				vm.alterarTab =function (tab){

					vm.activeTab = tab;

				}
				
			}
		};
	})

})();
