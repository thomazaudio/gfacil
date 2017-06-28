describe('Testes stFilter', function () {
	   
	  var $compile, $rootScope, $scope, $httpBackend,element,controller;
	  
	  var filtrosMock = [{att:"nome",label:"Nome",placeholder:"Digite o nome do produto",tipo:"text",value:"Busca teste"}];
	  
	  beforeEach(module('adm'));
	  //beforeEach(module('stFilter'));
	  beforeEach(module('karma.templates'));
      
      beforeEach(inject(function(_$compile_, _$rootScope_, $injector,$templateCache,_$httpBackend_){
    	  
    	  $compile = _$compile_;
    	  $rootScope = _$rootScope_;
    	  $httpBackend = $injector.get("$httpBackend");
    	  $httpBackend = _$httpBackend_;
    	  
    	  
		  $rootScope.config = {confs:{}};
    	  $httpBackend.whenGET("http://server/config").respond("");
		  element = $compile(angular.element("<st-filter-map filtros='filtros'></st-filter-map>"))( $rootScope.$new());
		  $rootScope.$digest()
		  controller = element.controller("stFilterMap");
		  $scope = element.isolateScope() || element.scope()

		  $scope.filtros = filtrosMock;
		  $scope.$digest();
		  $scope.changeInfoBusca(filtrosMock[0]);
		  $scope.$digest();
    	  
      }));
      
      
      describe("Teste em stFilterMap",function(){
    	  
    	  
    	  it("verifica se a diretiva é compilada corretamente",function(){
    		  $scope.$digest();
    		  expect(element.html()).toContain('<input id="busca"');
    		  
          });
    	  
    	  it("Teste de mudança de infoBusca",function(){
    		  
    		 //Verifica se o filtro é setadoo corretamente
    		  expect($scope.infoBusca).toBe(filtrosMock[0]);
    		  
    	  });
    	  
    	  it("Teste de mudança no placeholder infoBusca",function(){
    		  expect(element.find("input")[0].getAttribute("placeholder")).toBe(filtrosMock[0].placeholder);
    	  });
    	  
    	  it("Tipo de input no infoBusca", function(){
    		  
    		  expect(element.find("input")[0].getAttribute("tipo")).toBe(filtrosMock[0].tipo);
    	  });
    	  
    	 
    	  
    	  it("Limpa campo de busca infoBusca",function(){
    		  
    		  element.find("#btn-limpa-busca").click();
    		  $scope.$digest();
    		  expect($scope.infoBusca.value).toBe('');
    	  });
    	  
    	  
          it("Deus em $rootScope",function(){
    		  
    		
    		  expect($rootScope.teste).toBe('Deus é bom demais!');
    	  });
    	  
      });
      
      
     
      
 
	  
});
