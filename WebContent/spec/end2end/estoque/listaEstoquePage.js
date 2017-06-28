
'use strict'


var ListaEstoquePage = function(){

	this.inputBusca = element(by.id("busca"));
	this.btnOpenCadProduto = element(by.id("btn-cad-produto"));
	this.inputNomeProduto = element(by.model("produto.nome"));
	this.inputPrecoProduto = element(by.model("produto.preco"));
	this.btnFinalizaCadastroProduto = element(by.id("btn-finaliza-cadastro-produto"));
	this.inputAllFiliais = element(by.model("objeto.allFilials"));

	
	this.defaultProduto = {
			nome:"Produto teste",
			quantidade: 100
	}
	
	
	//Altuaização de estoque através de entrada de mercadoria
	//prods é array no seguinte formato = produtos = [{nome:"Produto teste",quantidade:20}]
	this.cadastrarProduto = function(produto){
		
		 this.btnOpenCadProduto.click();
		 browser.waitForAngular();
		 
	     produto = produto||this.defaultProduto;
	     this.inputNomeProduto.sendKeys(produto.nome);
	     this.inputPrecoProduto.sendKeys(produto.preco||'');
	     
	     
	     if(produto.allFilials==false)
	    	 this.inputAllFiliais.click();
	     
         this.btnFinalizaCadastroProduto.click();
	     browser.waitForAngular();
		 
	}


	this.get= function(){
		browser.get("#/produto");
		browser.waitForAngular();

	}


	//Alterar a quantidade de um produto de forma manual
	this.manualAltQuantidade = function(prods){

		this.get();


		for(var i in prods){

			
			var produto = this.buscarProduto(prods[i].nome).get(0);
			
			produto.all(by.css(".btn-show-quantidade")).get(0).click();
			
			browser.waitForAngular();

			produto.all(by.css(".btn-edit-quantidade")).get(0).click();
			browser.waitForAngular();
			element(by.model("novaQuantidade")).sendKeys(prods[i].quantidade);
			element.all(by.css(".confirma-edit-estoque")).get(0).click();
			browser.waitForAngular();
		}


	}
	
	
	this.deletarProduto = function(nomeProduto){
		
		this.get();
		this.buscarProduto(nomeProduto).get(0).all(by.css(".btn-delete-produto")).click();
		browser.waitForAngular();
		element(by.id("confirm-ok")).click();
		
	}
	
	
	//Retorna o elemento referente a lista de resultados após efetuar a busca
	this.buscarProduto = function(nomeProduto){
		
		this.inputBusca.clear();
		this.inputBusca.sendKeys(nomeProduto);
		browser.waitForAngular();
		return element.all(by.repeater("ob in objetos"));

	}



	//Recupera a quantidade um produto
	this.getQuantidade = function(nomeProduto,callback){

		this.get()
	
		var produto = this.buscarProduto(nomeProduto).get(0);
		

		produto.all(by.css(".quantidade-produto")).get(0).getAttribute("value").then(function(value){

			callback(parseFloat(value));
		});

	}


};

module.exports = new ListaEstoquePage();


