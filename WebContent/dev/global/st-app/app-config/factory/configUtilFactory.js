"use strict";
(function(){

	angular.module("adm")

	//Configurações do sistema
	.factory("configUtil",function($http, config, $uibModal,stService,$rootScope,stUtil,$localStorage){

		var _getConfig = function(callback){

				stService.getAll("config").success(function(data){
					$rootScope.config = data.itens[0];
					$localStorage.config = data.itens[0];
					callback($rootScope.config);
				});
			
		}

		//Altera deterinada configuração isoladamente
		var _setConfig = function(key,value,callback){

			var config = $rootScope.config;

			var confs = $rootScope.config.confs;

			confs[key] = value;

			config.confs = confs;

			stService.save("config",config).success(function(data){

				$rootScope.config=data.item;

				if(callback)
					callback(data.item)

			});

		}


		var _openConfig = function(tab, callback){

			$uibModal.open({
				animation: true,
				templateUrl:"global/st-app/app-config/template-module/config.html",
				size:'lg',
				controller:function($scope){

					$scope.activeTab = tab|| 0;

					//Módulos disponiveis
					$scope.modulos = [{nome:"Pessoas"},{nome:"Logística Reversa"},{nome:"Controle de Ponto"},{nome:"Estoque"},{nome:"Financeiro"},{nome:"Ferramentas"},{nome:"Relatorios"}];

					//Componentes de relatório
					$scope.itensRelatorio = [
					                         {label:"Balanço",value:"balanco"},
					                         {label:"Lançamentos anteriores baixados",value:"lancamentos_anteriores_baixados"},
					                         {label:"Lucro por período (Mensal)",value:"lucro_periodo_mensal"},
					                         {label:"Produtos mais vendidos",value:"produtos_mais_vendidos"},
					                         {label:"Faturamento por produto",value:"faturamento_por_produto"},
					                         {label:"Despesas por categoria",value:"despesas_por_categoria"}
					                         ];


					$scope.config = $rootScope.config;

					console.log("Config do rootScope: ");
					console.log($scope.config);

					//Garante que o id seja sempre=1
					$scope.config.id=1;

					//Módulos 
					var mds = $scope.modulos;

					//Módulos configurados para o usuário
					var mdsUser = [];


					//Relatórios configurados para o usuário
					var itensRelatorio = [];

					var itensRelatorioScope = $scope.itensRelatorio;

					if(!$scope.config.confs)
						$scope.config.confs = {};

					if($scope.config.confs.modulos)
						mdsUser = $scope.config.confs.modulos.split(",");

					if($scope.config.confs.itensRelatorio)
						itensRelatorio = $scope.config.confs.itensRelatorio.split(",");

					for(var i in mds){
						if(stUtil.buscaOb(mdsUser,mds[i].nome)!=-1)
							mds[i].selecionado=true;
					}

					for(var j in itensRelatorioScope){
						if(stUtil.buscaOb(itensRelatorio,itensRelatorioScope[j].value)!=-1)
							itensRelatorioScope[j].selecionado=true;
					}

					$scope.modulos = mds;
					$scope.itensRelatorio = itensRelatorioScope;

					$scope.salvar = function(){

						var conf = $scope.config;
						
						//Itens do relatório
						var its = $scope.itensRelatorio;
						var itensRelatorio = "";
						for(var j in its){

							if(its[j].selecionado==true)
								itensRelatorio+=its[j].value+",";
						}
						conf.confs.itensRelatorio = itensRelatorio;

						//Módulos
						var mds="";
						for(var i in $scope.modulos){

							if($scope.modulos[i].selecionado==true)
								mds+=$scope.modulos[i].nome+",";

						}
						conf.confs.modulos = mds;

						stService.save("config",conf).success(function(data){

							stUtil.showMessage("","Salvo com sucesso!","info");
							console.log("Config salvo: ");
							console.log(data.item);
							$rootScope.config=data.item;

						});

					}
					$scope.fechar = function(ele){

						ele.$dismiss('cancel');
						callback($scope.objeto);

					}

				}
			});
		};
		return {

			openConfig:_openConfig,
			getConfig: _getConfig,
			setConfig: _setConfig
		};

	})

})();
