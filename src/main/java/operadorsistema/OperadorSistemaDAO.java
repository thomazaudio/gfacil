package operadorsistema;

import org.springframework.stereotype.Repository;

import model.GenericDAO;

@Repository
public class OperadorSistemaDAO  extends GenericDAO<OperadorSistema>{

	public OperadorSistemaDAO() {
		super(OperadorSistema.class);
		// TODO Auto-generated constructor stub
	}

}
