
'use strict'


var FilterMapComponent = function(componentId){
	
	this.component = element(by.id(componentId));
	this.inputBusca = this.component.all(by.id("busca"));
	this.buttonChangeFiltros= this.component.all(by.id("btn-change-filtros"));
	this.buttonLimpaBusca = this.component.all(by.id("span-limpa-busca"));
	
	
	//Lista de filtros definidos na estrutura de busca <ul></ul>
	this.getFiltros = function(){
		
		return this.component.all(by.repeater("info in filtros"));
	}
	
	
	//Seta o filtro na posição especificada
	//index indica a posição na lista de filtros disponíveis
	//value indica o valor a ser setado no campo de busca
	this.setFiltro = function(index,value){
		
		this.buttonChangeFiltros.click();
		this.getFiltros().get(index).click();
		this.inputBusca.clear();
		this.inputBusca.sendKeys(value);
		
	}
	
	
};

module.exports = function(componentId){
	
	return new FilterMapComponent(componentId);
	
}


