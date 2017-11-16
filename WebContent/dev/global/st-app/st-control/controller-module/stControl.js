"use strict";
(function(){

	angular.module("adm")

	.controller("stControl",function($scope,$rootScope,$route,stService,$location,$stModal,$timeout,stUtil,$filter){

		//Quantidade de itens (lista)
		var maxIni = $rootScope.config.confs.maxItensPage||7;

		//Atributos uteis
		$scope.dataHoje =  $filter("date")(new Date(),"dd/MM/yyyy");

		//Controle de carregamento
		$scope.loadingStatus=false;

		$scope.host = $location.$$host;

		var path  =  $location.$$path;
		var opcoes =  path.match(/\w+/gi);
		var item = {};
		var itens = [];
		var nomeObjeto;
		var idObjeto  = path.match(/\d+/i) || 0;
		var metodo;

		if(opcoes.length==3)
			nomeObjeto=opcoes[1];
		else {
			nomeObjeto=opcoes[0];
		}

		if(idObjeto==0)
			metodo  = opcoes[1] || "get";
		else
			metodo="add";

		//Nome do objeto tratado
		$scope.nomeObjeto = nomeObjeto;
		$scope.loadingStatus=true;

		$timeout(function(){

			if(!$scope.objetos){

				//Se o método for get, recupera a lista de objetos 
				if(metodo=="get") {

					stService.getLikeMap($scope.nomeObjeto,[''],0,maxIni,'').success(function(data){

						$scope.objetos = data.itens;
						$scope.loadingStatus=false

					});
				}
			}

		},900);

		//Se o método for add, recupera o item caso seja fornecido o id
		if(metodo=="add" && idObjeto!=0){

			stService.getById($scope.nomeObjeto,idObjeto).success(function(data){

				$scope.objeto = data.item;
				item = data.item;

			});  
		}

		//Selecionar todos os objetos
		$scope.selecionarTodos = function(sele,objetos){

			for(var i in objetos){
				objetos[i].selecionado=sele;
			}
		}

		//Salvar Todos
		$scope.saveAll = function(objetos){

			for(var i in objetos){

				if(objetos[i].selecionado)
					$scope.save(objetos[i],null,null,true);
			}
		}

		$scope.save  = function(objeto,nextLink,reqs,attrUnique){

			$scope.savingStatus=true;

			//Adicionar atributos ao objeto de acordo com a tab
			if($scope.activeTab){

				var appends  = $scope.activeTab.objectAppend;

				for(var key in appends){

					objeto[key] = appends[key];

				}

			}

			if(!objeto)
				$stModal.show({mensagem:"Preencha os campos corretamente."});

			//Valiação dos Campos
			for(var i in reqs){

				if(!objeto[reqs[i]] && reqs[i]!='id'){

					$stModal.show({mensagem:"O campo "+reqs[i]+" está vazio."});
					return;

				}

			}

			if(attrUnique){

				var query = attrUnique+"='"+objeto[attrUnique]+"'";
				console.log("Query: "+query);
				stService.getLikeMap($scope.nomeObjeto,[query],0,0,"").success(function(data){

					if(data.itens.length>0){
						stUtil.showMessage("","Já existe um registro com '"+objeto[attrUnique]+"' cadastrado no sistema","danger");
						return;
					}
					else {
						saveObject(objeto,nextLink);
					}

				});
			}

			else{

				saveObject(objeto,nextLink);
			}

		}

		$scope.getLike = function(query,propriedade){

			$scope.loading=true;

			if(!query)
				query="";

			console.log("Prop: "+propriedade);

			if(!propriedade)
				propriedade="nome";

			stService.getLike($scope.nomeObjeto,query,propriedade).success(function(data){

				$scope.objetos = data.itens;
				itens = data.itens;

				$scope.loading=false;
			});

		}

		//Máxima de itens por pagina
		$scope.setMaxIni = function(max){

			maxIni = max;

		}

		$scope.getLikeMap = function(qs,pagina,max,extra,orderBy,ordem){

			$scope.loadingStatus=true;

			if($scope.fixQuerys)
				qs =	qs.concat($scope.fixQuerys);

			//Query do bloco direito
			if($scope.rightQuery)
				qs.push($scope.rightQuery);

			//Adicionando ordenacao
			if(orderBy && orderBy!=null){
				if(!extra)
					extra="";
				extra+=" order by "+orderBy+" "+ordem;

			}

			if(!qs || qs.length==0  )
				qs =[""];

			stService.getLikeMap($scope.nomeObjeto,qs,pagina,max, extra).success(function(data){

				$scope.countAll = data.countAll;//Quantidade total de itens independente da paginação
                $scope.objetos = data.itens;
				itens = data.itens;
				$scope.loadingStatus=false;

			});

		}

		$scope.disableObject = function(objeto,callback,message){

			objeto.disable=1;

			stService.save($scope.nomeObjeto,objeto).success(function(data){

				stUtil.showMessage("",message||'Item removido com sucesso!',"info");
				callback(data);

			});
		} 

		$scope.apagar =  function(objetos){

			var ids =[];
			var selecionados = objetos.filter(function(ob,index){

				if(ob.selecionado){
					ids.push(ob.id);
					objetos.splice(index,1);
				}
			});

			if(ids.length==0){

				stUtil.showMessage("Nenhum item selecionado.","","danger");
				return;
			}

			stService.apagar($scope.nomeObjeto,ids).success(function(data){

				var msg ="";
				if(ids.length>1)
					msg="Itens excluidos com sucesso!";
				else
					msg="Item excluido com sucesso!";

				stUtil.showMessage("",msg,"success");

			});
		}

		$scope.getLink = function(pagina){

			if(pagina=='comanda')
				return $location.$$host+":1220/Albar/comanda/index.html#/inicio"

		}

		function saveObject(objeto,nextLink){

			stService.save($scope.nomeObjeto,objeto).success(function(data){

				$scope.objeto = data.item; 

				if(nextLink)
					$location.path(replaceByAttr(nextLink,data.item));

				stUtil.showMessage("","Salvo com sucesso!","success");
				$route.reload();
				$scope.objeto={};

			});

		}

	});

	//Replace no formato 'abcdefghijklmno[attr]'
	function replaceByAttr (string,item){

		var pattern  = new RegExp(/\[[a-z]+\]/);
		var atributo  = pattern.exec(string);
		var attr = atributo[0];
		attr = attr.replace("[","");
		attr  = attr.replace("]","");
		string = string.replace(pattern,item[attr]);
		return string;

	}

})();
