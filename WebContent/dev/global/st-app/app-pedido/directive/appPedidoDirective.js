"use strict";
(function(){

	angular.module("adm") 

	//Diretiva auxiliar utilizada em appSimplePedido
	.directive('appListSimplePedido', function (pedidoUtil,dateUtil,stService,stUtil,cacheGet,estoqueUtil) {
		return {
			restrict: 'E',
			templateUrl:'global/st-app/app-pedido/template-module/appListSimplePedido.html',
			scope:{
				itens:"=",
				labelQuantidade:"=",
				labelValorUnitario:"=",
				addPedido:"=",
				deletarPedido:"=",
				fator:"=",
				hideValorUnitario:"=",
				busca:"="
			},
			controller:function($scope){

				//Carrega o estoque de um produto
				$scope.carregaEstoqueProduto = function(produto){

					estoqueUtil.getEstoqueProduto(produto,function(prod){

						produto = prod;

					});
				}
				
				
				$scope.openDetalhePedido = function(pedido){
					
					pedidoUtil.openDetalhePedido(pedido, function(){
						
						
					});
				}

				$scope.editarProduto = function(produto){

					var prodToEdit = angular.copy(produto);

					estoqueUtil.openProdutoInModal(prodToEdit,function(prod){

						//Indice do pedido ao qual o produto editado pertence	
						var index = stUtil.buscaOb($scope.itens,prod.id,"produto.id");

						//Atualização do produto editado
						if(prod)
							$scope.itens[index].produto = prod;

					});

				}
			}
		}
	})

	//Diretiva para pedidos Simples(Esta forma utilizado produtos armazenados em cache)
	.directive('appSimplePedido', function (pedidoUtil,dateUtil,stService,stUtil,cacheGet,configUtil,$rootScope,st,$uibModal,estoqueUtil) {
		return {
			restrict: 'E',
			templateUrl:'global/st-app/app-pedido/template-module/appSimplePedido.html',
			require:'pedidos',
			scope:{

				labelValorUnitario:"=",//Label para exibição em preço unitário do produto
				labelQuantidade:"=",//label para quantidade de um pedido
				pedidos:"=",
				hideValorUnitario:"=",
				totalPedidos:"=",
				modoAtEstoque:"=",//1=somar, 2=subtrair
				attrBuscaProduto:"=",//atributo de produto utilizado para buscas padrão = nome

			},
			controller:"appSimplePedidoController"
		}
	})

	//Diretiva para pedidos
	.directive('appPedido', function (anchorScroll,$rootScope,config,stUtil,pedidoUtil,dateUtil,stService,movUtil,ngAudio,$location,$filter,$anchorScroll,$uibModal) {
		return {
			restrict: 'E',
			templateUrl:'global/st-app/app-pedido/template-module/appPedido.html',
			require:'pedidos',
			scope:{

				disableSetPrecoProduto:"=",//se ==true, o valor unitário no pedido não é setado ao selecionar um produto
				labelPrecoUnitario:"=",//Label para exibição em prelo unitário do produto
				labelQuantidade:"=",//label para quantidade de um pedido
				pedidos:"=",
				totalPedidos:"="

			},
			controller: function($scope){

				$scope.autoAdd=true;

				if(!$scope.pedidos)
					$scope.pedidos = [];

				$scope.pedido ={};
				$scope.tab=1;

				$scope.$watchCollection("pedidos",function(pedidos){

					$scope.totalPedidos = pedidoUtil.getTotalPedidos(pedidos);

				});

				$scope.$watch("pedido.produto",function(produto){

					console.log(produto);
					if(!produto.opcoes || produto.opcoes.length==0){

						$scope.pedido.quantidade =1;

						if(!$scope.disableSetPrecoProduto || $scope.disableSetPrecoProduto==false )
							$scope.pedido.valorUnitario = produto.preco;
					}

				},true);

				$scope.alterarTab = function(tab){

					$scope.tab=tab;
				}

				$scope.deletePedido = function(ped){

					ped.quantidade = 0;

				}

				//Mudança de produto pelo select
				$scope.changeValorUnit= function(valor){

					$scope.pedido.quantidade =1;
					$scope.pedido.valorUnitario = valor;

				}

				//Mudança de produto pelo código
				$scope.getProductByCode = function(cod,produto,quantidade,valor,pedidos){

					if(!cod || cod.length==0){

						stUtil.showMessage("","Digite o código ou nome do produto.","info");
						return;
					}

					if($scope.enter==1 && $scope.pedido.produto && $scope.pedido.produto.opcoes.length==0){
						$scope.addPedido(produto,quantidade,valor,pedidos);
						$scope.enter=0;
						return;
					}

					var qs = [];

					//Código de barras ou código interno
					if(cod.length>=8){
						qs.push("codigoBarras='"+cod+"'");
					}
					else{
						qs.push("codigo='"+cod+"'");
					}

					stService.getLikeMap("produto",qs,0,1,'').success(function(data){

						var prod = data.itens[0];

						if(prod){

							if($scope.autoAdd==true && (!prod.opcoes ||prod.opcoes.length==0)){
								$scope.addPedido(prod,1,prod.preco,$scope.pedidos);
								$scope.codProduto="";
								return;

							}

							$scope.enter=1;

						}
						else{
							$scope.enter=0;
							stUtil.showMessage("","Produto não encontrado!","danger");
						}

						var valorUnit = 0;
						$scope.pedido.produto =prod;

						if(prod && prod.preco)
							valorUnit = prod.preco;

						$scope.changeValorUnit(valorUnit);
						$scope.gotoAnchor("titulo-produto");


					});
				}

				$scope.editPedido = function(pedido,index){

					$("#painel-venda").click();

					$scope.pedidoAux = {};
					$scope.indexAux = index;

					for(var key in pedido){

						$scope.pedidoAux[key] = pedido[key];
					}

					$scope.pedido = pedido;
				}

				$scope.cancelEditPedido = function(){

					$scope.pdv.movimentacao.pedidos[$scope.indexAux] = $scope.pedidoAux;
					delete $scope.pedidoAux;
					$scope.pedido = {};
				}

				$scope.saveEditPedido = function(){

					delete $scope.pedidoAux;
					$scope.pedido = {};
				}

				//Adiciona um pedido
				$scope.addPedido = function(produto,quantidade,valorUnit,pedidos,opcao){

					if(!quantidade||quantidade==0){

						stUtil.showMessage("","Defina uma quantidade para o pedido.","danger");
					}
					var pedido ={}
					pedido.produto=produto;
					pedido.quantidade = quantidade;
					pedido.valorUnitario = valorUnit;
					pedido.opcao = opcao;
					pedidos.push(pedido);

					//Beep add pedido
					if($rootScope.config.confs.beepPdv && $rootScope.config.confs.beepPdv!='nenhum'){
						ngAudio.load("sound/"+$rootScope.config.confs.beepPdv).play();
					}


					if(!produto.opcoes || produto.opcoes.length==0)
						$scope.pedido.produto=null;

				}

				$scope.getTotalPedidos = function(pedidos){

					var total = 0;

					for(var i in pedidos){
						total+=(pedidos[i].valorUnitario||0) * (pedidos[i].quantidade||0); 
					}

					return total;

				}

				$scope.getMessageCodProduto = function(enter,produto){

					if(!produto)
						return"";

					if(produto.opcoes.length>0)
						return"";

					if(enter==0)
						return "Pressione enter para buscar.";
					else if(enter==1)
						return "Pressione enter para adicionar '"+produto.nome+"' aos pedidos."
				}

				$scope.codProdutoChange = function(cod){

					//Código de barras
					if(cod.length>=8){
						$scope.getProductByCode(cod);
					}
				}

				$scope.buscaPeloNome = function(){

					$("#busca-pelo-nome")[0].click();

				}

				$scope.codProdutokeyup = function(event,value){

					//Buscar pelo nome do produto
					if(RegExp("[a-z||A-Z]").test(value) && event.which!=8 && value.length>0){

						$scope.initialBusca=value;
						$("#codigo-produto")[0].blur();
						$scope.buscaPeloNome();
						$scope.codProduto='';

					}else{

						$scope.initialBusca=null;
					}

					if(event.which!=13){
						$scope.enter=0;
					}

				}

				//Para focus em quantidade e valor unitario
				$scope.enterPress = function(event,produto,quantidade,valor,pedidos){

					console.log("Produto");	
					console.log(produto);

					if(event.which==13 && produto && (!produto.opcoes || produto.opcoes.length==0) ){
						$scope.addPedido(produto,quantidade,valor,pedidos);
					}

				}

				//anchor
				$scope.gotoAnchor = function(id) {

					anchorScroll.scrollTo(id);

				};

			}
		}
	})
	.directive("itensPedido", function(){

		return{

			scope:{

				pedidos:"=",
				hideButtonTodos:"="
			},
			templateUrl:'global/st-app/app-pedido/template-module/itensPedido.html',
			controller:function($scope,$uibModal){

				//Abre os detalhes dos pedidos
				$scope.openDetalhe = function(pedidos){

					$uibModal.open({
						animation: true,
						templateUrl:"global/st-app/app-pedido/template-module/modalDetalhePedidos.html",
						size:'lg',
						controller:function($scope){

							$scope.pedidos = pedidos;
						}
					});	

				}
			}

		}
	})

})();
