(function(){

	angular.module("adm") 

	.factory('tutorialUtil', function($rootScope,$filter, stUtil, $uibModal){

		var _openDetalheTutorial = function(tutorialItem){

			$uibModal.open({
				animation: true,
				templateUrl:"global/st-app/st-tutorial/template-module/detalheTutorial.html",
				size:'lg',
				controllerAs:"vm",
				bindToController:true,
				controller:function($scope, deviceDetector){

					var vm = this;
					vm.tutorial = tutorialItem;

					if(deviceDetector.isMobile()==true){
                          vm.linkTutorial  =  tutorialItem.linkMobile;
					}
					else{
						vm.linkTutorial  =  tutorialItem.linkDesktop;
					}
					
					var youtubePlayer;

					vm.playerVars = {
							modestbranding:1,
							rel:0,
							start: 30,
							end: 39
					};

					$scope.$on('youtube.player.ready', function ($event, player) {

						youtubePlayer = player;
						youtubePlayer.playVideo();

					});


				}
			});


		}

		return {

			openDetalheTutorial:  _openDetalheTutorial

		}

	})

})();
