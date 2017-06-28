
var vr = browser.params.visualreview;

var loginPage = require("./../login/loginPage");

var loginMock = {
		empresa:"static",
		usuario:"static",
		senha:"static"
		
};

describe ('Testes - VisualReview', function () {
	
	  it ('Página inicial', function () {
		loginPage.logar(loginMock);  
		browser.waitForAngular();
		browser.sleep(3000);
	    vr.takeScreenshot('Início');
	  });
	  
	  it('Clientes', function(){
		  browser.get("#/cliente");
		  browser.sleep(3000);
		  vr.takeScreenshot('Clientes');

	  });
	  
	  it('Nova venda', function(){
		  browser.get("#/pdvficha/add");
		  browser.sleep(3000);
		  vr.takeScreenshot('Nova Venda');

	  
	  });
	  
	  it('Produtos', function(){
		  browser.get("#/produto");
		  browser.sleep(2000);
		  vr.takeScreenshot('Lista de produtos');

	  });
	  
	  
	  
	  
});