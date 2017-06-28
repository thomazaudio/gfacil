"use strict";
(function(){
angular.module("adm").controller("registroPontoController",function(stService,stUtil){
	
	var vm  = this;
	
	vm.deletarRP = function(index,rp,objetos){
		
		objetos.splice(index,1);
		
		stService.apagar("registroponto",[rp.id]).success(function(){
			stUtil.showMessage("","Item excluido com sucesso!");
		});
	}
	
	vm.abrirPonto  = function(){
		
		var ponto = {};
		ponto.pessoa = vm.pessoa;
		stService.executePost("registroponto/abrir-ponto/",ponto).success(function(){
			 
			stUtil.showMessage("","Ponto registrado com sucesso!","info");
			delete vm.ponto;
			
		}).error(function(){
			
			stUtil.showMessage("","Ocorreu um erro ao registrar o ponto, tente novamente.","danger");
		});
		
	}
	
	vm.fecharPonto  = function(ponto){
		
		stService.executePost("registroponto/fechar-ponto/",ponto).success(function(){
			
			stUtil.showMessage("","Ponto fechado com sucesso!","info");
			delete vm.ponto;
			
		}).error(function(){
			stUtil.showMessage("","Ocorreu um erro ao registrar o ponto, tente novamente.","danger");
		});
		
	}
	
	vm.buscaPonto = function(pin){
		
		var qs = ["pessoa.pin="+pin,"dataFim=null"];
		
		stService.executeGet("funcionario/b",{propriedade:"pin",query:pin}).success(function(data){
			
			vm.pessoa  = data.itens[0];

			if(data.itens[0]){
				
				//Recupera pontos abertos para esse funcionário
				stService.getLikeMap("registroponto",["pessoa.pin="+pin,"dataFim=null"],0,0,'').success(function(data){
					
					console.log("Pontos abertos do funcionário: ");
					console.log(data.itens);
					vm.ponto = data.itens[0];
					if(!vm.ponto)
						vm.ponto = {};
					
				});
				
			}
			else{
				stUtil.showMessage("","Funcionário não encontrado!","danger");
			}
			
		});
		
	}
	
});

})();