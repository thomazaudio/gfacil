"use strict";
(function(){

	angular.module("adm")

	.directive("parcelaMov",function(dateUtil,movUtil,$uibModal){

		return{

			templateUrl:'parcelaMov.html',
			scope:{

				originalMov:"=",//Movimentação de origem
				callBack:"=",//Função de retorno
				movs:"=",//Movimentações geradas no parcelamento
				quantParcelas:"=",//Quantidade parcelas a serem geradas,
				isModal:"=",//Componente está sendo exibido em modal (Mostra botão OK)

			},
			controller:"parcelaMovController",

		}

	});

})();