package database;

import static org.junit.Assert.*;

import org.junit.Before;
import org.junit.Test;

import produto.Produto;

public class DataBaseUtilTest {



	private DataBaseUtil dataBaseUtil;

	@Before
	public void setUp() throws Exception {

		dataBaseUtil = new DataBaseUtil();
	}



	@Test
	public void testInjectQueryFilial(){
         
		
		String queryFilial = "and filialId=0";
		
		
		assertEquals("select * from Produto (Sem filial)",dataBaseUtil.injectQueryFilial("select * from Produto where id>0",""),"select * from Produto where id>0");
	
	
		assertEquals("select * from Produto",dataBaseUtil.injectQueryFilial("select * from Produto", queryFilial),"select * from Produto where filialId=0");
		assertEquals("select * from Produto where id>0",dataBaseUtil.injectQueryFilial("select * from Produto where id>0", queryFilial),"select * from Produto where filialId=0 and id>0");
		assertEquals("select * from Produto WHERE id>0",dataBaseUtil.injectQueryFilial("select * from Produto WHERE id>0", queryFilial),"select * from Produto WHERE filialId=0 and id>0");

	}

	@Test
	public void testGetObjectFromQuery() {

		assertEquals("recuperar objeto da query select * from Produto",((Produto)dataBaseUtil.getObjectFromQuery("select  from Produto")).getClass().getName().equals("produto.Produto"),true);

		assertEquals("recuperar objeto da query select id from Produto",((Produto)dataBaseUtil.getObjectFromQuery("select id  from Produto")).getClass().getName().equals("produto.Produto"),true);


		assertEquals("recuperar objeto da query select nome,id  from Produto where id>0",((Produto)dataBaseUtil.getObjectFromQuery("select  nome,id from Produto where id>0")).getClass().getName().equals("produto.Produto"),true);
	}

	@Test
	public void testIdCrudEntity(){

		try {
			assertEquals("Cliente is crud entity?",dataBaseUtil.isCrudEntity(Class.forName("cliente.Cliente")),true);
		} catch (ClassNotFoundException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

	}


}
