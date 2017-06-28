angular.module("adm").factory("loginService",function($http, config){
	
	var _logar  = function(login){
		
		return $http.post(config.baseUrl+"user/login/",login);
		
	};
	
	return {

		logar: _logar
		
	};

});