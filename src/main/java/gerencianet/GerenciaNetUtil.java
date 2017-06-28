package gerencianet;

import java.util.HashMap;

import br.com.gerencianet.gnsdk.Gerencianet;

public class GerenciaNetUtil {

	private static Gerencianet gn = null;
	
	public static Gerencianet getGN(){
		
		if(gn==null){
			
			HashMap<String, Object> options = new HashMap<String, Object>();
			options.put("client_id", "Client_Id_34036d15152f2868c9158641a8d20769377f507d");
			options.put("client_secret", "Client_Secret_044e17269cf8ff18f7255cbe7b0bf43a3ec1f57c");
			options.put("sandbox", true);
			try {
				gn = new Gerencianet(options);
			} catch (Exception e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
		
		return gn;
	}
}
