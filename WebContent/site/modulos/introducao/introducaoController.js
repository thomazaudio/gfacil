angular.module("site").controller("introducaoController", function(lead, deviceDetector,$scope, $rootScope ,stService, $localStorage, $interval, leadUtil, $location){

	var youtubePlayer;
	
	$scope.lead = lead;
	
	//Resolver largura do video de acordo com o dispositivo
	var alturaTela = $(window).height();
	var larguraTela = $(window).width();
	var menor = larguraTela;
	if(alturaTela<menor)
		menor = alturaTela;
	
	if(deviceDetector.isDesktop()==true)
       menor = menor  - ((15 *  menor)/100);// - 15%
	   
	$scope.tamanhoVideo = menor+"px";
	
	var savedTimeVideo1 = false;
	var savedTimeVideo2 = false;
	var savedTimeVideo3 = false;
	var savedTimeVideo4 = false;
	var savedTimeVideo5 = false;
	var savedTimeVideo6 = false;
	
	
   $localStorage.lead = lead;
	
	$scope.cadastrar = function(lead){
		if(!lead.metrics)
			lead.metrics = {};
		
		lead.metrics.assistiuVideoIntro = $scope.videoIntro.getCurrentTime();
		$localStorage.lead  = lead;
		$location.path("cadastro");
	}
	

	stService.executeGet("config").success(function(data){

		var config = data.itens[0].confs;
		console.log("config: ");
		console.log(config);
		var totalVagas = parseInt( config.vagas_lead);
		var cadastros = parseInt(config.cadastros_lead);
		$scope.totalInscritos = cadastros;
		$scope.vagasRestantes = totalVagas  - cadastros;
		console.log("Vagas restantes: "+$scope.vagasRestantes);
	});

	$scope.step=0;

	$scope.next = function(lead){

		$scope.step++;
		
		 $localStorage.lead = lead;
		
        if($scope.step==1){
        	
        	//Origem a partir do facebook
    		if(true){
    			
    			$location.path("cadastro");
    		}else{
    			youtubePlayer.playVideo();
    		}
				
		}
        
       
		
		
	}


	$scope.playerVars = {
			controls: window.location.href.indexOf("localhost") ==-1? 0 : 1,
			autoplay: 0,
			modestbranding:1,
			rel:0
	};

	
	/*
	$interval(function(){

		if($scope.videoIntro.getCurrentTime()>=-1 ){

			$scope.showButtonProx = true;
		}
		

	},1000);


*/
	$scope.$on('youtube.player.ready', function ($event, player) {

        youtubePlayer = player;
		

	});


});