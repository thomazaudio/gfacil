"use strict";
(function(){

	angular.module("adm") 

	.controller("detalheNFeController",function($scope, idNFe,idMov,stService,stUtil,nfeUtil){

		//Caso seja passado o id da NFe
		//Nesse caso, ocorre um detalhamento de uma NFe já criada anteriormente
		if(idNFe){

			$scope.carregandoNFe = true;
			stService.getById("nfe",idNFe).success(function(data){

				var nfe = data.item;
				//nfe.infNFe = JSON.parse(nfe.infNFe);
				$scope.nfe = nfe;
				$scope.carregandoNFe = false;
				
				console.log("NFe no escopo: ");
				console.log($scope.nfe);
			

			}).error(function(){

				stUtil.showMessage("Ocorreu um erro ao carregar a NFe");
				$scope.carregandoNFe = false;
			});

		}
		
		//Cria-se uma nova NFe a partir de uma movimentação
		else if(idMov){
			
			nfeUtil.movToInfNFe(idMov,function(nfe){
				
				$scope.nfe = nfe;
				
			});
				
		}
		
		//Alteração de destinatário
		$scope.alterarDestinatario = function(pessoa){

			$scope.nfe.infNFe.dest = pessoa;
			$scope.nfe.infNFe.dest.enderDest = pessoa.endereco;

		}

		
		//Validação de campos
		$scope.validaNFe = function(nfe){
			
			nfeUtil.validaNFe(nfe,function(erros){
				
				$scope.erros = erros;
				
				if(erros.length==0){
					stUtil.showMessage("","NFe validada com sucesso!","info");
				}else{
					
					stUtil.showMessage("","Alguns erro(s) foram encontrados ao validar a NFe","danger");
				}
				
			
			});
			
		}
		
		$scope.salvar = function(nfe){

			stService.save("nfe",nfe).success(function(){


			});

		}

	})

})();
