package nfe;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import model.GenericService;

@Service
public class NFeService extends GenericService<NFe>{

	@Autowired 
	NFeDAO nfeDAO;
	
	

}
