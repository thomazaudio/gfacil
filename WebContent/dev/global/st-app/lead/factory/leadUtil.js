"use strict";
(function(){

	angular.module("adm")

	.factory("leadUtil",function(stService, deviceDetector){
     
		var _addMetricaTipoDispositivo = function(){
			
			var _label = "acessos_";
			
			if(deviceDetector.isTablet()==true)
				_label+="tablet";
			
			else if(deviceDetector.isDesktop()==true)
				_label+="desktop";
			
			else if(deviceDetector.isMobile()==true)
				_label+="mobile";
			
			_addIntMetric(_label,1);
		}
		
		 var _addIntMetric = function(key_, value_){
			 
			 stService.executeGet("/lead/add-int-metric",{key: key_, value: value_}).success(function(){
				 
				 
			 });
			
		 }
		 
		 return{
			 addMetricaTipoDispositivo: _addMetricaTipoDispositivo,
			 addIntMetric: _addIntMetric
		 }

	})

})();