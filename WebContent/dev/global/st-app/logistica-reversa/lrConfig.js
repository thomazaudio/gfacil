angular.module("adm").config(function($routeProvider,$httpProvider){

	$routeProvider.when("/logisticareversa",{

		templateUrl:"global/st-app/logistica-reversa/template-route/listaLR.html",
		controllerAs:"vm",
		controller: "listaLRController",

	});
	
});

