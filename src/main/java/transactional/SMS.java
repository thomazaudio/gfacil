package transactional;

import com.fasterxml.jackson.annotation.JsonView;

import funilceasa.FunilCeasa;

public class SMS {

	@JsonView(util.Views.Public.class)
	private String numero;
	
	@JsonView(util.Views.Public.class)
	private String mensagem;
	
	public String getNumero() {
		return numero;
	}
	public void setNumero(String numero) {
		this.numero = numero;
	}
	public String getMensagem() {
		return mensagem;
	}
	public void setMensagem(String mensagem) {
		this.mensagem = mensagem;
	}
	
	 public void enviaSMSUsoGratuito(FunilCeasa user){
			
			String mensagem1="Olá, meu nome é Thomaz, peguei seu contato no catálogo de produtores do Ceasa MG.";
			String mensagem2="Eu desenvolvi uma ferramenta para auxiliar produtores e comerciantes no controle de estoque, vendas, fiados, despesas e gestão de vale-caixas.";
			String mensagem3="Estou procurando mais 10 pessoas para testar o aplicativo de maneira 100% gratuita, você tem interesse?";
			String mensagem4="Para testar é só você clicar em www.ceasaplus.com.br/#/usuario/"+user.getLogin();
			sendSMS(user.getTelefone(),mensagem1);
			sendSMS(user.getTelefone(),mensagem2);
			sendSMS(user.getTelefone(),mensagem3);
			sendSMS(user.getTelefone(),mensagem4);


		}
		
	
	
    public void enviaSMSApresentacaoSistema(FunilCeasa user){
		
		String mensagem1="Tudo bem "+user.getNome().split(" ")[0]+"? Meu nome é Thomaz, peguei seu número no catálogo de produtores do ceasa. ";
		String mensagem2="Quero te mostrar o Ceasa Plus, um sistema que eu desenvolvi para controlar Estoque, Vendas, Fiados, empréstimo de caixas plásticas, entre outros.";
		String mensagem3="Para testar é só você clicar em www.ceasaplus.com.br/#/usuario/"+user.getLogin();
		String mensagem4="Um grande abraço "+user.getNome().split(" ")[0]+"!";

		sendSMS(user.getTelefone(),mensagem1);
		sendSMS(user.getTelefone(),mensagem2);
		sendSMS(user.getTelefone(),mensagem3);
		sendSMS(user.getTelefone(),mensagem4);

	}
	
	
	public void enviaSMSCadastroUsuario(FunilCeasa user){
		
		String mensagemCadastro="Tudo bem "+user.getNome().split(" ")[0]+"? Já fiz o seu cadastro no Ceasa Plus. ";
		mensagemCadastro+="é só você acessar www.ceasaplus.com.br/#/usuario/"+user.getTelefone();
		
		sendSMS(user.getTelefone(),mensagemCadastro);
	}
	
	
   public void enviaSMSUsuarioNaoInteressou(FunilCeasa user){
		
		String mensagem=user.getNome().split(" ")[0]+", caso queira ver como o sistema funciona, acesse www.ceasaplus.com.br/#/usuario/"+user.getTelefone();
		
		sendSMS(user.getTelefone(),mensagem);
	}
	
	public void sendSMS(String numero, String mensagem){
		
		System.out.println("SMS enviado: ");
		System.out.println(mensagem);
		
		SMS sms = new SMS();
		sms.setNumero(numero);
		sms.setMensagem(mensagem);
		SMSCache.cacheSms.add(sms);
	}
	
	
}
