package nfe;
import com.fasterxml.jackson.annotation.JsonView;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class NFeErro {
    
	@JsonView(util.Views.Public.class)
    private String descricao;//Descrição do erro
	
	@JsonView(util.Views.Public.class)
	private String campo;//Nome do campo que ocorreu o erro
	
	public NFeErro(String descricao, String campo){
		
		this.descricao = descricao;
		this.campo = campo;
	}
	
}
