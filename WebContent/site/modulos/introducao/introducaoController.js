angular.module("site").controller("introducaoController", function(origem, $scope, stService, $localStorage, $interval, leadUtil, $location){

	var youtubePlayer;
	
	var savedTimeVideo1 = false;
	var savedTimeVideo2 = false;
	
	if(!$localStorage.lead){
		
		leadUtil.saveLead({codOrigem: origem});
		
	}
	
	$scope.cadastrar = function(){
		leadUtil.setAction("clicou_botao_ir_formulario");
		$location.path("cadastro");
	}
	
	console.log("origem: "+origem);
	
	
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

		leadUtil.setAction("respondeu_pergunta_"+($scope.step+1));
		$scope.step++;
		
		if($scope.step==2){
			
			youtubePlayer.playVideo();
		}

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
		
		
		if($scope.videoIntro.getCurrentTime()>30 && savedTimeVideo1==false ){

			savedTimeVideo1 = true;
			leadUtil.setAction("assistiu_video_30");
			
		}
		
		if($scope.videoIntro.getCurrentTime()>50 && savedTimeVideo2==false ){

			savedTimeVideo2 = true;
			leadUtil.setAction("assistiu_video_50");
		}

	},1000);


	$scope.$on('youtube.player.ready', function ($event, player) {

        youtubePlayer = player;
		

	});


});