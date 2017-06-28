
'use strict'


var CadastraMovPage = function(){
	
	
	this.btnCadDespesa = element(by.id("btn-cad-despesa"));
	this.inputDescricao = element(by.model("vm.mov.descricao"));
	this.inputVencimento = element(by.model("vm.mov.data"));
	this.inputValor = element(by.model("vm.mov.valor"));
	this.btnFinalizaCadMov =  element(by.id("btn-finaliza-cad-mov"));
	
	
	
	//Altuaização de estoque através de entrada de mercadoria
	//prods é array no seguinte formato = produtos = [{nome:"Produto teste",quantidade:20}]
	this.cadastrarDespesa = function(mov){
		
		
		this.btnCadDespesa.click();
		browser.waitForAngular();
		this.inputDescricao.sendKeys(mov.descricao);
		this.inputValor.sendKeys(mov.valor);//R$ 30,00
		
		if(mov.modoRepeticao)
		 element(by.model('vm.mov.modoRepeticao')).$('[value="'+mov.modoRepeticao+'"]').click();
		
		
		this.btnFinalizaCadMov.click();
		
		 
	}

   
	
};

module.exports = new CadastraMovPage();


