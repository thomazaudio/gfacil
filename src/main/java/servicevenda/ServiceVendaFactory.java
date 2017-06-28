package servicevenda;
import pdv.Pdv;

public class ServiceVendaFactory {

	
	public  static Object getInstance(String tipo){
	
	 if(tipo.equals("pdv"))
			return new Pdv();
		else return null;
		
	}
	
	
}
