angular.module("site").controller("cadastroController", function($scope, stService, $localStorage, $location, googleAdWordsService){
	
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
		
		 stService.executePost("lead/add/", lead).success(function(data){
			 
			 googleAdWordsService.registerLeadConversion();
			 $localStorage.lead = data.item;
			 $scope.lead = data.item;
			 $location.path("cadastro-sucesso");
			 
		 });
	 }
	
});