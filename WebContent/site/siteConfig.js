angular.module("site").config(function($routeProvider){

	
	$routeProvider.when("/introducao",{

	    templateUrl:"modulos/introducao/introducao.html",
		controller:"introducaoController"

	})
	
	
	$routeProvider.when("/cadastro",{

	    templateUrl:"modulos/cadastro/cadastro.html",
		controller:"cadastroController"

	})
	
	
	$routeProvider.when("/tester",{

	    templateUrl:"modulos/cadastro-tester/cadastro-tester.html",
		controller:"cadastroTesterController"

	})
	
	
	$routeProvider.when("/cadastro-sucesso",{

	    templateUrl:"modulos/cadastro-obrigado/cadastroObrigado.html",
		controller:"cadastroObrigadoController"

	})
	
	
	$routeProvider.when("/guia",{

	    templateUrl:"modulos/guia/guia.html",
		controller:"guiaController"

	})
	
	
	$routeProvider.when("/final",{

	    templateUrl:"modulos/final/final.html",
		controller:"finalController"

	})
	
	$routeProvider.when("/compra",{

	    templateUrl:"modulos/compra/compra.html",
		controller: "compraController"

	})
	
	$routeProvider.when("/compra2",{

	    templateUrl:"modulos/compra/compra2.html",
		controller:function(){
			
			
			
		}

	})
	
	

	
	$routeProvider.otherwise({redirectTo: "/cadastro"});

});

