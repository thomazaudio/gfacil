"use strict";
(function(){

	angular.module("adm")
	
	.config(['growlProvider', function (growlProvider) {
     growlProvider.globalTimeToLive({success: 1000, error: 2000, warning: 3000, info: 4000});
    }])
    
  

})();

"use strict";
(function(){

	angular.module("adm") 

	.factory('st',function(stService, $rootScope, $cookieStore, config, deviceDetector){

		//Enviar um evento no sistema contablidade no servidor
		var _evt  = function(evt){

			console.log("deviceDetector: ");
			console.log(deviceDetector);

			//evt.pathOrigem = window.location.href;
			var usuario =  $cookieStore.get("usuarioSistema");

			if(!evt.login && usuario)
				evt.login = usuario.originalLogin;

			evt.versaoApp = config.appVersion;
			evt.alturaTela = $(window).height()+"";
			evt.larguraTela = $(window).width()+"";
			evt.os = deviceDetector.os+" - "+deviceDetector.os_version;
			evt.device = deviceDetector.device;
			evt.browser = deviceDetector.browser +" - "+deviceDetector.browser_version;

			stService.executePost("eventousuario/add/",evt).success(function(){


			});

		};
		
		
		var _leadEvt  = function(evt){

			var usuario =  $cookieStore.get("usuarioSistema");

			stService.executeGet("/lead/add-action-by-tel",{tel:usuario.login, action: evt.descricao }).success(function(){

			});

		};
		
		
		return{
			evt: _evt,
			leadEvt: _leadEvt
		}
	})


	.factory('stUtil',function($rootScope, $filter, growl){


		//Remove acentos de uma string
		var  _removerAcentos = function(str){

			console.log("Antes: "+str);
			var rExps=[
			           {re:/[\xC0-\xC6]/g, ch:'A'},
			           {re:/[\xE0-\xE6]/g, ch:'a'},
			           {re:/[\xC8-\xCB]/g, ch:'E'},
			           {re:/[\xE8-\xEB]/g, ch:'e'},
			           {re:/[\xCC-\xCF]/g, ch:'I'},
			           {re:/[\xEC-\xEF]/g, ch:'i'},
			           {re:/[\xD2-\xD6]/g, ch:'O'},
			           {re:/[\xF2-\xF6]/g, ch:'o'},
			           {re:/[\xD9-\xDC]/g, ch:'U'},
			           {re:/[\xF9-\xFC]/g, ch:'u'},
			           {re:/[\xD1]/g, ch:'N'},
			           {re:/[\xF1]/g, ch:'n'} ];

			for(var i=0, len=rExps.length; i<len; i++)
				str=str.replace(rExps[i].re, rExps[i].ch);

			console.log("Depois: "+str);

			return str;

		}

		var _disableFocus = function(){

			$("#anchor_cima").focus();
		}

		var _getDayOfIndex = function(index){

			switch(index){

			case 0:return 'segunda-feira';
			case 1:return 'terça-feira';
			case 2:return 'quarta-feira';
			case 3:return 'quinta-feira';
			case 4:return 'sexta-feira';
			case 5:return 'sábado';
			case 6:return 'domingo';

			}
		}

		var _openLogin = function(modal){

			modal.open({
				animation: true,
				templateUrl:'view/login/login.html',
				size:'lg',
				controller:function($scope,loginService,$rootScope){

					$scope.logar = function(login){

						$scope.logar = function(login){

							loginService.logar(login).success(function(data){

								var authToken = data.token;
								$rootScope.authToken = authToken;

							});

						}

					}

					$scope.fechar = function(ele){

						ele.$dismiss('cancel');
					}

				}
			});
		};

		var _getCountObs = function(obs,attrCount,attrComp,value){

			var total = 0;

			for(i in obs){

				if(attrComp){


					if( _compareJson(obs[i],value,attrComp)){

						total+=_getValueOfNivel(obs[i],attrCount);
					}
				}
				else{

					total+=_getValueOfNivel(obs[i],attrCount);
				}

			}

			return total;
		}

		//Formatar data para o formato aceito pelo sql(ISO)
		var _formatData = function formatData(data){

			if(typeof data=='object' || typeof data=='number'){

				return $filter("date")(data,"yyyy-MM-dd");
			}

			if(!data || data=='')
				return"";

			var format="";  

			var dia =   parseInt(data.substring(0,2));
			var mes = data.substring(3,5);
			var ano = data.substring(6);
			format=  ano+"-"+mes+"-"+dia;

			return format;

		};

		var _getNameMonth = function(n){

			switch(n){

			case 1:return "Janeiro";
			case 2:return "Fevereiro";
			case 3:return "Março";
			case 4:return "Abril";
			case 5:return "Maio";
			case 6:return "Junho";
			case 7:return "Julho";
			case 8:return "Agosto";
			case 9:return "Setembro";
			case 10:return "Outubro";
			case 11:return "Novembro";
			case 12:return "Dezembro";

			}

			return "";

		};

		var _showMessage = function(titulo,mensagem,tipo){

			var icon ='fa fa-info-circle';
			tipo = tipo||"info";

			if(tipo=='danger'){
				tipo="error";
			}

			//As configurações estão definidas em '.config(['growlProvider'' no inicio deste arquivo 
			growl[tipo](mensagem); 

		};

		var _buscaOb = function(array, query, attr){

			var attrs = [];

			if(attr)
				attrs = attr.split(".");

			for(var i in array){

				if(attr && attrs.length==1 && array[i][attrs[0]]==query)
					return i;

				if(attr && attrs.length==2 && array[i][attrs[0]][attrs[1]]==query)
					return i;

				else if(array[i]==query)
					return i;

			}

			return -1;

		};


		//Este método retorna o valor obtido do objeto através de atributos em níveis, ex; ob = mov, atributo =pessoa.endereco.cep
		var _getValueOfNivel = function(ob,attr){

			var result;

			//Niveis
			var nvs = attr.split(".");

			switch(nvs.length){

			case 0: result=ob;
			break;

			case 1: result=ob[nvs[0]];
			break;

			case 2: result=ob[nvs[0]][nvs[1]];
			break;

			case 3: result=ob[nvs[0]][nvs[1]][nvs[2]];
			break;

			case 4: result=ob[nvs[0]][nvs[1]][nvs[2]][nvs[3]];
			break;

			case 5: result=ob[nvs[0]][nvs[1]][nvs[2]][nvs[3]][nvs[4]];
			break;

			}

			return result;

		};

		var _setValueOfNivel = function(ob,attr,value){

			//Niveis
			var nvs = attr.split(".");

			switch(nvs.length){

			case 0: ;
			break;

			case 1: ob[nvs[0]]=value;
			break;

			case 2:ob[nvs[0]][nvs[1]]=value;
			break;

			case 3:ob[nvs[0]][nvs[1]][nvs[2]]=value;
			break;

			case 4:ob[nvs[0]][nvs[1]][nvs[2]][nvs[3]]=value;
			break;

			case 5: ob[nvs[0]][nvs[1]][nvs[2]][nvs[3]][nvs[4]]=value;
			break;

			}

			return ob;

		};

		var _compareJson = function(ob,value,attr){

			if(!attr || attr.split(".").length==0)
				return ob == value;

			//Niveis
			var nvs = attr.split(".");

			var key;

			switch(nvs.length){

			case 1:  key = ob[nvs[0]];
			break;

			case 2:  key = ob[nvs[0]][nvs[1]] ;
			break;

			case 3:  key  = ob[nvs[0]][nvs[1]][nvs[2]];
			break;

			case 4:  key = ob[nvs[0]][nvs[1]][nvs[2]][nvs[3]];
			break;

			case 5:  key  = ob[nvs[0]][nvs[1]][nvs[2]][nvs[3]][nvs[4]];
			break;

			}

			return key==value;

		}

		return {

			getCountObs: _getCountObs,
			getNameMonth: _getNameMonth,
			formatData: _formatData,
			showMessage: _showMessage,
			buscaOb:_buscaOb,
			openLogin:_openLogin,
			getValueOfNivel:_getValueOfNivel,
			setValueOfNivel:_setValueOfNivel,
			compareJson: _compareJson,
			disableFocus: _disableFocus,
			removerAcentos: _removerAcentos,
			getDayOfIndex:_getDayOfIndex

		};

	})

	.factory('s', function () {

		var _format = function(texto,tam,limiter){

			if(limiter)
				texto = _setLimiter(texto,limiter,".") ;

			while(texto.length<tam)
				texto+=" ";

			return texto;
		};

		var _setLimiter = function (value,max, tail) {
			if (!value) return '';

			max = parseInt(max, 10);
			if (!max) return value;
			if (value.length <= max) return value;

			value = value.substr(0, max);

			var lastspace = value.lastIndexOf(' ');
			if (lastspace != -1) {
				//Also remove . and , so its gives a cleaner result.
				if (value.charAt(lastspace-1) == '.' || value.charAt(lastspace-1) == ',') {
					lastspace = lastspace - 1;
				}
				value = value.substr(0, lastspace);
			}


			return value + (tail || ' …');
		};

		return _format;

	})

	.factory('printUtil',function($rootScope,$http,$filter,s,stUtil,movUtil){

		var FONT_BOLD=1;
		var FONT_ITALIC=2;


		var getFooterPrint = function(){

			var linhas = [];
			var hoje = new Date();
			linhas.push({texto:"TRACO"});
			linhas.push({texto:"Emitido em "+$filter("date")(hoje,'dd/MM/yyyy')+" as "+$filter("date")(hoje,'HH:mm:ss')});
			return linhas;

		}

		var getHeaderPrint = function(tipoPessoa,nomePessoa){

			var linhas = [];
			var config  = $rootScope.config.confs;
			var nome = "  "+config.nomeUsuario;
			var telefone = "           "+config.telefone||"";

			//Nome 
			linhas.push({texto:nome,fontSize:22,fontWeight:FONT_ITALIC,fontFamily:"ARIAL"});

			//Telefone
			linhas.push({texto:telefone,fontSize:12,fontWeight:FONT_BOLD,fontFamily:"ARIAL"});

			linhas.push({texto:"TRACO"});

			if(tipoPessoa && nomePessoa)
			{
				var descricaoPessoa = tipoPessoa+" : "+nomePessoa;
				descricaoPessoa = $filter("uppercase")(descricaoPessoa);
				linhas.push({texto:descricaoPessoa});
			}

			linhas.push({texto:"TRACO"});


			return linhas;

		}

		var _printMovs = function(movs){

			var config  = $rootScope.config.confs;
			var tipoPessoa = movs[0].pessoa.tipo_pessoa;
			var nomePessoa = movs[0].pessoa.nome;

			var linhas = getHeaderPrint(tipoPessoa,nomePessoa);

			for(i in movs){
				var mov = movs[i];

				//Data da movimentação
				var data =  new Date(mov.data);
				var dataFormatada = $filter("date")(data,"dd/MM/yyyy");
				var diaSemana = $filter("date")(data,"EEEE");
				var totalMov  = $filter("number")(mov.valor,2);
				linhas.push({texto:dataFormatada+" ("+diaSemana+") - R$ "+totalMov});

				var pedidos = mov.pedidos;
				var headerPedido = s("QUANT",5)+" "+s("PRODUTO",17)+" "+s("UNIT",5)+"  "+s("SUB-TOTAL",10)
				linhas.push({texto:headerPedido,fontSize:8,fontWeight:1});
				//Pedidos relacionados a movimentação
				for(var j in pedidos){

					var ped = pedidos[j];
					var totalPedido =$filter("number")(ped.quantidade * ped.valorUnitario,2);
					var valorUnitario =$filter("number")(ped.valorUnitario,2);
					var nomeProduto = ped.produto.nome;
					if(ped.opcao)
						nomeProduto+=" "+ped.opcao.nomeOpcao;


					var descPedido =  s(ped.quantidade+"x",5)+" "+s(nomeProduto,17,16)+" "+s(valorUnitario,5)+"  "+s(totalPedido,10)
					linhas.push({texto:descPedido,fontSize:8,fontWeight:1});
				}
			}

			var totalForMovs = movUtil.getTotalMovs(movs);
			totalForMovs = $filter("number")(totalForMovs,2);
			linhas.push({texto:"Total: R$ "+totalForMovs});

			//Footer
			linhas = linhas.concat(getFooterPrint());


			var objectPrint ={

					larguraPapel: config.larguraPapelCupom||80,
					linhas:linhas

			}

			var urlPrint = (config.urlImpressoraCupom||"http://localhost:1220")+"/print";

			var req = {
					method: 'POST',
					url:urlPrint ,
					headers: {
						'Content-Type': "text/plain"
					},
					data: objectPrint
			}
			$http(req).success(function(data){


			}).error(function(msg){

				stUtil.showMessage("","Ocorreu ao imprimir em '"+urlPrint+"'","danger");

			});


		}


		return{
			printMovs:_printMovs
		}

	})

	//Modal em forma de serviço
	.factory("$stDetalhe",function($http, config, $uibModal){

		var _open = function(template,ob,$scope_,callback){

			$uibModal.open({
				animation: true,
				templateUrl:template,
				size:'lg',
				controller:function($scope){
					$scope.ob=ob;
					$scope.objeto=ob;
					$scope.parente = $scope_;

					$scope.fechar = function(ele){

						ele.$dismiss('cancel');
						callback($scope.objeto);

					}

				}
			});
		};

		return {

			open: _open,

		};

	})

})();

"use strict";
(function(){

	angular.module("adm") 

	.factory('onlineStatus', ["$window", "$rootScope", function ($window, $rootScope) {
	    var onlineStatus = {};

	    onlineStatus.onLine = $window.navigator.onLine;

	    onlineStatus.isOnline = function() {
	        return onlineStatus.onLine;
	    }

	    $window.addEventListener("online", function () {
	        onlineStatus.onLine = true;
	        $rootScope.$digest();
	    }, true);

	    $window.addEventListener("offline", function () {
	        onlineStatus.onLine = false;
	        $rootScope.$digest();
	    }, true);

	    return onlineStatus;
	}]);
	

})();

"use strict";
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

		var _daysBetween = function (date1_ms, date2_ms) {

			// The number of milliseconds in one day
			var ONE_DAY = 1000 * 60 * 60 * 24

			// Calculate the difference in milliseconds
			var difference_ms = Math.abs(date1_ms - date2_ms)

			// Convert back to days and return
			return Math.round(difference_ms/ONE_DAY)

		}


		return {

			getPeriodOf:_getPeriodOf,
			getQueryOfPeriod:_getQueryOfPeriod,
			formatDate: _formatDate,
			getDate:_getDate,
			daysInMonth:_daysInMonth,
			incrementaData:_incrementaData,
			daysBetween: _daysBetween
		}

	})

})();

"use strict";
(function(){

	angular.module("adm") 
	
	
	//Diretiva necessária para upload de arquivos
	.directive('delayCount',function (onlineStatus) {
		return {
			restrict: 'E',
			template:"{{count}}",
			scope:{
				number:"=",
				time:"=",
				finish:"="
			},
			controller: function($scope, $interval) {
				$scope.count = 0;
				$interval(function(){
					
					if($scope.count<$scope.number)
						$scope.count++;
					else{
						$scope.finish = true;
						return;
					}
					
				}, $scope.time|| 300);
			}
		};
	})
	
	//Diretiva necessária para upload de arquivos
	.directive('networkButtonStatus',function (onlineStatus) {
		return {
			restrict: 'E',
			templateUrl:"global/st-app/st-util/template-module/networkButtonStatus.html",
			controller: function($scope) {
				$scope.onlineStatus = onlineStatus;

				$scope.$watch('onlineStatus.isOnline()', function(online) {
					$scope.online_status= online;
				});
			}
		};
	})

	//Diretiva necessária para upload de arquivos
	.directive('fileModel', ['$parse', function ($parse) {
		return {
			restrict: 'A',
			link: function(scope, element, attrs) {
				var model = $parse(attrs.fileModel);
				var modelSetter = model.assign;

				element.bind('change', function(){
					scope.$apply(function(){
						modelSetter(scope, element[0].files[0]);
					});
				});
			}
		};
	}])


	.directive('stInitial', function() {
		return {
			restrict: 'A',
			controller: [
			             '$scope', '$element', '$attrs', '$parse', function($scope, $element, $attrs, $parse) {
			            	 var getter, setter, val;
			            	 val = $attrs.ngInitial || $attrs.value;
			            	 getter = $parse($attrs.ngModel);
			            	 setter = getter.assign;
			            	 setter($scope, val);
			             }
			             ]
		};
	})

	.directive("buttonInfoOb",function($uibModal,filialUtil){

		return{
			link: function (scope, element, attrs){

				element.bind("click",function(){

					var objeto = JSON.parse(attrs.objeto);

					$uibModal.open({
						animation: true,
						templateUrl:"global/st-app/st-util/template-module/info-ob/modalInfoOb.html",
						size:'md',
						controller:function($scope){
							$scope.objeto=objeto;


							if(objeto.historicoObjeto)
								$scope.historicos = objeto.historicoObjeto.split(",");

							$scope.filialObjeto = filialUtil.getFilialById(objeto.idFilial);


						}
					});


				});

			}

		}

	})



	.directive("stTopMenu",function(movUtil,configUtil,stService,$rootScope,$route,$filter,stUtil,estoqueUtil){

		return{
			restrict:"E",
			templateUrl:"global/st-app/st-util/template-module/stTopMenu.html",
			controller:function($scope, $rootScope){

				$scope.lancaEntradaMercadoria = function(){

					estoqueUtil.openEntradaMercadoria();
				}

				$scope.cadastrarMov = function(tipo){

					var descricaoTipo = tipo==1? "Pagamento":"Recebimento";

					movUtil.openMov({tipo:tipo},null,function(mov){

						var mensagem = descricaoTipo+" no valor de R$ "+$filter("number")(mov.valor,2)+" cadastrado com sucesso!";

						stUtil.showMessage("",mensagem,"info");

						$route.reload();

					});
				}



				$scope.openConfig = function(){

					configUtil.openConfig();
				}

			}

		}
	})
	
	
	.directive("buttonAdd",function(){
		return{

			restrict:"E",
			templateUrl:"global/st-app/st-util/template-module/buttonAdd.html"
			
			
		}
	})


	.directive("estadosCidades",function(){
		return{

			restrict:"E",
			templateUrl:"global/st-app/st-util/template-module/estadosCidades.html",
			scope:{
				estado:"=",
				cidade:"=",

				codigoUf:"=",
				codigoMunicipio:"=",
				nomeMunicipio:"=",
				uf:"=",

			},
			bindToController:true,
			controller:"estadosCidadesController as vm",
		}
	})

	.directive('stNoItens',function(){

		return{
			template:'<p class="text-muted" style="padding:10px;">'+
			'<i class="fa fa-exclamation-circle" aria-hidden="true"></i> {{label}}'+
			'</p>',
			scope:{
				label:"="
			}
		}
	})

	//Destacar oxorrencias em um texto
	.directive('destaqueTexto',function(){

		return {
			restrict:"E",
			template:"<strong><span class='{{class}}' ng-class=\"{'busca-destaque':(first!=-1 && $index>=first && $index<=last)}\" ng-repeat='c in texto track by $index'>{{c}}</span></strong>",
			scope:{

				busca:"=",
				texto:"=",
				class:"="

			},
			controller:function($scope){

				if($scope.busca && $scope.busca.length>0){

					var texto = $scope.texto.toLowerCase();
					var busca = $scope.busca.toLowerCase();

					$scope.first = texto.indexOf(busca);
					$scope.last = $scope.first +busca.length;

				}

				else{
					$scope.first=-1;
					$scope.last=-1;

				}

			}
		}

	})

	//Diretiva de atalhes
	.directive('buttonExpressCad',function(movUtil,stService){

		return {
			restrict:"E",
			templateUrl:"global/st-app/st-util/template-module/buttonExpressCad.html",
			controller:function($scope){


				//Cadastro de despesa normal
				$scope.cadDespesa = function(){

					var mov = {tipo:1};
					movUtil.openMov(mov,function(){
						
					});

				}

			}
		}

	})


	.directive('stItemSelection',function(stService){

		return{

			restrict:"E",
			require:'ngModel',
			templateUrl:'global/st-app/st-util/template-module/itemSelection.html' ,
			scope:{

				maxItens:"=",//Quantidade de itens por página,
				objectOp:"=",
				label:"=",//Atributo do item a ser exibido
				extraLabel:"="	
			},
			link:function($scope,elements,attrs,ctrl){
				$scope.setPagina = function(pagina){

					$scope.pagina = pagina;

					stService.getLikeMap($scope.objectOp,[''],pagina,$scope.maxItens||0,'').success(function(data){

						$scope.itens = data.itens;

					});
				}

				$scope.setPagina(0);

				$scope.selecionarItem = function(item){

					ctrl.$setViewValue(item);
				}
			}
		}
	})











	//Diretiva para impressão
	.directive('stShow', function ($window,$animate) {
		return {
			restrict: 'A',
			multiElement: true,
			link: function(scope, element, attr) {
				scope.$watch(attr.stShow, function ngShowWatchAction(value) {

					if(value==true){
						element.addClass("st-show");
					}
					else{
						element.removeClass("st-show"); 
					}

				});
			}
		};
	})



	//Diretiva para impressão
	.directive('stPrint', function ($window) {
		return {
			restrict: 'A',
			scope:{


			},
			link: function (scope, element, attr) {

				element.bind("click",function(){


					var ele = $("#"+element.attr('id-print'));
					ele.addClass("printShow");
					ele.removeClass("printHide");
					$window.print();
					ele.removeClass("printShow");
					ele.addClass("printHide");


				});

			}
		}
	})


	//Diretiva para Status de carregamento
	.directive('stPagination', function (anchorScroll) {
		return {
			restrict: 'AE',
			templateUrl:'global/st-app/st-util/template-module/st-pagination.html',
			scope:{

				label:"=",
				querys:"=",//Querys bindadas


			},
			controller:function($scope,$rootScope){
				
				$scope.pagina=0;
				$scope.max = $rootScope.config.confs.maxItensPage||7

				$scope.setPagina = function(pagina){

					anchorScroll.scrollTo("anchor_cima");
					$scope.pagina=pagina;
					$scope.$parent.getLikeMap($scope.querys||[''],$scope.pagina,$rootScope.config.confs.maxItensPage||7,"","id","DESC");

				}

			}

		}
	})

	//Diretiva para Status de carregamento
	.directive('loading', function () {
		return {
			restrict: 'E',
			scope:{

				label:"="

			},
			replace:true,
			template: '<div class="loading"><i class="fa fa-refresh fa-spin"></i> <i>{{label}}</i></div>',
			link: function (scope, element, attr) {
				scope.$watch('loading', function (val) {
					if (val)
						scope.loadingStatus = 'true';
					else
						scope.loadingStatus = 'false';
				});
			}
		}
	})






	.directive("stList",function($filter){


		return {

			templateUrl:'view/api/st-list.html',
			restrict:"E",
			scope:{

				itens:"=",
				left:"@",
				right:"@",
				link:"@",
				tl:"@",
				tr:"@",
				cl:"@",
				cr:"@",
				bl:"@",
				br:"@",
				tamleft:"@",
				tamright:"@",
				labelitem:"@"


			},

			link: function($scope, element, attrs) {

				if(!$scope.tamleft)
					$scope.tamleft=6;

				if(!$scope.tamright)
					$scope.tamright=6;

				$scope.getLt = function(item,position){

					if(!$scope[position] && position=='cl')
						position="left";

					if(!$scope[position] && position=='cr')
						position="right";


					var frase="";

					if(!$scope[position])
						return "";


					frase  = $scope[position];


					var expressoes = frase.split(",");
					var regex;//Regex para cada expressao
					var i;
					var termos = [];
					var termo = {

							atributo:'',
							valor:0,
							tipo:'',
							exp:''

					};

					for(var i in expressoes){

						termo = {};

						//Literal
						if(expressoes[i].indexOf("[")==-1)
						{

							regex = new RegExp(/\'[\w | \W]+\'/);
							termo.valor = regex.exec(expressoes[i])[0].replace(/\'/g,"");
							termo.tipo='string';
							termo.atributo=null;
							termo.exp=expressoes[i];



						}	
						else {

							regex = new RegExp(/\[[\w |\W]+\:/);
							var atributo = regex.exec(expressoes[i])[0];
							atributo = atributo.replace("[","");
							atributo = atributo.replace(":","");
							var atributos = atributo.split(".");
							termo.atributo = atributos[0];

							var sub_  = atributo.split(".")[1];

							var valor = item[termo.atributo];

							if(sub_)
								valor  = valor[sub_];

							termo.valor = valor;
							regex = new RegExp(/\'[\w | \W]+\'/);
							termo.tipo = regex.exec(expressoes[i])[0].replace(/\'/g,"");
							termo.exp = expressoes[i];




						}

						termos.push(termo);	


					}

					//Literal a ser renderizado
					var lt="";
					var pre="";

					var j;
					for(var j in termos){

						if(termos[j].tipo=='money'){

							lt="R$ ";
							termos[j].valor = $filter('number')(termos[j].valor,2);

						}
						else if(termos[j].tipo=='string')
							termos[j].valor = $filter('uppercase')(termos[j].valor);


						lt+=termos[j].valor;

					}



					return lt;

				}


				$scope.getLink = function(item){

					var link = $scope.link ;

					if(!link)
						return"#";

					var pattern  = new RegExp(/\[[a-z]+\]/);
					var atributo  = pattern.exec($scope.link);
					var attr = atributo[0];
					attr = attr.replace("[","");
					attr  = attr.replace("]","");
					link = link.replace(pattern,item[attr]);

					return link;

				}



			}


		}

	})

	.directive('stCheck', function() {
		return {
			templateUrl:"global/st-app/st-util/template-module/stCheck.html",
			transclude:true,
			scope:{

				ngModel:"=",
				ngChange:"=",
				ngDisabled:"=",
				label:"=",
				labelClass:"="
			}
		}
	})

	.directive('stRelatorio', function(relatorioService,stUtil) {
		return {
			templateUrl:"view/relatorio/relatorioDirective.html",
			transclude:true,
			scope:{
				url:"=",
				nomeObjeto:"="	 

			},
			controller:function($scope){

				$scope.dataDe = new Date();
				$scope.dataAte = new Date();

				$scope.teste = function(){

				}

				$scope.gerarRelatorio = function(column,operador,valueColumn,countColumn,query,nomeRelatorio){

					$scope.nomeRelatorio = nomeRelatorio;//Nome do relatório

					var ops = {};

					//Preparação das opções
					ops.nomeObjeto = $scope.nomeObjeto;//Nome da classe Principal do objeto do relatório
					ops.column=column;//Coluna principal dos dados a serem exibidos ex:'formaPagamento'
					ops.operador=operador;//Operador a ser utilizado na query ex: 'like','='
					ops.countColumn=countColumn;//Columna utilizada para contagem, ex: 'Quantidade' ,'*'
					ops.valueColumn = valueColumn;//Coluna utlizada para soma, ex:'Valor'
					ops.url = $scope.url;
					ops.querys = [];
					ops.labels = ["Dinheiro","Cheque"];
					ops.querysLabel=[];
					ops.dataDe = stUtil.formatData($scope.dataDe);
					ops.dataAte = stUtil.formatData($scope.dataAte);

					ops.querysLabel = ops.querys;//Query utilizada na recuperação de labels


					if(query && query.length>0)
						ops.querys.push(query);


					/* Querys Extras
					if($scope.nomeProduto && $scope.nomeProduto.length>0 )
						ops.querys.push("produto like '%"+$scope.nomeProduto+"%'");
					 */



					relatorioService.getProjecoes(ops,function(data){


						$scope.proj = data;



					});

				}


			}


		};
	})



	.directive('convertToNumber', function() {
		return {
			require: 'ngModel',
			link: function(scope, element, attrs, ngModel) {
				ngModel.$parsers.push(function(val) {
					return val ? parseInt(val, 10) : null;
				});
				ngModel.$formatters.push(function(val) {
					return val ? '' + val : null;
				});
			}
		};
	})

	.directive('navClick', function () {
		return {
			restrict: 'A',
			link: function (scope, element, attrs) {


				element.on('click', function (event) {

					var elementoMenu = $("#elementoMenu");	

					elementoMenu.attr('class','sidebar-nav navbar-collapse collapse');


				});
			}
		};
	})

	//Anchor Scroll
	.service('anchorScroll', function(){

		this.scrollTo = function(eID) {

			// This scrolling function 
			// is from http://www.itnewb.com/tutorial/Creating-the-Smooth-Scroll-Effect-with-JavaScript

			var startY = currentYPosition();
			var stopY = elmYPosition(eID);
			var distance = stopY > startY ? stopY - startY : startY - stopY;
			if (distance < 100) {
				scrollTo(0, stopY); return;
			}
			var speed = Math.round(distance / 100);
			if (speed >= 20) speed = 20;
			var step = Math.round(distance / 25);
			var leapY = stopY > startY ? startY + step : startY - step;
			var timer = 0;
			if (stopY > startY) {
				for ( var i=startY; i<stopY; i+=step ) {
					setTimeout("window.scrollTo(0, "+leapY+")", timer * speed);
					leapY += step; if (leapY > stopY) leapY = stopY; timer++;
				} return;
			}
			for ( var i=startY; i>stopY; i-=step ) {
				setTimeout("window.scrollTo(0, "+leapY+")", timer * speed);
				leapY -= step; if (leapY < stopY) leapY = stopY; timer++;
			}

			function currentYPosition() {
				// Firefox, Chrome, Opera, Safari
				if (self.pageYOffset) return self.pageYOffset;
				// Internet Explorer 6 - standards mode
				if (document.documentElement && document.documentElement.scrollTop)
					return document.documentElement.scrollTop;
				// Internet Explorer 6, 7 and 8
				if (document.body.scrollTop) return document.body.scrollTop;
				return 0;
			}

			function elmYPosition(eID) {
				var elm = document.getElementById(eID);
				var y = elm.offsetTop;
				var node = elm;
				while (node.offsetParent && node.offsetParent != document.body) {
					node = node.offsetParent;
					y += node.offsetTop;
				} return y;
			}

		};

	})

	.directive('stCollapsePanel', function( $timeout){
		return {
			restrict:"E",
			transclude:true,
			templateUrl: 'global/st-app/st-util/template-module/stCollapsePanel.html',
			scope:{
				titulo:"=",
				icone:"=",
				show:"=",
				extraClass:"="
			} ,
			link:function($scope){


			}
		}
	})

	.directive('stAccordion', function(){
		return {
			restrict: "E",
			replace: true,
			transclude: true,
			template: '<div class="panel-group" ng-transclude></div>',
			scope:{

				accordionIn:"="
			},
			link: function(scope,elem, attrs){
				var id = elem.attr("id");

				if (!id) 
				{
					id = "btst_acc" + scope.$id;
					elem.attr("id", id);
				}

				var arr = elem.find(".accordion-toggle");
				for (var i = 0; i < arr.length; i++) {
					$(arr[i]).attr("data-parent", "#" + id);
					$(arr[i]).attr("href", "#" + id + "collapse" + i);
				}

				var arr = elem.find('.panel-collapse');

				if(scope.accordionIn==true){
					$(arr[0]).addClass("in");
				}

				for (var x = 0; x < arr.length; x++) {
					$(arr[x]).attr("id", id + "collapse" + x);
				}

			},
			controller: function(){}
		}}).directive('stAccordionPanel', function(){
			return {
				require: '^stAccordion',
				restrict: "E",
				replace: true,
				transclude: true,
				scope: {

					title:"=",
					idPanel:"@"

				},
				template: 
					'<div class="panel panel-default panel-pdvficha">'+
					'	<div id="{{idPanel}}" data-toggle="collapse" class="panel-heading accordion-toggle collapsed">'+
					'   	{{title}} <i class="fa fa-edit"></i>'+
					'	</div>'+
					'	<div class="panel-collapse collapse panel-body" ng-transclude>'+
					'	</div>'+
					'</div>',
					link: function(scope,elem,attrs){
						scope.$watch("title", function(){
							var hdr = elem.find(".accordion-toggle");
							hdr.html(scope.title+' <i class="fa arrow"></i>');
						})
					}
			}
		})


		.filter('indexDay', function (stUtil) {
			return function (value) {

				return stUtil.getDayOfIndex(value);
			};
		})

		.filter('limiter', function () {
			return function (value,max, tail) {
				if (!value) return '';

				max = parseInt(max, 10);
				if (!max) return value;
				if (value.length <= max) return value;

				value = value.substr(0, max);

				var lastspace = value.lastIndexOf(' ');
				if (lastspace != -1) {
					//Also remove . and , so its gives a cleaner result.
					if (value.charAt(lastspace-1) == '.' || value.charAt(lastspace-1) == ',') {
						lastspace = lastspace - 1;
					}
					value = value.substr(0, lastspace);
				}


				return value + (tail || ' …');
			};
		})

		.filter('tojson', function () {
			return function (value) {
				if (!value) return '';


				return JSON.parse(value);
			};
		})


	.directive('autoFocus"', function($timeout) {
			return {
				link: function(scope, element) {
					
					console.log("Chamou o focus");
					
							$timeout(function() {
								element[0].focus(); 
								console.log("Chamou o focus");
							});
					
				}
			};
		})

	.directive('focusMe', function($timeout) {
		return {
			scope: { trigger: '=focusMe' },
			require:'ngModel',
			link: function(scope,element,attr,ctrl) {


				scope.$watch('trigger', function(value) {

					if(value === true) { 
						$timeout(function() {

							var ele = element[0] ; 
							ele.selectionStart = ele.value.length;
							//ele.selectionEnd = ele.value.length;;
							ele.focus();
							scope.trigger = false;
						},1000);
					}
				});
			}
		};
	})

	.directive('verticalSpace',function(){

		return{
			restrict:"E",
			replace:true,
			template:'<div class="row"><div class="vertical-space"></div></div>'
		}

	})

	.directive('stValue',function(){

		return{
			restrict:"E",
			scope:{

				object:"=",
				attr:"=",
				value:"=",

			},
			link:function($scope){

				if(!$scope.object)
					$scope.object = {};

				$scope.object[$scope.attr] = $scope.value;

				$scope.$watch($scope.value,function(){

					$scope.object[$scope.attr] = $scope.value;

				});

			}
		}

	})

	.directive("usuarioSistema",function( $uibModal,stService,stUtil,loginUtil){

		return{
			restrict:"E",
			templateUrl:"global/st-app/st-util/template-module/usuario-sistema/usuarioSistema.html",
			controller:function($scope, $rootScope, $cookieStore, filialUtil){

				if(!$rootScope.usuarioSistema)
					$rootScope.usuarioSistema = $cookieStore.get("usuarioSistema");
				
				$scope.usuarioSistema = $rootScope.usuarioSistema;

				$scope.logOut = function(){

					loginUtil.logOut();

				}


				$scope.editarFilial = function(){

					filialUtil.openDetalheCurrentFilial(function(filial){


					});
				}

				$scope.editarUsuario = function(usuarioSistema){

					var modal =  $uibModal.open({
						animation: true,
						templateUrl:"global/st-app/st-util/template-module/usuario-sistema/modalEditUsuario.html",
						size:'lg',
						controller:function($scope){

							$scope.usuarioSistema = usuarioSistema;

							$scope.salvar = function(usuarioSistema,modal){

								if(!usuarioSistema.senha){
									stUtil.showMessage("","O campo senha deve ser preenchido!","danger");
									return;
								}

								if(usuarioSistema.senha!=usuarioSistema.senha2){
									stUtil.showMessage("","As senhas não conferem!","danger");
									return;
								}
								if(usuarioSistema.senha.length<6){
									stUtil.showMessage("","A senha deve ter pelo menos 6 caracteres.","danger");
									return;
								}

								stService.save("operadorsistema",usuarioSistema).success(function(){

									stUtil.showMessage("","Salvo com sucesso!","info");
									modal.$dismiss('cancel');
								});
							}

							$scope.fechar = function(ele){

								ele.$dismiss('cancel');
								callback($scope.objeto);

							}



						}
					});
				}
			}

		}
	})

	.directive("stToggle",function(){

		return{
			restrict:"E",
			templateUrl:"global/st-app/st-util/template-module/stToggle.html",
			scope:{

				ngModel:"=",
				ngDisabled:"=",
			},

		}
	})


	.directive("stSplitCheck",function(){

		return{
			restrict:"E",
			templateUrl:"global/st-app/st-util/template-module/st-split-check.html",
			scope:{

				ngModel:"=",//Valores que serão definidos no objeto, de acordo com os itens selecionados
				preValues:"=",
				limiteLabel:"="
			},
			controller:function($scope){

				if($scope.ngModel==null)
					$scope.ngModel ="";

				var its = $scope.preValues.split(",");

				var itens = [];

				for(var i in its){

					var sele = $scope.ngModel.indexOf(its[i])!=-1;

					itens.push({label:its[i],selecionado:sele});
				}

				$scope.itens = itens;

				$scope.changeCheck = function(){

					var model = "";
					for(var j in $scope.itens){

						if( $scope.itens[j].selecionado==true){
							model = model+","+$scope.itens[j].label;
						}
					}

					$scope.ngModel = model;
				}


			}
		}
	})


	.directive("stStep",function(){

		return{
			restrict:"E",
			templateUrl:"global/st-app/st-util/template-module/st-step.html",
			scope:{

				steps:"=",
				step:"=",
				initialStep:"="

			},
			controller:function($scope){

				if(!$scope.initialStep)
					$scope.step = 0;


				$scope.changeStep = function(index){

					$scope.step = index;
				}
			}

		}
	})

	.directive("inputEdit",function(){

		return{
			restrict:"E",
			templateUrl:"global/st-app/st-util/template-module/inputEdit.html",
			transclude:true,
			scope:{

				label:"=",
				ngModel:"=",
				icon:"=",
				type:"="

			},
			controller:function($scope){

				if($scope.ngModel)
					$scope.mostraValor=true;
				else{
					$scope.mostraValor=false;
				}


			}

		}
	})

	.directive("stCollapse",function(){

		return{
			restrict:"E",
			templateUrl:"global/st-app/st-util/template-module/st-collapse.html",
			transclude:true,
			scope:{

				label:"=",


			},
			controller:function($scope){

				$scope.show = false;


			}

		}
	})

	.directive('stPeriod',function(dateUtil,$localStorage){

		return{
			restrict:"E",
			templateUrl:'global/st-app/st-util/template-module/stPeriod.html',
			require:['de','ate','submit'],
			scope:{

				de:"=",
				ate:"=",
				submit:"=",
				change:"=",
				syncPeriod:"=",//se true, o periodo selecionado é sincronizado em local storage
				
			},

			controller:function($scope){

				if($scope.syncPeriod==true){

					$scope.de = 	$localStorage.dataDe;
					$scope.ate = 	$localStorage.dataAte;

					$scope.$watch("de",function(de){
						$localStorage.dataDe = de;
					});

					$scope.$watch("ate",function(ate){

						$localStorage.dataAte = ate;
					});

				}



				$scope.alterarPeriodo = function(periodo){

					var p = dateUtil.getPeriodOf(periodo);

					$scope.de = p.de;
					$scope.ate = p.ate;

				}



			}
		}


	})



	.directive("stAlertButton",function(){

		return{
			restrict:"E",
			templateUrl:"global/st-app/st-util/template-module/stAlertButton.html",
			controller:function($scope,$interval,stService,$uibModal, $location,$stDetalhe, $route){

				var getAlerts = function(){

					stService.executeGet("projecao/execute-query",
							{query:"select p.id,p.nome,'',p.quantidade from Produto p where (p.quantidade<=p.minQuant) and p.disable =0"}).success(function(data){
								$scope.itens =  data.itens;
								$scope.numAlerts = data.itens.length;

							}).error(function(){


							});



				}

				$interval(getAlerts,15000);

				$scope.openAlerts = function(itens){

					$uibModal.open({
						animation: true,
						templateUrl:"global/st-app/st-util/template-module/modalAlertEstoque.html",
						size:'md',
						controller:function($scope){

							$scope.itens = itens;

							$scope.fechar = function(ele){

								ele.$dismiss('cancel');
								callback($scope.objeto);

							}

							$scope.toProduct = function(idProduto,modal){

								modal.$dismiss("cancel");

								stService.getById("produto",idProduto).success(function(data){

									$stDetalhe.open("view/produto/addAndUpdateProduto.html",data.item,$scope,function(res){

										$route.reload();

									}); 

								});		

							}

						}
					});
				}

			}

		}
	})

})();

"use strict";
(function(){

	angular.module("adm") 
	
	
	//Diretiva necessária para upload de arquivos
	.directive('mobileTabs',function (onlineStatus) {
		return {
			restrict: 'E',
			templateUrl:"global/st-app/st-util/template-module/mobileTabs.html",
			scope:{
				activeTab:"=",
				tabs: "="
			},
			controllerAs:"vm",
			bindToController:true,
			controller: function() {
				
				var vm = this;
				
				if( vm.activeTab!=0)
				vm.activeTab = 	vm.activeTab || 1;
				
				vm.alterarTab =function (tab){

					vm.activeTab = tab;

				}
				
			}
		};
	})

})();

"use strict";
(function(){

	angular.module("adm") 
	
	//Select simples (Sem auto-complete)
	.directive("stSelect",function(stService){

		return{
			restrict:"E",
			templateUrl:"global/st-app/st-util/template-module/stSelect.html",
			scope:{
				
			   urlBase:"=",//url base no control do objeto (Ex: 'produto')
			   attrLabel:"=",//Nome do atributo a ser exibido no label do select	 
			   ngModel:"="//ng-model associado	   
			},
			controller:function($scope){
				
				//Recupera todos os objetos
			    stService.getAll($scope.urlBase).success(function(data){
			    	
			    	$scope.itens = data.itens;
			    });

			}

		}
	})
	
})();

"user strict";
(function(){

	angular.module("adm") 

	.directive("stInput",function($compile,$filter, stService,$rootScope,stUtil){

		return {
			require:'ngModel',	

			scope:{

				tipo:"@",
				label:"=",
				disable:"@",
				objectOp:"@",//Objeto em caso de chave/valor
				optionsChosen:"@",
				html:"@",
				dateFormat:"=",
				savePath:"=",
				saveObject:"="
			},


			link: function($scope, element, attrs,ctrl){

				/*
				//Mudança para salvar
				if($scope.saveObject && $scope.savePath){



					var inputGroup = $compile("<div class='input-group'></div>")($scope);

					element.before(inputGroup);

					inputGroup.append(element);

					var buttonSave = $compile("<button class='btn btn-info'><i class='fa fa-floppy-o'></i></button>")($scope);
					var spanButton = $compile("<span class='input-group-btn'></div>")($scope);
					spanButton.append(buttonSave);
					inputGroup.append(spanButton);

					console.log(inputGroup);
					element.bind("keyup",function(){

					});
				}

				 */


				//Focus automático
				if($scope.tipo!='data')	{
					element.bind("mouseover",function(){

						element.focus();
						var $thisVal = element.val();
						element.val('').val($thisVal);

					});
				}

				{html:'<button></button>'}

				if($scope.tipo=='htmlCompile'){


					var content = $compile($scope.html)($scope);
					element.html(content);
				}		

				if($scope.tipo=='htmlView'){


					var content = $compile($scope.html)($scope);
					element.append(content);
				}	

				else if($scope.tipo=='checkbox'){

					element.attr('type',"checkbox");
					element.attr('class','checkbox');

				}

				else if($scope.tipo=='popover'){

					var button = $compile('<button style="z-index:99999"  type="button" class="btn btn-primary btn-lg" id="myPopover" data-toggle="popover">HTML Inside Popover</button>')($scope);
					//Função para Abrir Popover
					$(button).popover({
						//placement : 'top',
						title: '<p><strong>Cadastrar Nova Pessoa/Empresa</strong></p>',
						content : '<p style="font-size:9pt">Digite abaixo o nome da Pessoa/Empresa que deseja cadastrar.</p><div class="form-group"><input class="form-control" placeholder="Digite o nome da Pessoa/Empresa"/></div><div class="form-group"><button class="btn btn-danger pull-left" onclick="$(&quot;#myPopover&quot;).popover(&quot;hide&quot;);" >Fechar</button><button class="btn btn-primary pull-right">Salvar</button></div><div class="row"></div',
						html: true
					}); 
					element.append(button);  
				}



				else  if($scope.tipo=='tel'){

					element.attr("type","tel");
					element.mask("(99) 9999-9999?9");
				}

				else if($scope.tipo=='cpf'){
					element.mask("999.999.999-99");
				}

				else if($scope.tipo=='cnpj'){

					element.mask("99.999.999/9999-99");
				}

				//Nomes proprios
				else if($scope.tipo=='upper'){


					$(element).keyup(function(){

						this.value = this.value.toLocaleUpperCase();
						ctrl.$setViewValue(this.value.toLocaleUpperCase());
					});


				}


				else if($scope.tipo=='money'){

					/*
					element.attr("type","tel");
					element.bind("keyup",function(){

                    var valor = ctrl.$viewValue;

						if(valor<100 && valor.indexOf(".")==-1){


						}else{

							valor  = valor.replace(".","");
							valor  = valor.replace(" ","");
							valor = valor/100;
						}


						ctrl.$setViewValue(valor);

						$scope.$apply();

					});


					element.maskMoney();

					 */
				}

				else if($scope.tipo=='monthPicker'){

					element.datepicker( {

						onSelect:function(value){
							showButtonPanel: true
						}


					});

					element.bind('click',function(){

						ctrl.$setViewValue(element.val());
						ctrl.$render();
					});

				}


				if($scope.tipo=='time'){

					element.datepicker({
						dateFormat: 'HH:mm:ss',
						"z-index":9999,
						onSelect: function (date) {
							ctrl.$setViewValue(date);
						}
					});
				}

				if($scope.tipo=='data'){

					var format = $scope.dateFormat;



					$(element).focus(function(){

						this.blur();
					});


					if(format && format=='MM/yyyy'){

						element.MonthPicker();

					}

					else {

						element.datepicker({
							dateFormat: 'dd/mm/yy',
							"z-index":9999,
							onSelect: function (date) {
								ctrl.$setViewValue(date);
							}
						});


					}

				}



				element.bind("keyup",function(value){

					if($scope.tipo=='data')	{

						ctrl.$setViewValue(_formatDate(ctrl.$viewValue));

						ctrl.$render();

					}

				});

				//Interceptador de Valores
				ctrl.$parsers.push(function(value){

					if($scope.tipo=='data')
						value = $filter("date")(value,"dd/MM/yyyy");

					else if($scope.tipo=='time')
						value = $filter("date")(value,"HH:mm:ss");


					return value;
				});

				//Filtros
				ctrl.$formatters.push(function(value){

					if($scope.tipo=='data'){
						value = $filter("date")(value,"dd/MM/yyyy");
						ctrl.$setViewValue(value);
						ctrl.$render();
					}

					else if($scope.tipo=='time'){
						value = $filter("date")(value,"HH:mm:ss");
						ctrl.$setViewValue(value);
						ctrl.$render();
					}




					return value;

				});


				//Formatação de datas
				var _formatDate = function(data){

					data = data.replace(/[^0-9]+/g,"");

					if(data.length>2){
						data = data.substring(0,2) +"/" +data.substring(2); 
					}

					if(data.length >5){
						data = data.substring(0,5) +"/" +data.substring(5,9); 
					}

					return data;

				}

			}


		}


	})

})();

"use strict";
(function(){

	angular.module("adm") 

	.controller("estadosCidadesController",function(stService,stUtil){

		var vm = this;

		vm.loadingEstados = true;
		stService.executeGet("estadoscidades/get-estados").success(function(data){

			vm.loadingEstados = false;
			vm.estados= data.itens;

			//Se a uf estiver definida, o estado no model é setado
			if(vm.uf){

				var index = stUtil.buscaOb(vm.estados,vm.uf,"uf");
				vm.estado = vm.estados[index];
				vm.changeEstado({uf:vm.uf});

			}

		});

		vm.changeCidade = function(cidade){

			vm.uf =cidade.uf;
			vm.codigoMunicipio = cidade.codigoMunicipio;
			vm.nomeMunicipio = cidade.nome;
			vm.codigoUf = vm.estado.codigoUf;
		}

		vm.changeEstado = function(estado){

			vm.loadingCidades = true;

			stService.executeGet("estadoscidades/get-cidades",{uf:estado.uf}).success(function(data){

				vm.loadingCidades = false;

				vm.cidades= data.itens;

			});
		}

		//Se o código do municipio estiver definido, o municípo completo é recuperado
		if(vm.codigoMunicipio){

			vm.loading = true;

			//Recupera as informações completas da cidade
			stService.executeGet("/estadoscidades/get-cidade",{codMun:vm.codigoMunicipio}).success(function(data){

				vm.cidade = data.item;
				vm.loading = false;
			});

		}
	})

})();

"use strict";

(function(){

	angular.module("adm")

	.directive("stMenu",function(){

		return{
			templateUrl:'global/st-app/st-menu/template-module/stMenu.html',
			scope:{

				itens: "="
			},
			controller:function($scope, $rootScope, $route, $filter, anchorScroll, loginUtil, $location, Fullscreen, $localStorage, stUtil, pdvUtil, estoqueUtil, movUtil , config){

				$scope.appVersion = config.appVersion;
				
				$rootScope.$on('$routeChangeSuccess', function() {

					var path;

					if($route.current.$$route)
						path = 	$route.current.$$route.originalPath;

					else {
						$location.path("login");
						return;
					}

					if( path=='/cadastro/:login' ||  path=='/login' || path=='/change-password' || path=='/video-apresentacao' || path=='/login-redirect' || path=="/login/:login" || path=="/initial-config")
						$scope.showMenu = false;
					else
						$scope.showMenu = true;

					$scope.clickItemMenu(path);

				});

				$scope.cadDespesa = function(){

					movUtil.openMov({tipo:1},null,function(mov){

						var mensagem = "Despesa no valor de R$ "+$filter("number")(mov.valor,2)+" cadastrada com sucesso!";

						stUtil.showMessage("",mensagem,"info");

						$route.reload();

					});
				}

				$scope.clickItemMenu  = function(path){

					path = path.replace("/","");

					var indexItem = stUtil.buscaOb( $scope.itens, path,"path");
					var item = $scope.itens[indexItem];

					$scope.atualPage  = item.label;
					$scope.currentPath = item.path;
					document.title = item.label || 'SierTech - Gestão Fácil';

					//Histórico de navegação
					$scope.routeHistory =   $scope.routeHistory || [];

					//Retira do histórico caso o item seja repetido
					var indexHistory = stUtil.buscaOb(  $scope.routeHistory,item.label,"label");

					if(indexHistory!=-1){

						$scope.routeHistory.splice(indexHistory,1);
					}

					$scope.routeHistory.push(item);
					$location.path(item.path);

				}

				$rootScope.absUrl = $location.$$absUrl;

				$scope.enableFullScreen=function(){

					Fullscreen.all();
				}

				$scope.enableFullScreen();

				$rootScope.menuCollapsed =true;

				$scope.changeCollapse = function(){

					$rootScope.menuCollapsed = ! $rootScope.menuCollapsed;
				}

				if(!$rootScope.usuarioSistema){

					$rootScope.usuarioSistema = $localStorage.usuarioSistema;
				}

				$scope.atualizarEstoque = function(){

					estoqueUtil.openEntradaMercadoria();
				}

				$scope.novaVenda = function(){

					pdvUtil.openVendaInModal();

				}

				//anchor
				$scope.gotoAnchor = function(id) {

					anchorScroll.scrollTo(id);

				};

				$scope.goToPageAnt = function(){

					window.history.back();

				}

				$scope.logOut = function(){

					loginUtil.logOut();

				}

			}	
		}

	})

})();


"use strict";
(function(){

	angular.module("adm") 

	.factory('menuUtil', function($rootScope,$filter, stUtil){

       var _startOnboard = function(scope){
    	
    	   
       }		



		return {

			startOnboard: _startOnboard 
			
		}

	})

})();

"use strict";
(function(){

	angular.module("adm")

	.controller("stControl",function($scope,$rootScope,$route,stService,$location,$stModal,$timeout,stUtil,$filter){

		//Quantidade de itens (lista)
		var maxIni = $rootScope.config.confs.maxItensPage||7;

		//Atributos uteis
		$scope.dataHoje =  $filter("date")(new Date(),"dd/MM/yyyy");

		//Controle de carregamento
		$scope.loadingStatus=false;

		$scope.host = $location.$$host;

		var path  =  $location.$$path;
		var opcoes =  path.match(/\w+/gi);
		var item = {};
		var itens = [];
		var nomeObjeto;
		var idObjeto  = path.match(/\d+/i) || 0;
		var metodo;

		if(opcoes.length==3)
			nomeObjeto=opcoes[1];
		else {
			nomeObjeto=opcoes[0];
		}

		if(idObjeto==0)
			metodo  = opcoes[1] || "get";
		else
			metodo="add";

		//Nome do objeto tratado
		$scope.nomeObjeto = nomeObjeto;
		$scope.loadingStatus=true;

		$timeout(function(){

			if(!$scope.objetos){

				//Se o método for get, recupera a lista de objetos 
				if(metodo=="get") {

					stService.getLikeMap($scope.nomeObjeto,[''],0,maxIni,'').success(function(data){

						$scope.objetos = data.itens;
						$scope.loadingStatus=false

					});
				}
			}

		},900);

		//Se o método for add, recupera o item caso seja fornecido o id
		if(metodo=="add" && idObjeto!=0){

			stService.getById($scope.nomeObjeto,idObjeto).success(function(data){

				$scope.objeto = data.item;
				item = data.item;

			});  
		}

		//Selecionar todos os objetos
		$scope.selecionarTodos = function(sele,objetos){

			for(var i in objetos){
				objetos[i].selecionado=sele;
			}
		}

		//Salvar Todos
		$scope.saveAll = function(objetos){

			for(var i in objetos){

				if(objetos[i].selecionado)
					$scope.save(objetos[i],null,null,true);
			}
		}

		$scope.save  = function(objeto,nextLink,reqs,attrUnique){

			$scope.savingStatus=true;

			//Adicionar atributos ao objeto de acordo com a tab
			if($scope.activeTab){

				var appends  = $scope.activeTab.objectAppend;

				for(var key in appends){

					objeto[key] = appends[key];

				}

			}

			if(!objeto)
				$stModal.show({mensagem:"Preencha os campos corretamente."});

			//Valiação dos Campos
			for(var i in reqs){

				if(!objeto[reqs[i]] && reqs[i]!='id'){

					$stModal.show({mensagem:"O campo "+reqs[i]+" está vazio."});
					return;

				}

			}

			if(attrUnique){

				var query = attrUnique+"='"+objeto[attrUnique]+"'";
				console.log("Query: "+query);
				stService.getLikeMap($scope.nomeObjeto,[query],0,0,"").success(function(data){

					if(data.itens.length>0){
						stUtil.showMessage("","Já existe um registro com '"+objeto[attrUnique]+"' cadastrado no sistema","danger");
						return;
					}
					else {
						saveObject(objeto,nextLink);
					}

				});
			}

			else{

				saveObject(objeto,nextLink);
			}

		}

		$scope.getLike = function(query,propriedade){

			$scope.loading=true;

			if(!query)
				query="";

			console.log("Prop: "+propriedade);

			if(!propriedade)
				propriedade="nome";

			stService.getLike($scope.nomeObjeto,query,propriedade).success(function(data){

				$scope.objetos = data.itens;
				itens = data.itens;

				$scope.loading=false;
			});

		}

		//Máxima de itens por pagina
		$scope.setMaxIni = function(max){

			maxIni = max;

		}

		$scope.getLikeMap = function(qs,pagina,max,extra,orderBy,ordem){

			$scope.loadingStatus=true;

			if($scope.fixQuerys)
				qs =	qs.concat($scope.fixQuerys);

			//Query do bloco direito
			if($scope.rightQuery)
				qs.push($scope.rightQuery);

			//Adicionando ordenacao
			if(orderBy && orderBy!=null){
				if(!extra)
					extra="";
				extra+=" order by "+orderBy+" "+ordem;

			}

			if(!qs || qs.length==0  )
				qs =[""];

			stService.getLikeMap($scope.nomeObjeto,qs,pagina,max, extra).success(function(data){

				$scope.countAll = data.countAll;//Quantidade total de itens independente da paginação
                $scope.objetos = data.itens;
				itens = data.itens;
				$scope.loadingStatus=false;

			});

		}

		$scope.disableObject = function(objeto,callback,message){

			objeto.disable=1;

			stService.save($scope.nomeObjeto,objeto).success(function(data){

				stUtil.showMessage("",message||'Item removido com sucesso!',"info");
				callback(data);

			});
		} 

		$scope.apagar =  function(objetos){

			var ids =[];
			var selecionados = objetos.filter(function(ob,index){

				if(ob.selecionado){
					ids.push(ob.id);
					objetos.splice(index,1);
				}
			});

			if(ids.length==0){

				stUtil.showMessage("Nenhum item selecionado.","","danger");
				return;
			}

			stService.apagar($scope.nomeObjeto,ids).success(function(data){

				var msg ="";
				if(ids.length>1)
					msg="Itens excluidos com sucesso!";
				else
					msg="Item excluido com sucesso!";

				stUtil.showMessage("",msg,"success");

			});
		}

		$scope.getLink = function(pagina){

			if(pagina=='comanda')
				return $location.$$host+":1220/Albar/comanda/index.html#/inicio"

		}

		function saveObject(objeto,nextLink){

			stService.save($scope.nomeObjeto,objeto).success(function(data){

				$scope.objeto = data.item; 

				if(nextLink)
					$location.path(replaceByAttr(nextLink,data.item));

				stUtil.showMessage("","Salvo com sucesso!","success");
				$route.reload();
				$scope.objeto={};

			});

		}

	});

	//Replace no formato 'abcdefghijklmno[attr]'
	function replaceByAttr (string,item){

		var pattern  = new RegExp(/\[[a-z]+\]/);
		var atributo  = pattern.exec(string);
		var attr = atributo[0];
		attr = attr.replace("[","");
		attr  = attr.replace("]","");
		string = string.replace(pattern,item[attr]);
		return string;

	}

})();

"use strict";
(function(){
angular.module("adm").controller("testeController", function($scope, chronoService, stService, dateUtil){
	
	
	$scope.changeDate = function(data){
		
		console.log(dateUtil.getDate(data).getTime());
		console.log(new Date().getTime());
	}
	
   $scope.iniciar = function(){
	   
	   $scope.executando = true;
	   execute(0, 10);
	   
   }
	
	function execute(i, tam){
		
		if(i>=tam){
			$scope.executando = false;
			return;
		}
		
		stService.executeGet("/config").then(function(data){
			
			console.log("resposta: ");
			console.log(data);
			execute((i+1), tam);
		});
	}

	
})
})();

"use strict";
(function(){
angular.module("adm").controller("inicioController",function($scope, $rootScope, dateUtil, stService, $route, movUtil, pdvUtil, estoqueUtil, onboardUtil, deviceDetector, $timeout, menuUtil, configUtil, leadUtil){


	$scope.showOnboardMenu = $rootScope.config.confs.visualizouOnboardingMenu!='true' && deviceDetector.isMobile()==true;



	$scope.finalizarOnboardingMenu = function(){

		configUtil.setConfig("visualizouOnboardingMenu","true", function(){

			leadUtil.addSubsMetric("onboard_menu", 1);
			onboardUtil.openOnboardIntro();

		})

	}




	$scope.stepsMenu = [


{

	title: "Seja bem vindo ao CeasaPlus!",
	position: "bottom",
	description: "Este é o menu com todas as opções do sistema.",
	attachTo: "#button-menu-mobile",
	arrowClass:"onboarding-button-menu-arrow",
	nextButtonText:"OK",
	overlayOpacity: 0,
	xOffset:45,
	yOffset:30

},

{

	title: "Entrada de mercadoria",
	position: "top",
	description: "Para lançar a entrada de mercadoria do dia é só clicar aqui.",
	attachTo: "#atalho-entrada-mercadoria",
	showPreviousButton:false,
	nextButtonText:"OK",
	overlayOpacity: 0,
	xOffset:-120,
	yOffset:10


},

{

	title: "Lançar venda",
	position: "top",
	description: "Para efetuar uma nova venda é só clicar aqui.",
	attachTo: "#atalho-nova-venda",
	showPreviousButton:false,
	doneButtonText:"OK",
	overlayOpacity: 0,
	xOffset:-120,
	yOffset:10

}



];




	$scope.hoje = new Date();

	$scope.atualizar = function(){

		$route.reload();
	}

	$scope.atualizarEstoque = function(){

		estoqueUtil.openEntradaMercadoria();
	}

	$scope.novaVenda = function(){

		pdvUtil.openVendaInModal();
	}

})

})();

"use strict";
(function(){
angular.module("adm").config(function($routeProvider,$httpProvider){

	//Inicio
	$routeProvider.when("/inicio",{

		templateUrl:"global/st-app/app-inicio/template-route/inicio.html",
		controller:"inicioController"	

	}); 

})
})();


"use strict";
(function(){
angular.module("adm").controller("registroPontoController",function(stService,stUtil){
	
	var vm  = this;
	
	vm.deletarRP = function(index,rp,objetos){
		
		objetos.splice(index,1);
		
		stService.apagar("registroponto",[rp.id]).success(function(){
			stUtil.showMessage("","Item excluido com sucesso!");
		});
	}
	
	vm.abrirPonto  = function(){
		
		var ponto = {};
		ponto.pessoa = vm.pessoa;
		stService.executePost("registroponto/abrir-ponto/",ponto).success(function(){
			 
			stUtil.showMessage("","Ponto registrado com sucesso!","info");
			delete vm.ponto;
			
		}).error(function(){
			
			stUtil.showMessage("","Ocorreu um erro ao registrar o ponto, tente novamente.","danger");
		});
		
	}
	
	vm.fecharPonto  = function(ponto){
		
		stService.executePost("registroponto/fechar-ponto/",ponto).success(function(){
			
			stUtil.showMessage("","Ponto fechado com sucesso!","info");
			delete vm.ponto;
			
		}).error(function(){
			stUtil.showMessage("","Ocorreu um erro ao registrar o ponto, tente novamente.","danger");
		});
		
	}
	
	vm.buscaPonto = function(pin){
		
		var qs = ["pessoa.pin="+pin,"dataFim=null"];
		
		stService.executeGet("funcionario/b",{propriedade:"pin",query:pin}).success(function(data){
			
			vm.pessoa  = data.itens[0];

			if(data.itens[0]){
				
				//Recupera pontos abertos para esse funcionário
				stService.getLikeMap("registroponto",["pessoa.pin="+pin,"dataFim=null"],0,0,'').success(function(data){
					
					console.log("Pontos abertos do funcionário: ");
					console.log(data.itens);
					vm.ponto = data.itens[0];
					if(!vm.ponto)
						vm.ponto = {};
					
				});
				
			}
			else{
				stUtil.showMessage("","Funcionário não encontrado!","danger");
			}
			
		});
		
	}
	
});

})();
"use strict";
(function(){
angular.module("adm").controller("listaPontoController",function(stService,stUtil,$uibModal,dateUtil){
	
	var vm  = this;
	
	vm.editarPonto = function(ponto){
		
		$uibModal.open({
			animation: true,
			templateUrl:"view/registroponto/modalEditPonto.html",
			size:'lg',
			controller:function($scope){
				
			    $scope.dataIni = new Date(ponto.dataInicio);
			    $scope.dataFim = new Date(ponto.dataFim);
			    $scope.timeIni = new Date(ponto.dataInicio);
			    $scope.timeFim = new Date(ponto.dataFim);
                $scope.ponto = ponto;

				$scope.salvar = function(dataIni,dataFim,timeIni,timeFim,modal){

					var dataInicio = new Date(dateUtil.formatDate(dataIni));
					dataInicio.setHours(timeIni.getHours(),timeIni.getMinutes(),timeIni.getSeconds());
					
					var dataFim = new Date(dateUtil.formatDate(dataFim));
					dataFim.setHours(timeFim.getHours(),timeFim.getMinutes(),timeFim.getSeconds());
					
					dataInicio.setDate(dataInicio.getDate()+1);
					dataFim.setDate(dataFim.getDate()+1);
					
					ponto.dataInicio = dataInicio;
					ponto.dataFim = dataFim;
					
					stService.save("registroponto", ponto).success(function(data){
						
						stUtil.showMessage("","Alterado com sucesso!","info");
						
					});
					
					modal.$dismiss('cancel');

				}

			}
		});
	}
	
	vm.deletarRP = function(index,rp,objetos){
		
		objetos.splice(index,1);
		
		stService.apagar("registroponto",[rp.id]).success(function(){
			stUtil.showMessage("","Registro excluido com sucesso!");
		});
	}
	
});
})();
"use strict";
(function(){
angular.module("adm").config(function($routeProvider,$httpProvider){

	$routeProvider.when("/registroponto",{

		templateUrl:"global/st-app/controle-ponto/template-route/listaPontos.html",
		controller:"stControl"

	});

	$routeProvider.when("/registrarponto",{

		templateUrl:"global/st-app/controle-ponto/template-route/registro-ponto.html",

	});
	
})
})();


"use strict";
(function(){
angular.module("adm").controller("changePasswordController",function($rootScope, $scope,stService,$cookieStore,$location,st,$localStorage, stUtil, configUtil){

	$scope.usuarioSistema =  $cookieStore.get("usuarioSistema");

	$scope.lembrarSenha = true;

	$scope.alterarSenha = function(usuarioSistema){

		//Validações
		if(!usuarioSistema.senha || usuarioSistema.senha.length<4)
		{
			stUtil.showMessage("","A senha deve ter pelo menos 4 caracteres.","danger"); 
			return;
		}
		stService.save("operadorsistema",usuarioSistema).success(function(){
			
			st.leadEvt({descricao:"usuario_mudou_senha"});
			
			configUtil.setConfig("mudouSenha", 'true', function(){
				
				//Grava a senha alterada em $localStorage
				$localStorage.senha = usuarioSistema.senha;
				
			    $location.path("/inicio");
			
				
			});

			

		}).error(function(){
			st.evt({evento:"erro_mudar_senha"});
			stUtil.showMessage("","Ocorreu um erro, tente novamente","danger"); 
		});
	}

})
})();

"use strict";
(function(){
angular.module("adm").config(function($routeProvider,$httpProvider){

	//Login
	$routeProvider.when("/login-redirect",{

		templateUrl:"global/st-app/app-login/template-route/login.html",
		controller:"loginController",
		resolve: {
			demo:function(){
				return {};
			},
			redirect:function(){
				return true;
			}
		}
	}); 
	
	
	$routeProvider.when("/initial-config",{

		templateUrl:"global/st-app/app-login/template-route/initialConfig.html",
		controller: function($scope, configUtil, $location){
			
			$scope.setConfig = function(key, value){
				configUtil.setConfig(key, value, function(){
					
					$location.path("/inicio");
				});
			}
		}
		
	}); 
	
	
	$routeProvider.when("/login",{

		templateUrl:"global/st-app/app-login/template-route/login.html",
		controller:"loginController",
		resolve: {
			demo:function(){
				return {};
			},
			redirect:function(){
				false;
			}
			
		}
	}); 
	
	
	
	
	$routeProvider.when("/manutencao",{

		templateUrl:"global/st-app/app-login/template-route/manutencao.html",
		
	});
	
	
	/*
	$routeProvider.when("/login/test",{

		templateUrl:"global/st-app/app-login/template-route/login.html",
		controller:"loginController",
		resolve: {
			demo:function(){
				return {
					empresa:"31992267947",
					usuario:"31992267947",
					senha:"leghacy123"
					};
			}
		}
	}); 
	*/

	$routeProvider.when("/video-apresentacao",{

		templateUrl:"global/st-app/app-login/template-route/videoApresentacao.html",
		controller:function($scope,stUtil,$location,st, configUtil, $interval){

			var youtubePlayer;
			
			$scope.showButton=true;
			
			$scope.playerVars = {
					controls: 0,
					color:"red",
					modestbranding : 1,
					autoplay: 0,
					modestbranding:1,
					rel:0
			};
			
			$scope.$on('youtube.player.ready', function ($event, player) {

		        youtubePlayer = player;
		        youtubePlayer.playVideo();
				
			});
			
			$interval(function(){

				if($scope.videoTutorial.getCurrentTime()>200 ){
                   
					$scope.showButton=true;
				}
			
			},1000);
			
			$scope.proximo = function(){
				configUtil.setConfig("assistiuTutorialBasico", 'true', function(){
					
					st.leadEvt({descricao:"assistiu_tutorial_basico_"+parseInt($scope.videoTutorial.getCurrentTime())});
					stUtil.showMessage("","Seja bem vindo!","info");
					
					$location.path("/initial-config");
					
				});
				
			
			}
		}

	}); 

	//Mudança de senha padrão
	$routeProvider.when("/change-password",{

		templateUrl:"global/st-app/app-login/template-route/change-password.html",
		controller:"changePasswordController",

	}); 

  /*
	//Login demonstrativo ADM
	$routeProvider.when("/login/demo",{

		templateUrl:"global/st-app/app-login/template-route/login.html",
		controller:"loginController",
		resolve: {
			demo:function(){
				return {empresa:"admin",usuario:"admin",senha:"admin"};
			}
		}

	}); 
	
	*/

	$routeProvider.when("/login/:login",{

		templateUrl:"global/st-app/app-login/template-route/aguarde.html",
		resolve: {

			cadastrarUsuario: function(loginUtil,$route,$rootScope,$localStorage, stService,st, $cookieStore, $location){

				var login = $route.current.params.login;

				//Realiza o cadastro do usuário
				stService.executeGet("cadastrar-usuario",{login:login}).success(function(){

					$localStorage.empresa = login;
					$localStorage.usuario = login;
					$localStorage.senha  = $localStorage.senha||"123",	
					$location.path("login");
					
				})
				//Caso ocorra um erro ao cadastrar o usuário
				.error(function(){

				});

			}

		}
	
	});
	
	$routeProvider.when("/cadastro/:login",{

		templateUrl:"global/st-app/app-login/template-route/cadastroUsuario.html",
		resolve: {

			cadastrarUsuario: function(loginUtil,$route,$rootScope,$localStorage, stService,st, $cookieStore, $location){

				var login = $route.current.params.login;

				//Realiza o cadastro do usuário
				stService.executeGet("cadastrar-usuario",{login:login}).success(function(){

					$localStorage.empresa = login;
					$localStorage.usuario = login;
					$localStorage.senha  ="123",	
					$location.path("login");
					
				})
				//Caso ocorra um erro ao cadastrar o usuário
				.error(function(){

				});

			}

		}
	
	});
	
	

	
});

})();


"use strict";
(function(){

	angular.module("adm") 

	.factory("loginUtil",function(cacheGet,$localStorage,$rootScope,$cookieStore,stService,filialUtil, $location, dateUtil, $uibModal, st){

		var _openModalDateErro = function(){

			$uibModal.open({
				animation: true,
				templateUrl:"global/st-app/app-login/template-module/modalDateErro.html",
				size:'lg',
				controller:function($scope){

				}
			});

		}

		var _openLembrarSenha = function(){

			$uibModal.open({
				animation: true,
				templateUrl:"global/st-app/app-login/template-module/modalLembrarSenha.html",
				size:'lg',
				bindToController:"true",
				controllerAs:"vm",
				controller:function(stService, stUtil, $modalInstance){

					var vm = this;
					vm.step=1;
					vm.numero = $localStorage.usuario;
					vm.fechar = function(){
						 $modalInstance.close();
					}
					vm.lembrarSenha = function(_numero){
						
						stService.executeGet("/lembrar-senha-sms", {numero: _numero}).success(function(res){
							
							if(res==true)
								vm.step=2;
							else{
								stUtil.showMessage("","Usuário inexistente no sistema","danger");
							}
							
						});
					}
				}
			});

		}



		var _logOut = function() {
			delete $rootScope.user;
			delete $rootScope.authToken;
			delete $rootScope.usuarioSistema;
			delete $localStorage.senha;
			$cookieStore.remove('authToken');
			$cookieStore.remove('usuarioSistema')
			$location.path("/login");
		};

		var _configureSystemForUser = function(loginData, callback){

			//Token de acesso gerado pelo back-end
			var authToken = loginData.token;
			$rootScope.authToken = authToken;
			$cookieStore.put('authToken', authToken);

			//Informações do usuário logado
			var usuarioSistema = loginData.usuarioSistema;
			usuarioSistema.originalLogin = usuarioSistema.login;
			usuarioSistema.login = usuarioSistema.login.split('@')[0];
			$rootScope.usuarioSistema = usuarioSistema;
			$rootScope.config = loginData.config;
			$cookieStore.put('usuarioSistema', usuarioSistema);

			//Filiais disponíveis no sistema
			filialUtil.getAllFiliais(function(filiaisReturn){

				console.log("filiaisReturn: ");
				console.log(filiaisReturn);

				if(!filiaisReturn){
					callback();
					return;
				}

				//Cache offline para otimização do PDV
				cacheGet.getOfflineCache(function(resCache){

					if(!resCache){
						callback();
						return;
					}

					var idFilialInConfig = parseInt($rootScope.config.confs.currentFilialId);
					var nomeFilial = $rootScope.config.confs.labelCurrentFilial;

					if(idFilialInConfig>0){
						$rootScope.currentFilial = {id: idFilialInConfig, xNome: nomeFilial};
					}

					callback(loginData);

				})

			});

		}

		var _logar = function(login, lembrarSenha, callback){

			$localStorage.empresa = login.empresa;
			$localStorage.usuario = login.usuario;

			if(lembrarSenha==true)
				$localStorage.senha = login.senha;
			else{

				delete  $localStorage.senha;
			}

			//remove o token antigo
			$cookieStore.remove('authToken');

			stService.executePost("/user/login/", login).success(function(data){

				//Verifica se a data do computador é a mesma do backend
				var dataFrontEnd  = dateUtil.getDate(new Date());
				var dataBackEnd = dateUtil.getDate(data.dataBackEnd);

				console.log("data do front end: ");
				console.log(dataFrontEnd.getTime());
				console.log("data do backend: ");
				console.log(dataBackEnd.getTime());

				if(dataFrontEnd.getTime() != dataBackEnd.getTime()){

					st.evt({evento:"data_frontend_errada",descricao:"data_usuario_errada", descricao:"data do backend: "+dataBackEnd+", data do frontend: "+dataFrontEnd});
					_openModalDateErro();
					callback();
					return;
				}

				_configureSystemForUser(data, callback);

			}).error(function(data,erro){

				callback();

			});

		}

		var _isLogado = function(){

			if($rootScope.usuarioSistema)
				return true;
			else
				return false;
		}

		return{
			logar: _logar,
			logOut:_logOut,
			isLogado: _isLogado,
			openLembrarSenha: _openLembrarSenha

		}
	})

})();

"use strict";
(function(){
angular.module("adm").controller("loginController",function(demo,$scope,$location,$rootScope,$localStorage,$cookieStore,loginUtil, stUtil, redirect, st, leadUtil){

	if(redirect==true){
		st.evt({evento:"usuario_foi_deslogado", descricao:"O usuário foi deslogado do Sistema"});

	}

	$scope.carregando = false;
	$scope.lembrarSenha = true;

	//Exibir ou não o campo 'empresa'
	$scope.showEmpresa = true;

	//Caso seja usuário do ceasa, o campo empresa nãoé exbido
	if($location.$$absUrl.indexOf("ceasaplus")!=-1){

		$scope.showEmpresa = false
	}

	if(!$rootScope.usuarioSistema)
		$rootScope.usuarioSistema = $cookieStore.get("usuarioSistema");

	$scope.lembrarSenhaUsuario = function(){
		loginUtil.openLembrarSenha();
	}
	
	$scope.logar = function(login,lembrarSenha){

		if(!login.usuario){

			stUtil.showMessage("","Informe o Usuário","danger");
			return;
		}

		if(!login.senha){

			stUtil.showMessage("","Informe a senha","danger");
			return;
		}

		login.empresa = login.usuario;

		$scope.carregando=true;
		loginUtil.logar(login,lembrarSenha,function(loginData){
			
			$scope.carregando=false;
			
			console.log("login data: ");
			console.log(loginData);
		
			if(loginData){
				
				leadUtil.addMetricaTipoDispositivo();
				leadUtil.addSubsMetric("dataUltimoLogin", new Date().getTime());
				leadUtil.changeAttr("dataUltimoLogin", new Date().getTime(), loginData.idLead);
			
				if($rootScope.config.confs.mudouSenha != 'true'){
					
					$location.path("/change-password");
					
				}
				
				else{
				  $location.path("/inicio");
				}
			}
			else{
				$scope.login.senha = "";
				delete $localStorage.senha;
				stUtil.showMessage("","Ocorreu um erro ao realizar login, tente novamente","danger");
			}

		});
	}

	$scope.logOut = function() {
		loginUtil.logOut();
		$location.path("/login");
	};

	//demo é utilizado para login de demonstração
	if(demo.usuario){
		$scope.login = {empresa:demo.empresa,usuario:demo.usuario,senha:demo.senha};
		$scope.logar($scope.login);

	}else{

		$scope.login = {empresa:$localStorage.empresa,usuario:$localStorage.usuario,senha:$localStorage.senha};
		$scope.existeEmpresa = false;

	}

	if($localStorage.usuario && $localStorage.senha){
		$scope.logar($scope.login, true);
	}

})

})();
"use strict";
(function(){
angular.module("adm").config(function($routeProvider,$httpProvider){

	$routeProvider.when("/pdv",{

		templateUrl:"global/st-app/app-pdv/template-route/vendas.html",
		controller:"stControl"

	}); 

	$routeProvider.when("/pdvficha/add",{

		controller:function($scope,	$uibModal){

			$uibModal.open({
				animation: true,
				templateUrl:"global/st-app/app-pdv/template-route/pdv-ficha.html",
				size:'lg',
				controller:"pdvFichaController",
				resolve:{

					pdv:function(){
						return {};
					},
					callback:function(){

						return null;
					}
				}

			});
		}

	}); 

	$routeProvider.when("/pdvficha/:id",{

		templateUrl:"global/st-app/app-pdv/template-route/pdv-ficha.html",
		controller:"pdvFichaController",
		resolve:{
			pdv:function(stService,$route){

				return stService.getById("pdv",$route.current.params.id);
			},
			callback: function(){

				return null;
			}
		}

	}); 

})
})();

"use strict";
(function(){
	angular.module("adm") 

	.factory("pdvUtil",function($uibModal,$location,stUtil,stService,estoqueUtil,$rootScope,$route,movUtil,$filter){

		//abre uma venda utilizando um modal
		var _openVendaInModal = function(pdv, callback){

			if(pdv)
				var pdv = {data:{item:pdv}};

			$uibModal.open({
				animation: true,
				backdrop: 'static',
				templateUrl:"global/st-app/app-pdv/template-module/pdv-ficha.html",
				controller:"pdvFichaController",
				bindToController:true,
				controllerAs: "vm",
				size:"lg",
				resolve: {
					callback:callback,
					pdv:pdv || {}
				}

			});

		}

		var _getTotalPedidos = function(pedidos){

			var total = 0;

			for(i in pedidos){
				total+=pedidos[i].valorUnitario * pedidos[i].quantidade; 
			}

			return total;

		}

		//Salva o estado de um pdv a partir do botão de retirada
		var _savePdvFromRetirada =function(pdv,callback){

			stService.save("pdv",pdv).success(function(data){

				stUtil.showMessage("","Venda atualizada com sucesso!","info");
				callback(data.item);

			}).error(function(){

				pdv.carregado = !pdv.carregado;
				callback(pdv);
				stUtil.showMessage("","Ocorreu um erro ao atualizar a venda, verifique sua conexão com a internet e tente novamente.","danger");

			});

		};

		//Vai para um pdv a partir de uma movimentação
		var _goToPdvFromMov = function(mov){

			var idMov = mov.id;

			if(mov.originalMov)
				idMov = mov.originalMov.id;

			stService.getLike("pdv",idMov,"id_movimentacao").success(function(data){

				var pdv = data.itens[0];
				_goToPdv(pdv.id,pdv.tipoPdvLancamento);

			});

		}
		
		//Recupera um pdv a partir de uma movimentação
		var _getPDVByMovId = function(mov, callback){

			var idMov = mov.id;

			if(mov.originalMov)
				idMov = mov.originalMov.id;

			stService.getLike("pdv",idMov,"id_movimentacao").success(function(data){

				callback(data.itens[0]);

			}).error(function(){
				callback();
			});

		}

		var _goToPdv = function(id){

			stService.getById("pdv",id).success(function(data){

				_openVendaInModal(data.item);

			});

		}

		var _deletarVenda = function(pdv,callback){

			//Deleta o PDV
			stService.executePost("pdv/delete/",pdv).success(function(data){

				callback(data);

			});
		}

		return{

			savePdvFromRetirada: _savePdvFromRetirada,
			goToPdv:_goToPdv,
			getTotalPedidos:_getTotalPedidos,
			goToPdvFromMov: _goToPdvFromMov,
			deletarVenda:_deletarVenda,
			openVendaInModal:_openVendaInModal,
			getPDVByMovId: _getPDVByMovId 
		}

	})

})();

"use strict";
(function(){
	angular.module("adm").controller("pdvFichaController",function(cacheGet, $location ,cachePost, $uibModal, pdvUtil, pedidoUtil, $rootScope, $scope, stService ,pdv, stUtil ,movUtil,$route, $filter, st, nfeUtil, $modalInstance, lrUtil, leadUtil){

		var vm = this;
		var ini = new Date().getTime();

		vm.changeDataPdv = function(data){

			vm.pdv.movimentacao.data = data;
		}

		vm.changeStep = function(step){

			vm.step=step;

			var _infoModal = {};

			if(step==0){
				_infoModal.titulo = "Definição do cliente";
				_infoModal.okActionLabel = "Avançar";
				_infoModal.okActionIcon = "fa-angle-double-right";
			}

			//Escolha de produtos
			else if(step==1){
				_infoModal.titulo = "Definição dos produtos";
				_infoModal.okActionLabel = $rootScope.config.confs.showEmpEmbalagensPdv=='true' ? "Avançar" :"Finalizar";
				_infoModal.okActionIcon = "fa-angle-double-right";
			}
			else if(step==2){
				_infoModal.titulo = "Empréstimo de embalagens";
				_infoModal.okActionLabel  = "Finalizar";
				_infoModal.okActionIcon = "fa-check";
			}

			vm.infoModal = _infoModal;

		}

		vm.cancelAction = function(){

			if(vm.step>=1){
				vm.changeStep(vm.step-1);
			}
			else {
				//TODO confirmação
				$modalInstance.close();
			}
		}

		$scope.$watch("vm.pdv.movimentacao.pessoa", function(){
			
			if(!vm.pdv.movimentacao.pessoa)
				return;

			if(!vm.pdv.id && vm.pdv.movimentacao.pessoa.nome == vm.defaultClienteLabel){

				vm.pdv.carregado = 1;
				vm.pdv.movimentacao.baixada = true;

			}
			else{
				
				lrUtil.getInfoEmprestimos(vm.pdv.movimentacao.pessoa, function(emprestimo){

					if(emprestimo)
						vm.quantidadeEmbalagemReceber = emprestimo.quantidadeReceber;

				});
			}

			vm.pdv.movimentacao.pessoa = cacheGet.getObjectById("cliente",vm.pdv.movimentacao.pessoa.id);

			getProdutosSugeridosByCliente(vm.pdv.movimentacao.pessoa);

			

		});

		vm.deletarVenda = function(){

			pdvUtil.deletarVenda(vm.pdv,function(data){

				stUtil.showMessage("","Venda deletada com sucesso!");
				$modalInstance.close();
				$route.reload();

			});

		}

		//A cada mudança nos pedidos o valor total é atualizado
		$scope.$watch('vm.pdv.movimentacao.pedidos',function(pedidos){

			vm.totalPdv = pedidoUtil.getTotalPedidos(pedidos);

		},true);

		//NFe a partir da movimentacao da venda
		vm.toNFe = function(pdv, modal){

			nfeUtil.openNFe(null,pdv.movimentacao.id);
		}

		//Lançamento da venda
		vm.lancarVenda = function(){

			if($rootScope.config.confs.saveLastDataEmissaoPdv=='true'){
				$rootScope.config.confs.lastDataEmissaoPdv = vm.pdv.data;	
			}
			else {
				$rootScope.config.confs.lastDataEmissaoPdv = null;
			}

			var pdv = vm.pdv;

			if(!pdv.movimentacao.pessoa){

				stUtil.showMessage("","Selecione um cliente para continuar.","danger");
				vm.changeStep(0);
				return;
			}

			if(vm.step==1){

				   //Somente pedidos com quantidade>0
				   pdv.movimentacao.pedidos = pdv.movimentacao.pedidos.filter(function(pedido){

					//O pedido deve ter a quantidade>0 ou já ter sido salvo na venda
					if(pedido.quantidade>0 || pedido.id)
						return pedido;
				});

				if(pdv.movimentacao.pedidos.length==0){
					stUtil.showMessage("","Adicione pelo menos um produto!","danger");
					return;
				}
			}


			if(vm.step<2 && ($rootScope.config.confs.showEmpEmbalagensPdv=='true' || vm.step<1) ){
				vm.changeStep(vm.step+1);
				return;
			}

			var msg = "";

			if(!pdv.id){
				msg="Venda lançada com sucesso!";
				leadUtil.addIncMetric("cads_venda",1);
			}
			else
				msg="Venda atualizada com sucesso!";

		
			pdv.tipoPdvLancamento="pdvficha";//Tipo de pdv em que a venda foi lançada

			//Nome do evento
			var nomeEvento = "";

			if(pdv.id){
				nomeEvento = "tempo_editar_venda";
				
				
			}

			else 
				nomeEvento = "tempo_finalizar_venda";

			//Tempo de resposta do servidor
			var iniTempoResposta = new Date().getTime();

			vm.carregandoFinalizarVenda =true;

			cachePost.add("pdv/add/", pdv, function(){

				vm.carregandoFinalizarVenda =false;

				st.evt({evento:nomeEvento,descricao:((new Date().getTime()-ini)/1000)+""});

				$modalInstance.close();
				$uibModal.open({
					animation: true,
					templateUrl:"global/st-app/app-pdv/template-module/modalPosVenda.html",
					size:'lg',
					controller:function($scope, $modalInstance){

						$scope.pdv = pdv;

						$scope.getTotalPedidos = function(pedidos){

							return pedidoUtil.getTotalPedidos(pedidos);
						}

						$scope.novaVenda = function(modal){

							//(Função definida no controller externo ao modal)
							modal.$dismiss("cancel");
							pdvUtil.openVendaInModal();

						}

						$scope.editarVenda= function(pdv,modal){

							modal.$dismiss();
							pdvUtil.openVendaInModal(pdv);

						}

						$scope.toNFe = function(pdv,modal){

							modal.$dismiss('cancel');
							nfeUtil.openNFe(null,pdv.movimentacao.id);
						}

						$scope.toVendas= function(){

							$modalInstance.close();

							if($location.$$path=='/pdv')
								$route.reload();

							else
								$location.path("pdv");

						}

						$scope.fechar = function(ele){

							ele.$dismiss('cancel');
							callback($scope.objeto);

						}

					}
				});

			});


		}

		vm.imprimirCupom = function(idMov){

			var ids = [];
			ids.push(idMov);
			movUtil.imprimirCupom(ids,function(){

			});
		}

		//Sugestão de produtos para o cliente selecionado
		var getProdutosSugeridosByCliente = function(cliente){

			if(!cliente.sugestoesProdutos || cliente.sugestoesProdutos==null)
				return;

			var prods = cliente.sugestoesProdutos.split(",");
			var produtos = [];
			for(var i in prods){
				produtos.push(cacheGet.getObjectById("produto",Number(prods[i])));
			}

			vm.pdv.movimentacao.pedidos = vm.pdv.movimentacao.pedidos.filter(function(ped){

				if(ped.quantidade && ped.quantidade>0)
					return ped;
			});

			vm.pdv.movimentacao.pedidos = pedidoUtil.mergeProdutoInPedidos(produtos, vm.pdv.movimentacao.pedidos);

		}

		//Sugestão de produtos mais vendidos
		var sugestaoProdutos=function(){

			var proj = null;

			//Máximo de itens a serem sugeridos
			var max = parseInt($rootScope.config.confs.maxSugestaoProdutosPDV);
			max = max || 5;

			if($rootScope.config.confs.sugestaoProdutosPDV=='allProdutos'){

				proj = {
						qs: ["id>0"],
						columns:"id",
						objeto:"Produto",
						groupBy:"id",
						extra: "order by id desc",
						max:max
				}

			}

			else if($rootScope.config.confs.sugestaoProdutosPDV=='maisVendidos'){

				proj = {
						qs: ["tipoEntrada=0"],
						columns:"produto.id",
						objeto:"Pedido",
						groupBy:"produto.id",
						extra: " order by sum(quantidade) desc",
						max:max
				}

			}


			if(proj==null)
				return;

			stService.getProjecoes(proj).success(function(data){

				var ids=data.itens;
				var prods= [];

				for(var i in ids){
					prods.push(cacheGet.getObjectById("produto",ids[i]));
				}

				$scope.pdv.movimentacao.pedidos = pedidoUtil.mergeProdutoInPedidos(prods,$scope.pdv.movimentacao.pedidos);
			});
		}

		//Configuração de PDV não-vazio (Edição)
		function configureEditPdv(pdvEdit){

			var peds  = pdvEdit.movimentacao.pedidos;

			for(var i in peds){

				peds[i].quantAnt = peds[i].quantidade;

				//Atualiza o produto do pedido de acordo com o cache
				peds[i].produto = cacheGet.getObjectById("produto",peds[i].produto.id) || peds[i].produto;

			}

			pdvEdit.movimentacao.pedidos = peds;

			return pdvEdit;
		}


		//Configura um pdv vazio no escopo
		function configurePdvVazio(){

			var pdvVazio = {};
			pdvVazio.movimentacao = {};
			pdvVazio.movimentacao.pedidos=[];

			if($rootScope.config.confs.showDataEmissaoPdv=='true'){

				var ultimaData = $rootScope.config.confs.lastDataEmissaoPdv || new Date();
				pdvVazio.data = ultimaData;
				pdvVazio.movimentacao.data  = ultimaData;
			}
			
			return pdvVazio;

		}

		var _init = function(){

			vm.defaultClienteLabel = $rootScope.config.confs.defaultClienteLabel;

			if(pdv.data){

				vm.pdv = configureEditPdv(pdv.data.item);
				vm.titulo = "Editar venda";
			}

			else{

				vm.pdv  = configurePdvVazio();
				vm.titulo = "Nova venda";

			}

			vm.changeStep(0);

		}
		_init();

	});
})();

"use strict";
(function(){
angular.module("adm").controller("listaPdvController",function($scope, $rootScope, printUtil, estoqueUtil, stService, $location, $route, $filter, stUtil, movUtil, pdvUtil, $timeout){

	$scope.hoje = new Date();

	//Query padrão para o dia (Somente hoje)
	$scope.periodoAte = new Date();
	$scope.periodoDe = new Date();
	$scope.periodoDe = $filter("date")($scope.periodoDe,"dd/MM/yyyy");
	$scope.periodoAte = $filter("date")($scope.periodoAte,"dd/MM/yyyy");
	var dataDe = stUtil.formatData($scope.periodoDe);
	var dataAte = stUtil.formatData($scope.periodoAte);
	var query = "(data between '"+dataDe+"' and '"+dataAte+"')";
	$scope.querys =[];
	$scope.querys.push(query);

	$scope.$parent.setMaxIni(5);

	$scope.setPagina  = function(pagina){

		console.log("Chamou aqui");
	}

	$scope.goToPdv = function(pdv){

		console.log("PDV aqui: ");
		console.log(pdv);
		pdvUtil.openVendaInModal(pdv);

	}

	$scope.imprimirCupom = function(mov){

		printUtil.printMovs([mov]);

	}

	$scope.getTotal = function(){

		var pdvs = $scope.$parent.objetos;
		var total  =0;

		for(var i in pdvs){

			total+=pdvs[i].movimentacao.valor;
		}

		return total;

	}

	//Atualiza o status de retirada de um produto
	$scope.saveRetirada = function(pdv){

		stService.executeGet("/pdv/save-retirou",{idPdv:pdv.id,carregado:pdv.carregado}).success(function(){


		}).error(function(){
			
			stUtil.showMessage("","Ocorreu um erro ao alterar o status, verifique sua conexão com a internet","danger");
			pdv.carregado = !pdv.carregado;
		});

	}

	$scope.deletarVenda = function(pdv){

		pdvUtil.deletarVenda(pdv,function(data){


		});


		$timeout(function(){

			$route.reload();

		},300);

	}

	$scope.changePeriodo = function(){

		$scope.periodoDe = $filter("date")($scope.periodoDe,"dd/MM/yyyy");
		$scope.periodoAte = $filter("date")($scope.periodoAte,"dd/MM/yyyy");

		var dataDe = stUtil.formatData($scope.periodoDe);
		var dataAte = stUtil.formatData($scope.periodoAte);

		var query = "(data between '"+dataDe+"' and '"+dataAte+"')";

		$scope.querys =[];
		$scope.querys.push(query);

	}

});

})();
"use strict";
(function(){
angular.module("adm").config(function($routeProvider,$httpProvider){

})
})();


"use strict";
(function(){

	angular.module("adm") 

	.controller("appSimplePedidoController",function(stUtil, $rootScope, cacheGet, pedidoUtil, estoqueUtil, configUtil){

		
		var vm = this;
		
		var _init = function(){

			vm.attrBuscaProduto = vm.attrBuscaProduto || $rootScope.config.confs.attrBuscaProdutoInPdv ||'nome';

			vm.tagsProduto = cacheGet.get("tagsProduto"); 

			if(vm.modoAtEstoque==1){
				vm.fator = -1;
			}
			else{
				vm.fator=1;
			}

			if(!vm.pedidos)
				vm.pedidos=[];
		}
		_init();

		//Mudar attr de busca de produto
		vm.changeAttrBuscaProduto = function(attr){
			vm.attrBuscaProduto  = attr;
			configUtil.setConfig("attrBuscaProdutoInPdv",attr);
			vm.buscaProduto(vm.nomeProduto);
		}

		vm.buscaProduto = function(attrBuscaProduto, nome){

			vm.showResultadoBusca = false;
			vm.resultadoBusca=null;

			var ini = new Date().getTime();

			var prods = cacheGet.get("produto",attrBuscaProduto, nome); 

			var pedidos = 	pedidoUtil.mergeProdutoInPedidos(prods,vm.pedidos);
			
			pedidos = jlinq.from(pedidos)
			// para ser case sensitive
			.contains('produto.'+attrBuscaProduto, nome)
			.select();

			if(pedidos.length>5)
				pedidos.length=5;
			
			vm.resultadoBusca = pedidos;

			var pedidosLast = angular.copy(vm.pedidos);

			vm.pedidos = null;

			vm.pedidos =	pedidosLast;	
			
			console.log("Tempo gasto: "+(new Date().getTime()-ini));
		   
			vm.showResultadoBusca = true;
		

		}

		vm.addPedido = function(pedido){

			var pedidos = vm.pedidos;

			var posPedido = stUtil.buscaOb(pedidos,pedido.produto.id,"produto.id");

			if(posPedido==-1){
				pedidos.push(pedido);
			}
			else {
				pedidos[posPedido] = pedido;
			}

			vm.pedidos = pedidos;
		}

		vm.cadProduto = function(nome){

			estoqueUtil.openProdutoInModal({nome:nome, setQuantidade:false},function(produto){

				console.log("Produto retornado!!!!: ");
				console.log(produto);

				//Garante que o produto seja buscado pelo nome cadastrado
				vm.attrBuscaProduto = "nome";
				vm.nomeProduto= produto.nome;
				vm.buscaProduto(produto.nome);
			});

		}

		vm.deletarPedido = function(pedido){

			var pos = stUtil.buscaOb(vm.pedidos,pedido.produto.id,"produto.id");
			delete pedido.quantidade;
			//delete pedido.valorUnitario;
			if(pos!=-1){
				delete vm.pedidos[pos].quantidade;
				//delete $scope.pedidos[pos].valorUnitario;
			}
		}

	})

})();

"use strict";
(function(){

	angular.module("adm") 

	//Diretiva auxiliar utilizada em appSimplePedido
	.directive('appListSimplePedido', function (pedidoUtil,dateUtil,stService,stUtil,cacheGet,estoqueUtil) {
		return {
			restrict: 'E',
			templateUrl:"global/st-app/app-pedido/template-module/appListSimplePedido.html",
			scope:{
				itens:"=",
				labelQuantidade:"=",
				labelValorUnitario:"=",
				addPedido:"=",
				deletarPedido:"=",
				fator:"=",
				hideValorUnitario:"=",
				busca:"="
			},
			bindToController:true,
			controllerAs:"vm",
			controller:function(){

				var vm = this;
				//Carrega o estoque de um produto
				vm.carregaEstoqueProduto = function(produto){

					estoqueUtil.getEstoqueProduto(produto,function(prod){

						produto = prod;

					});
				}
				
				
			vm.openDetalhePedido = function(pedido){
					
					pedidoUtil.openDetalhePedido(pedido, function(res){
						
						vm.addPedido(res);
					
					});
				}

			vm.editarProduto = function(produto){

					var prodToEdit = angular.copy(produto);

					estoqueUtil.openProdutoInModal(prodToEdit,function(prod){

						//Indice do pedido ao qual o produto editado pertence	
						var index = stUtil.buscaOb(vm.itens,prod.id,"produto.id");

						//Atualização do produto editado
						if(prod)
							vm.itens[index].produto = prod;

					});

				}
			}
		}
	})

	//Diretiva para pedidos Simples(Esta forma utilizado produtos armazenados em cache)
	.directive('appSimplePedido', function (pedidoUtil,dateUtil,stService,stUtil,cacheGet,configUtil,$rootScope,st,$uibModal,estoqueUtil) {
		return {
			restrict: 'E',
			templateUrl:"global/st-app/app-pedido/template-module/appSimplePedido.html",
			require:'pedidos',
			scope:{

				labelValorUnitario:"=",//Label para exibição em preço unitário do produto
				labelQuantidade:"=",//label para quantidade de um pedido
				pedidos:"=",
				hideValorUnitario:"=",
				totalPedidos:"=",
				modoAtEstoque:"=",//1=somar, 2=subtrair
				attrBuscaProduto:"=",//atributo de produto utilizado para buscas padrão = nome

			},
			bindToController:true,
			controllerAs:"vm",
			controller:"appSimplePedidoController"
		}
	})
	
	.directive("itensPedido", function(){

		return{

			scope:{

				pedidos:"=",
				hideButtonTodos:"=",
				max:"@"
			},
			templateUrl:"global/st-app/app-pedido/template-module/itensPedido.html",
			controller:function($scope,$uibModal){

				//Abre os detalhes dos pedidos
				$scope.openDetalhe = function(pedidos){

					$uibModal.open({
						animation: true,
						templateUrl:"global/st-app/app-pedido/template-module/modalDetalhePedidos.html",
						size:'lg',
						controller:function($scope){

							$scope.pedidos = pedidos;
						}
					});	

				}
			}

		}
	})


})();

"use strict";
(function(){

	angular.module("adm") 

	//Funções uteis para pedidos
	.factory("pedidoUtil",function(dateUtil, stService, stUtil, $uibModal){
		
		
		var _openPedidosInModal = function(pedidos, callback){

			$uibModal.open({
				animation: true,
				templateUrl:"global/st-app/app-pedido/template-module/appSimplePedidoModal.html",
				size:'lg',
				controllerAs: "vm",
				bindToController: true,
				controller:function($modalInstance){

					var vm = this;
					vm.pedidos = pedidos;
					
					vm.ok = function(){
						   
						  console.log("Pedidos retornados: ");
						  console.log(vm.pedidos);
						  $modalInstance.close();
						  callback(vm.pedidos);
					}
				}
			});	
			
		}
		
		
		var _openDetalhePedido = function(pedido, callback){

			$uibModal.open({
				animation: true,
				templateUrl:"global/st-app/app-pedido/template-module/detalhePedido.html",
				size:'lg',
				controllerAs: "vm",
				bindToController: true,
				controller:function($modalInstance){

					var vm = this;
					vm.pedido = pedido;
					
					vm.okAction = function(){
						  $modalInstance.close();
						   callback(vm.pedido);
					}
					
					vm.cancelAction = function(){
						  $modalInstance.close();
						   callback();
					}
				}
			});	
			
		}

		//Recupera o nome completo do pedido
		var _getNomePedido = function(p){

			console.log("--");
			var nomePedido =  p.produto.nome;

			if(p.opcao){
				nomePedido += " "+p.opcao.nomeOpcao;
			}

			return nomePedido;

		}

		//Seta a quantidade anterior nos pedidos (Para atualizações, etc)
		var _setQuantAntInPedidos = function(pedidos){

			for(var i in pedidos){
				pedidos[i].quantAnt = pedidos[i].quantidade;
			}
			return pedidos;
		}

		var _getTotalPedidos = function(pedidos){

			var total = 0;

			for(var i in pedidos){
				total+=(pedidos[i].valorUnitario||0) * (pedidos[i].quantidade||0); 
			}

			return total;

		}

		//tipo pode assumir os valores: 'grafico' ou tabela
		var _getRelatorioVendasGrafico = function(dataDe, dataAte, maxItens, callback){

			var qs = [];
			qs.push(dateUtil.getQueryOfPeriod("date",dataDe,dataAte));
			qs.push("tipoEntrada=0");
			qs.push("quantidade>0");
			qs.push("valorUnitario>0");
			qs.push("disable=0");
			//qs.push("valorUnitario>0");
			var ops = {
					qs:qs,
					columns:"nomePedido,sum(quantidade)",
					groupBy:"nomePedido",
					objeto:"Pedido",
					max: maxItens || 0
			};


			stService.getProjecoes(ops).success(function(data){

				var totalQuant = 0;
				var itens = data.itens;
				var labelsGrafico =  [];
				var dataGrafico = [];
				for(var i in itens ){

					labelsGrafico.push(itens[i][0]);
					dataGrafico.push(itens[i][1]);
				}

				var projecaoGrafico = {labels:labelsGrafico, data:dataGrafico};

				callback(projecaoGrafico);

			});

		}

		var _mergeProdutoInPedidos= function(produtos, pedidos){

			pedidos = pedidos.filter(function(ped){

				if(ped.produto)
					return ped;
			});

			for(var i in produtos){

				if(produtos[i] && stUtil.buscaOb(pedidos,produtos[i].id,"produto.id")==-1){
					pedidos.push({produto:produtos[i]});
				}
			}

			return pedidos;

		}

		return{

			getTotalPedidos:  _getTotalPedidos,
			getNomePedido: _getNomePedido,
			getRelatorioVendasGrafico: _getRelatorioVendasGrafico,
			mergeProdutoInPedidos: _mergeProdutoInPedidos,
			setQuantAntInPedidos: _setQuantAntInPedidos,
			openPedidosInModal: _openPedidosInModal,
			openDetalhePedido: _openDetalhePedido
		}

	})

})();

"use strict";

(function(){

	angular.module("adm")

	.factory("filialUtil",function(stService,$rootScope,$localStorage,stUtil,st,$uibModal,$http,config){

		//Abre os detalhes da filial para edição
		var _openDetalheCurrentFilial= function(filial,callback){

			$uibModal.open({
				animation: true,
				templateUrl:'global/st-app/app-filial/template/modalDetalheFilial.html',
				size:'lg',
				controller:function($scope,$rootScope){

					$scope.filial = $rootScope.currentFilial;

					$scope.fechar = function(ele){

						ele.$dismiss('cancel');
						callback($scope.filial);

					}

					//Envio do certificado digital
					$scope.enviarCertificado = function(file,senha) {

						var fd = new FormData();
						fd.append('file', file);
						fd.append('senha',senha);
						$http.post(config.baseUrl+"filial/upload-certificado/", fd, {
							transformRequest : angular.identity,
							headers : {
								'Content-Type' : undefined
							}
						}).success(function(data) {

							$rootScope.currentFilial.nomeCertificado = data.item;
							$scope.filial.nomeCertificado = data.item;
						}).error(function() {

						});
					}

					$scope.salvar = function(filial){

						stService.save("filial",filial).success(function(data){

							stUtil.showMessage("","Salvo com sucesso","info");	

							if(callback)
								callback(data.item);
						});

					}

				}
			});
		}

		var _getAllFiliais = function(callback){

			stService.getAll("filial").success(function(data){

				var filiais = data.itens;

				//Empresa com mais de uma filial
				if(filiais.length>0){

					$rootScope.filiais = filiais;
					$rootScope.filiais.unshift({id:0,xNome:"Todas"});
					$rootScope.currentFilial = 	$localStorage.currentFilial || data.itens[0];

				}

				//Empresa sem filiais
				else{
					$rootScope.currentFilial = {id:1,xNome:"Matriz"};
				}

				if(callback)
					callback(data.itens);

			}).error(function(){
				
				callback();
			});

		}

		var _getFilialById = function(id){

			var filial ={};

			var index = stUtil.buscaOb($rootScope.filiais,id,"id");

			if(index!=-1)
				filial = $rootScope.filiais[index];

			return filial;

		}

		return {

			getFilialById:_getFilialById,
			getAllFiliais:_getAllFiliais,
			openDetalheCurrentFilial: _openDetalheCurrentFilial
		}

	})

})();


"use strict";
(function(){

	angular.module("adm")

	.controller("filialListController",function($scope, $rootScope, $localStorage, cacheGet, $route, filialUtil, stUtil, configUtil){

		console.log("currentFilial: ");
		console.log($rootScope.currentFilial);
		
		$rootScope.$watch("currentFilial",function(currentFilial){

			if(currentFilial)
				$scope.labelCurrentFilial = currentFilial.xNome;
		});

		$rootScope.$watch("filiais",function(filiais){

			if(filiais)
				$scope.filiais = filiais;
		});

		$scope.config = $rootScope.config;
		$scope.filiais =$rootScope.filiais;
		$scope.currentFilial = $rootScope.currentFilial;

		//Abre detalhes de um filial
		$scope.openDetalheFilial = function(filial){

			filialUtil.openDetalheFilial(filial);
		}

		//Altera a filial atual do sistema
		$scope.alterarFilial = function(filial){
			
			if(filial.bloqueada==1){
				
				stUtil.showMessage("","A origem '"+filial.nome+"' não está disponível.","danger");
				return;
			}

			$scope.currentFilial = filial;
			$rootScope.currentFilial = filial;
			$localStorage.currentFilial = filial;
			
			
			configUtil.setConfig("currentFilialId",filial.id+"");
			configUtil.setConfig("labelCurrentFilial",filial.xNome);
			

			//atualizar caches
			cacheGet.getOfflineCache(function(){
				
				stUtil.showMessage("","Origem alterada para  '"+filial.nome+"'.","info");
				 
				    if($scope.inModal!=true)
					$route.reload();

			});

		}

	});

})();

"use strict";
(function(){

	angular.module("adm")
    
	.directive("filialList",function(filialUtil){

		return{
			templateUrl:"global/st-app/app-filial/template/filialList.html",
			scope:{
				inModal:"="//Indica se está setada dentro de um modal (Para não charmar $route.reload())
				
			},

			controller:"filialListController"
			
		}

	})
	
	.directive("buttonFilialListWithModal",function($uibModal){

		return{
			restric:"E",
			templateUrl:"global/st-app/app-filial/template/buttonFilialListWithModal.html",
		    controller: function ($scope, $rootScope){
				
				   $scope.currentFilial = $rootScope.currentFilial;
				   $rootScope.$watch("currentFilial",function(currentFilial){

						if(currentFilial)
							$scope.labelCurrentFilial = currentFilial.xNome;
					});
				   $scope.config = $rootScope.config;

					$scope.open = function(){
						
						$uibModal.open({
							animation: true,
							templateUrl:"global/st-app/app-filial/template/filialListWithModal.html",
							size:'lg',
							controller: function($scope, $modalInstance){
								
								$scope.fechar = function(){
									
									console.log("Chamou");
									$modalInstance.close();
								}
								
							}
							
						});
						
					}
				
			}
			
		}

	})
	
	.directive("alertFilial",function(filialUtil){

		return{
			templateUrl:"global/st-app/app-filial/template/alertFilial.html",
			scope:{
				label:"="
			},
			controller:function($scope,$rootScope){
				
				$scope.currentFilial = $rootScope.currentFilial;
			}

		}

	})
	
	.directive("setAllFilials",function(filialUtil){

		return{
			templateUrl:'global/st-app/app-filial/template/setAllFilials.html',
			scope:{
				objeto:"=",
				defaultValue:"=",//true ou false
			},
			controller :function($scope,$rootScope){
				
				
				console.log("defaultValue antes: ");
				console.log(angular.copy($scope.defaultValue));
				
				if($scope.defaultValue=="true")
					$scope.defaultValue = true;
				else if($scope.defaultValue=="false")
					$scope.defaultValue=false;
				
				$scope.filiais = $rootScope.filiais;
			
				if(!$scope.objeto)
					$scope.objeto  = {allFilials:true};
				
				if(!$scope.objeto.id){
					$scope.objeto.allFilials = $scope.defaultValue || false;
					console.log("defaultValue: ");
					console.log($scope.defaultValue);
				}
				
			}
		
		}
	
	})

})();



"use strict";
(function(){
angular.module("adm").controller("cadastrosController",function($scope,stService,$rootScope,stUtil,$filter,cadastrosUtil){


	$scope.apagar = function(op,index){


		stService.apagar("opcao",[op.id]).success(function(){
			$scope.opcoes.splice(index,1);
		});
	}

	$scope.openCadastro = function(cadastro){
		cadastrosUtil.openCadastro(cadastro,function(item){

			$scope.getOpcoes($scope.descricao,$scope.label);

		});

	}

	$scope.getOpcoes = function(descricao,label){

		$scope.label = label;//Label a ser exibido ex: "Categorias de conta a pagar"
		$scope.descricao = descricao;//descricao usada na tabela correspondente do banco de dados, ex: 'categoria_conta_pagar'

		stService.getLikeMap("opcao",["descricao='"+descricao+"'"],0,0,'').success(function(data){

			$scope.opcoes = data.itens;
		});

	}

});
})();

"use strict";
(function(){
angular.module("adm").config(function($routeProvider,$httpProvider){

	$routeProvider.when("/cadastros",{

		templateUrl:"global/st-app/cadastros/template-route/cadastros.html",
		controller:"cadastrosController"

	}); 

})
})();



"use strict";
(function(){

	angular.module("adm") 

	.factory('cadastrosUtil', function($rootScope,$filter, stUtil,$uibModal){

		var	_openCadastro = function(cadastro,callback){

			var _modalInstance =   $uibModal.open({
				animation: true,
				templateUrl:"global/st-app/cadastros/template-module/detalheCadastro.html",
				size:'lg',
				controller:function($scope,stService,stUtil){

					$scope.cadastro = cadastro;

					$scope.fechar = function(modal){

						modal.$dismiss("");

					}

					$scope.salvar = function(cadastro,modal){

						stService.save("opcao",cadastro).success(function(data){

							stUtil.showMessage("","Opção adicionada com sucesso!","info");
							modal.$dismiss("");
							callback(data.item);

						});

					}

				}

			});

		}

		return {

			openCadastro:_openCadastro

		}

	})

})();

"use strict";
(function(){
angular.module("adm").config(function($routeProvider,$httpProvider){

	//Lista de todas a movimentações
	$routeProvider.when("/movimentacao",{

		templateUrl:"global/st-app/app-mov/template-route/movimentacoes.html",
		controller:"movimentacoesController"

	}); 

})
})();


"use strict";
(function(){

	angular.module("adm") 

	.controller("movListController",function(movUtil, stUtil, stService, $filter, $uibModal, pdvUtil, $rootScope, $timeout, dateUtil, movListControllerFactory){

		var vm = this;
		movListControllerFactory.init(vm);
		
		vm.imprimir = function(){
			$window.print();

		}

		vm.deletar = function(mov){

			movUtil.deleteMov(mov,function(){

				atualizaMovs();
			});
		}

		//Caso seja definida a quantidade máxima de itens, esta função exibe um modal com todas a movimentações
		vm.visualizarTodas = function(){

			var activeTab = 0;

			//Receitas
			if(vm.fixProperties.tipo==2)
				activeTab=1;

			movUtil.openMovListInModal(activeTab);

		}

		if(!vm.querys)
			vm.querys=[];

		//Altera o Status
		vm.alterarBaixa =function(mov){

			movUtil.alterarBaixa(mov,function(data){

				mov =data;

			});
		}

		//tipo = fixa ou variavel, tipoMov = 1 ou 2 (Despesa ou Receita)
		//De acordo com o período
		vm.getMovimentacoes = function(){

			vm.escolheuPeriodo  =  true;
			vm.loadingStatus =true;
			var qs = movListControllerFactory.configureQuerysForBusca(vm);

			//Ordenação dos dados
			var oderMovs = vm.orderMovs || vm.tipoDataBusca;
			var params = {
					qs: qs,
					pagina: 0,
					max: vm.maxItens||0,
					extra: " order by ( "+oderMovs+" || id)"
			}

			stService.executeGet("/movimentacao/busca/map",params).success(function(data){

				vm.loadingStatus =false;
				var movs = data.itens;

				//Auxiliar para mudança 
				vm.movsAux = data.itens;

				vm.total = getTotalMovs(data.itens);

				for(var k in movs){
					movs[k] = movUtil.setStatusMov(movs[k]);
				}

				vm.baixa="todas";

				params.qs = movListControllerFactory.configureQuerysForBuscaFixa(vm);
				stService.executeGet("/movimentacao/busca/map",params).success(function(data){

					var allMovs = [];
					
					//Realiza a junção com as movimentações variáveis
					if(!vm.allPeriod || vm.allPeriod==false)
					   allMovs = movs.concat(movListControllerFactory.getAbstractsMovsFixas(data.itens, vm));
					else 
						allMovs = data.itens;
						

					if(allMovs.length==0)
						vm.noResults=true;
					else 
						vm.noResults=false;

					movListControllerFactory.agruparMovimentacoes(allMovs, vm);

					vm.baixa="todas";
					vm.loadingStatus =false;
				});

			});

		}

		//Mudança de visualização de movimentações (Todas, não-pagas, pagas)
		vm.changeTipoBaixa = function(baixa){

			var aux = [].concat(vm.movsAux);
			aux = movListControllerFactory.filtraMovsByBaixa(aux, baixa);
			vm.total =getTotalMovs(aux);
			movListControllerFactory.agruparMovimentacoes(aux,vm);
			
		}

		function getTotalMovs(movs){

			return movUtil.getTotalMovs(movs);

		}
		vm.getTotalMovs  = getTotalMovs;

		//Atualiza Receitas e Desepesas
		function atualizaMovs(){

			vm.getMovimentacoes();

		}

		if(vm.allPeriod==true)
			atualizaMovs();
		
		
		vm.deleteMov = function(mov){

			//Operação de vendas
			if(mov && mov.tipoOperacaoLancamento==1){
			
				pdvUtil.getPDVByMovId(mov, function(resPdv){
					
					if(resPdv){
						pdvUtil.deletarVenda(resPdv,function(data){
							stUtil.showMessage("","Venda deletada com sucesso!");
							atualizaMovs();
						});
					}
					else{
						stUtil.showMessage("","Ocorreu um erro ao deletar a venda","danger");
					}
					
				});
				
			}

			//Operação de atualização de estoque
			else if(mov && mov.tipoOperacaoLancamento==2){
				stUtil.showMessage("","Não é possível deletar uma operação de entrada de mercadoria","danger");
				
			}
			else {
				movUtil.deleteMov(mov, function(){
					stUtil.showMessage("","Movimentação deletada com sucesso!");
					atualizaMovs();
				});
				
				
			}
		}


		vm.openDetalheMov = function(mov){

			//Operação de vendas
			if(mov && mov.tipoOperacaoLancamento==1){
				pdvUtil.goToPdvFromMov(mov);
				return;
			}

			//Operação de atualização de estoque
			if(mov && mov.tipoOperacaoLancamento==2){
				movUtil.goToAtEstoqueFromMov(mov);
				return;
			}

			movUtil.openMov(mov, vm.fixProperties,function(){
				atualizaMovs();

			});
		}

	})

})();

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

"use strict";
(function(){
	angular.module("adm") 

	.controller("alterarBaixaController",function(mov, stService, dateUtil, movUtil, $rootScope, $modalInstance){

		var vm = this;
		vm.dataPagamento = new Date();
		vm.formaPagamento = $rootScope.config.confs.formaPagamentoPadrao;
		vm.valorMov  = mov.valor;

		vm.cancelar = function(modal){

			mov.baixada=false;
			$modalInstance.close();
		}

		vm.confirmar = function(){
			
			vm.carregando = true;
			var data = vm.dataPagamento;
			var valor = vm.valorMov;
			var formaPagamento = vm.formaPagamento;

			var dataBaixa = dateUtil.getDate(data);
			mov.valor = valor;
			mov.formaPagamento = formaPagamento;
			mov.dataBaixa = dataBaixa||new Date();

			//Para movimentação fixa
			//Caso seja uma movimentação fixa (modoRepeticao!=0), cadastra da movimentação abastrata gerada
			if(mov.originalMov && mov.originalMov.modoRepeticao!=0){

				
				
				var originalMov = mov.originalMov;

				originalMov = movUtil.addBaixaForMov(originalMov,mov.data);

				//Salva a movimentação fixa original (Com a baixa adicionada)
				stService.save("movimentacao",originalMov).success(function(){

					vm.carregando = false;
					$modalInstance.close();
					//Cadastrada a movimentação fixa abstrata gerada
					movUtil.cadMov([mov]);

				});

				return;
			}

			else{

				mov.dataBaixa = dataBaixa||new Date();
				movUtil.confirmAlterarBaixa (mov, function(){
					
					vm.carregando = false;
				
					$modalInstance.close();
					
				});
			}
		}

	})

})();

"use strict";
(function(){

	angular.module("adm") 

	.controller("deleteMovController",function(mov,callback ,movimentacaoService,movUtil,stUtil){
		var vm = this;
		vm.mov = mov;

		vm.deletar = function(mov,modo,modal){

			var messageSuccess = "Operação realizada com sucesso";

			//Movimentação abstrata
			if(!mov.id && modo=='onlyPeriod'){

				//baixa falsa da movimentação
				mov.originalMov = movUtil.addBaixaForMov(mov.originalMov,mov.data);

				//Salva a movimentação
				movUtil.cadMov([mov.originalMov],function(){

					//modal.$dismiss();
					stUtil.showMessage("",messageSuccess,"info");

					if(callback)
						callback();

				});
			}
			else{
				if(!mov.id)
					mov = mov.originalMov;
				movimentacaoService.apagar(mov,modo).success(function(){

					if(callback)
						callback();
					//modal.$dismiss();

				});

			}
		}

		vm.fecharModal = function(modal){

			//modal.$dismiss();
		}
	})

})();

"use strict";
(function(){
	angular.module("adm") 
	.controller("detalheMovController",function(mov,callback, movUtil, stUtil, $modalInstance){

		var vm = this;

		if(!mov.data)
			mov.data = new Date();

		vm.mov = mov;
		var descTipoMov = "";
		var labelTitleMov;

		var placeHolderCategoria = "";

		if(mov.tipo==1){
			vm.objetoDescricao="categoria_conta_pagar";
			descTipoMov = "Despesa";
			placeHolderCategoria="Ex: Higienização caixas"
		}
		else if(mov.tipo==2){
			vm.objetoDescricao="categoria_conta_receber";
			descTipoMov = "Receita";
		}

		vm.mov.modoRepeticao = vm.mov.modoRepeticao||0;
		vm.mov.formaPagamento = vm.mov.formaPagamento||"Dinheiro";
		vm.placeHolderCategoria = placeHolderCategoria ;

		if(mov.id){
			labelTitleMov="Editar Movimentação"
		}
		else {
			labelTitleMov = "Cadastro de nova "+descTipoMov;						
		}

		vm.labelTitleMov = labelTitleMov;

		//Alteração de Baixa
		//Altera o Status
		vm.alterarBaixa =function(mov){

			if(!mov.id)
				return;

			movUtil.alterarBaixa(mov,function(mov){

				if(callback)
					callback(mov);
			});
		}

		vm.callbackParcelaMov = function(modal){

			$modalInstance.close();

		}

		//Apagar movimentação
		vm.deleteMov = function(){

			var mov = vm.mov;
			
			movUtil.deleteMov(mov, function(){

				$modalInstance.close();

				stUtil.showMessage("","Movimentação deletada com sucesso!");

				if(callback)
					callback(mov);
			});

		}

		//Cadastro
		vm.cadMov = function(){

			var movs = vm.movs;
			
			vm.salvando = true;

			movUtil.cadMov(movs,function(data){

				vm.salvando = false;

			$modalInstance.close();

				if(callback)
					callback(data);

			});

		}

		vm.fechar = function(){

			$modalInstance.close();
			callback();
		}

	})

})();

"use strict";
(function(){

	angular.module("adm") 

	.controller("parcelaMovController",function($scope, movUtil, $window, $filter, pedidoUtil){
		
		if(!$scope.originalMov)
			$scope.originalMov = {};

		//A movimentação original sempre é a primeira parcela (Caso ela já não seja uma parcela)
		if(!$scope.originalMov.originalMov)
		 $scope.originalMov.parcela= 1;

		//Caso a data de vencimento não esteja definida
		if(!$scope.originalMov.data)
			$scope.originalMov.data  = new Date();

		//Parcelas
		$scope.movs  = $scope.movs || [];

		//Realiza o recalculo automátio do valor das parcelas
		//O recalculo de parcelas é realizado com base no valor total dos pedidos da movimentação original
		$scope.recalcularParcelas = function(){

			if(! $scope.originalMov.pedidos || $scope.originalMov.pedidos.lenght==0)
				return;

			var valorParcela = pedidoUtil.getTotalPedidos($scope.originalMov.pedidos)/$scope.movs.length;

			console.log("Valor da parcela: "+valorParcela);

			for(var i in $scope.movs){

				$scope.movs[i].valor = valorParcela;
			}

			setAlerts();
		}

		//Adicionar uma nova parcela as lista de parcelas
		$scope.addParcela = function(mov){

			//A nova parcela é um espelho da movimentação original
			var basicMov = angular.copy($scope.originalMov);
			basicMov.pedidos=null;
			basicMov.valor = 0;
			basicMov.id=0;
			basicMov.baixada=true;
			basicMov.data = $scope.originalMov.data || new Date();
			$scope.movs.push(mov||basicMov);

			//Corrige mov.parcela e mov.numeroParcela de todas as parcelas
			resetInfoParcelas();

			$scope.recalcularParcelas();
		}

		//Recupera as parcelas definidas anteriormente para exibição
		if($scope.originalMov.id){

			movUtil.getParcelas($scope.originalMov.id,function(itens){
				itens = itens||[];
				//Adicionar a movimentação original na primeira posição
				itens.unshift($scope.originalMov);
				$scope.movs = itens;

			});
		}
		else {
			$scope.addParcela($scope.originalMov);
		}

		//Corrige mov.parcela e mov.numeroParcela de todas as parcelas
		resetInfoParcelas();

		$scope.deletarParcela = function(parcela,index){

			//Deleta parcela no Backend caso possua um id(Cadastrado)
			if(parcela.id){

				var msg = "Tem certeza que deseja deletar esta parcela?"
					var confirm = ($window.confirm(msg) === true);

				if(confirm==true){
					movUtil.deleteMov(parcela, function(){

						$scope.movs.splice(index,1);

						setAlerts();

					},'onlyPeriod');//onlyPeriod é informado para deletar a movimentação diretamente
				} 

			}else{
				$scope.movs.splice(index,1);
			}

			//Corrige mov.parcela e mov.numeroParcela de todas as parcelas
			resetInfoParcelas();

			setAlerts();

			//$scope.recalcularParcelas();

		}

		//Escuta alteraçoes na movimentação original ara mudança das parcelas 
		$scope.$watch('originalMov',function(originalMov){

			if(!$scope.movs[0])
				return;

			var valorAux = $scope.movs[0].valor;

			//$scope.movs[0] represnta a movimentação original
			//Sempre quando há mudanças em originalMov, movs[0] também muda
			$scope.movs[0] = originalMov;

			//Caso tenha apenas uma parcela definida, o valor sempre é refletido de acordo com a movimentação original

			if(originalMov.pedidos && originalMov.pedidos.length>0){

				if($scope.movs.length==1){
					$scope.movs[0].valor = pedidoUtil.getTotalPedidos(originalMov.pedidos);
					
					console.log("valor da originalMov: ");
					console.log( pedidoUtil.getTotalPedidos(originalMov.pedidos));
				}else{
					$scope.movs[0].valor = valorAux;
				}
			}

			setAlerts();

		},true);

		//Mudança no valor das parcelas (Exceto a original)
		$scope.changeParcela = function(){

			var soma = 0;
			for(var i = 1;i<$scope.movs.length;i++){

				soma+=$scope.movs[i].valor;
				
			}
			
			$scope.movs[0].valor = movUtil.getTotalMov($scope.originalMov, "pedidos")  - soma;
			
			//setAlerts();
		}

		//Altera as informações mov.numeroParcelas e mov.parcela
		function resetInfoParcelas(){

			var numeroParcelas = $scope.movs.length;

			for(var i = 0;i<$scope.movs.length;i++){

				$scope.movs[i].parcela = i+1;
				$scope.movs[i].numeroParcelas = numeroParcelas;
			}

		}

		//Seta alerta de total das parcelas e alerta de valor das parcelas maior/menor que o total da venda
		function setAlerts(){

			$scope.totalParcelas = 0;
			for(var i in $scope.movs){
				$scope.totalParcelas+=$scope.movs[i].valor;

			}

			setTotalAlert($scope.originalMov);
		}

		//Diferenca entre o valor das parcelas e o valor da movimentção original
		function getDiferenca(){

			var totalParcelas = movUtil.getTotalMovs($scope.movs);
			return  totalParcelas -  movUtil.getTotalMov($scope.movs[0]);

		}

		function setTotalAlert(originalMov){

			var msg;
			var totalParcelas = movUtil.getTotalMovs($scope.movs,"valor");
			var valorOriginalMov = movUtil.getTotalMov(originalMov,"pedidos");
			var diferenca = $filter("number") (valorOriginalMov - totalParcelas,2);

			if(valorOriginalMov!=totalParcelas){

				msg="O valor total das parcelas é diferente do valor total dos pedidos (Diferença: R$"+diferenca+")";

			}

			$scope.totalAlert = msg;
		}

	})

})();

"use strict";
(function(){
angular.module("adm").controller("movimentacoesController",function($scope){
	
	$scope.activeTab = 0;
	
	$scope.changeTab = function(tab){
		
		$scope.activeTab = tab;
		
	}
	
})
})();
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


"use strict";
(function(){

	angular.module("adm")

	.directive("parcelaMov",function(dateUtil,movUtil,$uibModal){

		return{

			templateUrl:"global/st-app/app-mov/template-module/parcelaMov.html",
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
"use strict";

(function(){

	angular.module("adm")

	.directive("buttonBaixaMov",function(movUtil){

		return{
			templateUrl:"global/st-app/app-mov/template-module/buttonBaixaMov.html",
			scope:{
				mov:"=",
				id:"=",
				templateVersion:"@",
				label:"@"
			},

			controller:function($scope){

				$scope.alterarBaixa = function(mov){
					
					console.log("mov: ");
					console.log(mov);

					if(!mov.id && ( !mov.isAbstract || mov.isAbstract==false))
						return;

					movUtil.alterarBaixa(mov,function(){

						console.log("call");
					});

				}
			}	
		}

	})

})();


"use strict";

(function(){

	angular.module("adm")

	.directive('movsReadOnly',function(movUtil,dateUtil){

		return{

			templateUrl:"global/st-app/app-mov/template-module/templateMovsReadOnly.html",
			scope:{

				titulo:"=",
				subTitulo:"=",
				movs:"=",
			},

			controller:function($scope){

				$scope.getTotalMovs = function(movs){

					return  movUtil.getTotalMovs(movs);
				}

				$scope.fechar = function(ele){

					ele.$dismiss('cancel');

				}
			}

		}
	})
	
})();


"use strict";
(function(){

	angular.module("adm")

	.factory("movimentacaoService",function($http, config, $stModal, $filter){

		var _imprimirCupom = function(ids){

			var req ={

					method:"GET",
					params:{
						ids:ids,
					}
			};

			return $http.get(config.baseUrl+"movimentacao/imprime-cupom",req);

		}
		var _apagar  = function(mov,modo){

			return $http.post(config.baseUrl+"movimentacao/delete/",{mov:mov,modo:modo});

		};

		var _baixar  = function(mov){

			return $http.post(config.baseUrl+"movimentacao/add/",mov);

		};

		return {

			baixar: _baixar,
			apagar: _apagar,
			imprimirCupom: _imprimirCupom
		};

	})

})();


"use strict";
(function(){

	angular.module("adm")

	.factory("movUtil",function($http, config,$filter,$confirm,$location,$stModal,$modalStack,stUtil,pedidoUtil,stService,$window,movimentacaoService, $stDetalhe,$uibModal,dateUtil,estoqueUtil){

		var _modalInstance;
		var _confirmAlterarBaixa = function(mov,callback){

			//GAMBIARRA!!!
			if(mov.originalMov)
				mov.originalMov = {id:mov.originalMov.id};

			if(!mov.formaPagamento)
				mov.formaPagamento="dinheiro";

			movimentacaoService.baixar(mov).success(function(data){

				stUtil.showMessage("","status alterado com sucesso!","info");

				if(callback)
					callback(data.item);

			}).error(function(){
				mov.baixada = !mov.baixada;
				if(callback)
					callback(mov);
				stUtil.showMessage("","Ocorreu um erro ao tentar alterar o status da movimentação, verifique sua conexão com a internet e tente novamente.","danger");
			});

		};

		//Adicionar uma baixa para uma movimentação fixa
		var _addBaixaForMov = function(mov,data){
			mov.baixas = mov.baixas ||"";
			//Marca a movimentação fixa como baixada de acordo com o vencimento em questão
			mov.baixas+="@"+dateUtil.formatDate(data);
			return mov;
		}

		var _deleteMov = function(mov,callback,modo){

			//Se for passado 'modo', a movimentação é deletada diretamente
			if(modo){

				movimentacaoService.apagar(mov,modo).success(function(){

					if(callback)
						callback();

				});

				return;

			}

			//Movimentação com depencias
			if(mov.originalMov || mov.numeroParcelas>1){

				var modal = $uibModal.open({
					animation: true,
					templateUrl:"global/st-app/app-mov/template-module/modalDeleteMov.html",
					size:'lg',
					controller:"deleteMovController",
					controllerAs:"vm",
					bindToController:true,
					resolve:{
						callback:function(){

							return callback;
						},
						mov: function(){
							return mov;
						},
						modal: function(){
							return modal;
						}

					}
				});

			}else{
				movimentacaoService.apagar(mov,"").success(function(){

					if(callback)
						callback();
				}).error(function(){

					if(callback)
						callback();

				});
			}

		}

		//Querys relacionadas ao balanco
		//Retorna querys referentes a movimentações previstas e realizadas
		var _getQuerysBalanco= function (de,ate,columns){

			de = de || new Date();
			ate= ate ||new Date();

			var basicMovQuery = "from Movimentacao where disable=0 ";

			//Somente as columnas especificadas
			if(columns && columns!=null){
				basicMovQuery = "select "+columns+" "+basicMovQuery;
			}

			//Periodo para movimentações realizadas
			var queryPeriodRealizadas=" and "+dateUtil.getQueryOfPeriod("dataBaixa",de,ate);

			//Periodo para movimentações previstas
			var queryPeriodPrevistas=" and "+dateUtil.getQueryOfPeriod("data",de,ate);

			//Realizadas (baixada=1)
			var queryReceitasRealizadas= basicMovQuery+"and tipo=2  and baixada=1 "+queryPeriodRealizadas;
			var queryDespesasRealizadas = basicMovQuery+"and tipo=1  and baixada=1"+queryPeriodRealizadas;

			//Previsto (todas)
			var queryReceitasPrevistas = basicMovQuery+"and tipo=2 "+queryPeriodPrevistas;
			var queryDespesasPrevistas = basicMovQuery+"and tipo=1 "+queryPeriodPrevistas;


			return {

				queryReceitasRealizadas: queryReceitasRealizadas,
				queryDespesasRealizadas: queryDespesasRealizadas,
				queryReceitasPrevistas: queryReceitasPrevistas,
				queryDespesasPrevistas: queryDespesasPrevistas

			}

		}

		//Recupera informaçõe a respeito movimentações previstas e realizadas
		var _getBalanco = function(de,ate,callback){

			var qs = _getQuerysBalanco(de,ate,"sum(valor)");

			//Receitas realizadas (baixada=1)
			stService.executeGet("projecao/execute-query",{query: qs.queryReceitasRealizadas}).success(function(rec){

				var receitasRealizadas   = rec.itens[0] ||0;

				//Despesas realizadas (baixada=1)
				stService.executeGet("projecao/execute-query",{query: qs.queryDespesasRealizadas}).success(function(des){
					var despesasRealizadas  = des.itens[0]||0;

					//Receitas previstas (todas)
					stService.executeGet("projecao/execute-query",{query: qs.queryReceitasPrevistas}).success(function(des){
						var receitasPrevistas   = des.itens[0]||0;

						//Despesas Previstas (todas)
						stService.executeGet("projecao/execute-query",{query: qs.queryDespesasPrevistas}).success(function(des){
							var despesasPrevistas  = des.itens[0]||0;

							callback(receitasRealizadas,despesasRealizadas,receitasPrevistas,despesasPrevistas);

						});

					});

				});

			});

		}

		var _alterarBaixa  = function(mov,callback){

			if(mov.baixada==true){
				//Escolha da data de pagamento	
				var modal = 	$uibModal.open({
					animation: true,
					templateUrl:"global/st-app/app-mov/template-module/modalBaixaMov.html",
					size:'lg',
					controller:"alterarBaixaController",
					controllerAs:"vm",
					bindToController:true,
					resolve: {
						modal: function(){
							return modal;
						},
						mov: function(){
							return mov;
						}
					}
				});	

			}

			else{

				var msg = "Tem certeza que deseja marcar a movimentação como não-paga?"

					var confirm = ($window.confirm(msg) === true);

				if(confirm==true){
					mov.dataBaixa = null;
					_confirmAlterarBaixa(mov,callback);

				}else{

					mov.baixada =true;
				}

			}

		};

		var _cadMov = function(movs,callback){

			stService.executePost("movimentacao/add-parcelas/",movs).success(function(data){

				if(callback)
					callback(data.item)

			});	

		}

		var _setStatusMov = function(mov){

			if(mov.dataBaixa==null){
				var hoje = new Date();
				hoje.setHours(0,0,0,0);

				var dataMov = dateUtil.getDate(mov.data);
				dataMov.setHours(0,0,0,0);

				if(dataMov.getTime() < hoje.getTime()){
					mov.alertMov = 2; //Vencida
				}
				else if(dataMov.getTime()==hoje.getTime()){
					mov.alertMov = 1; //Vence hoje
				}
			}
			else{

				mov.alertMov=0;
			}

			return mov;
		}


		//Abrir detalhes de uma movimentação em forma de modal
		var _openMov = function(mov,props,callback){

			//Cadastro de nova movimentação
			if(!mov || mov==null){
				mov = {};
				mov.data=new Date();

			}

			if(!mov.id)
				mov.baixada=true;

			for(var key in props){
				mov[key] =props[key];
			}

			var _template ="";
			_template = "global/st-app/app-mov/template-module/modalDetalheMov.html"
				var _modalInstance =   $uibModal.open({
					animation: true,
					templateUrl:_template,
					size:'lg',
					controller:"detalheMovController",
					controllerAs:"vm",
					bindToController:true,

					resolve:{
						mov: function(){
							return mov;
						},

						modal: function(){

							return _modalInstance;
						},
						callback: function(){
							return callback;
						}
					}

				});

		}

		//Alterções nos dados ou deletar movimentação
		var _alterarMov = function(mov, funcao, callback){

			var _template ="";

			if(funcao=='del'){

				_template="global/st-app/app-mov/template-module/dialogDeleteMov.html"
			}

			_modalInstance =   $uibModal.open({
				animation: true,
				templateUrl:_template,
				size:'lg',
				controller:function($scope){

					$scope.mov=mov;

					//Confirmação de exclusão
					$scope.confirmDeleteMov = function(mov,modo,ele){

						ele.$dismiss('cancel');

						movimentacaoService.apagar(mov,modo).success(function(data){

							stUtil.showMessage("Movimentação deletada com sucesso!","","info");

							callback(null);

						});

					}

					$scope.fechar = function(ele){

						ele.$dismiss('cancel');

					}

				}
			});

		}

		var _getTotalMovs = function(movs,prioridade){

			var total = 0;
			for(var i in movs){
				total+=_getTotalMov(movs[i],prioridade);
			}

			return total;
		} 

		//Agrupamento, 'attr' é o atributo a ser utilizado no agrupamento
		var _agrupaMovs  = function(movs,attr){
			
			//Por padrão, attr = "pessoa.id" (Pessoal pra qual se destina a movimentação)
            attr = attr || "pessoa.id";
			
			movs = jlinq.from(movs)
			// para ser case sensitive
			.useCase()
			// aplica group pelo campo id
			.group(attr);

			return movs;
		}
		var _openMovsReadOnly = function(movs,titulo,subTitulo){

			$uibModal.open({
				animation: true,
				templateUrl:"global/st-app/app-mov/template-module/modalMovsReadOnly.html",
				size:'lg',
				controller:function($scope){

					$scope.titulo = titulo;
					$scope.subTitulo = subTitulo;
					$scope.movs = movs;

				}
			});
		}

		//Recupera todas as parcelas de uma movimentação
		var _getParcelas = function(idOriginalMov,callback){

			stService.executeGet("movimentacao/get-parcelas",{idOriginalMov:idOriginalMov}).success(function(data){

				callback(data.itens);

			});
		}

		//Abatimento de valor de uma movimentação
		var _abaterValor = function(mov,callback){

			_modalInstance =   $uibModal.open({
				animation: true,
				templateUrl:"global/st-app/app-mov/template-module/modalAbaterValor.html",
				size:'md',
				controller:function($scope){

					$scope.mov=mov;
					$scope.info = {data:new Date(),valor:mov.valor};

					//Confirmação de exclusão
					$scope.abaterValor = function(info,ele){

						var parcelas = [];

						if(info.valor>mov.valor){
							stUtil.showMessage("","O valor abatido não deve ser maior  que o valor original.","danger");
							return;
						}

						//Apenas muda para baixada
						if(info.valor==mov.valor){

							mov.dataBaixa =new Date(dateUtil.format(info.data));
							_cadMov([mov]);
							return;
						}

						//Parcelas referente a movimentacao
						var parcelasForMov = _getParcelas();

						mov.valor = mov.valor-info.valor;

						if(mov.parcelas==0 ||!mov.parcelas){
							mov.numeroParcelas =2;
						}
						else{
							mov.numeroParcelas++;
						}

						if(mov.parcela==0)
							mov.parcela=1;

						var parcela = {};
						parcela.valor = info.valor;
						parcela.pessoa = mov.pessoa;
						parcela.baixada = true;
						parcela.parcela = mov.numeroParcelas;
						parcela.tipo =mov.tipo;
						parcela.data = info.data;
						parcela.formaPagamento = info.formaPagamento;
						parcelas.push(mov);
						parcelas.push(parcela);
						_cadMov(parcelas);
						ele.$dismiss('cancel');

					}

					$scope.fechar = function(ele){

						ele.$dismiss('cancel');

					}

				}
			});

		}

		//Movimentações abstratas para movimentações do tipo fixa
		var _getAbstractMovsFixas = function(movFixa, dataFinal){

			var i = 0;
			var dataInicial = dateUtil.getDate(movFixa.data);
			dataFinal = dateUtil.getDate(dataFinal);

			//Igualando pra não haver diferença de horário
			dataInicial.setHours(0,0,0,0);
			dataFinal.setHours(0,0,0,0);

			var movs = [];
			for(dataInicial; dataInicial<=dataFinal;dataInicial=dateUtil.incrementaData(dataInicial,movFixa.modoRepeticao||3)){


				if(_movFixaIsBaixada(movFixa,dataInicial)==true){
				}
				else{
					var mov  = angular.copy(movFixa);
					mov.id = 0;//Pra ser cadastrado como nova movimentação
					mov.isAbstract == true;
					mov.originalMov = movFixa;
					mov.data = dateUtil.getDate(dataInicial);
					mov.modoRepeticao=0;
					mov.baixada = false;
					mov.dataBaixa = null;
					mov = _setStatusMov(mov);
					movs.push(mov);
				}
				i++;

			}

			return movs;

		}

		var _cadDespesaRapida = function(categoria){

			$uibModal.open({
				animation: true,
				templateUrl:"global/st-app/app-mov/template-module/cadDespesaRapida.html",
				size:'md',
				controller:function($scope, pdvUtil){

					$scope.mov = {

							data: new Date(),
							baixada: true,
							tipo:1
					}

					//Categorias de conta a pagar para usar no cadastramento de despesas rápidas
					stService.getProjecoes({

						qs:["descricao='categoria_conta_pagar'"],
						columns:"valor",
						objeto:"Opcao",
						groupBy:"valor"

					}).success(function(data){

						$scope.categoriasDespesas = data.itens;

					});

					//Cadastro
					$scope.cadMov = function(mov,ele){

						if(!mov.categoria){

							stUtil.showMessage("","Escolha uma categoria para despesa.","danger");
							return;
						}

						_cadMov([mov],function(data){

							ele.$dismiss('cancel');

							callback(data);

						});

					}


				}
			});
		}

		var _goToAtEstoqueFromMov = function(mov){

			var q ="from EntradaMercadoria where movimentacao.id="+mov.id;
			stService.executeGet("projecao/execute-query",{query:q}).success(function(data){

				estoqueUtil.openEntradaMercadoria(data.itens[0]);

			});

		}

		//Verifica se uma movimentação do tipo fixa foi baixada para a data 
		var _movFixaIsBaixada = function  (movFixa,data){

			var baixas = [];

			if(movFixa.baixas==null)
				movFixa.baixas = "";

			var baixas_ =  movFixa.baixas.split("@");

			for(var i in baixas_ ){

				baixas.push(dateUtil.getDate(baixas_[i]));
			}

			for(var i in baixas){
				if(
						baixas[i].getDate() == data.getDate() &&
						baixas[i].getMonth() == data.getMonth() &&
						baixas[i].getFullYear() == data.getFullYear()
				)
					return true;
			}

			return false;
		}

		//Retorna o valor total de uma movimentação
		/*

		 * O valor total de um movimentação pode ser recuperado de diversas formas
		 * 'pedidos' -> recupera o valor da movimentação baseada nos pedidos
		 * 'valor' -> recupera o valor da movimentação baseado no campo valor
		 * Caso não seja definido uma prioridade a prioridade adotada é    valor(caso a movimentação possua um id) -->  pedidos --> valor

		 */
		var _getTotalMov = function(mov,prioridade){

			if(prioridade=='pedidos')
				return pedidoUtil.getTotalPedidos(mov.pedidos);

			if(prioridade=='valor')
				return mov.valor;

			//Se a movimentação tiver sido salva (tiver um id)
			if(mov.id && mov.id!=0)
				return mov.valor;

			//Prioridade
			//Pedido --> valor
			var total =0;

			if(mov.pedidos && mov.pedidos.length>0){

				total = pedidoUtil.getTotalPedidos(mov.pedidos);
			}
			else {
				total = mov.valor||0;
			}

			//Desconto da movimentação

			return total;

		}

		var _openMovListInModal = function(activeTab){

			$uibModal.open({
				animation: true,
				templateUrl:'global/st-app/app-mov/template-module/movListInModal.html', 
				size:'lg',
				controller:function($scope){

					$scope.activeTab=activeTab||0;
				}
			});	

		} 

		return {

			openMovListInModal: _openMovListInModal,
			alterarBaixa: _alterarBaixa,
			alterarMov: _alterarMov,
			openMov: _openMov,
			cadMov: _cadMov,
			getTotalMovs: _getTotalMovs,
			agrupaMovs:_agrupaMovs,
			openMovsReadOnly:_openMovsReadOnly,
			getParcelas:_getParcelas,
			abaterValor:_abaterValor,
			getAbstractMovsFixas:_getAbstractMovsFixas,
			setStatusMov:_setStatusMov,
			cadDespesaRapida: _cadDespesaRapida,
			goToAtEstoqueFromMov:_goToAtEstoqueFromMov,
			getBalanco: _getBalanco,
			movFixaIsBaixada: _movFixaIsBaixada,
			deleteMov: _deleteMov,
			addBaixaForMov: _addBaixaForMov,
			confirmAlterarBaixa:_confirmAlterarBaixa,
			getTotalMov: _getTotalMov,
			getQuerysBalanco:_getQuerysBalanco
		};

	})

})();
"use strict";
(function(){

	angular.module("adm")

	.factory("leadUtil",function(stService, deviceDetector){

		var _changeAttr = function(attr_, value_, id_){
			
			stService.executeGet("/lead/change-attr",{attr: attr_, value: value_, id: id_}).success(function(){


			});
			
		}
		
		var _addMetricaTipoDispositivo = function(){

			var _label = "acessos_";

			if(deviceDetector.isTablet()==true)
				_label+="tablet";

			else if(deviceDetector.isDesktop()==true)
				_label+="desktop";

			else if(deviceDetector.isMobile()==true)
				_label+="mobile";

			_addIncMetric(_label,1);
		}

		var _addIncMetric = function(key_, value_){

			stService.executeGet("/lead/add-inc-metric",{key: key_, value: value_}).success(function(){


			});

		}

		var _addSubsMetric = function(key_, value_){

			stService.executeGet("/lead/add-subs-metric",{key: key_, value: value_}).success(function(){


			});

		}


		return{
			addMetricaTipoDispositivo: _addMetricaTipoDispositivo,
			addIncMetric: _addIncMetric,
			addSubsMetric: _addSubsMetric,
			changeAttr: _changeAttr
			
		}

	})

})();
"use strict";
(function(){
angular.module("adm").config(function($routeProvider, $httpProvider){

	//Inicio
	$routeProvider.when("/lead",{

		templateUrl:"global/st-app/lead/template-route/listaLead.html",

		controller:"listaLeadController"


	}); 

})
})();


"use strict";
(function(){
	angular.module("adm") 
	
	.controller("listaLeadController",function($scope, stService, dateUtil, movUtil, $rootScope, $uibModal){
		
		     $scope.aplicarFiltros = function(){
		    
		    	 $scope.aplicouFiltros=true;
		     }
		    	 
		    	 

	           $scope.openDetalhe = function(lead_){
	        	   
	        	   var modal = $uibModal.open({
						animation: true,
						backdrop: 'static',
						templateUrl:"global/st-app/lead/template-module/detalheLead.html",
						size:'lg',
						controller:"detalheLeadController",
						controllerAs:"vm",
						bindToController:true,
						resolve: {
							lead: function(){
								return lead_
							}
						}
						
					});
	           }
		         

	})

})();

"use strict";
(function(){
	angular.module("adm") 

	.controller("detalheLeadController",function(lead, stService, dateUtil, movUtil, $rootScope, $modalInstance, stUtil, leadUtil){
		
		var vm = this;
		vm.emailTemplates = [
		   {
			   titulo:"Demonstração remota",
			   assunto:"Demonstração - CeasaPlus",
			   html: "<h3>Olá <strong>LEAD_NOME!</strong></h3>"+
                         "<p>Para que eu possa iniciar a demonstração é só você baixar o programa,  executar, e me informar o ID que aparecerá na tela.</p>"+
                            "<a href='https://anydesk.pt/download'>Clique aqui para baixar o programa</a>"
		                    	  
		    }               
		];

		var qs  = $rootScope.config.confs.questoesLead.split(",");
		vm.questions = [];

		for(var i in qs){
			var _attr = qs[i].toLowerCase();
			_attr = _attr.split(" ").join("_");
			vm.questions.push({label: qs[i], attr: _attr});
		}
		
		vm.changeEmailTemplate = function(template){
			
			var html = template.html;
			html = html.replace("LEAD_NOME", lead.nome.split(" ")[0]);
			vm.assuntoEmail = template.assunto;
			vm.contentEmail = html;	
			console.log("Email template: ");
			console.log(html);
		}
		
		vm.getEmailTemplates = function(){
			
			stService.getAll("/emailtemplate").success(function(data){
				
				vm.emailTemplates  = data.itens;
			});
		}

		vm.enviarEmail = function(assunto_, content_){

			if(!content_ || content_.length==0){

				stUtil.showMessage("","Defina um conteúdo para o email","danger");
				return;
			}

			if(!vm.lead.email || vm.lead.email.indexOf("@")==-1 || vm.lead.email.indexOf(".com")==-1){

				stUtil.showMessage("","O email do lead não está cadastrado ou é inválido","danger");
				return;
			}
			
			vm.enviandoEmail = true;

			stService.executeGet("/send-email", {destinatario: vm.lead.email ,assunto: assunto_, content: content_}).success(function(res){
				if(res==true)
					stUtil.showMessage("","Email enviado com sucesso!");
				else 
					stUtil.showMessage("","Ocorreu um erro ao enviar o email!","danger");

				vm.enviandoEmail = false;

			}).error(function(){
				vm.enviandoEmail  = false;
				stUtil.showMessage("","Ocorreu um erro ao enviar o email!","danger");
			});

		}


		vm.enviarSMS = function(sms){

			if(!sms|| sms.length==0){

				stUtil.showMessage("","Defina um conteúdo para o sms","danger");
				return;
			}

			if(!vm.lead.telefone){

				stUtil.showMessage("","O telefone do lead não está cadastrado ou é inválido","danger");
				return;
			}
			
			vm.enviandoSMS = true;

			stService.executeGet("/send-sms", {mensagem: sms, numero: vm.lead.telefone}).success(function(res){
				if(res==true)
					stUtil.showMessage("","SMS enviado com sucesso!");
				else 
					stUtil.showMessage("","Ocorreu um erro ao enviar o SMS!","danger");

				vm.enviandoSMS = false;

			}).error(function(){
				vm.enviandoSMS  = false;
				stUtil.showMessage("","Ocorreu um erro ao enviar o SMS!","danger");
			});

		}

		vm.lead = lead;
		vm.lead.horaApresentacao = new Date(vm.lead.horaApresentacao);

		vm.diasUltimaEtapaLead = dateUtil.daysBetween(vm.lead.dataUltimaEtapa, new Date().getTime());

		vm.atualizarLead = function(){
			stService.getById("lead", vm.lead.id).success(function(data){
				stUtil.showMessage("","Atualizado com sucesso!");
				vm.lead = data.item;
				vm.lead.horaApresentacao = new Date(vm.lead.horaApresentacao);
				console.log("hora: ");
				console.log(new Date(vm.lead.horaApresentacao));
			});
		}
		vm.salvar = function(lead){
			
			console.log("horaApresentação: ");
			console.log(lead.horaApresentacao);
		
			
			if(lead.dataApresentacao)
				lead.dataApresentacao= dateUtil.getDate(lead.dataApresentacao).getTime();
			else
				lead.dataApresentacao =0;
				
			
			stService.executePost("lead/add/",lead).success(function(data){

				stUtil.showMessage("","Salvo com sucesso!");
				vm.lead = data.item;
				vm.lead.horaApresentacao = new Date(vm.lead.horaApresentacao);
			});

		},

		vm.changeEtapaLead = function(lead){

			lead.dataUltimaEtapa =  new Date().getTime();
			vm.salvar(lead);

		}

	})

})();

"use strict";
(function(){
	angular.module("adm") 

	.controller("filterLeadsController",function($scope, $rootScope){
		
		var vm = this;
		
		var _getQueryAtivacaoLastDays = function(days){
			
			var lastDays = new Date();
			lastDays.setDate(lastDays.getDate() - days);
			console.log("lastDays: ");
			console.log(lastDays);
			var query = "dataUltimoLogin>="+lastDays.getTime();
			return query;
		}
		
		vm.listaBuscaLabel = [
		  {attr:"nome",titulo:"Buscar pelo nome do Lead"}                    
		 ];
		
		vm.changeFilters = function(){
			
			var qs = [];
			
			if(vm.buscaLabel && vm.buscaLabel.value)
				qs.push(vm.buscaLabel.attr+" like '%"+vm.buscaLabel.value+"%'");
			
			if(vm.ativacaoLastDays && vm.ativacaoLastDays>0)
				qs.push(_getQueryAtivacaoLastDays(vm.ativacaoLastDays));
			
		
			
			if(vm.attrData){
				
				var dataDe = vm.dataDe.getTime();
				var dataAte = vm.dataAte.getTime();
				var queryData = vm.attrData+" between "+dataDe+" and "+dataAte;
				qs.push(queryData);
				
			}
			
			console.log(qs);
			vm.qs = qs;
			
		}
		
		vm.limparFiltros = function(){
			vm.qs = [];
			vm.buscaLabel = {};
			vm.ativacaoLastDays = 0;
			vm.dataValue = "";
			vm.aplicarFiltros();
		}
		
		vm.aplicarFiltros = function(){
			 vm.submit();
			 var max = $rootScope.config.confs.maxItensPage||7
			 $scope.$parent.getLikeMap(vm.qs,0,max,"","","");
		}
	

	})

})();

"use strict";

(function(){

	angular.module("adm")

	//Diretiva para lista de movimentações
	.directive('filterLeads', function (){
		return {
			restrict: 'E',
			scope:{

				qs:"=",
				submit:"="
			},

			templateUrl:'global/st-app/lead/template-module/filterLead.html',
			bindToController:true,
			controllerAs:"vm",
			controller: "filterLeadsController"
		}
	})

})();


"use strict";
(function(){
angular.module("adm").config(function($routeProvider,$httpProvider){

	//Detalhes de uma NFe
	$routeProvider.when("/detalhe-nfe/:chave",{

		templateUrl:"global/st-app/app-nfe/template-route/detalheNFe.html",
		controller:"detalheNFeController",
		resolve:{
			
			idNFe :function($route){
				
				return $route.current.params.chave;
				
			}
	
		}
	
	}); 
	
	//Lista de NFes
	$routeProvider.when("/nfe",{

		templateUrl:"global/st-app/app-nfe/template-route/listaNFe.html",
		controller: "listaNFeController",
		
	});

})
})();

"use strict";
(function(){

	angular.module("adm")

	.factory("nfeUtil",function($localStorage, $uibModal,$rootScope,stService){

		//Detalahamento e criação de NFe
		//idNFe é quando uma nfe já foi criada (id do objeto NFe persistente)
		//mov representa a movimentação a partir da qual a NFe será criada
		var _openNFe = function(idNFe,idMov){

			var _modalInstance =   $uibModal.open({
				animation: true,
				templateUrl:"global/st-app/app-nfe/template-module/detalheNFe.html",
				size:'lg',
				controller:"detalheNFeController",
				resolve:{

					idNFe: idNFe,

					idMov: idMov

				}

			});

		}

		var _openGrupoImposto = function(imposto, callback){

			var _modalInstance =   $uibModal.open({
				animation: true,
				templateUrl:"global/st-app/app-nfe/template-module/modalGrupoImposto.html",
				size:'lg',
				controllerAs:"vm",
				bindToController:true,
				controller: function($modalInstance){

					var vm = this;
					vm.imposto = imposto;

					vm.salvar = function(){

						
						stService.executePost("grupoimposto/add/",vm.imposto).success(function(data){

							callback(data.item)

							$modalInstance.close();

						});

					}
				}

			});

		}

		//Recuperação dos dados do emitente configurado no sistema
		var _getDadosEmitente = function(){

			var dados = $localStorage.config.confs;
			var emit  = {};
			var compose = ["IE","IM","xNome"];

			for(var i in compose){

				var key = compose[i];

				emit[key] = dados[key];
			}

			//Informações padrão
			emit.cPais = 1058;
			emit.xPais ="BRASIL";

			return emit;

		};

		//Converte uma movimentação em um objeto NFe
		var _movToInfNFe = function(idMov,callback){

			stService.getById("movimentacao",idMov).success(function(data){

				var nfe = {};
				var mov = data.item;
				var infNFe = {};

				//Emitente (Filial corrente)
				var emit = $rootScope.currentFilial;
				infNFe.emit = emit;
				infNFe.emit.enderEmit = infNFe.emit.endereco;

				//Cabeçalho padrão (Dados configurados de acordo com a filial corrente)
				var ide = {};
				ide.mod = emit.nfeMod;
				ide.tpNF = emit.tpNF;
				ide.cuf = infNFe.emit.endereco.codigoUf;
				ide.tpImp = emit.tpImp;
				ide.indPag = emit.indPag;
				ide.tpEmis = emit.tpEmis;
				ide.indPres = emit.indPres;
				ide.indFinal = emit.indFinal;
				ide.finNFe = '1';//Finalidade de emissão, 1=normal
				ide.natOp = emit.natOp;

				//Número e série
				ide.nnf = emit.nnf;
				ide.serie = emit.serie;

				infNFe.ide = ide;

				//Destinátário
				infNFe.dest = mov.pessoa;
				infNFe.dest.enderDest = mov.pessoa.endereco;

				//Itens (Pedidos)
				infNFe.det = _pedidosToDet(mov);

				//Totais

				nfe.infNFe = infNFe;

				//Associa a movimentação
				nfe.movimentacao = mov;

				callback(nfe);


			});



		}

		//Conveter movimentacao.pedidos em Det
		var _pedidosToDet = function(mov){


			var dets = [];
			var peds = mov.pedidos;

			for(i in peds){

				var det = {};
				var prod = {};
				det.nItem = i+1;
				det.prod = peds[i].produto;
				det.infAdProduto = det.prod.infAdProduto;

				//Seta demais informações do produto em det

				prod.vProd  = peds[i].quantidade * peds[i].valorUnitario;

				for(var key in peds[i].produto){

					prod[key] = peds[i].produto[key];
				}

				det.prod = prod;

				dets.push(det);

			}

			return dets;

		}

		//Retorna erros de preenchimento da NFe
		var _validaNFe = function(nfe,callback){

			stService.executePost("nfe/valida-nfe/",nfe).success(function(erros){

				callback(erros);

			});
		}

		return {

			getDadosEmitente : _getDadosEmitente,
			openNFe : _openNFe,
			movToInfNFe:_movToInfNFe,
			pedidosToDet:_pedidosToDet,
			validaNFe:_validaNFe,
			openGrupoImposto:_openGrupoImposto

		}

	})

})();


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

"use strict";
(function(){

	angular.module("adm")

	//Select simples (Sem auto-complete)
	.directive("grupoImposto",function(stService,nfeUtil){

		return{
			restrict:"E",
			templateUrl:"global/st-app/app-nfe/template-module/grupoImpostoDirective.html",
			scope:{

				ngModel:"="//ng-model associado	   
			},
			controller:function($scope){

				//Cadastra um novo grupo ou editar
				$scope.cadGrupoImposto = function(grupo){

					nfeUtil.openGrupoImposto(grupo,function(grupo){

						$scope.itens.push(grupo);
						$scope.ngModel = grupo;
					});
				}

				//Recupera todos os objetos
				stService.getAll("grupoimposto").success(function(data){

					$scope.itens = data.itens;
				});

			}

		}
	})

})();

"use strict";
(function(){

	angular.module("adm") 

	.controller("detalheNFeController",function($scope, idNFe,idMov,stService,stUtil,nfeUtil){

		//Caso seja passado o id da NFe
		//Nesse caso, ocorre um detalhamento de uma NFe já criada anteriormente
		if(idNFe){

			$scope.carregandoNFe = true;
			stService.getById("nfe",idNFe).success(function(data){

				var nfe = data.item;
				//nfe.infNFe = JSON.parse(nfe.infNFe);
				$scope.nfe = nfe;
				$scope.carregandoNFe = false;
				
				console.log("NFe no escopo: ");
				console.log($scope.nfe);
			

			}).error(function(){

				stUtil.showMessage("Ocorreu um erro ao carregar a NFe");
				$scope.carregandoNFe = false;
			});

		}
		
		//Cria-se uma nova NFe a partir de uma movimentação
		else if(idMov){
			
			nfeUtil.movToInfNFe(idMov,function(nfe){
				
				$scope.nfe = nfe;
				
			});
				
		}
		
		//Alteração de destinatário
		$scope.alterarDestinatario = function(pessoa){

			$scope.nfe.infNFe.dest = pessoa;
			$scope.nfe.infNFe.dest.enderDest = pessoa.endereco;

		}

		
		//Validação de campos
		$scope.validaNFe = function(nfe){
			
			nfeUtil.validaNFe(nfe,function(erros){
				
				$scope.erros = erros;
				
				if(erros.length==0){
					stUtil.showMessage("","NFe validada com sucesso!","info");
				}else{
					
					stUtil.showMessage("","Alguns erro(s) foram encontrados ao validar a NFe","danger");
				}
				
			
			});
			
		}
		
		$scope.salvar = function(nfe){

			stService.save("nfe",nfe).success(function(){


			});

		}

	})

})();

"use strict";
(function(){

	angular.module("adm") 

	.controller("listaNFeController",function($scope,$location,nfeUtil){

		$scope.goToNFe  = function(idNFe){

			nfeUtil.openNFe(idNFe,null);

		}

	})

})();

"use strict";

(function(){

	angular.module("adm") 

	.controller("criaNFeController",function($scope, movimentacao,stService,stUtil){
		
		
	})

})();

"use strict";
(function(){
angular.module("adm").config(function($routeProvider,$httpProvider){

	$routeProvider.when("/produto",{

		templateUrl:"global/st-app/app-estoque/template-route/listaProdutos.html",
		controller: "listaProdutoController",
		resolve:{

			produto:function(){

				return {};
			}
		}


	});

	//Listagem de entradas de mercadoria
	$routeProvider.when("/entradamercadoria",{

		templateUrl:"global/st-app/app-estoque/template-route/listaEntradaMercadoria.html",
		controller: "stControl"

	});

	//Editar entrada de mercadoria
	$routeProvider.when("/entradamercadoria/:id",{

		templateUrl:"global/st-app/app-estoque/template-route/entradaMercadoria.html",
		controller: "entradaMercadoriaController",
		resolve:{
			entradaMercadoria: function($route, stService){
				return stService.getById("entradamercadoria",$route.current.params.id);
			}
		}

	});

})

})();



"use strict";
(function(){

	angular.module("adm") 

	.factory("estoqueUtil",function($http, config, stService, cacheGet, cachePost, $stModal, stUtil, $filter, movimentacaoService, $stDetalhe, $uibModal, st, leadUtil){

		var _openPrecosCompraProduto = function(produto){

			var _modalInstance =   $uibModal.open({
				animation: true,
				templateUrl:"global/st-app/app-estoque/template-module/modalPrecosCompraProduto.html",
				size:'lg',
				controller:function($scope){

					$scope.produto = produto;

					var query = "select movimentacao.dataCadastro, movimentacao.pessoa.nome, valorUnitario, quantidade from Pedido where tipoEntrada=1 and id_produto="+produto.id;

					stService.executeGet("projecao/execute-query",{query:query}).success(function(data){

						$scope.results = data.itens;

					});

				}

			});

		}



		var _cadProdutoStep = function(produto, callback){

			var _modalInstance =   $uibModal.open({
				animation: true,
				templateUrl:"global/st-app/app-estoque/template-module/cadProdutoStep.html",
				size:'lg',
				controller:function($scope, $modalInstance){

					$scope.produto = produto || {};

					var nomeOriginal =  $scope.produto.nome;

					$scope.cancelAction = function(){

						if($scope.step==1){
							$modalInstance.close();
						}
						else{
							$scope.changeStep($scope.step-1);
						}

					}

					$scope.cadastrarProduto = function(){

						var produto = $scope.produto;

						console.log("Resultado: ");
						console.log(cacheGet.get("produto","nome",produto.nome));

						//Evitar cadastro duplicado
						if( cacheGet.get("produto","nome",produto.nome).length>0 && produto.nome != nomeOriginal)
						{
							stUtil.showMessage("","Já existe um registro com '"+produto.nome.toUpperCase()+"' cadastrado no sistema","danger");
							$scope.changeStep(1);
							return;
						}

						if(!produto.nome){

							stUtil.showMessage("","Informe um nome para o produto","danger");
							$scope.changeStep(1);
							return;
						}

						if($scope.step!=3 && (produto.setQuantidade!=false)){
							$scope.changeStep($scope.step+1);
							return;
						}

						$scope.salvando = true;

						stService.executePost("produto/add/", produto).success(function(data){
							
							leadUtil.addIncMetric("cads_produto",1);

							if(data.item.id==1){
								st.leadEvt({descricao: "cadastrou_primeiro_produto"});
								
							}

							var pedidoEntrada = {};
							pedidoEntrada.produto = data.item;
							pedidoEntrada.tipoEntrada=1;
							pedidoEntrada.quantidade = $scope.produto.quantidade;

							stService.executePost("pedido/add/", pedidoEntrada).success(function(data){

								$scope.salvando = true;
								$modalInstance.close();
								callback(data.item.produto);

							});

						});


					}

					$scope.changeStep = function(step){

						$scope.step=step;

						var _infoModal = {};

						//Escolha de produtos
						if(step==1){
							_infoModal.titulo = "Nome do produto";
							_infoModal.okActionLabel = "Avançar";
							_infoModal.okActionIcon = "fa-angle-double-right";
						}

						else if(step==2){
							_infoModal.titulo = "Atalho";
							_infoModal.okActionLabel  = "Avançar";
							_infoModal.okActionIcon = "fa-angle-double-right";
						}

						else if(step==3){
							_infoModal.titulo = "Quantidade em estoque";
							_infoModal.okActionLabel  = "Finalizar";
							_infoModal.okActionIcon = "fa-check";
						}

						$scope.infoModal = _infoModal;

					}

					$scope.changeStep(1);


				}

			});

		}


		//Recupera produtos com estoque baixo
		var _getProdutosEstoqueMin = function(callback){

			stService.executeGet("projecao/execute-query",
					{query:"select p.id,p.nome,'',p.quantidade from Produto p where (p.quantidade<=p.minQuant) and p.disable =0"}).success(function(data){

						callback(data.itens);

					}).error(function(){					
					});
		}

		//Modal para entrada de mercadoria
		var _openEntradaMercadoria = function(entradaMercadoria,callback){

			var _modalInstance =   $uibModal.open({
				animation: true,
				backdrop: 'static',
				templateUrl:"global/st-app/app-estoque/template-route/entradaMercadoria.html",
				size:'lg',
				controller:"entradaMercadoriaController",
				resolve:{
					entradaMercadoria: entradaMercadoria || {},
					callback:callback
				}

			});

		}

		//Ajustar estoque de um produto
		var _openEdit = function(produto){

			var _modalInstance =   $uibModal.open({
				animation: true,
				templateUrl:'global/st-app/app-estoque/template-module/estoqueEdit.html',
				size:'lg',
				controller:"editEstoqueController",
				controllerAs:"vm",
				bindToController:true,
				resolve:{
					produto:function(){

						return produto;
					}

				}

			});

		}

		var _openProdutoInModal = function(produto,callback){

			//Cadastro de novo produto
			if(!produto || !produto.id){
				_cadProdutoStep(produto, callback);
				return;
			}

			var _modaI = $uibModal.open({
				animation: true,
				templateUrl:'global/st-app/app-estoque/template-module/cadProdutoModal.html',
				size:'lg',
				controller:function($scope, nfeUtil, $modalInstance){

					$scope.produto = produto || {};
					$scope.salvar = function(){

						$scope.salvando = true;
						stService.save("produto",$scope.produto).success(function(data){

							$scope.salvando = false;
							$modalInstance.close();
							callback(data.item);

						});
					};

				}
			});
		};


		//Recupera o balanço de estoque de um produto
		//Caso o produto seja definido, retorna o produto completo com a quantidade já atualizada
		//Caso no produto NÃO seja definido, retorna apenas a quantidade
		function _getEstoqueProduto(produto,callback){

			var basicQuery = " disable=0 ";

			if(produto)
				basicQuery+=" and produto.id="+produto.id;

			basicQuery+=" and produto.disable=0";

			var  querysEntrada = [basicQuery,"tipoEntrada=1"];

			var querysSaida= [basicQuery,"tipoEntrada=0"];

			var basicInfo = {
					columns:"sum(quantidade)",
					objeto:"Pedido",

			}

			//Movimentações de entrada
			basicInfo.qs = querysEntrada;
			stService.getProjecoes(basicInfo).success(function(data){

				var entradas = data.itens[0]||0;

				//Movimentações de saida
				basicInfo.qs = querysSaida;
				stService.getProjecoes(basicInfo).success(function(data){

					var  saidas = data.itens[0] || 0;

					var balanco = entradas - saidas;

					//Caso seja informado um produto com parametro, o produto completo é retornado
					if(produto){
						//Atualiza a quantidade dp produto informado
						produto.quantidade = balanco;
						callback(produto);

					}

					else {
						callback(balanco);
					}

				}).error(function(){

					callback();
				})

			}).error(function(){

				callback();
			});

		}

		return {

			openEdit: _openEdit,
			getProdutosEstoqueMin:_getProdutosEstoqueMin,
			openProdutoInModal:_openProdutoInModal,
			getEstoqueProduto: _getEstoqueProduto,
			openEntradaMercadoria:_openEntradaMercadoria,
			openPrecosCompraProduto:_openPrecosCompraProduto,
			cadProdutoStep: _cadProdutoStep

		};

	})

})();

"use strict";
(function(){

	angular.module("adm")

	//Diretiva input group do estoque
	.directive('buttonEstoque', function (movUtil,stUtil,stService,$filter,$uibModal,estoqueUtil) {
		return {
			restrict: 'E',
			templateUrl:"global/st-app/app-estoque/template-module/buttonEstoque.html" ,
			scope:{

				produto:"=",
				hideButtons:"=",
				classLabel:"=",
				autoLoad:"=",//carregamento automatico da quantidade, padrão = true

			},
			controller:function($scope){

				//Carrega o estoque de um produto
				$scope.carregaEstoqueProduto = function(produto){

					if(!produto.id)
						return;

					$scope.carregandoEstoque = true;

					estoqueUtil.getEstoqueProduto(produto,function(prod){

						if(prod){
						produto = prod;
					
						}else{
							//stUtil.showMessage("","Verifique sua conexão com a internet!","danger");
						}

						$scope.carregandoEstoque = false;
					});
				}

				$scope.editQuantidade = function(produto){

					estoqueUtil.openEdit(produto,function(){

					});

				}

				if($scope.autoLoad!=false){
					$scope.carregaEstoqueProduto($scope.produto);
				}
				else{
					delete $scope.produto.quantidade;
				}

			}
		}
	})

	.directive("listEstoqueMin",function(estoqueUtil){

		return{
			restrict:"E",
			templateUrl:"global/st-app/app-estoque/template-module/listEstoqueMin.html",
			controller:function($scope,$timeout,stService,$uibModal, $location,$stDetalhe, $route){

				estoqueUtil.getProdutosEstoqueMin(function(itens){
					$scope.itens = itens;
				});	

				$scope.toProduct = function(idProduto,modal){


					stService.getById("produto",idProduto).success(function(data){

						$stDetalhe.open("view/produto/addAndUpdateProduto.html",data.item,$scope,function(res){

							$route.reload();

						}); 

					});		
				}

			}

		}
	});

})();

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

"use strict";
(function(){

	angular.module("adm")

	.controller("editEstoqueController",function(produto, estoqueUtil, cacheGet, stUtil, stService, $modalInstance){

		var vm = this;
		
		vm.produto = produto;

		vm.fechar = function(modal){

			modal.$dismiss("");

		}
		
		vm.novaEntradaMercadoria = function(){
			
			$modalInstance.close();
			estoqueUtil.openEntradaMercadoria();
		}

		vm.confirmar = function(){

			var produto  = vm.produto;
			var novaQuantidade = vm.novaQuantidade;
			
			vm.carregando= true;
			
			estoqueUtil.getEstoqueProduto(produto, function(produtoRes){

				novaQuantidade = parseFloat(novaQuantidade);
				var tipoEntrada;
				var quantidade  = novaQuantidade - produtoRes.quantidade;
				var movEstoque = {};

				//TODO Lança Pedido  de correção de estoque
				var pedido = {

						tipoEntrada:1,
						produto:{id:produto.id},
						quantidade:quantidade,
						tipoOperacao:"Correção manual de estoque"
				}

				stService.save("pedido",pedido).success(function(){

					stUtil.showMessage("","Estoque atualizado com sucesso!","info");

					vm.carregando= false;
					$modalInstance.close();

					produto.quantidade = novaQuantidade;
					cacheGet.updateObject("produto",produto);

				});

			});

		}

	});

})();

"use strict";
(function(){
	angular.module("adm").controller("listaProdutoController",function(estoqueUtil, $rootScope, stUtil, $scope, $location, $stModal, stService, $route, $stDetalhe, configUtil, leadUtil){

	
		$scope.stepsProduto = [
		                       
		                       {
		                        	  title: "Produtos",
		                        	  position: "centered",
		                        	  description: "Nesta tela é possível visualizar todos os seus produtos",
		                        	  width: 300,
		                        	  nextButtonText:"OK",
		                        	  overlayOpacity: 0,
		                        	  
		                          },
		                          
		                         
		                       
		                       {
		                    	   title: "Editar",
		                    	   position: "bottom",
		                    	   description: "Se quiser alterar alguma informação é só clicar aqui :-)",
		                    	   attachTo: "#card_edit_0",
		                    	   showPreviousButton:false,
		                    	   nextButtonText:"OK",
		                    	   overlayOpacity: 0,
		                    	   xOffset:-110,
		                    	   yOffset:-10
		                    	  
		                       },
		                       
		                       {
		                    	   title: "Estoque do produto",
		                    	   position: "bottom",
		                    	   description: "A quantidade restante do item é atualizada automaticamente a cada venda :-)",
		                    	   attachTo: "#produto_estoque_0",
		                    	   showPreviousButton:false,
		                    	   nextButtonText:"OK",
		                    	   arrowClass:"onboarding-quantidade-produto-arrow",
		                    	   overlay:true,
		                    	   overlayOpacity: 0.05,
		                    	   xOffset:-9,
		                    	   yOffset:-9,
		                    	   
		                    
		                    	  
		                       },
		                      
		                       {
		                    	   title: "Cadastro",
		                    	   position: "left",
		                    	   description: "Para cadastrar um novo produto é só clicar aqui",
		                    	   attachTo: "#button-add-produto",
		                    	   showPreviousButton:false,
		                    	   doneButtonText:"OK",
		                    	   overlay:true,
		                    	   overlayOpacity: 0.2, 
		                    	   xOffset:20,
		                    	   yOffset:-59
		                    	 
		                    	   
		                       }
		                       ];


		var atalhoBuscaProduto = "";
		if($rootScope.config)
			atalhoBuscaProduto = $rootScope.config.confs.atalhoBuscaProduto ||'nome';

		else
			atalhoBuscaProduto="nome";

		var placeHolder = 'Digite o nome do produto';

		if(atalhoBuscaProduto=='codigoBarras'){

			placeHolder = 'Digite o código de barras  do produto';
		}
		
		$scope.finalizarOnboarding = function(){
			
			configUtil.setConfig("visualizouOnboardingProdutos","true", function(){
			
				 leadUtil.addSubsMetric("onboard_listagem_produtos", 1);
				 //$location.path("/inicio");
			})
		
		}

		$scope.addEntradaMercadoria = function(){
			estoqueUtil.openEntradaMercadoria();
		}

		$scope.verPrecosCompra = function(produto){

			estoqueUtil.openPrecosCompraProduto(produto);
		}

		$scope.buscaEspecial = {

				attr:atalhoBuscaProduto,
				tipo:'input',placeHolder:placeHolder,
				icon:'fa-list'	
		}

		$scope.deletarProduto = function(produto){

			produto.disable = 1;
			stService.save("produto",produto).success(function(data){

				$route.reload();
				stUtil.showMessage("","Produto Deletado com sucesso!","info");		

			});

		}

		$scope.cadProdutoStep = function(){

			estoqueUtil.cadProdutoStep(function(produto){


			});
		}	

		$scope.openAdd = function(opcao,produto){

			estoqueUtil.openAdd(opcao,produto,function(){


			});

		}

		$scope.openDetalhe = function(produto){

			estoqueUtil.openProdutoInModal(produto,function(res){

				$route.reload();

			});

		}

		$scope.getTotalItens = function(){

			//Recupera o estoque de todos os itens
			estoqueUtil.getEstoqueProduto(null,function(total){

				$scope.totalItensEstoque = total;
			});
		}

		$scope.getTotalItens();

	});

})();
"use strict";
(function(){
	angular.module("adm").controller("entradaMercadoriaController",function($filter, movUtil, $location, st, $uibModal, $rootScope, estoqueUtil, pedidoUtil, cacheGet, $stModal, $scope, stUtil, stService, $route, entradaMercadoria, callback, $modalInstance){

		
		
		//A cada mudança nos pedidos o valor total é atualizado
		$scope.$watch('em.movimentacao.pedidos',function(pedidos){

			$scope.em.movimentacao.valor = pedidoUtil.getTotalPedidos(pedidos);

		},true);
		
		$scope.alterarLancarDespesa = function(lancar){

			if(lancar==true){
				$scope.em.movimentacao.valor = pedidoUtil.getTotalPedidos($scope.em.movimentacao.pedidos);
			}
			else{
				$scope.em.movimentacao.valor = 0;
			}
		}

		$scope.changeStep = function(step){

			$scope.step=step;

			var _infoModal = {};

			//Escolha de produtos
			if(step==1){
				_infoModal.titulo = "Entrada de mercadoria";
				_infoModal.okActionLabel = "Avançar";
				_infoModal.okActionIcon = "fa-angle-double-right";
			}
			else if(step==2){
				_infoModal.titulo = "Outras informações";
				_infoModal.okActionLabel  = "Finalizar";
				_infoModal.okActionIcon = "fa-check";
			}

			$scope.infoModal = _infoModal;

		}


		$scope.changeStep(1);

		//Métrica para análise do tempo de atalização do estoque
		var ini = new Date().getTime();

		if(entradaMercadoria){

			$scope.em = entradaMercadoria;

		}
		else {

			$scope.em = {};
			$scope.em.movimentacao = {};
			$scope.em.movimentacao.data = new Date();
		}

		$scope.$watch("em.movimentacao",function(mov){

			if(mov)
				$scope.totalEM = movUtil.getTotalMov(mov);
		},true);

		$scope.cancelar = function(){

			$location.path("produto");
		} 


		$scope.cancelAction = function(){

			if($scope.step==2){

				$scope.changeStep(1);
				return;
			}

			$modalInstance.close();
		}

		$scope.salvar = function(){


			if($scope.step==1){

				$scope.changeStep(2);
				return;
			}

			var em = $scope.em;

			$scope.carregandoFinalizar = true;

			//Apenas pedidos válidos
			em.movimentacao.pedidos = em.movimentacao.pedidos.filter(function(pedido){

				if(pedido.quantidade){
					pedido.tipoEntrada=1;
					return pedido;

				}
			});

			//Validações
			if(em.movimentacao.pedidos.length==0){

				stUtil.showMessage("","Escolha pelo menos um produto para atualizar o estoque.","danger");
				$scope.carregandoFinalizar = false;
				return;
			}

			//Lança a movimentacao
			stService.save("entradamercadoria",em).success(function(){

				$scope.carregandoFinalizar = false;

				stUtil.showMessage("","Estoque atualizado com sucesso para "+$rootScope.currentFilial.xNome,"info");

				st.evt({evento:"tempo_atualizar_estoque",descricao:((new Date().getTime()-ini)/1000)+""});

				var path = $route.current.$$route.originalPath;

				if(path=='/entradamercadoria/:id')
					$location.path("entradamercadoria");

				else  if(path=='/produto')
					$route.reload();
				else 
					$location.path("produto");

			}).error(function(){

				$scope.carregandoFinalizar = false;
				stUtil.showMessage("","Ocorreu um erro ao atualizar o estoque, verifique sua conexão com a internet e tente novamente","danger");
			});

		}

	});
})();

"use strict";
(function(){
angular.module("adm").controller("listaEntradaMercadoriaController",function($filter,movUtil,$location,st,$uibModal,$rootScope,dateUtil,estoqueUtil,cacheGet,$stModal,$scope,stService, stUtil ,$route){

	$scope.buscarDados = function(){
		var qs = [];
		qs.push(dateUtil.getQueryOfPeriod("movimentacao.data",$scope.dataDe,$scope.dataAte));
		$scope.$parent.getLikeMap(qs,0,0,"","movimentacao.data","ASC");
	}
	
	
	$scope.openEntradaMercadoria = function(em){
		estoqueUtil.openEntradaMercadoria(em,function(){
			$route.reload();
		});
	}

	$scope.deletarEM = function(index,ems){

		var em = ems[index];
		stService.executePost("entradamercadoria/delete/",em).success(function(data){

			ems.splice(index,1);
			stUtil.showMessage("","Entrada de mercadoria excluida com sucesso","info");		

		}).error(function(){

			stUtil.showMessage("","Ocorreu um erro ao deletar entrada de mercadoria, verifique sua conexão com a internet e tente novamente","danger");		

		});

	}

});

})();




"use strict";
(function(){
angular.module("adm").config(function($routeProvider,$httpProvider){

	$routeProvider.when("/cliente",{

		templateUrl:"global/st-app/app-pessoa/template-route/clientes.html",

	}); 


	$routeProvider.when("/fornecedor",{

		templateUrl:"global/st-app/app-pessoa/template-route/fornecedores.html",

	}); 

	$routeProvider.when("/funcionario",{

		templateUrl:"global/st-app/app-pessoa/template-route/funcionarios.html",

	}); 

	$routeProvider.when("/operadorsistema",{

		templateUrl:"global/st-app/app-pessoa/template-route/operadorsistema.html",

	}); 

})
})();


"use strict";
(function(){

	angular.module("adm")
	//Input com detalhes do objeto Pessoa
	.directive("detalhePessoa",function(stService){

		return{

			restrict:"E",
			require:"objeto",
			templateUrl:"global/st-app/app-pessoa/template-module/detalhePessoa.html",
			scope:{

				pessoa:"=",//Pessoa referenciada

			}

		}
	})

	//Input com detalhes do objeto Pessoa
	.directive("detalhePessoaEndereco",function(){

		return{

			restrict:"E",
			require:"objeto",
			templateUrl:"global/st-app/app-pessoa/template-module/detalhePessoaEndereco.html",
			scope:{

				endereco:"=",//Pessoa referenciada
			},

		}
	})

})();

"use strict";
(function(){

	angular.module("adm")

	.factory("pessoaUtil",function($uibModal, stService, stUtil){

		var _openDetalhePessoa = function(pessoa, tab, callback){

			var _modal  = 	$uibModal.open({
				animation: true,
				backdrop: 'static',
				templateUrl:"global/st-app/app-pessoa/template-module/modalDetalhePessoa.html",
				size:'lg',
				controller:function($scope, $modalInstance){
					
					
					//config.confs.defaultCadProdutoAllFiliais || false
					var nomeOriginal = pessoa.nome;

					$scope.cadAllFiliais = false;

					$scope.tab = tab || 0;

					$scope.tabs = [{label:'Informações',icon:'fa-edit'}];

					if(pessoa.id)
						$scope.tabs.push({label:'Lançamentos',icon:'fa-line-chart'});

					$scope.objeto = pessoa;
					
					var tipoMov=2;
					//Definicao do tipo de movimentação
					if(pessoa.tipo_pessoa=='cliente')
						tipoMov = 2;//Gera receita

					else if(pessoa.tipo_pessoa=='fornecedor')
						tipoMov = 1;//Gera Despesa

					else if(pessoa.tipo_pessoa=='funcionario')
						tipoMov = 1;//Gera Despesa

					$scope.tipoMov=tipoMov;

					$scope.fechar = function(){

						$modalInstance.close();
						callback($scope.objeto);

					}

					$scope.salvar = function(){
						
						var tipoPessoa  = $scope.objeto.tipo_pessoa;
						var pessoa = $scope.objeto;
						
						$scope.salvando = true;
					
						var classe = tipoPessoa.charAt(0).toUpperCase() + tipoPessoa.slice(1);

						stService.executeGet("/projecao/execute-query",{query:  "from "+classe+" where nome like '%"+pessoa.nome+"%' and disable=0"}).success(function(data){
							
                                 if(data.itens.length==0 || nomeOriginal==pessoa.nome){
                                	 
                                	 stService.save(tipoPessoa, pessoa).success(function(data){
             							
             							$scope.salvando = false;

             							stUtil.showMessage("","Salvo com sucesso","info");	

             							$modalInstance.close();

             							if(callback)
             								callback(data.item);
             						}).error(function(){
             							$scope.salvando = false;
             							stUtil.showMessage("","Ocorreu um erro, verifique sua conexão","danger");
             						});
                                	 
                                 }
                                 else {
                                	 $scope.salvando = false;
                                	 stUtil.showMessage("","Já existe um registro com '"+pessoa.nome+"' cadastrado no sistema","danger");	
                                 }

						}).error(function(){
							$scope.salvando = false;
							stUtil.showMessage("","Ocorreu um erro, verifique sua conexão","danger");	
						});
						
						

					}

				}
			});
		}

		return {

			openDetalhePessoa:_openDetalhePessoa

		}
	});

})();


"use strict";
(function(){

	angular.module("adm")
	.directive("emprestimoEmbalagem",function(stService, lrUtil){

		return{

			restrict:"E",
			templateUrl:"global/st-app/logistica-reversa/template-module/emprestimoEmbalagem.html",
			scope:{
				pessoa:"=",//Pessoa referenciada
                onlyDevedores:"="//Se true, exibe apenas clientes que estejam devendo embalagens
			},
			bindToController:true,
			controllerAs:"vm",
			bindToController:true,
			controller:"emprestimoEmbalagemController"

		}
	})
	
	.directive("emprestimoEmbalagemExemplo",function(stService, lrUtil){

		return{

			restrict:"E",
			templateUrl:"global/st-app/logistica-reversa/template-module/emprestimoEmbalagemExemplo.html",
			scope:{
			},
			bindToController:true,
			controllerAs:"vm",
			bindToController:true,
			controller:function(){
				
				var vm = this;
				vm.emprestimo = {
					quantidadeReceber: 100	
				};
				vm.pessoa = {nome:"CLIENTE EXEMPLO"};
			}

		}
	})

})();

"use strict";
(function(){
	angular.module("adm") 

	.controller("emprestimoEmbalagemController",function(lrUtil, stService){

		var vm = this;

		//Recupera os empréstimos de um cliente
		vm.getEmprestimo = function(pessoa){
			vm.emprestimo = null;
			vm.carregando=true;
            lrUtil.getInfoEmprestimos(pessoa, function(emprestimo){
            	
            	vm.carregando=false;
            	vm.emprestimo = emprestimo;
            	
            	if(emprestimo==null){
            		
            		vm.erro=true;
    				
            	}
            	
            });

		}

		vm.getEmprestimo(vm.pessoa);

		//Baixa de empréstimo
		vm.baixarEmprestimo = function(pessoa, emprestimo){

			lrUtil.baixarLR(pessoa,emprestimo,function(){

				vm.getEmprestimo(vm.pessoa);
			});

		}

		//Visualizar histórico
		vm.showHistorico = function(emprestimo){

			lrUtil.showHistorico(emprestimo);
		}

	})

})();

"use strict";
(function(){
angular.module("adm").controller("listaLRController",function($route, $scope, $window, $uibModal, stService, stUtil, lrUtil, dateUtil){

	var vm = this;
	
	vm.devolvidasSemanaPeriodo = dateUtil.getPeriodOf("SEMANA_ATUAL");
	vm.labelDevolvidasSemana = "Embalagens devolvidas na semana atual";
	//Embalagens devolvidas essa semana
	vm.devolvidasSemana  = {
			
				labelColumn:"pessoa.nome",
				valueColumn:"sum(quantidade)",
				periodColumn:"dataCadastro",
				objeto:"LogisticaReversa",
				tooltipTemplate:"<%= label +': '+ value + ' unidade(s)'  %>",
				qs:["tipo=1"]	
	}
	
	$scope.$watch('vm.activeTab',function(tab){
		
		if(tab==1){
			vm.getTotalEmbalagensReceber();
		}
		
	});
	
	vm.getTotalEmbalagensReceber = function(){
		  
		   var queryBase = "select sum(valor) from  Movientacao";
		   
		   var info = {
				   
				   objeto:"LogisticaReversa",
				   qs: ["disable=0", "tipo=2"],
				   extra:"",
				   columns:"sum(quantidade)"
		   }
		   
		   //Emprestimos
		   stService.getProjecoes(info).success(function(dadosEmprestimos){
			   
			  var emprestimos  = dadosEmprestimos.itens[0];
			  
				   //Emprestimos
			       info.qs =  ["disable=0", "tipo=1"];
				   stService.getProjecoes(info).success(function(dadosDevolucoes){
					   
					  var devolucoes  = dadosDevolucoes.itens[0];
					  vm.totalEmbalagensReceber = emprestimos - devolucoes;
					   
				   });
			   
		   });
		   
		  
	}

	vm.getLrs= function(nomePessoa){

		var query = "where disable=0 and pessoa.disable=0";

		if(nomePessoa)
			query += " and  pessoa.nome like '%"+nomePessoa+"%' "

			//Reupera todos os registros de logística reversa pra pessoa informada
			stService.executeGet("/projecao/execute-query",{query:"select pessoa.id, pessoa.nome from LogisticaReversa "+query+" group by pessoa.id order by id desc"}).success(function(data){

				var lrs = data.itens;

				var clientes = [];

				for(var i in lrs){
					var cliente = {id:lrs[i][0],nome:lrs[i][1]};

					clientes.push(cliente);
				}

				vm.objetos = clientes;

			});

	}

	vm.getLrs();

	vm.openDetalhe = function(lr){

		lrUtil.openDetalhe(lr,function(res){

			vm.getLrs();
			 
		});
	}


})
})();
"use strict";
(function(){
	angular.module("adm") 

	.controller("baixarLRController",function(pessoa, emprestimo, callback, stService, dateUtil, $rootScope, stUtil, $modalInstance){

		var vm = this;
		vm.pessoa = pessoa;
		vm.emprestimo = emprestimo;
	

		vm.salvarEmp= function(){
			
			var emprestimo = vm.emprestimo;
			var quantidadeBaixar = vm.quantidadeBaixar;

			if(quantidadeBaixar > (vm.emprestimo.quantidadeReceber)){
				stUtil.showMessage("","A quantidade não deve ser maior do que o restante a receber!","danger");
				return;
			}
			
			if(!quantidadeBaixar || quantidadeBaixar==0){
				stUtil.showMessage("","Informe uma quantidade válida","danger");
				return;
			}

			//Salva uma lr de entrada (tipo=1)
			var lr = {
					tipo:1,
					pessoa:pessoa,
					quantidade: quantidadeBaixar
			}
            
			vm.salvando = true;
			stService.save("logisticareversa",lr).success(function(data){

				vm.salvando = false;
				$modalInstance.close();
				stUtil.showMessage("","Atualizado com sucesso!","info");
				callback();

			}).error(function(){
				vm.salvando = false;
				stUtil.showMessage("","Ocorreu um erro, verifique sua conexão com a internet","danger");
			});
		}

	

	})

})();

"use strict";
(function(){
	angular.module("adm") 

	.controller("detalheLRController",function(lr,callback, stService, stUtil, $modalInstance){

		var vm = this;
		vm.lr = lr || {};
		vm.lr.dataCadastro  = vm.lr.dataCadastro || new Date();

		vm.salvar = function(){

			//Emprestimo
			vm.lr.tipo = 2;

			if(!vm.lr || !vm.lr.quantidade || !vm.lr.pessoa){
				stUtil.showMessage("","Preencha os campos corretamente!","danger");
				return;
			}

			stService.save("logisticareversa",vm.lr).success(function(){

				stUtil.showMessage("","Cadastrado com sucesso!","info");
				$modalInstance.close();
				callback(vm.lr);

			});

		}

	})

})();

"use strict";
(function(){
	angular.module("adm") 

	.controller("historicoLRController",function(emprestimo,callback){

		var vm = this;
		vm.emprestimo = emprestimo;

		vm.fechar = function(ele){

			ele.$dismiss('cancel');
			callback();

		}

	})

})();

"use strict";
(function(){

	angular.module("adm")

	.factory("lrUtil",function($uibModal, stService){

		var _showHistorico = function(emprestimo,callback){

			$uibModal.open({
				animation: true,
				templateUrl:"global/st-app/logistica-reversa/template-module/modalHistoricoLR.html",
				size:'lg',
				bindToController:true,
				controllerAs:"vm",
				controller:"historicoLRController",
				resolve:{

					emprestimo:  function(){
						return emprestimo
					},
					callback: function(){
						return callback
					} 
				}
			});

		}

		var _openDetalhe = function(lr,callback){

			$uibModal.open({
				animation: true,
				templateUrl:"global/st-app/logistica-reversa/template-module/modalDetalheLR.html",
				size:'lg',
				bindToController:true,
				controllerAs:"vm",
				controller:"detalheLRController",
				resolve:{
					lr:function(){

						return lr
					},
					callback: function(){
						return callback
					} 
				}
			});

		}

		var _baixarLR = function(pessoa, emprestimo, callback){

			$uibModal.open({
				animation: true,
				templateUrl:"global/st-app/logistica-reversa/template-module/modalBaixarLR.html",
				size:'lg',
				bindToController:true,
				controllerAs:"vm",
				controller:"baixarLRController",
				resolve:{
					emprestimo:function(){

						return emprestimo
					},
					pessoa:  function(){

						return pessoa
					},
					callback: function(){
						return callback
					} 
				}
			});

		}
		
		//Recupera todas as informações de emrpestimso para uma pessoa
		var _getInfoEmprestimos = function(pessoa, callback){

			var qs = ["pessoa.id="+pessoa.id];
			
			//Reupera todos os registros de logística reversa pra pessoa informada
			stService.getLikeMap("logisticareversa",qs,0,0, "").success(function(data){


				var lrs = data.itens;

				var emprestimos = lrs.filter(function(value){

					if(value.tipo==2)
						return value;
				});

				var devolucoes = lrs.filter(function(value){

					if(value.tipo==1)
						return value;
				});

				var somaEmprestimos = 0;
				var somaDevolucoes = 0;

				for(var i in emprestimos){

					somaEmprestimos += emprestimos[i].quantidade;
				}

				for(var j in devolucoes){

					somaDevolucoes += devolucoes[j].quantidade;
				}

				

				//Objeto base utilizado para baixas
				var emprestimo = {};

				emprestimo.lrs = lrs;

				emprestimo.somaEmprestimos = somaEmprestimos;
				emprestimo.somaDevolucoes = somaDevolucoes;
				emprestimo.quantidadeReceber = somaEmprestimos - somaDevolucoes;//Campo quantidade

			   callback(emprestimo);

			}).error(function(){

				callback();
				
				
			});

		}
		

		return {

			baixarLR:_baixarLR,
			showHistorico:_showHistorico,
			openDetalhe:_openDetalhe,
			getInfoEmprestimos: _getInfoEmprestimos

		};

	})

})();
"use strict";
(function(){
angular.module("adm").config(function($routeProvider,$httpProvider){

	$routeProvider.when("/logisticareversa",{

		templateUrl:"global/st-app/logistica-reversa/template-route/listaLR.html",
		controllerAs:"vm",
		controller: "listaLRController",

	});
	
})
})();


"use strict";
(function(){
angular.module("adm").config(function($routeProvider,$httpProvider){

	$routeProvider.when("/relatorio",{

		templateUrl:"global/st-app/app-relatorio/template-route/relatorio.html",
		controller:"relatorioController"

	}); 

})
})();
"use strict";
(function(){
angular.module("adm").controller("relatorioController",function($scope,$rootScope,$route,$window,stService,movimentacaoService,$filter,movUtil, stUtil,dateUtil, leadUtil){

	$scope.imprimirRelatorio = function(){
		leadUtil.addIncMetric("impressoes_relatorio",1);
		$window.print();
	}
	
	$scope.dataHoje = new Date();

    //Relatórios fixos
	$scope.relatorioGastosCategoria = {
			qs: ["tipo='1'","disable=0","baixada=1","valor>0"],
			periodColumn:"dataBaixa",
			labelColumn:"categoria",
			valueColumn:"sum(valor)",
			objeto:"Movimentacao",
			
	}

	$scope.atualizarDados = function(){
		
		leadUtil.addIncMetric("visualizacoes_relatorio",1);

		if(!$scope.dataDe && !$scope.dataAte){
			stUtil.showMessage("","Defina um período para geração do relatório.","danger");
			return;
		}

		if(!$scope.dataDe){
			stUtil.showMessage("","Escolha  a data inicial.","danger");
			return;
		}

		if(!$scope.dataAte){
			stUtil.showMessage("","Escolha  a data final.","danger");
			return;
		}

		$scope.escolheuPeriodo = true;
		$rootScope.$broadcast("changePeriod");

	}

	if($scope.dataDe && $scope.dataAte)
		$scope.atualizarDados();

});

})();

"use strict";
(function(){

	angular.module("adm")

	//Componente para visualização de projeções
	.directive("componentProjecao",function(relatorioUtil){

		return{

			restrict:"E",
			templateUrl:"global/st-app/app-relatorio/template-module/chart.html",
			require:"info",
			scope:{
				info:"=",
				de:"=",
				ate:"=",	
			},
			controller:function($scope){
				
				
				console.log("Info aqui: ");
				console.log($scope.info);
				
				//Período
				$scope.de = $scope.de || "1900-10-05";
				$scope.ate = $scope.ate || "3000-10-05";

				//Quantidade máxima padrão de itens a serem exibidos 
				$scope.maxItens = relatorioUtil.MAX_ITENS_DEFAULT;
				$scope.order = relatorioUtil.ORDER_BY_DEFAULT;//

				delete $scope.projs;
				function getDados (maxItens){

					//Montagem das informações basicas para recuperação da projeção a partir de $scope.info
					var basicInfo = {
							qs: $scope.info.qs||[],
							columns:$scope.info.labelColumn+","+$scope.info.valueColumn+" ",
							objeto:$scope.info.objeto,
							groupBy:$scope.info.labelColumn,
							extra:"order by "+$scope.info.valueColumn+" "+$scope.order,
							max:$scope.maxItens

					}

					var dadosExemplo  = $scope.info.dadosExemplo;

					delete $scope.proj;
					relatorioUtil.chartFactory($scope,basicInfo,$scope.info.periodColumn,function(proj){

						//Dados de exemplo
						if(proj.labels.length==0){
							proj = dadosExemplo;

							if(proj)
								proj.dadosExemplo=true;

						}

						//Como definir dinamicamente???
						$scope.chartOptions = {
								tooltipTemplate: $scope.info.tooltipTemplate ||  "<%=label + ': R$ '  +  Chart.moneyFormat(value) %>",
							
						}
						
						proj.colours =  [{
						    fillColor: "#3276b1",
						    strokeColor: "#3276b1",
						    highlightFill: "#3276b1",
						    highlightStroke: "#3276b1"
						}];
						
						$scope.proj  = proj;

					});

				}

				getDados();
				$scope.getDados = getDados;

			}

		}

	})

	.directive("componentVendasTabela",function(stService,stUtil,dateUtil){

		return {
			restrict:"E",
			templateUrl:"global/st-app/app-relatorio/template-module/component-vendas-tabela.html",
			scope:{
				de:"=",
				ate:"="
			},
			controller:function($scope){

				$scope.chartOptions = {
						tooltipTemplate: "<%=label + ': R$ '  +  Chart.moneyFormat(value) %>",
						type:'pie'  
				}


				$scope.$on("changePeriod",getDados);	

				//Quantidade de itens padrão
				$scope.quantItens = "30";

				function getDados(nomeProduto,quantItens){

					$scope.carregandoDados =true;

					var qs  = ["disable=0","quantidade>0"];

					qs.push(dateUtil.getQueryOfPeriod("date",$scope.de||new Date(),$scope.ate||new Date()));


					if(nomeProduto && nomeProduto.length>0)	
						qs.push("produto.nome like '%"+nomeProduto+"%'");

					qs.push("tipoEntrada=0");//Somente pedidos de Saída!!!

					var ops = {
							qs: qs,
							columns:"produto.nome,sum(quantidade),min(valorUnitario),max(valorUnitario),avg(valorUnitario)",
							objeto:"Pedido",
							groupBy:"produto.id",
							extra:"order by sum(quantidade) DESC",
							max:quantItens||30

					}

					stService.getProjecoes(ops).success(function(data){

						$scope.carregandoDados =false;
						$scope.projs = data.itens;

					}).error(function(){

						$scope.carregandoDados =false;
					});

				}	//FIm getDados()

				getDados();

				$scope.getDados = getDados;

			}
		}
	})

	//Lucro por período mensal
	.directive("componentLucroPeriodo",function(relatorioUtil,stUtil,stService,dateUtil,$filter){

		return {
			restrict:"E",
			templateUrl:"global/st-app/app-relatorio/template-module/chart-bar.html",
			scope:{
				de:"=",
				ate:"=",
				colours:"="
			},
			controller:function($scope){

				//Transform objeto proj em um array (Facilitar manipulação dos dados)	
				function projsToArray(projs){

					var array = [];
					for(var i in projs){

						array.push({data:dateUtil.getDate(projs[i][0]),valor:projs[i][1]});
					}

					return array;

				}

				function getProjByMonth(mes,ano,projs){

					for(var i in projs){

						if(projs[i].data.getMonth()==mes && projs[i].data.getFullYear()==ano)
							return projs[i];
					}

					return null;
				}

				//Faz o cáluclo receitas-despesas das projeções obtidas
				function getProjsBalanco(dataIni,dataFim,projReceitas,projDespesas){

					//Padronização dos dados
					dataIni = dateUtil.getDate(dataIni);
					dataFim = dateUtil.getDate(dataFim);
					projReceitas= projsToArray(projReceitas);
					projDespesas= projsToArray(projDespesas);

					var proj = {};
					var data = [];
					var labels = [];

					var soma = 0;
					for(dataIni;dataIni<=dataFim;dataIni = dateUtil.incrementaData(dataIni)){

						var obReceitas = getProjByMonth(dataIni.getMonth(),dataIni.getFullYear(),projReceitas) || {valor:0};
						var obDespesas = getProjByMonth(dataIni.getMonth(),dataIni.getFullYear(),projDespesas) || {valor:0};

						//Soma dos lucros para obtenção da média

						var balanco = obReceitas.valor - obDespesas.valor;

						soma+=balanco;

						data.push(balanco);
						labels.push($filter("date")(dataIni,'MMMM/yyyy'));

					}

					//Média de lucro
					proj.media = soma/data.length;
					proj.data= [data];//Necessário para funcionar em chart-bar
					proj.labels = labels;
					
					proj.colours =  [{
					    fillColor: "#3276b1",
					    strokeColor: "#3276b1",
					    highlightFill: "#3276b1",
					    highlightStroke: "#3276b1"
					}];

					return proj;

				}

				//Recupera os dados do backend	
				function getDados(){

					$scope.chartOptions = {
							tooltipTemplate: "<%=label + ': R$ '  +  Chart.moneyFormat(value) %>",
					}

					var basicQuerys  = ["disable=0","baixada=1","valor>0"];

					var basicInfo = {
							columns:"dataBaixa,sum(valor)",
							objeto:"Movimentacao",
							groupBy:"month(dataBaixa)",
							extra: " order by dataBaixa asc"

					}

					basicQuerys.push(dateUtil.getQueryOfPeriod("dataBaixa",$scope.de||new Date(),$scope.ate||new Date()));

					//Receitas (tipo=2)
					basicInfo.qs  = angular.copy(basicQuerys);
					basicInfo.qs.push("tipo=2");
					stService.getProjecoes(basicInfo).success(function(respReceitas){

						var projReceitas=respReceitas.itens;

						//Desepsas (tipo=1)
						basicInfo.qs  = angular.copy(basicQuerys);
						basicInfo.qs.push("tipo=1");
						stService.getProjecoes(basicInfo).success(function(respDespesas){

							var projDespesas=respDespesas.itens;
							var proj = getProjsBalanco($scope.de,$scope.ate,projReceitas,projDespesas)
							console.log("Projecoes");
							console.log(proj);


							$scope.proj = proj;

						})

					})

				}

				getDados();
				$scope.$on("changePeriod",getDados);	

			}
		}
	})


	//Component de balanco (Receitas, despesas,lucro operacional)
	.directive("componentBalanco",function(stService,$filter,dateUtil,movUtil){

		return{
			restrict:"E",
			templateUrl:"global/st-app/app-relatorio/template-module/component-balanco.html",
			scope:{

				de:"=",
				ate:"=",

			},

			controller:function($scope,movUtil){

				$scope.$on("changePeriod",getBalanco);
				
				//Período
				$scope.de = $scope.de || "1900-10-05";
				$scope.ate = $scope.ate || "3000-10-05";

				function getBalanco(){

					$scope.loading = true;
					movUtil.getBalanco($scope.de,$scope.ate,function(receitasRealizadas,despesasRealizadas,receitasPrevistas,despesasPrevistas){

						$scope.loading = false;
						$scope.receitasRealizadas= receitasRealizadas;
						$scope.despesasRealizadas = despesasRealizadas;
						$scope.receitasPrevistas = receitasPrevistas;
						$scope.despesasPrevistas = despesasPrevistas;
						$scope.lucroPrevisto = receitasPrevistas - despesasPrevistas;
						$scope.lucroRealizado = receitasRealizadas- despesasRealizadas;

						//Falta pagar e Falta receber
						$scope.faltaPagar = $scope.despesasPrevistas- $scope.despesasRealizadas;
						$scope.faltaReceber = $scope.receitasPrevistas - $scope.receitasRealizadas;


						if($scope.faltaPagar<0)
							$scope.faltaPagar = 0;

						if($scope.faltaReceber<0)
							$scope.faltaReceber = 0;

					});

				}

				getBalanco();

			}

		}

	})

	//Componente movimentações a prazo pagas no periodo
	.directive("componentAnterioresBaixadas",function(stService,$filter,dateUtil,stUtil,movUtil){

		return{
			restrict:"E",
			templateUrl:"global/st-app/app-relatorio/template-module/component-anteriores-baixadas.html",
			scope:{

				de:"=",
				ate:"=",

			},

			controller:function($scope){

				$scope.$on("changePeriod",getMovs);
				function getMovs(){

					var querys = [];
					querys.push("tipo=2");
					querys.push("data <'"+stUtil.formatData($scope.de||new Date())+"'");
					querys.push(dateUtil.getQueryOfPeriod("dataBaixa",$scope.de||new Date(),$scope.ate||new Date()));

					var ops = {
							qs : querys,	
							columns:"valor",
							groupBy:"id",
							objeto:"Movimentacao"

					};

					//Receitas
					ops.extra="tipo=2"
						stService.executeGet("/movimentacao/busca/map",{qs:querys,pagina:0,max:0,extra:''}).success(function(data){

							var total = 0;
							var itens = data.itens;
							if(data.itens.length>0){

								$scope.lancamentosAnteriores = data.itens;

								for(var i in itens){

									total+=itens[i].valor;

								}

								$scope.totalLancamentosAnteriores = total;

							}
							else{

								$scope.lancamentosAnteriores =null;
								$scope.totalLancamentosAnteriores = 0;

							}

						});

				}
				getMovs();

			}
		}
	})

})();

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

"use strict";
(function(){

	angular.module("adm")

	//Configurações do sistema
	.factory("configUtil",function($http, config, $uibModal,stService,$rootScope,stUtil,$localStorage){

		var _getConfig = function(callback){

				stService.getAll("config").success(function(data){
					$rootScope.config = data.itens[0];
					$localStorage.config = data.itens[0];
					callback($rootScope.config);
				});
			
		}

		//Altera deterinada configuração isoladamente
		var _setConfig = function(key,value,callback){

			var config = $rootScope.config;

			var confs = $rootScope.config.confs;

			confs[key] = value;

			config.confs = confs;

			stService.save("config",config).success(function(data){

				$rootScope.config=data.item;

				if(callback)
					callback(data.item)

			});

		}


		var _openConfig = function(tab, callback){

			$uibModal.open({
				animation: true,
				templateUrl:"global/st-app/app-config/template-module/config.html",
				size:'lg',
				controller:function($scope){

					$scope.activeTab = tab|| 0;

					//Módulos disponiveis
					$scope.modulos = [{nome:"Pessoas"},{nome:"Logística Reversa"},{nome:"Controle de Ponto"},{nome:"Estoque"},{nome:"Financeiro"},{nome:"Ferramentas"},{nome:"Relatorios"}];

					//Componentes de relatório
					$scope.itensRelatorio = [
					                         {label:"Balanço",value:"balanco"},
					                         {label:"Lançamentos anteriores baixados",value:"lancamentos_anteriores_baixados"},
					                         {label:"Lucro por período (Mensal)",value:"lucro_periodo_mensal"},
					                         {label:"Produtos mais vendidos",value:"produtos_mais_vendidos"},
					                         {label:"Faturamento por produto",value:"faturamento_por_produto"},
					                         {label:"Despesas por categoria",value:"despesas_por_categoria"}
					                         ];


					$scope.config = $rootScope.config;

					console.log("Config do rootScope: ");
					console.log($scope.config);

					//Garante que o id seja sempre=1
					$scope.config.id=1;

					//Módulos 
					var mds = $scope.modulos;

					//Módulos configurados para o usuário
					var mdsUser = [];


					//Relatórios configurados para o usuário
					var itensRelatorio = [];

					var itensRelatorioScope = $scope.itensRelatorio;

					if(!$scope.config.confs)
						$scope.config.confs = {};

					if($scope.config.confs.modulos)
						mdsUser = $scope.config.confs.modulos.split(",");

					if($scope.config.confs.itensRelatorio)
						itensRelatorio = $scope.config.confs.itensRelatorio.split(",");

					for(var i in mds){
						if(stUtil.buscaOb(mdsUser,mds[i].nome)!=-1)
							mds[i].selecionado=true;
					}

					for(var j in itensRelatorioScope){
						if(stUtil.buscaOb(itensRelatorio,itensRelatorioScope[j].value)!=-1)
							itensRelatorioScope[j].selecionado=true;
					}

					$scope.modulos = mds;
					$scope.itensRelatorio = itensRelatorioScope;

					$scope.salvar = function(){

						var conf = $scope.config;
						
						//Itens do relatório
						var its = $scope.itensRelatorio;
						var itensRelatorio = "";
						for(var j in its){

							if(its[j].selecionado==true)
								itensRelatorio+=its[j].value+",";
						}
						conf.confs.itensRelatorio = itensRelatorio;

						//Módulos
						var mds="";
						for(var i in $scope.modulos){

							if($scope.modulos[i].selecionado==true)
								mds+=$scope.modulos[i].nome+",";

						}
						conf.confs.modulos = mds;

						stService.save("config",conf).success(function(data){

							stUtil.showMessage("","Salvo com sucesso!","info");
							console.log("Config salvo: ");
							console.log(data.item);
							$rootScope.config=data.item;

						});

					}
					$scope.fechar = function(ele){

						ele.$dismiss('cancel');
						callback($scope.objeto);

					}

				}
			});
		};
		return {

			openConfig:_openConfig,
			getConfig: _getConfig,
			setConfig: _setConfig
		};

	})

})();

"use strict";
(function(){
	
	angular.module("adm")
	
	.directive('buttonOpenConfig', function(configUtil) {
		return {
			templateUrl:"global/st-app/app-config/template-module/button-config.html",
			
			scope:{
				activeTab:"=",
				label:"=",
				extraClass:"="
			},
			controller: function($scope){
				
				$scope.open = function(){
					
					configUtil.openConfig($scope.activeTab||0);
				}
			}
		}
	})	

})();

"use strict";
(function(){

	angular.module("adm") 

	//Filtro Complexo
	.directive("stFilterMap",function($compile, $filter, $rootScope){

		return {
			templateUrl:'global/st-app/st-filter-map/template-module/stFilterMap.html',
			restrict:"AE",
			scope:{

				filtros:"=",//Filtros do tipo String
				filterMapInstance:"=",
				querys:"=",//Querys para binds
				extra:"="//Query extra a ser aplicado no getLikeMap

			},
			controller:function($scope,stUtil){
				
				if(!$scope.extra)
					$scope.extra = "";

				//Alteração de querys Bindadas
				$scope.$watch('querys',function(value){

					$scope.aplicarFiltros(null,0,$rootScope.config.confs.maxItensPage||7,$scope.orderBy,$scope.orderType);

				});

				if($scope.filtros)
					$scope.infoBusca = $scope.filtros[0];

				//Atributos uteis
				$scope.dataHoje =  $filter("date")(new Date(),"dd/MM/yyyy");

				//Definição de valores padrão
				$scope.pagina=0;
				$scope.max = $rootScope.config.confs.maxItensPage||7
				$scope.qs=[];
				$scope.orderBy;
				$scope.ordem="DESC";
				$scope.objectFilter={};

				$scope.limparFiltros = function(){

					$scope.objectFilter = {};

				}

				$scope.atualizar = function(){

					$scope.aplicarFiltros(null,0,$scope.max);
				}

				$scope.changeInfoBusca = function(info){

					$scope.infoBusca = info;

				}

				//Busca Especial
				$scope.buscar = function(info){

					//$("#busca").blur();
					stUtil.disableFocus();
					var objectFilter ={};

					if(info)
						objectFilter[info.attr] = info.value;

					$scope.aplicarFiltros(objectFilter,0,$scope.max);

				}

				$scope.setPagina = function(pagina){

					$scope.pagina=pagina;
					$scope.$parent.getLikeMap($scope.qs,$scope.pagina,$scope.max,$scope.extra,$scope.orderBy,$scope.ordem);

				}

				$scope.aplicarFiltros = function(objectFilter,pagina,max,orderBy,ordem,interceptFilter){

					$scope.pagina=0;

					//Se for id, aplica-se as querys ignorando os outros valores
					if(objectFilter && objectFilter.id && objectFilter.id.length>0){

						//Aplica as Querys
						$scope.$parent.getLikeMap(["id = "+objectFilter.id],$scope.pagina,max,$scope.extra,orderBy,ordem);
						return;

					}

					var obs = {};

					for(var key in objectFilter){

						obs[key] = objectFilter[key];
					}

					//Reseta as querys anteriores
					$scope.qs = [];
					var query;
					for(var key in obs){

						query = "";

						if(typeof obs[key]=='string' && obs[key].match(/\d{2}\/\d{2}\/\d{4}/)){

							var dataDe = obs[key] || "01/01/0000";
							var dataAte = obs[key+'_ate'] || "01/01/3000";
							key =  key.replace(/_ate/g,"");
							query = key+" between '"+stUtil.formatData(dataDe)+"' and '"+stUtil.formatData(dataAte)+"'";
							delete  obs[key+'_ate'];

						}

						//Para Números
						else if( typeof obs[key]=='string' && obs[key].match(/[\d]+\.[\d]+$/)){

							var de;
							var ate;

							if( key.match(/[\w]+_ate/)){

								ate = obs[key];

							}
							else{

								de  = obs[key]; 
							}

							de = de || 0;
							ate = ate || 90000000000;
							key = key.replace(/_ate/g,"");
							query = key+" between "+de+" and "+ate;

						}
						else if(obs[key].toString().length>0){

							var valor=obs[key];
							var operador="";

							if(typeof valor=='string'){
								valor="'%"+valor+"%'";
								operador="like";
							}
							else if(valor==true){
								valor = 1;
								operador="=";
							}
							else if(valor==false){

								valor = 0;
								operador="=";
							}
							else{
								operador="=";
							}

							query = key+" "+operador+" "+valor;	

						}

						if(query.length>0)
							$scope.qs.push(query);

					}

					//Adiciona as querys bindadas (Se houver)
					if($scope.querys){
						$scope.qs = $scope.qs.concat($scope.querys);
					}

					if(!$scope.qs || $scope.qs.length==0)
						$scope.qs = [''];
					
					//Adciona filtros de data a $scope.qs

					if($scope.$parent.getLikeMap)   
						$scope.$parent.getLikeMap($scope.qs,0,max,$scope.extra,$scope.orderBy,$scope.orderType);

				}
			}

		}

	})
})();

"use strict";
(function(){
	angular.module("adm") 

	//Modal em forma de diretiva
	.directive("stTable",function($filter,stService,$q ,$stDetalhe, $timeout, $rootScope,pessoaUtil,$location,$route){
		return {

			templateUrl:'global/st-app/st-table/template-module/stTable.html'
				,
				restrict:"AE",

				scope:{

					filterIntercept:"=",
					labels:"=",//Títulos presentes na tabela de objetos(Origatório) - array de objetos [{attr,label}]
					title:"=",//Título da lista de objetos  - String
					attrUnique:"=",
					reqs:"=",//Atributos obrigatórios no cadastro de itens
					nextLink:"=",//Link para direcionar ao Cadastrar ou salvar no novo objeto
					objetos:"=",
					noCrud:"=",
					tabs:"=",
					teste:"=",
					rightTab:"=",
					cacheOps:"=",
					cadLabel:"=",
					filtros:"=",
					buscaEspecial:"=",
					detalheLink:"=",
					customActions:"=",
					noSave:"=",//se true, o botão salvar não é incluido	  
					htmlActionsPos:"=",
					detalheLink:"=",
					labelPivo:"=",
					tipoObjeto:"=",//Tipo de movimentação padrão no sistema 1 = Despesas, 2 = Receitas
					icon: "@"
				},


				link:function($scope){
					
					//Navegacao atual
					$rootScope.atualPage = $scope.title;

					//Ação padrão para rightTab
					if($scope.rightTab){

						if($scope.rightTab.tipo=='monthPicker'){
							$scope.rightTab.value=new Date();
						}


					}


					//Caso filtros não estejam definidos, assume-se filtros=label 	
					if(!$scope.filtros)
						$scope.filtros=$scope.labels;

					if(!$scope.title)
						$scope.title="Lista";

					if(!$scope.reqs)
						$scope.reqs=transformLabelsToReqs($scope.labels);

					if(!$scope.nextLink)
						$scope.nextLink=null;

					$scope.objeto={};
					$scope.objectFilter={};


					//Ações customizadas
					$scope.executeCustomAction = function(action,ob){

						if(!action.call)
							return;

						$scope.$parent[action.call](ob,function(data){

							ob=data;
							$timeout(function(){

								$scope.getLikeMap([],0,0,"");  

							},500);

						});	
					}

					//Funções definidas para o Label da Tabela
					$scope.bindFunction =function(funcao,ob){

						if(!funcao)
							return;

						$scope.$parent[funcao.call](ob,function(data){

							ob=data;
							$timeout(function(){

								$scope.getLikeMap([],0,0,"");  

							},500);
						});
					}


					//Cadastro de novo item
					$scope.cadItem = function(){

						var objeto = {
								tipo_pessoa:$location.$$path.replace("/","")
						}

						pessoaUtil.openDetalhePessoa(objeto,0,function(){

							console.log("Objeto: ");
							console.log(objeto);
							
							$route.reload();

						});

					}

					$scope.openDetalhe =function(objeto,tab){

						//Abre o detalhe de acordo com o tipo de objeto
						if($scope.tipoObjeto=='pessoa'){
							pessoaUtil.openDetalhePessoa(objeto,tab,function(){


							});
						}

					}

					$scope.deletarItem = function(ob,index){


						$scope.disableObject(ob,function(){

							$scope.objetos.splice(index,1);
						});
					}

					//Tab do lado direiro
					$scope.executeRightTabClick = function(tab){

						if(!tab)
							return;

						$scope.pagina =0;

						var operador = tab.operador||"=";

						if(tab.tipo=='monthPicker'){

							var mes = $filter("date")(tab.value,"MM");
							var ano = $filter("date")(tab.value,"yyyy");
							$scope.rightQuery ="month("+tab.attr+") "+operador+" '"+mes+"' and year("+tab.attr+") "+operador+" '"+ano+"'";
							$scope.getLikeMap([],0,0,"");

						}
					}

					//Executa uma query fixa
					var  _executeFixTabQuery =  function(tab){

						console.log("Pagina ="+$scope.pagina);

						obAppend = tab.objectAppend;

						//Valores pre definidos ao salvar o objeto
						$scope.objectAppend = obAppend;

						//Criar as querys

						var qs = [];

						for(var attr in obAppend){

							var valor = obAppend[attr];

							if(typeof valor== 'string' || typeof valor== 'date')
								valor="'"+valor+"'";

							qs.push(attr+"="+valor);
						}

						$scope.fixQuerys = qs;
						$scope.activeTab = tab;
						console.log("Tab:");
						console.log($scope.activeTab);
						$scope.pagina=0;
						$scope.getLikeMap(qs,0,0,"");

					}

					$scope.executeFixTabQuery =  _executeFixTabQuery;

					if($scope.tabs){
						_executeFixTabQuery($scope.tabs[0]);
					}

					function transformLabelsToReqs(labels){

						var lista =[];

						for(var i in labels)
							lista.push(labels[i].attr);

						return lista;

					}

					$scope.executeRightTabClick($scope.rightTab);

				}
				,

				controller:'stControl',

		}

	}).directive('optionsTable',function(){

		return{
			templateUrl:'view/templates/st-table/optionsTable.html',
			scope:{
				ob:"="
			}
		}

	});

})();

"use strict";
(function(){

	angular.module("adm") 

	.directive('autoCompleteObject', function(stService,$compile,$filter,$log,stUtil,$uibModal,$timeout,$modalStack,cacheGet) {
		return {
			restrict: 'AE',
			require:'ngModel',

			scope:{

				objectOp:"=",//Objeto em caso de chave/valor
				onDemand:"=",
				getCompleteObject:"=",
				label:"=",
				placeHolder:"=",//placeholder de busca
				labelCad:"=",
				placeHolderCad:"=",//place holder de cadastro
				ngModel:"=",
				defaulText:"=",
				initialBusca:"=",//String a ser setada no campo de busca (input)
				extraClass:"=",//Classe css para ser adicionada ao elemento 'input'
				fixProperties:"=",//Propriedades fixas do objeto, usada tanto para cadastros tanto para buscas
				valueOnly:"=",//se true, não seta o objeto inteiro no model, apenas o valor(labels)
				itens:"=",//Itens locais, se houver, as buscas serão efetuadas a partir deles
				subLabel:"=",//Informações adicionais a serem exibidas	e buscadas,
				showSubLabel:"=",
				hideResults:"=",//Esconde os resultados da busca
				autoFocus:"=",//Focus para o elemento input
				showResultsOnFocus:"=",
				idInput:"=",
				resultadoBusca:"=",//Bind para resultados da busca
				useCache:"=",//cacheGet
				autoShowBusca:"="//Mostra a tela de busca automaticamente
			},

			templateUrl:"global/st-app/app-autocomplete/template-module/autoCompleteObject.html",

			link: function($scope, element, attrs,ctrl){

				$scope.$watch('ngModel',function(value){

					if(!value){
						$scope.labelValue="";
					}
				});

				var fix = $scope.fixProperties||[];

				var querys = [];

				for(var key in fix){

					querys.push(key+"='"+fix[key]+"'");
				}

				var nomeObjeto = $scope.objectOp;

				var label = $scope.label;
				var labelCad = $scope.labelCad;
				var onDemand = $scope.onDemand;
				var placeHolder= $scope.placeHolder ||'Digite um valor';
				var lastKeyUp = 0;



				if(!attrs.inline || attrs.inline=='false')	{
					element.bind("click",function(){
						$scope.openBusca();
					});

				}


				$timeout(function(){

					if(!ctrl.$viewValue)
						return;

					var value;

					if($scope.valueOnly){
						value = ctrl.$viewValue;	
					}
					else{
						value = ctrl.$viewValue[label] || ctrl.$viewValue || 'Selecione uma opção';
					}

					$scope.modelValue = value;

				},0);


				function getModelValue(){

					return $scope.modelValue;
				}

				function getInitialBusca(){

					return $scope.initialBusca;
				}
				
			

				function getItens(){

					return $scope.itens;
				}

				function setModelValue(item){
					$scope.modelValue = item[label]||item;
				}

				//Busca de itens
				function buscarItem(valueLabel,callback){

					valueLabel = valueLabel||'';
					$scope.aba = "resultados";

					//Sem Cache (Busca remota)	
					//!$scope.useCache || $scope.useCache==false
					if(!$scope.useCache || $scope.useCache==false)	{

						var query = label+" like '%"+valueLabel+"%'";
						var qs = [];
						qs = qs.concat(querys);
						qs.push(query);
						var objeto = $scope.objectOp;
						objeto = objeto[0].toUpperCase() + objeto.slice(1);
						var subLabel="";
						if($scope.subLabel){

							subLabel =","+$scope.subLabel.attr;

						}

						var ops = {
								qs : qs,	
								columns:"id,"+$scope.label+subLabel||"*",
								groupBy:"id",
								objeto:objeto
						};

						$scope.loadingBusca=true;

						stService.getProjecoes(ops).success(function(data){

							$scope.loadingBusca=false;
							callback(data.itens);

						}).error(function(){

							$scope.loadingBusca=false;
							$scope.messageResult="Ocorreu um erro, tente novamente.";
						});

					} //Fim de !getItens()

					//Busca em cache
					else{

						var ini = new Date();
						var itens = cacheGet.get($scope.objectOp,label,valueLabel);
						itens = jlinq.from(itens)
						.starts(label,valueLabel)
						.select();
						
						var its = [];

						for(var i in itens){

							its.push([itens[i].id,itens[i][label]]);
						}

						callback(its);

					}

				}

			
				function selecionarItem (item){

					if($scope.getCompleteObject==true){
						stService.getById(nomeObjeto,item[0]).success(function(data){

							setValueItem(data.item);
						});
					}
					else{
						var ob = {};
						ob.id = item[0];
						ob[label]=item[1];
						setValueItem(ob);

					}

				}

				function setValueItem(objetoSele){

					var viewValue;

					if($scope.valueOnly==true){
						viewValue = objetoSele[label];	
					}
					else{
						viewValue = objetoSele;
					}

					$scope.modelValue = objetoSele[label];
					setModelValue(objetoSele);
					ctrl.$setViewValue(viewValue);
					$scope.focusBusca =false;
					$scope.labelValue = objetoSele[label];
					$scope.obs =null;
					$scope.aba ="resultados";

				}

				$scope.editarItem = function(){

				}

				$scope.buscarItem = function(labelValue){

					var d = new Date();
					var execute =false;

					if(d.getTime()-lastKeyUp<300){

						lastKeyUp = d.getTime();
						execute = true;
						$timeout(function(){

							if(execute==true)
								executeBuscarItens(labelValue);


						},300);

						return;
					}
					else{

						lastKeyUp = d.getTime();
						executeBuscarItens(labelValue);

					}

				}

				function executeBuscarItens(labelValue){

					buscarItem(labelValue,function(itens){

						if(itens.length==0)
							$scope.messageResult = "Não encontrado '"+labelValue+"'.";
						else
							$scope.messageResult="";

						$scope.obs = itens;
						$scope.resultadoBusca = itens;
					});

				}

				$scope.cadItem = function(value, allFilials){

					cadItem(value,allFilials);

				}
				$scope.selecionarItem = selecionarItem;

				$scope.alterarAba =function(aba){

					$scope.aba = aba;
				}
				

				//Abre o modal de busca
				$scope.openBusca = function(){

					$uibModal.open({
						animation: true,
						templateUrl:"global/st-app/app-autocomplete/template-module/buscaAutoCompleteObject.html",
						size:"lg",
						controller:function($scope, $modalInstance){

							$scope.label = label;
							$scope.labelCad = labelCad;
							$scope.placeHolder=placeHolder;
							$scope.modelValue = getModelValue();
							$scope.initialBusca = getInitialBusca();
							$scope.focusBusca=true;
							
							console.log("initialBusca: "+getInitialBusca());
							
							
							$scope.inputFocus = function(labelValue){

								if($scope.showResultsOnFocus==true)	
									$scope.buscarItem(labelValue);
							}

							$scope.selecionarItem = function(item, modal){

								selecionarItem(item);
								
								$modalInstance.close();

							}

							$scope.cadItem = function(value, allFilials){
								
								
								$scope.salvandoItem = true;

								var ob = {};
								ob[label]= value;

								//Atributos pre-definidos
								for(var k in fix){
									ob[k] = fix[k];	
								}

								//auxItemFilial
								ob["allFilials"]=allFilials;

								var query = label+" = '"+ob[label]+"'";
								var qs = [];
								qs.push(query);
								qs = qs.concat(querys);
								
								console.log("salvandoItem: "+$scope.salvandoItem);

								stService.getLikeMap(nomeObjeto,qs,0,0,"").success(function(data){

									if(data.itens.length>0){
										stUtil.showMessage("","Já existe um registro com '"+ob[label]+"' cadastrado no sistema","danger");
										$scope.salvandoItem = false;
										return;
									}
									else {

										stService.save(nomeObjeto,ob).success(function(data){

											var objeto=[data.item.id,data.item[label]];
											selecionarItem(objeto);
											value="";
											$scope.salvandoItem = false;
											stUtil.showMessage("","'"+ob[label]+"' cadastrado com sucesso!","info");
											$modalInstance.close();
										}).error(function(){

											stUtil.showMessage("","Ocorreu um erro, verifique sua conexão com a internet.","danger");
											$scope.salvandoItem = false;
											$modalInstance.close();
										});
									}

								}).error(function(){

									stUtil.showMessage("","Ocorreu um erro, verifique sua conexão com a internet.","danger");
									$scope.salvandoItem = false;
								});

							
							
							}

							$scope.alterarAba =function(aba){

								$scope.aba = aba;
							}

							$scope.buscarItem = function(valueLabel){
								
								$scope.loadingBusca=true;

								buscarItem(valueLabel,function(itens){

									$scope.loadingBusca=false;

									if(itens.length==0)
										$scope.messageResult = "Não encontrado '"+valueLabel+"'.";
									else
										$scope.messageResult="";
									
									$scope.obs = itens;
								});

							}

							
							//Busca Inicial
							if($scope.initialBusca !=undefined ){

								$scope.buscarItem($scope.initialBusca );
							}

							$scope.fecharModal = function(ele){

								ele.$dismiss("cancel");
							}
						}
					});

				}
				
				if($scope.autoShowBusca==true)
					$scope.openBusca();

				querys = querys.filter(function(value){

					if(value.length>0)
						return value;

				});

			}

		}

	})


})();

"use strict";
(function(){

	angular.module("adm") 

	.directive('modalContent', function($templateCache) {
		return {
			//templateUrl:'global/st-app/st-modal/template-module/modalContent.html',
			templateUrl:'global/st-app/st-modal/template-module/modalContent.html',
			restrict:"E",
			transclude:true,
			scope:{

				titulo: "=",
				iconeTitulo: "=",
				modalInstance: "=",
				labelCloseButton: "=",
				disableOkButton:"=",
				loadingOkAction:"=",
				okAction:"=",
				okActionLabel:"=",
				forceOkActionShowLabel:"=",//se true força a exibição do label presente no okAcion
				okActionIcon:"=",
				cancelAction:"=",
				deleteAction:"=",
				item: "="//Objeto referencia, ex: pdv

			},
			controller:function($scope, $timeout){
				
				
				$scope.disableOkButton = $scope.disableOkButton || false;
				
				$scope.currentStep = 0;

				$scope.cancelAction  =  $scope.cancelAction || function(){

					if($scope.modalInstance)
						$scope.modalInstance.$dismiss("cancel");
				}
				
				
			
		        
		        $scope.localAction = function(){
		        	
		        	console.log("localAction");
		        }
				

			}

		};
	})

	//Modal em forma de diretiva
	.directive("stModal",function($filter){

		return {

			templateUrl:"global/st-app/st-modal/template-module/stModal.html",
			restrict:"AE",
			transclude:true,
			scope:{

				titulo:"@",
				icon:"@",
				idmodal:"@",
				size:"@",
				okIcon:"@",
				okLabel:"@"

			},

			link: function($scope, element, attrs) {

			}

		}

	})

})();

"use strict";
(function(){
	angular.module("adm") 

	//Modal em forma de serviço
	.factory("$stModal",function($uibModal){
		var _showAlert = function(modal){

			$uibModal.open({
				animation: true,
				template:"global/st-app/st-modal/template-module/modalAlert.html",
				controller:function($scope,modal){

					$scope.modal = modal;
					$scope.close = function(){

						modal.dismiss('cancel');
					}

				},
			
			size: 100,

			});

		}

		return {
			showAlert: _showAlert,

		};

	});

})();

"use strict";
(function(){

	angular.module("adm") 

	.directive('stNav',function($timeout){

		return{
			restrict:"E",
			templateUrl:'global/st-app/st-nav/template-module/stNav.html',
			scope:{

				activeTab:"=",
				tabs:"="
			},

			controller:function($scope){

				if(!$scope.activeTab)
					$scope.activeTab=0;

				$scope.alterarTab =function (tab){

					$scope.activeTab = tab;

				}

			}
		}
	})

})();

"use strict";

(function(){

	angular.module("adm")

	.directive("stCheckbox",function(movUtil){

		return{
			templateUrl:'global/st-app/st-checkbox/template-module/stCheckbox.html',
			scope:{
				ngModel:"=",
				label:"=",
				cofirmacao:"="
			},
			
		}

	})

})();


"use strict";

(function(){

	angular.module("adm")

	//Diretiva para lista de movimentações
	.directive('cardList', function (){
		return {
			restrict: 'E',
			transclude:true,
			scope:{

				ob:"=",
				pivo:"=",
				editFunction:"=",
				deleteFunction:"=",
				index:"@",
				icon:"@"
				
			},

			templateUrl:'global/st-app/card-list/template-module/cardListDirective.html',
			bindToController:true,
			controllerAs:"vm",
			controller: "cardListController"
		}
	})

})();


"use strict";
(function(){
	angular.module("adm") 

	.controller("cardListController",function(stUtil){

		var vm = this;
	
		console.log("pivo: "+vm.pivo);
		console.log("ob:");
		console.log(vm.ob);
		vm.labelPivo = stUtil.getValueOfNivel(vm.ob,vm.pivo);
		

	})

})();


"use strict";
(function(){
angular.module("adm").config(function($routeProvider, $httpProvider){

	//Inicio
	$routeProvider.when("/prot/:template",{

		templateUrl:"global/st-app/app-prototype/template-route/prototype.html",

		controller: function($scope, $rootScope, $route, stService, $localStorage, $http, loginUtil){
			
			loginUtil.logar({usuario:$localStorage.usuario,empresa:$localStorage.empresa, senha:$localStorage.senha}, true, function(){
				
				$scope.showTemplate=true;
				
				var prot = $route.current.params.template;

				var urlBase = "global/st-app/app-prototype/prots/"+prot+"/";

				var versions = [];

				for(var i =1; i <=10 ;i++){

					versions.push({id: i,  label:"Versão "+i,template:urlBase+i+".html"});

				}

				$localStorage.activeVersion = $localStorage["prot_"+prot]|| versions[0];

				$scope.activeVersion =  $localStorage.activeVersion;

				$scope.changeActiveVersion = function(v){

					$scope.activeVersion = v;
					$localStorage["prot_"+prot] =  v;
				}

				$scope.funcao = function(){

					console.log("!!!!!!!!!!!!!!!!!!!!!!!!");
				}

				$scope.vs = versions;

				angular.forEach($scope.vs, function(v){
					// Here, the lang object will represent the lang you called the request on for the scope of the function
					$http.get(v.template).success(function(){

						v.enable=true;
						console.log("Erro em: "+v.template);

					});
				});
				
			});

		

		}


	}); 

})
})();


"use strict";
(function(){
	angular.module("adm") 

	//Modal em forma de diretiva
	.directive("testUserButton",function(stService, $uibModal, stUtil){
		return {

			restrict:"AE",
			templateUrl:"global/st-app/test-user/template-module/testUserButton.html",
			link:function($rootScope, element, attrs){


				var _openDetalhe = function(){

					$rootScope.testIsOpen=true;

					modal = $uibModal.open({
						animation: true,
						templateUrl:"global/st-app/test-user/template-module/testUserDetalhe.html",
						size:'lg',
						controller: function($scope, $rootScope,  $modalInstance, chronoService, $timeout){


							$scope.$on("modal.closing", function(){

								$rootScope.testIsOpen = false;

							}); 


							var  _getProxTest = function(){

								$scope.carregandoTest = true;
								stService.executeGet("testuser/prox-test").success(function(data){

									
									$rootScope.definition = data.item;
									if(data.item!=null)
									   $("#descricao-teste").html(data.item.descricao);
									$scope.carregandoTest = false;
									
									stService.executeGet("/testuser/saldo-for-user").success(function(data){

										$rootScope.saldoTestes = data.item || 0;

										stService.executeGet("/testuser/total-tests-for-user").success(function(data){

											$rootScope.quantTests = data.item || 0;

										});

									});



								}).error(function(){
									
									$scope.carregandoTest = false;
									stUsilt.showMessage("","ocorreu um erro ao recuperar informações do teste, tente novamente");
									$modalInstance.close();
									
									
								});

							}
							
							$scope.getProxTest =  _getProxTest;
							
							$timeout(_getProxTest, 300);

							$rootScope.voltar = function(){

								$modalInstance.close();
								$rootScope.testIsOpen = false;
							}

							$rootScope.iniciarTeste = function(){

								$rootScope.iniTeste = new Date().getTime();
								$modalInstance.close();
								$rootScope.executandoTeste=true;
								$rootScope.testIsOpen = false;
								chronoService.addTimer('myTimer', { interval: 500 });
								chronoService.start();
								stUtil.showMessage("","O teste foi iniciado!","info");
							}

							$rootScope.finalizarTeste = function(comentario, erroSistema){

								var teste = {};
								teste.definition = $rootScope.definition;
								teste.comentario = comentario;
								teste.tempoGasto =  new Date().getTime() - $rootScope.iniTeste || 0;
								teste.erroSistema = erroSistema;

							

								if($rootScope.definition.queryVerification && $rootScope.definition.queryVerification!=null)
								{

									stService.executeGet("projecao/execute-query", {query:$rootScope.definition.queryVerification}).success(function(data){

									

										if(data.itens.length>0 || erroSistema==1){

											_openDetalheFeedBack(teste);
										}

										else{

											stUtil.showMessage("","Você não executou o teste corretamente, tente novamente ou descreva o erro nos","danger");
										}

									});



								}

								else{
									_openDetalheFeedBack(teste);
								}

							}

							
							
							var _openDetalheFeedBack = function(test){
								
								 $uibModal.open({
										animation: true,
										templateUrl:"global/st-app/test-user/template-module/testeUserResposta.html",
										size:'lg',
										controller: function($scope, $modalInstance){
											  
												$scope.test = test;	
												$scope.salvar  = function(){
													
													if(!$scope.test.nivelDificuldadeFromUser){
														stUtil.showMessage("","Escolha uma opção","danger");
														
														return;
											   }
		
													stService.executePost("testuser/add/", $scope.test).success(function(){
		
														stUtil.showMessage("","Teste executado com sucesso!","info");
														$modalInstance.close();

														$rootScope.executandoTeste=false;

														$rootScope.testIsOpen = false;

														_getProxTest();
														
		
													});
													
												}
									}
								}); 
											
							}



						}

					});

				}

				element.bind("click",function(){

					_openDetalhe();
				});

			}
		}

	})
})();

"use strict";
(function(){
angular.module("adm").config(function($routeProvider, $httpProvider){

	//Lista de todas a movimentações
	$routeProvider.when("/testdefinition",{

		templateUrl:"global/st-app/test-user/template-route/testDefinition.html",
		controller: function($scope, stService, stUtil, $uibModal){
			  
			$scope.openDetalhe = function(definition){
				
				var modal = $uibModal.open({
					animation: true,
					templateUrl:"global/st-app/test-user/template-module/detalheTestDefinition.html",
					size:'lg',
					controller: function($scope, $modalInstance){
						
						$scope.definition = definition || {};
						$scope.salvar = function(){
							
							stService.executePost("testdefinition/add/",$scope.definition).success(function(){
								
								 $modalInstance.close();
								
							});
						}
						
					}
					
				});
			}
			
		}
	
	}); 

})
})();


"use strict";
(function(){

	angular.module("adm") 

	.factory('tutorialUtil', function($rootScope,$filter, stUtil, $uibModal){

		var _openDetalheTutorial = function(tutorialItem){

			$uibModal.open({
				animation: true,
				templateUrl:"global/st-app/st-tutorial/template-module/detalheTutorial.html",
				size:'lg',
				controllerAs:"vm",
				bindToController:true,
				controller:function($scope, deviceDetector){

					var vm = this;
					vm.tutorial = tutorialItem;

					if(deviceDetector.isMobile()==true){
                          vm.linkTutorial  =  tutorialItem.linkMobile;
					}
					else{
						vm.linkTutorial  =  tutorialItem.linkDesktop;
					}
					
					var youtubePlayer;

					vm.playerVars = {
							modestbranding:1,
							rel:0,
							start: 30,
							end: 39
					};

					$scope.$on('youtube.player.ready', function ($event, player) {

						youtubePlayer = player;
						youtubePlayer.playVideo();

					});


				}
			});


		}

		return {

			openDetalheTutorial:  _openDetalheTutorial

		}

	})

})();

"use strict";

(function(){

	angular.module("adm")

	//Diretiva para lista de movimentações
	.directive('buttonTutorial', function ($uibModal, tutorialUtil){
		return {
			restrict: 'AE',
			
			link: function(scope, element, attrs) {
			
				element.bind('click', function(){
					
					$uibModal.open({
						animation: true,
						templateUrl:"global/st-app/st-tutorial/template-module/tutorialList.html",
						size:'lg',
						controllerAs:"vm",
						bindToController:true,
						controller:function($scope){
							
							var vm = this;
							vm.tutoriais = [
							    {
								  titulo: "Vendas",
								  descricao:"Como realizar uma venda, listagem de vendas",
								  linkMobile:"https://www.youtube.com/watch?v=sOdiWXFF9Ms",
								  linkDesktop:"https://www.youtube.com/watch?v=93RTB0PXAU0&feature=youtu.be"
							   },
							   {
									  titulo: "Estoque",
									  descricao:"Cadastro e listagem de produtos",
									  linkMobile:"",
									  linkDesktop:""
								   }      
							 ];
							
							vm.openTutorial = function(item){
								
								tutorialUtil.openDetalheTutorial(item);
							}
							
						}
					});
					
				});
			}
		}
	})

})();


"use strict";
(function(){

	angular.module("adm")

	.factory("onboardUtil",function($uibModal, $rootScope){

		var _openOnboardIntro = function(){
			
			var confs = $rootScope.config.confs;
			
			if(confs.visualizouOnboardIntro!='true'){
			
				$uibModal.open({
					animation: true,
					templateUrl:"global/st-app/onboarding/template-module/onboardIntro.html",
					size:'lg',
					controllerAs:"vm",
					bindToController:"true",
					controller:"onboardIntroController"
					
				});
		}

		};

	
		return {

			openOnboardIntro:_openOnboardIntro
		};

	})

})();
"use strict";
(function(){
	angular.module("adm") 

	.controller("onboardIntroController",function($rootScope, $modalInstance, estoqueUtil, $location,  $uibModal, configUtil, leadUtil){
		
		var vm = this;
		vm.proj = {data:[[100]], labels:[""]};
		vm.proj.colours =  [{
		    fillColor: "#3276b1",
		    strokeColor: "#3276b1",
		    highlightFill: "#3276b1",
		    highlightStroke: "#3276b1"
		}];

		vm.step = 1;
		vm.labelButton="Próximo";
		
		vm.toInicio = function(){
			 $modalInstance.close();
			$location.path("/inicio");
		}
		
		vm.nextStep = function(){
			
			if(vm.step==2){
				configUtil.setConfig("visualizouOnboardIntro","true");
				leadUtil.addSubsMetric("onboard_intro", 1);
				vm.labelButton="Cadastrar  produto";
				vm.showButtonCadastrarProdutoDepois = true;
			}
			
			if(vm.step==3){
				$modalInstance.close();
				estoqueUtil.cadProdutoStep({}, function(produto){
					console.log("Produto cadastrado: ");
					console.log(produto);
					 $uibModal.open({
							animation: true,
							templateUrl:"global/st-app/app-estoque/template-module/sucessoProduto.html",
							size:'lg',
							controller: function($scope){
								
								$scope.toProdutos = function(){
									$location.path("/produto");
								}
							}
					 });
					
					//$location.path("/produto");
				});
			}
			
			vm.step++;
			
		}
	
	})

})();
