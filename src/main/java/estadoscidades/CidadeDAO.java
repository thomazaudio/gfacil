package estadoscidades;
import java.util.ArrayList;

import org.hibernate.Query;
import org.springframework.stereotype.Repository;
import model.GenericDAO;

@Repository
public class CidadeDAO extends GenericDAO<Cidade> {

	public CidadeDAO() {
		super(Cidade.class);
		// TODO Auto-generated constructor stub
	}

	@SuppressWarnings("unchecked")
	public ArrayList<Cidade> getAllByUf(String uf){

		Query query  = this.getSessionFactory().getCurrentSession().createQuery("from Cidade where uf=:uf");
		query.setString("uf",uf);

		return (ArrayList<Cidade>) query.list();

	}


	public Cidade getByCodMun(long codMun){

		Query query  = this.getSessionFactory().getCurrentSession().createQuery("from Cidade where codigoMunicipio=:codMun");
		query.setLong("codMun",codMun);

		return (Cidade) query.uniqueResult();

	}



}
