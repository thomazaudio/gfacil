"use strict";

(function(){

	angular.module("adm")

	.factory("filialUtil",function(stService,$rootScope,$localStorage,stUtil,st,$uibModal,$http,config){

		//Abre os detalhes da filial para edição
		var _openDetalheCurrentFilial= function(filial,callback){

			$uibModal.open({
				animation: true,
				templateUrl:'global/st-app/app-filial/template/modalDetalheFilial.html',
				size:'lg',
				controller:function($scope,$rootScope){

					$scope.filial = $rootScope.currentFilial;

					$scope.fechar = function(ele){

						ele.$dismiss('cancel');
						callback($scope.filial);

					}

					//Envio do certificado digital
					$scope.enviarCertificado = function(file,senha) {

						var fd = new FormData();
						fd.append('file', file);
						fd.append('senha',senha);
						$http.post(config.baseUrl+"filial/upload-certificado/", fd, {
							transformRequest : angular.identity,
							headers : {
								'Content-Type' : undefined
							}
						}).success(function(data) {

							$rootScope.currentFilial.nomeCertificado = data.item;
							$scope.filial.nomeCertificado = data.item;
						}).error(function() {

						});
					}

					$scope.salvar = function(filial){

						stService.save("filial",filial).success(function(data){

							stUtil.showMessage("","Salvo com sucesso","info");	

							if(callback)
								callback(data.item);
						});

					}

				}
			});
		}

		var _getAllFiliais = function(callback){

			stService.getAll("filial").success(function(data){

				var filiais = data.itens;

				//Empresa com mais de uma filial
				if(filiais.length>0){

					$rootScope.filiais = filiais;
					$rootScope.filiais.unshift({id:0,xNome:"Todas"});
					$rootScope.currentFilial = 	$localStorage.currentFilial || data.itens[0];

				}

				//Empresa sem filiais
				else{
					$rootScope.currentFilial = {id:1,xNome:"Matriz"};
				}

				if(callback)
					callback(data.itens);

			});

		}

		var _getFilialById = function(id){

			var filial ={};

			var index = stUtil.buscaOb($rootScope.filiais,id,"id");

			if(index!=-1)
				filial = $rootScope.filiais[index];

			return filial;

		}

		return {

			getFilialById:_getFilialById,
			getAllFiliais:_getAllFiliais,
			openDetalheCurrentFilial: _openDetalheCurrentFilial
		}

	})

})();

