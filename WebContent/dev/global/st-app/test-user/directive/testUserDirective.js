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
									if(data.item!=null)
									   $("#descricao-teste").html(data.item.descricao);
									$scope.carregandoTest = false;
									
									stService.executeGet("/testuser/saldo-for-user").success(function(data){

										$rootScope.saldoTestes = data.item || 0;

										stService.executeGet("/testuser/total-tests-for-user").success(function(data){

											$rootScope.quantTests = data.item || 0;

										});

									});



								}).error(function(){
									
									$scope.carregandoTest = false;
									stUsilt.showMessage("","ocorreu um erro ao recuperar informações do teste, tente novamente");
									$modalInstance.close();
									
									
								});

							}
							
							$scope.getProxTest =  _getProxTest;
							
							$timeout(_getProxTest, 300);

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

							

								if($rootScope.definition.queryVerification && $rootScope.definition.queryVerification!=null)
								{

									stService.executeGet("projecao/execute-query", {query:$rootScope.definition.queryVerification}).success(function(data){

									

										if(data.itens.length>0 || erroSistema==1){

											_openDetalheFeedBack(teste);
										}

										else{

											stUtil.showMessage("","Você não executou o teste corretamente, tente novamente ou descreva o erro nos","danger");
										}

									});



								}

								else{
									_openDetalheFeedBack(teste);
								}

							}

							
							
							var _openDetalheFeedBack = function(test){
								
								 $uibModal.open({
										animation: true,
										templateUrl:"global/st-app/test-user/template-module/testeUserResposta.html",
										size:'lg',
										controller: function($scope, $modalInstance){
											  
												$scope.test = test;	
												$scope.salvar  = function(){
													
													if(!$scope.test.nivelDificuldadeFromUser){
														stUtil.showMessage("","Escolha uma opção","danger");
														
														return;
											   }
		
													stService.executePost("testuser/add/", $scope.test).success(function(){
		
														stUtil.showMessage("","Teste executado com sucesso!","info");
														$modalInstance.close();

														$rootScope.executandoTeste=false;

														$rootScope.testIsOpen = false;

														_getProxTest();
														
		
													});
													
												}
									}
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
