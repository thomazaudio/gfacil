
describe('Testes deleteeMovController', function () {

	var $httpBackend,$controller,deletMovController,$modalInstance;

	var movMock = {
			valor:300,
			tipo:1,
			data:"2016-11-14"
	}


	beforeEach(module('adm'));
	//beforeEach(module('stFilter'));
	beforeEach(module('karma.templates'));

	beforeEach(inject(function(_$httpBackend_,_$controller_){

		$httpBackend = _$httpBackend_; 
		$controller = _$controller_;
		$modalInstance =  jasmine.createSpyObj('$modalInstance', ['close', '$dismiss']);
	}));



	it("Deletar movimentação independente",inject(function(movUtil, loginUtil){

		var mov = {
				id:200, 
				valor:300,
				descricao:"Mov Teste",
				categoria: "Categoria teste"
		}


		$httpBackend.whenPOST("http://server/movimentacao/delete/",{mov:mov,modo:''}).respond('');
		movUtil.deleteMov(mov);
		$httpBackend.flush();



	}));


	it("Deletar movimentação parcelada (Todas)",inject(function(movUtil, loginUtil){

		var mov = {
				id:200,   
				valor:300,
				descricao:"Mov Teste",
				categoria: "Categoria teste"
		}

		mov.originalMov = angular.copy(mov);
		var vm = $controller("deleteMovController",{callback:null,$modalInstance: $modalInstance, mov:mov});
		$httpBackend.whenPOST("http://server/movimentacao/delete/",{mov:mov,modo:'all'}).respond('');
		vm.deletar(vm.mov,'all');
		$httpBackend.flush();

		//expect(modal.$dismiss).toHaveBeenCalled();


	}));

	it("Deletar movimentação parcelada-abstrata (Item unico)",inject(function(movUtil, loginUtil, dateUtil){

		var mov = {
				valor:300,
				data:"2016-10-15",
				descricao:"Mov Teste",
				categoria: "Categoria teste"
		}

		mov.originalMov = angular.copy(mov);
		mov.originalMov.id=200;
		var vm = $controller("deleteMovController",{callback:null,$modalInstance: $modalInstance, mov: mov});
		//Deletar todas as movimentações 
		$httpBackend.whenPOST("http://server/movimentacao/add-parcelas/",[mov.originalMov]).respond('');
		vm.deletar(vm.mov,'onlyPeriod');
		$httpBackend.flush();

		//expect(modal.$dismiss).toHaveBeenCalled();
		expect(mov.originalMov.baixas).toBe("@2016-10-15");
		expect(mov.originalMov.id).toBeDefined();



	}));


	it("Deletar movimentação parcelada-abstrata (Todos os itens)",inject(function(movUtil, loginUtil, dateUtil){

		var mov = {
				valor:300,
				data:"2016-10-15",
				descricao:"Mov Teste",
				categoria: "Categoria teste"
		}

		mov.originalMov = angular.copy(mov);
		var vm = $controller("deleteMovController",{callback:null,mov:mov,$modalInstance: $modalInstance});

		expect(vm.mov).toBeDefined();

		//Deletar todas as movimentações 
		$httpBackend.whenPOST("http://server/movimentacao/delete/",{mov:mov.originalMov,modo:'all'}).respond('');
		vm.deletar(vm.mov,'all');
		$httpBackend.flush();
		//expect(modal.$dismiss).toHaveBeenCalled();

	}));




});
