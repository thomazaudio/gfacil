
var cadastraMovPage = require("./cadastraMovPage");

var parcelaMovComponent = require("./parcelaMovComponent")("id");




var movRecorrente = {
		
		valor:"45000",//=450,00
		descricao: "Movimentação Test",
		modoRepeticao:3
		
}

describe("Teste em parcela-mov",function(){
	
	browser.get("#/teste");
	browser.waitForAngular();
	
	parcelaMovComponent.getOriginalMov("valor").clear();
	parcelaMovComponent.getOriginalMov("valor").sendKeys("45000");
	
	browser.sleep(1000);
	
	parcelaMovComponent.addParcelas([{valor:"15000"},{valor:"15000"}]);
	
	browser.sleep(3000);
	
	
	
	
});


/*

describe("Teste em Movimentações",function(){
	
	it('Cadastro de movimentação recorrente',function(){
		
		
		cadastraMovPage.cadastrarDespesa(movRecorrente);
		
	});
	
});

*/