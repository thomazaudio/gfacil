package cliente;

import org.hibernate.Query;
import org.springframework.stereotype.Repository;

import model.GenericDAO;

@Repository
public class ClienteDAO  extends GenericDAO<Cliente>{

	public ClienteDAO() {
		super(Cliente.class);
		// TODO Auto-generated constructor stub
	}
	
	
	public  void atualizarProdutosSugeridos(Long id, String sugestoes){
		
		Query query =   getSessionFactory().getCurrentSession().createQuery("update Cliente set sugestoesProdutos=:sugestoes where id=:id");
		query.setLong("id", id);
		query.setString("sugestoes", sugestoes);
		query.executeUpdate();
	}

}
