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

import produto.Produto;
import transactional.SendEmail;
import cliente.Cliente;
import database.DataBaseUtil;

public class Teste {


	public static void main(String[] args){
		
		
		
		String query = DataBaseUtil.getInlineCrudQueries(Produto.class);
		
		System.out.println("Query: "+query);
		
		//montar();
		
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
				            	
				            	System.out.println("ceasa_mg -  "+nome+",,,,,,,,,,,,,,,,,,,,,,,,,,"+"* My Contacts,,,,,Mobile,"+t);
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
