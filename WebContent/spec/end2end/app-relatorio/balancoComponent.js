
'use strict'


var BalancoComponent = function(componentId){

	this.component = element(by.id(componentId));

	//Ids para identificação
	//receitas-previstas 
	var idReceitasPrevistas = "receitas-previstas";

	//Recupera o valor de determinado atributo
	this.getValue = function(id,callback){

		this.component.all(by.id(id)).get(0).getAttribute("value").then(function(value){

			callback(parseFloat(value))
		});


	}

	//Recupera a informação completa do balanço

	this.getAllInfo = function(callback){

		var balanco = {};

		this.getValue("receitas-previstas",function(valor){

			balanco.receitasPrevistas = valor;

		});

		this.getValue("receitas-realizadas",function(valor){

			balanco.receitasRealizadas = valor;

		});

		this.getValue("despesas-previstas",function(valor){

			balanco.despesasPrevistas = valor;

		});

		this.getValue("despesas-realizadas",function(valor){

			balanco.despesasRealizadas = valor;

		});
		
		callback(balanco);

	}





};

module.exports = function(componentId){

	return new BalancoComponent(componentId);

}


