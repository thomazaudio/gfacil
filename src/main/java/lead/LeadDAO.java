package lead;
import org.springframework.stereotype.Repository;
import model.GenericDAO;

@Repository
public class LeadDAO extends GenericDAO<Lead>  {

	public LeadDAO() {
		super(Lead.class);
		// TODO Auto-generated constructor stub
	}
	
	@Override
	public Lead addOrUpdate(Lead item) {
		
		return super.addOrUpdate(item);
	}
 
}
