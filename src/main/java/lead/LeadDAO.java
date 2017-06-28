package lead;


import java.util.Date;

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
		item.setLastUpdate(new Date());
		return super.addOrUpdate(item);
	}
 
}
