"use strict";

(function(){

	angular.module("adm")

	//Diretiva para lista de movimentações
	.directive('buttonTutorial', function ($uibModal, tutorialUtil){
		return {
			restrict: 'AE',
			
			link: function(scope, element, attrs) {
			
				element.bind('click', function(){
					
					$uibModal.open({
						animation: true,
						templateUrl:"global/st-app/st-tutorial/template-module/tutorialList.html",
						size:'lg',
						controllerAs:"vm",
						bindToController:true,
						controller:function($scope){
							
							var vm = this;
							vm.tutoriais = [
							    {
								  titulo: "Vendas",
								  descricao:"Como realizar uma venda, listagem de vendas",
								  linkMobile:"https://www.youtube.com/watch?v=sOdiWXFF9Ms",
								  linkDesktop:"https://www.youtube.com/watch?v=93RTB0PXAU0&feature=youtu.be"
							   },
							   {
									  titulo: "Estoque",
									  descricao:"Cadastro e listagem de produtos",
									  linkMobile:"",
									  linkDesktop:""
								   }      
							 ];
							
							vm.openTutorial = function(item){
								
								tutorialUtil.openDetalheTutorial(item);
							}
							
						}
					});
					
				});
			}
		}
	})

})();

