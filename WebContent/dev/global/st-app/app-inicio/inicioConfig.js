angular.module("adm").config(function($routeProvider,$httpProvider){

	//Inicio
	$routeProvider.when("/inicio",{

		templateUrl:"global/st-app/app-inicio/template-route/inicio.html",
		controller:"inicioController"	

	}); 

});

