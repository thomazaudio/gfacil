package gerencianet;

import org.json.JSONObject;

import br.com.gerencianet.gnsdk.Gerencianet;

public class Teste {
      
	
	public static void main(String args[]){
		 
		JSONObject options = new JSONObject();
		options.put("client_id", "Client_Id_34036d15152f2868c9158641a8d20769377f507d");
		options.put("client_secret", "Client_Secret_044e17269cf8ff18f7255cbe7b0bf43a3ec1f57c");
		options.put("sandbox", true);

		try {
			Gerencianet gn = new Gerencianet(options);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
}
