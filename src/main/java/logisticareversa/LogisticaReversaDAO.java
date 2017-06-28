package logisticareversa;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import model.GenericDAO;
import relatorio.ProjecaoDAO;

@Repository
public class LogisticaReversaDAO extends GenericDAO<LogisticaReversa> {
	
	
	@Autowired
	ProjecaoDAO projDAO;

	public LogisticaReversaDAO() {
		super(LogisticaReversa.class);
		// TODO Auto-generated constructor stub
	}
	
	
	
   
}
