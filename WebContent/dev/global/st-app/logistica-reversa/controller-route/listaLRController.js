angular.module("adm").controller("listaLRController",function($route, $scope, $window, $uibModal, stService, stUtil, lrUtil, dateUtil){

	var vm = this;
	
	vm.devolvidasSemanaPeriodo = dateUtil.getPeriodOf("SEMANA_ATUAL");
	vm.labelDevolvidasSemana = "Embalagens devolvidas na semana atual";
	//Embalagens devolvidas essa semana
	vm.devolvidasSemana  = {
			
				labelColumn:"pessoa.nome",
				valueColumn:"sum(quantidade)",
				periodColumn:"dataCadastro",
				objeto:"LogisticaReversa",
				tooltipTemplate:"<%= label +': '+ value + ' unidade(s)'  %>",
				qs:["tipo=1"]	
	}
	
	$scope.$watch('vm.activeTab',function(tab){
		
		if(tab==1){
			vm.getTotalEmbalagensReceber();
		}
		
	});
	
	vm.getTotalEmbalagensReceber = function(){
		  
		   var queryBase = "select sum(valor) from  Movientacao";
		   
		   var info = {
				   
				   objeto:"LogisticaReversa",
				   qs: ["disable=0", "tipo=2"],
				   extra:"",
				   columns:"sum(quantidade)"
		   }
		   
		   //Emprestimos
		   stService.getProjecoes(info).success(function(dadosEmprestimos){
			   
			  var emprestimos  = dadosEmprestimos.itens[0];
			  
				   //Emprestimos
			       info.qs =  ["disable=0", "tipo=1"];
				   stService.getProjecoes(info).success(function(dadosDevolucoes){
					   
					  var devolucoes  = dadosDevolucoes.itens[0];
					  vm.totalEmbalagensReceber = emprestimos - devolucoes;
					   
				   });
			   
		   });
		   
		  
	}

	vm.getLrs= function(nomePessoa){

		var query = "where disable=0 and pessoa.disable=0";

		if(nomePessoa)
			query += " and  pessoa.nome like '%"+nomePessoa+"%' "

			//Reupera todos os registros de logística reversa pra pessoa informada
			stService.executeGet("/projecao/execute-query",{query:"select pessoa.id, pessoa.nome from LogisticaReversa "+query+" group by pessoa.id order by id desc"}).success(function(data){

				var lrs = data.itens;

				var clientes = [];

				for(var i in lrs){
					var cliente = {id:lrs[i][0],nome:lrs[i][1]};

					clientes.push(cliente);
				}

				vm.objetos = clientes;

			});

	}

	vm.getLrs();

	vm.openDetalhe = function(lr){

		lrUtil.openDetalhe(lr,function(res){

			vm.getLrs();
			 
		});
	}


});