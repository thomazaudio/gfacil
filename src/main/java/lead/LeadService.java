package lead;

import java.util.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import transactional.SendEmail;
import model.GenericService;

@Service
public class  LeadService extends GenericService<Lead>   {


	@Autowired
	private LeadDAO dao;
	
	@Transactional
	public void addActionByTel(String tel, String action){
		
		dao.addActionByTel(tel, action);
	}

	@Override
	@Transactional
	public Lead addOrUpdate(Lead lead) {


		if(lead.getTransientAction()!=null){

			if(lead.getActions()==null)
				lead.setActions("");

			lead.setActions(lead.getActions()+", "+lead.getTransientAction());
		}


		if(lead.getSavedInForm()!=null && lead.getSavedInForm().equals("1")){
			//Envia email de cadastro de novo usuário
			new SendEmail().enviaEmailCadastroLead(lead);
		}
		lead.setLastUpdate(new Date());

		return dao.addOrUpdate(lead);

	}

}
