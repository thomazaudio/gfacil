"use strict";
(function(){

	angular.module("adm") 

	.factory("movListControllerFactory", function($rootScope, dateUtil, movUtil){

		var _init = function(scope){
			
			scope.orderMovs = "data";

			if(scope.allPeriod==true){

				scope.periodoDe = '1900-10-10';
				scope.periodoAte = '3000-10-10';
			}

			if(!scope.hideColumns)
				scope.hideColumns = [''];

			scope.config = $rootScope.config;
			_resolverOpcoesDeListagem(scope);
		}

		var  _getAbstractsMovsFixas = function (fixas, scope){

			var fim = dateUtil.getDate(scope.periodoAte);
			var abstractFixas = [];

			for(var i in fixas ){

				abstractFixas = abstractFixas.concat(movUtil.getAbstractMovsFixas(fixas[i],fim));
			}

			return abstractFixas;

		}

		var _resolverOpcoesDeListagem  = function(scope){

			if(scope.groupMovs==false)
				scope.agrupamentoMovs = "";

			else
				scope.agrupamentoMovs = $rootScope.config.confs.attrAgrupaMovList || "";
			
			//Data de referência
			scope.tipoDataBusca  = $rootScope.config.confs.attrDataReferenciaMovList || "data";

			scope.orderMovs = $rootScope.config.confs.attrOrderByMovList || "data";

		}

		var _getQuerysFromFixProperties = function(scope){

			var extras = scope.fixProperties;
			var queryExtras = [];
			for(var key in extras){
				queryExtras.push(key+"="+extras[key]);
			}

			//Restrito a uma pessoa definida
			if(scope.pessoa)
				queryExtras.push("id_pessoa = "+scope.pessoa.id);

			return queryExtras;

		}

		//Movimentações fixas
		var _configureQuerysForBuscaFixa  = function(scope){

			var queryExtras  = _getQuerysFromFixProperties(scope);

			//Retira incoerencias de 'queryExtras' (Ex: dataBaixa, baixada, etc)
			queryExtras = queryExtras.filter(function(value){

				if(value.indexOf("baixada")==-1)
					return value;
			});

			var qsFixa = [
			              "modoRepeticao <> 0",
			              "(data<='"+dateUtil.formatDate(scope.periodoDe)+"' or data<='"+dateUtil.formatDate(scope.periodoAte)+"')"
			              ];

			qsFixa = qsFixa.concat(queryExtras);
			return qsFixa;

		}

		//Movimentações normais
		var _configureQuerysForBusca  = function(scope){

			var qs = [];
			var queryData = dateUtil.getQueryOfPeriod(scope.tipoDataBusca,scope.periodoDe,scope.periodoAte);
			qs.push(queryData); 
			qs.push('modoRepeticao=0');
			qs = qs.concat(_getQuerysFromFixProperties(scope));
			return qs;

		}

		var  _agruparMovimentacoes = function(movs, scope){

			if(!scope.groupMovs && scope.groupMovs!=false && scope.agrupamentoMovs!=""){
				scope.movsGroup = movUtil.agrupaMovs(movs,scope.agrupamentoMovs);
			}
			else{
				scope.movsGroup = [movs]; 
			}

		}
		
		//todas, a_pagar, pagas (aux=itens)
	    var _filtraMovsByBaixa = function(movs,baixa){

			movs = movs.filter(function(mov){

				if(mov)
					return mov;
			});

			//somente a_pagar
			if(baixa=='a_pagar'){

				movs = movs.filter(function(mov){

					if(mov.baixada==false)
						return mov;

				});

			}
			else if(baixa=='pagas'){

				movs = movs.filter(function(mov){

					if(mov.baixada==true)
						return mov;

				});

			}

			return movs;

		}

		return {
			agruparMovimentacoes: _agruparMovimentacoes,
			init: _init,
			configureQuerysForBusca: _configureQuerysForBusca,
			getQuerysFromFixProperties: _getQuerysFromFixProperties,
			configureQuerysForBuscaFixa: _configureQuerysForBuscaFixa,
			getAbstractsMovsFixas: _getAbstractsMovsFixas,
			filtraMovsByBaixa: _filtraMovsByBaixa
		}
	})

})();
