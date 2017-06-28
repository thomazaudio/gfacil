angular.module("adm").config(function($routeProvider,$httpProvider){

	$routeProvider.when("/produto",{

		templateUrl:"global/st-app/app-estoque/template-route/listaProdutos.html",
		controller: "listaProdutoController",
		resolve:{

			produto:function(){

				return {};
			}
		}


	});

	//Listagem de entradas de mercadoria
	$routeProvider.when("/entradamercadoria",{

		templateUrl:"global/st-app/app-estoque/template-route/listaEntradaMercadoria.html",
		controller: "stControl"

	});

	//Editar entrada de mercadoria
	$routeProvider.when("/entradamercadoria/:id",{

		templateUrl:"global/st-app/app-estoque/template-route/entradaMercadoria.html",
		controller: "entradaMercadoriaController",
		resolve:{
			entradaMercadoria: function($route, stService){
				return stService.getById("entradamercadoria",$route.current.params.id);
			}
		}

	});

});


