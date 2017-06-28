"use strict";
(function(){

	angular.module("adm") 

	.factory("cachePost",function($localStorage,$cookieStore,$rootScope){

		var _getByIdCache = function(idCache){

			return $localStorage.cachePost[idCache];

		}

		//Adiciona ou edita um objeto ao cache
		var _add = function(url,objeto,callback){

			//Filial corrente
			objeto.idFilial = $rootScope.currentFilial.id; 

			//O atributo idsAttr indica quais atributos devem ser setados ao reuperar o novo objeto ao salvar

			var icrementaId = false;

			//Resolve se vai ou não realizar a incrementação de id
			if(!objeto.idCache)
				icrementaId=true;

			if(!$localStorage.cachePost)
				$localStorage.cachePost = {};

			//idBase é definido no controller de login a cada login no sistema
			var idBase = $localStorage.baseIdCachePost;

			var idCache = objeto.idCache || idBase ;

			var uS = $cookieStore.get("usuarioSistema");

			var login;
			if(uS){
				//login garante que o cache pertença ao usuário correto
				login = uS.originalLogin;
			}
			else {
				login="shared@shared";
			}

			objeto.idCache = idCache;

			var obCache = $localStorage.cachePost[idCache];

			//Caso não exista cache para idCache
			if(!obCache){

				obCache = {url:url,
						objeto:objeto,
						login:login,
						idCache:idCache

				}
			}
			//Caso já exista em cache o objeto é apenas atualizado
			else{

				objeto.id  = $localStorage.cachePost[idCache].id;
				obCache.objeto = objeto;
			}

			//Atualiza o cache para o id
			$localStorage.cachePost[idCache] = obCache;

			if(icrementaId==true)
				$localStorage.baseIdCachePost = (idBase+1);



			//Retorna o objeto com 'idCachePost' para futuras referencias
			callback(objeto);
		}

		//Seta o id base para referencia pros demais itens do cache
		var _initBaseIdCachePost = function(){

			var caches = $localStorage.cachePost;
			var maior = 0;

			for(var key in caches){

				if(key>maior)
					maior=parseInt(key);
			}

			$localStorage.baseIdCachePost = (maior+1);

		}

		var _init = function(){

			_initBaseIdCachePost();
		}

		return{

			init:_init,
			add:_add,
			getByIdCache:_getByIdCache
		}

	})

})();
