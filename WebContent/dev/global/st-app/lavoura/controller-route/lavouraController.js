"use strict";
(function(){
angular.module("adm").controller("lavouraController",function($scope, stUtil){
	
	var socket =  io.connect('http://192.168.2.92:9092');

	socket.on('connect', function() {
		
		stUtil.showMessage("","Equipamento conectado!");
	});

	socket.on('analogicdata', function(data) {
		
		var dados = JSON.parse(data);
		
		$scope.umidadeAr = dados.umidade;
		$scope.temparaturaAr = dados.temperatura;
		$scope.umidadeNivel1 =   100 - ( dados.a0/10.23);
		$scope.umidadeNivel2 = 100 - (dados.a1/10.23);
		$scope.phSolo = dados.a1/128;
		
		
	});

	socket.on('disconnect', function() {
		stUtil.showMessage("","Equipamento desconectado!");
	});
	
	$scope.toggleIrrigacao = function(){
		
		$scope.irrigacaoOn = !$scope.irrigacaoOn;
		socket.emit("pintoggle",{pinNumber: 0});
	}
	
})
})();