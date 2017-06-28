package servicevenda;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import model.GenericDAO;
import pedido.PedidoDAO;

@Repository
public class ServiceVendaDAO extends GenericDAO<ServiceVenda>{
	
	
	
	@Autowired
	private PedidoDAO pedidoDAO;
	
	

	public PedidoDAO getPedidoDAO() {
		return pedidoDAO;
	}


	public void setPedidoDAO(PedidoDAO pedidoDAO) {
		this.pedidoDAO = pedidoDAO;
	}


	public ServiceVendaDAO() {
		super(ServiceVenda.class);
		// TODO Auto-generated constructor stub
	}

	
	
	
	
}
