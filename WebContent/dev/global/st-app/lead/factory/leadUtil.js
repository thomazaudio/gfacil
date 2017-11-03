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

			_addIncMetric(_label,1);
		}

		var _addIncMetric = function(key_, value_){

			stService.executeGet("/lead/add-inc-metric",{key: key_, value: value_}).success(function(){


			});

		}

		var _addSubsMetric = function(key_, value_){

			stService.executeGet("/lead/add-subs-metric",{key: key_, value: value_}).success(function(){


			});

		}


		return{
			addMetricaTipoDispositivo: _addMetricaTipoDispositivo,
			addIncMetric: _addIncMetric,
			addSubsMetric: _addSubsMetric
			
		}

	})

})();