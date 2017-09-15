"use strict";
(function(){

	angular.module("adm")

	.factory("stService",function($http, config, $cookieStore){

		//Opções
		var _saveOp  = function(descricao,valor){

			var req ={
					header : {'Content-Type' : 'application/json; charset=UTF-8'},
					method:"GET",
					params:{
						descricao:descricao,
						valor:valor
					}
			};
			return $http.get(config.baseUrl+"opcao/add",req);

		};	

		//Ooções Complexas
		var _getOpsOthers  = function(nomeObjeto,query){

			var req ={
					header : {'Content-Type' : 'application/json; charset=UTF-8'},
					method:"GET",
					params:{
						tabela:tabela,
						condicao:condicao
					}
			};
			return $http.get(config.baseUrl+"opcao/get/others",req);

		};	

		var _save  = function(nomeObjeto,objeto){

			return $http.post(config.baseUrl+nomeObjeto+"/add/",objeto);

		};

		var _getById =  function(nomeObjeto,id){

			var req ={

					method:"GET",
					params:{id:id}
			};
			return $http.get(config.baseUrl+nomeObjeto+"/get",req);
		};

		var _getValues =  function(nomeOb,attr,extras){

			var req ={

					method:"GET",
					params:{

						nomeOb:nomeOb,
						attr:attr,
						extras:extras||['']

					}
			};

			return $http.get(config.baseUrl+"opcao/get-values",req);
		};

		var _apagar = function(nomeObjeto,ids){

			return $http.post(config.baseUrl+nomeObjeto+"/delete/",ids);
		};

		var _getLike =  function(nomeObjeto,queryBusca, prop){

			var req ={

					method:"GET",
					params:{query:queryBusca,propriedade:prop}
			};

			return $http.get(config.baseUrl+nomeObjeto+"/busca/",req);
		};

		var _getLikeMap =  function(nomeObjeto,qs,pagina,max, extra){

			var req ={

					method:"GET",
					params:{qs:qs,pagina:pagina,max:max, extra: extra}
			};

			return $http.get(config.baseUrl+nomeObjeto+"/busca/map",req);
		};

		var _getAll =  function(nomeObjeto){
			var req ={

					method:"GET",

			};

			return $http.get(config.baseUrl+nomeObjeto,req);
		};

		var _executePost = function(url,objeto){

			return $http.post(config.baseUrl+url,objeto);
		};

		var _executeGet =  function(url,params){

			var req ={

					method:"GET",
					params:params
			};

			return $http.get(config.baseUrl+url,req);
		};

		//Projeções utilizando Control do próprio objeto
		var _getProjecoesFromObject = function(objeto,ops){

			ops.extra = ops.extra||'';
			ops.qs = ops.qs||[''];
			ops.max = ops.max||0;

			var req ={

					method:"GET",
					params:ops
			};

			return $http.get(config.baseUrl+objeto+"/projecoes",req);

		}

		var _getProjecoes = function(ops){

			ops.extra = ops.extra||'';
			ops.qs = ops.qs||[''];
			ops.max = ops.max||0;

			return $http.post(config.baseUrl+"projecao/get-projecoes/",ops);

		}

		return {

			getLikeMap: _getLikeMap,
			getLike: _getLike,
			getAll : _getAll,
			save: _save,
			apagar :_apagar,
			getById: _getById,
			getValues: _getValues,

			getProjecoes:_getProjecoes,
			getProjecoesFromObject:_getProjecoesFromObject,

			//Outros
			executePost:_executePost,
			executeGet:_executeGet,

		};

	})

})();
