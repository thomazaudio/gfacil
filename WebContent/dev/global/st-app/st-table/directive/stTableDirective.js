(function(){
	angular.module("adm") 

	//Modal em forma de diretiva
	.directive("stTable",function($filter,stService,$q ,$stDetalhe, $timeout, $rootScope,pessoaUtil,$location,$route){
		return {

			templateUrl:'global/st-app/st-table/template-module/stTable.html'
				,
				restrict:"AE",

				scope:{

					filterIntercept:"=",
					labels:"=",//Títulos presentes na tabela de objetos(Origatório) - array de objetos [{attr,label}]
					title:"=",//Título da lista de objetos  - String
					attrUnique:"=",
					reqs:"=",//Atributos obrigatórios no cadastro de itens
					nextLink:"=",//Link para direcionar ao Cadastrar ou salvar no novo objeto
					objetos:"=",
					noCrud:"=",
					tabs:"=",
					teste:"=",
					rightTab:"=",
					cacheOps:"=",
					cadLabel:"=",
					filtros:"=",
					buscaEspecial:"=",
					detalheLink:"=",
					customActions:"=",
					noSave:"=",//se true, o botão salvar não é incluido	  
					htmlActionsPos:"=",
					detalheLink:"=",
					labelPivo:"=",
					tipoObjeto:"=",//Tipo de movimentação padrão no sistema 1 = Despesas, 2 = Receitas
					icon: "@"
				},


				link:function($scope){
					
					//Navegacao atual
					$rootScope.atualPage = $scope.title;

					//Ação padrão para rightTab
					if($scope.rightTab){

						if($scope.rightTab.tipo=='monthPicker'){
							$scope.rightTab.value=new Date();
						}


					}


					//Caso filtros não estejam definidos, assume-se filtros=label 	
					if(!$scope.filtros)
						$scope.filtros=$scope.labels;

					if(!$scope.title)
						$scope.title="Lista";

					if(!$scope.reqs)
						$scope.reqs=transformLabelsToReqs($scope.labels);

					if(!$scope.nextLink)
						$scope.nextLink=null;

					$scope.objeto={};
					$scope.objectFilter={};


					//Ações customizadas
					$scope.executeCustomAction = function(action,ob){

						if(!action.call)
							return;

						$scope.$parent[action.call](ob,function(data){

							ob=data;
							$timeout(function(){

								$scope.getLikeMap([],0,0,"");  

							},500);

						});	
					}

					//Funções definidas para o Label da Tabela
					$scope.bindFunction =function(funcao,ob){

						if(!funcao)
							return;

						$scope.$parent[funcao.call](ob,function(data){

							ob=data;
							$timeout(function(){

								$scope.getLikeMap([],0,0,"");  

							},500);
						});
					}


					//Cadastro de novo item
					$scope.cadItem = function(){

						var objeto = {
								tipo_pessoa:$location.$$path.replace("/","")
						}

						pessoaUtil.openDetalhePessoa(objeto,0,function(){

							console.log("Objeto: ");
							console.log(objeto);
							
							$route.reload();

						});

					}

					$scope.openDetalhe =function(objeto,tab){

						//Abre o detalhe de acordo com o tipo de objeto
						if($scope.tipoObjeto=='pessoa'){
							pessoaUtil.openDetalhePessoa(objeto,tab,function(){


							});
						}

					}

					$scope.deletarItem = function(ob,index){


						$scope.disableObject(ob,function(){

							$scope.objetos.splice(index,1);
						});
					}

					//Tab do lado direiro
					$scope.executeRightTabClick = function(tab){

						if(!tab)
							return;

						$scope.pagina =0;

						var operador = tab.operador||"=";

						if(tab.tipo=='monthPicker'){

							var mes = $filter("date")(tab.value,"MM");
							var ano = $filter("date")(tab.value,"yyyy");
							$scope.rightQuery ="month("+tab.attr+") "+operador+" '"+mes+"' and year("+tab.attr+") "+operador+" '"+ano+"'";
							$scope.getLikeMap([],0,0,"");

						}
					}

					//Executa uma query fixa
					var  _executeFixTabQuery =  function(tab){

						console.log("Pagina ="+$scope.pagina);

						obAppend = tab.objectAppend;

						//Valores pre definidos ao salvar o objeto
						$scope.objectAppend = obAppend;

						//Criar as querys

						var qs = [];

						for(var attr in obAppend){

							var valor = obAppend[attr];

							if(typeof valor== 'string' || typeof valor== 'date')
								valor="'"+valor+"'";

							qs.push(attr+"="+valor);
						}

						$scope.fixQuerys = qs;
						$scope.activeTab = tab;
						console.log("Tab:");
						console.log($scope.activeTab);
						$scope.pagina=0;
						$scope.getLikeMap(qs,0,0,"");

					}

					$scope.executeFixTabQuery =  _executeFixTabQuery;

					if($scope.tabs){
						_executeFixTabQuery($scope.tabs[0]);
					}

					function transformLabelsToReqs(labels){

						var lista =[];

						for(var i in labels)
							lista.push(labels[i].attr);

						return lista;

					}

					$scope.executeRightTabClick($scope.rightTab);

				}
				,

				controller:'stControl',

		}

	}).directive('optionsTable',function(){

		return{
			templateUrl:'view/templates/st-table/optionsTable.html',
			scope:{
				ob:"="
			}
		}

	});

})();
