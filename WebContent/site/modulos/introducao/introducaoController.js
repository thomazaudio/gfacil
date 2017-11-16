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
	

	if(lead.id){
		
		stService.executeGet("/lead/get-basic", {id: lead.id }).success(function(data){
			
			lead.nome = data.item.nome;
			lead.telefone = data.item.telefone;
			leadUtil.saveLead(lead);
			
		});
		
	}else{
		
		leadUtil.saveLead(lead);
		
	}
	
	$scope.cadastrar = function(){
		leadUtil.setAction("clicou_botao_ir_formulario");
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
		
		leadUtil.saveLead(lead);
		
        if($scope.step==1){
        	
        	//Origem a partir do facebook
    		if($rootScope.lead.codOrigem.indexOf("fv")!=-1){
    			
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

	$interval(function(){

		if($scope.videoIntro.getCurrentTime()>=19 ){

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
		
		if($scope.videoIntro.getCurrentTime()>100 && savedTimeVideo3==false ){

			savedTimeVideo3 = true;
			leadUtil.setAction("assistiu_video_100");
		}
		
		if($scope.videoIntro.getCurrentTime()>150 && savedTimeVideo4==false ){

			savedTimeVideo4 = true;
			leadUtil.setAction("assistiu_video_150");
		}
		
		if($scope.videoIntro.getCurrentTime()>200 && savedTimeVideo5==false ){

			savedTimeVideo5 = true;
			leadUtil.setAction("assistiu_video_200");
		}
		
		if($scope.videoIntro.getCurrentTime()>240 && savedTimeVideo6==false ){

			savedTimeVideo6 = true;
			leadUtil.setAction("assistiu_video_call_to_action");
		}

	},1000);


	$scope.$on('youtube.player.ready', function ($event, player) {

        youtubePlayer = player;
		

	});


});