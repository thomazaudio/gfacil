"use strict";
(function(){
angular.module("adm").config(function($routeProvider,$httpProvider){

	$routeProvider.when("/cadastros",{

		templateUrl:"global/st-app/cadastros/template-route/cadastros.html",
		controller:"cadastrosController"

	}); 

})
})();

