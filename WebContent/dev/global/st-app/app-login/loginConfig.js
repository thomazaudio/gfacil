
"use strict";
(function(){
angular.module("adm").config(function($routeProvider,$httpProvider){

	//Login
	$routeProvider.when("/login-redirect",{

		templateUrl:"global/st-app/app-login/template-route/login.html",
		controller:"loginController",
		resolve: {
			demo:function(){
				return {};
			},
			redirect:function(){
				return true;
			}
		}
	}); 
	
	
	$routeProvider.when("/login",{

		templateUrl:"global/st-app/app-login/template-route/login.html",
		controller:"loginController",
		resolve: {
			demo:function(){
				return {};
			},
			redirect:function(){
				false;
			}
			
		}
	}); 
	
	
	
	
	$routeProvider.when("/manutencao",{

		templateUrl:"global/st-app/app-login/template-route/manutencao.html",
		
	});
	
	
	/*
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
	*/

	$routeProvider.when("/video-apresentacao",{

		templateUrl:"global/st-app/app-login/template-route/videoApresentacao.html",
		controller:function($scope,stUtil,$location,st, configUtil, $interval){

			var youtubePlayer;
			
			$scope.playerVars = {
					controls: 0,
					color:"red",
					modestbranding : 1,
					autoplay: 0,
					modestbranding:1,
					rel:0
			};
			
			$scope.$on('youtube.player.ready', function ($event, player) {

		        youtubePlayer = player;
		        youtubePlayer.playVideo();
				
			});
			
			$interval(function(){

				if($scope.videoTutorial.getCurrentTime()>200 ){
                   
					$scope.showButton=true;
				}
			
			},1000);
			
			$scope.proximo = function(){
				configUtil.setConfig("assistiuTutorialBasico", 'true', function(){
					
					st.leadEvt({descricao:"assistiu_tutorial_basico_"+parseInt($scope.videoTutorial.getCurrentTime())});
					stUtil.showMessage("","Seja bem vindo!","info");
					
					$location.path("/inicio");
					
				});
				
			
			}
		}

	}); 

	//Mudança de senha padrão
	$routeProvider.when("/change-password",{

		templateUrl:"global/st-app/app-login/template-route/change-password.html",
		controller:"changePasswordController",

	}); 

  /*
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
	
	*/

	$routeProvider.when("/login/:login",{

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

	
});

})();

