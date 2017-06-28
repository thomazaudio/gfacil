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
	.factory("cacheGet",function($localStorage,$cookieStore,stUtil,$injector){

		var getNomeCache = function(){

			var login = $cookieStore.get("usuarioSistema").originalLogin;
			return "cacheGet"+login;
		}

		var _add = function(url,objetos){

			var nomeCache = getNomeCache();

			//Cria o objeto de cache caso não exista
			if(!$localStorage[nomeCache])
				$localStorage[nomeCache] = {};

			var itens  = $localStorage[nomeCache][url]||[];

			//Adiciona os objetos ao cache
			itens = itens.concat(objetos);

			$localStorage[nomeCache][url] = itens;

		}

		//Atualiza um objeto dentro de cacheGet utilizando id como referencia
		var _updateObject = function(url, objeto){

			var index = stUtil.buscaOb( $localStorage[getNomeCache()][url],objeto.id,"id");

			if(index!=-1){

				$localStorage[getNomeCache()][url][index] = objeto;

			}
			else{

				$localStorage[getNomeCache()][url].push(objeto);
			}

		}

		var _get = function(url, label, like){

			var nomeCache = getNomeCache();

			if(!$localStorage[nomeCache])
				return [];

			var itens =   $localStorage[nomeCache][url];

			if(label && like){

				itens = itens.filter(function(item){

					if(item[label]  && item[label].toLowerCase().indexOf(like.toLowerCase())!=-1)
						return item;
				});
			}

			return itens;

		}

		var _getObjectById = function(url,id){

			var index = stUtil.buscaOb( $localStorage[getNomeCache()][url],id,"id");

			return $localStorage[getNomeCache()][url][index];

		}

		var _cleanAll = function(url){

			if($localStorage[getNomeCache()])
				delete $localStorage[getNomeCache()][url];
		}

		var _del = function(url,id){

			var index = stUtil.buscaOb( $localStorage[getNomeCache()][url],id,"id");

			$localStorage[getNomeCache()][url].splice(index,1);

		}

		//Cache de itens offline,por enquanto cliente e produtos para otimizar vendas
		var _getOfflineCache = function(callback){

			var stService = $injector.get("stService");

			//Limpa cache
			_cleanAll("cliente");
			_cleanAll("produto");

			//Cache de clientes e produtos para otimizar vendas
			stService.getLikeMap("cliente",["disable=0"],0,0,'').success(function(clientes){

				_add("cliente",clientes.itens);

				stService.getLikeMap("produto",["disable=0"],0,0,'').success(function(produtos){

					_add("produto",produtos.itens);


				});

				if(callback)
					callback();

			});

		}


		return{
			add: _add,
			get: _get,
			cleanAll: _cleanAll,
			updateObject: _updateObject,
			getObjectById: _getObjectById,
			delObjectById:_del,
			getOfflineCache:_getOfflineCache
		}

	})


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
