package system;

import static org.junit.Assert.*;

import org.junit.Before;
import org.junit.Test;

import produto.Produto;

public class SystemUtilTest {
	
	SystemUtil systemUtil;

	@Before
	public void setUp() throws Exception {
		
		systemUtil = new SystemUtil();
	}
	
	
	
	

	@Test
	public void testReadFile() {
		
		assertEquals("Ler arquivo:",systemUtil.readFile("arquivoJUnitTest.txt").length()>0,true);
			
		
	}

	@Test
	public void testSaveFile() {
		
		assertEquals("Salvar arquivo:",systemUtil.saveFile("dados", "arquivoJUnitTest.txt"),true);
		
	}

	@Test
	public void testGetCurrentUserDetails() {
		
	}

	@Test
	public void testConvertTelToPadrao() {
		
		
		assertEquals("Número com 9 digitos ",systemUtil.convertTelToPadrao("(31)9 9226-7947"),"31992267947");
		
		assertEquals("Número sem 9º dígito ",systemUtil.convertTelToPadrao("(31)92267947"),"31992267947");
	}

}
