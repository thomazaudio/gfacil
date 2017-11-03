package cliente;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lead.LeadService;
import model.GenericService;

@Service
public class ClienteService extends GenericService<Cliente> {

	@Autowired
	private ClienteDAO clienteDAO;
	
	@Autowired
	private LeadService  leadService;
	
	@Override
	@Transactional
	public Cliente addOrUpdate(Cliente item){
		if(item.getId()==0){
		   leadService.addIntMetric("cads_cliente", new Long(1), true);
		}
		return super.addOrUpdate(item);
	}
	
	@Transactional
	public  void atualizarProdutosSugeridos(Long id, String sugestoes){
		
		clienteDAO.atualizarProdutosSugeridos(id, sugestoes);
		
	}
	
}
