



'use strict'
var relatorioPage = require("./app-relatorio/relatorioPage");


describe("Testes em relatórios",function(){
	
	
	   it("Teste",function(){
		   
		   relatorioPage.get();

			//Muda para "Desde inicio do ano"
			relatorioPage.stPeriod.changePeriod(3);

			//Chama o submit para efetivar a mudança de periodo
			relatorioPage.stPeriod.buttonSubmit.click();

			
			browser.waitForAngular();

			relatorioPage.componentBalanco.getValue("receitas-previstas",function(valor){

				expect(valor).toBe(5);

			});

		   
	   });
	
		
		


});