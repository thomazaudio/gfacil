angular.module("adm").controller("testeController", function($scope, chronoService){
	
	
	$scope.time = Date.now();
    chronoService.addTimer('myTimer', { interval: 500 });
    chronoService.start();
	
});