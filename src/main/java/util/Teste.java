package util;

import org.apache.http.util.EntityUtils;
import org.json.JSONObject;

public class Teste {

	public static void main(String[] args) {

		String json_string = "{usuario:{nome:'Thomaz'}}";
		JSONObject jsonRes = new JSONObject(json_string);
		
		System.out.println("Id do contato: "+jsonRes.getJSONObject("usuario").get("nome"));
		
		
		

	}


	
}
