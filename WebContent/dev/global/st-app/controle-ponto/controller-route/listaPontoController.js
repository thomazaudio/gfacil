"use strict";
(function(){
angular.module("adm").controller("listaPontoController",function(stService,stUtil,$uibModal,dateUtil){
	
	var vm  = this;
	
	vm.editarPonto = function(ponto){
		
		$uibModal.open({
			animation: true,
			templateUrl:"view/registroponto/modalEditPonto.html",
			size:'lg',
			controller:function($scope){
				
			    $scope.dataIni = new Date(ponto.dataInicio);
			    $scope.dataFim = new Date(ponto.dataFim);
			    $scope.timeIni = new Date(ponto.dataInicio);
			    $scope.timeFim = new Date(ponto.dataFim);
                $scope.ponto = ponto;

				$scope.salvar = function(dataIni,dataFim,timeIni,timeFim,modal){

					var dataInicio = new Date(dateUtil.formatDate(dataIni));
					dataInicio.setHours(timeIni.getHours(),timeIni.getMinutes(),timeIni.getSeconds());
					
					var dataFim = new Date(dateUtil.formatDate(dataFim));
					dataFim.setHours(timeFim.getHours(),timeFim.getMinutes(),timeFim.getSeconds());
					
					dataInicio.setDate(dataInicio.getDate()+1);
					dataFim.setDate(dataFim.getDate()+1);
					
					ponto.dataInicio = dataInicio;
					ponto.dataFim = dataFim;
					
					stService.save("registroponto", ponto).success(function(data){
						
						stUtil.showMessage("","Alterado com sucesso!","info");
						
					});
					
					modal.$dismiss('cancel');

				}

			}
		});
	}
	
	vm.deletarRP = function(index,rp,objetos){
		
		objetos.splice(index,1);
		
		stService.apagar("registroponto",[rp.id]).success(function(){
			stUtil.showMessage("","Registro excluido com sucesso!");
		});
	}
	
});
})();