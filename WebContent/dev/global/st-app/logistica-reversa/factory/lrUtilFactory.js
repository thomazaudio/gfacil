"use strict";
(function(){

	angular.module("adm")

	.factory("lrUtil",function($uibModal, stService){

		var _showHistorico = function(emprestimo,callback){

			$uibModal.open({
				animation: true,
				templateUrl:"global/st-app/logistica-reversa/template-module/modalHistoricoLR.html",
				size:'lg',
				bindToController:true,
				controllerAs:"vm",
				controller:"historicoLRController",
				resolve:{

					emprestimo:  function(){
						return emprestimo
					},
					callback: function(){
						return callback
					} 
				}
			});

		}

		var _openDetalhe = function(lr,callback){

			$uibModal.open({
				animation: true,
				templateUrl:"global/st-app/logistica-reversa/template-module/modalDetalheLR.html",
				size:'lg',
				bindToController:true,
				controllerAs:"vm",
				controller:"detalheLRController",
				resolve:{
					lr:function(){

						return lr
					},
					callback: function(){
						return callback
					} 
				}
			});

		}

		var _baixarLR = function(pessoa, emprestimo, callback){

			$uibModal.open({
				animation: true,
				templateUrl:"global/st-app/logistica-reversa/template-module/modalBaixarLR.html",
				size:'lg',
				bindToController:true,
				controllerAs:"vm",
				controller:"baixarLRController",
				resolve:{
					emprestimo:function(){

						return emprestimo
					},
					pessoa:  function(){

						return pessoa
					},
					callback: function(){
						return callback
					} 
				}
			});

		}
		
		//Recupera todas as informações de emrpestimso para uma pessoa
		var _getInfoEmprestimos = function(pessoa, callback){

			var qs = ["pessoa.id="+pessoa.id];
			
			//Reupera todos os registros de logística reversa pra pessoa informada
			stService.getLikeMap("logisticareversa",qs,0,0, "").success(function(data){


				var lrs = data.itens;

				var emprestimos = lrs.filter(function(value){

					if(value.tipo==2)
						return value;
				});

				var devolucoes = lrs.filter(function(value){

					if(value.tipo==1)
						return value;
				});

				var somaEmprestimos = 0;
				var somaDevolucoes = 0;

				for(var i in emprestimos){

					somaEmprestimos += emprestimos[i].quantidade;
				}

				for(var j in devolucoes){

					somaDevolucoes += devolucoes[j].quantidade;
				}

				

				//Objeto base utilizado para baixas
				var emprestimo = {};

				emprestimo.lrs = lrs;

				emprestimo.somaEmprestimos = somaEmprestimos;
				emprestimo.somaDevolucoes = somaDevolucoes;
				emprestimo.quantidadeReceber = somaEmprestimos - somaDevolucoes;//Campo quantidade

			   callback(emprestimo);

			}).error(function(){

				callback();
				
				
			});

		}
		

		return {

			baixarLR:_baixarLR,
			showHistorico:_showHistorico,
			openDetalhe:_openDetalhe,
			getInfoEmprestimos: _getInfoEmprestimos

		};

	})

})();