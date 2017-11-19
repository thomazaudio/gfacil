angular.module("adm").config(function($routeProvider, $httpProvider){

	//Inicio
	$routeProvider.when("/prot/:template",{

		templateUrl:"global/st-app/app-prototype/template-route/prototype.html",

		controller: function($scope, $rootScope, $route, stService, $localStorage, $http, loginUtil){
			
			loginUtil.logar({usuario:$localStorage.usuario,empresa:$localStorage.empresa, senha:$localStorage.senha}, true, function(){
				
				$scope.showTemplate=true;
				
				var prot = $route.current.params.template;

				var urlBase = "global/st-app/app-prototype/prots/"+prot+"/";

				var versions = [];

				for(var i =1; i <=10 ;i++){

					versions.push({id: i,  label:"Versão "+i,template:urlBase+i+".html"});

				}

				$localStorage.activeVersion = $localStorage["prot_"+prot]|| versions[0];

				$scope.activeVersion =  $localStorage.activeVersion;

				$scope.changeActiveVersion = function(v){

					$scope.activeVersion = v;
					$localStorage["prot_"+prot] =  v;
				}

				$scope.funcao = function(){

					console.log("!!!!!!!!!!!!!!!!!!!!!!!!");
				}

				$scope.vs = versions;

				angular.forEach($scope.vs, function(v){
					// Here, the lang object will represent the lang you called the request on for the scope of the function
					$http.get(v.template).success(function(){

						v.enable=true;
						console.log("Erro em: "+v.template);

					});
				});
				
			});

		

		}


	}); 

});

