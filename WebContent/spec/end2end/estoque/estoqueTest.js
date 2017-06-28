var atualizaEstoquePage = require("./atualizaEstoquePage");
var listaEstoquePage = require("./listaEstoquePage");
var filialListComponent =  require("./../app-filial/filialListComponent")("filial-list-principal");

describe("Teste em estoque",function(){
	

	var produtoCadastroMock = {
			nome:"Produto"+new Date().getTime(),
			quantidade:0,
			preco:0,
			allFilials:true
	};
	
	
	it("Realiza cadastro de novo produto",function(){
		
		filialListComponent.setFilial(1);

		listaEstoquePage.get();//Vai para a página relacionada
		var produto =  listaEstoquePage.buscarProduto("Produto").get(0);
		var buttonEstoqueComponent =  require("./buttonEstoqueComponent") (produto.all(by.id("button-estoque")) );
		buttonEstoqueComponent.btnEditQuantidade.click();
		browser.sleep(10000);

	});
    
});