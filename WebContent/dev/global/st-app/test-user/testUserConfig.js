angular.module("adm").config(function($routeProvider, $httpProvider){

	//Lista de todas a movimentações
	$routeProvider.when("/testdefinition",{

		templateUrl:"global/st-app/test-user/template-route/testDefinition.html",
		controller: function($scope, stService, stUtil, $uibModal){
			  
			$scope.openDetalhe = function(definition){
				
				var modal = $uibModal.open({
					animation: true,
					templateUrl:"global/st-app/test-user/template-module/detalheTestDefinition.html",
					size:'lg',
					controller: function($scope, $modalInstance){
						
						$scope.definition = definition || {};
						$scope.salvar = function(){
							
							stService.executePost("testdefinition/add/",$scope.definition).success(function(){
								
								 $modalInstance.close();
								
							});
						}
						
					}
					
				});
			}
			
		}
	
	}); 

});

