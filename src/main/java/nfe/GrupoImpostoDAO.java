package nfe;

import org.springframework.stereotype.Repository;

import model.GenericDAO;

@Repository
public class GrupoImpostoDAO extends GenericDAO<GrupoImposto>{

	public GrupoImpostoDAO(){
		super(GrupoImposto.class);
		// TODO Auto-generated constructor stub
	}

}
