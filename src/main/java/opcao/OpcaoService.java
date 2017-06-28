package opcao;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import model.GenericService;

@Service
public class OpcaoService extends GenericService<Opcao> {

	@Autowired
	private OpcaoDAO opDAO;

	@Transactional
	public List<String> getAllDescricoes() {
		
		return opDAO.getAllDescricoes();
	}
	
}
