
'use strict'


var ParcelaMovComponent = function(componentId){
	
	this.component = element(by.id(componentId));
	
	this.btnAddParcela = this.component.all(by.id("btn-add-parcela"));
	this.btnRecalculaParcelas = this.component.all(by.id("btn-recalcula-parcelas"));
	this.btnOk = this.component.all(by.id("btn-ok"));//Em caso de modal
	
	this.addParcela = function(mov){
		
		this.btnAddParcela.click();
		
	}
	
	
	this.addParcelas = function(parcelas){
		
		//adicionar as demais parcelas
		for(var i=0;i<parcelas.length;i++){
			this.addParcela();
		}
				
		for(var i=0;i<parcelas.length;i++){

			for(var key in parcelas[i]){

				if(parcelas[i][key]){

					this.getParcela(i,key).sendKeys(parcelas[i][key]);
				}
			}

		}
		
	}
	
   //Movimentação original (base)
	
	this.getOriginalMov = function(attr){
		
		return this.component.all(by.model("movs[0]."+attr));
	}
	
   this.recalcularParcelas = function(){
	   this.btnRecalculaParcelas .click();
   }
   
   //Ultima parcela
   this.getLastParcela = function(attr){
	   
	return this.getParcela(this.lengthParcelas()-1,attr);
   }
   
   //Recupera uma parcela na posição especificada
   this.getParcela = function(index,attr){
	   
	   var parcela =   this.getParcelas().get(index);
	   return parcela.all(by.model("mov."+attr));
	   
   }
   
  
   
   //Todas as parcelas
   this.getParcelas = function(){
	   
	  return this.component.all(by.repeater("mov in movs"));
   }
   
   //Quantidade de parcelas
   this.lengthParcelas = function(){
	   
	   return this.component.all(by.repeater("mov in movs")).length;
   }
	
};

module.exports = function(componentId){
	
	return new ParcelaMovComponent(componentId);
	
}


