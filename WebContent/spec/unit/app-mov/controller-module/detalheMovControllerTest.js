describe('Testes detalheMovController', function () {

	var $httpBackend,$controller, $modalInstance;

	beforeEach(module('adm'));
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


	it("Deve definir o título do modal corretamente para despesas", function(){

		var vm = $controller("detalheMovController",{mov:movMock,callback:null,$modalInstance: $modalInstance});
		expect(vm.labelTitleMov).toBe("Cadastro de nova Despesa");

	});

	it("Deve definir o titulo do modal corretamente para receitas",function(){

		var vm = $controller("detalheMovController",{mov:{tipo:2},callback:null,$modalInstance: $modalInstance});
		expect(vm.labelTitleMov).toBe("Cadastro de nova Receita");

	}); 

	it("modoRepeticao deve ser padrão = 0",function(){

		var mov = angular.copy(movMock);
		var vm = $controller("detalheMovController",{mov:mov,callback:null,$modalInstance: $modalInstance});
		expect(mov.modoRepeticao).toBe(0);

	}); 

	it("Cadastro de movimentacao", function(){

		var newMov = angular.copy(movMock); 
		newMov.data = new Date();
		var vm = $controller("detalheMovController",{mov:newMov,callback:null,$modalInstance: $modalInstance});
		expect(vm.labelTitleMov).toBe("Cadastro de nova Despesa");
		vm.cadMov(vm.movs);
		$httpBackend.whenPOST("http://server/movimentacao/add-parcelas/",vm.movs).respond("");
		$httpBackend.flush();

	});

	it("Deletar mmovimentação sem parcelas",function(){

		var mov = angular.copy(movMock);
		mov.id=34;

		var vm = $controller("detalheMovController",{mov:movMock,callback:null,$modalInstance: $modalInstance});

		vm.deleteMov(mov);

		$httpBackend.whenPOST("http://server/movimentacao/delete/",{modo:"",mov:mov}).respond("");
		$httpBackend.flush();

		//expect($uibModalInstance.$dismiss).toHaveBeenCalled();
	});

});
