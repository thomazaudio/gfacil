angular.module("site").controller("cadastroController", function(origem, $scope, stService, $localStorage, $location, googleAdWordsService, leadUtil){
	
	
	if(origem!=null){
		
		leadUtil.saveLead({codOrigem: origem});
	}
	
	stService.executeGet("config").success(function(data){
		
		var config = data.itens[0].confs;
		var totalVagas = parseInt( config.vagas_lead);
		var cadastros = parseInt(config.cadastros_lead);
		$scope.totalInscritos = cadastros;
		$scope.vagasRestantes = totalVagas  - cadastros;
	    console.log("Vagas restantes: "+$scope.vagasRestantes);
	});
	
	$scope.lead =  $localStorage.lead || {};
	$scope.lead.nome = "";
	$scope.lead.telefone = "";
	$scope.step=0;
	
	$scope.responder = function(){
		
		$scope.step++;
		
	}
	
	 $scope.cadastrarLead = function(lead){
		 
		 
		 $scope.cadastrando = true;
		 
	     //Inserção do pixel do acebook
		 fbq('track', 'Lead', {
		 value: 25.00,
		 currency: 'USD'
		 });
		
		 lead.savedInForm = "1";
		 leadUtil.saveLead(lead, function(res){
			 
			 $scope.cadastrando = false;
			 googleAdWordsService.registerLeadConversion();
			 res.savedInForm = 0;
			 $localStorage.lead = res;
			 $scope.lead = res;
			 leadUtil.setAction("finalizou_cadastro");
			 $location.path("cadastro-sucesso");
			 
		 })
		
	 }
	
});