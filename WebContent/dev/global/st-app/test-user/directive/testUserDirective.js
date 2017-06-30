(function(){
	angular.module("adm") 

	//Modal em forma de diretiva
	.directive("testUserButton",function(stService, $uibModal, stUtil){
		return {

			restrict:"AE",
			templateUrl:"global/st-app/test-user/template-module/testUserButton.html",
			link:function($rootScope, element, attrs){



				var _openDetalhe = function(){


					$rootScope.testIsOpen=true;

					modal = $uibModal.open({
						animation: true,
						templateUrl:"global/st-app/test-user/template-module/testUserDetalhe.html",
						size:'lg',
						controller: function($scope, $rootScope,  $modalInstance, chronoService, $timeout){


							$scope.$on("modal.closing", function(){

								$rootScope.testIsOpen = false;

							}); 


							var  _getProxTest = function(){

								$scope.carregandoTest = true;
								stService.executeGet("testuser/prox-test").success(function(data){

									
									$rootScope.definition = data.item;
									$("#descricao-teste").html(data.item.descricao);
									$scope.carregandoTest = false;


								}).error(function(){
									
									$scope.carregandoTest = false;
									stUsilt.showMessage("","ocorreu um erro ao recuperar informações do teste, tente novamente");
									$modalInstance.close();
									
									
								});

							}
							
							$timeout(_getProxTest, 300);

							stService.executeGet("/testuser/saldo-for-user").success(function(data){

								$rootScope.saldoTestes = data.item || 0;

								stService.executeGet("/testuser/total-tests-for-user").success(function(data){

									$rootScope.quantTests = data.item || 0;

								});

							});



							$rootScope.voltar = function(){

								$modalInstance.close();
								$rootScope.testIsOpen = false;
							}

							$rootScope.iniciarTeste = function(){

								$rootScope.iniTeste = new Date().getTime();
								$modalInstance.close();
								$rootScope.executandoTeste=true;
								$rootScope.testIsOpen = false;
								chronoService.addTimer('myTimer', { interval: 500 });
								chronoService.start();
								stUtil.showMessage("","O teste foi iniciado!","info");
							}

							$rootScope.finalizarTeste = function(comentario, erroSistema){

								var teste = {};
								teste.definition = $rootScope.definition;
								teste.comentario = comentario;
								teste.tempoGasto =  new Date().getTime() - $rootScope.iniTeste || 0;
								teste.erroSistema = erroSistema;

								console.log("Definition em rootScope: ");
								console.log($rootScope.definition);

								if($rootScope.definition.queryVerification && $rootScope.definition.queryVerification!=null)
								{

									stService.executeGet("projecao/execute-query", {query:$rootScope.definition.queryVerification}).success(function(data){

										console.log("Resultado da execução da query: ");
										console.log(data);
										
										console.log("erroSistema: ");
										console.log($scope.erroSistema);

										if(data.itens.length>0 || erroSistema==1){

											_saveTeste(teste);
										}

										else{

											stUtil.showMessage("","Você não executou o teste corretamente, tente novamente ou descreva o erro nos","danger");
										}

									});



								}

								else{
									_saveTeste(teste);
								}

							}

							var _saveTeste = function(teste, callback){

								stService.executePost("testuser/add/", teste).success(function(){

									$rootScope.executandoTeste=false;

									$rootScope.testIsOpen = false;

									stUtil.showMessage("","Teste executado com sucesso!","info");

									_getProxTest();

								});

							}



						}

					});

				}

				element.bind("click",function(){

					_openDetalhe();
				});

			}
		}

	})
})();
