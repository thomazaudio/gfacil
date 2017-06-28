describe('Testes módulo appRelatório', function () {
	 
	  var $compile,$scope,element;
	
	  beforeEach(module('adm'));
	 
	  beforeEach(module('karma.templates'));
	  
	  beforeEach(inject(function(_$compile_,_$rootScope_){
		  
		  $compile = _$compile_;
		  $scope = _$rootScope_.$new();
		  element = angular.element("<component-receitas-periodo></component-receitas-periodo");
		  $compile(element)($scope);
		  $scope.$digest();
	  }));
	  
	  it("Deve compilar a diretiva corretamente",function(){
		
		  
	  });
      
});
