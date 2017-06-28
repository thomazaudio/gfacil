package usersystem;

import system.SystemUtil;

import com.fasterxml.jackson.annotation.JsonView;

public class CardDesc {
	
	@JsonView(util.Views.Public.class)
    private String cardDesc;
	
	public CardDesc(){
		
		
	}

	public String getCardDesc() {
		return cardDesc;
	}

	public void setCardDesc(String cardDesc) {
		this.cardDesc = cardDesc;
		
	}
	
	public String getNome(){
		
		return dataReplace("Nome:",'\n');
	}
	
	public String getTelefone(){
		
		return new  SystemUtil().convertTelToPadrao(dataReplace("Telefone:",'\n'));
	}
	
	
    public String getEmail(){
		
		return dataReplace("Email:",'\n');
	}
    
    public String getFormaContato(){
    	
    	return dataReplace("Forma de contato:",'\n');
    }
    
     public String getEndereco(){
    	
    	return dataReplace("Endereço:",'\n');
    }
    
    
     public String getLogin(){
    	 
    	 
    	 String login = dataReplace("Login:",'\n');
		 
    	 if(login==null || login.length()==0)
    		 login = new SystemUtil().convertTelToPadrao( dataReplace("Telefone:",'\n'));
    	 
		return login;
	}
    
    public String getProdutosComercializados(){
		
		return dataReplace("Produtos comercializados:",']');
	}
	
	private String dataReplace(String data,char delimitador){
		
		if(cardDesc.indexOf(data)==-1)
			return "";
		
		
		int pos = cardDesc.indexOf(data)+data.length();
		
		char[] cs = cardDesc.toCharArray();
		
		//Valor a ser retornado
		String value = "";
		
		while(pos < cs.length && cs[pos] !=delimitador){
			value+=cs[pos];
			pos++;
		}
		
		value=value.trim();
		
		return value;
	}

}
