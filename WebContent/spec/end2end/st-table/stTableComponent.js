
'use strict'

var filterMapComponent = require("./../st-filter/filterMapComponent")("filtros-table");
var StTableComponent = function(pagina){
	
	this.buttonOpenCadOb = element(by.id("btn-cad-ob"));
	this.buttonSaveCadOb = element(by.id("btn-save-cad-ob"));
	
	this.filterMap = filterMapComponent;
	
	this.get = function(){
		
		browser.get("#/"+pagina);
		browser.waitForAngular();
	}
	
	
	this.getObjetos= function(){
		
		return element.all(by.repeater("ob in objetos"));
		
	}
	
	this.getObjeto = function(index,attr){
		
		var objeto= this.getObjetos().get(index);
		
		if(!attr)
			return objeto;
		
		return objeto.all(by.model("ob."+attr));
	}
	
	
	//Abre modal com detalhes do objeto
	this.openDetalhe = function(index){
		
		var objeto = this.getObjeto(index);
		
		objeto.all(by.css(".open-detalhe")).click();
		
		
	}
	
	//Cadastra um objeto
	
	this.cadOb = function(ob){
		
		this.buttonOpenCadOb.click();
		
		for(var key in ob){
			
			element(by.css(".cad-ob-"+key)).sendKeys(ob[key]);
		}
		
		this.buttonSaveCadOb.click();
		
		browser.waitForAngular();
	}

   
	
};

module.exports = function(pagina){
	
	return new StTableComponent(pagina);
	
}
