package transactional;
import java.io.BufferedReader;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.UnsupportedEncodingException;
import java.util.Properties;

import javax.mail.*;
import javax.mail.internet.*;

import org.springframework.core.io.ClassPathResource;

import eventousuario.EventoUsuario;
import funilceasa.FunilCeasa;


public class SendEmail {

    static final String FROM = "thomazrd@ceasaplus.com.br";  
    static final String SMTP_USERNAME = "thomazrd@ceasaplus.com.br";  
    static final String SMTP_PASSWORD = "leghacy123";  
    static final String HOST = "smtp.zoho.com";    
    
    static final int PORT = 587;
    
    
    
public void enviaEmailEvent(EventoUsuario evt){
    	
    	 String emailBuilder =  new SendEmail().getTemplate("eventoUsuario").toString();
    	 
    	 if(evt.getLogin()==null)
    		 evt.setLogin("");
    	 
    	 if(evt.getDescricao()==null)
    		 evt.setDescricao("");
    	 
    	 if(evt.getEvento()==null)
    		 evt.setEvento("");
    	 
    	 if(evt.getDescricao_2()==null)
    		 evt.setDescricao_2("");
    	 
         
         emailBuilder= emailBuilder.replaceAll("LOGIN_USUARIO",evt.getLogin());
         emailBuilder =  emailBuilder.replaceAll("DESCRICAO_ERRO", evt.getDescricao());
         emailBuilder =  emailBuilder.replaceAll("EVENTO_ERRO", evt.getEvento());
         emailBuilder =  emailBuilder.replaceAll("DESCRICAO_2", evt.getDescricao_2());
         
        try {
			sendMail("thomaz@ceasaplus.com.br","Evento "+evt.getEvento()+" - "+evt.getLogin( ),emailBuilder);
		} catch (AddressException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (MessagingException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
    }
    
    public void enviaEmailCadastroUsuario(FunilCeasa funil){
    	
    	//Verfiica se o endereço do remetente é válido
    	if(funil.getEmail()==null || !funil.getEmail().contains("@")){
    		return;
    	}
    	
    	 String emailBuilder =  new SendEmail().getTemplate("cadastroUsuario").toString();
         
         emailBuilder= emailBuilder.replaceAll("LOGIN_USUARIO",funil.getTelefone());
         emailBuilder =  emailBuilder.replaceAll("NOME_USUARIO",funil.getNome().split(" ")[0]);
         
        try {
			sendMail(funil.getEmail(),"Dados para acesso ao Ceasa Plus",emailBuilder);
		} catch (AddressException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (MessagingException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
    }

    public static void main(String[] args) throws Exception {

    	
       String emailBuilder =  new SendEmail().getTemplate("cadastroUsuario").toString();
         
         emailBuilder= emailBuilder.replaceAll("LOGIN_USUARIO","3192267947");
         emailBuilder =  emailBuilder.replaceAll("NOME_USUARIO","Thomaz Damasceno");
         
       
		new SendEmail().sendMail("thomaz-guitar@hotmail.com","Dados para acesso ao Ceasa Pluss",emailBuilder);
    	

    	/*
   
    	Properties props = System.getProperties();
    	props.put("mail.transport.protocol", "smtps");
    	props.put("mail.smtp.port", PORT); 
    	props.put("mail.smtp.starttls.enable", "true");
    	props.put("mail.smtp.starttls.required", "true");

        // Create a Session object to represent a mail session with the specified properties. 
    	Session session = Session.getDefaultInstance(props);

        // Create a message with the specified information. 
        MimeMessage msg = new MimeMessage(session);
        msg.setFrom(new InternetAddress(FROM));
        msg.setRecipient(Message.RecipientType.TO, new InternetAddress(TO));
        msg.setSubject(SUBJECT);
        msg.setContent(BODY,"text/plain");
            
        // Create a transport.        
        Transport transport = session.getTransport();
                    
        // Send the message.
        try
        {
            System.out.println("Attempting to send an email through the Amazon SES SMTP interface...");
            
            // Connect to Amazon SES using the SMTP username and password you specified above.
            transport.connect(HOST, SMTP_USERNAME, SMTP_PASSWORD);
        	
            // Send the email.
            transport.sendMessage(msg, msg.getAllRecipients());
            System.out.println("Email sent!");
        }
        catch (Exception ex) {
            System.out.println("The email was not sent.");
            System.out.println("Error message: " + ex.getMessage());
        }
        finally
        {
            // Close and terminate the connection.
            transport.close();        	
        }
        */
    }
    
    public void sendMail(String to, String subject, String content ) throws AddressException, MessagingException{
    	
    	
    	System.out.println("Conteudo do email: ");
    	System.out.println(content);
    	
    	   
    	Properties props = System.getProperties();
    	props.put("mail.transport.protocol", "smtps");
    	props.put("mail.smtp.port", PORT); 
    	props.put("mail.smtp.starttls.enable", "true");
    	props.put("mail.smtp.starttls.required", "true");

        // Create a Session object to represent a mail session with the specified properties. 
    	Session session = Session.getDefaultInstance(props);

        // Create a message with the specified information. 
        MimeMessage msg = new MimeMessage(session);
        InternetAddress address =  new InternetAddress(FROM);
        try {
			address.setPersonal("Thomaz - Ceasa Plus","UTF-8");
		} catch (UnsupportedEncodingException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
        msg.setFrom( address);
        msg.setRecipient(Message.RecipientType.TO, new InternetAddress(to));
        msg.setSubject(subject);
        msg.setContent(content,"text/html;charset=UTF-8");
        
            
        // Create a transport.        
        Transport transport = session.getTransport();
                    
        // Send the message.
        try
        {
            System.out.println("Attempting to send an email through the Amazon SES SMTP interface...");
            
            // Connect to Amazon SES using the SMTP username and password you specified above.
            transport.connect(HOST, SMTP_USERNAME, SMTP_PASSWORD);
        	
            // Send the email.
            transport.sendMessage(msg, msg.getAllRecipients());
            System.out.println("Email sent!");
        }
        catch (Exception ex) {
            System.out.println("The email was not sent.");
            System.out.println("Error message: " + ex.getMessage());
        }
        finally
        {
            // Close and terminate the connection.
            transport.close();        	
        }
        
    }
    
    public  StringBuilder getTemplate (String nomeArquivo){
    	
    	StringBuilder builder = new 	StringBuilder();
    	
    	//Header
    	builder.append(lerArquivo("header"));
    	
    	//Template
    	builder.append(lerArquivo(nomeArquivo));
    	
    	//Assinatura de email
    	builder.append(lerArquivo("assinatura"));
    	
    	return builder;
    	
    }
    
    public  StringBuilder lerArquivo(String nomeArquivo){
    	
    	StringBuilder builder = new 	StringBuilder();
    	
    	
    
        try{
           BufferedReader br = new BufferedReader(new InputStreamReader(new FileInputStream(new ClassPathResource("email-templates/"+nomeArquivo).getFile()), "UTF-8"));
           while(br.ready()){
              String linha = br.readLine();
              builder.append(linha);
           }
           br.close();
        }catch(IOException ioe){
           ioe.printStackTrace();
        }
        
        return builder;
     }
}