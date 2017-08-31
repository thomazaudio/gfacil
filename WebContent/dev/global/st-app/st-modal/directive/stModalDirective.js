(function(){

	angular.module("adm") 

	.directive('modalContent', function($templateCache) {
		return {
			//templateUrl:'global/st-app/st-modal/template-module/modalContent.html',
			templateUrl:'modalContent.html',
			restrict:"E",
			transclude:true,
			scope:{

				titulo: "=",
				iconeTitulo: "=",
				modalInstance: "=",
				labelCloseButton: "=",
				disableOkButton:"=",
				loadingOkAction:"=",
				okAction:"=",
				okActionLabel:"=",
				forceOkActionShowLabel:"=",//se true força a exibição do label presente no okAcion
				okActionIcon:"=",
				cancelAction:"=",
				deleteAction:"=",
				item: "="//Objeto referencia, ex: pdv

			},
			controller:function($scope, $timeout){
				
				
				$scope.disableOkButton = $scope.disableOkButton || false;
				
				$scope.currentStep = 0;

				$scope.cancelAction  =  $scope.cancelAction || function(){

					if($scope.modalInstance)
						$scope.modalInstance.$dismiss("cancel");
				}
				
				
			
		        
		        $scope.localAction = function(){
		        	
		        	console.log("localAction");
		        }
				

			}

		};
	})

	//Modal em forma de diretiva
	.directive("stModal",function($filter){

		return {

			templateUrl:'stModal.html',
			restrict:"AE",
			transclude:true,
			scope:{

				titulo:"@",
				icon:"@",
				idmodal:"@",
				size:"@",
				okIcon:"@",
				okLabel:"@"

			},

			link: function($scope, element, attrs) {

			}

		}

	})

})();
