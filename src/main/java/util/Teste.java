package util;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import lead.Lead;

import org.apache.http.util.EntityUtils;
import org.json.JSONObject;

import transactional.SendEmail;
import cliente.Cliente;

public class Teste {


	public static void main(String[] args){
		
		Lead l  = new Lead();
		l.setNome("Thomaz");
		l.setTelefone("31992267947");
		l.setEmail("thomaz-guitar@hotmail.com");
		
		new SendEmail().enviaEmailCadastroUsuario(l);
		
	}
	
	public static void montar(){
		
Connection con = database.DataBaseUtil.getConnection();
		
		try {
			 
			PreparedStatement stm = con.prepareStatement("select * from contatos_ceasa");
			stm.execute("use db_shared");
			
			ResultSet res = stm.executeQuery();
			 int i =0;
			while(res.next()){
				
				String nome = res.getString("nome");
	            String telefone = res.getString("telefone");
				long id = res.getLong("id");
				
	            telefone  = telefone.replace("(","");
	            telefone  = telefone.replace(")","");
	            telefone  = telefone.replace("-","");
	            
	            String telefones[] = telefone.split(" ");
	            
	           
	            
	            for(String t:  telefones){
	            	
	            	char posFirst = t.toCharArray()[2];
	            	
	            	if(posFirst!='2' && posFirst!='3' && posFirst!='2' && posFirst!='4' && posFirst!='5'){
	            		
	            	
				            	if(t.length()==10){
				            		 t  = new StringBuffer(t).insert(2, "9").toString();
				            	}
				            	
				            	
				            	
				            
				            	System.out.println(t+";"+id);
	            	}   	
	            	
	            	if(i==150){
	            		i=0;
	            		System.out.println();
	            		System.out.println("=============================================================");
	            		System.out.println("=============================================================");
	            		System.out.println("=============================================================");
	            		System.out.println();
	            	}
	            	
	            	i++;
	            	
	            }
	            
			}
			
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		
	}

	
}
