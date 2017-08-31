"use strict";
(function(){

	angular.module("adm") 

	//Diretiva necessária para upload de arquivos
	.directive('syncCachePost',function (onlineStatus) {
		return {
			restrict: 'E',
			templateUrl:"global/st-app/st-sync/template-module/syncCachePost.html",
			scope:{

			},
			controllerAs:"vm",
			bindToController:true,
			controller: function($localStorage, $interval, $timeout, stService, $rootScope, stUtil, onlineStatus, $scope, loginUtil) {

				var vm = this;

				var _start = function(){

					if(!$localStorage.cachePost)
						$localStorage.cachePost = [];

					var executando = false;

					var executar = function(){

						if(executando==true || onlineStatus.isOnline()==false|| loginUtil.isLogado()==false)
							return;

						executando = true;
						$rootScope.executandoCachePost = true;

						vm.sizeCachePostInExcecution = $localStorage.cachePost.length;

						executePosts(0,$localStorage.cachePost.length);
					}


					function executePosts(i, tam){

						if(i>=tam ||  !$localStorage.cachePost[0] || onlineStatus.isOnline()==false){

							executando = false;
							$rootScope.executandoCachePost = false;
							return;
						}

						vm.indexCachePostInExcecution = i+1;

						stService.executePost($localStorage.cachePost[0].url, $localStorage.cachePost[0].objeto).success(function(data){

							$localStorage.cachePost.splice(0,1);
							$timeout(function(){
								executePosts((i+1), tam);

							}, 300);


						}).error(function(){

							$timeout(function(){
								executePosts((i+1), tam);

							}, 300);


						});
					}

					$interval(executar, 5000);

				}

				_start();
			}
		};
	})

})();
