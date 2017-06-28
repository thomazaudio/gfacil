"use strict";
(function(){

	angular.module("adm") 

	.controller("listaNFeController",function($scope,$location,nfeUtil){

		$scope.goToNFe  = function(idNFe){

			nfeUtil.openNFe(idNFe,null);

		}

	})

})();
