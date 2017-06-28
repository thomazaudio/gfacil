package relatorio;


import java.util.ArrayList;

import com.fasterxml.jackson.annotation.JsonView;

import lombok.Getter;
import lombok.Setter;

@Setter @Getter
public class ProjecaoRequest {
    
	@JsonView(util.Views.Public.class)
    private String objeto;
	
	@JsonView(util.Views.Public.class)
    private ArrayList<String> qs; 
	
	@JsonView(util.Views.Public.class)
    private String extra;
	
	@JsonView(util.Views.Public.class)
    private String columns;
	
	@JsonView(util.Views.Public.class)
    private String groupBy;
	
	@JsonView(util.Views.Public.class)
    private int max;
	
	
	
}
