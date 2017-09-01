"use strict";
(function(){

	angular.module("adm") 

	.directive('autoCompleteObject', function(stService,$compile,$filter,$log,stUtil,$uibModal,$timeout,$modalStack,cacheGet) {
		return {
			restrict: 'AE',
			require:'ngModel',

			scope:{

				objectOp:"=",//Objeto em caso de chave/valor
				onDemand:"=",
				getCompleteObject:"=",
				label:"=",
				placeHolder:"=",//placeholder de busca
				labelCad:"=",
				placeHolderCad:"=",//place holder de cadastro
				ngModel:"=",
				defaulText:"=",
				initialBusca:"=",//String a ser setada no campo de busca (input)
				extraClass:"=",//Classe css para ser adicionada ao elemento 'input'
				fixProperties:"=",//Propriedades fixas do objeto, usada tanto para cadastros tanto para buscas
				valueOnly:"=",//se true, não seta o objeto inteiro no model, apenas o valor(labels)
				itens:"=",//Itens locais, se houver, as buscas serão efetuadas a partir deles
				subLabel:"=",//Informações adicionais a serem exibidas	e buscadas,
				showSubLabel:"=",
				hideResults:"=",//Esconde os resultados da busca
				autoFocus:"=",//Focus para o elemento input
				showResultsOnFocus:"=",
				idInput:"=",
				resultadoBusca:"=",//Bind para resultados da busca
				useCache:"=",//cacheGet
				autoShowBusca:"="//Mostra a tela de busca automaticamente
			},

			templateUrl:'autoCompleteObject.html',

			link: function($scope, element, attrs,ctrl){

				$scope.$watch('ngModel',function(value){

					if(!value){
						$scope.labelValue="";
					}
				});

				var fix = $scope.fixProperties||[];

				var querys = [];

				for(var key in fix){

					querys.push(key+"='"+fix[key]+"'");
				}

				var nomeObjeto = $scope.objectOp;

				var label = $scope.label;
				var labelCad = $scope.labelCad;
				var onDemand = $scope.onDemand;
				var placeHolder= $scope.placeHolder ||'Digite um valor';
				var lastKeyUp = 0;



				if(!attrs.inline || attrs.inline=='false')	{
					element.bind("click",function(){
						$scope.openBusca();
					});

				}


				$timeout(function(){

					if(!ctrl.$viewValue)
						return;

					var value;

					if($scope.valueOnly){
						value = ctrl.$viewValue;	
					}
					else{
						value = ctrl.$viewValue[label] || ctrl.$viewValue || 'Selecione uma opção';
					}

					$scope.modelValue = value;

				},0);


				function getModelValue(){

					return $scope.modelValue;
				}

				function getInitialBusca(){

					return $scope.initialBusca;
				}
				
			

				function getItens(){

					return $scope.itens;
				}

				function setModelValue(item){
					$scope.modelValue = item[label]||item;
				}

				//Busca de itens
				function buscarItem(valueLabel,callback){

					valueLabel = valueLabel||'';
					$scope.aba = "resultados";

					//Sem Cache (Busca remota)	
					//!$scope.useCache || $scope.useCache==false
					if(!$scope.useCache || $scope.useCache==false)	{

						var query = label+" like '%"+valueLabel+"%'";
						var qs = [];
						qs = qs.concat(querys);
						qs.push(query);
						var objeto = $scope.objectOp;
						objeto = objeto[0].toUpperCase() + objeto.slice(1);
						var subLabel="";
						if($scope.subLabel){

							subLabel =","+$scope.subLabel.attr;

						}

						var ops = {
								qs : qs,	
								columns:"id,"+$scope.label+subLabel||"*",
								groupBy:"id",
								objeto:objeto
						};

						$scope.loadingBusca=true;

						stService.getProjecoes(ops).success(function(data){

							$scope.loadingBusca=false;
							callback(data.itens);

						}).error(function(){

							$scope.loadingBusca=false;
							$scope.messageResult="Ocorreu um erro, tente novamente.";
						});

					} //Fim de !getItens()

					//Busca em cache
					else{

						var ini = new Date();
						var itens = cacheGet.get($scope.objectOp,label,valueLabel);
						itens = jlinq.from(itens)
						.starts(label,valueLabel)
						.select();
						
						var its = [];

						for(var i in itens){

							its.push([itens[i].id,itens[i][label]]);
						}

						callback(its);

					}

				}

			
				function selecionarItem (item){

					if($scope.getCompleteObject==true){
						stService.getById(nomeObjeto,item[0]).success(function(data){

							setValueItem(data.item);
						});
					}
					else{
						var ob = {};
						ob.id = item[0];
						ob[label]=item[1];
						setValueItem(ob);

					}

				}

				function setValueItem(objetoSele){

					var viewValue;

					if($scope.valueOnly==true){
						viewValue = objetoSele[label];	
					}
					else{
						viewValue = objetoSele;
					}

					$scope.modelValue = objetoSele[label];
					setModelValue(objetoSele);
					ctrl.$setViewValue(viewValue);
					$scope.focusBusca =false;
					$scope.labelValue = objetoSele[label];
					$scope.obs =null;
					$scope.aba ="resultados";

				}

				$scope.editarItem = function(){

				}

				$scope.buscarItem = function(labelValue){

					var d = new Date();
					var execute =false;

					if(d.getTime()-lastKeyUp<300){

						lastKeyUp = d.getTime();
						execute = true;
						$timeout(function(){

							if(execute==true)
								executeBuscarItens(labelValue);


						},300);

						return;
					}
					else{

						lastKeyUp = d.getTime();
						executeBuscarItens(labelValue);

					}

				}

				function executeBuscarItens(labelValue){

					buscarItem(labelValue,function(itens){

						if(itens.length==0)
							$scope.messageResult = "Não encontrado '"+labelValue+"'.";
						else
							$scope.messageResult="";

						$scope.obs = itens;
						$scope.resultadoBusca = itens;
					});

				}

				$scope.cadItem = function(value, allFilials){

					cadItem(value,allFilials);

				}
				$scope.selecionarItem = selecionarItem;

				$scope.alterarAba =function(aba){

					$scope.aba = aba;
				}
				

				//Abre o modal de busca
				$scope.openBusca = function(){

					$uibModal.open({
						animation: true,
						templateUrl:"buscaAutoCompleteObject.html",
						size:"lg",
						controller:function($scope, $modalInstance){

							$scope.label = label;
							$scope.labelCad = labelCad;
							$scope.placeHolder=placeHolder;
							$scope.modelValue = getModelValue();
							$scope.initialBusca = getInitialBusca();
							$scope.focusBusca=true;
							
							console.log("initialBusca: "+getInitialBusca());
							
							
							$scope.inputFocus = function(labelValue){

								if($scope.showResultsOnFocus==true)	
									$scope.buscarItem(labelValue);
							}

							$scope.selecionarItem = function(item, modal){

								selecionarItem(item);
								
								$modalInstance.close();

							}

							$scope.cadItem = function(value, allFilials){
								
								
								$scope.salvandoItem = true;

								var ob = {};
								ob[label]= value;

								//Atributos pre-definidos
								for(var k in fix){
									ob[k] = fix[k];	
								}

								//auxItemFilial
								ob["allFilials"]=allFilials;

								var query = label+" = '"+ob[label]+"'";
								var qs = [];
								qs.push(query);
								qs = qs.concat(querys);
								
								console.log("salvandoItem: "+$scope.salvandoItem);

								stService.getLikeMap(nomeObjeto,qs,0,0,"").success(function(data){

									if(data.itens.length>0){
										stUtil.showMessage("","Já existe um registro com '"+ob[label]+"' cadastrado no sistema","danger");
										$scope.salvandoItem = false;
										return;
									}
									else {

										stService.save(nomeObjeto,ob).success(function(data){

											var objeto=[data.item.id,data.item[label]];
											selecionarItem(objeto);
											value="";
											$scope.salvandoItem = false;
											stUtil.showMessage("","'"+ob[label]+"' cadastrado com sucesso!","info");
											$modalInstance.close();
										}).error(function(){

											stUtil.showMessage("","Ocorreu um erro, verifique sua conexão com a internet.","danger");
											$scope.salvandoItem = false;
											$modalInstance.close();
										});
									}

								}).error(function(){

									stUtil.showMessage("","Ocorreu um erro, verifique sua conexão com a internet.","danger");
									$scope.salvandoItem = false;
								});

							
							
							}

							$scope.alterarAba =function(aba){

								$scope.aba = aba;
							}

							$scope.buscarItem = function(valueLabel){
								
								$scope.loadingBusca=true;

								buscarItem(valueLabel,function(itens){

									$scope.loadingBusca=false;

									if(itens.length==0)
										$scope.messageResult = "Não encontrado '"+valueLabel+"'.";
									else
										$scope.messageResult="";
									
									$scope.obs = itens;
								});

							}

							
							//Busca Inicial
							if($scope.initialBusca !=undefined ){

								$scope.buscarItem($scope.initialBusca );
							}

							$scope.fecharModal = function(ele){

								ele.$dismiss("cancel");
							}
						}
					});

				}
				
				if($scope.autoShowBusca==true)
					$scope.openBusca();

				querys = querys.filter(function(value){

					if(value.length>0)
						return value;

				});

			}

		}

	})


})();
