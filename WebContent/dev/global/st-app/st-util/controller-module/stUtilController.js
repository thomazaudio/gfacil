"use strict";
(function(){

	angular.module("adm") 

	.controller("estadosCidadesController",function(stService,stUtil){

		var vm = this;

		vm.loadingEstados = true;
		stService.executeGet("estadoscidades/get-estados").success(function(data){

			vm.loadingEstados = false;
			vm.estados= data.itens;

			//Se a uf estiver definida, o estado no model é setado
			if(vm.uf){

				var index = stUtil.buscaOb(vm.estados,vm.uf,"uf");
				vm.estado = vm.estados[index];
				vm.changeEstado({uf:vm.uf});

			}

		});

		vm.changeCidade = function(cidade){

			vm.uf =cidade.uf;
			vm.codigoMunicipio = cidade.codigoMunicipio;
			vm.nomeMunicipio = cidade.nome;
			vm.codigoUf = vm.estado.codigoUf;
		}

		vm.changeEstado = function(estado){

			vm.loadingCidades = true;

			stService.executeGet("estadoscidades/get-cidades",{uf:estado.uf}).success(function(data){

				vm.loadingCidades = false;

				vm.cidades= data.itens;

			});
		}

		//Se o código do municipio estiver definido, o municípo completo é recuperado
		if(vm.codigoMunicipio){

			vm.loading = true;

			//Recupera as informações completas da cidade
			stService.executeGet("/estadoscidades/get-cidade",{codMun:vm.codigoMunicipio}).success(function(data){

				vm.cidade = data.item;
				vm.loading = false;
			});

		}
	})

})();
