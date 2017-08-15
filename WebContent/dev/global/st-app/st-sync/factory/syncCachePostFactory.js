"use strict";
(function(){

	angular.module("adm") 

	.factory("syncCachePost",function($localStorage, $interval, stService, $rootScope, $cookieStore, stUtil, onlineStatus, $route){

		var _start = function(){
			
			
			if(!$localStorage.cachePost)
				$localStorage.cachePost = [];
			
			var executando = false;
			
			var executar = function(){
				
				console.log("executar()");
				console.log("executando: "+executando);
				
				if(executando==true || onlineStatus.isOnline()==false)
					return;
				
				executando = true;
				
				executePosts(0, function(){
					
					executando = false;
					
				});
			}

	
			function executePosts(index, callback){
				
				if(!$localStorage.cachePost[index]){
					callback();
					return;
				}

				stService.executePost($localStorage.cachePost[index].url, $localStorage.cachePost[index].objeto).success(function(data){

					$localStorage.cachePost.splice(index,1);
					executePosts(index+1, callback)
					
				}).error(function(){
					
					callback();
					
				});
			}

		  $interval(executar, 30000);
			
		}

		return{

			start:_start
		}

	})

})();
