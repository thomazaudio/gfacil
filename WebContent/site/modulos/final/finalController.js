angular.module("site").controller("finalController", function($scope, stService, $localStorage, $interval, $location){
	
	
	$scope.playerVars = {
		    controls: 0,
		    autoplay: 1,
		    modestbranding:1,
		    rel:0
		};
	
	
	$interval(function(){
		
		
		if($scope.videoIntro.getCurrentTime()>5 ){
			
			$scope.showButtonProx = true;
		}
		
		
		
	},1000);
	
	$scope.$on('youtube.player.ready', function ($event, player) {
	    
		
		
	  });
	
	$scope.toCompra = function(){
		
		$location.path("compra");
	}
	
	
});