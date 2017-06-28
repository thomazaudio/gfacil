package produto;
import java.util.ArrayList;
import org.hibernate.Criteria;
import org.hibernate.Query;
import org.hibernate.criterion.Projections;
import org.springframework.beans.factory.annotation.Autowired;
import entradamercadoria.EntradaMercadoriaDAO;
import model.GenericDAO;
import pedido.Pedido;

public class ProdutoDAO  extends GenericDAO<Produto> {
	
	@Autowired
	EntradaMercadoriaDAO movEstoqueDAO;
	

	public ProdutoDAO() {
		
		super(Produto.class);
		
	}
	
	@Override
	public Produto addOrUpdate(Produto item){
		
		super.addOrUpdate(item);
		return item;
			
	}
	
	@SuppressWarnings("unchecked")
	public ArrayList<Produto> getProdutosMinEstoque(){
		  
		Criteria cri =  this.getSessionFactory().getCurrentSession().createCriteria(Pedido.class);
		cri.setProjection(Projections.projectionList()
				.add(Projections.property("produto").as("prod"))
				.add(Projections.sum("quantidade"),"quantidadePedido")
				
				);
		
     		
		return (ArrayList<Produto>)  cri.list();
	}
	
	@Override
	public void deleteByIds(long ids[]){
		
		Query q = getSessionFactory().getCurrentSession().createSQLQuery("delete from Produto where id=:id");
		
		for(int i=0;i<ids.length;i++){
			deleteOpsProduto(ids[i]);
			q.setLong("id",ids[i]);
			q.executeUpdate();
		}
		
	}
	

	public void deleteOpsProduto(long idProduto){

		Query query = this.getSessionFactory().getCurrentSession().createSQLQuery("delete from opproduto where id_produto=?");
		query.setLong(0,idProduto);
		query.executeUpdate();
	
	}
	
	
	
   
     
	
}
