
var novaVendaPage = require("./novaVendaPage");

var filterMapComponent = require("./../st-filter/filterMapComponent")("filtro-vendas");
var stTableComponentClientes = require("./../st-table/stTableComponent")("cliente");
var movListComponentPessoa = require("./../app-mov/movListComponent")("mov-list-pessoa");


var defaultPDV = {
		movimentacao: {
			baixada:true,
			pessoa: {nome:"Cliente "+new Date().getTime()},
			pedidos: [
			          {
			        	  produto: {nome:"Produto teste"},
			        	  quantidade:"10",
			        	  valorUnitario:"4500"//no input é transformado em R$ 30.00
			          }
			          ]
		},

		parcelas:[{valor:"15000"},{valor:"15000"}]
};



describe("Teste em PDV",function(){
	
	
	it("Realiza o cadastro do cliente para o qual será realizado a venda",function(){
		
		stTableComponentClientes.get();
		stTableComponentClientes.cadOb(defaultPDV.movimentacao.pessoa);
		
	});
	
	
	
	it('Efetuar nova venda com parcelas',function(){
		
		novaVendaPage.novaVenda(defaultPDV);
		
		browser.sleep(1000);
		
	});
	
	
	it("Verificar se as parcelas foram inseridas na movimentação do cliente",function(){
		
		//Vai para página de clientes cadastrados
		stTableComponentClientes.get();
		
		
		//Realizada a busca utilizando a instancia de filterMapComponent injetada em stTableComponent
		stTableComponentClientes.filterMap.inputBusca.sendKeys(defaultPDV.movimentacao.pessoa.nome);
		
		browser.waitForAngular();
		
		//Abre o detalhe do cliente
		stTableComponentClientes.openDetalhe(0);
		
		//TODO verificar se as parcelas da venda foram lançadas corretamente
		browser.waitForAngular();
		
		
		//
		//expect(movListComponentPessoa.getMovs(0)).toBe(2);
		
		
	});
    
	
	it("Excluir venda",function(){
		
		browser.get("#/pdv");
		browser.waitForAngular();
		
		
		filterMapComponent.setFiltro(1,defaultPDV.movimentacao.pessoa.nome);
		
		browser.sleep(5000);
		
		
	});
	
	
	
	
	
});