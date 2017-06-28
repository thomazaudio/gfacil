"use strict";
(function(){
	angular.module("adm") 

	.controller("cardListController",function(stUtil){

		var vm = this;
	
		console.log("pivo: "+vm.pivo);
		console.log("ob:");
		console.log(vm.ob);
		vm.labelPivo = stUtil.getValueOfNivel(vm.ob,vm.pivo);
		

	})

})();
