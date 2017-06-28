"use strict";
(function(){

	angular.module("adm")
	
	.config(['growlProvider', function (growlProvider) {
     growlProvider.globalTimeToLive({success: 1000, error: 2000, warning: 3000, info: 4000});
    }])
    
  

})();
