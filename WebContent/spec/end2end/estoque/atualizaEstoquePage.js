
'use strict'


var AtualizaEstoquePage = function(){


	this.get = function(){
		browser.get("#/entradamercadoria/add");
		browser.waitForAngular();
	}


	this.inputBuscaProduto =  element(by.model("nomeProduto"));

	this.btnBuscaProduto = element(by.css(".busca-produto"));
	
	this.inputCusto = element(by.model("at.movimentacao.valor"));

	this.buttonFinalizarAtualizacao = element(by.id("finalizar-atualizacao-estoque"));
	
	


	this.defaultEntradaEstoque = {
			atEstoque: {
				prods:[{nome:"Produto teste",quantidade:"100"}]
			}
	};

	this.setCusto = function(custo){

		this.inputCusto.clear();
		this.inputCusto.sendKeys(custo);

	}



	//Altuaização de estoque através de entrada de mercadoria
	//prods é array no seguinte formato = produtos = [{nome:"Produto teste",quantidade:20}]
	this.lancarEntradaMercadoria = function(entradaEstoque){

		this.get();

		entradaEstoque = entradaEstoque||this.defaultEntradaEstoque;

		//Seta atributos presentes na movimentção
		if(entradaEstoque.movimentacao){

			this.setCusto(entradaEstoque.movimentacao.valor);
		}



		browser.waitForAngular();

		//Garante que a busca seja efetuada pelo nome do produto
		element(by.id("change-attr-busca")).click();
		element(by.id("change-busca-nome")).click();
		browser.waitForAngular();

		var prods= entradaEstoque.atEstoque.prods;

		for(var i in prods){

			//Efeuta a busca  
			this.inputBuscaProduto.clear();
			this.inputBuscaProduto.sendKeys(prods[i].nome);
			this.btnBuscaProduto.click();
			browser.waitForAngular(); 

			//Seta a quantidade
			element.all(by.repeater("r in itens")).get(0).all(by.tagName("input")).get(0).sendKeys(prods[i].quantidade);

		}

		this.buttonFinalizarAtualizacao.click();

		browser.waitForAngular(); 


	}

	//Recupera a quantidade um produto
	this.getQuantidade = function(nomeProduto,callback){

		browser.get("#/produto");
		browser.waitForAngular();
		element(by.id("busca")).sendKeys(nomeProduto);
		browser.waitForAngular();

		var produto = element.all(by.repeater("ob in objetos")).get(0);

		produto.all(by.css(".btn-edit-quantidade")).get(0).getAttribute("value").then(function(value){

			callback(parseFloat(value));
		});

	}


};

module.exports = new AtualizaEstoquePage();


