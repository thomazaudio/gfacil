"use strict";
(function(){

	angular.module("adm") 

	.factory("loginUtil",function($location,cachePost,cacheGet,stUtil,$localStorage,$rootScope,$cookieStore,stService,$route,loginService,$timeout,st,configUtil,filialUtil){

		var _logOut = function() {
			delete $rootScope.user;
			delete $rootScope.authToken;
			delete $rootScope.usuarioSistema;
			$cookieStore.remove('authToken');
			$cookieStore.remove('usuarioSistema')
			$location.path("/login");
		};

		var _logar = function(login,lembrarSenha, callback){

			$localStorage.empresa = login.empresa;
			$localStorage.usuario = login.usuario;

			if(lembrarSenha==true)
				$localStorage.senha = login.senha;
			else{

				delete  $localStorage.senha;
			}

			//remove o token antigo
			$cookieStore.remove('authToken');

			loginService.logar(login).success(function(data){

				
				//Token de acesso gerado pelo back-end
				var authToken = data.token;
				$rootScope.authToken = authToken;
				$cookieStore.put('authToken', authToken);

				//Informações do usuário logado
				var usuarioSistema = data.usuarioSistema;
				usuarioSistema.originalLogin = usuarioSistema.login;
				usuarioSistema.login = usuarioSistema.login.split('@')[0];
				$rootScope.usuarioSistema = usuarioSistema;
				$rootScope.config = data.config;
				$cookieStore.put('usuarioSistema', usuarioSistema);

				//Filiais disponíveis no sistema
				filialUtil.getAllFiliais(function(){
					
					var idFilial = parseInt($rootScope.config.confs.currentFilialId);
					var nomeFilial = $rootScope.config.confs.labelCurrentFilial;
					 
					if(idFilial>0){
						$rootScope.currentFilial = {id: idFilial, xNome: nomeFilial};
					}
				
					
					//Cache offline para otimização do PDV
					cacheGet.getOfflineCache(function(){

					});

				});

				$timeout(function(){

						if($route.current.$$route.originalPath=='/usuario/:user'){

							$rootScope.pathPos="/inicio";

						}

						//Caso o usuário ainda não tenha alterado a senha padrão(defaultPassword==1)
						if(usuarioSistema.defaultPassword==true){

							$location.path("change-password");
						}

						else if($rootScope.pathPos){

							$location.path($rootScope.pathPos);
							delete $rootScope.pathPos;
						}
						else{

							$location.path("/inicio");

						}

				});
				
			
				callback(data);
				


			}).error(function(data,erro){

				callback(data,erro);

				if(erro==401){

					if($route.current.$$route.originalPath!='/usuario/:user')
						stUtil.showMessage("O login falhou!","Confira os dados de acesso e tente novamente.","danger");

					//Deleta a senha que falhou
					//delete $localStorage.senha;

					//Vai pra tela de login novamente
					$location.path("/login");
				}

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
			isLogado: _isLogado

		}
	})

})();
