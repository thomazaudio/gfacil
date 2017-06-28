"use strict";
(function(){

	angular.module("adm") 

	//Filtro Complexo
	.directive("stFilterMap",function($compile, $filter, $rootScope){

		return {
			templateUrl:'global/st-app/st-filter-map/template-module/stFilterMap.html',
			restrict:"AE",
			scope:{

				filtros:"=",
				filterMapInstance:"=",
				querys:"=",//Querys para binds
				extra:"="//Query extra a ser aplicado no getLikeMap

			},
			controller:function($scope,stUtil){
				
				if(!$scope.extra)
					$scope.extra = "";

				//Alteração de querys Bindadas
				$scope.$watch('querys',function(value){

					$scope.aplicarFiltros(null,0,$rootScope.config.confs.maxItensPage||7,$scope.orderBy,$scope.orderType);

				});

				if($scope.filtros)
					$scope.infoBusca = $scope.filtros[0];

				//Atributos uteis
				$scope.dataHoje =  $filter("date")(new Date(),"dd/MM/yyyy");

				//Definição de valores padrão
				$scope.pagina=0;
				$scope.max = $rootScope.config.confs.maxItensPage||7
				$scope.qs=[];
				$scope.orderBy;
				$scope.ordem="DESC";
				$scope.objectFilter={};

				$scope.limparFiltros = function(){

					$scope.objectFilter = {};

				}

				$scope.atualizar = function(){

					$scope.aplicarFiltros(null,0,$scope.max);
				}

				$scope.changeInfoBusca = function(info){

					$scope.infoBusca = info;

				}

				//Busca Especial
				$scope.buscar = function(info){

					//$("#busca").blur();
					stUtil.disableFocus();
					var objectFilter ={};

					if(info)
						objectFilter[info.attr] = info.value;

					$scope.aplicarFiltros(objectFilter,0,$scope.max);

				}

				$scope.setPagina = function(pagina){

					$scope.pagina=pagina;
					$scope.$parent.getLikeMap($scope.qs,$scope.pagina,$scope.max,$scope.extra,$scope.orderBy,$scope.ordem);

				}

				$scope.aplicarFiltros = function(objectFilter,pagina,max,orderBy,ordem,interceptFilter){

					$scope.pagina=0;

					//Se for id, aplica-se as querys ignorando os outros valores
					if(objectFilter && objectFilter.id && objectFilter.id.length>0){

						//Aplica as Querys
						$scope.$parent.getLikeMap(["id = "+objectFilter.id],$scope.pagina,max,$scope.extra,orderBy,ordem);
						return;

					}

					var obs = {};

					for(var key in objectFilter){

						obs[key] = objectFilter[key];
					}

					//Reseta as querys anteriores
					$scope.qs = [];
					var query;
					for(var key in obs){

						query = "";

						if(typeof obs[key]=='string' && obs[key].match(/\d{2}\/\d{2}\/\d{4}/)){

							var dataDe = obs[key] || "01/01/0000";
							var dataAte = obs[key+'_ate'] || "01/01/3000";
							key =  key.replace(/_ate/g,"");
							query = key+" between '"+stUtil.formatData(dataDe)+"' and '"+stUtil.formatData(dataAte)+"'";
							delete  obs[key+'_ate'];

						}

						//Para Números
						else if( typeof obs[key]=='string' && obs[key].match(/[\d]+\.[\d]+$/)){

							var de;
							var ate;

							if( key.match(/[\w]+_ate/)){

								ate = obs[key];

							}
							else{

								de  = obs[key]; 
							}

							de = de || 0;
							ate = ate || 90000000000;
							key = key.replace(/_ate/g,"");
							query = key+" between "+de+" and "+ate;

						}
						else if(obs[key].toString().length>0){

							var valor=obs[key];
							var operador="";

							if(typeof valor=='string'){
								valor="'%"+valor+"%'";
								operador="like";
							}
							else if(valor==true){
								valor = 1;
								operador="=";
							}
							else if(valor==false){

								valor = 0;
								operador="=";
							}
							else{
								operador="=";
							}

							query = key+" "+operador+" "+valor;	

						}

						if(query.length>0)
							$scope.qs.push(query);

					}

					//Adiciona as querys bindadas (Se houver)
					if($scope.querys){
						$scope.qs = $scope.qs.concat($scope.querys);
					}

					if(!$scope.qs || $scope.qs.length==0)
						$scope.qs = [''];

					if($scope.$parent.getLikeMap)   
						$scope.$parent.getLikeMap($scope.qs,0,max,$scope.extra,$scope.orderBy,$scope.orderType);

				}
			}

		}

	})
})();
