"use strict";
(function(){
angular.module("adm").controller("movimentacoesController",function($scope){
	
	$scope.activeTab = 0;
	
	$scope.changeTab = function(tab){
		
		$scope.activeTab = tab;
		
	}
	
})
})();