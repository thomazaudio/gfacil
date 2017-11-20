"use strict";
(function(){
angular.module("adm").config(function($routeProvider,$httpProvider){

	$routeProvider.when("/cliente",{

		templateUrl:"global/st-app/app-pessoa/template-route/clientes.html",

	}); 


	$routeProvider.when("/fornecedor",{

		templateUrl:"global/st-app/app-pessoa/template-route/fornecedores.html",

	}); 

	$routeProvider.when("/funcionario",{

		templateUrl:"global/st-app/app-pessoa/template-route/funcionarios.html",

	}); 

	$routeProvider.when("/operadorsistema",{

		templateUrl:"global/st-app/app-pessoa/template-route/operadorsistema.html",

	}); 

})
})();

