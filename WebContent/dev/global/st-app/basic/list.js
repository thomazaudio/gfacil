"use strict";
(function(){
	angular.module("adm") 
	.config(function($routeProvider, $httpProvider){

	//Rota para listagem dos objetos
	$routeProvider.when("/_entidade_lower_",{

		templateUrl:"app/_entidade_lower_/list.html",

		controller: function(_entidade_lower_Util, stService, $route, stUtil, $scope){
			
			 //Editar item ou cadastrar novo
			$scope.openItem = function(item){
				
				_entidade_lower_Util.openItem(item, function(event, modal){
					
					/*
					 Possíveis valores para event
					 
					 * add - O item foi salvo
					 * add-error - erro ao salvar o item
					 * delete - O item foi deletado
					 * delete-error -  Erro ao deletar o objeto
					
					 */
					
					
				});

			}

			//Deletar item
			$scope.deletarItem = function(item){
						
				stService.executePost("_entidade_lower_/delete/", [item.id]).success(function(){
					
					stUtil.showMessage("","Item deletado com sucesso","info");	
					$route.reload();
					
				}).error(function(){
					
					stUtil.showMessage("","Ocorreu um erro ao deletar","danger");	
				});

			}

		}

	}); 

})

})();
