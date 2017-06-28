package teste;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import model.GenericService;

@Service
public class TestUserService extends GenericService<TestUser>{

	@Autowired
	private TestUserDAO dao;
	
	@Transactional
	public TestUser addTeste(TestUser test){
		
		return dao.addTeste(test);
	}
	
	@Transactional
	public TestDefinition getProxText(){
		
		return dao.getProxText();
		
	}
	
	@Transactional
	public Long getTotalTestsForUser(){
		
		return dao.getTotalTestsForUser();
		
	}
	
	@Transactional
	public Double getSaldoForUser(){
		
		return dao.getSaldoForUser();
		
	}
}
