describe('Testes módulo appRelatório', function () {

	var relatorioUtil,$httpBackend,$scope,$rootScope;


	var qs  = ["tipo='2'","disable=0","baixada=1","valor>0"];

	var basicInfo = {
			qs: qs,
			columns:"month(data),sum(valor)",
			objeto:"Movimentacao",
			groupBy:"month(data)",
			extra: " order by month(data) asc"
			
	}

    var periodColumn = "data";

	beforeEach(module('adm'));


	beforeEach(inject(function(_relatorioUtil_,_$httpBackend_,_$rootScope_){

		relatorioUtil = _relatorioUtil_;
		$httpBackend = _$httpBackend_;
		$scope = _$rootScope_.$new();
		$rootScope = _$rootScope_;

	}));


	it("Teste em getChartObject",function(){


		var responseMock = {"cod":null,"item":null,"itens":[["Batata doce saco",220.0],["Produto teste",180.0]]};
        
		var expectProj = {
				
				labels:["Batata doce saco","Produto teste"],
				data: [220,180]
		};
		
		$httpBackend.whenPOST("http://server/projecao/get-projecoes/").respond(responseMock); 
 
		relatorioUtil.getChartObject(basicInfo,periodColumn,$scope.de,$scope.ate,function(proj){
			
			expect(proj).toEqual(expectProj);
		});
		
		

		$httpBackend.flush();

	});
	
	it("Teste em chartFactory",function(){


		var responseMock = {"cod":null,"item":null,"itens":[["Batata doce saco",220.0],["Produto teste",180.0]]};
        
		var expectProj = {
				
				labels:["Batata doce saco","Produto teste"],
				data: [220,180]
		};
		
		$httpBackend.whenPOST("http://server/projecao/get-projecoes/").respond(responseMock); 
 
		relatorioUtil.chartFactory($scope,basicInfo,periodColumn,function(proj){
			
			expect(proj).toEqual(expectProj);
		});
		
		
		$httpBackend.flush();

	});
	
	
	it("Teste em mudança de período chartFactory",function(){


		var responseMock = {"cod":null,"item":null,"itens":[["Batata doce saco",220.0],["Produto teste",180.0]]};
        
		var expectProj = {
				
				labels:["Batata doce saco","Produto teste"],
				data: [220,180]
		};
		
		$httpBackend.whenPOST("http://server/projecao/get-projecoes/").respond(responseMock); 
 
		relatorioUtil.chartFactory($rootScope,basicInfo,periodColumn,function(proj){
			
			expect(proj).toEqual(expectProj);
		});
		
	
		$httpBackend.flush();

	});




});
