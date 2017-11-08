package transactional;
import javax.mail.MessagingException;
import javax.mail.internet.AddressException;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.fasterxml.jackson.annotation.JsonView;

@Controller
public class TransactionController {

	@JsonView(util.Views.Public.class)
	@ResponseBody
	@RequestMapping(value="/send-email", method=RequestMethod.GET)
	public boolean sendEmail(@RequestParam String assunto, @RequestParam String destinatario, @RequestParam String content){

		try {
			new SendEmail().sendMail(destinatario,assunto,content);
			return true;
		} catch (AddressException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			return false;
		} catch (MessagingException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			return false;
		}

	}
	
	@JsonView(util.Views.Public.class)
	@ResponseBody
	@RequestMapping(value="/send-sms", method=RequestMethod.GET)
	public boolean sendSms(@RequestParam String mensagem, @RequestParam String numero){

		try {
			SmsAPI.sendSimple(mensagem,numero);
			return true;
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			return false;
		}
	}


}
