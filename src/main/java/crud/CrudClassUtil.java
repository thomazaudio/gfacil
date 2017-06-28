package crud;

import java.text.SimpleDateFormat;
import java.util.Date;


public class CrudClassUtil {

	
	//Retorna a descrição para armazena em CrudClass.historicoOperador a cada addOrUpdate
	public static String getDescricaoOperacaoOperador(CrudClass objeto, String nomeOperador){
		
		String data = new SimpleDateFormat("dd/MM/yyyy").format(new Date());
		String horario= new SimpleDateFormat("HH:mm:ss").format(new Date());
		String descricao = "";
		
		if(objeto.getId()==0)
			descricao="Criado em";
		
		else
			descricao = "Editado em";
		
		descricao+=" "+data+" as "+horario;
		
		descricao+=" por '"+nomeOperador+"'";
		
		return descricao;
		
	}
}
