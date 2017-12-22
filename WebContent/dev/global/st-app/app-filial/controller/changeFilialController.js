"use strict";
(function(){

	angular.module("adm")

	.controller("changeFilialController",function($scope, $rootScope, $localStorage, cacheGet, $route, filialUtil, stUtil,stService,  configUtil, $modalInstance){

		
		stService.executeGet("/operadorsistema").success(function(data){
			
			$scope.operadores = [{id:0, nome:"Todos"}];
			$scope.operadores = $scope.operadores.concat(data.itens);
			$scope.operadorEsc = 	$rootScope.currentOperador || $scope.operadores[0];
			
		});
		
		
		
		$rootScope.$watch("filiais",function(filiais){

			if(filiais){
				$scope.filiais = filiais;
				$scope.filialEsc  = $rootScope.currentFilial ||  filiais[0];
			}
			
			$scope.filiaisPermitidas = null;

			if($rootScope.usuarioSistema.filiaisPermitidas)
				$scope.filiaisPermitidas= $rootScope.usuarioSistema.filiaisPermitidas.split(",");
		});

		$scope.config = $rootScope.config;
		$scope.filiais =$rootScope.filiais;
		$scope.currentFilial = $rootScope.currentFilial;

		//Abre detalhes de um filial
		$scope.openDetalheFilial = function(filial){

			filialUtil.openDetalheFilial(filial);
		}

		$scope.fecharModal = function(){
			
			$modalInstance.close();
		}
		
		//Altera a filial atual do sistema
		$scope.alterarFilialAndOperador = function(filial, operador){

			

			if(filial.bloqueada==1){

				stUtil.showMessage("","A origem '"+filial.nome+"' está bloqueada.","danger");
				return;
			}

			if($scope.filiaisPermitidas!=null && $scope.filiaisPermitidas.indexOf(filial.id+"")==-1){

				stUtil.showMessage("","A origem '"+filial.nome+"' não está disponível para este usuário","danger");
				return;
			}

			
			$scope.currentFilial = filial;
			$rootScope.currentFilial = filial;
			$localStorage.currentFilial = filial;
			$rootScope.currentOperador = operador;
			$localStorage.currentOperador = operador;

			configUtil.setConfig("currentFilialId",filial.id+"");
			configUtil.setConfig("labelCurrentFilial",filial.xNome);


			//atualizar caches
			cacheGet.getOfflineCache(function(){

				stUtil.showMessage("","Origem alterada para  '"+filial.nome || filial.xNome+"'.","info");

				if($scope.inModal!=true)
					$route.reload();

			});

		}

	});

})();
