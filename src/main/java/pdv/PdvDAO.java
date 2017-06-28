package pdv;
import java.util.List;

import org.hibernate.Query;
import org.springframework.stereotype.Repository;
import model.GenericDAO;
import pedido.Pedido;

@Repository
public class PdvDAO extends GenericDAO<Pdv> {

	public PdvDAO() {
		super(Pdv.class);
		// TODO Auto-generated constructor stub
	}
	
	
	@Override
	public Pdv addOrUpdate(Pdv item) {
		
		List<Pedido> pedidos = item.getMovimentacao().getPedidos();
		
		for(int i=0;i<pedidos.size();i++){
			
			String nomePedido = pedidos.get(i).getProduto().getNome();
			pedidos.get(i).setNomePedido(nomePedido);
		}
		
		item.getMovimentacao().setPedidos(pedidos);
		
		return super.addOrUpdate(item);
	}
	
	public void deleteByMovimentacao(long id_mov){
		
		Query query =   getSessionFactory().getCurrentSession().createSQLQuery("delete from servicevenda where id_movimentacao=:id");
		query.setLong("id",id_mov);
		query.executeUpdate();
		
	}
   
}
