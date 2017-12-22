"use strict";
(function(){
angular.module("adm").controller("testeController", function($scope, chronoService, stService, dateUtil){
	
	var socket  = io.connect("http://192.168.2.99:9092");
	socket.on('connect', function() {
				console.log("Conectado ao servidor!");
			});


			socket.on('chatevent', function(data) {
				alert('<span class="username-msg">' + data.userName + ':</span> ' + data.message);
			});
	
			$scope.enviar = function(){
				
				socket.emit('chatevent', {userName: "Thomaz", message:"Mensagem anonima"});

			}
})
})();