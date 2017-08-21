angular.module("site").controller("introducaoController", function($scope, stService, $localStorage, $interval){

	stService.executeGet("config").success(function(data){

		var config = data.itens[0].confs;
		var totalVagas = parseInt( config.vagas_lead);
		var cadastros = parseInt(config.cadastros_lead);
		$scope.totalInscritos = cadastros;
		$scope.vagasRestantes = totalVagas  - cadastros;
		console.log("Vagas restantes: "+$scope.vagasRestantes);
	});

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