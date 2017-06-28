"use strict";
(function(){

	angular.module("adm")

	.controller("filialListController",function($scope,$rootScope,$localStorage,cacheGet,$route,filialUtil,stUtil){

		$rootScope.$watch("currentFilial",function(currentFilial){

			if(currentFilial)
				$scope.labelCurrentFilial = currentFilial.xNome;
		});

		$rootScope.$watch("filiais",function(filiais){

			if(filiais)
				$scope.filiais = filiais;
		});

		$scope.config = $rootScope.config;
		$scope.filiais =$rootScope.filiais;
		$scope.currentFilial = $rootScope.currentFilial;

		//Abre detalhes de um filial
		$scope.openDetalheFilial = function(filial){

			filialUtil.openDetalheFilial(filial);
		}

		//Altera a filial atual do sistema
		$scope.alterarFilial = function(filial){
			
			
			if(filial.bloqueada==1){
				
				stUtil.showMessage("","A origem '"+filial.nome+"' não está disponível.","danger");
				return;
			}

			$scope.currentFilial = filial;
			$rootScope.currentFilial = filial;
			$localStorage.currentFilial = filial;

			//atualizar caches
			cacheGet.getOfflineCache(function(){

				if(!$scope.inModal ||$scope.inModal==false)
					$route.reload();

			});

		}

	});

})();
