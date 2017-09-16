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
			isLogado: _isLogado

		}
	})

})();
