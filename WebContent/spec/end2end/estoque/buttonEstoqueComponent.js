
'use strict';
var buttonEstoqueComponent = function(component){

	this.setComponent = function(component){

		if(typeof componente=="string")
			this.component = element(by.id(component));

		else
			this.component = component;

	}

	this.setComponent(component);
	this.btnShowQuantidade = this.component.all(by.id("btn-show-quantidade"));
	this.btnAtualizaQuantidade = this.component.all(by.id("btn-atualiza-quantidade"));
	this.btnEditQuantidade = this.component.all(by.id("btn-edit-quantidade"));



};

module.exports = function(component){

	return new buttonEstoqueComponent(component);

}


