angular.module("site").controller("guiaController", function($scope, stService, $localStorage, $interval){
	
	
	

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
	
	
});