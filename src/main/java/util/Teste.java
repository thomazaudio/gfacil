package util;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.apache.http.util.EntityUtils;
import org.json.JSONObject;

import cliente.Cliente;

public class Teste {


	public static void main(String[] args){
		
		String tel = "3134969358";
		//System.out.println(tel.toCharArray()[2]);
		
		if(tel.length()==10){
			 tel  = new StringBuffer(tel).insert(2, "9").toString();
		}
		
		
		
	montar();
		
		
		
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
				            	
				            	
				            	
				            
				            	System.out.println(t+";"+nome);
	            	}   	
	            	
	            	if(i==300){
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
