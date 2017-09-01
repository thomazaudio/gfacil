"use strict";

(function(){

	angular.module("adm")

	.directive("buttonBaixaMov",function(movUtil){

		return{
			templateUrl:'buttonBaixaMov.html',
			scope:{
				mov:"=",
				id:"=",
				templateVersion:"@"
			},

			controller:function($scope){

				$scope.alterarBaixa = function(mov){
					
					console.log("mov: ");
					console.log(mov);

					if(!mov.id && ( !mov.isAbstract || mov.isAbstract==false))
						return;

					movUtil.alterarBaixa(mov,function(){

						console.log("call");
					});

				}
			}	
		}

	})

})();

