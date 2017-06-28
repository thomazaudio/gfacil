package registroponto;
import org.springframework.stereotype.Repository;
import model.GenericDAO;

@Repository
public class RPDAO extends GenericDAO<RP> {

	public RPDAO() {
		super(RP.class);
		// TODO Auto-generated constructor stub
	}
   
}
