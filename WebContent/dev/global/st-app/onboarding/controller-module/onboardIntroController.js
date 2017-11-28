"use strict";
(function(){
	angular.module("adm") 

	.controller("onboardIntroController",function($rootScope, $modalInstance, estoqueUtil, $location,  $uibModal, configUtil, leadUtil, $timeout){
		
		var vm = this;
		vm.showCountClientes=true;
		vm.proj = {data:[[100]], labels:[""]};
		vm.proj.colours =  [{
		    fillColor: "#3276b1",
		    strokeColor: "#3276b1",
		    highlightFill: "#3276b1",
		    highlightStroke: "#3276b1"
		}];

		vm.step = 1;
		vm.labelButton="Próximo";
		
		vm.toInicio = function(){
			 $modalInstance.close();
			$location.path("/inicio");
		}
		
		vm.nextStep = function(){
			
			
			if(vm.step==1){
				
				$timeout(function(){
					vm.showCountClientes=false;
				}, 5000);
			}
			
			else if(vm.step==2){
				configUtil.setConfig("visualizouOnboardIntro","true");
				
				leadUtil.addSubsMetric("onboard_intro", new Date().getTime());
				vm.labelButton="Cadastrar  produto";
				vm.showButtonCadastrarProdutoDepois = true;
			}
			
			else if(vm.step==3){
				$modalInstance.close();
				estoqueUtil.cadProdutoStep({}, function(produto){
					console.log("Produto cadastrado: ");
					console.log(produto);
					 $uibModal.open({
							animation: true,
							templateUrl:"global/st-app/app-estoque/template-module/sucessoProduto.html",
							size:'lg',
							controller: function($scope){
								
								$scope.toProdutos = function(){
									$location.path("/produto");
								}
							}
					 });
					
					//$location.path("/produto");
				});
			}
			
			vm.step++;
			
		}
	
	})

})();
