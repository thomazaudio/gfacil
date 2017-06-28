
describe('Testes estadosCidadesController', function () {

	
	/*
	var $httpBackend,$controller,$uibModalInstance,$rootScope;

	beforeEach(module('adm'));
	//beforeEach(module('stFilter'));
	beforeEach(module('karma.templates'));

	beforeEach(inject(function(_$httpBackend_,_$controller_,_$rootScope_){

		$httpBackend = _$httpBackend_; 
		$controller = _$controller_;
		$rootScope = _$rootScope_;

	}));


	var cidadesMock = [

	                   {nome:"Belo Vale", codigoMunicipio:"123",uf:"MG"},

	                   {nome:"Belo Horizonte", codigoMunicipio:"5555",uf:"MG"}

	                   ];

	var estadosMock = [
	                   {nome:"Minas Gerais",uf:"MG"}              
	                   ];

	it("Teste em controller estadosCidadesController",inject(function(){

		var vm = $controller ("estadosCidadesController");

		vm.cidades = cidadesMock;
		vm.estados = estadosMock;
		var ufBusca = "MG";
		$httpBackend.whenGET("http://server/estadoscidades/get-estados").respond({itens:estadosMock});
		$httpBackend.whenGET("http://server/estadoscidades/get-cidades?uf="+ufBusca).respond({itens:cidadesMock});
		vm.changeEstado(ufBusca);

		$httpBackend.flush();

		expect(vm.cidades.length).toBe(cidadesMock.length);

	}))


	it("Teste em mudança de cidade",inject(function(){

		var vm = $controller ("estadosCidadesController");

		vm.cidades = cidadesMock;
		vm.estados = estadosMock;
		vm.cidade = cidadesMock[0];
		$httpBackend.whenGET("http://server/estadoscidades/get-estados").respond({itens:estadosMock});
		
		$httpBackend.whenGET("http://server/estadoscidades/get-cidades?uf=MG").respond({itens:cidadesMock});


		vm.changeCidade(vm.cidade);

		$httpBackend.flush();

		expect(vm.codigoMunicipio).toBe(cidadesMock[0].codigoMunicipio);
		expect(vm.nomeMunicipio).toBe(cidadesMock[0].nome);
		expect(vm.uf).toBe(cidadesMock[0].uf);

	}))

	

*/



});
