
'use strict'

 var LoginPage = function() {
	
    this.inputEmpresa =  element(by.model("login.empresa"));
	this.inputUsuario =  element(by.model("login.usuario"));
	this.inputSenha =  element(by.model("login.senha"));
	this.botaoLogar = element(by.id("btn-login"));
	
	this.defaultLogin= {
			empresa:"31992267947",
			usuario:"31992267947",
			senha:"leghacy123"
	};
	
	
	this.get = function(){
		browser.get("#/login");
		browser.waitForAngular();
	}
	
	
	
	this.clearInputs = function(){
		
		this.inputEmpresa.clear();
		this.inputUsuario.clear();
		this.inputSenha.clear();
	}

	
	
	this.logar = function(login){
		
		this.get();
		
		login = login || this.defaultLogin;
		
		this.clearInputs();
		this.inputEmpresa.sendKeys(login.empresa);
		this.inputUsuario.sendKeys(login.usuario);
		this.inputSenha.sendKeys(login.senha);
		
		this.botaoLogar.click();
	}
	
	
	
	
	
 };
 
 
 module.exports = new LoginPage();
      