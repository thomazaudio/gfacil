
'use strict';
var MovListComponent = function(componentId){

	this.component = element;
	this.buttonCad  = this.component.all(by.id("btn-cadastrar"));
	this.buttonImprimir  = this.component.all(by.id("btn-imprimir"));


	this.getMovs = function(idGrupo){

		var grupo = this.component.all(by.id("group-"+idGrupo));

		return grupo.all(by.repeater("mov in movs"));

	}

	this.lengthMovs = function(){

		return this.component.all(by.repeater("mov in movs")).length;
	}

};

module.exports = function(componentId){

	return new MovListComponent(componentId);

}


