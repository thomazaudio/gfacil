
'use strict'


var stPeriod = require("./../st-util/stPeriodComponent")("st-period-balanco");
var componentBalanco= require("./../app-relatorio/balancoComponent")("component-balanco");


var RelatorioPage = function(){
	
	//Componentes acessiveis dentro da página em questão
	this.stPeriod = stPeriod;
	this.componentBalanco = componentBalanco;
	

	this.get = function(){
		
		browser.get("#/financeiro/balanco");
		browser.waitForAngular();
	}
   
	
};

module.exports = new RelatorioPage();


