"use strict";
(function(){
angular.module("adm").controller("loginController",function(demo,$scope,$location,$rootScope,$localStorage,$cookieStore,loginUtil, stUtil, redirect, st, leadUtil){


	if($location.$$absUrl.indexOf("admin")!=-1 || $location.$$absUrl.indexOf("localhost") !=-1)
		$scope.showCampoEmpresa = true;
	
	
	if(redirect==true){
		st.evt({evento:"usuario_foi_deslogado", descricao:"O usuário foi deslogado do Sistema"});

	}

	$scope.carregando = false;
	$scope.lembrarSenha = true;

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

		if(!$scope.showCampoEmpresa || $scope.showCampoEmpresa == false)
		   login.empresa = login.usuario;

		$scope.carregando=true;
		loginUtil.logar(login,lembrarSenha,function(loginData){
			
			$scope.carregando=false;
			
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