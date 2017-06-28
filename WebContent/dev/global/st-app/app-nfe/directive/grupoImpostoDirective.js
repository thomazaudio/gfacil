"use strict";
(function(){

	angular.module("adm")

	//Select simples (Sem auto-complete)
	.directive("grupoImposto",function(stService,nfeUtil){

		return{
			restrict:"E",
			templateUrl:"global/st-app/app-nfe/template-module/grupoImpostoDirective.html",
			scope:{

				ngModel:"="//ng-model associado	   
			},
			controller:function($scope){

				//Cadastra um novo grupo ou editar
				$scope.cadGrupoImposto = function(grupo){

					nfeUtil.openGrupoImposto(grupo,function(grupo){

						$scope.itens.push(grupo);
						$scope.ngModel = grupo;
					});
				}

				//Recupera todos os objetos
				stService.getAll("grupoimposto").success(function(data){

					$scope.itens = data.itens;
				});

			}

		}
	})

})();
