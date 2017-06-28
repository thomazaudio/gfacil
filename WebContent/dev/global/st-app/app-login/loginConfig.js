angular.module("adm").config(function($routeProvider,$httpProvider){

	//Login
	$routeProvider.when("/login",{

		templateUrl:"global/st-app/app-login/template-route/login.html",
		controller:"loginController",
		resolve: {
			demo:function(){
				return {};
			}
		}
	}); 
	
	
	$routeProvider.when("/login/test",{

		templateUrl:"global/st-app/app-login/template-route/login.html",
		controller:"loginController",
		resolve: {
			demo:function(){
				return {
					empresa:"31992267947",
					usuario:"31992267947",
					senha:"leghacy123"
					};
			}
		}
	}); 

	$routeProvider.when("/video-apresentacao",{

		templateUrl:"global/st-app/app-login/template-route/videoApresentacao.html",
		controller:function($scope,stUtil,$location,st){

			$scope.proximo = function(player){
				st.evt({evento:"assistiu_video_apresentacao",descricao:player.getCurrentTime()+""});
				stUtil.showMessage("","Seja bem vindo!","info");
				$location.path("/inicio");
			}
		}

	}); 

	//Mudança de senha padrão
	$routeProvider.when("/change-password",{

		templateUrl:"global/st-app/app-login/template-route/change-password.html",
		controller:"changePasswordController",

	}); 


	//Login demonstrativo ADM
	$routeProvider.when("/login/demo",{

		templateUrl:"global/st-app/app-login/template-route/login.html",
		controller:"loginController",
		resolve: {
			demo:function(){
				return {empresa:"admin",usuario:"admin",senha:"admin"};
			}
		}

	}); 

	$routeProvider.when("/usuario/:login",{

		templateUrl:"global/st-app/app-login/template-route/aguarde.html",
		resolve: {

			cadastrarUsuario: function(loginUtil,$route,$rootScope,$localStorage, stService,st, $cookieStore){

				var login = $route.current.params.login;

				//Realiza o cadastro do usuário
				stService.executeGet("cadastrar-usuario",{login:login}).success(function(){

					var dadosLogin = {
							empresa: login,	
							usuario: login,
							senha: $localStorage.senha||"123",		
					}

					//Garante que o usuário será redirecionado pra página inicial 
					$rootScope.pathPos  = "/inicio";

					loginUtil.logar(dadosLogin,true,function(){

						//Envia evento para o backend
						//Envia evento para o backend
						st.evt({
							evento:"clicou_link_usuario",
							url:"/usuario/:login",
							login:login

						});
					});

				})
				//Caso ocorra um erro ao cadastrar o usuário
				.error(function(){

				});

			}

		}

	});

	//Login demonstrativo personalizado
	$routeProvider.when("/login/demo/:empresa/:usuario/:senha",{

		templateUrl:"global/st-app/app-login/template-route/login.html",
		controller:"loginController",
		resolve: {
			demo:function($route){
				return {empresa:$route.current.params.empresa,usuario:$route.current.params.usuario,senha:$route.current.params.senha};
			}
		}

	}); 

});

