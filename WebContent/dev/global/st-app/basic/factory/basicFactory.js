"use strict";
(function(){

	angular.module("adm")

	.factory("basic",function($http, config,$filter,$confirm,$location,$stModal,$modalStack,stUtil,pedidoUtil,stService,$window,movimentacaoService, $stDetalhe,$uibModal,dateUtil,estoqueUtil){

		var _modalInstance;
		var _confirmAlterarBaixa = function(mov,callback){

			//GAMBIARRA!!!
			if(mov.originalMov)
				mov.originalMov = {id:mov.originalMov.id};

			if(!mov.formaPagamento)
				mov.formaPagamento="dinheiro";

			movimentacaoService.baixar(mov).success(function(data){

				stUtil.showMessage("","status alterado com sucesso!","info");

				if(callback)
					callback(data.item);

			}).error(function(){
				mov.baixada = !mov.baixada;
				if(callback)
					callback(mov);
				stUtil.showMessage("","Ocorreu um erro ao tentar alterar o status da movimentação, verifique sua conexão com a internet e tente novamente.","danger");
			});

		};

		//Adicionar uma baixa para uma movimentação fixa
		var _addBaixaForMov = function(mov,data){
			mov.baixas = mov.baixas ||"";
			//Marca a movimentação fixa como baixada de acordo com o vencimento em questão
			mov.baixas+="@"+dateUtil.formatDate(data);
			return mov;
		}

		var _deleteMov = function(mov,callback,modo){

			//Se for passado 'modo', a movimentação é deletada diretamente
			if(modo){

				movimentacaoService.apagar(mov,modo).success(function(){

					if(callback)
						callback();

				});

				return;

			}

			//Movimentação com depencias
			if(mov.originalMov || mov.numeroParcelas>1){

				var modal = $uibModal.open({
					animation: true,
					templateUrl:"global/st-app/app-mov/template-module/modalDeleteMov.html",
					size:'lg',
					controller:"deleteMovController",
					controllerAs:"vm",
					bindToController:true,
					resolve:{
						callback:function(){

							return callback;
						},
						mov: function(){
							return mov;
						},
						modal: function(){
							return modal;
						}

					}
				});

			}else{
				movimentacaoService.apagar(mov,"").success(function(){

					if(callback)
						callback();
				}).error(function(){

					if(callback)
						callback();

				});
			}

		}

		//Querys relacionadas ao balanco
		//Retorna querys referentes a movimentações previstas e realizadas
		var _getQuerysBalanco= function (de,ate,columns){

			de = de || new Date();
			ate= ate ||new Date();

			var basicMovQuery = "from Movimentacao where disable=0 ";

			//Somente as columnas especificadas
			if(columns && columns!=null){
				basicMovQuery = "select "+columns+" "+basicMovQuery;
			}

			//Periodo para movimentações realizadas
			var queryPeriodRealizadas=" and "+dateUtil.getQueryOfPeriod("dataBaixa",de,ate);

			//Periodo para movimentações previstas
			var queryPeriodPrevistas=" and "+dateUtil.getQueryOfPeriod("data",de,ate);

			//Realizadas (baixada=1)
			var queryReceitasRealizadas= basicMovQuery+"and tipo=2  and baixada=1 "+queryPeriodRealizadas;
			var queryDespesasRealizadas = basicMovQuery+"and tipo=1  and baixada=1"+queryPeriodRealizadas;

			//Previsto (todas)
			var queryReceitasPrevistas = basicMovQuery+"and tipo=2 "+queryPeriodPrevistas;
			var queryDespesasPrevistas = basicMovQuery+"and tipo=1 "+queryPeriodPrevistas;


			return {

				queryReceitasRealizadas: queryReceitasRealizadas,
				queryDespesasRealizadas: queryDespesasRealizadas,
				queryReceitasPrevistas: queryReceitasPrevistas,
				queryDespesasPrevistas: queryDespesasPrevistas

			}

		}

		//Recupera informaçõe a respeito movimentações previstas e realizadas
		var _getBalanco = function(de,ate,callback){

			var qs = _getQuerysBalanco(de,ate,"sum(valor)");

			//Receitas realizadas (baixada=1)
			stService.executeGet("projecao/execute-query",{query: qs.queryReceitasRealizadas}).success(function(rec){

				var receitasRealizadas   = rec.itens[0] ||0;

				//Despesas realizadas (baixada=1)
				stService.executeGet("projecao/execute-query",{query: qs.queryDespesasRealizadas}).success(function(des){
					var despesasRealizadas  = des.itens[0]||0;

					//Receitas previstas (todas)
					stService.executeGet("projecao/execute-query",{query: qs.queryReceitasPrevistas}).success(function(des){
						var receitasPrevistas   = des.itens[0]||0;

						//Despesas Previstas (todas)
						stService.executeGet("projecao/execute-query",{query: qs.queryDespesasPrevistas}).success(function(des){
							var despesasPrevistas  = des.itens[0]||0;

							callback(receitasRealizadas,despesasRealizadas,receitasPrevistas,despesasPrevistas);

						});

					});

				});

			});

		}

		var _alterarBaixa  = function(mov,callback){

			if(mov.baixada==true){
				//Escolha da data de pagamento	
				var modal = 	$uibModal.open({
					animation: true,
					templateUrl:"global/st-app/app-mov/template-module/modalBaixaMov.html",
					size:'lg',
					controller:"alterarBaixaController",
					controllerAs:"vm",
					bindToController:true,
					resolve: {
						modal: function(){
							return modal;
						},
						mov: function(){
							return mov;
						}
					}
				});	

			}

			else{

				var msg = "Tem certeza que deseja marcar a movimentação como não-paga?"

					var confirm = ($window.confirm(msg) === true);

				if(confirm==true){
					mov.dataBaixa = null;
					_confirmAlterarBaixa(mov,callback);

				}else{

					mov.baixada =true;
				}

			}

		};

		var _cadMov = function(movs,callback){

			stService.executePost("movimentacao/add-parcelas/",movs).success(function(data){

				if(callback)
					callback(data.item)

			});	

		}

		var _setStatusMov = function(mov){

			if(mov.dataBaixa==null){
				var hoje = new Date();
				hoje.setHours(0,0,0,0);

				var dataMov = dateUtil.getDate(mov.data);
				dataMov.setHours(0,0,0,0);

				if(dataMov.getTime() < hoje.getTime()){
					mov.alertMov = 2; //Vencida
				}
				else if(dataMov.getTime()==hoje.getTime()){
					mov.alertMov = 1; //Vence hoje
				}
			}
			else{

				mov.alertMov=0;
			}

			return mov;
		}


		//Abrir detalhes de uma movimentação em forma de modal
		var _openMov = function(mov,props,callback){

			//Cadastro de nova movimentação
			if(!mov || mov==null){
				mov = {};
				mov.data=new Date();

			}

			if(!mov.id)
				mov.baixada=true;

			for(var key in props){
				mov[key] =props[key];
			}

			var _template ="";
			_template = "global/st-app/app-mov/template-module/modalDetalheMov.html"
				var _modalInstance =   $uibModal.open({
					animation: true,
					templateUrl:_template,
					size:'lg',
					controller:"detalheMovController",
					controllerAs:"vm",
					bindToController:true,

					resolve:{
						mov: function(){
							return mov;
						},

						modal: function(){

							return _modalInstance;
						},
						callback: function(){
							return callback;
						}
					}

				});

		}

		//Alterções nos dados ou deletar movimentação
		var _alterarMov = function(mov, funcao, callback){

			var _template ="";

			if(funcao=='del'){

				_template="global/st-app/app-mov/template-module/dialogDeleteMov.html"
			}

			_modalInstance =   $uibModal.open({
				animation: true,
				templateUrl:_template,
				size:'lg',
				controller:function($scope){

					$scope.mov=mov;

					//Confirmação de exclusão
					$scope.confirmDeleteMov = function(mov,modo,ele){

						ele.$dismiss('cancel');

						movimentacaoService.apagar(mov,modo).success(function(data){

							stUtil.showMessage("Movimentação deletada com sucesso!","","info");

							callback(null);

						});

					}

					$scope.fechar = function(ele){

						ele.$dismiss('cancel');

					}

				}
			});

		}

		var _getTotalMovs = function(movs,prioridade){

			var total = 0;
			for(var i in movs){
				total+=_getTotalMov(movs[i],prioridade);
			}

			return total;
		} 

		//Agrupamento, 'attr' é o atributo a ser utilizado no agrupamento
		var _agrupaMovs  = function(movs,attr){
			
			//Por padrão, attr = "pessoa.id" (Pessoal pra qual se destina a movimentação)
            attr = attr || "pessoa.id";
			
			movs = jlinq.from(movs)
			// para ser case sensitive
			.useCase()
			// aplica group pelo campo id
			.group(attr);

			return movs;
		}
		var _openMovsReadOnly = function(movs,titulo,subTitulo){

			$uibModal.open({
				animation: true,
				templateUrl:"global/st-app/app-mov/template-module/modalMovsReadOnly.html",
				size:'lg',
				controller:function($scope){

					$scope.titulo = titulo;
					$scope.subTitulo = subTitulo;
					$scope.movs = movs;

				}
			});
		}

		//Recupera todas as parcelas de uma movimentação
		var _getParcelas = function(idOriginalMov,callback){

			stService.executeGet("movimentacao/get-parcelas",{idOriginalMov:idOriginalMov}).success(function(data){

				callback(data.itens);

			});
		}

		//Abatimento de valor de uma movimentação
		var _abaterValor = function(mov,callback){

			_modalInstance =   $uibModal.open({
				animation: true,
				templateUrl:"global/st-app/app-mov/template-module/modalAbaterValor.html",
				size:'md',
				controller:function($scope){

					$scope.mov=mov;
					$scope.info = {data:new Date(),valor:mov.valor};

					//Confirmação de exclusão
					$scope.abaterValor = function(info,ele){

						var parcelas = [];

						if(info.valor>mov.valor){
							stUtil.showMessage("","O valor abatido não deve ser maior  que o valor original.","danger");
							return;
						}

						//Apenas muda para baixada
						if(info.valor==mov.valor){

							mov.dataBaixa =new Date(dateUtil.format(info.data));
							_cadMov([mov]);
							return;
						}

						//Parcelas referente a movimentacao
						var parcelasForMov = _getParcelas();

						mov.valor = mov.valor-info.valor;

						if(mov.parcelas==0 ||!mov.parcelas){
							mov.numeroParcelas =2;
						}
						else{
							mov.numeroParcelas++;
						}

						if(mov.parcela==0)
							mov.parcela=1;

						var parcela = {};
						parcela.valor = info.valor;
						parcela.pessoa = mov.pessoa;
						parcela.baixada = true;
						parcela.parcela = mov.numeroParcelas;
						parcela.tipo =mov.tipo;
						parcela.data = info.data;
						parcela.formaPagamento = info.formaPagamento;
						parcelas.push(mov);
						parcelas.push(parcela);
						_cadMov(parcelas);
						ele.$dismiss('cancel');

					}

					$scope.fechar = function(ele){

						ele.$dismiss('cancel');

					}

				}
			});

		}

		//Movimentações abstratas para movimentações do tipo fixa
		var _getAbstractMovsFixas = function(movFixa, dataFinal){

			var i = 0;
			var dataInicial = dateUtil.getDate(movFixa.data);
			dataFinal = dateUtil.getDate(dataFinal);

			//Igualando pra não haver diferença de horário
			dataInicial.setHours(0,0,0,0);
			dataFinal.setHours(0,0,0,0);

			var movs = [];
			for(dataInicial; dataInicial<=dataFinal;dataInicial=dateUtil.incrementaData(dataInicial,movFixa.modoRepeticao||3)){


				if(_movFixaIsBaixada(movFixa,dataInicial)==true){
				}
				else{
					var mov  = angular.copy(movFixa);
					mov.id = 0;//Pra ser cadastrado como nova movimentação
					mov.isAbstract == true;
					mov.originalMov = movFixa;
					mov.data = dateUtil.getDate(dataInicial);
					mov.modoRepeticao=0;
					mov.baixada = false;
					mov.dataBaixa = null;
					mov = _setStatusMov(mov);
					movs.push(mov);
				}
				i++;

			}

			return movs;

		}

		var _cadDespesaRapida = function(categoria){

			$uibModal.open({
				animation: true,
				templateUrl:"global/st-app/app-mov/template-module/cadDespesaRapida.html",
				size:'md',
				controller:function($scope, pdvUtil){

					$scope.mov = {

							data: new Date(),
							baixada: true,
							tipo:1
					}

					//Categorias de conta a pagar para usar no cadastramento de despesas rápidas
					stService.getProjecoes({

						qs:["descricao='categoria_conta_pagar'"],
						columns:"valor",
						objeto:"Opcao",
						groupBy:"valor"

					}).success(function(data){

						$scope.categoriasDespesas = data.itens;

					});

					//Cadastro
					$scope.cadMov = function(mov,ele){

						if(!mov.categoria){

							stUtil.showMessage("","Escolha uma categoria para despesa.","danger");
							return;
						}

						_cadMov([mov],function(data){

							ele.$dismiss('cancel');

							callback(data);

						});

					}


				}
			});
		}

		var _goToAtEstoqueFromMov = function(mov){

			var q ="from EntradaMercadoria where movimentacao.id="+mov.id;
			stService.executeGet("projecao/execute-query",{query:q}).success(function(data){

				estoqueUtil.openEntradaMercadoria(data.itens[0]);

			});

		}

		//Verifica se uma movimentação do tipo fixa foi baixada para a data 
		var _movFixaIsBaixada = function  (movFixa,data){

			var baixas = [];

			if(movFixa.baixas==null)
				movFixa.baixas = "";

			var baixas_ =  movFixa.baixas.split("@");

			for(var i in baixas_ ){

				baixas.push(dateUtil.getDate(baixas_[i]));
			}

			for(var i in baixas){
				if(
						baixas[i].getDate() == data.getDate() &&
						baixas[i].getMonth() == data.getMonth() &&
						baixas[i].getFullYear() == data.getFullYear()
				)
					return true;
			}

			return false;
		}

		//Retorna o valor total de uma movimentação
		/*

		 * O valor total de um movimentação pode ser recuperado de diversas formas
		 * 'pedidos' -> recupera o valor da movimentação baseada nos pedidos
		 * 'valor' -> recupera o valor da movimentação baseado no campo valor
		 * Caso não seja definido uma prioridade a prioridade adotada é    valor(caso a movimentação possua um id) -->  pedidos --> valor

		 */
		var _getTotalMov = function(mov,prioridade){

			if(prioridade=='pedidos')
				return pedidoUtil.getTotalPedidos(mov.pedidos);

			if(prioridade=='valor')
				return mov.valor;

			//Se a movimentação tiver sido salva (tiver um id)
			if(mov.id && mov.id!=0)
				return mov.valor;

			//Prioridade
			//Pedido --> valor
			var total =0;

			if(mov.pedidos && mov.pedidos.length>0){

				total = pedidoUtil.getTotalPedidos(mov.pedidos);
			}
			else {
				total = mov.valor||0;
			}

			//Desconto da movimentação

			return total;

		}

		var _openMovListInModal = function(activeTab){

			$uibModal.open({
				animation: true,
				templateUrl:'global/st-app/app-mov/template-module/movListInModal.html', 
				size:'lg',
				controller:function($scope){

					$scope.activeTab=activeTab||0;
				}
			});	

		} 

		return {

			openMovListInModal: _openMovListInModal,
			alterarBaixa: _alterarBaixa,
			alterarMov: _alterarMov,
			openMov: _openMov,
			cadMov: _cadMov,
			getTotalMovs: _getTotalMovs,
			agrupaMovs:_agrupaMovs,
			openMovsReadOnly:_openMovsReadOnly,
			getParcelas:_getParcelas,
			abaterValor:_abaterValor,
			getAbstractMovsFixas:_getAbstractMovsFixas,
			setStatusMov:_setStatusMov,
			cadDespesaRapida: _cadDespesaRapida,
			goToAtEstoqueFromMov:_goToAtEstoqueFromMov,
			getBalanco: _getBalanco,
			movFixaIsBaixada: _movFixaIsBaixada,
			deleteMov: _deleteMov,
			addBaixaForMov: _addBaixaForMov,
			confirmAlterarBaixa:_confirmAlterarBaixa,
			getTotalMov: _getTotalMov,
			getQuerysBalanco:_getQuerysBalanco
		};

	})

})();