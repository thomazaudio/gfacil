"use strict";
(function(){
	
	angular.module("adm")
	
	.directive('buttonOpenConfig', function(configUtil) {
		return {
			templateUrl:"global/st-app/app-config/template-module/button-config.html",
			
			scope:{
				activeTab:"=",
				label:"=",
				extraClass:"="
			},
			controller: function($scope){
				
				$scope.open = function(){
					
					configUtil.openConfig($scope.activeTab||0);
				}
			}
		}
	})	

})();
