"use strict";
(function(){

	angular.module("adm") 

	.controller("parcelaMovController",function($scope, movUtil, $window, $filter, pedidoUtil, $uibModal, stUtil){

		
		$scope.salvar = function(movs){
			
			    $scope.salvando = true;
			    
			    if(movs[0].id){
				    movUtil.cadMov(movs, function(res){
				    	if(res)
				    		stUtil.showMessage("","Salvo com sucesso!");
				    	$scope.salvando = false;
				    	
				    	_init();
				    });
			    }
			    else{
			    	
			    	$scope.salvando = false;
			    }
		}

		//Realiza o recalculo automátio do valor das parcelas (deixa todas as parcelas com valores iguais)
		//O recalculo de parcelas é realizado com base no valor total dos pedidos da movimentação original
		$scope.recalcularParcelas = function(){

			if(! $scope.originalMov.pedidos || $scope.originalMov.pedidos.lenght==0)
				return;

			var valorParcela = pedidoUtil.getTotalPedidos($scope.originalMov.pedidos)/$scope.movs.length;
			
			for(var i in $scope.movs){

				$scope.movs[i].valor = valorParcela;
			}

		}

		$scope.escValorParcela = function(){

			movUtil.escValorParcela(function(valor){

				_addParcela(null, valor)

			});

		}

		$scope.deletarParcela = function(parcela,index,movs){

			//Deleta parcela no Backend caso possua um id(Cadastrado)
			if(parcela.id){

				var msg = "Tem certeza que deseja deletar esta parcela?"
					var confirm = ($window.confirm(msg) === true);

				if(confirm==true){
					movUtil.deleteMov(parcela, function(){

						movs.splice(index,1);

					},'onlyPeriod');//onlyPeriod é informado para deletar a movimentação diretamente
				} 

			}else{
				movs.splice(index,1);
			}

			//Corrige mov.parcela e mov.numeroParcela de todas as parcelas
			resetInfoParcelas();

		}

		//Mudança no valor das parcelas (Exceto a original)
		$scope.changeParcela = function(){

			var soma = getTotalMovsExcetoOriginal();


			$scope.movs[0].valor = movUtil.getTotalMov($scope.originalMov, "pedidos")  - soma;

		}

		//Adicionar uma nova parcela as lista de parcelas
		var _addParcela = function(mov, valor){

			//A nova parcela é um espelho da movimentação original
			var basicMov = angular.copy($scope.originalMov);
			basicMov.pedidos =null;
			basicMov.valor = valor;
			basicMov.id=0;
			basicMov.baixada = true;
			basicMov.data = $scope.originalMov.data || new Date();
			$scope.movs.push(mov||basicMov);

			//Corrige mov.parcela e mov.numeroParcela de todas as parcelas
			resetInfoParcelas();

			
		}
		$scope.addParcela = _addParcela;

		function _init(){

			if(!$scope.originalMov)
				$scope.originalMov = {};

			//A movimentação original sempre é a primeira parcela (Caso ela já não seja uma parcela)
			if(!$scope.originalMov.originalMov)
				$scope.originalMov.parcela= 1;

			//Caso a data de vencimento não esteja definida
			if(!$scope.originalMov.data)
				$scope.originalMov.data  = new Date();

			//Parcelas
			$scope.movs  = $scope.movs || [];

			//Recupera as parcelas definidas anteriormente para exibição
			if($scope.originalMov.id){

				movUtil.getParcelas($scope.originalMov.id,function(itens){
					itens = itens||[];
					//Adicionar a movimentação original na primeira posição
					itens.unshift($scope.originalMov);
					$scope.movs = itens;

				});
			}
			else {
				$scope.addParcela($scope.originalMov);
			}


			//Corrige mov.parcela e mov.numeroParcela de todas as parcelas
			resetInfoParcelas();

		}
		_init();

		//Escuta alteraçoes na movimentação original ara mudança das parcelas 
		$scope.$watch('originalMov',function(originalMov){

			if(!$scope.movs[0])
				return;

			var valorAux = $scope.movs[0].valor;

			//$scope.movs[0] represnta a movimentação original
			//Sempre quando há mudanças em originalMov, movs[0] também muda
			$scope.movs[0] = originalMov;

			resetInfoParcelas();

			

		},true);


		function getTotalMovsExcetoOriginal (){

			var soma = 0;
			for(var i = 1;i<$scope.movs.length;i++){

				soma+=$scope.movs[i].valor;

			}

			return soma;

		}


		//Altera as informações mov.numeroParcelas e mov.parcela
		function resetInfoParcelas(){

			var numeroParcelas = $scope.movs.length;

			for(var i = 0;i<$scope.movs.length;i++){

				$scope.movs[i].parcela = i+1;
				$scope.movs[i].numeroParcelas = numeroParcelas;
			}
			
			if($scope.movs[0])
			   $scope.movs[0].valor = pedidoUtil.getTotalPedidos($scope.originalMov.pedidos) - getTotalMovsExcetoOriginal();
			
			setTotalParcelas();

		}

		//Seta alerta de total das parcelas e alerta de valor das parcelas maior/menor que o total da venda
		function setTotalParcelas(){

			var _total = 0;
			for(var i in $scope.movs){
				_total += $scope.movs[i].valor;

			}
			
			$scope.totalParcelas = _total;
			
			console.log("Total parcelas: "+_total);

		}


		function getDiferenca(originalMov){

			var totalParcelas = movUtil.getTotalMovs(angular.copy($scope.movs),"valor");
			var valorOriginalMov = movUtil.getTotalMov(angular.copy(originalMov),"pedidos");
			var diferenca = $filter("number") (valorOriginalMov - totalParcelas,2);
			return diferenca;
		}


	})

})();
