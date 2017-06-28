
describe('Testes movListController', function () {

	var $httpBackend,$controller, $uibModalInstance,$rootScope,$window,dateUtil,movMock, movListControllerFactory, movUtil;

	beforeEach(module('adm'));
	//beforeEach(module('stFilter'));
	beforeEach(module('karma.templates'));

	beforeEach(inject(function(_$httpBackend_,_$controller_,_$rootScope_,_dateUtil_,_movListControllerFactory_, _movUtil_){

		$httpBackend = _$httpBackend_; 
		movListControllerFactory = _movListControllerFactory_;
		$controller = _$controller_;
		$uibModalInstance = jasmine.createSpyObj('$uibModalInstance', ['close', '$dismiss']);
		$rootScope = _$rootScope_;
		dateUtil = _dateUtil_;
		movUtil =_movUtil_;
		
		 movMock = {
				id:10,
				valor:300,
				tipo:1,
				data:dateUtil.getDate("2016-11-14"),
				formaPagamento:"Dinheiro",
				tipo:1
		}

	}));
	
	/*Não deve ser modificado!*/
	var staticMovList = [
	   
	   {valor:100, baixada: true},  
	   {valor:100, baixada: true},  
	   {valor:100, baixada: false},   
	               
	];
	
	
	it("Filtragem de movimentações de acordo com a baixa definida", function(){
		
		var listaFiltrada = movListControllerFactory.filtraMovsByBaixa(staticMovList, "a_pagar");
		
		expect(listaFiltrada.length).toBe(1);
		expect( movUtil.getTotalMovs(listaFiltrada) ).toBe(100);
		
	});


});
