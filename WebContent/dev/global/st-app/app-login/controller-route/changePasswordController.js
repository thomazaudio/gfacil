angular.module("adm").controller("changePasswordController",function($scope,stService,$cookieStore,$location,st,$localStorage, stUtil){

	$scope.usuarioSistema =  $cookieStore.get("usuarioSistema");

	$scope.lembrarSenha = true;

	$scope.alterarSenha = function(usuarioSistema){

		//Validações
		if(usuarioSistema.senha.length<4)
		{
			stUtil.showMessage("","A senha deve ter pelo menos 4 caracteres.","danger"); 
			return;
		}

		usuarioSistema.defaultPassword=false;
		stService.save("operadorsistema",usuarioSistema).success(function(){

			st.evt({evento:"change_password"});

			//Grava a senha alterada em $localStorage
			$localStorage.senha = usuarioSistema.senha;

			$location.path("/video-apresentacao");

		});
	}


});