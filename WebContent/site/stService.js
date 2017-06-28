"use strict";
(function(){

	angular.module("site")

	.factory("stService",function($http, config){

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

	
		return {

			//Outros
			executePost:_executePost,
			executeGet:_executeGet,

		};

	})

})();
