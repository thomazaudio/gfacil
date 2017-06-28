
describe('Testes appRelatorioController', function () {
	 
	var $httpBackend,$controller, $uibModalInstance;
	
	  beforeEach(module('adm'));
	  //beforeEach(module('stFilter'));
	  beforeEach(module('karma.templates'));
      
      beforeEach(inject(function(_$httpBackend_,_$controller_){
    	  
    	  $httpBackend = _$httpBackend_; 
    	  $controller = _$controller_;
    	  $uibModalInstance = jasmine.createSpyObj('$uibModalInstance', ['close', '$dismiss']);
      }));
      
    
	  
});
