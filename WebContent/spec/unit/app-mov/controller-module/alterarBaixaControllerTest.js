
describe('Testes alterarBaixaController', function () {

	var $httpBackend,$controller,$modalInstance;

	beforeEach(module('adm'));
	//beforeEach(module('stFilter'));
	beforeEach(module('karma.templates'));

	beforeEach(inject(function(_$httpBackend_,_$controller_){

		$httpBackend = _$httpBackend_; 
		$controller = _$controller_;
		$modalInstance = jasmine.createSpyObj('$modalInstance', ['close', '$dismiss']);

	}));

	var movMock = {
			valor:300,
			tipo:1,
			data:"2016-11-14"
	}



	it("Deve definir a data padrão como 'hoje'", inject(function(dateUtil){

		var vm = $controller("alterarBaixaController",{$modalInstance: $modalInstance,mov:movMock,callback:null});
		expect(dateUtil.formatDate(vm.dataPagamento)).toBe(dateUtil.formatDate(new Date()));

	}));


	it("Deve definir o valor corretamente", inject(function(){

		var vm = $controller("alterarBaixaController",{$modalInstance: $modalInstance,mov:movMock,callback:null});
		expect(vm.valorMov).toBe(movMock.valor);

	}));
	
	
	
	 
	
	
	it("Baixar movimentação parcelada com pedidos", inject(function(){
		
		
		
	   /*
	   var mov = {
	    		   id:30,
	    		   parcela:2,
	    		   numeroParcelas:2,
	    		   originalMov:{id:34,parcela:1,numeroParcelas:2,pedidos:[{quantidade:1,valorUnitario:10}]},
	    		   valor: 300
	     }
		
		var vm = $controller("alterarBaixaController",{modal:$uibModalInstance,mov:mov,callback:null});
		$httpBackend.whenPOST("http://server/movimentacao/add/",mov).respond("");
        vm.confirmar($uibModalInstance,vm.dataPagamento,vm.valorMov);
        $httpBackend.flush();
        expect($uibModalInstance.$dismiss).toHaveBeenCalled();
        
        */
	}));
	


	it("Baixar movimentação", inject(function(){
		var mov = angular.copy(movMock);
		mov.baixada = true;
		var vm = $controller("alterarBaixaController",{$modalInstance: $modalInstance,mov:mov,callback:null});
		$httpBackend.whenPOST("http://server/movimentacao/add/",mov).respond("");
        vm.confirmar(vm.dataPagamento,vm.valorMov);
        $httpBackend.flush();
        //expect($modalInstance.close()).toHaveBeenCalled();
	}));
	
	it("Baixar movimentação abstrata", inject(function(){
		var mov = angular.copy(movMock);
		mov.originalMov = angular.copy(movMock);
		mov.originalMov.id = 200;
		mov.baixada = true;
		var vm = $controller("alterarBaixaController",{$modalInstance: $modalInstance,mov:mov,callback:null});
		
		//Salva a movimentação original com a baixa
		$httpBackend.whenPOST("http://server/movimentacao/add/",mov.orgiginalMov).respond("");
		
		//Realiza o cadastro de movimentação abstrata
		$httpBackend.whenPOST("http://server/movimentacao/add-parcelas/",[mov]).respond("");
		
        vm.confirmar(vm.dataPagamento,vm.valorMov);
        $httpBackend.flush();
        //expect($modalInstance.close()).toHaveBeenCalled();
	}));
	
	
	it("cancelar baixa de movimentação", inject(function(){
		var mov = angular.copy(movMock);
		mov.baixada = true;
		var vm = $controller("alterarBaixaController",{$modalInstance: $modalInstance,mov:mov,callback:null});
        vm.cancelar();
        expect(mov.baixada).toBe(false);
	}));



});
