"use strict";
(function(){

	angular.module("adm")

	.factory("nfeUtil",function($localStorage, $uibModal,$rootScope,stService){

		//Detalahamento e criação de NFe
		//idNFe é quando uma nfe já foi criada (id do objeto NFe persistente)
		//mov representa a movimentação a partir da qual a NFe será criada
		var _openNFe = function(idNFe,idMov){

			var _modalInstance =   $uibModal.open({
				animation: true,
				templateUrl:"global/st-app/app-nfe/template-module/detalheNFe.html",
				size:'lg',
				controller:"detalheNFeController",
				resolve:{

					idNFe: idNFe,

					idMov: idMov

				}

			});

		}

		var _openGrupoImposto = function(imposto, callback){

			var _modalInstance =   $uibModal.open({
				animation: true,
				templateUrl:"global/st-app/app-nfe/template-module/modalGrupoImposto.html",
				size:'lg',
				controllerAs:"vm",
				bindToController:true,
				controller: function($modalInstance){

					var vm = this;
					vm.imposto = imposto;

					vm.salvar = function(){

						
						stService.executePost("grupoimposto/add/",vm.imposto).success(function(data){

							callback(data.item)

							$modalInstance.close();

						});

					}
				}

			});

		}

		//Recuperação dos dados do emitente configurado no sistema
		var _getDadosEmitente = function(){

			var dados = $localStorage.config.confs;
			var emit  = {};
			var compose = ["IE","IM","xNome"];

			for(var i in compose){

				var key = compose[i];

				emit[key] = dados[key];
			}

			//Informações padrão
			emit.cPais = 1058;
			emit.xPais ="BRASIL";

			return emit;

		};

		//Converte uma movimentação em um objeto NFe
		var _movToInfNFe = function(idMov,callback){

			stService.getById("movimentacao",idMov).success(function(data){

				var nfe = {};
				var mov = data.item;
				var infNFe = {};

				//Emitente (Filial corrente)
				var emit = $rootScope.currentFilial;
				infNFe.emit = emit;
				infNFe.emit.enderEmit = infNFe.emit.endereco;

				//Cabeçalho padrão (Dados configurados de acordo com a filial corrente)
				var ide = {};
				ide.mod = emit.nfeMod;
				ide.tpNF = emit.tpNF;
				ide.cuf = infNFe.emit.endereco.codigoUf;
				ide.tpImp = emit.tpImp;
				ide.indPag = emit.indPag;
				ide.tpEmis = emit.tpEmis;
				ide.indPres = emit.indPres;
				ide.indFinal = emit.indFinal;
				ide.finNFe = '1';//Finalidade de emissão, 1=normal
				ide.natOp = emit.natOp;

				//Número e série
				ide.nnf = emit.nnf;
				ide.serie = emit.serie;

				infNFe.ide = ide;

				//Destinátário
				infNFe.dest = mov.pessoa;
				infNFe.dest.enderDest = mov.pessoa.endereco;

				//Itens (Pedidos)
				infNFe.det = _pedidosToDet(mov);

				//Totais

				nfe.infNFe = infNFe;

				//Associa a movimentação
				nfe.movimentacao = mov;

				callback(nfe);


			});



		}

		//Conveter movimentacao.pedidos em Det
		var _pedidosToDet = function(mov){


			var dets = [];
			var peds = mov.pedidos;

			for(i in peds){

				var det = {};
				var prod = {};
				det.nItem = i+1;
				det.prod = peds[i].produto;
				det.infAdProduto = det.prod.infAdProduto;

				//Seta demais informações do produto em det

				prod.vProd  = peds[i].quantidade * peds[i].valorUnitario;

				for(var key in peds[i].produto){

					prod[key] = peds[i].produto[key];
				}

				det.prod = prod;

				dets.push(det);

			}

			return dets;

		}

		//Retorna erros de preenchimento da NFe
		var _validaNFe = function(nfe,callback){

			stService.executePost("nfe/valida-nfe/",nfe).success(function(erros){

				callback(erros);

			});
		}

		return {

			getDadosEmitente : _getDadosEmitente,
			openNFe : _openNFe,
			movToInfNFe:_movToInfNFe,
			pedidosToDet:_pedidosToDet,
			validaNFe:_validaNFe,
			openGrupoImposto:_openGrupoImposto

		}

	})

})();

