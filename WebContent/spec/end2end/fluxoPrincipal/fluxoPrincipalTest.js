
'use strict'
var novaVendaPage = require("./../pdv/novaVendaPage");
var atualizaEstoquePage = require("./../estoque/atualizaEstoquePage");
var listaEstoquePage = require("./../estoque/listaEstoquePage");
var inicioPage = require("./../inicio/inicioPage");
var cadastraMovPage = require("./../app-mov/cadastraMovPage");
var relatorioPage =  require("./../app-relatorio/relatorioPage");
var filialListComponent =  require("./../app-filial/filialListComponent")("filial-list-principal");



describe('Teste de fluxo principal',function(){

	var saldoFilial2 = 0;//Saldo da filial na posição 2
	var saldo = 0;//Saldo geral inicial
	var nomeProduto = "Produto "+new Date().getTime();
	var quantidadeAtEstoque = 100;
	var valorAtEstoque = 300;
	var quantidadeVenda  = 10;
	var valorUnitarioVenda = 30;//R$ 30,00
	var nomePessoaVenda = "Paulo";



	var vendaMock = {
			movimentacao: {
				baixada:true,//Define a venda como paga
				pessoa: {nome:nomePessoaVenda},
				pedidos: [
				          {
				        	  produto: {nome:nomeProduto},
				        	  quantidade:quantidadeVenda,
				        	  valorUnitario:valorUnitarioVenda+"00"//no input é transformado em R$ 30.00
				          }
				          ]
			}
	};

	var entradaMercadoriaMock = { 
			atEstoque: {
				prods : [
				         {nome:nomeProduto,quantidade: quantidadeAtEstoque}    
				         ]
			}	 
	};


	var produtoCadastroMock = {
			nome:nomeProduto,
			quantidade:0,
			preco:0,
			allFilials:true
	};


	//Numero de execuções
	var numExec = 1;
	
	

	for(var i=0;i<numExec;i++){
		
		
		

		it("Verfica o saldo da filial 2",function(){

			inicioPage.get();


			filialListComponent.setFilial(2);


			inicioPage.getSaldoGeral(function(valor){

				saldoFilial2 += parseFloat(valor);
				expect(saldoFilial2).toBeDefined();

			});



		});




		it("Muda para filial 1 e verifica o saldo do sistema",function(){


			inicioPage.get();

			filialListComponent.setFilial(1);

			browser.sleep(5000);

			inicioPage.getSaldoGeral(function(valor){

				saldo += parseFloat(valor);
				expect(valor).toBeDefined();

			});

		});



		it("Realiza cadastro de despesa",function(){

			cadastraMovPage.cadastrarDespesa({descricao:"Mov teste",valor:"3000"});
			saldo-=30;

		});

		
		
		it("Realiza cadastro de novo produto",function(){

			listaEstoquePage.cadastrarProduto(produtoCadastroMock);

		});


		//Lança entrada de mercadoria
		it('Lançar entrada de mercadoria',function(){

			browser.waitForAngular();
			atualizaEstoquePage.lancarEntradaMercadoria(entradaMercadoriaMock);
			//saldo-=valorAtEstoque;

		});


		//Verifica se o estoque foi atualizado no sistema
		it('O estoque de "Produto teste" deve ser atualizado',function(){

			browser.waitForAngular();

			listaEstoquePage.getQuantidade(nomeProduto,function(value){


				expect(value).toBe(quantidadeAtEstoque);
			});

		});




		it('Realiza nova venda',function(){

			novaVendaPage.novaVenda(vendaMock);
			saldo+= (valorUnitarioVenda*quantidadeVenda);
		});


		//Verifica se o estoque foi atualizado após a venda
		it('O estoque  deve ser atualizado após a venda',function(){

			browser.waitForAngular();

			listaEstoquePage.getQuantidade(nomeProduto,function(value){


				expect(value).toBe(quantidadeAtEstoque-quantidadeVenda);
			});

		});



		it('Verifica saldo atual do sistema',function(){


			inicioPage.get();

			inicioPage.getSaldoGeral(function(valor){

				expect(saldo).toBe(parseFloat(valor));
			});



		});


		it("Verifica se o relatório de balanço está correto",function(){

			relatorioPage.get();

			//Muda para "Hoje"
			relatorioPage.stPeriod.changePeriod(0);

			//Chama o submit para efetivar a mudança de periodo
			relatorioPage.stPeriod.buttonSubmit.click();


			browser.waitForAngular();

			relatorioPage.componentBalanco.getValue("receitas-realizadas",function(receitasRealizadas){

				relatorioPage.componentBalanco.getValue("despesas-realizadas",function(despesasRealizadas){

					var saldoBalanco  = receitasRealizadas - despesasRealizadas;

					expect(saldoBalanco).toBe(saldo);

				});

			});


			browser.sleep(5000);


		});



		//Verifica se o estoque foi atualizado no sistema
		it('A quantidade em estoque do produto dever ser = 0 para filial posição=2',function(){


			browser.waitForAngular();


			filialListComponent.setFilial(2);

			listaEstoquePage.getQuantidade(nomeProduto,function(value){


				expect(value).toBe(0);
			});

		});



		it("O Saldo da filial 2 deve permanecer o mesmo",function(){

			inicioPage.get();


			filialListComponent.setFilial(2);


			inicioPage.getSaldoGeral(function(valor){


				expect(saldoFilial2).toBe(parseFloat(valor));

			});



		});



		it("Deleta produto cadastrado no inicio",function(){

			browser.waitForAngular();
			listaEstoquePage.deletarProduto(nomeProduto);

		});





	}



});