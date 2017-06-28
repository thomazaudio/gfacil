"use strict";
(function(){
	angular.module("adm") 

	.controller("buscaAutoCompleteObjectController",function(modal,mov,stService,dateUtil,movUtil,$rootScope){

		var vm = this;
		
		$scope.$watch('ngModel',function(value){

			if(!value){
				$scope.labelValue="";
			}
		});

		$scope.inputFocus = function(labelValue){

			if($scope.showResultsOnFocus==true)	
				$scope.buscarItem(labelValue);
		}


		var fix = $scope.fixProperties||[];

		var querys = [];

		for(var key in fix){

			querys.push(key+"='"+fix[key]+"'");
		}

		var nomeObjeto = $scope.objectOp;

		var label = $scope.label;
		var labelCad = $scope.labelCad;
		var onDemand = $scope.onDemand;
		var placeholder= $scope.placeHolder ||'Digite um valor';
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
			if(true)	{

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

				for(i in itens){

					its.push([itens[i].id,itens[i][label]]);
				}

				callback(its);

			}

		}

		function cadItem (value,allFilials){

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

						$scope.salvandoItem = true;


					}).error(function(){

						stUtil.showMessage("","Ocorreu um erro, verifique sua conexão com a internet.","danger");
						$scope.salvandoItem = false;
					});
				}

			}).error(function(){

				stUtil.showMessage("","Ocorreu um erro, verifique sua conexão com a internet.","danger");
				$scope.salvandoItem = false;
			});

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

		$scope.cadItem = function(value,allFilials){

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
				templateUrl:"view/templates/auto-complete/templateBusca.html",
				size:'md',
				controller:function($scope,$uibModalInstance){

					$scope.label = label;
					$scope.labelCad = labelCad;
					$scope.placeholder=placeholder;
					$scope.modelValue = getModelValue();
					$scope.initialBusca = getInitialBusca();
					$scope.focusBusca=true;

					$scope.selecionarItem = function(item){

						selecionarItem(item);
						$uibModalInstance.dismiss("cancel");

					}

					$scope.cadItem = function(value,modal){

						cadItem(value);
						modal.$dismiss("cancel");

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

							$scope.itens = itens;
						});

					}

					//Busca Inicial
					if(getInitialBusca()){

						$scope.buscarItem(getInitialBusca());
					}

					$scope.fecharModal = function(ele){

						ele.$dismiss("cancel");
					}
				}
			});

		}

		querys = querys.filter(function(value){

			if(value.length>0)
				return value;

		});
		

	})

})();
