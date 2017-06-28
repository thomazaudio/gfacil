package system;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileWriter;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.UnsupportedEncodingException;
import org.springframework.security.core.context.SecurityContextHolder;
import security.AccountUserDetails;

public class SystemUtil {
	
	
	//Recebe "Produto" retorna produto.Produto
	public static Class getClass(String objeto){
		
		try {
			return   Class.forName(objeto.toLowerCase()+"."+objeto);
		} catch (ClassNotFoundException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return null;
	}
	
	
	//Recupera pasta base do usuário logado no sistema
	//O path é composto pela base path + nome do banco de dados do usuário em sessão
	public  static String getBaseDirCurrentUser(){
		
		//TODO diretório base da empresa no sistema logada
		String base = System.getProperty("GFACIL_DIR");
		
		if(base==null)
			base = "C:\\gfacil\\";
		
		base+=	 getCurrentUserDetails().getDataBase()+"\\";
		
		return base;
	}

	public static StringBuilder readFile(String caminhoArquivo){

		StringBuilder xml = new StringBuilder();  
		String linha = null;  
		BufferedReader in = null;
		try {
			in = new BufferedReader(new InputStreamReader(  
					new FileInputStream(caminhoArquivo), "ISO-8859-1"));
		} catch (UnsupportedEncodingException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (FileNotFoundException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}  
		try {
			while ((linha = in.readLine()) != null) {  
				xml.append(linha);  
			}
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}  
		try {
			in.close();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}  

		return xml;
	}


	public boolean saveFile(String content, String path){

		FileWriter arquivo;  
		try   
		{    
			File file = new File(path);
			if(file.getParentFile()!=null)
			  file.getParentFile().mkdirs();
			arquivo = new FileWriter(new File(path));    
			arquivo.write(content);    
			arquivo.close();  
			return true;
		}   
		catch (IOException e)   
		{    
			System.out.println(e);  
			return false;
		}  
	}





	public static AccountUserDetails getCurrentUserDetails(){


		if(SecurityContextHolder.getContext()!=null && SecurityContextHolder.getContext().getAuthentication()!=null){
			return (AccountUserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		}
		return null;
	}
	
	
	

	public String convertTelToPadrao(  String tel ){



		tel = tel.replace("(","");
		tel = tel.replace(")","");
		tel = tel.replace("-","");
		tel = tel.replace(" ","");
		tel = tel.trim();

		StringBuffer sb = new StringBuffer(tel);

		//Remove o zero inicial
		if(sb.charAt(0)=='0')
			sb.deleteCharAt(0);

		//Transforma para o padrão de 11 dígitos 
		if(sb.length()<11){
			sb.insert(2,'9');
		}


		return sb.toString();
	}

}
