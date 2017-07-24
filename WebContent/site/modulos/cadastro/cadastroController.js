angular.module("site").controller("cadastroController", function($scope, stService, $localStorage, $location, googleAdWordsService){
	
	
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