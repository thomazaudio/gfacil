describe('Testes módulo dateUtil', function () {
	 
	    var dateUtil;
	    
	    beforeEach(module('adm'));
	    
	    beforeEach(inject(function(_dateUtil_){
	    	
	    	dateUtil = _dateUtil_;
	    }));
	   
      

	   it('formatData data', function () {
	      
		   //Formato millesegundos
		   //dia> 10
		   expect(dateUtil.formatDate(1479002400000)).toBe("2016-11-13");
		   
		   
		   //Formato millesegundos
		   //dia<10
		   expect(dateUtil.formatDate(1478656800000)).toBe("2016-11-9");

		   //Formato objeto
		   expect(dateUtil.formatDate(new Date(2016,10,13))).toBe("2016-11-13");
		   
		   //Formato objeto
		   expect(dateUtil.formatDate(new Date(2016,8,13))).toBe("2016-09-13");
		   
		   //Formato String
		   
		   expect(dateUtil.formatDate("13/11/2016")).toBe("2016-11-13");
		   
		   expect(dateUtil.formatDate("13/11/2016")).toBe("2016-11-13");
		   expect(dateUtil.formatDate("2016-12-1")).toBe("2016-12-1");

		   expect(dateUtil.formatDate("1/12/2016")).toBe("2016-12-1");
		  expect(dateUtil.formatDate("2016-11-13")).toBe("2016-11-13");
		   
	   });
	   
	   
	  
	   
	   
	   
	   it("getDate data hoje",inject(function(){
		   
		   var hoje = new Date();
		   
		   hoje.setHours(0,0,0,0);
		   
		   var format = dateUtil.formatDate(hoje);
		   
		   var data = dateUtil.getDate(format);
		   
		   data.setHours(0,0,0,0);
		   
		   expect(data.getTime()).toBe(hoje.getTime());
		   
	   }));
	   
	
	   
     
	   
	   it('Deve recuperar a query de acordo com o período', inject(function(dateUtil){
		   
		   var queryEsperada = "data between '2016-11-3' and '2016-11-3'";
		   expect(dateUtil.getQueryOfPeriod("data","03/11/2016","03/11/2016")).toBe(queryEsperada);
	   }));
});
