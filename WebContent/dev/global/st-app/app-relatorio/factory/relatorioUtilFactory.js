"use strict";
(function(){

	angular.module("adm")

	.factory("relatorioUtil",function(dateUtil,stService,$rootScope){

		//Qqantidade máxima de itens padrão para recuperação das projeções
		var _MAX_ITENS_DEFAULT = "3";

		//Ordenção padrão para inserção nas querys das projeções
		var _ORDER_BY_DEFAULT = "DESC";

		var _chartFactory = function(scope,basicInfo,periodColumn,callback){

			scope.$on("changePeriod",getDados);

			function getDados(){

				_getChartObject(basicInfo,periodColumn,scope.de,scope.ate,function(proj){

					callback(proj);
				});

			}

			getDados();

		}

		var _getChartObject = function(dados,periodColumn,dataDe,dataAte,callback){

			var info = angular.copy(dados);
			info.qs = info.qs||[];

			if((dataDe && dataDe!=null) && (dataAte&& dataAte!=null))
				info.qs.push(dateUtil.getQueryOfPeriod(periodColumn,dataDe,dataAte));

			stService.getProjecoes(info).success(function(data){

				var itens = data.itens;
				var labelsGrafico =  [];
				var dataGrafico = [];
				for(var i in itens ){

					labelsGrafico.push(itens[i][0]||'Outros');
					dataGrafico.push(itens[i][1]);
				}

				var proj = {};

				proj.labels = labelsGrafico;
				proj.data = dataGrafico;

				//Caso a quantidade itens ultrapasse 4, a exibição é feita em char-bar
				//Necessário transformar [] em [[]] para exibição em chart-bar 
				if(proj.labels.length>4){

					proj.data = [proj.data];	

				}

				callback(proj);

			});


		}

		//Quantidade máxima de itens padrão
		var _maxItensDefault = function(){

			return "5";
		}

		//Ordenação padrão a ser inserida nas querys de projeções
		var _orderDefault = function(){

			return "DESC";
		}

		return{
			getChartObject: _getChartObject,
			chartFactory: _chartFactory,
			maxItensDefault:_maxItensDefault,
			MAX_ITENS_DEFAULT: _MAX_ITENS_DEFAULT,
			ORDER_BY_DEFAULT : _ORDER_BY_DEFAULT 
		}
	})

})();
