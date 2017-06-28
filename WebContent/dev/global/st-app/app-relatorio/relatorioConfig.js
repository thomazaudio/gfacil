angular.module("adm").config(function($routeProvider,$httpProvider){

	$routeProvider.when("/relatorio",{

		templateUrl:"global/st-app/app-relatorio/template-route/relatorio.html",
		controller:"relatorioController"

	}); 

});