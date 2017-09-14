angular.module("adm").controller("loginController",function(demo,$scope,$location,$rootScope,$localStorage,$cookieStore,loginUtil, stUtil){

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
		
		login.empresa = login.usuario;

		$scope.carregando=true;
		loginUtil.logar(login,lembrarSenha,function(loginData){

			$scope.carregando=false;
			
			if(loginData){
				$location.path("/inicio");
			}
			else{
				stUtil.showMessage("","Ocorreu um erro ao realizar login, tente novamente","danger");
			}
			
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