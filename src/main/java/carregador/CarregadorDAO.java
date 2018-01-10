package carregador;
import org.springframework.beans.factory.annotation.Autowired;
import model.GenericDAO;
import org.springframework.stereotype.Repository;

@Repository
public class CarregadorDAO  extends GenericDAO<Carregador> {
	
	

	public CarregadorDAO() {
		
		super(Carregador.class);
		
	}
	
	
	
	
}
