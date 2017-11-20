"use strict";
(function(){
	angular.module("adm") 

	//Modal em forma de serviço
	.factory("$stModal",function($uibModal){
		var _showAlert = function(modal){

			$uibModal.open({
				animation: true,
				template:"global/st-app/st-modal/template-module/modalAlert.html",
				controller:function($scope,modal){

					$scope.modal = modal;
					$scope.close = function(){

						modal.dismiss('cancel');
					}

				},
			
			size: 100,

			});

		}

		return {
			showAlert: _showAlert,

		};

	});

})();
