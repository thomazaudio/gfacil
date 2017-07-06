angular.module('adm').factory('config',function($location, $rootScope, $http, $templateCache){

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
		
		
		var caches = [
		     {url: "global/st-app/st-modal/template-module/modalContent.html", key: "modalContent.html" },
		     {url: "global/st-app/app-autocomplete/template-module/buscaAutoCompleteObject.html", key: "buscaAutoCompleteObject.html"},
		     {url: "global/st-app/app-autocomplete/template-module/autoCompleteObject.html", key: "autoCompleteObject.html"},
		     {url: "global/st-app/app-pdv/template-module/modalPosVenda.html", key: "modalPosVenda.html" },
		     {url: "global/st-app/app-pdv/template-module/pdv-ficha.html", key:"pdv-ficha.html" },
		     {url: "global/st-app/app-filial/template/alertFilial.html", key:"alertFilial.html"},
		     {url: "global/st-app/app-pedido/template-module/appSimplePedido.html" , key:"appSimplePedido.html"},
		     {url: "global/st-app/app-pedido/template-module/appListSimplePedido.html", key:"appListSimplePedido.html"},
		     {key: "buttonEstoque.html", url:  "global/st-app/app-estoque/template-module/buttonEstoque.html" },
		     {key: "stToggle.html", url: "global/st-app/st-util/template-module/stToggle.html"},
		     {key: "itensPedido.html", url:"global/st-app/app-pedido/template-module/itensPedido.html"},
		     {key: "parcelaMov.html", url:"global/st-app/app-mov/template-module/parcelaMov.html"},
		     {key: "buttonBaixaMov.html", url:"global/st-app/app-mov/template-module/buttonBaixaMov.html"},
		     {key: "buttonBaixaMov.html", url:"global/st-app/app-mov/template-module/buttonBaixaMov.html"},
		     {key: "stModal.html", url: "global/st-app/st-modal/template-module/stModal.html"},
		     {key: "vendas.html", url: "global/st-app/app-pdv/template-route/vendas.html"},
		     {key: "stModal.html", url:"global/st-app/st-modal/template-module/stModal.html"}
		              
		];
		
		for( var i in caches){
			
			cacheTemplate(caches[i]);
			
		}
		
		function cacheTemplate(ob){
			
			$http.get(ob.url).success(function(data){
				$templateCache.put(ob.key, data);
			});
		}
		
		
	}
	
	

	return {
		cacheTemplates: cacheTemplates,
		baseUrl: getUrlBase(),
		path: getPath()
	};


}); 