"use strict";
(function(){

	angular.module("adm")

	.factory("pessoaUtil",function($uibModal, stService, stUtil){

		var _openDetalhePessoa = function(pessoa, tab, callback){

			var _modal  = 	$uibModal.open({
				animation: true,
				backdrop: 'static',
				templateUrl:"global/st-app/app-pessoa/template-module/modalDetalhePessoa.html",
				size:'lg',
				controller:function($scope, $modalInstance){
					
					
					//config.confs.defaultCadProdutoAllFiliais || false
					var nomeOriginal = pessoa.nome;

					$scope.cadAllFiliais = false;

					$scope.tab = tab || 0;

					$scope.tabs = [{label:'Informações',icon:'fa-edit'}];

					if(pessoa.id)
						$scope.tabs.push({label:'Lançamentos',icon:'fa-line-chart'});

					$scope.objeto = pessoa;
					
					var tipoMov=2;
					//Definicao do tipo de movimentação
					if(pessoa.tipo_pessoa=='cliente')
						tipoMov = 2;//Gera receita

					else if(pessoa.tipo_pessoa=='fornecedor')
						tipoMov = 1;//Gera Despesa

					else if(pessoa.tipo_pessoa=='funcionario')
						tipoMov = 1;//Gera Despesa

					$scope.tipoMov=tipoMov;

					$scope.fechar = function(){

						$modalInstance.close();
						callback($scope.objeto);

					}

					$scope.salvar = function(){
						
						var tipoPessoa  = $scope.objeto.tipo_pessoa;
						var pessoa = $scope.objeto;
						
						$scope.salvando = true;
					
						var classe = tipoPessoa.charAt(0).toUpperCase() + tipoPessoa.slice(1);
						
						if(classe=='Operadorsistema')
							classe="OperadorSistema";

						stService.executeGet("/projecao/execute-query",{query:  "from "+classe+" where nome like '%"+pessoa.nome+"%' and disable=0"}).success(function(data){
							
                                 if(data.itens.length==0 || nomeOriginal==pessoa.nome){
                                	 
                                	 stService.save(tipoPessoa, pessoa).success(function(data){
             							
             							$scope.salvando = false;

             							stUtil.showMessage("","Salvo com sucesso","info");	

             							$modalInstance.close();

             							if(callback)
             								callback(data.item);
             						}).error(function(){
             							$scope.salvando = false;
             							stUtil.showMessage("","Ocorreu um erro, verifique sua conexão","danger");
             						});
                                	 
                                 }
                                 else {
                                	 $scope.salvando = false;
                                	 stUtil.showMessage("","Já existe um registro com '"+pessoa.nome+"' cadastrado no sistema","danger");	
                                 }

						}).error(function(){
							$scope.salvando = false;
							stUtil.showMessage("","Ocorreu um erro, verifique sua conexão","danger");	
						});
						
						

					}

				}
			});
		}

		return {

			openDetalhePessoa:_openDetalhePessoa

		}
	});

})();

