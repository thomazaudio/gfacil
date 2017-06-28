package estadoscidades;
import org.hibernate.Query;
import org.springframework.stereotype.Repository;
import model.GenericDAO;

@Repository
public class EstadoDAO extends GenericDAO<Estado> {

	public EstadoDAO() {
		super(Estado.class);
		// TODO Auto-generated constructor stub
	}



	public Estado getEstadoByUf(String uf){

		Query q = this.getSessionFactory().getCurrentSession().createQuery("from Estado where uf=:uf");

		q.setString("uf",uf);

		return (Estado) q.uniqueResult();

	}



}
