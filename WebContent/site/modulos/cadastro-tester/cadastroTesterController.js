angular.module("site").controller("cadastroTesterController", function($scope, stService, $localStorage, $interval){
	
	
	$scope.step=1;
	
	
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
	    
		console.log("O vídeo está rodando");
		
		console.log("player: ");
		console.log(player);
		
	  });
	
	
	
});