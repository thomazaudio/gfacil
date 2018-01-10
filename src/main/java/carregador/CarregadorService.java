package carregador;
import java.util.ArrayList;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import lead.LeadService;
import model.GenericService;

@Service
public class CarregadorService extends GenericService<Carregador>   {

              @Autowired
	private CarregadorDAO carregadorDAO;
	
	
}
