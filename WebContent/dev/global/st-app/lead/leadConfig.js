angular.module("adm").config(function($routeProvider, $httpProvider){

	//Inicio
	$routeProvider.when("/lead",{

		templateUrl:"global/st-app/lead/template-route/listaLead.html",

		controller:"listaLeadController"


	}); 

});

