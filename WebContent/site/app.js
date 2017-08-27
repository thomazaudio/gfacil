
var app  = angular.module("site",["ngRoute","ngStorage","youtube-embed"]);


app.factory("leadUtil", function(stService, $localStorage, $rootScope, config){
	
	var _saveLead = function(lead, callback){
	
	
		lead = lead || {};
		
		lead.versaoLandingPage = config.versaoLandingPage;
		lead.alturaTela = $(window).height()+"";
		lead.larguraTela = $(window).width()+"";
		
		stService.executePost("lead/add/", lead).success(function(data){
			
			$localStorage.lead = data.item;
			$rootScope.lead = data.item;
			callback(data.item);
		});
		
	}
	
	var _setAction = function(action){
		
		$localStorage.lead.lastAction = action;
		$rootScope.lead.lastAction = action;
		_saveLead($rootScope.lead);
	}
	
	return {
		saveLead: _saveLead,
		setAction: _setAction
	}
})

app.run(['$rootScope', '$route', 'stService', '$localStorage', '$location', function($rootScope, $route, stService, $localStorage, $location) {
	
	
	$rootScope.lead = $localStorage.lead;
	
	
	
	
	
	 $rootScope.$on('$routeChangeSuccess', function() {
		 
		if($localStorage.lead){
			
			$localStorage.lead.custom_1 = $route.current.$$route.originalPath;
		
			stService.executePost("lead/add/",$localStorage.lead).success(function(){
				
			});
	    }
		
			    
    });
	 
	 
	 //SDK do facebook
	  window.fbAsyncInit = function() {
	    FB.init({
	      appId            : '1504858069577036',
	      autoLogAppEvents : true,
	      xfbml            : true,
	      version          : 'v2.9'
	    });
	    FB.AppEvents.logPageView();

		$(document).ready(function(){
	        FB.Event.subscribe('comment.create', function(response) {
	        	//Inserção do pixel do acebook
	    		 fbq('track', 'comentou', {
	    		
	    		 });
	    		 
	    	
	    		$localStorage.lead.transientAction="comentou";
	    		stService.executePost("lead/add/", $localStorage.lead).success(function(){
	 				
	 			});
	    		 
	        });

	     });
		
	  };
	
	  (function(d, s, id){
	     var js, fjs = d.getElementsByTagName(s)[0];
	     if (d.getElementById(id)) {return;}
	     js = d.createElement(s); js.id = id;
	     js.src = "//connect.facebook.net/en_US/sdk.js";
	     fjs.parentNode.insertBefore(js, fjs);
	   }(document, 'script', 'facebook-jssdk'));

	(function(d, s, id) {
	  var js, fjs = d.getElementsByTagName(s)[0];
	  if (d.getElementById(id)) return;
	  js = d.createElement(s); js.id = id;
	  js.src = "//connect.facebook.net/pt_BR/sdk.js#xfbml=1&version=v2.9";
	  fjs.parentNode.insertBefore(js, fjs);
	}(document, 'script', 'facebook-jssdk'));
    
	//FIM sdk facebook
            
	
     
}]);


