"use strict";
(function(){
	angular.module("adm") 

	.controller("onboardIntroController",function($rootScope, $modalInstance){
		
		var vm = this;
		vm.proj = {data:[[100]], labels:[""]};
		vm.proj.colours =  [{
		    fillColor: "#3276b1",
		    strokeColor: "#3276b1",
		    highlightFill: "#3276b1",
		    highlightStroke: "#3276b1"
		}];

		
		vm.step = 1;
		vm.nextStep = function(){
			
			vm.step++;
			
		}
	
	})

})();
