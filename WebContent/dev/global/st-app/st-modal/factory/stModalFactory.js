(function(){
	angular.module("adm") 

	//Modal em forma de serviço
	.factory("$stModal",function($uibModal){
		var _show = function(modal){

			$uibModal.open({
				animation: true,
				template: '<div class="modal-header">'+
				'<div class="modal-title><i class="fa fa-exclamation-triangle" aria-hidden="true"></i> {{modal.titulo ||"OPS!"}}</div>'+
				'</div>'+
				'<div class="modal-body">'+
				'<p class="text-muted">{{modal.mensagem}}</p>'+
				'</div>'+
				'<div class="modal-footer">'+
				'<button ng-click="close(this)" class="btn  btn-block">Ok</button>'+
				'</div>',
				controller: 

					function($scope,modal){

					$scope.close = function(){

						modal.dismiss('cancel');
					}

				}
			,
			size: 100,

			});

		}

		return {
			show: _show,

		};

	});

})();
