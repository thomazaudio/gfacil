
'use strict'


var StPeriodComponent = function(componentId){
	
	this.component = element(by.id(componentId));
	this.buttonOpenChangePeriod =  this.component.all(by.id("btn-open-change-period"))
    this.buttonSubmit = this.component.all(by.id("btn-ok"));
	
	
	this.changePeriod = function(index){
		
		this.buttonOpenChangePeriod.click();
		
		this.getPeriods().get(index).click();
		
	}
	
	
	//Recupera os periodos pre-definidos
	
	this.getPeriods = function(){
		
		return this.component.all(by.css(".item-period"));
	}
	
	
	
};

module.exports = function(componentId){
	
	return new StPeriodComponent(componentId);
	
}


