package cliente;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import model.GenericService;

@Service
public class ClienteService extends GenericService<Cliente> {

	@Autowired
	private ClienteDAO clienteDAO;
	
	@Transactional
	public  void atualizarProdutosSugeridos(Long id, String sugestoes){
		
		clienteDAO.atualizarProdutosSugeridos(id, sugestoes);
		
	}
	
}
