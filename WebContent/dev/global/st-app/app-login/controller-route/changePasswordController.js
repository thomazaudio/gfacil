
"use strict";
(function(){
angular.module("adm").controller("changePasswordController",function($rootScope, $scope,stService,$cookieStore,$location,st,$localStorage, stUtil, configUtil){

	$scope.usuarioSistema =  $cookieStore.get("usuarioSistema");

	$scope.lembrarSenha = true;

	$scope.alterarSenha = function(usuarioSistema){

		//Validações
		if(!usuarioSistema.senha || usuarioSistema.senha.length<4)
		{
			stUtil.showMessage("","A senha deve ter pelo menos 4 caracteres.","danger"); 
			return;
		}
		stService.save("operadorsistema",usuarioSistema).success(function(){
			
			st.leadEvt({descricao:"usuario_mudou_senha"});
			
			configUtil.setConfig("mudouSenha", 'true', function(){
				
				//Grava a senha alterada em $localStorage
				$localStorage.senha = usuarioSistema.senha;
				
			    $location.path("/inicio");
			
				
			});

			

		}).error(function(){
			st.evt({evento:"erro_mudar_senha"});
			stUtil.showMessage("","Ocorreu um erro, tente novamente","danger"); 
		});
	}

})
})();