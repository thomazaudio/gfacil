(function(){

	angular.module("adm") 

	.factory('dateUtil', function($rootScope,$filter, stUtil){

		var	_getPeriodOf = function(p,n){

			var intervalo;

			if(p=='SEMANA_PASSADA')
				intervalo = getSemanaPassada();

			else if(p=='SEMANA_ATUAL')
				intervalo = getSemanaAtual();

			else if(p=='MES_ATUAL')
				intervalo = getMesAtual();

			else if(p=='LAST_DAYS')
				intervalo = getLastDays(n);

			else if(p=='NEXT_DAYS')
				intervalo =  getNextDays(n);

			else if(p=='HOJE')
				intervalo = {de:new Date(),ate:new Date()}

			else if(p=='DESDE_INICIO_ANO')
				intervalo = getDesdeInicioAno();

			else
				console.log("tipo não definido em getPeridoOf()");

			intervalo.de.setHours(0,0,0);
			intervalo.ate.setHours(23,59,59);
			return intervalo;
		}


		function getDesdeInicioAno(){

			var periodoDe = new Date();
			periodoDe.setDate(1);
			periodoDe.setMonth(0);

			return {
				de:periodoDe,
				ate:new Date()
			};

		}

		function getSemanaPassada(){

			var hoje= new Date();
			var periodoDe = new Date();
			var inicioSemana = parseInt($rootScope.config.confs.inicio_semana);
			periodoDe.setDate(hoje.getDate() - (hoje.getDay()+7)+inicioSemana);
			var periodoAte = new Date();
			periodoAte.setDate(hoje.getDate()- hoje.getDay()+(inicioSemana-1));

			return {
				de:periodoDe,
				ate:periodoAte
			};

		}

		function getMesAtual(){

			var atual= new Date();
			var lastDay = _daysInMonth(atual.getMonth()+1,atual.getYear());
			var periodoDe = new Date();
			var periodDe = new Date();
			periodoDe.setDate(1);
			var periodoAte = new Date();
			periodoAte.setDate(lastDay);

			return{
				de:periodoDe,
				ate:periodoAte
			}

		}

		function getSemanaAtual(){

			var hoje= new Date();
			var periodoDe = new Date();
			var inicioSemana = parseInt($rootScope.config.confs.inicio_semana);
			console.log("date: "+hoje.getDate());
			console.log("day: "+hoje.getDay());
			console.log("inicioSemana: "+inicioSemana);
			periodoDe.setDate(hoje.getDate()-hoje.getDay()+inicioSemana);
			var periodoAte = new Date();
			periodoAte.setDate(periodoDe.getDate()+6);

			return{
				de:periodoDe,
				ate:periodoAte
			}

		}

		function getNextDays(days){

			var hoje= new Date();
			var periodoDe = new Date();
			periodoDe.setDate(hoje.getDate() + days);
			var periodoAte = new Date();

			return{
				de:periodoDe,
				ate:periodoAte
			}
		}

		function getLastDays(days){

			var hoje= new Date();
			var periodoDe = new Date();
			periodoDe.setDate(hoje.getDate() - days);
			var periodoAte = new Date();

			return{
				de:periodoDe,
				ate:periodoAte
			}
		}

		function _getQueryOfPeriod (column,de,ate){

			var query  = column+" between '"+_formatDate(de)+"' and '"+_formatDate(ate)+"'";

			return query;
		}

		//Formata a data para o formato ISO (yyyy-MM-dd)
		//Retorna uma String com a data formatada
		var _formatDate = function(data){

			if(typeof data=='object' || typeof data=='number'){

				return $filter("date")(data,"yyyy-MM-d");
			}

			if(!data || data=='')
				return"";

			var format="";  
			//   2016-12-01
			if(RegExp(/\d{4}\-\d{2}\-(\d{2}|\d{1})/).test(data)==true){

				var dia = parseInt(data.substring(8));
				var mes = data.substring(5,7);
				var ano = data.substring(0,4);
				format=  ano+"-"+mes+"-"+dia;
			}

			else if(RegExp(/\d{2}\/\d{2}\/\d{4}/).test(data)==true){

				var dia = parseInt(data.substring(0,2));
				var mes = data.substring(3,5);
				var ano = data.substring(6);
				format=  ano+"-"+mes+"-"+dia;

			}

			else if(RegExp(/\d{1}\/\d{2}\/\d{4}/).test(data)==true){

				var dia = parseInt(data.substring(0,1));
				var mes = data.substring(2,4);
				var ano = data.substring(5);
				format=  ano+"-"+mes+"-"+dia;

			}

			return format;

		}

		var _getDate = function(data){

			var formatData = _formatDate(data);
			var dia = parseInt(formatData.substring(8));
			var mes = parseInt(formatData.substring(5,7));
			var ano = parseInt(formatData.substring(0,4));
			var data =  new Date(ano,mes-1,dia);
			return data;
		}

		//Recupera a quantidade de dias de um Mês
		var  _daysInMonth  = function(month,year) {
			var dd = new Date(year, month, 0);
			return dd.getDate();
		}

		//Incrementa uma data de acordo com o modo
		var _incrementaData = function(data,modo){

			if(!modo || modo==0)
				modo=3;

			switch(modo){

			//Diário
			case 1:  data.setDate(data.getDate()+1);
			break;

			//Mensal
			case 3:  data.setMonth(data.getMonth()+1);
			break;

			//Mensal
			default: data.setMonth(data.getMonth()+1);
			}

			return data;

		}

		return {

			getPeriodOf:_getPeriodOf,
			getQueryOfPeriod:_getQueryOfPeriod,
			formatDate: _formatDate,
			getDate:_getDate,
			daysInMonth:_daysInMonth,
			incrementaData:_incrementaData
		}

	})

})();
