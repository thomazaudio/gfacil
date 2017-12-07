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
	public int changeAttr(long id,String attr,String value){
		
		return dao.changeAttr(id, attr,  value);
	}
	
	
	@Transactional
	public void addActionByTel(String tel, String action){
		
		dao.addActionByTel(tel, action);
	}
	
	@Transactional
	public Long getIdLeadByTel(String tel){
		
		return dao.getIdLeadByTel(tel);
	}
	
	@Transactional
	public void addIntMetric(String key, Long value, boolean increment){
		
		 dao.addIntMetric(key, value, increment);
	
	}
	
	@Transactional
	public  Lead getBasicInfoLeadById(long id){
		
		return dao.getBasicInfoLeadById(id);
	}

	@Override
	@Transactional
	public Lead addOrUpdate(Lead lead) {

		if(lead.getIdFilial()==0)
			lead.setIdFilial(1);

		if(lead.getTransientAction()!=null){

			if(lead.getActions()==null)
				lead.setActions("");

			lead.setActions(lead.getActions()+", "+lead.getTransientAction());
		}
		

		lead.setLastUpdate(new Date());
		dao.addOrUpdate(lead);


		if(lead.getSavedInForm()!=null && lead.getSavedInForm().equals("1")){
			//Envia email de cadastro de novo usuário
			//new SendEmail().enviaEmailCadastroLead(lead);
			
			//Envia email para o usuário
			if(lead.getEmail()!=null){
				
				new SendEmail().enviaEmailCadastroUsuario(lead);
				
			}
			//Envia sms para o usuário
			try {
				//SmsAPI.sendSimple(SMSUtil.getMensagemCadastroLead(lead.getNome(), lead.getTelefone()), lead.getTelefone());
			} catch (Exception e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
		
	
		return lead; 

	}

}
