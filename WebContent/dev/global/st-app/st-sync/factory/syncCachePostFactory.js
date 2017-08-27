"use strict";
(function(){

	angular.module("adm") 

	.factory("syncCachePost",function($localStorage, $interval, stService, $rootScope, $cookieStore, stUtil, onlineStatus, $route){

		var _start = function(){
			
			
			if(!$localStorage.cachePost)
				$localStorage.cachePost = [];
			
			var executando = false;
			
			var executar = function(){
				
				console.log("cachePost: ");
				console.log($localStorage.cachePost);
				
				if(executando==true || onlineStatus.isOnline()==false)
					return;
				
				executando = true;
				
				executePosts();
			}

	
			function executePosts(){
				
				console.log("cachePost[0]");
				console.log($localStorage.cachePost[0]);
				
				if(!$localStorage.cachePost[0]){
					
					executando = false;
					return;
				}

				stService.executePost($localStorage.cachePost[0].url, $localStorage.cachePost[0].objeto).success(function(data){

					$localStorage.cachePost.splice(0,1);
					executePosts();
					
				}).error(function(){
					
					executePosts();
					
				});
			}

		  $interval(executar, 10000);
			
		}

		return{

			start:_start
		}

	})

})();
