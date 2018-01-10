"use strict";
(function(){

	angular.module("adm")

	.factory("carregadorUtil",function($uibModal){
           
		var _openItem = function(item, callback){
			
			$uibModal.open({
				animation: true,
				templateUrl:"app/carregador/detalhe.html",
				size:'lg',
				controllerAs:"vm",
				controller: function(stService, stUtil, $modalInstance, $route){
					
					var vm = this;
					vm.item = item || {};
					vm.salvandoItem  =  false;
					
					vm.salvarItem = function(){
						
						var _item = vm.item;
						vm.salvandoItem = true;
						stService.executePost("carregador/add/", _item).success(function(data){
							
							vm.item = data.item;
							vm.salvandoItem = false;
							stUtil.showMessage("","Salvo com sucesso","info");	
							callback("add", $modalInstance);
							
							
						}).error(function(){
							
							vm.salvandoItem = false;
							stUtil.showMessage("","Ocorreu um erro","danger");	
							callback("add-error", $modalInstance);
						});
						
					}
					
					vm.deletarItem = function(){
						
						stService.executePost("carregador/delete/", [vm.item.id]).success(function(){
							
							stUtil.showMessage("","Item deletado com sucesso","info");	
							callback("delete", $modalInstance);
							
						}).error(function(){
							
							stUtil.showMessage("","Ocorreu um erro ao deletar","danger");	
							callback("delete-error", $modalInstance);
						});
					}
					
					
				}
			});
			
		}

		return {
			openItem :_openItem
		
		};

	})

})();
