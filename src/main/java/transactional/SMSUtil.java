package transactional;

public class SMSUtil {

	
	public  static String getMensagemCadastroLead(String nome, String telefone){
		
		String msg =  "Oi LEAD_NOME! Já fiz seu cadastro no CeasaPlus, é só você acessar https://www.ceasaplus.com.br/#/login/LEAD_TELEFONE";
		msg = msg.replace("LEAD_NOME", nome);
		msg = msg.replace("LEAD_TELEFONE", telefone);
		return msg;
		
	}
}
