"use strict";
(function(){
	angular.module("adm") 
	.controller("detalheMovController",function(mov,callback, movUtil, stUtil, $modalInstance){

		var vm = this;

		if(!mov.data)
			mov.data = new Date();

		vm.mov = mov;
		var descTipoMov = "";
		var labelTitleMov;

		var placeHolderCategoria = "";

		if(mov.tipo==1){
			vm.objetoDescricao="categoria_conta_pagar";
			descTipoMov = "Despesa";
			placeHolderCategoria="Ex: Higienização caixas"
		}
		else if(mov.tipo==2){
			vm.objetoDescricao="categoria_conta_receber";
			descTipoMov = "Receita";
		}

		vm.mov.modoRepeticao = vm.mov.modoRepeticao||0;
		vm.mov.formaPagamento = vm.mov.formaPagamento||"Dinheiro";
		vm.placeHolderCategoria = placeHolderCategoria ;

		if(mov.id){
			labelTitleMov="Editar Movimentação"
		}
		else {
			labelTitleMov = "Cadastro de nova "+descTipoMov;						
		}

		vm.labelTitleMov = labelTitleMov;

		//Alteração de Baixa
		//Altera o Status
		vm.alterarBaixa =function(mov){

			if(!mov.id)
				return;

			movUtil.alterarBaixa(mov,function(mov){

				if(callback)
					callback(mov);
			});
		}

		vm.callbackParcelaMov = function(modal){

			$modalInstance.close();

		}

		//Apagar movimentação
		vm.deleteMov = function(){

			var mov = vm.mov;
			
			movUtil.deleteMov(mov, function(){

				$modalInstance.close();

				stUtil.showMessage("","Movimentação deletada com sucesso!");

				if(callback)
					callback(mov);
			});

		}

		//Cadastro
		vm.cadMov = function(){

			var movs = vm.movs;
			
			vm.salvando = true;

			movUtil.cadMov(movs,function(data){

				vm.salvando = false;

			$modalInstance.close();

				if(callback)
					callback(data);

			});

		}

		vm.fechar = function(){

			$modalInstance.close();
			callback();
		}

	})

})();
