package pedido;

import org.hibernate.Query;
import org.springframework.stereotype.Repository;
import model.GenericDAO;

@Repository
public class PedidoDAO  extends GenericDAO<Pedido>{

	@Override
	public Pedido addOrUpdate(Pedido item) {
	
		// TODO Auto-generated method stub
		return super.addOrUpdate(item);
	}
	

	public PedidoDAO() {
		super(Pedido.class);
		// TODO Auto-generated constructor stub
	}

	public void deletePedidos(long id_service){
		
		Query query =   getSessionFactory().getCurrentSession().createSQLQuery("delete from pedido where id_service_venda=:id");
		query.setLong("id",id_service);
		query.executeUpdate();


	}
	
     public void deletePedidosByMovimentacao(long id_mov){
		
		Query query =   getSessionFactory().getCurrentSession().createSQLQuery("delete from pedido where id_movimentacao=:id");
		query.setLong("id",id_mov);
		query.executeUpdate();


	}
	
	
	

}
