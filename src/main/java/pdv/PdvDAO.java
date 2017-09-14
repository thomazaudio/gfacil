package pdv;
import org.hibernate.Query;
import org.springframework.stereotype.Repository;
import model.GenericDAO;

@Repository
public class PdvDAO extends GenericDAO<Pdv> {

	public PdvDAO() {
		super(Pdv.class);
		// TODO Auto-generated constructor stub
	}
	
	
	@Override
	public Pdv addOrUpdate(Pdv item) {
		
		
		return super.addOrUpdate(item);
	}
	
	public void deleteByMovimentacao(long id_mov){
		
		Query query =   getSessionFactory().getCurrentSession().createSQLQuery("delete from servicevenda where id_movimentacao=:id");
		query.setLong("id",id_mov);
		query.executeUpdate();
		
	}
   
}
