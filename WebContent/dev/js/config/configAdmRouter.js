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
	$httpProvider.interceptors.push(function ($q, $rootScope, $location, stUtil, st) {
		return {

			'responseError': function(rejection) {
				var status = rejection.status;
				var config = rejection.config;
				var method = config.method;
				var url = config.url;

				$rootScope.loadingSpinner=false;
				
				console.log("Objeto rejection: ");
				console.log(rejection);
				
				if(url.indexOf("usuariosistema/add-event")==-1){
				
					//Envia evento para o backend
					st.evt({
					  evento:"erro_"+status,
					  url:url,
					  urlMethod:method,
					  descricao: JSON.stringify(config.data)
						
					});
				}
				
				if(status==-1){
					
					stUtil.showMessage("Sem conexão com a internet!");
				}

				if (status == 401) {
                    
					/*
					if($location.$$path!='/login' && $location.$$path!='/login/demo' )
						$rootScope.pathPos = $location.$$path;

					
					if($rootScope.atualPage!='Login' && rejection.config.url.indexOf("config?")==-1)
						$location.path("/login");

                    */

				} else {
					//stUtil.showMessage("","Ocorreu um erro ao processar a soicitação.","danger");
				}

				return $q.reject(rejection);
			}
		};
	}
	);

	//Intercepta uma requisição para inclusao do Token
	$httpProvider.interceptors.push(function ($q, $rootScope, $location,$cookieStore,usSpinnerService,cacheGet) {
		return {
			'request': function(config) {
			
				
				if(config.url.indexOf("projecao/execute-query")==-1 && config.url.indexOf("projecao/get-projecoes")==-1  && config.url.indexOf("isCachePost=true")==-1)
					$rootScope.loadingSpinner=true;

				
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


				$rootScope.loadingSpinner=false;

				return res || $q.when(res);
			}
		};
	}
	);


});

