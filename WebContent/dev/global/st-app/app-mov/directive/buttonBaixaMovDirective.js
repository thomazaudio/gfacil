"use strict";

(function(){

	angular.module("adm")

	.directive("buttonBaixaMov",function(){

		return{
			templateUrl:"global/st-app/app-mov/template-module/buttonBaixaMov.html",
			scope:{
				mov:"=",
				id:"=",
				showPagamentos:"=",
				templateVersion:"@",
				label:"@"
			},

			controller:function($scope, pdvUtil, movUtil, stUtil){
				
				$scope.openParcelas = function(mov){
					
				    //Caso seja lançamento diferente de vendas um uma movimentação que já é uma parcela
					if(mov.tipoOperacaoLancamento!=1 || mov.originalMov){
						
						stUtil.showMessage("","Não é possível definir parcelas para esta movimentação", "danger");
						return;
					}
					
					
					pdvUtil.getPDVByMovId(mov, function(pdv){
						
						movUtil.openParcelasInModal(pdv.movimentacao, pdv.parcelas);
					});
				
					
				}

				$scope.alterarBaixa = function(mov){
					
					if(!mov.id && ( !mov.isAbstract || mov.isAbstract==false))
						return;

					movUtil.alterarBaixa(mov,function(){

					});

				}
			}	
		}

	})

})();

