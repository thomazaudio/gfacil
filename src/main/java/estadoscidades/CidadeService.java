package estadoscidades;
import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import model.GenericService;

@Service
public class CidadeService extends GenericService<Cidade>{

	@Autowired 
	private CidadeDAO cidadeDAO;
	
	@Transactional
	public ArrayList<Cidade> getAllByUf(String uf){
		
		return cidadeDAO.getAllByUf(uf);
		
	}
	
	
	@Transactional
	public Cidade getByCodMun(long codMun){
		
		return cidadeDAO.getByCodMun(codMun);
		
	}
}
