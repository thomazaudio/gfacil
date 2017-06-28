describe('Testes módulo stUtil', function () {
	 
        beforeEach(module('adm'));

	   it('Deve formatar a data pararo formato ISO', inject(function (dateUtil) {
	      
		   //Formato millesegundos
		   expect(dateUtil.formatDate(1478198297151)).toBe("2016-11-3");

		   //Formato objeto
		   expect(dateUtil.formatDate(new Date("2016-03-3"))).toBe("2016-03-3");
		   
		   //Formato String
		   expect(dateUtil.formatDate("01/05/2016")).toBe("2016-05-1");
		   expect(dateUtil.formatDate("15/05/2016")).toBe("2016-05-15");
		   
	   }));
	   
	   
});
