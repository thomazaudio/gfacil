"use strict";

(function(){

	angular.module("adm")

	.directive('movsReadOnly',function(movUtil,dateUtil){

		return{

			templateUrl:"global/st-app/app-mov/template-module/templateMovsReadOnly.html",
			scope:{

				titulo:"=",
				subTitulo:"=",
				movs:"=",
			},

			controller:function($scope){

				$scope.getTotalMovs = function(movs){

					return  movUtil.getTotalMovs(movs);
				}

				$scope.fechar = function(ele){

					ele.$dismiss('cancel');

				}
			}

		}
	})
	
})();

