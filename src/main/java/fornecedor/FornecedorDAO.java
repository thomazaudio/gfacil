package fornecedor;

import org.springframework.stereotype.Repository;

import model.GenericDAO;

@Repository
public class FornecedorDAO  extends GenericDAO<Fornecedor>{

	public FornecedorDAO() {
		super(Fornecedor.class);
		// TODO Auto-generated constructor stub
	}

}
