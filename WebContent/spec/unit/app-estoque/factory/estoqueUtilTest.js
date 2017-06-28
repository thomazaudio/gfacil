describe('Testes módulo estoqueUtil', function () {

	var $httpBackend;
	
	var produtoMock =  {id:2,nome:"Produto teste"};


	beforeEach(module("adm"));


	beforeEach(inject(function(_$httpBackend_){

		$httpBackend = _$httpBackend_;

	}));
	
	
	
	
	
	it("Teste atualização de estoque para vendas (Saida)",inject(function(estoqueUtil,cacheGet){
		
		
		/*

		cacheGet.add("produto",[produtoMock],function(){


		});
		
		var pedidos = [
		  {quantAnt:0,quantidade:10,valorUnitario:20,produto:produtoMock}
		 ];
		
		//Recupera objeto auxiliar de atualização de estoque para Saídas (Vendas)
        var atEstoque = estoqueUtil.getAtEstoqueSaida(pedidos);
		estoqueUtil.atualizaEstoque(atEstoque);
		
		expect(cacheGet.getObjectById("produto",produtoMock.id).quantidade).toBe(-10);
		
		*/

	}));


	it("Teste em getEstoqueProduto",inject(function(estoqueUtil,cacheGet){

	

		/*
		cacheGet.add("produto",[produtoMock],function(){


		});

		
		var responseMocks = {"cod":null,"item":null,"itens":[100.0]};

		$httpBackend.whenPOST("http://server/projecao/get-projecoes/").respond(responseMocks);
		

		var quantidadeEsperada = 0;

		estoqueUtil.getEstoqueProduto(produtoMock,function(produto){

			expect(produto.quantidade).toBe(quantidadeEsperada);

			expect(cacheGet.getObjectById("produto",produtoMock.id).quantidade).toBe(quantidadeEsperada);

		});
		
		
		$httpBackend.flush();
		
		
		*/

	}));
	
	
	it("Teste em getEstoqueProduto sem movimentações",inject(function(estoqueUtil,cacheGet){

		/*

		cacheGet.add("produto",[produtoMock],function(){


		});

		
		var responseMocks = {"cod":null,"item":null,"itens":[null]};

		$httpBackend.whenPOST("http://server/projecao/get-projecoes/").respond(responseMocks);
		

		var quantidadeEsperada = 0;

		estoqueUtil.getEstoqueProduto(produtoMock,function(produto){

			expect(produto.quantidade).toBe(quantidadeEsperada);

			expect(cacheGet.getObjectById("produto",produtoMock.id).quantidade).toBe(quantidadeEsperada);

		});
		
		
		$httpBackend.flush();
		
   */
	}));




});
