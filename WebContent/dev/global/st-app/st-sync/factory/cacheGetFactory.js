"use strict";
(function(){

	angular.module("adm") 

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

})();
