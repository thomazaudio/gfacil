"use strict";
(function(){

	angular.module("adm")

	//Componente para visualização de projeções
	.directive("componentProjecao",function(relatorioUtil){

		return{

			restrict:"E",
			templateUrl:"global/st-app/app-relatorio/template-module/chart.html",
			require:"info",
			scope:{
				info:"=",
				de:"=",
				ate:"=",	
			},
			controller:function($scope){
				
				
				console.log("Info aqui: ");
				console.log($scope.info);
				
				//Período
				$scope.de = $scope.de || "1900-10-05";
				$scope.ate = $scope.ate || "3000-10-05";

				//Quantidade máxima padrão de itens a serem exibidos 
				$scope.maxItens = relatorioUtil.MAX_ITENS_DEFAULT;
				$scope.order = relatorioUtil.ORDER_BY_DEFAULT;//

				delete $scope.projs;
				function getDados (maxItens){

					//Montagem das informações basicas para recuperação da projeção a partir de $scope.info
					var basicInfo = {
							qs: $scope.info.qs||[],
							columns:$scope.info.labelColumn+","+$scope.info.valueColumn+" ",
							objeto:$scope.info.objeto,
							groupBy:$scope.info.labelColumn,
							extra:"order by "+$scope.info.valueColumn+" "+$scope.order,
							max:$scope.maxItens

					}

					var dadosExemplo  = $scope.info.dadosExemplo;

					delete $scope.proj;
					relatorioUtil.chartFactory($scope,basicInfo,$scope.info.periodColumn,function(proj){

						//Dados de exemplo
						if(proj.labels.length==0){
							proj = dadosExemplo;

							if(proj)
								proj.dadosExemplo=true;

						}

						//Como definir dinamicamente???
						$scope.chartOptions = {
								tooltipTemplate: $scope.info.tooltipTemplate ||  "<%=label + ': R$ '  +  Chart.moneyFormat(value) %>",
							
						}
						
						proj.colours =  [{
						    fillColor: "#3276b1",
						    strokeColor: "#3276b1",
						    highlightFill: "#3276b1",
						    highlightStroke: "#3276b1"
						}];
						
						$scope.proj  = proj;

					});

				}

				getDados();
				$scope.getDados = getDados;

			}

		}

	})

	.directive("componentVendasTabela",function(stService,stUtil,dateUtil){

		return {
			restrict:"E",
			templateUrl:"global/st-app/app-relatorio/template-module/component-vendas-tabela.html",
			scope:{
				de:"=",
				ate:"="
			},
			controller:function($scope){

				$scope.chartOptions = {
						tooltipTemplate: "<%=label + ': R$ '  +  Chart.moneyFormat(value) %>",
						type:'pie'  
				}


				$scope.$on("changePeriod",getDados);	

				//Quantidade de itens padrão
				$scope.quantItens = "30";

				function getDados(nomeProduto,quantItens){

					$scope.carregandoDados =true;

					var qs  = ["disable=0","quantidade>0"];

					qs.push(dateUtil.getQueryOfPeriod("date",$scope.de||new Date(),$scope.ate||new Date()));


					if(nomeProduto && nomeProduto.length>0)	
						qs.push("produto.nome like '%"+nomeProduto+"%'");

					qs.push("tipoEntrada=0");//Somente pedidos de Saída!!!

					var ops = {
							qs: qs,
							columns:"produto.nome,sum(quantidade),min(valorUnitario),max(valorUnitario),avg(valorUnitario)",
							objeto:"Pedido",
							groupBy:"produto.id",
							extra:"order by sum(quantidade) DESC",
							max:quantItens||30

					}

					stService.getProjecoes(ops).success(function(data){

						$scope.carregandoDados =false;
						$scope.projs = data.itens;

					}).error(function(){

						$scope.carregandoDados =false;
					});

				}	//FIm getDados()

				getDados();

				$scope.getDados = getDados;

			}
		}
	})

	//Lucro por período mensal
	.directive("componentLucroPeriodo",function(relatorioUtil,stUtil,stService,dateUtil,$filter){

		return {
			restrict:"E",
			templateUrl:"global/st-app/app-relatorio/template-module/chart-bar.html",
			scope:{
				de:"=",
				ate:"=",
				colours:"="
			},
			controller:function($scope){

				//Transform objeto proj em um array (Facilitar manipulação dos dados)	
				function projsToArray(projs){

					var array = [];
					for(var i in projs){

						array.push({data:dateUtil.getDate(projs[i][0]),valor:projs[i][1]});
					}

					return array;

				}

				function getProjByMonth(mes,ano,projs){

					for(var i in projs){

						if(projs[i].data.getMonth()==mes && projs[i].data.getFullYear()==ano)
							return projs[i];
					}

					return null;
				}

				//Faz o cáluclo receitas-despesas das projeções obtidas
				function getProjsBalanco(dataIni,dataFim,projReceitas,projDespesas){

					//Padronização dos dados
					dataIni = dateUtil.getDate(dataIni);
					dataFim = dateUtil.getDate(dataFim);
					projReceitas= projsToArray(projReceitas);
					projDespesas= projsToArray(projDespesas);

					var proj = {};
					var data = [];
					var labels = [];

					var soma = 0;
					for(dataIni;dataIni<=dataFim;dataIni = dateUtil.incrementaData(dataIni)){

						var obReceitas = getProjByMonth(dataIni.getMonth(),dataIni.getFullYear(),projReceitas) || {valor:0};
						var obDespesas = getProjByMonth(dataIni.getMonth(),dataIni.getFullYear(),projDespesas) || {valor:0};

						//Soma dos lucros para obtenção da média

						var balanco = obReceitas.valor - obDespesas.valor;

						soma+=balanco;

						data.push(balanco);
						labels.push($filter("date")(dataIni,'MMMM/yyyy'));

					}

					//Média de lucro
					proj.media = soma/data.length;
					proj.data= [data];//Necessário para funcionar em chart-bar
					proj.labels = labels;
					
					proj.colours =  [{
					    fillColor: "#3276b1",
					    strokeColor: "#3276b1",
					    highlightFill: "#3276b1",
					    highlightStroke: "#3276b1"
					}];

					return proj;

				}

				//Recupera os dados do backend	
				function getDados(){

					$scope.chartOptions = {
							tooltipTemplate: "<%=label + ': R$ '  +  Chart.moneyFormat(value) %>",
					}

					var basicQuerys  = ["disable=0","baixada=1","valor>0"];

					var basicInfo = {
							columns:"dataBaixa,sum(valor)",
							objeto:"Movimentacao",
							groupBy:"month(dataBaixa)",
							extra: " order by dataBaixa asc"

					}

					basicQuerys.push(dateUtil.getQueryOfPeriod("dataBaixa",$scope.de||new Date(),$scope.ate||new Date()));

					//Receitas (tipo=2)
					basicInfo.qs  = angular.copy(basicQuerys);
					basicInfo.qs.push("tipo=2");
					stService.getProjecoes(basicInfo).success(function(respReceitas){

						var projReceitas=respReceitas.itens;

						//Desepsas (tipo=1)
						basicInfo.qs  = angular.copy(basicQuerys);
						basicInfo.qs.push("tipo=1");
						stService.getProjecoes(basicInfo).success(function(respDespesas){

							var projDespesas=respDespesas.itens;
							var proj = getProjsBalanco($scope.de,$scope.ate,projReceitas,projDespesas)
							console.log("Projecoes");
							console.log(proj);


							$scope.proj = proj;

						})

					})

				}

				getDados();
				$scope.$on("changePeriod",getDados);	

			}
		}
	})


	//Component de balanco (Receitas, despesas,lucro operacional)
	.directive("componentBalanco",function(stService,$filter,dateUtil,movUtil){

		return{
			restrict:"E",
			templateUrl:"global/st-app/app-relatorio/template-module/component-balanco.html",
			scope:{

				de:"=",
				ate:"=",

			},

			controller:function($scope,movUtil){

				$scope.$on("changePeriod",getBalanco);

				function getBalanco(){

					$scope.loading = true;
					movUtil.getBalanco($scope.de,$scope.ate,function(receitasRealizadas,despesasRealizadas,receitasPrevistas,despesasPrevistas){

						$scope.loading = false;
						$scope.receitasRealizadas= receitasRealizadas;
						$scope.despesasRealizadas = despesasRealizadas;
						$scope.receitasPrevistas = receitasPrevistas;
						$scope.despesasPrevistas = despesasPrevistas;
						$scope.lucroPrevisto = receitasPrevistas - despesasPrevistas;
						$scope.lucroRealizado = receitasRealizadas- despesasRealizadas;

						//Falta pagar e Falta receber
						$scope.faltaPagar = $scope.despesasPrevistas- $scope.despesasRealizadas;
						$scope.faltaReceber = $scope.receitasPrevistas - $scope.receitasRealizadas;


						if($scope.faltaPagar<0)
							$scope.faltaPagar = 0;

						if($scope.faltaReceber<0)
							$scope.faltaReceber = 0;

					});

				}

				getBalanco();

			}

		}

	})

	//Componente movimentações a prazo pagas no periodo
	.directive("componentAnterioresBaixadas",function(stService,$filter,dateUtil,stUtil,movUtil){

		return{
			restrict:"E",
			templateUrl:"global/st-app/app-relatorio/template-module/component-anteriores-baixadas.html",
			scope:{

				de:"=",
				ate:"=",

			},

			controller:function($scope){

				$scope.$on("changePeriod",getMovs);
				function getMovs(){

					var querys = [];
					querys.push("tipo=2");
					querys.push("data <'"+stUtil.formatData($scope.de||new Date())+"'");
					querys.push(dateUtil.getQueryOfPeriod("dataBaixa",$scope.de||new Date(),$scope.ate||new Date()));

					var ops = {
							qs : querys,	
							columns:"valor",
							groupBy:"id",
							objeto:"Movimentacao"

					};

					//Receitas
					ops.extra="tipo=2"
						stService.executeGet("/movimentacao/busca/map",{qs:querys,pagina:0,max:0,extra:''}).success(function(data){

							var total = 0;
							var itens = data.itens;
							if(data.itens.length>0){

								$scope.lancamentosAnteriores = data.itens;

								for(var i in itens){

									total+=itens[i].valor;

								}

								$scope.totalLancamentosAnteriores = total;

							}
							else{

								$scope.lancamentosAnteriores =null;
								$scope.totalLancamentosAnteriores = 0;

							}

						});

				}
				getMovs();

			}
		}
	})

})();
