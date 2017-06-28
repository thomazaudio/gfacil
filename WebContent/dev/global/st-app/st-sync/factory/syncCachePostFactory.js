"use strict";
(function(){

	angular.module("adm") 

	.factory("syncCachePost",function($localStorage,$interval,stService,$rootScope,$cookieStore,stUtil){

		var _start = function(){

			var faltaExecutar=0;

			if(!$localStorage.cachePost)
				$localStorage.cachePost = [];

			function execute(i){

				$localStorage.cachePost[i].objeto.id = $localStorage.cachePost[i].objeto.id ||  $localStorage.cachePost[i].id;

				stService.executePost($localStorage.cachePost[i].url,$localStorage.cachePost[i].objeto).success(function(data){

					faltaExecutar--;

					if(data){

						var item = data.item;
						$localStorage.cachePost[i].id = item.id;
					}

					delete $localStorage.cachePost[i].objeto;


				}).error(function(){
					faltaExecutar--;
				});
			}

			function countCachePost(){

				var count = 0;

				var cache = $localStorage.cachePost;

				for(var key in cache){

					if(cache[key] && cache[key].objeto)
						count++;
				}

				return count;

			}

			function sync(){

				//Verifica se existe cache em execução
				if(faltaExecutar<=0){

					if(!$localStorage.cachePost){
						faltaExecutar=0;
					}

					else {

						faltaExecutar = countCachePost();

					}

					var originalLogin = null;

					if($cookieStore.get("usuarioSistema"))
						originalLogin = $cookieStore.get("usuarioSistema").originalLogin;
					else
						originalLogin = "shared@shared";

					for(var i in $localStorage.cachePost){

						if($localStorage.cachePost[i]  && originalLogin && $localStorage.cachePost[i].objeto && originalLogin==$localStorage.cachePost[i].login){


							execute(i);
						}
						else {

							//faltaExecutar--;
						}

					}

				}

			}

			$interval(sync,2000);

		}

		return{

			start:_start
		}

	})

})();
