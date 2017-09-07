"use strict";
(function(){
	angular.module("adm") 

	.factory("pdvUtil",function($uibModal,$location,stUtil,stService,estoqueUtil,$rootScope,$route,movUtil,$filter){

		//abre uma venda utilizando um modal
		var _openVendaInModal = function(pdv, callback){

			if(pdv)
				var pdv = {data:{item:pdv}};

			$uibModal.open({
				animation: true,
				backdrop: 'static',
				templateUrl:"global/st-app/app-pdv/template-module/pdv-ficha.html",
				controller:"pdvFichaController",
				bindToController:true,
				controllerAs: "vm",
				size:"lg",
				resolve: {
					callback:callback,
					pdv:pdv || {}
				}

			});

		}

		var _getTotalPedidos = function(pedidos){

			var total = 0;

			for(i in pedidos){
				total+=pedidos[i].valorUnitario * pedidos[i].quantidade; 
			}

			return total;

		}

		//Salva o estado de um pdv a partir do botão de retirada
		var _savePdvFromRetirada =function(pdv,callback){

			stService.save("pdv",pdv).success(function(data){

				stUtil.showMessage("","Venda atualizada com sucesso!","info");
				callback(data.item);

			}).error(function(){

				pdv.carregado = !pdv.carregado;
				callback(pdv);
				stUtil.showMessage("","Ocorreu um erro ao atualizar a venda, verifique sua conexão com a internet e tente novamente.","danger");

			});

		};

		//Vai para um pdv a partir de uma movimentação
		var _goToPdvFromMov = function(mov){

			var idMov = mov.id;

			if(mov.originalMov)
				idMov = mov.originalMov.id;

			stService.getLike("pdv",idMov,"id_movimentacao").success(function(data){

				var pdv = data.itens[0];
				_goToPdv(pdv.id,pdv.tipoPdvLancamento);

			});

		}

		var _goToPdv = function(id){

			stService.getById("pdv",id).success(function(data){

				_openVendaInModal(data.item);

			});

		}

		var _deletarVenda = function(pdv,callback){

			//Deleta o PDV
			stService.executePost("pdv/delete/",pdv).success(function(data){

				callback(data);

			});
		}

		return{

			savePdvFromRetirada: _savePdvFromRetirada,
			goToPdv:_goToPdv,
			getTotalPedidos:_getTotalPedidos,
			goToPdvFromMov: _goToPdvFromMov,
			deletarVenda:_deletarVenda,
			openVendaInModal:_openVendaInModal 
		}

	})

})();
