"use strict";
(function(){
angular.module("adm").config(function($routeProvider,$httpProvider){

	//Detalhes de uma NFe
	$routeProvider.when("/detalhe-nfe/:chave",{

		templateUrl:"global/st-app/app-nfe/template-route/detalheNFe.html",
		controller:"detalheNFeController",
		resolve:{
			
			idNFe :function($route){
				
				return $route.current.params.chave;
				
			}
	
		}
	
	}); 
	
	//Lista de NFes
	$routeProvider.when("/nfe",{

		templateUrl:"global/st-app/app-nfe/template-route/listaNFe.html",
		controller: "listaNFeController",
		
	});

})
})();
