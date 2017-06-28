'use strict'


var InicioPage = function(){
	
	
	
	this.saldoGeral =  element(by.id("saldo-geral"));
	
	this.get = function(){
		
		browser.get("#/inicio");
		browser.waitForAngular();
	}
	
	this.getSaldoGeral = function(callback){
	
		this.saldoGeral.getAttribute("value").then(function(value){
			callback(parseFloat(value).toFixed(2));
		});
	}
	
};

module.exports = new InicioPage();