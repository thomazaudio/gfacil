
'use strict'

var filterMapComponent = require("./../st-filter/filterMapComponent")("filtro-clientes");
var ListaClientePage = function(){
	
	
	this.filterMap = filterMapComponent;
	
	this.get = function(){
		
		browser.get("#/cliente");
		browser.waitForAngular();
	}
	
	
	this.getClientes = function(){
		
		return element.all(by.repeater("ob in objetos"));
		
	}
	
	this.getCliente(index,attr){
		
		var cliente= this.getClientes().get(index);
		
		if(!attr)
			return cliente;
		
		return cliente.all(by.model("ob."+attr));
	}
	
	
	//Abre modal com detalhes do cliente
	this.openDetalhe = function(index){
		
		var cliente = this.getCliente(index);
		
		
	}

   
	
};

module.exports = new ListaClientePage ();


