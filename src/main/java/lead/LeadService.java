package lead;

import java.util.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import transactional.SMSUtil;
import transactional.SendEmail;
import transactional.SmsAPI;
import model.GenericService;

@Service
public class  LeadService extends GenericService<Lead>   {


	@Autowired
	private LeadDAO dao;
	
	@Transactional
	public void addActionByTel(String tel, String action){
		
		dao.addActionByTel(tel, action);
	}
	
	
	public  Lead getBasicInfoLeadById(long id){
		
		return dao.getBasicInfoLeadById(id);
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
			
			//Envia email para o usuário
			if(lead.getEmail()!=null){
				
				new SendEmail().enviaEmailCadastroUsuario(lead);
				
			}
			//Envia sms para o usuário
			try {
				SmsAPI.sendSimple(SMSUtil.getMensagemCadastroLead(lead.getNome(), lead.getTelefone()), lead.getTelefone());
			} catch (Exception e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
		
		lead.setLastUpdate(new Date());

		return dao.addOrUpdate(lead);

	}

}
