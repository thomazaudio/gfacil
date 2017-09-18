angular.module('adm').factory('config',function($location, $rootScope, $http, $templateCache){

	
	function getAppVersion(){
		
		return "CeasaPlus 2.4"
	}
	
	function getUrlBase(){
		
		//Servidor de teste local (Utilizado para deploy do .war gerado pelo jenkins)
		if($location.$$absUrl.indexOf("7070/Albar")!=-1)
			 return "http://"+$location.$$host+":7070/Albar/";
			
		else if($location.$$absUrl.indexOf("8080/Albar")!=-1)
		  return "http://"+$location.$$host+":8080/Albar/";
		
		else if($location.$$absUrl.indexOf("8080")!=-1)
			  return "http://"+$location.$$host+":8080/";
		
        //SSL
		else if($location.$$absUrl.indexOf("https")!=-1)
			return "https://"+$location.$$host+"/";
                else
                  return "http://"+$location.$$host+"/";
		
	}
	
	
	function getPath(){
		
		return $location.path();
	}
	
	
	function cacheTemplates (){
		//Função substituida com a inclusão com service-worker
		
	}
	
	

	return {
		cacheTemplates: cacheTemplates,
		baseUrl: getUrlBase(),
		path: getPath(),
		appVersion: getAppVersion()
	};


}); 