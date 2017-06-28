
'use strict'

var parcelaMovComponent = require("./../app-mov/parcelaMovComponent")("parcelas-venda");
var NovaVendaPage = function(){


	this.inputCliente = element(by.id("cliente-venda"));
	this.buttonFinalizaVenda = element(by.id("btn-finalizar"));
	this.inputBuscaProduto =  element(by.model("nomeProduto"));
	this.buttonSavePagou =  element(by.id("btn-save-pagou"));
	this.btnChangeParcelas = element(by.id("btn-change-parcelas"));//Abre modal para alterar parcelas
    this.btnBuscaProduto = element(by.css(".busca-produto"));

	this.defaultPDV = {
			movimentacao: {
				baixada:true,
				pessoa: {nome:"Paulo"},
				pedidos: [
				          {
				        	  produto: {nome:"Produto teste"},
				        	  quantidade:"10",
				        	  valorUnitario:"4500"//no input é transformado em R$ 30.00
				          }
				          ]
			},

			parcelas:[{valor:"15000"},{valor:"15000"}]
	};


	this.get = function(){

		browser.get("#/pdvficha/add");
		browser.waitForAngular();

	}

	//venda= objeto
	this.novaVenda = function(pdv){

		pdv = pdv || this.defaultPDV;

		this.get();


		//Garante que a busca seja efetuada pelo nome do produto
		element(by.id("change-attr-busca")).click();
		element(by.id("change-busca-nome")).click();
		browser.waitForAngular();

		var peds =  pdv.movimentacao.pedidos; 
		for(var i in peds){
			this.setPedido(peds[i]);
		}

		this.setCliente(pdv.movimentacao.pessoa.nome);

		if(pdv.movimentacao.baixada==true){

			this.buttonSavePagou.click();

		}

		
		browser.waitForAngular();

		if(pdv.parcelas && pdv.parcelas.length>0){
			
			//Parcelas
			this.btnChangeParcelas.click();

			var parcelas = pdv.parcelas;
			
			parcelaMovComponent.addParcelas(pdv.parcelas);
			
			//fecha o modal
			parcelaMovComponent.btnOk.click();
			
		}
		
		
		browser.waitForAngular();


		this.buttonFinalizaVenda.click();

		
		browser.waitForAngular();

	}



	this.setPedido = function(pedido){

		this.inputBuscaProduto.clear();

		//Busca
		this.inputBuscaProduto.sendKeys(pedido.produto.nome);
		this.btnBuscaProduto.click();
		browser.waitForAngular();

		//Propriedades do pedido
		var elementoPedido = element.all(by.repeater("r in itens")).get(0);
		var quant = elementoPedido.all(by.tagName("input")).get(0);
		var valorUnitario = elementoPedido.all(by.tagName("input")).get(1);
		valorUnitario.sendKeys(pedido.valorUnitario);
		quant.sendKeys(pedido.quantidade);

		browser.waitForAngular();

	}

	this.setCliente  = function(nome){

		//Escolha do cliente
		this.inputCliente.sendKeys(nome);
		browser.waitForAngular();
		element.all(by.repeater("item in obs")).get(0).click();

	}



};

module.exports = new NovaVendaPage();


