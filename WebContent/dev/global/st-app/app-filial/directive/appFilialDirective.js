"use strict";
(function(){

	angular.module("adm")
    
	.directive("filialList",function(filialUtil){

		return{
			templateUrl:"global/st-app/app-filial/template/filialList.html",
			scope:{
				inModal:"="//Indica se está setada dentro de um modal (Para não charmar $route.reload())
				
			},

			controller:"filialListController"
			
		}

	})
	
	.directive("buttonFilialListWithModal",function($uibModal){

		return{
			restric:"E",
			templateUrl:"global/st-app/app-filial/template/buttonFilialListWithModal.html",
		    controller: function ($scope, $rootScope){
				
				   $scope.currentFilial = $rootScope.currentFilial;
				   $rootScope.$watch("currentFilial",function(currentFilial){

						if(currentFilial)
							$scope.labelCurrentFilial = currentFilial.xNome;
					});
				   $scope.config = $rootScope.config;

					$scope.open = function(){
						
						$uibModal.open({
							animation: true,
							templateUrl:"global/st-app/app-filial/template/filialListWithModal.html",
							size:'lg',
							controller: function($scope, $modalInstance){
								
								$scope.fechar = function(){
									
									console.log("Chamou");
									$modalInstance.close();
								}
								
							}
							
						});
						
					}
				
			}
			
		}

	})
	
	.directive("alertFilial",function(filialUtil){

		return{
			templateUrl:"global/st-app/app-filial/template/alertFilial.html",
			scope:{
				label:"="
			},
			controller:function($scope,$rootScope){
				
				$scope.currentFilial = $rootScope.currentFilial;
			}

		}

	})
	
	.directive("setAllFilials",function(filialUtil){

		return{
			templateUrl:'global/st-app/app-filial/template/setAllFilials.html',
			scope:{
				objeto:"=",
				defaultValue:"=",//true ou false
			},
			controller :function($scope,$rootScope){
				
				
				console.log("defaultValue antes: ");
				console.log(angular.copy($scope.defaultValue));
				
				if($scope.defaultValue=="true")
					$scope.defaultValue = true;
				else if($scope.defaultValue=="false")
					$scope.defaultValue=false;
				
				$scope.filiais = $rootScope.filiais;
			
				if(!$scope.objeto)
					$scope.objeto  = {allFilials:true};
				
				if(!$scope.objeto.id){
					$scope.objeto.allFilials = $scope.defaultValue || false;
					console.log("defaultValue: ");
					console.log($scope.defaultValue);
				}
				
			}
		
		}
	
	})

})();

