angular.module("site").controller("introducaoController", function($scope, stService, $localStorage, $interval){


	$scope.step=0;

	$scope.responder = function(){

		$scope.step++;

	}
	

	$scope.playerVars = {
			controls: 0,
			autoplay: 0,
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