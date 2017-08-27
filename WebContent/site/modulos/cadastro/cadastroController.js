angular.module("site").controller("cadastroController", function($scope, stService, $localStorage, $location, googleAdWordsService, leadUtil){
	
	stService.executeGet("config").success(function(data){
		
		var config = data.itens[0].confs;
		var totalVagas = parseInt( config.vagas_lead);
		var cadastros = parseInt(config.cadastros_lead);
		$scope.totalInscritos = cadastros;
		$scope.vagasRestantes = totalVagas  - cadastros;
	    console.log("Vagas restantes: "+$scope.vagasRestantes);
	});
	
	$scope.lead =  $localStorage.lead || {};
	$scope.step=0;
	
	$scope.responder = function(){
		
		$scope.step++;
		
	}
	
	 $scope.cadastrarLead = function(lead){
		 
	     //Inserção do pixel do acebook
		 fbq('track', 'Lead', {
		 value: 25.00,
		 currency: 'USD'
		 });
		
		 
		 leadUtil.saveLead(lead, function(res){
			 
			 googleAdWordsService.registerLeadConversion();
			 $localStorage.lead = res;
			 $scope.lead = res;
			 leadUtil.setAction("finalizou_cadastro");
			 $location.path("cadastro-sucesso");
			 
		 })
		
	 }
	
});