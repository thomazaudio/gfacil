"use strict";
(function(){
	angular.module("adm").controller("listaProdutoController",function(estoqueUtil,$rootScope,stUtil,$scope,$location,$stModal,stService,$route,$stDetalhe, configUtil){

		$scope.stepsProduto = [
		                       
		                       {
		                        	  title: "Produtos",
		                        	  position: "centered",
		                        	  description: "Nesta tela é possível visualizar todos os seus produtos",
		                        	  width: 300,
		                        	  nextButtonText:"OK",
		                        	  overlayOpacity: 0,
		                          },
		                          
		                         
		                       
		                       {
		                    	   title: "Editar",
		                    	   position: "bottom",
		                    	   description: "Se quiser alterar alguma informação é só clicar aqui :-)",
		                    	   attachTo: "#card_edit_0",
		                    	   showPreviousButton:false,
		                    	   nextButtonText:"OK",
		                    	   overlayOpacity: 0,
		                    	   xOffset:-110,
		                    	   yOffset:-10
		                    	  
		                       },
		                       
		                       {
		                    	   title: "Estoque do produto",
		                    	   position: "bottom",
		                    	   description: "A quantidade restante do item é atualizada automaticamente a cada venda :-)",
		                    	   attachTo: "#produto_estoque_0",
		                    	   showPreviousButton:false,
		                    	   nextButtonText:"OK",
		                    	   arrowClass:"onboarding-quantidade-produto-arrow",
		                    	   overlay:true,
		                    	   overlayOpacity: 0.05,
		                    	   xOffset:-59,
		                    	   yOffset:-10,
		                    
		                    	  
		                       },
		                      
		                       {
		                    	   title: "Cadastro",
		                    	   position: "left",
		                    	   description: "Para cadastrar um novo produto é só clicar aqui",
		                    	   attachTo: "#button-add-produto",
		                    	   showPreviousButton:false,
		                    	   doneButtonText:"OK",
		                    	   overlay:true,
		                    	   overlayOpacity: 0.2, 
		                    	   xOffset:20,
		                    	   yOffset:-59
		                    	 
		                    	   
		                       }
		                       ];


		var atalhoBuscaProduto = "";
		if($rootScope.config)
			atalhoBuscaProduto = $rootScope.config.confs.atalhoBuscaProduto ||'nome';

		else
			atalhoBuscaProduto="nome";

		var placeHolder = 'Digite o nome do produto';

		if(atalhoBuscaProduto=='codigoBarras'){

			placeHolder = 'Digite o código de barras  do produto';
		}
		
		$scope.finalizarOnboarding = function(){
			
			configUtil.setConfig("visualizouOnboardingProdutos","true", function(){
				
				$location.path("/inicio");
			})
		
		}

		$scope.addEntradaMercadoria = function(){
			estoqueUtil.openEntradaMercadoria();
		}

		$scope.verPrecosCompra = function(produto){

			estoqueUtil.openPrecosCompraProduto(produto);
		}

		$scope.buscaEspecial = {

				attr:atalhoBuscaProduto,
				tipo:'input',placeHolder:placeHolder,
				icon:'fa-list'	
		}

		$scope.deletarProduto = function(produto){

			produto.disable = 1;
			stService.save("produto",produto).success(function(data){

				$route.reload();
				stUtil.showMessage("","Produto Deletado com sucesso!","info");		

			});

		}

		$scope.cadProdutoStep = function(){

			estoqueUtil.cadProdutoStep(function(produto){


			});
		}	

		$scope.openAdd = function(opcao,produto){

			estoqueUtil.openAdd(opcao,produto,function(){


			});

		}

		$scope.openDetalhe = function(produto){

			estoqueUtil.openProdutoInModal(produto,function(res){

				$route.reload();

			});

		}

		$scope.getTotalItens = function(){

			//Recupera o estoque de todos os itens
			estoqueUtil.getEstoqueProduto(null,function(total){

				$scope.totalItensEstoque = total;
			});
		}

		$scope.getTotalItens();

	});

})();