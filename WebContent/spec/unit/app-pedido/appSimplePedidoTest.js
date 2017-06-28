describe('Testes módulo appSimplePedio', function () {

	var appSimplePedidoController,$controller,mockScope={},$rootScope;

	beforeEach(module("adm"));

	
	beforeEach(inject(function(_$controller_,_$rootScope_){
		
		$rootScope = _$rootScope_;
		
		$rootScope.config = {
				
				confs:{attrBuscaProdutoInPdv:"nome"}
		};

		appSimplePedidoController = _$controller_("appSimplePedidoController",{$scope:mockScope});
		$controller = _$controller_;
		

	}));
	
	
	mockScope.labelValorUnitario="Valor unitário";//Label para exibição em preço unitário do produto
	mockScopelabelQuantidade="Quantidade";//label para quantidade de um pedido
	mockScope.pedidos=[{
		produto: {id:1,nome:"Produto teste",valor:20},
		quantidade:10,
		valorUnitario:25
	}];
	mockScope.hideValorUnitario="false";
	mockScope.modoAtEstoque="1";//1=somar, 2=subtrair
	mockScope.attrBuscaProduto="nome";//a	
	
	


	it("Testar funcao deletarPedido()",inject(function(pedidoUtil){

		var scope = angular.copy(mockScope);

		var pedidos = [{
			produto:{id:1,nome:"Produto teste"},
			valorUnitario:25,
			quantidade:2
		}];
		scope.pedidos = pedidos;

		var ctrl = $controller("appSimplePedidoController",{$scope:scope});

		//Antes de deletar
		expect(pedidoUtil.getTotalPedidos(scope.pedidos)).toBe(50);

		scope.deletarPedido(scope.pedidos[0]);

		//Após deletar
		expect(pedidoUtil.getTotalPedidos(scope.pedidos)).toBe(0);


	}));

	it("O preço unitário do produto deve permanecer ao deletar um pedido",inject(function(){

		var scope = angular.copy(mockScope);

		var pedidos = [{
			produto:{id:1,nome:"Produto teste"},
			valorUnitario:25,
			quantidade:2
		}];
		scope.pedidos = pedidos;

		var ctrl = $controller("appSimplePedidoController",{$scope:scope});

		
		scope.deletarPedido(scope.pedidos[0]);

		expect(scope.pedidos[0].valorUnitario).toBe(25);


	}));
	
	
	
	it("Cadastrar novo produto através do atalho 'cadastrar produto'",inject(function(){

		var scope = angular.copy(mockScope);

		var pedidos = [{
			produto:{id:1,nome:"Produto teste"},
			valorUnitario:25,
			quantidade:2
		}];
		scope.pedidos = pedidos;

		var ctrl = $controller("appSimplePedidoController",{$scope:scope});

		
		scope.cadProduto();

	}));
	
	

	it("Mudança de atributo na busca de produto",inject(function($cookieStore){

		var scope = angular.copy(mockScope);

		var pedidos = [{
			produto:{id:1,nome:"Produto teste"},
			valorUnitario:25,
			quantidade:2
		}];
		scope.pedidos = pedidos;
		
		
		if(!$cookieStore.get("usuarioSistema"))
			$cookieStore.put("usuarioSistema",{originalLogin:"31992267947@31992267947"});

		var ctrl = $controller("appSimplePedidoController",{$scope:scope,$rootScope:$rootScope});

		
		scope.changeAttrBuscaProduto("nome");
		
		expect(scope.attrBuscaProduto).toBe("nome");

	}));






});
