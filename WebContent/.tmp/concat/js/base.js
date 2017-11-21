"use strict";
(function(){
var app;
try{
 app  = angular.module("adm",["angular-growl","angularSpinner","ngRoute","ds.clock","FBAngular","ng-mfb","ngCookies","angular.filter","ngStorage","ngAudio","ngDraggable","ui.bootstrap","ui.transition","angular-confirm","ngMessages","chart.js","youtube-embed","ui.utils.masks","angular-json-tree","ngAnimate","ngSanitize", "textAngular","angular-chrono","ui.checkbox","ng.deviceDetector","ngOnboarding"]);
}catch(e){
	window.alert(e);
}
app.run(['$rootScope', '$route','$modalStack','$localStorage','$location','st','$filter', function($rootScope, $route,$modalStack, $localStorage,$location,st,$filter) {
	
	
	try{
		
		//
  
	if('serviceWorker' in navigator) {
		  navigator.serviceWorker
		           .register('service-worker.js')
		           .then(function() { console.log("Service r Registered"); });
		}
	
	
	//Desabiliar zoom (Necessário para safari)
	document.documentElement.addEventListener('gesturestart', function (event) {
	    event.preventDefault();      
	}, false);
	

	//Configuração da lib de Chart
	Chart.moneyFormat= function(value) {
		return $filter('number')(value,2);
	}

    //Evento para contabilizar o tempo de carregamento do sistema
    var tempoCarregamento = (new Date().getTime()-window.inicioCarregamento)/1000;
	st.evt({evento:"tempo_carregamento_sistema",descricao:tempoCarregamento});
	
    $rootScope.$on('$routeChangeStart', function(event, next, current) { 
    	
    	if(!next.$$route){
    		$location.path("/login");
    	}
    	
    	//Caso o usuário não esteja logado, é direcionado para página de login
    	else if(!$rootScope.usuarioSistema && (!next.$$route || next.$$route.originalPath.indexOf("/login/:login")==-1) && next.$$route.originalPath.indexOf("/cadastro/:login")==-1 && next.$$route.originalPath.indexOf("/teste")==-1 && next.$$route.originalPath.indexOf("/prot/:template")==-1){
    		console.log("Não existe usuário logado no sistema");
    		$location.path("/login");
    	}
    	
    	
    	//Google analytics
    	if(next.templateUrl) {
            // interagindo com o Analytics através do objeto global ga
            ga('send', 'pageview', { page: next.templateUrl });
        }
    	
    	//Define se irá chamar event.preventDefault()
    	var preventDefault = false;
    	
    	
    	//Caso o menu mobile esteja visivel, é fechado
    	if($("#nav-header")[0] && $("#nav-header")[0].className.indexOf("open")!=-1){
    		$("#nav-header").removeClass("open");
    	}
        
    	//Caso tenha backdrop aberto, este é removido
    	$(".modal-backdrop").remove();
    	
    	var isModalOpen = function(){
    		
    		var modals = $(".modal");
    		   		
    		for(var i in modals){
    			
    			if(modals[i].className=='modal in'){
    				
    				//Caso no-change-path seja definida no modal como 'true', no fechamento não ocorre a mudança de path
    				if(modals[i].getAttribute('no-change-path')=='true');
    				  preventDefault =true;
    				  
    				return true;
    			}
    		}
    		return false;
    	}
    	
    	if(isModalOpen()){
    		  $(".modal").modal('hide');
    	 }

    	var top = $modalStack.getTop();
    	
         if (top) {
             $modalStack.dismiss(top.key);
         }
         
         
         if(preventDefault==true)
            event.preventDefault();
           
     });
    
	}catch(e){
		window.alert("O CeasaPlus não é compatível com seu navegador!\n"+e);
		console.log(e);
	}
}]);
 
})();


"use strict";
(function(){
angular.module("adm").config(function($routeProvider,$httpProvider){

	//Teste de pagamento
	$routeProvider.when("/teste-pagamento",{

		templateUrl:"view/inicio.html",
		controller:function($scope,stService){

			var items = [{'title':'Mensalidade Albar','quantity':1,'currency_id':'BRL','unit_price':150.0}];

			var payer = {name:'Silvio',email:'thomaz-guitar@hotmail.com'};

			var data = {items:items,payer:payer};

			stService.executePost("pagamento/lancar/",data).success(function(){


			});
		}


	}); 

	//Rota para protótipos
	//ao especificar o endereço do template deve-se trocar '/' por '@'
	$routeProvider.when("/prot/:template",{

		templateUrl:"view/prot.html",
		controller:function($scope,template){

			$scope.template = template;
		},
		resolve:{

			template: function($route){

				var template = $route.current.params.template;

				template = "/" +template;

				if(template.indexOf("view")==-1)
					template = "view/"+template;

				if(template.indexOf(".html")==-1)
					template +=".html";

				template = template.replace("//","/");


				return template =template.replace("@","/");
			}
		}

	});

	$routeProvider.when("/checklist",{

		templateUrl:"view/ferramentas/checklist.html",
		controller:"stControl"
	}); 

	$routeProvider.when("/pdvsimples/add",{

		templateUrl:"view/pdv/pdv-simples.html",
		controller:'pdvSimplesController',
		resolve:{

			pdv:function(){
				return{}
			}
		}

	}); 

	$routeProvider.when("/pdvsimples/:id",{

		templateUrl:"view/pdv/pdv-simples.html",
		controller:'pdvSimplesController',
		resolve:{

			pdv:function($route,stService){

				return stService.getById("pdv",$route.current.params.id);
			}
		}

	}); 

	$routeProvider.when("/teste",{

		templateUrl:"view/teste.html",
		controller:"testeController",


	}); 

	$routeProvider.when("/financeiro/nota-promissoria",{

		templateUrl:"view/financeiro/nota-promissoria/template.html",

	}); 

	$routeProvider.when("/formaPagamento",{

		templateUrl:"view/financeiro/listaFormaPagamento.html",
		controller: "genericController",	

	}); 

	$routeProvider.when("/caixa",{

		templateUrl:"view/caixa/caixa.html",
		controller: "caixaController",

		resolve:{

			caixa: function(caixaService){

				return caixaService.getCaixa();
			}
		}

	}); 


	$routeProvider.when("/movimentacaocaixa",{

		templateUrl:"view/caixa/movimentacoes.html",

	}); 


	$routeProvider.when("/eventousuario",{

		templateUrl:"view/eventousuario/listaEventos.html",
		controller: "stControl"

	});


	/* ATUALIZAÇÃO DE ESTOQUE ANTIGA
   $routeProvider.when("/atualiza-estoque",{
		templateUrl:"view/produto/atualizaEstoque.html",
		controller: "atualizaEstoqueController",
	});
	 */

	$routeProvider.otherwise({
		templateUrl:"global/st-app/app-inicio/template-route/inicio.html",
		controller:"inicioController"	
	});

	//Intercepta um erro de resposta
	$httpProvider.interceptors.push(function ($q, $rootScope, $location, $localStorage, usSpinnerService) {
		return {

			'responseError': function(rejection) {
				var status = rejection.status;
				var config = rejection.config;
				var method = config.method;
				var url = config.url;

				usSpinnerService.stop('spinner-1');


				if (status == 401) {


					$location.path("/login-redirect");


				} else {
					//stUtil.showMessage("","Ocorreu um erro ao processar a soicitação.","danger");
				}

				return $q.reject(rejection);
			}
		};
	}
	);

	//Intercepta uma requisição para inclusao do Token
	$httpProvider.interceptors.push(function ($q, $rootScope, $location,$cookieStore, usSpinnerService,cacheGet) {
		return {
			'request': function(config) {

				if(config.url.indexOf("projecao/execute-query")==-1 && config.url.indexOf("projecao/get-projecoes")==-1  && config.url.indexOf("isCachePost=true")==-1)
					usSpinnerService.spin('spinner-1');

				//Inclusão do token e da filial
				if(config.url.indexOf(".html")==-1) {

					var authToken = $rootScope.authToken ||$cookieStore.get("authToken"); 
					var filialId = 0;

					if($rootScope.currentFilial){

						filialId = $rootScope.currentFilial.id;
					}

					var operator = "?";

					if( config.url.indexOf("?")!=-1)
						operator="&&";

					config.url = config.url +operator+ "token=" + authToken;

					if(config.url.indexOf("filialId")==-1){
						config.url = config.url +"&&filialId="+filialId;
					}


				}

				return config || $q.when(config);
			},

			'response': function(res) {

				var url = res.config.url;

				//Resposta relacionada a operação com produto (Para incluir no cacheGet)
				if(res.data && res.data.item && url.indexOf("produto/add")!=-1){

					var produto=res.data.item;
					console.log("Produto na resposta:");
					console.log(produto);

					if(produto.disable==1)
						cacheGet.delObjectById("produto",produto.id);
					else{
						cacheGet.updateObject("produto",produto);

						if(produto.tag){
							var tags = cacheGet.get("tagsProduto");
							if(tags.indexOf(produto.tag)==-1){
								cacheGet.add("tagsProduto",[produto.tag]);
							}
						}

					}

				}

				//Resposta relacionada a operação com cliente (Para incluir no cacheGet)
				else if(res.data && res.data.item && url.indexOf("cliente/add")!=-1){

					var cliente=res.data.item;

					if(cliente.disable==1)
						cacheGet.delObjectById("cliente",cliente.id);
					else{
						cacheGet.updateObject("cliente",cliente);
					}

				}

				usSpinnerService.stop('spinner-1');

				return res || $q.when(res);
			}
		};
	}
	);


})

})();

"use strict";
(function(){
angular.module('adm').factory('config',function($location, $rootScope, $http, $templateCache){

	
	
	function getAppVersion(){
		
		return "Ceasa Plus 2.9"
	}
	
	function getUrlBase(){
		
		//Servidor de teste local (Utilizado para deploy do .war gerado pelo jenkins)
		if($location.$$absUrl.indexOf("7070/Albar")!=-1)
			 return "http://"+$location.$$host+":7070/Albar/";
			
		else if($location.$$absUrl.indexOf("8080/Albar")!=-1)
		  return "http://"+$location.$$host+":8080/Albar/";
		
		else if($location.$$absUrl.indexOf("8080")!=-1)
			  return "http://"+$location.$$host+":8080/";
		
        //SSL
		else if($location.$$absUrl.indexOf("https")!=-1)
			return "https://"+$location.$$host+"/";
                else
                  return "http://"+$location.$$host+"/";
		
	}
	
	
	function getPath(){
		
		return $location.path();
	}
	
	
	function cacheTemplates (){
		//Função substituida com a inclusão com service-worker
		
	}
	
	

	return {
		cacheTemplates: cacheTemplates,
		baseUrl: getUrlBase(),
		path: getPath(),
		appVersion: getAppVersion()
	};


})
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

	.factory("stService",function($http, config, $cookieStore){

		//Opções
		var _saveOp  = function(descricao,valor){

			var req ={
					header : {'Content-Type' : 'application/json; charset=UTF-8'},
					method:"GET",
					params:{
						descricao:descricao,
						valor:valor
					}
			};
			return $http.get(config.baseUrl+"opcao/add",req);

		};	

		//Ooções Complexas
		var _getOpsOthers  = function(nomeObjeto,query){

			var req ={
					header : {'Content-Type' : 'application/json; charset=UTF-8'},
					method:"GET",
					params:{
						tabela:tabela,
						condicao:condicao
					}
			};
			return $http.get(config.baseUrl+"opcao/get/others",req);

		};	

		var _save  = function(nomeObjeto,objeto){

			return $http.post(config.baseUrl+nomeObjeto+"/add/",objeto);

		};

		var _getById =  function(nomeObjeto,id){

			var req ={

					method:"GET",
					params:{id:id}
			};
			return $http.get(config.baseUrl+nomeObjeto+"/get",req);
		};

		var _getValues =  function(nomeOb,attr,extras){

			var req ={

					method:"GET",
					params:{

						nomeOb:nomeOb,
						attr:attr,
						extras:extras||['']

					}
			};

			return $http.get(config.baseUrl+"opcao/get-values",req);
		};

		var _apagar = function(nomeObjeto,ids){

			return $http.post(config.baseUrl+nomeObjeto+"/delete/",ids);
		};

		var _getLike =  function(nomeObjeto,queryBusca, prop){

			var req ={

					method:"GET",
					params:{query:queryBusca,propriedade:prop}
			};

			return $http.get(config.baseUrl+nomeObjeto+"/busca/",req);
		};

		var _getLikeMap =  function(nomeObjeto,qs,pagina,max, extra){

			var req ={

					method:"GET",
					params:{qs:qs,pagina:pagina,max:max, extra: extra}
			};

			return $http.get(config.baseUrl+nomeObjeto+"/busca/map",req);
		};

		var _getAll =  function(nomeObjeto){
			var req ={

					method:"GET",

			};

			return $http.get(config.baseUrl+nomeObjeto,req);
		};

		var _executePost = function(url,objeto){

			return $http.post(config.baseUrl+url,objeto);
		};

		var _executeGet =  function(url,params){

			var req ={

					method:"GET",
					params:params
			};

			return $http.get(config.baseUrl+url,req);
		};

		//Projeções utilizando Control do próprio objeto
		var _getProjecoesFromObject = function(objeto,ops){

			ops.extra = ops.extra||'';
			ops.qs = ops.qs||[''];
			ops.max = ops.max||0;

			var req ={

					method:"GET",
					params:ops
			};

			return $http.get(config.baseUrl+objeto+"/projecoes",req);

		}

		var _getProjecoes = function(ops){

			ops.extra = ops.extra||'';
			ops.qs = ops.qs||[''];
			ops.max = ops.max||0;

			return $http.post(config.baseUrl+"projecao/get-projecoes/",ops);

		}

		return {

			getLikeMap: _getLikeMap,
			getLike: _getLike,
			getAll : _getAll,
			save: _save,
			apagar :_apagar,
			getById: _getById,
			getValues: _getValues,

			getProjecoes:_getProjecoes,
			getProjecoesFromObject:_getProjecoesFromObject,

			//Outros
			executePost:_executePost,
			executeGet:_executeGet,

		};

	})

})();
