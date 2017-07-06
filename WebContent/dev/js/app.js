"use strict";
(function(){
var app  = angular.module("adm",["angular-growl","angularSpinner","ngRoute","ds.clock","FBAngular","ng-mfb","ngCookies","angular.filter","ngStorage","ngAudio","ngDraggable","ui.bootstrap","ui.transition","angular-confirm","ngMessages","chart.js","youtube-embed","ui.utils.masks","angular-json-tree","ngAnimate","ngSanitize", "textAngular","angular-chrono"]);

app.run(['$rootScope', '$route','$modalStack','syncCachePost','$localStorage','$http','config','$location','$cookieStore','st','$filter','filialUtil',"stUtil","$templateCache", function($rootScope, $route,$modalStack, syncCachePost,$localStorage,$http,config,$location,$cookieStore,st,$filter,filialUtil,stUtil,$templateCache) {
	
	
	
	config.cacheTemplates();
	
	
	$rootScope.$on("modal.closing", function(){
		
		console.log("Modal fechou");
		
	});
	

	
	Chart.moneyFormat= function(value) {
		return $filter('number')(value,2);
	}

    //Evento para contabilizar o tempo de carregamento do sistema
    var tempoCarregamento = (new Date().getTime()-window.inicioCarregamento)/1000;
	st.evt({evento:"tempo_carregamento_sistema",descricao:tempoCarregamento});
	
    
    $rootScope.$on('$routeChangeStart', function(event,next, current) { 
    	
    	
    	//Filiais
    	if(!$rootScope.filiais){
    		
			filialUtil.getAllFiliais(function(){
				
			});
    		
    	}
    	
    	//Configurações do usuário e filias
    	if(!$rootScope.config){
    		
    		if(!$rootScope.config)
    			$rootScope.config = $localStorage.config;
    		
    		console.log("Original path: ");
    		console.log(next.$$route);
    		
    		if(!$rootScope.config && next.$$route.originalPath.indexOf("/usuario/:login")==-1){
    			
    		   $location.path("login");
    			
    		}
    		
    	}
    
    	
    	//Caso o usuário não esteja logado, é direcionado para página de login
    	if(!$cookieStore.get("usuarioSistema") && (!next.$$route || next.$$route.originalPath.indexOf("/usuario/:login")==-1) && next.$$route.originalPath.indexOf("/teste")==-1){
    		console.log("Não existe usuário logado no sistema");
    		$location.path("/login");
    	}
    	
    	
    	//Google analytics
    	if(next.templateUrl) {
            // interagindo com o Analytics através do objeto global ga
            ga('send', 'pageview', { page: next.templateUrl });
        }
    	
    	//Define se irá chamar event.preventDefault()
    	var preventDefault = false;
    	
    	
    	//Caso o menu mobile esteja visivel, é fechado
    	if($("#nav-header")[0].className.indexOf("open")!=-1){
    		$("#nav-header").removeClass("open");
    	}
        
    
    	//Caso tenha backdrop aberto, este é removido
    	$(".modal-backdrop").remove();
    	
    	var isModalOpen = function(){
    		
    		var modals = $(".modal");
    		
    		    		
    		for(var i in modals){
    			
    			if(modals[i].className=='modal in'){
    				
    				//Caso no-change-path seja definida no modal como 'true', no fechamento não ocorre a mudança de path
    				if(modals[i].getAttribute('no-change-path')=='true');
    				  preventDefault =true;
    				  
    				return true;
    			}
    		}
    		return false;
    	}
    	
    	if(isModalOpen()){
    		  $(".modal").modal('hide');
    	 }

    	var top = $modalStack.getTop();
    	
         if (top) {
             $modalStack.dismiss(top.key);
         }
         
         
         if(preventDefault==true)
            event.preventDefault();
         
         
            
	
     });
}]);



})();
