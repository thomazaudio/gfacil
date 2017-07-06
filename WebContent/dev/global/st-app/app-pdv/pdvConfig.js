angular.module("adm").config(function($routeProvider,$httpProvider){

	$routeProvider.when("/pdv",{

		templateUrl:"vendas.html",
		controller:"stControl"

	}); 

	$routeProvider.when("/pdvficha/add",{

		controller:function($scope,	$uibModal){

			$uibModal.open({
				animation: true,
				templateUrl:"global/st-app/app-pdv/template-route/pdv-ficha.html",
				size:'lg',
				controller:"pdvFichaController",
				resolve:{

					pdv:function(){
						return {};
					},
					callback:function(){

						return null;
					}
				}

			});
		}

	}); 

	$routeProvider.when("/pdvficha/:id",{

		templateUrl:"global/st-app/app-pdv/template-route/pdv-ficha.html",
		controller:"pdvFichaController",
		resolve:{
			pdv:function(stService,$route){

				return stService.getById("pdv",$route.current.params.id);
			},
			callback: function(){

				return null;
			}
		}

	}); 

})
