package transactional;

public class SMSUtil {

	
	public  static String getMensagemCadastroLead(String nome, String telefone){
		
		
		String msg =  "Oi LEAD_NOME! Ja fizemos seu cadastro no CeasaPlus, acesse https://www.ceasaplus.com.br/#/login/LEAD_TELEFONE";
		msg = msg.replace("LEAD_NOME", nome.split(" ")[0]);
		msg = msg.replace("LEAD_TELEFONE", telefone);
		return msg;
		
	}
}
