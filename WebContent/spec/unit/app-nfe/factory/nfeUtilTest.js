
describe('Testes módulo movUtil', function () {
	 
	var $httpBackend,$controller,nfeUtil,$localStorage;
	
	  beforeEach(module('adm'));
	  //beforeEach(module('stFilter'));
	  beforeEach(module('karma.templates'));
      
      beforeEach(inject(function(_$httpBackend_,_$controller_,_nfeUtil_,_$localStorage_){
    	  
    	  $httpBackend = _$httpBackend_; 
    	  $controller = _$controller_;
    	  nfeUtil = _nfeUtil_;
    	  $localStorage =  _$localStorage_;
    	  
     
      }));
      
      
      var configMock = {
    	
    		  confs: {IE:"123",IM:"12345",xNome:"SierTech"}
      };
      
      it("Teste método setStatusMov",inject(function(){
    	   
    	   $localStorage.config = configMock;
    	   
    	   var dadosEmitente = nfeUtil.getDadosEmitente();
    	   
    	   expect(dadosEmitente.IE).toBe(configMock.confs.IE);
    	   expect(dadosEmitente.xNome).toBe(configMock.confs.xNome);
    	   
       }));
      
      
      
	  
});
