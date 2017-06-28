
describe('Testes módulo movUtil', function () {

	var $httpBackend;

	beforeEach(module('adm'));
	//beforeEach(module('stFilter'));
	beforeEach(module('karma.templates'));

	beforeEach(inject(function(_$httpBackend_){

		$httpBackend = _$httpBackend_; 
		$window = jasmine.createSpyObj('$window', ['confirm']);
	}));

	var movMock = {
			valor:300,
			data:"2016-11-14"
	}

	it("movUtil.addBaixaForMov para movimentação parcelada",inject(function(movUtil,dateUtil){

		var mov = {
				id:30,
				originalMov:{id:34,pedidos:[{quantidade:1,valorUnitario:10}],pessoa:{id:1,nome:"Thomaz"}},
				valor: 300,
				pessoa:{id:1,nome:"Thomaz"}
		}


		mov = movUtil.addBaixaForMov(mov,"2016-10-12");

		$httpBackend.whenPOST("http://server/movimentacao/add/").respond({item:mov}); 

		movUtil.confirmAlterarBaixa(mov,function(res){

			expect(res.pessoa).toBeDefined();

			expect(res.originalMov).toBeDefined();

			expect(res.originalMov.pedidos).toBeUndefined();

		});

		$httpBackend.flush();

	}));


	it("Teste método setStatusMov",inject(function(movUtil,dateUtil){

		var mov = movUtil.setStatusMov({data:new Date()});

		expect(mov.alertMov).toBe(1);

	}));


	it("Marcar movimentação paga como nao-paga",inject(function(movUtil,$window){

		/*
    	  var mov = angular.copy(movMock);
    	  mov.baixada=false;
    	  mov.id=200;
    	  $httpBackend.whenPOST("http://server/movimentacao/add/",mov).respond('');
    	  movUtil.alterarBaixa(mov);
    	  spy  = spyOn($window, 'confirm').and.returnValue(true);

    	  expect(mov.baixada).toBe(false);
    	  $httpBackend.flush();

		 */

	}));

	it("Teste getAbstractMovsFixas modo=1(Diário)",inject(function(movUtil){

		var dataFinal = new Date(); 
		dataFinal.setDate(dataFinal.getDate()+3);// + 3 dias

		movMock.data = new Date();
		movMock.modoRepeticao = 1;
		var movs = movUtil.getAbstractMovsFixas(movMock,dataFinal);
		expect(movs.length).toBe(4);

	}));

	it("Teste getAbstractMovsFixas modo=3(Mensal)",inject(function(movUtil){

		var dataFinal = new Date(); 
		dataFinal.setMonth(dataFinal.getMonth()+3);// + 3 meses

		movMock.data = new Date();
		movMock.modoRepeticao = 3;
		var movs = movUtil.getAbstractMovsFixas(movMock,dataFinal);
		expect(movs.length).toBe(4);

	}));

	it("Teste setar datas getAbstractMovsFixas modo=3(Mensal)",inject(function(movUtil){

		var quantMeses = 3;  	 
		var dataFinal = new Date(); 
		dataFinal.setMonth(dataFinal.getMonth()+quantMeses);// + 3 meses

		movMock.data = new Date();
		movMock.modoRepeticao = 3;
		var movs = movUtil.getAbstractMovsFixas(movMock,dataFinal);
		var inicio = movMock.data;
		expect(movs.length).toBe(quantMeses+1); 

		//Verifica se as datas foram setadas corretamente 
		for(var i=0;i<movs.length;i++){

			expect(movs[i].data.getMonth()).toBe(inicio.getMonth());

			inicio.setMonth(inicio.getMonth()+1);
		}

	}
	));

	it("Adicionar baixa para um movimentação fixa",inject(function(movUtil){

		var mov = {valor:300};
		mov = movUtil.addBaixaForMov(mov,"2016-10-12");
		expect(mov.baixas).toBe("@2016-10-12");

	}));

	it("Test mov já baixadas getAbstractMovsFixas ",inject(function(movUtil){

		var movFixa = {
				data:"2016-11-16",
				modoRepeticao:1,
				baixas:"@2016-11-16@2016-11-17"

		} 
		var dataFinal = "2016-11-20";
		var movs = movUtil.getAbstractMovsFixas(movFixa,dataFinal);
		expect(movs.length).toBe(3); 

	}));

	it("Test em movUtil.getTotalMov",inject(function(movUtil){

		var mov= {valor:300}; 
		expect(movUtil.getTotalMov(mov)).toBe(300);

		//Movimentação com pedidos
		mov.pedidos = [{quantidade:10,valorUnitario:50}];


		expect(movUtil.getTotalMov(mov)).toBe(500);

	}));


	it("Test em movUtil.getTotalMovs",inject(function(movUtil){

		var movs = [

		            {valor:5000,pedidos:[]},
		            {valor:2000}

		            ];
		expect(movUtil.getTotalMovs(movs)).toBe(7000);

		//Movimentação com pedidos
		var movsPeds = [

		                {valor:5000,pedidos:[{valorUnitario:30,quantidade:10}]},//R$300,00
		                {pedidos:[{valorUnitario:10,quantidade:10}]}//R$100

		                ];

		expect(movUtil.getTotalMovs(movsPeds)).toBe(400);

	}));

	it("Teste em movUtil.getBalanco",inject(function(movUtil){

		var de =  new Date();
		var ate = new Date();

		var responseReceitasRealizadas= {"cod":null,"item":null,"itens":[300.0]};
		var responseReceitasPrevistas= {"cod":null,"item":null,"itens":[500.0]};
		var responseDespesasRealizadas= {"cod":null,"item":null,"itens":[100.0]};
		var responseDespesasPrevistas= {"cod":null,"item":null,"itens":[500.0]};

		//Receitas realizadas
		$httpBackend.whenGET(/http:\/\/server\/projecao\/execute-query?([\w|\W]*)tipo%3D2([\w|\W]*)baixada%3D1([\w|\W]*)/).respond(responseReceitasRealizadas);

		//Receitas previstas
		$httpBackend.whenGET(/http:\/\/server\/projecao\/execute-query?([\w|\W]*)tipo%3D2([\w|\W]*)/).respond(responseReceitasPrevistas);


		//Despesas Realizadas
		$httpBackend.whenGET(/http:\/\/server\/projecao\/execute-query?([\w|\W]*)tipo%3D1([\w|\W]*)baixada%3D1([\w|\W]*)/).respond(responseDespesasRealizadas);


		//Despesas previstas
		$httpBackend.whenGET(/http:\/\/server\/projecao\/execute-query?([\w|\W]*)tipo%3D1([\w|\W]*)/).respond(responseDespesasPrevistas);

		movUtil.getBalanco(de,ate,function(receitasRealizadas,despesasRealizadas,receitasPrevistas,despesasPrevistas){

			expect(receitasRealizadas).toBe(300);
			expect(despesasRealizadas).toBe(100);
			expect(receitasPrevistas).toBe(500);
			expect(despesasPrevistas).toBe(500);

		});

		$httpBackend.flush();

	}));

});
