"use strict";

(function(){

	angular.module("adm")

	//Diretiva para lista de movimentações
	.directive('movList', function (){
		return {
			restrict: 'E',
			scope:{

				fixProperties:"=",
				allPeriod:"=",//Ignora dateDe a dataAte
				label:"=",
				idImp:"=",//Indentificador para impressão
				pessoa:"=",//Caso de cadastro
				labelCad:"=",//Label a ser exibido no botão cadastrar
				lastDays:"=",//Quantidade de dias anteriores a data atual a serem exibidos nos resultados
				hideOptions:"=",//se true, os itens de alteração de data, cadastro de nova, etc não  são exibidos,
				groupMovs:"=",//Se == false, não é realizado o agrupamento de movimentações, padrão="pessoa.nome"
				hideColumns:"=", //Colunas que não serão exibidas na tabela
				labelNoResults:"=",//Texto mostrado quando não houver resultados
				iconNoResults:"=",//Icone exibido na frente de labelNoResults
				maxItens:"="//Máximo de itens a serem exibidos na lista, se definido aparece o botão 'visualizar todos'
			},

			templateUrl:'global/st-app/app-mov/template-module/movListDirective.html',
			bindToController:true,
			controllerAs:"vm",
			controller: "movListController"
		}
	})

})();

