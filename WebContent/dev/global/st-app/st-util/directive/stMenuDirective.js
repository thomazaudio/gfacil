"use strict";

(function(){

	angular.module("adm")

	.directive("stMenu",function(){

		return{
			templateUrl:'global/st-app/st-util/template-module/stMenu.html',
			scope:{

				itens: "="
			},
			controller:function($scope, $rootScope, $route, $filter, anchorScroll, loginUtil, $location, Fullscreen, $localStorage, stUtil, pdvUtil, estoqueUtil, movUtil , config){

				$scope.appVersion = config.appVersion;
				
				$rootScope.$on('$routeChangeSuccess', function() {

					var path;

					if($route.current.$$route)
						path = 	$route.current.$$route.originalPath;

					else {
						$location.path("login");
						return;
					}

					if(path=='/login' || path=='/change-password' || path=='/video-apresentacao' || path=='/login-redirect' || path=="/login/:login")
						$scope.showMenu = false;
					else
						$scope.showMenu = true;

					$scope.clickItemMenu(path);

				});

				$scope.cadDespesa = function(){

					movUtil.openMov({tipo:1},null,function(mov){

						var mensagem = "Despesa no valor de R$ "+$filter("number")(mov.valor,2)+" cadastrada com sucesso!";

						stUtil.showMessage("",mensagem,"info");

						$route.reload();

					});
				}

				$scope.clickItemMenu  = function(path){

					path = path.replace("/","");

					var indexItem = stUtil.buscaOb( $scope.itens, path,"path");
					var item = $scope.itens[indexItem];

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

