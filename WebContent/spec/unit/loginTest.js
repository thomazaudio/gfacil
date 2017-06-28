describe('Testes em Login',function(){

	var loginUtil, $httpBackend,$localStorage,$cookieStore,$rootScope,cacheGet;

	var loginMock = {
			empresa:"31992267947",
			usuario:"31992267947",
			senha:"leghacy123"
	};

	var lembrarSenha = true;

	var responseMock = {
			"token":"31992267947@31992267947:1480528206877:2b09583edb16d30d6cb8ee41fe43bf6b",
			"usuarioSistema":{
				"id":1,
				"login":"31992267947@31992267947",
				"defaultPassword":false,
				"email":null,
				"nome":"GILBERTO","permissoes":"pdv, vendas, estoque, clientes,funcionários, fornecedores, balanço, movimentações, cadastros, registros de ponto, logística reversa"},
				"config":{"attrOrderByMovList":"pessoa.nome"}
	};

	//Cache de clientes após o login
	var responseCacheClientes = {"itens":[{id:1,nome:"Thomaz"},{id:2,nome:"Paulo"}]};

	//Cache de produtos após o login
	var responseCacheProdutos = {"itens":[{id:1,nome:"Produto teste"},{id:2,nome:"Produto 2"}]};

	beforeEach(module('adm'));
	
	beforeEach(inject(function(_loginUtil_,_cacheGet_,_$httpBackend_,_$localStorage_,_$cookieStore_,_$rootScope_){

		_$rootScope_.teste = "Deus é bom demais!";
		loginUtil = _loginUtil_;
		cacheGet =_cacheGet_;
		$httpBackend = _$httpBackend_;
		$localStorage = _$localStorage_;
		$cookieStore = _$cookieStore_;
		$rootScope = _$rootScope_;
		
		
		
	}));


	it("Fazer login no sistema",function(){

		$httpBackend.whenPOST("http://server/user/login/").respond(responseMock);

		//Cache de clientes
		$httpBackend.whenGET(/http:\/\/server\/cliente(\w|\W)*/).respond(responseCacheClientes);

		//Cache de produtos
		$httpBackend.whenGET(/http:\/\/server\/produto(\w|\W)*/).respond(responseCacheProdutos);
		
		
		//Filiais
		$httpBackend.whenGET("http://server/filial").respond({itens:[]});

		loginUtil.logar(loginMock,lembrarSenha,function(){
            
			expect($rootScope.usuarioSistema).toBeDefined();	
			expect($rootScope.config).toBeDefined();	
			
			expect($localStorage.empresa).toBe(loginMock.empresa);
			expect($localStorage.usuario).toBe(loginMock.usuario);
			expect($localStorage.senha).toBe(loginMock.senha);
		
			
			expect($cookieStore.get("usuarioSistema")).toBeDefined();

		});
		
	   
		
		//cache de produtos

		$httpBackend.flush();
	});    

	

	
	
	

	
});