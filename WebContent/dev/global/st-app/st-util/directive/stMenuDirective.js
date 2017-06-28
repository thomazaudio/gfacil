"use strict";

(function(){

	angular.module("adm")

	.directive("stMenu",function(){

		return{
			templateUrl:'global/st-app/st-util/template-module/stMenu.html',
			scope:{

				itens: "="
			},


			controller:function($scope, $rootScope, $route, anchorScroll, loginUtil, $location, Fullscreen, $localStorage, stUtil, pdvUtil, estoqueUtil){

				
				$scope.currentPath =  $route.current.$$route.originalPath;
				
				 $rootScope.$on('$routeChangeSuccess', function() {
					 
						var path =  $route.current.$$route.originalPath;
					   
						if(path=='/login')
							$scope.showMenu = false;
						else
							$scope.showMenu = true;
							    
				    });

				$scope.clickItemMenu  = function(item){

					$scope.atualPage  = item.label;
					$scope.currentPath = item.path;
					document.title = item.label || 'SierTech - Gestão Fácil';

					//Histórico de navegação
					$scope.routeHistory =   $scope.routeHistory || [];

					//Retira do histórico caso o item seja repetido
					var indexHistory = stUtil.buscaOb(  $scope.routeHistory,item.label,"label");

					if(indexHistory!=-1){

						$scope.routeHistory.splice(indexHistory,1);
					}

					$scope.routeHistory.push(item);
					$location.path(item.path);

				}


				$rootScope.absUrl = $location.$$absUrl;

				$scope.enableFullScreen=function(){

					Fullscreen.all();
				}

				$scope.enableFullScreen();

				$rootScope.menuCollapsed =true;

				$scope.changeCollapse = function(){

					$rootScope.menuCollapsed = ! $rootScope.menuCollapsed;
				}


				if(!$rootScope.usuarioSistema){

					$rootScope.usuarioSistema = $localStorage.usuarioSistema;
				}

				$scope.atualizarEstoque = function(){
					
					estoqueUtil.openEntradaMercadoria();
				}

				$scope.novaVenda = function(){

					pdvUtil.openVendaInModal();
				}

				//anchor
				$scope.gotoAnchor = function(id) {

					anchorScroll.scrollTo(id);

				};

				$scope.goToPageAnt = function(){

					window.history.back();

				}

				$scope.logOut = function(){

					loginUtil.logOut();

				}


			}	
		}

	})

})();

