"use strict";
(function(){
angular.module("adm").config(function($routeProvider,$httpProvider){

	//Lista de todas a movimentações
	$routeProvider.when("/lavoura",{

		templateUrl:"global/st-app/lavoura/template-route/lavoura.html",
		controller:"lavouraController"

	}); 

})
})();

