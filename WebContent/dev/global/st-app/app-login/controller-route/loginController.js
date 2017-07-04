angular.module("adm").controller("loginController",function(demo,$scope,$location,$rootScope,$localStorage,$cookieStore,loginUtil){

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

	$scope.logar = function(login,lembrarSenha){
		
		/*
	
		///Se não for informado login.empresa, login.empresa assume o valor de login.usuario
		if($scope.showEmpresa==false)
			login.empresa = login.usuario;
			
			*/
		
		login.empresa = login.usuario;

		$scope.carregando=true;
		loginUtil.logar(login,lembrarSenha,function(){

			$scope.carregando=false;
		});
	}

	$scope.logOut = function() {
		loginUtil.logOut();
	};

	//demo é utilizado para login de demonstração
	if(demo.usuario){
		$scope.login = {empresa:demo.empresa,usuario:demo.usuario,senha:demo.senha};
		$scope.logar($scope.login);

	}else{

		$scope.login = {empresa:$localStorage.empresa,usuario:$localStorage.usuario,senha:$localStorage.senha};
		$scope.existeEmpresa = false;

	}

});