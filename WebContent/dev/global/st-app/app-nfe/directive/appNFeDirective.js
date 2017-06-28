"use strict";
(function(){

	angular.module("adm")

	//Dados de identificação da NFe
	.directive("nfeIde",function(stService, $filter, $rootScope,dateUtil, relatorioUtil){

		return{

			restrict:"E",
			require:"nfe",
			templateUrl:"global/st-app/app-nfe/template-module/nfe-components/nfeIde.html",
			scope:{

				nfe:"=",//NFe referenciada
			},

		}
	})

	//Dados do emitente  da NFe
	.directive("nfeEmit",function(stService, $filter, $rootScope,dateUtil, relatorioUtil){

		return{

			restrict:"E",
			require:"nfe",
			templateUrl:"global/st-app/app-nfe/template-module/nfe-components/nfeEmit.html",
			scope:{

				emit:"=",//NFe referenciada
			},

		}
	})


	//Dados do destinatário  da NFe
	.directive("nfeDest",function(stService, $filter, $rootScope,dateUtil, relatorioUtil){

		return{

			restrict:"E",
			require:"nfe",
			templateUrl:"global/st-app/app-nfe/template-module/nfe-components/nfeDest.html",
			scope:{

				dest:"=",//NFe referenciada
			},

		}
	})

	//Itens da NFe
	.directive("nfeDet",function(stService, $filter, $rootScope,dateUtil, relatorioUtil){

		return{

			restrict:"E",
			require:"nfe",
			templateUrl:"global/st-app/app-nfe/template-module/nfe-components/nfeDet.html",
			scope:{

				dets:"=",//Pedidos na NFe
			},

		}
	})


	//Totais da NFe
	.directive("nfeTotal",function(stService, $filter, $rootScope,dateUtil, relatorioUtil){

		return{

			restrict:"E",
			require:"nfe",
			templateUrl:"global/st-app/app-nfe/template-module/nfe-components/nfeTotal.html",
			scope:{

				total:"=",//NFe referenciada
			},

		}
	})


	//Histórico de eventos
	.directive("nfeHistorico",function(stService, $filter, $rootScope,dateUtil, relatorioUtil){

		return{

			restrict:"E",
			require:"nfe",
			templateUrl:"global/st-app/app-nfe/template-module/nfe-components/nfeHistorico.html",
			scope:{

				nfe:"=",//NFe referenciada
			},

		}
	})


	//Dados do transporte
	.directive("nfeTransp",function(stService, $filter, $rootScope,dateUtil, relatorioUtil){

		return{

			restrict:"E",
			require:"nfe",
			templateUrl:"global/st-app/app-nfe/template-module/nfe-components/nfeTransp.html",
			scope:{

				transp:"=",//NFe referenciada
			},

		}
	})

	//Informações adicionais
	.directive("nfeInfAdic",function(stService, $filter, $rootScope,dateUtil, relatorioUtil){

		return{

			restrict:"E",
			require:"nfe",
			templateUrl:"global/st-app/app-nfe/template-module/nfe-components/nfeInfAdic.html",
			scope:{

				infAdic:"=",//NFe referenciada
			},

		}
	})


	//Informações de faturamento
	.directive("nfeCobr",function(stService, $filter, $rootScope,dateUtil, relatorioUtil){

		return{

			restrict:"E",
			templateUrl:"global/st-app/app-nfe/template-module/nfe-components/nfeCobr.html",
			scope:{

				cobr:"=",//NFe referenciada
			},

		}
	})


	//Unidade 
	.directive("nfeUnidadeMedida",function(stService, $filter, $rootScope,dateUtil, relatorioUtil){

		return{

			restrict:"E",
			require:"ngModel",
			templateUrl:"global/st-app/app-nfe/template-module/nfe-components/nfeUnidadeMedida.html",
			scope:{

				ngModel:"=",//NFe referenciada
				label:"="
			},

		}
	})


	//Select com todos os Cfops
	.directive("nfeCfop",function(stService, $filter, $rootScope,dateUtil, relatorioUtil){

		return{

			restrict:"E",
			require:"cfop",
			templateUrl:"global/st-app/app-nfe/template-module/nfe-components/nfeCfop.html",
			scope:{

				cfop:"=",//NFe referenciada
			},

		}
	})


})();
