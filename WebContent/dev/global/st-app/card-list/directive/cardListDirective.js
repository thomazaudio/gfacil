"use strict";

(function(){

	angular.module("adm")

	//Diretiva para lista de movimentações
	.directive('cardList', function (){
		return {
			restrict: 'E',
			transclude:true,
			scope:{

				ob:"=",
				pivo:"=",
				editFunction:"=",
				deleteFunction:"="
				
			},

			templateUrl:'global/st-app/card-list/template-module/cardListDirective.html',
			bindToController:true,
			controllerAs:"vm",
			controller: "cardListController"
		}
	})

})();

