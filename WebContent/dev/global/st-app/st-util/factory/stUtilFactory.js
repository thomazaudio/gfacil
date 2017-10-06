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
		
		
		var _leadEvt  = function(descricao){

			var usuario =  $cookieStore.get("usuarioSistema");

			stService.executeGet("/lead/add-action-by-tel",{tel:usuario.login, action: descricao }).success(function(){

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
