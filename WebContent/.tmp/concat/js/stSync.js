"use strict";
(function(){

	angular.module("adm") 

	.factory("cacheGet",function($localStorage,$cookieStore,stUtil,$injector){

		var getNomeCache = function(){

			var login = $cookieStore.get("usuarioSistema").originalLogin;
			return "cacheGet"+login;
		}

		var _add = function(url,objetos){

			var nomeCache = getNomeCache();

			//Cria o objeto de cache caso não exista
			if(!$localStorage[nomeCache])
				$localStorage[nomeCache] = {};

			var itens  = $localStorage[nomeCache][url]||[];

			//Adiciona os objetos ao cache
			itens = itens.concat(objetos);

			$localStorage[nomeCache][url] = itens;

		}

		//Atualiza um objeto dentro de cacheGet utilizando id como referencia
		var _updateObject = function(url, objeto){

			var index = stUtil.buscaOb( $localStorage[getNomeCache()][url],objeto.id,"id");

			if(index!=-1){

				$localStorage[getNomeCache()][url][index] = objeto;

			}
			else{

				$localStorage[getNomeCache()][url].push(objeto);
			}

		}

		var _get = function(url, label, like){

			var nomeCache = getNomeCache();

			if(!$localStorage[nomeCache])
				return [];

			var itens =   $localStorage[nomeCache][url];

			if(label && like){

				itens = itens.filter(function(item){

					if(item[label]  && item[label].toLowerCase().indexOf(like.toLowerCase())!=-1)
						return item;
				});
			}

			return itens;

		}

		var _getObjectById = function(url,id){

			var index = stUtil.buscaOb( $localStorage[getNomeCache()][url],id,"id");

			return $localStorage[getNomeCache()][url][index];

		}

		var _cleanAll = function(url){

			if($localStorage[getNomeCache()])
				delete $localStorage[getNomeCache()][url];
		}

		var _del = function(url,id){

			var index = stUtil.buscaOb( $localStorage[getNomeCache()][url],id,"id");

			$localStorage[getNomeCache()][url].splice(index,1);

		}

		//Cache de itens offline,por enquanto cliente e produtos para otimizar vendas
		var _getOfflineCache = function(callback){

			var stService = $injector.get("stService");

			//Limpa cache
			_cleanAll("cliente");
			_cleanAll("produto");
			_cleanAll("tagsProduto");

			//Cache de clientes e produtos para otimizar vendas
			stService.getLikeMap("cliente",["disable=0"],0,0,'').success(function(clientes){

				_add("cliente",clientes.itens);

				stService.getLikeMap("produto",["disable=0"],0,0,'').success(function(produtos){

					var prods = produtos.itens;
					_add("produto",prods);
					
					//Cache de tags
					var tags = [];
					for(var i in prods){ 
						
						  if(prods[i].tag && tags.indexOf(prods[i].tag)==-1)
						    tags.push(prods[i].tag);
					}
					
					_add("tagsProduto",tags);
					
					callback("ok");
					

				}).error(function(){
					
					callback();
				});

			}).error(function(){
				
					callback();
				
			});

		}

		return{
			add: _add,
			get: _get,
			cleanAll: _cleanAll,
			updateObject: _updateObject,
			getObjectById: _getObjectById,
			delObjectById:_del,
			getOfflineCache:_getOfflineCache
		}

	})

})();

"use strict";
(function(){

	angular.module("adm") 

	.factory("cachePost",function($localStorage,$cookieStore,$rootScope){

		//Adiciona ou edita um objeto ao cache
		var _add = function(url, objeto, callback){
			
			//Filial corrente
			var idFilial = 0;
			
			if($rootScope.currentFilial){
				
				idFilial  =  $rootScope.currentFilial.id;
				
			}
			
			
			objeto.idFilial = idFilial;
			url = url +"?filialId="+idFilial+"&&isCachePost=true";

			if(!$localStorage.cachePost)
				$localStorage.cachePost = [];

		
			var uS = $cookieStore.get("usuarioSistema");

			var login;
			if(uS){
				//login garante que o cache pertença ao usuário correto
				login = uS.originalLogin;
			}
			else {
				login="shared@shared";
			}

		
			var obCache = {
					    url:url,
						objeto:objeto,
						login:login
					
			}
			
			$localStorage.cachePost.push(obCache);


			//Retorna o objeto com 'idCachePost' para futuras referencias
			if(callback)
			callback(objeto);
		}

		

		return{

			add:_add
		}

	})

})();

"use strict";
(function(){

	angular.module("adm") 

	//Diretiva necessária para upload de arquivos
	.directive('syncCachePost',function (onlineStatus) {
		return {
			restrict: 'E',
			templateUrl:"global/st-app/st-sync/template-module/syncCachePost.html",
			scope:{

			},
			controllerAs:"vm",
			bindToController:true,
			controller: function($localStorage, $interval, $timeout, stService, $rootScope, stUtil, onlineStatus, $scope, loginUtil, st, $uibModal) {

				var vm = this;

				var _start = function(){

					if(!$localStorage.cachePost)
						$localStorage.cachePost = [];

					var executando = false;

					var executar = function(){

						if(executando==true || onlineStatus.isOnline()==false|| loginUtil.isLogado()==false)
							return;

						executando = true;
						$rootScope.executandoCachePost = true;

						vm.sizeCachePostInExcecution = $localStorage.cachePost.length;

						executePosts(0,$localStorage.cachePost.length);
					}


					function executePosts(i, tam){

						if(i>=tam ||  !$localStorage.cachePost[0] || onlineStatus.isOnline()==false){

							executando = false;
							$rootScope.executandoCachePost = false;
							return;
						}

						vm.indexCachePostInExcecution = i+1;

						stService.executePost($localStorage.cachePost[0].url, $localStorage.cachePost[0].objeto).success(function(data){

							$localStorage.cachePost.splice(0,1);
							$timeout(function(){
								executePosts((i+1), tam);

							}, 300);


						}).error(function(erro, status){
							
							console.log("Erro no cachePost: ");
							console.log(erro);
							
							console.log("Status no cachePost");
							console.log(status);
							
							console.log("Objeto no cachePost");
							console.log($localStorage.cachePost[0]);
							
							if(erro && status!=401){
								
								st.evt({evento:"erro_cache_post", descricao: erro, descricao_2: JSON.stringify($localStorage.cachePost[0]) });

								$localStorage.cachePost.splice(0,1);
								$uibModal.open({
									animation: true,
									size:"lg",
									templateUrl:"global/st-app/app-login/template-route/manutencao.html"
									
								});
							}
						
						
								$timeout(function(){
									executePosts((i+1), tam);
	
								}, 5000);
							
					

						});
					}

					$interval(executar, 5000);

				}

				_start();
			}
		};
	})

})();
