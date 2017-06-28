(function(){

	angular.module("adm") 

	.factory('cadastrosUtil', function($rootScope,$filter, stUtil,$uibModal){

		var	_openCadastro = function(cadastro,callback){

			var _modalInstance =   $uibModal.open({
				animation: true,
				templateUrl:"global/st-app/cadastros/template-module/detalheCadastro.html",
				size:'lg',
				controller:function($scope,stService,stUtil){

					$scope.cadastro = cadastro;

					$scope.fechar = function(modal){

						modal.$dismiss("");

					}

					$scope.salvar = function(cadastro,modal){

						stService.save("opcao",cadastro).success(function(data){

							stUtil.showMessage("","Opção adicionada com sucesso!","info");
							modal.$dismiss("");
							callback(data.item);

						});

					}

				}

			});

		}

		return {

			openCadastro:_openCadastro

		}

	})

})();
