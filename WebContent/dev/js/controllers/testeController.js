"use strict";
(function(){
angular.module("adm").controller("testeController", function($scope, chronoService, stService, dateUtil){
	
	
	$scope.changeDate = function(data){
		
		console.log(dateUtil.getDate(data).getTime());
		console.log(new Date().getTime());
	}
	
   $scope.iniciar = function(){
	   
	   $scope.executando = true;
	   execute(0, 10);
	   
   }
	
	function execute(i, tam){
		
		if(i>=tam){
			$scope.executando = false;
			return;
		}
		
		stService.executeGet("/config").then(function(data){
			
			console.log("resposta: ");
			console.log(data);
			execute((i+1), tam);
		});
	}

	
})
})();