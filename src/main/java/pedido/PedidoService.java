package pedido;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import model.GenericService;

@Service
public class PedidoService extends GenericService<Pedido> {

	
	@Autowired
	private PedidoDAO pedidoDAO;


	
	@Transactional
	public void deletePedidosOfService(long id_service){
		
		pedidoDAO.deletePedidos(id_service);
		
	}
	
	@Transactional
	public void deletePedidosByMovimentacao(long id_mov){
		
		pedidoDAO.deletePedidosByMovimentacao(id_mov);
		
	}
	
	
}
