'use strict';
var filialListComponent = function(componentId){
	
	this.component = element(by.id(componentId));
	
	
	this.btnEscolherFilial = this.component.all(by.css(".btn-escolher-filial"));
	this.buttonImprimir  = this.component.all(by.id("btn-imprimir"));
	
	
	
	this.getFiliais = function(){
		
		return this.component.all(by.css(".filial-list"));
		
	}
	
	
	//Muda para filial na posição indicada
	this.setFilial = function(index){
		
		
		this.btnEscolherFilial.click();
		browser.waitForAngular();
		this.getFiliais().get(index).click();
		
		browser.waitForAngular();
		
	}
	
	
	
};

module.exports = function(componentId){
	
	return new filialListComponent(componentId);
	
}


