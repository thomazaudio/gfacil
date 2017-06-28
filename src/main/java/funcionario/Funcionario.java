package funcionario;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;


import com.fasterxml.jackson.annotation.JsonView;
import util.Pessoa;


@Entity
@DiscriminatorValue("funcionario")
public class Funcionario extends Pessoa {
	
	@Temporal(TemporalType.DATE)
	@JsonView(util.Views.Public.class)
	private Date dataAdmissao = new Date();
	
	public Date getDataAdmissao() {
		return dataAdmissao;
	}

	public void setDataAdmissao(String data) {
		
		String formatHora="";
		
		if(data.length()>10)
			formatHora="HH:mm:ss";
		
		SimpleDateFormat format = new SimpleDateFormat("dd/MM/yyyy"+formatHora);
	 
		try {
			
			dataAdmissao = format.parse(data);
			
			System.out.print(dataAdmissao);
		} catch (ParseException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		
	}

	
	
	

}
