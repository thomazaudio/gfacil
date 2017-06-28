"use strict";
(function(){

	angular.module("adm")

	//Diretiva necessária para upload de arquivos
	.directive("modalPrecosCompraProduto",function (estoqueUtil) {
	    return {
	        restrict: 'AE',
	        scope:{
	        	produto:"="
	        },
	        link: function(scope, element, attrs) {
	           
	            element.bind('click', function(){
	              
	            	console.log("Produto na diretive: ");
	            	console.log(scope.produto);
	            	estoqueUtil.openPrecosCompraProduto(scope.produto);
	            	
	            });
	        }
	    };
	})
	
})();
