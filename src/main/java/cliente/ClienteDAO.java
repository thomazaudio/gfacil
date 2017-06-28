package cliente;

import org.springframework.stereotype.Repository;

import model.GenericDAO;

@Repository
public class ClienteDAO  extends GenericDAO<Cliente>{

	public ClienteDAO() {
		super(Cliente.class);
		// TODO Auto-generated constructor stub
	}

}
