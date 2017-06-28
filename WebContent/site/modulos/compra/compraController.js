angular.module("site").controller("compraController", function($scope, stService, $localStorage, config){
	
	 $gn.ready( function( variable ) {
		

   	  var payment_forms = [ "credit_card", "banking_billet" ];
   	  variable.lightbox( payment_forms );

   	  variable.jq( '#button_lightbox' ).click( function( evt ) {
   		  
   		  
   		 //Inserção do pixel do acebook
 		 fbq('track', 'inicioProcessoCompra', {
 		 value: 25.00,
 		 currency: 'USD'
 		 });
 		
        
   	    var data = {
   	      items: [ {
   	        code: 1,
   	        name: 'Ceasa Plus - Taxa de instalação + 1º mensalidade',
   	        value: 85900
   	      } ],
   	      shippingAddress:false,
   	      customer:false,
   	      actionForm: config.baseUrl+"gerencianet/processa-pagamento/"
   	    };

   	    variable.show( data );
   	    


   	  } );
   	 
   	  $scope.carregouPagamento = true;
   	  $scope.$apply();
     
   	} );
	
});