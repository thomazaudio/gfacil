"use strict";
(function(){

	angular.module("adm")

	.controller("filialListController",function($scope, $rootScope, $localStorage, cacheGet, $route, filialUtil, stUtil, configUtil){

		$scope.filiaisPermitidas = null;

		if($rootScope.usuarioSistema.filiaisPermitidas)
			$scope.filiaisPermitidas= $rootScope.usuarioSistema.filiaisPermitidas.split(",");

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


			console.log("usuarioSistema: ");
			console.log($rootScope.usuarioSistema);

		


			if(filial.bloqueada==1){

				stUtil.showMessage("","A origem '"+filial.nome+"' está bloqueada.","danger");
				return;
			}

			if($scope.filiaisPermitidas!=null && $scope.filiaisPermitidas.indexOf(filial.id+"")==-1){

				stUtil.showMessage("","A origem '"+filial.nome+"' não está disponível","danger");
				return;
			}

			
			$scope.currentFilial = filial;
			$rootScope.currentFilial = filial;
			$localStorage.currentFilial = filial;


			configUtil.setConfig("currentFilialId",filial.id+"");
			configUtil.setConfig("labelCurrentFilial",filial.xNome);


			//atualizar caches
			cacheGet.getOfflineCache(function(){

				stUtil.showMessage("","Origem alterada para  '"+filial.nome+"'.","info");

				if($scope.inModal!=true)
					$route.reload();

			});

		}

	});

})();
