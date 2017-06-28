package relatorio;
import com.fasterxml.jackson.annotation.JsonView;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class CustomReport {
	
	@JsonView(util.Views.Public.class)
	private String qs;
	
	@JsonView(util.Views.Public.class)
	private String periodColumn;
	
	@JsonView(util.Views.Public.class)
	private String labelColumn;
	
	@JsonView(util.Views.Public.class)
	private String valueColumn;
	
	@JsonView(util.Views.Public.class)
	private String objeto;
	

	
}
