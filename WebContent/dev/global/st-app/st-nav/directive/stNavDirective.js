"use strict";
(function(){

	angular.module("adm") 

	.directive('stNav',function($timeout){

		return{
			restrict:"E",
			templateUrl:'global/st-app/st-nav/template-module/stNav.html',
			scope:{

				activeTab:"=",
				tabs:"="
			},

			controller:function($scope){

				if(!$scope.activeTab)
					$scope.activeTab=0;

				$scope.alterarTab =function (tab){

					$scope.activeTab = tab;

				}

			}
		}
	})

})();
