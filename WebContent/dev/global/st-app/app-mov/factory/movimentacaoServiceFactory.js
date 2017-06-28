"use strict";
(function(){

	angular.module("adm")

	.factory("movimentacaoService",function($http, config, $stModal, $filter){

		var _imprimirCupom = function(ids){

			var req ={

					method:"GET",
					params:{
						ids:ids,
					}
			};

			return $http.get(config.baseUrl+"movimentacao/imprime-cupom",req);

		}
		var _apagar  = function(mov,modo){

			return $http.post(config.baseUrl+"movimentacao/delete/",{mov:mov,modo:modo});

		};

		var _baixar  = function(mov){

			return $http.post(config.baseUrl+"movimentacao/add/",mov);

		};

		return {

			baixar: _baixar,
			apagar: _apagar,
			imprimirCupom: _imprimirCupom
		};

	})

})();

