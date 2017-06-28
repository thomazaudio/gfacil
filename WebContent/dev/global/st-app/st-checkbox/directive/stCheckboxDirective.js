"use strict";

(function(){

	angular.module("adm")

	.directive("stCheckbox",function(movUtil){

		return{
			templateUrl:'global/st-app/st-checkbox/template-module/stCheckbox.html',
			scope:{
				ngModel:"=",
				label:"="
			},
			
		}

	})

})();

