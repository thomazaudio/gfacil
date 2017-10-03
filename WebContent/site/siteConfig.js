angular.module("site").config(function($routeProvider){


	$routeProvider.when("/intro/:origem",{

		templateUrl:"modulos/introducao/introducao.html",
		controller:"introducaoController",
		resolve: {

			origem: function($route){

				return $route.current.params.origem;
			}

		}

	})


	$routeProvider.when("/cadastro/:origem",{

		templateUrl:"modulos/cadastro/cadastro.html",
		controller:"cadastroController",
		resolve: {

			origem: function($route){
				return $route.current.params.origem;
			}

		}

	})
	
	
	$routeProvider.when("/cadastro",{

		templateUrl:"modulos/cadastro/cadastro.html",
		controller:"cadastroController",
		resolve: {

			origem: function(){
				return null;
			}

		}

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



});

