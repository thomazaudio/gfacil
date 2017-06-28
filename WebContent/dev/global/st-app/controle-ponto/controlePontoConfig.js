angular.module("adm").config(function($routeProvider,$httpProvider){

	$routeProvider.when("/registroponto",{

		templateUrl:"global/st-app/controle-ponto/template-route/listaPontos.html",
		controller:"stControl"

	});

	$routeProvider.when("/registrarponto",{

		templateUrl:"global/st-app/controle-ponto/template-route/registro-ponto.html",

	});
	
});
