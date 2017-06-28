package funcionario;

import org.springframework.stereotype.Repository;

import model.GenericDAO;

@Repository
public class FuncionarioDAO  extends GenericDAO<Funcionario>{

	public FuncionarioDAO() {
		super(Funcionario.class);
		// TODO Auto-generated constructor stub
	}

}
