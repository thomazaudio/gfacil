"use strict";
(function(){
angular.module("adm").config(function($routeProvider,$httpProvider){

	//Lista de todas a movimentações
	$routeProvider.when("/movimentacao",{

		templateUrl:"global/st-app/app-mov/template-route/movimentacoes.html",
		controller:"movimentacoesController"

	}); 

})
})();

