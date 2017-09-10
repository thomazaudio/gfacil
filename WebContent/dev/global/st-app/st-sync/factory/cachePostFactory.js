"use strict";
(function(){

	angular.module("adm") 

	.factory("cachePost",function($localStorage,$cookieStore,$rootScope){

		//Adiciona ou edita um objeto ao cache
		var _add = function(url, objeto, callback){
			
			//Filial corrente
			var idFilial = 0;
			
			if($rootScope.currentFilial){
				
				idFilial  =  $rootScope.currentFilial.id;
				
			}
			
			
			objeto.idFilial = idFilial;
			url = url +"?filialId="+idFilial+"&&isCachePost=true";

			if(!$localStorage.cachePost)
				$localStorage.cachePost = [];

		
			var uS = $cookieStore.get("usuarioSistema");

			var login;
			if(uS){
				//login garante que o cache pertença ao usuário correto
				login = uS.originalLogin;
			}
			else {
				login="shared@shared";
			}

		
			var obCache = {
					    url:url,
						objeto:objeto,
						login:login
					
			}
			
			$localStorage.cachePost.push(obCache);


			//Retorna o objeto com 'idCachePost' para futuras referencias
			if(callback)
			callback(objeto);
		}

		

		return{

			add:_add
		}

	})

})();
