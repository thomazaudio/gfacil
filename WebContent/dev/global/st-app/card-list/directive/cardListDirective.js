"use strict";

(function(){

	angular.module("adm")

	.directive('cardList', function (){
		return {
			restrict: 'E',
			transclude:true,
			scope:{

				ob:"=",
				pivo:"=",
				editFunction:"=",
				deleteFunction:"=",
				index:"@",
				icon:"@"
				
			},

			templateUrl:'global/st-app/card-list/template-module/cardListDirective.html',
			bindToController:true,
			controllerAs:"vm",
			controller: "cardListController"
		}
	})

})();

