package entradamercadoria;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import model.GenericService;

@Service
public class EntradaMercadoriaService extends GenericService<EntradaMercadoria>{

	
	@Autowired
	private EntradaMercadoriaDAO emDAO;
	
	
	@Transactional
	public void deletarEM(EntradaMercadoria em){
		
		emDAO.deletarEM(em);
	}
	
	
}
