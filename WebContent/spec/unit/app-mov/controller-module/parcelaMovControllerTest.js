
describe('Testes parcelaMovController', function () {

	var $httpBackend,$controller, $uibModalInstance,$rootScope,$window,dateUtil,movMock;

	beforeEach(module('adm'));
	//beforeEach(module('stFilter'));
	beforeEach(module('karma.templates'));

	beforeEach(inject(function(_$httpBackend_,_$controller_,_$rootScope_,_dateUtil_){

		$httpBackend = _$httpBackend_; 
		$controller = _$controller_;
		$uibModalInstance = jasmine.createSpyObj('$uibModalInstance', ['close', '$dismiss']);
		$rootScope = _$rootScope_;
		dateUtil = _dateUtil_;
		
		 movMock = {
				id:10,
				valor:300,
				tipo:1,
				data:dateUtil.getDate("2016-11-14"),
				formaPagamento:"Dinheiro",
				tipo:1
		}

	}));




	


	function getDefaultScope(){
		var defaultScope = $rootScope.$new();
		defaultScope.originalMov = angular.copy(movMock);
		defaultScope.movs = [];
		defaultScope.quantParcelas=1;
		return defaultScope;
	}



	it("Parcelamento para apenas uma parcela", inject(function(dateUtil){

		var scope = getDefaultScope();

		scope.originalMov.id=undefined;

		scope.originalMov.data = dateUtil.getDate("2016-11-14");

		var vm = $controller("parcelaMovController",{$scope:scope});

		scope.$digest();

		//Testes da movimentações geradas a partir de originalMov
		expect(scope.movs.length).toBe(1);

		expect(scope.movs[0].data).toBeDefined();

		expect(scope.movs[0].formaPagamento).toBe("Dinheiro");

		expect(scope.movs[0].id).toBe(undefined);

		expect(scope.movs[0].tipo).toBe(movMock.tipo);

		//expect(scope.movs[0].valor).toBe(movMock.valor);

	}));





	it("Várias parcelas para movimentação com pedidos", inject(function(dateUtil){

		var scope = getDefaultScope();

		scope.originalMov  = angular.copy(movMock);

		scope.originalMov.pedidos = [{id:1,quantidade:10,valorUnitario:10}];


		var responseParcelas = { "itens": []};

		$httpBackend.whenGET("http://server/movimentacao/get-parcelas?idOriginalMov="+movMock.id).respond(responseParcelas);

		var vm = $controller("parcelaMovController",{$scope:scope});
		
		$httpBackend.flush();

		scope.addParcela();

		expect(scope.movs.length).toBe(2);
		
		expect(scope.movs[0]).toBe(scope.originalMov);
		
		expect(scope.movs[0].pedidos).toBeDefined();
		
		expect(scope.movs[1].pedidos).toBeNull();

	}));


	it("Item que já possui parcelas definidas", inject(function(dateUtil){

		var scope = getDefaultScope();

		var responseParcelas = { "itens": [

		                                   {id:10,valor:40,data:dateUtil.getDate("2016-12-14")},
		                                   {id:20,valor:100,data:dateUtil.getDate("2016-12-14")}

		                                   ]

		};

		$httpBackend.whenGET("http://server/movimentacao/get-parcelas?idOriginalMov="+movMock.id).respond(responseParcelas);

		var vm = $controller("parcelaMovController",{$scope:scope});

		$httpBackend.flush();

		expect(scope.movs.length).toBe(3);

		//Ao realiar alterações   em originalMov, as parcelas não podem ser alteradas
		scope.originalMov.valor=100;

		scope.$digest();

		expect(scope.movs.length).toBe(3);


	}));



	it("Adicionar mais parcelas a uma movimentação", inject(function(dateUtil){

		var scope = getDefaultScope();

		var responseParcelas = { "itens": [

		                                   {id:10,valor:40,data:dateUtil.getDate("2016-12-14")},
		                                   {id:20,valor:100,data:dateUtil.getDate("2016-12-14")}

		                                   ]

		};

		$httpBackend.whenGET("http://server/movimentacao/get-parcelas?idOriginalMov="+movMock.id).respond(responseParcelas);

		var vm = $controller("parcelaMovController",{$scope:scope});

		$httpBackend.flush();

		expect(scope.movs.length).toBe(3);

		scope.addParcela();
		
		scope.addParcela();

		scope.$digest();
		
		expect(scope.movs[0].parcela).toBe(1);
		expect(scope.movs[1].parcela).toBe(2);
		expect(scope.movs[2].parcela).toBe(3);
		expect(scope.movs[3].parcela).toBe(4);

		expect(scope.movs.length).toBe(5);
		
		scope.deletarParcela(scope.movs[3],3);
		
		scope.$digest();
		
		expect(scope.movs[3].parcela).toBe(4);
		
		
		
		


	}));


	it("Movimentação com pedidos", inject(function(dateUtil){

		var scope = getDefaultScope();

		scope.originalMov.pedidos = [{quantidade:10,valorUnitario:30}];

		scope.originalMov.id=undefined;

		var vm = $controller("parcelaMovController",{$scope:scope});

		scope.addParcela();
		scope.addParcela();

		expect(scope.movs.length).toBe(3);

		expect(scope.movs[0]).toBe(scope.movs[0]);

		expect(scope.movs[1].pedidos).toBeNull();

	}));
	
	

	it("Teste ao realizar alteração de pedidos", inject(function(dateUtil){

		var scope = getDefaultScope();

		scope.originalMov.pedidos = [{quantidade:10,valorUnitario:30}];

		scope.originalMov.id=undefined;

		var vm = $controller("parcelaMovController",{$scope:scope});

        scope.originalMov.pedidos[0].valorUnitario=50;
        scope.$digest();
        expect(scope.totalParcelas).toBe(500);

	}));




	it("Recalculo de parcelas", inject(function(dateUtil){
		
		
		 mov = {
					id:10,
					tipo:1,
					valor:300,
					data:dateUtil.getDate("2016-11-14"),
					formaPagamento:"Dinheiro",
					tipo:1
			}

		var scope = getDefaultScope();
		 
		 scope.originalMov = mov;

		var responseParcelas = { "itens":[]};

		$httpBackend.whenGET("http://server/movimentacao/get-parcelas?idOriginalMov="+mov.id).respond(responseParcelas);

		var vm = $controller("parcelaMovController",{$scope:scope});
		

		$httpBackend.flush();

		expect(scope.movs.length).toBe(1);

		//Adiciona uma parcela Vazia
		scope.addParcela();

		scope.$digest();

		expect(scope.movs.length).toBe(2);

		
		//Por algum motivo o usuário clica no botão novamente
		//scope.recalcularParcelas();

		scope.$digest();

		
		//A data da primeira parcela deve correspeonder a data de originalMov
		expect(scope.movs[0].data.getTime()).toBe(dateUtil.getDate(movMock.data).getTime());   



	}));
	
	
	
	


	it("Deletar parcelas", inject(function(dateUtil){



	}))



});
