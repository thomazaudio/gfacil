"use strict";
(function(){

	angular.module("adm") 

	.controller("parcelaMovController",function($scope,dateUtil,movUtil,$window,$filter,pedidoUtil){

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

		//Realiza o recalculo automátio do valor das parcelas
		//O recalculo de parcelas é realizado com base no valor total dos pedidos da movimentação original
		$scope.recalcularParcelas = function(){

			if(! $scope.originalMov.pedidos || $scope.originalMov.pedidos.lenght==0)
				return;

			var valorParcela = pedidoUtil.getTotalPedidos($scope.originalMov.pedidos)/$scope.movs.length;

			console.log("Valor da parcela: "+valorParcela);

			for(var i in $scope.movs){

				$scope.movs[i].valor = valorParcela;
			}

			setAlerts();
		}

		//Adicionar uma nova parcela as lista de parcelas
		$scope.addParcela = function(mov){

			//A nova parcela é um espelho da movimentação original
			var basicMov = angular.copy($scope.originalMov);
			basicMov.pedidos=null;
			basicMov.valor = 0;
			basicMov.id=0;
			basicMov.baixada=false;
			basicMov.data = new Date();
			$scope.movs.push(mov||basicMov);

			//Corrige mov.parcela e mov.numeroParcela de todas as parcelas
			resetInfoParcelas();

			$scope.recalcularParcelas();
		}

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

		$scope.deletarParcela = function(parcela,index){

			//Deleta parcela no Backend caso possua um id(Cadastrado)
			if(parcela.id){

				var msg = "Tem certeza que deseja deletar esta parcela?"
					var confirm = ($window.confirm(msg) === true);

				if(confirm==true){
					movUtil.deleteMov(parcela, function(){

						$scope.movs.splice(index,1);

						setAlerts();

					},'onlyPeriod');//onlyPeriod é informado para deletar a movimentação diretamente
				} 

			}

			//Corrige mov.parcela e mov.numeroParcela de todas as parcelas
			resetInfoParcelas();

			setAlerts();

			//$scope.recalcularParcelas();

		}

		//Escuta alteraçoes na movimentação original ara mudança das parcelas 
		$scope.$watch('originalMov',function(originalMov){

			if(!$scope.movs[0])
				return;

			var valorAux = $scope.movs[0].valor;

			//$scope.movs[0] represnta a movimentação original
			//Sempre quando há mudanças em originalMov, movs[0] também muda
			$scope.movs[0] = originalMov;

			//Caso tenha apenas uma parcela definida, o valor sempre é refletido de acordo com a movimentação original

			if(originalMov.pedidos && originalMov.pedidos.length>0){

				if($scope.movs.length==1){
					$scope.movs[0].valor = pedidoUtil.getTotalPedidos(originalMov.pedidos);
					
					console.log("valor da originalMov: ");
					console.log( pedidoUtil.getTotalPedidos(originalMov.pedidos));
				}else{
					$scope.movs[0].valor = valorAux;
				}
			}

			setAlerts();

		},true);

		//Mudança no valor das parcelas (Exceto a original)
		$scope.changeParcela = function(){

			setAlerts();
		}

		//Altera as informações mov.numeroParcelas e mov.parcela
		function resetInfoParcelas(){

			var numeroParcelas = $scope.movs.length;

			for(var i = 0;i<$scope.movs.length;i++){

				$scope.movs[i].parcela = i+1;
				$scope.movs[i].numeroParcelas = numeroParcelas;
			}

		}

		//Seta alerta de total das parcelas e alerta de valor das parcelas maior/menor que o total da venda
		function setAlerts(){

			$scope.totalParcelas = 0;
			for(var i in $scope.movs){
				$scope.totalParcelas+=$scope.movs[i].valor;

			}

			setTotalAlert($scope.originalMov);
		}

		//Diferenca entre o valor das parcelas e o valor da movimentção original
		function getDiferenca(){

			var totalParcelas = movUtil.getTotalMovs($scope.movs);
			return  totalParcelas -  movUtil.getTotalMov($scope.movs[0]);

		}

		function setTotalAlert(originalMov){

			var msg;
			var totalParcelas = movUtil.getTotalMovs($scope.movs,"valor");
			var valorOriginalMov = movUtil.getTotalMov(originalMov,"pedidos");
			var diferenca = $filter("number") (valorOriginalMov - totalParcelas,2);

			if(valorOriginalMov!=totalParcelas){

				msg="O valor total das parcelas é diferente do valor total dos pedidos (Diferença: R$"+diferenca+")";

			}

			$scope.totalAlert = msg;
		}

	})

})();
