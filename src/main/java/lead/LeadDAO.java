package lead;


import java.util.Date;

import org.springframework.stereotype.Repository;

import transactional.SendEmail;
import model.GenericDAO;



@Repository
public class LeadDAO extends GenericDAO<Lead>  {

	public LeadDAO() {
		super(Lead.class);
		// TODO Auto-generated constructor stub
	}
	
	@Override
	public Lead addOrUpdate(Lead item) {
		
		if(item.getSavedInForm().equals("1")){
			//Envia email de cadastro de novo usuário
			new SendEmail().enviaEmailCadastroLead(item);
		}

		
		item.setLastUpdate(new Date());
		
		return super.addOrUpdate(item);
	}
 
}
