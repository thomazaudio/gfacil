package util;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonView;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class AjaxResponse<E> {
	
	public static final String COD_ERRO="500";
	public static final String COD_OK="200";
	
	public AjaxResponse(){
		
	}
	
	public AjaxResponse(List<E> itens){
		
		this.setItens(itens);
	}
	
	public AjaxResponse(E item){
		
		this.setItem(item);
		
	}

	@JsonView(util.Views.Public.class)
	String cod;
	
	@JsonView(util.Views.Public.class)
	E item;
	
	@JsonView(util.Views.Public.class)
	List<E> itens;
	
	//Quantidade total de itens sem levar em consideração a paginação
	@JsonView(util.Views.Public.class)
	Long countAll;
				
}
