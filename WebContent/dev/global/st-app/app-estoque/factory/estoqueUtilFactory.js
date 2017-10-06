"use strict";
(function(){

	angular.module("adm") 

	.factory("estoqueUtil",function($http, config, stService, cacheGet, cachePost, $stModal, stUtil, $filter, movimentacaoService, $stDetalhe, $uibModal){

		var _openPrecosCompraProduto = function(produto){

			var _modalInstance =   $uibModal.open({
				animation: true,
				templateUrl:"global/st-app/app-estoque/template-module/modalPrecosCompraProduto.html",
				size:'lg',
				controller:function($scope){

					$scope.produto = produto;

					var query = "select movimentacao.dataCadastro, movimentacao.pessoa.nome, valorUnitario, quantidade from Pedido where tipoEntrada=1 and id_produto="+produto.id;

					stService.executeGet("projecao/execute-query",{query:query}).success(function(data){

						$scope.results = data.itens;

					});

				}

			});

		}



		var _cadProdutoStep = function(produto, callback){

			var _modalInstance =   $uibModal.open({
				animation: true,
				templateUrl:"global/st-app/app-estoque/template-module/cadProdutoStep.html",
				size:'lg',
				controller:function($scope, $modalInstance){

					$scope.produto = produto || {};
					
					var nomeOriginal =  $scope.produto.nome;

					$scope.cancelAction = function(){

						if($scope.step==1){
							$modalInstance.close();
						}
						else{
							$scope.changeStep($scope.step-1);
						}

					}

					$scope.cadastrarProduto = function(){
						
						var produto = $scope.produto;
						
						console.log("Resultado: ");
						console.log(cacheGet.get("produto","nome",produto.nome));
						
						//Evitar cadastro duplicado
						if( cacheGet.get("produto","nome",produto.nome).length>0 && produto.nome != nomeOriginal)
						{
							stUtil.showMessage("","Já existe um registro com '"+produto.nome.toUpperCase()+"' cadastrado no sistema","danger");
							$scope.changeStep(1);
							return;
						}
						
						if(!produto.nome){
							
							stUtil.showMessage("","Informe um nome para o produto","danger");
							$scope.changeStep(1);
							return;
						}
						
						if($scope.step!=3 && (produto.setQuantidade!=false)){
							$scope.changeStep($scope.step+1);
							return;
						}

						$scope.salvando = true;

						stService.executePost("produto/add/", produto).success(function(data){

							var pedidoEntrada = {};
							pedidoEntrada.produto = data.item;
							pedidoEntrada.tipoEntrada=1;
							pedidoEntrada.quantidade = $scope.produto.quantidade;

							stService.executePost("pedido/add/", pedidoEntrada).success(function(data){

								$scope.salvando = true;
								$modalInstance.close();
								callback(data.item.produto);

							});

						});


					}

					$scope.changeStep = function(step){

						$scope.step=step;

						var _infoModal = {};

						//Escolha de produtos
						if(step==1){
							_infoModal.titulo = "Nome do produto";
							_infoModal.okActionLabel = "Avançar";
							_infoModal.okActionIcon = "fa-angle-double-right";
						}
						
						else if(step==2){
							_infoModal.titulo = "Atalho";
							_infoModal.okActionLabel  = "Avançar";
							_infoModal.okActionIcon = "fa-angle-double-right";
						}
						
						else if(step==3){
							_infoModal.titulo = "Quantidade em estoque";
							_infoModal.okActionLabel  = "Finalizar";
							_infoModal.okActionIcon = "fa-check";
						}

						$scope.infoModal = _infoModal;

					}

					$scope.changeStep(1);


				}

			});

		}


		//Recupera produtos com estoque baixo
		var _getProdutosEstoqueMin = function(callback){

			stService.executeGet("projecao/execute-query",
					{query:"select p.id,p.nome,'',p.quantidade from Produto p where (p.quantidade<=p.minQuant) and p.disable =0"}).success(function(data){

						callback(data.itens);

					}).error(function(){					
					});
		}

		//Modal para entrada de mercadoria
		var _openEntradaMercadoria = function(entradaMercadoria,callback){

			var _modalInstance =   $uibModal.open({
				animation: true,
				backdrop: 'static',
				templateUrl:"global/st-app/app-estoque/template-route/entradaMercadoria.html",
				size:'lg',
				controller:"entradaMercadoriaController",
				resolve:{
					entradaMercadoria: entradaMercadoria || {},
					callback:callback
				}

			});

		}

		//Ajustar estoque de um produto
		var _openEdit = function(produto){

			var _modalInstance =   $uibModal.open({
				animation: true,
				templateUrl:'global/st-app/app-estoque/template-module/estoqueEdit.html',
				size:'lg',
				controller:"editEstoqueController",
				controllerAs:"vm",
				bindToController:true,
				resolve:{
					produto:function(){

						return produto;
					}

				}

			});

		}

		var _openProdutoInModal = function(produto,callback){

			//Cadastro de novo produto
			if(!produto || !produto.id){
				_cadProdutoStep(produto, callback);
				return;
			}

			var _modaI = $uibModal.open({
				animation: true,
				templateUrl:'global/st-app/app-estoque/template-module/cadProdutoModal.html',
				size:'lg',
				controller:function($scope, nfeUtil, $modalInstance){

					$scope.produto = produto || {};
					$scope.salvar = function(){

						$scope.salvando = true;
						stService.save("produto",$scope.produto).success(function(data){

							$scope.salvando = false;
							$modalInstance.close();
							callback(data.item);

						});
					};

				}
			});
		};


		//Recupera o balanço de estoque de um produto
		//Caso o produto seja definido, retorna o produto completo com a quantidade já atualizada
		//Caso no produto NÃO seja definido, retorna apenas a quantidade
		function _getEstoqueProduto(produto,callback){

			var basicQuery = " disable=0 ";

			if(produto)
				basicQuery+=" and produto.id="+produto.id;

			basicQuery+=" and produto.disable=0";

			var  querysEntrada = [basicQuery,"tipoEntrada=1"];

			var querysSaida= [basicQuery,"tipoEntrada=0"];

			var basicInfo = {
					columns:"sum(quantidade)",
					objeto:"Pedido",

			}

			//Movimentações de entrada
			basicInfo.qs = querysEntrada;
			stService.getProjecoes(basicInfo).success(function(data){

				var entradas = data.itens[0]||0;

				//Movimentações de saida
				basicInfo.qs = querysSaida;
				stService.getProjecoes(basicInfo).success(function(data){

					var  saidas = data.itens[0] || 0;

					var balanco = entradas - saidas;

					//Caso seja informado um produto com parametro, o produto completo é retornado
					if(produto){
						//Atualiza a quantidade dp produto informado
						produto.quantidade = balanco;
						callback(produto);

					}

					else {
						callback(balanco);
					}

				}).error(function(){

					callback();
				})

			}).error(function(){

				callback();
			});

		}

		return {

			openEdit: _openEdit,
			getProdutosEstoqueMin:_getProdutosEstoqueMin,
			openProdutoInModal:_openProdutoInModal,
			getEstoqueProduto: _getEstoqueProduto,
			openEntradaMercadoria:_openEntradaMercadoria,
			openPrecosCompraProduto:_openPrecosCompraProduto,
			cadProdutoStep: _cadProdutoStep

		};

	})

})();
